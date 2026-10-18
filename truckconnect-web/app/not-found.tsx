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
        backgroundColor: "#0F172A",
        padding: "24px",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "72px", fontWeight: 800, color: "#3B82F6" }}>404</div>
      <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#F1F5F9", marginTop: "8px" }}>
        Page Not Found
      </h1>
      <p style={{ fontSize: "16px", color: "#94A3B8", marginTop: "12px", maxWidth: "480px" }}>
        The page you are looking for does not exist or may have been moved.
      </p>
      <div style={{ display: "flex", gap: "16px", marginTop: "32px", flexWrap: "wrap", justifyContent: "center" }}>
        <Link
          href="/"
          style={{
            padding: "10px 20px",
            backgroundColor: "#3B82F6",
            color: "#FFFFFF",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: 600,
            fontSize: "14px",
          }}
        >
          Home
        </Link>
        <Link
          href="/products"
          style={{
            padding: "10px 20px",
            backgroundColor: "transparent",
            color: "#3B82F6",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: 600,
            fontSize: "14px",
            border: "1px solid #3B82F6",
          }}
        >
          Products
        </Link>
        <Link
          href="/pricing"
          style={{
            padding: "10px 20px",
            backgroundColor: "transparent",
            color: "#3B82F6",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: 600,
            fontSize: "14px",
            border: "1px solid #3B82F6",
          }}
        >
          Pricing
        </Link>
      </div>
    </div>
  );
}
