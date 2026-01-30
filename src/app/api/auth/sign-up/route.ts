import { createClient } from "@/lib/supabase/server";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const signUpSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
});

export async function POST(request: NextRequest) {
    const requestUrl = new URL(request.url);
    const origin = requestUrl.origin;

    try {
        const json = await request.json();
        const result = signUpSchema.safeParse(json);

        if (!result.success) {
            return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
        }

        const { email, password, firstName, lastName } = result.data;

        const supabase = await createClient();

        const { error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${origin}/api/auth/callback`,
                data: {
                    first_name: firstName,
                    last_name: lastName,
                    full_name: `${firstName} ${lastName}`,
                },
            },
        });

        if (signUpError) {
            return NextResponse.json({ error: signUpError.message }, { status: 400 });
        }

        return NextResponse.json({ message: "Check your email to verify your account" });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
