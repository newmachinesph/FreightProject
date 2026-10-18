/**
 * @truckconnect/sdk — Client entry point
 *
 * Usage in any TruckConnect frontend app:
 *
 *   import { createTruckConnectClient } from "@truckconnect/sdk"
 *
 *   export const auth = createTruckConnectClient({
 *     baseURL: process.env.NEXT_PUBLIC_AUTH_URL ?? "https://auth.truckconnect.ph",
 *   })
 *
 *   // Then use exactly like Better Auth:
 *   const { data: session } = auth.useSession()
 *   await auth.signIn.email({ email, password })
 *   await auth.signOut()
 *   await auth.organization.create({ name, slug, metadata: { type: "enterprise_shipper" } })
 */

import { createAuthClient } from "better-auth/react";
import { adminClient, organizationClient } from "better-auth/client/plugins";

export interface TruckConnectClientOptions {
  /** URL of the truckconnect-auth service. Defaults to http://localhost:3001 in dev. */
  baseURL?: string;
}

/**
 * Creates a fully-typed TruckConnect Auth client.
 * Call this once per app and export the result.
 */
export function createTruckConnectClient(options: TruckConnectClientOptions = {}) {
  const baseURL = options.baseURL ?? "http://localhost:3001";

  if (typeof window === "undefined" && !options.baseURL && typeof process !== "undefined" && process.env?.NODE_ENV === "production") {
    console.warn("[truckconnect/sdk] No baseURL provided — defaulting to localhost:3001. Set NEXT_PUBLIC_AUTH_URL in production.");
  }

  const client = createAuthClient({
    baseURL,
    fetchOptions: {
      credentials: "include" as RequestCredentials,
    },
    plugins: [
      adminClient(),
      organizationClient(),
    ],
  });

  // Intercept fetch to add Bearer token from localStorage (for cross-origin SSO)
  if (typeof window !== "undefined") {
    const origFetch = window.fetch;
    window.fetch = function(input: RequestInfo | URL, init?: RequestInit) {
      const url = typeof input === "string" ? input : input instanceof URL ? input.href : (input as Request).url;
      if (url.startsWith(baseURL)) {
        const token = localStorage.getItem("tc_session_token");
        if (token) {
          init = init ?? {};
          const headers = new Headers(init.headers);
          if (!headers.has("Authorization")) {
            headers.set("Authorization", `Bearer ${token}`);
          }
          init.headers = headers;
        }
      }
      return origFetch.call(window, input, init);
    };
  }

  return client;
}

/** Inferred type of the auth client for use in type annotations */
export type TruckConnectClient = ReturnType<typeof createTruckConnectClient>;

// ── Convenience type exports ──────────────────────────────────────────────────

/** All org types used in the TruckConnect platform */
export type OrgType =
  | "tc_platform"
  | "enterprise_shipper"
  | "msme_shipper"
  | "carrier_fleet"
  | "freight_forwarder"
  | "warehouse_operator";

/** Platform-level user roles (admin plugin) */
export type PlatformRole = "user" | "admin" | "super_admin";

/** Org-level member roles */
export type OrgRole =
  | "owner" | "admin" | "member"
  // Platform
  | "super_admin" | "compliance_officer" | "dispute_manager"
  | "support_agent" | "ai_supervisor" | "data_quality"
  // Demand
  | "enterprise_admin" | "booker" | "viewer"
  | "shipper_admin" | "forwarder_admin" | "agent"
  // Supply
  | "carrier_owner" | "dispatcher" | "driver"
  // Warehouse
  | "warehouse_admin" | "warehouse_manager" | "warehouse_staff" | "warehouse_viewer";

export const ORG_TYPE_LABELS: Record<OrgType, string> = {
  tc_platform:        "TruckConnect Platform",
  enterprise_shipper: "Enterprise Shipper",
  msme_shipper:       "MSME Shipper",
  carrier_fleet:      "Carrier Fleet",
  freight_forwarder:  "Freight Forwarder",
  warehouse_operator: "Warehouse Operator",
};

export const ORG_ROLE_LABELS: Record<OrgRole, string> = {
  owner: "Owner", admin: "Admin", member: "Member",
  super_admin: "Super Admin", compliance_officer: "Compliance Officer",
  dispute_manager: "Dispute Manager", support_agent: "Support Agent",
  ai_supervisor: "AI Supervisor", data_quality: "Data Quality",
  enterprise_admin: "Enterprise Admin", booker: "Booker", viewer: "Viewer",
  shipper_admin: "Shipper Admin", forwarder_admin: "Forwarder Admin", agent: "Agent",
  carrier_owner: "Carrier Owner", dispatcher: "Dispatcher", driver: "Driver",
  warehouse_admin: "Warehouse Admin", warehouse_manager: "Warehouse Manager",
  warehouse_staff: "Warehouse Staff", warehouse_viewer: "Warehouse Viewer",
};

/**
 * Roles that can manage an org (invite, remove, change roles).
 * Must stay in sync with truckconnect-auth/lib/auth/constants.ts
 * @see ../truckconnect-auth/lib/auth/constants.ts
 */
export const ORG_ADMIN_ROLES = new Set<OrgRole>([
  "owner", "admin", "super_admin",
  "enterprise_admin", "carrier_owner", "shipper_admin", "forwarder_admin",
  "warehouse_admin",
]);
