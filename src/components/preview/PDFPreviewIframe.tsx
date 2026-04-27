'use client';

import { useEffect, useState, useRef } from 'react';
import { useResumeStore } from '../../../lib/stores/resumeStore';
import { Loader2, RefreshCw, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

<<<<<<< Updated upstream
interface PDFPreviewIframeProps {
=======
// Import Templates directly for instant rendering
import ModernTemplate from '@/components/templates/templates/ModernTemplate';
import ClassicTemplate from '@/components/templates/templates/ClassicTemplate';
import MinimalTemplate from '@/components/templates/templates/MinimalTemplate';
import CreativeTemplate from '@/components/templates/templates/CreativeTemplate';
import ExecutiveTemplate from '@/components/templates/templates/ExecutiveTemplate';
import ProfessionalTemplate from '@/components/templates/templates/ProfessionalTemplate';
import LondonTemplate from '@/components/templates/templates/LondonTemplate';

interface ResumePreviewProps {
>>>>>>> Stashed changes
  resumeId: string;
}

export function PDFPreviewIframe({ resumeId }: PDFPreviewIframeProps) {
  const [version, setVersion] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const resume = useResumeStore((state) => state.resume);
  const lastUpdateRef = useRef<number>(Date.now());
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

<<<<<<< Updated upstream
  // Helper to refresh the PDF
  const refreshPdf = () => {
    setIsRefreshing(true);
    setVersion((v) => v + 1);
    lastUpdateRef.current = Date.now();
=======
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
  else if (templateId === 'london') Template = LondonTemplate;
  else Template = ModernTemplate;

  const runPagination = async () => {
    if (!containerRef.current) return;
    setIsUpdating(true);

    // Give the browser time to render and fonts to load
    await new Promise(r => setTimeout(r, 100));
    await document.fonts.ready;

    const container = containerRef.current;
    
    const initialTopMargin = (templateId === 'creative' || templateId === 'london') ? 0 : PAGE_MARGIN_TOP;
    
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
>>>>>>> Stashed changes
  };

  // Listen for resume changes and debounce refresh
  useEffect(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = setTimeout(() => {
        refreshPdf();
    }, 2500); // 2.5 second debounce to avoid heavy server load

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [resume]);

  const pdfUrl = `/api/resumes/${resumeId}/pdf?preview=true&v=${version}#toolbar=0&view=FitH`;

  return (
    <div className="relative flex flex-col items-center w-full h-full max-w-5xl mx-auto px-4">
      {/* Top Status Bar */}
      <div className="w-full flex justify-between items-center mb-6 bg-white/50 backdrop-blur-sm border border-zinc-200 px-6 py-2.5 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                <FileText className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 leading-none mb-0.5">Live PDF Engine</span>
                <span className="text-[11px] font-bold text-zinc-900 leading-none">A4 Standard Format</span>
            </div>
        </div>

        <button 
           onClick={refreshPdf}
           disabled={isRefreshing}
           className="group flex items-center gap-2 px-3 py-1.5 rounded-xl border border-zinc-200 bg-white text-[10px] font-black uppercase tracking-widest hover:bg-zinc-50 transition-all hover:shadow-sm disabled:opacity-50"
        >
            <RefreshCw className={cn("h-3 w-3 text-emerald-600 transition-transform duration-700", isRefreshing && "animate-spin")} />
            {isRefreshing ? 'Rendering...' : 'Sync Now'}
        </button>
      </div>

      <div className="relative w-full aspect-[1/1.414] bg-white rounded-xl shadow-2xl overflow-hidden border border-zinc-200">
        <iframe
          src={pdfUrl}
          className="w-full h-full border-none"
          onLoad={() => {
            setIsLoading(false);
            setIsRefreshing(false);
          }}
          title="Resume Preview"
        />

        {/* Global Loading Overlay */}
        {(isLoading || isRefreshing) && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-zinc-100/90 backdrop-blur-[2px] transition-all duration-300">
            <div className="relative flex items-center justify-center mb-6">
                <Loader2 className="h-12 w-12 text-emerald-500 animate-[spin_1.5s_linear_infinite]" />
                <div className="absolute inset-0 h-12 w-12 rounded-full border-4 border-emerald-500/10" />
            </div>
            <p className="text-[12px] font-black uppercase tracking-[0.25em] text-zinc-900 animate-pulse">
                {isLoading ? 'Booting PDF Engine...' : 'Syncing Live Changes...'}
            </p>
            <p className="text-[10px] font-bold text-zinc-400 mt-2">This ensures 100% layout accuracy</p>
          </div>
        )}
      </div>

      {/* Helper Footer */}
      <div className="mt-8 mb-12 flex flex-col items-center text-center max-w-sm">
         <p className="text-[11px] font-black text-zinc-400 uppercase tracking-widest leading-relaxed">
            Iframe Preview matches the final exported document pixel-for-pixel using Puppeteer Server-Side Rendering.
         </p>
      </div>
    </div>
  );
}
