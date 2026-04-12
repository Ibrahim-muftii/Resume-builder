import {
  Github,
  Globe,
  Linkedin,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react';
import type { 
  ResumeSection, 
  ExperienceData, 
  EducationData, 
  SkillData, 
  ProjectData, 
  PersonalInfoData,
  LanguageData,
  CertificationData,
  KeyAchievementData,
  CustomData
} from '../../../../lib/types/resume';
import { cn } from '../../../lib/utils';
import { getScaleClass, getVisibleSections, hasSectionContent, type TemplateProps, getTemplateStyles } from './templateShared';
import { SectionIcon } from './SectionIcon';

const hasText = (value: string | undefined): boolean => Boolean(value && value.trim().length > 0);

const renderInfoLine = (icon: any, value: string) => {
  const Icon = icon;
  return (
    <div className="flex items-start gap-3" style={{ fontSize: '0.85em' }}>
      <Icon className="h-4 w-4 opacity-70" />
      <span className="break-all">{value}</span>
    </div>
  );
};

const renderSection = (section: ResumeSection) => {
  return (
    <section key={section.id} className="space-y-4">
      <div className="border-l-4 pl-4" style={{ borderColor: 'var(--primary-color, #0d9488)' }}>
        <div className="flex items-center gap-2">
          <SectionIcon type={section.type} className="h-5 w-5" style={{ color: 'var(--primary-color, #0d9488)' }} />
          <h2 className="font-black uppercase tracking-[0.18em] text-slate-950" style={{ fontSize: '1em' }}>{section.title}</h2>
        </div>
      </div>

      <div className="space-y-4">
        {section.items.map((item) => {
          if (item.type === 'experience') {
            const data = item.data as ExperienceData;
            return (
              <article key={item.id} data-resume-item className="rounded-2xl border border-teal-50 bg-white p-5 shadow-sm" style={{ breakInside: 'avoid' }}>
                <div className="space-y-1">
                  {hasText(data.position) ? <h3 className="font-semibold text-slate-950" style={{ fontSize: '1.1em' }}>{data.position}</h3> : null}
                  {hasText(data.company) ? <p className="font-medium" style={{ color: 'var(--primary-color, #0d9488)', fontSize: '0.9em' }}>{data.company}</p> : null}
                  {hasText(data.location) ? <p className="text-slate-500" style={{ fontSize: '0.8em' }}>{data.location}</p> : null}
                </div>
                {data.descriptionBullets && data.descriptionBullets.length > 0 && (
                  <ul className="mt-3 space-y-1.5 text-slate-700" style={{ fontSize: '0.85em' }}>
                    {data.descriptionBullets.map((bullet, i) => <li key={i}>• {bullet}</li>)}
                  </ul>
                )}
              </article>
            );
          }
          if (item.type === 'education') {
            const data = item.data as EducationData;
            return (
              <article key={item.id} data-resume-item className="rounded-2xl border border-teal-50 bg-white p-5 shadow-sm" style={{ breakInside: 'avoid' }}>
                {hasText(data.degree) ? <h3 className="font-semibold text-slate-950" style={{ fontSize: '1.1em' }}>{data.degree}</h3> : null}
                {hasText(data.institution) ? <p className="font-medium" style={{ color: 'var(--primary-color, #0d9488)', fontSize: '0.9em' }}>{data.institution}</p> : null}
              </article>
            );
          }
          if (item.type === 'projects') {
             const data = item.data as ProjectData;
             return (
               <article key={item.id} data-resume-item className="rounded-2xl border border-teal-50 bg-white p-5 shadow-sm" style={{ breakInside: 'avoid' }}>
                  <h3 className="font-semibold text-slate-950" style={{ fontSize: '1.1em' }}>{data.name}</h3>
                  {hasText(data.descriptionTitle) && <p className="mt-2 text-slate-600" style={{ fontSize: '0.85em' }}>{data.descriptionTitle}</p>}
               </article>
             );
          }
          if (item.type === 'skills') {
            const data = item.data as SkillData;
            return (
              <article key={item.id} data-resume-item className="flex items-center justify-between gap-3 rounded-2xl border border-teal-50 bg-white p-4 shadow-sm" style={{ breakInside: 'avoid' }}>
                <div>
                  <h3 className="font-semibold text-slate-950" style={{ fontSize: '0.9em' }}>{data.name}</h3>
                  <p className="text-slate-500" style={{ fontSize: '0.7em' }}>{data.category}</p>
                </div>
                <div className="h-1.5 w-24 rounded-full bg-slate-100">
                  <div className="h-full rounded-full" style={{ 
                    width: data.level === 'beginner' ? '25%' : data.level === 'intermediate' ? '50%' : data.level === 'advanced' ? '75%' : '100%',
                    backgroundColor: 'var(--primary-color, #0d9488)' 
                  }} />
                </div>
              </article>
            );
          }
          if (item.type === 'languages') {
            const data = item.data as LanguageData;
            return (
              <article key={item.id} data-resume-item className="flex items-center justify-between gap-3 rounded-2xl border border-teal-50 bg-white p-4 shadow-sm" style={{ breakInside: 'avoid' }}>
                <div>
                  <h3 className="font-semibold text-slate-950" style={{ fontSize: '0.9em' }}>{data.name}</h3>
                  <p className="text-slate-500" style={{ fontSize: '0.7em' }}>{data.proficiency}</p>
                </div>
              </article>
            );
          }
          if (item.type === 'certifications') {
            const data = item.data as CertificationData;
            return (
              <article key={item.id} data-resume-item className="flex items-center justify-between gap-3 rounded-2xl border border-teal-50 bg-white p-4 shadow-sm" style={{ breakInside: 'avoid' }}>
                <div>
                  <h3 className="font-semibold text-slate-950" style={{ fontSize: '0.9em' }}>{data.name}</h3>
                  <p className="text-slate-500" style={{ fontSize: '0.7em' }}>{data.issuer}</p>
                </div>
              </article>
            );
          }
          if (item.type === 'key_achievements') {
            const data = item.data as KeyAchievementData;
            return (
              <article key={item.id} data-resume-item className="rounded-2xl border border-teal-50 bg-white p-5 shadow-sm" style={{ breakInside: 'avoid' }}>
                <h3 className="font-semibold text-slate-950" style={{ fontSize: '1.1em' }}>{data.title}</h3>
                <p className="mt-2 text-slate-700 whitespace-pre-wrap" style={{ fontSize: '0.85em' }}>{data.description}</p>
              </article>
            );
          }
          if (item.type === 'custom') {
            const data = item.data as CustomData;
            return (
              <article key={item.id} data-resume-item className="rounded-2xl border border-teal-50 bg-white p-5 shadow-sm" style={{ breakInside: 'avoid' }}>
                <h3 className="font-semibold text-slate-950" style={{ fontSize: '1.1em' }}>{data.title}</h3>
                <p className="mt-2 text-slate-700 whitespace-pre-wrap" style={{ fontSize: '0.85em' }}>{data.content}</p>
              </article>
            );
          }
          return null;
        })}
      </div>
    </section>
  );
};

export default function CreativeTemplate({ resume, isPreview, scale }: TemplateProps) {
  const sections = getVisibleSections(resume).filter(hasSectionContent);
  const displaySections = resume.id === 'demo-resume-id' ? resume.sections : sections;
  const personalInfoSection = displaySections.find((s) => s.type === 'personal_info');
  const personalInfoItem = personalInfoSection?.items[0];
  const leftSections = displaySections.filter((s) => ['skills', 'languages', 'certifications'].includes(s.type));
  const rightSections = displaySections.filter((s) => ['experience', 'education', 'projects', 'custom', 'key_achievements'].includes(s.type));
  const customStyles = getTemplateStyles(resume);

  return (
    <div 
      className={cn('w-full min-h-[1100px] text-zinc-950 antialiased font-serif', getScaleClass(scale), isPreview ? 'mx-auto' : '')}
      style={{
        ...customStyles,
        fontFamily: 'var(--font-family, serif)',
        backgroundColor: 'var(--background-color, #f9fafb)',
        fontSize: 'var(--font-size, 16px)',
      }}
    >
      <div className="overflow-hidden lg:rounded-3xl shadow-2xl">
        {personalInfoItem?.type === 'personal_info' && (
          <header className="px-8 py-12 text-white" style={{ backgroundColor: 'var(--primary-color, #0d9488)' }}>
            {(() => {
              const data = personalInfoItem.data as PersonalInfoData;
              return (
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                  <div className="space-y-2">
                    <h1 className="font-black tracking-tight" style={{ fontSize: '3em' }}>{data.fullName}</h1>
                    <p className="font-medium opacity-90" style={{ fontSize: '1.2em' }}>{data.jobTitle}</p>
                  </div>
                  <div className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2 opacity-90">
                    {data.email && renderInfoLine(Mail, data.email)}
                    {data.phone && renderInfoLine(Phone, data.phone)}
                    {data.location && renderInfoLine(MapPin, data.location)}
                  </div>
                </div>
              );
            })()}
          </header>
        )}

        <div className="grid grid-cols-1 gap-0 bg-white lg:grid-cols-[35%_65%] min-h-[900px]">
          <aside className="space-y-8 bg-zinc-50/50 px-8 py-10 border-r border-zinc-100">
            {leftSections.map(renderSection)}
          </aside>
          <main className="space-y-8 px-8 py-10">
            {rightSections.map(renderSection)}
          </main>
        </div>
      </div>
    </div>
  );
}
