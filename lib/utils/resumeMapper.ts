import { sectionItemDataSchema } from '../validations/resumeSchema';
import { getDefaultSectionItem } from './sectionDefaults';
import type { Resume, ResumeSection, SectionItem, SectionItemData, SectionType, TemplateId } from '../types/resume';

export type ResumeRow = {
  id: string;
  user_id: string;
  title: string;
  template_id: TemplateId;
  settings: any;
  created_at: string;
  updated_at: string;
};

export type ResumeSectionRow = {
  id: string;
  resume_id: string;
  type: SectionType;
  title: string;
  sort_order?: number;
  position?: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
};

export type SectionItemRow = {
  id: string;
  section_id: string;
  sort_order?: number;
  position?: number;
  data: SectionItemData;
  created_at: string;
  updated_at: string;
};

export const mapResumeRowToResume = (
  resumeRow: ResumeRow, 
  sections: ResumeSectionRow[], 
  items: SectionItemRow[]
): Resume => {
  const itemsBySectionId = new Map<string, SectionItemRow[]>();

  items.forEach((item) => {
    const current = itemsBySectionId.get(item.section_id) ?? [];
    current.push(item);
    itemsBySectionId.set(item.section_id, current);
  });

  const mappedSections = sections.map((section) => {
    const sectionItems = itemsBySectionId.get(section.id) ?? [];
    
    const isKeyAchievements = section.type === 'custom' && (
      section.title === 'Key Achievements' || 
      sectionItems.some(item => (item.data as any)?.type === 'key_achievements')
    );
    
    const effectiveType = isKeyAchievements ? 'key_achievements' : section.type;

    const mappedItems = sectionItems.map((item) => {
      const dataToParse = {
        ...(item.data as any),
        type: effectiveType
      };
      const parsedData = sectionItemDataSchema.safeParse(dataToParse);
      const itemData = parsedData.success ? parsedData.data : getDefaultSectionItem(effectiveType);

      return {
        id: item.id,
        sectionId: item.section_id,
        resumeId: section.resume_id,
        sortOrder: item.sort_order ?? item.position ?? 0,
        type: effectiveType,
        data: itemData as Extract<SectionItemData, { type: SectionType }>,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      } as SectionItem;
    });

    return {
      id: section.id,
      resumeId: section.resume_id,
      type: effectiveType,
      title: section.title,
      isVisible: section.is_visible,
      sortOrder: section.sort_order ?? section.position ?? 0,
      createdAt: section.created_at,
      updatedAt: section.updated_at,
      items: mappedItems as ResumeSection['items'],
    } as ResumeSection;
  });

  let settings = resumeRow.settings;
  if (typeof settings === 'string') {
    try {
      settings = JSON.parse(settings);
    } catch (e) {
      settings = null;
    }
  }

  return {
    id: resumeRow.id,
    userId: resumeRow.user_id,
    title: resumeRow.title,
    templateId: resumeRow.template_id,
    settings: (settings && typeof settings === 'object') ? settings : {
      fontSize: 'medium',
      fontFamily: 'Inter',
      primaryColor: '#000000',
      backgroundColor: '#ffffff',
    },
    sections: mappedSections,
    createdAt: resumeRow.created_at,
    updatedAt: resumeRow.updated_at,
  };
};
