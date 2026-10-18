"use client";

import { useState } from "react";
import {
  ArrowLeft,
  LogIn,
  Package,
  Truck,
  Warehouse as WarehouseIcon,
  Gavel,
  MapPin,
  Star,
  CheckCircle,
  Clock,
  Eye,
  Bookmark,
  XCircle,
  Navigation,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { useSession } from "@/lib/auth";

// ── Mock Data ──

const mockBids = [
  {
    id: "BID-1001",
    loadId: "LD-001",
    route: "Manila \u2192 Cebu City",
    amount: 78000,
    status: "pending",
    commodity: "FMCG / Consumer Goods",
    weight: "18,000 kg",
    date: "March 19, 2026",
  },
  {
    id: "BID-1002",
    loadId: "LD-006",
    route: "Batangas City \u2192 Clark",
    amount: 58000,
    status: "accepted",
    commodity: "Steel / Construction Materials",
    weight: "22,000 kg",
    date: "March 18, 2026",
  },
  {
    id: "BID-1003",
    loadId: "LD-007",
    route: "Manila \u2192 Iloilo City",
    amount: 45000,
    status: "rejected",
    commodity: "Pharmaceuticals (Cold Chain)",
    weight: "4,500 kg",
    date: "March 17, 2026",
  },
  {
    id: "BID-1004",
    loadId: "LD-012",
    route: "Davao \u2192 Cagayan de Oro",
    amount: 32000,
    status: "pending",
    commodity: "Fresh Produce",
    weight: "12,000 kg",
    date: "March 17, 2026",
  },
  {
    id: "BID-1005",
    loadId: "LD-015",
    route: "Subic Bay \u2192 Manila",
    amount: 24000,
    status: "accepted",
    commodity: "Electronics / Components",
    weight: "8,200 kg",
    date: "March 16, 2026",
  },
];

const mockBookings = [
  {
    id: "BK-2001",
    type: "load" as const,
    carrier: "PhilTrans Logistics",
    title: "Clark \u2192 Manila",
    detail: "Electronics / Components \u00b7 8 tons",
    status: "in_transit",
    tracking: "PTL-88421",
    date: "March 19, 2026",
    amount: 18000,
  },
  {
    id: "BK-2002",
    type: "warehouse" as const,
    carrier: "WareSpace Inc.",
    title: "Manila Central Warehouse",
    detail: "Zone A - Dry, 500 sqm \u00b7 30 days",
    status: "active",
    tracking: "WS-30012",
    date: "March 15, 2026",
    amount: 175000,
  },
  {
    id: "BK-2003",
    type: "load" as const,
    carrier: "IslandFreight Co.",
    title: "Manila \u2192 Iloilo City",
    detail: "Pharmaceuticals \u00b7 4.5 tons (Reefer)",
    status: "completed",
    tracking: "IFC-77203",
    date: "March 12, 2026",
    amount: 45000,
  },
];

const mockSavedLoads = [
  {
    id: "LD-009",
    route: "Manila \u2192 Zamboanga",
    commodity: "Canned Goods",
    weight: "20,000 kg",
    rate: 95000,
    deadline: "March 22, 2026",
    mode: "RoRo + Truck",
  },
  {
    id: "LD-011",
    route: "Cebu \u2192 Tacloban",
    commodity: "Building Materials",
    weight: "15,000 kg",
    rate: 42000,
    deadline: "March 21, 2026",
    mode: "FTL",
  },
  {
    id: "LD-014",
    route: "Batangas \u2192 Mindoro",
    commodity: "Agricultural Supplies",
    weight: "10,000 kg",
    rate: 28000,
    deadline: "March 23, 2026",
    mode: "RoRo",
  },
  {
    id: "LD-018",
    route: "Manila \u2192 Baguio",
    commodity: "Frozen Seafood (Reefer)",
    weight: "6,000 kg",
    rate: 35000,
    deadline: "March 24, 2026",
    mode: "Reefer Truck",
  },
];

const mockRecentViews = [
  { id: "LD-001", type: "load" as const, title: "Manila \u2192 Cebu City", subtitle: "FMCG / Consumer Goods", viewedAt: "2 hours ago" },
  { id: "CR-003", type: "carrier" as const, title: "PhilTrans Logistics", subtitle: "FTL \u00b7 4.8\u2605 \u00b7 Metro Manila", viewedAt: "3 hours ago" },
  { id: "WH-001", type: "warehouse" as const, title: "Manila Central Warehouse", subtitle: "Dry \u00b7 5,000 sqm \u00b7 Tondo", viewedAt: "5 hours ago" },
  { id: "LD-006", type: "load" as const, title: "Batangas City \u2192 Clark", subtitle: "Steel / Construction Materials", viewedAt: "Yesterday" },
  { id: "CR-007", type: "carrier" as const, title: "IslandFreight Co.", subtitle: "Inter-island \u00b7 4.6\u2605 \u00b7 Cebu", viewedAt: "Yesterday" },
  { id: "LD-012", type: "load" as const, title: "Davao \u2192 Cagayan de Oro", subtitle: "Fresh Produce", viewedAt: "2 days ago" },
];

// ── Styling helpers ──

const statusBadges: Record<string, { bg: string; text: string; label: string }> = {
  pending:    { bg: "#FEF3C7", text: "#92400E", label: "Pending" },
  accepted:   { bg: "#DCFCE7", text: "#166534", label: "Accepted" },
  rejected:   { bg: "#FEE2E2", text: "#991B1B", label: "Rejected" },
  in_transit: { bg: "#DBEAFE", text: "#1E40AF", label: "In Transit" },
  active:     { bg: "#DCFCE7", text: "#166534", label: "Active" },
  completed:  { bg: "#F3F4F6", text: "#374151", label: "Completed" },
};

const typeIcons = {
  load: { icon: Package, color: "#2563eb", bg: "#EFF6FF" },
  carrier: { icon: Truck, color: "#059669", bg: "#ECFDF5" },
  warehouse: { icon: WarehouseIcon, color: "#7c3aed", bg: "#F5F3FF" },
};

function formatRate(rate: number): string {
  return new Intl.NumberFormat("en-PH").format(rate);
}

type TabKey = "bids" | "bookings" | "saved" | "recent";

export default function ActivityPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("bids");
  const session = useSession();
  const isSignedIn = session?.data?.user != null;

  const tabs: { key: TabKey; label: string; count: number }[] = [
    { key: "bids", label: "My Bids", count: mockBids.length },
    { key: "bookings", label: "My Bookings", count: mockBookings.length },
    { key: "saved", label: "Saved Loads", count: mockSavedLoads.length },
    { key: "recent", label: "Recent Views", count: mockRecentViews.length },
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <Navbar active="My Activity" />

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "20px 24px 64px" }}>
        <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#6B7280", fontSize: 13, textDecoration: "none", marginBottom: 16 }}>
          <ArrowLeft size={14} /> Back to Marketplace
        </a>

        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#0f172a", margin: "8px 0 6px" }}>My Activity</h1>
        <p style={{ fontSize: 14, color: "#6B7280", margin: "0 0 24px" }}>Track your bids, bookings, saved loads, and recent views</p>

        {!isSignedIn ? (
          <div style={{
            backgroundColor: "#ffffff",
            borderRadius: 12,
            border: "1px solid #e2e8f0",
            padding: 48,
            textAlign: "center",
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: "50%", backgroundColor: "#EFF6FF",
              display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px",
            }}>
              <LogIn size={28} color="#2563EB" />
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: "0 0 8px" }}>Sign in to view your activity</h2>
            <p style={{ fontSize: 14, color: "#6B7280", margin: "0 0 24px", lineHeight: 1.6 }}>
              Track your bids, shipments, and warehouse inquiries all in one place.
              Browsing the marketplace is free -- sign in to start transacting.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", background: "#f8fafc", borderRadius: 8, border: "1px solid #f1f5f9" }}>
                <Gavel size={16} color="#d97706" />
                <span style={{ fontSize: 13, color: "#374151" }}>Place Bids</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", background: "#f8fafc", borderRadius: 8, border: "1px solid #f1f5f9" }}>
                <Truck size={16} color="#2563eb" />
                <span style={{ fontSize: 13, color: "#374151" }}>Book Carriers</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", background: "#f8fafc", borderRadius: 8, border: "1px solid #f1f5f9" }}>
                <WarehouseIcon size={16} color="#7c3aed" />
                <span style={{ fontSize: 13, color: "#374151" }}>Reserve Space</span>
              </div>
            </div>
            <a
              href={process.env.NEXT_PUBLIC_AUTH_URL ?? "http://localhost:3001"}
              style={{
                display: "inline-block",
                padding: "12px 32px", border: "none", borderRadius: 10,
                fontSize: 14, fontWeight: 600, color: "#ffffff", backgroundColor: "#2563eb",
                cursor: "pointer", textDecoration: "none",
              }}
            >
              Sign In
            </a>
          </div>
        ) : (
          <div>
            {/* Tabs */}
            <div style={{ display: "flex", gap: 4, marginBottom: 20, flexWrap: "wrap" }}>
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    padding: "8px 16px", border: "1px solid #e2e8f0", borderRadius: 8,
                    cursor: "pointer", fontSize: 13, fontWeight: activeTab === tab.key ? 600 : 400,
                    color: activeTab === tab.key ? "#2563eb" : "#6B7280",
                    backgroundColor: activeTab === tab.key ? "#EFF6FF" : "#ffffff",
                    transition: "all 0.15s",
                  }}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>

            {/* My Bids Tab */}
            {activeTab === "bids" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {mockBids.map((bid) => {
                  const badge = statusBadges[bid.status];
                  return (
                    <a key={bid.id} href={`/loads/${bid.loadId}`} style={{ textDecoration: "none", color: "inherit" }}>
                      <div style={{
                        backgroundColor: "#ffffff", borderRadius: 10, border: "1px solid #e2e8f0",
                        padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between",
                        cursor: "pointer", transition: "box-shadow 0.2s",
                      }}
                        onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)"}
                        onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Gavel size={20} color="#2563eb" />
                          </div>
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                              <span style={{ fontSize: 12, fontWeight: 600, color: "#64748b", fontFamily: "monospace" }}>{bid.id}</span>
                              <span style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{bid.route}</span>
                            </div>
                            <div style={{ fontSize: 12, color: "#94a3b8" }}>{bid.commodity} &middot; {bid.weight} &middot; {bid.date}</div>
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <span style={{ fontSize: 16, fontWeight: 700, color: "#059669" }}>{"\u20B1"}{formatRate(bid.amount)}</span>
                          <span style={{
                            padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600,
                            backgroundColor: badge.bg, color: badge.text,
                          }}>{badge.label}</span>
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            )}

            {/* My Bookings Tab */}
            {activeTab === "bookings" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {mockBookings.map((booking) => {
                  const badge = statusBadges[booking.status];
                  const ti = typeIcons[booking.type];
                  const Icon = ti.icon;
                  return (
                    <div key={booking.id} style={{
                      backgroundColor: "#ffffff", borderRadius: 10, border: "1px solid #e2e8f0",
                      padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between",
                      cursor: "pointer", transition: "box-shadow 0.2s",
                    }}
                      onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)"}
                      onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: ti.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Icon size={20} color={ti.color} />
                        </div>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                            <span style={{ fontSize: 12, fontWeight: 600, color: "#64748b", fontFamily: "monospace" }}>{booking.id}</span>
                            <span style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{booking.title}</span>
                          </div>
                          <div style={{ fontSize: 12, color: "#94a3b8" }}>
                            {booking.carrier} &middot; {booking.detail}
                          </div>
                          <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>
                            <Navigation size={10} style={{ display: "inline", verticalAlign: "middle", marginRight: 3 }} />
                            Tracking: <span style={{ fontFamily: "monospace", color: "#64748b" }}>{booking.tracking}</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{ fontSize: 16, fontWeight: 700, color: "#059669" }}>{"\u20B1"}{formatRate(booking.amount)}</span>
                        <span style={{
                          padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600,
                          backgroundColor: badge.bg, color: badge.text,
                        }}>{badge.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Saved Loads Tab */}
            {activeTab === "saved" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {mockSavedLoads.map((load) => (
                  <a key={load.id} href={`/loads/${load.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <div style={{
                      backgroundColor: "#ffffff", borderRadius: 10, border: "1px solid #e2e8f0",
                      padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between",
                      cursor: "pointer", transition: "box-shadow 0.2s",
                    }}
                      onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)"}
                      onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: "#FEF3C7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Bookmark size={20} color="#d97706" />
                        </div>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                            <span style={{ fontSize: 12, fontWeight: 600, color: "#64748b", fontFamily: "monospace" }}>{load.id}</span>
                            <span style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{load.route}</span>
                          </div>
                          <div style={{ fontSize: 12, color: "#94a3b8" }}>
                            {load.commodity} &middot; {load.weight} &middot; {load.mode}
                          </div>
                          <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>
                            <Clock size={10} style={{ display: "inline", verticalAlign: "middle", marginRight: 3 }} />
                            Deadline: {load.deadline}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{ fontSize: 16, fontWeight: 700, color: "#059669" }}>{"\u20B1"}{formatRate(load.rate)}</span>
                        <Star size={18} color="#d97706" fill="#d97706" />
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}

            {/* Recent Views Tab */}
            {activeTab === "recent" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {mockRecentViews.map((item) => {
                  const ti = typeIcons[item.type];
                  const Icon = ti.icon;
                  return (
                    <div key={item.id + item.viewedAt} style={{
                      backgroundColor: "#ffffff", borderRadius: 10, border: "1px solid #e2e8f0",
                      padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between",
                      cursor: "pointer", transition: "box-shadow 0.2s",
                    }}
                      onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)"}
                      onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: ti.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Icon size={18} color={ti.color} />
                        </div>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                            <span style={{ fontSize: 12, fontWeight: 600, color: "#64748b", fontFamily: "monospace" }}>{item.id}</span>
                            <span style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{item.title}</span>
                          </div>
                          <div style={{ fontSize: 12, color: "#94a3b8" }}>{item.subtitle}</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Eye size={14} color="#94a3b8" />
                        <span style={{ fontSize: 12, color: "#94a3b8" }}>{item.viewedAt}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
