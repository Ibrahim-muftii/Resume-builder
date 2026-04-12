'use client';

import { useState, useMemo } from 'react';
import { ChevronRight, Layout, Type, Palette, ChevronLeft } from 'lucide-react';
import { useResumeStore } from '../../../lib/stores/resumeStore';
import { cn } from '@/lib/utils';
import { SectionIcon } from '../templates/templates/SectionIcon';
import PersonalInfoSection from '@/components/sections/PersonalInfoSection';
import ExperienceSection from '@/components/sections/ExperienceSection';
import EducationSection from '@/components/sections/EducationSection';
import SkillsSection from '@/components/sections/SkillsSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import CertificationsSection from '@/components/sections/CertificationsSection';
import LanguagesSection from '@/components/sections/LanguagesSection';
import KeyAchievementsSection from '@/components/sections/KeyAchievementsSection';
import CustomSection from '@/components/sections/CustomSection';
import type { SectionType, SectionItem, SectionItemData } from '../../../lib/types/resume';
import { SECTION_TYPE_META } from '../../../lib/utils/sectionDefaults';
import { Button } from '@/components/ui/button';

const getFormComponent = (sectionType: SectionType) => {
  switch (sectionType) {
    case 'personal_info': return PersonalInfoSection;
    case 'experience': return ExperienceSection;
    case 'education': return EducationSection;
    case 'skills': return SkillsSection;
    case 'projects': return ProjectsSection;
    case 'certifications': return CertificationsSection;
    case 'languages': return LanguagesSection;
    case 'key_achievements': return KeyAchievementsSection;
    default: return CustomSection;
  }
};

export function PreviewSidebar() {
  const resume = useResumeStore((state) => state.resume);
  const updateItem = useResumeStore((state) => state.updateItem);
  const setDirty = useResumeStore((state) => state.setDirty);
  
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const sections = useMemo(() => {
    if (!resume) return [];
    return resume.sections.filter(s => s.isVisible);
  }, [resume]);

  const activeSection = useMemo(() => {
    return sections.find(s => s.id === editingSectionId);
  }, [sections, editingSectionId]);

  const activeItem = useMemo(() => {
    if (!activeSection) return null;
    if (editingItemId) return activeSection.items.find(i => i.id === editingItemId);
    return activeSection.items[0];
  }, [activeSection, editingItemId]);

  const handleSave = (data: SectionItemData) => {
    if (!editingSectionId || !activeItem) return;
    updateItem(editingSectionId, { ...activeItem, data });
    setDirty(true);
    if (SECTION_TYPE_META[activeSection!.type].isRepeatable) {
        setEditingItemId(null);
    }
  };

  if (!resume) return null;

  return (
    <div className="flex h-full flex-col border-r border-zinc-200 bg-zinc-50/50">
      <div className="flex items-center justify-between border-b border-zinc-200 bg-white p-4">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 flex items-center gap-2">
            <Layout className="h-4 w-4 text-emerald-600" />
            Quick Edit
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {editingSectionId ? (
          <div className="space-y-6">
            <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => { setEditingSectionId(null); setEditingItemId(null); }}
                className="mb-4 flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900"
            >
                <ChevronLeft className="h-4 w-4" /> Back to Sections
            </Button>

            {activeSection && (
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <SectionIcon type={activeSection.type} className="h-5 w-5 text-emerald-600" />
                        <h3 className="text-lg font-bold text-slate-900">{activeSection.title}</h3>
                    </div>

                    {SECTION_TYPE_META[activeSection.type].isRepeatable && !editingItemId ? (
                        <div className="space-y-2">
                            {activeSection.items.map(item => (
                                <button 
                                    key={item.id}
                                    onClick={() => setEditingItemId(item.id)}
                                    className="flex w-full items-center justify-between rounded-xl border border-zinc-200 bg-white p-3 text-left transition-all hover:border-emerald-200 hover:bg-emerald-50/50"
                                >
                                    <span className="text-sm font-semibold text-slate-700 truncate">
                                        {(item.data as any).name || (item.data as any).company || (item.data as any).title || 'Untitled Item'}
                                    </span>
                                    <ChevronRight className="h-4 w-4 text-zinc-300" />
                                </button>
                            ))}
                        </div>
                    ) : (
                        activeItem && (
                            <div className="rounded-2xl border border-zinc-200 bg-white p-4">
                                {(() => {
                                    const Form = getFormComponent(activeSection.type);
                                    return (
                                        <Form 
                                            sectionId={activeSection.id}
                                            item={activeItem}
                                            onSave={handleSave}
                                            onCancel={() => setEditingItemId(null)}
                                        />
                                    );
                                })()}
                            </div>
                        )
                    )}
                </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setEditingSectionId(section.id)}
                className="group flex items-center justify-between rounded-2xl border border-zinc-200 bg-white p-4 transition-all hover:border-emerald-200 hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                    <SectionIcon type={section.type} className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <span className="block text-sm font-bold text-slate-900">{section.title}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {section.items.length} item{section.items.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-zinc-300 group-hover:text-emerald-500" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
