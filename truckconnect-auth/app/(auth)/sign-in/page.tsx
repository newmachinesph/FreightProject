"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, authClient } from "@/lib/auth-client";
import { Truck } from "lucide-react";

function SignInInner() {
  const router = useRouter();
  const params = useSearchParams();
  const redirectTo = params.get("redirect") ?? null;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error: err } = await signIn.email({ email, password });

    if (err) {
      setError(err.message ?? "Invalid email or password");
      setLoading(false);
      return;
    }

    if (redirectTo) {
      // Cross-origin redirect: append session token so the other app can store it
      if (redirectTo.startsWith("http")) {
        const token = (data as Record<string, unknown>)?.token ?? "";
        const sep = redirectTo.includes("?") ? "&" : "?";
        window.location.href = `${redirectTo}${sep}session_token=${token}`;
        return;
      }
      router.push(redirectTo);
      return;
    }

    // Route based on role
    const role = (data?.user as Record<string, unknown> | undefined)?.["role"];
    router.push(role === "admin" || role === "super_admin" ? "/admin" : "/dashboard");
  }

  return (
    <div style={{ width: "100%", maxWidth: 420 }} className="animate-in">
      {/* Logo + Welcome */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 52,
          height: 52,
          background: "linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%)",
          borderRadius: 14,
          marginBottom: 16,
          boxShadow: "0 4px 16px rgba(37, 99, 235, 0.3)",
        }}>
          <Truck size={26} color="#fff" />
        </div>
        <h1 style={{
          fontSize: 24,
          fontWeight: 700,
          color: "#fff",
          margin: "0 0 4px",
          letterSpacing: "-0.5px",
        }}>
          Welcome back
        </h1>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, margin: 0 }}>
          Sign in to your TruckConnect account
        </p>
      </div>

      {/* Card */}
      <div className="card" style={{
        padding: 32,
        boxShadow: "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)",
      }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-2)", marginBottom: 6 }}>
                Email address
              </label>
              <input
                type="email"
                className="field"
                placeholder="admin@truckconnect.ph"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                autoFocus
              />
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-2)" }}>
                  Password
                </label>
                <a
                  href="/reset-password"
                  style={{
                    fontSize: 12,
                    color: "var(--blue)",
                    textDecoration: "none",
                    fontWeight: 500,
                  }}
                >
                  Forgot password?
                </a>
              </div>
              <input
                type="password"
                className="field"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div role="alert" style={{
                background: "#FEF2F2",
                border: "1px solid #FECACA",
                borderRadius: 10,
                padding: "12px 16px",
                fontSize: 13,
                color: "#DC2626",
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
                  <circle cx="12" cy="12" r="10" stroke="#DC2626" strokeWidth="2"/>
                  <path d="M12 8v4M12 16h.01" stroke="#DC2626" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 2 }}>Authentication failed</div>
                  <div style={{ color: "#B91C1C" }}>{error}</div>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{
                width: "100%",
                justifyContent: "center",
                padding: "12px 20px",
                fontSize: 15,
                background: "var(--blue)",
                marginTop: 4,
              }}
            >
              {loading ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ animation: "spin 1s linear infinite" }}>
                    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                  Signing in...
                </>
              ) : "Sign in"}
            </button>
          </div>
        </form>

        {/* Or divider */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          margin: "24px 0 20px",
        }}>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          <span style={{ fontSize: 12, color: "var(--text-4)", fontWeight: 500 }}>Or</span>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
        </div>

        <div style={{ textAlign: "center" }}>
          <a
            href={`/sign-up${redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`}
            style={{
              fontSize: 14,
              color: "var(--text-3)",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Don&apos;t have an account?{" "}
            <span style={{ color: "var(--blue)", fontWeight: 600 }}>Create one</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: "center", color: "rgba(255,255,255,0.5)" }}>Loading...</div>}>
      <SignInInner />
    </Suspense>
  );
}
