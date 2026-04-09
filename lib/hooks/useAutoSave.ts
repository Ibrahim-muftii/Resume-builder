'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useResumeStore } from '../stores/resumeStore';
import type { Resume } from '../types/resume';

type UseAutoSaveResult = {
  isSaving: boolean;
  saveError: string | null;
  forceSave: () => Promise<boolean>;
};

const wait = (durationMs: number): Promise<void> =>
  new Promise((resolve) => {
    window.setTimeout(resolve, durationMs);
  });

const getErrorMessage = (payload: unknown, fallback: string): string => {
  if (typeof payload === 'object' && payload !== null && 'error' in payload) {
    const message = payload.error;
    if (typeof message === 'string' && message.length > 0) {
      return message;
    }
  }

  return fallback;
};

const saveResume = async (resume: Resume): Promise<void> => {
  const response = await fetch(`/api/resumes/${resume.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(resume),
  });

  const payload: unknown = await response.json();

  if (!response.ok) {
    throw new Error(getErrorMessage(payload, 'Failed to save resume'));
  }
};

export function useAutoSave(): UseAutoSaveResult {
  const resume = useResumeStore((state) => state.resume);
  const isDirty = useResumeStore((state) => state.isDirty);
  const isSaving = useResumeStore((state) => state.isSaving);
  const saveError = useResumeStore((state) => state.saveError);
  const setSaving = useResumeStore((state) => state.setSaving);
  const setDirty = useResumeStore((state) => state.setDirty);
  const setSaveError = useResumeStore((state) => state.setSaveError);
  const debounceTimerRef = useRef<number | null>(null);

  const persist = useCallback(
    async (resumeToSave: Resume): Promise<boolean> => {
      setSaving(true);

      try {
        for (let attempt = 0; attempt < 4; attempt += 1) {
          try {
            await saveResume(resumeToSave);
            setSaveError(null);
            setDirty(false);
            return true;
          } catch (error) {
            const message =
              error instanceof Error ? error.message : 'Failed to save resume';
            setSaveError(message);

            if (attempt === 3) {
              return false;
            }

            await wait(1000 * 2 ** attempt);
          }
        }

        return false;
      } finally {
        setSaving(false);
      }
    },
    [setDirty, setSaveError, setSaving]
  );

  const forceSave = useCallback(async (): Promise<boolean> => {
    if (!resume || isSaving) {
      return false;
    }

    if (debounceTimerRef.current !== null) {
      window.clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    return persist(resume);
  }, [isSaving, persist, resume]);

  useEffect(() => {
    if (!resume || !isDirty || isSaving) {
      return undefined;
    }

    debounceTimerRef.current = window.setTimeout(() => {
      void persist(resume);
    }, 1500);

    return () => {
      if (debounceTimerRef.current !== null) {
        window.clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
    };
  }, [isDirty, isSaving, persist, resume]);

  return {
    isSaving,
    saveError,
    forceSave,
  };
}