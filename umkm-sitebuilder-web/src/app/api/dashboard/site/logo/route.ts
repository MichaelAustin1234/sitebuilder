/**
 * BFF Route Handler — POST /api/dashboard/site/logo
 *
 * Proxy multipart/form-data upload ke Laravel endpoint
 * POST /api/v1/dashboard/site/logo, menggunakan auth_token dari httpOnly cookie.
 */

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized", data: null },
        { status: 401 }
      );
    }

    // Ambil FormData dari request klien
    const formData = await request.formData();

    // Forward ke Laravel — biarkan fetch handle multipart boundary otomatis
    const laravelRes = await fetch(`${API_URL}/api/v1/dashboard/site/logo`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        // Jangan set Content-Type manual — fetch mengisi boundary otomatis
      },
      body: formData,
    });

    const json = await laravelRes.json();

    return NextResponse.json(json, { status: laravelRes.status });
  } catch {
    return NextResponse.json(
      { success: false, message: "Server error saat upload logo", data: null },
      { status: 500 }
    );
  }
}

