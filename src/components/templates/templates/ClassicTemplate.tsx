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
          if (section.type === sectionTypes.experience && item.type === sectionTypes.experience) {
            if (!hasText(item.data.company) && !hasText(item.data.position)) {
              return null;
            }

            return (
              <article key={item.id} className="space-y-1">
                {hasText(item.data.position) ? <h3 className="font-semibold">{item.data.position}</h3> : null}
                {hasText(item.data.company) ? <p>{item.data.company}</p> : null}
                {hasText(item.data.location) ? <p>{item.data.location}</p> : null}
                {item.data.achievements.length > 0 ? (
                  <ul className="space-y-1">
                    {item.data.achievements.map((achievement, index) => (
                      <li key={`${item.id}-${index}`}>{achievement}</li>
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
              <article key={item.id} className="space-y-1">
                {hasText(item.data.degree) ? <h3 className="font-semibold">{item.data.degree}</h3> : null}
                {hasText(item.data.field) ? <p>{item.data.field}</p> : null}
                {hasText(item.data.institution) ? <p>{item.data.institution}</p> : null}
                {item.data.achievements.length > 0 ? (
                  <ul className="space-y-1">
                    {item.data.achievements.map((achievement, index) => (
                      <li key={`${item.id}-${index}`}>{achievement}</li>
                    ))}
                  </ul>
                ) : null}
              </article>
            );
          }

          if (section.type === sectionTypes.skills && item.type === sectionTypes.skills) {
            if (!hasText(item.data.name)) {
              return null;
            }

            return (
              <article key={item.id} className="space-y-1">
                <h3 className="font-semibold">{item.data.name}</h3>
                {hasText(item.data.category) ? <p>{item.data.category}</p> : null}
              </article>
            );
          }

          if (section.type === sectionTypes.projects && item.type === sectionTypes.projects) {
            if (!hasText(item.data.name) && !hasText(item.data.description)) {
              return null;
            }

            return (
              <article key={item.id} className="space-y-1">
                {hasText(item.data.name) ? <h3 className="font-semibold">{item.data.name}</h3> : null}
                {hasText(item.data.description) ? <p>{item.data.description}</p> : null}
                {item.data.technologies.length > 0 ? <p>{item.data.technologies.join(' ')}</p> : null}
              </article>
            );
          }

          if (section.type === sectionTypes.certifications && item.type === sectionTypes.certifications) {
            if (!hasText(item.data.name) && !hasText(item.data.issuer)) {
              return null;
            }

            return (
              <article key={item.id} className="space-y-1">
                {hasText(item.data.name) ? <h3 className="font-semibold">{item.data.name}</h3> : null}
                {hasText(item.data.issuer) ? <p>{item.data.issuer}</p> : null}
              </article>
            );
          }

          if (section.type === sectionTypes.languages && item.type === sectionTypes.languages) {
            if (!hasText(item.data.name)) {
              return null;
            }

            return (
              <article key={item.id} className="space-y-1">
                <h3 className="font-semibold">{item.data.name}</h3>
                <p>{item.data.proficiency}</p>
              </article>
            );
          }

          if (section.type === sectionTypes.custom && item.type === sectionTypes.custom) {
            if (!hasText(item.data.title) && !hasText(item.data.content)) {
              return null;
            }

            return (
              <article key={item.id} className="space-y-1">
                {hasText(item.data.title) ? <h3 className="font-semibold">{item.data.title}</h3> : null}
                {hasText(item.data.content) ? <p>{item.data.content}</p> : null}
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
  const personalInfoSection = sections.find((section) => section.type === sectionTypes.personalInfo);
  const contentSections = sections.filter((section) => section.type !== sectionTypes.personalInfo);
  const personalInfoItem = personalInfoSection?.items[0];

  return (
    <div className={cn('w-full bg-white text-black', getScaleClass(scale), isPreview ? 'mx-auto' : '')}>
      <div className="space-y-8 rounded-3xl border border-black px-8 py-10 font-serif">
        {personalInfoItem && personalInfoItem.type === sectionTypes.personalInfo ? (
          <header className="space-y-4 text-center">
            {personalInfoItem.data.fullName ? <h1 className="text-4xl font-bold">{personalInfoItem.data.fullName}</h1> : null}
            {personalInfoItem.data.jobTitle ? <p className="text-base">{personalInfoItem.data.jobTitle}</p> : null}
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
              {personalInfoItem.data.email ? <span>{personalInfoItem.data.email}</span> : null}
              {personalInfoItem.data.phone ? <span>{personalInfoItem.data.phone}</span> : null}
              {personalInfoItem.data.location ? <span>{personalInfoItem.data.location}</span> : null}
              {personalInfoItem.data.website ? <span>{personalInfoItem.data.website}</span> : null}
              {personalInfoItem.data.linkedin ? <span>{personalInfoItem.data.linkedin}</span> : null}
              {personalInfoItem.data.github ? <span>{personalInfoItem.data.github}</span> : null}
            </div>
            {personalInfoItem.data.summary ? <p className="text-sm leading-7">{personalInfoItem.data.summary}</p> : null}
          </header>
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
