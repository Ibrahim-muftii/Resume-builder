'use client';

import { useEffect, useRef } from 'react';
import { useResumeStore } from '../stores/resumeStore';

/**
 * Hook to automatically save the resume state to the database when changes occur.
 * Uses a debounce mechanism to avoid excessive API calls.
 */
export function useAutoSave() {
  const resume = useResumeStore((state) => state.resume);
  const isDirty = useResumeStore((state) => state.isDirty);
  const setDirty = useResumeStore((state) => state.setDirty);
  const setSaving = useResumeStore((state) => state.setSaving);
  const setSaveError = useResumeStore((state) => state.setSaveError);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Only save if there are changes and we have a resume
    if (!isDirty || !resume) {
      return;
    }

    // Clear existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Set a new timer for debouncing (2 seconds)
    timerRef.current = setTimeout(async () => {
      setSaving(true);
      setSaveError(null);

      try {
        const response = await fetch(`/api/resumes/${resume.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(resume),
        });

        if (!response.ok) {
          const payload = await response.json();
          throw new Error(payload.error || 'Failed to auto-save resume');
        }

        // Reset dirty flag after successful save
        setDirty(false);
      } catch (error) {
        console.error('Auto-save error:', error);
        setSaveError(error instanceof Error ? error.message : 'Unknown error during save');
      } finally {
        setSaving(false);
      }
    }, 2000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [resume, isDirty, setDirty, setSaving, setSaveError]);
}
