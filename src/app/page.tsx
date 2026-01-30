import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white">
      <div className="w-full max-w-md p-8 text-center bg-white border border-black/10 rounded-2xl shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Base</h1>
        <p className="text-gray-500 mb-8 text-sm">You are successfully logged in.</p>

        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center w-full px-5 py-2.5 text-sm font-semibold text-white bg-black border border-transparent rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors"
        >
          Proceed Forward
        </Link>
      </div>
    </div>
  );
}
