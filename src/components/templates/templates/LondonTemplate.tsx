import type {
  ResumeSection,
  ExperienceData,
  EducationData,
  SkillData,
  PersonalInfoData,
  LanguageData,
  CertificationData,
  CustomData,
  ProjectData,
  KeyAchievementData
} from '../../../../lib/types/resume';
import { cn } from '../../../lib/utils';
import { getScaleClass, getTemplateStyles, getVisibleSections, hasSectionContent, type TemplateProps } from './templateShared';
import { enrichWithDemoData } from '../../../../lib/utils/demoData';

const hasText = (value: string | undefined): value is string => Boolean(value && value.trim().length > 0);

export default function LondonTemplate({ resume, isPreview, scale }: TemplateProps) {
  const sectionsToUse = getVisibleSections(resume);
  const isDemo = resume.id === 'demo-resume-id';
  
  const sections = (isPreview || isDemo) 
    ? sectionsToUse 
    : sectionsToUse.filter(hasSectionContent);

  const customStyles = getTemplateStyles(resume);
  
  const personalInfoSection = sectionsToUse.find((s) => s.type === 'personal_info');
  const contentSections = sections.filter((s) => s.type !== 'personal_info');

  const renderSection = (section: ResumeSection) => {
    return (
      <div key={section.id} className="mb-3 last:mb-0">
        {/* Section Heading with Pagination Markers */}
        <div className="mb-2" data-resume-section={section.type} data-resume-section-row>
          <h2 className="text-[14px] font-bold uppercase text-zinc-900 leading-none">
            {section.title}
          </h2>
          <div className="h-[1.5px] w-full bg-zinc-950 mt-1" />
        </div>

        <div className="space-y-4">
          {(() => {
            if (section.type === 'skills') {
              const items = section.items;
              const midpoint = Math.ceil(items.length / 2);
              const col1 = items.slice(0, midpoint);
              const col2 = items.slice(midpoint);

              const renderSkillItem = (item: any) => {
                const d = item.data as SkillData;
                return (
                  <div key={item.id} className="flex items-center gap-2 text-[12px] text-zinc-800" data-resume-item data-resume-section-row>
                    <span className="text-[14px] leading-none text-zinc-900">•</span>
                    <span className="font-bold">{d.name}</span>
                  </div>
                );
              };

              return (
                <div className="grid grid-cols-2 gap-x-4">
                  <div className="space-y-0.5">{col1.map(renderSkillItem)}</div>
                  <div className="space-y-0.5">{col2.map(renderSkillItem)}</div>
                </div>
              );
            }

            return section.items.map((item, index) => {
              const isLast = index === section.items.length - 1;
              const baseProps = {
                'data-resume-item': true,
                'data-resume-section-row': true,
                className: cn("space-y-1", !isLast && "mb-2.5"),
                style: { breakInside: 'avoid' as const }
              };

              if (item.type === 'experience') {
                const d = item.data as ExperienceData;
                return (
                  <div key={item.id} {...baseProps}>
                    <div className="flex justify-between items-baseline mb-0">
                      <h3 className="text-[13px] font-bold text-zinc-900">{d.company}</h3>
                      <span className="text-[12.5px] font-bold text-zinc-900">{d.location}</span>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <p className="text-[11px] font-bold italic text-zinc-700">{d.position}</p>
                      <span className="text-[10px] font-bold italic text-zinc-600 tabular-nums">{d.startDate} — {d.endDate}</span>
                    </div>
                    {d.descriptionBullets && d.descriptionBullets.length > 0 && (
                      <ul className="space-y-0.5 text-[12px] text-zinc-900 leading-[1.2] ml-4">
                        {d.descriptionBullets.map((bullet, i) => (
                          <li key={i} className="flex gap-2 mb-0">
                            <span className="text-[14px] leading-none text-zinc-900 shrink-0">•</span>
                            <span>{bullet}</span>
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
                  <div key={item.id} {...baseProps}>
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-[13px] font-bold text-zinc-900">{d.institution}</h3>
                      <span className="text-[10px] font-bold text-zinc-600 tabular-nums">{d.startDate} — {d.endDate}</span>
                    </div>
                    <p className="text-[11px] font-bold italic text-zinc-700 -mt-0.5">{d.degree}{d.field ? `, ${d.field}` : ''}</p>
                  </div>
                );
              }

              if (item.type === 'languages') {
                const d = item.data as LanguageData;
                return (
                  <div key={item.id} data-resume-item data-resume-section-row className="text-[12px] text-zinc-800">
                    <span className="font-bold text-zinc-900">{d.name}</span>
                    <span className="ml-1 text-zinc-600 italic">({d.proficiency})</span>
                  </div>
                );
              }

              if (item.type === 'projects') {
                const d = item.data as ProjectData;
                return (
                  <div key={item.id} {...baseProps}>
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-[13px] font-bold text-zinc-900">{d.name}</h3>
                      <div className="flex gap-2">
                        {d.url && <span className="text-[11px] text-zinc-600 underline lowercase">{d.url.replace(/^https?:\/\//, '')}</span>}
                        {d.githubUrl && <span className="text-[11px] text-zinc-600 underline lowercase">github</span>}
                      </div>
                    </div>
                    {hasText(d.descriptionTitle) && (
                       <p className="text-[11px] font-bold italic text-zinc-700">{d.descriptionTitle}</p>
                    )}
                    {d.descriptionBullets && d.descriptionBullets.length > 0 && (
                      <ul className="space-y-0.5 text-[12px] text-zinc-900 leading-[1.2] ml-4">
                        {d.descriptionBullets.map((bullet, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="text-[14px] leading-none text-zinc-900 shrink-0">•</span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              }

              if (item.type === 'certifications') {
                const d = item.data as CertificationData;
                return (
                  <div key={item.id} {...baseProps}>
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-[13px] font-bold text-zinc-900">{d.name}</h3>
                      <span className="text-[11px] font-bold text-zinc-600 tabular-nums">{d.issueDate}</span>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <p className="text-[11px] font-bold italic text-zinc-700">{d.issuer}</p>
                      {d.credentialId && <span className="text-[10px] text-zinc-500">ID: {d.credentialId}</span>}
                    </div>
                  </div>
                );
              }

              if (item.type === 'key_achievements') {
                const d = item.data as KeyAchievementData;
                return (
                  <div key={item.id} {...baseProps}>
                    <h3 className="text-[13px] font-bold text-zinc-900">{d.title}</h3>
                    <p className="text-[11.5px] text-zinc-700 leading-[1.2] whitespace-pre-wrap">{d.description}</p>
                  </div>
                );
              }

              if (item.type === 'custom') {
                const d = item.data as CustomData;
                return (
                  <div key={item.id} {...baseProps}>
                    <h3 className="text-[12px] font-bold text-zinc-900">{d.title}</h3>
                    <p className="text-[11.5px] text-zinc-700 leading-[1.2] whitespace-pre-wrap">{d.content}</p>
                  </div>
                );
              }

              return (
                <div key={item.id} {...baseProps}>
                  <h3 className="text-[12px] font-bold text-zinc-900">{(item.data as any).name || (item.data as any).title}</h3>
                  <p className="text-[11.5px] text-zinc-700 leading-[1.2]">{(item.data as any).description || (item.data as any).content || (item.data as any).summary}</p>
                </div>
              );
            });
          })()}
        </div>
      </div>
    );
  };

  return (
    <div
      className={cn(
        "w-full bg-white font-serif",
        isPreview ? "min-h-full" : "min-h-[1122px]",
        getScaleClass(scale)
      )}
      style={{
        ...customStyles,
        fontFamily: 'var(--font-family, "Playfair Display", serif)',
        fontSize: 'var(--font-size, 16px)',
      }}
    >
      <div className={cn(
        "w-full pt-4 pb-12 bg-white",
        isPreview ? "max-w-[720px] mx-auto px-[44px]" : "max-w-[800px] mx-auto px-12 min-h-[1122px]"
      )}>
        <div className="h-[1.5px] w-full bg-zinc-950 mb-0.5" />
        {(() => {
          const d = (personalInfoSection?.items[0]?.data as PersonalInfoData) || {};
          
          return (
            <header className="mb-2 text-center space-y-0.5">
              <h1 className="text-[18px] font-bold text-zinc-900 mb-0">
                {d.fullName || ""}
              </h1>
              <div className="flex flex-wrap justify-center items-center gap-x-2 text-[11px] text-zinc-700 font-medium">
                {hasText(d.phone) && (
                  <>
                    <span>Ph. No: {d.phone}</span>
                    <span>|</span>
                  </>
                )}
                {hasText(d.email) && (
                  <>
                    <span className="underline decoration-zinc-300 underline-offset-2">E-mail: {d.email}</span>
                    {(hasText(d.location) || hasText(d.website) || hasText(d.linkedin)) && <span>|</span>}
                  </>
                )}
                {hasText(d.website) && (
                  <>
                    <span className="lowercase">{d.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}</span>
                    {(hasText(d.linkedin) || hasText(d.location)) && <span>|</span>}
                  </>
                )}
                {hasText(d.linkedin) && (
                  <>
                    <span className="lowercase">linkedin.com/in/{d.linkedin.split('/').filter(Boolean).pop()}</span>
                    {hasText(d.location) && <span>|</span>}
                  </>
                )}
                {hasText(d.location) && (
                  <span>{d.location}</span>
                )}
              </div>
              {hasText(d.summary) && (
                <div className="mt-4 space-y-2" data-resume-section="personal_info">
                  <div className="mb-2" data-resume-section="personal_info" data-resume-section-row>
                    <h2 className="text-[14px] font-bold uppercase text-zinc-900 text-left leading-none">
                      Profile
                    </h2>
                    <div className="h-[1.5px] w-full bg-zinc-950 mt-1" />
                  </div>
                  <p className="text-[12px] text-zinc-700 leading-[1.2] text-left font-medium">
                    {d.summary}
                  </p>
                </div>
              )}
            </header>
          );
        })()}

        <div className="space-y-3">
          {contentSections.map(renderSection)}
        </div>
      </div>
    </div>
  );
}
