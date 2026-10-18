import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { user, organization, member, session, auditLog } from "@/lib/db/schema";
import { count, eq, gte, sql, desc, like } from "drizzle-orm";
import { Users, Building2, Shield, Activity, BarChart3, type LucideIcon } from "lucide-react";

async function getStats() {
  const [totalUsers] = await db.select({ count: count() }).from(user);
  const [totalOrgs] = await db.select({ count: count() }).from(organization);
  const [totalMembers] = await db.select({ count: count() }).from(member);
  const [bannedUsers] = await db
    .select({ count: count() })
    .from(user)
    .where(eq(user.banned, true));
  const [superAdmins] = await db
    .select({ count: count() })
    .from(user)
    .where(eq(user.role, "super_admin"));

  // Active sessions in last 24h
  const since = new Date(Date.now() - 86400_000);
  const [activeSessions] = await db
    .select({ count: count() })
    .from(session)
    .where(gte(session.createdAt, since));

  return {
    totalUsers: totalUsers.count,
    totalOrgs: totalOrgs.count,
    totalMembers: totalMembers.count,
    bannedUsers: bannedUsers.count,
    superAdmins: superAdmins.count,
    activeSessions: activeSessions.count,
  };
}

async function getRecentUsers() {
  return db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      banned: user.banned,
      createdAt: user.createdAt,
    })
    .from(user)
    .orderBy(sql`${user.createdAt} desc`)
    .limit(8);
}

async function getRecentOrgs() {
  const orgs = await db
    .select({
      id: organization.id,
      name: organization.name,
      slug: organization.slug,
      orgType: organization.orgType,
      createdAt: organization.createdAt,
    })
    .from(organization)
    .orderBy(sql`${organization.createdAt} desc`)
    .limit(6);

  // member counts
  const counts = await db
    .select({ orgId: member.organizationId, count: count() })
    .from(member)
    .groupBy(member.organizationId);

  const countMap = Object.fromEntries(counts.map(c => [c.orgId, c.count]));

  return orgs.map(o => ({
    ...o,
    memberCount: countMap[o.id] ?? 0,
    type: o.orgType ?? "—",
  }));
}

function StatCard({
  label, value, sub, icon: Icon, color,
}: {
  label: string;
  value: number;
  sub?: string;
  icon: LucideIcon;
  color: string;
}) {
  return (
    <div className="card" style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
      <div style={{
        width: 44, height: 44,
        borderRadius: 10,
        background: `${color}18`,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        <Icon size={20} color={color} />
      </div>
      <div>
        <div style={{ fontSize: 26, fontWeight: 700, color: "var(--text-1)", lineHeight: 1.1 }}>
          {value.toLocaleString()}
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-2)", marginTop: 2 }}>{label}</div>
        {sub && <div style={{ fontSize: 12, color: "var(--text-4)", marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  );
}

const ORG_TYPE_BADGE: Record<string, string> = {
  tc_platform:    "badge-navy",
  enterprise_shipper:"badge-blue",
  msme_shipper:      "badge-green",
  carrier_fleet:     "badge-amber",
  freight_forwarder: "badge-purple",
  warehouse_operator:"badge-teal",
};
const ORG_TYPE_LABEL: Record<string, string> = {
  tc_platform:    "TruckConnect Platform",
  enterprise_shipper:"Enterprise Shipper",
  msme_shipper:      "MSME Shipper",
  carrier_fleet:     "Carrier Fleet",
  freight_forwarder: "Freight Forwarder",
  warehouse_operator:"Warehouse Operator",
};

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" });
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(date: Date): string {
  const now = Date.now();
  const diffMs = now - new Date(date).getTime();
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return `${diffSec} sec ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hr ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`;
}

function actionToIcon(action: string, targetType: string | null): "signup" | "org" | "role" | "ban" {
  const a = action.toLowerCase();
  if ((a.includes("signup") || a.includes("created")) && targetType?.toLowerCase() === "user") return "signup";
  if (a.includes("org")) return "org";
  if (a.includes("role")) return "role";
  if (a.includes("ban")) return "ban";
  return "signup";
}

const auditIconColor: Record<string, { bg: string; color: string }> = {
  signup: { bg: "#DBEAFE", color: "#2563EB" },
  org:    { bg: "#D1FAE5", color: "#059669" },
  role:   { bg: "#EDE9FE", color: "#7C3AED" },
  ban:    { bg: "#FEE2E2", color: "#DC2626" },
};

// ── Real data queries ────────────────────────────────────────────────────────

async function getRecentAuditLog() {
  const rows = await db
    .select({
      id: auditLog.id,
      action: auditLog.action,
      actorEmail: auditLog.actorEmail,
      targetType: auditLog.targetType,
      metadata: auditLog.metadata,
      createdAt: auditLog.createdAt,
    })
    .from(auditLog)
    .orderBy(desc(auditLog.createdAt))
    .limit(10);

  return rows.map((row) => {
    const meta = row.metadata as Record<string, string> | null;
    return {
      id: row.id,
      action: row.action,
      actor: row.actorEmail ?? "system",
      detail: meta?.detail ?? row.action,
      time: timeAgo(row.createdAt),
      icon: actionToIcon(row.action, row.targetType),
    };
  });
}

interface GrowthPoint { month: string; count: number }

async function getUserGrowth(): Promise<GrowthPoint[]> {
  const rows = await db.execute<{ month: string; count: number }>(
    sql`SELECT to_char(created_at, 'Mon') as month, count(*)::int as count
        FROM "user"
        WHERE created_at > now() - interval '6 months'
        GROUP BY to_char(created_at, 'Mon'), date_trunc('month', created_at)
        ORDER BY date_trunc('month', created_at)`
  );
  const data = Array.isArray(rows) ? rows : (rows as { rows?: unknown[] }).rows ?? [];
  return (data as { month: unknown; count: unknown }[]).map((r) => ({ month: String(r.month).trim(), count: Number(r.count) }));
}

export default async function AdminOverviewPage() {
  const [stats, recentUsers, recentOrgs, recentAuditLog, userGrowth] = await Promise.all([
    getStats(),
    getRecentUsers(),
    getRecentOrgs(),
    getRecentAuditLog(),
    getUserGrowth(),
  ]);

  const maxGrowth = Math.max(...userGrowth.map((g: { month: string; count: number }) => g.count), 1);

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1200 }}>
      {/* Header */}
      <div style={{ marginBottom: 28, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-1)" }}>Platform Overview</h1>
          <p style={{ fontSize: 14, color: "var(--text-3)", marginTop: 4 }}>
            TruckConnect Auth — users, organizations, and role assignments
          </p>
        </div>
        {/* System Health Indicator */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "8px 16px", borderRadius: 8,
          background: "#F0FDF4", border: "1px solid #BBF7D0",
        }}>
          <div style={{
            width: 10, height: 10, borderRadius: "50%",
            background: "#22C55E",
            boxShadow: "0 0 6px #22C55E80",
          }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: "#16A34A" }}>All systems operational</span>
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
        <StatCard label="Total Users"       value={stats.totalUsers}     icon={Users}     color="#2563EB" sub={`${stats.superAdmins} super admins`} />
        <StatCard label="Organizations"     value={stats.totalOrgs}      icon={Building2} color="#059669" />
        <StatCard label="Active Sessions"   value={stats.activeSessions} icon={Activity}  color="#D97706" sub="Last 24 hours" />
      </div>

      {/* User Growth Chart */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-1)", display: "flex", alignItems: "center", gap: 8 }}>
              <BarChart3 size={16} color="var(--blue)" /> User Growth
            </h2>
            <p style={{ fontSize: 12, color: "var(--text-4)", marginTop: 2 }}>New user signups per month (last 6 months)</p>
          </div>
          <div style={{ fontSize: 13, color: "var(--text-3)" }}>
            Total: <span style={{ fontWeight: 700, color: "var(--text-1)" }}>{userGrowth.reduce((s: number, g: { count: number }) => s + g.count, 0)}</span> new users
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 140, paddingBottom: 28, position: "relative" }}>
          {/* Y-axis line */}
          <div style={{ position: "absolute", left: 0, bottom: 28, top: 0, width: 1, background: "var(--border)" }} />
          {userGrowth.map((g) => {
            const height = Math.max((g.count / maxGrowth) * 110, 8);
            return (
              <div key={g.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-1)" }}>{g.count}</div>
                <div style={{
                  width: "100%", maxWidth: 56, height, borderRadius: "6px 6px 0 0",
                  background: g.month === "Mar" ? "var(--blue)" : "#DBEAFE",
                  transition: "height 0.3s ease",
                }} />
                <div style={{
                  fontSize: 11, fontWeight: 600,
                  color: g.month === "Mar" ? "var(--blue)" : "var(--text-4)",
                }}>{g.month}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two-column layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>

        {/* Recent Users */}
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-1)" }}>Recent Users</h2>
            <a href="/admin/users" style={{ fontSize: 13, color: "var(--blue)", fontWeight: 500, textDecoration: "none" }}>View all &rarr;</a>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.length === 0 && (
                  <tr><td colSpan={3} style={{ color: "var(--text-4)", textAlign: "center", padding: "24px" }}>No users yet</td></tr>
                )}
                {recentUsers.map(u => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: "var(--text-1)", fontSize: 13 }}>{u.name}</div>
                      <div style={{ fontSize: 12, color: "var(--text-4)" }}>{u.email}</div>
                    </td>
                    <td>
                      {u.banned ? (
                        <span className="badge badge-red">Banned</span>
                      ) : u.role === "super_admin" ? (
                        <span className="badge badge-navy">Super Admin</span>
                      ) : (
                        <span className="badge badge-gray">User</span>
                      )}
                    </td>
                    <td style={{ fontSize: 12, color: "var(--text-4)" }}>{formatDate(u.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Organizations */}
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-1)" }}>Organizations</h2>
            <a href="/admin/organizations" style={{ fontSize: 13, color: "var(--blue)", fontWeight: 500, textDecoration: "none" }}>View all &rarr;</a>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Organization</th>
                  <th>Type</th>
                  <th>Members</th>
                </tr>
              </thead>
              <tbody>
                {recentOrgs.length === 0 && (
                  <tr><td colSpan={3} style={{ color: "var(--text-4)", textAlign: "center", padding: "24px" }}>No organizations yet</td></tr>
                )}
                {recentOrgs.map(o => (
                  <tr key={o.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: "var(--text-1)", fontSize: 13 }}>{o.name}</div>
                      <div style={{ fontSize: 12, color: "var(--text-4)" }}>/{o.slug ?? o.id.slice(0, 8)}</div>
                    </td>
                    <td>
                      <span className={`badge ${ORG_TYPE_BADGE[o.type] ?? "badge-gray"}`} style={{ fontSize: 10 }}>
                        {ORG_TYPE_LABEL[o.type] ?? o.type}
                      </span>
                    </td>
                    <td style={{ fontSize: 13, fontWeight: 600, color: "var(--text-2)" }}>{o.memberCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Activity Feed + Marketplace Review Queue */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>

        {/* Recent Activity Feed */}
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-1)" }}>Recent Activity</h2>
            <p style={{ fontSize: 12, color: "var(--text-4)", marginTop: 2 }}>Last 10 audit log entries</p>
          </div>
          <div style={{ maxHeight: 420, overflowY: "auto" }}>
            {recentAuditLog.map((entry) => {
              const ic = auditIconColor[entry.icon];
              return (
                <div key={entry.id} style={{
                  display: "flex", alignItems: "flex-start", gap: 12,
                  padding: "12px 20px", borderBottom: "1px solid var(--border)",
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: ic.bg, display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, marginTop: 2,
                  }}>
                    {entry.icon === "signup" && <Users size={14} color={ic.color} />}
                    {entry.icon === "org" && <Building2 size={14} color={ic.color} />}
                    {entry.icon === "role" && <Shield size={14} color={ic.color} />}
                    {entry.icon === "ban" && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={ic.color} strokeWidth="2">
                        <circle cx="12" cy="12" r="10" /><path d="M4.93 4.93l14.14 14.14" />
                      </svg>
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)" }}>{entry.action}</span>
                      <span style={{ fontSize: 11, color: "var(--text-4)", flexShrink: 0, marginLeft: 8 }}>{entry.time}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 2 }}>{entry.detail}</div>
                    <div style={{ fontSize: 11, color: "var(--text-4)", marginTop: 2, fontFamily: "monospace" }}>{entry.actor}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Banned users warning */}
      {stats.bannedUsers > 0 && (
        <div style={{
          marginTop: 24,
          padding: "12px 16px",
          background: "#FEF2F2",
          border: "1px solid #FECACA",
          borderRadius: 10,
          fontSize: 13,
          color: "#991B1B",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#DC2626" strokeWidth="2"/>
            <path d="M12 9v4M12 17h.01" stroke="#DC2626" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          {stats.bannedUsers} banned user{stats.bannedUsers > 1 ? "s" : ""} on the platform.{" "}
          <a href="/admin/users?filter=banned" style={{ color: "#DC2626", fontWeight: 600 }}>Review &rarr;</a>
        </div>
      )}
    </div>
  );
}
