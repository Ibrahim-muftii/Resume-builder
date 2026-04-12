import { Mail, MapPin, Phone, Globe, Linkedin, Github } from 'lucide-react';
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
import { getScaleClass, getTemplateStyles, getVisibleSections, hasSectionContent, type TemplateProps } from './templateShared';
import { SectionIcon } from './SectionIcon';

const hasText = (value: string | undefined): boolean => Boolean(value && value.trim().length > 0);

const renderSection = (section: ResumeSection) => {
  return (
    <section key={section.id} className="space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
        <SectionIcon type={section.type} className="h-4 w-4" style={{ color: 'var(--primary-color, #059669)' }} />
        <h2 className="font-bold uppercase tracking-widest text-slate-900" style={{ fontSize: '0.8em' }}>{section.title}</h2>
      </div>

      <div className="space-y-5">
        {section.items.map((item) => {
          if (item.type === 'experience') {
            const data = item.data as ExperienceData;
            return (
              <article key={item.id} data-resume-item className="space-y-1" style={{ breakInside: 'avoid' }}>
                <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline">
                  {hasText(data.position) ? <h3 className="font-bold text-slate-900" style={{ fontSize: '1.05em' }}>{data.position}</h3> : null}
                  <div className="text-slate-400 font-medium" style={{ fontSize: '0.75em' }}>
                    {data.startDate} {data.endDate ? `— ${data.endDate}` : data.isCurrent ? '— Present' : ''}
                  </div>
                </div>
                {hasText(data.company) ? <p className="font-semibold text-slate-600" style={{ fontSize: '0.9em' }}>{data.company}</p> : null}
                {data.descriptionBullets && data.descriptionBullets.length > 0 && (
                  <ul className="mt-2 space-y-1.5 text-slate-600" style={{ fontSize: '0.85em' }}>
                    {data.descriptionBullets.map((b, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-300" />
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            );
          }
          if (item.type === 'education') {
            const data = item.data as EducationData;
            return (
              <article key={item.id} data-resume-item className="space-y-1" style={{ breakInside: 'avoid' }}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-slate-900" style={{ fontSize: '1em' }}>{data.degree}</h3>
                  <span className="text-slate-400" style={{ fontSize: '0.75em' }}>{data.startDate} - {data.endDate}</span>
                </div>
                <p style={{ color: 'var(--primary-color, #059669)', fontSize: '0.9em' }}>{data.institution}</p>
              </article>
            );
          }
          if (item.type === 'skills') {
            const data = item.data as SkillData;
            return (
              <div key={item.id} data-resume-item className="inline-block mr-3 mb-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-medium" style={{ fontSize: '0.75em', breakInside: 'avoid' }}>
                {data.name}
              </div>
            );
          }
          if (item.type === 'projects') {
            const data = item.data as ProjectData;
            return (
              <article key={item.id} data-resume-item className="space-y-2" style={{ breakInside: 'avoid' }}>
                <h3 className="font-bold text-slate-900" style={{ fontSize: '1.05em' }}>{data.name}</h3>
                {hasText(data.descriptionTitle) && <p className="text-slate-600" style={{ fontSize: '0.85em' }}>{data.descriptionTitle}</p>}
                {data.descriptionBullets && data.descriptionBullets.length > 0 && (
                  <ul className="mt-1 space-y-1 text-slate-600" style={{ fontSize: '0.8em' }}>
                    {data.descriptionBullets.map((b, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-300" />
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            );
          }
          if (item.type === 'certifications') {
            const data = item.data as CertificationData;
            return (
              <div key={item.id} data-resume-item className="text-sm">
                <span className="font-bold text-slate-900">{data.name}</span>
                <span className="text-slate-500 ml-2">({data.issuer})</span>
              </div>
            );
          }
          if (item.type === 'languages') {
            const data = item.data as LanguageData;
            return (
              <div key={item.id} data-resume-item className="text-sm">
                <span className="font-bold text-slate-900">{data.name}</span>
                <span className="text-slate-500 ml-2">({data.proficiency})</span>
              </div>
            );
          }
          if (item.type === 'key_achievements') {
            const data = item.data as KeyAchievementData;
            return (
              <div key={item.id} data-resume-item className="space-y-1">
                <h3 className="font-bold text-slate-900">{data.title}</h3>
                <p className="text-slate-600 text-sm whitespace-pre-wrap">{data.description}</p>
              </div>
            );
          }
          if (item.type === 'custom') {
            const data = item.data as CustomData;
            return (
              <div key={item.id} data-resume-item className="space-y-1">
                <h3 className="font-bold text-slate-900">{data.title}</h3>
                <p className="text-slate-600 text-sm whitespace-pre-wrap">{data.content}</p>
              </div>
            );
          }
          return null;
        })}
      </div>
    </section>
  );
};

export default function MinimalTemplate({ resume, isPreview, scale }: TemplateProps) {
  const sections = getVisibleSections(resume).filter(hasSectionContent);
  const displaySections = resume.id === 'demo-resume-id' ? resume.sections : sections;
  const personalInfoSection = displaySections.find((s) => s.type === 'personal_info');
  const personalInfoItem = personalInfoSection?.items[0];
  const contentSections = displaySections.filter((s) => s.type !== 'personal_info');
  const customStyles = getTemplateStyles(resume);

  return (
    <div 
      className={cn('w-full min-h-[1100px] text-slate-800 antialiased font-sans', getScaleClass(scale), isPreview ? 'mx-auto' : '')}
      style={{
        ...customStyles,
        fontFamily: 'var(--font-family, Inter, sans-serif)',
        backgroundColor: 'var(--background-color, white)',
        fontSize: 'var(--font-size, 16px)',
      }}
    >
      <div className="mx-auto max-w-[800px] px-10 py-12 space-y-10">
        {personalInfoItem?.type === 'personal_info' && (
          <header className="space-y-6 text-center">
            {(() => {
              const data = personalInfoItem.data as PersonalInfoData;
              return (
                <>
                  <div className="space-y-2">
                    <h1 className="font-bold tracking-tight text-slate-950" style={{ fontSize: '2.5em' }}>{data.fullName}</h1>
                    <p className="font-medium uppercase tracking-[0.3em]" style={{ color: 'var(--primary-color, #059669)', fontSize: '1em' }}>{data.jobTitle}</p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-slate-500" style={{ fontSize: '0.8em' }}>
                    {data.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {data.email}</span>}
                    {data.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {data.phone}</span>}
                    {data.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {data.location}</span>}
                  </div>
                </>
              );
            })()}
          </header>
        )}

        <div className="space-y-10">
          {contentSections.map(renderSection)}
        </div>
      </div>
    </div>
  );
}
