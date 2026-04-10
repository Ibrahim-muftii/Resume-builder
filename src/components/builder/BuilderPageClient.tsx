'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Printer,
  Layout,
  Eye
} from 'lucide-react';
import { useResumeStore } from '../../../lib/stores/resumeStore';
import { useUiStore } from '../../../lib/stores/uiStore';
import { useAutoSave } from '../../../lib/hooks/useAutoSave';
import type { Resume } from '../../../lib/types/resume';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import SectionToolbar from './SectionToolbar';
import BuilderCanvas from './BuilderCanvas';
import FieldEditor from './FieldEditor';
import TemplateSelector from '@/components/templates/TemplateSelector';
import { AddSectionModal } from '../ui/AddSectionModal';

type BuilderPageClientProps = {
  initialResume: Resume;
};

const panelTabOptions = [
  { id: 'sections', label: 'Sections' },
  { id: 'canvas', label: 'Preview' },
  { id: 'editor', label: 'Editor' },
] as const;

export default function BuilderPageClient({ initialResume }: BuilderPageClientProps) {
  const setResume = useResumeStore((state) => state.setResume);
  const resume = useResumeStore((state) => state.resume);
  const updateResumeTitle = useResumeStore((state) => state.updateResumeTitle);
  const isDirty = useResumeStore((state) => state.isDirty);
  const isSaving = useResumeStore((state) => state.isSaving);
  const saveError = useResumeStore((state) => state.saveError);
  const undo = useResumeStore((state) => state.undo);

  const panelTab = useUiStore((state) => state.isMobilePanel);
  const setPanelTab = useUiStore((state) => state.setIsMobilePanel);
  const isAddSectionModalOpen = useUiStore((state) => state.isAddSectionModalOpen);
  const setIsAddSectionModalOpen = useUiStore((state) => state.setIsAddSectionModalOpen);
  const setIsTemplateSelectorOpen = useUiStore((state) => state.setIsTemplateSelectorOpen);

  // Initialize auto-save
  useAutoSave();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(initialResume.title);

  useEffect(() => {
    setResume(initialResume);
    setTitleDraft(initialResume.title);
  }, [initialResume, setResume]);

  useEffect(() => {
    if (!resume) return;
    setTitleDraft(resume.title);
  }, [resume?.title, resume]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      const isUndoShortcut = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z';
      if (isUndoShortcut) {
        event.preventDefault();
        undo();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [undo]);

  const commitTitle = (): void => {
    const nextTitle = titleDraft.trim() || 'Untitled Resume';
    if (!resume) {
      setIsEditingTitle(false);
      return;
    }

    if (nextTitle !== resume.title) {
      updateResumeTitle(nextTitle);
    }

    setIsEditingTitle(false);
  };

  if (!resume) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          <p className="text-sm font-medium text-zinc-500">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-[#f8fafc] text-slate-900 font-sans">
      <header className="z-20 border-b border-slate-200 bg-white/80 px-6 py-4 backdrop-blur-md">
        <div className="mx-auto flex w-full items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className="group flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition-all hover:bg-emerald-50 hover:text-emerald-700"
            >
              <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
            </Link>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                {isEditingTitle ? (
                  <Input
                    value={titleDraft}
                    autoFocus
                    className="h-8 w-64 border-slate-200 bg-slate-50 font-semibold"
                    onChange={(event) => setTitleDraft(event.target.value)}
                    onBlur={() => commitTitle()}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') commitTitle();
                      if (event.key === 'Escape') {
                        setTitleDraft(resume.title);
                        setIsEditingTitle(false);
                      }
                    }}
                  />
                ) : (
                  <button
                    type="button"
                    className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900 transition-colors hover:text-emerald-700"
                    onClick={() => setIsEditingTitle(true)}
                  >
                    {resume.title}
                  </button>
                )}

                <div className="flex items-center gap-1.5 ml-2 border-l border-slate-200 pl-4">
                  {isSaving ? (
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Saving...
                    </div>
                  ) : saveError ? (
                    <div className="flex items-center gap-1.5 text-xs font-medium text-red-500">
                      <AlertCircle className="h-3.5 w-3.5" />
                      Save failed
                    </div>
                  ) : isDirty ? (
                    <div className="flex items-center gap-1.5 text-xs font-medium text-amber-500">
                      <div className="h-2 w-2 rounded-full bg-amber-400" />
                      Unsaved
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Saved
                    </div>
                  )}
                </div>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mt-1">
                Last auto-save {new Date(resume.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsTemplateSelectorOpen(true)}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 shadow-sm"
            >
              <Layout className="h-4 w-4" />
              Templates
            </button>
            <Link
              href={`/resume/${resume.id}/preview`}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 shadow-sm"
            >
              <Eye className="h-4 w-4" />
              Live Preview
            </Link>
            <Button
              type="button"
              className="h-10 gap-2 rounded-xl bg-emerald-600 px-5 font-bold text-white shadow-lg shadow-emerald-100 transition-all hover:bg-emerald-700 active:scale-95"
              onClick={() => window.print()}
            >
              <Printer className="h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>
      </header>

      <div className="border-b border-slate-200 bg-white px-4 py-2 lg:hidden">
        <div className="grid grid-cols-3 gap-2">
          {panelTabOptions.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setPanelTab(tab.id)}
              className={`rounded-lg px-3 py-2 text-sm font-bold tracking-tight transition-all ${panelTab === tab.id
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-slate-100 text-slate-500'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <main className="min-h-0 flex-1 overflow-hidden p-8 bg-[#f8fafc]">
        <div className="mx-auto flex h-full max-w-[1400px] gap-8">
          {/* Left: Section List */}
          <div className="w-[280px] shrink-0 overflow-y-auto hidden lg:block">
            <SectionToolbar />
          </div>

          {/* Center: Live Preview / Canvas */}
          <div className="flex-1 overflow-y-auto custom-scrollbar rounded-[32px] border border-slate-200/60 bg-white shadow-2xl shadow-slate-200/60 p-8">
            <BuilderCanvas />
          </div>

          {/* Right: Field Editor (Sidepanel) */}
          <div className="w-[40%] shrink-0 overflow-y-auto hidden lg:block px-2">
            <FieldEditor />
          </div>
        </div>

        <style jsx global>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(0, 0, 0, 0.05);
            border-radius: 99px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(0, 0, 0, 0.1);
          }
          @media print {
            header, .lg\\:hidden, .hidden, .w-\\[320px\\], .w-\\[450px\\] {
              display: none !important;
            }
            main {
              padding: 0 !important;
            }
            .mx-auto {
               max-width: 100% !important;
            }
            .rounded-3xl {
              border-radius: 0 !important;
              border: none !important;
              box-shadow: none !important;
            }
          }
        `}</style>

        {/* Mobile View Toggles */}
        <div className="h-full lg:hidden overflow-y-auto">
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
