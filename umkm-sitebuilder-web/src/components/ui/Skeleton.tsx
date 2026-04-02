import React from "react";

// ── Base Skeleton primitive ───────────────────────────────────────────────────
// Pulse animation via Tailwind animate-pulse

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export function Skeleton({ className = "", style }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-md bg-gray-200 ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
}

// ── Product Table Skeleton ────────────────────────────────────────────────────

export function ProductTableSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow overflow-hidden" aria-label="Memuat produk...">
      {/* Table header */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex gap-4">
        {[60, 140, 90, 60, 80, 70, 80].map((w, i) => (
          <Skeleton key={i} className="h-3" style={{ width: w }} />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: 6 }).map((_, rowIdx) => (
        <div
          key={rowIdx}
          className="flex items-center gap-4 px-4 py-3 border-b border-gray-100 last:border-0"
        >
          {/* image cell */}
          <Skeleton className="w-10 h-10 rounded flex-shrink-0" />
          {/* name */}
          <Skeleton className="h-4 flex-1 max-w-[200px]" />
          {/* price */}
          <Skeleton className="h-4 w-[90px]" />
          {/* stock */}
          <Skeleton className="h-4 w-[50px]" />
          {/* category */}
          <Skeleton className="h-5 w-[80px] rounded-full" />
          {/* status */}
          <Skeleton className="h-5 w-[60px] rounded-full" />
          {/* actions */}
          <div className="flex gap-2">
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-4 w-10" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Dashboard Stat Skeleton ───────────────────────────────────────────────────

export function DashboardStatSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl shadow-sm p-6 space-y-3">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
      ))}
    </div>
  );
}

// ── Site Profile Skeleton ─────────────────────────────────────────────────────

export function SiteProfileSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 space-y-4" aria-label="Memuat data toko...">
      <div className="flex items-center gap-4">
        <Skeleton className="w-16 h-16 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-4 w-28" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 pt-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-1">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-4 w-32" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Theme Customizer Skeleton ─────────────────────────────────────────────────

export function ThemeCustomizerSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Control panel */}
      <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
        {[120, 100, 100, 52, 140].map((h, i) => (
          <Skeleton key={i} className={`rounded-xl`} style={{ height: h }} />
        ))}
      </div>
      {/* Preview area */}
      <Skeleton className="flex-1 rounded-xl" style={{ minHeight: 600 }} />
    </div>
  );
}

