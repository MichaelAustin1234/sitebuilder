/**
 * BFF Route Handler — PUT /api/dashboard/site/template
 *
 * Proxy ke Laravel endpoint PUT /api/v1/dashboard/site/template,
 * menggunakan auth_token dari httpOnly cookie.
 */

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function PUT(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized", data: null },
        { status: 401 }
      );
    }

    const body = await request.json();

    const laravelRes = await fetch(`${API_URL}/api/v1/dashboard/site/template`, {
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
      { success: false, message: "Server error saat mengganti template", data: null },
      { status: 500 }
    );
  }
}

