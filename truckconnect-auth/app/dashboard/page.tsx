import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { member, organization, invitation, auditLog } from "@/lib/db/schema";
import { eq, and, sql, desc } from "drizzle-orm";


const ORG_TYPE_LABEL: Record<string, string> = {
  tc_platform:     "TruckConnect Platform",
  enterprise_shipper: "Enterprise Shipper",
  msme_shipper:       "MSME Shipper",
  carrier_fleet:      "Carrier Fleet",
  freight_forwarder:  "Freight Forwarder",
  warehouse_operator: "Warehouse Operator",
};
const ORG_TYPE_BADGE: Record<string, string> = {
  tc_platform:     "badge-navy",
  enterprise_shipper: "badge-blue",
  msme_shipper:       "badge-green",
  carrier_fleet:      "badge-amber",
  freight_forwarder:  "badge-purple",
  warehouse_operator: "badge-teal",
};

const ROLE_LABEL: Record<string, string> = {
  owner: "Owner", admin: "Admin", member: "Member",
  enterprise_admin: "Enterprise Admin", booker: "Booker",
  viewer: "Viewer", carrier_owner: "Carrier Owner",
  dispatcher: "Dispatcher", driver: "Driver",
  shipper_admin: "Shipper Admin", forwarder_admin: "Forwarder Admin",
  agent: "Agent",
  warehouse_admin: "Warehouse Admin", warehouse_manager: "Warehouse Manager",
  warehouse_staff: "Warehouse Staff", warehouse_viewer: "Warehouse Viewer",
};

function getOrgType(orgType: string | null): string {
  return orgType ?? "unknown";
}

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" });
}

function relativeTime(d: Date): string {
  const now = Date.now();
  const diffMs = now - new Date(d).getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hr ago`;
  return new Date(d).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" });
}

function activityIcon(action: string): string {
  if (action.includes("signup") || action.includes("sign")) return "\uD83D\uDCBB";
  if (action.includes("update")) return "\u270F\uFE0F";
  if (action.includes("org")) return "\uD83C\uDFE2";
  if (action.includes("role")) return "\uD83E\uDD1D";
  if (action.includes("key")) return "\uD83D\uDD11";
  return "\uD83D\uDCCB";
}

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  const userId = session.user.id;
  const u = session.user as typeof session.user & { role?: string; image?: string | null };

  // Memberships
  const memberships = await db
    .select({
      orgId: member.organizationId,
      role: member.role,
      joinedAt: member.createdAt,
      name: organization.name,
      slug: organization.slug,
      orgType: organization.orgType,
    })
    .from(member)
    .innerJoin(organization, eq(member.organizationId, organization.id))
    .where(eq(member.userId, userId));

  // Pending invitations for this user's email
  const pendingInvites = await db
    .select({ id: invitation.id, orgName: organization.name, role: invitation.role, expiresAt: invitation.expiresAt })
    .from(invitation)
    .innerJoin(organization, eq(invitation.organizationId, organization.id))
    .where(
      and(
        eq(invitation.email, session.user.email),
        eq(invitation.status, "pending"),
        sql`${invitation.expiresAt} > NOW()`
      )
    );

  // Recent activity from audit log
  const recentActivity = await db
    .select({ action: auditLog.action, createdAt: auditLog.createdAt })
    .from(auditLog)
    .where(eq(auditLog.actorId, userId))
    .orderBy(desc(auditLog.createdAt))
    .limit(5);

  return (
    <div className="page-content" style={{ padding: "28px 32px", maxWidth: 1100 }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-1)" }}>
          Welcome back, {session.user.name.split(" ")[0]}!
        </h1>
        <p style={{ fontSize: 14, color: "var(--text-3)", marginTop: 4 }}>
          {session.user.email}
          {u.role === "super_admin" && (
            <a href="/admin" style={{ marginLeft: 10, color: "var(--blue)", fontSize: 12, fontWeight: 600, textDecoration: "none" }}>
              → Admin Console
            </a>
          )}
        </p>
      </div>

      {/* Pending invitations */}
      {pendingInvites.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          {pendingInvites.map(inv => (
            <div key={inv.id} style={{
              background: "#EFF6FF", border: "1.5px solid #BFDBFE",
              borderRadius: 10, padding: "14px 20px",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              marginBottom: 10, flexWrap: "wrap", gap: 10,
            }}>
              <div>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#1D4ED8" }}>
                  Invitation to join {inv.orgName}
                </span>
                <span className="badge badge-blue" style={{ marginLeft: 8, fontSize: 10 }}>
                  {ROLE_LABEL[inv.role ?? "member"] ?? inv.role}
                </span>
                <div style={{ fontSize: 12, color: "var(--text-4)", marginTop: 2 }}>
                  Expires {formatDate(inv.expiresAt)}
                </div>
              </div>
              <a
                href={`/invite/${inv.id}`}
                className="btn-primary"
                style={{ fontSize: 13, padding: "8px 16px" }}
              >
                View Invitation
              </a>
            </div>
          ))}
        </div>
      )}

      {/* Organizations */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-1)", margin: 0 }}>
            My Organizations
          </h2>
          <a href="/dashboard/create-org" className="btn-primary" style={{ fontSize: 13, padding: "8px 16px" }}>
            + Create Organization
          </a>
        </div>
        {memberships.length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: 40, color: "var(--text-4)" }}>
            You are not a member of any organization yet.
            <div style={{ marginTop: 8, fontSize: 13 }}>
              <a href="/dashboard/create-org" style={{ color: "var(--blue)", fontWeight: 600, textDecoration: "none" }}>Create one</a> or ask someone for an invite code.
            </div>
          </div>
        ) : (
          <div className="dashboard-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
            {memberships.map(m => {
              const orgType = getOrgType(m.orgType);
              return (
                <div key={m.orgId} className="card" style={{ padding: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "var(--text-1)" }}>{m.name}</div>
                    <span className={`badge ${ORG_TYPE_BADGE[orgType] ?? "badge-gray"}`} style={{ fontSize: 9 }}>
                      {ORG_TYPE_LABEL[orgType] ?? orgType}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <span className="badge badge-navy" style={{ fontSize: 10 }}>
                      {ROLE_LABEL[m.role] ?? m.role}
                    </span>
                    <span style={{ fontSize: 12, color: "var(--text-4)" }}>
                      Joined {formatDate(m.joinedAt)}
                    </span>
                  </div>
                  {["owner", "admin", "enterprise_admin", "carrier_owner", "shipper_admin", "forwarder_admin", "super_admin"].includes(m.role) && (
                    <a href={`/org/${m.orgId}`} style={{ fontSize: 13, color: "var(--blue)", fontWeight: 600, textDecoration: "none" }}>
                      Manage Organization →
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      {/* Account */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-1)", margin: 0, marginBottom: 16 }}>
          Account
        </h2>
        <div className="dashboard-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
          <a href="/dashboard/settings" className="card" style={{ padding: "18px 20px", textDecoration: "none", display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 20, lineHeight: 1 }}>&#9881;</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-1)" }}>Profile Settings</div>
              <div style={{ fontSize: 12, color: "var(--text-4)", marginTop: 2 }}>Name, email, avatar</div>
            </div>
          </a>
          <a href="/dashboard/settings/security" className="card" style={{ padding: "18px 20px", textDecoration: "none", display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 20, lineHeight: 1 }}>&#128274;</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-1)" }}>Security &amp; Sessions</div>
              <div style={{ fontSize: 12, color: "var(--text-4)", marginTop: 2 }}>Password, 2FA, active sessions</div>
            </div>
          </a>
          <a href="/dashboard/developer" className="card" style={{ padding: "18px 20px", textDecoration: "none", display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 20, lineHeight: 1 }}>&#128273;</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-1)" }}>Developer Tokens</div>
              <div style={{ fontSize: 12, color: "var(--text-4)", marginTop: 2 }}>API keys, personal tokens</div>
            </div>
          </a>
          <a href="/dashboard/delete-account" className="card" style={{ padding: "18px 20px", textDecoration: "none", display: "flex", alignItems: "center", gap: 12, borderColor: "#FCA5A5" }}>
            <span style={{ fontSize: 20, lineHeight: 1 }}>&#9888;</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#DC2626" }}>Delete Account</div>
              <div style={{ fontSize: 12, color: "#F87171", marginTop: 2 }}>Permanently remove your account</div>
            </div>
          </a>
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-1)", margin: 0, marginBottom: 16 }}>
          Recent Activity
        </h2>
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          {recentActivity.length === 0 ? (
            <div style={{ padding: "24px 20px", textAlign: "center", color: "var(--text-4)", fontSize: 13 }}>
              No recent activity.
            </div>
          ) : (
            recentActivity.map((entry, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "14px 20px",
                  borderBottom: i < recentActivity.length - 1 ? "1px solid var(--border)" : "none",
                }}
              >
                <span style={{ fontSize: 18, lineHeight: 1, width: 28, textAlign: "center" }}>
                  {activityIcon(entry.action)}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-1)" }}>
                    {entry.action}
                  </div>
                </div>
                <span style={{ fontSize: 12, color: "var(--text-4)", whiteSpace: "nowrap" }}>
                  {relativeTime(entry.createdAt)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
