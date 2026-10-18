"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";

function ResetPasswordInner() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // If no token, show forgot-password (request reset) form
  const [requestMode, setRequestMode] = useState(!token);
  const [email, setEmail] = useState("");
  const [requested, setRequested] = useState(false);

  async function handleRequest(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error: err } = await authClient.requestPasswordReset({ email, redirectTo: "/reset-password" });
    setLoading(false);
    if (err) { setError(err.message ?? "Failed to send reset email."); return; }
    setRequested(true);
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== confirm) { setError("Passwords do not match."); return; }
    if (password.length < 10) { setError("Password must be at least 10 characters."); return; }
    setLoading(true);
    const { error: err } = await authClient.resetPassword({ newPassword: password, token });
    setLoading(false);
    if (err) { setError(err.message ?? "Reset failed. Link may have expired."); return; }
    setSuccess(true);
    setTimeout(() => router.push("/sign-in"), 2500);
  }

  return (
    <div className="card animate-in" style={{ width: "100%", maxWidth: 400, padding: 36 }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: "var(--blue)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text-1)" }}>
            {requestMode ? "Forgot Password" : "Set New Password"}
          </div>
          <div style={{ fontSize: 12, color: "var(--text-4)" }}>TruckConnect</div>
        </div>
      </div>

      {/* Request reset form */}
      {requestMode && !requested && (
        <form onSubmit={handleRequest}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <p style={{ fontSize: 13, color: "var(--text-3)", lineHeight: 1.6 }}>
              Enter your email address and we&apos;ll send you a link to reset your password.
            </p>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-2)", marginBottom: 6 }}>
                Email Address
              </label>
              <input
                className="field"
                type="email"
                placeholder="juan@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
            {error && (
              <div role="alert" style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#DC2626" }}>
                {error}
              </div>
            )}
            <button className="btn-primary" type="submit" disabled={loading} style={{ width: "100%", justifyContent: "center" }}>
              {loading ? "Sending\u2026" : "Send Reset Link"}
            </button>
          </div>
        </form>
      )}

      {/* Sent confirmation */}
      {requestMode && requested && (
        <div style={{ textAlign: "center", padding: "8px 0" }}>
          <p style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.6 }}>
            Check your inbox — we sent a reset link to <strong>{email}</strong>.
          </p>
        </div>
      )}

      {/* Set new password form */}
      {!requestMode && !success && (
        <form onSubmit={handleReset}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-2)", marginBottom: 6 }}>
                New Password
              </label>
              <input
                className="field"
                type="password"
                placeholder="At least 10 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-2)", marginBottom: 6 }}>
                Confirm Password
              </label>
              <input
                className="field"
                type="password"
                placeholder="Repeat password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
              />
            </div>
            {error && (
              <div role="alert" style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#DC2626" }}>
                {error}
              </div>
            )}
            <button className="btn-primary" type="submit" disabled={loading} style={{ width: "100%", justifyContent: "center" }}>
              {loading ? "Saving\u2026" : "Set New Password"}
            </button>
          </div>
        </form>
      )}

      {/* Success */}
      {success && (
        <div style={{ textAlign: "center", padding: "8px 0" }}>
          <p style={{ fontSize: 14, color: "var(--text-2)" }}>
            Password updated! Redirecting to sign in...
          </p>
        </div>
      )}

      <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "var(--text-4)" }}>
        <a href="/sign-in" style={{ color: "var(--blue)", fontWeight: 600, textDecoration: "none" }}>&larr; Back to Sign In</a>
      </p>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: "center", color: "var(--text-4)" }}>Loading...</div>}>
      <ResetPasswordInner />
    </Suspense>
  );
}
