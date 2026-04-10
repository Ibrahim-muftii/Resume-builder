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
        if (section.type === 'experience' && item.type === 'experience') {
          const data = item.data;
          if (!hasText(data.company) && !hasText(data.position)) {
            return null;
          }

          return (
            <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-md">
              {hasText(data.position) ? <h3 className="text-lg font-semibold text-slate-950">{data.position}</h3> : null}
              {hasText(data.company) ? <p className="text-sm font-medium text-slate-700">{data.company}</p> : null}
              <div className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                {hasText(data.location) ? <p>{data.location}</p> : null}
                {hasText(data.description) ? <p>{data.description}</p> : null}
              </div>
              {data.achievements?.length > 0 ? (
                <ul className="mt-3 space-y-2 text-sm text-slate-700">
                  {data.achievements.map((achievement, index) => (
                    <li key={`${item.id}-${index}`}>• {achievement}</li>
                  ))}
                </ul>
              ) : null}
            </article>
          );
        }

        if (section.type === 'education' && item.type === 'education') {
          const data = item.data;
          if (!hasText(data.institution) && !hasText(data.degree)) {
            return null;
          }

          return (
            <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-md">
              {hasText(data.degree) ? <h3 className="text-lg font-semibold text-slate-950">{data.degree}</h3> : null}
              {hasText(data.field) ? <p className="text-sm font-medium text-slate-700">{data.field}</p> : null}
              {hasText(data.institution) ? <p className="text-sm text-slate-700">{data.institution}</p> : null}
              {hasText(data.location) ? <p className="mt-2 text-sm text-slate-500">{data.location}</p> : null}
            </article>
          );
        }

        if (section.type === 'projects' && item.type === 'projects') {
          const data = item.data;
          if (!hasText(data.name) && !hasText(data.description)) {
            return null;
          }

          return (
            <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-md">
              {hasText(data.name) ? <h3 className="text-lg font-semibold text-slate-950">{data.name}</h3> : null}
              {hasText(data.description) ? <p className="mt-2 text-sm leading-6 text-slate-700">{data.description}</p> : null}
              {data.technologies?.length > 0 ? <p className="mt-3 text-sm text-slate-500">{data.technologies.join(' ')}</p> : null}
            </article>
          );
        }

        if (section.type === 'skills' && item.type === 'skills') {
          const data = item.data;
          if (!hasText(data.name)) {
            return null;
          }

          return (
            <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-md">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-950">{data.name}</h3>
              {hasText(data.category) ? <p className="mt-2 text-sm text-slate-500">{data.category}</p> : null}
            </article>
          );
        }

        if (section.type === 'certifications' && item.type === 'certifications') {
          const data = item.data;
          if (!hasText(data.name) && !hasText(data.issuer)) {
            return null;
          }

          return (
            <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-md">
              {hasText(data.name) ? <h3 className="text-lg font-semibold text-slate-950">{data.name}</h3> : null}
              {hasText(data.issuer) ? <p className="text-sm text-slate-700">{data.issuer}</p> : null}
            </article>
          );
        }

        if (section.type === 'languages' && item.type === 'languages') {
          const data = item.data;
          if (!hasText(data.name)) {
            return null;
          }

          return (
            <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-md">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-950">{data.name}</h3>
              <p className="mt-2 text-sm text-slate-500">{data.proficiency}</p>
            </article>
          );
        }

        if (section.type === 'custom' && item.type === 'custom') {
          const data = item.data;
          if (!hasText(data.title) && !hasText(data.content)) {
            return null;
          }

          return (
            <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-md">
              {hasText(data.title) ? <h3 className="text-lg font-semibold text-slate-950">{data.title}</h3> : null}
              {hasText(data.content) ? <p className="mt-2 text-sm leading-6 text-slate-700">{data.content}</p> : null}
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
  const isDemo = resume.id === 'demo-resume-id';
  
  const displaySections = isDemo ? resume.sections : sections;
  const personalInfoSection = displaySections.find((section) => section.type === 'personal_info');
  const personalInfoItem = personalInfoSection?.items[0];
  const leftSections = displaySections.filter((section) =>
    ['skills', 'languages', 'certifications'].includes(section.type)
  );
  const rightSections = displaySections.filter((section) =>
    ['experience', 'education', 'projects', 'custom'].includes(section.type)
  );

  return (
    <div className={cn('w-full min-h-[1100px] bg-slate-100 text-slate-950', getScaleClass(scale), isPreview ? 'mx-auto' : '')}>
      <div className="overflow-hidden rounded-3xl bg-white shadow-2xl">
        <header className="bg-slate-950 px-8 py-10 text-white">
          {personalInfoItem && personalInfoItem.type === 'personal_info' ? (
            (() => {
              const data = personalInfoItem.data;
              return (
                <div className="space-y-4">
                  {data.fullName ? <h1 className="font-serif text-5xl font-semibold tracking-tight">{data.fullName}</h1> : null}
                  {data.jobTitle ? <p className="text-base uppercase tracking-[0.2em] text-slate-300">{data.jobTitle}</p> : null}
                </div>
              );
            })()
          ) : null}
        </header>

        <div className="grid grid-cols-1 gap-0 lg:grid-cols-[35%_65%]">
          <aside className="space-y-8 bg-slate-50 px-8 py-10">
            {personalInfoItem && personalInfoItem.type === 'personal_info' ? (
              (() => {
                const data = personalInfoItem.data;
                return (
                  <section className="space-y-3 border-b border-slate-200 pb-6">
                    {data.email ? <p className="text-sm text-slate-700">{data.email}</p> : null}
                    {data.phone ? <p className="text-sm text-slate-700">{data.phone}</p> : null}
                    {data.location ? <p className="text-sm text-slate-700">{data.location}</p> : null}
                    {data.website ? <p className="text-sm text-slate-700">{data.website}</p> : null}
                    {data.linkedin ? <p className="text-sm text-slate-700">{data.linkedin}</p> : null}
                    {data.github ? <p className="text-sm text-slate-700">{data.github}</p> : null}
                    {data.summary ? <p className="pt-2 text-sm leading-6 text-slate-700">{data.summary}</p> : null}
                  </section>
                );
              })()
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
