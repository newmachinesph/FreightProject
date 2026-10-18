/**
 * Webhook event dispatcher
 *
 * Fires HTTP POST requests to registered webhook endpoints when
 * auth events occur (user created, session created, org updated, etc.).
 *
 * Endpoints are stored in the `webhook_endpoint` table.
 * Each event is signed with HMAC-SHA256 for verification.
 *
 * Usage:
 *   import { dispatchWebhookEvent } from "@/lib/webhooks";
 *   dispatchWebhookEvent("user.created", { userId: "xxx", email: "..." });
 */

import { db } from "./db";
import { webhookEndpoint, webhookEvent } from "./db/schema";
import { eq, and, sql } from "drizzle-orm";
import { createHmac, randomBytes } from "crypto";

export type WebhookEventType =
  | "user.created"
  | "user.updated"
  | "user.banned"
  | "user.unbanned"
  | "session.created"
  | "session.revoked"
  | "organization.created"
  | "organization.updated"
  | "member.invited"
  | "member.joined"
  | "member.removed"
  | "api_key.created"
  | "api_key.revoked";

function signPayload(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

// Allowed fields per event type — prevents PII leakage
const ALLOWED_FIELDS: Record<WebhookEventType, string[]> = {
  "user.created": ["userId", "email", "name"],
  "user.updated": ["userId", "fields"],
  "user.banned": ["userId", "reason"],
  "user.unbanned": ["userId"],
  "session.created": ["sessionId", "userId"],
  "session.revoked": ["sessionId", "userId"],
  "organization.created": ["orgId", "name", "type"],
  "organization.updated": ["orgId", "fields"],
  "member.invited": ["orgId", "email", "role"],
  "member.joined": ["orgId", "userId", "role"],
  "member.removed": ["orgId", "userId"],
  "api_key.created": ["orgId", "keyId", "name"],
  "api_key.revoked": ["orgId", "keyId"],
};

function sanitizePayload(eventType: WebhookEventType, data: Record<string, unknown>): Record<string, unknown> {
  const allowed = ALLOWED_FIELDS[eventType] ?? [];
  const clean: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in data) clean[key] = data[key];
  }
  return clean;
}

/**
 * Dispatch a webhook event to all active endpoints subscribed to this event type.
 * Fire-and-forget — never blocks the caller. Payload is sanitized to prevent PII leakage.
 */
export function dispatchWebhookEvent(
  eventType: WebhookEventType,
  data: Record<string, unknown>
): void {
  _dispatch(eventType, sanitizePayload(eventType, data)).catch(err => {
    console.error(`[webhooks] Failed to dispatch ${eventType}:`, err);
  });
}

async function _dispatch(
  eventType: WebhookEventType,
  data: Record<string, unknown>
): Promise<void> {
  // Find all active endpoints that subscribe to this event
  const endpoints = await db
    .select()
    .from(webhookEndpoint)
    .where(
      and(
        eq(webhookEndpoint.active, true),
        sql`${webhookEndpoint.events} @> ${JSON.stringify([eventType])}::jsonb`
      )
    );

  if (endpoints.length === 0) return;

  const eventId = randomBytes(16).toString("hex");
  const timestamp = new Date().toISOString();
  const payload = JSON.stringify({ id: eventId, type: eventType, timestamp, data });

  for (const ep of endpoints) {
    const signature = signPayload(payload, ep.secret);
    const rowId = randomBytes(12).toString("hex");

    // Log event — await insert so we can reliably update by ID later
    try {
      await db.insert(webhookEvent).values({
        id: rowId,
        endpointId: ep.id,
        eventType,
        payload: { id: eventId, type: eventType, timestamp, data },
        status: "pending",
        createdAt: new Date(),
      });
    } catch (err) {
      console.error(`[webhooks] Failed to log event ${rowId}:`, err);
      continue; // Skip delivery if we can't log the event
    }

    // Fire HTTP POST with retry (non-blocking per endpoint)
    deliverWithRetry(ep.url, ep.secret, payload, eventId, eventType, timestamp, rowId);
  }
}

const MAX_RETRIES = 5;
const BASE_DELAY_MS = 1000; // 1s, 2s, 4s, 8s, 16s

async function deliverWithRetry(
  url: string, secret: string, payload: string,
  eventId: string, eventType: string, timestamp: string,
  rowId: string, attempt = 0
): Promise<void> {
  const signature = signPayload(payload, secret);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10_000);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Webhook-Id": eventId,
        "X-Webhook-Event": eventType,
        "X-Webhook-Timestamp": timestamp,
        "X-Webhook-Signature": `sha256=${signature}`,
        "X-Webhook-Attempt": String(attempt + 1),
      },
      body: payload,
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (res.ok) {
      await db.update(webhookEvent)
        .set({ status: "delivered", statusCode: res.status, deliveredAt: new Date() })
        .where(eq(webhookEvent.id, rowId));
      return;
    }

    // Non-2xx — retry if we have attempts left
    if (attempt < MAX_RETRIES) {
      const delay = BASE_DELAY_MS * Math.pow(2, attempt);
      setTimeout(() => {
        deliverWithRetry(url, secret, payload, eventId, eventType, timestamp, rowId, attempt + 1);
      }, delay);
    } else {
      await db.update(webhookEvent)
        .set({ status: "failed", statusCode: res.status, deliveredAt: new Date() })
        .where(eq(webhookEvent.id, rowId));
    }
  } catch (err) {
    clearTimeout(timer);
    if (attempt < MAX_RETRIES) {
      const delay = BASE_DELAY_MS * Math.pow(2, attempt);
      setTimeout(() => {
        deliverWithRetry(url, secret, payload, eventId, eventType, timestamp, rowId, attempt + 1);
      }, delay);
    } else {
      console.error(`[webhooks] Delivery failed after ${MAX_RETRIES + 1} attempts to ${url}:`, err instanceof Error ? err.message : err);
      void db.update(webhookEvent)
        .set({ status: "failed", deliveredAt: new Date() })
        .where(eq(webhookEvent.id, rowId))
        .catch(() => {});
    }
  }
}
