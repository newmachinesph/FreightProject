"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

interface InviteRow {
  id: string;
  email: string;
  role: string | null;
  status: string;
  expiresAt: Date;
  createdAt: Date;
  inviterName: string;
}

interface Props {
  orgId: string;
  invitations: InviteRow[];
  isAdmin: boolean;
}

const STATUS_BADGE: Record<string, string> = {
  pending: "badge-amber",
  accepted: "badge-green",
  rejected: "badge-red",
  canceled: "badge-gray",
};

const ROLE_LABEL: Record<string, string> = {
  owner: "Owner", admin: "Admin", member: "Member", viewer: "Viewer",
  booker: "Booker", agent: "Agent", dispatcher: "Dispatcher", driver: "Driver",
  enterprise_admin: "Enterprise Admin", carrier_owner: "Carrier Owner",
  shipper_admin: "Shipper Admin", forwarder_admin: "Forwarder Admin",
};

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" });
}

function isExpired(d: Date) {
  return new Date(d) < new Date();
}

export default function OrgInvitationsClient({ orgId, invitations, isAdmin }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function handleCancel(id: string) {
    if (!confirm("Cancel this invitation?")) return;
    setLoading(id); setError("");
    const { error: err } = await authClient.organization.cancelInvitation({ invitationId: id });
    setLoading(null);
    if (err) { setError(err.message ?? "Failed to cancel."); return; }
    router.refresh();
  }

  const pending = invitations.filter(i => i.status === "pending");
  const others = invitations.filter(i => i.status !== "pending");

  return (
    <div style={{ padding: "28px 32px", maxWidth: 900 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-1)" }}>Invitations</h1>
        <p style={{ fontSize: 14, color: "var(--text-3)", marginTop: 4 }}>
          {pending.length} pending · {invitations.length} total
        </p>
      </div>

      {error && (
        <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#DC2626", marginBottom: 16 }}>
          {error}
        </div>
      )}

      {invitations.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: 40, color: "var(--text-4)" }}>
          No invitations yet.
          <div style={{ fontSize: 13, marginTop: 8 }}>
            <a href={`/org/${orgId}`} style={{ color: "var(--blue)" }}>Go to Members →</a>
          </div>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Invited By</th>
                  <th>Status</th>
                  <th>Expires</th>
                  {isAdmin && <th></th>}
                </tr>
              </thead>
              <tbody>
                {[...pending, ...others].map(inv => {
                  const expired = isExpired(inv.expiresAt);
                  return (
                    <tr key={inv.id} style={{ opacity: loading === inv.id ? 0.5 : 1 }}>
                      <td style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)" }}>{inv.email}</td>
                      <td>
                        <span className="badge badge-gray" style={{ fontSize: 10 }}>
                          {ROLE_LABEL[inv.role ?? "member"] ?? inv.role}
                        </span>
                      </td>
                      <td style={{ fontSize: 12, color: "var(--text-4)" }}>{inv.inviterName}</td>
                      <td>
                        <span className={`badge ${STATUS_BADGE[inv.status] ?? "badge-gray"}`} style={{ fontSize: 10 }}>
                          {inv.status === "pending" && expired ? "expired" : inv.status}
                        </span>
                      </td>
                      <td style={{ fontSize: 12, color: expired ? "var(--red)" : "var(--text-4)" }}>
                        {formatDate(inv.expiresAt)}
                      </td>
                      {isAdmin && (
                        <td>
                          {inv.status === "pending" && !expired && (
                            <button
                              className="btn-ghost"
                              style={{ fontSize: 12, padding: "4px 12px" }}
                              disabled={loading === inv.id}
                              onClick={() => handleCancel(inv.id)}
                            >
                              Cancel
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
      )}
    </div>
  );
}
