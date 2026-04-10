'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CirclePlus, Sparkles, Files, AlertCircle, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import ResumeCard from '@/components/dashboard/ResumeCard';
import { Button } from '@/components/ui/button';
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
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadResumes = async (): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/resumes', { cache: 'no-store' });
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

    if (initialResumes.length === 0) {
      void loadResumes();
    }
  }, [initialResumes.length]);

  const handleCreate = async (): Promise<void> => {
    setIsCreating(true);
    setError(null);

    try {
      const response = await fetch('/api/resumes', {
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
      const response = await fetch(`/api/resumes/${resumeId}`, {
         method: 'DELETE'
      });

      if (!response.ok) {
        const payload = await response.json() as ResumeApiError;
        throw new Error(payload.error ?? 'Failed to delete resume');
      }
    } catch (deleteError: unknown) {
      setResumes(previous);
      setError(deleteError instanceof Error ? deleteError.message : 'Failed to delete resume');
    }
  };

  const handleDuplicate = async (resumeId: string): Promise<void> => {
    setError(null);

    try {
        const resumeResponse = await fetch(`/api/resumes/${resumeId}`, { cache: 'no-store' });
        const payload = (await resumeResponse.json()) as { resume: Resume } | ResumeApiError;

        if (!resumeResponse.ok || 'error' in payload) {
          throw new Error(('error' in payload ? payload.error : undefined) ?? 'Failed to load resume copy source');
        }

        const fullResume = payload.resume;

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
    } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to duplicate resume');
    }
  };

  return (
    <div id="resume-grid" className="scroll-mt-24 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
           <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                Recent Projects
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-medium">Continue where you left off</p>
        </div>
        
        <Button
          type="button"
          disabled={isCreating}
          onClick={() => void handleCreate()}
          className="h-12 px-8 rounded-xl bg-slate-900 text-white font-bold transition-all hover:bg-slate-800 active:scale-95 shadow-lg shadow-slate-200"
        >
          {isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CirclePlus className="mr-2 h-4 w-4" />}
          Create New Resume
        </Button>
      </div>

      <div className="h-px w-full bg-slate-100" />

      {error ? (
        <div className="rounded-[32px] border border-red-200 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10 p-8 text-center backdrop-blur-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
             <AlertCircle className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-red-700 dark:text-red-400">Something went wrong</h3>
          <p className="mt-2 text-sm text-red-600/80 dark:text-red-400/80">{error}</p>
          <Button 
            variant="outline" 
            className="mt-6 rounded-xl border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
            onClick={() => { setError(null); router.refresh(); }}
          >
            Clear Error
          </Button>
        </div>
      ) : null}

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="aspect-[4/5] animate-pulse rounded-[32px] bg-zinc-100 dark:bg-zinc-800" />
          ))
        ) : resumes.length === 0 && !error ? (
          <div className="col-span-full rounded-[40px] border border-dashed border-zinc-300 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 p-20 text-center">
             <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-[32px] bg-white dark:bg-zinc-800 text-zinc-400 shadow-xl shadow-zinc-200/50 dark:shadow-none">
                <Files className="h-10 w-10 text-emerald-600" />
             </div>
             <h3 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Your workspace is empty</h3>
             <p className="mx-auto mt-4 max-w-sm text-zinc-500 dark:text-zinc-400">
                Kickstart your career by creating your first professional resume. Choose from our curated templates.
             </p>
             <Button
                type="button"
                onClick={() => void handleCreate()}
                className="mt-10 h-14 gap-3 rounded-[24px] bg-emerald-600 px-10 text-lg font-bold text-white shadow-2xl shadow-emerald-200 dark:shadow-none transition-all hover:bg-emerald-700 active:scale-95"
            >
                <CirclePlus className="h-6 w-6" />
                Build Your First Resume
            </Button>
          </div>
        ) : (
          resumes.map((resume) => (
            <ResumeCard
              key={resume.id}
              resume={resume}
              onDelete={() => void handleDelete(resume.id)}
              onDuplicate={() => void handleDuplicate(resume.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
