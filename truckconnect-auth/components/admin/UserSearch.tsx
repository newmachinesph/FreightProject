"use client";

import { useState, useMemo } from "react";
import UserActions from "./UserActions";

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string | null;
  banned: boolean | null;
  banReason: string | null;
  emailVerified: boolean;
  createdAt: Date;
}

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString("en-PH", {
    month: "short", day: "numeric", year: "numeric",
  });
}

export default function UserSearch({ users, currentUserId }: { users: UserRow[]; currentUserId: string }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "admin" | "banned">("all");

  const filtered = useMemo(() => {
    let list = users;
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(u =>
        u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      );
    }
    if (filter === "admin") list = list.filter(u => u.role === "super_admin");
    if (filter === "banned") list = list.filter(u => u.banned);
    return list;
  }, [users, query, filter]);

  return (
    <>
      {/* Search / filter bar */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, alignItems: "center" }}>
        <input
          className="field"
          style={{ maxWidth: 320 }}
          placeholder="Search by name or email…"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <div style={{ display: "flex", gap: 6 }}>
          {(["all", "admin", "banned"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "6px 14px",
                borderRadius: 8,
                border: "1.5px solid",
                borderColor: filter === f ? "var(--navy)" : "var(--border)",
                background: filter === f ? "var(--navy)" : "transparent",
                color: filter === f ? "#fff" : "var(--text-3)",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {f === "all" ? `All (${users.length})` : f === "admin" ? "Admins" : "Banned"}
            </button>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Platform Role</th>
                <th>Email Verified</th>
                <th>Status</th>
                <th>Joined</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", color: "var(--text-4)", padding: "40px" }}>
                    {query ? `No users matching "${query}"` : "No users yet."}
                  </td>
                </tr>
              )}
              {filtered.map(u => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 32, height: 32,
                        borderRadius: "50%",
                        background: "var(--navy)",
                        color: "#fff",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 13, fontWeight: 700, flexShrink: 0,
                      }}>
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <a href={`/admin/users/${u.id}`} style={{ textDecoration: "none" }}>
                        <div style={{ fontWeight: 600, fontSize: 13, color: "var(--blue)" }}>{u.name}</div>
                        <div style={{ fontSize: 12, color: "var(--text-4)" }}>{u.email}</div>
                      </a>
                    </div>
                  </td>
                  <td>
                    {u.role === "super_admin" ? (
                      <span className="badge badge-navy">Super Admin</span>
                    ) : (
                      <span className="badge badge-gray">User</span>
                    )}
                  </td>
                  <td>
                    {u.emailVerified ? (
                      <span className="badge badge-green">Verified</span>
                    ) : (
                      <span className="badge badge-amber">Pending</span>
                    )}
                  </td>
                  <td>
                    {u.banned ? (
                      <span className="badge badge-red" title={u.banReason ?? ""}>Banned</span>
                    ) : (
                      <span className="badge badge-green">Active</span>
                    )}
                  </td>
                  <td style={{ fontSize: 12, color: "var(--text-4)" }}>{formatDate(u.createdAt)}</td>
                  <td>
                    <UserActions userId={u.id} isBanned={!!u.banned} isAdmin={u.role === "super_admin"} isSelf={u.id === currentUserId} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
