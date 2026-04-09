import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { logger } from '../../../../../lib/utils/logger';
import { getDefaultSectionItem } from '../../../../../lib/utils/sectionDefaults';
import { sectionItemDataSchema } from '../../../../../lib/validations/resumeSchema';
import type {
  Resume,
  ResumeSection,
  SectionItem,
  SectionItemData,
  SectionType,
  TemplateId,
} from '../../../../../lib/types/resume';

type ResumeRow = {
  id: string;
  user_id: string;
  title: string;
  template_id: TemplateId;
  is_public: boolean;
  last_edited_at: string | null;
  created_at: string;
  updated_at: string;
};

type ResumeSectionRow = {
  id: string;
  resume_id: string;
  type: SectionType;
  title: string;
  position: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
};

type SectionItemRow = {
  id: string;
  section_id: string;
  position: number;
  data: SectionItemData;
  created_at: string;
  updated_at: string;
};

const resumeIdSchema = z.string().uuid();

const updateResumeSchema = z
  .object({
    title: z.string().trim().min(1).optional(),
    templateId: z.enum(['modern', 'classic', 'minimal', 'creative', 'executive']).optional(),
    isPublic: z.boolean().optional(),
  })
  .refine(
    (value) => value.title !== undefined || value.templateId !== undefined || value.isPublic !== undefined,
    {
      message: 'At least one field must be provided',
    }
  );

const jsonError = (message: string, status: number): NextResponse =>
  NextResponse.json({ error: message }, { status });

const getAuthenticatedUser = async (
  supabase: Awaited<ReturnType<typeof createClient>>
): Promise<string | null> => {
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return null;
  }

  return data.user.id;
};

const mapResume = (
  resumeRow: ResumeRow,
  sections: ResumeSectionRow[],
  items: SectionItemRow[]
): Resume => {
  const itemsBySectionId = new Map<string, SectionItemRow[]>();

  items.forEach((item) => {
    const currentItems = itemsBySectionId.get(item.section_id) ?? [];
    currentItems.push(item);
    itemsBySectionId.set(item.section_id, currentItems);
  });

  const mappedSections = sections.map((section) => {
    const sectionItems = itemsBySectionId.get(section.id) ?? [];

    const mappedItems = sectionItems.map((item) => {
      const parsedData = sectionItemDataSchema.safeParse(item.data);
      const itemData =
        parsedData.success && parsedData.data.type === section.type
          ? parsedData.data
          : getDefaultSectionItem(section.type);

      return {
        id: item.id,
        sectionId: item.section_id,
        resumeId: section.resume_id,
        sortOrder: item.position,
        type: section.type,
        data: itemData as Extract<SectionItemData, { type: typeof section.type }>,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      } as SectionItem;
    });

    return {
      id: section.id,
      resumeId: section.resume_id,
      type: section.type,
      title: section.title,
      isVisible: section.is_visible,
      sortOrder: section.position,
      createdAt: section.created_at,
      updatedAt: section.updated_at,
      items: mappedItems as ResumeSection['items'],
    } as ResumeSection;
  });

  return {
    id: resumeRow.id,
    userId: resumeRow.user_id,
    title: resumeRow.title,
    templateId: resumeRow.template_id,
    sections: mappedSections,
    createdAt: resumeRow.created_at,
    updatedAt: resumeRow.updated_at,
  };
};

const loadOwnedResume = async (
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  resumeId: string
): Promise<Resume | null> => {
  const { data: resumeRow, error: resumeError } = await supabase
    .from('resumes')
    .select('*')
    .eq('id', resumeId)
    .eq('user_id', userId)
    .maybeSingle();

  if (resumeError) {
    throw new Error(resumeError.message);
  }

  if (!resumeRow) {
    return null;
  }

  const { data: sections, error: sectionsError } = await supabase
    .from('resume_sections')
    .select('*')
    .eq('resume_id', resumeId)
    .order('position', { ascending: true });

  if (sectionsError) {
    throw new Error(sectionsError.message);
  }

  const sectionRows = (sections ?? []) as ResumeSectionRow[];
  const sectionIds = sectionRows.map((section) => section.id);

  const itemsQuery = supabase
    .from('section_items')
    .select('*')
    .order('section_id', { ascending: true })
    .order('position', { ascending: true });

  const { data: items, error: itemsError } =
    sectionIds.length > 0 ? await itemsQuery.in('section_id', sectionIds) : { data: [], error: null };

  if (itemsError) {
    throw new Error(itemsError.message);
  }

  return mapResume(
    resumeRow as ResumeRow,
    sectionRows,
    (items ?? []) as SectionItemRow[]
  );
};

const loadOwnedResumeId = async (
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  resumeId: string
): Promise<string | null> => {
  const { data: resumeRow, error } = await supabase
    .from('resumes')
    .select('id')
    .eq('id', resumeId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return resumeRow?.id ?? null;
};

export async function GET(
  _request: NextRequest,
  context: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const resumeIdResult = resumeIdSchema.safeParse(context.params.id);

    if (!resumeIdResult.success) {
      return jsonError('Invalid resume id', 400);
    }

    const supabase = await createClient();
    const userId = await getAuthenticatedUser(supabase);

    if (!userId) {
      return jsonError('Unauthorized', 401);
    }

    const resume = await loadOwnedResume(supabase, userId, resumeIdResult.data);

    if (!resume) {
      return jsonError('Resume not found', 404);
    }

    return NextResponse.json(resume);
  } catch (error: unknown) {
    logger.error('Failed to load resume', error);
    const message = error instanceof Error ? error.message : 'Failed to load resume';
    return jsonError(message, 500);
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const resumeIdResult = resumeIdSchema.safeParse(context.params.id);

    if (!resumeIdResult.success) {
      return jsonError('Invalid resume id', 400);
    }

    const payload: unknown = await request.json();
    const parsed = updateResumeSchema.safeParse(payload);

    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? 'Invalid request body', 400);
    }

    const supabase = await createClient();
    const userId = await getAuthenticatedUser(supabase);

    if (!userId) {
      return jsonError('Unauthorized', 401);
    }

    const existingResume = await loadOwnedResume(supabase, userId, resumeIdResult.data);

    if (!existingResume) {
      return jsonError('Resume not found', 404);
    }

    const updatePayload: {
      title?: string;
      template_id?: TemplateId;
      is_public?: boolean;
      last_edited_at: string;
    } = {
      last_edited_at: new Date().toISOString(),
    };

    if (parsed.data.title !== undefined) {
      updatePayload.title = parsed.data.title;
    }

    if (parsed.data.templateId !== undefined) {
      updatePayload.template_id = parsed.data.templateId;
    }

    if (parsed.data.isPublic !== undefined) {
      updatePayload.is_public = parsed.data.isPublic;
    }

    const { error: updateError } = await supabase
      .from('resumes')
      .update(updatePayload)
      .eq('id', resumeIdResult.data)
      .eq('user_id', userId);

    if (updateError) {
      throw new Error(updateError.message);
    }

    const updatedResume = await loadOwnedResume(supabase, userId, resumeIdResult.data);

    if (!updatedResume) {
      return jsonError('Resume not found', 404);
    }

    return NextResponse.json(updatedResume);
  } catch (error: unknown) {
    logger.error('Failed to update resume', error);
    const message = error instanceof Error ? error.message : 'Failed to update resume';
    return jsonError(message, 500);
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const resumeIdResult = resumeIdSchema.safeParse(context.params.id);

    if (!resumeIdResult.success) {
      return jsonError('Invalid resume id', 400);
    }

    const supabase = await createClient();
    const userId = await getAuthenticatedUser(supabase);

    if (!userId) {
      return jsonError('Unauthorized', 401);
    }

    const ownedResumeId = await loadOwnedResumeId(supabase, userId, resumeIdResult.data);

    if (!ownedResumeId) {
      return jsonError('Resume not found', 404);
    }

    const { error: deleteError } = await supabase
      .from('resumes')
      .delete()
      .eq('id', ownedResumeId)
      .eq('user_id', userId);

    if (deleteError) {
      throw new Error(deleteError.message);
    }

    return new NextResponse(null, { status: 204 });
  } catch (error: unknown) {
    logger.error('Failed to delete resume', error);
    const message = error instanceof Error ? error.message : 'Failed to delete resume';
    return jsonError(message, 500);
  }
}