"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Package,
  Truck,
  Warehouse,
  Store,
  ArrowRight,
  MapPin,
  CreditCard,
  Headphones,
  Satellite,
  CheckCircle,
  Users,
  TrendingUp,
  Globe,
  Shield,
} from "lucide-react";
import type { CSSProperties, ReactNode } from "react";

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL ?? "http://localhost:3001";

const COLORS = {
  navy: "#1B2D5E",
  navyDark: "#142248",
  blue: "#2563EB",
  blueHover: "#1d4ed8",
  white: "#ffffff",
  gray50: "#f8fafc",
  gray100: "#f1f5f9",
  gray200: "#e2e8f0",
  gray300: "#cbd5e1",
  gray400: "#94a3b8",
  gray500: "#64748b",
  gray600: "#475569",
  gray700: "#334155",
  gray800: "#1e293b",
  gray900: "#0f172a",
  green: "#059669",
  amber: "#d97706",
  red: "#dc2626",
};

const container: CSSProperties = { maxWidth: 1200, margin: "0 auto", padding: "0 24px" };
const sectionPadding: CSSProperties = { padding: "80px 0" };
const sectionTitle: CSSProperties = { fontSize: 32, fontWeight: 700, color: COLORS.navy, textAlign: "center", marginBottom: 16, margin: "0 0 16px" };
const sectionSubtitle: CSSProperties = { fontSize: 18, color: COLORS.gray500, textAlign: "center", marginBottom: 48, maxWidth: 600, margin: "0 auto 48px", lineHeight: 1.6 };

const btnPrimary: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "14px 28px",
  backgroundColor: COLORS.blue,
  color: COLORS.white,
  border: "none",
  borderRadius: 8,
  fontSize: 16,
  fontWeight: 600,
  cursor: "pointer",
  textDecoration: "none",
  transition: "background-color 0.2s",
};

const btnOutline: CSSProperties = {
  ...btnPrimary,
  backgroundColor: "transparent",
  border: `2px solid ${COLORS.white}`,
  color: COLORS.white,
};

export default function HomePage() {
  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar />

      {/* Hero gradient animation */}
      <style>{`
        @keyframes heroGradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .hero-stat-card {
          transition: transform 0.25s ease, background-color 0.25s ease;
        }
        .hero-stat-card:hover {
          transform: scale(1.03);
          background-color: rgba(255,255,255,0.12) !important;
        }
        @media (max-width: 640px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section
        style={{
          background: `linear-gradient(135deg, ${COLORS.navy} 0%, #1a3a8f 25%, ${COLORS.navyDark} 50%, #0f2057 75%, ${COLORS.navy} 100%)`,
          backgroundSize: "300% 300%",
          animation: "heroGradient 12s ease infinite",
          padding: "100px 0 80px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(37, 99, 235, 0.08)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -80,
            left: -80,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "rgba(37, 99, 235, 0.06)",
          }}
        />

        <div style={{ ...container, position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 16px",
                borderRadius: 999,
                backgroundColor: "rgba(5, 150, 105, 0.15)",
                color: "#6ee7b7",
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 24,
                letterSpacing: 0.5,
                border: "1px solid rgba(5, 150, 105, 0.25)",
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#34d399", display: "inline-block" }} />
              Free During Beta
            </div>
            <h1
              style={{
                fontSize: 52,
                fontWeight: 800,
                color: COLORS.white,
                lineHeight: 1.12,
                margin: "0 0 24px",
              }}
            >
              The Philippine
              <br />
              Freight Platform
            </h1>
            <p
              style={{
                fontSize: 20,
                color: COLORS.gray300,
                lineHeight: 1.6,
                maxWidth: 560,
                margin: "0 auto 16px",
              }}
            >
              Connect shippers, carriers, and warehouses in one ecosystem — no
              middlemen, transparent pricing, real-time tracking.
            </p>
            <p
              style={{
                fontSize: 14,
                color: COLORS.gray400,
                marginBottom: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              <Users size={14} />
              Trusted by 200+ Filipino businesses
            </p>
            <div
              style={{
                display: "flex",
                gap: 16,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <a href={`${AUTH_URL}/sign-up`} style={btnPrimary}>
                Get Started Free
                <ArrowRight size={18} />
              </a>
              <a href="http://localhost:3006" style={btnOutline}>
                View Marketplace
              </a>
            </div>
          </div>

          {/* Floating stat cards */}
          <div
            style={{
              marginTop: 72,
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 20,
              maxWidth: 860,
              margin: "72px auto 0",
            }}
            className="stats-grid"
          >
            {[
              { value: "500+", label: "Loads Posted", icon: <Package size={20} color={COLORS.blue} /> },
              { value: "200+", label: "Verified Carriers", icon: <Truck size={20} color="#059669" /> },
              { value: "50+", label: "Warehouses", icon: <Warehouse size={20} color="#d97706" /> },
              { value: "₱45/km", label: "Avg Rate", icon: <TrendingUp size={20} color="#7c3aed" /> },
            ].map((stat) => (
              <div
                key={stat.label}
                className="hero-stat-card"
                style={{
                  textAlign: "center",
                  padding: "24px 16px",
                  borderRadius: 12,
                  backgroundColor: "rgba(255,255,255,0.08)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <div style={{ marginBottom: 8 }}>{stat.icon}</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: COLORS.white }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: 13, color: COLORS.gray400, marginTop: 4 }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Built for Philippine Logistics ──────────────────────────────── */}
      <section style={sectionPadding}>
        <div style={container}>
          <h2 style={sectionTitle}>Built for Philippine Logistics</h2>
          <p style={sectionSubtitle}>
            Designed specifically for the unique challenges of freight and logistics in the Philippines.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 24,
            }}
          >
            {[
              {
                icon: <Globe size={28} color={COLORS.blue} />,
                title: "Island-to-Island Coverage",
                desc: "Connect across Luzon, Visayas, and Mindanao with our network of verified carriers covering major and secondary routes.",
              },
              {
                icon: <CreditCard size={28} color={COLORS.blue} />,
                title: "GCash & Local Payments",
                desc: "Get paid via GCash, bank transfer, or check. Transparent pricing with no hidden fees — pay only when you ship.",
              },
              {
                icon: <Shield size={28} color={COLORS.blue} />,
                title: "LTFRB Compliant",
                desc: "All carriers on the platform are verified against LTFRB requirements. Real-time GPS tracking on every shipment.",
              },
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  padding: 32,
                  borderRadius: 12,
                  backgroundColor: COLORS.white,
                  border: `1px solid ${COLORS.gray200}`,
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 12,
                    backgroundColor: "#dbeafe",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 20,
                  }}
                >
                  {item.icon}
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: COLORS.navy, margin: "0 0 8px" }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: 15, color: COLORS.gray500, lineHeight: 1.6, margin: 0 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Products ───────────────────────────────────────────────── */}
      <section id="products" style={{ ...sectionPadding, backgroundColor: COLORS.gray50 }}>
        <div style={container}>
          <h2 style={sectionTitle}>Our Products</h2>
          <p style={sectionSubtitle}>
            Whether you ship, haul, or store — TruckConnect has the tools you need.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 24,
            }}
          >
            <ProductCard
              icon={<Package size={32} color={COLORS.blue} />}
              title="Shipper Portal"
              description="Post loads, track shipments, manage bookings. Get competitive quotes from verified carriers across the Philippines."
              color="#dbeafe"
              link="/products#shipper"
            />
            <ProductCard
              icon={<Truck size={32} color="#059669" />}
              title="Carrier Portal"
              description="Browse available loads, manage your fleet, earn more with direct shipper connections. No broker fees."
              color="#dcfce7"
              link="/products#carrier"
            />
            <ProductCard
              icon={<Warehouse size={32} color="#d97706" />}
              title="Warehouse Portal"
              description="Manage inventory, inbound/outbound logistics, cold storage — all in one dashboard for your operations."
              color="#fef3c7"
              link="/products#warehouse"
            />
            <ProductCard
              icon={<Store size={32} color="#7c3aed" />}
              title="Marketplace"
              description="Find carriers, warehouses, and loads in one place. Open to everyone — the freight marketplace for the Philippines."
              color="#ede9fe"
              link="/products#marketplace"
            />
          </div>
        </div>
      </section>

      {/* ── How It Works ───────────────────────────────────────────────── */}
      <section style={sectionPadding}>
        <div style={container}>
          <h2 style={sectionTitle}>How It Works</h2>
          <p style={sectionSubtitle}>Get started in three simple steps</p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 40,
              maxWidth: 900,
              margin: "0 auto",
            }}
          >
            {[
              { step: "1", title: "Create Account", desc: "Sign up free and set up your organization profile in minutes.", icon: <Users size={28} color={COLORS.blue} /> },
              { step: "2", title: "Post or Browse", desc: "Shippers post loads. Carriers browse and bid. Warehouses list space.", icon: <Globe size={28} color={COLORS.blue} /> },
              { step: "3", title: "Connect & Ship", desc: "Match, confirm, track, and get paid — all on one platform.", icon: <TrendingUp size={28} color={COLORS.blue} /> },
            ].map((item) => (
              <div key={item.step} style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    background: "#dbeafe",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px",
                  }}
                >
                  {item.icon}
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.blue, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>
                  Step {item.step}
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: COLORS.navy, margin: "0 0 8px" }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: 15, color: COLORS.gray500, lineHeight: 1.6, margin: 0 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Popular Routes ─────────────────────────────────────────────── */}
      <section style={{ ...sectionPadding, backgroundColor: COLORS.gray50 }}>
        <div style={container}>
          <h2 style={sectionTitle}>Popular Routes</h2>
          <p style={sectionSubtitle}>
            Competitive rates on the Philippines&apos; busiest freight corridors
          </p>

          <div
            style={{
              maxWidth: 700,
              margin: "0 auto",
              borderRadius: 12,
              overflow: "hidden",
              border: `1px solid ${COLORS.gray200}`,
              backgroundColor: COLORS.white,
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 15 }}>
              <thead>
                <tr style={{ backgroundColor: COLORS.navy, color: COLORS.white }}>
                  <th style={{ padding: "14px 20px", textAlign: "left", fontWeight: 600, fontSize: 13, textTransform: "uppercase", letterSpacing: 0.5 }}>
                    Route
                  </th>
                  <th style={{ padding: "14px 20px", textAlign: "right", fontWeight: 600, fontSize: 13, textTransform: "uppercase", letterSpacing: 0.5 }}>
                    Rate Range
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { route: "Manila → Cebu", range: "₱18,000 – ₱42,000" },
                  { route: "Manila → Davao", range: "₱35,000 – ₱85,000" },
                  { route: "Clark → Subic", range: "₱8,000 – ₱15,000" },
                  { route: "Batangas → Laguna", range: "₱4,500 – ₱12,000" },
                ].map((r, i) => (
                  <tr
                    key={r.route}
                    style={{
                      borderBottom: i < 3 ? `1px solid ${COLORS.gray200}` : "none",
                      backgroundColor: i % 2 === 0 ? COLORS.white : COLORS.gray50,
                    }}
                  >
                    <td style={{ padding: "14px 20px", fontWeight: 500, display: "flex", alignItems: "center", gap: 8 }}>
                      <MapPin size={16} color={COLORS.blue} />
                      {r.route}
                    </td>
                    <td style={{ padding: "14px 20px", textAlign: "right", fontWeight: 600, color: COLORS.green }}>
                      {r.range}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Trusted by Filipino Businesses ─────────────────────────────── */}
      <section style={sectionPadding}>
        <div style={container}>
          <h2 style={sectionTitle}>Trusted by Filipino Businesses</h2>
          <p style={sectionSubtitle}>
            Built for Philippine logistics with compliance and security in mind
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 24,
              maxWidth: 960,
              margin: "0 auto",
            }}
          >
            {[
              { icon: <Shield size={28} color={COLORS.blue} />, title: "LTFRB Compliant", desc: "All carriers verified against LTFRB requirements" },
              { icon: <Satellite size={28} color={COLORS.blue} />, title: "GPS Tracking", desc: "Real-time location tracking on every shipment" },
              { icon: <CreditCard size={28} color={COLORS.blue} />, title: "GCash & Bank Transfer", desc: "Instant payouts via GCash, bank transfer, or check" },
              { icon: <Headphones size={28} color={COLORS.blue} />, title: "24/7 Support", desc: "Dedicated Philippine support team around the clock" },
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  textAlign: "center",
                  padding: 32,
                  borderRadius: 12,
                  border: `1px solid ${COLORS.gray200}`,
                  backgroundColor: COLORS.white,
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    background: "#dbeafe",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px",
                  }}
                >
                  {item.icon}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.navy, margin: "0 0 8px" }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: 14, color: COLORS.gray500, lineHeight: 1.5, margin: 0 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ────────────────────────────────────────────────────── */}
      <section id="pricing" style={{ ...sectionPadding, backgroundColor: COLORS.gray50 }}>
        <div style={container}>
          <div
            style={{
              maxWidth: 560,
              margin: "0 auto",
              textAlign: "center",
              padding: "48px 40px",
              borderRadius: 16,
              backgroundColor: COLORS.white,
              border: `1px solid ${COLORS.gray200}`,
              boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "4px 16px",
                borderRadius: 999,
                backgroundColor: "#dcfce7",
                color: COLORS.green,
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 20,
              }}
            >
              BETA
            </div>
            <h2 style={{ fontSize: 32, fontWeight: 700, color: COLORS.navy, margin: "0 0 12px" }}>
              Free During Beta
            </h2>
            <p style={{ fontSize: 18, color: COLORS.gray500, lineHeight: 1.6, margin: "0 0 32px" }}>
              All features available at no cost during our beta period.
              <br />
              Pay only when you ship.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start", maxWidth: 320, margin: "0 auto 32px" }}>
              {["Unlimited load postings", "Fleet management tools", "Real-time tracking", "Instant payout processing"].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 15, color: COLORS.gray700 }}>
                  <CheckCircle size={18} color={COLORS.green} />
                  {item}
                </div>
              ))}
            </div>
            <a href="/pricing" style={btnPrimary}>
              View Full Pricing
              <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* ── Integration Logos ─────────────────────────────────────────── */}
      <section style={{ ...sectionPadding, backgroundColor: COLORS.white }}>
        <div style={container}>
          <h2 style={sectionTitle}>Integrates with your tools</h2>
          <p style={sectionSubtitle}>
            Connect TruckConnect to the platforms you already use.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              gap: 20,
              maxWidth: 900,
              margin: "0 auto",
            }}
          >
            {["SAP", "Oracle", "Shopify", "Lazada", "Shopee", "QuickBooks"].map((name) => (
              <div
                key={name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "20px 12px",
                  borderRadius: 12,
                  border: `1px solid ${COLORS.gray200}`,
                  backgroundColor: COLORS.gray50,
                  fontSize: 14,
                  fontWeight: 700,
                  color: COLORS.gray600,
                  letterSpacing: 0.3,
                  userSelect: "none",
                }}
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ──────────────────────────────────────────────────── */}
      <section
        style={{
          background: `linear-gradient(135deg, ${COLORS.navy} 0%, #1a3a8f 50%, ${COLORS.navyDark} 100%)`,
          padding: "96px 0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 350,
            height: 350,
            borderRadius: "50%",
            background: "rgba(37, 99, 235, 0.1)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -60,
            left: -60,
            width: 250,
            height: 250,
            borderRadius: "50%",
            background: "rgba(37, 99, 235, 0.08)",
          }}
        />
        <div style={{ ...container, textAlign: "center", position: "relative", zIndex: 1 }}>
          <h2 style={{ fontSize: 40, fontWeight: 700, color: COLORS.white, margin: "0 0 16px" }}>
            Start shipping smarter today
          </h2>
          <p style={{ fontSize: 18, color: COLORS.gray300, lineHeight: 1.6, margin: "0 0 40px", maxWidth: 560, marginLeft: "auto", marginRight: "auto" }}>
            Join hundreds of logistics companies already saving time and money with TruckConnect.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a href={`${AUTH_URL}/sign-up`} style={btnPrimary}>
              Create Free Account
              <ArrowRight size={18} />
            </a>
            <a href="/demo" style={btnOutline}>
              Book a Demo
            </a>
          </div>
          <p style={{ fontSize: 13, color: COLORS.gray400, marginTop: 20, margin: "20px 0 0" }}>
            No credit card required
          </p>
        </div>
      </section>

      <Footer />

      <style>{`
        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .integrations-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
}

/* ── Product Card ──────────────────────────────────────────────────────────── */

function ProductCard({
  icon,
  title,
  description,
  color,
  link,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  color: string;
  link: string;
}) {
  return (
    <a
      href={link}
      style={{
        display: "block",
        padding: 32,
        borderRadius: 12,
        backgroundColor: "#ffffff",
        border: "1px solid #e2e8f0",
        textDecoration: "none",
        transition: "box-shadow 0.2s, transform 0.2s",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 12,
          backgroundColor: color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 20,
        }}
      >
        {icon}
      </div>
      <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1B2D5E", margin: "0 0 8px" }}>
        {title}
      </h3>
      <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.6, margin: "0 0 16px" }}>
        {description}
      </p>
      <span style={{ fontSize: 14, fontWeight: 600, color: "#2563EB", display: "inline-flex", alignItems: "center", gap: 4 }}>
        Learn More <ArrowRight size={14} />
      </span>
    </a>
  );
}
