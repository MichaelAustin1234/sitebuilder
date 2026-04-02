"use client";

/**
 * Global Error Boundary for /dashboard/* routes.
 *
 * Next.js App Router automatically renders this component when an uncaught
 * error occurs inside the dashboard segment (Server or Client Component).
 * Must be a Client Component — receives `error` and `reset` from the framework.
 */

import { useEffect } from "react";

interface DashboardErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardError({ error, reset }: DashboardErrorProps) {
  useEffect(() => {
    // Log to browser console — swap for Sentry/Datadog in production
    console.error("[Dashboard Error]", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-red-100 p-8 text-center">
        <div className="text-5xl mb-4">😕</div>

        <h1 className="text-lg font-semibold text-gray-800 mb-2">
          Ups, terjadi kesalahan
        </h1>

        <p className="text-sm text-gray-500 mb-1">
          Halaman ini tidak dapat dimuat saat ini.
        </p>

        {error.message && (
          <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2 mt-3 mb-4 font-mono break-all">
            {error.message}
          </p>
        )}

        <div className="flex gap-3 justify-center mt-6">
          <button
            onClick={reset}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition"
          >
            Coba Lagi
          </button>
          <a
            href="/dashboard"
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-5 py-2 rounded-lg transition"
          >
            Kembali ke Dashboard
          </a>
        </div>

        {error.digest && (
          <p className="text-xs text-gray-300 mt-6">ID: {error.digest}</p>
        )}
      </div>
    </div>
  );
}

