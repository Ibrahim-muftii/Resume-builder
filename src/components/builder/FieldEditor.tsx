'use client';

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
import type { ResumeSection, SectionItem, SectionItemData } from '../../../lib/types/resume';

type SectionFormProps = {
  sectionId: string;
  item: SectionItem;
  onSave: (data: SectionItemData) => void;
  onCancel: () => void;
};

const getFormComponent = (sectionType: ResumeSection['type']) => {
  if (sectionType === 'personal_info') return PersonalInfoSection;
  if (sectionType === 'experience') return ExperienceSection;
  if (sectionType === 'education') return EducationSection;
  if (sectionType === 'skills') return SkillsSection;
  if (sectionType === 'projects') return ProjectsSection;
  if (sectionType === 'certifications') return CertificationsSection;
  if (sectionType === 'languages') return LanguagesSection;
  return CustomSection;
};

export default function FieldEditor() {
  const resume = useResumeStore((state) => state.resume);
  const activeSection = useResumeStore((state) => state.activeSection);
  const activeItem = useResumeStore((state) => state.activeItem);
  const setActiveItem = useResumeStore((state) => state.setActiveItem);
  const addItem = useResumeStore((state) => state.addItem);
  const updateItem = useResumeStore((state) => state.updateItem);
  const setDirty = useResumeStore((state) => state.setDirty);

  const section = useMemo(() => {
    if (!resume || !activeSection) {
      return null;
    }

    return resume.sections.find((candidate) => candidate.id === activeSection) ?? null;
  }, [resume, activeSection]);

  const selectedItem = useMemo(() => {
    if (!section) {
      return null;
    }

    if (activeItem) {
      return section.items.find((item) => item.id === activeItem) ?? section.items[0] ?? null;
    }

    return section.items[0] ?? null;
  }, [section, activeItem]);

  const FormComponent = section ? getFormComponent(section.type) : null;

  const handleSave = (data: SectionItemData): void => {
    if (!section || !selectedItem) {
      return;
    }

    const updatedItem: SectionItem = {
      ...selectedItem,
      data: data as SectionItem['data'],
      updatedAt: new Date().toISOString(),
    };

    updateItem(section.id, updatedItem);
    setDirty(true);
  };

  const handleAddItem = (): void => {
    if (!resume || !section || !SECTION_TYPE_META[section.type].isRepeatable) {
      return;
    }

    const now = new Date().toISOString();
    const newItem: SectionItem = {
      id: crypto.randomUUID(),
      sectionId: section.id,
      resumeId: resume.id,
      sortOrder: section.items.length,
      type: section.type,
      data: getDefaultSectionItem(section.type) as SectionItem['data'],
      createdAt: now,
      updatedAt: now,
    };

    addItem(section.id, newItem);
    setActiveItem(newItem.id);
    setDirty(true);
  };

  return (
    <AnimatePresence mode="wait">
      {!section || !selectedItem || !FormComponent ? (
        <motion.div
          key="empty"
          initial={{ x: 24, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 24, opacity: 0 }}
          className="flex h-full items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center text-sm text-zinc-500"
        >
          No section selected.
        </motion.div>
      ) : (
        <motion.div
          key={section.id}
          initial={{ x: 24, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 24, opacity: 0 }}
          className="h-full space-y-4 overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-4"
        >
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-zinc-900">{section.title}</h3>
            <p className="text-sm text-zinc-500">Edit item details and save changes.</p>
          </div>

          <FormComponent
            sectionId={section.id}
            item={selectedItem}
            onSave={handleSave}
            onCancel={() => setActiveItem(null)}
          />

          {SECTION_TYPE_META[section.type].isRepeatable ? (
            <div className="pt-2">
              <Button type="button" variant="outline" onClick={handleAddItem}>
                Add Item
              </Button>
            </div>
          ) : null}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
