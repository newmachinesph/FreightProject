"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface InviteCode {
  id: string;
  code: string;
  role: string;
  maxUses: number | null;
  usedCount: number;
  expiresAt: Date | string | null;
  revokedAt: Date | string | null;
  createdAt: Date | string;
}

const ROLE_OPTIONS = [
  { value: "member", label: "Member" },
  { value: "viewer", label: "Viewer" },
  { value: "booker", label: "Booker" },
  { value: "driver", label: "Driver" },
  { value: "dispatcher", label: "Dispatcher" },
  { value: "agent", label: "Agent" },
  { value: "enterprise_admin", label: "Enterprise Admin" },
  { value: "carrier_owner", label: "Carrier Owner" },
  { value: "shipper_admin", label: "Shipper Admin" },
  { value: "forwarder_admin", label: "Forwarder Admin" },
  { value: "warehouse_admin", label: "Warehouse Admin" },
  { value: "warehouse_manager", label: "Warehouse Manager" },
  { value: "warehouse_staff", label: "Warehouse Staff" },
  { value: "warehouse_viewer", label: "Warehouse Viewer" },
];

function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString("en-PH", {
    month: "short", day: "numeric", year: "numeric",
  });
}

export default function OrgInviteCodesClient({ orgId, initialCodes }: { orgId: string; initialCodes: InviteCode[] }) {
  const router = useRouter();
  const [codes, setCodes] = useState(initialCodes);
  const [showCreate, setShowCreate] = useState(false);
  const [role, setRole] = useState("member");
  const [customCode, setCustomCode] = useState("");
  const [maxUses, setMaxUses] = useState("");
  const [expiresInDays, setExpiresInDays] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const active = codes.filter(c => !c.revokedAt && (!c.expiresAt || new Date(c.expiresAt) > new Date()) && (c.maxUses === null || c.usedCount < c.maxUses));
  const inactive = codes.filter(c => !active.includes(c));

  async function handleCreate() {
    setCreating(true);
    setError("");
    const r = await fetch(`/api/org/${orgId}/invite-codes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        role,
        code: customCode || undefined,
        maxUses: maxUses || undefined,
        expiresInDays: expiresInDays || undefined,
      }),
    });
    const data = await r.json();
    if (r.ok) {
      setShowCreate(false);
      setCustomCode("");
      setMaxUses("");
      setExpiresInDays("");
      router.refresh();
      // Optimistic update
      setCodes(prev => [...prev, { ...data, usedCount: 0, revokedAt: null }]);
    } else {
      setError(data.error || "Failed to create");
    }
    setCreating(false);
  }

  async function handleRevoke(id: string) {
    if (!confirm("Revoke this invite code? Users will no longer be able to use it.")) return;
    const r = await fetch(`/api/org/${orgId}/invite-codes`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (r.ok) {
      setCodes(prev => prev.map(c => c.id === id ? { ...c, revokedAt: new Date().toISOString() } : c));
    }
  }

  function copyLink(code: string, id: string) {
    const url = `${window.location.origin}/join/${code}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div style={{ padding: "28px 32px", maxWidth: 900 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-1)" }}>Invite Codes</h1>
          <p style={{ fontSize: 13, color: "var(--text-3)", marginTop: 4 }}>
            Create shareable codes for users to join this organization
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowCreate(true)}>+ Create Code</button>
      </div>

      {/* Create modal */}
      {showCreate && (
        <div className="card" style={{ padding: 24, marginBottom: 20, border: "2px solid var(--blue)" }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-1)", marginBottom: 16 }}>Create Invite Code</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-3)", marginBottom: 4 }}>Role on Join</label>
              <select className="field" value={role} onChange={e => setRole(e.target.value)}>
                {ROLE_OPTIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-3)", marginBottom: 4 }}>Custom Code (optional)</label>
              <input className="field" placeholder="Auto-generated if empty" value={customCode} onChange={e => setCustomCode(e.target.value.toUpperCase())} maxLength={20} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-3)", marginBottom: 4 }}>Max Uses (optional)</label>
              <input className="field" type="number" placeholder="Unlimited" value={maxUses} onChange={e => setMaxUses(e.target.value)} min="1" />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-3)", marginBottom: 4 }}>Expires In (days, optional)</label>
              <input className="field" type="number" placeholder="Never" value={expiresInDays} onChange={e => setExpiresInDays(e.target.value)} min="1" />
            </div>
          </div>
          {error && <div style={{ color: "#DC2626", fontSize: 13, marginTop: 10 }}>{error}</div>}
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <button className="btn-primary" onClick={handleCreate} disabled={creating}>
              {creating ? "Creating..." : "Create"}
            </button>
            <button className="btn-ghost" onClick={() => setShowCreate(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Active codes */}
      {active.length > 0 && (
        <div className="card" style={{ padding: 0, overflow: "hidden", marginBottom: 20 }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)" }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-1)", margin: 0 }}>Active ({active.length})</h3>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Code</th><th>Role</th><th>Usage</th><th>Expires</th><th></th></tr></thead>
              <tbody>
                {active.map(c => (
                  <tr key={c.id}>
                    <td>
                      <code style={{ fontSize: 14, fontWeight: 700, color: "var(--text-1)", letterSpacing: 1.5 }}>{c.code}</code>
                    </td>
                    <td><span className="badge badge-blue" style={{ fontSize: 10 }}>{c.role}</span></td>
                    <td style={{ fontSize: 13 }}>{c.usedCount}{c.maxUses ? ` / ${c.maxUses}` : ""}</td>
                    <td style={{ fontSize: 12, color: "var(--text-4)" }}>{c.expiresAt ? formatDate(c.expiresAt) : "Never"}</td>
                    <td>
                      <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                        <button className="btn-ghost" style={{ padding: "4px 10px", fontSize: 11 }} onClick={() => copyLink(c.code, c.id)}>
                          {copiedId === c.id ? "Copied!" : "Copy Link"}
                        </button>
                        <button className="btn-danger" style={{ padding: "4px 10px", fontSize: 11 }} onClick={() => handleRevoke(c.id)}>
                          Revoke
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inactive codes */}
      {inactive.length > 0 && (
        <details style={{ marginTop: 16 }}>
          <summary style={{ fontSize: 13, color: "var(--text-4)", cursor: "pointer", marginBottom: 8 }}>
            {inactive.length} expired/revoked code{inactive.length !== 1 ? "s" : ""}
          </summary>
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Code</th><th>Role</th><th>Usage</th><th>Status</th></tr></thead>
                <tbody>
                  {inactive.map(c => (
                    <tr key={c.id} style={{ opacity: 0.6 }}>
                      <td><code style={{ fontSize: 13 }}>{c.code}</code></td>
                      <td><span className="badge badge-gray" style={{ fontSize: 10 }}>{c.role}</span></td>
                      <td style={{ fontSize: 13 }}>{c.usedCount}{c.maxUses ? ` / ${c.maxUses}` : ""}</td>
                      <td>{c.revokedAt ? <span className="badge badge-red" style={{ fontSize: 10 }}>Revoked</span> : <span className="badge badge-amber" style={{ fontSize: 10 }}>Expired</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </details>
      )}

      {active.length === 0 && inactive.length === 0 && (
        <div className="card" style={{ padding: 40, textAlign: "center", color: "var(--text-4)" }}>
          <p style={{ fontSize: 14, marginBottom: 8 }}>No invite codes yet</p>
          <p style={{ fontSize: 13 }}>Create one to let users join this organization with a shareable link.</p>
        </div>
      )}
    </div>
  );
}
