/**
 * BFF Route Handler — /api/dashboard/products
 *
 * GET  — daftar produk dengan pagination & filter
 * POST — tambah produk baru
 */

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function getToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("auth_token")?.value ?? null;
}

function unauthorized() {
  return NextResponse.json(
    { success: false, message: "Unauthorized", data: null },
    { status: 401 }
  );
}

export async function GET(request: NextRequest) {
  try {
    const token = await getToken();
    if (!token) return unauthorized();

    // Forward semua query params (page, category, is_active)
    const { searchParams } = request.nextUrl;
    const query = searchParams.toString();
    const url = `${API_URL}/api/v1/dashboard/products${query ? `?${query}` : ""}`;

    const laravelRes = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    const json = await laravelRes.json();
    return NextResponse.json(json, { status: laravelRes.status });
  } catch {
    return NextResponse.json(
      { success: false, message: "Server error saat mengambil produk", data: null },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = await getToken();
    if (!token) return unauthorized();

    const body = await request.json();

    const laravelRes = await fetch(`${API_URL}/api/v1/dashboard/products`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    const json = await laravelRes.json();
    return NextResponse.json(json, { status: laravelRes.status });
  } catch {
    return NextResponse.json(
      { success: false, message: "Server error saat menambah produk", data: null },
      { status: 500 }
    );
  }
}

