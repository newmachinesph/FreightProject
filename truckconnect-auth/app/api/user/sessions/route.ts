/**
 * GET    /api/user/sessions     → list all active sessions for current user
 * DELETE /api/user/sessions     → revoke a specific session by token
 *
 * Users can see their active sessions (device, IP, last active)
 * and revoke any session except the current one.
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { session as sessionTable } from "@/lib/db/schema";
import { eq, and, ne } from "drizzle-orm";
import { headers } from "next/headers";
import { writeAudit } from "@/lib/audit";

async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

function parseUA(ua: string | null): string {
  if (!ua) return "Unknown device";
  if (ua.includes("iPhone") || ua.includes("iPad")) return "iOS";
  if (ua.includes("Android")) return "Android";
  if (ua.includes("Windows")) return "Windows";
  if (ua.includes("Mac")) return "macOS";
  if (ua.includes("Linux")) return "Linux";
  if (ua.includes("python") || ua.includes("curl") || ua.includes("node")) return "API / Script";
  return "Browser";
}

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const sessions = await db
    .select({
      id: sessionTable.id,
      token: sessionTable.token,
      ipAddress: sessionTable.ipAddress,
      userAgent: sessionTable.userAgent,
      createdAt: sessionTable.createdAt,
      updatedAt: sessionTable.updatedAt,
      expiresAt: sessionTable.expiresAt,
    })
    .from(sessionTable)
    .where(eq(sessionTable.userId, session.user.id))
    .orderBy(sessionTable.updatedAt);

  const now = new Date();
  const activeSessions = sessions
    .filter(s => new Date(s.expiresAt) > now)
    .map(s => ({
      id: s.id,
      current: s.id === session.session.id,
      device: parseUA(s.userAgent),
      ipAddress: s.ipAddress ?? "Unknown",
      lastActive: s.updatedAt,
      createdAt: s.createdAt,
      expiresAt: s.expiresAt,
    }));

  return NextResponse.json({ sessions: activeSessions });
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { sessionId?: string } = {};
  try { body = await req.json(); } catch {}

  if (!body.sessionId) {
    return NextResponse.json({ error: "sessionId is required" }, { status: 400 });
  }

  // Cannot revoke current session via this endpoint (use sign-out)
  if (body.sessionId === session.session.id) {
    return NextResponse.json({ error: "Cannot revoke current session. Use sign-out instead." }, { status: 400 });
  }

  // Verify session belongs to this user
  const [target] = await db
    .select({ id: sessionTable.id })
    .from(sessionTable)
    .where(and(
      eq(sessionTable.id, body.sessionId),
      eq(sessionTable.userId, session.user.id)
    ))
    .limit(1);

  if (!target) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  await db.delete(sessionTable).where(eq(sessionTable.id, body.sessionId));

  writeAudit(req, {
    actorId: session.user.id,
    actorEmail: session.user.email,
    action: "session.revoked",
    targetId: body.sessionId,
    targetType: "session",
  });

  return NextResponse.json({ revoked: true });
}
