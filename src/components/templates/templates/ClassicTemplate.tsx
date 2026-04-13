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

const SectionHeading = ({ children, sectionType }: { children: React.ReactNode, sectionType: string }) => (
  <div className="flex items-center gap-6 mb-4 mt-8 first:mt-0" data-resume-section={sectionType}>
    <h2 className="text-[13px] font-black uppercase tracking-[0.3em] text-zinc-900 shrink-0">
        {children}
    </h2>
    <div className="h-[0.5px] w-full bg-zinc-950" style={{ backgroundColor: 'var(--primary-color, black)' }} />
  </div>
);

export default function ClassicTemplate({ resume, isPreview, scale }: TemplateProps) {
  const sections = getVisibleSections(resume).filter(hasSectionContent);
  const customStyles = getTemplateStyles(resume);
  const isDemo = resume.id === 'demo-resume-id';

  const displaySections = isDemo ? resume.sections : sections;
  const personalInfoSection = displaySections.find((section) => section.type === 'personal_info');
  const personalInfoItem = personalInfoSection?.items[0];
  const contentSections = displaySections.filter((section) => section.type !== 'personal_info');

  const renderSectionContent = (section: ResumeSection) => {
    return (
      <div className="space-y-6">
        {section.items.map((item) => {
          const baseItemProps = {
            key: item.id,
            'data-resume-item': true,
            className: "space-y-2",
            style: { breakInside: 'avoid' as const }
          };

          if (item.type === 'experience') {
            const d = item.data as ExperienceData;
            return (
              <div {...baseItemProps}>
                <div className="flex justify-between items-start">
                  <div className="space-y-0.5">
                    <h3 className="text-[15px] font-black text-zinc-950 tracking-tight leading-none">{d.position}</h3>
                    <p className="text-[12px] font-bold text-zinc-700">{d.company}</p>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                    <span className="text-[10px] font-black text-zinc-900 tabular-nums uppercase tracking-widest">{d.startDate} — {d.endDate}</span>
                    <span className="text-[10.5px] font-medium text-zinc-400 italic leading-none">{d.location}</span>
                  </div>
                </div>
                {d.descriptionBullets && d.descriptionBullets.length > 0 && (
                  <ul className="list-disc list-outside ml-4 mt-3 space-y-2 text-[12px] text-zinc-800 leading-relaxed font-medium">
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
              <div {...baseItemProps} className="flex justify-between items-center bg-zinc-50 p-4 rounded-sm border border-zinc-100">
                <div className="space-y-0.5">
                  <h3 className="text-[14px] font-black text-zinc-950">{d.institution}</h3>
                  <p className="text-[12px] font-bold text-zinc-600">{d.degree}{d.field ? `, ${d.field}` : ''}</p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">{d.startDate} — {d.endDate}</span>
                </div>
              </div>
            );
          }

          if (item.type === 'skills') {
            const d = item.data as SkillData;
            return (
              <div {...baseItemProps} className="inline-flex mr-12 mb-2 group">
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-300 mr-3 mt-1 group-hover:text-zinc-600 transition-colors">{d.category || 'Skill'}</span>
                <span className="text-[13.5px] font-black text-zinc-800 border-b-2 border-zinc-100 group-hover:border-zinc-900 transition-all">{d.name}</span>
              </div>
            );
          }

          if (item.type === 'certifications') {
             const d = item.data as CertificationData;
             return (
               <div {...baseItemProps} className="flex justify-between items-center py-2 border-b border-zinc-50 last:border-0">
                  <span className="text-[13px] font-black text-zinc-900 leading-none">{d.name}</span>
                  <span className="text-[11px] font-bold text-zinc-400 italic">{d.issuer}</span>
               </div>
             );
          }

          return (
            <div {...baseItemProps}>
                <h3 className="text-[14px] font-black text-zinc-950">{(item.data as any).name || (item.data as any).title}</h3>
                <p className="text-[12px] text-zinc-800 leading-relaxed font-medium">{(item.data as any).descriptionTitle || (item.data as any).description || (item.data as any).content}</p>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div
      className={cn(
        'w-full min-h-[1100px] antialiased bg-white text-zinc-950 font-serif relative',
        getScaleClass(scale),
        isPreview ? 'mx-auto' : ''
      )}
      style={{
        ...customStyles,
        fontFamily: 'var(--font-family, "Times New Roman", serif)',
        fontSize: 'var(--font-size, 16px)',
      }}
    >
      <div className="max-w-[7.5in] mx-auto pt-20 px-16 pb-32">
        {personalInfoItem && personalInfoItem.type === 'personal_info' && (
          <header className="text-center space-y-8 mb-16 border-b-4 border-zinc-900 pb-12">
            {(() => {
                const d = personalInfoItem.data as PersonalInfoData;
                return (
                  <>
                    <div className="space-y-2">
                        <h1 className="text-[42px] font-black tracking-tighter leading-none text-zinc-950">{d.fullName}</h1>
                        <p className="text-[14px] font-black text-zinc-400 uppercase tracking-[0.6em] ml-[0.6em]">{d.jobTitle}</p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-x-8 gap-y-1 text-[11px] font-black text-zinc-900 uppercase tracking-widest">
                      {hasText(d.location) && <span className="opacity-40">{d.location}</span>}
                      {hasText(d.phone) && <span>{d.phone}</span>}
                      {hasText(d.email) && <span className="underline decoration-2 underline-offset-4">{d.email}</span>}
                    </div>
                    {hasText(d.summary) && (
                      <p className="mt-8 text-[13px] text-zinc-800 leading-[1.8] text-justify font-medium max-w-[90%] mx-auto bg-zinc-50 p-6 rounded-sm border border-zinc-100 italic">
                        {d.summary}
                      </p>
                    )}
                  </>
                );
            })()}
          </header>
        )}

        <div className="space-y-4">
          {contentSections.map((section) => (
            <div key={section.id}>
              <SectionHeading sectionType={section.type}>{section.title}</SectionHeading>
              {renderSectionContent(section)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
