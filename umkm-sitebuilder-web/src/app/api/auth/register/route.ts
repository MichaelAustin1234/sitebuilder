import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.API_URL ?? process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const COOKIE_NAME = "auth_token";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("[register] API_URL =", API_URL);

    const laravelRes = await fetch(`${API_URL}/api/v1/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
    });

    const json = await laravelRes.json();
    console.log("[register] Laravel status =", laravelRes.status, "body =", JSON.stringify(json));

    if (!laravelRes.ok) {
      return NextResponse.json(json, { status: laravelRes.status });
    }

    // Set httpOnly cookie after successful registration
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, json.data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: COOKIE_MAX_AGE,
    });

    return NextResponse.json({ success: true, message: json.message, data: { user: json.data.user } });
  } catch (err) {
    console.error("[register] Error:", err);
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

