"use client";

import React from "react";

// ── ErrorBoundary (class component — required by React) ───────────────────────

interface Props {
  children: React.ReactNode;
  /** Custom fallback. If omitted, uses the default error card. */
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[ErrorBoundary]", error, info);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-2xl mb-2">⚠️</p>
          <p className="text-sm font-medium text-red-700 mb-1">Terjadi Kesalahan</p>
          <p className="text-xs text-red-500 mb-4">{this.state.message || "Komponen gagal dimuat."}</p>
          <button
            onClick={() => this.setState({ hasError: false, message: "" })}
            className="text-xs bg-red-600 text-white px-4 py-1.5 rounded-lg hover:bg-red-700 transition"
          >
            Coba Lagi
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ── Inline section error state (non-boundary, for async errors) ───────────────

interface SectionErrorProps {
  message?: string;
  onRetry?: () => void;
}

export function SectionError({ message = "Gagal memuat data.", onRetry }: SectionErrorProps) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
      <p className="text-3xl mb-3">😕</p>
      <p className="text-sm font-semibold text-red-700 mb-1">Ups, ada yang salah</p>
      <p className="text-xs text-red-500 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-xs bg-red-600 text-white px-4 py-1.5 rounded-lg hover:bg-red-700 transition"
        >
          Coba Lagi
        </button>
      )}
    </div>
  );
}

