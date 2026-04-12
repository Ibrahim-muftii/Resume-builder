'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BadgeCheck,
  Briefcase,
  FolderKanban,
  GraduationCap,
  Languages,
  Loader2,
  PenTool,
  Search,
  Sparkles,
  Trophy,
  UserRound,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { Button } from './button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './dialog';
import { Input } from './input';
import { toastError, toastSuccess } from './toast-helpers';
import { useResumeStore } from '../../../lib/stores/resumeStore';
import { SECTION_TYPE_META, getDefaultSection } from '../../../lib/utils/sectionDefaults';
import type { SectionType } from '../../../lib/types/resume';

type AddSectionModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const sectionTypeOrder: SectionType[] = [
  'personal_info',
  'experience',
  'education',
  'skills',
  'projects',
  'key_achievements',
  'certifications',
  'languages',
  'custom',
];

const iconMap: Record<SectionType, React.ReactNode> = {
  personal_info: <UserRound className="h-4 w-4" />,
  experience: <Briefcase className="h-4 w-4" />,
  education: <GraduationCap className="h-4 w-4" />,
  skills: <Sparkles className="h-4 w-4" />,
  projects: <FolderKanban className="h-4 w-4" />,
  certifications: <BadgeCheck className="h-4 w-4" />,
  languages: <Languages className="h-4 w-4" />,
  key_achievements: <Trophy className="h-4 w-4" />,
  custom: <PenTool className="h-4 w-4" />,
};

type SectionOption = {
  type: SectionType;
  label: string;
  description: string;
  icon: React.ReactNode;
  isRepeatable: boolean;
};

const buildSectionOptions = (): SectionOption[] =>
  sectionTypeOrder.map((type) => ({
    type,
    label: SECTION_TYPE_META[type].label,
    description: SECTION_TYPE_META[type].description,
    icon: iconMap[type],
    isRepeatable: SECTION_TYPE_META[type].isRepeatable,
  }));

const isNonRepeatableAndAlreadyAdded = (type: SectionType, existingSections: SectionType[]): boolean =>
  !SECTION_TYPE_META[type].isRepeatable && existingSections.includes(type);

export function AddSectionModal({ open, onOpenChange }: AddSectionModalProps) {
  const resume = useResumeStore((state) => state.resume);
  const addSection = useResumeStore((state) => state.addSection);
  const undo = useResumeStore((state) => state.undo);
  const setDirty = useResumeStore((state) => state.setDirty);
  const setSaveError = useResumeStore((state) => state.setSaveError);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [pendingSectionType, setPendingSectionType] = React.useState<SectionType | null>(null);

  const options = React.useMemo(() => buildSectionOptions(), []);
  const existingSectionTypes = React.useMemo<SectionType[]>(
    () => resume?.sections.map((section) => section.type) ?? [],
    [resume]
  );
  const filteredOptions = React.useMemo(() => {
    const normalizedQuery = searchTerm.trim().toLowerCase();

    if (!normalizedQuery) {
      return options;
    }

    return options.filter((option) => {
      const searchableText = [option.label, option.description, option.type].join(' ').toLowerCase();
      return searchableText.includes(normalizedQuery);
    });
  }, [options, searchTerm]);

  const handleSelect = async (type: SectionType): Promise<void> => {
    if (!resume || pendingSectionType) {
      return;
    }

    if (isNonRepeatableAndAlreadyAdded(type, existingSectionTypes)) {
      return;
    }

    const nextSection = getDefaultSection(type, resume.id, resume.sections.length);
    const supabase = createClient();
    const insertedSectionId = nextSection.id;
    const insertedItem = nextSection.items[0] as any;

    addSection(nextSection);
    setPendingSectionType(type);

    try {
      const { error: sectionInsertError } = await supabase.from('resume_sections').insert({
        id: insertedSectionId,
        resume_id: resume.id,
        type: (nextSection.type === 'key_achievements' ? 'custom' : nextSection.type) as any,
        title: nextSection.title,
        position: nextSection.sortOrder,
        is_visible: nextSection.isVisible,
      });

      if (sectionInsertError) {
        throw new Error(sectionInsertError.message);
      }

      const { error: itemInsertError } = await supabase.from('section_items').insert({
        id: insertedItem.id,
        section_id: insertedItem.sectionId,
        position: insertedItem.sortOrder,
        data: insertedItem.data,
      });

      if (itemInsertError) {
        await supabase.from('resume_sections').delete().eq('id', insertedSectionId);
        throw new Error(itemInsertError.message);
      }

      setSaveError(null);
      setDirty(false);
      onOpenChange(false);
      setSearchTerm('');
      toastSuccess('Section added', `${nextSection.title} was added to your resume.`);
    } catch (error: unknown) {
      undo();
      const message = error instanceof Error ? error.message : 'Failed to add section';
      setSaveError(message);
      toastError('Could not add section', message);
    } finally {
      setPendingSectionType(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-hidden sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Add a section</DialogTitle>
          <DialogDescription>
            Choose a section type to expand your resume structure.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 space-y-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search sections"
              className="pl-10"
            />
          </div>

          <div className="max-h-[60vh] overflow-y-auto pr-1">
            <div className="grid gap-3 sm:grid-cols-2">
              <AnimatePresence initial={false} mode="popLayout">
                {filteredOptions.map((option) => {
                  const isDisabled = isNonRepeatableAndAlreadyAdded(option.type, existingSectionTypes);
                  const isPending = pendingSectionType === option.type;

                  return (
                    <motion.button
                      key={option.type}
                      layout
                      type="button"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.18 }}
                      disabled={isDisabled || Boolean(pendingSectionType)}
                      onClick={() => {
                        void handleSelect(option.type);
                      }}
                      className={cn(
                        'group flex min-h-35 flex-col rounded-2xl border p-4 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2',
                        isDisabled
                          ? 'cursor-not-allowed border-dashed border-zinc-200 bg-zinc-50 text-zinc-400'
                          : 'border-zinc-200 bg-white hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md',
                        isPending && 'pointer-events-none opacity-80'
                      )}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-950">
                          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : option.icon}
                        </div>
                        <span className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">
                          {option.isRepeatable ? 'Repeatable' : 'Single'}
                        </span>
                      </div>

                      <div className="mt-4 flex-1 space-y-2">
                        <h3 className="text-base font-semibold text-zinc-950">
                          {option.label}
                        </h3>
                        <p className="text-sm leading-6 text-zinc-500">
                          {option.description}
                        </p>
                      </div>

                      <div className="mt-4 flex items-center justify-between text-xs font-medium text-zinc-400">
                        <span>{SECTION_TYPE_META[option.type].description}</span>
                        <span>{isDisabled ? 'Already added' : 'Add section'}</span>
                      </div>
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </div>

            {filteredOptions.length === 0 ? (
              <div className="flex min-h-40 items-center justify-center rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 text-sm text-zinc-500">
                No sections match your search.
              </div>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}