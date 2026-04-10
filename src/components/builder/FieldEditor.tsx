'use client';

import { Plus, Trash2, ChevronRight } from 'lucide-react';
import { useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import PersonalInfoSection from '@/components/sections/PersonalInfoSection';
import ExperienceSection from '@/components/sections/ExperienceSection';
import EducationSection from '@/components/sections/EducationSection';
import SkillsSection from '@/components/sections/SkillsSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import CertificationsSection from '@/components/sections/CertificationsSection';
import LanguagesSection from '@/components/sections/LanguagesSection';
import CustomSection from '@/components/sections/CustomSection';
import { useResumeStore } from '../../../lib/stores/resumeStore';
import { getDefaultSectionItem, SECTION_TYPE_META } from '../../../lib/utils/sectionDefaults';
import type { ResumeSection, SectionItem, SectionItemData, SectionType } from '../../../lib/types/resume';
import { cn } from '@/lib/utils';

const getFormComponent = (sectionType: SectionType) => {
  switch (sectionType) {
    case 'personal_info': return PersonalInfoSection;
    case 'experience': return ExperienceSection;
    case 'education': return EducationSection;
    case 'skills': return SkillsSection;
    case 'projects': return ProjectsSection;
    case 'certifications': return CertificationsSection;
    case 'languages': return LanguagesSection;
    default: return CustomSection;
  }
};

export default function FieldEditor() {
  const resume = useResumeStore((state) => state.resume);
  const activeSectionId = useResumeStore((state) => state.activeSection);
  const activeItemId = useResumeStore((state) => state.activeItem);
  const setActiveItem = useResumeStore((state) => state.setActiveItem);
  const addItem = useResumeStore((state) => state.addItem);
  const updateItem = useResumeStore((state) => state.updateItem);
  const removeItem = useResumeStore((state) => state.removeItem);
  const setDirty = useResumeStore((state) => state.setDirty);

  const section = useMemo(() => {
    if (!resume || !activeSectionId) return null;
    return resume.sections.find((s) => s.id === activeSectionId) ?? null;
  }, [resume, activeSectionId]);

  const selectedItem = useMemo(() => {
    if (!section) return null;
    if (activeItemId) {
      return section.items.find((i) => i.id === activeItemId) ?? null;
    }
    // For non-repeatable sections, always show the first item
    if (!SECTION_TYPE_META[section.type].isRepeatable) {
        return section.items[0] ?? null;
    }
    return null; // Return null to show the list for repeatable sections
  }, [section, activeItemId]);

  const handleSave = (data: SectionItemData): void => {
    if (!section || !selectedItem) return;

    const updatedItem: SectionItem = {
      ...selectedItem,
      data: data as SectionItem['data'],
      updatedAt: new Date().toISOString(),
    };

    updateItem(section.id, updatedItem);
    setDirty(true);
  };

  const handleAddItem = (): void => {
    if (!resume || !section) return;

    const newItemId = crypto.randomUUID();
    const now = new Date().toISOString();
    const newItem: SectionItem = {
      id: newItemId,
      sectionId: section.id,
      resumeId: resume.id,
      sortOrder: section.items.length,
      type: section.type,
      data: getDefaultSectionItem(section.type) as SectionItem['data'],
      createdAt: now,
      updatedAt: now,
    };

    addItem(section.id, newItem);
    setActiveItem(newItemId);
  };

  const getItemLabel = (item: SectionItem): string => {
    const data = item.data as any;
    switch (item.type) {
      case 'personal_info': return data.fullName || 'Untitled';
      case 'experience': return data.company || data.position || 'Untitled Experience';
      case 'education': return data.institution || data.degree || 'Untitled Education';
      case 'skills': return data.name || 'Untitled Skill';
      case 'projects': return data.name || 'Untitled Project';
      case 'certifications': return data.name || 'Untitled Certification';
      case 'languages': return data.name || 'Untitled Language';
      case 'custom': return data.title || 'Untitled Custom Section';
      default: return 'Untitled Item';
    }
  };

  if (!section) {
    return (
      <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center text-sm text-zinc-500">
        Select a section from the left to start editing.
      </div>
    );
  }

  const FormComponent = selectedItem ? getFormComponent(section.type) : null;
  const isRepeatable = SECTION_TYPE_META[section.type].isRepeatable;

  return (
    <div className="h-full space-y-5 overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-6 custom-scrollbar">
      <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-slate-900">{section.title}</h3>
          <p className="text-xs font-medium text-slate-500">
            {selectedItem ? 'Edit item details.' : 'Manage section items.'}
          </p>
        </div>
        {selectedItem && isRepeatable && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setActiveItem(null)}
            className="text-xs font-bold text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
          >
            Back to List
          </Button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {selectedItem && FormComponent ? (
          <motion.div
            key={`form-${selectedItem.id}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <FormComponent
              sectionId={section.id}
              item={selectedItem}
              onSave={handleSave}
              onCancel={() => isRepeatable ? setActiveItem(null) : null}
            />
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-4"
          >
            {isRepeatable && (
              <Button 
                onClick={handleAddItem} 
                className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 font-bold shadow-lg shadow-emerald-100 transition-all hover:scale-[1.01] flex gap-2"
              >
                <Plus className="h-4 w-4" />
                Add New {section.title.replace(/s$/, '')}
              </Button>
            )}

            <div className="space-y-2">
              {section.items.length === 0 ? (
                <p className="py-8 text-center text-sm text-zinc-500 italic">No items added yet.</p>
              ) : (
                section.items.map((item) => (
                  <div
                    key={item.id}
                    className="group flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-emerald-200 hover:bg-emerald-50/50"
                  >
                    <button
                      type="button"
                      onClick={() => setActiveItem(item.id)}
                      className="flex min-w-0 flex-1 items-center gap-3 text-left"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 group-hover:bg-emerald-100 group-hover:text-emerald-600">
                        {getItemLabel(item).charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-bold text-slate-900 leading-none mb-1">
                          {getItemLabel(item)}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {item.type}
                        </span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-emerald-500" />
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => removeItem(section.id, item.id)}
                      className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
