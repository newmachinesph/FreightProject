"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

interface MemberRow {
  memberId: string;
  userId: string;
  role: string;
  joinedAt: Date;
  name: string;
  email: string;
  image: string | null;
  banned: boolean | null;
}

interface Props {
  orgId: string;
  members: MemberRow[];
  callerUserId: string;
  callerRole: string;
  isAdmin: boolean;
}

const ROLE_OPTIONS = [
  { value: "member", label: "Member" },
  { value: "viewer", label: "Viewer" },
  { value: "booker", label: "Booker" },
  { value: "agent", label: "Agent" },
  { value: "dispatcher", label: "Dispatcher" },
  { value: "driver", label: "Driver" },
  { value: "enterprise_admin", label: "Enterprise Admin" },
  { value: "carrier_owner", label: "Carrier Owner" },
  { value: "shipper_admin", label: "Shipper Admin" },
  { value: "forwarder_admin", label: "Forwarder Admin" },
  { value: "admin", label: "Admin" },
];

const ROLE_BADGE: Record<string, string> = {
  owner: "badge-navy", admin: "badge-navy", super_admin: "badge-navy",
  enterprise_admin: "badge-blue", carrier_owner: "badge-amber",
  shipper_admin: "badge-blue", forwarder_admin: "badge-purple",
  member: "badge-gray", viewer: "badge-gray",
  booker: "badge-green", agent: "badge-green",
  dispatcher: "badge-green", driver: "badge-green",
};

const ROLE_LABEL: Record<string, string> = {
  owner: "Owner", admin: "Admin", super_admin: "Super Admin",
  enterprise_admin: "Enterprise Admin", carrier_owner: "Carrier Owner",
  shipper_admin: "Shipper Admin", forwarder_admin: "Forwarder Admin",
  member: "Member", viewer: "Viewer",
  booker: "Booker", agent: "Agent",
  dispatcher: "Dispatcher", driver: "Driver",
};

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" });
}

export default function OrgMembersClient({ orgId, members, callerUserId, callerRole, isAdmin }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState<string | null>(null); // memberId being acted on
  const [error, setError] = useState("");

  // Invite modal
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteMsg, setInviteMsg] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return members;
    const q = query.toLowerCase();
    return members.filter(m => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q));
  }, [members, query]);

  async function handleRemove(m: MemberRow) {
    if (!confirm(`Remove ${m.name} from this organization?`)) return;
    setLoading(m.memberId); setError("");
    const { error: err } = await authClient.organization.removeMember({
      organizationId: orgId,
      memberIdOrEmail: m.userId,
    });
    setLoading(null);
    if (err) { setError(err.message ?? "Failed to remove member."); return; }
    router.refresh();
  }

  async function handleRoleChange(m: MemberRow, newRole: string) {
    setLoading(m.memberId); setError("");
    const { error: err } = await authClient.organization.updateMemberRole({
      organizationId: orgId,
      memberId: m.memberId,
      role: newRole as Parameters<typeof authClient.organization.updateMemberRole>[0]["role"],
    });
    setLoading(null);
    if (err) { setError(err.message ?? "Failed to update role."); return; }
    router.refresh();
  }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setInviteMsg(""); setInviteLoading(true);
    const { error: err } = await authClient.organization.inviteMember({
      organizationId: orgId,
      email: inviteEmail,
      role: inviteRole as Parameters<typeof authClient.organization.inviteMember>[0]["role"],
    });
    setInviteLoading(false);
    if (err) { setInviteMsg("Error: " + (err.message ?? "Failed to send invite.")); return; }
    setInviteMsg(`Invitation sent to ${inviteEmail}!`);
    setInviteEmail("");
    router.refresh();
  }

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1100 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-1)" }}>Members</h1>
          <p style={{ fontSize: 14, color: "var(--text-3)", marginTop: 4 }}>
            {members.length} member{members.length !== 1 ? "s" : ""}
          </p>
        </div>
        {isAdmin && (
          <button className="btn-primary" onClick={() => { setInviteOpen(true); setInviteMsg(""); }}>
            + Invite Member
          </button>
        )}
      </div>

      {error && (
        <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#DC2626", marginBottom: 16 }}>
          {error}
        </div>
      )}

      {/* Search */}
      <div style={{ marginBottom: 16 }}>
        <input
          className="field"
          style={{ maxWidth: 320 }}
          placeholder="Search members…"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Member</th>
                <th>Role</th>
                <th>Joined</th>
                {isAdmin && <th></th>}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={isAdmin ? 4 : 3} style={{ textAlign: "center", color: "var(--text-4)", padding: "40px" }}>
                    {query ? `No members matching "${query}"` : "No members yet."}
                  </td>
                </tr>
              )}
              {filtered.map(m => {
                const isLoading = loading === m.memberId;
                const isSelf = m.userId === callerUserId;
                return (
                  <tr key={m.memberId} style={{ opacity: isLoading ? 0.5 : 1 }}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        {m.image ? (
                          <img src={m.image} alt="" style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }} />
                        ) : (
                          <div style={{
                            width: 32, height: 32, borderRadius: "50%",
                            background: "var(--navy)", color: "#fff",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 13, fontWeight: 700, flexShrink: 0,
                          }}>
                            {m.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13, color: "var(--text-1)" }}>
                            {m.name}
                            {isSelf && <span style={{ fontSize: 11, color: "var(--text-4)", marginLeft: 6 }}>(you)</span>}
                          </div>
                          <div style={{ fontSize: 12, color: "var(--text-4)" }}>{m.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      {isAdmin && !isSelf ? (
                        <select
                          className="field"
                          style={{ padding: "5px 8px", fontSize: 12, width: "auto", cursor: "pointer" }}
                          value={m.role}
                          disabled={isLoading}
                          onChange={e => handleRoleChange(m, e.target.value)}
                        >
                          {ROLE_OPTIONS.map(r => (
                            <option key={r.value} value={r.value}>{r.label}</option>
                          ))}
                        </select>
                      ) : (
                        <span className={`badge ${ROLE_BADGE[m.role] ?? "badge-gray"}`} style={{ fontSize: 10 }}>
                          {ROLE_LABEL[m.role] ?? m.role}
                        </span>
                      )}
                    </td>
                    <td style={{ fontSize: 12, color: "var(--text-4)" }}>{formatDate(m.joinedAt)}</td>
                    {isAdmin && (
                      <td>
                        {!isSelf && (
                          <button
                            className="btn-danger"
                            style={{ fontSize: 12, padding: "5px 12px" }}
                            disabled={isLoading}
                            onClick={() => handleRemove(m)}
                          >
                            Remove
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite modal */}
      {inviteOpen && (
        <div style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 100, padding: 24,
        }} onClick={e => e.target === e.currentTarget && setInviteOpen(false)}>
          <div className="card animate-in" style={{ width: "100%", maxWidth: 400, padding: 28 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Invite Member</h2>
            <p style={{ fontSize: 13, color: "var(--text-3)", marginBottom: 24 }}>
              Send an invitation email. The invite expires in 48 hours.
            </p>
            <form onSubmit={handleInvite}>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-2)", marginBottom: 6 }}>
                    Email Address
                  </label>
                  <input
                    className="field"
                    type="email"
                    placeholder="member@example.com"
                    value={inviteEmail}
                    onChange={e => setInviteEmail(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-2)", marginBottom: 6 }}>
                    Role
                  </label>
                  <select
                    className="field"
                    value={inviteRole}
                    onChange={e => setInviteRole(e.target.value)}
                  >
                    {ROLE_OPTIONS.map(r => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                </div>
                {inviteMsg && (
                  <div style={{
                    background: inviteMsg.startsWith("Error") ? "#FEF2F2" : "#D1FAE5",
                    border: `1px solid ${inviteMsg.startsWith("Error") ? "#FECACA" : "#6EE7B7"}`,
                    borderRadius: 8, padding: "10px 14px", fontSize: 13,
                    color: inviteMsg.startsWith("Error") ? "#DC2626" : "#065F46",
                  }}>
                    {inviteMsg}
                  </div>
                )}
                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                  <button type="button" className="btn-ghost" onClick={() => setInviteOpen(false)}>Close</button>
                  <button type="submit" className="btn-primary" disabled={inviteLoading}>
                    {inviteLoading ? "Sending…" : "Send Invitation"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
