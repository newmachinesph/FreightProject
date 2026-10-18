import { db } from "@/lib/db";
import { session, user } from "@/lib/db/schema";
import { eq, sql, desc } from "drizzle-orm";

async function getActiveSessions() {
  return db
    .select({
      id: session.id,
      userId: session.userId,
      userName: user.name,
      userEmail: user.email,
      ipAddress: session.ipAddress,
      userAgent: session.userAgent,
      createdAt: session.createdAt,
      expiresAt: session.expiresAt,
    })
    .from(session)
    .innerJoin(user, eq(session.userId, user.id))
    .where(sql`${session.expiresAt} > NOW()`)
    .orderBy(desc(session.createdAt))
    .limit(50);
}

function formatDate(d: Date) {
  return new Date(d).toLocaleString("en-PH", {
    month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function formatIP(ip: string | null): string {
  if (!ip) return "—";
  // IPv6 loopback — ::1 or its fully-expanded form
  if (ip === "::1") return "127.0.0.1";
  if (/^0+:0+:0+:0+:0+:0+:0+:0+1$/.test(ip)) return "127.0.0.1";
  // All-zero IPv6 (unspecified address)
  if (/^[0:]+$/.test(ip)) return "127.0.0.1";
  // IPv4-mapped IPv6 ::ffff:a.b.c.d
  const v4mapped = ip.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/i);
  if (v4mapped) return v4mapped[1];
  return ip;
}

function parseUA(ua: string | null) {
  if (!ua) return "Unknown";
  if (/python-requests/i.test(ua)) return "API / Script";
  if (ua.includes("Mobile")) return "Mobile Browser";
  if (ua.includes("Edg/")) return "Edge";
  if (ua.includes("Chrome")) return "Chrome";
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Safari")) return "Safari";
  return "Browser";
}

export default async function ActivityPage() {
  const sessions = await getActiveSessions();

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1200 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-1)" }}>Activity</h1>
        <p style={{ fontSize: 14, color: "var(--text-3)", marginTop: 4 }}>
          {sessions.length} active session{sessions.length !== 1 ? "s" : ""} right now
        </p>
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>IP Address</th>
                <th>Client</th>
                <th>Started</th>
                <th>Expires</th>
              </tr>
            </thead>
            <tbody>
              {sessions.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", color: "var(--text-4)", padding: "40px" }}>
                    No active sessions
                  </td>
                </tr>
              )}
              {sessions.map(s => (
                <tr key={s.id}>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: 13, color: "var(--text-1)" }}>{s.userName}</div>
                    <div style={{ fontSize: 12, color: "var(--text-4)" }}>{s.userEmail}</div>
                  </td>
                  <td style={{ fontSize: 13, fontFamily: "monospace", color: "var(--text-3)" }}>
                    {formatIP(s.ipAddress)}
                  </td>
                  <td>
                    <span className="badge badge-gray">{parseUA(s.userAgent)}</span>
                  </td>
                  <td style={{ fontSize: 12, color: "var(--text-4)" }}>{formatDate(s.createdAt)}</td>
                  <td style={{ fontSize: 12, color: "var(--text-4)" }}>{formatDate(s.expiresAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
