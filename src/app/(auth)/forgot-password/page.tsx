'use client';

import * as React from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const forgotPasswordSchema = z.object({
  email: z.string().trim().email('Enter a valid email address'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const getErrorMessage = (error: unknown, fallback: string): string =>
  error instanceof Error ? error.message : fallback;

export default function ForgotPasswordPage() {
  const [success, setSuccess] = React.useState(false);
  const [submittedEmail, setSubmittedEmail] = React.useState('');
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: ForgotPasswordFormValues): Promise<void> => {
    setSubmitError(null);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: values.email }),
      });

      const payload: unknown = await res.json();

      if (!res.ok) {
        const message =
          typeof payload === 'object' && payload !== null && 'error' in payload &&
          typeof payload.error === 'string'
            ? payload.error
            : 'Failed to send reset email';
        throw new Error(message);
      }

      setSubmittedEmail(values.email);
      setSuccess(true);
    } catch (error: unknown) {
      setSubmitError(getErrorMessage(error, 'Failed to send reset email'));
    }
  };

  if (success) {
    return (
      <Card className="border-zinc-200 bg-white/95 shadow-lg backdrop-blur">
        <CardContent className="pt-6">
          <div className="space-y-6 text-center">
            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
              We sent a password reset link to <span className="font-medium">{submittedEmail}</span>.
            </div>
            <Link
              href="/login"
              className="inline-flex h-10 w-full items-center justify-center rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
            >
              Back to sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-zinc-200 bg-white/95 shadow-lg backdrop-blur">
      <CardHeader className="space-y-2 text-center">
        <CardTitle>Reset your password</CardTitle>
        <CardDescription>Enter the email address associated with your account.</CardDescription>
      </CardHeader>

      <CardContent>
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" autoComplete="email" {...register('email')} />
            {errors.email ? <p className="text-sm text-red-500">{errors.email.message}</p> : null}
          </div>

          {submitError ? <p className="text-sm text-red-500">{submitError}</p> : null}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send reset link'}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <Link href="/login" className="text-sm font-medium text-zinc-500 hover:text-zinc-950">
            Back to sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
