import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Security | TruckConnect Philippines",
  description:
    "Learn how TruckConnect protects your data with enterprise-grade security, encryption, and compliance standards for Philippine freight and logistics operations.",
  openGraph: {
    title: "Security — TruckConnect Philippines",
    description:
      "Enterprise-grade security for the Philippine freight platform. Encryption, compliance, and data protection.",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
