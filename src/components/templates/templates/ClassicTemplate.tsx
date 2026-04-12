import type { 
  ResumeSection, 
  PersonalInfoData, 
  ExperienceData, 
  EducationData, 
  SkillData, 
  ProjectData, 
  CertificationData, 
  LanguageData, 
  KeyAchievementData, 
  CustomData 
} from '../../../../lib/types/resume';
import { cn } from '../../../lib/utils';
import { getScaleClass, getTemplateStyles, getVisibleSections, hasSectionContent, type TemplateProps } from './templateShared';

const hasText = (value: string | undefined): boolean => Boolean(value && value.trim().length > 0);

const renderSection = (section: ResumeSection) => {
  return (
    <section key={section.id} className="space-y-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide">{section.title}</h2>
      <div className="space-y-4 text-sm leading-6">
        {section.items.map((item) => {
          if (item.type === 'experience') {
            const data = item.data as ExperienceData;
            if (!hasText(data.company) && !hasText(data.position)) {
              return null;
            }

            return (
              <article key={item.id} className="space-y-1" style={{ breakInside: 'avoid' }}>
                {hasText(data.position) ? <h3 className="font-semibold">{data.position}</h3> : null}
                {hasText(data.company) ? <p>{data.company}</p> : null}
                {hasText(data.location) ? <p>{data.location}</p> : null}
                {(hasText(data.descriptionTitle) || (data.descriptionBullets && data.descriptionBullets.length > 0)) ? (
                  <div className="space-y-1">
                    {hasText(data.descriptionTitle) ? <h4 className="font-medium italic">{data.descriptionTitle}</h4> : null}
                    {data.descriptionBullets && data.descriptionBullets.length > 0 ? (
                      <ul className="space-y-1">
                        {data.descriptionBullets.map((bullet, index) => (
                          <li key={`${item.id}-desc-${index}`}>• {bullet}</li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                ) : null}
              </article>
            );
          }

          if (item.type === 'education') {
            const data = item.data as EducationData;
            if (!hasText(data.institution) && !hasText(data.degree)) {
              return null;
            }

            return (
              <article key={item.id} className="space-y-1" style={{ breakInside: 'avoid' }}>
                {hasText(data.degree) ? <h3 className="font-semibold">{data.degree}</h3> : null}
                {hasText(data.field) ? <p>{data.field}</p> : null}
                {hasText(data.institution) ? <p>{data.institution}</p> : null}
              </article>
            );
          }

          if (item.type === 'skills') {
            const data = item.data as SkillData;
            if (!hasText(data.name)) {
              return null;
            }

            return (
              <article key={item.id} className="space-y-1" style={{ breakInside: 'avoid' }}>
                <h3 className="font-semibold">{data.name}</h3>
                {hasText(data.category) ? <p>{data.category}</p> : null}
              </article>
            );
          }

          if (item.type === 'projects') {
            const data = item.data as ProjectData;
            if (!hasText(data.name) && !hasText(data.descriptionTitle)) {
              return null;
            }

            return (
              <article key={item.id} className="space-y-1" style={{ breakInside: 'avoid' }}>
                {hasText(data.name) ? <h3 className="font-semibold">{data.name}</h3> : null}
                {hasText(data.descriptionTitle) ? <p>{data.descriptionTitle}</p> : null}
                {data.descriptionBullets && data.descriptionBullets.length > 0 ? (
                  <ul className="space-y-1">
                    {data.descriptionBullets.map((bullet, index) => (
                      <li key={`${item.id}-${index}`}>• {bullet}</li>
                    ))}
                  </ul>
                ) : null}
              </article>
            );
          }

          if (item.type === 'certifications') {
            const data = item.data as CertificationData;
            if (!hasText(data.name) && !hasText(data.issuer)) {
              return null;
            }

            return (
              <article key={item.id} className="space-y-1" style={{ breakInside: 'avoid' }}>
                {hasText(data.name) ? <h3 className="font-semibold">{data.name}</h3> : null}
                {hasText(data.issuer) ? <p>{data.issuer}</p> : null}
              </article>
            );
          }

          if (item.type === 'languages') {
            const data = item.data as LanguageData;
            if (!hasText(data.name)) {
              return null;
            }

            return (
              <article key={item.id} className="space-y-1" style={{ breakInside: 'avoid' }}>
                <h3 className="font-semibold">{data.name}</h3>
                <p>{data.proficiency}</p>
              </article>
            );
          }

          if (item.type === 'key_achievements') {
            const data = item.data as KeyAchievementData;
            if (!hasText(data.title) && !hasText(data.description)) {
              return null;
            }

            return (
              <article key={item.id} className="space-y-1" style={{ breakInside: 'avoid' }}>
                {hasText(data.title) ? <h3 className="font-semibold">{data.title}</h3> : null}
                {hasText(data.description) ? <p>{data.description}</p> : null}
              </article>
            );
          }

          if (item.type === 'custom') {
            const data = item.data as CustomData;
            if (!hasText(data.title) && !hasText(data.content)) {
              return null;
            }

            return (
              <article key={item.id} className="space-y-1" style={{ breakInside: 'avoid' }}>
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
  const customStyles = getTemplateStyles(resume);
  const isDemo = resume.id === 'demo-resume-id';

  const displaySections = isDemo ? resume.sections : sections;
  const personalInfoSection = displaySections.find((section) => section.type === 'personal_info');
  const personalInfoItem = personalInfoSection?.items[0];
  const contentSections = displaySections.filter((section) => section.type !== 'personal_info');

  return (
    <div
      className={cn(
        'w-full min-h-[1100px] antialiased transition-all duration-300',
        getScaleClass(scale),
        isPreview ? 'mx-auto' : ''
      )}
      style={{
        ...customStyles,
        fontFamily: 'var(--font-family, serif)',
        backgroundColor: 'var(--background-color, white)',
        color: 'var(--text-color, black)',
        fontSize: 'var(--font-size, 16px)',
      }}
    >
      <div
        className="space-y-8 rounded-3xl border border-black px-8 py-10"
        style={{ borderColor: 'var(--primary-color, black)' }}
      >
        {personalInfoItem && personalInfoItem.type === 'personal_info' ? (
          (() => {
            const data = personalInfoItem.data as PersonalInfoData;
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
              {index > 0 ? (
                <div
                  className="my-8 border-t"
                  style={{ borderColor: 'var(--primary-color, black)' }}
                />
              ) : null}
              {renderSection(section)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
