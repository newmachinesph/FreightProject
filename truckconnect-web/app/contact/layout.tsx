import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | TruckConnect Philippines",
  description:
    "Get in touch with TruckConnect. Offices in Manila (BGC), Cebu, and Davao. Email: hello@truckconnect.ph",
  openGraph: {
    title: "Contact — TruckConnect Philippines",
    description:
      "Contact TruckConnect for sales, support, partnerships, or press inquiries.",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
