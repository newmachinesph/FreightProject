import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        fontFamily: "system-ui, -apple-system, sans-serif",
        backgroundColor: "#F9FAFB",
        padding: "24px",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "72px", fontWeight: 800, color: "#16A34A" }}>404</div>
      <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#111827", marginTop: "8px" }}>
        Page Not Found
      </h1>
      <p style={{ fontSize: "16px", color: "#6B7280", marginTop: "12px", maxWidth: "480px" }}>
        The page you are looking for does not exist or may have been moved.
      </p>
      <div style={{ display: "flex", gap: "16px", marginTop: "32px" }}>
        <Link
          href="/dashboard"
          style={{
            padding: "10px 20px",
            backgroundColor: "#16A34A",
            color: "#FFFFFF",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: 600,
            fontSize: "14px",
          }}
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
