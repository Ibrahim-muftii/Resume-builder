'use client';

import * as React from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';
import { Eye, EyeOff, Lock, Mail, UserRound } from 'lucide-react';

const signupSchema = z
  .object({
    firstName: z.string().trim().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().trim().min(2, 'Last name must be at least 2 characters'),
    email: z.string().trim().email('Enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Confirm your password'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

const getErrorMessage = (error: unknown, fallback: string): string =>
  error instanceof Error ? error.message : fallback;

export default function SignupPage() {
  const supabase = createClient();
  const [authError, setAuthError] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [isOAuthLoading, setIsOAuthLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: SignupFormValues): Promise<void> => {
    setAuthError(null);
    setSuccessMessage(null);

    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: {
          full_name: `${values.firstName} ${values.lastName}`.trim(),
        },
      },
    });

    if (error) {
      setAuthError(error.message);
      return;
    }

    setSuccessMessage('Check your email to confirm your account.');
  };

  const handleGoogleSignIn = async (): Promise<void> => {
    setAuthError(null);
    setIsOAuthLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        setAuthError(error.message);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error: unknown) {
      setAuthError(getErrorMessage(error, 'Failed to sign in with Google'));
    } finally {
      setIsOAuthLoading(false);
    }
  };

  const fieldClassName =
    'h-12 border-zinc-200 bg-white pl-11 pr-11 text-base text-zinc-900 placeholder:text-zinc-400 focus-visible:border-emerald-600 focus-visible:ring-emerald-600/20';

  return (
    <div className="w-full rounded-[28px] bg-white px-1 text-zinc-900">
      <div className="mx-auto mb-10 flex w-fit items-center rounded-2xl border border-zinc-200 bg-white p-1 shadow-sm">
        <span className="inline-flex h-11 items-center rounded-xl bg-emerald-700 px-7 text-base font-semibold text-white shadow-sm">
          Sign Up
        </span>
        <Link
          href="/login"
          className="inline-flex h-11 items-center rounded-xl px-7 text-base font-medium text-zinc-600 transition-colors hover:text-zinc-950"
        >
          Log In
        </Link>
      </div>

      <h1 className="text-center text-5xl font-semibold tracking-tight text-zinc-950">Create An Account</h1>

      {successMessage ? (
        <div className="mt-10 space-y-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center text-sm text-emerald-800">
          <p>{successMessage}</p>
          <Link
            href="/login"
            className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-emerald-700 px-4 text-base font-semibold text-white transition hover:bg-emerald-800"
          >
            Back to Log In
          </Link>
        </div>
      ) : (
        <>
          <form className="mt-10 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <UserRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <Input
                  id="firstName"
                  autoComplete="given-name"
                  className={fieldClassName}
                  placeholder="First Name"
                  {...register('firstName')}
                />
                {errors.firstName ? <p className="mt-2 text-sm text-rose-500">{errors.firstName.message}</p> : null}
              </div>
              <div className="relative">
                <UserRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <Input
                  id="lastName"
                  autoComplete="family-name"
                  className={fieldClassName}
                  placeholder="Last Name"
                  {...register('lastName')}
                />
                {errors.lastName ? <p className="mt-2 text-sm text-rose-500">{errors.lastName.message}</p> : null}
              </div>
            </div>

            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <Input
                id="email"
                type="email"
                autoComplete="email"
                className={fieldClassName}
                placeholder="Enter Your Email"
                {...register('email')}
              />
            </div>
            {errors.email ? <p className="text-sm text-rose-500">{errors.email.message}</p> : null}

            <div className="relative">
              <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                className={fieldClassName}
                placeholder="Password"
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-3 top-1/2 inline-flex -translate-y-1/2 items-center justify-center rounded-md p-1 text-zinc-500 transition hover:text-zinc-900"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password ? <p className="text-sm text-rose-500">{errors.password.message}</p> : null}

            <div className="relative">
              <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                className={fieldClassName}
                placeholder="Confirm Password"
                {...register('confirmPassword')}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((value) => !value)}
                className="absolute right-3 top-1/2 inline-flex -translate-y-1/2 items-center justify-center rounded-md p-1 text-zinc-500 transition hover:text-zinc-900"
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmPassword ? <p className="text-sm text-rose-500">{errors.confirmPassword.message}</p> : null}

            {authError ? <p className="text-sm text-rose-500">{authError}</p> : null}

            <button
              type="submit"
              className="mt-1 inline-flex h-12 w-full items-center justify-center rounded-xl bg-emerald-700 px-4 text-lg font-semibold text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-65"
              disabled={isSubmitting || isOAuthLoading}
            >
              {isSubmitting ? 'Creating Account...' : 'Create an Account'}
            </button>
          </form>

          <div className="my-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-zinc-200" />
            <span className="text-sm text-zinc-500">Or</span>
            <div className="h-px flex-1 bg-zinc-200" />
          </div>

          <div className="grid grid-cols-1 gap-3">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isSubmitting || isOAuthLoading}
              className="inline-flex h-11 items-center justify-center gap-3 rounded-xl border border-zinc-200 bg-white text-base font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-65"
            >
              {isOAuthLoading ? (
                'Connecting...'
              ) : (
                <>
                  <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="#4285F4" d="M21.35 11.1H12.18v2.94h5.29c-.23 1.4-.89 2.58-1.98 3.37v2.8h3.21c1.88-1.73 2.97-4.29 2.97-7.33 0-.69-.06-1.35-.32-1.78z" />
                    <path fill="#34A853" d="M12.18 22c2.7 0 4.96-.89 6.61-2.42l-3.21-2.8c-.88.59-2 .96-3.4.96-2.61 0-4.83-1.76-5.62-4.13H3.27v2.9C4.9 19.64 8.27 22 12.18 22z" />
                    <path fill="#FBBC05" d="M6.56 13.61c-.2-.59-.32-1.22-.32-1.87s.12-1.28.32-1.87V7h-3.29A9.93 9.93 0 0 0 2.3 11.74c0 1.59.38 3.09 1.05 4.42l3.21-2.55z" />
                    <path fill="#EA4335" d="M12.18 5.47c1.47 0 2.79.51 3.83 1.51l2.86-2.86C16.96 2.47 14.81 1.55 12.18 1.55 8.27 1.55 4.9 3.91 3.27 7.1l3.29 2.54c.79-2.38 3.01-4.17 5.62-4.17z" />
                  </svg>
                  Continue with Google
                </>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
