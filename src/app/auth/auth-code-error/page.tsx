"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function AuthErrorContent() {
    const searchParams = useSearchParams();
    const error = searchParams.get("error");
    const errorCode = searchParams.get("error_code");
    const errorDescription = searchParams.get("error_description");

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="bg-white p-8 rounded-2xl border border-black/10 shadow-sm text-center">
                <div className="mb-4 flex justify-center">
                    <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                        <svg
                            className="h-6 w-6 text-red-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    </div>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                    Authentication Error
                </h2>
                <p className="text-gray-500 mb-6 text-sm">
                    {errorDescription || error || "Something went wrong during authentication."}
                </p>

                {errorCode && (
                    <div className="mb-6 p-3 bg-gray-50 rounded text-xs text-gray-600 font-mono">
                        Error Code: {errorCode}
                    </div>
                )}

                <Link
                    href="/login"
                    className="inline-flex justify-center w-full py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                >
                    Back to Sign In
                </Link>
            </div>
        </div>
    );
}

export default function AuthCodeErrorPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-white">
                <AuthErrorContent />
            </div>
        </Suspense>
    )
}
