import { db } from "@/lib/db";
import { organization, member } from "@/lib/db/schema";
import { count, sql } from "drizzle-orm";
import CreateOrgButton from "@/components/admin/CreateOrgButton";

const ORG_TYPE_BADGE: Record<string, string> = {
  tc_platform:     "badge-navy",
  enterprise_shipper: "badge-blue",
  msme_shipper:       "badge-green",
  carrier_fleet:      "badge-amber",
  freight_forwarder:  "badge-purple",
  warehouse_operator: "badge-teal",
};
const ORG_TYPE_LABEL: Record<string, string> = {
  tc_platform:     "TruckConnect Platform",
  enterprise_shipper: "Enterprise Shipper",
  msme_shipper:       "MSME Shipper",
  carrier_fleet:      "Carrier Fleet",
  freight_forwarder:  "Freight Forwarder",
  warehouse_operator: "Warehouse Operator",
};

async function getOrgs() {
  const orgs = await db
    .select({
      id: organization.id,
      name: organization.name,
      slug: organization.slug,
      orgType: organization.orgType,
      createdAt: organization.createdAt,
    })
    .from(organization)
    .orderBy(sql`${organization.createdAt} desc`);

  const counts = await db
    .select({ orgId: member.organizationId, count: count() })
    .from(member)
    .groupBy(member.organizationId);

  const countMap = Object.fromEntries(counts.map(c => [c.orgId, c.count]));

  return orgs.map(o => ({
    ...o,
    memberCount: countMap[o.id] ?? 0,
    type: o.orgType ?? "unknown",
  }));
}

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString("en-PH", {
    month: "short", day: "numeric", year: "numeric",
  });
}

export default async function OrganizationsPage() {
  const orgs = await getOrgs();

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1200 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-1)" }}>Organizations</h1>
          <p style={{ fontSize: 14, color: "var(--text-3)", marginTop: 4 }}>
            {orgs.length} organization{orgs.length !== 1 ? "s" : ""} on the platform
          </p>
        </div>
        <CreateOrgButton />
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Organization</th>
                <th>Type</th>
                <th>Members</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {orgs.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center", color: "var(--text-4)", padding: "40px" }}>
                    No organizations yet. Create one to get started.
                  </td>
                </tr>
              )}
              {orgs.map(o => (
                <tr key={o.id} style={{ cursor: "pointer" }}>
                  <td>
                    <a href={`/admin/organizations/${o.id}`} style={{ textDecoration: "none" }}>
                      <div style={{ fontWeight: 600, fontSize: 13, color: "var(--blue)" }}>{o.name}</div>
                      <div style={{ fontSize: 12, color: "var(--text-4)" }}>
                        /{o.slug ?? o.id.slice(0, 12)}
                      </div>
                    </a>
                  </td>
                  <td>
                    <span className={`badge ${ORG_TYPE_BADGE[o.type] ?? "badge-gray"}`} style={{ fontSize: 10 }}>
                      {ORG_TYPE_LABEL[o.type] ?? o.type}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-1)" }}>
                      {o.memberCount}
                    </span>
                    <span style={{ fontSize: 12, color: "var(--text-4)", marginLeft: 4 }}>member{o.memberCount !== 1 ? "s" : ""}</span>
                  </td>
                  <td style={{ fontSize: 12, color: "var(--text-4)" }}>{formatDate(o.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
