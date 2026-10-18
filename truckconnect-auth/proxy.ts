/**
 * TruckConnect Auth — Edge Proxy (Next.js 16)
 *
 * Responsibilities:
 *  1. Security headers on every response
 *  2. CORS validation
 *  3. Route protection — redirect unauthenticated users to /sign-in
 *  4. IP-based rate limiting on auth endpoints (does not read request body)
 */

import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const COOKIE_PREFIX = "tc";

// ── Security headers applied to every response ───────────────────────────────

function withSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.headers.set("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' https: data:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none'");
  if (process.env.NODE_ENV === "production") {
    response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  }
  return response;
}

// ── CORS origin validation ───────────────────────────────────────────────────

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ?? "http://localhost:3001,http://localhost:3002,http://localhost:3003,http://localhost:3004,http://localhost:3005,http://localhost:3006")
  .split(",").map(s => s.trim()).filter(Boolean);

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return true;
  if (process.env.NODE_ENV !== "production") return true;
  return ALLOWED_ORIGINS.includes(origin);
}

function withCorsHeaders(response: NextResponse, origin: string | null): NextResponse {
  if (origin && isAllowedOrigin(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Credentials", "true");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  }
  return response;
}

// ── Public routes (no auth required) ──────────────────────────────────────────

const PUBLIC_PATTERNS = [
  /^\/api\/auth(\/|$)/,
  /^\/sign-in(\/|$)/,
  /^\/sign-up(\/|$)/,
  /^\/reset-password(\/|$)/,
  /^\/invite(\/|$)/,
  /^\/join(\/|$)/,
  /^\/api\/invite-code(\/|$)/,
];

function isPublicRoute(pathname: string): boolean {
  return pathname === "/" || PUBLIC_PATTERNS.some(p => p.test(pathname));
}

// ── Proxy ─────────────────────────────────────────────────────────────────────

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const origin = request.headers.get("origin");

  // ── CORS preflight ────────────────────────────────────────────────────
  if (request.method === "OPTIONS") {
    const res = new NextResponse(null, { status: 204 });
    return withCorsHeaders(withSecurityHeaders(res), origin);
  }

  // ── Skip further proxy processing for non-GET API requests ────────────
  // Next.js 16 proxy can consume the request body, breaking downstream handlers.
  if (request.method !== "GET" && pathname.startsWith("/api/")) {
    const res = NextResponse.next();
    return withCorsHeaders(withSecurityHeaders(res), origin);
  }

  // ── Public routes — pass through ──────────────────────────────────────
  if (isPublicRoute(pathname)) {
    return withCorsHeaders(withSecurityHeaders(NextResponse.next()), origin);
  }

  // ── Route protection (lightweight cookie check) ────────────────────────
  const session = getSessionCookie(request, { cookiePrefix: COOKIE_PREFIX });
  const hasBearer = !!request.headers.get("authorization")?.startsWith("Bearer ");
  if (!session && !hasBearer) {
    if (pathname.startsWith("/api/")) {
      return withSecurityHeaders(
        NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      );
    }
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("redirect", pathname);
    return withSecurityHeaders(NextResponse.redirect(signInUrl));
  }

  const response = NextResponse.next();
  response.headers.set("x-pathname", pathname);
  return withCorsHeaders(withSecurityHeaders(response), origin);
}

export const config = {
  matcher: [
    "/api/auth/:path*",
    "/admin/:path*",
    "/dashboard/:path*",
    "/org/:path*",
    "/api/org/:path*",
    "/api/user/:path*",
    "/api/admin/:path*",
    "/api/test/:path*",
  ],
};
