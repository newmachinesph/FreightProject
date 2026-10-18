import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | TruckConnect Philippines",
  description:
    "TruckConnect's Privacy Policy explains how we collect, use, and protect your personal data in compliance with the Philippine Data Privacy Act of 2012 (RA 10173).",
  openGraph: {
    title: "Privacy Policy — TruckConnect Philippines",
    description:
      "How TruckConnect handles your data. Compliant with the Philippine Data Privacy Act (RA 10173) and NPC regulations.",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
