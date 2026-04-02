/**
 * BFF Route Handler — /api/dashboard/products/[id]
 *
 * GET    — detail satu produk
 * PUT    — update produk
 * DELETE — soft delete produk
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

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const token = await getToken();
    if (!token) return unauthorized();

    const { id } = await params;

    const laravelRes = await fetch(`${API_URL}/api/v1/dashboard/products/${id}`, {
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

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const token = await getToken();
    if (!token) return unauthorized();

    const { id } = await params;
    const body = await request.json();

    const laravelRes = await fetch(`${API_URL}/api/v1/dashboard/products/${id}`, {
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
      { success: false, message: "Server error saat mengupdate produk", data: null },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const token = await getToken();
    if (!token) return unauthorized();

    const { id } = await params;

    const laravelRes = await fetch(`${API_URL}/api/v1/dashboard/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    const json = await laravelRes.json();
    return NextResponse.json(json, { status: laravelRes.status });
  } catch {
    return NextResponse.json(
      { success: false, message: "Server error saat menghapus produk", data: null },
      { status: 500 }
    );
  }
}

