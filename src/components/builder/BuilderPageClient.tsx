'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import BuilderCanvas from '@/components/builder/BuilderCanvas';
import FieldEditor from '@/components/builder/FieldEditor';
import SectionToolbar from '@/components/builder/SectionToolbar';
import { AddSectionModal } from '@/components/ui/AddSectionModal';
import TemplateSelector from '@/components/templates/TemplateSelector';
import { useResumeStore } from '../../../lib/stores/resumeStore';
import { useUiStore } from '../../../lib/stores/uiStore';
import { useAutoSave } from '../../../lib/hooks/useAutoSave';
import type { Resume } from '../../../lib/types/resume';

type BuilderPageClientProps = {
  initialResume: Resume;
};

const panelTabOptions = [
  { id: 'sections', label: 'Sections' },
  { id: 'canvas', label: 'Canvas' },
  { id: 'editor', label: 'Editor' },
] as const;

export default function BuilderPageClient({ initialResume }: BuilderPageClientProps) {
  const setResume = useResumeStore((state) => state.setResume);
  const resume = useResumeStore((state) => state.resume);
  const updateResumeTitle = useResumeStore((state) => state.updateResumeTitle);
  const isDirty = useResumeStore((state) => state.isDirty);
  const undo = useResumeStore((state) => state.undo);
  const panelTab = useUiStore((state) => state.isMobilePanel);
  const setPanelTab = useUiStore((state) => state.setIsMobilePanel);
  const isAddSectionModalOpen = useUiStore((state) => state.isAddSectionModalOpen);
  const setIsAddSectionModalOpen = useUiStore((state) => state.setIsAddSectionModalOpen);

  const { isSaving, saveError, forceSave } = useAutoSave();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(initialResume.title);

  useEffect(() => {
    setResume(initialResume);
    setTitleDraft(initialResume.title);
  }, [initialResume, setResume]);

  useEffect(() => {
    if (!resume) {
      return;
    }
    setTitleDraft(resume.title);
  }, [resume?.title, resume]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      const isSaveShortcut = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's';
      const isUndoShortcut = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z';

      if (isSaveShortcut) {
        event.preventDefault();
        void forceSave();
      }

      if (isUndoShortcut) {
        event.preventDefault();
        undo();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [forceSave, undo]);

  const savingStatus = useMemo(() => {
    if (isSaving) {
      return 'Saving...';
    }
    if (saveError) {
      return saveError;
    }
    if (isDirty) {
      return 'Unsaved changes';
    }
    return 'Saved ✓';
  }, [isDirty, isSaving, saveError]);

  const commitTitle = async (): Promise<void> => {
    const nextTitle = titleDraft.trim() || 'Untitled Resume';
    if (!resume) {
      setIsEditingTitle(false);
      return;
    }

    if (nextTitle !== resume.title) {
      updateResumeTitle(nextTitle);
      await forceSave();
    }

    setIsEditingTitle(false);
  };

  if (!resume) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-zinc-500">
        Loading resume...
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-zinc-50 text-zinc-950">
      <header className="border-b border-zinc-200 bg-white/95 px-4 py-3 backdrop-blur">
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/dashboard" className="text-sm text-zinc-500 hover:text-zinc-900">
            Back to dashboard
          </Link>

          <div className="min-w-55 flex-1">
            {isEditingTitle ? (
              <Input
                value={titleDraft}
                autoFocus
                onChange={(event) => setTitleDraft(event.target.value)}
                onBlur={() => {
                  void commitTitle();
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    void commitTitle();
                  }
                  if (event.key === 'Escape') {
                    setTitleDraft(resume.title);
                    setIsEditingTitle(false);
                  }
                }}
              />
            ) : (
              <button
                type="button"
                className="text-left text-lg font-semibold tracking-tight hover:text-indigo-600"
                onClick={() => setIsEditingTitle(true)}
              >
                {resume.title}
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <motion.span
              className="inline-block h-2 w-2 rounded-full bg-indigo-500"
              animate={isSaving ? { opacity: [0.3, 1, 0.3] } : { opacity: 1 }}
              transition={{ repeat: isSaving ? Infinity : 0, duration: 1 }}
            />
            <span>{savingStatus}</span>
          </div>

          <Link
            href={`/resume/${resume.id}/preview`}
            className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100"
          >
            Preview
          </Link>

          <Button
            type="button"
            variant="outline"
            onClick={() => {
              window.print();
            }}
          >
            Download PDF
          </Button>
        </div>
      </header>

      <div className="border-b border-zinc-200 bg-white px-4 py-2 lg:hidden">
        <div className="grid grid-cols-3 gap-2">
          {panelTabOptions.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setPanelTab(tab.id)}
              className={`rounded-lg px-3 py-2 text-sm ${
                panelTab === tab.id
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-zinc-100 text-zinc-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <main className="min-h-0 flex-1 p-4">
        <div className="hidden h-full min-h-0 grid-cols-[280px_1fr_320px] gap-4 lg:grid">
          <SectionToolbar />
          <BuilderCanvas />
          <FieldEditor />
        </div>

        <div className="h-full lg:hidden">
          {panelTab === 'sections' ? <SectionToolbar /> : null}
          {panelTab === 'canvas' ? <BuilderCanvas /> : null}
          {panelTab === 'editor' ? <FieldEditor /> : null}
        </div>
      </main>

      <AddSectionModal open={isAddSectionModalOpen} onOpenChange={setIsAddSectionModalOpen} />
      <TemplateSelector />
    </div>
  );
}
