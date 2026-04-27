import type { Metadata } from 'next';
import type { ReactElement } from 'react';
import Link from 'next/link';
import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ModernTemplate from '@/components/templates/templates/ModernTemplate';
import ClassicTemplate from '@/components/templates/templates/ClassicTemplate';
import MinimalTemplate from '@/components/templates/templates/MinimalTemplate';
import CreativeTemplate from '@/components/templates/templates/CreativeTemplate';
import ExecutiveTemplate from '@/components/templates/templates/ExecutiveTemplate';
import ProfessionalTemplate from '@/components/templates/templates/ProfessionalTemplate';
import LondonTemplate from '@/components/templates/templates/LondonTemplate';
import { DownloadButton } from '@/components/pdf/ResumePDF';
import { PreviewSidebar } from '@/components/preview/PreviewSidebar';
import { PreviewPaginator } from '@/components/preview/PreviewPaginator';
import { ResumeStoreInitializer } from '@/components/preview/ResumeStoreInitializer';
import { LivePreviewContent } from '@/components/preview/LivePreviewContent';
import { PreviewPageClient } from '@/components/preview/PreviewPageClient';
import { FontLoader } from '@/components/templates/FontLoader';
import { sectionItemDataSchema } from '../../../../../../lib/validations/resumeSchema';
import { getDefaultSectionItem } from '../../../../../../lib/utils/sectionDefaults';
import type {
  Resume,
  ResumeSection,
  SectionItem,
  SectionItemData,
  SectionType,
  TemplateId,
} from '../../../../../../lib/types/resume';
import { ChevronLeft, Share2 } from 'lucide-react';

type ResumeWithPublic = Resume & {
  isPublic?: boolean;
};

type PreviewPageProps = {
  params: Promise<{ id: string }>;
};

type ResumeRow = {
  id: string;
  user_id: string;
  title: string;
  template_id: TemplateId;
  settings: any;
  is_public: boolean;
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

const getBaseUrl = async (): Promise<string> => {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (envUrl) return envUrl;
  const headerStore = await headers();
  const protocol = headerStore.get('x-forwarded-proto') ?? 'http';
  const host = headerStore.get('x-forwarded-host') ?? headerStore.get('host') ?? 'localhost:3000';
  return `${protocol}://${host}`;
};

const mapResume = (resumeRow: ResumeRow, sections: ResumeSectionRow[], items: SectionItemRow[]): ResumeWithPublic => {
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
      // Ensure we preserve the original data as much as possible, including name/title
      const originalData = typeof item.data === 'string' ? JSON.parse(item.data) : item.data;
      const dataToParse = { ...originalData, type: effectiveType };
      const parsedData = sectionItemDataSchema.safeParse(dataToParse);
      const itemData = parsedData.success ? parsedData.data : { ...getDefaultSectionItem(effectiveType), ...originalData };

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
    try { settings = JSON.parse(settings); } catch (e) { settings = null; }
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
    sections: mappedSections.sort((a, b) => a.sortOrder - b.sortOrder),
    createdAt: resumeRow.created_at,
    updatedAt: resumeRow.updated_at,
    isPublic: resumeRow.is_public,
  };
};

const fetchResumeById = async (id: string): Promise<ResumeWithPublic | null> => {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data: resumeRow, error: resumeError } = await supabase
      .from('resumes').select('*')
      .eq('id', id).eq('user_id', user.id).maybeSingle();
    if (resumeError || !resumeRow) return null;
    let sectionsResult = await supabase
      .from('resume_sections').select('*')
      .eq('resume_id', id).order('sort_order', { ascending: true });
    if (sectionsResult.error) {
       sectionsResult = await supabase.from('resume_sections').select('*').eq('resume_id', id).order('position', { ascending: true });
    }
    if (sectionsResult.error) return null;
    const sectionRows = sectionsResult.data as ResumeSectionRow[];
    const sectionIds = sectionRows.map((section) => section.id);
    if (sectionIds.length === 0) return mapResume(resumeRow as ResumeRow, sectionRows, []);
    let itemsResult = await supabase.from('section_items').select('*').in('section_id', sectionIds).order('sort_order', { ascending: true });
    if (itemsResult.error) {
       itemsResult = await supabase.from('section_items').select('*').in('section_id', sectionIds).order('position', { ascending: true });
    }
    return mapResume(resumeRow as ResumeRow, sectionRows, (itemsResult.data ?? []) as SectionItemRow[]);
  } catch (err) { return null; }
};

const renderTemplate = (resume: ResumeWithPublic, templateId: TemplateId): ReactElement => {
  const props = { resume, isPreview: true, scale: 1.0 };
  if (templateId === 'professional') return <ProfessionalTemplate {...props} />;
  if (templateId === 'classic') return <ClassicTemplate {...props} />;
  if (templateId === 'minimal') return <MinimalTemplate {...props} />;
  if (templateId === 'creative') return <CreativeTemplate {...props} />;
  if (templateId === 'executive') return <ExecutiveTemplate {...props} />;
  if (templateId === 'london') return <LondonTemplate {...props} />;
  return <ModernTemplate {...props} />;
};

async function toggleShareAction(formData: FormData): Promise<void> {
  'use server';
  const resumeId = formData.get('resumeId');
  const nextPublic = formData.get('nextPublic');
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  await supabase.from('resumes').update({ is_public: nextPublic === 'true', last_edited_at: new Date().toISOString() }).eq('id', resumeId).eq('user_id', user.id);
  redirect(`/resume/${resumeId}/preview`);
}

export async function generateMetadata({ params }: PreviewPageProps): Promise<Metadata> {
  const { id } = await params;
  const resume = await fetchResumeById(id);
  return { title: resume ? `${resume.title} Preview` : 'Resume Preview' };
}

export default async function ResumePreviewPage({ params }: PreviewPageProps) {
  const { id } = await params;
  const resume = await fetchResumeById(id);
  if (!resume) notFound();
  return (
    <PreviewPageClient initialResume={resume} />
  );
}
