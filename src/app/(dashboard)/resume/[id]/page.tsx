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

import { mapResumeRowToResume, type ResumeRow, type ResumeSectionRow, type SectionItemRow } from '../../../../../lib/utils/resumeMapper';

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
      return mapResumeRowToResume(resumeRow as ResumeRow, sectionRows, []);
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

    return mapResumeRowToResume(resumeRow as ResumeRow, sectionRows, (itemsResult.data ?? []) as SectionItemRow[]);
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
