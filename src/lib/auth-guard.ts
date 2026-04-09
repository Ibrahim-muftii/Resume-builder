export const publicPaths = [
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/api/auth",
    "/auth"
];

/**
 * Checks if the current request needs a redirect based on auth state.
 * Returns the destination path string if redirect is needed, or null if allowed.
 */
export function getAuthGuardRedirect(path: string, hasUser: boolean): string | null {
    const isPublic = publicPaths.some((p) => path.startsWith(p));

    // 1. Unauthenticated user trying to access protected route -> Redirect to Login
    if (!hasUser && !isPublic) {
        return "/login";
    }

    // 2. Authenticated user trying to access public auth pages (like Login/Signup) -> Redirect to Home/Dashboard
    // Note: We don't block /api/auth because the frontend needs to call it even if logged in (e.g. sign out)
    if (hasUser && (path === "/login" || path === "/signup" || path === "/forgot-password")) {
        return "/dashboard";
    }

    return null;
}
