import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { inviteCode, member, organization } from "@/lib/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { randomBytes } from "crypto";
import { writeAudit } from "@/lib/audit";

// POST /api/invite-code/join — redeem an invite code
export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const code = body.code?.trim().toUpperCase();
  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  // Look up the code
  const [entry] = await db
    .select()
    .from(inviteCode)
    .where(eq(inviteCode.code, code))
    .limit(1);

  if (!entry) {
    return NextResponse.json({ error: "Invalid invite code" }, { status: 404 });
  }

  // Check revoked
  if (entry.revokedAt) {
    return NextResponse.json({ error: "This invite code has been revoked" }, { status: 410 });
  }

  // Check expired
  if (entry.expiresAt && entry.expiresAt < new Date()) {
    return NextResponse.json({ error: "This invite code has expired" }, { status: 410 });
  }

  // Check max uses
  if (entry.maxUses !== null && entry.usedCount >= entry.maxUses) {
    return NextResponse.json({ error: "This invite code has reached its usage limit" }, { status: 410 });
  }

  // Check if user is already a member
  const existing = await db
    .select({ id: member.id })
    .from(member)
    .where(and(eq(member.userId, session.user.id), eq(member.organizationId, entry.orgId)))
    .limit(1);

  if (existing.length) {
    return NextResponse.json({ error: "You are already a member of this organization" }, { status: 409 });
  }

  // Get org info
  const [org] = await db
    .select({ name: organization.name })
    .from(organization)
    .where(eq(organization.id, entry.orgId))
    .limit(1);

  // Atomic increment — prevents race condition where two users redeem past maxUses
  // Note: Neon HTTP driver doesn't support transactions, so we use atomic SQL instead
  const updateResult = await db.update(inviteCode)
    .set({ usedCount: sql`${inviteCode.usedCount} + 1` })
    .where(
      entry.maxUses !== null
        ? and(eq(inviteCode.id, entry.id), sql`${inviteCode.usedCount} < ${entry.maxUses}`)
        : eq(inviteCode.id, entry.id)
    )
    .returning({ newCount: inviteCode.usedCount });

  if (!updateResult.length) {
    return NextResponse.json({ code: "LIMIT_REACHED", message: "This invite code has reached its usage limit" }, { status: 410 });
  }

  // Add user as member
  const memberId = randomBytes(12).toString("hex");
  await db.insert(member).values({
    id: memberId,
    userId: session.user.id,
    organizationId: entry.orgId,
    role: entry.role,
    createdAt: new Date(),
  });

  writeAudit(req, {
    actorId: session.user.id,
    actorEmail: session.user.email,
    orgId: entry.orgId,
    action: "invite_code.redeemed",
    targetId: entry.id,
    targetType: "invite_code",
    metadata: { code, role: entry.role },
  });

  return NextResponse.json({
    success: true,
    organization: { id: entry.orgId, name: org?.name ?? "Unknown" },
    role: entry.role,
  });
}

// GET /api/invite-code/join?code=XYZ — preview code info (no auth required)
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code")?.trim().toUpperCase();
  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  const [entry] = await db
    .select({
      orgId: inviteCode.orgId,
      role: inviteCode.role,
      maxUses: inviteCode.maxUses,
      usedCount: inviteCode.usedCount,
      expiresAt: inviteCode.expiresAt,
      revokedAt: inviteCode.revokedAt,
    })
    .from(inviteCode)
    .where(eq(inviteCode.code, code))
    .limit(1);

  if (!entry) {
    return NextResponse.json({ error: "Invalid invite code" }, { status: 404 });
  }

  if (entry.revokedAt) {
    return NextResponse.json({ error: "This invite code has been revoked", valid: false }, { status: 410 });
  }
  if (entry.expiresAt && entry.expiresAt < new Date()) {
    return NextResponse.json({ error: "This invite code has expired", valid: false }, { status: 410 });
  }
  if (entry.maxUses !== null && entry.usedCount >= entry.maxUses) {
    return NextResponse.json({ error: "This invite code has reached its limit", valid: false }, { status: 410 });
  }

  // Get org name
  const [org] = await db
    .select({ name: organization.name, metadata: organization.metadata })
    .from(organization)
    .where(eq(organization.id, entry.orgId))
    .limit(1);

  return NextResponse.json({
    valid: true,
    organization: { id: entry.orgId, name: org?.name ?? "Unknown" },
    role: entry.role,
    spotsLeft: entry.maxUses ? entry.maxUses - entry.usedCount : null,
    expiresAt: entry.expiresAt,
  });
}
