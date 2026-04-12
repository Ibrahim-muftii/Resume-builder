import type { 
  ResumeSection, 
  ExperienceData, 
  EducationData, 
  SkillData, 
  ProjectData, 
  PersonalInfoData,
  CertificationData,
  LanguageData,
  KeyAchievementData,
  CustomData
} from '../../../../lib/types/resume';
import { cn } from '../../../lib/utils';
import { getScaleClass, getVisibleSections, hasSectionContent, type TemplateProps, getTemplateStyles } from './templateShared';
import { SectionIcon } from './SectionIcon';

const hasText = (value: string | undefined): boolean => Boolean(value && value.trim().length > 0);

const renderSection = (section: ResumeSection) => {
  return (
    <div key={section.id} style={{ display: 'block', marginBottom: '24px', pageBreakInside: 'avoid', breakInside: 'avoid' }}>
      <div className="flex items-center gap-3 border-b-2 pb-2" style={{ borderColor: 'var(--primary-color, #0f172a)', marginBottom: '16px' }}>
        <SectionIcon type={section.type} className="h-4 w-4" style={{ color: 'var(--primary-color, #0f172a)' }} />
        <h2 className="font-bold uppercase tracking-[0.2em] text-slate-900" style={{ fontSize: '0.85em' }}>{section.title}</h2>
      </div>

      <div style={{ display: 'block' }}>
        {section.items.map((item) => {
          if (item.type === 'experience') {
            const data = item.data as ExperienceData;
            return (
              <article key={item.id} data-resume-item className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" style={{ display: 'block', marginBottom: '16px', pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                {hasText(data.position) ? <h3 className="font-semibold text-slate-950" style={{ fontSize: '1.1em' }}>{data.position}</h3> : null}
                {hasText(data.company) ? <p className="font-medium text-slate-700" style={{ fontSize: '0.9em' }}>{data.company}</p> : null}
                <div className="mt-2 space-y-1 text-slate-600" style={{ fontSize: '0.85em' }}>
                  {data.descriptionBullets && data.descriptionBullets.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {data.descriptionBullets.map((bullet: string, i: number) => <li key={i}>• {bullet}</li>)}
                    </ul>
                  )}
                </div>
              </article>
            );
          }
          
          if (item.type === 'education') {
            const data = item.data as EducationData;
            return (
              <article key={item.id} data-resume-item className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" style={{ display: 'block', marginBottom: '16px', pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                <div className="flex justify-between items-baseline">
                   {hasText(data.degree) ? <h3 className="font-semibold text-slate-950" style={{ fontSize: '1em' }}>{data.degree}</h3> : null}
                   <span className="text-slate-400" style={{ fontSize: '0.75em' }}>{data.startDate} - {data.endDate}</span>
                </div>
                {hasText(data.institution) ? <p className="font-medium text-slate-700" style={{ fontSize: '0.85em' }}>{data.institution}</p> : null}
                {hasText(data.location) && <p className="text-slate-400 mt-1" style={{ fontSize: '0.75em' }}>{data.location}</p>}
              </article>
            );
          }

          if (item.type === 'projects') {
            const data = item.data as ProjectData;
            return (
              <article key={item.id} data-resume-item className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" style={{ display: 'block', marginBottom: '16px', pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                <h3 className="font-semibold text-slate-950" style={{ fontSize: '1.1em' }}>{data.name}</h3>
                {hasText(data.descriptionTitle) && <p className="text-slate-500 italic mb-2" style={{ fontSize: '0.8em' }}>{data.descriptionTitle}</p>}
                {data.descriptionBullets && data.descriptionBullets.length > 0 && (
                  <ul className="space-y-1 text-slate-600" style={{ fontSize: '0.85em' }}>
                    {data.descriptionBullets.map((b: string, i: number) => <li key={i}>• {b}</li>)}
                  </ul>
                )}
              </article>
            );
          }

          if (item.type === 'skills') {
            const data = item.data as SkillData;
            return (
              <article key={item.id} data-resume-item className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-3 mb-2" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                  <span className="font-bold uppercase tracking-wider text-slate-900" style={{ fontSize: '0.75em' }}>{data.name}</span>
                  <span className="text-slate-400 uppercase" style={{ fontSize: '0.65em' }}>{data.level}</span>
              </article>
            );
          }

          if (item.type === 'certifications') {
            const data = item.data as CertificationData;
            return (
              <article key={item.id} data-resume-item className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-3 mb-2" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                  <span className="font-bold uppercase tracking-wider text-slate-900" style={{ fontSize: '0.75em' }}>{data.name}</span>
                  <span className="text-slate-400 uppercase" style={{ fontSize: '0.65em' }}>{data.issuer}</span>
              </article>
            );
          }

          if (item.type === 'languages') {
            const data = item.data as LanguageData;
            return (
              <article key={item.id} data-resume-item className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-3 mb-2" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                  <span className="font-bold uppercase tracking-wider text-slate-900" style={{ fontSize: '0.75em' }}>{data.name}</span>
                  <span className="text-slate-400 uppercase" style={{ fontSize: '0.65em' }}>{data.proficiency}</span>
              </article>
            );
          }

          if (item.type === 'key_achievements') {
            const data = item.data as KeyAchievementData;
            return (
              <article key={item.id} data-resume-item className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" style={{ display: 'block', marginBottom: '16px', pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                <h3 className="font-semibold text-slate-950" style={{ fontSize: '1.1em' }}>{data.title}</h3>
                <p className="mt-1 text-slate-700 whitespace-pre-wrap" style={{ fontSize: '0.85em' }}>{data.description}</p>
              </article>
            );
          }

          if (item.type === 'custom') {
            const data = item.data as CustomData;
            return (
              <article key={item.id} data-resume-item className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" style={{ display: 'block', marginBottom: '16px', pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                <h3 className="font-semibold text-slate-950" style={{ fontSize: '1.1em' }}>{data.title}</h3>
                <p className="mt-1 text-slate-700 whitespace-pre-wrap" style={{ fontSize: '0.85em' }}>{data.content}</p>
              </article>
            );
          }
          
          return null;
        })}
      </div>
    </div>
  );
};

export default function ExecutiveTemplate({ resume, isPreview, scale }: TemplateProps) {
  const sections = getVisibleSections(resume).filter(hasSectionContent);
  const displaySections = resume.id === 'demo-resume-id' ? resume.sections : sections;
  const personalInfoSection = displaySections.find((s) => s.type === 'personal_info');
  const personalInfoItem = personalInfoSection?.items[0];
  const leftSections = displaySections.filter((s) => ['skills', 'languages', 'certifications'].includes(s.type));
  const rightSections = displaySections.filter((s) => ['experience', 'education', 'projects', 'custom', 'key_achievements'].includes(s.type));
  const customStyles = getTemplateStyles(resume);

  return (
    <div 
      className={cn('w-full text-zinc-950 antialiased', getScaleClass(scale), isPreview ? 'mx-auto' : '')}
      style={{
        ...customStyles,
        height: 'auto',
        minHeight: '0px',
        display: 'block',
        fontFamily: 'var(--font-family, Inter, sans-serif)',
        backgroundColor: 'var(--background-color, #ffffff)',
        fontSize: 'var(--font-size, 16px)',
      }}
    >
      <header className="bg-slate-950 px-8 py-12 text-white shadow-lg" style={{ display: 'block' }}>
        {personalInfoItem?.type === 'personal_info' && (
          <div style={{ display: 'block' }}>
            {(() => {
               const data = personalInfoItem.data as PersonalInfoData;
               return (
                <>
                  <h1 className="font-black uppercase tracking-tighter" style={{ fontSize: '3.5em', lineHeight: '1' }}>
                    {data.fullName}
                  </h1>
                  <p className="font-medium uppercase tracking-[0.4em] text-slate-400 mt-2" style={{ fontSize: '1.2em' }}>
                    {data.jobTitle}
                  </p>
                </>
               );
            })()}
          </div>
        )}
      </header>

      <div style={{ display: 'block', clear: 'both', minHeight: '0px' }}>
        <aside style={{ 
            width: '35%', 
            float: 'left', 
            borderRight: '1px solid #f1f5f9',
            backgroundColor: '#f8fafc',
            padding: '40px 32px',
            minHeight: '1123px'
        }}>
          {leftSections.map(renderSection)}
        </aside>

        <main style={{ 
            width: '65%', 
            float: 'left', 
            padding: '40px 32px',
            minHeight: '1123px'
        }}>
          {rightSections.map(renderSection)}
        </main>
        <div style={{ clear: 'both' }} />
      </div>
    </div>
  );
}
