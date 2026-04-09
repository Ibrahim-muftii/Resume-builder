'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Loader2, RotateCcw } from 'lucide-react';
import { Button } from './button';
import { useAutoSave } from '../../../lib/hooks/useAutoSave';
import { useResumeStore } from '../../../lib/stores/resumeStore';

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

const stateToLabel: Record<Exclude<SaveState, 'idle'>, string> = {
  saving: 'Saving...',
  saved: 'Saved',
  error: 'Save failed',
};

const stateToIcon: Record<Exclude<SaveState, 'idle'>, React.ReactNode> = {
  saving: <Loader2 className="h-3.5 w-3.5 animate-spin" />,
  saved: <CheckCircle2 className="h-3.5 w-3.5" />,
  error: <AlertCircle className="h-3.5 w-3.5" />,
};

export function SaveIndicator() {
  const isSaving = useResumeStore((state) => state.isSaving);
  const saveError = useResumeStore((state) => state.saveError);
  const { forceSave } = useAutoSave();
  const [displayState, setDisplayState] = React.useState<SaveState>('idle');
  const hideTimerRef = React.useRef<number | null>(null);
  const wasSavingRef = React.useRef(false);

  React.useEffect(() => {
    if (hideTimerRef.current !== null) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }

    if (isSaving) {
      wasSavingRef.current = true;
      setDisplayState('saving');
      return undefined;
    }

    if (saveError) {
      wasSavingRef.current = false;
      setDisplayState('error');
      return undefined;
    }

    if (wasSavingRef.current) {
      wasSavingRef.current = false;
      setDisplayState('saved');
      hideTimerRef.current = window.setTimeout(() => {
        setDisplayState('idle');
      }, 3000);
      return undefined;
    }

    setDisplayState('idle');
    return undefined;
  }, [isSaving, saveError]);

  React.useEffect(
    () => () => {
      if (hideTimerRef.current !== null) {
        window.clearTimeout(hideTimerRef.current);
      }
    },
    []
  );

  if (displayState === 'idle') {
    return null;
  }

  const showRetry = displayState === 'error';

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={displayState}
        initial={{ opacity: 0, y: -4, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -4, scale: 0.98 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300"
      >
        <span
          className={[
            'flex h-2.5 w-2.5 items-center justify-center rounded-full',
            displayState === 'saving' && 'bg-orange-500/80 shadow-[0_0_0_4px_rgba(249,115,22,0.15)]',
            displayState === 'saved' && 'bg-emerald-500',
            displayState === 'error' && 'bg-red-500',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {displayState === 'saving' ? (
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-orange-400/80" />
          ) : null}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="flex items-center gap-1">{stateToIcon[displayState]}</span>
          {stateToLabel[displayState]}
        </span>
        {showRetry ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="ml-1 h-7 px-2 text-xs text-zinc-600 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-zinc-50"
            onClick={() => {
              void forceSave();
            }}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Retry
          </Button>
        ) : null}
      </motion.div>
    </AnimatePresence>
  );
}