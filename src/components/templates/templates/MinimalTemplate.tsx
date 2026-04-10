import type { ResumeSection } from '../../../../lib/types/resume';
import { cn } from '../../../lib/utils';
import { getScaleClass, getVisibleSections, hasSectionContent, sectionTypes, type TemplateProps } from './templateShared';

const hasText = (value: string | undefined): boolean => Boolean(value && value.trim().length > 0);

const renderSection = (section: ResumeSection) => (
  <section key={section.id} className="space-y-3">
    <h2 className="text-sm uppercase tracking-widest text-gray-400">{section.title}</h2>
    <div className="space-y-3 text-sm leading-6 text-zinc-900">
      {section.items.map((item) => {
        if (section.type === 'experience' && item.type === 'experience') {
          const data = item.data;
          if (!hasText(data.company) && !hasText(data.position)) {
            return null;
          }

          return (
            <article key={item.id} className="space-y-4">
              <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline">
                {hasText(data.position) ? <h3 className="text-lg font-medium">{data.position}</h3> : null}
                <div className="text-xs text-gray-400">
                  {hasText(data.startDate) ? <span>{data.startDate}</span> : null}
                  {hasText(data.endDate) ? <span> — {data.endDate}</span> : hasText(data.startDate) && data.isCurrent ? <span> — Present</span> : null}
                </div>
              </div>
              {hasText(data.company) ? <p className="text-sm text-emerald-600">{data.company}</p> : null}
              {hasText(data.description) ? <p className="text-sm leading-7 text-gray-500">{data.description}</p> : null}
              {data.achievements?.length > 0 ? (
                <ul className="space-y-2 text-sm text-gray-500">
                  {data.achievements.map((achievement, index) => (
                    <li key={`${item.id}-${index}`} className="flex gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-200" />
                      {achievement}
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          );
        }

        if (section.type === 'education' && item.type === 'education') {
          const data = item.data;
          return (
            <article key={item.id} className="space-y-1">
              <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline">
                {hasText(data.degree) ? <h3 className="font-medium">{data.degree}</h3> : null}
                <div className="text-xs text-gray-400">
                  {hasText(data.startDate) ? <span>{data.startDate}</span> : null}
                  {hasText(data.endDate) ? <span> — {data.endDate}</span> : null}
                </div>
              </div>
              {hasText(data.institution) ? <p className="text-sm text-emerald-600">{data.institution}</p> : null}
            </article>
          );
        }

        if (section.type === 'skills' && item.type === 'skills') {
          const data = item.data;
          return (
            <article key={item.id} className="inline-block rounded-lg bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-800">
              {data.name}
            </article>
          );
        }

        if (section.type === 'projects' && item.type === 'projects') {
          const data = item.data;
          if (!hasText(data.name) && !hasText(data.description)) {
            return null;
          }

          return (
            <article key={item.id}>
              {hasText(data.name) ? <h3 className="font-medium">{data.name}</h3> : null}
              {hasText(data.description) ? <p className="text-gray-400">{data.description}</p> : null}
            </article>
          );
        }

        if (section.type === 'certifications' && item.type === 'certifications') {
          const data = item.data;
          if (!hasText(data.name) && !hasText(data.issuer)) {
            return null;
          }

          return (
            <article key={item.id}>
              {hasText(data.name) ? <h3 className="font-medium">{data.name}</h3> : null}
              {hasText(data.issuer) ? <p className="text-gray-400">{data.issuer}</p> : null}
            </article>
          );
        }

        if (section.type === 'languages' && item.type === 'languages') {
          const data = item.data;
          if (!hasText(data.name)) {
            return null;
          }

          return (
            <article key={item.id}>
              <h3 className="font-medium">{data.name}</h3>
              <p className="text-gray-400">{data.proficiency}</p>
            </article>
          );
        }

        if (section.type === 'custom' && item.type === 'custom') {
          const data = item.data;
          if (!hasText(data.title) && !hasText(data.content)) {
            return null;
          }

          return (
            <article key={item.id}>
              {hasText(data.title) ? <h3 className="font-medium">{data.title}</h3> : null}
              {hasText(data.content) ? <p className="text-gray-400">{data.content}</p> : null}
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
  const isDemo = resume.id === 'demo-resume-id';
  
  const displaySections = isDemo ? resume.sections : sections;
  const personalInfoSection = displaySections.find((section) => section.type === 'personal_info');
  const personalInfoItem = personalInfoSection?.items[0];

  return (
    <div className={cn('w-full min-h-[1100px] bg-white text-zinc-950', getScaleClass(scale), isPreview ? 'mx-auto' : '')}>
      <div className="space-y-10 p-10">
        {personalInfoItem && personalInfoItem.type === 'personal_info' ? (
          (() => {
            const data = personalInfoItem.data;
            return (
              <header className="space-y-3 text-left">
                {data.fullName ? <h1 className="text-4xl font-semibold tracking-tight">{data.fullName}</h1> : null}
                <div className="space-y-1 text-sm text-gray-400">
                  {data.jobTitle ? <p>{data.jobTitle}</p> : null}
                  {data.email ? <p>{data.email}</p> : null}
                  {data.phone ? <p>{data.phone}</p> : null}
                  {data.location ? <p>{data.location}</p> : null}
                  {data.website ? <p>{data.website}</p> : null}
                  {data.linkedin ? <p>{data.linkedin}</p> : null}
                  {data.github ? <p>{data.github}</p> : null}
                </div>
                {data.summary ? <p className="max-w-3xl text-sm leading-7 text-gray-400">{data.summary}</p> : null}
              </header>
            );
          })()
        ) : null}

        <div className="space-y-10">
          {displaySections
            .filter((section) => section.type !== 'personal_info')
            .map((section) => renderSection(section))}
        </div>
      </div>
    </div>
  );
}
