import {
  Phone,
  Mail,
  Linkedin,
  Github,
  MapPin,
  Calendar,
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import type { ResumeSection } from '../../../../lib/types/resume';
import { getScaleClass, getVisibleSections, hasSectionContent, type TemplateProps } from './templateShared';

const hasText = (value: string | undefined): boolean => Boolean(value && value.trim().length > 0);

const renderPersonalInfo = (section?: ResumeSection) => {
  if (!section || section.type !== 'personal_info') {
    return null;
  }

  const [item] = section.items;

  if (!item || item.type !== 'personal_info') {
    return null;
  }

  const data = item.data;

  return (
    <header className="space-y-3">
      <div className="space-y-0.5">
        {hasText(data.fullName) ? (
          <h1 className="text-[28px] font-bold tracking-tight text-black uppercase leading-tight">
            {data.fullName}
          </h1>
        ) : null}
        {hasText(data.jobTitle) ? (
          <p className="text-[15px] font-bold text-zinc-800 leading-tight">
            {data.jobTitle}
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-[10px] text-zinc-700 font-bold">
        {hasText(data.phone) ? (
          <div className="flex items-center gap-1.5">
            <Phone className="h-3 w-3 text-zinc-500" />
            <span>{data.phone}</span>
          </div>
        ) : null}
        {hasText(data.email) ? (
          <div className="flex items-center gap-1.5">
            <Mail className="h-3 w-3 text-zinc-500" />
            <span className="">{data.email}</span>
          </div>
        ) : null}
        {hasText(data.linkedin) ? (
          <div className="flex items-center gap-1.5">
            <Linkedin className="h-3 w-3 text-zinc-500" />
            <span className="">{data.linkedin?.replace(/^https?:\/\/(www\.)?/, '')}</span>
          </div>
        ) : null}
        {hasText(data.github) ? (
          <div className="flex items-center gap-1.5">
            <Github className="h-3 w-3 text-zinc-500" />
            <span className="">{data.github?.replace(/^https?:\/\/(www\.)?/, '')}</span>
          </div>
        ) : null}
        {hasText(data.location) ? (
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3 w-3 text-zinc-500" />
            <span>{data.location}</span>
          </div>
        ) : null}
      </div>
    </header>
  );
};

const renderSummarySection = (section: ResumeSection) => {
  if (section.type !== 'personal_info') return null;
  const [item] = section.items;
  if (!item || item.type !== 'personal_info' || !hasText(item.data.summary)) return null;

  return (
    <section className="space-y-2">
      <h2 className="text-sm font-bold uppercase tracking-widest border-b-2 border-black pb-1">
        Summary
      </h2>
      <p className="text-[11px] leading-relaxed text-zinc-800">
        {item.data.summary}
      </p>
    </section>
  );
};

const renderSkillSection = (section: ResumeSection) => {
  if (section.type !== 'skills') return null;

  return (
    <section className="space-y-2">
      <h2 className="text-[13px] font-bold uppercase tracking-tight border-b-2 border-black pb-0.5">
        {section.title}
      </h2>
      <div className="flex flex-wrap gap-x-1.5 gap-y-2 pt-1.5">
        {section.items.map((item) => {
          if (item.type !== 'skills' || !hasText(item.data.name)) return null;
          const data = item.data;
          return (
            <div
              key={item.id}
              className="px-2.5 py-[1px] border-[0.5px] border-black text-[10.5px] font-bold text-black bg-white"
            >
              {data.name}
            </div>
          );
        })}
      </div>
    </section>
  );
};

const renderExperienceSection = (section: ResumeSection) => {
  if (section.type !== 'experience') return null;

  return (
    <section className="space-y-2">
      <h2 className="text-[13px] font-bold uppercase tracking-tight border-b-2 border-black pb-0.5">
        {section.title}
      </h2>
      <div className="space-y-4 pt-1">
        {section.items.map((item, index) => {
          if (item.type !== 'experience') return null;
          const data = item.data;
          return (
            <div key={item.id} className={cn("space-y-1.5", index < section.items.length - 1 && "pb-4 border-b border-dotted border-zinc-300")}>
              <div className="flex justify-between items-baseline mb-0.5">
                <h3 className="text-[13px] font-bold text-black leading-none">{data.position}</h3>
                <div className="flex items-center gap-4 text-[10px] text-zinc-600 font-medium">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-zinc-400" />
                    <span>{data.startDate} — {data.isCurrent ? 'Present' : data.endDate}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-zinc-400" />
                    <span>{data.location}</span>
                  </div>
                </div>
              </div>
              <p className="text-[11px] font-bold text-zinc-800 italic leading-none">{data.company}</p>
              {hasText(data.description) ? (
                <p className="text-[10px] text-zinc-600 italic leading-normal -mt-0.5">
                  {data.description}
                </p>
              ) : null}
              {data.achievements?.length > 0 ? (
                <ul className="space-y-0.5 text-[10.5px] text-zinc-800 leading-normal ml-0.5">
                  {data.achievements.map((achievement, idx) => (
                      <li key={`${item.id}-${idx}`} className="flex gap-2 items-start">
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-black" />
                          <span>{achievement}</span>
                      </li>
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

const renderEducationSection = (section: ResumeSection) => {
  if (section.type !== 'education') return null;

  return (
    <section className="space-y-2">
      <h2 className="text-[13px] font-bold uppercase tracking-tight border-b-2 border-black pb-0.5">
        {section.title}
      </h2>
      <div className="space-y-3 pt-1">
        {section.items.map((item, index) => {
          if (item.type !== 'education') return null;
          const data = item.data;
          return (
            <div key={item.id} className={cn("space-y-1", index < section.items.length - 1 && "pb-3 border-b border-dotted border-zinc-300")}>
              <div className="flex justify-between items-baseline mb-0.5">
                <h3 className="text-[13px] font-bold text-black">{data.degree}</h3>
                <div className="flex items-center gap-4 text-[10px] text-zinc-600 font-medium font-medium">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-zinc-400" />
                    <span>{data.startDate} — {data.isCurrent ? 'Present' : data.endDate}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-zinc-400" />
                    <span>{data.location}</span>
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-zinc-900 font-semibold">{data.institution}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

const renderProjectSection = (section: ResumeSection) => {
  if (section.type !== 'projects') return null;

  return (
    <section className="space-y-2">
      <h2 className="text-[13px] font-bold uppercase tracking-tight border-b-2 border-black pb-0.5">
        {section.title}
      </h2>
      <div className="space-y-4 pt-1">
        {section.items.map((item, index) => {
          if (item.type !== 'projects') return null;
          const data = item.data;
          return (
            <div key={item.id} className={cn("space-y-1", index < section.items.length - 1 && "pb-4 border-b border-dotted border-zinc-300")}>
              <h3 className="text-[13px] font-bold text-black">{data.name}</h3>
              {hasText(data.description) ? (
                  <p className="text-[10px] text-zinc-700 font-semibold italic leading-snug">
                  {data.description}
                  </p>
              ) : null}
              {data.technologies?.length > 0 ? (
                <ul className="space-y-0.5 text-[10.5px] text-zinc-800 leading-normal ml-0.5 mt-1">
                  {data.technologies.map((tech, idx) => (
                      <li key={`${item.id}-${idx}`} className="flex gap-2 items-start">
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-black" />
                          <span>{tech}</span>
                      </li>
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

const renderCustomSection = (section: ResumeSection) => {
    if (section.type !== 'custom') return null;
  
    return (
      <section className="space-y-2">
        <h2 className="text-[13px] font-bold uppercase tracking-tight border-b-2 border-black pb-0.5">
          {section.title}
        </h2>
        <div className="grid grid-cols-2 gap-x-8 gap-y-4 pt-1">
          {section.items.map((item, index) => {
            if (item.type !== 'custom') return null;
            const data = item.data;
            return (
              <div key={item.id} className="space-y-1">
                <h3 className="text-[12px] font-bold text-black leading-tight border-l-2 border-zinc-300 pl-2">{data.title}</h3>
                <p className="text-[10px] text-zinc-700 leading-normal whitespace-pre-wrap pl-2 font-medium">
                  {data.content}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    );
  };

export default function ProfessionalTemplate({ resume, isPreview, scale }: TemplateProps) {
  const sections = getVisibleSections(resume).filter(hasSectionContent);
  const isDemo = resume.id === 'demo-resume-id';
  
  const displaySections = isDemo ? resume.sections : sections;
  const personalInfoSection = displaySections.find((s) => s.type === 'personal_info');
  const experienceSection = displaySections.find((s) => s.type === 'experience');
  const skillsSection = displaySections.find((s) => s.type === 'skills');
  const educationSection = displaySections.find((s) => s.type === 'education');
  const projectsSection = displaySections.find((s) => s.type === 'projects');
  const customSections = displaySections.filter((s) => s.type === 'custom');

  const personalInfoData = personalInfoSection?.items[0]?.data as any;

  return (
    <div className={cn('w-full min-h-[1100px] bg-white text-black py-16 px-16 font-sans antialiased', getScaleClass(scale), isPreview ? 'mx-auto' : '')}>
      <div className="max-w-[750px] mx-auto space-y-5">
        {renderPersonalInfo(personalInfoSection)}
        
        {personalInfoData?.summary && (
          <section className="space-y-1.5">
            <h2 className="text-[14px] font-extrabold uppercase tracking-tight border-b-2 border-black pb-0.5">
              Summary
            </h2>
            <p className="text-[10.5px] leading-relaxed text-zinc-800 font-medium text-justify">
                {personalInfoData.summary}
            </p>
          </section>
        )}
        
        {skillsSection && renderSkillSection(skillsSection)}
        
        {experienceSection && renderExperienceSection(experienceSection)}
        
        {customSections.map(renderCustomSection)}

        {educationSection && renderEducationSection(educationSection)}

        {projectsSection && renderProjectSection(projectsSection)}
      </div>
    </div>
  );
}
