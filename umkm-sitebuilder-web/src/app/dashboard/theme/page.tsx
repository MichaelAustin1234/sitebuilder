/**
 * /dashboard/theme — Halaman Kustomisasi Tema
 *
 * Server Component: fetch data toko langsung dari Laravel menggunakan
 * auth_token dari httpOnly cookie, lalu render ThemeCustomizer (Client Component).
 * Redirect ke /login jika belum login atau token tidak valid.
 */

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ThemeCustomizer } from "@/components/ThemeCustomizer";
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
    // Laravel returns { success: true, data: { site: UmkmSite } }
    return json.success ? (json.data as { site: UmkmSite }).site : null;
  } catch {
    return null;
  }
}

export const metadata = {
  title: "Kustomisasi Tema | UMKM Sitebuilder",
};

export default async function ThemePage() {
  const site = await getSiteData();

  if (!site) {
    redirect("/login");
  }

  return <ThemeCustomizer initialSite={site} />;
}

