import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Developers | TruckConnect Philippines",
  description:
    "Build on TruckConnect with RESTful APIs, JavaScript SDK, and real-time webhooks. Developer documentation and API reference.",
  openGraph: {
    title: "Developers — TruckConnect Philippines",
    description:
      "TruckConnect API documentation, SDKs, and integration guides for developers.",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
