import type * as ResumeTypes from '../types/resume';

type SectionMeta = {
  label: string;
  description: string;
  icon: string;
  isRepeatable: boolean;
};

const now = (): string => new Date().toISOString();

export const SECTION_TYPE_META = {
  personal_info: {
    label: 'Personal Information',
    description: 'Basic contact and headline details for the resume.',
    icon: 'user',
    isRepeatable: false,
  },
  experience: {
    label: 'Experience',
    description: 'Work history entries with positions, dates, and outcomes.',
    icon: 'briefcase',
    isRepeatable: true,
  },
  education: {
    label: 'Education',
    description: 'Academic background, degrees, and achievements.',
    icon: 'graduation-cap',
    isRepeatable: true,
  },
  skills: {
    label: 'Skills',
    description: 'Individual skills with category and proficiency level.',
    icon: 'sparkles',
    isRepeatable: true,
  },
  projects: {
    label: 'Projects',
    description: 'Portfolio and side projects with links and technologies.',
    icon: 'folder-kanban',
    isRepeatable: true,
  },
  certifications: {
    label: 'Certifications',
    description: 'Professional certifications and credential details.',
    icon: 'badge-check',
    isRepeatable: true,
  },
  languages: {
    label: 'Languages',
    description: 'Language fluency and proficiency information.',
    icon: 'languages',
    isRepeatable: true,
  },
  key_achievements: {
    label: 'Key Achievements',
    description: 'Specific accomplishments and wins you want to highlight.',
    icon: 'trophy',
    isRepeatable: true,
  },
  custom: {
    label: 'Custom',
    description: 'Flexible section for custom resume content.',
    icon: 'pen-tool',
    isRepeatable: true,
  },
} satisfies Record<ResumeTypes.SectionType, SectionMeta>;

export function getDefaultSectionItem(
  type: ResumeTypes.SectionType
): ResumeTypes.SectionItemData {
  switch (type) {
    case 'personal_info':
      return {
        type,
        fullName: '',
        jobTitle: '',
        email: '',
        phone: '',
        location: '',
        website: '',
        linkedin: '',
        github: '',
        summary: '',
        avatarUrl: '',
      };
    case 'experience':
      return {
        type,
        company: '',
        position: '',
        location: '',
        startDate: '',
        endDate: '',
        isCurrent: false,
        descriptionTitle: '',
        descriptionBullets: [],
      };
    case 'education':
      return {
        type,
        institution: '',
        degree: '',
        field: '',
        location: '',
        startDate: '',
        endDate: '',
        isCurrent: false,
        gpa: '',
      };
    case 'skills':
      return {
        type,
        name: '',
        level: 'beginner',
        category: '',
      };
    case 'projects':
      return {
        type,
        name: '',
        descriptionTitle: '',
        descriptionBullets: [],
        url: '',
        githubUrl: '',
      };
    case 'certifications':
      return {
        type,
        name: '',
        issuer: '',
        issueDate: '',
        expiryDate: '',
        credentialId: '',
        url: '',
      };
    case 'languages':
      return {
        type,
        name: '',
        proficiency: 'elementary',
      };
    case 'key_achievements':
      return {
        type,
        title: '',
        description: '',
      };
    case 'custom':
      return {
        type,
        title: '',
        content: '',
      };
    default: {
      const exhaustiveCheck: never = type;
      return exhaustiveCheck;
    }
  }
}

export function getDefaultSection(
  type: ResumeTypes.SectionType,
  resumeId: string,
  position: number
): ResumeTypes.ResumeSection {
  const sectionId = crypto.randomUUID();
  const itemId = crypto.randomUUID();
  const timestamp = now();
  const defaultItem = getDefaultSectionItem(type);

  return {
    id: sectionId,
    resumeId,
    type,
    title: SECTION_TYPE_META[type].label,
    isVisible: true,
    sortOrder: position,
    createdAt: timestamp,
    updatedAt: timestamp,
    items: [
      {
        id: itemId,
        sectionId,
        resumeId,
        sortOrder: 0,
        type,
        data: defaultItem as ResumeTypes.SectionItemData,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    ] as ResumeTypes.ResumeSection['items'],
  };
}