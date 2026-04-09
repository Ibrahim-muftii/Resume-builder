import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getAuthGuardRedirect } from "@/lib/auth-guard";

type CookieToSet = {
    name: string;
    value: string;
    options?: Parameters<NextResponse["cookies"]["set"]>[2];
};

const getEnvValue = (...keys: string[]): string | null => {
    for (const key of keys) {
        const value = process.env[key];
        if (typeof value === "string" && value.trim().length > 0) {
            return value.trim();
        }
    }

    return null;
};

export async function updateSession(request: NextRequest) {
    const supabaseUrl = getEnvValue("NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_URL");
    const supabaseAnonKey = getEnvValue("NEXT_PUBLIC_SUPABASE_ANON_KEY", "SUPABASE_ANON_KEY");

    // During local bootstrapping, allow app startup before env vars are configured.
    if (!supabaseUrl || !supabaseAnonKey) {
        return NextResponse.next({
            request: {
                headers: request.headers,
            },
        });
    }

    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
            getAll() {
                return request.cookies.getAll();
            },
            setAll(cookiesToSet: CookieToSet[]) {
                cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
                response = NextResponse.next({
                    request,
                });
                cookiesToSet.forEach(({ name, value, options }) =>
                    response.cookies.set(name, value, options)
                );
            },
        }
    });

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const path = request.nextUrl.pathname;
    const redirectDestination = getAuthGuardRedirect(path, !!user);

    if (redirectDestination) {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = redirectDestination;

        const redirectResponse = NextResponse.redirect(redirectUrl);

        // IMPORTANT: Copy the session cookies from the `response` object (possibly updated by setAll)
        // to the `redirectResponse`. If we don't do this, a session refresh might be lost.
        const updatedCookies = response.cookies.getAll();
        updatedCookies.forEach(cookie => {
            redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
        });

        return redirectResponse;
    }

    return response;
}
