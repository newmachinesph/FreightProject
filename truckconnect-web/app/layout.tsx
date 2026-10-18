import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: {
    default: "TruckConnect Philippines — Freight & Logistics Platform",
    template: "%s | TruckConnect",
  },
  description:
    "The logistics platform connecting shippers, carriers, and warehouses across the Philippines. No middlemen, transparent pricing, instant payouts.",
  keywords: [
    "freight",
    "logistics",
    "Philippines",
    "trucking",
    "shipping",
    "cargo",
    "warehouse",
    "supply chain",
    "TruckConnect",
    "freight marketplace",
  ],
  openGraph: {
    siteName: "TruckConnect Philippines",
    title: "TruckConnect Philippines — Freight & Logistics Platform",
    description:
      "The logistics platform connecting shippers, carriers, and warehouses across the Philippines.",
    type: "website",
    locale: "en_PH",
    url: "https://truckconnect.ph",
  },
  twitter: {
    card: "summary_large_image",
    title: "TruckConnect Philippines — Freight & Logistics Platform",
    description:
      "The logistics platform connecting shippers, carriers, and warehouses across the Philippines.",
  },
  metadataBase: new URL("https://truckconnect.ph"),
  manifest: "/manifest.json",
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#2563EB",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <style>{`
          html {
            scroll-behavior: smooth;
          }
          body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            color: #1a1a2e;
            background-color: #ffffff;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          * {
            box-sizing: border-box;
          }
          /* Card hover transitions */
          [class*="card"],
          div[style*="border-radius"][style*="box-shadow"] {
            transition: box-shadow 0.2s ease, transform 0.2s ease;
          }
          [class*="card"]:hover,
          div[style*="border-radius"][style*="box-shadow"]:hover {
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          }
          /* Link transitions */
          a {
            transition: color 0.2s ease, opacity 0.2s ease;
          }
          a:hover {
            opacity: 0.85;
          }
          /* Button hover effects */
          button, [role="button"], a[style*="background"] {
            transition: transform 0.15s ease, box-shadow 0.15s ease, background-color 0.2s ease;
          }
          button:hover, [role="button"]:hover {
            transform: scale(1.02);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }
          button:active, [role="button"]:active {
            transform: scale(0.98);
          }
          /* Focus ring for accessibility */
          :focus-visible {
            outline: 2px solid #2563EB;
            outline-offset: 2px;
          }
          /* Selection color */
          ::selection {
            background-color: #2563EB;
            color: #ffffff;
          }
          /* Scrollbar styling */
          ::-webkit-scrollbar {
            width: 6px;
          }
          ::-webkit-scrollbar-track {
            background: transparent;
          }
          ::-webkit-scrollbar-thumb {
            background: #D1D5DB;
            border-radius: 3px;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: #9CA3AF;
          }
        `}</style>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
