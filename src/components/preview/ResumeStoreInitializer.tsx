'use client';

import { useEffect, useRef } from 'react';
import { useResumeStore } from '../../../lib/stores/resumeStore';
import type { Resume } from '../../../lib/types/resume';

interface ResumeStoreInitializerProps {
  resume: Resume;
}

/**
 * Hydrates the Zustand resume store with fresh data from the server.
 * This ensures client-side state is available for components (like the sidebar)
 * as soon as the page is ready.
 */
export function ResumeStoreInitializer({ resume }: ResumeStoreInitializerProps) {
  const isInitialized = useRef(false);
  const setResume = useResumeStore((state) => state.setResume);

  useEffect(() => {
    // Only set on mount or if the resume object actually changes
    setResume(resume);
    isInitialized.current = true;
  }, [resume, setResume]);

  return null;
}
