'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Files, 
  LayoutDashboard, 
  Settings, 
  UserRound, 
  Sparkles, 
  Layout
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SignOutButton } from '@/components/SignOutButton';

interface SidebarProps {
  userEmail?: string;
}

export function Sidebar({ userEmail }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'Browse Templates',
      href: '/templates',
      icon: Layout,
    },
    {
      label: 'My Resumes',
      href: '#',
      icon: Files,
    },
    {
      label: 'Profile',
      href: '#',
      icon: UserRound,
    },
    {
      label: 'Settings',
      href: '#',
      icon: Settings,
    },
  ];

  return (
    <aside className="w-[280px] hidden lg:flex flex-col border-r border-slate-100 bg-white p-6 sticky top-0 h-screen">
      <div className="flex items-center gap-3 px-2">
        <div className="h-9 w-9 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-100 text-sm">
          RB
        </div>
        <span className="font-bold text-slate-800 tracking-tight">ResumeBuilder</span>
      </div>

      <nav className="mt-10 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link 
              key={item.label}
              href={item.href} 
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all",
                isActive 
                  ? "bg-slate-50 text-emerald-700 font-bold" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <Icon size={18} />
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-4">
        <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold text-xs">
              {userEmail?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold text-slate-900 truncate uppercase tracking-widest leading-none mb-1">Account</p>
              <p className="text-xs text-slate-500 truncate">{userEmail}</p>
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
  );
}
