import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { SiteTemplateData, ApiResponse } from "@/lib/types";
import {
  MinimalistTemplate,
  FoodTemplate,
  FashionTemplate,
  TechTemplate,
  NatureTemplate,
  CafeTemplate,
  BeautyTemplate,
  WarungTemplate,
  MarketTemplate,
  CraftTemplate,
} from "@/components/templates";

// ── Helpers ───────────────────────────────────────────────────────────────────

const API_URL  = process.env.NEXT_PUBLIC_API_URL  ?? "http://localhost:8000";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/**
 * Fetch data toko dari Laravel.
 * @param preview - jika true, kirim ?preview=1 agar Laravel tidak increment view_count
 *                  (dipakai oleh iframe preview di ThemeCustomizer)
 */
async function fetchTokoData(slug: string, preview = false): Promise<SiteTemplateData | null> {
  try {
    const qs = preview ? "?preview=1" : "";
    const res = await fetch(`${API_URL}/api/v1/public/toko/${slug}${qs}`, {
      // Selalu ambil data terbaru; view_count diincrement di setiap real request
      cache: "no-store",
      headers: { Accept: "application/json" },
    });

    if (!res.ok) return null;

    const json: ApiResponse<SiteTemplateData> = await res.json();
    return json.success ? json.data : null;
  } catch {
    return null;
  }
}

// ── Dynamic Metadata ──────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await fetchTokoData(slug);

  if (!data) {
    return {
      title: "Toko Tidak Ditemukan",
      description: "Toko yang kamu cari tidak tersedia.",
    };
  }

  const { site } = data;

  const shopUrl = `${SITE_URL}/toko/${slug}`;
  const description = site.description ?? `Kunjungi ${site.name} dan temukan produk terbaik kami.`;

  return {
    title: site.name,
    description,
    alternates: { canonical: shopUrl },
    keywords: [site.name, "toko online", "UMKM", slug],
    openGraph: {
      type: "website",
      locale: "id_ID",
      url: shopUrl,
      siteName: "UMKM Sitebuilder",
      title: site.name,
      description,
      ...(site.logo_url ? { images: [{ url: site.logo_url, alt: site.name }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: site.name,
      description,
      ...(site.logo_url ? { images: [site.logo_url] } : {}),
    },
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────

/**
 * Server Component — halaman publik toko UMKM.
 *
 * PERBEDAAN Server Component vs Client Component:
 * - Server Component (ini): dirender di server, bisa fetch data langsung,
 *   tidak ada JavaScript bundle yang dikirim ke browser, bagus untuk SEO.
 * - Client Component ("use client"): dirender di browser, bisa pakai hooks
 *   (useState, useEffect), event listeners, browser APIs.
 *
 * Halaman publik ini menggunakan Server Component agar:
 *   1. SEO optimal (HTML lengkap saat crawled)
 *   2. Data toko di-fetch langsung di server (tidak perlu BFF tambahan)
 *   3. view_count di-increment via Laravel sebelum HTML dikirim
 */
export default async function TokoPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;

  // Mode preview: iframe di ThemeCustomizer mengirim ?preview=1&preview_color=#xxxxxx
  const isPreview = sp.preview === "1";
  const previewColor = typeof sp.preview_color === "string" ? sp.preview_color : null;

  const data = await fetchTokoData(slug, isPreview);

  if (!data) {
    notFound();
  }

  // Override primary_color untuk live preview tanpa menyimpan ke DB
  if (previewColor) {
    data.site.primary_color = previewColor;
  }

  // Pilih komponen template berdasarkan slug template
  const templateSlug = data.template?.slug ?? "minimalist";

  const TemplateMap: Record<string, React.ComponentType<{ data: SiteTemplateData }>> = {
    minimalist: MinimalistTemplate,
    food: FoodTemplate,
    fashion: FashionTemplate,
    tech: TechTemplate,
    nature: NatureTemplate,
    cafe: CafeTemplate,
    beauty: BeautyTemplate,
    warung: WarungTemplate,
    market: MarketTemplate,
    craft: CraftTemplate,
  };

  const TemplateComponent = TemplateMap[templateSlug] ?? MinimalistTemplate;

  // ── JSON-LD: LocalBusiness structured data ────────────────────────────────
  const shopUrl = `${SITE_URL}/toko/${slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: data.site.name,
    description: data.site.description ?? undefined,
    url: shopUrl,
    ...(data.site.logo_url ? { image: data.site.logo_url } : {}),
    ...(data.site.phone_wa
      ? { telephone: data.site.phone_wa, contactPoint: { "@type": "ContactPoint", telephone: data.site.phone_wa, contactType: "customer service", availableLanguage: "Indonesian" } }
      : {}),
    ...(data.site.operating_hours ? { openingHours: data.site.operating_hours } : {}),
    inLanguage: "id-ID",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TemplateComponent data={data} />
    </>
  );
}

