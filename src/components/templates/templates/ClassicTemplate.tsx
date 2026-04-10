import type { ResumeSection } from '../../../../lib/types/resume';
import { cn } from '../../../lib/utils';
import { getScaleClass, getVisibleSections, hasSectionContent, sectionTypes, type TemplateProps } from './templateShared';

const hasText = (value: string | undefined): boolean => Boolean(value && value.trim().length > 0);

const renderSection = (section: ResumeSection) => {
  return (
    <section key={section.id} className="space-y-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide">{section.title}</h2>
      <div className="space-y-4 text-sm leading-6">
        {section.items.map((item) => {
          if (section.type === 'experience' && item.type === 'experience') {
            const data = item.data;
            if (!hasText(data.company) && !hasText(data.position)) {
              return null;
            }

            return (
              <article key={item.id} className="space-y-1">
                {hasText(data.position) ? <h3 className="font-semibold">{data.position}</h3> : null}
                {hasText(data.company) ? <p>{data.company}</p> : null}
                {hasText(data.location) ? <p>{data.location}</p> : null}
                {data.achievements?.length > 0 ? (
                  <ul className="space-y-1">
                    {data.achievements.map((achievement, index) => (
                      <li key={`${item.id}-${index}`}>{achievement}</li>
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
              <article key={item.id} className="space-y-1">
                {hasText(data.degree) ? <h3 className="font-semibold">{data.degree}</h3> : null}
                {hasText(data.field) ? <p>{data.field}</p> : null}
                {hasText(data.institution) ? <p>{data.institution}</p> : null}
                {data.achievements?.length > 0 ? (
                  <ul className="space-y-1">
                    {data.achievements.map((achievement, index) => (
                      <li key={`${item.id}-${index}`}>{achievement}</li>
                    ))}
                  </ul>
                ) : null}
              </article>
            );
          }

          if (section.type === 'skills' && item.type === 'skills') {
            const data = item.data;
            if (!hasText(data.name)) {
              return null;
            }

            return (
              <article key={item.id} className="space-y-1">
                <h3 className="font-semibold">{data.name}</h3>
                {hasText(data.category) ? <p>{data.category}</p> : null}
              </article>
            );
          }

          if (section.type === 'projects' && item.type === 'projects') {
            const data = item.data;
            if (!hasText(data.name) && !hasText(data.description)) {
              return null;
            }

            return (
              <article key={item.id} className="space-y-1">
                {hasText(data.name) ? <h3 className="font-semibold">{data.name}</h3> : null}
                {hasText(data.description) ? <p>{data.description}</p> : null}
                {data.technologies?.length > 0 ? <p>{data.technologies.join(' ')}</p> : null}
              </article>
            );
          }

          if (section.type === 'certifications' && item.type === 'certifications') {
            const data = item.data;
            if (!hasText(data.name) && !hasText(data.issuer)) {
              return null;
            }

            return (
              <article key={item.id} className="space-y-1">
                {hasText(data.name) ? <h3 className="font-semibold">{data.name}</h3> : null}
                {hasText(data.issuer) ? <p>{data.issuer}</p> : null}
              </article>
            );
          }

          if (section.type === 'languages' && item.type === 'languages') {
            const data = item.data;
            if (!hasText(data.name)) {
              return null;
            }

            return (
              <article key={item.id} className="space-y-1">
                <h3 className="font-semibold">{data.name}</h3>
                <p>{data.proficiency}</p>
              </article>
            );
          }

          if (section.type === 'custom' && item.type === 'custom') {
            const data = item.data;
            if (!hasText(data.title) && !hasText(data.content)) {
              return null;
            }

            return (
              <article key={item.id} className="space-y-1">
                {hasText(data.title) ? <h3 className="font-semibold">{data.title}</h3> : null}
                {hasText(data.content) ? <p>{data.content}</p> : null}
              </article>
            );
          }

          return null;
        })}
      </div>
    </section>
  );
};

export default function ClassicTemplate({ resume, isPreview, scale }: TemplateProps) {
  const sections = getVisibleSections(resume).filter(hasSectionContent);
  const isDemo = resume.id === 'demo-resume-id';
  
  const displaySections = isDemo ? resume.sections : sections;
  const personalInfoSection = displaySections.find((section) => section.type === 'personal_info');
  const contentSections = displaySections.filter((section) => section.type !== 'personal_info');
  const personalInfoItem = personalInfoSection?.items[0];

  return (
    <div className={cn('w-full min-h-[1100px] bg-white text-black', getScaleClass(scale), isPreview ? 'mx-auto' : '')}>
      <div className="space-y-8 rounded-3xl border border-black px-8 py-10 font-serif">
        {personalInfoItem && personalInfoItem.type === 'personal_info' ? (
          (() => {
            const data = personalInfoItem.data;
            return (
              <header className="space-y-4 text-center">
                {data.fullName ? <h1 className="text-4xl font-bold">{data.fullName}</h1> : null}
                {data.jobTitle ? <p className="text-base">{data.jobTitle}</p> : null}
                <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
                  {data.email ? <span>{data.email}</span> : null}
                  {data.phone ? <span>{data.phone}</span> : null}
                  {data.location ? <span>{data.location}</span> : null}
                  {data.website ? <span>{data.website}</span> : null}
                  {data.linkedin ? <span>{data.linkedin}</span> : null}
                  {data.github ? <span>{data.github}</span> : null}
                </div>
                {data.summary ? <p className="text-sm leading-7">{data.summary}</p> : null}
              </header>
            );
          })()
        ) : null}

        <div className="space-y-8">
          {contentSections.map((section, index) => (
            <div key={section.id}>
              {index > 0 ? <div className="my-8 border-t border-black" /> : null}
              {renderSection(section)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
