/**
 * Database optimization utilities — cleanup and monitoring
 *
 * Usage:
 *   import { runAllCleanups, getTableStats } from "@/lib/db/optimize";
 */

import { db } from "@/lib/db";
import {
  session,
  verification,
  invitation,
  inviteCode,
  auditLog,
  webhookEvent,
  user,
  account,
  member,
  organization,
  apiKey,
  webhookEndpoint,
  jwks,
} from "./schema";
import { lt, and, eq, sql } from "drizzle-orm";

// ─── Cleanup functions ───────────────────────────────────────────────────────

/** Delete sessions where expiresAt < now() */
export async function cleanExpiredSessions(): Promise<number> {
  const result = await db
    .delete(session)
    .where(lt(session.expiresAt, new Date()))
    .returning({ id: session.id });
  return result.length;
}

/** Delete verifications where expiresAt < now() */
export async function cleanExpiredVerifications(): Promise<number> {
  const result = await db
    .delete(verification)
    .where(lt(verification.expiresAt, new Date()))
    .returning({ id: verification.id });
  return result.length;
}

/** Delete invitations where expiresAt < now() AND status = 'pending' */
export async function cleanExpiredInvitations(): Promise<number> {
  const result = await db
    .delete(invitation)
    .where(
      and(
        lt(invitation.expiresAt, new Date()),
        eq(invitation.status, "pending"),
      ),
    )
    .returning({ id: invitation.id });
  return result.length;
}

/** Delete invite codes where expiresAt < now() */
export async function cleanExpiredInviteCodes(): Promise<number> {
  const result = await db
    .delete(inviteCode)
    .where(lt(inviteCode.expiresAt, new Date()))
    .returning({ id: inviteCode.id });
  return result.length;
}

/** Delete audit logs older than N days */
export async function cleanOldAuditLogs(daysToKeep: number): Promise<number> {
  const cutoff = new Date(Date.now() - daysToKeep * 86_400_000);
  const result = await db
    .delete(auditLog)
    .where(lt(auditLog.createdAt, cutoff))
    .returning({ id: auditLog.id });
  return result.length;
}

/** Delete delivered webhook events older than N days */
export async function cleanOldWebhookEvents(daysToKeep: number): Promise<number> {
  const cutoff = new Date(Date.now() - daysToKeep * 86_400_000);
  const result = await db
    .delete(webhookEvent)
    .where(
      and(
        lt(webhookEvent.createdAt, cutoff),
        eq(webhookEvent.status, "delivered"),
      ),
    )
    .returning({ id: webhookEvent.id });
  return result.length;
}

// ─── Monitoring ──────────────────────────────────────────────────────────────

/** Return row counts for all tables (for monitoring dashboards) */
export async function getTableStats(): Promise<Record<string, number>> {
  const tables = [
    { name: "user", table: user },
    { name: "session", table: session },
    { name: "account", table: account },
    { name: "verification", table: verification },
    { name: "organization", table: organization },
    { name: "member", table: member },
    { name: "invitation", table: invitation },
    { name: "invite_code", table: inviteCode },
    { name: "audit_log", table: auditLog },
    { name: "api_key", table: apiKey },
    { name: "webhook_endpoint", table: webhookEndpoint },
    { name: "webhook_event", table: webhookEvent },
    { name: "jwks", table: jwks },
  ] as const;

  const stats: Record<string, number> = {};

  for (const { name, table } of tables) {
    const [row] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(table);
    stats[name] = row?.count ?? 0;
  }

  return stats;
}

// ─── Composite cleanup ──────────────────────────────────────────────────────

export interface CleanupResult {
  expiredSessions: number;
  expiredVerifications: number;
  expiredInvitations: number;
  expiredInviteCodes: number;
  oldAuditLogs: number;
  oldWebhookEvents: number;
}

/**
 * Run all cleanup functions with sensible defaults.
 * - 90 days retention for audit logs
 * - 30 days retention for delivered webhook events
 */
export async function runAllCleanups(): Promise<CleanupResult> {
  const [
    expiredSessions,
    expiredVerifications,
    expiredInvitations,
    expiredInviteCodes,
    oldAuditLogs,
    oldWebhookEvents,
  ] = await Promise.all([
    cleanExpiredSessions(),
    cleanExpiredVerifications(),
    cleanExpiredInvitations(),
    cleanExpiredInviteCodes(),
    cleanOldAuditLogs(90),
    cleanOldWebhookEvents(30),
  ]);

  return {
    expiredSessions,
    expiredVerifications,
    expiredInvitations,
    expiredInviteCodes,
    oldAuditLogs,
    oldWebhookEvents,
  };
}
