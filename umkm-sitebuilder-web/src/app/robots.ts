/**
 * robots.ts — Robots crawl rules untuk UMKM Sitebuilder
 *
 * - Allow: halaman publik toko (/toko/*) dan landing page (/)
 * - Disallow: area dashboard dan API routes
 * Next.js otomatis serve di /robots.txt
 */

import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/toko/"],
        disallow: ["/dashboard/", "/api/", "/login", "/register"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

