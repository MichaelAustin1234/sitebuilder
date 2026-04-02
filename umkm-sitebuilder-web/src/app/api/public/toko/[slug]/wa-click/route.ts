/**
 * BFF Route Handler — POST /api/public/toko/[slug]/wa-click
 *
 * Proxy ke Laravel POST /api/v1/public/toko/{slug}/wa-click
 * untuk mencatat klik WhatsApp (analytics). Endpoint publik — tidak butuh auth.
 */

import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const laravelRes = await fetch(
      `${API_URL}/api/v1/public/toko/${slug}/wa-click`,
      {
        method: "POST",
        headers: { Accept: "application/json" },
      }
    );

    const json = await laravelRes.json();
    return NextResponse.json(json, { status: laravelRes.status });
  } catch {
    return NextResponse.json(
      { success: false, message: "Gagal mencatat klik WA.", data: null },
      { status: 500 }
    );
  }
}

