import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import ResumeGrid from '@/components/dashboard/ResumeGrid';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { mapResumeRowToResume, type ResumeRow, type ResumeSectionRow, type SectionItemRow } from '../../../../lib/utils/resumeMapper';

export const metadata: Metadata = {
  title: 'Dashboard | Resume Builder',
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // 1. Fetch Resumes
  const { data: resumes } = await supabase
    .from('resumes')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  if (!resumes || resumes.length === 0) {
    return (
      <DashboardLayout userEmail={user.email}>
        <ResumeGrid initialResumes={[]} />
      </DashboardLayout>
    );
  }

  const resumeIds = resumes.map(r => r.id);

  // 2. Fetch all sections for these resumes
  const { data: allSections } = await supabase
    .from('resume_sections')
    .select('*')
    .in('resume_id', resumeIds)
    .order('position', { ascending: true });

  const sectionIds = (allSections ?? []).map(s => s.id);

  // 3. Fetch all items for these sections
  let allItems: SectionItemRow[] = [];
  if (sectionIds.length > 0) {
    const { data } = await supabase
      .from('section_items')
      .select('*')
      .in('section_id', sectionIds)
      .order('position', { ascending: true });
    allItems = (data ?? []) as SectionItemRow[];
  }

  // 4. Map them
  const initialResumes = (resumes as ResumeRow[]).map(resumeRow => {
    const resumeSections = (allSections ?? []).filter(s => s.resume_id === resumeRow.id) as ResumeSectionRow[];
    const resumeSectionIds = resumeSections.map(s => s.id);
    const resumeItems = allItems.filter(item => resumeSectionIds.includes(item.section_id));
    
    return mapResumeRowToResume(resumeRow, resumeSections, resumeItems);
  });

  return (
    <DashboardLayout userEmail={user.email}>
      <ResumeGrid initialResumes={initialResumes} />
    </DashboardLayout>
  );
}

function DashboardLayout({ children, userEmail }: { children: React.ReactNode, userEmail?: string }) {
  return (
    <div className="min-h-screen bg-[#FDFEFE] text-slate-900 selection:bg-emerald-100">
      <div className="flex min-h-screen">
        <Sidebar userEmail={userEmail} />
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
               {children}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
