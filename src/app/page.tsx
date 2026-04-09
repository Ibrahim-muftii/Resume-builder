import Link from 'next/link';
import { ArrowRight, CircleCheckBig, FileText, LayoutGrid, ShieldCheck, Sparkles, Users } from 'lucide-react';

const highlights = [
  {
    icon: <LayoutGrid className="h-5 w-5" />,
    title: 'Structured Templates',
    description: 'Templates designed for readability, consistency, and faster shortlisting.',
  },
  {
    icon: <FileText className="h-5 w-5" />,
    title: 'Live Resume Editing',
    description: 'Work section by section with immediate visual feedback in the editor.',
  },
  {
    icon: <Sparkles className="h-5 w-5" />,
    title: 'Export and Share',
    description: 'Download polished PDFs and share public preview links when needed.',
  },
];

const trustPoints = [
  {
    icon: <ShieldCheck className="h-5 w-5" />,
    title: 'Secure Accounts',
    description: 'Supabase authentication with protected dashboards and private data access.',
  },
  {
    icon: <Users className="h-5 w-5" />,
    title: 'Made for Job Seekers',
    description: 'Focused workflows for students, professionals, and career-switchers.',
  },
  {
    icon: <CircleCheckBig className="h-5 w-5" />,
    title: 'ATS-first Content',
    description: 'Clean output and clear structure for both recruiters and ATS parsing.',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f8faf8] text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-700 text-sm font-bold text-white shadow-sm">
              RB
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
                Resume Builder
              </p>
              <p className="text-base font-semibold text-slate-900">Professional resume workspace</p>
            </div>
          </Link>

          <nav className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              Create account
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="mx-auto grid w-full max-w-7xl gap-10 px-4 pb-14 pt-16 sm:px-6 lg:grid-cols-[1.12fr_0.88fr] lg:items-center lg:gap-14 lg:pt-20">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600 shadow-sm">
              <CircleCheckBig className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
              Complete resume workflow
            </p>
            <h1 className="max-w-2xl text-4xl font-bold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Create recruiter-ready resumes with clarity and control.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              Build, edit, preview, and export from one place. Keep your resumes organized, tailor them for each role,
              and ship polished applications faster.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 shadow-sm"
              >
                Start building
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 shadow-sm"
              >
                Go to dashboard
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="rounded-2xl border border-slate-200 bg-slate-50">
              <div className="border-b border-slate-200 px-4 py-3">
                <p className="text-sm font-semibold text-slate-900">Resume Snapshot</p>
              </div>
              <div className="space-y-4 p-4">
                <div className="h-4 w-1/2 rounded-full bg-slate-200" />
                <div className="grid gap-2">
                  <div className="h-3 w-full rounded-full bg-slate-200/70" />
                  <div className="h-3 w-5/6 rounded-full bg-slate-200/70" />
                </div>
                <div className="grid gap-2">
                  <div className="h-3 w-1/3 rounded-full bg-emerald-100" />
                  <div className="h-3 w-full rounded-full bg-slate-200/70" />
                  <div className="h-3 w-4/5 rounded-full bg-slate-200/70" />
                </div>
                <div className="grid gap-2">
                  <div className="h-3 w-1/3 rounded-full bg-amber-100" />
                  <div className="h-3 w-full rounded-full bg-slate-200/70" />
                  <div className="h-3 w-2/3 rounded-full bg-slate-200/70" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto mb-14 grid w-full max-w-7xl gap-4 px-4 sm:px-6 md:grid-cols-3">
          {highlights.map((feature) => (
            <article
              key={feature.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                {feature.icon}
              </div>
              <h2 className="text-lg font-semibold text-slate-900">{feature.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{feature.description}</p>
            </article>
          ))}
        </section>

        <section className="mx-auto mb-14 w-full max-w-7xl px-4 sm:px-6">
          <div className="grid gap-4 md:grid-cols-3">
            {trustPoints.map((point) => (
              <article key={point.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                  {point.icon}
                </div>
                <h3 className="text-base font-semibold text-slate-900">{point.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{point.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto mb-16 w-full max-w-7xl px-4 sm:px-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <h2 className="text-3xl font-semibold text-slate-900">Ready to build your next resume?</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              Start with a clean template, refine each section, and export when you are done. The full workflow is
              already set up for you.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link href="/signup" className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 shadow-sm">
                Create free account
              </Link>
              <Link href="/login" className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 shadow-sm">
                Sign in
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white py-10">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 sm:px-6 md:grid-cols-3">
          <div>
            <p className="text-base font-semibold text-slate-900">Resume Builder</p>
            <p className="mt-2 text-sm text-slate-600">Create, manage, and export professional resumes from one dashboard.</p>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Product</p>
            <div className="mt-3 space-y-2 text-sm text-slate-600">
              <p>Resume Editor</p>
              <p>Template Library</p>
              <p>PDF Export</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Navigation</p>
            <div className="mt-3 space-y-2 text-sm">
              <Link href="/dashboard" className="block text-slate-600 hover:text-slate-900">Dashboard</Link>
              <Link href="/signup" className="block text-slate-600 hover:text-slate-900">Create account</Link>
              <Link href="/login" className="block text-slate-600 hover:text-slate-900">Sign in</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
