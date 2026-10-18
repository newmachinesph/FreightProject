/**
 * GET    /api/user/tokens  → list current user's personal access tokens
 * POST   /api/user/tokens  → create a new personal access token (plaintext returned ONCE)
 * DELETE  /api/user/tokens  → revoke a token (soft-delete, sets revokedAt)
 *
 * All endpoints require an authenticated session.
 */

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { personalToken } from "@/lib/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { createHash, randomBytes } from "crypto";
import { writeAudit } from "@/lib/audit";

async function getSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session;
}

// ── GET — list tokens ────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const tokens = await db
    .select({
      id: personalToken.id,
      name: personalToken.name,
      prefix: personalToken.prefix,
      expiresAt: personalToken.expiresAt,
      lastUsedAt: personalToken.lastUsedAt,
      revokedAt: personalToken.revokedAt,
      createdAt: personalToken.createdAt,
    })
    .from(personalToken)
    .where(eq(personalToken.userId, session.user.id))
    .orderBy(personalToken.createdAt);

  writeAudit(req, {
    actorId: session.user.id,
    actorEmail: session.user.email,
    action: "personal_token.listed",
    targetType: "personal_token",
  });

  return NextResponse.json({ tokens });
}

// ── POST — create token ──────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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

  // Enforce per-user token limit (max 20)
  const [{ count: activeCount }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(personalToken)
    .where(and(eq(personalToken.userId, session.user.id), sql`${personalToken.revokedAt} IS NULL`));

  if (activeCount >= 20) {
    return NextResponse.json({ error: "Maximum 20 active tokens per user" }, { status: 400 });
  }

  // Generate:  tc_pat_{8 hex}_{24 hex}
  const part1 = randomBytes(4).toString("hex");   // 8 hex chars
  const part2 = randomBytes(12).toString("hex");  // 24 hex chars
  const plaintext = `tc_pat_${part1}_${part2}`;
  const tokenHash = createHash("sha256").update(plaintext).digest("hex");
  const prefix    = plaintext.slice(0, 16) + "…";  // "tc_pat_a1b2c3d4…"

  const id = randomBytes(12).toString("hex");
  const now = new Date();
  const expiresAt = body.expiresInDays
    ? new Date(now.getTime() + body.expiresInDays * 86_400_000)
    : null;

  await db.insert(personalToken).values({
    id,
    userId: session.user.id,
    name,
    tokenHash,
    prefix,
    expiresAt,
    createdAt: now,
  });

  writeAudit(req, {
    actorId: session.user.id,
    actorEmail: session.user.email,
    action: "personal_token.created",
    targetId: id,
    targetType: "personal_token",
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

// ── DELETE — revoke token ────────────────────────────────────────────────────

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { tokenId?: string } = {};
  try { body = await req.json(); } catch { /* no body */ }

  const tokenId = (body.tokenId ?? "").trim();
  if (!tokenId) {
    return NextResponse.json({ error: "tokenId is required" }, { status: 400 });
  }

  // Verify token belongs to this user
  const [token] = await db
    .select({ id: personalToken.id, revokedAt: personalToken.revokedAt })
    .from(personalToken)
    .where(and(eq(personalToken.id, tokenId), eq(personalToken.userId, session.user.id)))
    .limit(1);

  if (!token) return NextResponse.json({ error: "Token not found" }, { status: 404 });
  if (token.revokedAt) return NextResponse.json({ error: "Already revoked" }, { status: 409 });

  await db
    .update(personalToken)
    .set({ revokedAt: new Date() })
    .where(eq(personalToken.id, tokenId));

  writeAudit(req, {
    actorId: session.user.id,
    actorEmail: session.user.email,
    action: "personal_token.revoked",
    targetId: tokenId,
    targetType: "personal_token",
  });

  return NextResponse.json({ revoked: true });
}
