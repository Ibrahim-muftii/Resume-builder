'use client';

import { toast, type ToastT } from 'sonner';

const toastClassName =
  'border border-zinc-200 bg-white text-zinc-950 shadow-lg';

const descriptionClassName = 'text-zinc-500';

type ToastOptions = Parameters<typeof toast.success>[1];

const baseOptions: ToastOptions = {
  className: toastClassName,
  descriptionClassName,
};

export function toastSuccess(message: string, description?: string): ToastT {
  return toast.success(message, {
    ...baseOptions,
    description,
  });
}

export function toastError(message: string, description?: string): ToastT {
  return toast.error(message, {
    ...baseOptions,
    description,
  });
}

export function toastLoading(message: string, description?: string): ToastT {
  return toast.loading(message, {
    ...baseOptions,
    description,
  });
}