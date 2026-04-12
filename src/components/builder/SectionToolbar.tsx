'use client';

import {
  BadgeCheck,
  Briefcase,
  Eye,
  EyeOff,
  FolderKanban,
  GraduationCap,
  GripVertical,
  Languages,
  Paintbrush,
  PenTool,
  Sparkles,
  Trophy,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useResumeStore } from '../../../lib/stores/resumeStore';
import { useUiStore } from '../../../lib/stores/uiStore';
import type { ResumeSection, SectionType } from '../../../lib/types/resume';

const sectionTypeIcons: Record<SectionType, typeof User> = {
  personal_info: User,
  experience: Briefcase,
  education: GraduationCap,
  skills: Sparkles,
  projects: FolderKanban,
  certifications: BadgeCheck,
  languages: Languages,
  key_achievements: Trophy,
  custom: PenTool,
};

const orderSections = (sections: ResumeSection[]): ResumeSection[] => {
  const sorted = [...sections].sort((left, right) => left.sortOrder - right.sortOrder);
  const personalInfo = sorted.find((section) => section.type === 'personal_info');
  const others = sorted.filter((section) => section.type !== 'personal_info');
  return personalInfo ? [personalInfo, ...others] : others;
};

export default function SectionToolbar() {
  const resume = useResumeStore((state) => state.resume);
  const activeSection = useResumeStore((state) => state.activeSection);
  const setActiveSection = useResumeStore((state) => state.setActiveSection);
  const toggleSectionVisibility = useResumeStore((state) => state.toggleSectionVisibility);
  const setIsAddSectionModalOpen = useUiStore((state) => state.setIsAddSectionModalOpen);
  const setIsTemplateSelectorOpen = useUiStore((state) => state.setIsTemplateSelectorOpen);

  const sections = resume ? orderSections(resume.sections) : [];

  return (
    <div className="flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-3">
      <div className="mb-3 px-1">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-500">
          Sections
        </h2>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-1 py-2">
        <button
          type="button"
          onClick={() => setActiveSection('design')}
          className={cn(
            'group relative flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left transition-all',
            activeSection === 'design'
              ? 'border-emerald-300 bg-emerald-50 shadow-[inset_4px_0_0_0_rgb(5,150,105)] shadow-sm'
              : 'border-zinc-200 bg-white hover:border-emerald-200 hover:bg-emerald-50'
          )}
        >
          <Paintbrush className={cn('h-5 w-5 shrink-0', activeSection === 'design' ? 'text-emerald-600' : 'text-zinc-500')} />
          <div className="min-w-0 flex-1">
            <span className="block truncate text-sm font-bold text-zinc-900">
              Design & Settings
            </span>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400">Appearance</span>
          </div>
        </button>

        <div className="h-px bg-zinc-100 my-2" />
        {sections.map((section, index) => {
          const Icon = sectionTypeIcons[section.type];
          const isActive = activeSection === section.id;

          return (
            <button
              key={section.id}
              type="button"
              onClick={() => setActiveSection(section.id)}
              className={cn(
                'group relative flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left transition-all',
                isActive
                  ? 'border-emerald-300 bg-emerald-50 shadow-[inset_4px_0_0_0_rgb(5,150,105)] shadow-sm'
                  : 'border-zinc-200 bg-white hover:border-emerald-200 hover:bg-emerald-50'
              )}
            >
              <Icon className={cn('h-5 w-5 shrink-0', isActive ? 'text-emerald-600' : 'text-zinc-500')} />
              <div className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-zinc-900">
                  {section.title}
                </span>
                <span className="block text-xs text-zinc-500">{index + 1} of {sections.length}</span>
              </div>
              <span
                role="button"
                tabIndex={0}
                onClick={(event) => {
                  event.stopPropagation();
                  toggleSectionVisibility(section.id);
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    toggleSectionVisibility(section.id);
                  }
                }}
                className={cn(
                  'shrink-0 rounded-md p-1.5 transition-colors',
                  isActive ? 'text-emerald-600 hover:bg-emerald-100' : 'text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600'
                )}
              >
                {section.isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 space-y-2 border-t border-zinc-200 pt-4">
        <Button
          type="button"
          className="w-full bg-emerald-600 text-white hover:bg-emerald-700"
          onClick={() => setIsAddSectionModalOpen(true)}
        >
          + Add Section
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full border-zinc-300 hover:bg-zinc-50"
          onClick={() => setIsTemplateSelectorOpen(true)}
        >
          Change Template
        </Button>
      </div>
    </div>
  );
}
