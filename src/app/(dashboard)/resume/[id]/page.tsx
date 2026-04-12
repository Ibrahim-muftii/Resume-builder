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
  settings: any;
  created_at: string;
  updated_at: string;
};

type ResumeSectionRow = {
  id: string;
  resume_id: string;
  type: SectionType;
  title: string;
  sort_order?: number;
  position?: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
};

type SectionItemRow = {
  id: string;
  section_id: string;
  sort_order?: number;
  position?: number;
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
    
    const isKeyAchievements = section.type === 'custom' && (
      section.title === 'Key Achievements' || 
      sectionItems.some(item => (item.data as any)?.type === 'key_achievements')
    );
    
    const effectiveType = isKeyAchievements ? 'key_achievements' : section.type;

    const mappedItems = sectionItems.map((item) => {
      const dataToParse = {
        ...(item.data as any),
        type: effectiveType
      };
      const parsedData = sectionItemDataSchema.safeParse(dataToParse);
      const itemData = parsedData.success ? parsedData.data : getDefaultSectionItem(effectiveType);

      return {
        id: item.id,
        sectionId: item.section_id,
        resumeId: section.resume_id,
        sortOrder: item.sort_order ?? item.position ?? 0,
        type: effectiveType,
        data: itemData as Extract<SectionItemData, { type: SectionType }>,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      } as SectionItem;
    });

    return {
      id: section.id,
      resumeId: section.resume_id,
      type: effectiveType,
      title: section.title,
      isVisible: section.is_visible,
      sortOrder: section.sort_order ?? section.position ?? 0,
      createdAt: section.created_at,
      updatedAt: section.updated_at,
      items: mappedItems as ResumeSection['items'],
    } as ResumeSection;
  });

  let settings = resumeRow.settings;
  if (typeof settings === 'string') {
    try {
      settings = JSON.parse(settings);
    } catch (e) {
      settings = null;
    }
  }

  return {
    id: resumeRow.id,
    userId: resumeRow.user_id,
    title: resumeRow.title,
    templateId: resumeRow.template_id,
    settings: (settings && typeof settings === 'object') ? settings : {
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

const fetchResumeById = async (id: string): Promise<Resume | null> => {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.error('FetchResume: No authenticated user.');
      return null;
    }

    const { data: resumeRow, error: resumeError } = await supabase
      .from('resumes')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .maybeSingle();

    if (resumeError || !resumeRow) {
      console.error('FetchResume: Resume not found or error:', resumeError);
      return null;
    }

    // Attempt to fetch sections - Try both legacy and new column names
    let sectionsResult = await supabase
      .from('resume_sections')
      .select('*')
      .eq('resume_id', id)
      .order('sort_order', { ascending: true });

    if (sectionsResult.error) {
       console.warn('Sort order failed, trying position...');
       sectionsResult = await supabase
        .from('resume_sections')
        .select('*')
        .eq('resume_id', id)
        .order('position', { ascending: true });
    }

    if (sectionsResult.error) {
      console.error('FetchResume: Sections error:', sectionsResult.error);
      return null;
    }

    const sectionRows = sectionsResult.data as ResumeSectionRow[];
    const sectionIds = sectionRows.map((section) => section.id);

    if (sectionIds.length === 0) {
      return mapResume(resumeRow as ResumeRow, sectionRows, []);
    }

    let itemsResult = await supabase
      .from('section_items')
      .select('*')
      .in('section_id', sectionIds)
      .order('sort_order', { ascending: true });

    if (itemsResult.error) {
       itemsResult = await supabase
        .from('section_items')
        .select('*')
        .in('section_id', sectionIds)
        .order('position', { ascending: true });
    }

    return mapResume(resumeRow as ResumeRow, sectionRows, (itemsResult.data ?? []) as SectionItemRow[]);
  } catch (err) {
    console.error('Critical Fetch Error:', err);
    return null;
  }
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
