'use client';

import { useCallback, useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Sparkles, Check } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import type { Resume, TemplateId } from '../../../lib/types/resume';
import { enrichWithDemoData } from '../../../lib/utils/demoData';
import { Button } from '@/components/ui/button';

import ClassicTemplate from './templates/ClassicTemplate';
import CreativeTemplate from './templates/CreativeTemplate';
import ExecutiveTemplate from './templates/ExecutiveTemplate';
import MinimalTemplate from './templates/MinimalTemplate';
import ModernTemplate from './templates/ModernTemplate';
import ProfessionalTemplate from './templates/ProfessionalTemplate';

type TemplateRow = {
  id: TemplateId;
  name: string;
  description: string;
  category: string;
  is_premium: boolean;
  thumbnail_url: string | null;
};

const templateRenderer: Record<TemplateId, (resume: Resume) => React.ReactNode> = {
  professional: (resume) => <ProfessionalTemplate resume={enrichWithDemoData(resume)} isPreview scale={1} />,
  modern: (resume) => <ModernTemplate resume={enrichWithDemoData(resume)} isPreview scale={1} />,
  classic: (resume) => <ClassicTemplate resume={enrichWithDemoData(resume)} isPreview scale={1} />,
  minimal: (resume) => <MinimalTemplate resume={enrichWithDemoData(resume)} isPreview scale={1} />,
  creative: (resume) => <CreativeTemplate resume={enrichWithDemoData(resume)} isPreview scale={1} />,
  executive: (resume) => <ExecutiveTemplate resume={enrichWithDemoData(resume)} isPreview scale={1} />,
};

const templateOrder: TemplateId[] = ['professional', 'modern', 'classic', 'minimal', 'creative', 'executive'];

export default function TemplatesList() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  
  const [templates, setTemplates] = useState<TemplateRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState<TemplateId | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTemplates() {
      setIsLoading(true);
      try {
        const { data, error: fetchError } = await supabase
          .from('templates')
          .select('id, name, description, category, is_premium, thumbnail_url')
          .order('name', { ascending: true });

        if (fetchError) throw fetchError;

        const fetchedTemplates = (data ?? []) as TemplateRow[];
        const orderedTemplates = [...fetchedTemplates].sort(
          (left, right) => templateOrder.indexOf(left.id) - templateOrder.indexOf(right.id)
        );
        setTemplates(orderedTemplates);
      } catch (err: any) {
        setError(err.message || 'Failed to load templates');
      } finally {
        setIsLoading(false);
      }
    }
    void loadTemplates();
  }, [supabase]);

  const handleUseTemplate = async (templateId: TemplateId) => {
    setIsCreating(templateId);
    try {
      const response = await fetch('/api/resumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || 'Failed to create resume');
      }

      router.push(`/resume/${payload.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create resume');
      setIsCreating(null);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="aspect-[4/5] animate-pulse rounded-[32px] bg-slate-100" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
        {templates.map((template) => (
          <div 
            key={template.id} 
            className="group relative flex flex-col rounded-[32px] border border-slate-200 bg-white p-4 transition-all hover:border-emerald-300 hover:shadow-2xl hover:shadow-slate-200"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] border border-slate-100 bg-slate-50">
              <div className="absolute inset-0 origin-top-left scale-[0.25] w-[400%] h-[400%] pointer-events-none group-hover:scale-[0.26] transition-transform duration-500">
                {templateRenderer[template.id](null as any)}
              </div>
              
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
              
              {template.is_premium && (
                <div className="absolute top-4 right-4 bg-amber-400 text-white p-2 rounded-xl shadow-lg">
                  <Sparkles size={16} />
                </div>
              )}
            </div>

            <div className="mt-6 px-2">
              <div className="flex items-center justify-between mb-2">
                 <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                   {template.category}
                 </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                {template.name}
              </h3>
              <p className="mt-2 text-sm text-slate-400 font-medium line-clamp-2 leading-relaxed">
                {template.description}
              </p>
              
              <Button
                onClick={() => void handleUseTemplate(template.id)}
                disabled={isCreating !== null}
                className={cn(
                  "w-full mt-6 h-12 rounded-2xl font-bold transition-all active:scale-95 shadow-lg",
                  isCreating === template.id 
                    ? "bg-slate-100 text-slate-400" 
                    : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-100"
                )}
              >
                {isCreating === template.id ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Use This Template'
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
