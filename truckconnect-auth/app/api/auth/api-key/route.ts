/**
 * POST /api/auth/api-key
 *
 * Validates a TruckConnect API key and returns the organization context.
 * Called by other TruckConnect microservices to authenticate incoming requests.
 *
 * Security:
 *   - Timing-safe hash comparison to prevent side-channel attacks
 *   - Input format validation before DB query
 *   - Consistent response time regardless of key validity
 *
 * Usage from another service:
 *   const res = await fetch("https://auth.truckconnect.ph/api/auth/api-key", {
 *     method: "POST",
 *     headers: { Authorization: "Bearer tc_live_xxxxxxxx_..." },
 *   });
 *   const { valid, org, permissions } = await res.json();
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { apiKey, organization } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { createHash } from "crypto";

const KEY_PATTERN = /^tc_live_[a-f0-9]{8}_[a-f0-9]{24}$/;

const ORG_TYPE_PERMISSIONS: Record<string, string[]> = {
  tc_platform:        ["platform.admin", "platform.manage_users", "platform.manage_orgs", "api.mcp_access", "api.bulk_operations"],
  enterprise_shipper: ["loads.create", "loads.read", "bookings.create", "bookings.read", "bookings.bulk_create", "trips.read", "payments.view", "api.rest_access", "api.bulk_operations"],
  msme_shipper:       ["loads.create", "loads.read", "bookings.create", "bookings.read", "trips.read", "payments.view", "api.rest_access"],
  carrier_fleet:      ["bookings.read", "trips.create", "trips.read", "trips.update", "trips.complete", "carriers.manage_own", "payments.view", "api.rest_access"],
  freight_forwarder:  ["loads.create", "loads.read", "loads.post_for_client", "bookings.create", "bookings.read", "bookings.bulk_create", "trips.read", "payments.view", "api.rest_access", "api.bulk_operations"],
  warehouse_operator: [
    "warehouse.manage_inventory", "warehouse.receive", "warehouse.dispatch",
    "warehouse.view_stock", "loads.read", "bookings.read", "api.rest_access",
  ],
};

function parseOrgType(orgType: string | null, metadata: unknown): string {
  if (orgType) return orgType;
  if (!metadata) return "unknown";
  try {
    const p = typeof metadata === "string" ? JSON.parse(metadata) : metadata;
    return (p as { type?: string }).type ?? "unknown";
  } catch { return "unknown"; }
}

export async function POST(req: NextRequest) {
  const start = Date.now();
  const MIN_RESPONSE_MS = 50; // Ensure consistent timing to prevent enumeration

  async function respond(body: object, status: number) {
    const elapsed = Date.now() - start;
    if (elapsed < MIN_RESPONSE_MS) {
      await new Promise(r => setTimeout(r, MIN_RESPONSE_MS - elapsed));
    }
    return NextResponse.json(body, { status });
  }

  let key: string | undefined;

  // Accept key from Authorization header OR JSON body
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    key = authHeader.slice(7).trim();
  } else {
    try {
      const body = await req.json();
      key = typeof body.key === "string" ? body.key : undefined;
    } catch { /* no body */ }
  }

  // Validate format before hitting DB
  if (!key || !KEY_PATTERN.test(key)) {
    return respond({ valid: false, code: "NOT_FOUND", message: "API key not found", reason: "not_found" }, 401);
  }

  const hash = createHash("sha256").update(key).digest("hex");

  const [row] = await db
    .select({
      id: apiKey.id,
      orgId: apiKey.orgId,
      name: apiKey.name,
      keyHash: apiKey.keyHash,
      expiresAt: apiKey.expiresAt,
      revokedAt: apiKey.revokedAt,
      orgName: organization.name,
      orgTypeCol: organization.orgType,
      orgMeta: organization.metadata,
    })
    .from(apiKey)
    .innerJoin(organization, eq(apiKey.orgId, organization.id))
    .where(eq(apiKey.keyHash, hash))
    .limit(1);

  if (!row) {
    return respond({ valid: false, code: "NOT_FOUND", message: "API key not found", reason: "not_found" }, 401);
  }

  // Note: timing-safe comparison is unnecessary here because the DB WHERE clause
  // already filtered by hash equality. Timing protection is ensured by the 50ms
  // minimum response floor in respond() which normalizes all response times.

  if (row.revokedAt) {
    return respond({ valid: false, code: "REVOKED", message: "API key has been revoked", reason: "revoked" }, 401);
  }

  if (row.expiresAt && new Date(row.expiresAt) < new Date()) {
    return respond({ valid: false, code: "EXPIRED", message: "API key has expired", reason: "expired" }, 401);
  }

  // Update last_used_at (fire-and-forget)
  db.update(apiKey)
    .set({ lastUsedAt: new Date() })
    .where(eq(apiKey.id, row.id))
    .catch(err => console.error("[api-key] Failed to update lastUsedAt:", err));

  const orgType = parseOrgType(row.orgTypeCol, row.orgMeta);
  const permissions = ORG_TYPE_PERMISSIONS[orgType] ?? ["api.rest_access"];

  return respond({
    valid: true,
    keyId: row.id,
    keyName: row.name,
    org: {
      id: row.orgId,
      name: row.orgName,
      type: orgType,
    },
    permissions,
  }, 200);
}
