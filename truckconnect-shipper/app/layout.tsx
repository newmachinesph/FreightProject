import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TruckConnect Shipper",
  description: "Freight shipping platform for Philippine shippers",
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
