import { cn } from '../../../lib/utils';
import type { ResumeSection } from '../../../../lib/types/resume';
import { getScaleClass, getVisibleSections, hasSectionContent, sectionTypes, type TemplateProps } from './templateShared';

const levelWidths: Record<'beginner' | 'intermediate' | 'advanced' | 'expert', string> = {
  beginner: 'w-1/4',
  intermediate: 'w-1/2',
  advanced: 'w-3/4',
  expert: 'w-full',
};

const hasText = (value: string | undefined): boolean => Boolean(value && value.trim().length > 0);

const renderPersonalInfo = (section?: ResumeSection) => {
  if (!section || section.type !== sectionTypes.personalInfo) {
    return null;
  }

  const [item] = section.items;

  if (!item || item.type !== sectionTypes.personalInfo) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="aspect-square w-full rounded-3xl border border-white/15 bg-white/10" />
      <div className="space-y-2">
        {hasText(item.data.fullName) ? (
          <h1 className="text-3xl font-semibold leading-tight">{item.data.fullName}</h1>
        ) : null}
        {hasText(item.data.jobTitle) ? (
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-indigo-200">
            {item.data.jobTitle}
          </p>
        ) : null}
      </div>

      <div className="space-y-3 text-sm text-indigo-50/90">
        {hasText(item.data.email) ? <p className="break-all">{item.data.email}</p> : null}
        {hasText(item.data.phone) ? <p>{item.data.phone}</p> : null}
        {hasText(item.data.location) ? <p>{item.data.location}</p> : null}
        {hasText(item.data.website) ? <p className="break-all">{item.data.website}</p> : null}
        {hasText(item.data.linkedin) ? <p className="break-all">{item.data.linkedin}</p> : null}
        {hasText(item.data.github) ? <p className="break-all">{item.data.github}</p> : null}
      </div>

      {hasText(item.data.summary) ? <p className="text-sm leading-6 text-indigo-50/90">{item.data.summary}</p> : null}
    </div>
  );
};

const renderSkillSection = (section: ResumeSection) => {
  if (section.type !== sectionTypes.skills) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-100">
        {section.title}
      </h2>
      <div className="space-y-4">
        {section.items.map((item) => {
          if (item.type !== sectionTypes.skills || !hasText(item.data.name)) {
            return null;
          }

          return (
            <div key={item.id} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-white">{item.data.name}</span>
                {hasText(item.data.category) ? (
                  <span className="text-indigo-100/80">{item.data.category}</span>
                ) : null}
              </div>
              <div className="h-2 rounded-full bg-white/15">
                <div className={cn('h-2 rounded-full bg-indigo-300', levelWidths[item.data.level])} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const renderSimpleListSection = (section: ResumeSection) => {
  const items = section.items.filter((item) => {
    if (item.type === sectionTypes.languages) {
      return hasText(item.data.name);
    }

    if (item.type === sectionTypes.certifications) {
      return hasText(item.data.name) || hasText(item.data.issuer);
    }

    return false;
  });

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-100">
        {section.title}
      </h2>
      <div className="space-y-3 text-sm text-indigo-50/90">
        {items.map((item) => {
          if (item.type === sectionTypes.languages) {
            return (
              <div key={item.id} className="flex items-center justify-between gap-3">
                <span className="font-medium text-white">{item.data.name}</span>
                <span className="text-right text-indigo-100/80">{item.data.proficiency}</span>
              </div>
            );
          }

          return (
            <div key={item.id} className="space-y-1">
              {hasText(item.data.name) ? <p className="font-medium text-white">{item.data.name}</p> : null}
              {hasText(item.data.issuer) ? <p className="text-indigo-100/80">{item.data.issuer}</p> : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const renderMainSection = (section: ResumeSection) => {
  if (
    section.type !== sectionTypes.experience &&
    section.type !== sectionTypes.education &&
    section.type !== sectionTypes.projects &&
    section.type !== sectionTypes.custom
  ) {
    return null;
  }

  return (
    <section key={section.id} className="space-y-5">
      <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-700">
        {section.title}
      </h2>

      <div className="space-y-5">
        {section.items.map((item) => {
          if (section.type === sectionTypes.experience && item.type === sectionTypes.experience) {
            if (!hasText(item.data.company) && !hasText(item.data.position) && !hasText(item.data.description)) {
              return null;
            }

            return (
              <article key={item.id} className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-5">
                <div className="space-y-1">
                  {hasText(item.data.position) ? <h3 className="text-lg font-semibold text-zinc-950">{item.data.position}</h3> : null}
                  {hasText(item.data.company) ? <p className="text-sm font-medium text-indigo-700">{item.data.company}</p> : null}
                  {hasText(item.data.location) ? <p className="text-sm text-zinc-500">{item.data.location}</p> : null}
                </div>
                {hasText(item.data.description) ? <p className="mt-3 text-sm leading-6 text-zinc-700">{item.data.description}</p> : null}
                {item.data.achievements.length > 0 ? (
                  <ul className="mt-3 space-y-2 text-sm text-zinc-700">
                    {item.data.achievements.map((achievement, index) => (
                      <li key={`${item.id}-${index}`}>• {achievement}</li>
                    ))}
                  </ul>
                ) : null}
              </article>
            );
          }

          if (section.type === sectionTypes.education && item.type === sectionTypes.education) {
            if (!hasText(item.data.institution) && !hasText(item.data.degree) && !hasText(item.data.field)) {
              return null;
            }

            return (
              <article key={item.id} className="rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm">
                <div className="space-y-1">
                  {hasText(item.data.degree) ? <h3 className="text-lg font-semibold text-zinc-950">{item.data.degree}</h3> : null}
                  {hasText(item.data.field) ? <p className="text-sm font-medium text-indigo-700">{item.data.field}</p> : null}
                  {hasText(item.data.institution) ? <p className="text-sm text-zinc-700">{item.data.institution}</p> : null}
                  {hasText(item.data.location) ? <p className="text-sm text-zinc-500">{item.data.location}</p> : null}
                </div>
                {item.data.achievements.length > 0 ? (
                  <ul className="mt-3 space-y-2 text-sm text-zinc-700">
                    {item.data.achievements.map((achievement, index) => (
                      <li key={`${item.id}-${index}`}>• {achievement}</li>
                    ))}
                  </ul>
                ) : null}
              </article>
            );
          }

          if (section.type === sectionTypes.projects && item.type === sectionTypes.projects) {
            if (!hasText(item.data.name) && !hasText(item.data.description)) {
              return null;
            }

            return (
              <article key={item.id} className="rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm">
                {hasText(item.data.name) ? <h3 className="text-lg font-semibold text-zinc-950">{item.data.name}</h3> : null}
                {hasText(item.data.description) ? <p className="mt-2 text-sm leading-6 text-zinc-700">{item.data.description}</p> : null}
                {item.data.technologies.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-indigo-700">
                    {item.data.technologies.map((technology) => (
                      <span key={`${item.id}-${technology}`} className="rounded-full bg-indigo-50 px-3 py-1">
                        {technology}
                      </span>
                    ))}
                  </div>
                ) : null}
              </article>
            );
          }

          if (section.type === sectionTypes.custom && item.type === sectionTypes.custom) {
            if (!hasText(item.data.title) && !hasText(item.data.content)) {
              return null;
            }

            return (
              <article key={item.id} className="rounded-2xl border border-indigo-100 bg-indigo-50/30 p-5">
                {hasText(item.data.title) ? <h3 className="text-lg font-semibold text-zinc-950">{item.data.title}</h3> : null}
                {hasText(item.data.content) ? <p className="mt-2 text-sm leading-6 text-zinc-700">{item.data.content}</p> : null}
              </article>
            );
          }

          return null;
        })}
      </div>
    </section>
  );
};

export default function ModernTemplate({ resume, isPreview, scale }: TemplateProps) {
  const sections = getVisibleSections(resume).filter(hasSectionContent);
  const personalInfoSection = sections.find((section) => section.type === sectionTypes.personalInfo);
  const sidebarSections = sections.filter((section) =>
    [sectionTypes.skills, sectionTypes.languages, sectionTypes.certifications].includes(section.type)
  );
  const mainSections = sections.filter((section) =>
    [sectionTypes.experience, sectionTypes.education, sectionTypes.projects, sectionTypes.custom].includes(section.type)
  );

  return (
    <div className={cn('w-full bg-zinc-50 text-zinc-950', getScaleClass(scale), isPreview ? 'mx-auto' : '')}>
      <div className="grid min-h-full grid-cols-1 overflow-hidden rounded-3xl shadow-xl lg:grid-cols-[30%_70%]">
        <aside className="bg-indigo-950 px-8 py-10 text-white">
          {renderPersonalInfo(personalInfoSection)}
          <div className="mt-10 space-y-10">
            {sidebarSections.map((section) => {
              if (section.type === sectionTypes.skills) {
                return <div key={section.id}>{renderSkillSection(section)}</div>;
              }

              return <div key={section.id}>{renderSimpleListSection(section)}</div>;
            })}
          </div>
        </aside>

        <main className="space-y-10 bg-white px-8 py-10">
          {mainSections.map((section) => (
            <div key={section.id}>{renderMainSection(section)}</div>
          ))}
        </main>
      </div>
    </div>
  );
}
