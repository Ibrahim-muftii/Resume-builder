import { create } from 'zustand';
import type { Resume, ResumeSection, SectionItem, TemplateId } from '../types/resume';

type ResumeStoreState = {
  resume: Resume | null;
  isDirty: boolean;
  isSaving: boolean;
  saveError: string | null;
  activeSection: string | null;
  activeItem: string | null;
  history: Resume[];
  setResume: (resume: Resume) => void;
  updateResumeTitle: (title: string) => void;
  updateTemplate: (templateId: TemplateId) => void;
  updateSettings: (settings: Partial<Resume['settings']>) => void;
  reorderSections: (sections: ResumeSection[]) => void;
  toggleSectionVisibility: (sectionId: string) => void;
  addSection: (section: ResumeSection) => void;
  removeSection: (sectionId: string) => void;
  addItem: (sectionId: string, item: SectionItem) => void;
  updateItem: (sectionId: string, item: SectionItem) => void;
  removeItem: (sectionId: string, itemId: string) => void;
  reorderItems: (sectionId: string, items: SectionItem[]) => void;
  setActiveSection: (sectionId: string | null) => void;
  setActiveItem: (itemId: string | null) => void;
  setDirty: (isDirty: boolean) => void;
  setSaving: (isSaving: boolean) => void;
  setSaveError: (error: string | null) => void;
  undo: () => void;
  pushHistory: () => void;
};

const cloneResume = (resume: Resume): Resume => structuredClone(resume);

const updateSectionItems = (
  resume: Resume,
  sectionId: string,
  transform: (items: SectionItem[]) => SectionItem[]
): Resume => ({
  ...resume,
  sections: resume.sections.map((section): ResumeSection => {
    if (section.id !== sectionId) {
      return section;
    }

    const nextItems = transform(section.items as SectionItem[]);

    return {
      ...section,
      items: nextItems as ResumeSection['items'],
    } as ResumeSection;
  }),
});

const withResumeUpdate = (
  getState: () => ResumeStoreState,
  setState: (
    partial:
      | Partial<ResumeStoreState>
      | ((state: ResumeStoreState) => Partial<ResumeStoreState>)
  ) => void,
  updater: (resume: Resume) => Resume
): void => {
  const currentResume = getState().resume;
  if (!currentResume) {
    return;
  }

  getState().pushHistory();
  setState({
    resume: updater(cloneResume(currentResume)),
    isDirty: true,
  });
};

export const useResumeStore = create<ResumeStoreState>((set, get) => ({
  resume: null,
  isDirty: false,
  isSaving: false,
  saveError: null,
  activeSection: null,
  activeItem: null,
  history: [],
  setResume: (resume) =>
    set({
      resume: {
        ...cloneResume(resume),
        settings: resume.settings || {
          fontSize: 'medium',
          fontFamily: 'Inter',
          primaryColor: '#000000',
          backgroundColor: '#ffffff',
        },
      },
      isDirty: false,
      saveError: null,
      activeSection: null,
      activeItem: null,
      history: [],
    }),
  updateResumeTitle: (title) =>
    withResumeUpdate(get, set, (resume) => ({
      ...resume,
      title,
    })),
  updateTemplate: (templateId) =>
    withResumeUpdate(get, set, (resume) => ({
      ...resume,
      templateId,
    })),
  updateSettings: (settings) =>
    withResumeUpdate(get, set, (resume) => ({
      ...resume,
      settings: {
        ...resume.settings,
        ...settings,
      },
    })),
  reorderSections: (sections) =>
    withResumeUpdate(get, set, (resume) => ({
      ...resume,
      sections: sections.map((section, index) => ({
        ...section,
        sortOrder: index,
      })),
    })),
  toggleSectionVisibility: (sectionId) =>
    withResumeUpdate(get, set, (resume) => ({
      ...resume,
      sections: resume.sections.map((section) =>
        section.id === sectionId
          ? { ...section, isVisible: !section.isVisible }
          : section
      ),
    })),
  addSection: (section) =>
    withResumeUpdate(get, set, (resume) => ({
      ...resume,
      sections: [...resume.sections, { ...section, sortOrder: resume.sections.length }],
    })),
  removeSection: (sectionId) =>
    withResumeUpdate(get, set, (resume) => ({
      ...resume,
      sections: resume.sections
        .filter((section) => section.id !== sectionId)
        .map((section, index) => ({
          ...section,
          sortOrder: index,
        })),
    })),
  addItem: (sectionId, item) =>
    withResumeUpdate(get, set, (resume) =>
      updateSectionItems(resume, sectionId, (items) => [
        ...items,
        { ...item, sectionId, sortOrder: items.length },
      ])
    ),
  updateItem: (sectionId, item) =>
    withResumeUpdate(get, set, (resume) =>
      updateSectionItems(resume, sectionId, (items) =>
        items.map((existingItem) =>
          existingItem.id === item.id ? { ...item, sectionId } : existingItem
        )
      )
    ),
  removeItem: (sectionId, itemId) =>
    withResumeUpdate(get, set, (resume) =>
      updateSectionItems(resume, sectionId, (items) =>
        items
          .filter((item) => item.id !== itemId)
          .map((item, index) => ({
            ...item,
            sortOrder: index,
          }))
      )
    ),
  reorderItems: (sectionId, items) =>
    withResumeUpdate(get, set, (resume) =>
      updateSectionItems(resume, sectionId, () =>
        items.map((item, index) => ({
          ...item,
          sectionId,
          sortOrder: index,
        }))
      )
    ),
  setActiveSection: (sectionId) => set({ activeSection: sectionId }),
  setActiveItem: (itemId) => set({ activeItem: itemId }),
  setDirty: (isDirty) => set({ isDirty }),
  setSaving: (isSaving) => set({ isSaving }),
  setSaveError: (error) => set({ saveError: error }),
  undo: () =>
    set((state) => {
      if (state.history.length === 0) {
        return {};
      }

      const [previousResume, ...restHistory] = state.history;

      return {
        resume: cloneResume(previousResume),
        history: restHistory,
        isDirty: true,
      };
    }),
  pushHistory: () =>
    set((state) => {
      if (!state.resume) {
        return {};
      }

      return {
        history: [cloneResume(state.resume), ...state.history].slice(0, 10),
      };
    }),
}));
