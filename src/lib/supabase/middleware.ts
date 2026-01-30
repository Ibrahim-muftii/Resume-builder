import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getAuthGuardRedirect } from "@/lib/auth-guard";

export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    const supabase = createServerClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    );
                    response = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

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
