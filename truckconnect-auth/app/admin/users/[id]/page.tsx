import { db } from "@/lib/db";
import { user, member, organization, session, auditLog } from "@/lib/db/schema";
import { eq, and, desc, gte } from "drizzle-orm";
import { notFound } from "next/navigation";

const ROLE_LABEL: Record<string, string> = {
  super_admin: "Super Admin", admin: "Admin", user: "User",
};
const ORG_ROLE_LABEL: Record<string, string> = {
  owner: "Owner", admin: "Admin", member: "Member",
  enterprise_admin: "Enterprise Admin", booker: "Booker", viewer: "Viewer",
  carrier_owner: "Carrier Owner", dispatcher: "Dispatcher", driver: "Driver",
  shipper_admin: "Shipper Admin", forwarder_admin: "Forwarder Admin", agent: "Agent",
  compliance_officer: "Compliance Officer", support_agent: "Support Agent",
  ai_supervisor: "AI Supervisor", data_quality: "Data Quality",
  dispute_manager: "Dispute Manager",
  warehouse_admin: "Warehouse Admin", warehouse_manager: "Warehouse Manager",
  warehouse_staff: "Warehouse Staff", warehouse_viewer: "Warehouse Viewer",
};

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString("en-PH", {
    month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

export default async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Get user
  const [u] = await db.select().from(user).where(eq(user.id, id)).limit(1);
  if (!u) notFound();

  // Get org memberships
  const memberships = await db
    .select({
      role: member.role,
      joinedAt: member.createdAt,
      orgId: organization.id,
      orgName: organization.name,
      orgSlug: organization.slug,
      orgType: organization.orgType,
    })
    .from(member)
    .innerJoin(organization, eq(member.organizationId, organization.id))
    .where(eq(member.userId, id));

  // Get active sessions
  const sessions = await db
    .select({
      id: session.id,
      ipAddress: session.ipAddress,
      userAgent: session.userAgent,
      createdAt: session.createdAt,
      expiresAt: session.expiresAt,
    })
    .from(session)
    .where(and(eq(session.userId, id), gte(session.expiresAt, new Date())))
    .orderBy(desc(session.createdAt));

  // Recent audit events
  const recentAudit = await db
    .select({
      action: auditLog.action,
      ipAddress: auditLog.ipAddress,
      createdAt: auditLog.createdAt,
      metadata: auditLog.metadata,
    })
    .from(auditLog)
    .where(eq(auditLog.actorId, id))
    .orderBy(desc(auditLog.createdAt))
    .limit(20);

  function getOrgType(orgType: string | null): string {
    return orgType ?? "unknown";
  }

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1000 }}>
      {/* Back link */}
      <a href="/admin/users" style={{ fontSize: 13, color: "var(--blue)", textDecoration: "none", fontWeight: 600 }}>
        &larr; All Users
      </a>

      {/* User header */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 16, marginBottom: 28 }}>
        <div style={{
          width: 56, height: 56, borderRadius: "50%",
          background: u.banned ? "#DC2626" : "var(--navy)",
          color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22, fontWeight: 700, flexShrink: 0,
        }}>
          {u.image ? (
            <img src={u.image} alt="" style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover" }} />
          ) : u.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-1)", margin: 0 }}>
            {u.name}
            {u.banned && <span className="badge badge-red" style={{ marginLeft: 8, fontSize: 10 }}>Banned</span>}
          </h1>
          <div style={{ fontSize: 14, color: "var(--text-3)" }}>{u.email}</div>
          <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
            <span className={`badge ${u.role === "super_admin" ? "badge-navy" : u.role === "admin" ? "badge-blue" : "badge-gray"}`}>
              {ROLE_LABEL[u.role ?? "user"] ?? u.role}
            </span>
            <span className={`badge ${u.emailVerified ? "badge-green" : "badge-amber"}`}>
              {u.emailVerified ? "Email Verified" : "Email Unverified"}
            </span>
            {u.phoneNumber && (
              <span className={`badge ${u.phoneNumberVerified ? "badge-green" : "badge-amber"}`}>
                {u.phoneNumber}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Info grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: "var(--text-3)", marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>
            Account Info
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13 }}>
            <div><span style={{ color: "var(--text-4)", width: 100, display: "inline-block" }}>User ID:</span> <code style={{ fontSize: 11, color: "var(--text-2)" }}>{u.id}</code></div>
            <div><span style={{ color: "var(--text-4)", width: 100, display: "inline-block" }}>Joined:</span> <span style={{ color: "var(--text-2)" }}>{formatDate(u.createdAt)}</span></div>
            <div><span style={{ color: "var(--text-4)", width: 100, display: "inline-block" }}>Updated:</span> <span style={{ color: "var(--text-2)" }}>{formatDate(u.updatedAt)}</span></div>
            {u.banned && u.banReason && (
              <div><span style={{ color: "var(--text-4)", width: 100, display: "inline-block" }}>Ban Reason:</span> <span style={{ color: "#DC2626" }}>{u.banReason}</span></div>
            )}
          </div>
        </div>

        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: "var(--text-3)", marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>
            Metadata
          </h3>
          <div style={{ fontSize: 12 }}>
            <div style={{ color: "var(--text-4)", marginBottom: 4 }}>Trusted (admin-only):</div>
            <pre style={{ background: "var(--bg-2)", padding: 8, borderRadius: 6, fontSize: 11, overflow: "auto", maxHeight: 80, margin: "0 0 8px", color: "var(--text-2)" }}>
              {u.trustedMetadata ? JSON.stringify(u.trustedMetadata, null, 2) : "null"}
            </pre>
            <div style={{ color: "var(--text-4)", marginBottom: 4 }}>Untrusted (user-writable):</div>
            <pre style={{ background: "var(--bg-2)", padding: 8, borderRadius: 6, fontSize: 11, overflow: "auto", maxHeight: 80, margin: 0, color: "var(--text-2)" }}>
              {u.untrustedMetadata ? JSON.stringify(u.untrustedMetadata, null, 2) : "null"}
            </pre>
          </div>
        </div>
      </div>

      {/* Organizations */}
      <div className="card" style={{ padding: 0, overflow: "hidden", marginBottom: 20 }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-1)", margin: 0 }}>
            Organizations ({memberships.length})
          </h3>
        </div>
        {memberships.length === 0 ? (
          <div style={{ padding: 24, textAlign: "center", color: "var(--text-4)", fontSize: 13 }}>
            Not a member of any organization
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Organization</th><th>Type</th><th>Role</th><th>Joined</th></tr></thead>
              <tbody>
                {memberships.map(m => (
                  <tr key={m.orgId}>
                    <td>
                      <a href={`/admin/organizations/${m.orgId}`} style={{ fontWeight: 600, fontSize: 13, color: "var(--blue)", textDecoration: "none" }}>
                        {m.orgName}
                      </a>
                      <div style={{ fontSize: 11, color: "var(--text-4)" }}>/{m.orgSlug}</div>
                    </td>
                    <td><span className="badge badge-gray" style={{ fontSize: 10 }}>{getOrgType(m.orgType)}</span></td>
                    <td><span className="badge badge-blue" style={{ fontSize: 10 }}>{ORG_ROLE_LABEL[m.role] ?? m.role}</span></td>
                    <td style={{ fontSize: 12, color: "var(--text-4)" }}>{formatDate(m.joinedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Active Sessions */}
      <div className="card" style={{ padding: 0, overflow: "hidden", marginBottom: 20 }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-1)", margin: 0 }}>
            Active Sessions ({sessions.length})
          </h3>
        </div>
        {sessions.length === 0 ? (
          <div style={{ padding: 24, textAlign: "center", color: "var(--text-4)", fontSize: 13 }}>No active sessions</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>IP</th><th>User Agent</th><th>Created</th><th>Expires</th></tr></thead>
              <tbody>
                {sessions.map(s => (
                  <tr key={s.id}>
                    <td style={{ fontSize: 12, fontFamily: "monospace" }}>{s.ipAddress ?? "—"}</td>
                    <td style={{ fontSize: 12, color: "var(--text-3)", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.userAgent ?? "—"}</td>
                    <td style={{ fontSize: 12, color: "var(--text-4)" }}>{formatDate(s.createdAt)}</td>
                    <td style={{ fontSize: 12, color: "var(--text-4)" }}>{formatDate(s.expiresAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Audit */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-1)", margin: 0 }}>
            Recent Activity (last 20)
          </h3>
        </div>
        {recentAudit.length === 0 ? (
          <div style={{ padding: 24, textAlign: "center", color: "var(--text-4)", fontSize: 13 }}>No activity recorded</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Action</th><th>IP</th><th>Time</th></tr></thead>
              <tbody>
                {recentAudit.map((a, i) => (
                  <tr key={i}>
                    <td><code style={{ fontSize: 12, color: "var(--text-1)" }}>{a.action}</code></td>
                    <td style={{ fontSize: 12, fontFamily: "monospace", color: "var(--text-3)" }}>{a.ipAddress ?? "—"}</td>
                    <td style={{ fontSize: 12, color: "var(--text-4)" }}>{formatDate(a.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
