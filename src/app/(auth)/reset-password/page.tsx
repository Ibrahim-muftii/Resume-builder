'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

const getErrorMessage = (error: unknown, fallback: string): string =>
  error instanceof Error ? error.message : fallback;

export default function ResetPasswordPage() {
  const router = useRouter();
  const [success, setSuccess] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
    },
  });

  const onSubmit = async (values: ResetPasswordFormValues): Promise<void> => {
    setSubmitError(null);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: values.password }),
      });

      const payload: unknown = await res.json();

      if (!res.ok) {
        const message =
          typeof payload === 'object' && payload !== null && 'error' in payload &&
          typeof payload.error === 'string'
            ? payload.error
            : 'Failed to update password';
        throw new Error(message);
      }

      setSuccess(true);
      window.setTimeout(() => {
        router.push('/dashboard');
      }, 3000);
    } catch (error: unknown) {
      setSubmitError(getErrorMessage(error, 'Failed to update password'));
    }
  };

  if (success) {
    return (
      <Card className="border-zinc-200 bg-white/95 shadow-lg backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/95">
        <CardContent className="pt-6">
          <div className="space-y-6 text-center">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300">
              Your password has been updated successfully.
            </div>
            <Link
              href="/dashboard"
              className="inline-flex h-10 w-full items-center justify-center rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
            >
              Go to dashboard
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-zinc-200 bg-white/95 shadow-lg backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/95">
      <CardHeader className="space-y-2 text-center">
        <CardTitle>Set a new password</CardTitle>
        <CardDescription>Choose a secure password for your account.</CardDescription>
      </CardHeader>

      <CardContent>
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-2">
            <Label htmlFor="password">New password</Label>
            <Input id="password" type="password" autoComplete="new-password" {...register('password')} />
            {errors.password ? <p className="text-sm text-red-500">{errors.password.message}</p> : null}
          </div>

          {submitError ? <p className="text-sm text-red-500">{submitError}</p> : null}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Update password'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
