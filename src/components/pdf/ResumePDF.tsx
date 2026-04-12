'use client';

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import type { Resume, TemplateId } from '../../../lib/types/resume';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type DownloadButtonProps = {
  resume: Resume;
  templateId: TemplateId;
};

export function DownloadButton({ resume }: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      
      const response = await fetch(`/api/resumes/${resume.id}/pdf`);
      
      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      // Create a blob from the PDF stream
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link and click it to trigger download
      const link = document.createElement('a');
      const filename = `${resume.title.replace(/\s+/g, '_')}_Resume.pdf`;
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Resume downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={isDownloading}
      className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2 text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-emerald-700 hover:shadow-lg active:scale-95 disabled:opacity-70"
    >
      {isDownloading ? (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Exporting...
        </>
      ) : (
        <>
          <Download className="h-3.5 w-3.5" />
          Download PDF
        </>
      )}
    </Button>
  );
}
