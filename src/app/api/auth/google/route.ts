import { createClient } from "@/lib/supabase/server";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const supabase = await createClient();
    const origin = request.nextUrl.origin;

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: `${origin}/api/auth/callback`,
        },
    });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (data.url) {
        return NextResponse.redirect(data.url);
    }

    return NextResponse.json({ error: "Could not get OAuth URL" }, { status: 500 });
}
