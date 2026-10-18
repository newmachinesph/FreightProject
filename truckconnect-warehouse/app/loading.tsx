export default function Loading() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F9FAFB",
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          border: "4px solid #E9D5FF",
          borderTopColor: "#8B5CF6",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
          marginBottom: 16,
        }}
      />
      <p
        style={{
          fontSize: 16,
          color: "#6B7280",
          fontFamily: "system-ui, -apple-system, sans-serif",
          margin: 0,
        }}
      >
        Loading...
      </p>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
