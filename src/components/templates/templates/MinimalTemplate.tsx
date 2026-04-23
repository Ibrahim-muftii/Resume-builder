import type { 
  ResumeSection, 
  PersonalInfoData, 
  ExperienceData, 
  EducationData, 
  SkillData, 
  ProjectData, 
  CertificationData, 
  LanguageData
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
      <div key={section.id} className="relative mb-6 last:mb-0 pb-6">
        <div data-resume-section-row className="grid grid-cols-[120px_1fr] gap-8">
          <div className="pt-1 text-right relative pr-6">
            <h2 data-resume-section={section.type} className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-300 leading-none">
                {section.title}
            </h2>
          </div>
          <div className="space-y-4">
            {section.items.map((item) => {
              const baseProps = {
                'data-resume-item': true,
                className: "space-y-1",
                style: { breakInside: 'avoid' as const }
              };

              if (item.type === 'experience') {
                const d = item.data as ExperienceData;
                return (
                  <div key={item.id} data-resume-section-row>
                    <div {...baseProps}>
                      <div className="flex justify-between items-baseline">
                        <h3 className="text-[13.5px] font-bold text-zinc-900 tracking-tight">{d.position}</h3>
                        <span className="text-[9px] font-black text-zinc-300 tabular-nums uppercase whitespace-nowrap ml-4">
                          {d.startDate} — {d.endDate}
                        </span>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <p className="text-[10.5px] font-semibold text-zinc-500 uppercase tracking-wide text-[9.5px]">{d.company}</p>
                        <span className="text-[9px] font-medium text-zinc-400 italic">{d.location}</span>
                      </div>
                      {d.descriptionBullets && d.descriptionBullets.length > 0 && (
                        <ul className="space-y-1 mt-1 text-[11.5px] text-zinc-600 leading-snug font-medium">
                          {d.descriptionBullets.map((bullet, i) => (
                            <li key={i} className="relative pl-3 before:absolute before:left-0 before:top-[0.6em] before:h-1 before:w-1 before:rounded-full before:bg-zinc-200">
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                );
              }

              if (item.type === 'projects') {
                const d = item.data as ProjectData;
                return (
                  <div key={item.id} data-resume-section-row>
                    <div {...baseProps}>
                      <div className="flex justify-between items-baseline">
                        <h3 className="text-[13px] font-bold text-zinc-900">{d.name}</h3>
                        {hasText(d.url) && <span className="text-[9px] font-medium text-zinc-400 border-b border-zinc-100">{d.url}</span>}
                      </div>
                      {hasText(d.descriptionTitle) && (
                         <p className="text-[10px] font-medium text-zinc-400 italic leading-none">{d.descriptionTitle}</p>
                      )}
                      {d.descriptionBullets && d.descriptionBullets.length > 0 && (
                        <ul className="space-y-1 mt-1 text-[11px] text-zinc-600 leading-snug font-medium">
                          {d.descriptionBullets.map((bullet, i) => (
                            <li key={i} className="relative pl-3 before:absolute before:left-0 before:top-[0.6em] before:h-1 before:w-1 before:rounded-full before:bg-zinc-200">
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                );
              }

              if (item.type === 'education') {
                const d = item.data as EducationData;
                return (
                  <div key={item.id} data-resume-section-row>
                    <div {...baseProps}>
                      <div className="flex justify-between items-baseline">
                        <h3 className="text-[12px] font-bold text-zinc-900">{d.institution}</h3>
                        <span className="text-[9px] font-bold text-zinc-400 uppercase ml-4">{d.startDate} — {d.endDate}</span>
                      </div>
                      <p className="text-[11px] font-medium text-zinc-500">{d.degree}{d.field ? ` · ${d.field}` : ''}</p>
                    </div>
                  </div>
                );
              }

              if (item.type === 'skills') {
                const d = item.data as SkillData;
                return (
                  <div key={item.id} data-resume-section-row className="inline-flex mr-3 mb-1">
                    <span {...baseProps} className="text-[11.5px] font-bold text-zinc-700 hover:text-zinc-950 transition-colors">
                      {d.name}
                    </span>
                  </div>
                );
              }

              return (
                <div key={item.id} data-resume-section-row>
                  <div {...baseProps}>
                      <h3 className="text-[12px] font-bold text-zinc-900">{(item.data as any).name || (item.data as any).title}</h3>
                      <p className="text-[11px] text-zinc-600">{(item.data as any).description || (item.data as any).content}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* Finishing Section Line - Touches the vertical border and extends to the right */}
        <div className="absolute left-[120px] right-0 bottom-0 h-[0.5px] bg-zinc-100" />
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
        fontFamily: 'var(--font-family, "Outfit", sans-serif)',
        fontSize: 'var(--font-size, 16px)',
      }}
    >
      <div className="max-w-[800px] mx-auto px-12 pt-0 pb-12">
        {personalInfoSection && personalInfoSection.items[0]?.type === 'personal_info' && (
          <header className="mb-10 pt-6 border-b-[0.5px] border-zinc-100 pb-8">
            {(() => {
                const d = personalInfoSection.items[0].data as PersonalInfoData;
                return (
                  <div className="flex justify-between items-start">
                    <div className="space-y-1.5">
                      <h1 className="text-[38px] font-black leading-none tracking-[-0.05em] text-zinc-950">{d.fullName}</h1>
                      <p className="text-[12px] font-bold text-zinc-400 uppercase tracking-[0.4em] leading-none pt-1">{d.jobTitle}</p>
                      {hasText(d.summary) && (
                        <p className="text-[11.5px] text-zinc-500 leading-relaxed max-w-[480px] pt-4 font-medium italic">
                          {d.summary}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1.5 text-[10px] font-bold text-zinc-400 text-right pt-2">
                       {hasText(d.email) && <span className="text-zinc-900">{d.email}</span>}
                       {hasText(d.phone) && <span>{d.phone}</span>}
                       {hasText(d.location) && <span>{d.location}</span>}
                       {hasText(d.linkedin) && <span className="text-zinc-200">Linkedin</span>}
                    </div>
                  </div>
                );
            })()}
          </header>
        )}

        <div className="space-y-0 relative">
          {/* Vertical Anchor Line */}
          <div className="absolute left-[120px] top-0 bottom-0 w-[0.5px] bg-zinc-100" />
          
          {contentSections.map(renderSection)}
        </div>
      </div>
    </div>
  );
}
