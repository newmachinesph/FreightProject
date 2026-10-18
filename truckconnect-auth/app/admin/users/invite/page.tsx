"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { ArrowLeft, Send } from "lucide-react";

export default function InviteUserPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/admin/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message ?? `Failed to invite user (${res.status})`);
      }

      setSuccess(`Invitation sent to ${email}`);
      setEmail("");
      setRole("user");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send invitation");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: "28px 32px", maxWidth: 600 }}>
      <button
        onClick={() => router.push("/admin/users")}
        style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          fontSize: 13, color: "var(--text-3)", background: "none",
          border: "none", cursor: "pointer", marginBottom: 20, padding: 0,
        }}
      >
        <ArrowLeft size={14} /> Back to Users
      </button>

      <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-1)", marginBottom: 4 }}>
        Invite User
      </h1>
      <p style={{ fontSize: 14, color: "var(--text-3)", marginBottom: 28 }}>
        Send an invitation email to add a new user to the platform.
      </p>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-2)", marginBottom: 6 }}>
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="user@example.com"
              className="field"
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-2)", marginBottom: 6 }}>
              Platform Role
            </label>
            <select
              value={role}
              onChange={e => setRole(e.target.value)}
              className="field"
              style={{ width: "100%" }}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
            <p style={{ fontSize: 12, color: "var(--text-4)", marginTop: 4 }}>
              This sets the platform-level role. Organization roles are assigned separately.
            </p>
          </div>

          {error && (
            <div style={{
              padding: "10px 14px", borderRadius: 8, marginBottom: 16,
              background: "#FEF2F2", border: "1px solid #FECACA",
              fontSize: 13, color: "#991B1B",
            }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{
              padding: "10px 14px", borderRadius: 8, marginBottom: 16,
              background: "#F0FDF4", border: "1px solid #BBF7D0",
              fontSize: 13, color: "#166534",
            }}>
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
          >
            <Send size={14} />
            {loading ? "Sending..." : "Send Invitation"}
          </button>
        </form>
      </div>
    </div>
  );
}
