export type TemplateId =
  | 'modern'
  | 'classic'
  | 'minimal'
  | 'creative'
  | 'executive'
  | 'professional'
  | 'london';

export type SectionType =
  | 'personal_info'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'languages'
  | 'key_achievements'
  | 'custom';

export type PersonalInfoData = {
  type: 'personal_info';
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  github?: string;
  summary: string;
  avatarUrl?: string;
};

export type ExperienceData = {
  type: 'experience';
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  descriptionTitle: string;
  descriptionBullets: string[];
};

export type EducationData = {
  type: 'education';
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  gpa?: string;
};

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export type SkillData = {
  type: 'skills';
  name: string;
  level: SkillLevel;
  category: string;
};

export type ProjectData = {
  type: 'projects';
  name: string;
  descriptionTitle: string;
  descriptionBullets: string[];
  url?: string;
  githubUrl?: string;
};

export type CertificationData = {
  type: 'certifications';
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate: string;
  credentialId?: string;
  url?: string;
};

export type LanguageProficiency =
  | 'elementary'
  | 'limited_working'
  | 'professional_working'
  | 'full_professional'
  | 'native';

export type LanguageData = {
  type: 'languages';
  name: string;
  proficiency: LanguageProficiency;
};

export type CustomData = {
  type: 'custom';
  title: string;
  content: string;
};

export type KeyAchievementData = {
  type: 'key_achievements';
  title: string;
  description: string;
};

export type ResumeSettings = {
  fontSize: 'small' | 'medium' | 'large';
  fontFamily: string;
  primaryColor: string;
  backgroundColor: string;
  sidebarWidth?: number;
};

export type SectionItemData =
  | PersonalInfoData
  | ExperienceData
  | EducationData
  | SkillData
  | ProjectData
  | CertificationData
  | LanguageData
  | KeyAchievementData
  | CustomData;

type SectionItemByType<T extends SectionType> = {
  id: string;
  sectionId: string;
  resumeId: string;
  sortOrder: number;
  type: T;
  data: Extract<SectionItemData, { type: T }>;
  createdAt: string;
  updatedAt: string;
};

export type SectionItem = {
  [K in SectionType]: SectionItemByType<K>;
}[SectionType];

type ResumeSectionByType<T extends SectionType> = {
  id: string;
  resumeId: string;
  type: T;
  title: string;
  isVisible: boolean;
  sortOrder: number;
  items: Array<Extract<SectionItem, { type: T }>>;
  createdAt: string;
  updatedAt: string;
};

export type ResumeSection = {
  [K in SectionType]: ResumeSectionByType<K>;
}[SectionType];

export type Resume = {
  id: string;
  userId: string;
  title: string;
  templateId: TemplateId;
  settings: ResumeSettings;
  sections: ResumeSection[];
  createdAt: string;
  updatedAt: string;
};

export type Template = {
  id: TemplateId;
  name: string;
  description: string;
  isPremium: boolean;
};

export type DragItem =
  | {
      kind: 'section';
      id: string;
      sectionType: SectionType;
    }
  | {
      kind: 'item';
      id: string;
      sectionId: string;
      sectionType: SectionType;
    };
