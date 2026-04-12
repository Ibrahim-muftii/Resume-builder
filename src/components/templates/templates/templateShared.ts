import type { Resume, ResumeSection, SectionType } from '../../../../lib/types/resume';

export interface TemplateProps {
  resume: Resume;
  isPreview?: boolean;
  scale?: number;
}

const ignoredContentKeys = new Set(['type', 'level', 'proficiency']);

export const getVisibleSections = (resume: Resume): ResumeSection[] =>
  [...resume.sections]
    .filter((section) => section.isVisible)
    .sort((left, right) => left.sortOrder - right.sortOrder);

const hasValue = (value: unknown): boolean => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  if (typeof value === 'boolean') {
    return value;
  }

  return value !== null && value !== undefined;
};

export const hasSectionContent = (section: ResumeSection): boolean =>
  section.items.some((item) =>
    Object.entries(item.data).some(([key, value]) => {
      if (ignoredContentKeys.has(key)) {
        return false;
      }

      return hasValue(value);
    })
  );

export const getScaleClass = (scale?: number): string => {
  if (!scale || scale === 1) {
    return '';
  }

  if (scale <= 0.78) {
    return 'origin-top-left scale-[0.75]';
  }

  if (scale <= 0.88) {
    return 'origin-top-left scale-[0.85]';
  }

  if (scale <= 0.96) {
    return 'origin-top-left scale-[0.95]';
  }

  return 'origin-top-left scale-100';
};

export const getTemplateStyles = (resume: Resume) => {
  const { settings } = resume;
  if (!settings) return {};

  const fontSizeMap = {
    small: '0.85rem',
    medium: '1rem',
    large: '1.25rem',
  };

  return {
    '--font-family': `'${settings.fontFamily}', sans-serif`,
    '--font-size': fontSizeMap[settings.fontSize] || '1rem',
    '--primary-color': settings.primaryColor,
    '--background-color': settings.backgroundColor,
  } as React.CSSProperties;
};

export const FONT_LIST = [
  'Inter',
  'Roboto',
  'Playfair Display',
  'Outfit',
  'Open Sans',
  'Montserrat',
  'Lato',
  'Raleway',
  'Poppins'
];

export const sectionTypes = {
  personalInfo: 'personal_info' as SectionType,
  experience: 'experience' as SectionType,
  education: 'education' as SectionType,
  skills: 'skills' as SectionType,
  projects: 'projects' as SectionType,
  certifications: 'certifications' as SectionType,
  languages: 'languages' as SectionType,
  keyAchievements: 'key_achievements' as SectionType,
  custom: 'custom' as SectionType,
};
