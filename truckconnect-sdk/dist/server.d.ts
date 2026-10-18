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
interface SdkOptions {
    authUrl?: string;
    timeoutMs?: number;
    maxRetries?: number;
}
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
interface JwtResult {
    valid: true;
    payload: JwtPayload;
}
interface JwtError {
    valid: false;
    reason: "unauthorized" | "expired" | "invalid" | "error";
}
/**
 * Verify a JWT token locally using JWKS — no HTTP round-trip per request.
 * Only fetches JWKS once every 5 minutes.
 *
 * Pass: Authorization: Bearer {jwt_token}
 * Get JWT via: GET /api/auth/token (with session cookie/bearer)
 */
declare function verifyJwt(authHeader: string | null | undefined, options?: SdkOptions): Promise<JwtResult | JwtError>;
interface SessionResult {
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
interface SessionError {
    valid: false;
    reason: "unauthorized" | "timeout" | "network" | "error";
}
declare function verifySession(authHeader: string | null | undefined, options?: SdkOptions): Promise<SessionResult | SessionError>;
interface ApiKeyResult {
    valid: true;
    keyId: string;
    keyName: string;
    org: {
        id: string;
        name: string;
        type: string;
    };
    permissions: string[];
}
interface ApiKeyError {
    valid: false;
    reason: "not_found" | "revoked" | "expired" | "invalid_format" | "timeout" | "network" | "error";
}
declare function verifyApiKey(authHeader: string | null | undefined, options?: SdkOptions): Promise<ApiKeyResult | ApiKeyError>;
/**
 * Universal auth guard — accepts JWTs, session tokens, and API keys.
 * Tries JWT first (local, <1ms), then session (HTTP), then API key.
 */
declare function resolveAuth(authHeader: string | null | undefined, options?: SdkOptions): Promise<{
    type: "jwt";
    result: JwtResult;
} | {
    type: "session";
    result: SessionResult;
} | {
    type: "api_key";
    result: ApiKeyResult;
} | null>;

export { type ApiKeyError, type ApiKeyResult, type JwtError, type JwtResult, type SdkOptions, type SessionError, type SessionResult, resolveAuth, verifyApiKey, verifyJwt, verifySession };
