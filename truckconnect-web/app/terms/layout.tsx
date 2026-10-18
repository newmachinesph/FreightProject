import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | TruckConnect Philippines",
  description:
    "Read the Terms of Service governing your use of the TruckConnect freight and logistics platform in the Philippines. Covers shipper, carrier, and warehouse obligations.",
  openGraph: {
    title: "Terms of Service — TruckConnect Philippines",
    description:
      "Terms and conditions for using TruckConnect, the Philippine freight platform connecting shippers, carriers, and warehouses.",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
