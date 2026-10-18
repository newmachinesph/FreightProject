import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book a Demo | TruckConnect Philippines",
  description:
    "See TruckConnect in action. Book a personalized demo to explore load posting, real-time tracking, fleet management, and warehouse operations.",
  openGraph: {
    title: "Book a Demo — TruckConnect Philippines",
    description:
      "Schedule a live walkthrough of the Philippine freight platform that connects shippers, carriers, and warehouses.",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
