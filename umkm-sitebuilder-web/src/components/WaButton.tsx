"use client";

/**
 * WaButton — Tombol WhatsApp yang mencatat analytics sebelum membuka WA.
 *
 * Props:
 *   href      — URL wa.me yang sudah diformat (dari buildWaProductUrl / buildWaContactUrl)
 *   slug      — slug toko, dipakai untuk hit analytics BFF
 *   className — kelas CSS tambahan dari parent template
 *   style     — style inline tambahan
 *   children  — konten tombol (teks / ikon)
 */

import React from "react";

interface WaButtonProps {
  href: string;
  slug: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

/**
 * Tombol inline "Pesan via WA" di kartu produk.
 */
export function WaButton({ href, slug, className, style, children }: WaButtonProps) {
  function handleClick() {
    // Fire-and-forget: catat klik WA ke BFF (tidak blocking navigasi)
    navigator.sendBeacon(`/api/public/toko/${slug}/wa-click`);
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      style={style}
      onClick={handleClick}
    >
      {children}
    </a>
  );
}

/**
 * Tombol WhatsApp mengambang di pojok kanan bawah halaman publik.
 */
export function FloatingWaButton({ href, slug }: { href: string; slug: string }) {
  function handleClick() {
    navigator.sendBeacon(`/api/public/toko/${slug}/wa-click`);
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      aria-label="Chat WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition hover:scale-110"
      style={{ backgroundColor: "#25D366" }}
    >
      {/* Ikon WhatsApp SVG */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        fill="white"
        width="28"
        height="28"
        aria-hidden="true"
      >
        <path d="M16 2C8.268 2 2 8.268 2 16c0 2.46.637 4.843 1.846 6.944L2 30l7.29-1.82A13.93 13.93 0 0 0 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.4a11.36 11.36 0 0 1-5.8-1.59l-.415-.247-4.326 1.08 1.118-4.21-.27-.43A11.36 11.36 0 0 1 4.6 16C4.6 9.7 9.7 4.6 16 4.6S27.4 9.7 27.4 16 22.3 27.4 16 27.4zm6.23-8.47c-.34-.17-2.017-1-2.33-1.11-.313-.112-.54-.17-.768.17-.227.34-.88 1.11-1.08 1.34-.198.227-.397.256-.737.085-.34-.17-1.436-.53-2.734-1.69-1.01-.903-1.692-2.02-1.89-2.36-.198-.34-.02-.524.149-.693.152-.152.34-.397.51-.595.17-.198.226-.34.34-.566.113-.227.057-.425-.028-.595-.085-.17-.768-1.852-1.052-2.536-.277-.665-.558-.575-.768-.585l-.653-.01c-.227 0-.595.085-.907.425-.312.34-1.19 1.163-1.19 2.836s1.218 3.29 1.388 3.517c.17.227 2.397 3.661 5.81 5.134.812.35 1.446.559 1.94.715.815.258 1.557.222 2.143.134.654-.097 2.017-.824 2.302-1.62.284-.794.284-1.475.198-1.62-.085-.142-.312-.227-.652-.397z" />
      </svg>
    </a>
  );
}

