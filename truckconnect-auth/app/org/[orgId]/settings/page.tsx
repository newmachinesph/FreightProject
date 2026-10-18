"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

const ORG_TYPE_LABEL: Record<string, string> = {
  tc_platform: "TruckConnect Platform",
  enterprise_shipper: "Enterprise Shipper",
  msme_shipper: "MSME Shipper",
  carrier_fleet: "Carrier / Fleet",
  freight_forwarder: "Freight Forwarder",
  warehouse_operator: "Warehouse Operator",
};

export default function OrgSettingsPage() {
  const { orgId } = useParams<{ orgId: string }>();
  const router = useRouter();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [orgType, setOrgType] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  // Delete modal
  const [showDelete, setShowDelete] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch(`/api/org/${orgId}/settings`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) {
          setName(data.name ?? "");
          setSlug(data.slug ?? "");
          setOrgType(data.type ?? "");
          setCreatedAt(data.createdAt ?? "");
        }
      })
      .finally(() => setLoading(false));
  }, [orgId]);

  async function handleSave() {
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const res = await fetch(`/api/org/${orgId}/settings`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _name: name.trim() }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error ?? "Save failed");
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/org/${orgId}/settings`, { method: "DELETE" });
      if (res.ok) {
        router.push("/dashboard");
      } else {
        const d = await res.json().catch(() => ({}));
        setError(d.error ?? "Delete failed");
      }
    } catch {
      setError("Delete failed");
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return <div style={{ padding: 40, color: "var(--text-4)" }}>Loading...</div>;
  }

  return (
    <div style={{ padding: "28px 32px", maxWidth: 640 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-1)", marginBottom: 4 }}>
        Organization Settings
      </h1>
      <p style={{ fontSize: 14, color: "var(--text-3)", marginBottom: 28 }}>
        Manage your organization details
      </p>

      {/* Organization Info */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-2)", marginBottom: 6 }}>
            Organization Name
          </label>
          <input
            className="field"
            value={name}
            onChange={e => setName(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-2)", marginBottom: 6 }}>
              Organization Type
            </label>
            <div style={{
              padding: "8px 12px", borderRadius: 8,
              background: "var(--bg)", border: "1px solid var(--border)",
              fontSize: 13, color: "var(--text-3)",
            }}>
              {ORG_TYPE_LABEL[orgType] ?? orgType}
            </div>
          </div>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-2)", marginBottom: 6 }}>
              Slug
            </label>
            <div style={{
              padding: "8px 12px", borderRadius: 8,
              background: "var(--bg)", border: "1px solid var(--border)",
              fontSize: 13, color: "var(--text-3)", fontFamily: "monospace",
            }}>
              {slug || "—"}
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-2)", marginBottom: 6 }}>
            Organization ID
          </label>
          <div style={{
            padding: "8px 12px", borderRadius: 8,
            background: "var(--bg)", border: "1px solid var(--border)",
            fontSize: 12, color: "var(--text-4)", fontFamily: "monospace",
          }}>
            {orgId}
          </div>
        </div>

        {createdAt && (
          <div style={{ fontSize: 12, color: "var(--text-4)" }}>
            Created {new Date(createdAt).toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" })}
          </div>
        )}

        {error && (
          <div style={{ marginTop: 16, padding: "10px 14px", borderRadius: 8, background: "#FEF2F2", border: "1px solid #FECACA", fontSize: 13, color: "#991B1B" }}>
            {error}
          </div>
        )}

        {saved && (
          <div style={{ marginTop: 16, padding: "10px 14px", borderRadius: 8, background: "#F0FDF4", border: "1px solid #BBF7D0", fontSize: 13, color: "#166534" }}>
            Settings saved
          </div>
        )}

        <div style={{ marginTop: 20 }}>
          <button className="btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card" style={{ border: "1px solid #FECACA" }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: "#DC2626", marginBottom: 8 }}>
          Danger Zone
        </h3>
        <p style={{ fontSize: 13, color: "var(--text-3)", marginBottom: 16 }}>
          Permanently delete this organization and all its members, invite codes, and API keys.
          This action cannot be undone.
        </p>
        <button
          className="btn-danger"
          onClick={() => setShowDelete(true)}
          style={{ padding: "8px 18px", fontSize: 13 }}
        >
          Delete Organization
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDelete && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
          onClick={() => setShowDelete(false)}
        >
          <div className="card" style={{ maxWidth: 440, width: "100%", padding: 28 }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#DC2626", marginBottom: 12 }}>
              Delete Organization
            </h3>
            <p style={{ fontSize: 13, color: "var(--text-3)", marginBottom: 16 }}>
              Type <strong>DELETE</strong> to confirm. All members, API keys, and invite codes will be permanently removed.
            </p>
            <input
              className="field"
              placeholder="Type DELETE to confirm"
              value={deleteConfirm}
              onChange={e => setDeleteConfirm(e.target.value)}
              style={{ width: "100%", marginBottom: 16 }}
            />
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowDelete(false)}
                style={{ padding: "8px 18px", fontSize: 13, borderRadius: 8, border: "1px solid var(--border)", background: "#fff", cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                className="btn-danger"
                disabled={deleteConfirm !== "DELETE" || deleting}
                onClick={handleDelete}
                style={{ padding: "8px 18px", fontSize: 13 }}
              >
                {deleting ? "Deleting..." : "Delete Forever"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
