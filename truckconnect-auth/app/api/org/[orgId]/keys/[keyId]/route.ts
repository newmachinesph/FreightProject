/**
 * DELETE /api/org/[orgId]/keys/[keyId]  → revoke a key (soft-delete, sets revokedAt)
 *
 * Access: same org admin roles.
 */

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { apiKey, member } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { writeAudit } from "@/lib/audit";

import { ORG_ADMIN_ROLES } from "@/lib/auth/constants";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ orgId: string; keyId: string }> }
) {
  const { orgId, keyId } = await params;

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const u = session.user as typeof session.user & { role?: string };
  const isPlatformAdmin = u.role === "super_admin";

  if (!isPlatformAdmin) {
    const [m] = await db
      .select({ role: member.role })
      .from(member)
      .where(and(eq(member.userId, session.user.id), eq(member.organizationId, orgId)))
      .limit(1);

    if (!m || !ORG_ADMIN_ROLES.has(m.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  // Verify key belongs to this org
  const [key] = await db
    .select({ id: apiKey.id, revokedAt: apiKey.revokedAt })
    .from(apiKey)
    .where(and(eq(apiKey.id, keyId), eq(apiKey.orgId, orgId)))
    .limit(1);

  if (!key) return NextResponse.json({ error: "Key not found" }, { status: 404 });
  if (key.revokedAt) return NextResponse.json({ error: "Already revoked" }, { status: 409 });

  await db
    .update(apiKey)
    .set({ revokedAt: new Date() })
    .where(eq(apiKey.id, keyId));

  writeAudit(_req, {
    actorId: session.user.id, actorEmail: session.user.email,
    orgId, action: "api_key.revoked",
    targetId: keyId, targetType: "api_key",
  });

  return NextResponse.json({ revoked: true });
}
