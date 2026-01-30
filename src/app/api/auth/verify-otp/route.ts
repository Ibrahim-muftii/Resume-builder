import { createClient } from "@/lib/supabase/server";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const verifyOtpSchema = z.object({
    email: z.string().email(),
    token: z.string().min(6),
    type: z.enum(["signup", "recovery", "magiclink", "email_change"]),
});

export async function POST(request: NextRequest) {
    try {
        const json = await request.json();
        const result = verifyOtpSchema.safeParse(json);

        if (!result.success) {
            return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
        }

        const { email, token, type } = result.data;
        const supabase = await createClient();

        const { error } = await supabase.auth.verifyOtp({
            email,
            token,
            type,
        });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ message: "Verified successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
