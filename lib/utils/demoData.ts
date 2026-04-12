import type { Resume, ResumeSection, SectionItem, SectionType } from '../types/resume';

const DEMO_RESUME_ID = 'demo-resume-id';
const timestamp = new Date().toISOString();

const getDemoItemData = (type: SectionType): any => {
  switch (type) {
    case 'personal_info':
      return {
        type,
        fullName: 'Jonathan Doe',
        jobTitle: 'Senior Product Designer',
        email: 'jonathan.doe@example.com',
        phone: '+1 (555) 000-1111',
        location: 'San Francisco, CA',
        website: 'www.jdoe.design',
        summary: 'Expert Product Designer with over 8 years of experience crafting high-performance design systems and user interfaces. Proven track record in driving business growth through strategic UX improvements.',
      };
    case 'experience':
      return {
        type,
        company: 'TechFlow Solutions',
        position: 'Lead UX Designer',
        location: 'New York, NY',
        startDate: '2020-01-01',
        endDate: '',
        isCurrent: true,
        descriptionTitle: 'Key Responsibilities',
        descriptionBullets: [
          'Leading the design direction for the core platform, managing a cross-functional team of designers and researchers.',
          'Defining product strategy and design roadmaps aligned with business objectives.',
          'Redesigned the onboarding flow, leading to a 40% increase in user activation.',
          'Developed and launched a unified design system that reduced front-end development time by 30%.',
        ],
      };
    case 'education':
      return {
        type,
        institution: 'Stanford University',
        degree: 'Bachelor of Science',
        field: 'Computer Science & HCI',
        location: 'Stanford, CA',
        startDate: '2012-09-01',
        endDate: '2016-06-01',
        isCurrent: false,
      };
    case 'skills':
      return {
        type,
        name: 'Design Systems',
        level: 'expert',
        category: 'Design',
      };
    case 'projects':
      return {
        type,
        name: 'EcoTrack Platform',
        descriptionTitle: 'A comprehensive sustainability dashboard for enterprises to track and reduce carbon emissions.',
        descriptionBullets: [
          'Built interactive data visualizations using React and D3.js.',
          'Designed and implemented real-time emissions tracking pipeline.',
        ],
      };
    default:
      return {};
  }
};

const createDemoSection = (type: SectionType, title: string, order: number, itemsCount: number = 1): ResumeSection => {
  const sectionId = `demo-section-${type}`;
  return {
    id: sectionId,
    resumeId: DEMO_RESUME_ID,
    type,
    title,
    isVisible: true,
    sortOrder: order,
    createdAt: timestamp,
    updatedAt: timestamp,
    items: Array.from({ length: itemsCount }).map((_, i) => ({
      id: `demo-item-${type}-${i}`,
      sectionId,
      resumeId: DEMO_RESUME_ID,
      sortOrder: i,
      type,
      data: getDemoItemData(type),
      createdAt: timestamp,
      updatedAt: timestamp,
    })) as SectionItem[],
  } as any;
};

export const DEMO_RESUME: Resume = {
  id: DEMO_RESUME_ID,
  userId: 'demo-user',
  title: 'Demo Resume',
  templateId: 'modern',
  createdAt: timestamp,
  updatedAt: timestamp,
  sections: [
    createDemoSection('personal_info', 'Personal Info', 0),
    createDemoSection('experience', 'Professional Experience', 1, 2),
    createDemoSection('education', 'Academic History', 2),
    createDemoSection('skills', 'Core Expertise', 3, 4),
    createDemoSection('projects', 'Key Projects', 4),
  ],
};

export const enrichWithDemoData = (resume: Resume | null): Resume => {
  if (!resume) return DEMO_RESUME;

  const hasSections = resume.sections.length > 0;
  const hasItems = resume.sections.some(s => s.items.length > 0);
  const hasPersonalInfo = resume.sections.some(s => s.type === 'personal_info' && s.items.some(i => (i.data as any).fullName));

  if (hasSections && hasItems && hasPersonalInfo) {
    return resume;
  }

  return {
    ...DEMO_RESUME,
    id: resume.id,
    templateId: resume.templateId,
  };
};
