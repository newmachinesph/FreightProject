/**
 * Audit log helper — immutable security event trail
 *
 * Usage:
 *   import { writeAudit } from "@/lib/audit";
 *   writeAudit(req, {
 *     actorId: session.user.id,
 *     actorEmail: session.user.email,
 *     orgId: orgId,
 *     action: "api_key.created",
 *     targetId: newKeyId,
 *     targetType: "api_key",
 *     metadata: { name: "Production ERP" },
 *   });
 *
 * Common action names:
 *   user.banned          user.unbanned       user.role_changed
 *   user.password_reset  user.signed_up      user.deleted
 *   member.invited       member.removed      member.role_changed
 *   api_key.created      api_key.revoked
 *   org.created          org.updated
 *   trusted_metadata.updated
 *   session.created      session.revoked
 */

import { db } from "@/lib/db";
import { auditLog } from "@/lib/db/schema";
import { randomBytes } from "crypto";
import { NextRequest } from "next/server";

interface AuditEntry {
  actorId?:    string | null;
  actorEmail?: string | null;
  orgId?:      string | null;
  action:      string;
  targetId?:   string | null;
  targetType?: string | null;
  metadata?:   Record<string, unknown>;
}

function truncate(val: string | null | undefined, max: number): string | null {
  if (!val) return null;
  return val.length > max ? val.slice(0, max) : val;
}

export async function writeAudit(
  req: NextRequest | null,
  entry: AuditEntry
): Promise<void> {
  try {
    await db.insert(auditLog).values({
      id:         randomBytes(12).toString("hex"),
      actorId:    truncate(entry.actorId, 64),
      actorEmail: truncate(entry.actorEmail, 255),
      orgId:      truncate(entry.orgId, 64),
      action:     truncate(entry.action, 100) ?? "unknown",
      targetId:   truncate(entry.targetId, 64),
      targetType: truncate(entry.targetType, 50),
      metadata:   entry.metadata ?? null,
      ipAddress:  truncate(
        req ? (req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? req.headers.get("x-real-ip")) : null,
        45
      ),
      userAgent:  truncate(req ? req.headers.get("user-agent") : null, 500),
      createdAt:  new Date(),
    });
  } catch (err) {
    console.error("[audit] Failed to write audit entry:", err);
  }
}
