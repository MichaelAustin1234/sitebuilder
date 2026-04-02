/**
 * BFF Route Handler — GET & PUT /api/dashboard/site
 *
 * Proxy ke Laravel endpoint GET/PUT /api/v1/dashboard/site,
 * menggunakan auth_token dari httpOnly cookie.
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

/** GET /api/dashboard/site — ambil profil toko */
export async function GET() {
  try {
    const token = await getToken();
    if (!token) return unauthorized();

    const laravelRes = await fetch(`${API_URL}/api/v1/dashboard/site`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    const json = await laravelRes.json();
    return NextResponse.json(json, { status: laravelRes.status });
  } catch {
    return NextResponse.json(
      { success: false, message: "Server error saat mengambil data toko", data: null },
      { status: 500 }
    );
  }
}

/** PUT /api/dashboard/site — update profil & tema toko */
export async function PUT(request: NextRequest) {
  try {
    const token = await getToken();
    if (!token) return unauthorized();

    const body = await request.json();

    const laravelRes = await fetch(`${API_URL}/api/v1/dashboard/site`, {
      method: "PUT",
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
      { success: false, message: "Server error saat update toko", data: null },
      { status: 500 }
    );
  }
}

