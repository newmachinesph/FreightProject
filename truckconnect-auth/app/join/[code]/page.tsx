"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";

export default function JoinByCodePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params);
  const router = useRouter();
  const [info, setInfo] = useState<{
    valid: boolean;
    organization: { id: string; name: string };
    role: string;
    spotsLeft: number | null;
    expiresAt: string | null;
  } | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch(`/api/invite-code/join?code=${encodeURIComponent(code)}`)
      .then(async (r) => {
        if (r.ok) {
          setInfo(await r.json());
        } else {
          const data = await r.json().catch(() => ({}));
          setError(data.error || "Invalid invite code");
        }
      })
      .catch(() => setError("Failed to load invite code"))
      .finally(() => setLoading(false));
  }, [code]);

  async function handleJoin() {
    setJoining(true);
    setError("");
    const r = await fetch("/api/invite-code/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    const data = await r.json();
    if (r.ok) {
      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 2000);
    } else if (r.status === 401) {
      // Show sign-in/sign-up choice instead of hard redirect
      setError("Please sign in or create an account to join this organization.");
    } else {
      setError(data.error || "Failed to join");
    }
    setJoining(false);
  }

  const ROLE_LABELS: Record<string, string> = {
    owner: "Owner", admin: "Admin", member: "Member",
    enterprise_admin: "Enterprise Admin", booker: "Booker", viewer: "Viewer",
    carrier_owner: "Carrier Owner", dispatcher: "Dispatcher", driver: "Driver",
    shipper_admin: "Shipper Admin", forwarder_admin: "Forwarder Admin", agent: "Agent",
    warehouse_admin: "Warehouse Admin", warehouse_manager: "Warehouse Manager",
    warehouse_staff: "Warehouse Staff", warehouse_viewer: "Warehouse Viewer",
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
      padding: 20,
    }}>
      <div className="card animate-in" style={{ width: "100%", maxWidth: 420, padding: 36 }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: "var(--blue)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="19" y1="8" x2="19" y2="14" />
              <line x1="22" y1="11" x2="16" y2="11" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text-1)" }}>Join Organization</div>
            <div style={{ fontSize: 12, color: "var(--text-4)" }}>Invite Code: {code.toUpperCase()}</div>
          </div>
        </div>

        {loading && (
          <p style={{ textAlign: "center", color: "var(--text-4)", padding: "20px 0" }}>
            Loading invite code...
          </p>
        )}

        {error && !loading && (
          <div style={{ textAlign: "center", padding: "12px 0" }}>
            <div style={{
              background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8,
              padding: "14px 18px", fontSize: 13, color: "#DC2626", marginBottom: 16,
            }}>
              {error}
            </div>
            {error.includes("sign in") ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <a href={`/sign-in?redirect=/join/${code}`}
                  className="btn-primary"
                  style={{ display: "flex", justifyContent: "center", padding: "12px 20px", fontSize: 15, textDecoration: "none" }}>
                  Sign In
                </a>
                <a href={`/sign-up?redirect=/join/${code}`}
                  className="btn-ghost"
                  style={{ display: "flex", justifyContent: "center", padding: "12px 20px", fontSize: 15, textDecoration: "none" }}>
                  Create Account
                </a>
              </div>
            ) : (
              <a href="/dashboard" style={{ fontSize: 13, color: "var(--blue)", textDecoration: "none", fontWeight: 600 }}>
                Go to Dashboard
              </a>
            )}
          </div>
        )}

        {info && !success && (
          <div>
            <div style={{
              background: "var(--bg-2)", borderRadius: 10, padding: 20, marginBottom: 20,
              border: "1px solid var(--border)",
            }}>
              <div style={{ fontSize: 12, color: "var(--text-4)", marginBottom: 4 }}>Organization</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text-1)", marginBottom: 12 }}>
                {info.organization.name}
              </div>

              <div style={{ display: "flex", gap: 24 }}>
                <div>
                  <div style={{ fontSize: 11, color: "var(--text-4)", marginBottom: 2 }}>Your Role</div>
                  <span className="badge badge-blue" style={{ fontSize: 11 }}>
                    {ROLE_LABELS[info.role] || info.role}
                  </span>
                </div>
                {info.spotsLeft !== null && (
                  <div>
                    <div style={{ fontSize: 11, color: "var(--text-4)", marginBottom: 2 }}>Spots Left</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-1)" }}>{info.spotsLeft}</div>
                  </div>
                )}
                {info.expiresAt && (
                  <div>
                    <div style={{ fontSize: 11, color: "var(--text-4)", marginBottom: 2 }}>Expires</div>
                    <div style={{ fontSize: 12, color: "var(--text-2)" }}>
                      {new Date(info.expiresAt).toLocaleDateString("en-PH", {
                        month: "short", day: "numeric", year: "numeric",
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div style={{
                background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8,
                padding: "10px 14px", fontSize: 13, color: "#DC2626", marginBottom: 12,
              }}>
                {error}
              </div>
            )}

            <button
              onClick={handleJoin}
              disabled={joining}
              className="btn-primary"
              style={{ width: "100%", justifyContent: "center", padding: "12px 20px", fontSize: 15 }}
            >
              {joining ? "Joining..." : "Join Organization"}
            </button>
          </div>
        )}

        {success && (
          <div style={{ textAlign: "center", padding: "12px 0" }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>&#x2705;</div>
            <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text-1)", marginBottom: 4 }}>
              You&apos;ve joined {info?.organization.name}!
            </p>
            <p style={{ fontSize: 13, color: "var(--text-3)" }}>
              Redirecting to dashboard...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
