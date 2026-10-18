"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function CallbackInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = params.get("session_token");
    const errorParam = params.get("error");

    if (errorParam) {
      setError(errorParam === "access_denied" ? "Access was denied. Please try again." : `Authentication error: ${errorParam}`);
      return;
    }

    if (!token) {
      setError("No session token received. Please try signing in again.");
      return;
    }

    try {
      localStorage.setItem("tc_session_token", token);
    } catch {
      setError("Unable to save session. Please ensure cookies and storage are enabled.");
      return;
    }

    const redirectTo = localStorage.getItem("tc_auth_redirect") || "/";
    localStorage.removeItem("tc_auth_redirect");
    router.push(redirectTo);
  }, [params, router]);

  if (error) {
    return (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100vh", fontFamily: "system-ui", gap: "16px" }}>
        <div style={{ color: "#EF4444", fontSize: "18px", fontWeight: 600 }}>Sign-in Failed</div>
        <div style={{ color: "#6B7280", maxWidth: "400px", textAlign: "center" }}>{error}</div>
        <a href="/auth/login" style={{ marginTop: "8px", color: "#2563EB", textDecoration: "underline" }}>
          Try again
        </a>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", fontFamily: "system-ui", color: "#6B7280" }}>
      Signing in...
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={<div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>Loading...</div>}>
      <CallbackInner />
    </Suspense>
  );
}
