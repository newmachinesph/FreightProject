"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Package,
  Truck,
  Warehouse,
  Store,
  ArrowRight,
  CheckCircle,
  BarChart3,
  MapPin,
  Bell,
  FileText,
  CreditCard,
  Users,
  Search,
  Star,
  Thermometer,
  ClipboardList,
  Shield,
  Zap,
  Quote,
} from "lucide-react";
import type { CSSProperties, ReactNode } from "react";

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL ?? "http://localhost:3001";

const COLORS = {
  navy: "#1B2D5E",
  navyDark: "#142248",
  blue: "#2563EB",
  white: "#ffffff",
  gray50: "#f8fafc",
  gray100: "#f1f5f9",
  gray200: "#e2e8f0",
  gray300: "#cbd5e1",
  gray400: "#94a3b8",
  gray500: "#64748b",
  gray600: "#475569",
  gray700: "#334155",
  green: "#059669",
};

const container: CSSProperties = { maxWidth: 1200, margin: "0 auto", padding: "0 24px" };

const PRODUCTS = [
  {
    id: "shipper",
    icon: <Package size={40} color={COLORS.blue} />,
    bgColor: "#dbeafe",
    accentColor: COLORS.blue,
    name: "Shipper Portal",
    tagline: "Post loads, get quotes, track shipments",
    description:
      "The complete shipping management platform for Philippine businesses. Post loads, receive competitive bids from verified carriers, track shipments in real time, and manage all your logistics from one dashboard.",
    features: [
      { icon: <FileText size={20} />, text: "Post loads with detailed requirements" },
      { icon: <Users size={20} />, text: "Receive bids from verified carriers" },
      { icon: <MapPin size={20} />, text: "Real-time GPS shipment tracking" },
      { icon: <BarChart3 size={20} />, text: "Analytics and reporting dashboard" },
      { icon: <Bell size={20} />, text: "Instant notifications on load status" },
      { icon: <CreditCard size={20} />, text: "Transparent pricing — no hidden fees" },
    ],
    url: "http://localhost:3003",
    testimonial: {
      quote: "TruckConnect cut our shipping coordination time in half. We used to spend hours on the phone with brokers — now we post a load and get bids in minutes.",
      name: "Maria Santos",
      role: "Logistics Manager",
      company: "Manila Fresh Produce Co.",
    },
    dashboardStats: [
      { label: "Active Loads", value: "24" },
      { label: "Bids Received", value: "87" },
      { label: "On-Time Rate", value: "96%" },
      { label: "Avg Savings", value: "18%" },
    ],
  },
  {
    id: "carrier",
    icon: <Truck size={40} color="#059669" />,
    bgColor: "#dcfce7",
    accentColor: "#059669",
    name: "Carrier Portal",
    tagline: "Find loads, manage your fleet, earn more",
    description:
      "Grow your trucking business by connecting directly with shippers. Browse available loads, bid competitively, manage your entire fleet, and get paid fast — no middlemen taking a cut.",
    features: [
      { icon: <Search size={20} />, text: "Browse and filter available loads" },
      { icon: <Zap size={20} />, text: "Instant bid submission" },
      { icon: <Truck size={20} />, text: "Fleet management and driver tracking" },
      { icon: <CreditCard size={20} />, text: "Fast payouts via GCash or bank transfer" },
      { icon: <Star size={20} />, text: "Build your carrier reputation and rating" },
      { icon: <Shield size={20} />, text: "LTFRB compliance verification" },
    ],
    url: "http://localhost:3004",
    testimonial: {
      quote: "Since joining TruckConnect, our fleet utilization went from 60% to over 85%. No more deadhead trips — there's always a load waiting for us on the return route.",
      name: "Jose Reyes",
      role: "Owner-Operator",
      company: "JR Trucking Services",
    },
    dashboardStats: [
      { label: "Available Loads", value: "142" },
      { label: "My Bids", value: "12" },
      { label: "Fleet Vehicles", value: "8" },
      { label: "Revenue (MTD)", value: "P385K" },
    ],
  },
  {
    id: "warehouse",
    icon: <Warehouse size={40} color="#d97706" />,
    bgColor: "#fef3c7",
    accentColor: "#d97706",
    name: "Warehouse Portal",
    tagline: "Manage inventory, logistics, and cold storage",
    description:
      "The all-in-one warehouse management system for Philippine logistics. Track inventory, manage inbound and outbound shipments, handle cold storage requirements, and connect with shippers who need storage.",
    features: [
      { icon: <ClipboardList size={20} />, text: "Inventory management dashboard" },
      { icon: <Truck size={20} />, text: "Inbound/outbound shipment tracking" },
      { icon: <Thermometer size={20} />, text: "Cold storage monitoring" },
      { icon: <BarChart3 size={20} />, text: "Capacity utilization analytics" },
      { icon: <Bell size={20} />, text: "Automated alerts and notifications" },
      { icon: <Users size={20} />, text: "Client portal for shippers" },
    ],
    url: "http://localhost:3005",
    testimonial: {
      quote: "Managing our 3 warehouses across Luzon was a nightmare before TruckConnect. Now we have real-time visibility on every pallet, and our clients can check their inventory anytime.",
      name: "Angela Lim",
      role: "Operations Director",
      company: "Pacific Cold Storage Inc.",
    },
    dashboardStats: [
      { label: "Total SKUs", value: "1,247" },
      { label: "Capacity Used", value: "73%" },
      { label: "Inbound Today", value: "18" },
      { label: "Temp Alerts", value: "0" },
    ],
  },
  {
    id: "marketplace",
    icon: <Store size={40} color="#7c3aed" />,
    bgColor: "#ede9fe",
    accentColor: "#7c3aed",
    name: "Marketplace",
    tagline: "The freight marketplace for the Philippines",
    description:
      "The open marketplace where shippers find carriers, carriers find loads, and everyone finds warehouse space. Browse listings, compare rates, read reviews, and connect — all in one place.",
    features: [
      { icon: <Search size={20} />, text: "Search carriers, loads, and warehouses" },
      { icon: <Star size={20} />, text: "Verified reviews and ratings" },
      { icon: <MapPin size={20} />, text: "Route-based search and filtering" },
      { icon: <CreditCard size={20} />, text: "Transparent rate comparison" },
      { icon: <Shield size={20} />, text: "All providers verified and compliant" },
      { icon: <Zap size={20} />, text: "Instant booking and connection" },
    ],
    url: "http://localhost:3006",
    testimonial: {
      quote: "As a small business owner in Cebu, finding reliable carriers was always a gamble. TruckConnect Marketplace lets me see ratings, reviews, and compare rates instantly. Game changer.",
      name: "Roberto Cruz",
      role: "Founder",
      company: "Visayas Artisan Goods",
    },
    dashboardStats: [
      { label: "Carriers Listed", value: "520+" },
      { label: "Avg Rating", value: "4.8" },
      { label: "Routes Covered", value: "340" },
      { label: "Active Listings", value: "1.2K" },
    ],
  },
];

const COMPARISON_DIMENSIONS = [
  { dimension: "Real-time Tracking", shipper: true, carrier: true, warehouse: false, marketplace: true },
  { dimension: "Bidding System", shipper: true, carrier: true, warehouse: false, marketplace: false },
  { dimension: "Fleet Management", shipper: false, carrier: true, warehouse: false, marketplace: false },
  { dimension: "Inventory Management", shipper: false, carrier: false, warehouse: true, marketplace: false },
  { dimension: "Analytics Dashboard", shipper: true, carrier: true, warehouse: true, marketplace: true },
  { dimension: "API Access", shipper: true, carrier: true, warehouse: true, marketplace: true },
  { dimension: "Mobile Support", shipper: true, carrier: true, warehouse: true, marketplace: true },
];

function MockDashboard({
  stats,
  accentColor,
  name,
}: {
  stats: { label: string; value: string }[];
  accentColor: string;
  name: string;
}) {
  return (
    <div
      style={{
        borderRadius: 12,
        overflow: "hidden",
        border: `1px solid ${COLORS.gray200}`,
        boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
        backgroundColor: COLORS.white,
      }}
    >
      {/* Title bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 16px",
          backgroundColor: COLORS.gray50,
          borderBottom: `1px solid ${COLORS.gray200}`,
        }}
      >
        <div style={{ display: "flex", gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#ef4444" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#f59e0b" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#22c55e" }} />
        </div>
        <span style={{ fontSize: 12, color: COLORS.gray400, marginLeft: 8 }}>{name}</span>
      </div>
      {/* Dashboard body */}
      <div style={{ display: "flex", minHeight: 220 }}>
        {/* Sidebar */}
        <div
          style={{
            width: 52,
            backgroundColor: COLORS.navy,
            padding: "16px 0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            flexShrink: 0,
          }}
        >
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              style={{
                width: 24,
                height: 24,
                borderRadius: 6,
                backgroundColor: i === 0 ? accentColor : "rgba(255,255,255,0.1)",
              }}
            />
          ))}
        </div>
        {/* Content */}
        <div style={{ flex: 1, padding: 16 }}>
          {/* Stats row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
            {stats.map((s) => (
              <div
                key={s.label}
                style={{
                  padding: "10px 12px",
                  borderRadius: 8,
                  backgroundColor: COLORS.gray50,
                  border: `1px solid ${COLORS.gray100}`,
                }}
              >
                <div style={{ fontSize: 10, color: COLORS.gray400, marginBottom: 2 }}>{s.label}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.navy }}>{s.value}</div>
              </div>
            ))}
          </div>
          {/* Chart placeholder */}
          <div
            style={{
              height: 60,
              borderRadius: 8,
              background: `linear-gradient(90deg, ${accentColor}22 0%, ${accentColor}11 100%)`,
              display: "flex",
              alignItems: "flex-end",
              gap: 4,
              padding: "0 12px 8px",
            }}
          >
            {[40, 65, 50, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: `${h}%`,
                  backgroundColor: accentColor,
                  borderRadius: 2,
                  opacity: 0.6,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar />

      {/* Hero */}
      <section
        style={{
          background: `linear-gradient(135deg, ${COLORS.navy} 0%, ${COLORS.navyDark} 100%)`,
          padding: "80px 0 60px",
          textAlign: "center",
        }}
      >
        <div style={container}>
          <h1 style={{ fontSize: 44, fontWeight: 800, color: COLORS.white, margin: "0 0 16px", lineHeight: 1.15 }}>
            Our Products
          </h1>
          <p style={{ fontSize: 20, color: COLORS.gray300, margin: "0 auto", maxWidth: 560, lineHeight: 1.6 }}>
            Four integrated tools powering every side of Philippine freight logistics.
          </p>
        </div>
      </section>

      {/* Product Sections */}
      {PRODUCTS.map((product, idx) => (
        <section
          key={product.id}
          id={product.id}
          style={{
            padding: "80px 0",
            backgroundColor: idx % 2 === 0 ? COLORS.white : COLORS.gray50,
          }}
        >
          <div style={container}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 64,
                alignItems: "center",
              }}
              className="product-grid"
            >
              {/* Info side */}
              <div style={{ order: idx % 2 === 0 ? 1 : 2 }} className={idx % 2 === 0 ? "" : "product-info-right"}>
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: 16,
                    backgroundColor: product.bgColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 24,
                  }}
                >
                  {product.icon}
                </div>
                <h2 style={{ fontSize: 32, fontWeight: 700, color: COLORS.navy, margin: "0 0 8px" }}>
                  {product.name}
                </h2>
                <p style={{ fontSize: 16, color: COLORS.blue, fontWeight: 600, margin: "0 0 16px" }}>
                  {product.tagline}
                </p>
                <p style={{ fontSize: 16, color: COLORS.gray500, lineHeight: 1.7, margin: "0 0 32px" }}>
                  {product.description}
                </p>
                <a
                  href={`${AUTH_URL}/sign-up`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "12px 24px",
                    backgroundColor: COLORS.blue,
                    color: COLORS.white,
                    border: "none",
                    borderRadius: 8,
                    fontSize: 15,
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  Get Started <ArrowRight size={16} />
                </a>
              </div>

              {/* Screenshot + Features side */}
              <div style={{ order: idx % 2 === 0 ? 2 : 1 }}>
                {/* Mock Dashboard Screenshot */}
                <MockDashboard stats={product.dashboardStats} accentColor={product.accentColor} name={product.name} />

                {/* Features card */}
                <div
                  style={{
                    backgroundColor: COLORS.white,
                    border: `1px solid ${COLORS.gray200}`,
                    borderRadius: 16,
                    padding: 32,
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
                    marginTop: 24,
                  }}
                >
                  <h3
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: COLORS.gray400,
                      textTransform: "uppercase",
                      letterSpacing: 1,
                      margin: "0 0 24px",
                    }}
                  >
                    Key Features
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    {product.features.map((f) => (
                      <div key={f.text} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 10,
                            backgroundColor: product.bgColor,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          {f.icon}
                        </div>
                        <span style={{ fontSize: 15, color: COLORS.gray700, fontWeight: 500 }}>{f.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial */}
            <div
              style={{
                marginTop: 56,
                padding: 32,
                borderRadius: 16,
                backgroundColor: product.bgColor,
                border: `1px solid ${product.accentColor}22`,
                position: "relative",
              }}
            >
              <Quote
                size={32}
                color={product.accentColor}
                style={{ opacity: 0.3, position: "absolute", top: 24, left: 28 }}
              />
              <p
                style={{
                  fontSize: 17,
                  color: COLORS.gray700,
                  lineHeight: 1.8,
                  margin: "0 0 20px",
                  paddingLeft: 8,
                  fontStyle: "italic",
                }}
              >
                &ldquo;{product.testimonial.quote}&rdquo;
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 12, paddingLeft: 8 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    backgroundColor: product.accentColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: COLORS.white,
                    fontWeight: 700,
                    fontSize: 16,
                  }}
                >
                  {product.testimonial.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: COLORS.navy }}>
                    {product.testimonial.name}
                  </div>
                  <div style={{ fontSize: 13, color: COLORS.gray500 }}>
                    {product.testimonial.role}, {product.testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Feature Comparison Table */}
      <section style={{ padding: "80px 0", backgroundColor: COLORS.white }}>
        <div style={container}>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: COLORS.navy, textAlign: "center", margin: "0 0 16px" }}>
            Feature Comparison
          </h2>
          <p
            style={{
              fontSize: 18,
              color: COLORS.gray500,
              textAlign: "center",
              margin: "0 auto 48px",
              maxWidth: 560,
            }}
          >
            See which capabilities are available across each product.
          </p>
          <div
            style={{
              maxWidth: 900,
              margin: "0 auto",
              borderRadius: 12,
              overflow: "hidden",
              border: `1px solid ${COLORS.gray200}`,
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ backgroundColor: COLORS.navy, color: COLORS.white }}>
                  <th style={{ padding: "14px 20px", textAlign: "left", fontWeight: 600 }}>Feature</th>
                  <th style={{ padding: "14px 20px", textAlign: "center", fontWeight: 600 }}>Shipper</th>
                  <th style={{ padding: "14px 20px", textAlign: "center", fontWeight: 600 }}>Carrier</th>
                  <th style={{ padding: "14px 20px", textAlign: "center", fontWeight: 600 }}>Warehouse</th>
                  <th style={{ padding: "14px 20px", textAlign: "center", fontWeight: 600 }}>Marketplace</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_DIMENSIONS.map((row, i) => (
                  <tr
                    key={row.dimension}
                    style={{
                      backgroundColor: i % 2 === 0 ? COLORS.white : COLORS.gray50,
                      borderBottom: `1px solid ${COLORS.gray200}`,
                    }}
                  >
                    <td style={{ padding: "12px 20px", fontWeight: 500, color: COLORS.gray700 }}>
                      {row.dimension}
                    </td>
                    {[row.shipper, row.carrier, row.warehouse, row.marketplace].map((val, ci) => (
                      <td key={ci} style={{ padding: "12px 20px", textAlign: "center" }}>
                        {val ? (
                          <CheckCircle size={18} color={COLORS.green} />
                        ) : (
                          <span style={{ color: COLORS.gray300 }}>&mdash;</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          background: `linear-gradient(135deg, ${COLORS.navy} 0%, ${COLORS.navyDark} 100%)`,
          padding: "80px 0",
          textAlign: "center",
        }}
      >
        <div style={container}>
          <h2 style={{ fontSize: 36, fontWeight: 700, color: COLORS.white, margin: "0 0 16px" }}>
            Ready to get started?
          </h2>
          <p style={{ fontSize: 18, color: COLORS.gray300, margin: "0 0 32px" }}>
            All products are free during our beta period. No credit card required.
          </p>
          <a
            href={`${AUTH_URL}/sign-up`}
            style={{
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
              textDecoration: "none",
            }}
          >
            Get Started Free <ArrowRight size={18} />
          </a>
        </div>
      </section>

      <Footer />

      <style>{`
        @media (max-width: 768px) {
          .product-grid {
            grid-template-columns: 1fr !important;
          }
          .product-grid > div {
            order: unset !important;
          }
        }
      `}</style>
    </div>
  );
}
