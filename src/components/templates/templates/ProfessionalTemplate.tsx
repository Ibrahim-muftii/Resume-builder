import {
  Phone,
  Mail,
  Linkedin,
  Github,
  MapPin,
  Calendar,
  Link as LinkIcon,
  AtSign,
} from 'lucide-react';
import { cn } from '../../../lib/utils';
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
import { getScaleClass, getTemplateStyles, getVisibleSections, hasSectionContent, type TemplateProps } from './templateShared';

const hasText = (value: string | undefined): boolean => Boolean(value && value.trim().length > 0);

/* ─── Shared heading ─── */
const SectionHeading = ({ children, sectionType }: { children: React.ReactNode; sectionType?: string }) => (
  <h2
    data-resume-section={sectionType}
    className="text-[16px] font-extrabold uppercase tracking-[0.04em] border-b-[2.5px] pb-[3px] mb-2"
    style={{ color: 'var(--primary-color, black)', borderBottomColor: 'var(--primary-color, black)' }}
  >
    {children}
  </h2>
);

/* ─── Bullet item ─── */
const BulletItem = ({ text, itemKey }: { text: string; itemKey: string }) => (
  <li key={itemKey} className="flex gap-[7px] items-start leading-[1.55]">
    <span
      className="mt-[6px] h-[4px] w-[4px] shrink-0 rounded-full"
      style={{ backgroundColor: 'var(--primary-color, black)' }}
    />
    <span>{text}</span>
  </li>
);

/* ─── Date + Location row ─── */
const DateLocationRow = ({ startDate, endDate, isCurrent, location }: {
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  location?: string;
}) => {
  const hasDate = hasText(startDate);
  const hasLoc = hasText(location);
  if (!hasDate && !hasLoc) return null;

  const dateStr = hasDate
    ? `${startDate}${isCurrent ? '' : endDate ? ` - ${endDate}` : ''}`
    : '';

  return (
    <div className="flex items-center gap-4 text-[10px] text-zinc-600 font-medium mt-[1px]">
      {hasDate ? (
        <div className="flex items-center gap-[3px]">
          <Calendar className="h-[11px] w-[11px] text-zinc-500" />
          <span>{dateStr}</span>
        </div>
      ) : null}
      {hasLoc ? (
        <div className="flex items-center gap-[3px]">
          <MapPin className="h-[11px] w-[11px] text-zinc-500" />
          <span>{location}</span>
        </div>
      ) : null}
    </div>
  );
};

/* ─── Header / Personal Info ─── */
const renderPersonalInfo = (section?: ResumeSection) => {
  if (!section || section.type !== 'personal_info') return null;
  const [item] = section.items;
  if (!item || item.type !== 'personal_info') return null;
  const d = item.data as PersonalInfoData;

  return (
    <header className="space-y-2">
      <div className="space-y-[2px]">
        {hasText(d.fullName) ? (
          <h1 className="text-[30px] font-extrabold tracking-tight text-black uppercase leading-[1.1]">
            {d.fullName}
          </h1>
        ) : null}
        {hasText(d.jobTitle) ? (
          <p className="text-[14px] font-bold text-zinc-700 leading-tight">
            {d.jobTitle}
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-x-[10px] gap-y-[4px] text-[10px] text-zinc-700 font-semibold">
        {hasText(d.phone) ? (
          <div className="flex items-center gap-[3px]">
            <Phone className="h-[11px] w-[11px] text-zinc-500" />
            <span>{d.phone}</span>
          </div>
        ) : null}
        {hasText(d.email) ? (
          <div className="flex items-center gap-[3px]">
            <AtSign className="h-[11px] w-[11px] text-zinc-500" />
            <span>{d.email}</span>
          </div>
        ) : null}
        {hasText(d.linkedin) ? (
          <div className="flex items-center gap-[3px]">
            <AtSign className="h-[11px] w-[11px] text-zinc-500" />
            <span className="text-[#1a5276]">{d.linkedin?.replace(/^https?:\/\/(www\.)?/, '')}</span>
          </div>
        ) : null}
        {hasText(d.github) ? (
          <div className="flex items-center gap-[3px]">
            <Github className="h-[11px] w-[11px] text-zinc-500" />
            <span className="text-[#1a5276]">{d.github?.replace(/^https?:\/\/(www\.)?/, '')}</span>
          </div>
        ) : null}
        {hasText(d.location) ? (
          <div className="flex items-center gap-[3px]">
            <MapPin className="h-[11px] w-[11px] text-zinc-500" />
            <span>{d.location}</span>
          </div>
        ) : null}
      </div>
    </header>
  );
};

/* ─── Summary ─── */
const renderSummary = (section?: ResumeSection) => {
  if (!section || section.type !== 'personal_info') return null;
  const [item] = section.items;
  if (!item || item.type !== 'personal_info') return null;
  const d = item.data as PersonalInfoData;
  if (!hasText(d.summary)) return null;

  return (
    <section>
      <SectionHeading sectionType="personal_info">Summary</SectionHeading>
      <p className="text-[10.5px] leading-[1.6] text-zinc-800 font-medium text-justify">
        {d.summary}
      </p>
    </section>
  );
};

/* ─── Skills ─── */
const renderSkills = (section: ResumeSection) => {
  if (section.type !== 'skills') return null;

  return (
    <section>
      <SectionHeading sectionType="skills">{section.title}</SectionHeading>
      <div className="flex flex-wrap gap-x-[5px] gap-y-[6px] pt-1">
        {section.items.map((item) => {
          if (item.type !== 'skills') return null;
          const d = item.data as SkillData;
          if (!hasText(d.name)) return null;
          return (
            <div
              key={item.id}
              className="px-[8px] py-[1px] border text-[10px] font-bold bg-white"
              style={{ borderColor: 'var(--primary-color, #18181b)', color: 'var(--primary-color, black)' }}
            >
              {d.name}
            </div>
          );
        })}
      </div>
    </section>
  );
};

/* ─── Experience ─── */
const renderExperience = (section: ResumeSection) => {
  if (section.type !== 'experience') return null;

  return (
    <section>
      <SectionHeading sectionType="experience">{section.title}</SectionHeading>
      <div className="space-y-0 pt-[2px]">
        {section.items.map((item, index) => {
          if (item.type !== 'experience') return null;
          const d = item.data as ExperienceData;
          const isLast = index === section.items.length - 1;

          return (
            <div
              key={item.id}
              data-resume-item
              className={cn(
                'pb-[10px]',
                !isLast && 'mb-[10px] border-b border-dotted border-zinc-300'
              )}
            >
              {hasText(d.position) ? (
                <h3 className="text-[13px] font-bold text-black leading-snug">{d.position}</h3>
              ) : null}
              {hasText(d.company) ? (
                <p className="text-[11px] font-bold text-zinc-700 italic leading-snug">{d.company}</p>
              ) : null}
              <DateLocationRow
                startDate={d.startDate}
                endDate={d.endDate}
                isCurrent={d.isCurrent}
                location={d.location}
              />
              {hasText(d.descriptionTitle) ? (
                <p className="text-[10px] text-zinc-700 italic leading-[1.5] mt-[4px]">
                  {d.descriptionTitle}
                </p>
              ) : null}
              {d.descriptionBullets && d.descriptionBullets.length > 0 ? (
                <ul className="mt-[3px] space-y-[1px] text-[10.5px] text-zinc-800 leading-normal">
                  {d.descriptionBullets.map((bullet, idx) => (
                    <BulletItem key={`${item.id}-desc-${idx}`} text={bullet} itemKey={`${item.id}-desc-${idx}`} />
                  ))}
                </ul>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
};

/* ─── Education ─── */
const renderEducation = (section: ResumeSection) => {
  if (section.type !== 'education') return null;

  return (
    <section>
      <SectionHeading sectionType="education">{section.title}</SectionHeading>
      <div className="space-y-0 pt-[2px]">
        {section.items.map((item, index) => {
          if (item.type !== 'education') return null;
          const d = item.data as EducationData;
          const isLast = index === section.items.length - 1;
          const degreeLine = [d.degree, d.field].filter(hasText).join(' in ');

          return (
            <div
              key={item.id}
              data-resume-item
              className={cn(
                'pb-[8px]',
                !isLast && 'mb-[8px] border-b border-dotted border-zinc-300'
              )}
            >
              {hasText(degreeLine) ? (
                <h3 className="text-[13px] font-bold text-black leading-snug">{degreeLine}</h3>
              ) : null}
              {hasText(d.institution) ? (
                <p className="text-[11px] font-semibold text-zinc-700 italic leading-snug">{d.institution}</p>
              ) : null}
              <DateLocationRow
                startDate={d.startDate}
                endDate={d.endDate}
                isCurrent={d.isCurrent}
                location={d.location}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
};

/* ─── Projects ─── */
const renderProjects = (section: ResumeSection) => {
  if (section.type !== 'projects') return null;

  return (
    <section>
      <SectionHeading sectionType="projects">{section.title}</SectionHeading>
      <div className="space-y-0 pt-[2px]">
        {section.items.map((item, index) => {
          if (item.type !== 'projects') return null;
          const d = item.data as ProjectData;
          const isLast = index === section.items.length - 1;

          return (
            <div
              key={item.id}
              data-resume-item
              className={cn(
                'pb-[10px]',
                !isLast && 'mb-[10px] border-b border-dotted border-zinc-300'
              )}
            >
              {hasText(d.name) ? (
                <h3 className="text-[13px] font-bold text-black leading-snug">{d.name}</h3>
              ) : null}
              {hasText(d.descriptionTitle) ? (
                <p className="text-[10px] text-zinc-700 italic leading-[1.5] mt-[1px]">
                  {d.descriptionTitle}
                </p>
              ) : null}
              {d.descriptionBullets && d.descriptionBullets.length > 0 ? (
                <ul className="mt-[3px] space-y-[1px] text-[10.5px] text-zinc-800 leading-normal">
                  {d.descriptionBullets.map((bullet, idx) => (
                    <BulletItem key={`${item.id}-proj-${idx}`} text={bullet} itemKey={`${item.id}-proj-${idx}`} />
                  ))}
                </ul>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
};

/* ─── Custom ─── */
const renderCustom = (section: ResumeSection) => {
  if (section.type !== 'custom') return null;

  return (
    <section>
      <SectionHeading sectionType="custom">{section.title}</SectionHeading>
      <div className="grid grid-cols-2 gap-x-8 gap-y-[10px] pt-[2px]">
        {section.items.map((item) => {
          if (item.type !== 'custom') return null;
          const d = item.data as CustomData;
          return (
            <div key={item.id}>
              {hasText(d.title) ? (
                <h3 className="text-[11.5px] font-bold text-black leading-tight">{d.title}</h3>
              ) : null}
              {hasText(d.content) ? (
                <p className="text-[10px] text-zinc-700 leading-[1.55] mt-[2px] whitespace-pre-wrap">
                  {d.content}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
};

/* ─── Key Achievements ─── */
const renderKeyAchievements = (section: ResumeSection) => {
  if (section.type !== 'key_achievements') return null;

  return (
    <section>
      <SectionHeading sectionType="key_achievements">{section.title}</SectionHeading>
      <div className="space-y-3 pt-[2px]">
        {section.items.map((item) => {
          if (item.type !== 'key_achievements') return null;
          const d = item.data as KeyAchievementData;
          return (
            <div key={item.id} className="space-y-1">
              {hasText(d.title) ? (
                <h3 className="text-[12px] font-bold text-black leading-snug">{d.title}</h3>
              ) : null}
              {hasText(d.description) ? (
                <p className="text-[10.5px] text-zinc-800 leading-[1.5] whitespace-pre-wrap">
                  {d.description}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
};

/* ─── Certifications ─── */
const renderCertifications = (section: ResumeSection) => {
  if (section.type !== 'certifications') return null;

  return (
    <section>
      <SectionHeading sectionType="certifications">{section.title}</SectionHeading>
      <div className="space-y-[6px] pt-[2px]">
        {section.items.map((item) => {
          if (item.type !== 'certifications') return null;
          const d = item.data as CertificationData;
          return (
            <div key={item.id}>
              {hasText(d.name) ? <h3 className="text-[12px] font-bold text-black">{d.name}</h3> : null}
              {hasText(d.issuer) ? <p className="text-[10px] text-zinc-600">{d.issuer}</p> : null}
            </div>
          );
        })}
      </div>
    </section>
  );
};

/* ─── Languages ─── */
const renderLanguages = (section: ResumeSection) => {
  if (section.type !== 'languages') return null;

  return (
    <section>
      <SectionHeading sectionType="languages">{section.title}</SectionHeading>
      <div className="flex flex-wrap gap-x-6 gap-y-[4px] pt-[2px]">
        {section.items.map((item) => {
          if (item.type !== 'languages') return null;
          const d = item.data as LanguageData;
          return (
            <div key={item.id} className="text-[10.5px] text-zinc-800">
              <span className="font-bold">{d.name}</span>
              <span className="text-zinc-500 ml-1">({d.proficiency})</span>
            </div>
          );
        })}
      </div>
    </section>
  );
};

const renderSection = (section: ResumeSection) => {
  switch (section.type) {
    case 'experience': return renderExperience(section);
    case 'education': return renderEducation(section);
    case 'skills': return renderSkills(section);
    case 'projects': return renderProjects(section);
    case 'custom': return renderCustom(section);
    case 'certifications': return renderCertifications(section);
    case 'languages': return renderLanguages(section);
    case 'key_achievements': return renderKeyAchievements(section);
    default: return null;
  }
};

export default function ProfessionalTemplate({ resume, isPreview, scale }: TemplateProps) {
  const sections = getVisibleSections(resume).filter(hasSectionContent);
  const isDemo = resume.id === 'demo-resume-id';
  const customStyles = getTemplateStyles(resume);

  const displaySections = isDemo ? resume.sections : sections;
  const personalInfoSection = displaySections.find((s) => s.type === 'personal_info');
  const orderedSections = displaySections
    .filter((s) => s.type !== 'personal_info')
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div
      className={cn(
        'w-full min-h-[1100px] text-black font-sans antialiased transition-all duration-300',
        'py-[40px] px-[44px]',
        getScaleClass(scale),
        isPreview ? 'mx-auto' : ''
      )}
      style={{
        ...customStyles,
        fontFamily: 'var(--font-family, Inter, sans-serif)',
        backgroundColor: 'var(--background-color, white)',
        fontSize: 'var(--font-size, 16px)',
      }}
    >
      <div className="max-w-[720px] mx-auto space-y-[16px]">
        {renderPersonalInfo(personalInfoSection)}
        {renderSummary(personalInfoSection)}
        {orderedSections.map((section) => (
          <div key={section.id}>{renderSection(section)}</div>
        ))}
      </div>
    </div>
  );
}
