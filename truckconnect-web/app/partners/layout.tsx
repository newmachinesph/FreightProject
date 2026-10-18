import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partners | TruckConnect Philippines",
  description:
    "Join TruckConnect's partner ecosystem. Integrate your logistics services, fleet management tools, or warehouse solutions with the Philippine freight platform.",
  openGraph: {
    title: "Partners — TruckConnect Philippines",
    description:
      "Become a TruckConnect partner and help modernize freight logistics across the Philippines.",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
