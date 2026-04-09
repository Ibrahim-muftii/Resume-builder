'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Copy, Eye, Pencil, Trash2 } from 'lucide-react';
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
import ModernTemplate from '@/components/templates/templates/ModernTemplate';
import ClassicTemplate from '@/components/templates/templates/ClassicTemplate';
import MinimalTemplate from '@/components/templates/templates/MinimalTemplate';
import CreativeTemplate from '@/components/templates/templates/CreativeTemplate';
import ExecutiveTemplate from '@/components/templates/templates/ExecutiveTemplate';
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
};

const renderTemplate = (resume: Resume) => {
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
    <article className="group rounded-[28px] border border-zinc-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-4/3 overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50">
        <div className="absolute left-0 top-0 h-[400%] w-[400%] origin-top-left scale-[0.25] pointer-events-none">
          {renderTemplate(resume)}
        </div>
      </div>

      <div className="mt-4 space-y-2.5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="line-clamp-1 text-lg font-semibold text-zinc-900">
            {resume.title}
          </h3>
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-100">
            {templateLabels[resume.templateId]}
          </span>
        </div>

        <p className="text-sm text-zinc-500">Last edited {lastEdited}</p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Link
          href={`/resume/${resume.id}`}
          className="inline-flex h-10 items-center justify-center rounded-xl bg-emerald-700 px-3 text-sm font-semibold text-white hover:bg-emerald-800"
        >
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </Link>

        <Link
          href={`/resume/${resume.id}/preview`}
          className="inline-flex h-10 items-center justify-center rounded-xl border border-zinc-300 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          <Eye className="mr-2 h-4 w-4" />
          Preview
        </Link>

        <Button type="button" variant="outline" className="h-10 rounded-xl" onClick={() => void handleDuplicate()} disabled={isDuplicating || isDeleting}>
          <Copy className="mr-2 h-4 w-4" />
          {isDuplicating ? 'Duplicating...' : 'Duplicate'}
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button type="button" variant="outline" className="h-10 rounded-xl" disabled={isDeleting || isDuplicating}>
              <Trash2 className="mr-2 h-4 w-4" />
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete resume?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. All sections and items in this resume will be removed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => void handleDelete()}>
                Confirm Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </article>
  );
}
