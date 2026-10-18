import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | TruckConnect Philippines",
  description:
    "Built in the Philippines, for the Philippines. Learn about TruckConnect's mission to revolutionize logistics across 7,600 islands.",
  openGraph: {
    title: "About — TruckConnect Philippines",
    description:
      "The team behind the Philippine freight platform connecting shippers, carriers, and warehouses.",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
