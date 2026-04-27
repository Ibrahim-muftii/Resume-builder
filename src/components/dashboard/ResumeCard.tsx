'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Copy, Eye, Loader2, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import CreativeTemplate from '@/components/templates/templates/CreativeTemplate';
import ExecutiveTemplate from '@/components/templates/templates/ExecutiveTemplate';
import ProfessionalTemplate from '@/components/templates/templates/ProfessionalTemplate';
import LondonTemplate from '@/components/templates/templates/LondonTemplate';
import ModernTemplate from '@/components/templates/templates/ModernTemplate';
import ClassicTemplate from '@/components/templates/templates/ClassicTemplate';
import MinimalTemplate from '@/components/templates/templates/MinimalTemplate';
import type { Resume, TemplateId } from '../../../lib/types/resume';

type ResumeCardProps = {
  resume: Resume;
  onDelete: () => Promise<void> | void;
  onDuplicate: () => Promise<void> | void;
};

const templateLabels: Record<TemplateId, string> = {
  modern: 'Modern',
  classic: 'Classic',
  minimal: 'Minimal',
  creative: 'Creative',
  executive: 'Executive',
  london: 'London',
  professional: 'Professional',
};

const renderTemplate = (resume: Resume) => {
  if (resume.templateId === 'london') return <LondonTemplate resume={resume} isPreview />;
  if (resume.templateId === 'professional') return <ProfessionalTemplate resume={resume} isPreview />;
  if (resume.templateId === 'classic') return <ClassicTemplate resume={resume} isPreview />;
  if (resume.templateId === 'minimal') return <MinimalTemplate resume={resume} isPreview />;
  if (resume.templateId === 'creative') return <CreativeTemplate resume={resume} isPreview />;
  if (resume.templateId === 'executive') return <ExecutiveTemplate resume={resume} isPreview />;
  return <ModernTemplate resume={resume} isPreview />;
};

const getRelativeTime = (dateIso: string): string => {
  const now = Date.now();
  const date = new Date(dateIso).getTime();
  const diffMs = date - now;

  const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (Math.abs(diffMs) < hour) {
    return formatter.format(Math.round(diffMs / minute), 'minute');
  }
  if (Math.abs(diffMs) < day) {
    return formatter.format(Math.round(diffMs / hour), 'hour');
  }
  return formatter.format(Math.round(diffMs / day), 'day');
};

export default function ResumeCard({ resume, onDelete, onDuplicate }: ResumeCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);

  const lastEdited = useMemo(() => getRelativeTime(resume.updatedAt), [resume.updatedAt]);

  const handleDuplicate = async (): Promise<void> => {
    setIsDuplicating(true);
    try {
      await Promise.resolve(onDuplicate());
    } finally {
      setIsDuplicating(false);
    }
  };

  const handleDelete = async (): Promise<void> => {
    setIsDeleting(true);
    try {
      await Promise.resolve(onDelete());
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <article className="group relative flex flex-col rounded-3xl border border-slate-100 bg-white p-4 transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200/50">
      <div className="relative aspect-[3/2] overflow-hidden rounded-2xl border border-slate-50 bg-white">
        <div className="absolute inset-0 h-[400%] w-[400%] origin-top-left scale-[0.25] pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
          {renderTemplate(resume)}
        </div>

        {/* Hover Actions Overlay */}
        <div className="absolute inset-0 flex items-center justify-center gap-3 bg-slate-900/10 backdrop-blur-[1px] opacity-0 transition-opacity group-hover:opacity-100">
          <Link
            href={`/resume/${resume.id}`}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-900 shadow-xl hover:scale-110 active:scale-95 transition-all"
            title="Edit Resume"
          >
            <Pencil size={18} />
          </Link>
          <Link
            href={`/resume/${resume.id}/preview`}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-900 shadow-xl hover:scale-110 active:scale-95 transition-all"
            title="Preview"
          >
            <Eye size={18} />
          </Link>
        </div>
      </div>

      <div className="mt-5 flex-1">
        <div className="flex items-center justify-between gap-3">
          <h3 className="line-clamp-1 text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
            {resume.title}
          </h3>
          <span className="shrink-0 rounded-full bg-slate-50 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-slate-500 border border-slate-100">
            {templateLabels[resume.templateId]}
          </span>
        </div>

        <div className="mt-2 text-[10px] font-medium text-slate-400">
          Last edited {lastEdited}
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2">
        <Link
          href={`/resume/${resume.id}`}
          className="flex-1 inline-flex h-10 items-center justify-center rounded-xl bg-slate-900 px-4 text-xs font-bold text-white shadow-lg shadow-slate-200 transition-all hover:bg-slate-800 active:scale-95"
        >
          Open Editor
        </Link>

        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="outline"
            className="h-10 w-10 p-0 rounded-xl border-slate-100 bg-slate-50/50 hover:bg-slate-100 text-slate-500"
            onClick={() => void handleDuplicate()}
            disabled={isDuplicating || isDeleting}
          >
            {isDuplicating ? <Loader2 size={14} className="animate-spin" /> : <Copy size={14} />}
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="h-10 w-10 p-0 rounded-xl border-slate-100 bg-slate-50/50 hover:bg-red-50 hover:text-red-500 hover:border-red-100 text-slate-500"
                disabled={isDeleting || isDuplicating}
              >
                {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-3xl border-slate-100 bg-white">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-lg font-bold">Delete resume?</AlertDialogTitle>
                <AlertDialogDescription className="text-sm text-slate-500">
                  This action cannot be undone. All data will be permanently removed.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="mt-6 flex gap-2">
                <AlertDialogCancel className="rounded-xl border-slate-100 font-bold text-xs flex-1">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => void handleDelete()}
                  className="rounded-xl bg-red-500 font-bold text-xs text-white hover:bg-red-600 flex-1"
                >
                  Delete Forever
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </article>
  );
}

