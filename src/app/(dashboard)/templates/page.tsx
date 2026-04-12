import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { Sidebar } from '@/components/dashboard/Sidebar';
import TemplatesList from '@/components/templates/TemplatesList';

export const metadata: Metadata = {
  title: 'Browse Templates | Resume Builder',
};

export default async function TemplatesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600">Templates</span>
              </div>
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-none">
                Browse <span className="text-emerald-600 underline decoration-emerald-100 underline-offset-8">Templates</span>
              </h1>
              <p className="text-slate-400 mt-4 text-sm font-medium max-w-lg">
                Choose the perfect layout for your professional story. Each template is designed to help you stand out.
              </p>
            </header>

            <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
               <TemplatesList />
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
