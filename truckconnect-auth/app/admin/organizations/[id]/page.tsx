import { db } from "@/lib/db";
import { organization, member, user, apiKey, invitation, inviteCode } from "@/lib/db/schema";
import { eq, and, isNull, desc } from "drizzle-orm";
import { notFound } from "next/navigation";

const ORG_TYPE_LABEL: Record<string, string> = {
  tc_platform: "TruckConnect Platform", enterprise_shipper: "Enterprise Shipper",
  msme_shipper: "MSME Shipper", carrier_fleet: "Carrier Fleet",
  freight_forwarder: "Freight Forwarder", warehouse_operator: "Warehouse Operator",
};
const ROLE_LABEL: Record<string, string> = {
  owner: "Owner", admin: "Admin", member: "Member",
  enterprise_admin: "Enterprise Admin", booker: "Booker", viewer: "Viewer",
  carrier_owner: "Carrier Owner", dispatcher: "Dispatcher", driver: "Driver",
  shipper_admin: "Shipper Admin", forwarder_admin: "Forwarder Admin", agent: "Agent",
  compliance_officer: "Compliance Officer", support_agent: "Support Agent",
  ai_supervisor: "AI Supervisor", data_quality: "Data Quality",
  dispute_manager: "Dispute Manager", super_admin: "Super Admin",
  warehouse_admin: "Warehouse Admin", warehouse_manager: "Warehouse Manager",
  warehouse_staff: "Warehouse Staff", warehouse_viewer: "Warehouse Viewer",
};

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString("en-PH", {
    month: "short", day: "numeric", year: "numeric",
  });
}

function getOrgType(orgType: string | null): string {
  return orgType ?? "unknown";
}

export default async function OrgDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [org] = await db.select().from(organization).where(eq(organization.id, id)).limit(1);
  if (!org) notFound();

  const orgType = getOrgType(org.orgType);

  // Members with user info
  const members = await db
    .select({
      memberId: member.id,
      role: member.role,
      joinedAt: member.createdAt,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userBanned: user.banned,
    })
    .from(member)
    .innerJoin(user, eq(member.userId, user.id))
    .where(eq(member.organizationId, id))
    .orderBy(member.createdAt);

  const owner = members.find(m => m.role === "owner");

  // API keys
  const keys = await db
    .select({ id: apiKey.id, name: apiKey.name, prefix: apiKey.prefix, createdAt: apiKey.createdAt, revokedAt: apiKey.revokedAt, lastUsedAt: apiKey.lastUsedAt })
    .from(apiKey)
    .where(eq(apiKey.orgId, id))
    .orderBy(desc(apiKey.createdAt));

  // Pending invitations
  const invitations = await db
    .select({ id: invitation.id, email: invitation.email, role: invitation.role, status: invitation.status, expiresAt: invitation.expiresAt, createdAt: invitation.createdAt })
    .from(invitation)
    .where(and(eq(invitation.organizationId, id), eq(invitation.status, "pending")))
    .orderBy(desc(invitation.createdAt));

  // Invite codes
  const codes = await db
    .select()
    .from(inviteCode)
    .where(eq(inviteCode.orgId, id))
    .orderBy(desc(inviteCode.createdAt));

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1100 }}>
      <a href="/admin/organizations" style={{ fontSize: 13, color: "var(--blue)", textDecoration: "none", fontWeight: 600 }}>
        &larr; All Organizations
      </a>

      {/* Org header */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 16, marginBottom: 28 }}>
        <div style={{
          width: 52, height: 52, borderRadius: 12,
          background: "var(--blue)", color: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22, fontWeight: 700, flexShrink: 0,
        }}>
          {org.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-1)", margin: 0 }}>{org.name}</h1>
          <div style={{ fontSize: 13, color: "var(--text-4)" }}>/{org.slug ?? id.slice(0, 12)}</div>
          <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
            <span className="badge badge-blue" style={{ fontSize: 10 }}>{ORG_TYPE_LABEL[orgType] ?? orgType}</span>
            <span className="badge badge-gray" style={{ fontSize: 10 }}>Created {formatDate(org.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Members", value: members.length, color: "#2563EB" },
          { label: "API Keys", value: keys.filter(k => !k.revokedAt).length, color: "#059669" },
          { label: "Pending Invites", value: invitations.length, color: "#D97706" },
          { label: "Invite Codes", value: codes.filter(c => !c.revokedAt).length, color: "#7C3AED" },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: `${s.color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: s.color }}>
              {s.value}
            </div>
            <div style={{ fontSize: 13, color: "var(--text-3)", fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Owner */}
      {owner && (
        <div className="card" style={{ padding: "14px 20px", marginBottom: 20, display: "flex", alignItems: "center", gap: 12, borderLeft: "3px solid var(--blue)" }}>
          <span style={{ fontSize: 13, color: "var(--text-3)" }}>Owner:</span>
          <a href={`/admin/users/${owner.userId}`} style={{ fontSize: 13, fontWeight: 600, color: "var(--blue)", textDecoration: "none" }}>
            {owner.userName}
          </a>
          <span style={{ fontSize: 12, color: "var(--text-4)" }}>{owner.userEmail}</span>
        </div>
      )}

      {/* Members */}
      <div className="card" style={{ padding: 0, overflow: "hidden", marginBottom: 20 }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-1)", margin: 0 }}>Members ({members.length})</h3>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>User</th><th>Role</th><th>Status</th><th>Joined</th></tr></thead>
            <tbody>
              {members.map(m => (
                <tr key={m.memberId}>
                  <td>
                    <a href={`/admin/users/${m.userId}`} style={{ textDecoration: "none" }}>
                      <div style={{ fontWeight: 600, fontSize: 13, color: "var(--blue)" }}>{m.userName}</div>
                      <div style={{ fontSize: 11, color: "var(--text-4)" }}>{m.userEmail}</div>
                    </a>
                  </td>
                  <td><span className={`badge ${m.role === "owner" ? "badge-navy" : "badge-blue"}`} style={{ fontSize: 10 }}>{ROLE_LABEL[m.role] ?? m.role}</span></td>
                  <td>{m.userBanned ? <span className="badge badge-red" style={{ fontSize: 10 }}>Banned</span> : <span className="badge badge-green" style={{ fontSize: 10 }}>Active</span>}</td>
                  <td style={{ fontSize: 12, color: "var(--text-4)" }}>{formatDate(m.joinedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Codes */}
      <div className="card" style={{ padding: 0, overflow: "hidden", marginBottom: 20 }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-1)", margin: 0 }}>Invite Codes ({codes.length})</h3>
        </div>
        {codes.length === 0 ? (
          <div style={{ padding: 24, textAlign: "center", color: "var(--text-4)", fontSize: 13 }}>No invite codes created</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Code</th><th>Role</th><th>Usage</th><th>Expires</th><th>Status</th></tr></thead>
              <tbody>
                {codes.map(c => {
                  const expired = c.expiresAt && c.expiresAt < new Date();
                  const maxed = c.maxUses !== null && c.usedCount >= c.maxUses;
                  return (
                    <tr key={c.id}>
                      <td><code style={{ fontSize: 13, fontWeight: 700, color: "var(--text-1)", letterSpacing: 1 }}>{c.code}</code></td>
                      <td><span className="badge badge-blue" style={{ fontSize: 10 }}>{ROLE_LABEL[c.role] ?? c.role}</span></td>
                      <td style={{ fontSize: 13 }}>{c.usedCount}{c.maxUses ? ` / ${c.maxUses}` : ""}</td>
                      <td style={{ fontSize: 12, color: "var(--text-4)" }}>{c.expiresAt ? formatDate(c.expiresAt) : "Never"}</td>
                      <td>
                        {c.revokedAt ? (
                          <span className="badge badge-red" style={{ fontSize: 10 }}>Revoked</span>
                        ) : expired ? (
                          <span className="badge badge-amber" style={{ fontSize: 10 }}>Expired</span>
                        ) : maxed ? (
                          <span className="badge badge-amber" style={{ fontSize: 10 }}>Max Used</span>
                        ) : (
                          <span className="badge badge-green" style={{ fontSize: 10 }}>Active</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* API Keys */}
      <div className="card" style={{ padding: 0, overflow: "hidden", marginBottom: 20 }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-1)", margin: 0 }}>API Keys ({keys.length})</h3>
        </div>
        {keys.length === 0 ? (
          <div style={{ padding: 24, textAlign: "center", color: "var(--text-4)", fontSize: 13 }}>No API keys</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Name</th><th>Prefix</th><th>Last Used</th><th>Status</th><th>Created</th></tr></thead>
              <tbody>
                {keys.map(k => (
                  <tr key={k.id}>
                    <td style={{ fontWeight: 600, fontSize: 13, color: "var(--text-1)" }}>{k.name}</td>
                    <td><code style={{ fontSize: 11, color: "var(--text-3)" }}>{k.prefix}</code></td>
                    <td style={{ fontSize: 12, color: "var(--text-4)" }}>{k.lastUsedAt ? formatDate(k.lastUsedAt) : "Never"}</td>
                    <td>{k.revokedAt ? <span className="badge badge-red" style={{ fontSize: 10 }}>Revoked</span> : <span className="badge badge-green" style={{ fontSize: 10 }}>Active</span>}</td>
                    <td style={{ fontSize: 12, color: "var(--text-4)" }}>{formatDate(k.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pending Invitations */}
      {invitations.length > 0 && (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-1)", margin: 0 }}>Pending Invitations ({invitations.length})</h3>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Email</th><th>Role</th><th>Expires</th></tr></thead>
              <tbody>
                {invitations.map(inv => (
                  <tr key={inv.id}>
                    <td style={{ fontSize: 13, color: "var(--text-1)" }}>{inv.email}</td>
                    <td><span className="badge badge-blue" style={{ fontSize: 10 }}>{ROLE_LABEL[inv.role ?? "member"] ?? inv.role}</span></td>
                    <td style={{ fontSize: 12, color: "var(--text-4)" }}>{formatDate(inv.expiresAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
