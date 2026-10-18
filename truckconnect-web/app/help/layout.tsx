import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help Center | TruckConnect Philippines",
  description:
    "Find answers to common questions about TruckConnect — getting started, shipping, carrier onboarding, warehousing, payments, and account security.",
  openGraph: {
    title: "Help Center — TruckConnect Philippines",
    description:
      "Browse FAQs and guides for shippers, carriers, and warehouse operators on the TruckConnect platform.",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
