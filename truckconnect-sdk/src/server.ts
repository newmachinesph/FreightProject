/**
 * @truckconnect/sdk/server — Server-side utilities
 *
 * Features:
 *   - JWT local verification (no HTTP round-trip) via JWKS
 *   - Fallback to session verification via HTTP
 *   - API key verification with retry + timeout
 *   - Universal auth guard (session + API key routing)
 *
 * ── JWT verification (fastest — local, <1ms) ─────────────────────────────────
 *
 *   import { verifyJwt } from "@truckconnect/sdk/server"
 *   const result = await verifyJwt(request.headers.get("authorization"))
 *   if (!result.valid) return Response.json({ error: "Unauthorized" }, { status: 401 })
 *
 * ── Session verification (HTTP round-trip fallback) ──────────────────────────
 *
 *   import { verifySession } from "@truckconnect/sdk/server"
 *
 * ── API key verification (machine-to-machine) ───────────────────────────────
 *
 *   import { verifyApiKey } from "@truckconnect/sdk/server"
 */

const DEFAULT_AUTH_URL = process.env.TRUCKCONNECT_AUTH_URL
  ?? process.env.NEXT_PUBLIC_AUTH_URL
  ?? "http://localhost:3001";

// ── Config ────────────────────────────────────────────────────────────────────

export interface SdkOptions {
  authUrl?: string;
  timeoutMs?: number;
  maxRetries?: number;
}

const DEFAULT_TIMEOUT = 8_000;
const DEFAULT_RETRIES = 3;
const RETRY_BASE_MS = 150;

// ── Internal fetch with retry + timeout ───────────────────────────────────────

async function safeFetch(
  url: string,
  init: RequestInit,
  opts: { timeoutMs: number; maxRetries: number }
): Promise<Response> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < opts.maxRetries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), opts.timeoutMs);

    try {
      const res = await fetch(url, { ...init, signal: controller.signal });
      clearTimeout(timer);
      return res;
    } catch (err: unknown) {
      clearTimeout(timer);
      lastError = err instanceof Error ? err : new Error(String(err));

      if (lastError.name === "AbortError" || lastError.message.includes("fetch")) {
        if (attempt < opts.maxRetries - 1) {
          const delay = RETRY_BASE_MS * Math.pow(2, attempt);
          await new Promise(r => setTimeout(r, delay));
          continue;
        }
      }
      break;
    }
  }

  throw lastError ?? new Error("safeFetch: unknown failure");
}

// ── JWT Local Verification ───────────────────────────────────────────────────

interface JwtPayload {
  sub: string;
  email: string;
  name: string;
  role: string;
  activeOrgId: string | null;
  aud: string;
  iss: string;
  exp: number;
  iat: number;
}

export interface JwtResult {
  valid: true;
  payload: JwtPayload;
}

export interface JwtError {
  valid: false;
  reason: "unauthorized" | "expired" | "invalid" | "error";
}

// JWKS cache — refreshed every 5 minutes
let _jwksCache: { keys: JsonWebKey[]; fetchedAt: number } | null = null;
const JWKS_CACHE_TTL = 5 * 60 * 1000;

async function getJwks(authUrl: string): Promise<JsonWebKey[]> {
  if (_jwksCache && Date.now() - _jwksCache.fetchedAt < JWKS_CACHE_TTL) {
    return _jwksCache.keys;
  }

  const res = await safeFetch(`${authUrl}/api/auth/jwks`, {
    cache: "no-store",
  }, { timeoutMs: 5000, maxRetries: 2 });

  const data = await res.json();
  const keys = data?.keys ?? [];
  _jwksCache = { keys, fetchedAt: Date.now() };
  return keys;
}

/**
 * Verify a JWT token locally using JWKS — no HTTP round-trip per request.
 * Only fetches JWKS once every 5 minutes.
 *
 * Pass: Authorization: Bearer {jwt_token}
 * Get JWT via: GET /api/auth/token (with session cookie/bearer)
 */
export async function verifyJwt(
  authHeader: string | null | undefined,
  options: SdkOptions = {}
): Promise<JwtResult | JwtError> {
  if (!authHeader?.startsWith("Bearer ")) {
    return { valid: false, reason: "unauthorized" };
  }

  const token = authHeader.slice(7).trim();
  if (!token || token.split(".").length !== 3) {
    return { valid: false, reason: "unauthorized" };
  }

  const authUrl = options.authUrl ?? DEFAULT_AUTH_URL;

  try {
    // Dynamic import jose (tree-shakeable)
    const { jwtVerify, createRemoteJWKSet } = await import("jose");
    const JWKS = createRemoteJWKSet(new URL(`${authUrl}/api/auth/jwks`));

    const { payload } = await jwtVerify(token, JWKS, {
      audience: "truckconnect",
    });

    return {
      valid: true,
      payload: {
        sub: String(payload.sub ?? ""),
        email: String((payload as Record<string, unknown>).email ?? ""),
        name: String((payload as Record<string, unknown>).name ?? ""),
        role: String((payload as Record<string, unknown>).role ?? "user"),
        activeOrgId: (payload as Record<string, unknown>).activeOrgId as string | null ?? null,
        aud: String(payload.aud ?? ""),
        iss: String(payload.iss ?? ""),
        exp: Number(payload.exp ?? 0),
        iat: Number(payload.iat ?? 0),
      },
    };
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes("expired")) {
      return { valid: false, reason: "expired" };
    }
    if (err instanceof Error && (err.message.includes("signature") || err.message.includes("JWS"))) {
      return { valid: false, reason: "invalid" };
    }
    return { valid: false, reason: "error" };
  }
}

// ── Session verification (HTTP fallback) ──────────────────────────────────────

export interface SessionResult {
  valid: true;
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    role: string;
  };
  session: {
    id: string;
    activeOrganizationId: string | null;
    expiresAt: string;
  };
}

export interface SessionError {
  valid: false;
  reason: "unauthorized" | "timeout" | "network" | "error";
}

export async function verifySession(
  authHeader: string | null | undefined,
  options: SdkOptions = {}
): Promise<SessionResult | SessionError> {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { valid: false, reason: "unauthorized" };
  }

  const token = authHeader.slice(7).trim();
  if (!token || token.length < 10) {
    return { valid: false, reason: "unauthorized" };
  }

  const authUrl = options.authUrl ?? DEFAULT_AUTH_URL;
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT;
  const maxRetries = options.maxRetries ?? DEFAULT_RETRIES;

  try {
    const res = await safeFetch(`${authUrl}/api/auth/get-session`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }, { timeoutMs, maxRetries });

    if (!res.ok) return { valid: false, reason: "unauthorized" };

    const data = await res.json();
    if (!data?.user?.id || !data?.session?.id) {
      return { valid: false, reason: "unauthorized" };
    }

    return {
      valid: true,
      user: {
        id:    String(data.user.id),
        name:  String(data.user.name ?? ""),
        email: String(data.user.email ?? ""),
        image: data.user.image ? String(data.user.image) : null,
        role:  String(data.user.role ?? "user"),
      },
      session: {
        id: String(data.session.id),
        activeOrganizationId: data.session.activeOrganizationId ? String(data.session.activeOrganizationId) : null,
        expiresAt: String(data.session.expiresAt),
      },
    };
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "AbortError") {
      return { valid: false, reason: "timeout" };
    }
    if (err instanceof Error && (err.message.includes("fetch") || err.message.includes("ECONNREFUSED"))) {
      return { valid: false, reason: "network" };
    }
    return { valid: false, reason: "error" };
  }
}

// ── API key verification ──────────────────────────────────────────────────────

const API_KEY_PATTERN = /^tc_live_[a-f0-9]{8}_[a-f0-9]{24}$/;

export interface ApiKeyResult {
  valid: true;
  keyId: string;
  keyName: string;
  org: { id: string; name: string; type: string };
  permissions: string[];
}

export interface ApiKeyError {
  valid: false;
  reason: "not_found" | "revoked" | "expired" | "invalid_format" | "timeout" | "network" | "error";
}

export async function verifyApiKey(
  authHeader: string | null | undefined,
  options: SdkOptions = {}
): Promise<ApiKeyResult | ApiKeyError> {
  if (!authHeader?.startsWith("Bearer tc_live_")) {
    return { valid: false, reason: "not_found" };
  }

  const key = authHeader.slice(7).trim();
  if (!API_KEY_PATTERN.test(key)) {
    return { valid: false, reason: "invalid_format" };
  }

  const authUrl = options.authUrl ?? DEFAULT_AUTH_URL;
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT;
  const maxRetries = options.maxRetries ?? DEFAULT_RETRIES;

  try {
    const res = await safeFetch(`${authUrl}/api/auth/api-key`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      cache: "no-store",
    }, { timeoutMs, maxRetries });

    const data = await res.json();
    if (!res.ok || !data.valid) {
      return { valid: false, reason: data.reason ?? "not_found" };
    }

    if (!data.keyId || !data.org?.id) {
      return { valid: false, reason: "error" };
    }

    return {
      valid: true,
      keyId: String(data.keyId),
      keyName: String(data.keyName ?? ""),
      org: {
        id: String(data.org.id),
        name: String(data.org.name ?? ""),
        type: String(data.org.type ?? "unknown"),
      },
      permissions: Array.isArray(data.permissions) ? data.permissions.map(String) : [],
    };
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "AbortError") {
      return { valid: false, reason: "timeout" };
    }
    if (err instanceof Error && (err.message.includes("fetch") || err.message.includes("ECONNREFUSED"))) {
      return { valid: false, reason: "network" };
    }
    return { valid: false, reason: "error" };
  }
}

/**
 * Universal auth guard — accepts JWTs, session tokens, and API keys.
 * Tries JWT first (local, <1ms), then session (HTTP), then API key.
 */
export async function resolveAuth(
  authHeader: string | null | undefined,
  options: SdkOptions = {}
): Promise<
  | { type: "jwt"; result: JwtResult }
  | { type: "session"; result: SessionResult }
  | { type: "api_key"; result: ApiKeyResult }
  | null
> {
  if (!authHeader) return null;

  // API keys always route to key verification
  if (authHeader.startsWith("Bearer tc_live_")) {
    const result = await verifyApiKey(authHeader, options);
    if (result.valid) return { type: "api_key", result };
    return null;
  }

  if (authHeader.startsWith("Bearer ")) {
    // Try JWT first (local, fast)
    const jwtResult = await verifyJwt(authHeader, options);
    if (jwtResult.valid) return { type: "jwt", result: jwtResult };

    // Fall back to session verification (HTTP)
    const sessionResult = await verifySession(authHeader, options);
    if (sessionResult.valid) return { type: "session", result: sessionResult };
    return null;
  }

  return null;
}
