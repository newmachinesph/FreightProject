/**
 * Shared auth constants — single source of truth
 *
 * Import from "@/lib/auth/constants" instead of defining inline.
 */

/** Session cookie prefix — used by both auth config and proxy */
export const COOKIE_PREFIX = "tc";

/** Roles that can manage org settings, members, API keys, and invite codes */
export const ORG_ADMIN_ROLES = new Set([
  "owner", "admin", "enterprise_admin", "carrier_owner",
  "shipper_admin", "forwarder_admin", "super_admin", "warehouse_admin",
]);

/** All valid organization types */
export const VALID_ORG_TYPES = new Set([
  "tc_platform", "enterprise_shipper", "msme_shipper",
  "carrier_fleet", "freight_forwarder", "warehouse_operator",
]);

/** Human-readable labels for org types */
export const ORG_TYPE_LABEL: Record<string, string> = {
  tc_platform: "TruckConnect Platform",
  enterprise_shipper: "Enterprise Shipper",
  msme_shipper: "MSME Shipper",
  carrier_fleet: "Carrier Fleet",
  freight_forwarder: "Freight Forwarder",
  warehouse_operator: "Warehouse Operator",
};

/** Human-readable labels for org member roles */
export const ORG_ROLE_LABEL: Record<string, string> = {
  owner: "Owner", member: "Member",
  enterprise_admin: "Enterprise Admin", booker: "Booker", viewer: "Viewer",
  carrier_owner: "Carrier Owner", dispatcher: "Dispatcher", driver: "Driver",
  shipper_admin: "Shipper Admin", forwarder_admin: "Forwarder Admin", agent: "Agent",
  compliance_officer: "Compliance Officer", support_agent: "Support Agent",
  ai_supervisor: "AI Supervisor", data_quality: "Data Quality",
  dispute_manager: "Dispute Manager", super_admin: "Super Admin",
  warehouse_admin: "Warehouse Admin", warehouse_manager: "Warehouse Manager",
  warehouse_staff: "Warehouse Staff", warehouse_viewer: "Warehouse Viewer",
};

/** All valid org member roles (for input validation) */
export const VALID_ORG_ROLES = new Set(Object.keys(ORG_ROLE_LABEL));

/** Password policy rules */
export const MIN_PASSWORD_LENGTH = 10;
export const PASSWORD_RULES: { test: (p: string) => boolean; msg: string }[] = [
  { test: p => p.length >= MIN_PASSWORD_LENGTH, msg: `Must be at least ${MIN_PASSWORD_LENGTH} characters` },
  { test: p => /[A-Z]/.test(p), msg: "Must contain at least one uppercase letter" },
  { test: p => /[a-z]/.test(p), msg: "Must contain at least one lowercase letter" },
  { test: p => /\d/.test(p), msg: "Must contain at least one number" },
];

/** Common passwords blocklist (top entries from breached password databases) */
export const COMMON_PASSWORDS = new Set([
  "password123", "qwerty12345", "123456789a", "letmein123",
  "admin12345", "welcome123", "iloveyou12", "monkey1234",
  "dragon1234", "master1234", "abc1234567", "1234567890",
  "password1234", "qwerty123456", "changeme123", "trustno1234",
  "sunshine123", "princess123", "football123", "baseball123",
  "shadow12345", "michael1234", "login12345", "starwars123",
  "passw0rd123", "superman123", "batman12345", "access12345",
  "hello12345", "charlie1234", "donald12345", "password12345",
  "qwertyuiop1", "1q2w3e4r5t6", "zaq1zaq1234", "pass1234567",
  "test12345678", "guest1234567", "root12345678", "temp12345678",
  "truckconnect", "truckconnect1", "freight1234", "logistics123",
]);

/** Standardized API error response */
export interface ApiErrorResponse {
  code: string;
  message: string;
}

export function apiError(code: string, message: string, status: number): Response {
  return Response.json({ code, message } satisfies ApiErrorResponse, { status });
}
