import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { SECTION_TYPE_META } from '../../../../lib/utils/sectionDefaults';
import { getSampleSectionItem } from '../../../../lib/utils/sampleData';
import { logger } from '../../../../lib/utils/logger';
import type {
  Resume,
  ResumeSection,
  SectionItem,
  SectionItemData,
  SectionType,
  TemplateId,
} from '../../../../lib/types/resume';
import { sectionItemDataSchema } from '../../../../lib/validations/resumeSchema';

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

const createResumeSchema = z.object({
  title: z.string().trim().min(1).optional(),
});

const defaultSectionOrder: SectionType[] = [
  'personal_info',
  'experience',
  'education',
  'skills',
  'projects',
];

const jsonError = (message: string, status: number): NextResponse =>
  NextResponse.json({ error: message }, { status });

const getAuthenticatedUser = async (
  supabase: Awaited<ReturnType<typeof createClient>>
): Promise<{ id: string; email: string | undefined } | null> => {
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return null;
  }

  return {
    id: data.user.id,
    email: data.user.email ?? undefined,
  };
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

  const mappedSections: ResumeSection[] = sections.map((section): ResumeSection => {
    const sectionItems = itemsBySectionId.get(section.id) ?? [];

    const mappedItems: SectionItem[] = sectionItems.map((item) => {
      const parsedData = sectionItemDataSchema.safeParse(item.data);
      const itemData =
        parsedData.success && parsedData.data.type === section.type
          ? parsedData.data
          : getSampleSectionItem(section.type);

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

const loadResumeList = async (
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string
): Promise<Resume[]> => {
  const { data: resumeRows, error: resumesError } = await supabase
    .from('resumes')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (resumesError) {
    throw new Error(resumesError.message);
  }

  const typedResumes = (resumeRows ?? []) as ResumeRow[];
  if (typedResumes.length === 0) return [];

  const resumeIds = typedResumes.map((resume) => resume.id);

  const { data: sectionRows, error: sectionsError } = await supabase
    .from('resume_sections')
    .select('*')
    .in('resume_id', resumeIds)
    .order('position', { ascending: true });

  if (sectionsError) {
    throw new Error(sectionsError.message);
  }

  const typedSections = (sectionRows ?? []) as ResumeSectionRow[];
  const sectionIds = typedSections.map((section) => section.id);

  const { data: itemRows, error: itemsError } =
    sectionIds.length > 0
      ? await supabase
          .from('section_items')
          .select('*')
          .in('section_id', sectionIds)
          .order('position', { ascending: true })
      : { data: [], error: null };

  if (itemsError) {
    throw new Error(itemsError.message);
  }

  const typedItems = (itemRows ?? []) as SectionItemRow[];

  return typedResumes.map((resume) =>
    mapResume(
      resume,
      typedSections.filter((section) => section.resume_id === resume.id),
      typedItems.filter((item) =>
        typedSections.some((section) => section.id === item.section_id && section.resume_id === resume.id)
      )
    )
  );
};

const createDefaultResumeStructure = async (
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  title?: string
): Promise<Resume> => {
  const insertPayload = {
    user_id: userId,
    title: title || 'Untitled Resume',
    template_id: 'modern' as const,
  };

  const { data: createdResume, error: resumeInsertError } = await supabase
    .from('resumes')
    .insert(insertPayload)
    .select('*')
    .single();

  if (resumeInsertError || !createdResume) {
    throw new Error(resumeInsertError?.message ?? 'Failed to create resume');
  }

  try {
    for (const [position, type] of defaultSectionOrder.entries()) {
      const sectionId = crypto.randomUUID();
      const itemId = crypto.randomUUID();
      const timestamp = new Date().toISOString();
      const itemData = getSampleSectionItem(type);

      const sectionInsert = {
        id: sectionId,
        resume_id: createdResume.id,
        type,
        title: SECTION_TYPE_META[type].label,
        position,
        is_visible: true,
      };

      const { error: sectionInsertError } = await supabase
        .from('resume_sections')
        .insert(sectionInsert);

      if (sectionInsertError) {
        throw new Error(sectionInsertError.message);
      }

      const { error: itemInsertError } = await supabase
        .from('section_items')
        .insert({
          id: itemId,
          section_id: sectionId,
          position: 0,
          data: itemData,
          created_at: timestamp,
          updated_at: timestamp,
        });

      if (itemInsertError) {
        throw new Error(itemInsertError.message);
      }
    }
  } catch (error) {
    logger.error('Failed to build default resume structure', error);
    await supabase.from('resumes').delete().eq('id', createdResume.id).eq('user_id', userId);
    throw error;
  }

  // Load the full structure to return
  const { data: sections } = await supabase
    .from('resume_sections')
    .select('*')
    .eq('resume_id', createdResume.id)
    .order('position', { ascending: true });
  
  const sectionRows = (sections ?? []) as ResumeSectionRow[];
  const sectionIds = sectionRows.map(s => s.id);
  
  const { data: items } = await supabase
    .from('section_items')
    .select('*')
    .in('section_id', sectionIds);

  return mapResume(
    createdResume as ResumeRow,
    sectionRows,
    (items ?? []) as SectionItemRow[]
  );
};

export async function GET(): Promise<NextResponse> {
  try {
    const supabase = await createClient();
    const user = await getAuthenticatedUser(supabase);

    if (!user) {
      return jsonError('Unauthorized', 401);
    }

    const typedResumes = await loadResumeList(supabase, user.id);

    return NextResponse.json(typedResumes);
  } catch (error: unknown) {
    logger.error('Failed to list resumes', error);
    const message = error instanceof Error ? error.message : 'Failed to fetch resumes';
    return jsonError(message, 500);
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const supabase = await createClient();
    const user = await getAuthenticatedUser(supabase);

    if (!user) {
      return jsonError('Unauthorized', 401);
    }

    const payload: unknown = await request.json();
    const parsed = createResumeSchema.safeParse(payload);

    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? 'Invalid request body', 400);
    }

    const createdResume = await createDefaultResumeStructure(
      supabase,
      user.id,
      parsed.data.title
    );

    return NextResponse.json(createdResume, { status: 201 });
  } catch (error: unknown) {
    logger.error('Failed to create resume', error);
    const message = error instanceof Error ? error.message : 'Failed to create resume';
    return jsonError(message, 500);
  }
}
