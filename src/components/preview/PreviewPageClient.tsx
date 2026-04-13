'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Share2 } from 'lucide-react';
import { FontLoader } from '@/components/templates/FontLoader';
import { ResumeStoreInitializer } from '@/components/preview/ResumeStoreInitializer';
import { PreviewSidebar } from '@/components/preview/PreviewSidebar';
import { PDFPreviewIframe } from '@/components/preview/PDFPreviewIframe';
import { DownloadButton } from '@/components/pdf/ResumePDF';
import { useUiStore } from '../../../lib/stores/uiStore';
import { useResumeStore } from '../../../lib/stores/resumeStore';
import { useAutoSave } from '../../../lib/hooks/useAutoSave';
import { cn } from '@/lib/utils';
import type { Resume } from '../../../lib/types/resume';

interface PreviewPageClientProps {
  initialResume: Resume;
}

export function PreviewPageClient({ initialResume }: PreviewPageClientProps) {
  const sidebarWidth = useUiStore((state) => state.sidebarWidth);
  const setSidebarWidth = useUiStore((state) => state.setSidebarWidth);
  const updateSettings = useResumeStore((state) => state.updateSettings);
  const [isResizing, setIsResizing] = useState(false);

  // Enable auto-save on the preview page
  useAutoSave();

  return (
    <div className="flex h-screen flex-col bg-[#f1f5f9] text-slate-900 overflow-hidden">
      <FontLoader />
      <ResumeStoreInitializer resume={initialResume} />

      <header className="z-30 border-b border-zinc-200 bg-white px-6 py-3 shadow-sm">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/resume/${initialResume.id}`} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors">
              <ChevronLeft className="h-4 w-4" />
              Back to Editor
            </Link>
            <div className="h-4 w-[1px] bg-zinc-200" />
            <h1 className="text-sm font-black uppercase tracking-widest text-slate-900 leading-none">{initialResume.title}</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all hover:bg-zinc-50 hover:shadow-sm cursor-help">
              <Share2 className="h-3 w-3 text-emerald-600" />
              {/* {initialResume.isPublic ? 'Sharing Active' : 'Private'} */}
            </div>
            <DownloadButton resume={initialResume} templateId={initialResume.templateId} />
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Resizable Sidebar */}
        <div
          className="flex-shrink-0 border-r border-zinc-200 bg-white z-20 shadow-lg"
          style={{ width: `${sidebarWidth}%` }}
        >
          <PreviewSidebar />
        </div>

        {/* Resize Handle */}
        <div
          className={cn(
            "relative w-1.5 cursor-col-resize z-30 transition-all hover:bg-emerald-400 flex items-center justify-center",
            isResizing && "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
          )}
          onMouseDown={(e) => {
            e.preventDefault();
            setIsResizing(true);
          }}
        >
          <div className="h-12 w-1 rounded-full bg-slate-200 group-hover:bg-white" />
        </div>

        <main className="flex-1 overflow-y-auto bg-slate-200/60 p-12 custom-scrollbar">
          <PDFPreviewIframe resumeId={initialResume.id} />
        </main>
      </div>

      {/* Global Resize Overlay */}
      {isResizing && (
        <div
          className="fixed inset-0 z-[9999] cursor-col-resize"
          onMouseMove={(e) => {
            const percentage = (e.clientX / window.innerWidth) * 100;
            // Constraints: 25% to 50%
            if (percentage > 25 && percentage < 55) {
              setSidebarWidth(percentage);
            }
          }}
          onMouseUp={() => {
            setIsResizing(false);
            // Save sidebar width to resume settings
            updateSettings({ sidebarWidth });
          }}
        />
      )}
    </div>
  );
}
