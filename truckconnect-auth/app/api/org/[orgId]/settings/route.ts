/**
 * GET  /api/org/[orgId]/settings — Read org settings from metadata
 * PATCH /api/org/[orgId]/settings — Merge-update org settings in metadata
 * DELETE /api/org/[orgId]/settings — Delete the organization
 *
 * Settings are stored in the organization.metadata JSON field under a "settings" key.
 * The rest of metadata (e.g. "type") is preserved.
 */

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db, runTransaction } from "@/lib/db";
import { organization, member, session as sessionTable, invitation, inviteCode, apiKey } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { ORG_ADMIN_ROLES } from "@/lib/auth/constants";
import { writeAudit } from "@/lib/audit";

async function checkOrgAdmin(orgId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  const u = session.user as typeof session.user & { role?: string };

  // super_admin can manage any org
  if (u.role === "super_admin") return session;

  const [m] = await db
    .select({ role: member.role })
    .from(member)
    .where(and(eq(member.userId, session.user.id), eq(member.organizationId, orgId)))
    .limit(1);

  if (!m || !ORG_ADMIN_ROLES.has(m.role)) return null;
  return session;
}

function parseMetadata(raw: unknown): Record<string, unknown> {
  if (!raw) return {};
  if (typeof raw === "object") return raw as Record<string, unknown>;
  try {
    return JSON.parse(raw as string);
  } catch { return {}; }
}

// ── GET — read settings ──────────────────────────────────────────────────────

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ orgId: string }> },
) {
  const { orgId } = await params;
  const session = await checkOrgAdmin(orgId);
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const [org] = await db
    .select({ name: organization.name, slug: organization.slug, orgType: organization.orgType, metadata: organization.metadata, createdAt: organization.createdAt })
    .from(organization)
    .where(eq(organization.id, orgId))
    .limit(1);

  if (!org) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const meta = parseMetadata(org.metadata);

  return NextResponse.json({
    name: org.name,
    slug: org.slug,
    createdAt: org.createdAt,
    type: org.orgType ?? (meta.type as string) ?? "unknown",
    settings: (meta.settings as Record<string, unknown>) ?? {},
  });
}

// ── PATCH — merge-update settings ────────────────────────────────────────────

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ orgId: string }> },
) {
  const { orgId } = await params;
  const session = await checkOrgAdmin(orgId);
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Read current metadata
  const [org] = await db
    .select({ metadata: organization.metadata })
    .from(organization)
    .where(eq(organization.id, orgId))
    .limit(1);

  if (!org) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const meta = parseMetadata(org.metadata);
  const currentSettings = (meta.settings as Record<string, unknown>) ?? {};

  // Merge new settings (shallow merge per top-level key)
  const newSettings = { ...currentSettings };
  for (const [key, value] of Object.entries(body)) {
    if (value === null) {
      delete newSettings[key];
    } else {
      newSettings[key] = value;
    }
  }

  // Also allow updating org name
  const updateFields: Record<string, unknown> = {};
  if (body._name && typeof body._name === "string" && body._name.trim()) {
    updateFields.name = body._name.trim();
    delete newSettings._name;
  }

  // Persist
  meta.settings = newSettings;
  await db
    .update(organization)
    .set({ ...updateFields, metadata: meta })
    .where(eq(organization.id, orgId));

  writeAudit(req, {
    actorId: session.user.id,
    actorEmail: session.user.email,
    orgId,
    action: "org.settings_updated",
    targetId: orgId,
    targetType: "organization",
    metadata: { keys: Object.keys(body) },
  });

  return NextResponse.json({ success: true, settings: newSettings });
}

// ── DELETE — delete organization ─────────────────────────────────────────────

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ orgId: string }> },
) {
  const { orgId } = await params;
  const session = await checkOrgAdmin(orgId);
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  // Verify the user is the owner
  const [m] = await db
    .select({ role: member.role })
    .from(member)
    .where(and(eq(member.userId, session.user.id), eq(member.organizationId, orgId)))
    .limit(1);

  const u = session.user as typeof session.user & { role?: string };
  if (m?.role !== "owner" && u.role !== "super_admin") {
    return NextResponse.json({ error: "Only the owner or super_admin can delete an organization" }, { status: 403 });
  }

  try {
    await runTransaction(async (tx) => {
      await tx.delete(apiKey).where(eq(apiKey.orgId, orgId));
      await tx.delete(inviteCode).where(eq(inviteCode.orgId, orgId));
      await tx.delete(invitation).where(eq(invitation.organizationId, orgId));
      await tx.update(sessionTable).set({ activeOrganizationId: null }).where(eq(sessionTable.activeOrganizationId, orgId));
      await tx.delete(member).where(eq(member.organizationId, orgId));
      await tx.delete(organization).where(eq(organization.id, orgId));
    });
  } catch (err) {
    console.error("[org/settings] Deletion failed:", err);
    return NextResponse.json({ error: "Deletion failed" }, { status: 500 });
  }

  writeAudit(req, {
    actorId: session.user.id,
    actorEmail: session.user.email,
    orgId,
    action: "org.deleted",
    targetId: orgId,
    targetType: "organization",
  });

  return NextResponse.json({ success: true });
}
