/**
 * GET  /api/user/metadata               → { trustedMetadata, untrustedMetadata }
 * PATCH /api/user/metadata              → update metadata fields
 *
 * Stytch-style split:
 *   trusted_metadata   — only writable by super_admin (server-to-server)
 *   untrusted_metadata — writable by the user themselves
 *
 * Body (PATCH): { trusted?: object, untrusted?: object }
 * Merges top-level keys (send null to delete a key).
 *
 * Target user:
 *   - Default: the caller's own account
 *   - super_admin can pass ?userId=xxx to update any user
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { user as userTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { writeAudit } from "@/lib/audit";

async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

const MAX_METADATA_SIZE = 65_536; // 64 KB per metadata field
const MAX_DEPTH = 4;
const FORBIDDEN_KEYS = new Set(["__proto__", "constructor", "prototype"]);

/** Recursively strip dangerous keys from any depth */
function sanitizeObject(obj: unknown, depth = 0): unknown {
  if (depth > MAX_DEPTH) return null;
  if (obj === null || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(v => sanitizeObject(v, depth + 1));

  const clean: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
    if (FORBIDDEN_KEYS.has(k)) continue;
    clean[k] = sanitizeObject(v, depth + 1);
  }
  return clean;
}

function mergeMetadata(
  existing: Record<string, unknown> | null,
  patch: Record<string, unknown>
): Record<string, unknown> {
  const base = existing ?? {};
  const merged = { ...base };
  const safePatch = sanitizeObject(patch) as Record<string, unknown>;
  for (const [k, v] of Object.entries(safePatch)) {
    if (v === null) {
      delete merged[k];
    } else {
      merged[k] = v;
    }
  }
  return merged;
}

function validateMetadataSize(data: Record<string, unknown>): boolean {
  return JSON.stringify(data).length <= MAX_METADATA_SIZE;
}

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const targetId = (req.nextUrl.searchParams.get("userId") ?? session.user.id);
  const role = (session.user as Record<string, unknown>)["role"];

  // Only super_admin can read other users' metadata
  if (targetId !== session.user.id && role !== "super_admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [row] = await db
    .select({ trustedMetadata: userTable.trustedMetadata, untrustedMetadata: userTable.untrustedMetadata })
    .from(userTable)
    .where(eq(userTable.id, targetId))
    .limit(1);

  if (!row) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Audit read on other users' metadata (super_admin accessing another user)
  if (targetId !== session.user.id) {
    writeAudit(req, {
      actorId: session.user.id, actorEmail: session.user.email,
      action: "metadata.read", targetId, targetType: "user",
    });
  }

  return NextResponse.json({
    trustedMetadata:   row.trustedMetadata   ?? {},
    untrustedMetadata: row.untrustedMetadata ?? {},
  });
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const role = (session.user as Record<string, unknown>)["role"];
  const targetId = req.nextUrl.searchParams.get("userId") ?? session.user.id;

  // Only super_admin can patch other users
  if (targetId !== session.user.id && role !== "super_admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: { trusted?: Record<string, unknown>; untrusted?: Record<string, unknown> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Only super_admin can write trusted_metadata
  if (body.trusted && role !== "super_admin") {
    return NextResponse.json(
      { error: "Only super_admin can write trusted_metadata" },
      { status: 403 }
    );
  }

  const [existing] = await db
    .select({ trustedMetadata: userTable.trustedMetadata, untrustedMetadata: userTable.untrustedMetadata })
    .from(userTable)
    .where(eq(userTable.id, targetId))
    .limit(1);

  if (!existing) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const updates: Partial<typeof userTable.$inferInsert> = { updatedAt: new Date() };

  if (body.trusted) {
    const merged = mergeMetadata(
      existing.trustedMetadata as Record<string, unknown> | null,
      body.trusted
    );
    if (!validateMetadataSize(merged)) {
      return NextResponse.json({ error: "trusted_metadata exceeds 64 KB limit" }, { status: 400 });
    }
    updates.trustedMetadata = merged;
  }
  if (body.untrusted) {
    const merged = mergeMetadata(
      existing.untrustedMetadata as Record<string, unknown> | null,
      body.untrusted
    );
    if (!validateMetadataSize(merged)) {
      return NextResponse.json({ error: "untrusted_metadata exceeds 64 KB limit" }, { status: 400 });
    }
    updates.untrustedMetadata = merged;
  }

  await db.update(userTable).set(updates).where(eq(userTable.id, targetId));

  // Audit only trusted_metadata writes (sensitive server-only data)
  if (body.trusted) {
    writeAudit(req, {
      actorId: session.user.id, actorEmail: session.user.email,
      action: "trusted_metadata.updated",
      targetId, targetType: "user",
      metadata: { keys: Object.keys(body.trusted) },
    });
  }

  return NextResponse.json({
    trustedMetadata:   updates.trustedMetadata   ?? existing.trustedMetadata   ?? {},
    untrustedMetadata: updates.untrustedMetadata ?? existing.untrustedMetadata ?? {},
  });
}
