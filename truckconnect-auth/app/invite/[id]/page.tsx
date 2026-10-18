"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { authClient, useSession } from "@/lib/auth-client";

type InviteStatus = "loading" | "ready" | "accepted" | "error" | "need_auth";

export default function InvitePage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { data: session, isPending } = useSession();

  const [status, setStatus] = useState<InviteStatus>("loading");
  const [invite, setInvite] = useState<{ organizationName: string; inviterEmail: string; role: string } | null>(null);
  const [error, setError] = useState("");

  // Once session is known, try to fetch invite details
  useEffect(() => {
    if (isPending) return;
    if (!session) {
      setStatus("need_auth");
      return;
    }
    fetchInvite();
  }, [isPending, session]);

  async function fetchInvite() {
    try {
      const { data, error: err } = await authClient.organization.getInvitation({ query: { id } });
      if (err || !data) {
        setError(err?.message ?? "Invitation not found or expired.");
        setStatus("error");
        return;
      }
      setInvite({
        organizationName: (data as { organizationName?: string }).organizationName ?? "Unknown Organization",
        inviterEmail: (data as { inviterEmail?: string }).inviterEmail ?? "",
        role: (data as { role?: string }).role ?? "member",
      });
      setStatus("ready");
    } catch {
      setError("Failed to load invitation.");
      setStatus("error");
    }
  }

  async function handleAccept() {
    setStatus("loading");
    const { error: err } = await authClient.organization.acceptInvitation({ invitationId: id });
    if (err) {
      setError(err.message ?? "Failed to accept invitation.");
      setStatus("error");
      return;
    }
    setStatus("accepted");
    setTimeout(() => router.push("/dashboard"), 2000);
  }

  async function handleDecline() {
    await authClient.organization.rejectInvitation({ invitationId: id });
    router.push("/dashboard");
  }

  const roleLabel: Record<string, string> = {
    owner: "Owner", admin: "Admin", member: "Member",
    enterprise_admin: "Enterprise Admin", booker: "Booker",
    viewer: "Viewer", carrier_owner: "Carrier Owner",
    dispatcher: "Dispatcher", driver: "Driver",
    shipper_admin: "Shipper Admin", forwarder_admin: "Forwarder Admin",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1B2D5E 0%, #142248 50%, #0D1934 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24,
    }}>
      <div className="card animate-in" style={{ width: "100%", maxWidth: 420, padding: 36 }}>
        {/* Loading */}
        {status === "loading" && (
          <div style={{ textAlign: "center", padding: "24px 0", color: "var(--text-3)" }}>
            Loading invitation…
          </div>
        )}

        {/* Ready — show invite details */}
        {status === "ready" && invite && (
          <>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{
                width: 56, height: 56, borderRadius: "50%",
                background: "#DBEAFE",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 16px",
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-1)", marginBottom: 8 }}>
                You're invited!
              </h1>
              <p style={{ fontSize: 14, color: "var(--text-3)", lineHeight: 1.6 }}>
                {invite.inviterEmail ? (
                  <><strong>{invite.inviterEmail}</strong> invited you to join</>
                ) : "You've been invited to join"}
              </p>
              <div style={{
                background: "var(--bg)", borderRadius: 10, padding: "14px 20px", marginTop: 16,
                border: "1.5px solid var(--border)",
              }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text-1)" }}>
                  {invite.organizationName}
                </div>
                <div style={{ marginTop: 6 }}>
                  <span className="badge badge-blue">
                    {roleLabel[invite.role] ?? invite.role}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                className="btn-ghost"
                style={{ flex: 1, justifyContent: "center" }}
                onClick={handleDecline}
              >
                Decline
              </button>
              <button
                className="btn-primary"
                style={{ flex: 2, justifyContent: "center" }}
                onClick={handleAccept}
              >
                Accept Invitation
              </button>
            </div>
          </>
        )}

        {/* Accepted */}
        {status === "accepted" && (
          <div style={{ textAlign: "center", padding: "8px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-1)", marginBottom: 8 }}>
              Welcome aboard!
            </h2>
            <p style={{ fontSize: 14, color: "var(--text-3)" }}>
              You've joined {invite?.organizationName}. Redirecting…
            </p>
          </div>
        )}

        {/* Need auth — show sign-in/sign-up options */}
        {status === "need_auth" && (
          <div style={{ textAlign: "center", padding: "8px 0" }}>
            <div style={{
              width: 56, height: 56, borderRadius: "50%",
              background: "#DBEAFE",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px",
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <line x1="19" y1="8" x2="19" y2="14"/>
                <line x1="22" y1="11" x2="16" y2="11"/>
              </svg>
            </div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-1)", marginBottom: 8 }}>
              You&apos;ve been invited!
            </h1>
            <p style={{ fontSize: 14, color: "var(--text-3)", lineHeight: 1.6, marginBottom: 24 }}>
              Sign in to your existing account or create a new one to accept this invitation.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <a
                href={`/sign-in?redirect=/invite/${id}`}
                className="btn-primary"
                style={{ display: "flex", justifyContent: "center", padding: "12px 20px", fontSize: 15, textDecoration: "none" }}
              >
                Sign In
              </a>
              <a
                href={`/sign-up?redirect=/invite/${id}`}
                className="btn-ghost"
                style={{ display: "flex", justifyContent: "center", padding: "12px 20px", fontSize: 15, textDecoration: "none" }}
              >
                Create Account
              </a>
            </div>
          </div>
        )}

        {/* Error */}
        {status === "error" && (
          <div style={{ textAlign: "center", padding: "8px 0" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-1)", marginBottom: 8 }}>
              Invitation Issue
            </h2>
            <p style={{ fontSize: 14, color: "var(--text-3)", marginBottom: 20 }}>
              {error}
            </p>
            <a href="/dashboard" style={{ color: "var(--blue)", fontSize: 14, fontWeight: 600 }}>
              Go to Dashboard
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
