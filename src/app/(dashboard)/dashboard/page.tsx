import type { Metadata } from 'next';
import Link from 'next/link';
import { CirclePlus, Files, LayoutDashboard, Settings, UserRound, Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import ResumeGrid from '@/components/dashboard/ResumeGrid';
import { SignOutButton } from '@/components/SignOutButton';
import type { Resume } from '../../../../../lib/types/resume';

export const metadata: Metadata = {
  title: 'My Resumes',
};

const mapResume = (row: {
  id: string;
  user_id: string;
  title: string;
  template_id: Resume['templateId'];
  created_at: string;
  updated_at: string;
}): Resume => ({
  id: row.id,
  userId: row.user_id,
  title: row.title,
  templateId: row.template_id,
  sections: [],
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: resumes } = await supabase
    .from('resumes')
    .select('id, user_id, title, template_id, created_at, updated_at')
    .eq('user_id', user?.id ?? '')
    .order('updated_at', { ascending: false });

  const initialResumes = (resumes ?? []).map(mapResume);

  return (
    <div className="min-h-screen bg-[#f6f8fb] text-zinc-900">
      <div className="grid min-h-screen gap-6 p-4 lg:grid-cols-[300px_minmax(0,1fr)] lg:p-6">
        <aside className="rounded-[28px] border border-zinc-200 bg-white px-5 py-5 shadow-sm lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)]">
          <div className="flex h-full flex-col">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-700 text-sm font-bold text-white shadow-sm">
                RB
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">Resume Builder</p>
                <p className="text-lg font-semibold leading-none text-zinc-950">Workspace</p>
              </div>
            </Link>

            <nav className="mt-8 space-y-1.5">
              <Link href="#dashboard-top" className="flex items-center gap-3 rounded-xl bg-emerald-50 px-3 py-2.5 text-sm font-semibold text-emerald-800 ring-1 ring-emerald-100">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <Link href="#resume-grid" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-600 transition hover:bg-zinc-50 hover:text-zinc-950">
                <Files className="h-4 w-4" />
                My Resumes
              </Link>
              <Link href="#account-panel" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-600 transition hover:bg-zinc-50 hover:text-zinc-950">
                <UserRound className="h-4 w-4" />
                Profile
              </Link>
              <Link href="#account-panel" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-600 transition hover:bg-zinc-50 hover:text-zinc-950">
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </nav>

            <div className="mt-auto pt-6">
              <div id="account-panel" className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">Signed in as</p>
                <p className="mt-2 break-all text-sm font-medium text-zinc-900">{user?.email ?? 'Unknown user'}</p>
                <div className="mt-4">
                  <SignOutButton />
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-dashed border-emerald-200 bg-emerald-50 p-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-white p-2 text-emerald-700 shadow-sm ring-1 ring-emerald-100">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-950">Build faster</p>
                    <p className="mt-1 text-sm leading-6 text-zinc-600">Create a new resume or duplicate an existing one in seconds.</p>
                  </div>
                </div>
              </div>

              <Link href="#create-resume" className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800">
                <CirclePlus className="h-4 w-4" />
                Create Resume
              </Link>
            </div>
          </div>
        </aside>

        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <header id="dashboard-top" className="mb-6 rounded-[28px] border border-zinc-200 bg-white px-6 py-6 shadow-sm">
            <div className="flex flex-wrap items-center gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Dashboard</p>
                <h1 className="mt-1 text-3xl font-semibold tracking-tight text-zinc-950">My Resumes</h1>
              </div>
              <span className="ml-auto rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
                {initialResumes.length} total
              </span>
            </div>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
              Create, edit, duplicate, and export resumes from a clean workspace designed to stay out of the way.
            </p>
          </header>

          <ResumeGrid initialResumes={initialResumes} />
        </main>
      </div>
    </div>
  );
}
