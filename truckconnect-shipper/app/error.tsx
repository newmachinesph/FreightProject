"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F9FAFB",
        padding: 32,
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          backgroundColor: "#DBEAFE",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 24,
          fontSize: 28,
          color: "#2563EB",
          fontWeight: 700,
        }}
      >
        !
      </div>
      <h2
        style={{
          fontSize: 24,
          fontWeight: 700,
          color: "#111827",
          margin: "0 0 8px 0",
        }}
      >
        Something went wrong
      </h2>
      <p
        style={{
          fontSize: 16,
          color: "#6B7280",
          margin: "0 0 24px 0",
          textAlign: "center",
          maxWidth: 400,
        }}
      >
        An unexpected error occurred in the shipper portal. Please try again.
      </p>
      {process.env.NODE_ENV === "development" && error?.message && (
        <pre
          style={{
            fontSize: 13,
            color: "#991B1B",
            backgroundColor: "#FEF2F2",
            padding: "12px 16px",
            borderRadius: 8,
            marginBottom: 24,
            maxWidth: 500,
            overflow: "auto",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {error.message}
        </pre>
      )}
      <button
        onClick={() => reset()}
        style={{
          padding: "12px 32px",
          backgroundColor: "#2563EB",
          color: "#ffffff",
          border: "none",
          borderRadius: 8,
          fontSize: 16,
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        Try again
      </button>
    </div>
  );
}
