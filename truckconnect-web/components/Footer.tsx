import { Truck } from "lucide-react";
import Link from "next/link";

const COLORS = {
  blue: "#2563EB",
  white: "#ffffff",
  gray400: "#94a3b8",
  gray500: "#64748b",
  gray700: "#334155",
  gray900: "#0f172a",
};

const FOOTER_COLUMNS = [
  {
    title: "Products",
    links: [
      { label: "Shipper Portal", href: "/products#shipper" },
      { label: "Carrier Portal", href: "/products#carrier" },
      { label: "Warehouse Portal", href: "/products#warehouse" },
      { label: "Marketplace", href: "/products#marketplace" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Partners", href: "/partners" },
      { label: "Careers", href: "/careers" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Developers", href: "/developers" },
      { label: "API Docs", href: "http://localhost:3001/docs" },
      { label: "Security", href: "/security" },
      { label: "Help Center", href: "/help" },
      { label: "Marketplace", href: "http://localhost:3006" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "System Status", href: "/status" },
      { label: "Cookie Policy", href: "#" },
      { label: "Data Processing", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer style={{ backgroundColor: COLORS.gray900, padding: "64px 0 32px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        {/* Top section */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
            gap: 40,
          }}
          className="footer-grid"
        >
          {/* Brand column */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <Truck size={22} color={COLORS.blue} />
              <span style={{ fontSize: 20, fontWeight: 700, color: COLORS.white }}>
                <span style={{ color: COLORS.blue }}>Truck</span>Connect
              </span>
            </div>
            <p style={{ fontSize: 14, color: COLORS.gray400, lineHeight: 1.7, margin: 0, maxWidth: 280 }}>
              The Philippine freight platform connecting shippers, carriers, and warehouses in one ecosystem.
            </p>
          </div>

          {/* Link columns */}
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 style={{ fontSize: 13, fontWeight: 600, color: COLORS.gray400, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 16px" }}>
                {col.title}
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {col.links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    style={{ color: COLORS.gray500, textDecoration: "none", fontSize: 14, transition: "color 0.2s" }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div
          style={{
            borderTop: `1px solid ${COLORS.gray700}`,
            marginTop: 48,
            paddingTop: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <p style={{ fontSize: 13, color: COLORS.gray500, margin: 0 }}>
            &copy; 2026 TruckConnect Philippines. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: 24 }}>
            {[
              { label: "Privacy", href: "/privacy" },
              { label: "Terms", href: "/terms" },
              { label: "Status", href: "/status" },
            ].map((t) => (
              <Link key={t.label} href={t.href} style={{ fontSize: 13, color: COLORS.gray500, textDecoration: "none" }}>
                {t.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 480px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
