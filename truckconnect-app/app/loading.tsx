export default function Loading() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB", padding: "32px" }}>
      {/* Header skeleton */}
      <div
        style={{
          height: 48,
          width: 240,
          backgroundColor: "#E5E7EB",
          borderRadius: 8,
          marginBottom: 8,
          animation: "pulse 1.5s ease-in-out infinite",
        }}
      />
      <div
        style={{
          height: 20,
          width: 360,
          backgroundColor: "#E5E7EB",
          borderRadius: 6,
          marginBottom: 32,
          animation: "pulse 1.5s ease-in-out infinite",
          animationDelay: "0.2s",
        }}
      />

      {/* Card grid skeleton */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 24,
          maxWidth: 1200,
        }}
      >
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            style={{
              backgroundColor: "#ffffff",
              borderRadius: 12,
              padding: 24,
              border: "1px solid #E5E7EB",
            }}
          >
            <div
              style={{
                height: 160,
                backgroundColor: "#F3F4F6",
                borderRadius: 8,
                marginBottom: 16,
                animation: "pulse 1.5s ease-in-out infinite",
                animationDelay: `${i * 0.15}s`,
              }}
            />
            <div
              style={{
                height: 16,
                width: "70%",
                backgroundColor: "#F3F4F6",
                borderRadius: 4,
                marginBottom: 8,
                animation: "pulse 1.5s ease-in-out infinite",
                animationDelay: `${i * 0.15 + 0.1}s`,
              }}
            />
            <div
              style={{
                height: 14,
                width: "50%",
                backgroundColor: "#F3F4F6",
                borderRadius: 4,
                animation: "pulse 1.5s ease-in-out infinite",
                animationDelay: `${i * 0.15 + 0.2}s`,
              }}
            />
          </div>
        ))}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
