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
import { SectionIcon } from './SectionIcon';

const hasText = (value: string | undefined): boolean => Boolean(value && value.trim().length > 0);

const renderPersonalInfo = (section?: ResumeSection) => {
  if (!section || section.type !== 'personal_info') return null;
  const item = section.items[0];
  if (!item || item.type !== 'personal_info') return null;
  const data = item.data as PersonalInfoData;

  return (
    <div style={{ display: 'block', marginBottom: '40px' }}>
      <div style={{ width: '100%', aspectRatio: '1/1', borderRadius: '24px', backgroundColor: 'rgba(255,255,255,0.1)', overflow: 'hidden', marginBottom: '24px' }}>
        {data.avatarUrl && <img src={data.avatarUrl} alt={data.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
      </div>
      <div style={{ marginBottom: '16px' }}>
        {hasText(data.fullName) && <h1 style={{ fontWeight: 'bold', fontSize: '2.4em', lineHeight: '1.2' }}>{data.fullName}</h1>}
        {hasText(data.jobTitle) && (
          <p style={{ fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.25em', color: 'var(--primary-color, #6ee7b7)', fontSize: '0.9em', marginTop: '8px' }}>
            {data.jobTitle}
          </p>
        )}
      </div>
      <div style={{ fontSize: '0.85em', opacity: 0.9 }}>
        {[data.email, data.phone, data.location].filter(Boolean).map((val, i) => <p key={i} style={{ marginBottom: '4px' }}>{val}</p>)}
      </div>
    </div>
  );
};

const renderSection = (section: ResumeSection, isSidebar = false) => {
  return (
    <div key={section.id} style={{ display: 'block', marginBottom: '40px', pageBreakInside: 'avoid', breakInside: 'avoid' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <SectionIcon type={section.type} className="h-5 w-5" style={{ color: 'var(--primary-color, #6ee7b7)' }} />
        <h2 style={{ fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.3em', fontSize: '0.75em', color: isSidebar ? 'var(--primary-color, #6ee7b7)' : 'var(--primary-color, #134e4a)' }}>
          {section.title}
        </h2>
      </div>
      <div style={{ display: 'block' }}>
        {section.items.map((item) => {
          if (item.type === 'experience') {
            const data = item.data as ExperienceData;
            return (
              <div key={item.id} data-resume-item style={{ display: 'block', marginBottom: '24px', pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                  <h3 style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '1.1em' }}>{data.position}</h3>
                  <span style={{ color: '#94a3b8', fontFamily: 'monospace', fontSize: '0.75em' }}>{data.startDate} - {data.endDate}</span>
                </div>
                <p style={{ fontWeight: 600, color: 'var(--primary-color, #0d9488)', fontSize: '0.9em', marginBottom: '8px' }}>{data.company}</p>
                {data.descriptionBullets && data.descriptionBullets.length > 0 && (
                  <ul style={{ paddingLeft: '0px', fontSize: '0.85em', opacity: 0.8 }}>
                    {data.descriptionBullets.map((b, i) => <li key={i} style={{ marginBottom: '6px', listStyleType: 'none' }}>• {b}</li>)}
                  </ul>
                )}
              </div>
            );
          }
          if (item.type === 'education') {
            const data = item.data as EducationData;
            return (
              <div key={item.id} data-resume-item style={{ display: 'block', marginBottom: '24px', pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <h3 style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '1em' }}>{data.degree}</h3>
                  <span style={{ color: '#94a3b8', fontSize: '0.75em' }}>{data.startDate} - {data.endDate}</span>
                </div>
                <p style={{ color: 'var(--primary-color, #0d9488)', fontSize: '0.85em' }}>{data.institution}</p>
              </div>
            );
          }
          if (item.type === 'skills') {
            const data = item.data as SkillData;
            return (
              <div key={item.id} data-resume-item style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85em', marginBottom: '4px' }}>
                  <span>{data.name}</span>
                  <span style={{ opacity: 0.6 }}>{data.level}</span>
                </div>
                <div style={{ height: '4px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                  <div style={{ height: '100%', width: data.level === 'expert' ? '100%' : data.level === 'advanced' ? '75%' : data.level === 'intermediate' ? '50%' : '25%', backgroundColor: 'var(--primary-color, #6ee7b7)', borderRadius: '2px' }} />
                </div>
              </div>
            );
          }
          if (item.type === 'projects') {
            const data = item.data as ProjectData;
            return (
              <div key={item.id} data-resume-item style={{ marginBottom: '20px' }}>
                <h3 style={{ fontWeight: 'bold', fontSize: '1em' }}>{data.name}</h3>
                <p style={{ fontSize: '0.85em', opacity: 0.8 }}>{data.descriptionTitle}</p>
              </div>
            );
          }
          if (item.type === 'languages') {
            const data = item.data as LanguageData;
            return (
              <div key={item.id} data-resume-item style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85em', marginBottom: '8px' }}>
                <span>{data.name}</span>
                <span style={{ opacity: 0.6 }}>{data.proficiency}</span>
              </div>
            );
          }
          if (item.type === 'certifications') {
            const data = item.data as CertificationData;
            return (
              <div key={item.id} data-resume-item style={{ marginBottom: '12px', fontSize: '0.85em' }}>
                <p style={{ fontWeight: 'bold' }}>{data.name}</p>
                <p style={{ opacity: 0.6 }}>{data.issuer}</p>
              </div>
            );
          }
          if (item.type === 'key_achievements') {
            const data = item.data as KeyAchievementData;
            return (
              <div key={item.id} data-resume-item style={{ marginBottom: '16px', fontSize: '0.85em' }}>
                <p style={{ fontWeight: 'bold' }}>{data.title}</p>
                <p style={{ opacity: 0.8 }}>{data.description}</p>
              </div>
            );
          }
          if (item.type === 'custom') {
            const data = item.data as CustomData;
            return (
              <div key={item.id} data-resume-item style={{ marginBottom: '16px', fontSize: '0.85em' }}>
                <p style={{ fontWeight: 'bold' }}>{data.title}</p>
                <p style={{ opacity: 0.8 }}>{data.content}</p>
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default function ModernTemplate({ resume, isPreview, scale }: TemplateProps) {
  const sections = getVisibleSections(resume).filter(hasSectionContent);
  const displaySections = resume.id === 'demo-resume-id' ? resume.sections : sections;
  const personalInfoSection = displaySections.find((s) => s.type === 'personal_info');
  const sidebarSections = displaySections.filter((s) => ['skills', 'languages', 'certifications'].includes(s.type));
  const mainSections = displaySections.filter((s) => ['experience', 'education', 'projects', 'custom', 'key_achievements'].includes(s.type));
  const customStyles = getTemplateStyles(resume);

  return (
    <div 
      className={cn('w-full text-zinc-950 antialiased font-sans', getScaleClass(scale), isPreview ? 'mx-auto' : '')}
      style={{
        ...customStyles,
        height: 'auto',
        minHeight: '0px',
        display: 'block',
        fontFamily: 'var(--font-family, Inter, sans-serif)',
        backgroundColor: 'var(--background-color, #f9fafb)',
        fontSize: 'var(--font-size, 16px)',
      }}
    >
      <div style={{ display: 'block', clear: 'both' }}>
        {/* Sidebar */}
        <aside style={{ 
            width: '30%', 
            float: 'left', 
            backgroundColor: '#0f172a', 
            color: 'white', 
            padding: '40px 32px',
            minHeight: '1123px' 
        }}>
          {renderPersonalInfo(personalInfoSection)}
          {sidebarSections.map(s => renderSection(s, true))}
        </aside>

        {/* Content */}
        <main style={{ 
            width: '70%', 
            float: 'left', 
            backgroundColor: 'white', 
            padding: '40px 40px',
            minHeight: '1123px'
        }}>
          {mainSections.map(s => renderSection(s))}
        </main>

        <div style={{ clear: 'both' }} />
      </div>
    </div>
  );
}
