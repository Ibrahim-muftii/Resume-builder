'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CirclePlus, Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import ResumeCard from '@/components/dashboard/ResumeCard';
import type { Resume } from '../../../lib/types/resume';

type ResumeGridProps = {
  initialResumes: Resume[];
};

type ResumeApiError = {
  error?: string;
};

const toResume = (row: {
  id: string;
  user_id: string;
  title: string;
  template_id: Resume['templateId'];
  created_at: string;
  updated_at: string;
}): Resume => ({
  id: row.id,
  userId: row.user_id,
  title: row.title,
  templateId: row.template_id,
  sections: [],
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export default function ResumeGrid({ initialResumes }: ResumeGridProps) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [resumes, setResumes] = useState<Resume[]>(initialResumes);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadResumes = async (): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/resume', { cache: 'no-store' });
        const payload = (await response.json()) as Resume[] | ResumeApiError;

        if (!response.ok) {
          throw new Error((payload as ResumeApiError).error ?? 'Failed to load resumes');
        }

        setResumes(payload as Resume[]);
      } catch (loadError: unknown) {
        setError(loadError instanceof Error ? loadError.message : 'Failed to load resumes');
      } finally {
        setIsLoading(false);
      }
    };

    void loadResumes();
  }, []);

  const handleCreate = async (): Promise<void> => {
    setIsCreating(true);
    setError(null);

    try {
      const response = await fetch('/api/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      const payload = (await response.json()) as Resume | ResumeApiError;

      if (!response.ok || 'error' in payload) {
        throw new Error(('error' in payload ? payload.error : undefined) ?? 'Failed to create resume');
      }

      router.push(`/resume/${payload.id}`);
    } catch (createError: unknown) {
      setError(createError instanceof Error ? createError.message : 'Failed to create resume');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (resumeId: string): Promise<void> => {
    const previous = resumes;
    setResumes((current) => current.filter((resume) => resume.id !== resumeId));

    try {
      const { error: deleteError } = await supabase.from('resumes').delete().eq('id', resumeId);

      if (deleteError) {
        throw new Error(deleteError.message);
      }
    } catch (deleteError: unknown) {
      setResumes(previous);
      setError(deleteError instanceof Error ? deleteError.message : 'Failed to delete resume');
    }
  };

  const handleDuplicate = async (resumeId: string): Promise<void> => {
    setError(null);

    const resumeResponse = await fetch(`/api/resume/${resumeId}`, { cache: 'no-store' });
    const fullResume = (await resumeResponse.json()) as Resume | ResumeApiError;

    if (!resumeResponse.ok || 'error' in fullResume) {
      throw new Error(('error' in fullResume ? fullResume.error : undefined) ?? 'Failed to load resume copy source');
    }

    const { data: created, error: createError } = await supabase
      .from('resumes')
      .insert({
        user_id: fullResume.userId,
        title: `${fullResume.title} (Copy)`,
        template_id: fullResume.templateId,
      })
      .select('id, user_id, title, template_id, created_at, updated_at')
      .single();

    if (createError || !created) {
      throw new Error(createError?.message ?? 'Failed to create duplicated resume');
    }

    const sectionMap = new Map<string, string>();

    const sectionRows = fullResume.sections.map((section) => {
      const newSectionId = crypto.randomUUID();
      sectionMap.set(section.id, newSectionId);
      return {
        id: newSectionId,
        resume_id: created.id,
        type: section.type,
        title: section.title,
        position: section.sortOrder,
        is_visible: section.isVisible,
      };
    });

    if (sectionRows.length > 0) {
      const { error: sectionsError } = await supabase.from('resume_sections').insert(sectionRows);
      if (sectionsError) {
        throw new Error(sectionsError.message);
      }
    }

    const itemRows = fullResume.sections.flatMap((section) =>
      section.items.map((item) => ({
        id: crypto.randomUUID(),
        section_id: sectionMap.get(section.id) ?? section.id,
        position: item.sortOrder,
        data: item.data,
      }))
    );

    if (itemRows.length > 0) {
      const { error: itemsError } = await supabase.from('section_items').insert(itemRows);
      if (itemsError) {
        throw new Error(itemsError.message);
      }
    }

    const duplicated = toResume(created);
    setResumes((current) => [duplicated, ...current]);
  };

  return (
    <div id="resume-grid" className="space-y-5 scroll-mt-24">
      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        <button
          type="button"
          onClick={() => void handleCreate()}
          disabled={isCreating}
          id="create-resume"
          className="flex min-h-72 flex-col items-center justify-center rounded-[28px] border border-dashed border-zinc-300 bg-white p-6 text-center text-zinc-600 transition-colors hover:border-emerald-500 hover:text-emerald-700"
        >
          <div className="mb-4 rounded-2xl bg-emerald-50 p-3 text-emerald-700 ring-1 ring-emerald-100">
            <CirclePlus className="h-7 w-7" />
          </div>
          <p className="text-lg font-semibold">{isCreating ? 'Creating...' : 'Create New Resume'}</p>
          <p className="mt-2 text-sm text-zinc-500">Start with a clean structure and pick a template later.</p>
        </button>

        {isLoading
          ? Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="min-h-72 animate-pulse rounded-[28px] border border-zinc-200 bg-white" />
            ))
          : resumes.map((resume) => (
              <ResumeCard
                key={resume.id}
                resume={resume}
                onDelete={() => handleDelete(resume.id)}
                onDuplicate={() => handleDuplicate(resume.id)}
              />
            ))}
      </div>

      {!isLoading && resumes.length === 0 ? (
        <div className="rounded-[28px] border border-zinc-200 bg-white p-8 text-center text-sm text-zinc-500">
          <Sparkles className="mx-auto mb-3 h-5 w-5 text-emerald-700" />
          No resumes yet. Create your first one to get started.
        </div>
      ) : null}
    </div>
  );
}
