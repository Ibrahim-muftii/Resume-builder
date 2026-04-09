'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { z } from 'zod';
import { useResumeStore } from '../stores/resumeStore';
import type { Resume } from '../types/resume';
import { resumeSchema } from '../validations/resumeSchema';

type UseResumeResult = {
  resume: Resume | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

const responseSchema = z.object({
  resume: resumeSchema,
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

export function useResume(resumeId: string | null): UseResumeResult {
  const resume = useResumeStore((state) => state.resume);
  const setResume = useResumeStore((state) => state.setResume);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchResume = useCallback(async () => {
    if (!resumeId) {
      setError('Resume id is required');
      setIsLoading(false);
      return;
    }

    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/resumes/${resumeId}`, {
        method: 'GET',
        cache: 'no-store',
        signal: controller.signal,
      });

      const payload: unknown = await response.json();

      if (!response.ok) {
        throw new Error(getErrorMessage(payload, 'Failed to load resume'));
      }

      const parsed = responseSchema.safeParse(payload);

      if (!parsed.success) {
        throw new Error('Invalid resume payload received from server');
      }

      setResume(parsed.data.resume);
    } catch (fetchError) {
      if (controller.signal.aborted) {
        return;
      }

      setError(
        fetchError instanceof Error ? fetchError.message : 'Failed to load resume'
      );
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false);
      }
    }
  }, [resumeId, setResume]);

  useEffect(() => {
    void fetchResume();

    return () => {
      abortControllerRef.current?.abort();
    };
  }, [fetchResume]);

  return {
    resume,
    isLoading,
    error,
    refetch: fetchResume,
  };
}