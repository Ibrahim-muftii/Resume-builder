import type * as ResumeTypes from '../types/resume';

export const SAMPLE_DATA: Record<ResumeTypes.SectionType, ResumeTypes.SectionItemData> = {
  personal_info: {
    type: 'personal_info',
    fullName: 'Jonathan Doe',
    jobTitle: 'Senior Software Engineer',
    email: 'jonathan.doe@example.com',
    phone: '+1 (555) 000-1234',
    location: 'San Francisco, CA',
    website: 'https://jdoe.dev',
    linkedin: 'linkedin.com/in/jdoe',
    github: 'github.com/jdoe',
    summary: 'Innovative Software Engineer with 8+ years of experience in building scalable web applications. Expert in React, Node.js, and cloud architecture. Proven track record of leading teams and delivering high-quality products.',
    avatarUrl: '',
  },
  experience: {
    type: 'experience',
    company: 'Tech Solutions Inc.',
    position: 'Senior Frontend Developer',
    location: 'Remote',
    startDate: '2020-01',
    endDate: '',
    isCurrent: true,
    descriptionTitle: 'Key Responsibilities',
    descriptionBullets: [
      'Leading the frontend team in developing a modern SaaS platform using Next.js and Tailwind CSS.',
      'Architecting scalable component systems and design tokens for cross-team consistency.',
      'Conducting code reviews and establishing best practices for React development.',
      'Improved application performance by 40% through code splitting and lazy loading.',
      'Integrated Supabase for real-time data synchronization and authentication.',
    ],
  },
  education: {
    type: 'education',
    institution: 'University of Technology',
    degree: 'Bachelor of Science',
    field: 'Computer Science',
    location: 'Austin, TX',
    startDate: '2012-09',
    endDate: '2016-05',
    isCurrent: false,
    gpa: '3.8/4.0',
  },
  skills: {
    type: 'skills',
    name: 'React / Next.js',
    level: 'expert',
    category: 'Frontend',
  },
  projects: {
    type: 'projects',
    name: 'Open Source UI Library',
    descriptionTitle: 'A comprehensive collection of accessible and reusable components for React.',
    descriptionBullets: [
      'Built with React, TypeScript, and Storybook for component documentation.',
      'Implemented accessible design patterns following WAI-ARIA guidelines.',
      'Published to npm with automated CI/CD pipeline.',
    ],
    url: 'https://ui-lib.example.com',
    githubUrl: 'https://github.com/jdoe/ui-lib',
  },
  certifications: {
    type: 'certifications',
    name: 'AWS Certified Solutions Architect',
    issuer: 'Amazon Web Services',
    issueDate: '2022-03',
    expiryDate: '2025-03',
    credentialId: 'AWS-123456',
    url: 'https://aws.amazon.com/verification',
  },
  languages: {
    type: 'languages',
    name: 'English',
    proficiency: 'native',
  },
  custom: {
    type: 'custom',
    title: 'Volunteering',
    content: 'Volunteered as a Coding Instructor for underprivileged youth at local community center.',
  },
};

export function getSampleSectionItem(type: ResumeTypes.SectionType): ResumeTypes.SectionItemData {
  return SAMPLE_DATA[type];
}
