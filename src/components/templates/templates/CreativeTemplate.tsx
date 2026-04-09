import {
  Briefcase,
  Github,
  Globe,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  GraduationCap,
  FolderKanban,
  BadgeCheck,
  Languages,
  PenTool,
} from 'lucide-react';
import type { ResumeSection } from '../../../../lib/types/resume';
import { cn } from '../../../lib/utils';
import { getScaleClass, getVisibleSections, hasSectionContent, sectionTypes, type TemplateProps } from './templateShared';

const hasText = (value: string | undefined): boolean => Boolean(value && value.trim().length > 0);

const iconClass = 'h-4 w-4 text-rose-500';

const personalIconMap = {
  email: Mail,
  phone: Phone,
  location: MapPin,
  website: Globe,
  linkedin: Linkedin,
  github: Github,
} as const;

const sectionIconMap: Record<string, typeof Briefcase> = {
  [sectionTypes.experience]: Briefcase,
  [sectionTypes.education]: GraduationCap,
  [sectionTypes.projects]: FolderKanban,
  [sectionTypes.certifications]: BadgeCheck,
  [sectionTypes.languages]: Languages,
  [sectionTypes.custom]: PenTool,
  [sectionTypes.skills]: Sparkles,
  [sectionTypes.personalInfo]: Briefcase,
};

const renderInfoLine = (icon: typeof Mail, value: string) => {
  const Icon = icon;
  return (
    <div className="flex items-start gap-3 text-sm">
      <Icon className={iconClass} />
      <span className="break-all">{value}</span>
    </div>
  );
};

const renderSection = (section: ResumeSection) => {
  const SectionIcon = sectionIconMap[section.type] ?? Briefcase;

  return (
    <section key={section.id} className="space-y-4">
      <div className="border-l-4 border-teal-500 pl-4">
        <div className="flex items-center gap-2">
          <SectionIcon className="h-5 w-5 text-teal-600" />
          <h2 className="text-lg font-black uppercase tracking-[0.18em] text-slate-950">{section.title}</h2>
        </div>
      </div>

      <div className="space-y-4">
        {section.items.map((item) => {
          if (section.type === sectionTypes.experience && item.type === sectionTypes.experience) {
            if (!hasText(item.data.company) && !hasText(item.data.position)) {
              return null;
            }

            return (
              <article key={item.id} className="rounded-2xl border border-teal-100 bg-white p-5 shadow-sm">
                <div className="space-y-1">
                  {hasText(item.data.position) ? <h3 className="text-lg font-semibold text-slate-950">{item.data.position}</h3> : null}
                  {hasText(item.data.company) ? <p className="font-medium text-teal-700">{item.data.company}</p> : null}
                  {hasText(item.data.location) ? <p className="text-sm text-slate-500">{item.data.location}</p> : null}
                </div>
                {hasText(item.data.description) ? <p className="mt-3 text-sm leading-6 text-slate-700">{item.data.description}</p> : null}
                {item.data.achievements.length > 0 ? (
                  <ul className="mt-3 space-y-2 text-sm text-slate-700">
                    {item.data.achievements.map((achievement, index) => (
                      <li key={`${item.id}-${index}`}>• {achievement}</li>
                    ))}
                  </ul>
                ) : null}
              </article>
            );
          }

          if (section.type === sectionTypes.education && item.type === sectionTypes.education) {
            if (!hasText(item.data.institution) && !hasText(item.data.degree)) {
              return null;
            }

            return (
              <article key={item.id} className="rounded-2xl border border-teal-100 bg-white p-5 shadow-sm">
                <div className="space-y-1">
                  {hasText(item.data.degree) ? <h3 className="text-lg font-semibold text-slate-950">{item.data.degree}</h3> : null}
                  {hasText(item.data.field) ? <p className="font-medium text-teal-700">{item.data.field}</p> : null}
                  {hasText(item.data.institution) ? <p className="text-sm text-slate-700">{item.data.institution}</p> : null}
                  {hasText(item.data.location) ? <p className="text-sm text-slate-500">{item.data.location}</p> : null}
                </div>
              </article>
            );
          }

          if (section.type === sectionTypes.projects && item.type === sectionTypes.projects) {
            if (!hasText(item.data.name) && !hasText(item.data.description)) {
              return null;
            }

            return (
              <article key={item.id} className="rounded-2xl border border-teal-100 bg-white p-5 shadow-sm">
                {hasText(item.data.name) ? <h3 className="text-lg font-semibold text-slate-950">{item.data.name}</h3> : null}
                {hasText(item.data.description) ? <p className="mt-2 text-sm leading-6 text-slate-700">{item.data.description}</p> : null}
                {item.data.technologies.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-white">
                    {item.data.technologies.map((technology) => (
                      <span key={`${item.id}-${technology}`} className="rounded-full bg-rose-500 px-3 py-1">
                        {technology}
                      </span>
                    ))}
                  </div>
                ) : null}
              </article>
            );
          }

          if (section.type === sectionTypes.skills && item.type === sectionTypes.skills) {
            if (!hasText(item.data.name)) {
              return null;
            }

            return (
              <article key={item.id} className="flex items-center justify-between gap-3 rounded-2xl border border-teal-100 bg-white p-4 shadow-sm">
                <div>
                  <h3 className="font-semibold text-slate-950">{item.data.name}</h3>
                  {hasText(item.data.category) ? <p className="text-sm text-slate-500">{item.data.category}</p> : null}
                </div>
                <div className="h-2 w-24 rounded-full bg-teal-100">
                  <div
                    className={cn(
                      'h-2 rounded-full bg-rose-500',
                      item.data.level === 'beginner'
                        ? 'w-1/4'
                        : item.data.level === 'intermediate'
                          ? 'w-1/2'
                          : item.data.level === 'advanced'
                            ? 'w-3/4'
                            : 'w-full'
                    )}
                  />
                </div>
              </article>
            );
          }

          if (section.type === sectionTypes.certifications && item.type === sectionTypes.certifications) {
            if (!hasText(item.data.name) && !hasText(item.data.issuer)) {
              return null;
            }

            return (
              <article key={item.id} className="rounded-2xl border border-teal-100 bg-white p-5 shadow-sm">
                {hasText(item.data.name) ? <h3 className="text-lg font-semibold text-slate-950">{item.data.name}</h3> : null}
                {hasText(item.data.issuer) ? <p className="text-sm font-medium text-teal-700">{item.data.issuer}</p> : null}
              </article>
            );
          }

          if (section.type === sectionTypes.languages && item.type === sectionTypes.languages) {
            if (!hasText(item.data.name)) {
              return null;
            }

            return (
              <article key={item.id} className="flex items-center justify-between gap-3 rounded-2xl border border-teal-100 bg-white p-4 shadow-sm">
                <h3 className="font-semibold text-slate-950">{item.data.name}</h3>
                <span className="text-sm text-slate-500">{item.data.proficiency}</span>
              </article>
            );
          }

          if (section.type === sectionTypes.custom && item.type === sectionTypes.custom) {
            if (!hasText(item.data.title) && !hasText(item.data.content)) {
              return null;
            }

            return (
              <article key={item.id} className="rounded-2xl border border-teal-100 bg-white p-5 shadow-sm">
                {hasText(item.data.title) ? <h3 className="text-lg font-semibold text-slate-950">{item.data.title}</h3> : null}
                {hasText(item.data.content) ? <p className="mt-2 text-sm leading-6 text-slate-700">{item.data.content}</p> : null}
              </article>
            );
          }

          return null;
        })}
      </div>
    </section>
  );
};

export default function CreativeTemplate({ resume, isPreview, scale }: TemplateProps) {
  const sections = getVisibleSections(resume).filter(hasSectionContent);
  const personalInfoSection = sections.find((section) => section.type === sectionTypes.personalInfo);
  const personalInfoItem = personalInfoSection?.items[0];
  const leftSections = sections.filter((section) =>
    [sectionTypes.skills, sectionTypes.languages, sectionTypes.certifications].includes(section.type)
  );
  const rightSections = sections.filter((section) =>
    [sectionTypes.experience, sectionTypes.education, sectionTypes.projects, sectionTypes.custom].includes(section.type)
  );

  return (
    <div className={cn('w-full bg-zinc-50 text-slate-950', getScaleClass(scale), isPreview ? 'mx-auto' : '')}>
      <div className="overflow-hidden rounded-3xl shadow-2xl">
        <header className="bg-teal-600 px-8 py-10 text-white">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              {personalInfoItem && personalInfoItem.type === sectionTypes.personalInfo && personalInfoItem.data.fullName ? (
                <h1 className="text-4xl font-black tracking-tight">{personalInfoItem.data.fullName}</h1>
              ) : null}
              {personalInfoItem && personalInfoItem.type === sectionTypes.personalInfo && personalInfoItem.data.jobTitle ? (
                <p className="text-lg font-medium text-teal-50">{personalInfoItem.data.jobTitle}</p>
              ) : null}
            </div>

            {personalInfoItem && personalInfoItem.type === sectionTypes.personalInfo ? (
              <div className="grid gap-3 text-sm text-teal-50 sm:grid-cols-2 xl:grid-cols-3">
                {personalInfoItem.data.email ? renderInfoLine(Mail, personalInfoItem.data.email) : null}
                {personalInfoItem.data.phone ? renderInfoLine(Phone, personalInfoItem.data.phone) : null}
                {personalInfoItem.data.location ? renderInfoLine(MapPin, personalInfoItem.data.location) : null}
                {personalInfoItem.data.website ? renderInfoLine(Globe, personalInfoItem.data.website) : null}
                {personalInfoItem.data.linkedin ? renderInfoLine(Linkedin, personalInfoItem.data.linkedin) : null}
                {personalInfoItem.data.github ? renderInfoLine(Github, personalInfoItem.data.github) : null}
              </div>
            ) : null}
          </div>
        </header>

        <div className="grid grid-cols-1 gap-0 bg-white lg:grid-cols-[35%_65%]">
          <aside className="space-y-8 bg-teal-50 px-8 py-10">
            {leftSections.map((section) => renderSection(section))}
          </aside>

          <main className="space-y-8 px-8 py-10">
            {rightSections.map((section) => renderSection(section))}
          </main>
        </div>
      </div>
    </div>
  );
}
