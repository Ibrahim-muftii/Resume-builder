import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BuilderPageClient from '@/components/builder/BuilderPageClient';
import { createClient } from '@/lib/supabase/server';
import { sectionItemDataSchema } from '../../../../../lib/validations/resumeSchema';
import { getDefaultSectionItem } from '../../../../../lib/utils/sectionDefaults';
import type { Resume, ResumeSection, SectionItem, SectionItemData, SectionType, TemplateId } from '../../../../../lib/types/resume';

type PageProps = {
  params: Promise<{ id: string }>;
};

type ResumeRow = {
  id: string;
  user_id: string;
  title: string;
  template_id: TemplateId;
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

const mapResume = (resumeRow: ResumeRow, sections: ResumeSectionRow[], items: SectionItemRow[]): Resume => {
  const itemsBySectionId = new Map<string, SectionItemRow[]>();

  items.forEach((item) => {
    const current = itemsBySectionId.get(item.section_id) ?? [];
    current.push(item);
    itemsBySectionId.set(item.section_id, current);
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

const fetchResumeById = async (id: string): Promise<Resume | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: resumeRow, error: resumeError } = await supabase
    .from('resumes')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle();

  if (resumeError || !resumeRow) {
    return null;
  }

  const { data: sections, error: sectionsError } = await supabase
    .from('resume_sections')
    .select('*')
    .eq('resume_id', id)
    .order('position', { ascending: true });

  if (sectionsError) {
    return null;
  }

  const sectionRows = (sections ?? []) as ResumeSectionRow[];
  const sectionIds = sectionRows.map((section) => section.id);

  if (sectionIds.length === 0) {
    return mapResume(resumeRow as ResumeRow, sectionRows, []);
  }

  const { data: items, error: itemsError } = await supabase
    .from('section_items')
    .select('*')
    .in('section_id', sectionIds)
    .order('section_id', { ascending: true })
    .order('position', { ascending: true });

  if (itemsError) {
    return null;
  }

  return mapResume(resumeRow as ResumeRow, sectionRows, (items ?? []) as SectionItemRow[]);
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const resume = await fetchResumeById(id);

  return {
    title: resume?.title ?? 'Resume Builder',
  };
}

export default async function ResumeBuilderPage({ params }: PageProps) {
  const { id } = await params;
  const resume = await fetchResumeById(id);

  if (!resume) {
    notFound();
  }

  return <BuilderPageClient initialResume={resume} />;
}
