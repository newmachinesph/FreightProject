import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TruckConnect Carrier",
  description: "Freight carrier platform for Philippine trucking companies",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#F9FAFB", minHeight: "100vh" }}>
        {children}
      </body>
    </html>
  );
}
