import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PREFIXES = ["/dashboard"];
const AUTH_ROUTES = ["/login", "/register"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth_token")?.value;

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r));

  // Not authenticated → redirect to login
  if (isProtected && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Already authenticated → redirect away from auth pages
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Skip static files, Next internals, and BFF API routes
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"],
};

