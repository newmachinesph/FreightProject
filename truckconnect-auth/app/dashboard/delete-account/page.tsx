"use client";

import { useSession, signOut } from "@/lib/auth-client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface OrgInfo {
  id: string;
  name: string;
  role: string;
}

export default function DeleteAccountPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ownedOrgs, setOwnedOrgs] = useState<OrgInfo[]>([]);
  const [orgsLoading, setOrgsLoading] = useState(true);

  const isConfirmationValid = confirmation === "DELETE MY ACCOUNT";
  const isFormValid = password.length > 0 && isConfirmationValid;

  useEffect(() => {
    if (!session) return;
    fetch("/api/user/orgs")
      .then((r) => (r.ok ? r.json() : []))
      .then((data: OrgInfo[]) => {
        const owned = Array.isArray(data)
          ? data.filter((o) => o.role === "owner")
          : [];
        setOwnedOrgs(owned);
      })
      .catch(() => setOwnedOrgs([]))
      .finally(() => setOrgsLoading(false));
  }, [session]);

  async function handleDelete() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/user/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, confirmation }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setShowModal(false);
        setLoading(false);
        return;
      }

      // Account deleted — sign out locally and redirect
      await signOut();
      router.push("/sign-in?deleted=1");
    } catch {
      setError("Network error. Please check your connection and try again.");
      setShowModal(false);
      setLoading(false);
    }
  }

  if (isPending) {
    return <div style={{ padding: 40, color: "#6b7280" }}>Loading...</div>;
  }
  if (!session) return null;

  return (
    <div style={{ padding: "32px 40px", maxWidth: 800 }}>
      {/* Page header */}
      <div style={{ marginBottom: 32 }}>
        <h1
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: "#1a1a1a",
            margin: 0,
            marginBottom: 4,
          }}
        >
          Delete Account
        </h1>
        <p style={{ fontSize: 14, color: "#6b7280", margin: 0 }}>
          Permanently delete your TruckConnect account and all associated data.
        </p>
      </div>

      {/* Warning banner */}
      <div
        style={{
          background: "#FEF2F2",
          border: "1px solid #FECACA",
          borderRadius: 8,
          padding: "16px 20px",
          marginBottom: 24,
        }}
      >
        <div
          style={{ display: "flex", alignItems: "flex-start", gap: 12 }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#DC2626"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ flexShrink: 0, marginTop: 1 }}
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "#991B1B",
                marginBottom: 6,
              }}
            >
              This action is permanent and irreversible
            </div>
            <div
              style={{ fontSize: 14, color: "#991B1B", lineHeight: 1.6 }}
            >
              Deleting your account will permanently remove all your data.
              This cannot be undone. You will lose access to everything
              associated with your account.
            </div>
          </div>
        </div>
      </div>

      {/* What will be deleted */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 8,
          padding: "24px 28px",
          marginBottom: 24,
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: "#6b7280",
            marginBottom: 16,
            paddingBottom: 12,
            borderBottom: "1px solid #f3f4f6",
          }}
        >
          The following will be permanently deleted
        </div>
        <ul
          style={{
            margin: 0,
            padding: "0 0 0 20px",
            fontSize: 14,
            color: "#374151",
            lineHeight: 2,
          }}
        >
          <li>Your personal account and profile data</li>
          <li>All active sessions across all devices</li>
          <li>All linked authentication accounts and API tokens</li>
          <li>Notification preferences and activity history</li>
          <li>Your membership in all organizations</li>
          <li>All invitations you have sent</li>
        </ul>
      </div>

      {/* Owned organizations warning */}
      {!orgsLoading && ownedOrgs.length > 0 && (
        <div
          style={{
            background: "#FFFBEB",
            border: "1px solid #FDE68A",
            borderRadius: 8,
            padding: "24px 28px",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: "#92400E",
              marginBottom: 16,
              paddingBottom: 12,
              borderBottom: "1px solid #FDE68A",
            }}
          >
            Organizations you own
          </div>
          <p
            style={{
              fontSize: 14,
              color: "#92400E",
              marginTop: 0,
              marginBottom: 16,
            }}
          >
            You are the owner of the following organizations. Your membership
            will be removed. Please transfer ownership before deleting your
            account if you want these organizations to continue.
          </p>
          {ownedOrgs.map((o) => (
            <div
              key={o.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 0",
                borderBottom: "1px solid #FDE68A",
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 6,
                  background: "#F59E0B",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {o.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#1a1a1a",
                  }}
                >
                  {o.name}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "#9ca3af",
                    fontFamily: "monospace",
                  }}
                >
                  {o.id}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation form */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 8,
          padding: "24px 28px",
          marginBottom: 24,
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: "#6b7280",
            marginBottom: 20,
            paddingBottom: 12,
            borderBottom: "1px solid #f3f4f6",
          }}
        >
          Confirm deletion
        </div>

        {/* Confirmation text */}
        <div style={{ marginBottom: 20 }}>
          <label
            style={{
              display: "block",
              fontSize: 14,
              fontWeight: 600,
              color: "#374151",
              marginBottom: 6,
            }}
          >
            Type <span style={{ fontFamily: "monospace", color: "#DC2626", fontWeight: 700 }}>DELETE MY ACCOUNT</span> to confirm
          </label>
          <input
            type="text"
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
            placeholder="DELETE MY ACCOUNT"
            autoComplete="off"
            spellCheck={false}
            style={{
              width: "100%",
              padding: "10px 14px",
              fontSize: 14,
              fontFamily: "monospace",
              border: `1.5px solid ${
                confirmation.length > 0 && !isConfirmationValid
                  ? "#FECACA"
                  : "#e5e7eb"
              }`,
              borderRadius: 8,
              outline: "none",
              boxSizing: "border-box",
            }}
          />
          {confirmation.length > 0 && !isConfirmationValid && (
            <div
              style={{ fontSize: 12, color: "#DC2626", marginTop: 4 }}
            >
              Please type the confirmation text exactly as shown.
            </div>
          )}
        </div>

        {/* Password */}
        <div style={{ marginBottom: 20 }}>
          <label
            style={{
              display: "block",
              fontSize: 14,
              fontWeight: 600,
              color: "#374151",
              marginBottom: 6,
            }}
          >
            Enter your password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your account password"
            autoComplete="current-password"
            style={{
              width: "100%",
              padding: "10px 14px",
              fontSize: 14,
              border: "1.5px solid #e5e7eb",
              borderRadius: 8,
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Error message */}
        {error && (
          <div
            style={{
              background: "#FEF2F2",
              border: "1px solid #FECACA",
              borderRadius: 6,
              padding: "10px 14px",
              fontSize: 13,
              color: "#DC2626",
              marginBottom: 16,
            }}
          >
            {error}
          </div>
        )}

        {/* Delete button */}
        <button
          disabled={!isFormValid || loading}
          onClick={() => setShowModal(true)}
          style={{
            padding: "10px 24px",
            fontSize: 14,
            fontWeight: 700,
            color: "#fff",
            background: isFormValid ? "#DC2626" : "#E5E7EB",
            border: "none",
            borderRadius: 6,
            cursor: isFormValid ? "pointer" : "not-allowed",
            opacity: isFormValid ? 1 : 0.6,
            transition: "all 0.15s",
          }}
        >
          Delete My Account
        </button>
      </div>

      {/* Confirmation modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
          onClick={() => !loading && setShowModal(false)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: "32px",
              maxWidth: 440,
              width: "90%",
              boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal warning icon */}
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "#FEE2E2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#DC2626"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>

            <h2
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "#1a1a1a",
                textAlign: "center",
                margin: "0 0 8px",
              }}
            >
              Are you absolutely sure?
            </h2>
            <p
              style={{
                fontSize: 14,
                color: "#6b7280",
                textAlign: "center",
                margin: "0 0 24px",
                lineHeight: 1.6,
              }}
            >
              This will permanently delete your account for{" "}
              <strong>{session.user.email}</strong>. All data will be lost
              and this action cannot be reversed.
            </p>

            <div
              style={{
                display: "flex",
                gap: 12,
                justifyContent: "center",
              }}
            >
              <button
                onClick={() => setShowModal(false)}
                disabled={loading}
                style={{
                  padding: "10px 24px",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#374151",
                  background: "#F3F4F6",
                  border: "none",
                  borderRadius: 6,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                style={{
                  padding: "10px 24px",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#fff",
                  background: "#DC2626",
                  border: "none",
                  borderRadius: 6,
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1,
                  minWidth: 160,
                }}
              >
                {loading
                  ? "Deleting..."
                  : "Yes, Delete My Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
