import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { inviteCode, member } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { randomBytes } from "crypto";
import { writeAudit } from "@/lib/audit";
import { ORG_ADMIN_ROLES, VALID_ORG_ROLES } from "@/lib/auth/constants";

async function checkOrgAdmin(orgId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return null;

  const u = session.user as typeof session.user & { role?: string };
  if (u.role === "super_admin") return session;

  const membership = await db
    .select({ role: member.role })
    .from(member)
    .where(and(eq(member.userId, session.user.id), eq(member.organizationId, orgId)))
    .limit(1);

  if (!membership.length || !ORG_ADMIN_ROLES.has(membership[0].role)) return null;
  return session;
}

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  const bytes = randomBytes(8);
  for (let i = 0; i < 8; i++) {
    code += chars[bytes[i] % chars.length];
  }
  return code;
}

// GET /api/org/[orgId]/invite-codes
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  const { orgId } = await params;
  const session = await checkOrgAdmin(orgId);
  if (!session) {
    return NextResponse.json({ code: "FORBIDDEN", message: "Forbidden" }, { status: 403 });
  }

  const codes = await db
    .select()
    .from(inviteCode)
    .where(eq(inviteCode.orgId, orgId))
    .orderBy(inviteCode.createdAt);

  writeAudit(req, {
    actorId: session.user.id,
    actorEmail: session.user.email,
    orgId,
    action: "invite_code.listed",
    targetType: "invite_code",
  });

  return NextResponse.json(codes);
}

// POST /api/org/[orgId]/invite-codes
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  const { orgId } = await params;
  const session = await checkOrgAdmin(orgId);
  if (!session) {
    return NextResponse.json({ code: "FORBIDDEN", message: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();

  // ── Input validation ────────────────────────────────────────────────
  const role = (body.role || "member").trim();
  if (!VALID_ORG_ROLES.has(role)) {
    return NextResponse.json({ code: "INVALID_ROLE", message: `Invalid role "${role}"` }, { status: 400 });
  }

  const maxUses = body.maxUses ? parseInt(body.maxUses, 10) : null;
  if (maxUses !== null && (!Number.isFinite(maxUses) || maxUses < 1 || maxUses > 10000)) {
    return NextResponse.json({ code: "INVALID_MAX_USES", message: "maxUses must be 1–10000" }, { status: 400 });
  }

  const expiresInDays = body.expiresInDays ? parseInt(body.expiresInDays, 10) : null;
  if (expiresInDays !== null && (!Number.isFinite(expiresInDays) || expiresInDays < 1 || expiresInDays > 365)) {
    return NextResponse.json({ code: "INVALID_EXPIRY", message: "expiresInDays must be 1–365" }, { status: 400 });
  }

  const customCode = body.code?.trim().toUpperCase();
  if (customCode && (customCode.length < 4 || customCode.length > 20 || !/^[A-Z0-9-]+$/.test(customCode))) {
    return NextResponse.json({ code: "INVALID_CODE", message: "Custom code must be 4–20 chars, alphanumeric or hyphens" }, { status: 400 });
  }

  const code = customCode || generateCode();

  // Check uniqueness
  const existing = await db.select({ id: inviteCode.id }).from(inviteCode).where(eq(inviteCode.code, code)).limit(1);
  if (existing.length) {
    return NextResponse.json({ code: "CODE_EXISTS", message: "Code already exists" }, { status: 409 });
  }

  // Limit: max 50 active codes per org
  const activeCodes = await db
    .select({ id: inviteCode.id })
    .from(inviteCode)
    .where(and(eq(inviteCode.orgId, orgId)));
  if (activeCodes.length >= 50) {
    return NextResponse.json({ code: "LIMIT_REACHED", message: "Maximum 50 invite codes per organization" }, { status: 429 });
  }

  const id = randomBytes(12).toString("hex");
  const now = new Date();
  const expiresAt = expiresInDays ? new Date(now.getTime() + expiresInDays * 86400_000) : null;

  await db.insert(inviteCode).values({
    id, orgId, createdById: session.user.id,
    code, role, maxUses, usedCount: 0, expiresAt, revokedAt: null, createdAt: now,
  });

  writeAudit(req, {
    actorId: session.user.id, actorEmail: session.user.email, orgId,
    action: "invite_code.created", targetId: id, targetType: "invite_code",
    metadata: { code, role, maxUses, expiresInDays },
  });

  return NextResponse.json({ id, code, role, maxUses, expiresAt, createdAt: now });
}

// DELETE /api/org/[orgId]/invite-codes
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  const { orgId } = await params;
  const session = await checkOrgAdmin(orgId);
  if (!session) {
    return NextResponse.json({ code: "FORBIDDEN", message: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const codeId = body.id;
  if (!codeId || typeof codeId !== "string") {
    return NextResponse.json({ code: "MISSING_ID", message: "Missing id" }, { status: 400 });
  }

  const [existing] = await db
    .select()
    .from(inviteCode)
    .where(and(eq(inviteCode.id, codeId), eq(inviteCode.orgId, orgId)))
    .limit(1);

  if (!existing) {
    return NextResponse.json({ code: "NOT_FOUND", message: "Not found" }, { status: 404 });
  }

  if (existing.revokedAt) {
    return NextResponse.json({ code: "ALREADY_REVOKED", message: "Already revoked" }, { status: 409 });
  }

  await db.update(inviteCode)
    .set({ revokedAt: new Date() })
    .where(eq(inviteCode.id, codeId));

  writeAudit(req, {
    actorId: session.user.id, actorEmail: session.user.email, orgId,
    action: "invite_code.revoked", targetId: codeId, targetType: "invite_code",
    metadata: { code: existing.code },
  });

  return NextResponse.json({ success: true });
}
