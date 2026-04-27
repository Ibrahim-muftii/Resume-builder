import { Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react';
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

const hasText = (value: string | undefined): boolean => Boolean(value && value.trim().length > 0);

export default function CreativeTemplate({ resume, isPreview, scale }: TemplateProps) {
  const sections = getVisibleSections(resume).filter(hasSectionContent);
  const customStyles = getTemplateStyles(resume);
  const isDemo = resume.id === 'demo-resume-id';

  const displaySections = isDemo ? resume.sections : sections;
  const personalInfoSection = displaySections.find((s) => s.type === 'personal_info');
  
  const sidebarSections = displaySections.filter((s) => ['skills', 'languages', 'certifications'].includes(s.type));
  const mainSections = displaySections.filter((s) => !['personal_info', 'skills', 'languages', 'certifications'].includes(s.type));

  const renderSection = (section: ResumeSection, mode: 'sidebar' | 'main') => {
    const isSidebar = mode === 'sidebar';
    
    return (
      <div key={section.id} className="mb-10">
        <h2 
          data-resume-section={section.type}
          className={cn(
            "text-[10px] font-black uppercase tracking-[0.5em] mb-6 flex items-center gap-3",
            isSidebar ? "text-teal-400" : "text-zinc-900"
          )}
        >
          {section.title}
        </h2>
        <div className="space-y-6">
          {section.items.map((item) => {
<<<<<<< Updated upstream
             const baseProps = {
                key: item.id,
                'data-resume-item': true,
                className: cn("space-y-3", isSidebar ? "text-white" : "text-zinc-700"),
                style: { breakInside: 'avoid' as const }
              };

              if (item.type === 'experience') {
                const d = item.data as ExperienceData;
                return (
                  <div {...baseProps} className="bg-zinc-50 border-l-4 border-teal-500 p-5 rounded-r-xl shadow-sm">
                    <h3 className="text-[17px] font-black text-zinc-900 tracking-tighter leading-none">{d.position}</h3>
                    <div className="flex items-center justify-between text-[11px] font-black text-teal-600 uppercase tracking-widest mt-1" style={{ color: 'var(--primary-color, #14b8a6)' }}>
                       <span>{d.company}</span>
                       <span className="text-zinc-400 tabular-nums">{d.startDate} — {d.endDate}</span>
=======
            const baseProps = {
              'data-resume-item': true,
              className: cn("space-y-2", isSidebar ? "text-white" : "text-zinc-700"),
              style: { breakInside: 'avoid' as const }
            };

            if (item.type === 'experience') {
              const d = item.data as ExperienceData;
              return (
                <div key={item.id} data-resume-section-row>
                  <div key={item.id} {...baseProps} className="relative pl-6 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-zinc-100 before:rounded-full">
                    <div className="flex justify-between items-baseline group">
                      <h3 className="text-[14.5px] font-black text-zinc-900 tracking-tight leading-none group-hover:text-emerald-600 transition-colors">{d.position}</h3>
                      <span className="text-[9px] font-black text-zinc-300 tabular-nums uppercase">{d.startDate} — {d.endDate}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-black text-emerald-600 uppercase tracking-widest pt-1" style={{ color: 'var(--primary-color, #10b981)' }}>
                      <span>{d.company}</span>
                      <span className="text-zinc-400 font-medium tracking-normal lowercase italic">{d.location}</span>
>>>>>>> Stashed changes
                    </div>
                    {d.descriptionBullets && d.descriptionBullets.length > 0 && (
                      <ul className="space-y-2 text-[12px] text-zinc-600 leading-relaxed font-bold mt-4">
                        {d.descriptionBullets.map((bullet, i) => (
                          <li key={i} className="flex gap-3">
                            <span className="h-1.5 w-1.5 rounded-full bg-teal-400 shrink-0 mt-1.5" />
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              }

<<<<<<< Updated upstream
              if (item.type === 'skills') {
                const d = item.data as SkillData;
                return (
                  <div {...baseProps} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[13px] font-black tracking-tight text-white">{d.name}</span>
                      <span className="text-[9px] font-black uppercase tracking-tighter text-teal-400">{d.level}</span>
                    </div>
                    <div className="h-1 w-full bg-teal-950/50 rounded-full overflow-hidden">
                       <div 
                        className="h-full bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.5)]" 
                        style={{ width: d.level === 'expert' ? '100%' : d.level === 'advanced' ? '80%' : d.level === 'intermediate' ? '60%' : '40%' }} 
                       />
=======
            if (item.type === 'projects') {
              const d = item.data as ProjectData;
              return (
                <div key={item.id} data-resume-section-row>
                  <div key={item.id} {...baseProps} className="bg-zinc-50/50 p-4 rounded-xl border border-zinc-100/50">
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-[13px] font-black text-zinc-900">{d.name}</h3>
                      {hasText(d.url) && <span className="text-[9px] font-bold text-emerald-600 uppercase" style={{ color: 'var(--primary-color, #10b981)' }}>Link</span>}
>>>>>>> Stashed changes
                    </div>
                  </div>
                );
              }

              if (isSidebar) {
                return (
                  <div {...baseProps} className="pb-4 border-b border-teal-800/30 last:border-0">
                    <p className="text-[13px] font-black text-white">{ (item.data as any).name || (item.data as any).title }</p>
                    <p className="text-[10px] font-medium text-teal-400 lowercase italic">{(item.data as any).proficiency || (item.data as any).issuer || (item.data as any).content }</p>
                  </div>
                );
              }

              return (
                <div {...baseProps}>
                    <h3 className="text-[14px] font-black text-zinc-900">{(item.data as any).name || (item.data as any).title}</h3>
                    <p className="text-[12px] leading-relaxed font-bold text-zinc-500">{(item.data as any).descriptionTitle || (item.data as any).description || (item.data as any).content}</p>
                </div>
              );
<<<<<<< Updated upstream
=======
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
              <div key={item.id} data-resume-section-row {...baseProps}>
                <h3 className="text-[12px] font-black text-zinc-900">{(item.data as any).name || (item.data as any).title}</h3>
                <p className="text-[11px] leading-relaxed font-bold text-zinc-400">{(item.data as any).description || (item.data as any).content}</p>
              </div>
            );
>>>>>>> Stashed changes
          })}
        </div>
      </div>
    );
  };

  return (
    <div
      className={cn(
        'w-full min-h-[1123px] antialiased bg-white text-zinc-950 font-sans relative flex flex-col',
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
      {/* Dynamic Sidebar Background */}
      <div className="absolute top-0 left-0 w-[280px] bottom-0 bg-zinc-900 -z-0" style={{ backgroundColor: 'var(--primary-color, #18181b)' }} />

      {/* Header Splash */}
      <header className="relative z-10 pl-[280px] pt-20 pb-16 pr-12 bg-white border-b-8 border-zinc-900/5">
        {personalInfoSection && personalInfoSection.items[0]?.type === 'personal_info' && (
          (() => {
            const d = personalInfoSection.items[0].data as PersonalInfoData;
            return (
              <div className="flex flex-col gap-6">
                 <div className="space-y-1">
                    <h1 className="text-[64px] font-black leading-[0.8] tracking-tighter uppercase text-zinc-900">{d.fullName}</h1>
                    <p className="text-[18px] font-black text-teal-500 uppercase tracking-[0.5em] pt-2" style={{ color: 'var(--primary-color, #14b8a6)' }}>{d.jobTitle}</p>
                 </div>
                 <p className="text-[14px] text-zinc-500 font-bold leading-[1.8] max-w-xl border-t-2 border-zinc-50 pt-6">
                    {d.summary}
                 </p>
              </div>
            );
          })()
        )}
      </header>
=======
      {/* 
          Stable Sidebar Background: Using an absolute div instead of a gradient.
          This ensures compatibility with all PDF viewers (Google/Chrome, Mac, etc.)
          by providing a solid, predictable layout element that spans the total height.
      */}


      <div className={cn(
        "relative flex flex-1 mx-auto bg-white min-h-full",
        isPreview ? "max-w-[720px]" : ""
      )}>
        {/* Sidebar Background (Moved inside to maintain alignment with centered content) */}
        <div
          className="absolute left-0 top-0 bottom-0 w-[260px] bg-zinc-900 pointer-events-none"
          style={{ backgroundColor: 'var(--sidebar-bg, #18181b)' }}
        />
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
>>>>>>> Stashed changes

      {/* Body Content */}
      <div className="flex-1 relative z-10 flex">
         {/* Sidebar Content */}
         <aside className="w-[280px] px-12 py-12 space-y-12 shrink-0">
            {personalInfoSection && personalInfoSection.items[0]?.type === 'personal_info' && (
              <div className="space-y-8">
                 {(() => {
                    const d = personalInfoSection.items[0].data as PersonalInfoData;
                    return (
                      <div className="space-y-6 text-white">
                        {d.email && <div className="space-y-1"><p className="text-[8px] font-black uppercase tracking-[0.4em] text-teal-400">Email</p><p className="text-[12px] font-black break-all">{d.email}</p></div>}
                        {d.phone && <div className="space-y-1"><p className="text-[8px] font-black uppercase tracking-[0.4em] text-teal-400">Phone</p><p className="text-[12px] font-black">{d.phone}</p></div>}
                        {d.location && <div className="space-y-1"><p className="text-[8px] font-black uppercase tracking-[0.4em] text-teal-400">Location</p><p className="text-[12px] font-black uppercase tracking-tighter">{d.location}</p></div>}
                      </div>
                    );
                 })()}
              </div>
            )}
            {sidebarSections.map(s => renderSection(s, 'sidebar'))}
         </aside>

         {/* Main Content */}
         <main className="flex-1 px-12 py-12 bg-white min-h-[900px]">
            {mainSections.map(s => renderSection(s, 'main'))}
         </main>
      </div>
    </div>
  );
}
