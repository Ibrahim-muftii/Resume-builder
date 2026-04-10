import type { Metadata } from 'next';
import Link from 'next/link';
import { Files, LayoutDashboard, Settings, UserRound, Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import ResumeGrid from '@/components/dashboard/ResumeGrid';
import { SignOutButton } from '@/components/SignOutButton';
import type { Resume } from '../../../../lib/types/resume';

export const metadata: Metadata = {
  title: 'Dashboard | Resume Builder',
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
    <div className="min-h-screen bg-[#FDFEFE] text-slate-900 selection:bg-emerald-100">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-[280px] hidden lg:flex flex-col border-r border-slate-100 bg-white p-6 sticky top-0 h-screen">
          <div className="flex items-center gap-3 px-2">
            <div className="h-9 w-9 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-100 text-sm">
              RB
            </div>
            <span className="font-bold text-slate-800 tracking-tight">ResumeBuilder</span>
          </div>

          <nav className="mt-10 space-y-1">
            <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-50 text-emerald-700 font-bold transition-all">
              <LayoutDashboard size={18} />
              <span className="text-sm">Dashboard</span>
            </Link>
            <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all">
              <Files size={18} />
              <span className="text-sm">My Resumes</span>
            </Link>
            <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all">
              <UserRound size={18} />
              <span className="text-sm">Profile</span>
            </Link>
            <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all">
              <Settings size={18} />
              <span className="text-sm">Settings</span>
            </Link>
          </nav>

          <div className="mt-auto space-y-4">
            <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold text-xs">
                  {user?.email?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold text-slate-900 truncate uppercase tracking-widest leading-none mb-1">Account</p>
                  <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                </div>
              </div>
              <div className="mt-4">
                <SignOutButton />
              </div>
            </div>

            <div className="bg-emerald-600 rounded-2xl p-5 text-white shadow-xl shadow-emerald-100 relative overflow-hidden group">
               <Sparkles className="absolute -right-2 -top-2 opacity-20 group-hover:scale-110 transition-transform" size={48} />
               <p className="text-sm font-bold">Try Pro Plan</p>
               <p className="text-[10px] text-emerald-100 mt-1 leading-normal">Unlock more templates & AI tools.</p>
               <button className="w-full mt-4 py-2 bg-white/90 rounded-lg text-emerald-800 font-bold text-[10px] uppercase tracking-wider hover:bg-white transition-colors shadow-sm">Upgrade Now</button>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0">
          <div className="max-w-[1200px] mx-auto px-6 py-10 lg:px-12">
            <header className="mb-12">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-px w-8 bg-emerald-600" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600">Quick Dashboard</span>
              </div>
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-none">
                Your <span className="text-emerald-600 underline decoration-emerald-100 underline-offset-8">Resumes</span>
              </h1>
              <p className="text-slate-400 mt-4 text-sm font-medium max-w-lg">
                Create and manage your professional resumes with ease. Choose a template and start building your future.
              </p>
            </header>

            <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
               <ResumeGrid initialResumes={initialResumes} />
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
