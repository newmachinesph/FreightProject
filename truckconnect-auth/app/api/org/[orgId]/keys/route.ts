/**
 * GET  /api/org/[orgId]/keys  → list org's API keys (no plaintext, prefix only)
 * POST /api/org/[orgId]/keys  → create new key (returns plaintext ONCE, then only hash)
 *
 * Access: org admin roles only
 *   owner | admin | enterprise_admin | carrier_owner | shipper_admin | forwarder_admin
 *   Platform super_admin always allowed.
 */

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { apiKey, member } from "@/lib/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { createHash, randomBytes } from "crypto";
import { writeAudit } from "@/lib/audit";
import { organization } from "@/lib/db/schema";

import { ORG_ADMIN_ROLES } from "@/lib/auth/constants";

async function assertOrgAdmin(orgId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  const u = session.user as typeof session.user & { role?: string };
  if (u.role === "super_admin") return session;

  const [m] = await db
    .select({ role: member.role })
    .from(member)
    .where(and(eq(member.userId, session.user.id), eq(member.organizationId, orgId)))
    .limit(1);

  if (!m || !ORG_ADMIN_ROLES.has(m.role)) return null;
  return session;
}

// ── GET — list keys ───────────────────────────────────────────────────────────

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  const { orgId } = await params;
  const session = await assertOrgAdmin(orgId);
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const keys = await db
    .select({
      id: apiKey.id,
      name: apiKey.name,
      prefix: apiKey.prefix,
      expiresAt: apiKey.expiresAt,
      lastUsedAt: apiKey.lastUsedAt,
      revokedAt: apiKey.revokedAt,
      createdAt: apiKey.createdAt,
    })
    .from(apiKey)
    .where(eq(apiKey.orgId, orgId))
    .orderBy(apiKey.createdAt);

  writeAudit(req, {
    actorId: session.user.id, actorEmail: session.user.email,
    orgId, action: "api_key.listed", targetType: "api_key",
  });

  return NextResponse.json({ keys });
}

// ── POST — create key ─────────────────────────────────────────────────────────

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  const { orgId } = await params;
  const session = await assertOrgAdmin(orgId);
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  let body: { name?: string; expiresInDays?: number } = {};
  try { body = await req.json(); } catch { /* no body */ }

  const name = (body.name ?? "").trim();
  if (!name || name.length > 255) {
    return NextResponse.json({ error: "name must be 1–255 characters" }, { status: 400 });
  }

  // Validate expiry bounds
  if (body.expiresInDays !== undefined) {
    if (!Number.isInteger(body.expiresInDays) || body.expiresInDays < 1 || body.expiresInDays > 3650) {
      return NextResponse.json({ error: "expiresInDays must be 1–3650" }, { status: 400 });
    }
  }

  // Enforce per-org key limit (max 50 active keys)
  const [{ count: activeCount }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(apiKey)
    .where(and(eq(apiKey.orgId, orgId), sql`${apiKey.revokedAt} IS NULL`));

  if (activeCount >= 50) {
    return NextResponse.json({ error: "Maximum 50 active keys per organization" }, { status: 400 });
  }

  // Generate:  tc_live_{8 hex}_{24 hex}
  const part1 = randomBytes(4).toString("hex");   // 8 hex chars
  const part2 = randomBytes(12).toString("hex");  // 24 hex chars
  const plaintext = `tc_live_${part1}_${part2}`;
  const keyHash  = createHash("sha256").update(plaintext).digest("hex");
  const prefix   = plaintext.slice(0, 18) + "…";  // "tc_live_a1b2c3d4…"

  const id = randomBytes(12).toString("hex");
  const now = new Date();
  const expiresAt = body.expiresInDays
    ? new Date(now.getTime() + body.expiresInDays * 86_400_000)
    : null;

  await db.insert(apiKey).values({
    id,
    orgId,
    createdById: session.user.id,
    name,
    keyHash,
    prefix,
    expiresAt,
    createdAt: now,
  });

  writeAudit(req, {
    actorId: session.user.id, actorEmail: session.user.email,
    orgId, action: "api_key.created",
    targetId: id, targetType: "api_key",
    metadata: { name, expiresAt },
  });

  // Return plaintext ONCE — caller must save it
  return NextResponse.json({
    id,
    name,
    prefix,
    plaintext,          // shown only here, never stored
    expiresAt,
    createdAt: now,
  }, { status: 201 });
}
