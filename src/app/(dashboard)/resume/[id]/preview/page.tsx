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
import { DownloadButton } from '@/components/pdf/ResumePDF';
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
  is_public: boolean;
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

const getBaseUrl = async (): Promise<string> => {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (envUrl) {
    return envUrl;
  }

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
    isPublic: resumeRow.is_public,
  };
};

const fetchResumeById = async (id: string): Promise<ResumeWithPublic | null> => {
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

const renderTemplate = (resume: ResumeWithPublic, templateId: TemplateId): ReactElement => {
  if (templateId === 'classic') return <ClassicTemplate resume={resume} />;
  if (templateId === 'minimal') return <MinimalTemplate resume={resume} />;
  if (templateId === 'creative') return <CreativeTemplate resume={resume} />;
  if (templateId === 'executive') return <ExecutiveTemplate resume={resume} />;
  return <ModernTemplate resume={resume} />;
};

async function toggleShareAction(formData: FormData): Promise<void> {
  'use server';

  const resumeId = formData.get('resumeId');
  const nextPublic = formData.get('nextPublic');

  if (typeof resumeId !== 'string' || typeof nextPublic !== 'string') {
    return;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  await supabase
    .from('resumes')
    .update({ is_public: nextPublic === 'true', last_edited_at: new Date().toISOString() })
    .eq('id', resumeId)
    .eq('user_id', user.id);

  redirect(`/resume/${resumeId}/preview`);
}

export async function generateMetadata({ params }: PreviewPageProps): Promise<Metadata> {
  const { id } = await params;
  const resume = await fetchResumeById(id);

  return {
    title: resume ? `${resume.title} Preview` : 'Resume Preview',
  };
}

export default async function ResumePreviewPage({ params }: PreviewPageProps) {
  const { id } = await params;
  const resume = await fetchResumeById(id);

  if (!resume) {
    notFound();
  }

  const publicLink = `${await getBaseUrl()}/resume/${resume.id}/public`;

  return (
    <div className="min-h-screen bg-[#f6f8fb] text-zinc-900">
      <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center gap-3">
          <Link href={`/resume/${resume.id}`} className="text-sm text-zinc-500 hover:text-zinc-900">
            Back to editor
          </Link>
          <div className="flex-1" />
          <form action={toggleShareAction} className="flex items-center gap-2">
            <input type="hidden" name="resumeId" value={resume.id} />
            <input type="hidden" name="nextPublic" value={String(!resume.isPublic)} />
            <button
              type="submit"
              className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm font-medium hover:bg-zinc-50"
            >
              {resume.isPublic ? 'Disable Share' : 'Enable Share'}
            </button>
          </form>
          {resume.isPublic ? (
            <p className="text-xs text-zinc-500">Public link: {publicLink}</p>
          ) : null}
          <DownloadButton resume={resume} templateId={resume.templateId} />
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-6">{renderTemplate(resume, resume.templateId)}</main>
    </div>
  );
}
