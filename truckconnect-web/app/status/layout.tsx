import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "System Status | TruckConnect Philippines",
  description:
    "Check the real-time operational status of TruckConnect services including Auth, Shipper Portal, Carrier Portal, Warehouse Portal, Marketplace, API Gateway, and Database.",
  openGraph: {
    title: "System Status — TruckConnect Philippines",
    description:
      "Real-time status and uptime information for all TruckConnect platform services.",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
