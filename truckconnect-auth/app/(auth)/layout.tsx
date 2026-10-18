export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #1B2D5E 0%, #142248 50%, #0D1934 100%)",
      padding: "24px",
    }}>
      {children}
    </main>
  );
}
