import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing | TruckConnect Philippines",
  description:
    "TruckConnect pricing plans: Free, Starter ₱2,500/mo, and Business ₱7,500/mo. Free during beta. No contracts.",
  openGraph: {
    title: "Pricing — TruckConnect Philippines",
    description:
      "Affordable freight logistics pricing for Philippine businesses. Start free during beta.",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
