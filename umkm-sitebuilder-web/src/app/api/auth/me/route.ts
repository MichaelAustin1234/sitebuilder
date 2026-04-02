import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function GET(_request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthenticated" }, { status: 401 });
    }

    const laravelRes = await fetch(`${API_URL}/api/v1/auth/me`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await laravelRes.json();

    if (!laravelRes.ok) {
      return NextResponse.json(json, { status: laravelRes.status });
    }

    return NextResponse.json({ success: true, message: json.message, data: { user: json.data.user } });
  } catch {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

