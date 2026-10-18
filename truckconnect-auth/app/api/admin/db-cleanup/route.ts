/**
 * POST /api/admin/db-cleanup — Run all database cleanup tasks
 * GET  /api/admin/db-cleanup — Return table row counts for monitoring
 *
 * Access: admin or super_admin role only
 */

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { runAllCleanups, getTableStats } from "@/lib/db/optimize";
import { writeAudit } from "@/lib/audit";

const ALLOWED_ROLES = new Set(["admin", "super_admin"]);

async function assertAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  const u = session.user as typeof session.user & { role?: string };
  if (!u.role || !ALLOWED_ROLES.has(u.role)) return null;

  return session;
}

// ── POST — run all cleanups ─────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const session = await assertAdmin();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const result = await runAllCleanups();

    const totalDeleted =
      result.expiredSessions +
      result.expiredVerifications +
      result.expiredInvitations +
      result.expiredInviteCodes +
      result.oldAuditLogs +
      result.oldWebhookEvents;

    writeAudit(req, {
      actorId: session.user.id,
      actorEmail: session.user.email,
      action: "db_cleanup.executed",
      targetType: "system",
      metadata: { ...result, totalDeleted },
    });

    return NextResponse.json({
      success: true,
      deleted: result,
      totalDeleted,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Cleanup failed" },
      { status: 500 },
    );
  }
}

// ── GET — table stats for monitoring ────────────────────────────────────────

export async function GET() {
  const session = await assertAdmin();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const stats = await getTableStats();
    return NextResponse.json({ stats });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 },
    );
  }
}
