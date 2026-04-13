'use client';

import { useEffect, useState, useRef } from 'react';
import { useResumeStore } from '../../../lib/stores/resumeStore';
import { Loader2, RefreshCw, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PDFPreviewIframeProps {
  resumeId: string;
}

export function PDFPreviewIframe({ resumeId }: PDFPreviewIframeProps) {
  const [version, setVersion] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const resume = useResumeStore((state) => state.resume);
  const lastUpdateRef = useRef<number>(Date.now());
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Helper to refresh the PDF
  const refreshPdf = () => {
    setIsRefreshing(true);
    setVersion((v) => v + 1);
    lastUpdateRef.current = Date.now();
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
