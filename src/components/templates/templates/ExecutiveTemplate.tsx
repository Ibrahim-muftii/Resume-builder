import type { ResumeSection } from '../../../../lib/types/resume';
import { cn } from '../../../lib/utils';
import { getScaleClass, getVisibleSections, hasSectionContent, sectionTypes, type TemplateProps } from './templateShared';

const hasText = (value: string | undefined): boolean => Boolean(value && value.trim().length > 0);

const renderCardSection = (section: ResumeSection) => (
  <section key={section.id} className="space-y-4">
    <h2 className="border-b-2 border-yellow-600 pb-2 text-sm font-semibold uppercase tracking-[0.22em] text-slate-950">
      {section.title}
    </h2>

    <div className="space-y-4">
      {section.items.map((item) => {
        if (section.type === sectionTypes.experience && item.type === sectionTypes.experience) {
          if (!hasText(item.data.company) && !hasText(item.data.position)) {
            return null;
          }

          return (
            <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-md">
              {hasText(item.data.position) ? <h3 className="text-lg font-semibold text-slate-950">{item.data.position}</h3> : null}
              {hasText(item.data.company) ? <p className="text-sm font-medium text-slate-700">{item.data.company}</p> : null}
              <div className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                {hasText(item.data.location) ? <p>{item.data.location}</p> : null}
                {hasText(item.data.description) ? <p>{item.data.description}</p> : null}
              </div>
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
            <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-md">
              {hasText(item.data.degree) ? <h3 className="text-lg font-semibold text-slate-950">{item.data.degree}</h3> : null}
              {hasText(item.data.field) ? <p className="text-sm font-medium text-slate-700">{item.data.field}</p> : null}
              {hasText(item.data.institution) ? <p className="text-sm text-slate-700">{item.data.institution}</p> : null}
              {hasText(item.data.location) ? <p className="mt-2 text-sm text-slate-500">{item.data.location}</p> : null}
            </article>
          );
        }

        if (section.type === sectionTypes.projects && item.type === sectionTypes.projects) {
          if (!hasText(item.data.name) && !hasText(item.data.description)) {
            return null;
          }

          return (
            <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-md">
              {hasText(item.data.name) ? <h3 className="text-lg font-semibold text-slate-950">{item.data.name}</h3> : null}
              {hasText(item.data.description) ? <p className="mt-2 text-sm leading-6 text-slate-700">{item.data.description}</p> : null}
              {item.data.technologies.length > 0 ? <p className="mt-3 text-sm text-slate-500">{item.data.technologies.join(' ')}</p> : null}
            </article>
          );
        }

        if (section.type === sectionTypes.skills && item.type === sectionTypes.skills) {
          if (!hasText(item.data.name)) {
            return null;
          }

          return (
            <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-md">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-950">{item.data.name}</h3>
              {hasText(item.data.category) ? <p className="mt-2 text-sm text-slate-500">{item.data.category}</p> : null}
            </article>
          );
        }

        if (section.type === sectionTypes.certifications && item.type === sectionTypes.certifications) {
          if (!hasText(item.data.name) && !hasText(item.data.issuer)) {
            return null;
          }

          return (
            <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-md">
              {hasText(item.data.name) ? <h3 className="text-lg font-semibold text-slate-950">{item.data.name}</h3> : null}
              {hasText(item.data.issuer) ? <p className="text-sm text-slate-700">{item.data.issuer}</p> : null}
            </article>
          );
        }

        if (section.type === sectionTypes.languages && item.type === sectionTypes.languages) {
          if (!hasText(item.data.name)) {
            return null;
          }

          return (
            <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-md">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-950">{item.data.name}</h3>
              <p className="mt-2 text-sm text-slate-500">{item.data.proficiency}</p>
            </article>
          );
        }

        if (section.type === sectionTypes.custom && item.type === sectionTypes.custom) {
          if (!hasText(item.data.title) && !hasText(item.data.content)) {
            return null;
          }

          return (
            <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-md">
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

export default function ExecutiveTemplate({ resume, isPreview, scale }: TemplateProps) {
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
    <div className={cn('w-full bg-slate-100 text-slate-950', getScaleClass(scale), isPreview ? 'mx-auto' : '')}>
      <div className="overflow-hidden rounded-3xl bg-white shadow-2xl">
        <header className="bg-slate-950 px-8 py-10 text-white">
          {personalInfoItem && personalInfoItem.type === sectionTypes.personalInfo ? (
            <div className="space-y-4">
              {personalInfoItem.data.fullName ? <h1 className="font-serif text-5xl font-semibold tracking-tight">{personalInfoItem.data.fullName}</h1> : null}
              {personalInfoItem.data.jobTitle ? <p className="text-base uppercase tracking-[0.2em] text-slate-300">{personalInfoItem.data.jobTitle}</p> : null}
            </div>
          ) : null}
        </header>

        <div className="grid grid-cols-1 gap-0 lg:grid-cols-[35%_65%]">
          <aside className="space-y-8 bg-slate-50 px-8 py-10">
            {personalInfoItem && personalInfoItem.type === sectionTypes.personalInfo ? (
              <section className="space-y-3 border-b border-slate-200 pb-6">
                {personalInfoItem.data.email ? <p className="text-sm text-slate-700">{personalInfoItem.data.email}</p> : null}
                {personalInfoItem.data.phone ? <p className="text-sm text-slate-700">{personalInfoItem.data.phone}</p> : null}
                {personalInfoItem.data.location ? <p className="text-sm text-slate-700">{personalInfoItem.data.location}</p> : null}
                {personalInfoItem.data.website ? <p className="text-sm text-slate-700">{personalInfoItem.data.website}</p> : null}
                {personalInfoItem.data.linkedin ? <p className="text-sm text-slate-700">{personalInfoItem.data.linkedin}</p> : null}
                {personalInfoItem.data.github ? <p className="text-sm text-slate-700">{personalInfoItem.data.github}</p> : null}
                {personalInfoItem.data.summary ? <p className="pt-2 text-sm leading-6 text-slate-700">{personalInfoItem.data.summary}</p> : null}
              </section>
            ) : null}

            {leftSections.map((section) => renderCardSection(section))}
          </aside>

          <main className="space-y-8 px-8 py-10">
            {rightSections.map((section) => renderCardSection(section))}
          </main>
        </div>
      </div>
    </div>
  );
}
