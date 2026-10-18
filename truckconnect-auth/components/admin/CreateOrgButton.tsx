"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { ORG_TYPES } from "@/lib/auth/access-control";

export default function CreateOrgButton() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [orgType, setOrgType] = useState<string>("enterprise_shipper");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  function handleNameChange(v: string) {
    setName(v);
    setSlug(v.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: err } = await authClient.organization.create({
      name,
      slug,
      metadata: { type: orgType } as Record<string, string>,
    });

    if (err) {
      setError(err.message ?? "Failed to create organization");
      setLoading(false);
      return;
    }

    setOpen(false);
    setName("");
    setSlug("");
    setLoading(false);
    router.refresh();
  }

  return (
    <>
      <button className="btn-primary" onClick={() => setOpen(true)}>+ New Organization</button>

      {open && (
        <div style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 100, padding: 24,
        }} onClick={e => e.target === e.currentTarget && setOpen(false)}>
          <div className="card animate-in" style={{ width: "100%", maxWidth: 420, padding: 28 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>New Organization</h2>
            <p style={{ fontSize: 13, color: "var(--text-3)", marginBottom: 24 }}>
              Create an org for a shipper, carrier, forwarder, or TruckConnect team
            </p>

            <form onSubmit={handleCreate}>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-2)", marginBottom: 6 }}>
                    Organization Name
                  </label>
                  <input
                    className="field"
                    placeholder="e.g. Jollibee Supply Chain"
                    value={name}
                    onChange={e => handleNameChange(e.target.value)}
                    required
                    autoFocus
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-2)", marginBottom: 6 }}>
                    Slug (URL-safe)
                  </label>
                  <input
                    className="field"
                    placeholder="jollibee-supply-chain"
                    value={slug}
                    onChange={e => setSlug(e.target.value)}
                    required
                    pattern="[a-z0-9-]+"
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-2)", marginBottom: 6 }}>
                    Organization Type
                  </label>
                  <select
                    className="field"
                    value={orgType}
                    onChange={e => setOrgType(e.target.value)}
                  >
                    {ORG_TYPES.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>

                {error && (
                  <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#DC2626" }}>
                    {error}
                  </div>
                )}

                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                  <button type="button" className="btn-ghost" onClick={() => setOpen(false)}>Cancel</button>
                  <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? "Creating…" : "Create Organization"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
