/**
 * /dashboard/qrcode — Halaman QR Code Toko
 *
 * Server Component: fetch data toko dari Laravel lalu render QRCodeGenerator.
 * Redirect ke /login jika belum autentikasi.
 */

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import QRCodeGenerator from "@/components/QRCodeGenerator";
import type { UmkmSite } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function getSiteData(): Promise<UmkmSite | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) return null;

  try {
    const res = await fetch(`${API_URL}/api/v1/dashboard/site`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) return null;

    const json = await res.json();
    if (!json.success) return null;

    // Laravel returns { data: { site: UmkmSite } }
    const data = json.data as { site: UmkmSite };
    return data.site ?? null;
  } catch {
    return null;
  }
}

export const metadata = {
  title: "QR Code Toko | UMKM Sitebuilder",
};

export default async function QRCodePage() {
  const site = await getSiteData();

  if (!site) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-lg mx-auto">
        {/* Back link */}
        <a
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 mb-8 transition"
        >
          ← Kembali ke Dashboard
        </a>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">QR Code Toko</h1>
        <p className="text-sm text-gray-500 mb-8">
          Cetak atau bagikan QR code ini agar pelanggan bisa langsung mengunjungi toko online Anda.
        </p>

        <QRCodeGenerator site={site} />

        {!site.is_published && (
          <p className="mt-6 text-center text-xs text-amber-600 bg-amber-50 rounded-xl p-3">
            ⚠️ Toko Anda belum dipublikasi. QR code akan menuju halaman 404 hingga toko diaktifkan
            di <a href="/dashboard/theme" className="underline">Kustomisasi Tema</a>.
          </p>
        )}
      </div>
    </div>
  );
}

