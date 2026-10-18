import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TruckConnect Marketplace",
  description: "The central hub where shippers, carriers, and warehouses find each other",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
