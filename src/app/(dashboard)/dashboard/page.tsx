import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import ResumeGrid from '@/components/dashboard/ResumeGrid';
import { Sidebar } from '@/components/dashboard/Sidebar';
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
        <Sidebar userEmail={user?.email} />

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
