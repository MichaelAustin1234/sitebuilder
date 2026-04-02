/**
 * sitemap.ts — Sitemap dinamis untuk UMKM Sitebuilder
 *
 * Fetch semua toko yang sudah dipublikasikan dari Laravel API,
 * lalu kembalikan sebagai MetadataRoute.Sitemap.
 * Next.js akan otomatis serve hasilnya di /sitemap.xml.
 */

import type { MetadataRoute } from "next";

const API_URL  = process.env.NEXT_PUBLIC_API_URL  ?? "http://localhost:8000";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

interface PublishedShop {
  slug: string;
  updated_at: string;
}

async function fetchPublishedSlugs(): Promise<PublishedShop[]> {
  try {
    const res = await fetch(`${API_URL}/api/v1/public/toko`, {
      next: { revalidate: 3600 }, // Re-fetch setiap 1 jam
      headers: { Accept: "application/json" },
    });

    if (!res.ok) return [];

    const json = await res.json();
    if (!json.success) return [];

    return (json.data?.shops ?? []) as PublishedShop[];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const shops = await fetchPublishedSlugs();

  const shopUrls: MetadataRoute.Sitemap = shops.map((shop) => ({
    url: `${SITE_URL}/toko/${shop.slug}`,
    lastModified: new Date(shop.updated_at),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    // Halaman utama
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    // Halaman login & register (lower priority, no crawl needed for robots)
    {
      url: `${SITE_URL}/login`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/register`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
    },
    // Semua halaman toko yang dipublikasikan
    ...shopUrls,
  ];
}

