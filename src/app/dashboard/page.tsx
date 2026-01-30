import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import { SignOutButton } from "@/components/SignOutButton";

export default async function DashboardPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select(`
            full_name, 
            first_name,
            last_name
        `)
        .eq("id", user.id)
        .single();

    console.log(profile)

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <span className="text-xl font-bold text-indigo-600">Dashboard</span>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <span className="text-gray-700 mr-4">
                                Welcome, {profile?.full_name || user.email}
                            </span>
                            <SignOutButton />
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-4">
                        <h1 className="text-2xl font-semibold text-gray-900">Protected Content</h1>
                        <p className="mt-2 text-gray-600">
                            You are logged in as <span className="font-mono text-sm bg-gray-200 p-1 rounded">{user.email}</span>.
                        </p>
                        <p className="mt-2 text-gray-600">
                            Your user ID is <span className="font-mono text-sm bg-gray-200 p-1 rounded">{user.id}</span>.
                        </p>

                        <div className="mt-8">
                            <h2 className="text-lg font-medium text-gray-900">Profile Data (from Supabase)</h2>
                            <pre className="mt-2 bg-gray-800 text-green-400 p-4 rounded overflow-auto">
                                {JSON.stringify(profile, null, 2)}
                            </pre>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}


