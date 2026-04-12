import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { getDefaultSectionItem } from '../../../../../lib/utils/sectionDefaults';
import { resumeSchema } from '../../../../../lib/validations/resumeSchema';
import { sectionItemDataSchema } from '../../../../../lib/validations/resumeSchema';
import type {
  Resume,
  ResumeSection,
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
  settings: any;
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

type RouteParams = {
  params: Promise<{
    resumeId: string;
  }>;
};

const resumeIdSchema = z.string().uuid();

const jsonError = (message: string, status: number): NextResponse =>
  NextResponse.json({ error: message }, { status });

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

  const mappedSections: ResumeSection[] = sections.map((section) => {
    const sectionItems = itemsBySectionId.get(section.id) ?? [];

    // Workaround for DB constraint: Detect if this 'custom' section is actually 'key_achievements'
    const isKeyAchievements = section.type === 'custom' && (
      section.title === 'Key Achievements' ||
      sectionItems.some(item => (item.data as any)?.type === 'key_achievements')
    );

    const effectiveType = isKeyAchievements ? 'key_achievements' : section.type;

    return {
      id: section.id,
      resumeId: section.resume_id,
      type: effectiveType,
      title: section.title,
      isVisible: section.is_visible,
      sortOrder: section.position,
      createdAt: section.created_at,
      updatedAt: section.updated_at,
      items: sectionItems.map((item) => {
        const parsedData = sectionItemDataSchema.safeParse(item.data);
        const itemData =
          parsedData.success && parsedData.data.type === effectiveType
            ? parsedData.data
            : getDefaultSectionItem(effectiveType);

        return {
          id: item.id,
          sectionId: item.section_id,
          resumeId: section.resume_id,
          sortOrder: item.position,
          type: effectiveType,
          data: itemData,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
        };
      }) as ResumeSection['items'],
    } as ResumeSection;
  });

  return {
    id: resumeRow.id,
    userId: resumeRow.user_id,
    title: resumeRow.title,
    templateId: resumeRow.template_id,
    settings: resumeRow.settings || {
      fontSize: 'medium',
      fontFamily: 'Inter',
      primaryColor: '#000000',
      backgroundColor: '#ffffff',
    },
    sections: mappedSections,
    createdAt: resumeRow.created_at,
    updatedAt: resumeRow.updated_at,
  };
};

const loadResume = async (
  supabase: Awaited<ReturnType<typeof createClient>>,
  resumeId: string
): Promise<Resume | null> => {
  const { data: resumeRow, error: resumeError } = await supabase
    .from('resumes')
    .select('*')
    .eq('id', resumeId)
    .maybeSingle();

  if (resumeError) {
    throw new Error(resumeError.message);
  }

  if (!resumeRow) {
    return null;
  }

  const typedResumeRow = resumeRow as ResumeRow;

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

  const { data: items, error: itemsError } =
    sectionIds.length > 0
      ? await supabase
        .from('section_items')
        .select('*')
        .in('section_id', sectionIds)
        .order('position', { ascending: true })
      : { data: [], error: null as null };

  if (itemsError) {
    throw new Error(itemsError.message);
  }

  return mapResume(
    typedResumeRow,
    sectionRows,
    (items ?? []) as SectionItemRow[]
  );
};

export async function GET(
  _request: NextRequest,
  context: RouteParams
): Promise<NextResponse> {
  try {
    const params = await context.params;
    const resumeIdResult = resumeIdSchema.safeParse(params.resumeId);

    if (!resumeIdResult.success) {
      return jsonError('Invalid resume id', 400);
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return jsonError('Unauthorized', 401);
    }

    const resume = await loadResume(supabase, resumeIdResult.data);

    if (!resume) {
      return jsonError('Resume not found', 404);
    }

    if (resume.userId !== user.id) {
      return jsonError('Forbidden', 403);
    }

    return NextResponse.json({ resume });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load resume';
    return jsonError(message, 500);
  }
}

export async function PUT(
  request: NextRequest,
  context: RouteParams
): Promise<NextResponse> {
  try {
    const params = await context.params;
    const resumeIdResult = resumeIdSchema.safeParse(params.resumeId);

    if (!resumeIdResult.success) {
      return jsonError('Invalid resume id', 400);
    }

    let payload: any;
    try {
      payload = await request.json();
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      return jsonError('Invalid JSON payload or unsupported escape sequence', 400);
    }
    const parsedResume = resumeSchema.safeParse(payload);

    if (!parsedResume.success) {
      console.error('Resume validation failed:', parsedResume.error);
      return jsonError('Invalid resume payload', 400);
    }

    if (parsedResume.data.id !== resumeIdResult.data) {
      return jsonError('Resume id mismatch', 400);
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return jsonError('Unauthorized', 401);
    }

    if (parsedResume.data.userId !== user.id) {
      return jsonError('Forbidden', 403);
    }

    const now = new Date().toISOString();

    const { error: resumeUpdateError } = await supabase
      .from('resumes')
      .update({
        title: parsedResume.data.title,
        template_id: parsedResume.data.templateId,
        settings: parsedResume.data.settings,
        last_edited_at: now,
      })
      .eq('id', parsedResume.data.id)
      .eq('user_id', user.id);

    if (resumeUpdateError) {
      return jsonError(`Resume Update Error: ${resumeUpdateError.message}`, 500);
    }

    const { data: existingSections, error: existingSectionsError } = await supabase
      .from('resume_sections')
      .select('id')
      .eq('resume_id', parsedResume.data.id);

    if (existingSectionsError) {
      return jsonError(`Fetch Error: ${existingSectionsError.message}`, 500);
    }

    const sectionIds = parsedResume.data.sections.map((section) => section.id);
    const existingSectionIds = (existingSections ?? []).map((section) => section.id);
    const sectionIdsToDelete = existingSectionIds.filter(
      (sectionId) => !sectionIds.includes(sectionId)
    );

    const { data: existingItems, error: existingItemsError } =
      sectionIds.length > 0
        ? await supabase
          .from('section_items')
          .select('id')
          .in('section_id', sectionIds)
        : { data: [], error: null as null };

    if (existingItemsError) {
      return jsonError(`Fetch Items Error: ${existingItemsError.message}`, 500);
    }

    const itemIds = parsedResume.data.sections.flatMap((section) =>
      section.items.map((item) => item.id)
    );
    const existingItemIds = (existingItems ?? []).map((item) => item.id);
    const itemIdsToDelete = existingItemIds.filter((itemId) => !itemIds.includes(itemId));

    if (itemIdsToDelete.length > 0) {
      const { error: deleteItemsError } = await supabase
        .from('section_items')
        .delete()
        .in('id', itemIdsToDelete);

      if (deleteItemsError) {
        return jsonError(`Delete Items Error: ${deleteItemsError.message}`, 500);
      }
    }

    if (sectionIdsToDelete.length > 0) {
      const { error: deleteSectionsError } = await supabase
        .from('resume_sections')
        .delete()
        .in('id', sectionIdsToDelete);

      if (deleteSectionsError) {
        return jsonError(`Delete Sections Error: ${deleteSectionsError.message}`, 500);
      }
    }

    const sectionPayload = parsedResume.data.sections.map((section) => ({
      id: section.id,
      resume_id: parsedResume.data.id,
      type: section.type === 'key_achievements' ? 'custom' : section.type,
      title: section.title,
      position: section.sortOrder,
      is_visible: section.isVisible,
    }));

    if (sectionPayload.length > 0) {
      const { error: upsertSectionsError } = await supabase
        .from('resume_sections')
        .upsert(sectionPayload, { onConflict: 'id' });

      if (upsertSectionsError) {
        return jsonError(`Upsert Sections Error: ${upsertSectionsError.message}`, 500);
      }
    }

    const itemPayload = parsedResume.data.sections.flatMap((section) =>
      section.items.map((item) => ({
        id: item.id,
        section_id: section.id,
        position: item.sortOrder,
        data: item.data,
      }))
    );

    if (itemPayload.length > 0) {
      const { error: upsertItemsError } = await supabase
        .from('section_items')
        .upsert(itemPayload, { onConflict: 'id' });

      if (upsertItemsError) {
        return jsonError(`Upsert Items Error: ${upsertItemsError.message}`, 500);
      }
    }

    const refreshedResume = await loadResume(supabase, parsedResume.data.id);

    if (!refreshedResume) {
      return jsonError('Failed to reload resume', 500);
    }

    return NextResponse.json({ resume: refreshedResume });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected Error';
    return jsonError(message, 500);
  }
}

export async function PATCH(
  request: NextRequest,
  context: RouteParams
): Promise<NextResponse> {
  try {
    const params = await context.params;
    const resumeIdResult = resumeIdSchema.safeParse(params.resumeId);

    if (!resumeIdResult.success) {
      return jsonError('Invalid resume id', 400);
    }

    let payload: any;
    try {
      payload = await request.json();
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      return jsonError('Invalid JSON payload or unsupported escape sequence', 400);
    }
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return jsonError('Unauthorized', 401);
    }

    // Verify ownership
    const { data: resume, error: fetchError } = await supabase
      .from('resumes')
      .select('user_id')
      .eq('id', resumeIdResult.data)
      .maybeSingle();

    if (fetchError || !resume) {
      return jsonError('Resume not found', 404);
    }

    if (resume.user_id !== user.id) {
      return jsonError('Forbidden', 403);
    }

    const updatePayload: any = {};
    if ('title' in (payload as any)) updatePayload.title = (payload as any).title;
    if ('templateId' in (payload as any)) updatePayload.template_id = (payload as any).templateId;
    if ('isPublic' in (payload as any)) updatePayload.is_public = (payload as any).isPublic;

    const { error: updateError } = await supabase
      .from('resumes')
      .update({
        ...updatePayload,
        last_edited_at: new Date().toISOString(),
      })
      .eq('id', resumeIdResult.data);

    if (updateError) {
      throw new Error(updateError.message);
    }

    const updated = await loadResume(supabase, resumeIdResult.data);
    return NextResponse.json({ resume: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update resume';
    return jsonError(message, 500);
  }
}

export async function DELETE(
  _request: NextRequest,
  context: RouteParams
): Promise<NextResponse> {
  try {
    const params = await context.params;
    const resumeIdResult = resumeIdSchema.safeParse(params.resumeId);

    if (!resumeIdResult.success) {
      return jsonError('Invalid resume id', 400);
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return jsonError('Unauthorized', 401);
    }

    // Verify ownership before delete
    const { data: resume, error: fetchError } = await supabase
      .from('resumes')
      .select('user_id')
      .eq('id', resumeIdResult.data)
      .maybeSingle();

    if (fetchError || !resume) {
      return jsonError('Resume not found', 404);
    }

    if (resume.user_id !== user.id) {
      return jsonError('Forbidden', 403);
    }

    const { error: deleteError } = await supabase
      .from('resumes')
      .delete()
      .eq('id', resumeIdResult.data);

    if (deleteError) {
      throw new Error(deleteError.message);
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete resume';
    return jsonError(message, 500);
  }
}