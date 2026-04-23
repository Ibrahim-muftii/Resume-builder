'use client';

import { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { useResumeStore } from '../../../lib/stores/resumeStore';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// Import Templates directly for instant rendering
import ModernTemplate from '@/components/templates/templates/ModernTemplate';
import ClassicTemplate from '@/components/templates/templates/ClassicTemplate';
import MinimalTemplate from '@/components/templates/templates/MinimalTemplate';
import CreativeTemplate from '@/components/templates/templates/CreativeTemplate';
import ExecutiveTemplate from '@/components/templates/templates/ExecutiveTemplate';
import ProfessionalTemplate from '@/components/templates/templates/ProfessionalTemplate';

interface ResumePreviewProps {
  resumeId: string;
}

export function PDFPreviewIframe({ resumeId }: ResumePreviewProps) {
  const resume = useResumeStore((state) => state.resume);
  const [isUpdating, setIsUpdating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState<number>(1);

  // Constants for pixel-perfect A4
  const A4_WIDTH = 794;
  const A4_HEIGHT = 1123;
  
  // Professional 0.75in margins for a premium physical document feel
  const PAGE_MARGIN_TOP = 64; 
  const PAGE_MARGIN_BOTTOM = 64;

  // Template Selector
  let Template;
  const templateId = resume?.templateId || 'modern';
  if (templateId === 'professional') Template = ProfessionalTemplate;
  else if (templateId === 'classic') Template = ClassicTemplate;
  else if (templateId === 'minimal') Template = MinimalTemplate;
  else if (templateId === 'creative') Template = CreativeTemplate;
  else if (templateId === 'executive') Template = ExecutiveTemplate;
  else Template = ModernTemplate;

  const runPagination = async () => {
    if (!containerRef.current) return;
    setIsUpdating(true);

    // Give the browser time to render and fonts to load
    await new Promise(r => setTimeout(r, 100));
    await document.fonts.ready;

    const container = containerRef.current;
    
    const initialTopMargin = templateId === 'creative' ? 0 : PAGE_MARGIN_TOP;
    
    // Reset layout
    container.querySelectorAll('.pdf-page-jump').forEach(s => s.remove());
    container.style.paddingTop = `${initialTopMargin}px`;
    container.style.paddingBottom = `${PAGE_MARGIN_BOTTOM}px`;

    // Multi-pass surgical pagination
    for (let pass = 0; pass < 40; pass++) {
      let pushed = false;
      const items = Array.from(container.querySelectorAll('[data-resume-item], [data-resume-section]')) as HTMLElement[];
      const containerRect = container.getBoundingClientRect();
      const currentScale = containerRect.width / container.offsetWidth || 1;

      for (let i = 0; i < items.length; i++) {
        const el = items[i];
        const rect = el.getBoundingClientRect();
        
        // Normalize coordinates to A4 CSS pixels
        const relativeTop = (rect.top - containerRect.top) / currentScale;
        const relativeBottom = (rect.bottom - containerRect.top) / currentScale;

        const currentPage = Math.floor(relativeTop / A4_HEIGHT);
        const pageBottomLimit = (currentPage + 1) * A4_HEIGHT - PAGE_MARGIN_BOTTOM;
        // Subsequent pages ALWAYS have PAGE_MARGIN_TOP (64px) for consistency
        const pageTopLimit = currentPage * A4_HEIGHT + PAGE_MARGIN_TOP;
        
        let shouldPush = false;
        
        // 0. Margin Violation Check: If we are on page 2+ and the item is inside the top margin
        if (currentPage > 0 && relativeTop < pageTopLimit) {
            shouldPush = true;
        }

        // 1. Hard Boundary Check: Does the item's bottom exceed the page?
        if (!shouldPush && relativeBottom > pageBottomLimit) {
            // Only push if it can fit on the next page better
            if (relativeTop > pageTopLimit + 20) {
                const style = window.getComputedStyle(el);
                if (style.breakInside === 'avoid' || style.breakInside === 'avoid-page') {
                    shouldPush = true;
                }
            }
        }

        // 2. Surgical Orphan Heading Protection
        if (!shouldPush && el.hasAttribute('data-resume-section') && i < items.length - 1) {
            const nextEl = items[i+1];
            const nextRect = nextEl.getBoundingClientRect();
            const nextRelativeTop = (nextRect.top - containerRect.top) / currentScale;
            const nextRelativeBottom = (nextRect.bottom - containerRect.top) / currentScale;

            const nextItemPage = Math.floor(nextRelativeTop / A4_HEIGHT);
            
            // If the next item is on the next page or is clearly going to be pushed
            if (nextItemPage > currentPage || nextRelativeBottom > pageBottomLimit) {
                // If the heading row itself is not already at the very top of the page
                const row = el.closest('[data-resume-section-row]') as HTMLElement;
                if (row) {
                    const rowRect = row.getBoundingClientRect();
                    const rowRelativeTop = (rowRect.top - containerRect.top) / currentScale;
                    
                    if (rowRelativeTop > pageTopLimit + 20) {
                        const jump = document.createElement('div');
                        jump.className = 'pdf-page-jump';
                        jump.style.width = '100%';
                        jump.style.background = 'transparent';
                        // Jumps ALWAYS push to the TOP MARGIN of the next page
                        jump.style.height = `${((currentPage + 1) * A4_HEIGHT) - rowRelativeTop + PAGE_MARGIN_TOP}px`;
                        
                        row.parentNode?.insertBefore(jump, row);
                        pushed = true;
                        break;
                    }
                }
            }
        }

        if (shouldPush && !pushed) {
          const jump = document.createElement('div');
          jump.className = 'pdf-page-jump';
          jump.style.width = '100%';
          jump.style.background = 'transparent';
          
          // Calculate the exact jump needed to reach the next page's top margin
          const targetTop = (currentPage + 1) * A4_HEIGHT + PAGE_MARGIN_TOP;
          // If we are pushing because of a margin violation, the target is on the SAME page's limit
          const effectiveTargetTop = (currentPage > 0 && relativeTop < pageTopLimit) 
            ? pageTopLimit 
            : (currentPage + 1) * A4_HEIGHT + PAGE_MARGIN_TOP;

          jump.style.height = `${effectiveTargetTop - relativeTop}px`;
          
          el.parentNode?.insertBefore(jump, el);
          pushed = true;
          break;
        }
      }
      if (!pushed) break;
    }

    const totalHeight = container.scrollHeight;
    setPages(Math.ceil(totalHeight / A4_HEIGHT));
    setIsUpdating(false);
  };

  useLayoutEffect(() => {
    runPagination();
  }, [resume, templateId]);

  if (!resume) return null;

  return (
    <div className="w-full h-full flex flex-col items-center bg-zinc-100/30 overflow-y-auto py-16 custom-scrollbar scroll-smooth">
      <div 
        className="relative bg-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] mb-32 origin-top rounded-sm ring-1 ring-zinc-200"
        style={{ width: `${A4_WIDTH}px`, minHeight: `${A4_HEIGHT}px` }}
      >
        <div ref={containerRef} className="w-full h-full">
            <Template resume={resume} isPreview={true} scale={1.0} />
        </div>

        {/* Page Break Markers */}
        <div className="absolute inset-0 pointer-events-none z-10">
            {Array.from({ length: pages }).map((_, i) => (
                <div 
                    key={i} 
                    className="absolute w-full border-t border-dashed border-emerald-400/20"
                    style={{ top: `${(i + 1) * A4_HEIGHT}px`, height: '1px' }}
                />
            ))}
        </div>

        {isUpdating && (
          <div className="absolute top-6 right-6 z-50">
             <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl border border-zinc-100 flex items-center gap-2">
                <Loader2 className="h-3 w-3 text-emerald-500 animate-spin" />
                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-900 opacity-60">Recalculating</span>
             </div>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .pdf-page-jump {
          display: block;
          page-break-before: always;
        }
      `}} />
    </div>
  );
}
