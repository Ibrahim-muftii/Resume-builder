'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BadgeCheck,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  FolderKanban,
  GraduationCap,
  GripVertical,
  Languages,
  PenTool,
  Sparkles,
  Trash2,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { useResumeStore } from '../../../lib/stores/resumeStore';
import type { ResumeSection, SectionType } from '../../../lib/types/resume';

type DraggableSectionProps = {
  section: ResumeSection;
  isSelected: boolean;
  children: ReactNode;
};

const sectionTypeIcons: Record<SectionType, typeof User> = {
  personal_info: User,
  experience: Briefcase,
  education: GraduationCap,
  skills: Sparkles,
  projects: FolderKanban,
  certifications: BadgeCheck,
  languages: Languages,
  custom: PenTool,
};

export default function DraggableSection({ section, isSelected, children }: DraggableSectionProps) {
  const toggleSectionVisibility = useResumeStore((state) => state.toggleSectionVisibility);
  const removeSection = useResumeStore((state) => state.removeSection);
  const setActiveSection = useResumeStore((state) => state.setActiveSection);

  const [collapsed, setCollapsed] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const isPersonalInfo = section.type === 'personal_info';
  const Icon = useMemo(() => sectionTypeIcons[section.type], [section.type]);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: section.id,
    disabled: isPersonalInfo,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={cn(
          'group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all',
          isSelected && 'shadow-[inset_4px_0_0_0_rgb(5,150,105)] border-emerald-300 shadow-md',
          isDragging && 'opacity-50 shadow-lg'
        )}
        {...attributes}
        {...(isPersonalInfo ? {} : listeners)}
      >
        <motion.div
          layout
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className={cn(
            'flex cursor-grab items-center gap-2 border-b border-zinc-200 px-3 py-3 transition-colors active:cursor-grabbing',
            !isPersonalInfo && 'hover:bg-emerald-50',
            isPersonalInfo && 'cursor-default'
          )}
        >
          {!isPersonalInfo && (
            <GripVertical className="h-5 w-5 flex-shrink-0 text-zinc-400 transition-colors group-hover:text-emerald-500" />
          )}
          <button
            type="button"
            className="flex min-w-0 flex-1 items-center gap-2 text-left"
            onClick={() => setActiveSection(section.id)}
          >
            <Icon className="h-5 w-5 flex-shrink-0 text-zinc-500" />
            <span className="truncate text-sm font-medium text-zinc-900">
              {section.title}
            </span>
          </button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => toggleSectionVisibility(section.id)}
            className="h-8 w-8 p-0"
            aria-label={section.isVisible ? 'Hide section' : 'Show section'}
          >
            {section.isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setCollapsed((current) => !current)}
            aria-label={collapsed ? 'Expand section' : 'Collapse section'}
          >
            {collapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </Button>

          {!isPersonalInfo ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-red-500 hover:text-red-500"
              onClick={() => setDeleteOpen(true)}
              aria-label="Delete section"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          ) : null}
        </motion.div>

        <AnimatePresence initial={false}>
          {!collapsed ? (
            <motion.div
              key="content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="overflow-hidden"
            >
              <div className="p-3">{children}</div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Section</DialogTitle>
            <DialogDescription>
              This will remove the section and all items inside it.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                removeSection(section.id);
                setDeleteOpen(false);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
