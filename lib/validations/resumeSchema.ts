import { z } from 'zod';
import type * as ResumeTypes from '../types/resume';

const internationalPhoneRegex = /^\+?[0-9\s().-]{7,20}$/;

const hasAtLeastSevenDigits = (value: string): boolean => {
  const digits = value.replace(/\D/g, '');
  return digits.length >= 7;
};

const isValidDateString = (value: string): boolean => {
  const date = new Date(value);
  return !Number.isNaN(date.getTime());
};

const nonEmptyStringSchema = z.string().trim().min(1, 'This field is required');
const draftStringSchema = z.string().trim().min(0);

const urlOrEmptyStringSchema = z.union([
  z.literal(''),
  z.string().url('Must be a valid URL'),
]);

const optionalUrlSchema = z.union([urlOrEmptyStringSchema, z.undefined()]);

const nullableDateStringSchema = z.union([
  z.string().refine((val) => val === '' || isValidDateString(val), 'Must be a valid date string'),
  z.null(),
]).default('');

const requiredDateStringSchema = z.union([
  z.string().refine((val) => val === '' || isValidDateString(val), 'Must be a valid date string'),
  z.null(),
]).default('');

export const personalInfoSchema = z.object({
  type: z.literal('personal_info'),
  fullName: draftStringSchema,
  jobTitle: draftStringSchema,
  email: z.union([z.string().trim().email('Must be a valid email'), z.literal('')]).default(''),
  phone: z
    .string()
    .trim()
    .default('')
    .refine(
      (value: string) =>
        value === '' || (internationalPhoneRegex.test(value) && hasAtLeastSevenDigits(value)),
      'Must be a valid international phone number'
    ),
  location: draftStringSchema,
  website: optionalUrlSchema,
  linkedin: optionalUrlSchema,
  github: optionalUrlSchema,
  summary: draftStringSchema,
  avatarUrl: optionalUrlSchema,
});

export const experienceSchema = z.object({
  type: z.literal('experience'),
  company: draftStringSchema,
  position: draftStringSchema,
  location: draftStringSchema,
  startDate: nullableDateStringSchema,
  endDate: nullableDateStringSchema,
  isCurrent: z.boolean(),
  descriptionTitle: draftStringSchema,
  descriptionBullets: z.array(z.string().trim()),
});

export const educationSchema = z.object({
  type: z.literal('education'),
  institution: draftStringSchema,
  degree: draftStringSchema,
  field: draftStringSchema,
  location: draftStringSchema,
  startDate: nullableDateStringSchema,
  endDate: nullableDateStringSchema,
  isCurrent: z.boolean(),
  gpa: z.union([z.string(), z.undefined()]),
});

export const skillLevelSchema = z.enum([
  'beginner',
  'intermediate',
  'advanced',
  'expert',
]);

export const skillSchema = z.object({
  type: z.literal('skills'),
  name: draftStringSchema,
  level: skillLevelSchema,
  category: draftStringSchema,
});

export const projectSchema = z.object({
  type: z.literal('projects'),
  name: draftStringSchema,
  descriptionTitle: draftStringSchema,
  descriptionBullets: z.array(z.string().trim()),
  url: optionalUrlSchema,
  githubUrl: optionalUrlSchema,
});

export const certificationSchema = z.object({
  type: z.literal('certifications'),
  name: draftStringSchema,
  issuer: draftStringSchema,
  issueDate: z.union([requiredDateStringSchema, z.literal(''), z.null()]),
  expiryDate: z.union([requiredDateStringSchema, z.literal(''), z.null()]),
  credentialId: z.union([z.string(), z.undefined()]),
  url: optionalUrlSchema,
});

export const languageProficiencySchema = z.enum([
  'elementary',
  'limited_working',
  'professional_working',
  'full_professional',
  'native',
]);

export const languageSchema = z.object({
  type: z.literal('languages'),
  name: draftStringSchema,
  proficiency: languageProficiencySchema,
});

export const customSchema = z.object({
  type: z.literal('custom'),
  title: draftStringSchema,
  content: draftStringSchema,
});

export const keyAchievementSchema = z.object({
  type: z.literal('key_achievements'),
  title: draftStringSchema,
  description: draftStringSchema,
});

export const resumeSettingsSchema = z.object({
  fontSize: z.enum(['small', 'medium', 'large']).default('medium'),
  fontFamily: z.string().default('Inter'),
  primaryColor: z.string().default('#000000'),
  backgroundColor: z.string().default('#ffffff'),
  sidebarWidth: z.number().optional().default(40),
});

export const sectionItemDataSchema = z.discriminatedUnion('type', [
  personalInfoSchema,
  experienceSchema,
  educationSchema,
  skillSchema,
  projectSchema,
  certificationSchema,
  languageSchema,
  keyAchievementSchema,
  customSchema,
]);

const sectionItemSchema = z.object({
  id: nonEmptyStringSchema,
  sectionId: nonEmptyStringSchema,
  resumeId: nonEmptyStringSchema,
  sortOrder: z.number().int().nonnegative(),
  type: z.enum([
    'personal_info',
    'experience',
    'education',
    'skills',
    'projects',
    'certifications',
    'languages',
    'key_achievements',
    'custom',
  ]),
  data: sectionItemDataSchema,
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

const resumeSectionSchema = z.object({
  id: nonEmptyStringSchema,
  resumeId: nonEmptyStringSchema,
  type: z.enum([
    'personal_info',
    'experience',
    'education',
    'skills',
    'projects',
    'certifications',
    'languages',
    'key_achievements',
    'custom',
  ]),
  title: nonEmptyStringSchema,
  isVisible: z.boolean(),
  sortOrder: z.number().int().nonnegative(),
  items: z.array(sectionItemSchema),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const resumeSchema = z.object({
  id: nonEmptyStringSchema,
  userId: nonEmptyStringSchema,
  title: nonEmptyStringSchema,
  templateId: z.enum([
    'modern',
    'classic',
    'minimal',
    'creative',
    'executive',
    'professional',
  ]),
  settings: resumeSettingsSchema,
  sections: z.array(resumeSectionSchema),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type PersonalInfoSchemaType = z.infer<typeof personalInfoSchema>;
export type ExperienceSchemaType = z.infer<typeof experienceSchema>;
export type EducationSchemaType = z.infer<typeof educationSchema>;
export type SkillSchemaType = z.infer<typeof skillSchema>;
export type ProjectSchemaType = z.infer<typeof projectSchema>;
export type CertificationSchemaType = z.infer<typeof certificationSchema>;
export type LanguageSchemaType = z.infer<typeof languageSchema>;
export type CustomSchemaType = z.infer<typeof customSchema>;
export type KeyAchievementSchemaType = z.infer<typeof keyAchievementSchema>;
export type ResumeSettingsSchemaType = z.infer<typeof resumeSettingsSchema>;
export type SectionItemDataSchemaType = z.infer<typeof sectionItemDataSchema>;
export type ResumeSchemaType = z.infer<typeof resumeSchema>;

export type ImportedResumeTypes = {
  TemplateId: ResumeTypes.TemplateId;
  SectionType: ResumeTypes.SectionType;
  Resume: ResumeTypes.Resume;
  ResumeSection: ResumeTypes.ResumeSection;
  SectionItem: ResumeTypes.SectionItem;
  SectionItemData: ResumeTypes.SectionItemData;
  PersonalInfoData: ResumeTypes.PersonalInfoData;
  ExperienceData: ResumeTypes.ExperienceData;
  EducationData: ResumeTypes.EducationData;
  SkillData: ResumeTypes.SkillData;
  ProjectData: ResumeTypes.ProjectData;
  CertificationData: ResumeTypes.CertificationData;
  LanguageData: ResumeTypes.LanguageData;
  CustomData: ResumeTypes.CustomData;
  KeyAchievementData: ResumeTypes.KeyAchievementData;
  Template: ResumeTypes.Template;
  DragItem: ResumeTypes.DragItem;
};
