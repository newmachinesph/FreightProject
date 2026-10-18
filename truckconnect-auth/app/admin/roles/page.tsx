import { ROLE_META, ORG_TYPES } from "@/lib/auth/access-control";

const ORG_SECTION_ORDER = [
  "tc_platform",
  "enterprise_shipper",
  "msme_shipper",
  "carrier_fleet",
  "freight_forwarder",
  "warehouse_operator",
];

const RESOURCE_LABELS: Record<string, string> = {
  loads:      "Loads",
  bookings:   "Bookings",
  trips:      "Trips",
  carriers:   "Carriers",
  disputes:   "Disputes",
  payments:   "Payments",
  platform:   "Platform",
  api:        "API",
  warehouse:  "Warehouse",
};

// Permissions per role extracted from access-control definitions
const ROLE_PERMISSIONS: Record<string, Record<string, string[]>> = {
  super_admin:         { loads: ["create","read","update","delete","post_for_client"], bookings: ["create","read","approve","cancel","bulk_create","view_all"], trips: ["create","read","update","complete","view_all"], carriers: ["read","verify","suspend","manage_own"], disputes: ["create","read","resolve","view_all"], payments: ["view","release","advance_request","view_all"], platform: ["admin","manage_users","manage_orgs","view_analytics","override_ai","compliance"], api: ["rest_access","mcp_access","bulk_operations"] },
  compliance_officer:  { carriers: ["read","verify","suspend"], platform: ["compliance","view_analytics"], loads: ["read"], bookings: ["read"], trips: ["read"], disputes: ["read"], payments: ["view"] },
  dispute_manager:     { disputes: ["create","read","resolve","view_all"], payments: ["view","release","view_all"], trips: ["read","view_all"], loads: ["read"], bookings: ["read"] },
  support_agent:       { loads: ["read"], bookings: ["read"], trips: ["read"], disputes: ["read"], carriers: ["read"], payments: ["view"] },
  ai_supervisor:       { loads: ["read"], bookings: ["read","view_all"], trips: ["read","view_all"], platform: ["override_ai","view_analytics"], carriers: ["read"] },
  data_quality:        { carriers: ["read"], platform: ["compliance","view_analytics"], loads: ["read"], trips: ["read"] },
  enterprise_admin:    { loads: ["create","read","update","delete"], bookings: ["create","read","cancel","bulk_create","view_all"], trips: ["read","view_all"], payments: ["view","release","view_all"], platform: ["view_analytics"], api: ["rest_access","mcp_access","bulk_operations"] },
  booker:              { loads: ["create","read"], bookings: ["create","read","cancel"], trips: ["read"], payments: ["view"] },
  viewer:              { loads: ["read"], bookings: ["read"], trips: ["read"], payments: ["view"] },
  shipper_admin:       { loads: ["create","read","update","delete"], bookings: ["create","read","cancel","view_all"], trips: ["read","view_all"], payments: ["view","release"] },
  forwarder_admin:     { loads: ["create","read","update","post_for_client"], bookings: ["create","read","cancel","bulk_create","view_all"], trips: ["read","view_all"], payments: ["view","view_all"], api: ["rest_access","bulk_operations"] },
  agent:               { loads: ["create","read","post_for_client"], bookings: ["create","read","cancel"], trips: ["read"], payments: ["view"] },
  carrier_owner:       { bookings: ["approve","read","view_all"], trips: ["create","read","update","complete","view_all"], carriers: ["read","manage_own"], payments: ["view","advance_request","view_all"], loads: ["read"] },
  dispatcher:          { bookings: ["read","view_all"], trips: ["create","read","update","view_all"], loads: ["read"], payments: ["view"] },
  driver:              { trips: ["read","update","complete"], loads: ["read"], payments: ["view"] },
  warehouse_admin:     { warehouse: ["manage_inventory","receive","dispatch","pick_pack","view_stock","manage_zones"], loads: ["read"], bookings: ["read","view_all"], trips: ["read"], payments: ["view"], api: ["rest_access"] },
  warehouse_manager:   { warehouse: ["manage_inventory","receive","dispatch","pick_pack","view_stock"], loads: ["read"], bookings: ["read"], trips: ["read"], payments: ["view"] },
  warehouse_staff:     { warehouse: ["receive","dispatch","pick_pack","view_stock"], loads: ["read"], bookings: ["read"], trips: ["read"] },
  warehouse_viewer:    { warehouse: ["view_stock"], loads: ["read"], bookings: ["read"] },
};

export default function RolesPage() {
  const byOrgType = ORG_SECTION_ORDER.map(orgType => ({
    orgType,
    label: ORG_TYPES.find(t => t.value === orgType)?.label ?? orgType,
    roles: Object.entries(ROLE_META).filter(([, m]) => m.orgTypes.includes(orgType)),
  }));

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1200 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-1)" }}>Roles & RBAC</h1>
        <p style={{ fontSize: 14, color: "var(--text-3)", marginTop: 4 }}>
          All roles, descriptions, and their permissions — mapped from the TruckConnect Blueprint v2.0
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        {byOrgType.map(({ orgType, label, roles }) => (
          <div key={orgType}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-2)", marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--blue)", display: "inline-block" }} />
              {label}
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {roles.map(([roleKey, meta]) => {
                const perms = ROLE_PERMISSIONS[roleKey] ?? {};
                return (
                  <div key={roleKey} className="card" style={{ padding: 20 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 16 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                          <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text-1)" }}>{meta.label}</span>
                          <code style={{ fontSize: 11, background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 4, padding: "1px 6px", color: "var(--text-3)" }}>
                            {roleKey}
                          </code>
                        </div>
                        <p style={{ fontSize: 13, color: "var(--text-3)" }}>{meta.description}</p>
                      </div>
                    </div>

                    {/* Permission grid */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {Object.entries(perms).map(([resource, actions]) => (
                        <div key={resource} style={{
                          background: "var(--bg)",
                          border: "1px solid var(--border)",
                          borderRadius: 8,
                          padding: "6px 10px",
                          fontSize: 12,
                        }}>
                          <span style={{ fontWeight: 700, color: "var(--text-2)" }}>
                            {RESOURCE_LABELS[resource] ?? resource}:
                          </span>{" "}
                          <span style={{ color: "var(--text-3)" }}>{actions.join(", ")}</span>
                        </div>
                      ))}
                      {Object.keys(perms).length === 0 && (
                        <span style={{ fontSize: 12, color: "var(--text-4)" }}>No direct permissions defined</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
