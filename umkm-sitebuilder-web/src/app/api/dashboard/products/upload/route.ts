/**
 * BFF Route Handler — POST /api/dashboard/products/upload
 *
 * Proxy multipart/form-data ke Laravel CloudinaryService untuk foto produk.
 * Field yang diterima: "image" (file foto produk)
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

    const formData = await request.formData();

    // Forward ke Laravel endpoint upload foto produk
    const laravelRes = await fetch(`${API_URL}/api/v1/dashboard/products/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        // Jangan set Content-Type — fetch otomatis isi boundary untuk multipart
      },
      body: formData,
    });

    const json = await laravelRes.json();
    return NextResponse.json(json, { status: laravelRes.status });
  } catch {
    return NextResponse.json(
      { success: false, message: "Server error saat upload foto produk", data: null },
      { status: 500 }
    );
  }
}

