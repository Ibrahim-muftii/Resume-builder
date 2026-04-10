'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SignOutButton() {
    const router = useRouter();

    const handleSignOut = async () => {
        await fetch('/api/auth/sign-out', {
            method: 'POST',
        });
        router.push('/login');
        router.refresh();
    };

    return (
        <Button 
            type="button" 
            variant="outline" 
            className="w-full gap-3 justify-center rounded-2xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 font-bold transition-all hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-red-600" 
            onClick={handleSignOut}
        >
            <LogOut className="h-4 w-4" />
            Sign Out
        </Button>
    );
}
