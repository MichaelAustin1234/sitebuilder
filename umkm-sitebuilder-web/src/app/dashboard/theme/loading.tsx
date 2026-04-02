import { ThemeCustomizerSkeleton } from "@/components/ui/Skeleton";

/**
 * Next.js Streaming loading UI for /dashboard/theme.
 * Shown automatically by the App Router while the Server Component fetches data.
 */
export default function ThemeLoading() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 py-8 max-w-7xl mx-auto">
      <div className="h-7 w-44 bg-gray-200 animate-pulse rounded-md mb-2" />
      <div className="h-4 w-72 bg-gray-200 animate-pulse rounded-md mb-8" />
      <ThemeCustomizerSkeleton />
    </div>
  );
}

