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
  if (!section || section.type !== 'personal_info') {
    return null;
  }

  const [item] = section.items;

  if (!item || item.type !== 'personal_info') {
    return null;
  }

  const data = item.data;

  return (
    <div className="space-y-6">
      <div className="aspect-square w-full rounded-3xl border border-white/15 bg-white/10" />
      <div className="space-y-2">
        {hasText(data.fullName) ? (
          <h1 className="text-3xl font-semibold leading-tight">{data.fullName}</h1>
        ) : null}
        {hasText(data.jobTitle) ? (
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-200">
            {data.jobTitle}
          </p>
        ) : null}
      </div>

      <div className="space-y-3 text-sm text-emerald-50/90">
        {hasText(data.email) ? <p className="break-all">{data.email}</p> : null}
        {hasText(data.phone) ? <p>{data.phone}</p> : null}
        {hasText(data.location) ? <p>{data.location}</p> : null}
        {hasText(data.website) ? <p className="break-all">{data.website}</p> : null}
        {hasText(data.linkedin) ? <p className="break-all">{data.linkedin}</p> : null}
        {hasText(data.github) ? <p className="break-all">{data.github}</p> : null}
      </div>

      {hasText(data.summary) ? <p className="text-sm leading-6 text-emerald-50/90">{data.summary}</p> : null}
    </div>
  );
};

const renderSkillSection = (section: ResumeSection) => {
  if (section.type !== 'skills') {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-100">
        {section.title}
      </h2>
      <div className="space-y-4">
        {section.items.map((item) => {
          if (item.type !== 'skills') {
            return null;
          }
          
          const data = item.data;
          if (!hasText(data.name)) {
            return null;
          }

          return (
            <div key={item.id} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-white">{data.name}</span>
                {hasText(data.category) ? (
                  <span className="text-emerald-100/80">{data.category}</span>
                ) : null}
              </div>
              <div className="h-2 rounded-full bg-white/15">
                <div className={cn('h-2 rounded-full bg-emerald-300', levelWidths[data.level])} />
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
    if (item.type === 'languages') {
      const data = item.data;
      return hasText(data.name);
    }

    if (item.type === 'certifications') {
      const data = item.data;
      return hasText(data.name) || hasText(data.issuer);
    }

    return false;
  });

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-100">
        {section.title}
      </h2>
      <div className="space-y-3 text-sm text-emerald-50/90">
        {items.map((item) => {
          if (item.type === 'languages') {
            const data = item.data;
            return (
              <div key={item.id} className="flex items-center justify-between gap-3">
                <span className="font-medium text-white">{data.name}</span>
                <span className="text-right text-emerald-100/80">{data.proficiency}</span>
              </div>
            );
          }

          if (item.type === 'certifications') {
            const data = item.data;
            return (
              <div key={item.id} className="space-y-1">
                {hasText(data.name) ? <p className="font-medium text-white">{data.name}</p> : null}
                  {hasText(data.issuer) ? <p className="text-emerald-100/80">{data.issuer}</p> : null}
              </div>
            );
          }
          
          return null;
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
      <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">
        {section.title}
      </h2>

      <div className="space-y-5">
        {section.items.map((item) => {
          if (section.type === 'experience' && item.type === 'experience') {
            const data = item.data;
            if (!hasText(data.company) && !hasText(data.position) && !hasText(data.description)) {
              return null;
            }

            return (
              <article key={item.id} className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5">
                <div className="space-y-1">
                  {hasText(data.position) ? <h3 className="text-lg font-semibold text-zinc-950">{data.position}</h3> : null}
                  {hasText(data.company) ? <p className="text-sm font-medium text-emerald-700">{data.company}</p> : null}
                  {hasText(data.location) ? <p className="text-sm text-zinc-500">{data.location}</p> : null}
                </div>
                {hasText(data.description) ? <p className="mt-3 text-sm leading-6 text-zinc-700">{data.description}</p> : null}
                {data.achievements?.length > 0 ? (
                  <ul className="mt-3 space-y-2 text-sm text-zinc-700">
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
            if (!hasText(data.institution) && !hasText(data.degree) && !hasText(data.field)) {
              return null;
            }

            return (
              <article key={item.id} className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
                <div className="space-y-1">
                  {hasText(data.degree) ? <h3 className="text-lg font-semibold text-zinc-950">{data.degree}</h3> : null}
                  {hasText(data.field) ? <p className="text-sm font-medium text-emerald-700">{data.field}</p> : null}
                  {hasText(data.institution) ? <p className="text-sm text-zinc-700">{data.institution}</p> : null}
                  {hasText(data.location) ? <p className="text-sm text-zinc-500">{data.location}</p> : null}
                </div>
                {data.achievements?.length > 0 ? (
                  <ul className="mt-3 space-y-2 text-sm text-zinc-700">
                    {data.achievements.map((achievement, index) => (
                      <li key={`${item.id}-${index}`}>• {achievement}</li>
                    ))}
                  </ul>
                ) : null}
              </article>
            );
          }

          if (section.type === 'projects' && item.type === 'projects') {
            const data = item.data;
            if (!hasText(data.name) && !hasText(data.description)) {
              return null;
            }

            return (
              <article key={item.id} className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
                {hasText(data.name) ? <h3 className="text-lg font-semibold text-zinc-950">{data.name}</h3> : null}
                {hasText(data.description) ? <p className="mt-2 text-sm leading-6 text-zinc-700">{data.description}</p> : null}
                {data.technologies?.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-emerald-700">
                    {data.technologies.map((technology) => (
                      <span key={`${item.id}-${technology}`} className="rounded-full bg-emerald-50 px-3 py-1">
                        {technology}
                      </span>
                    ))}
                  </div>
                ) : null}
              </article>
            );
          }

          if (section.type === 'custom' && item.type === 'custom') {
            const data = item.data;
            if (!hasText(data.title) && !hasText(data.content)) {
              return null;
            }

            return (
              <article key={item.id} className="rounded-2xl border border-emerald-100 bg-emerald-50/30 p-5">
                {hasText(data.title) ? <h3 className="text-lg font-semibold text-zinc-950">{data.title}</h3> : null}
                {hasText(data.content) ? <p className="mt-2 text-sm leading-6 text-zinc-700">{data.content}</p> : null}
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
  const isDemo = resume.id === 'demo-resume-id';
  
  const displaySections = isDemo ? resume.sections : sections;
  const personalInfoSection = displaySections.find((section) => section.type === 'personal_info');
  const sidebarSections = displaySections.filter((section) =>
    ['skills', 'languages', 'certifications'].includes(section.type)
  );
  const mainSections = displaySections.filter((section) =>
    ['experience', 'education', 'projects', 'custom'].includes(section.type)
  );

  return (
    <div className={cn('w-full min-h-[1100px] bg-zinc-50 text-zinc-950', getScaleClass(scale), isPreview ? 'mx-auto' : '')}>
      <div className="grid min-h-full grid-cols-1 overflow-hidden rounded-3xl shadow-xl lg:grid-cols-[30%_70%]">
        <aside className="bg-emerald-950 px-8 py-10 text-white">
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
