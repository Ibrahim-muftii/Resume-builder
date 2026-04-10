'use client';

import { JSX, useCallback, useEffect, useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useResumeStore } from '../../../lib/stores/resumeStore';
import { useUiStore } from '../../../lib/stores/uiStore';
import type { Resume, TemplateId } from '../../../lib/types/resume';
import { enrichWithDemoData } from '../../../lib/utils/demoData';
import ClassicTemplate from './templates/ClassicTemplate';
import CreativeTemplate from './templates/CreativeTemplate';
import ExecutiveTemplate from './templates/ExecutiveTemplate';
import MinimalTemplate from './templates/MinimalTemplate';
import ModernTemplate from './templates/ModernTemplate';
import ProfessionalTemplate from './templates/ProfessionalTemplate';

type TemplateRow = {
  id: TemplateId;
  name: string;
  description: string;
  category: string;
  is_premium: boolean;
  thumbnail_url: string | null;
};

type ApiErrorResponse = {
  error?: string;
};

const templateRenderer: Record<TemplateId, (resume: Resume) => React.ReactNode> = {
  professional: (resume) => <ProfessionalTemplate resume={enrichWithDemoData(resume)} isPreview scale={1} />,
  modern: (resume) => <ModernTemplate resume={enrichWithDemoData(resume)} isPreview scale={1} />,
  classic: (resume) => <ClassicTemplate resume={enrichWithDemoData(resume)} isPreview scale={1} />,
  minimal: (resume) => <MinimalTemplate resume={enrichWithDemoData(resume)} isPreview scale={1} />,
  creative: (resume) => <CreativeTemplate resume={enrichWithDemoData(resume)} isPreview scale={1} />,
  executive: (resume) => <ExecutiveTemplate resume={enrichWithDemoData(resume)} isPreview scale={1} />,
};

const templateOrder: TemplateId[] = ['professional', 'modern', 'classic', 'minimal', 'creative', 'executive'];

const getErrorMessage = (payload: unknown, fallback: string): string => {
  if (typeof payload === 'object' && payload !== null && 'error' in payload) {
    const message = (payload as ApiErrorResponse).error;
    if (typeof message === 'string' && message.length > 0) {
      return message;
    }
  }

  return fallback;
};

function TemplateSkeletonCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="h-56 animate-pulse rounded-xl bg-slate-100" />
      <div className="mt-4 h-5 w-1/2 animate-pulse rounded bg-slate-100" />
      <div className="mt-3 h-4 w-full animate-pulse rounded bg-slate-100" />
      <div className="mt-2 h-4 w-4/5 animate-pulse rounded bg-slate-100" />
    </div>
  );
}

export default function TemplateSelector() {
  const supabase = useMemo(() => createClient(), []);
  const isOpen = useUiStore((state) => state.isTemplateSelectorOpen);
  const setIsOpen = useUiStore((state) => state.setIsTemplateSelectorOpen);
  const resume = useResumeStore((state) => state.resume);
  const updateTemplate = useResumeStore((state) => state.updateTemplate);

  const [templates, setTemplates] = useState<TemplateRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingTemplate, setIsSavingTemplate] = useState<TemplateId | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadTemplates = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('templates')
        .select('id, name, description, category, is_premium, thumbnail_url')
        .order('name', { ascending: true });

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      const fetchedTemplates = (data ?? []) as TemplateRow[];
      const orderedTemplates = [...fetchedTemplates].sort(
        (left, right) => templateOrder.indexOf(left.id) - templateOrder.indexOf(right.id)
      );

      setTemplates(orderedTemplates);
    } catch (loadError: unknown) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to fetch templates');
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    void loadTemplates();
  }, [loadTemplates]);

  const handleTemplateSelect = useCallback(
    async (templateId: TemplateId): Promise<void> => {
      if (!resume || isSavingTemplate) {
        return;
      }

      const previousTemplate = resume.templateId;

      setIsSavingTemplate(templateId);
      setError(null);

      updateTemplate(templateId);

      try {
        const response = await fetch(`/api/resumes/${resume.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ templateId }),
        });

        if (!response.ok) {
          const payload: unknown = await response.json();
          throw new Error(getErrorMessage(payload, 'Failed to update template'));
        }

        setIsOpen(false);
      } catch (persistError: unknown) {
        updateTemplate(previousTemplate);
        setError(
          persistError instanceof Error ? persistError.message : 'Failed to update template'
        );
      } finally {
        setIsSavingTemplate(null);
      }
    },
    [isSavingTemplate, resume, setIsOpen, updateTemplate]
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="left-0 top-0 h-screen w-screen max-w-none translate-x-0 translate-y-0 rounded-none border-0 p-0">
        <div className="flex h-full flex-col bg-slate-50 text-slate-950">
          <DialogHeader className="border-b border-slate-200 px-6 py-5">
            <DialogTitle className="text-2xl font-semibold">Choose Template</DialogTitle>
            <DialogDescription>
              Select a layout and save it to your current resume.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="mx-auto max-w-[1152px]">
              {error ? (
                <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </p>
              ) : null}

              {isLoading ? (
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <TemplateSkeletonCard key={index} />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                  {templates.map((template) => {
                    const selected = resume?.templateId === template.id;
                    const canRenderPreview = Boolean(resume);
                    const isSaving = isSavingTemplate === template.id;

                    return (
                      <button
                        key={template.id}
                        type="button"
                        onClick={() => void handleTemplateSelect(template.id)}
                        disabled={!resume || Boolean(isSavingTemplate)}
                        className={cn(
                          'rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-all hover:border-emerald-300 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60',
                          selected && 'ring-2 ring-emerald-500 border-emerald-500'
                        )}
                      >
                        <div className="relative h-56 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                          {canRenderPreview && resume ? (
                            <div className="absolute left-0 top-0 h-[400%] w-[400%] origin-top-left scale-[0.25] pointer-events-none">
                              {templateRenderer[template.id](resume)}
                            </div>
                          ) : null}
                        </div>

                        <div className="mt-4 flex items-start justify-between gap-3">
                          <h3 className="text-base font-semibold text-slate-950">
                            {template.name}
                          </h3>
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                            {template.category}
                          </span>
                        </div>

                        <p className="mt-2 text-sm text-slate-600">
                          {template.description}
                        </p>

                        {isSaving ? (
                          <div className="mt-3 inline-flex items-center gap-2 text-xs text-emerald-600">
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            Saving template...
                          </div>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
