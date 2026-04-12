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

  const paginate = useCallback(() => {
    if (!contentRef.current || isPaginating.current) return;
    isPaginating.current = true;
    const container = contentRef.current;

    const items = Array.from(
      container.querySelectorAll('[data-resume-item], [data-resume-section]')
    ) as HTMLElement[];

    // Reset everything
    items.forEach(el => (el.style.marginTop = '0px'));
    void container.offsetHeight;

    const BOTTOM_SAFETY = 5;

    // Process items top-to-bottom. Force reflow after each push
    // so the next item's position reflects the cascade.
    for (let pass = 0; pass < 10; pass++) {
      let anyPushed = false;
      const base = container.getBoundingClientRect().top;

      for (let i = 0; i < items.length; i++) {
        const el = items[i];
        const rect = el.getBoundingClientRect();
        const top = rect.top - base;
        const bottom = top + el.offsetHeight;

        const page = Math.floor(top / SLOT);
        const contentEnd = page * SLOT + PAGE_HEIGHT - BOTTOM_SAFETY;

        let needsPush = false;

        // Item extends past page content area
        if (bottom > contentEnd && top < contentEnd) {
          needsPush = true;
        }

        // Item is entirely past the content area (in the gap zone)
        if (top >= contentEnd && top < (page + 1) * SLOT) {
          needsPush = true;
        }

        // Orphan heading: heading on page N, next item on page N+1
        if (
          !needsPush &&
          el.hasAttribute('data-resume-section') &&
          i < items.length - 1
        ) {
          const nextRect = items[i + 1].getBoundingClientRect();
          const nextTop = nextRect.top - base;
          const nextPage = Math.floor(nextTop / SLOT);
          if (nextPage > page) needsPush = true;
        }

        if (needsPush) {
          const nextStart = (page + 1) * SLOT;
          const shift = nextStart - top;

          if (shift > 1) {
            el.style.marginTop = `${shift}px`;
            void container.offsetHeight; // Immediate reflow — cascade affects next items
            anyPushed = true;
          }
        }
      }

      if (!anyPushed) break;
    }

    const pages = Math.ceil(container.scrollHeight / SLOT) || 1;
    setPageCount(pages);

    // Fill the last page to full height
    const totalHeight = pages * PAGE_HEIGHT + Math.max(pages - 1, 0) * GAP;
    container.style.minHeight = `${totalHeight}px`;

    isPaginating.current = false;
  }, []);

  useEffect(() => {
    const t = setTimeout(paginate, 500);
    const obs = new MutationObserver(ms => {
      if (
        ms.some(
          m =>
            m.type === 'childList' ||
            (m.type === 'attributes' && m.attributeName !== 'style')
        )
      )
        paginate();
    });
    if (contentRef.current)
      obs.observe(contentRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
      });
    window.addEventListener('resize', paginate);
    return () => {
      clearTimeout(t);
      obs.disconnect();
      window.removeEventListener('resize', paginate);
    };
  }, [paginate, children]);

  const gaps = Math.max(pageCount - 1, 0);

  // Build the CSS mask: show content on pages, hide in gap zones
  const maskGradient = `repeating-linear-gradient(to bottom, black 0px, black ${PAGE_HEIGHT}px, transparent ${PAGE_HEIGHT}px, transparent ${SLOT}px)`;

  return (
    <div className="relative mx-auto" style={{ width: '794px' }}>
      {/* Gap overlays — BEHIND the content (z-index 10) */}
      {Array.from({ length: gaps }).map((_, i) => (
        <div
          key={i}
          className="absolute left-0 right-0"
          style={{
            top: `${PAGE_HEIGHT + i * SLOT}px`,
            height: `${GAP}px`,
            zIndex: 10,
            backgroundColor: 'hsl(220 14% 90%)',
            boxShadow:
              'inset 0 6px 8px -4px rgba(0,0,0,0.1), inset 0 -6px 8px -4px rgba(0,0,0,0.1)',
          }}
        >
          <div className="flex items-center justify-center h-full">
            <span className="text-[9px] font-semibold text-slate-400 tracking-widest uppercase">
              {i + 1} / {pageCount}
            </span>
          </div>
        </div>
      ))}

      {/* Resume content — ON TOP (z-index 20), masked to hide gap zones */}
      <div
        ref={contentRef}
        className="relative bg-white overflow-visible"
        style={{
          width: '794px',
          minHeight: `${PAGE_HEIGHT}px`,
          zIndex: 20,
          // CSS mask: content is visible on page zones, transparent in gap zones.
          // This lets the gap overlays (behind) show through in the gap zones.
          maskImage: maskGradient,
          WebkitMaskImage: maskGradient,
        }}
      >
        {children}
      </div>
    </div>
  );
}
