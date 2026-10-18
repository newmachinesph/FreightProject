"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface KeyRow {
  id: string;
  name: string;
  prefix: string;
  expiresAt: Date | null;
  lastUsedAt: Date | null;
  revokedAt: Date | null;
  createdAt: Date;
}

interface Props {
  orgId: string;
  keys: KeyRow[];
}

function formatDate(d: Date | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" });
}

function isExpired(d: Date | null) {
  return d ? new Date(d) < new Date() : false;
}

export default function OrgApiKeysClient({ orgId, keys }: Props) {
  const router = useRouter();

  // Create modal
  const [createOpen, setCreateOpen] = useState(false);
  const [keyName, setKeyName] = useState("");
  const [expiresInDays, setExpiresInDays] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  // Revealed key (shown once after creation)
  const [revealed, setRevealed] = useState<{ name: string; plaintext: string; prefix: string } | null>(null);
  const [copied, setCopied] = useState(false);

  // Revoke
  const [revoking, setRevoking] = useState<string | null>(null);
  const [revokeError, setRevokeError] = useState("");

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreateError("");
    setCreating(true);

    const res = await fetch(`/api/org/${orgId}/keys`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: keyName,
        ...(expiresInDays ? { expiresInDays: Number(expiresInDays) } : {}),
      }),
    });

    setCreating(false);

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      setCreateError(err.error ?? "Failed to create key.");
      return;
    }

    const data = await res.json();
    setCreateOpen(false);
    setKeyName("");
    setExpiresInDays("");
    setRevealed({ name: data.name, plaintext: data.plaintext, prefix: data.prefix });
    router.refresh();
  }

  async function handleRevoke(keyId: string, name: string) {
    if (!confirm(`Revoke key "${name}"? Any integration using it will immediately stop working.`)) return;
    setRevoking(keyId);
    setRevokeError("");

    const res = await fetch(`/api/org/${orgId}/keys/${keyId}`, { method: "DELETE" });
    setRevoking(null);

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      setRevokeError(err.error ?? "Failed to revoke.");
      return;
    }
    router.refresh();
  }

  function handleCopy() {
    if (!revealed) return;
    navigator.clipboard.writeText(revealed.plaintext);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const activeKeys  = keys.filter(k => !k.revokedAt && !isExpired(k.expiresAt));
  const inactiveKeys = keys.filter(k => k.revokedAt || isExpired(k.expiresAt));

  return (
    <div style={{ padding: "28px 32px", maxWidth: 900 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-1)" }}>API Keys</h1>
          <p style={{ fontSize: 14, color: "var(--text-3)", marginTop: 4 }}>
            {activeKeys.length} active key{activeKeys.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button className="btn-primary" onClick={() => { setCreateOpen(true); setCreateError(""); }}>
          + New API Key
        </button>
      </div>

      {/* Info box */}
      <div style={{
        background: "#EFF6FF", border: "1px solid #BFDBFE",
        borderRadius: 10, padding: "14px 18px", marginBottom: 24,
        fontSize: 13, color: "#1D4ED8", lineHeight: 1.6,
      }}>
        <strong>How to authenticate:</strong> Pass the key in the <code>Authorization</code> header of every API request:
        <pre style={{ margin: "8px 0 0", fontSize: 12, background: "#DBEAFE", borderRadius: 6, padding: "8px 12px", overflowX: "auto" }}>
          {`Authorization: Bearer tc_live_xxxxxxxx…`}
        </pre>
        Keys are scoped to this organization. Only platform admins and org admins can manage them.
      </div>

      {revokeError && (
        <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#DC2626", marginBottom: 16 }}>
          {revokeError}
        </div>
      )}

      {/* Active keys */}
      {activeKeys.length === 0 && inactiveKeys.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: 48, color: "var(--text-4)" }}>
          No API keys yet.
          <div style={{ fontSize: 13, marginTop: 8 }}>
            Create a key to allow external integrations to authenticate as this organization.
          </div>
        </div>
      ) : (
        <>
          {activeKeys.length > 0 && (
            <div className="card" style={{ padding: 0, overflow: "hidden", marginBottom: 20 }}>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Key (prefix)</th>
                      <th>Last Used</th>
                      <th>Expires</th>
                      <th>Created</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeKeys.map(k => (
                      <tr key={k.id} style={{ opacity: revoking === k.id ? 0.5 : 1 }}>
                        <td style={{ fontWeight: 600, fontSize: 13, color: "var(--text-1)" }}>{k.name}</td>
                        <td>
                          <code style={{
                            fontSize: 12, background: "var(--bg)",
                            padding: "2px 8px", borderRadius: 6,
                            color: "var(--text-2)", letterSpacing: "0.03em",
                          }}>
                            {k.prefix}
                          </code>
                        </td>
                        <td style={{ fontSize: 12, color: "var(--text-4)" }}>{formatDate(k.lastUsedAt)}</td>
                        <td style={{ fontSize: 12, color: "var(--text-4)" }}>
                          {k.expiresAt ? formatDate(k.expiresAt) : <span style={{ color: "var(--green)" }}>Never</span>}
                        </td>
                        <td style={{ fontSize: 12, color: "var(--text-4)" }}>{formatDate(k.createdAt)}</td>
                        <td>
                          <button
                            className="btn-danger"
                            style={{ fontSize: 12, padding: "4px 12px" }}
                            disabled={revoking === k.id}
                            onClick={() => handleRevoke(k.id, k.name)}
                          >
                            Revoke
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Revoked / expired keys */}
          {inactiveKeys.length > 0 && (
            <details>
              <summary style={{ fontSize: 13, color: "var(--text-4)", cursor: "pointer", marginBottom: 10 }}>
                {inactiveKeys.length} revoked / expired key{inactiveKeys.length !== 1 ? "s" : ""}
              </summary>
              <div className="card" style={{ padding: 0, overflow: "hidden", marginTop: 8 }}>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Key (prefix)</th>
                        <th>Status</th>
                        <th>Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inactiveKeys.map(k => (
                        <tr key={k.id} style={{ opacity: 0.5 }}>
                          <td style={{ fontSize: 13, color: "var(--text-1)" }}>{k.name}</td>
                          <td>
                            <code style={{ fontSize: 12, color: "var(--text-4)" }}>{k.prefix}</code>
                          </td>
                          <td>
                            <span className="badge badge-red" style={{ fontSize: 10 }}>
                              {k.revokedAt ? "Revoked" : "Expired"}
                            </span>
                          </td>
                          <td style={{ fontSize: 12, color: "var(--text-4)" }}>{formatDate(k.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </details>
          )}
        </>
      )}

      {/* Create modal */}
      {createOpen && (
        <div style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 100, padding: 24,
        }} onClick={e => e.target === e.currentTarget && setCreateOpen(false)}>
          <div className="card animate-in" style={{ width: "100%", maxWidth: 420, padding: 28 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>New API Key</h2>
            <p style={{ fontSize: 13, color: "var(--text-3)", marginBottom: 24 }}>
              The key will be shown <strong>once</strong>. Copy and store it securely — you cannot retrieve it again.
            </p>
            <form onSubmit={handleCreate}>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-2)", marginBottom: 6 }}>
                    Key Name
                  </label>
                  <input
                    className="field"
                    placeholder="e.g. Production ERP, Carrier App"
                    value={keyName}
                    onChange={e => setKeyName(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-2)", marginBottom: 6 }}>
                    Expires After (days) <span style={{ fontWeight: 400, color: "var(--text-4)" }}>— leave blank for never</span>
                  </label>
                  <input
                    className="field"
                    type="number"
                    min="1"
                    max="3650"
                    placeholder="e.g. 365"
                    value={expiresInDays}
                    onChange={e => setExpiresInDays(e.target.value)}
                    style={{ maxWidth: 160 }}
                  />
                </div>
                {createError && (
                  <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#DC2626" }}>
                    {createError}
                  </div>
                )}
                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                  <button type="button" className="btn-ghost" onClick={() => setCreateOpen(false)}>Cancel</button>
                  <button type="submit" className="btn-primary" disabled={creating}>
                    {creating ? "Generating…" : "Generate Key"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Revealed key modal — shown ONCE after creation */}
      {revealed && (
        <div style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 200, padding: 24,
        }}>
          <div className="card animate-in" style={{ width: "100%", maxWidth: 480, padding: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#D1FAE5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#065F46" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text-1)" }}>Key Created: {revealed.name}</div>
                <div style={{ fontSize: 12, color: "var(--red)", fontWeight: 600 }}>Copy this now — it won't be shown again</div>
              </div>
            </div>

            <div style={{
              background: "#0F172A", borderRadius: 8, padding: "14px 16px",
              marginBottom: 16, position: "relative",
            }}>
              <code style={{ fontSize: 13, color: "#4ADE80", wordBreak: "break-all", lineHeight: 1.6 }}>
                {revealed.plaintext}
              </code>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                className="btn-primary"
                style={{ flex: 1, justifyContent: "center" }}
                onClick={handleCopy}
              >
                {copied ? "✓ Copied!" : "Copy to Clipboard"}
              </button>
              <button
                className="btn-ghost"
                style={{ flex: 1, justifyContent: "center" }}
                onClick={() => setRevealed(null)}
              >
                I've saved it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
