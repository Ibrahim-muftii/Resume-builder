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
        <Button type="button" variant="outline" className="w-full justify-center border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50" onClick={handleSignOut}>
            <LogOut className="h-4 w-4" />
            Sign out
        </Button>
    );
}
