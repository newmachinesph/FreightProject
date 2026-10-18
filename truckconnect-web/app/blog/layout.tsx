import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | TruckConnect Philippines",
  description:
    "Insights on Philippine logistics, freight technology, supply chain innovation, and TruckConnect product updates.",
  openGraph: {
    title: "Blog — TruckConnect Philippines",
    description:
      "Latest insights on Philippine freight and logistics technology.",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
