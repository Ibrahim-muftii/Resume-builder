import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ModernTemplate from '@/components/templates/templates/ModernTemplate';
import ClassicTemplate from '@/components/templates/templates/ClassicTemplate';
import MinimalTemplate from '@/components/templates/templates/MinimalTemplate';
import CreativeTemplate from '@/components/templates/templates/CreativeTemplate';
import ExecutiveTemplate from '@/components/templates/templates/ExecutiveTemplate';
import ProfessionalTemplate from '@/components/templates/templates/ProfessionalTemplate';
<<<<<<< Updated upstream
import { sectionItemDataSchema } from '../../../../../../lib/validations/resumeSchema';
import { getDefaultSectionItem } from '../../../../../../lib/utils/sectionDefaults';
import type { Resume, ResumeSection, SectionItem, SectionItemData, SectionType, TemplateId } from '../../../../../../lib/types/resume';
=======
import LondonTemplate from '@/components/templates/templates/LondonTemplate';
import type { Resume, ResumeSection, SectionItem, SectionItemData, SectionType } from 'lib/types/resume';
import { sectionItemDataSchema } from 'lib/validations/resumeSchema';
import { getDefaultSectionItem } from 'lib/utils/sectionDefaults';
>>>>>>> Stashed changes

type ExportPageProps = {
  params: Promise<{ id: string }>;
};

const mapResume = (resumeRow: any, sections: any[], items: any[]): Resume => {
  const itemsBySectionId = new Map<string, any[]>();
  items.forEach((item) => {
    const current = itemsBySectionId.get(item.section_id) ?? [];
    current.push(item);
    itemsBySectionId.set(item.section_id, current);
  });

  const mappedSections = sections.map((section) => {
    const sectionItems = itemsBySectionId.get(section.id) ?? [];
    const isKeyAchievements = section.type === 'custom' && (
      section.title === 'Key Achievements' ||
      sectionItems.some(item => (item.data as any)?.type === 'key_achievements')
    );
    const effectiveType = isKeyAchievements ? 'key_achievements' : section.type;

    const mappedItems = sectionItems.map((item) => {
      const dataToParse = { ...(item.data as any), type: effectiveType };
      const parsedData = sectionItemDataSchema.safeParse(dataToParse);
      const itemData = parsedData.success ? parsedData.data : getDefaultSectionItem(effectiveType);

      return {
        id: item.id,
        sectionId: item.section_id,
        resumeId: section.resume_id,
        sortOrder: item.sort_order ?? item.position ?? 0,
        type: effectiveType,
        data: itemData as Extract<SectionItemData, { type: SectionType }>,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      } as SectionItem;
    });

    return {
      id: section.id,
      resumeId: section.resume_id,
      type: effectiveType,
      title: section.title,
      isVisible: section.is_visible,
      sortOrder: section.sort_order ?? section.position ?? 0,
      createdAt: section.created_at,
      updatedAt: section.updated_at,
      items: mappedItems as ResumeSection['items'],
    } as ResumeSection;
  });

  let settings = resumeRow.settings;
  if (typeof settings === 'string') {
    try { settings = JSON.parse(settings); } catch (e) { settings = null; }
  }

  return {
    id: resumeRow.id,
    userId: resumeRow.user_id,
    title: resumeRow.title,
    templateId: resumeRow.template_id,
    settings: (settings && typeof settings === 'object') ? settings : {
      fontSize: 'medium',
      fontFamily: 'Inter',
      primaryColor: '#000000',
      backgroundColor: '#ffffff',
    },
    sections: mappedSections,
    createdAt: resumeRow.created_at,
    updatedAt: resumeRow.updated_at,
  };
};

const fetchResumeById = async (id: string): Promise<Resume | null> => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: resumeRow, error: resumeError } = await supabase
    .from('resumes').select('*')
    .eq('id', id).eq('user_id', user.id).maybeSingle();

  if (resumeError || !resumeRow) return null;

  let sectionsResult = await supabase
    .from('resume_sections').select('*')
    .eq('resume_id', id).order('sort_order', { ascending: true });

  if (sectionsResult.error) {
    sectionsResult = await supabase.from('resume_sections').select('*').eq('resume_id', id).order('position', { ascending: true });
  }

  if (sectionsResult.error) return null;

  const sectionRows = sectionsResult.data;
  const sectionIds = sectionRows.map((section: any) => section.id);
  if (sectionIds.length === 0) return mapResume(resumeRow, sectionRows, []);

  let itemsResult = await supabase.from('section_items').select('*').in('section_id', sectionIds).order('sort_order', { ascending: true });
  if (itemsResult.error) {
    itemsResult = await supabase.from('section_items').select('*').in('section_id', sectionIds).order('position', { ascending: true });
  }

  return mapResume(resumeRow, sectionRows, itemsResult.data ?? []);
};

export default async function ResumeExportPage({ params }: ExportPageProps) {
  const { id } = await params;
  const resume = await fetchResumeById(id);

  if (!resume) notFound();

  const props = { resume, isPreview: false, scale: 1.0 };

  let Template;
  const templateId = resume.templateId;
  if (templateId === 'professional') Template = ProfessionalTemplate;
  else if (templateId === 'classic') Template = ClassicTemplate;
  else if (templateId === 'minimal') Template = MinimalTemplate;
  else if (templateId === 'creative') Template = CreativeTemplate;
  else if (templateId === 'executive') Template = ExecutiveTemplate;
  else if (templateId === 'london') Template = LondonTemplate;
  else Template = ModernTemplate;

  return (
    <div className="bg-white min-h-screen">
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Roboto:wght@400;500;600;700;800;900&family=Playfair+Display:wght@400;500;600;700;800;900&family=Outfit:wght@400;500;600;700;800;900&family=Open+Sans:wght@400;500;600;700;800;900&display=swap');

        @page { 
          size: 794px 1123px;
          margin: 20px !important;
        }
        body { 
          margin: 0; 
          padding: 0; 
          -webkit-print-color-adjust: exact !important; 
          print-color-adjust: exact !important;
          background-color: white;
        }
        .printable-page {
          width: 752px;
          margin: 0 auto;
          background-color: white;
        }
        * { 
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important; 
        }

        /* ===== CRITICAL: Prevent ANY item from splitting across pages ===== */
        [data-resume-item] {
          break-inside: avoid !important;
          page-break-inside: avoid !important;
        }
        
        article {
          break-inside: avoid !important;
          page-break-inside: avoid !important;
        }
      `}} />
      <div className="printable-page">
        <Template {...props} />
      </div>
<<<<<<< Updated upstream
=======

      <script dangerouslySetInnerHTML={{
        __html: `
        async function paginate() {
          await document.fonts.ready;
          const FULL_PAGE = 1123;
          const PAGE_MARGIN_TOP = 64;
          const PAGE_MARGIN_BOTTOM = 64;

          const templateId = '${templateId}';
          const initialTopMargin = (templateId === 'creative' || templateId === 'london') ? 0 : PAGE_MARGIN_TOP;

          document.querySelectorAll('.pdf-page-jump').forEach(s => s.remove());
          const container = document.getElementById('resume-container');
          if (!container) return;
          
          container.style.paddingTop = initialTopMargin + 'px';
          container.style.paddingBottom = PAGE_MARGIN_BOTTOM + 'px';

          for (let pass = 0; pass < 35; pass++) {
            let pushed = false;
            const items = Array.from(document.querySelectorAll('[data-resume-item], [data-resume-section]'));
            const containerTop = container.getBoundingClientRect().top;
            
            for (let i = 0; i < items.length; i++) {
              const el = items[i];
              const rect = el.getBoundingClientRect();
              const relativeTop = rect.top - containerTop;
              const relativeBottom = rect.bottom - containerTop;

              const currentPageIndex = Math.floor(relativeTop / FULL_PAGE);
              const pageBottomLimit = (currentPageIndex + 1) * FULL_PAGE - PAGE_MARGIN_BOTTOM;
              // Subsequent pages ALWAYS have PAGE_MARGIN_TOP (64px) for consistency
              const pageTopLimit = currentPageIndex * FULL_PAGE + PAGE_MARGIN_TOP;
              
              let shouldPush = false;

              // 0. Margin Violation Check: If we are on page 2+ and the item is inside the top margin
              if (currentPageIndex > 0 && relativeTop < pageTopLimit) {
                  shouldPush = true;
              }

              if (!shouldPush && relativeBottom > pageBottomLimit) {
                if (relativeTop > pageTopLimit + 20) {
                    shouldPush = true;
                }
              }

              // Orphan Heading Protection
              if (!shouldPush && el.hasAttribute('data-resume-section') && i < items.length - 1) {
                  const nextEl = items[i+1];
                  const nextRect = nextEl.getBoundingClientRect();
                  const nextRelativeTop = nextRect.top - containerTop;
                  const nextRelativeBottom = nextRect.bottom - containerTop;
                  const nextItemPage = Math.floor(nextRelativeTop / FULL_PAGE);

                  if (nextItemPage > currentPageIndex || nextRelativeBottom > pageBottomLimit) {
                    if (relativeTop > pageTopLimit + 20) {
                        shouldPush = true;
                        
                        // Sync with ModernTemplate Grid Row structure
                        const row = el.closest('[data-resume-section-row]');
                        if (row) {
                            const rowTop = row.getBoundingClientRect().top - containerTop;
                            const jump = document.createElement('div');
                            jump.className = 'pdf-page-jump';
                            jump.style.background = 'transparent';
                            // Jumps ALWAYS push to the TOP MARGIN of the next page
                            jump.style.height = ( ((currentPageIndex + 1) * FULL_PAGE) - rowTop + PAGE_MARGIN_TOP ) + 'px';
                            row.parentNode.insertBefore(jump, row);
                            pushed = true;
                            break;
                        }
                    }
                  }
              }

              if (shouldPush && !pushed) {
                  const jump = document.createElement('div');
                  jump.className = 'pdf-page-jump';
                  jump.style.background = 'transparent';
                  const effectiveTargetTop = (currentPageIndex > 0 && relativeTop < pageTopLimit)
                    ? pageTopLimit
                    : (currentPageIndex + 1) * FULL_PAGE + PAGE_MARGIN_TOP;

                  jump.style.height = (effectiveTargetTop - relativeTop) + 'px';
                  el.parentNode.insertBefore(jump, el);
                  pushed = true;
                  break;
              }
            }
            if (!pushed) break;
          }
        }
        if (document.readyState === 'complete') {
          paginate();
        } else {
          window.addEventListener('load', paginate);
        }
      `}} />
>>>>>>> Stashed changes
    </div>
  );
}
