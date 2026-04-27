import { cn } from '../../../lib/utils';
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
import { getScaleClass, getTemplateStyles, getVisibleSections, hasSectionContent, type TemplateProps } from './templateShared';

const hasText = (value: string | undefined): boolean => Boolean(value && value.trim().length > 0);

export default function ModernTemplate({ resume, isPreview, scale }: TemplateProps) {
  const sections = getVisibleSections(resume).filter(hasSectionContent);
  const customStyles = getTemplateStyles(resume);
  const isDemo = resume.id === 'demo-resume-id';

  const displaySections = isDemo ? resume.sections : sections;
  const personalInfoSection = displaySections.find((s) => s.type === 'personal_info');
  const contentSections = displaySections.filter((s) => s.type !== 'personal_info');

  const renderSection = (section: ResumeSection) => {
    return (
      <div key={section.id} className="grid grid-cols-[180px_1fr] gap-12 mb-10">
        <div className="flex flex-col items-end gap-2 pt-1" data-resume-section={section.type}>
            <h2 className="text-[12px] font-black uppercase tracking-[0.3em] text-zinc-900 text-right leading-none">
                {section.title}
            </h2>
            <div className="h-0.5 w-8 bg-emerald-500" style={{ backgroundColor: 'var(--primary-color, #10b981)' }} />
        </div>
        <div className="space-y-8">
          {section.items.map((item) => {
            const baseProps = {
              key: item.id,
              'data-resume-item': true,
              className: "space-y-3",
              style: { breakInside: 'avoid' as const }
            };

            if (item.type === 'experience') {
              const d = item.data as ExperienceData;
              return (
                <div {...baseProps}>
                  <div className="flex justify-between items-baseline group">
                    <h3 className="text-[16px] font-black text-zinc-900 tracking-tight leading-none group-hover:text-emerald-600 transition-colors">{d.position}</h3>
                    <div className="flex items-center gap-2 text-[10px] font-black text-zinc-300 tabular-nums uppercase whitespace-nowrap ml-4">
                      {d.startDate} 
                      <span className="text-emerald-500">—</span> 
                      {d.endDate}
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-[11px] font-bold text-emerald-600 uppercase tracking-[0.2em]" style={{ color: 'var(--primary-color, #10b981)' }}>
                    <span>{d.company}</span>
                    <span className="text-zinc-400 font-medium tracking-normal lowercase">{d.location}</span>
                  </div>
                  {d.descriptionBullets && d.descriptionBullets.length > 0 && (
                    <ul className="space-y-2 text-[12.5px] text-zinc-600 leading-relaxed font-medium mt-4">
                      {d.descriptionBullets.map((bullet, i) => (
                        <li key={i} className="relative pl-5 before:absolute before:left-0 before:top-[0.6em] before:h-1 before:w-1.5 before:rounded-full before:bg-emerald-400" 
                            style={{ '--tw-before-bg': 'var(--primary-color, #10b981)' } as any}>
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            }

            if (item.type === 'education') {
              const d = item.data as EducationData;
              return (
                <div {...baseProps} className="rounded-xl border border-zinc-100 p-5 bg-zinc-50/30">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-[14px] font-black text-zinc-900">{d.institution}</h3>
                    <span className="text-[10px] font-black text-zinc-300 tabular-nums uppercase ml-4">{d.startDate} — {d.endDate}</span>
                  </div>
                  <p className="text-[12px] font-bold text-zinc-500 mt-1">{d.degree}{d.field ? ` · ${d.field}` : ''}</p>
                </div>
              );
            }

            if (item.type === 'skills') {
              const d = item.data as SkillData;
              return (
                <div {...baseProps} className="inline-flex mr-3 mb-3 px-3 py-1.5 bg-zinc-900 rounded-[4px] border border-zinc-900 shadow-sm">
                  <span className="text-[11px] font-black text-white tracking-tight">{d.name}</span>
                  <span className="ml-2 text-[9px] font-black text-emerald-400 uppercase tracking-tighter" style={{ color: 'var(--primary-color, #10b981)' }}>{d.level}</span>
                </div>
              );
            }

            return (
              <div {...baseProps}>
                  <h3 className="text-[13px] font-black text-zinc-900">{(item.data as any).name || (item.data as any).title}</h3>
                  <p className="text-[12px] text-zinc-600 leading-relaxed font-medium">{(item.data as any).descriptionTitle || (item.data as any).description || (item.data as any).content}</p>
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
<<<<<<< Updated upstream
      <div className="max-w-[800px] mx-auto pt-20 px-12 pb-24">
=======
      <div className={cn(
        "mx-auto pt-0 pb-8",
        isPreview ? "max-w-[720px] px-[44px]" : "max-w-[800px] px-10"
      )}>
>>>>>>> Stashed changes
        {personalInfoSection && personalInfoSection.items[0]?.type === 'personal_info' && (
          <header className="mb-20 grid grid-cols-[180px_1fr] gap-12 items-center">
             <div className="text-right">
                <div className="h-32 w-32 bg-emerald-50 rounded-[40px] mx-auto inline-block relative overflow-hidden border-2 border-emerald-100 p-1 shadow-inner">
                    {(personalInfoSection.items[0].data as any).avatarUrl ? (
                        <img src={(personalInfoSection.items[0].data as any).avatarUrl} alt="" className="h-full w-full object-cover rounded-[36px]" />
                    ) : (
                        <div className="h-full w-full bg-emerald-100/50 flex items-center justify-center rounded-[36px]">
                           <span className="text-emerald-300 font-black text-2xl uppercase tracking-tighter">Avatar</span>
                        </div>
                    )}
                </div>
             </div>
             <div className="space-y-6">
                {(() => {
                    const d = personalInfoSection.items[0].data as PersonalInfoData;
                    return (
                      <>
                        <div className="space-y-2">
                          <h1 className="text-[54px] font-[1000] leading-[0.8] tracking-tighter uppercase text-zinc-900">{d.fullName}</h1>
                          <div className="h-1 w-24 bg-zinc-900" />
                          <p className="text-[14px] font-black text-emerald-600 uppercase tracking-[0.5em] pt-2" style={{ color: 'var(--primary-color, #10b981)' }}>{d.jobTitle}</p>
                        </div>
                        <div className="flex flex-wrap gap-x-8 gap-y-1 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] pt-2">
                          {hasText(d.email) && <span className="text-zinc-900 border-b-2 border-emerald-500/20">{d.email}</span>}
                          {hasText(d.phone) && <span>{d.phone}</span>}
                          {hasText(d.location) && <span>{d.location}</span>}
                        </div>
                        {hasText(d.summary) && (
                          <p className="text-[13px] text-zinc-500 leading-relaxed font-medium max-w-[95%] border-l-2 border-zinc-100 pl-6 py-1 italic">
                            {d.summary}
                          </p>
                        )}
                      </>
                    );
                })()}
             </div>
          </header>
        )}

        <div className="space-y-6">
          {contentSections.map(renderSection)}
        </div>
      </div>
    </div>
  );
}
