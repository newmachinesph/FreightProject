import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products | TruckConnect Philippines",
  description:
    "Explore TruckConnect's logistics products: Shipper Portal, Carrier Portal, Warehouse Portal, and Freight Marketplace for the Philippines.",
  openGraph: {
    title: "Products — TruckConnect Philippines",
    description:
      "Complete logistics platform connecting shippers, carriers, and warehouses across the Philippines.",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
