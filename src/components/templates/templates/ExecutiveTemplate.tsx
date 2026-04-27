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

const hasText = (value: string | undefined): boolean => Boolean(value && value.trim().length > 0);

export default function ExecutiveTemplate({ resume, isPreview, scale }: TemplateProps) {
  const sections = getVisibleSections(resume).filter(hasSectionContent);
  const customStyles = getTemplateStyles(resume);
  const isDemo = resume.id === 'demo-resume-id';

  const displaySections = isDemo ? resume.sections : sections;
  const personalInfoSection = displaySections.find((s) => s.type === 'personal_info');
  const contentSections = displaySections.filter((s) => s.type !== 'personal_info');

  const renderSection = (section: ResumeSection) => {
    return (
      <div key={section.id} className="mb-8">
        <div className="flex items-center gap-6 mb-5" data-resume-section={section.type}>
            <h2 className="text-[11.5px] font-extrabold uppercase tracking-[0.45em] text-zinc-900 shrink-0">
                {section.title}
            </h2>
            <div className="h-[0.5px] w-full bg-zinc-800" />
        </div>

        <div className="space-y-6">
          {section.items.map((item) => {
            const baseProps = {
              'data-resume-item': true,
              className: "space-y-2",
              style: { breakInside: 'avoid' as const }
            };

            if (item.type === 'experience') {
              const d = item.data as ExperienceData;
              return (
                <div key={item.id} {...baseProps}>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <h3 className="text-[15px] font-black text-zinc-900 serif tracking-tight">{d.position}</h3>
                        <p className="text-[12px] font-bold text-zinc-800 uppercase tracking-widest">{d.company}</p>
                    </div>
                    <div className="text-right flex flex-col items-end">
                        <span className="text-[10px] font-black text-zinc-900 border-[1.5px] border-zinc-900 px-2 py-0.5 rounded-[2px] uppercase tracking-tighter shrink-0 mb-1">
                          {d.startDate} — {d.endDate}
                        </span>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{d.location}</p>
                    </div>
                  </div>
                  {d.descriptionBullets && d.descriptionBullets.length > 0 && (
                    <ul className="space-y-2 text-[12px] text-zinc-900 leading-relaxed text-justify mt-3 font-medium">
                      {d.descriptionBullets.map((bullet, i) => (
                        <li key={i} className="pl-4 relative before:absolute before:left-0 before:top-[0.65em] before:h-[1px] before:w-1.5 before:bg-zinc-800">
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
                <div key={item.id} {...baseProps} className="flex justify-between items-center bg-zinc-50/50 p-4 rounded-sm border border-zinc-100">
                   <div className="space-y-0.5">
                      <h3 className="text-[14px] font-black text-zinc-900 italic serif">{d.institution}</h3>
                      <p className="text-[11.5px] font-bold text-zinc-500 uppercase tracking-widest">{d.degree}{d.field ? ` · ${d.field}` : ''}</p>
                   </div>
                   <div className="text-right">
                      <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{d.startDate} — {d.endDate}</span>
                   </div>
                </div>
              );
            }

            if (item.type === 'skills') {
              const d = item.data as SkillData;
              return (
                <div key={item.id} {...baseProps} className="inline-flex items-baseline mr-8 mb-1">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-300 mr-2">{d.category || 'Skill'}</span>
                  <span className="text-[13px] font-black text-zinc-800 border-b-[2px] border-zinc-100">{d.name}</span>
                </div>
              );
            }

            return (
              <div key={item.id} {...baseProps}>
                  <h3 className="text-[14px] font-black text-zinc-900 italic">{(item.data as any).name || (item.data as any).title}</h3>
                  <p className="text-[12px] text-zinc-800 leading-relaxed font-medium">{(item.data as any).descriptionTitle || (item.data as any).description || (item.data as any).content}</p>
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
        'w-full min-h-[1100px] antialiased bg-[#FFFFFF] text-zinc-950 font-serif relative',
        getScaleClass(scale),
        isPreview ? 'mx-auto' : ''
      )}
      style={{
        ...customStyles,
        fontFamily: 'var(--font-family, "Playfair Display", serif)',
        fontSize: 'var(--font-size, 16px)',
      }}
    >
      {/* Structural Detailing */}
      <div className="absolute top-0 inset-x-0 h-1.5 bg-zinc-900" style={{ backgroundColor: 'var(--primary-color, #18181b)' }} />

<<<<<<< Updated upstream
      <div className="max-w-[7.5in] mx-auto pt-16 px-12 pb-24">
=======
      <div className={cn(
        "mx-auto pt-0 pb-12",
        isPreview ? "max-w-[720px] px-[44px]" : "max-w-[7.5in] px-12"
      )}>
>>>>>>> Stashed changes
        {personalInfoSection && personalInfoSection.items[0]?.type === 'personal_info' && (
          <header className="mb-16">
            {(() => {
                const d = personalInfoSection.items[0].data as PersonalInfoData;
                return (
                  <div className="space-y-12">
                    <div className="flex justify-between items-end border-b-[0.5px] border-zinc-200 pb-12">
                        <div className="space-y-4">
                            <h1 className="text-[60px] font-black tracking-tighter leading-[0.75] italic text-zinc-900 lowercase">{d.fullName}</h1>
                            <p className="text-[16px] font-black text-zinc-500 uppercase tracking-[0.5em]">{d.jobTitle}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2 text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em]">
                           {hasText(d.email) && <span className="text-zinc-900 border-b-[1px] border-zinc-900 pb-0.5">{d.email}</span>}
                           {hasText(d.phone) && <span>{d.phone}</span>}
                           {hasText(d.location) && <span>{d.location}</span>}
                        </div>
                    </div>
                    {hasText(d.summary) && (
                      <div className="grid grid-cols-[140px_1fr] gap-12 items-baseline">
                        <div className="space-y-1">
                            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-300">Executive</p>
                            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-300">Statement</p>
                        </div>
                        <p className="text-[14px] text-zinc-800 leading-[1.7] text-justify font-medium italic opacity-85">
                          {d.summary}
                        </p>
                      </div>
                    )}
                  </div>
                );
            })()}
          </header>
        )}

        <div className="space-y-4">
          {contentSections.map(renderSection)}
        </div>
      </div>
    </div>
  );
}
