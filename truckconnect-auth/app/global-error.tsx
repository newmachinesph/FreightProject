"use client";
import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", fontFamily: "system-ui", background: "#F9FAFB" }}>
        <div style={{ textAlign: "center", maxWidth: 400 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 8 }}>Something went wrong</h2>
          <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 20 }}>An unexpected error occurred. Our team has been notified.</p>
          <button onClick={reset} style={{ padding: "10px 24px", background: "#2563EB", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
