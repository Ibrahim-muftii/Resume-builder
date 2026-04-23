import { cn } from '../../../lib/utils';
import type { 
  ResumeSection, 
  ExperienceData, 
  EducationData, 
  SkillData, 
  ProjectData,
  PersonalInfoData,
  CertificationData,
  LanguageData
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
    // Specialized layout for Skills - Horizontal Row
    if (section.type === 'skills') {
      return (
        <div key={section.id} data-resume-section-row className="grid grid-cols-[140px_1fr] gap-6 mb-4">
          <div className="flex flex-col items-end gap-1 pt-0.5">
            <div data-resume-section={section.type} className="flex flex-col items-end gap-1">
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-900 text-right leading-none">
                  {section.title}
              </h2>
              <div className="h-0.5 w-4 bg-emerald-500" style={{ backgroundColor: 'var(--primary-color, #10b981)' }} />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {section.items.map((item) => {
              const d = item.data as SkillData;
              return (
                <div key={item.id} data-resume-item className="px-2.5 py-1 bg-zinc-100 rounded-[3px] border border-zinc-200">
                  <span className="text-[10px] font-black text-zinc-800 tracking-tight leading-none">{d.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    return (
      <div key={section.id} className="space-y-4 mb-4">
        {section.items.map((item, index) => {
          const isFirst = index === 0;
          const baseProps = {
            'data-resume-item': true,
            className: "space-y-1.5",
            style: { breakInside: 'avoid' as const }
          };

          return (
            <div 
              key={item.id} 
              data-resume-section-row 
              className="grid grid-cols-[140px_1fr] gap-6"
            >
              <div className="flex flex-col items-end gap-1 pt-0.5">
                {isFirst && (
                  <div data-resume-section={section.type} className="flex flex-col items-end gap-1">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-900 text-right leading-none">
                        {section.title}
                    </h2>
                    <div className="h-0.5 w-4 bg-emerald-500" style={{ backgroundColor: 'var(--primary-color, #10b981)' }} />
                  </div>
                )}
              </div>
              <div className="space-y-4">
                {(() => {
                  if (item.type === 'experience') {
                    const d = item.data as ExperienceData;
                    return (
                      <div {...baseProps}>
                        <div className="flex justify-between items-baseline group">
                          <h3 className="text-[13px] font-black text-zinc-900 tracking-tight leading-none group-hover:text-emerald-600 transition-colors">{d.position}</h3>
                          <div className="flex items-center gap-2 text-[8.5px] font-black text-zinc-400 tabular-nums uppercase whitespace-nowrap ml-4">
                            {d.startDate} — {d.endDate}
                          </div>
                        </div>
                        <div className="flex justify-between items-center text-[9.5px] font-bold text-emerald-600 uppercase tracking-[0.1in]" style={{ color: 'var(--primary-color, #10b981)' }}>
                          <span>{d.company}</span>
                          <span className="text-zinc-400 font-medium tracking-normal lowercase">{d.location}</span>
                        </div>
                        {d.descriptionBullets && d.descriptionBullets.length > 0 && (
                          <ul className="space-y-1 text-[11px] text-zinc-600 leading-snug font-medium">
                            {d.descriptionBullets.map((bullet, i) => (
                              <li key={i} className="relative pl-4 before:absolute before:left-0 before:top-[0.6em] before:h-1 before:w-1 before:rounded-full before:bg-emerald-400">
                                {bullet}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  }

                  if (item.type === 'projects') {
                    const d = item.data as ProjectData;
                    return (
                      <div {...baseProps}>
                        <div className="flex justify-between items-baseline group">
                          <h3 className="text-[13px] font-black text-zinc-900 tracking-tight leading-none group-hover:text-emerald-600 transition-colors">{d.name}</h3>
                          {(d as any).startDate && (
                            <div className="text-[8.5px] font-black text-zinc-400 tabular-nums uppercase whitespace-nowrap ml-4">
                              {(d as any).startDate} — {(d as any).endDate}
                            </div>
                          )}
                        </div>
                        {hasText(d.url || d.githubUrl) && (
                          <div className="text-[9px] font-bold text-emerald-600 uppercase tracking-[0.05em]" style={{ color: 'var(--primary-color, #10b981)' }}>
                            {d.url || d.githubUrl}
                          </div>
                        )}
                        {hasText(d.descriptionTitle) && (
                           <p className="text-[10px] font-bold text-zinc-500 italic leading-none">{d.descriptionTitle}</p>
                        )}
                        {d.descriptionBullets && d.descriptionBullets.length > 0 && (
                          <ul className="space-y-1 text-[11px] text-zinc-600 leading-snug font-medium">
                            {d.descriptionBullets.map((bullet, i) => (
                              <li key={i} className="relative pl-4 before:absolute before:left-0 before:top-[0.6em] before:h-1 before:w-1 before:rounded-full before:bg-emerald-400">
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
                      <div {...baseProps} className="p-2 border-l-2 border-zinc-100 bg-zinc-50/30">
                        <div className="flex justify-between items-baseline">
                          <h3 className="text-[12px] font-black text-zinc-900">{d.institution}</h3>
                          <span className="text-[8px] font-black text-zinc-300 tabular-nums uppercase ml-4">{d.startDate} — {d.endDate}</span>
                        </div>
                        <p className="text-[10px] font-bold text-zinc-500">{d.degree}{d.field ? ` · ${d.field}` : ''}</p>
                      </div>
                    );
                  }

                  if (item.type === 'languages') {
                    const d = item.data as LanguageData;
                    return (
                      <div {...baseProps} className="inline-flex items-center gap-2 mr-4">
                        <span className="text-[11px] font-black text-zinc-900">{d.name}</span>
                        <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">{d.proficiency}</span>
                      </div>
                    );
                  }

                  if (item.type === 'certifications') {
                    const d = item.data as CertificationData;
                    return (
                      <div {...baseProps} className="flex justify-between items-center py-1 border-b border-zinc-50">
                         <div className="flex flex-col">
                            <span className="text-[11px] font-black text-zinc-900 leading-none">{d.name}</span>
                            <span className="text-[9px] font-medium text-zinc-400">{d.issuer}</span>
                         </div>
                         <span className="text-[8.5px] font-black text-zinc-300 uppercase">{d.issueDate}</span>
                      </div>
                    );
                  }

                  return (
                    <div {...baseProps}>
                        <h3 className="text-[11px] font-black text-zinc-900">{(item.data as any).name || (item.data as any).title}</h3>
                        <p className="text-[10px] text-zinc-600 leading-snug">{(item.data as any).description || (item.data as any).content}</p>
                    </div>
                  );
                })()}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div
      className={cn(
        'w-full antialiased bg-white text-zinc-950 font-sans relative',
        getScaleClass(scale),
        isPreview ? 'mx-auto' : ''
      )}
      style={{
        ...customStyles,
        fontFamily: 'var(--font-family, "Inter", sans-serif)',
        fontSize: 'var(--font-size, 16px)',
      }}
    >
      <div className="max-w-[800px] mx-auto px-10 pt-0 pb-8">
        {personalInfoSection && personalInfoSection.items[0]?.type === 'personal_info' && (
          <header className="mb-6 grid grid-cols-[140px_1fr] gap-6 items-start">
             <div className="text-right">
                <div className="h-20 w-20 bg-emerald-50 rounded-[24px] mx-auto inline-block relative overflow-hidden border border-emerald-100 shadow-sm">
                    {(personalInfoSection.items[0].data as any).avatarUrl ? (
                        <img src={(personalInfoSection.items[0].data as any).avatarUrl} alt="" className="h-full w-full object-cover rounded-[23px]" />
                    ) : (
                        <div className="h-full w-full bg-emerald-100/30 flex items-center justify-center">
                           <span className="text-emerald-300 font-black text-[10px] uppercase tracking-tighter">Avatar</span>
                        </div>
                    )}
                </div>
             </div>
             <div className="space-y-2">
                {(() => {
                    const d = personalInfoSection.items[0].data as PersonalInfoData;
                    return (
                      <>
                        <div className="space-y-0.5">
                          <h1 className="text-[36px] font-[1000] leading-none tracking-tighter uppercase text-zinc-900">{d.fullName}</h1>
                          <p className="text-[11px] font-black text-emerald-600 uppercase tracking-[0.3em] pt-0.5" style={{ color: 'var(--primary-color, #10b981)' }}>{d.jobTitle}</p>
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[9px] font-black text-zinc-400 uppercase tracking-[0.1em] pt-0.5">
                          {hasText(d.email) && <span className="text-zinc-900">{d.email}</span>}
                          {hasText(d.phone) && <span>{d.phone}</span>}
                          {hasText(d.location) && <span>{d.location}</span>}
                        </div>
                        {hasText(d.summary) && (
                          <p className="text-[11.5px] text-zinc-500 leading-snug font-medium max-w-[98%] border-l-2 border-zinc-100 pl-4 py-0.5 italic mt-2">
                            {d.summary}
                          </p>
                        )}
                      </>
                    );
                })()}
             </div>
          </header>
        )}

        <div className="space-y-2">
          {contentSections.map(renderSection)}
        </div>
      </div>
    </div>
  );
}
