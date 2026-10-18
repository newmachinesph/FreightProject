import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers | TruckConnect Philippines",
  description:
    "Join TruckConnect and help build the future of Philippine logistics. Open positions in Engineering, Design, Sales, and Operations.",
  openGraph: {
    title: "Careers — TruckConnect Philippines",
    description:
      "Work at TruckConnect. Remote-first, mission-driven, fast-growing logistics tech company.",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
