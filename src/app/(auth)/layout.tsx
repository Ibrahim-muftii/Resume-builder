import Link from 'next/link';
import { ArrowRight, Minus } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-white px-3 py-3 text-zinc-900 sm:px-5 sm:py-5">
            <main className="mx-auto grid min-h-[calc(100vh-24px)] w-full max-w-322 overflow-hidden rounded-[30px] border border-zinc-200 bg-white shadow-[0_28px_80px_rgba(15,23,42,0.12)] lg:grid-cols-[1.04fr_0.96fr]">
                <aside className="relative m-2 hidden overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#f8fafc_0%,#eef2ff_56%,#fff7ed_100%)] lg:block">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_36%,rgba(249,115,22,0.12),rgba(249,115,22,0.02)_28%,transparent_46%),radial-gradient(circle_at_18%_74%,rgba(59,130,246,0.1),transparent_34%)]" />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.3)_0%,rgba(255,255,255,0)_38%,rgba(15,23,42,0.04)_100%)]" />

                    <div className="relative flex h-full flex-col justify-between p-8">
                        <Link href="/" className="inline-flex w-fit items-center gap-2 rounded-full border border-zinc-200 bg-white/85 px-3 py-2 shadow-sm backdrop-blur">
                            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-700 text-white">
                                RB
                            </span>
                            <span className="text-xl font-semibold tracking-tight text-zinc-900">Resume Builder</span>
                        </Link>

                        <div className="max-w-md pb-6">
                            <Minus className="h-10 w-10 text-zinc-400" />
                            <h1 className="mt-5 text-5xl font-semibold leading-[1.04] text-zinc-950 xl:text-6xl">Build a resume that feels calm, clean, and professional.</h1>
                            <p className="mt-5 text-2xl leading-relaxed text-zinc-600">A focused workspace for building, refining, and exporting polished resumes.</p>
                        </div>
                    </div>
                </aside>

                <section className="flex items-center justify-center px-5 py-10 sm:px-10 lg:px-14">
                    <div className="w-full max-w-115 p-4 sm:p-6">
                        <div className="mb-5 flex items-center justify-between text-xs font-medium uppercase tracking-[0.18em] text-zinc-400 lg:hidden">
                            <span>Resume Builder</span>
                            <span className="inline-flex items-center gap-1 text-emerald-700">
                                Continue <ArrowRight className="h-3.5 w-3.5" />
                            </span>
                        </div>
                        {children}
                    </div>
                </section>
            </main>
        </div>
    );
}
