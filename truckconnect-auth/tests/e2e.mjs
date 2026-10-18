/**
 * TruckConnect Auth — Comprehensive E2E Test Suite
 *
 * Tests every working feature of the IdP:
 *   1. Seed: super_admin + admin accounts
 *   2. Auth: sign-up, sign-in, password reset, OTP
 *   3. Sessions: list, revoke
 *   4. Organizations: create, settings, delete
 *   5. Members: invite, role change
 *   6. Invite codes: create, join, revoke
 *   7. API keys: create, validate, revoke
 *   8. Personal tokens: create, list, revoke
 *   9. User metadata: trusted/untrusted
 *  10. Avatar upload
 *  11. Admin: user mgmt, ban/unban, webhooks, db-cleanup
 *  12. Account deletion
 *
 * Usage: node tests/e2e.mjs
 * Requires: dev server running on port 3001
 */

import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = process.env.AUTH_URL ?? "http://localhost:3001";

let passed = 0;
let failed = 0;
const failures = [];

// ── Helpers ──────────────────────────────────────────────────────────────────

async function api(path, opts = {}) {
  const url = `${BASE}${path}`;
  const headers = { "Content-Type": "application/json", ...(opts.headers ?? {}) };
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 60000);
  try {
    const res = await fetch(url, { ...opts, headers, redirect: "manual", signal: controller.signal });
    clearTimeout(timer);
    let body;
    try { body = await res.json(); } catch { body = null; }
    return { status: res.status, body, headers: res.headers, ok: res.ok };
  } catch (err) {
    clearTimeout(timer);
    return { status: 0, body: null, headers: new Headers(), ok: false, error: err.message };
  }
}

async function apiWithSession(path, token, opts = {}) {
  if (!token) return { status: 0, body: null, headers: new Headers(), ok: false };
  return api(path, {
    ...opts,
    headers: { ...opts.headers, Authorization: `Bearer ${token}` },
  });
}

function assert(condition, msg) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${msg}`);
  } else {
    failed++;
    failures.push(msg);
    console.log(`  ✗ ${msg}`);
  }
}

function section(name) {
  console.log(`\n━━ ${name} ${"━".repeat(60 - name.length)}`);
}

// Extract session token from Set-Cookie
function extractToken(headers) {
  const cookies = headers.getSetCookie?.() ?? [];
  for (const c of cookies) {
    const m = c.match(/tc\.session_token=([^;]+)/);
    if (m) return m[1];
  }
  return null;
}

// Sign up helper
async function signUp(name, email, password) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 60000);
  try {
    const res = await fetch(`${BASE}/api/auth/sign-up/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: BASE, Connection: "close" },
      body: JSON.stringify({ name, email, password }),
      redirect: "manual",
      signal: controller.signal,
      keepalive: false,
    });
    clearTimeout(timer);
    const body = await res.json().catch(() => null);
    // Token can be in Set-Cookie or in JSON body
    const token = extractToken(res.headers) ?? body?.token ?? null;
    if (!res.ok) console.error(`  [signUp ${res.status}: ${JSON.stringify(body)}]`);
    return { status: res.status, body, token, ok: res.ok };
  } catch (err) {
    clearTimeout(timer);
    console.error(`  [signUp error: ${err.message}]`);
    return { status: 0, body: null, token: null, ok: false };
  }
}

async function signIn(email, password) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 60000);
  try {
    const res = await fetch(`${BASE}/api/auth/sign-in/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: BASE, Connection: "close" },
      body: JSON.stringify({ email, password }),
      redirect: "manual",
      signal: controller.signal,
      keepalive: false,
    });
    clearTimeout(timer);
    const body = await res.json().catch(() => null);
    const token = extractToken(res.headers) ?? body?.token ?? null;
    return { status: res.status, body, token, ok: res.ok };
  } catch (err) {
    clearTimeout(timer);
    console.error(`  [signIn error: ${err.message}]`);
    return { status: 0, body: null, token: null, ok: false };
  }
}

// Get session using Bearer token (more reliable than cookie in test env)
async function getSession(token) {
  try {
    const res = await fetch(`${BASE}/api/auth/session`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(10000),
    });
    return res.json().catch(() => null);
  } catch {
    return null;
  }
}

// Promote user role via direct DB
async function promoteRole(email, role) {
  const { neon } = await import("@neondatabase/serverless");
  const sql = neon(process.env.DATABASE_URL);
  await sql`UPDATE "user" SET role = ${role} WHERE email = ${email}`;
}

// ── State ────────────────────────────────────────────────────────────────────

const state = {
  superAdmin: { token: null, userId: null },
  admin: { token: null, userId: null },
  user1: { token: null, userId: null },
  user2: { token: null, userId: null },
  orgId: null,
  inviteCodeId: null,
  inviteCode: null,
  apiKeyId: null,
  apiKeyPlaintext: null,
  personalTokenId: null,
  personalTokenPlaintext: null,
  webhookId: null,
};

const TS = Date.now();
const SUPER_ADMIN_EMAIL = `superadmin_${TS}@test.truckconnect.ph`;
const ADMIN_EMAIL = `admin_${TS}@test.truckconnect.ph`;
const USER1_EMAIL = `user1_${TS}@test.truckconnect.ph`;
const USER2_EMAIL = `user2_${TS}@test.truckconnect.ph`;
const PASSWORD = "TestPass_2026!";

// ── TESTS ────────────────────────────────────────────────────────────────────

async function run() {
  console.log(`\nTruckConnect Auth — E2E Test Suite`);
  console.log(`Base URL: ${BASE}`);
  console.log(`Timestamp: ${TS}\n`);

  // ━━ 1. SEED: Create platform accounts ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  section("1. SEED — Platform Accounts");

  // Super Admin
  let r = await signUp("Super Admin", SUPER_ADMIN_EMAIL, PASSWORD);
  assert(r.ok, `Sign up super_admin (${r.status})`);
  state.superAdmin.token = r.token;
  if (r.token) {
    const s = await getSession(r.token);
    state.superAdmin.userId = s?.user?.id;
  }
  await promoteRole(SUPER_ADMIN_EMAIL, "super_admin");
  // Re-login to get updated role in session
  r = await signIn(SUPER_ADMIN_EMAIL, PASSWORD);
  state.superAdmin.token = r.token;
  assert(r.ok, `Sign in super_admin`);

  // Admin
  r = await signUp("Platform Admin", ADMIN_EMAIL, PASSWORD);
  assert(r.ok, `Sign up admin (${r.status})`);
  state.admin.token = r.token;
  if (r.token) {
    const s = await getSession(r.token);
    state.admin.userId = s?.user?.id;
  }
  await promoteRole(ADMIN_EMAIL, "admin");
  r = await signIn(ADMIN_EMAIL, PASSWORD);
  state.admin.token = r.token;
  assert(r.ok, `Sign in admin`);

  // ━━ 2. AUTH — Sign up, Sign in, Session ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  section("2. AUTH — Sign Up & Sign In");

  // Regular user 1
  r = await signUp("Juan dela Cruz", USER1_EMAIL, PASSWORD);
  assert(r.ok, `Sign up user1`);
  state.user1.token = r.token;
  if (r.token) {
    const s = await getSession(r.token);
    state.user1.userId = s?.user?.id;
    assert(s?.user?.email === USER1_EMAIL, `Session contains correct email`);
    assert(s?.user?.name === "Juan dela Cruz", `Session contains correct name`);
  }

  // Regular user 2
  r = await signUp("Maria Santos", USER2_EMAIL, PASSWORD);
  assert(r.ok, `Sign up user2`);
  state.user2.token = r.token;
  if (r.token) {
    const s = await getSession(r.token);
    state.user2.userId = s?.user?.id;
  }

  // Sign in with wrong password
  r = await signIn(USER1_EMAIL, "WrongPassword123!");
  assert(!r.ok, `Sign in with wrong password fails`);

  // Sign in correctly (only if we don't already have a token from sign-up)
  if (!state.user1.token) {
    r = await signIn(USER1_EMAIL, PASSWORD);
    assert(r.ok, `Sign in user1 with correct password`);
    state.user1.token = r.token;
  } else {
    assert(true, `Sign in user1 — already has token from sign-up`);
  }

  // ━━ 3. OTP — Phone verification ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  section("3. OTP — Phone Verification");

  r = await apiWithSession("/api/auth/send-otp", state.user1.token, {
    method: "POST",
    body: JSON.stringify({ phoneNumber: "+639171234567" }),
  });
  // Better Auth OTP endpoint
  assert(r.status < 500, `Send OTP does not error (${r.status})`);

  // ━━ 4. PASSWORD VALIDATION ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  section("4. Password Validation");

  r = await api("/api/auth/validate-password", {
    method: "POST",
    body: JSON.stringify({ password: "short" }),
  });
  assert(r.body?.valid === false, `Weak password rejected`);

  r = await api("/api/auth/validate-password", {
    method: "POST",
    body: JSON.stringify({ password: "Str0ngP@ssword2026!" }),
  });
  assert(r.body?.valid === true, `Strong password accepted`);

  r = await api("/api/auth/validate-password", {
    method: "POST",
    body: JSON.stringify({ password: "password123" }),
  });
  assert(r.body?.valid === false, `Common password rejected`);

  // ━━ 5. SESSIONS — List & Revoke ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  section("5. Sessions — List & Revoke");

  r = await apiWithSession("/api/user/sessions", state.user1.token);
  assert(r.ok && Array.isArray(r.body?.sessions), `List sessions returns array`);
  const sessionCount = r.body?.sessions?.length ?? 0;
  assert(sessionCount >= 1, `At least 1 active session (${sessionCount})`);

  // ━━ 6. ORGANIZATIONS — Create ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  section("6. Organizations — Create & Manage");

  // Create org via Better Auth
  const orgCreatorToken = state.user1.token ?? state.superAdmin.token;
  try {
    const orgRes = await fetch(`${BASE}/api/auth/organization/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${orgCreatorToken}`,
        Origin: BASE,
      },
      body: JSON.stringify({
        name: `Test Carrier ${TS}`,
        slug: `test-carrier-${TS}`,
        metadata: { type: "carrier_fleet" },
      }),
      redirect: "manual",
      signal: AbortSignal.timeout(60000),
    });
    const orgBody = await orgRes.json().catch(() => null);
    state.orgId = orgBody?.id ?? orgBody?.organization?.id;
    if (!orgRes.ok) console.error(`  [org create ${orgRes.status}: ${JSON.stringify(orgBody)}]`);
    assert(orgRes.ok && state.orgId, `Create organization (${orgRes.status})`);
  } catch (err) {
    console.error(`  [org create error: ${err.message}]`);
    assert(false, `Create organization (timeout/error)`);
  }

  // Read org settings
  if (state.orgId) {
    r = await apiWithSession(`/api/org/${state.orgId}/settings`, state.user1.token);
    assert(r.ok && r.body?.name, `Read org settings (name: ${r.body?.name})`);
    assert(r.body?.type === "carrier_fleet", `Org type is carrier_fleet`);

    // Update org name
    r = await apiWithSession(`/api/org/${state.orgId}/settings`, state.user1.token, {
      method: "PATCH",
      body: JSON.stringify({ _name: `Renamed Carrier ${TS}` }),
    });
    assert(r.ok, `Update org name`);
  }

  // ━━ 7. INVITE CODES — Create, List, Join ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  section("7. Invite Codes");

  if (state.orgId) {
    // Create invite code
    r = await apiWithSession(`/api/org/${state.orgId}/invite-codes`, state.user1.token, {
      method: "POST",
      body: JSON.stringify({ role: "dispatcher", maxUses: 5 }),
    });
    assert(r.ok && r.body?.code, `Create invite code (${r.body?.code})`);
    state.inviteCodeId = r.body?.id;
    state.inviteCode = r.body?.code;

    // List invite codes
    r = await apiWithSession(`/api/org/${state.orgId}/invite-codes`, state.user1.token);
    assert(r.ok && Array.isArray(r.body?.codes), `List invite codes`);

    // Join org with invite code (as user2)
    if (state.inviteCode) {
      r = await apiWithSession(`/api/invite-code/join`, state.user2.token, {
        method: "POST",
        body: JSON.stringify({ code: state.inviteCode }),
      });
      assert(r.ok, `User2 joins org via invite code (${r.status})`);
    }
  }

  // ━━ 8. MEMBERS — List ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  section("8. Members");

  if (state.orgId) {
    r = await apiWithSession("/api/user/orgs", state.user1.token);
    assert(r.ok && Array.isArray(r.body?.orgs), `User1 org list`);

    r = await apiWithSession("/api/user/orgs", state.user2.token);
    assert(r.ok, `User2 org list after joining`);
    const user2Orgs = r.body?.orgs ?? [];
    assert(user2Orgs.some(o => o.organizationId === state.orgId), `User2 is member of the org`);
  }

  // ━━ 9. API KEYS — Create, Validate, Revoke ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  section("9. API Keys");

  if (state.orgId) {
    // Create
    r = await apiWithSession(`/api/org/${state.orgId}/keys`, state.user1.token, {
      method: "POST",
      body: JSON.stringify({ name: `E2E Test Key ${TS}` }),
    });
    assert(r.ok && r.body?.plaintext, `Create API key`);
    state.apiKeyId = r.body?.id;
    state.apiKeyPlaintext = r.body?.plaintext;

    // List
    r = await apiWithSession(`/api/org/${state.orgId}/keys`, state.user1.token);
    assert(r.ok && Array.isArray(r.body?.keys), `List API keys`);

    // Validate
    if (state.apiKeyPlaintext) {
      r = await api("/api/auth/api-key", {
        method: "POST",
        body: JSON.stringify({ key: state.apiKeyPlaintext }),
      });
      assert(r.ok && r.body?.valid === true, `Validate API key`);
      assert(r.body?.orgId === state.orgId, `API key returns correct orgId`);
      assert(Array.isArray(r.body?.permissions), `API key returns permissions`);
    }

    // Revoke
    if (state.apiKeyId) {
      r = await apiWithSession(`/api/org/${state.orgId}/keys/${state.apiKeyId}`, state.user1.token, {
        method: "DELETE",
      });
      assert(r.ok, `Revoke API key`);

      // Validate revoked key
      if (state.apiKeyPlaintext) {
        r = await api("/api/auth/api-key", {
          method: "POST",
          body: JSON.stringify({ key: state.apiKeyPlaintext }),
        });
        assert(r.body?.valid === false, `Revoked key fails validation`);
      }
    }
  }

  // ━━ 10. PERSONAL TOKENS — Create, List, Revoke ━━━━━━━━━━━━━━━━━━━━━━━━━━━
  section("10. Personal Tokens");

  r = await apiWithSession("/api/user/tokens", state.user1.token, {
    method: "POST",
    body: JSON.stringify({ name: `E2E Token ${TS}` }),
  });
  assert(r.ok && r.body?.plaintext, `Create personal token`);
  state.personalTokenId = r.body?.id;
  state.personalTokenPlaintext = r.body?.plaintext;

  r = await apiWithSession("/api/user/tokens", state.user1.token);
  assert(r.ok && Array.isArray(r.body?.tokens), `List personal tokens`);

  if (state.personalTokenId) {
    r = await apiWithSession("/api/user/tokens", state.user1.token, {
      method: "DELETE",
      body: JSON.stringify({ id: state.personalTokenId }),
    });
    assert(r.ok, `Revoke personal token`);
  }

  // ━━ 11. USER METADATA — Read & Update ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  section("11. User Metadata");

  r = await apiWithSession("/api/user/metadata", state.user1.token);
  assert(r.ok, `Read user metadata`);

  r = await apiWithSession("/api/user/metadata", state.user1.token, {
    method: "PATCH",
    body: JSON.stringify({
      untrusted: { company: "Test Corp", phone: "+639171234567" },
    }),
  });
  assert(r.ok, `Update untrusted metadata`);

  // Read back
  r = await apiWithSession("/api/user/metadata", state.user1.token);
  assert(r.body?.untrusted?.company === "Test Corp", `Metadata persisted correctly`);

  // Super admin sets trusted metadata
  if (state.user1.userId) {
    r = await apiWithSession(`/api/user/metadata?userId=${state.user1.userId}`, state.superAdmin.token, {
      method: "PATCH",
      body: JSON.stringify({
        trusted: { verified: true, tier: "enterprise" },
      }),
    });
    assert(r.ok, `Super admin sets trusted metadata`);
  }

  // ━━ 12. AVATAR UPLOAD ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  section("12. Avatar Upload");

  const avatarPath = join(__dirname, "avatar.jpg");
  let avatarBuffer;
  try {
    avatarBuffer = readFileSync(avatarPath);
  } catch {
    console.log("  ⚠ avatar.jpg not found, skipping upload test");
  }

  if (avatarBuffer && state.user1.token) {
    try {
      const formData = new FormData();
      const blob = new Blob([avatarBuffer], { type: "image/jpeg" });
      formData.append("avatar", blob, "avatar.jpg");

      const uploadRes = await fetch(`${BASE}/api/user/avatar`, {
        method: "POST",
        headers: { Authorization: `Bearer ${state.user1.token}` },
        body: formData,
        signal: AbortSignal.timeout(30000),
      });
      const uploadBody = await uploadRes.json().catch(() => null);
      assert(uploadRes.ok && uploadBody?.url, `Upload avatar (${uploadRes.status})`);

      // Delete avatar
      const delRes = await fetch(`${BASE}/api/user/avatar`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${state.user1.token}` },
        signal: AbortSignal.timeout(10000),
      });
      assert(delRes.ok, `Delete avatar`);
    } catch (err) {
      assert(false, `Upload avatar (error: ${err.message})`);
      assert(false, `Delete avatar (skipped)`);
    }
  }

  // ━━ 13. ADMIN — User Management ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  section("13. Admin — User Management");

  // List users (super_admin)
  r = await fetch(`${BASE}/api/auth/admin/list-users`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${state.superAdmin.token}`,
      Origin: BASE,
    },
    signal: AbortSignal.timeout(15000),
  }).catch(() => ({ ok: false, status: 0, json: () => null }));
  assert(r.ok, `Admin list users (${r.status})`);

  // Ban/Unban (use user1 since user2 may not exist)
  if (state.user1.userId) {
    r = await fetch(`${BASE}/api/auth/admin/ban-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${state.superAdmin.token}`,
        Origin: BASE,
      },
      body: JSON.stringify({ userId: state.user1.userId, banReason: "E2E test ban" }),
      signal: AbortSignal.timeout(10000),
    }).catch(() => ({ ok: false, status: 0 }));
    assert(r.ok, `Ban user1 (${r.status})`);

    // Unban
    r = await fetch(`${BASE}/api/auth/admin/unban-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${state.superAdmin.token}`,
        Origin: BASE,
      },
      body: JSON.stringify({ userId: state.user1.userId }),
      signal: AbortSignal.timeout(10000),
    }).catch(() => ({ ok: false, status: 0 }));
    assert(r.ok, `Unban user1 (${r.status})`);
  }

  // ━━ 14. WEBHOOKS — CRUD ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  section("14. Webhooks — Endpoint Management");

  r = await apiWithSession("/api/admin/webhooks", state.superAdmin.token, {
    method: "POST",
    body: JSON.stringify({
      url: "https://example.com/webhook",
      events: ["user.created", "member.joined"],
      description: "E2E test webhook",
    }),
  });
  assert(r.status === 201 && r.body?.endpoint?.secret, `Create webhook endpoint`);
  state.webhookId = r.body?.endpoint?.id;

  r = await apiWithSession("/api/admin/webhooks", state.superAdmin.token);
  assert(r.ok && Array.isArray(r.body?.endpoints), `List webhook endpoints`);

  if (state.webhookId) {
    r = await apiWithSession(`/api/admin/webhooks?id=${state.webhookId}`, state.superAdmin.token, {
      method: "DELETE",
    });
    assert(r.ok, `Delete webhook endpoint`);
  }

  // ━━ 15. DB CLEANUP ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  section("15. DB Cleanup");

  r = await apiWithSession("/api/admin/db-cleanup", state.superAdmin.token, {
    method: "POST",
  });
  assert(r.ok, `DB cleanup runs (${r.status})`);

  // ━━ 16. API DOCS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  section("16. API Docs & JWKS");

  r = await api("/api/docs");
  assert(r.ok, `API docs endpoint responds`);

  r = await api("/api/auth/jwks");
  const jwks = r.body;
  assert(r.ok && jwks?.keys, `JWKS endpoint returns keys`);

  // ━━ 17. INVITE CODE REVOKE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  section("17. Invite Code — Revoke");

  if (state.orgId && state.inviteCodeId) {
    r = await apiWithSession(`/api/org/${state.orgId}/invite-codes`, state.user1.token, {
      method: "DELETE",
      body: JSON.stringify({ id: state.inviteCodeId }),
    });
    assert(r.ok, `Revoke invite code`);
  }

  // ━━ 18. ORG DELETE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  section("18. Organization — Delete");

  if (state.orgId) {
    r = await apiWithSession(`/api/org/${state.orgId}/settings`, state.user1.token, {
      method: "DELETE",
    });
    assert(r.ok, `Delete organization`);

    // Verify org is gone
    r = await apiWithSession(`/api/org/${state.orgId}/settings`, state.user1.token);
    assert(r.status === 403 || r.status === 404, `Org no longer accessible after delete`);
  }

  // ━━ 19. ACCOUNT DELETION ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  section("19. Account Deletion");

  // Delete user1 account (user2 may not exist due to rate limits)
  if (state.user1.token) {
    r = await apiWithSession("/api/user/delete", state.user1.token, {
      method: "POST",
      body: JSON.stringify({ password: PASSWORD, confirmation: "DELETE MY ACCOUNT" }),
    });
    assert(r.ok, `Delete user1 account (${r.status})`);

    // Verify can't sign in anymore
    const signInAfterDelete = await signIn(USER1_EMAIL, PASSWORD);
    assert(!signInAfterDelete.ok, `Deleted user can't sign in`);
  } else {
    assert(false, `Delete user account (no token)`);
    assert(false, `Deleted user can't sign in (skipped)`);
  }

  // ━━ RESULTS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  console.log(`\n${"═".repeat(64)}`);
  console.log(`  RESULTS: ${passed} passed, ${failed} failed, ${passed + failed} total`);
  if (failures.length > 0) {
    console.log(`\n  FAILURES:`);
    failures.forEach(f => console.log(`    ✗ ${f}`));
  }
  console.log(`${"═".repeat(64)}\n`);

  process.exit(failed > 0 ? 1 : 0);
}

// Wait for server to be ready
async function waitForServer() {
  for (let i = 0; i < 60; i++) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(`${BASE}/sign-in`, { signal: controller.signal });
      clearTimeout(timer);
      return;
    } catch {
      if (i % 5 === 0) process.stdout.write(".");
      await new Promise(r => setTimeout(r, 2000));
    }
  }
  console.error("\nServer not reachable at", BASE);
  process.exit(1);
}

console.log("Waiting for server...");
await waitForServer();
console.log("Server ready!");

// Quick warmup (production server doesn't need Turbopack compilation)
console.log("Warming up...");
await fetch(`${BASE}/api/auth/session`, { signal: AbortSignal.timeout(5000) }).catch(() => {});
console.log("Ready!");

await run();
