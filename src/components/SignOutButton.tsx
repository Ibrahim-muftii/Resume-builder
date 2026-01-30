"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function SignOutButton() {
    const router = useRouter();

    const handleSignOut = async () => {
        await fetch("/api/auth/sign-out", {
            method: "POST",
        });
        router.push("/login"); // or router.refresh() if middleware handles redirect
        router.refresh();
    };

    return (
        <button
            onClick={handleSignOut}
            className="flex items-center text-gray-700 hover:text-red-600 transition-colors"
        >
            <LogOut className="w-5 h-5 mr-2" />
            Sign Out
        </button>
    );
}
