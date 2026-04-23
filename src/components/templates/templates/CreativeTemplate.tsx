import type {
  ResumeSection,
  ExperienceData,
  EducationData,
  SkillData,
  ProjectData,
  PersonalInfoData,
  LanguageData,
  CertificationData
} from '../../../../lib/types/resume';
import { cn } from '../../../lib/utils';
import { getScaleClass, getVisibleSections, hasSectionContent, type TemplateProps, getTemplateStyles } from './templateShared';

const hasText = (value: string | undefined): boolean => Boolean(value && value.trim().length > 0);

export default function CreativeTemplate({ resume, isPreview, scale }: TemplateProps) {
  const sections = getVisibleSections(resume).filter(hasSectionContent);
  const customStyles = getTemplateStyles(resume);
  const isDemo = resume.id === 'demo-resume-id';

  const displaySections = isDemo ? resume.sections : sections;
  const personalInfoSection = displaySections.find((s) => s.type === 'personal_info');

  const sidebarSections = displaySections.filter((s) => ['skills', 'languages', 'certifications'].includes(s.type));
  const mainSections = displaySections.filter((s) => !['personal_info', 'skills', 'languages', 'certifications'].includes(s.type));

  const renderSection = (section: ResumeSection, isSidebar: boolean) => {
    return (
      <div key={section.id} className="mb-6 last:mb-0">
        <h2
          data-resume-section={section.type}
          className={cn(
            "text-[10px] font-black uppercase tracking-[0.4em] mb-4 flex items-center gap-3",
            isSidebar ? "text-emerald-400" : "text-zinc-900"
          )}
          style={isSidebar ? { color: 'var(--primary-color, #34d399)' } : {}}
        >
          {section.title}
        </h2>
        <div className="space-y-4">
          {section.items.map((item) => {
            const baseProps = {
              key: item.id,
              'data-resume-item': true,
              className: cn("space-y-2", isSidebar ? "text-white" : "text-zinc-700"),
              style: { breakInside: 'avoid' as const }
            };

            if (item.type === 'experience') {
              const d = item.data as ExperienceData;
              return (
                <div key={item.id} data-resume-section-row>
                  <div {...baseProps} className="relative pl-6 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-zinc-100 before:rounded-full">
                    <div className="flex justify-between items-baseline group">
                      <h3 className="text-[14.5px] font-black text-zinc-900 tracking-tight leading-none group-hover:text-emerald-600 transition-colors">{d.position}</h3>
                      <span className="text-[9px] font-black text-zinc-300 tabular-nums uppercase">{d.startDate} — {d.endDate}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-black text-emerald-600 uppercase tracking-widest pt-1" style={{ color: 'var(--primary-color, #10b981)' }}>
                      <span>{d.company}</span>
                      <span className="text-zinc-400 font-medium tracking-normal lowercase italic">{d.location}</span>
                    </div>
                    {d.descriptionBullets && d.descriptionBullets.length > 0 && (
                      <ul className="space-y-1.5 text-[11.5px] text-zinc-500 leading-relaxed font-semibold mt-3">
                        {d.descriptionBullets.map((bullet, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="h-1 w-1 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
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
                  <div {...baseProps} className="bg-zinc-50/50 p-4 rounded-xl border border-zinc-100/50">
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-[13px] font-black text-zinc-900">{d.name}</h3>
                      {hasText(d.url) && <span className="text-[9px] font-bold text-emerald-600 uppercase" style={{ color: 'var(--primary-color, #10b981)' }}>Link</span>}
                    </div>
                    {hasText(d.descriptionTitle) && (
                      <p className="text-[10px] font-bold text-zinc-400 italic leading-none">{d.descriptionTitle}</p>
                    )}
                    {d.descriptionBullets && d.descriptionBullets.length > 0 && (
                      <ul className="space-y-1 text-[11px] text-zinc-500 leading-snug mt-2">
                        {d.descriptionBullets.map((bullet, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="h-1 w-1 rounded-full bg-zinc-200 shrink-0 mt-1.5" />
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              );
            }

            if (item.type === 'skills') {
              const d = item.data as SkillData;
              return (
                <div key={item.id} data-resume-section-row className="space-y-1.5">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-[11px] font-black tracking-wide text-white uppercase">{d.name}</span>
                    <span className="text-[8px] font-black uppercase text-emerald-400">{d.level}</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.3)]"
                      style={{
                        width: d.level === 'expert' ? '100%' : d.level === 'advanced' ? '80%' : d.level === 'intermediate' ? '60%' : '40%',
                        backgroundColor: 'var(--primary-color, #34d399)'
                      }}
                    />
                  </div>
                </div>
              );
            }

            if (isSidebar) {
              return (
                <div key={item.id} data-resume-section-row className="pb-3 border-b border-white/5 last:border-0">
                  <p className="text-[12px] font-black text-white">{(item.data as any).name || (item.data as any).title}</p>
                  <p className="text-[9px] font-bold text-white/40 uppercase tracking-tighter pt-0.5">{(item.data as any).proficiency || (item.data as any).issuer || (item.data as any).content}</p>
                </div>
              );
            }

            return (
              <div data-resume-section-row {...baseProps}>
                <h3 className="text-[12px] font-black text-zinc-900">{(item.data as any).name || (item.data as any).title}</h3>
                <p className="text-[11px] leading-relaxed font-bold text-zinc-400">{(item.data as any).description || (item.data as any).content}</p>
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
        'w-full antialiased text-zinc-950 font-sans relative flex flex-col',
        getScaleClass(scale),
        isPreview ? 'mx-auto' : ''
      )}
      style={{
        ...customStyles,
        fontFamily: 'var(--font-family, "Outfit", sans-serif)',
        fontSize: 'var(--font-size, 16px)',
        backgroundColor: '#ffffff'
      }}
    >
      {/* 
          Stable Sidebar Background: Using an absolute div instead of a gradient.
          This ensures compatibility with all PDF viewers (Google/Chrome, Mac, etc.)
          by providing a solid, predictable layout element that spans the total height.
      */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[260px] bg-zinc-900 pointer-events-none"
        style={{ backgroundColor: 'var(--sidebar-bg, #18181b)' }}
      />

      <div className="relative flex flex-1">
        {/* Sidebar Content */}
        <aside className="w-[260px] px-10 pt-10 pb-12 space-y-12 shrink-0 relative z-10">
          {personalInfoSection && personalInfoSection.items[0]?.type === 'personal_info' && (
            <div className="space-y-6">
              {(() => {
                const d = personalInfoSection.items[0].data as PersonalInfoData;
                return (
                  <div className="space-y-4 text-white">
                    <div className="h-14" /> {/* Spacer to align with name header */}
                    {hasText(d.email) && <div className="space-y-0.5"><p className="text-[7px] font-black uppercase tracking-[0.4em] text-white/30">Email</p><p className="text-[11px] font-black break-all">{d.email}</p></div>}
                    {hasText(d.phone) && <div className="space-y-0.5"><p className="text-[7px] font-black uppercase tracking-[0.4em] text-white/30">Phone</p><p className="text-[11px] font-black">{d.phone}</p></div>}
                    {hasText(d.location) && <div className="space-y-0.5"><p className="text-[7px] font-black uppercase tracking-[0.4em] text-white/30">Location</p><p className="text-[11px] font-black uppercase tracking-tight">{d.location}</p></div>}
                  </div>
                );
              })()}
            </div>
          )}
          {sidebarSections.map(s => renderSection(s, true))}
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 relative z-10">
          <header className="pl-12 pt-10 pb-12 pr-12 border-b border-zinc-100">
            {personalInfoSection && personalInfoSection.items[0]?.type === 'personal_info' && (
              (() => {
                const d = personalInfoSection.items[0].data as PersonalInfoData;
                return (
                  <div className="flex flex-col gap-4">
                    <div className="space-y-1">
                      <h1 className="text-[48px] font-[1000] leading-[0.9] tracking-tighter uppercase text-zinc-900">{d.fullName}</h1>
                      <p className="text-[14px] font-black text-emerald-500 uppercase tracking-[0.4em] pt-1" style={{ color: 'var(--primary-color, #10b981)' }}>{d.jobTitle}</p>
                    </div>
                    {hasText(d.summary) && (
                      <p className="text-[12px] text-zinc-500 font-semibold leading-relaxed max-w-xl pl-4 border-l-4 border-emerald-400" style={{ borderColor: 'var(--primary-color, #10b981)' }}>
                        {d.summary}
                      </p>
                    )}
                  </div>
                );
              })()
            )}
          </header>
          <main className="px-12 py-10">
            {mainSections.map(s => renderSection(s, false))}
          </main>
        </div>
      </div>
    </div>
  );
}
