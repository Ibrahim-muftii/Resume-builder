'use client';

import type { ReactElement } from 'react';
import { useResumeStore } from '../../../lib/stores/resumeStore';
import ModernTemplate from '@/components/templates/templates/ModernTemplate';
import ClassicTemplate from '@/components/templates/templates/ClassicTemplate';
import MinimalTemplate from '@/components/templates/templates/MinimalTemplate';
import CreativeTemplate from '@/components/templates/templates/CreativeTemplate';
import ExecutiveTemplate from '@/components/templates/templates/ExecutiveTemplate';
import ProfessionalTemplate from '@/components/templates/templates/ProfessionalTemplate';
import type { Resume, TemplateId } from '../../../lib/types/resume';

interface LivePreviewContentProps {
  initialResume: Resume;
}

const renderTemplate = (resume: Resume, templateId: TemplateId): ReactElement => {
  const props = { resume, isPreview: true, scale: 1.0 };
  
  switch (templateId) {
    case 'professional': return <ProfessionalTemplate {...props} />;
    case 'classic': return <ClassicTemplate {...props} />;
    case 'minimal': return <MinimalTemplate {...props} />;
    case 'creative': return <CreativeTemplate {...props} />;
    case 'executive': return <ExecutiveTemplate {...props} />;
    default: return <ModernTemplate {...props} />;
  }
};

export function LivePreviewContent({ initialResume }: LivePreviewContentProps) {
  const resume = useResumeStore((state) => state.resume) || initialResume;

  return (
    <div className="shadow-2xl bg-white">
      {renderTemplate(resume, resume.templateId)}
    </div>
  );
}
