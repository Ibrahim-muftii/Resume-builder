import type { ResumeSection } from '../../../../lib/types/resume';
import { cn } from '../../../lib/utils';
import { getScaleClass, getVisibleSections, hasSectionContent, sectionTypes, type TemplateProps } from './templateShared';

const hasText = (value: string | undefined): boolean => Boolean(value && value.trim().length > 0);

const renderSection = (section: ResumeSection) => (
  <section key={section.id} className="space-y-3">
    <h2 className="text-sm uppercase tracking-widest text-gray-400">{section.title}</h2>
    <div className="space-y-3 text-sm leading-6 text-zinc-900">
      {section.items.map((item) => {
        if (section.type === sectionTypes.experience && item.type === sectionTypes.experience) {
          if (!hasText(item.data.company) && !hasText(item.data.position)) {
            return null;
          }

          return (
            <article key={item.id}>
              {hasText(item.data.position) ? <h3 className="font-medium">{item.data.position}</h3> : null}
              {hasText(item.data.company) ? <p className="text-gray-400">{item.data.company}</p> : null}
              {hasText(item.data.description) ? <p className="text-gray-400">{item.data.description}</p> : null}
            </article>
          );
        }

        if (section.type === sectionTypes.education && item.type === sectionTypes.education) {
          if (!hasText(item.data.institution) && !hasText(item.data.degree)) {
            return null;
          }

          return (
            <article key={item.id}>
              {hasText(item.data.degree) ? <h3 className="font-medium">{item.data.degree}</h3> : null}
              {hasText(item.data.institution) ? <p className="text-gray-400">{item.data.institution}</p> : null}
            </article>
          );
        }

        if (section.type === sectionTypes.skills && item.type === sectionTypes.skills) {
          if (!hasText(item.data.name)) {
            return null;
          }

          return (
            <article key={item.id}>
              <h3 className="font-medium">{item.data.name}</h3>
              {hasText(item.data.category) ? <p className="text-gray-400">{item.data.category}</p> : null}
            </article>
          );
        }

        if (section.type === sectionTypes.projects && item.type === sectionTypes.projects) {
          if (!hasText(item.data.name) && !hasText(item.data.description)) {
            return null;
          }

          return (
            <article key={item.id}>
              {hasText(item.data.name) ? <h3 className="font-medium">{item.data.name}</h3> : null}
              {hasText(item.data.description) ? <p className="text-gray-400">{item.data.description}</p> : null}
            </article>
          );
        }

        if (section.type === sectionTypes.certifications && item.type === sectionTypes.certifications) {
          if (!hasText(item.data.name) && !hasText(item.data.issuer)) {
            return null;
          }

          return (
            <article key={item.id}>
              {hasText(item.data.name) ? <h3 className="font-medium">{item.data.name}</h3> : null}
              {hasText(item.data.issuer) ? <p className="text-gray-400">{item.data.issuer}</p> : null}
            </article>
          );
        }

        if (section.type === sectionTypes.languages && item.type === sectionTypes.languages) {
          if (!hasText(item.data.name)) {
            return null;
          }

          return (
            <article key={item.id}>
              <h3 className="font-medium">{item.data.name}</h3>
              <p className="text-gray-400">{item.data.proficiency}</p>
            </article>
          );
        }

        if (section.type === sectionTypes.custom && item.type === sectionTypes.custom) {
          if (!hasText(item.data.title) && !hasText(item.data.content)) {
            return null;
          }

          return (
            <article key={item.id}>
              {hasText(item.data.title) ? <h3 className="font-medium">{item.data.title}</h3> : null}
              {hasText(item.data.content) ? <p className="text-gray-400">{item.data.content}</p> : null}
            </article>
          );
        }

        return null;
      })}
    </div>
  </section>
);

export default function MinimalTemplate({ resume, isPreview, scale }: TemplateProps) {
  const sections = getVisibleSections(resume).filter(hasSectionContent);
  const personalInfoSection = sections.find((section) => section.type === sectionTypes.personalInfo);
  const personalInfoItem = personalInfoSection?.items[0];

  return (
    <div className={cn('w-full bg-white text-zinc-950', getScaleClass(scale), isPreview ? 'mx-auto' : '')}>
      <div className="space-y-10 p-10">
        {personalInfoItem && personalInfoItem.type === sectionTypes.personalInfo ? (
          <header className="space-y-3 text-left">
            {personalInfoItem.data.fullName ? <h1 className="text-4xl font-semibold tracking-tight">{personalInfoItem.data.fullName}</h1> : null}
            <div className="space-y-1 text-sm text-gray-400">
              {personalInfoItem.data.jobTitle ? <p>{personalInfoItem.data.jobTitle}</p> : null}
              {personalInfoItem.data.email ? <p>{personalInfoItem.data.email}</p> : null}
              {personalInfoItem.data.phone ? <p>{personalInfoItem.data.phone}</p> : null}
              {personalInfoItem.data.location ? <p>{personalInfoItem.data.location}</p> : null}
              {personalInfoItem.data.website ? <p>{personalInfoItem.data.website}</p> : null}
              {personalInfoItem.data.linkedin ? <p>{personalInfoItem.data.linkedin}</p> : null}
              {personalInfoItem.data.github ? <p>{personalInfoItem.data.github}</p> : null}
            </div>
            {personalInfoItem.data.summary ? <p className="max-w-3xl text-sm leading-7 text-gray-400">{personalInfoItem.data.summary}</p> : null}
          </header>
        ) : null}

        <div className="space-y-10">
          {sections
            .filter((section) => section.type !== sectionTypes.personalInfo)
            .map((section) => renderSection(section))}
        </div>
      </div>
    </div>
  );
}
