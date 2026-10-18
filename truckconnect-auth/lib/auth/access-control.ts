import { createAccessControl } from "better-auth/plugins/access";

/**
 * TruckConnect RBAC — mapped from TruckConnect Blueprint v2.0
 *
 * Resources & Actions:
 *  loads      — freight load postings
 *  bookings   — booking / trip confirmations
 *  trips      — in-progress trip tracking
 *  carriers   — carrier profiles & verification
 *  disputes   — cargo damage / billing disputes
 *  payments   — escrow, payout, advance
 *  platform   — admin operations
 *  api        — REST / MCP access
 */
export const ac = createAccessControl({
  // ── Org management (Better Auth built-in resources) ──
  organization: ["update", "delete"],
  member: ["create", "update", "delete"],
  invitation: ["create", "cancel"],
  // ── TruckConnect domain resources ──
  loads: ["create", "read", "update", "delete", "post_for_client"],
  bookings: ["create", "read", "approve", "cancel", "bulk_create", "view_all"],
  trips: ["create", "read", "update", "complete", "view_all"],
  carriers: ["read", "verify", "suspend", "manage_own"],
  disputes: ["create", "read", "resolve", "view_all"],
  payments: ["view", "release", "advance_request", "view_all"],
  platform: [
    "admin",
    "manage_users",
    "manage_orgs",
    "view_analytics",
    "override_ai",
    "compliance",
  ],
  api: ["rest_access", "mcp_access", "bulk_operations"],
  warehouse: ["manage_inventory", "receive", "dispatch", "pick_pack", "view_stock", "manage_zones"],
});

// ─── TIER 3: TruckConnect Platform Roles ────────────────────────────────────────────

/** Full access — TruckConnect engineering / founders */
export const superAdminRole = ac.newRole({
  organization: ["update", "delete"],
  member: ["create", "update", "delete"],
  invitation: ["create", "cancel"],
  loads: ["create", "read", "update", "delete", "post_for_client"],
  bookings: ["create", "read", "approve", "cancel", "bulk_create", "view_all"],
  trips: ["create", "read", "update", "complete", "view_all"],
  carriers: ["read", "verify", "suspend", "manage_own"],
  disputes: ["create", "read", "resolve", "view_all"],
  payments: ["view", "release", "advance_request", "view_all"],
  platform: [
    "admin",
    "manage_users",
    "manage_orgs",
    "view_analytics",
    "override_ai",
    "compliance",
  ],
  api: ["rest_access", "mcp_access", "bulk_operations"],
});

/** Verify LTFRB accreditation, PhilID checks, approve/suspend carriers */
export const complianceOfficerRole = ac.newRole({
  carriers: ["read", "verify", "suspend"],
  platform: ["compliance", "view_analytics"],
  loads: ["read"],
  bookings: ["read"],
  trips: ["read"],
  disputes: ["read"],
  payments: ["view"],
});

/** Review cargo damage claims, mediate disputes, trigger escrow releases */
export const disputeManagerRole = ac.newRole({
  disputes: ["create", "read", "resolve", "view_all"],
  payments: ["view", "release", "view_all"],
  trips: ["read", "view_all"],
  loads: ["read"],
  bookings: ["read"],
});

/** Handle tickets in Taglish — 80% AI, 20% human escalation */
export const supportAgentRole = ac.newRole({
  loads: ["read"],
  bookings: ["read"],
  trips: ["read"],
  disputes: ["read"],
  carriers: ["read"],
  payments: ["view"],
});

/** Review AI load matches, override suggestions, monitor model performance */
export const aiSupervisorRole = ac.newRole({
  loads: ["read"],
  bookings: ["read", "view_all"],
  trips: ["read", "view_all"],
  platform: ["override_ai", "view_analytics"],
  carriers: ["read"],
});

/** Ensure carrier KYC docs are clean, review AI-OCR results */
export const dataQualityRole = ac.newRole({
  carriers: ["read"],
  platform: ["compliance", "view_analytics"],
  loads: ["read"],
  trips: ["read"],
});

// ─── TIER 1: Demand Side Roles ────────────────────────────────────────────────

/** Enterprise shipper org admin — full access + MCP/API */
export const enterpriseAdminRole = ac.newRole({
  organization: ["update"],
  member: ["create", "update", "delete"],
  invitation: ["create", "cancel"],
  loads: ["create", "read", "update", "delete"],
  bookings: ["create", "read", "cancel", "bulk_create", "view_all"],
  trips: ["read", "view_all"],
  payments: ["view", "release", "view_all"],
  platform: ["view_analytics"],
  api: ["rest_access", "mcp_access", "bulk_operations"],
});

/** Enterprise shipper — can create bookings, cannot bulk or see analytics */
export const bookerRole = ac.newRole({
  loads: ["create", "read"],
  bookings: ["create", "read", "cancel"],
  trips: ["read"],
  payments: ["view"],
});

/** Enterprise shipper — read-only */
export const viewerRole = ac.newRole({
  loads: ["read"],
  bookings: ["read"],
  trips: ["read"],
  payments: ["view"],
});

/** MSME shipper — full access to own loads/bookings */
export const shipperAdminRole = ac.newRole({
  organization: ["update"],
  member: ["create", "update", "delete"],
  invitation: ["create", "cancel"],
  loads: ["create", "read", "update", "delete"],
  bookings: ["create", "read", "cancel", "view_all"],
  trips: ["read", "view_all"],
  payments: ["view", "release"],
});

/** Freight forwarder org admin — can post loads for clients, bulk book */
export const forwarderAdminRole = ac.newRole({
  organization: ["update"],
  member: ["create", "update", "delete"],
  invitation: ["create", "cancel"],
  loads: ["create", "read", "update", "post_for_client"],
  bookings: ["create", "read", "cancel", "bulk_create", "view_all"],
  trips: ["read", "view_all"],
  payments: ["view", "view_all"],
  api: ["rest_access", "bulk_operations"],
});

/** Freight forwarder agent — posts loads for clients, manages own bookings */
export const agentRole = ac.newRole({
  loads: ["create", "read", "post_for_client"],
  bookings: ["create", "read", "cancel"],
  trips: ["read"],
  payments: ["view"],
});

// ─── TIER 2: Supply Side Roles ────────────────────────────────────────────────

/** Fleet/carrier owner — accepts loads, manages trucks, views all own trips */
export const carrierOwnerRole = ac.newRole({
  organization: ["update"],
  member: ["create", "update", "delete"],
  invitation: ["create", "cancel"],
  bookings: ["approve", "read", "view_all"],
  trips: ["create", "read", "update", "complete", "view_all"],
  carriers: ["read", "manage_own"],
  payments: ["view", "advance_request", "view_all"],
  loads: ["read"],
});

/** Dispatcher — assigns loads to drivers, tracks fleet */
export const dispatcherRole = ac.newRole({
  bookings: ["read", "view_all"],
  trips: ["create", "read", "update", "view_all"],
  loads: ["read"],
  payments: ["view"],
});

/** Driver — tap-to-confirm status, upload ePOD */
export const driverRole = ac.newRole({
  trips: ["read", "update", "complete"],
  loads: ["read"],
  payments: ["view"],
});

// ─── TIER 4: Warehouse Roles ────────────────────────────────────────────────

/** Full warehouse access — zones, inventory, team, integrations */
export const warehouseAdminRole = ac.newRole({
  organization: ["update"],
  member: ["create", "update", "delete"],
  invitation: ["create", "cancel"],
  warehouse: ["manage_inventory", "receive", "dispatch", "pick_pack", "view_stock", "manage_zones"],
  loads: ["read"],
  bookings: ["read", "view_all"],
  trips: ["read"],
  payments: ["view"],
  api: ["rest_access"],
});

/** Manage inbound/outbound, inventory, fulfillment */
export const warehouseManagerRole = ac.newRole({
  warehouse: ["manage_inventory", "receive", "dispatch", "pick_pack", "view_stock"],
  loads: ["read"],
  bookings: ["read"],
  trips: ["read"],
  payments: ["view"],
});

/** Receive goods, pick/pack, update stock */
export const warehouseStaffRole = ac.newRole({
  warehouse: ["receive", "dispatch", "pick_pack", "view_stock"],
  loads: ["read"],
  bookings: ["read"],
  trips: ["read"],
});

/** Read-only — reports, stock levels */
export const warehouseViewerRole = ac.newRole({
  warehouse: ["view_stock"],
  loads: ["read"],
  bookings: ["read"],
});

// ─── Role metadata (for UI labels and org-type validation) ────────────────────

export const ROLE_META: Record<
  string,
  { label: string; description: string; orgTypes: string[] }
> = {
  // Platform
  super_admin: {
    label: "Super Admin",
    description: "Full platform access — TruckConnect team only",
    orgTypes: ["tc_platform"],
  },
  compliance_officer: {
    label: "Compliance Officer",
    description: "Carrier KYC, PhilID, LTFRB verification",
    orgTypes: ["tc_platform"],
  },
  dispute_manager: {
    label: "Dispute Manager",
    description: "Cargo dispute resolution and escrow release",
    orgTypes: ["tc_platform"],
  },
  support_agent: {
    label: "Support Agent",
    description: "Taglish ticket handling",
    orgTypes: ["tc_platform"],
  },
  ai_supervisor: {
    label: "AI Dispatch Supervisor",
    description: "Reviews and overrides AI load matches",
    orgTypes: ["tc_platform"],
  },
  data_quality: {
    label: "Data Quality Manager",
    description: "KYC document accuracy and AI-OCR review",
    orgTypes: ["tc_platform"],
  },
  // Demand
  enterprise_admin: {
    label: "Enterprise Admin",
    description: "Full org access + MCP/API",
    orgTypes: ["enterprise_shipper"],
  },
  booker: {
    label: "Booker",
    description: "Create and manage bookings",
    orgTypes: ["enterprise_shipper"],
  },
  viewer: {
    label: "Viewer",
    description: "Read-only access",
    orgTypes: ["enterprise_shipper", "freight_forwarder"],
  },
  shipper_admin: {
    label: "Shipper",
    description: "Full access to own loads and bookings",
    orgTypes: ["msme_shipper"],
  },
  forwarder_admin: {
    label: "Forwarder Admin",
    description: "Bulk booking and multi-client load posting",
    orgTypes: ["freight_forwarder"],
  },
  agent: {
    label: "Agent",
    description: "Post loads on behalf of clients",
    orgTypes: ["freight_forwarder"],
  },
  // Supply
  carrier_owner: {
    label: "Fleet Owner",
    description: "Accepts loads, manages fleet, early payout",
    orgTypes: ["carrier_fleet"],
  },
  dispatcher: {
    label: "Dispatcher",
    description: "Assigns loads to drivers, tracks fleet",
    orgTypes: ["carrier_fleet"],
  },
  driver: {
    label: "Driver",
    description: "Tap-to-confirm status and ePOD upload",
    orgTypes: ["carrier_fleet"],
  },
  // Warehouse
  warehouse_admin: {
    label: "Warehouse Admin",
    description: "Full warehouse management — zones, inventory, team",
    orgTypes: ["warehouse_operator"],
  },
  warehouse_manager: {
    label: "Warehouse Manager",
    description: "Manage inbound/outbound and fulfillment",
    orgTypes: ["warehouse_operator"],
  },
  warehouse_staff: {
    label: "Warehouse Staff",
    description: "Receive, pick, pack, and dispatch goods",
    orgTypes: ["warehouse_operator"],
  },
  warehouse_viewer: {
    label: "Warehouse Viewer",
    description: "Read-only access to stock levels and reports",
    orgTypes: ["warehouse_operator"],
  },
};

export const ORG_TYPES = [
  { value: "tc_platform", label: "TruckConnect Platform" },
  { value: "enterprise_shipper", label: "Enterprise Shipper" },
  { value: "msme_shipper", label: "MSME Shipper" },
  { value: "carrier_fleet", label: "Carrier / Fleet" },
  { value: "freight_forwarder", label: "Freight Forwarder" },
  { value: "warehouse_operator", label: "Warehouse Operator" },
] as const;

export type OrgType = (typeof ORG_TYPES)[number]["value"];
