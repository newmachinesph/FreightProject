"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, KeyRound, Info, Copy, Check, X, AlertTriangle } from "lucide-react";

interface Token {
  id: string;
  name: string;
  prefix: string;
  expiresAt: string | null;
  lastUsedAt: string | null;
  revokedAt: string | null;
  createdAt: string;
}

export default function PersonalTokensPage() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [expiresInDays, setExpiresInDays] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [newPlaintext, setNewPlaintext] = useState("");
  const [copied, setCopied] = useState(false);
  const [revokingId, setRevokingId] = useState<string | null>(null);

  const fetchTokens = useCallback(async () => {
    try {
      const res = await fetch("/api/user/tokens");
      if (res.ok) {
        const data = await res.json();
        setTokens(data.tokens);
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTokens(); }, [fetchTokens]);

  const handleCreate = async () => {
    setError("");
    const trimmed = name.trim();
    if (!trimmed) { setError("Name is required"); return; }

    const body: { name: string; expiresInDays?: number } = { name: trimmed };
    if (expiresInDays) {
      const days = parseInt(expiresInDays, 10);
      if (isNaN(days) || days < 1 || days > 3650) {
        setError("Expiry must be 1–3650 days");
        return;
      }
      body.expiresInDays = days;
    }

    setCreating(true);
    try {
      const res = await fetch("/api/user/tokens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to create token"); return; }
      setNewPlaintext(data.plaintext);
      setName("");
      setExpiresInDays("");
      setShowForm(false);
      fetchTokens();
    } catch {
      setError("Network error");
    } finally {
      setCreating(false);
    }
  };

  const handleRevoke = async (tokenId: string) => {
    setRevokingId(tokenId);
    try {
      const res = await fetch("/api/user/tokens", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tokenId }),
      });
      if (res.ok) fetchTokens();
    } catch {
      /* ignore */
    } finally {
      setRevokingId(null);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(newPlaintext);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fmt = (iso: string | null) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const thStyle: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 700,
    color: "var(--text-4)",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    padding: "10px 14px",
    textAlign: "left",
    borderBottom: "1px solid var(--border)",
  };

  const tdStyle: React.CSSProperties = {
    padding: "12px 14px",
    fontSize: 13,
    color: "var(--text-2)",
    borderBottom: "1px solid var(--border)",
  };

  const activeTokens = tokens.filter((t) => !t.revokedAt);
  const revokedTokens = tokens.filter((t) => t.revokedAt);

  return (
    <div style={{ padding: "28px 32px", maxWidth: 780 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-1)", marginBottom: 4 }}>
        Personal Access Tokens
      </h1>
      <p style={{ fontSize: 14, color: "var(--text-3)", marginBottom: 32 }}>
        Personal access tokens allow you to authenticate with the TruckConnect API programmatically.
      </p>

      {/* New token plaintext display */}
      {newPlaintext && (
        <div style={{
          marginBottom: 20,
          padding: "16px 20px",
          borderRadius: 10,
          border: "1px solid #F59E0B",
          background: "#FFFBEB",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <AlertTriangle size={16} stroke="#B45309" />
            <span style={{ fontSize: 13, fontWeight: 700, color: "#92400E" }}>
              Copy your token now — it will not be shown again!
            </span>
          </div>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#FEF3C7",
            borderRadius: 6,
            padding: "10px 14px",
            fontFamily: "monospace",
            fontSize: 13,
            color: "#78350F",
            wordBreak: "break-all",
          }}>
            <span style={{ flex: 1 }}>{newPlaintext}</span>
            <button
              onClick={handleCopy}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                padding: "6px 12px",
                borderRadius: 6,
                border: "1px solid #D97706",
                background: "#FDE68A",
                color: "#92400E",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <button
            onClick={() => setNewPlaintext("")}
            style={{
              marginTop: 10,
              fontSize: 12,
              color: "#92400E",
              background: "none",
              border: "none",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--text-4)",
          }}>
            Your Tokens
          </div>
          <button
            className="btn-primary"
            onClick={() => { setShowForm(!showForm); setError(""); }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 18px",
              borderRadius: 8,
              border: "none",
              background: "var(--blue)",
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {showForm ? <X size={14} /> : <Plus size={14} />}
            {showForm ? "Cancel" : "Create Token"}
          </button>
        </div>

        {/* Create form */}
        {showForm && (
          <div style={{
            marginBottom: 20,
            padding: "16px 20px",
            borderRadius: 8,
            border: "1px solid var(--border)",
            background: "var(--bg-2, #f9fafb)",
          }}>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-2)", marginBottom: 4 }}>
                Token Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. CI Pipeline, Local Dev"
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: 6,
                  border: "1px solid var(--border)",
                  fontSize: 13,
                  color: "var(--text-1)",
                  background: "var(--bg-1, #fff)",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-2)", marginBottom: 4 }}>
                Expires In (days, optional)
              </label>
              <input
                type="number"
                value={expiresInDays}
                onChange={(e) => setExpiresInDays(e.target.value)}
                placeholder="Leave blank for no expiry"
                min={1}
                max={3650}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: 6,
                  border: "1px solid var(--border)",
                  fontSize: 13,
                  color: "var(--text-1)",
                  background: "var(--bg-1, #fff)",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
            {error && (
              <div style={{ fontSize: 12, color: "#DC2626", marginBottom: 10 }}>{error}</div>
            )}
            <button
              className="btn-primary"
              onClick={handleCreate}
              disabled={creating}
              style={{
                padding: "8px 20px",
                borderRadius: 8,
                border: "none",
                background: "var(--blue)",
                color: "#fff",
                fontSize: 13,
                fontWeight: 600,
                cursor: creating ? "not-allowed" : "pointer",
                opacity: creating ? 0.6 : 1,
              }}
            >
              {creating ? "Creating…" : "Generate Token"}
            </button>
          </div>
        )}

        {/* Token table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Prefix</th>
                <th style={thStyle}>Created</th>
                <th style={thStyle}>Last Used</th>
                <th style={thStyle}>Expires</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ ...tdStyle, textAlign: "center", color: "var(--text-4)" }}>
                    Loading…
                  </td>
                </tr>
              ) : activeTokens.length === 0 && revokedTokens.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: "48px 14px", textAlign: "center", color: "var(--text-4)", fontSize: 13 }}>
                    <KeyRound size={32} strokeWidth={1.5} style={{ display: "block", margin: "0 auto 8px", opacity: 0.3 }} />
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>No tokens yet</div>
                    <div>Create a personal access token to authenticate with the API.</div>
                  </td>
                </tr>
              ) : (
                <>
                  {activeTokens.map((t) => (
                    <tr key={t.id}>
                      <td style={{ ...tdStyle, fontWeight: 600, color: "var(--text-1)" }}>{t.name}</td>
                      <td style={{ ...tdStyle, fontFamily: "monospace", fontSize: 12 }}>{t.prefix}</td>
                      <td style={tdStyle}>{fmt(t.createdAt)}</td>
                      <td style={tdStyle}>{fmt(t.lastUsedAt)}</td>
                      <td style={tdStyle}>
                        {t.expiresAt ? (
                          <span style={{
                            color: new Date(t.expiresAt) < new Date() ? "#DC2626" : "var(--text-2)",
                          }}>
                            {fmt(t.expiresAt)}
                            {new Date(t.expiresAt) < new Date() && " (expired)"}
                          </span>
                        ) : (
                          <span style={{ color: "var(--text-4)" }}>Never</span>
                        )}
                      </td>
                      <td style={tdStyle}>
                        <button
                          onClick={() => handleRevoke(t.id)}
                          disabled={revokingId === t.id}
                          style={{
                            padding: "4px 12px",
                            borderRadius: 6,
                            border: "1px solid #FCA5A5",
                            background: "#FEF2F2",
                            color: "#DC2626",
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: revokingId === t.id ? "not-allowed" : "pointer",
                            opacity: revokingId === t.id ? 0.6 : 1,
                          }}
                        >
                          {revokingId === t.id ? "Revoking…" : "Revoke"}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {revokedTokens.map((t) => (
                    <tr key={t.id} style={{ opacity: 0.5 }}>
                      <td style={{ ...tdStyle, fontWeight: 600, color: "var(--text-3)" }}>
                        {t.name}
                      </td>
                      <td style={{ ...tdStyle, fontFamily: "monospace", fontSize: 12 }}>{t.prefix}</td>
                      <td style={tdStyle}>{fmt(t.createdAt)}</td>
                      <td style={tdStyle}>{fmt(t.lastUsedAt)}</td>
                      <td style={tdStyle}>{fmt(t.expiresAt)}</td>
                      <td style={tdStyle}>
                        <span style={{
                          display: "inline-block",
                          padding: "3px 10px",
                          borderRadius: 6,
                          background: "var(--bg-2, #f3f4f6)",
                          color: "var(--text-4)",
                          fontSize: 11,
                          fontWeight: 600,
                        }}>
                          Revoked
                        </span>
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Note */}
      <div style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        padding: "14px 18px",
        borderRadius: 10,
        border: "1px solid #BFDBFE",
        background: "#EFF6FF",
      }}>
        <Info size={18} stroke="#3B82F6" style={{ flexShrink: 0, marginTop: 1 }} />
        <div style={{ fontSize: 13, color: "#1E40AF", lineHeight: 1.5 }}>
          For organization-level API keys, go to your{" "}
          <a href="/dashboard" style={{ color: "#1D4ED8", fontWeight: 600, textDecoration: "underline" }}>
            organization&apos;s API Keys settings
          </a>.
          Personal tokens are tied to your user account and inherit your permissions across all organizations.
        </div>
      </div>
    </div>
  );
}
