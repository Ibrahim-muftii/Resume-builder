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

export default function ClassicTemplate({ resume, isPreview, scale }: TemplateProps) {
  const sections = getVisibleSections(resume).filter(hasSectionContent);
  const customStyles = getTemplateStyles(resume);
  const isDemo = resume.id === 'demo-resume-id';

  const displaySections = isDemo ? resume.sections : sections;
  const personalInfoSection = displaySections.find((section) => section.type === 'personal_info');
  const contentSections = displaySections.filter((section) => section.type !== 'personal_info');

  const renderSection = (section: ResumeSection) => {
    // Specialized Categorized Row Layout for Skills - Left Aligned
    if (section.type === 'skills') {
      const skillsByCategory = section.items.reduce((acc, item) => {
        const d = item.data as SkillData;
        const cat = d.category || 'Other Skills';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(d.name);
        return acc;
      }, {} as Record<string, string[]>);

      return (
        <div key={section.id} className="space-y-2 mb-6">
          <div data-resume-section-row className="flex items-center gap-4 mb-3">
              <div className="h-[0.5px] flex-1 bg-zinc-300" />
              <h2 data-resume-section={section.type} className="text-[11px] font-black uppercase tracking-[0.25em] text-zinc-900 leading-none whitespace-nowrap">
                  {section.title}
              </h2>
              <div className="h-[0.5px] flex-1 bg-zinc-300" />
          </div>
          <div className="space-y-1">
            {Object.entries(skillsByCategory).map(([category, skills]) => (
              <div key={category} data-resume-section-row className="text-[12px] text-zinc-800 leading-relaxed text-left">
                 <span className="font-black uppercase tracking-tight text-zinc-950 mr-2">{category}:</span>
                 <span className="font-medium italic text-zinc-600">{skills.join(', ')}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div key={section.id} className="space-y-3 mb-6">
        <div data-resume-section-row className="flex items-center gap-4 mb-3">
            <div className="h-[0.5px] flex-1 bg-zinc-300" />
            <h2 data-resume-section={section.type} className="text-[11px] font-black uppercase tracking-[0.25em] text-zinc-900 leading-none whitespace-nowrap">
                {section.title}
            </h2>
            <div className="h-[0.5px] flex-1 bg-zinc-300" />
        </div>

        <div className="space-y-4">
          {section.items.map((item) => {
            const baseProps = {
              key: item.id,
              'data-resume-item': true,
              className: "space-y-1.5",
              style: { breakInside: 'avoid' as const }
            };

            return (
              <div key={item.id} data-resume-section-row>
                {(() => {
                  if (item.type === 'experience') {
                    const d = item.data as ExperienceData;
                    return (
                      <div {...baseProps}>
                        <div className="flex justify-between items-baseline">
                          <h3 className="text-[13.5px] font-black text-zinc-950 tracking-tight">{d.company}</h3>
                          <span className="text-[10px] font-black text-zinc-500 tabular-nums uppercase">{d.startDate} — {d.endDate}</span>
                        </div>
                        <div className="flex justify-between items-baseline">
                          <p className="text-[11.5px] font-bold text-zinc-700 italic">{d.position}</p>
                          <span className="text-[10px] font-medium text-zinc-400 italic">{d.location}</span>
                        </div>
                        {d.descriptionBullets && d.descriptionBullets.length > 0 && (
                          <ul className="list-disc list-outside ml-4 mt-1 space-y-1 text-[11.5px] text-zinc-800 leading-relaxed font-medium">
                            {d.descriptionBullets.map((bullet, i) => (
                              <li key={i} className="pl-1">{bullet}</li>
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
                        <div className="flex justify-between items-baseline">
                          <h3 className="text-[13px] font-black text-zinc-950">{d.name}</h3>
                          {hasText(d.url) && <span className="text-[9px] font-bold text-zinc-400 underline">{d.url}</span>}
                        </div>
                        {hasText(d.descriptionTitle) && (
                           <p className="text-[10.5px] font-bold text-zinc-500 italic leading-none">{d.descriptionTitle}</p>
                        )}
                        {d.descriptionBullets && d.descriptionBullets.length > 0 && (
                          <ul className="list-disc list-outside ml-4 mt-1 space-y-1 text-[11.5px] text-zinc-800 leading-relaxed font-medium">
                            {d.descriptionBullets.map((bullet, i) => (
                              <li key={i} className="pl-1">{bullet}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  }

                  if (item.type === 'education') {
                    const d = item.data as EducationData;
                    return (
                      <div {...baseProps}>
                        <div className="flex justify-between items-baseline">
                          <h3 className="text-[13px] font-black text-zinc-950">{d.institution}</h3>
                          <span className="text-[10px] font-black text-zinc-400 uppercase">{d.startDate} — {d.endDate}</span>
                        </div>
                        <p className="text-[11px] font-bold text-zinc-700 italic">{d.degree}{d.field ? `, ${d.field}` : ''}</p>
                      </div>
                    );
                  }

                  if (item.type === 'languages') {
                    const d = item.data as LanguageData;
                    return (
                      <div {...baseProps} className="flex gap-2 text-[11.5px]">
                         <span className="font-black text-zinc-900 uppercase tracking-tighter">{d.name}:</span>
                         <span className="font-medium text-zinc-600 italic">{d.proficiency}</span>
                      </div>
                    );
                  }

                  return (
                    <div {...baseProps}>
                        <h3 className="text-[12px] font-black text-zinc-950">{(item.data as any).name || (item.data as any).title}</h3>
                        <p className="text-[11px] text-zinc-800 leading-relaxed">{(item.data as any).description || (item.data as any).content}</p>
                    </div>
                  );
                })()}
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
        'w-full antialiased bg-white text-zinc-950 font-serif relative',
        getScaleClass(scale),
        isPreview ? 'mx-auto' : ''
      )}
      style={{
        ...customStyles,
        fontFamily: 'var(--font-family, "Times New Roman", serif)',
        fontSize: 'var(--font-size, 16px)',
      }}
    >
      <div className="max-w-[800px] mx-auto px-12 pt-0 pb-12">
        {personalInfoSection && personalInfoSection.items[0]?.type === 'personal_info' && (
          <header className="text-left space-y-4 mb-10">
            {(() => {
                const d = personalInfoSection.items[0].data as PersonalInfoData;
                return (
                  <>
                    <div className="space-y-1">
                        <h1 className="text-[34px] font-[1000] tracking-tight leading-none text-zinc-950 uppercase">{d.fullName}</h1>
                        <p className="text-[12px] font-black text-zinc-500 uppercase tracking-[0.4em] ml-[0.4em]">{d.jobTitle}</p>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10.5px] font-medium text-zinc-900 border-y border-zinc-100 py-2">
                      {hasText(d.location) && <span>{d.location}</span>}
                      {hasText(d.phone) && <span>{d.phone}</span>}
                      {hasText(d.email) && <span className="underline decoration-1">{d.email}</span>}
                      {hasText(d.linkedin) && <span>LinkedIn</span>}
                    </div>
                    {hasText(d.summary) && (
                      <p className="mt-4 text-[11.5px] text-zinc-600 leading-relaxed text-left italic max-w-[98%] pt-2 border-t border-zinc-100">
                        {d.summary}
                      </p>
                    )}
                  </>
                );
            })()}
          </header>
        )}

        <div className="space-y-2">
          {contentSections.map(renderSection)}
        </div>
      </div>
    </div>
  );
}
