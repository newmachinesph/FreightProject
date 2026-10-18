"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const ORG_TYPES = [
  { value: "enterprise_shipper", label: "Enterprise Shipper", desc: "Large shipping company with multiple bookers" },
  { value: "msme_shipper", label: "MSME Shipper", desc: "Small-medium business that ships goods" },
  { value: "carrier_fleet", label: "Carrier Fleet", desc: "Trucking company with drivers and dispatchers" },
  { value: "freight_forwarder", label: "Freight Forwarder", desc: "Consolidator managing multiple clients" },
  { value: "warehouse_operator", label: "Warehouse Operator", desc: "Warehouse facility managing storage, fulfillment, and cross-docking" },
];

export default function CreateOrgPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [type, setType] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function generateSlug(n: string) {
    return n.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!type) { setError("Please select an organization type"); return; }
    setError("");
    setLoading(true);

    const { data, error: err } = await authClient.organization.create({
      name,
      slug: slug || generateSlug(name),
      metadata: { type } as Record<string, string>,
    });

    setLoading(false);
    if (err) {
      setError(err.message ?? "Failed to create organization");
      return;
    }
    if (data?.id) {
      router.push(`/org/${data.id}`);
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div style={{ padding: "28px 32px", maxWidth: 600 }}>
      <a href="/dashboard" style={{ fontSize: 13, color: "var(--blue)", textDecoration: "none", fontWeight: 600 }}>
        &larr; Dashboard
      </a>

      <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-1)", marginTop: 16, marginBottom: 8 }}>
        Create Organization
      </h1>
      <p style={{ fontSize: 14, color: "var(--text-3)", marginBottom: 28 }}>
        Set up your company or team. You&apos;ll be the owner and can invite members.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {/* Name */}
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-2)", marginBottom: 6 }}>
                Organization Name
              </label>
              <input
                className="field"
                placeholder="e.g. Manila Express Shipping"
                value={name}
                onChange={e => { setName(e.target.value); if (!slug) setSlug(""); }}
                required
                autoFocus
              />
            </div>

            {/* Slug */}
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-2)", marginBottom: 6 }}>
                URL Slug <span style={{ fontWeight: 400, color: "var(--text-4)" }}>(optional)</span>
              </label>
              <input
                className="field"
                placeholder={name ? generateSlug(name) : "auto-generated"}
                value={slug}
                onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
              />
            </div>

            {/* Type */}
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-2)", marginBottom: 8 }}>
                Organization Type
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {ORG_TYPES.map(t => (
                  <div
                    key={t.value}
                    onClick={() => setType(t.value)}
                    style={{
                      padding: "14px 16px",
                      borderRadius: 10,
                      border: `2px solid ${type === t.value ? "var(--blue)" : "var(--border)"}`,
                      background: type === t.value ? "rgba(37, 99, 235, 0.05)" : "transparent",
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 600, color: type === t.value ? "var(--blue)" : "var(--text-1)", marginBottom: 2 }}>
                      {t.label}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-4)", lineHeight: 1.4 }}>
                      {t.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#DC2626" }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn-primary"
              disabled={loading || !name || !type}
              style={{ width: "100%", justifyContent: "center", padding: "12px 20px", fontSize: 15 }}
            >
              {loading ? "Creating..." : "Create Organization"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
