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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-200 selection:text-emerald-900">
      <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-sm font-bold text-white shadow-lg shadow-emerald-200 transition-transform group-hover:scale-105">
              RB
            </div>
            <div className="hidden sm:block">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                AI Powered
              </p>
              <p className="text-base font-bold text-slate-900">Resume Builder</p>
            </div>
          </Link>

          <nav className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/login"
              className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 transition-all hover:bg-slate-100 hover:text-slate-900"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white shadow-xl shadow-slate-200 transition-all hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98]"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32">
          <div className="absolute top-0 left-1/2 -z-10 h-[1000px] w-[1000px] -translate-x-1/2 [background:radial-gradient(circle_at_center,rgba(16,185,129,0.05)_0%,transparent_70%)]" />
          
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50/50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 shadow-sm animate-fade-in">
                <Sparkles className="h-3.5 w-3.5" />
                The next generation of resume building
              </div>
              <h1 className="mt-8 text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
                Build a resume that <br />
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">gets you hired.</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
                Create a professional, recruiter-ready resume in minutes. Use our smart templates designed 
                to pass ATS and impress hiring managers.
              </p>

              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-8 py-4 text-base font-bold text-white shadow-2xl shadow-emerald-200 transition-all hover:bg-emerald-700 hover:scale-105 active:scale-95"
                >
                  Create My Resume
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-8 py-4 text-base font-bold text-slate-700 shadow-xl shadow-slate-100 transition-all hover:bg-slate-50"
                >
                  View Templates
                </Link>
              </div>
            </div>

            {/* Mockup Preview */}
            <div className="mt-20 relative mx-auto max-w-5xl">
              <div className="rounded-3xl border border-slate-200 bg-white p-2 shadow-2xl">
                <div className="overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 lg:aspect-[16/9]">
                  <div className="flex h-full flex-col lg:flex-row">
                    <div className="w-full lg:w-72 border-r border-slate-200 bg-white p-6">
                      <div className="flex items-center gap-3 mb-8">
                        <div className="h-3 w-3 rounded-full bg-red-400" />
                        <div className="h-3 w-3 rounded-full bg-amber-400" />
                        <div className="h-3 w-3 rounded-full bg-emerald-400" />
                      </div>
                      <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div key={i} className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-slate-50">
                            <div className="h-8 w-8 rounded-lg bg-slate-100" />
                            <div className="h-3 w-2/3 rounded-full bg-slate-200" />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex-1 p-8 bg-white overflow-hidden">
                       <div className="mx-auto max-w-2xl space-y-8 animate-pulse text-slate-200">
                          <div className="h-10 w-1/3 rounded-xl bg-slate-100" />
                          <div className="space-y-3">
                            <div className="h-4 w-full rounded-full bg-slate-100" />
                            <div className="h-4 w-5/6 rounded-full bg-slate-100" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="h-32 rounded-2xl bg-emerald-50/50" />
                            <div className="h-32 rounded-2xl bg-slate-50" />
                          </div>
                          <div className="space-y-3">
                            <div className="h-4 w-full rounded-full bg-slate-50" />
                            <div className="h-4 w-2/3 rounded-full bg-slate-50" />
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="bg-white py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 md:grid-cols-3">
              {highlights.map((feature) => (
                <article
                  key={feature.title}
                  className="group rounded-3xl border border-slate-100 bg-slate-50 p-8 transition-all hover:bg-white hover:shadow-2xl hover:shadow-slate-200"
                >
                  <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-200 transition-transform group-hover:scale-110">
                    {feature.icon}
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">{feature.title}</h2>
                  <p className="mt-4 text-base leading-7 text-slate-600">{feature.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Points */}
        <section className="py-24 sm:py-32 bg-slate-900 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 h-[600px] w-[600px] rounded-full bg-emerald-500/10 blur-[120px]" />
          
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-16 text-center">
              <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">Professional tools, private by default.</h2>
              <p className="mt-4 text-slate-400">Everything you need to land your next role, built for security and speed.</p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-3">
              {trustPoints.map((point) => (
                <article key={point.title} className="rounded-3xl border border-white/5 bg-white/5 p-8 backdrop-blur-sm transition-all hover:bg-white/10">
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                    {point.icon}
                  </div>
                  <h3 className="text-lg font-bold">{point.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-400">{point.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-emerald-600 to-teal-800 p-12 text-center lg:p-20 shadow-2xl shadow-emerald-200">
            <div className="relative z-10">
              <h2 className="text-4xl font-bold text-white sm:text-5xl">Start your career journey today.</h2>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-emerald-50 opacity-90">
                Join thousands of professionals who have built their resumes with RB. No credit card required.
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Link href="/signup" className="rounded-2xl bg-white px-8 py-4 text-base font-bold text-emerald-700 shadow-xl transition-all hover:scale-105 active:scale-95">
                  Create Account
                </Link>
                <Link href="/login" className="rounded-2xl border border-white/20 bg-white/10 px-8 py-4 text-base font-bold text-white backdrop-blur-md transition-all hover:bg-white/20">
                  Sign In
                </Link>
              </div>
            </div>
            <div className="absolute top-0 left-0 -z-0 h-full w-full opacity-20 [background:radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.4)_0%,transparent_50%),(radial-gradient(circle_at_70%_70%,rgba(255,255,255,0.4)_0%,transparent_50%))]" />
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-4">
            <div className="col-span-2">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-sm font-bold text-white">
                  RB
                </div>
                <p className="text-xl font-bold text-slate-900">Resume Builder</p>
              </div>
              <p className="mt-6 max-w-xs text-base leading-7 text-slate-500">
                The most professional and intuitive resume builder on the market. Built for modern careers.
              </p>
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-slate-900">Product</p>
              <ul className="mt-6 space-y-4 text-sm text-slate-500">
                <li><Link href="#editor" className="hover:text-emerald-600 transition-colors">Resume Editor</Link></li>
                <li><Link href="#templates" className="hover:text-emerald-600 transition-colors">Template Library</Link></li>
                <li><Link href="#export" className="hover:text-emerald-600 transition-colors">PDF Export</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-slate-900">Company</p>
              <ul className="mt-6 space-y-4 text-sm text-slate-500">
                <li><Link href="/dashboard" className="hover:text-emerald-600 transition-colors">Dashboard</Link></li>
                <li><Link href="/signup" className="hover:text-emerald-600 transition-colors">Register</Link></li>
                <li><Link href="/login" className="hover:text-emerald-600 transition-colors">Login</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-16 border-t border-slate-100 pt-8 text-sm text-slate-400">
            \u00A9 {new Date().getFullYear()} Resume Builder. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

