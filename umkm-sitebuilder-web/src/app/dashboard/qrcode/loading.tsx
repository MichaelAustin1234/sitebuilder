import { SiteProfileSkeleton } from "@/components/ui/Skeleton";

/**
 * Next.js Streaming loading UI for /dashboard/qrcode.
 */
export default function QRCodeLoading() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-lg mx-auto space-y-6">
        <div className="h-7 w-36 bg-gray-200 animate-pulse rounded-md" />
        <SiteProfileSkeleton />
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center gap-4">
          <div className="w-56 h-56 bg-gray-200 animate-pulse rounded-xl" />
          <div className="h-4 w-48 bg-gray-200 animate-pulse rounded-md" />
          <div className="flex gap-3">
            <div className="h-9 w-28 bg-gray-200 animate-pulse rounded-lg" />
            <div className="h-9 w-28 bg-gray-200 animate-pulse rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

