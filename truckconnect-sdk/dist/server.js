"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/server.ts
var server_exports = {};
__export(server_exports, {
  resolveAuth: () => resolveAuth,
  verifyApiKey: () => verifyApiKey,
  verifyJwt: () => verifyJwt,
  verifySession: () => verifySession
});
module.exports = __toCommonJS(server_exports);
var DEFAULT_AUTH_URL = process.env.TRUCKCONNECT_AUTH_URL ?? process.env.NEXT_PUBLIC_AUTH_URL ?? "http://localhost:3001";
var DEFAULT_TIMEOUT = 8e3;
var DEFAULT_RETRIES = 3;
var RETRY_BASE_MS = 150;
async function safeFetch(url, init, opts) {
  let lastError = null;
  for (let attempt = 0; attempt < opts.maxRetries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), opts.timeoutMs);
    try {
      const res = await fetch(url, { ...init, signal: controller.signal });
      clearTimeout(timer);
      return res;
    } catch (err) {
      clearTimeout(timer);
      lastError = err instanceof Error ? err : new Error(String(err));
      if (lastError.name === "AbortError" || lastError.message.includes("fetch")) {
        if (attempt < opts.maxRetries - 1) {
          const delay = RETRY_BASE_MS * Math.pow(2, attempt);
          await new Promise((r) => setTimeout(r, delay));
          continue;
        }
      }
      break;
    }
  }
  throw lastError ?? new Error("safeFetch: unknown failure");
}
var JWKS_CACHE_TTL = 5 * 60 * 1e3;
async function verifyJwt(authHeader, options = {}) {
  if (!authHeader?.startsWith("Bearer ")) {
    return { valid: false, reason: "unauthorized" };
  }
  const token = authHeader.slice(7).trim();
  if (!token || token.split(".").length !== 3) {
    return { valid: false, reason: "unauthorized" };
  }
  const authUrl = options.authUrl ?? DEFAULT_AUTH_URL;
  try {
    const { jwtVerify, createRemoteJWKSet } = await import("jose");
    const JWKS = createRemoteJWKSet(new URL(`${authUrl}/api/auth/jwks`));
    const { payload } = await jwtVerify(token, JWKS, {
      audience: "truckconnect"
    });
    return {
      valid: true,
      payload: {
        sub: String(payload.sub ?? ""),
        email: String(payload.email ?? ""),
        name: String(payload.name ?? ""),
        role: String(payload.role ?? "user"),
        activeOrgId: payload.activeOrgId ?? null,
        aud: String(payload.aud ?? ""),
        iss: String(payload.iss ?? ""),
        exp: Number(payload.exp ?? 0),
        iat: Number(payload.iat ?? 0)
      }
    };
  } catch (err) {
    if (err instanceof Error && err.message.includes("expired")) {
      return { valid: false, reason: "expired" };
    }
    if (err instanceof Error && (err.message.includes("signature") || err.message.includes("JWS"))) {
      return { valid: false, reason: "invalid" };
    }
    return { valid: false, reason: "error" };
  }
}
async function verifySession(authHeader, options = {}) {
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
      cache: "no-store"
    }, { timeoutMs, maxRetries });
    if (!res.ok) return { valid: false, reason: "unauthorized" };
    const data = await res.json();
    if (!data?.user?.id || !data?.session?.id) {
      return { valid: false, reason: "unauthorized" };
    }
    return {
      valid: true,
      user: {
        id: String(data.user.id),
        name: String(data.user.name ?? ""),
        email: String(data.user.email ?? ""),
        image: data.user.image ? String(data.user.image) : null,
        role: String(data.user.role ?? "user")
      },
      session: {
        id: String(data.session.id),
        activeOrganizationId: data.session.activeOrganizationId ? String(data.session.activeOrganizationId) : null,
        expiresAt: String(data.session.expiresAt)
      }
    };
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      return { valid: false, reason: "timeout" };
    }
    if (err instanceof Error && (err.message.includes("fetch") || err.message.includes("ECONNREFUSED"))) {
      return { valid: false, reason: "network" };
    }
    return { valid: false, reason: "error" };
  }
}
var API_KEY_PATTERN = /^tc_live_[a-f0-9]{8}_[a-f0-9]{24}$/;
async function verifyApiKey(authHeader, options = {}) {
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
        Authorization: authHeader
      },
      cache: "no-store"
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
        type: String(data.org.type ?? "unknown")
      },
      permissions: Array.isArray(data.permissions) ? data.permissions.map(String) : []
    };
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      return { valid: false, reason: "timeout" };
    }
    if (err instanceof Error && (err.message.includes("fetch") || err.message.includes("ECONNREFUSED"))) {
      return { valid: false, reason: "network" };
    }
    return { valid: false, reason: "error" };
  }
}
async function resolveAuth(authHeader, options = {}) {
  if (!authHeader) return null;
  if (authHeader.startsWith("Bearer tc_live_")) {
    const result = await verifyApiKey(authHeader, options);
    if (result.valid) return { type: "api_key", result };
    return null;
  }
  if (authHeader.startsWith("Bearer ")) {
    const jwtResult = await verifyJwt(authHeader, options);
    if (jwtResult.valid) return { type: "jwt", result: jwtResult };
    const sessionResult = await verifySession(authHeader, options);
    if (sessionResult.valid) return { type: "session", result: sessionResult };
    return null;
  }
  return null;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  resolveAuth,
  verifyApiKey,
  verifyJwt,
  verifySession
});
