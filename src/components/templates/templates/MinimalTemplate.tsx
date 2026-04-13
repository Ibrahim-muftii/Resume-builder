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

export default function MinimalTemplate({ resume, isPreview, scale }: TemplateProps) {
  const sections = getVisibleSections(resume).filter(hasSectionContent);
  const customStyles = getTemplateStyles(resume);
  const isDemo = resume.id === 'demo-resume-id';

  const displaySections = isDemo ? resume.sections : sections;
  const personalInfoSection = displaySections.find((s) => s.type === 'personal_info');
  const contentSections = displaySections.filter((s) => s.type !== 'personal_info');

  const renderSection = (section: ResumeSection) => {
    return (
      <div key={section.id} className="mb-16 last:mb-0">
        <div className="flex flex-col items-center mb-10" data-resume-section={section.type}>
            <h2 className="text-[11px] font-[1000] uppercase tracking-[0.6em] text-zinc-900 border-b-2 border-zinc-900/5 pb-2">
                {section.title}
            </h2>
        </div>

        <div className="space-y-12">
          {section.items.map((item) => {
            const baseProps = {
              key: item.id,
              'data-resume-item': true,
              className: "space-y-4",
              style: { breakInside: 'avoid' as const }
            };

            if (item.type === 'experience') {
              const d = item.data as ExperienceData;
              return (
                <div {...baseProps} className="flex flex-col items-center text-center">
                  <div className="space-y-1">
                    <h3 className="text-[18px] font-black text-zinc-950 tracking-tighter leading-none lowercase tracking-tight">{d.position}</h3>
                    <div className="flex items-center justify-center gap-3 text-[10px] font-black text-zinc-300 uppercase tracking-widest pt-1">
                       <span className="text-zinc-900">{d.company}</span>
                       <span className="h-1 w-1 rounded-full bg-zinc-100" />
                       <span>{d.location}</span>
                    </div>
                    <p className="text-[9px] font-black text-zinc-200 uppercase tracking-[0.3em] font-mono mt-1">{d.startDate} // {d.endDate}</p>
                  </div>
                  {d.descriptionBullets && d.descriptionBullets.length > 0 && (
                    <ul className="max-w-[85%] space-y-3 text-[13px] text-zinc-500 leading-relaxed font-bold lowercase opacity-80">
                      {d.descriptionBullets.map((bullet, i) => (
                        <li key={i} className="relative before:content-['—'] before:mr-2 before:text-zinc-200">{bullet}</li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            }

            if (item.type === 'education') {
              const d = item.data as EducationData;
              return (
                <div {...baseProps} className="flex flex-col items-center text-center">
                  <h3 className="text-[16px] font-black text-zinc-950 lowercase tracking-tight">{d.institution}</h3>
                  <p className="text-[11px] font-black text-zinc-400 uppercase tracking-widest mt-1">{d.degree}{d.field ? ` · ${d.field}` : ''}</p>
                  <p className="text-[9px] font-black text-zinc-200 uppercase tracking-widest mt-2">{d.startDate} — {d.endDate}</p>
                </div>
              );
            }

            if (item.type === 'skills') {
              const d = item.data as SkillData;
              return (
                <div {...baseProps} className="flex flex-col items-center text-center px-6 py-4 bg-zinc-50 rounded-full border border-zinc-100 min-w-[160px] inline-flex mr-4 mb-4 transition-all hover:bg-zinc-100 hover:scale-105 cursor-default">
                  <span className="text-[13px] font-black text-zinc-900 tracking-tighter lowercase">{d.name}</span>
                  <span className="text-[8px] font-black uppercase text-zinc-300 mt-1 tracking-widest">{d.level}</span>
                </div>
              );
            }

            return (
              <div {...baseProps} className="flex flex-col items-center text-center">
                  <h3 className="text-[15px] font-black text-zinc-900 lowercase italic">{(item.data as any).name || (item.data as any).title}</h3>
                  <p className="text-[13px] text-zinc-500 max-w-[85%] mx-auto font-bold lowercase opacity-80">{(item.data as any).descriptionTitle || (item.data as any).description || (item.data as any).content}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div
      className={cn(
        'w-full min-h-[1100px] antialiased bg-white text-zinc-950 font-sans relative',
        getScaleClass(scale),
        isPreview ? 'mx-auto' : ''
      )}
      style={{
        ...customStyles,
        fontFamily: 'var(--font-family, "Inter", sans-serif)',
        fontSize: 'var(--font-size, 16px)',
      }}
    >
      <div className="max-w-[700px] mx-auto pt-24 px-12 pb-32">
        {personalInfoSection && personalInfoSection.items[0]?.type === 'personal_info' && (
          <header className="mb-32 text-center flex flex-col items-center">
            {(() => {
                const d = personalInfoSection.items[0].data as PersonalInfoData;
                return (
                  <div className="space-y-16">
                    <div className="space-y-6">
                      <h1 className="text-[48px] font-black leading-none tracking-[-0.08em] text-zinc-950 lowercase">{d.fullName}</h1>
                      <div className="h-1.5 w-12 bg-zinc-950 rounded-full mx-auto" />
                      <p className="text-[14px] font-black text-zinc-400 uppercase tracking-[0.7em] ml-[0.7em] leading-none">{d.jobTitle}</p>
                    </div>
                    
                    <div className="flex flex-wrap flex-col items-center gap-y-3 text-[11px] font-black text-zinc-200 uppercase tracking-[0.4em]">
                       {hasText(d.email) && <span className="text-zinc-950 border-b border-zinc-950 pb-1">{d.email}</span>}
                       <div className="flex gap-6">
                          {hasText(d.phone) && <span>{d.phone}</span>}
                          {hasText(d.location) && <span>{d.location}</span>}
                       </div>
                    </div>

                    {hasText(d.summary) && (
                      <p className="text-[15px] text-zinc-400 leading-[2.2] font-black max-w-[90%] mx-auto lowercase opacity-80 decoration-zinc-100 underline-offset-8">
                        {d.summary}
                      </p>
                    )}
                  </div>
                );
            })()}
          </header>
        )}

        <div className="space-y-6">
          {contentSections.map(renderSection)}
        </div>
      </div>
    </div>
  );
}
