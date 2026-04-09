import { cn } from '@/lib/utils';

export const buttonVariants = (variant: 'default' | 'outline' = 'default'): string =>
  cn(
    'inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    variant === 'default'
      ? 'bg-primary text-primary-foreground hover:opacity-90'
      : 'border border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800'
  );
