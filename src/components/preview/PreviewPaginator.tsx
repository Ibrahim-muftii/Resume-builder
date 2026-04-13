'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * A4 page height in px, gap between pages for visual separation.
 */
const PAGE_HEIGHT = 1123;
const GAP = 32;
const SLOT = PAGE_HEIGHT + GAP; // Total height per page "slot"

interface PreviewPaginatorProps {
  children: React.ReactNode;
}

export function PreviewPaginator({ children }: PreviewPaginatorProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const isPaginating = useRef(false);
  const [pageCount, setPageCount] = useState(1);

  const paginate = useCallback(async () => {
    if (!contentRef.current || isPaginating.current) return;

    if (typeof document !== 'undefined') {
      await document.fonts.ready;
    }

    isPaginating.current = true;
    const container = contentRef.current;

    /**
     * Helper to get stable bounds relative to container top.
     */
    const getBounds = (el: HTMLElement) => {
      const rect = el.getBoundingClientRect();
      const base = container.getBoundingClientRect().top;
      const top = rect.top - base;
      return { top, bottom: top + el.offsetHeight, height: el.offsetHeight };
    };

    // Process:
    // 1. Reset all margins.
    // 2. Iterate through items. If an item crosses a page boundary OR falls in a gap, 
    //    push it to the start of the next page.
    // 3. Keep iterating until no more shifts are needed (max passes).

    const items = Array.from(
      container.querySelectorAll('[data-resume-item], [data-resume-section]')
    ) as HTMLElement[];

    const PAGE_MARGIN_TOP = 72; // Professional 0.75in margin
    const PAGE_MARGIN_BOTTOM = 72;

    container.style.paddingTop = `${PAGE_MARGIN_TOP}px`;
    container.style.paddingBottom = `${PAGE_MARGIN_BOTTOM}px`;

    for (let pass = 0; pass < 30; pass++) {
      let anyPushed = false;

      for (let i = 0; i < items.length; i++) {
        const el = items[i];
        const originalMargin = el.style.marginTop;
        el.style.marginTop = '0px';
        void container.offsetHeight;

        const bounds = getBounds(el);
        const top = bounds.top;
        const bottom = bounds.bottom;

        const currentPage = Math.floor(top / SLOT);
        const pageBottomLimit = (currentPage + 1) * SLOT - GAP - PAGE_MARGIN_BOTTOM;
        const pageTopLimit = currentPage * SLOT + PAGE_MARGIN_TOP;

        let needsPush = false;

        // 1. Split Prevention: Does this item cross the bottom margin?
        if (bottom > pageBottomLimit) {
          if (top > pageTopLimit + 20) {
            needsPush = true;
          }
        }

        // 2. Orphan Prevention
        if (!needsPush && i < items.length - 1) {
          const isHeading = el.hasAttribute('data-resume-section');
          if (isHeading) {
            const nextEl = items[i+1];
            const nextBounds = getBounds(nextEl);
            const nextTop = nextBounds.top;
            
            const nextPage = Math.floor(nextTop / SLOT);
            if (nextPage > currentPage) {
               needsPush = true;
            } else if (nextBounds.bottom > pageBottomLimit) {
               needsPush = true;
            }
          }
        }

        if (needsPush) {
          const nextPageStart = (currentPage + 1) * SLOT;
          const shift = nextPageStart - top + PAGE_MARGIN_TOP;

          if (shift > 0.1) {
            el.style.marginTop = `${shift}px`;
            void container.offsetHeight;
            anyPushed = true;
          } else {
            el.style.marginTop = '0px';
          }
        } else {
          if (originalMargin !== '0px') {
            anyPushed = true;
          }
        }
      }

      if (!anyPushed) break;
    }

    const pages = Math.ceil(container.scrollHeight / SLOT) || 1;
    setPageCount(pages);

    const totalHeight = pages * PAGE_HEIGHT + Math.max(pages - 1, 0) * GAP;
    container.style.minHeight = `${totalHeight}px`;

    isPaginating.current = false;
  }, []);

  useEffect(() => {
    const t = setTimeout(paginate, 1000); // Wait longer for resume content to settle

    const obs = new MutationObserver(() => {
      // Debounce slightly if needed, but for now just call paginate
      paginate();
    });

    if (contentRef.current) {
      obs.observe(contentRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'data-resume-item', 'data-resume-section']
      });
    }

    window.addEventListener('resize', paginate);
    return () => {
      clearTimeout(t);
      obs.disconnect();
      window.removeEventListener('resize', paginate);
    };
  }, [paginate]);

  const gaps = Math.max(pageCount - 1, 0);
  const maskGradient = `repeating-linear-gradient(to bottom, black 0px, black ${PAGE_HEIGHT}px, transparent ${PAGE_HEIGHT}px, transparent ${SLOT}px)`;

  return (
    <div className="relative mx-auto pb-40" style={{ width: '794px' }}>
      {/* Gap overlays (PAGE BREAK VISUALS) */}
      {Array.from({ length: gaps }).map((_, i) => (
        <div
          key={i}
          className="absolute left-0 right-0 pointer-events-none flex items-center justify-center"
          style={{
            top: `${PAGE_HEIGHT + i * SLOT}px`,
            height: `${GAP}px`,
            zIndex: 10,
            backgroundColor: '#f1f5f9',
            borderTop: '1px solid #e2e8f0',
            borderBottom: '1px solid #e2e8f0',
          }}
        >
          <div className="flex items-center gap-3 px-4 py-1 rounded-full bg-white border border-slate-200 shadow-sm">
            <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
              Page Break — {i + 1} / {pageCount}
            </span>
          </div>
        </div>
      ))}

      {/* Content wrapper with MASK */}
      <div
        ref={contentRef}
        className="relative bg-white shadow-2xl transition-[min-height] duration-500"
        style={{
          width: '794px',
          minHeight: `${PAGE_HEIGHT}px`,
          zIndex: 20,
          maskImage: maskGradient,
          WebkitMaskImage: maskGradient,
        }}
      >
        {children}
      </div>
    </div>
  );
}
