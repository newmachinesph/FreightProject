"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Truck,
  Package,
  Warehouse as WarehouseIcon,
  TrendingUp,
  Star,
  CheckCircle,
  MapPin,
  Filter,
  User,
  Bell,
  Snowflake,
  Shield,
  ArrowRight,
  LayoutGrid,
  X,
  Anchor,
  Gavel,
  Zap,
  Eye,
  Map,
  List,
  Columns,
  ChevronDown,
  Activity,
  Timer,
} from "lucide-react";
import { loads, carriers, warehouses } from "@/lib/mock-data";
import type { MarketplaceLoad, Carrier, Warehouse } from "@/lib/mock-data";
import { FREIGHT_HUBS, RORO_ROUTES, MAJOR_LAND_ROUTES, VEHICLE_SPECS, SRNH_ROUTE } from "@/lib/ph-routes";
import MapView from "@/components/MapView";
import Navbar from "@/components/Navbar";

// ── Vehicle type to SVG image mapping ──
const vehicleImageMap: Record<string, string> = {};
VEHICLE_SPECS.forEach((v) => { vehicleImageMap[v.type] = v.image; });
// Also map common short names from mock data to VEHICLE_SPECS
const vehicleTypeAliases: Record<string, string> = {
  "10-Wheeler Wing Van": "/vehicles/wing-van-10w.svg",
  "6-Wheeler Closed Van": "/vehicles/closed-van-6w.svg",
  "4-Wheeler Closed Van": "/vehicles/closed-van-4w.svg",
  "10-Wheeler Tanker": "/vehicles/tanker.svg",
  "6-Wheeler Reefer Van": "/vehicles/reefer-6w.svg",
  "4-Wheeler Reefer Van": "/vehicles/reefer-4w.svg",
  "Flatbed Trailer": "/vehicles/flatbed.svg",
  "L300 Van": "/vehicles/l300.svg",
  "20ft Container": "/vehicles/container-20ft.svg",
  "40ft Container": "/vehicles/container-40ft.svg",
  "Dropside": "/vehicles/dropside.svg",
};
function getVehicleImage(vehicleType: string): string | null {
  return vehicleImageMap[vehicleType] || vehicleTypeAliases[vehicleType] || null;
}

const WAREHOUSE_URL = process.env.NEXT_PUBLIC_WAREHOUSE_URL ?? "http://localhost:3005";

// ── Status & badge config ──

const statusColors: Record<MarketplaceLoad["status"], { bg: string; text: string; label: string; glow: string }> = {
  open:       { bg: "#059669", text: "#ffffff", label: "Open",       glow: "0 0 8px rgba(5,150,105,0.4)" },
  bidding:    { bg: "#d97706", text: "#ffffff", label: "Bidding",    glow: "0 0 8px rgba(217,119,6,0.4)" },
  awarded:    { bg: "#2563eb", text: "#ffffff", label: "Awarded",    glow: "0 0 8px rgba(37,99,235,0.4)" },
  in_transit: { bg: "#7c3aed", text: "#ffffff", label: "In Transit", glow: "0 0 8px rgba(124,58,237,0.4)" },
  delivered:  { bg: "#6b7280", text: "#ffffff", label: "Delivered",  glow: "0 0 8px rgba(107,114,128,0.4)" },
};

const biddingModeLabels: Record<string, { label: string; icon: typeof Gavel; color: string }> = {
  open_auction:  { label: "Auction",    icon: Gavel,   color: "#D97706" },
  sealed_bid:    { label: "Sealed Bid", icon: Package, color: "#7C3AED" },
  direct_award:  { label: "Direct",     icon: Zap,     color: "#059669" },
  instant_book:  { label: "Instant",    icon: Zap,     color: "#2563EB" },
};

const warehouseTypeLabels: Record<string, { label: string; color: string }> = {
  dry:            { label: "Dry",        color: "#D97706" },
  cold:           { label: "Cold",       color: "#2563EB" },
  bonded:         { label: "Bonded",     color: "#7C3AED" },
  cross_dock:     { label: "Cross-Dock", color: "#059669" },
  pharmaceutical: { label: "Pharma",     color: "#9D174D" },
};

// ── Helpers ──

function timeRemaining(deadlineStr: string): string {
  const now = new Date("2026-03-19T10:00:00Z");
  const deadline = new Date(deadlineStr);
  const diffMs = deadline.getTime() - now.getTime();
  if (diffMs <= 0) return "Ended";
  const diffHrs = Math.floor(diffMs / 3600000);
  const diffMins = Math.floor((diffMs % 3600000) / 60000);
  if (diffHrs > 24) return `${Math.floor(diffHrs / 24)}d ${diffHrs % 24}h`;
  if (diffHrs > 0) return `${diffHrs}h ${diffMins}m`;
  return `${diffMins}m`;
}

function formatRate(rate: number): string {
  return new Intl.NumberFormat("en-PH").format(rate);
}

/** Render star rating with filled/half/empty stars */
function StarRating({ rating, size = 14, showValue = true }: { rating: number; size?: number; showValue?: boolean }) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.3 && rating - full < 0.8;
  const stars = [];
  for (let i = 0; i < 5; i++) {
    if (i < full) {
      stars.push(<Star key={i} size={size} fill="#F59E0B" color="#F59E0B" />);
    } else if (i === full && hasHalf) {
      stars.push(
        <span key={i} style={{ position: "relative", display: "inline-block", width: size, height: size }}>
          <Star size={size} fill="none" color="#E5E7EB" style={{ position: "absolute", top: 0, left: 0 }} />
          <span style={{ position: "absolute", top: 0, left: 0, width: "50%", overflow: "hidden" }}>
            <Star size={size} fill="#F59E0B" color="#F59E0B" />
          </span>
        </span>
      );
    } else {
      stars.push(<Star key={i} size={size} fill="none" color="#E5E7EB" />);
    }
  }
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
      {stars}
      {showValue && <span style={{ marginLeft: 4, fontSize: size - 2, fontWeight: 600, color: "#374151" }}>{rating.toFixed(1)}</span>}
    </span>
  );
}

// ── Types ──

type TabType = "loads" | "carriers" | "warehouses";
type ViewMode = "split" | "list" | "map";
const quickFilters = ["All", "FTL", "LTL", "Reefer", "Inter-Island", "Hazmat"] as const;
const biddingFilters = ["All", "Auction", "Sealed Bid", "Direct", "Instant"] as const;

const appSwitcherItems = [
  { label: "Main Website", description: "Landing & marketing site", icon: TrendingUp, href: "http://localhost:3000", color: "#0ea5e9" },
  { label: "Auth / Settings", description: "Account & security", icon: Shield, href: "http://localhost:3001", color: "#64748b" },
  { label: "Shipper Portal", description: "Post loads & manage bids", icon: Package, href: "http://localhost:3003", color: "#f59e0b" },
  { label: "Carrier Portal", description: "Find & accept loads", icon: Truck, href: "http://localhost:3004", color: "#059669" },
  { label: "Warehouse Portal", description: "Inventory & operations", icon: WarehouseIcon, href: "http://localhost:3005", color: "#7c3aed" },
  { label: "Marketplace", description: "Freight marketplace", icon: Activity, href: "/", color: "#2563eb", active: true },
];

// ── RoRo port coordinates for inter-island routes ──

const roroPortCoords: Record<string, { lat: number; lng: number }> = {
  "Batangas Port": { lat: 13.7565, lng: 121.0583 },
  "Cebu Port": { lat: 10.2969, lng: 123.9022 },
  "Cagayan de Oro Port": { lat: 8.4822, lng: 124.6472 },
  "Manila Port": { lat: 14.5833, lng: 120.9667 },
  "Davao Port": { lat: 7.0731, lng: 125.6128 },
  "Manila South Harbor": { lat: 14.5833, lng: 120.9667 },
};

// ══════════════════════════════════════════════
//  MAIN COMPONENT
// ══════════════════════════════════════════════

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<TabType>("loads");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [biddingFilter, setBiddingFilter] = useState<string>("All");
  const [viewMode, setViewMode] = useState<ViewMode>("split");
  const [showAppSwitcher, setShowAppSwitcher] = useState(false);
  const [hoveredLoad, setHoveredLoad] = useState<string | null>(null);
  const [hoveredCarrier, setHoveredCarrier] = useState<string | null>(null);
  const [hoveredWarehouse, setHoveredWarehouse] = useState<string | null>(null);
  const [showRoutesOverlay, setShowRoutesOverlay] = useState(false);

  // ── Stats ──
  const openLoads = loads.filter((l) => l.status === "open" || l.status === "bidding");
  const avgRate = Math.round(carriers.reduce((sum, c) => sum + c.baseRate, 0) / carriers.length);
  const interIslandCount = loads.filter((l) => l.interIsland).length;
  const totalBids = loads.reduce((sum, l) => sum + l.bids, 0);

  // ── Filter loads ──
  const filteredLoads = useMemo(() => {
    let result = loads;

    // Cargo type filter
    if (activeFilter === "Reefer") result = result.filter((l) => l.cargoType === "Reefer");
    else if (activeFilter === "Hazmat") result = result.filter((l) => l.cargoType === "Hazmat");
    else if (activeFilter === "LTL") result = result.filter((l) => l.cargoType === "LTL");
    else if (activeFilter === "FTL") result = result.filter((l) => l.cargoType === "FTL");
    else if (activeFilter === "Inter-Island") result = result.filter((l) => l.interIsland);

    // Bidding mode filter
    if (biddingFilter !== "All") {
      const modeMap: Record<string, string> = {
        Auction: "open_auction",
        "Sealed Bid": "sealed_bid",
        Direct: "direct_award",
        Instant: "instant_book",
      };
      const mode = modeMap[biddingFilter];
      if (mode) result = result.filter((l) => l.biddingMode === mode);
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (l) =>
          l.origin.city.toLowerCase().includes(q) ||
          l.destination.city.toLowerCase().includes(q) ||
          l.commodity.toLowerCase().includes(q) ||
          l.id.toLowerCase().includes(q) ||
          l.shipper.name.toLowerCase().includes(q)
      );
    }

    return result;
  }, [activeFilter, biddingFilter, searchQuery]);

  // ── Filter carriers ──
  const filteredCarriers = useMemo(() => {
    if (!searchQuery.trim()) return carriers;
    const q = searchQuery.toLowerCase();
    return carriers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.location.city.toLowerCase().includes(q) ||
        c.specializations.some((s) => s.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  // ── Filter warehouses ──
  const filteredWarehouses = useMemo(() => {
    if (!searchQuery.trim()) return warehouses;
    const q = searchQuery.toLowerCase();
    return warehouses.filter(
      (w) =>
        w.name.toLowerCase().includes(q) ||
        w.location.city.toLowerCase().includes(q) ||
        w.types.some((t) => t.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  // ── Computed layout widths ──
  const leftWidth = viewMode === "list" ? "100%" : viewMode === "map" ? "0%" : "60%";
  const rightWidth = viewMode === "list" ? "0%" : viewMode === "map" ? "100%" : "40%";

  const stats = [
    { label: "Open Loads", value: openLoads.length.toString(), icon: Package, color: "#059669", pulse: true },
    { label: "Active Carriers", value: carriers.length.toString(), icon: Truck, color: "#2563eb" },
    { label: "Warehouses", value: warehouses.length.toString(), icon: WarehouseIcon, color: "#7c3aed" },
    { label: "Avg Rate", value: `\u20B1${avgRate}/km`, icon: TrendingUp, color: "#d97706" },
    { label: "Inter-Island", value: interIslandCount.toString(), icon: Anchor, color: "#0891b2" },
    { label: "Total Bids", value: totalBids.toString(), icon: Gavel, color: "#dc2626" },
    { label: "RoRo Routes", value: RORO_ROUTES.length.toString(), icon: Anchor, color: "#06b6d4" },
    { label: "Freight Hubs", value: FREIGHT_HUBS.length.toString(), icon: MapPin, color: "#f97316" },
  ];

  const tabDef: { key: TabType; label: string; icon: typeof Package; count: number }[] = [
    { key: "loads", label: "Load Board", icon: Package, count: loads.length },
    { key: "carriers", label: "Carriers", icon: Truck, count: carriers.length },
    { key: "warehouses", label: "Warehouses", icon: WarehouseIcon, count: warehouses.length },
  ];

  // ══════════════════════════════════════════════
  //  RENDER
  // ══════════════════════════════════════════════

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden", backgroundColor: "#f8fafc" }}>

      {/* ── KEYFRAMES (pulse animation) ── */}
      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.5); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .load-card:hover {
          box-shadow: 0 4px 20px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04) !important;
          border-color: #cbd5e1 !important;
          transform: translateY(-2px);
        }
        .carrier-card:hover {
          box-shadow: 0 4px 20px rgba(0,0,0,0.08) !important;
          border-color: #cbd5e1 !important;
          transform: translateY(-1px);
        }
        .wh-card:hover {
          box-shadow: 0 4px 20px rgba(0,0,0,0.08) !important;
          border-color: #cbd5e1 !important;
          transform: translateY(-1px);
        }
        .filter-chip:hover {
          background: #e2e8f0 !important;
        }
        .tab-btn:hover {
          background: rgba(255,255,255,0.1) !important;
        }
        .view-btn:hover {
          background: rgba(255,255,255,0.15) !important;
        }
        .region-marker:hover {
          transform: scale(1.2);
          z-index: 10;
        }
        /* Search placeholder */
        input::placeholder {
          color: #94a3b8 !important;
          opacity: 1;
        }
        /* Scrollbar styling */
        .left-panel::-webkit-scrollbar {
          width: 6px;
        }
        .left-panel::-webkit-scrollbar-track {
          background: transparent;
        }
        .left-panel::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        .left-panel::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>

      {/* ══════════════ TOP NAV (shared) ══════════════ */}
      <Navbar active="Load Board" />

      {/* ══════════════ CONTROLS BAR ══════════════ */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        height: 44,
        minHeight: 44,
        backgroundColor: "#0f172a",
        zIndex: 49,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        {/* Left: Tabs + Search */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Tab buttons (controls split view) */}
          <div style={{ display: "flex", gap: 2 }}>
            {tabDef.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  className="tab-btn"
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "6px 14px",
                    border: "none",
                    borderRadius: 6,
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? "#ffffff" : "#94a3b8",
                    backgroundColor: isActive ? "rgba(255,255,255,0.1)" : "transparent",
                    transition: "all 0.15s",
                  }}
                >
                  <TabIcon size={14} />
                  {tab.label}
                  <span style={{
                    fontSize: 10, fontWeight: 600,
                    backgroundColor: isActive ? "rgba(59,130,246,0.3)" : "rgba(255,255,255,0.06)",
                    color: isActive ? "#93c5fd" : "#64748b",
                    padding: "1px 6px", borderRadius: 9999,
                  }}>{tab.count}</span>
                </button>
              );
            })}
          </div>

        </div>

        {/* Center: Search */}
        <div style={{
          flex: "0 1 420px",
          display: "flex", alignItems: "center",
          backgroundColor: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 8,
          padding: "0 12px",
          backdropFilter: "blur(8px)",
        }}>
          <Search size={15} color="#64748b" />
          <input
            type="text"
            placeholder="Search loads, carriers, warehouses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              padding: "8px 10px",
              border: "none",
              background: "none",
              outline: "none",
              fontSize: 13,
              color: "#e2e8f0",
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 2, display: "flex" }}
            >
              <X size={14} color="#64748b" />
            </button>
          )}
        </div>

        {/* Right: View mode + App switcher + Notifications + User */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* View mode toggle */}
          <div style={{ display: "flex", gap: 2, backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 6, padding: 2 }}>
            {([
              { mode: "split" as ViewMode, icon: Columns, label: "Split" },
              { mode: "list" as ViewMode, icon: List, label: "List" },
              { mode: "map" as ViewMode, icon: Map, label: "Map" },
            ]).map((v) => {
              const VIcon = v.icon;
              return (
                <button
                  key={v.mode}
                  className="view-btn"
                  onClick={() => setViewMode(v.mode)}
                  title={v.label + " View"}
                  style={{
                    display: "flex", alignItems: "center", gap: 4,
                    padding: "4px 10px", border: "none", borderRadius: 4,
                    cursor: "pointer", fontSize: 11, fontWeight: 500,
                    color: viewMode === v.mode ? "#ffffff" : "#64748b",
                    backgroundColor: viewMode === v.mode ? "rgba(59,130,246,0.3)" : "transparent",
                    transition: "all 0.15s",
                  }}
                >
                  <VIcon size={13} />
                  {v.label}
                </button>
              );
            })}
          </div>

        </div>
      </div>


      {/* ══════════════ STATS BAR - 48px ══════════════ */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 0,
        height: 48,
        minHeight: 48,
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e2e8f0",
        padding: "0 20px",
      }}>
        {stats.map((stat, i) => {
          const StatIcon = stat.icon;
          return (
            <div key={stat.label} style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "0 20px",
              borderRight: i < stats.length - 1 ? "1px solid #e2e8f0" : "none",
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: 6,
                backgroundColor: `${stat.color}10`,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: `0 0 8px ${stat.color}20`,
              }}>
                <StatIcon size={14} color={stat.color} />
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>{stat.value}</span>
                <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>{stat.label}</span>
              </div>
              {stat.pulse && (
                <span style={{
                  display: "inline-block",
                  width: 8, height: 8, borderRadius: "50%",
                  backgroundColor: "#22c55e",
                  animation: "pulse-dot 2s ease-in-out infinite",
                  boxShadow: "0 0 6px rgba(34,197,94,0.6)",
                }} />
              )}
            </div>
          );
        })}
      </div>

      {/* ══════════════ MAIN CONTENT ══════════════ */}
      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>

        {/* ── LEFT PANEL ── */}
        {viewMode !== "map" && (
          <div
            className="left-panel"
            style={{
              width: leftWidth,
              overflowY: "auto",
              backgroundColor: "#f8fafc",
              borderRight: viewMode === "split" ? "1px solid #e2e8f0" : "none",
              transition: "width 0.3s ease",
            }}
          >
            {/* ── LOAD BOARD TAB ── */}
            {activeTab === "loads" && (
              <div>
                {/* Filter bar */}
                <div style={{
                  padding: "10px 16px",
                  backgroundColor: "#ffffff",
                  borderBottom: "1px solid #f1f5f9",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}>
                  {/* Cargo type chips */}
                  <div style={{ display: "flex", gap: 4, alignItems: "center", flexWrap: "wrap" }}>
                    <Filter size={13} color="#94a3b8" style={{ marginRight: 4 }} />
                    {quickFilters.map((f) => (
                      <button
                        key={f}
                        className="filter-chip"
                        onClick={() => setActiveFilter(f)}
                        style={{
                          padding: "4px 12px",
                          border: "1px solid",
                          borderColor: activeFilter === f ? "#2563eb" : "#e2e8f0",
                          borderRadius: 9999,
                          cursor: "pointer",
                          fontSize: 12,
                          fontWeight: activeFilter === f ? 600 : 400,
                          color: activeFilter === f ? "#2563eb" : "#64748b",
                          backgroundColor: activeFilter === f ? "#eff6ff" : "#ffffff",
                          transition: "all 0.15s",
                        }}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                  {/* Bidding mode chips */}
                  <div style={{ display: "flex", gap: 4, alignItems: "center", flexWrap: "wrap" }}>
                    <Gavel size={13} color="#94a3b8" style={{ marginRight: 4 }} />
                    {biddingFilters.map((f) => (
                      <button
                        key={f}
                        className="filter-chip"
                        onClick={() => setBiddingFilter(f)}
                        style={{
                          padding: "4px 12px",
                          border: "1px solid",
                          borderColor: biddingFilter === f ? "#7c3aed" : "#e2e8f0",
                          borderRadius: 9999,
                          cursor: "pointer",
                          fontSize: 12,
                          fontWeight: biddingFilter === f ? 600 : 400,
                          color: biddingFilter === f ? "#7c3aed" : "#64748b",
                          backgroundColor: biddingFilter === f ? "#f5f3ff" : "#ffffff",
                          transition: "all 0.15s",
                        }}
                      >
                        {f}
                      </button>
                    ))}
                    <span style={{ marginLeft: "auto", fontSize: 12, color: "#94a3b8" }}>
                      {filteredLoads.length} load{filteredLoads.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                {/* Load cards */}
                <div style={{ padding: 10, display: "flex", flexDirection: "column", gap: 6 }}>
                  {filteredLoads.map((load) => {
                    const sc = statusColors[load.status];
                    const bm = biddingModeLabels[load.biddingMode];
                    const BmIcon = bm.icon;
                    const isHovered = hoveredLoad === load.id;
                    return (
                      <a
                        key={load.id}
                        href={`/loads/${load.id}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                        onMouseEnter={() => setHoveredLoad(load.id)}
                        onMouseLeave={() => setHoveredLoad(null)}
                      >
                        <div
                          className="load-card"
                          style={{
                            backgroundColor: "#ffffff",
                            borderRadius: 8,
                            borderTop: `1px solid ${isHovered ? "#cbd5e1" : "#e2e8f0"}`,
                            borderRight: `1px solid ${isHovered ? "#cbd5e1" : "#e2e8f0"}`,
                            borderBottom: `1px solid ${isHovered ? "#cbd5e1" : "#e2e8f0"}`,
                            borderLeft: `3px solid ${sc.bg}`,
                            padding: "10px 12px",
                            cursor: "pointer",
                            transition: "all 0.2s",
                            display: "flex",
                            gap: 10,
                            alignItems: "flex-start",
                          }}
                        >
                          {/* Left: Route */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>
                              <span style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                {load.origin.city}
                              </span>
                              <ArrowRight size={12} color="#94a3b8" />
                              <span style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                {load.destination.city}
                              </span>
                            </div>
                            {/* Cargo info */}
                            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 4, alignItems: "center" }}>
                              <span style={{
                                padding: "1px 6px", borderRadius: 4, fontSize: 10, fontWeight: 600,
                                color: "#64748b", background: "#f1f5f9",
                              }}>
                                {load.cargoType}
                              </span>
                              <span style={{ fontSize: 11, color: "#94a3b8" }}>
                                {(load.weightKg / 1000).toFixed(1)}T
                              </span>
                              <span style={{ fontSize: 11, color: "#94a3b8" }}>
                                {load.volumeCbm} CBM
                              </span>
                              <span style={{ fontSize: 11, color: "#94a3b8", display: "inline-flex", alignItems: "center", gap: 3 }}>
                                {getVehicleImage(load.vehicleType) && (
                                  <img src={getVehicleImage(load.vehicleType)!} alt="" style={{ width: 24, height: 24, objectFit: "contain", opacity: 0.7 }} />
                                )}
                                {load.vehicleType}
                              </span>
                            </div>
                            {/* Shipper + badges */}
                            <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                                {load.shipper.verified && <CheckCircle size={11} color="#2563eb" />}
                                <span style={{ fontSize: 11, color: "#64748b" }}>{load.shipper.name}</span>
                              </div>
                              <StarRating rating={load.shipper.rating} size={10} />
                              {load.interIsland && (
                                <span style={{
                                  display: "inline-flex", alignItems: "center", gap: 2,
                                  padding: "1px 6px", borderRadius: 4, fontSize: 10, fontWeight: 600,
                                  backgroundColor: "#0891b215", color: "#0891b2",
                                }}>
                                  <Anchor size={9} /> Inter-Island
                                </span>
                              )}
                              <span style={{
                                display: "inline-flex", alignItems: "center", gap: 2,
                                padding: "1px 6px", borderRadius: 4, fontSize: 10, fontWeight: 600,
                                backgroundColor: `${bm.color}12`, color: bm.color,
                              }}>
                                <BmIcon size={9} /> {bm.label}
                              </span>
                            </div>
                          </div>

                          {/* Right: Price + Status */}
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
                            <span style={{
                              display: "inline-flex", alignItems: "center",
                              padding: "3px 8px", borderRadius: 6, fontSize: 10, fontWeight: 700,
                              backgroundColor: sc.bg, color: sc.text,
                              boxShadow: sc.glow,
                              letterSpacing: 0.3,
                            }}>
                              {sc.label}
                            </span>
                            <span style={{ fontSize: 17, fontWeight: 700, color: "#059669" }}>
                              {"\u20B1"}{formatRate(load.offeredRate)}
                            </span>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              {load.bids > 0 && (
                                <span style={{ fontSize: 11, color: "#d97706", fontWeight: 600 }}>
                                  {load.bids} bid{load.bids !== 1 ? "s" : ""}
                                </span>
                              )}
                              <span style={{ display: "flex", alignItems: "center", gap: 2, fontSize: 10, color: "#94a3b8" }}>
                                <Timer size={10} /> {timeRemaining(load.bidDeadline)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </a>
                    );
                  })}

                  {filteredLoads.length === 0 && (
                    <div style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>
                      <Package size={32} color="#cbd5e1" style={{ marginBottom: 8 }} />
                      <div style={{ fontSize: 14, fontWeight: 500 }}>No loads match your filters</div>
                      <div style={{ fontSize: 12, marginTop: 4 }}>Try adjusting your search or filter criteria</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── CARRIERS TAB ── */}
            {activeTab === "carriers" && (
              <div>
                <div style={{
                  padding: "10px 16px",
                  backgroundColor: "#ffffff",
                  borderBottom: "1px solid #f1f5f9",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                }}>
                  <span style={{ fontSize: 13, color: "#64748b" }}>
                    {filteredCarriers.length} carrier{filteredCarriers.length !== 1 ? "s" : ""} found
                  </span>
                  <a href="/carriers" style={{ fontSize: 12, color: "#2563eb", textDecoration: "none", fontWeight: 500 }}>View all</a>
                </div>
                <div style={{
                  padding: 12,
                  display: "grid",
                  gridTemplateColumns: viewMode === "list" ? "repeat(3, 1fr)" : "repeat(2, 1fr)",
                  gap: 10,
                }}>
                  {filteredCarriers.map((carrier) => {
                    const isHovered = hoveredCarrier === carrier.id;
                    return (
                      <a
                        key={carrier.id}
                        href={`/carriers/${carrier.id}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                        onMouseEnter={() => setHoveredCarrier(carrier.id)}
                        onMouseLeave={() => setHoveredCarrier(null)}
                      >
                        <div
                          className="carrier-card"
                          style={{
                            backgroundColor: "#ffffff",
                            borderRadius: 10,
                            border: `1px solid ${isHovered ? "#cbd5e1" : "#e2e8f0"}`,
                            padding: 14,
                            cursor: "pointer",
                            transition: "all 0.2s",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                            <div style={{
                              width: 36, height: 36, borderRadius: 8,
                              background: "linear-gradient(135deg, #1e293b, #334155)",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              flexShrink: 0,
                            }}>
                              <Truck size={18} color="#94a3b8" />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 1 }}>
                                <span style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                  {carrier.name}
                                </span>
                                {carrier.verified && <CheckCircle size={12} color="#2563eb" />}
                              </div>
                              <div style={{ fontSize: 11, color: "#94a3b8" }}>
                                {carrier.location.city} &middot; {carrier.location.region}
                              </div>
                            </div>
                          </div>
                          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8 }}>
                            {carrier.specializations.slice(0, 3).map((s) => (
                              <span key={s} style={{
                                fontSize: 10, fontWeight: 500, color: "#64748b",
                                background: "#f1f5f9", padding: "2px 6px", borderRadius: 4,
                              }}>{s}</span>
                            ))}
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <StarRating rating={carrier.rating} size={12} />
                              <span style={{ fontSize: 11, color: "#94a3b8" }}>{carrier.vehicleCount} trucks</span>
                            </div>
                            <span style={{ fontSize: 13, fontWeight: 700, color: "#059669" }}>{"\u20B1"}{carrier.baseRate}/km</span>
                          </div>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── WAREHOUSES TAB ── */}
            {activeTab === "warehouses" && (
              <div>
                <div style={{
                  padding: "10px 16px",
                  backgroundColor: "#ffffff",
                  borderBottom: "1px solid #f1f5f9",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                }}>
                  <span style={{ fontSize: 13, color: "#64748b" }}>
                    {filteredWarehouses.length} warehouse{filteredWarehouses.length !== 1 ? "s" : ""} found
                  </span>
                  <a href="/warehouses" style={{ fontSize: 12, color: "#2563eb", textDecoration: "none", fontWeight: 500 }}>View all</a>
                </div>
                <div style={{
                  padding: 12,
                  display: "grid",
                  gridTemplateColumns: viewMode === "list" ? "repeat(3, 1fr)" : "repeat(2, 1fr)",
                  gap: 10,
                }}>
                  {filteredWarehouses.map((wh) => {
                    const isHovered = hoveredWarehouse === wh.id;
                    return (
                      <a
                        key={wh.id}
                        href={`/warehouses/${wh.id}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                        onMouseEnter={() => setHoveredWarehouse(wh.id)}
                        onMouseLeave={() => setHoveredWarehouse(null)}
                      >
                        <div
                          className="wh-card"
                          style={{
                            backgroundColor: "#ffffff",
                            borderRadius: 10,
                            border: `1px solid ${isHovered ? "#cbd5e1" : "#e2e8f0"}`,
                            padding: 14,
                            cursor: "pointer",
                            transition: "all 0.2s",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                            <div style={{
                              width: 36, height: 36, borderRadius: 8,
                              background: "linear-gradient(135deg, #1e293b, #334155)",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              flexShrink: 0,
                            }}>
                              <WarehouseIcon size={18} color="#94a3b8" />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                {wh.name}
                              </div>
                              <div style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, color: "#94a3b8" }}>
                                <MapPin size={10} /> {wh.location.city}, {wh.location.province}
                              </div>
                            </div>
                          </div>
                          {/* Type badges */}
                          <div style={{ display: "flex", gap: 4, marginBottom: 8, flexWrap: "wrap" }}>
                            {wh.types.map((type) => {
                              const t = warehouseTypeLabels[type];
                              if (!t) return null;
                              return (
                                <span key={type} style={{
                                  padding: "2px 6px", borderRadius: 4, fontSize: 10, fontWeight: 600,
                                  color: t.color, backgroundColor: `${t.color}12`,
                                  display: "inline-flex", alignItems: "center", gap: 2,
                                }}>
                                  {type === "cold" && <Snowflake size={9} />}
                                  {type === "bonded" && <Shield size={9} />}
                                  {t.label}
                                </span>
                              );
                            })}
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                            <div>
                              <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 1 }}>Available</div>
                              <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{formatRate(wh.availableArea)} sqm</div>
                            </div>
                            <div style={{ textAlign: "right" }}>
                              <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 1 }}>Rate</div>
                              <div style={{ fontSize: 14, fontWeight: 700, color: "#059669" }}>{"\u20B1"}{formatRate(wh.rate)}/sqm</div>
                            </div>
                          </div>
                          <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <StarRating rating={wh.rating} size={11} />
                            <span style={{ fontSize: 10, color: "#94a3b8" }}>{formatRate(wh.totalArea)} sqm total</span>
                          </div>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── RIGHT PANEL - MAP ── */}
        {viewMode !== "list" && (
          <div style={{
            width: rightWidth,
            height: "100%",
            position: "relative",
            background: "#0f172a",
            overflow: "hidden",
            transition: "width 0.3s ease",
          }}>
            {/* Google Maps via MapView */}
            {(() => {
              const mapMarkers: { lat: number; lng: number; label: string; color?: string; info?: string }[] = [];
              const mapRoutes: { origin: { lat: number; lng: number }; destination: { lat: number; lng: number }; waypoints?: { lat: number; lng: number }[]; color?: string; dashed?: boolean; useDirections?: boolean }[] = [];
              const mapRegions: { center: { lat: number; lng: number }; radius: number; color?: string; label?: string }[] = [];

              if (hoveredLoad) {
                const load = loads.find((l) => l.id === hoveredLoad);
                if (load) {
                  const sc = statusColors[load.status];
                  mapMarkers.push({
                    lat: load.origin.lat, lng: load.origin.lng,
                    label: load.origin.city, color: "#22c55e",
                    info: `Origin: ${load.origin.city}`,
                  });
                  mapMarkers.push({
                    lat: load.destination.lat, lng: load.destination.lng,
                    label: load.destination.city, color: "#ef4444",
                    info: `Destination: ${load.destination.city}`,
                  });

                  // Try to find a matching MAJOR_LAND_ROUTE for realistic waypoints
                  const matchedLandRoute = MAJOR_LAND_ROUTES.find((lr) => {
                    const fromCity = load.origin.city.toLowerCase();
                    const toCity = load.destination.city.toLowerCase();
                    return (
                      (lr.from.toLowerCase().includes(fromCity) || fromCity.includes(lr.from.toLowerCase())) &&
                      (lr.to.toLowerCase().includes(toCity) || toCity.includes(lr.to.toLowerCase()))
                    ) || (
                      (lr.from.toLowerCase().includes(toCity) || toCity.includes(lr.from.toLowerCase())) &&
                      (lr.to.toLowerCase().includes(fromCity) || fromCity.includes(lr.to.toLowerCase()))
                    );
                  });

                  if (matchedLandRoute) {
                    // Use real waypoints for realistic routing
                    mapRoutes.push({
                      origin: { lat: load.origin.lat, lng: load.origin.lng },
                      destination: { lat: load.destination.lat, lng: load.destination.lng },
                      waypoints: matchedLandRoute.waypoints.map((wp) => ({ lat: wp.lat, lng: wp.lng })),
                      color: "#3b82f6",
                      useDirections: true,
                    });
                  } else {
                    // Default straight-line route
                    mapRoutes.push({
                      origin: { lat: load.origin.lat, lng: load.origin.lng },
                      destination: { lat: load.destination.lat, lng: load.destination.lng },
                      color: sc.text === "#ffffff" ? sc.bg : sc.text,
                      useDirections: true,
                    });
                  }

                  // Inter-island: show RoRo ferry route as dashed cyan polyline + port markers
                  if (load.interIsland && load.roroRoute) {
                    const portNames = load.roroRoute.split(" - ");
                    portNames.forEach((name) => {
                      const trimmed = name.trim();
                      const coords = roroPortCoords[trimmed] || roroPortCoords[`${trimmed} Port`];
                      if (coords) {
                        mapMarkers.push({
                          lat: coords.lat, lng: coords.lng,
                          label: trimmed, color: "#06b6d4",
                          info: `RoRo Port: ${trimmed}`,
                        });
                      }
                    });

                    // Find matching RoRo route with waypoints for realistic sea path
                    const matchedRoro = RORO_ROUTES.find((rr) => {
                      const routeParts = load.roroRoute!.toLowerCase();
                      return routeParts.includes(rr.origin.name.toLowerCase().split(" ")[0]) ||
                        routeParts.includes(rr.destination.name.toLowerCase().split(" ")[0]);
                    });
                    if (matchedRoro && matchedRoro.waypoints.length > 0) {
                      mapRoutes.push({
                        origin: matchedRoro.origin,
                        destination: matchedRoro.destination,
                        waypoints: matchedRoro.waypoints,
                        color: "#06b6d4",
                        dashed: true,
                      });
                    }

                    if (load.portPickup && roroPortCoords[load.portPickup]) {
                      const alreadyAdded = mapMarkers.some(
                        (m) => m.lat === roroPortCoords[load.portPickup!].lat && m.lng === roroPortCoords[load.portPickup!].lng
                      );
                      if (!alreadyAdded) {
                        mapMarkers.push({
                          lat: roroPortCoords[load.portPickup].lat,
                          lng: roroPortCoords[load.portPickup].lng,
                          label: load.portPickup, color: "#06b6d4",
                          info: `Port Pickup: ${load.portPickup}`,
                        });
                      }
                    }
                  }
                }
              } else if (hoveredCarrier) {
                const carrier = carriers.find((c) => c.id === hoveredCarrier);
                if (carrier) {
                  // Large HQ marker
                  mapMarkers.push({
                    lat: carrier.location.lat, lng: carrier.location.lng,
                    label: carrier.name, color: "#3b82f6",
                    info: `HQ: ${carrier.name} (${carrier.vehicleCount} vehicles)`,
                  });
                  // Service area circle (estimate radius from vehicle count)
                  const serviceRadius = Math.min(80000, 20000 + carrier.vehicleCount * 2000);
                  mapRegions.push({
                    center: { lat: carrier.location.lat, lng: carrier.location.lng },
                    radius: serviceRadius,
                    color: "#3b82f6",
                    label: `${carrier.name} service area`,
                  });
                  // Show service lanes using MAJOR_LAND_ROUTES waypoints
                  carrier.lanes.forEach((lane) => {
                    const parts = lane.split(/\s*[-\u2013\u2014\u2192>]+\s*/);
                    if (parts.length >= 2) {
                      const fromCity = parts[0].trim().toLowerCase();
                      const toCity = parts[parts.length - 1].trim().toLowerCase();
                      const matchedRoute = MAJOR_LAND_ROUTES.find((lr) =>
                        (lr.from.toLowerCase().includes(fromCity) || fromCity.includes(lr.from.toLowerCase())) &&
                        (lr.to.toLowerCase().includes(toCity) || toCity.includes(lr.to.toLowerCase()))
                      );
                      if (matchedRoute) {
                        const wp = matchedRoute.waypoints;
                        if (wp.length >= 2) {
                          mapRoutes.push({
                            origin: { lat: wp[0].lat, lng: wp[0].lng },
                            destination: { lat: wp[wp.length - 1].lat, lng: wp[wp.length - 1].lng },
                            waypoints: wp.slice(1, -1).map((w) => ({ lat: w.lat, lng: w.lng })),
                            color: "#60a5fa",
                            useDirections: true,
                          });
                        }
                      }
                    }
                  });
                }
              } else if (hoveredWarehouse) {
                const wh = warehouses.find((w) => w.id === hoveredWarehouse);
                if (wh) {
                  // Color-code by type
                  const whColor = wh.types.includes("cold") ? "#2563eb"
                    : wh.types.includes("bonded") ? "#059669"
                    : "#d97706";
                  mapMarkers.push({
                    lat: wh.location.lat, lng: wh.location.lng,
                    label: wh.name, color: whColor,
                    info: `${wh.name} | ${formatRate(wh.availableArea)} sqm available | ${wh.types.map((t) => warehouseTypeLabels[t]?.label || t).join(", ")}`,
                  });
                }
              }

              // Routes overlay: show all RoRo routes, SRNH corridor, freight hubs
              if (showRoutesOverlay) {
                // RoRo ferry routes as cyan dashed lines
                RORO_ROUTES.forEach((rr) => {
                  if (rr.waypoints.length > 0) {
                    mapRoutes.push({
                      origin: rr.origin,
                      destination: rr.destination,
                      waypoints: rr.waypoints,
                      color: "#06b6d4",
                      dashed: true,
                    });
                  } else if (rr.distanceNm > 0) {
                    mapRoutes.push({
                      origin: rr.origin,
                      destination: rr.destination,
                      color: "#06b6d4",
                      dashed: true,
                    });
                  }
                });
                // SRNH corridor highlighted in gold
                SRNH_ROUTE.forEach((seg) => {
                  mapRoutes.push({
                    origin: seg.fromCoords,
                    destination: seg.toCoords,
                    color: seg.type === "ferry" ? "#fbbf24" : "#f59e0b",
                    dashed: seg.type === "ferry",
                    ...(seg.type === "road" ? { useDirections: true } : {}),
                  });
                });
                // Major freight hubs as small dots
                FREIGHT_HUBS.forEach((hub) => {
                  mapMarkers.push({
                    lat: hub.lat, lng: hub.lng,
                    label: hub.name, color: hub.type === "port" ? "#06b6d4" : hub.type === "freeport" ? "#a855f7" : "#f59e0b",
                    info: `${hub.name} (${hub.type}) - ${hub.city}, ${hub.province}`,
                  });
                });
              }

              // When nothing is hovered and overlay is off, show PH overview with region labels
              const hasSelection = mapMarkers.length > 0;
              const defaultRegions = !hasSelection ? [
                { center: { lat: 14.6, lng: 121.0 }, radius: 40000, color: "#3b82f6", label: "NCR" },
                { center: { lat: 16.4, lng: 120.6 }, radius: 50000, color: "#2563eb", label: "North Luzon" },
                { center: { lat: 13.7, lng: 121.8 }, radius: 50000, color: "#2563eb", label: "South Luzon" },
                { center: { lat: 10.3, lng: 123.9 }, radius: 40000, color: "#7c3aed", label: "Cebu" },
                { center: { lat: 7.1, lng: 125.6 }, radius: 40000, color: "#059669", label: "Davao" },
                { center: { lat: 8.5, lng: 124.6 }, radius: 35000, color: "#0891b2", label: "CDO" },
              ] : [];

              return (
                <MapView
                  markers={mapMarkers}
                  routes={mapRoutes}
                  regions={[...defaultRegions, ...mapRegions]}
                  center={{ lat: 12.8797, lng: 121.7740 }}
                  zoom={6}
                  height="100%"
                  style={{ width: "100%", height: "100%" }}
                />
              );
            })()}

            {/* Routes overlay toggle button */}
            <button
              onClick={() => setShowRoutesOverlay((v) => !v)}
              style={{
                position: "absolute",
                top: 12, left: 12,
                display: "flex", alignItems: "center", gap: 5,
                padding: "6px 12px",
                backgroundColor: showRoutesOverlay ? "rgba(6,182,212,0.25)" : "rgba(15,23,42,0.85)",
                backdropFilter: "blur(8px)",
                border: `1px solid ${showRoutesOverlay ? "rgba(6,182,212,0.5)" : "rgba(255,255,255,0.1)"}`,
                borderRadius: 8,
                cursor: "pointer",
                zIndex: 10,
                transition: "all 0.2s",
              }}
            >
              <Map size={14} color={showRoutesOverlay ? "#06b6d4" : "#94a3b8"} />
              <span style={{ fontSize: 11, fontWeight: 600, color: showRoutesOverlay ? "#06b6d4" : "#94a3b8" }}>
                Routes
              </span>
              {showRoutesOverlay && (
                <span style={{ fontSize: 9, color: "#06b6d4", opacity: 0.7 }}>ON</span>
              )}
            </button>

            {/* Floating info card - top right */}
            {hoveredLoad && (
              <div style={{
                position: "absolute",
                top: 12, right: 12,
                width: 240,
                padding: 12,
                backgroundColor: "rgba(15,23,42,0.92)",
                backdropFilter: "blur(12px)",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                zIndex: 10,
              }}>
                {(() => {
                  const load = loads.find((l) => l.id === hoveredLoad);
                  if (!load) return null;
                  const sc = statusColors[load.status];
                  return (
                    <>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: "#e2e8f0" }}>{load.id}</span>
                        <span style={{
                          padding: "2px 6px", borderRadius: 4, fontSize: 9, fontWeight: 700,
                          backgroundColor: sc.bg, color: sc.text,
                          boxShadow: sc.glow,
                        }}>{sc.label}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}>
                        <MapPin size={11} color="#60a5fa" />
                        <span style={{ fontSize: 12, color: "#cbd5e1" }}>{load.origin.city}</span>
                        <ArrowRight size={10} color="#64748b" />
                        <span style={{ fontSize: 12, color: "#cbd5e1" }}>{load.destination.city}</span>
                      </div>
                      {load.interIsland && load.roroRoute && (
                        <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}>
                          <Anchor size={10} color="#a855f7" />
                          <span style={{ fontSize: 10, color: "#c4b5fd" }}>RoRo: {load.roroRoute}</span>
                        </div>
                      )}
                      <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 2 }}>{load.commodity}</div>
                      <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 4 }}>{(load.weightKg / 1000).toFixed(1)}T</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#34d399" }}>{"\u20B1"}{formatRate(load.offeredRate)}</div>
                    </>
                  );
                })()}
              </div>
            )}

            {hoveredCarrier && !hoveredLoad && (
              <div style={{
                position: "absolute",
                top: 12, right: 12,
                width: 240,
                padding: 12,
                backgroundColor: "rgba(15,23,42,0.92)",
                backdropFilter: "blur(12px)",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                zIndex: 10,
              }}>
                {(() => {
                  const carrier = carriers.find((c) => c.id === hoveredCarrier);
                  if (!carrier) return null;
                  return (
                    <>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}>
                        <Truck size={12} color="#60a5fa" />
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0" }}>{carrier.name}</span>
                        {carrier.verified && <CheckCircle size={10} color="#60a5fa" />}
                      </div>
                      <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 4 }}>
                        {carrier.location.city} &middot; {carrier.vehicleCount} vehicles
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <StarRating rating={carrier.rating} size={11} />
                        <span style={{ fontSize: 11, color: "#64748b" }}>({carrier.completedTrips} trips)</span>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}

            {hoveredWarehouse && !hoveredLoad && !hoveredCarrier && (
              <div style={{
                position: "absolute",
                top: 12, right: 12,
                width: 240,
                padding: 12,
                backgroundColor: "rgba(15,23,42,0.92)",
                backdropFilter: "blur(12px)",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                zIndex: 10,
              }}>
                {(() => {
                  const wh = warehouses.find((w) => w.id === hoveredWarehouse);
                  if (!wh) return null;
                  return (
                    <>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}>
                        <WarehouseIcon size={12} color="#60a5fa" />
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0" }}>{wh.name}</span>
                      </div>
                      <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 4 }}>
                        {wh.location.city}, {wh.location.province}
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontSize: 12, color: "#cbd5e1" }}>{formatRate(wh.availableArea)} sqm</span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#34d399" }}>{"\u20B1"}{formatRate(wh.rate)}/sqm</span>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}

            {/* Hover hint when nothing is selected */}
            {!hoveredLoad && !hoveredCarrier && !hoveredWarehouse && (
              <div style={{
                position: "absolute",
                bottom: 16, left: "50%",
                transform: "translateX(-50%)",
                padding: "6px 14px",
                backgroundColor: "rgba(15,23,42,0.8)",
                backdropFilter: "blur(8px)",
                borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.08)",
                zIndex: 10,
              }}>
                <span style={{ fontSize: 11, color: "#94a3b8", whiteSpace: "nowrap" }}>
                  Hover a load, carrier, or warehouse to view route on map
                </span>
              </div>
            )}

            {/* Map-only mode: floating cards overlay */}
              {viewMode === "map" && (
                <div style={{
                  position: "absolute", top: 0, left: 0,
                  width: 320, height: "100%",
                  overflowY: "auto",
                  background: "linear-gradient(90deg, rgba(15,23,42,0.92) 0%, rgba(15,23,42,0.4) 80%, transparent 100%)",
                  padding: "12px 16px 12px 12px",
                }}>
                  {/* Tab selector in overlay */}
                  <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
                    {tabDef.map((tab) => {
                      const TabIcon = tab.icon;
                      return (
                        <button
                          key={tab.key}
                          onClick={() => setActiveTab(tab.key)}
                          style={{
                            display: "flex", alignItems: "center", gap: 4,
                            padding: "5px 10px", border: "none", borderRadius: 6,
                            cursor: "pointer", fontSize: 11, fontWeight: activeTab === tab.key ? 600 : 400,
                            color: activeTab === tab.key ? "#ffffff" : "#94a3b8",
                            backgroundColor: activeTab === tab.key ? "rgba(59,130,246,0.3)" : "rgba(255,255,255,0.05)",
                          }}
                        >
                          <TabIcon size={12} />
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Compact cards */}
                  {activeTab === "loads" && filteredLoads.slice(0, 8).map((load) => {
                    const sc = statusColors[load.status];
                    return (
                      <a key={load.id} href={`/loads/${load.id}`} style={{ textDecoration: "none" }}>
                        <div
                          style={{
                            padding: "8px 10px",
                            backgroundColor: "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            borderRadius: 8,
                            marginBottom: 6,
                            cursor: "pointer",
                            transition: "background 0.15s",
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; setHoveredLoad(load.id); }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; setHoveredLoad(null); }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                              <span style={{ fontSize: 11, fontWeight: 600, color: "#e2e8f0" }}>{load.origin.city}</span>
                              <ArrowRight size={10} color="#64748b" />
                              <span style={{ fontSize: 11, fontWeight: 600, color: "#e2e8f0" }}>{load.destination.city}</span>
                            </div>
                            <span style={{
                              padding: "1px 5px", borderRadius: 3, fontSize: 8, fontWeight: 700,
                              backgroundColor: sc.bg, color: sc.text,
                            }}>{sc.label}</span>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: 10, color: "#64748b" }}>{load.commodity}</span>
                            <span style={{ fontSize: 13, fontWeight: 700, color: "#34d399" }}>{"\u20B1"}{formatRate(load.offeredRate)}</span>
                          </div>
                        </div>
                      </a>
                    );
                  })}
                  {activeTab === "carriers" && filteredCarriers.slice(0, 8).map((carrier) => (
                    <a key={carrier.id} href={`/carriers/${carrier.id}`} style={{ textDecoration: "none" }}>
                      <div
                        style={{
                          padding: "8px 10px",
                          backgroundColor: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          borderRadius: 8,
                          marginBottom: 6,
                          cursor: "pointer",
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; setHoveredCarrier(carrier.id); }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; setHoveredCarrier(null); }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 3 }}>
                          <span style={{ fontSize: 11, fontWeight: 600, color: "#e2e8f0" }}>{carrier.name}</span>
                          {carrier.verified && <CheckCircle size={9} color="#60a5fa" />}
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: 10, color: "#64748b" }}>{carrier.location.city} &middot; {carrier.vehicleCount} trucks</span>
                          <span style={{ fontSize: 12, fontWeight: 600, color: "#34d399" }}>{"\u20B1"}{carrier.baseRate}/km</span>
                        </div>
                      </div>
                    </a>
                  ))}
                  {activeTab === "warehouses" && filteredWarehouses.slice(0, 8).map((wh) => (
                    <a key={wh.id} href={`/warehouses/${wh.id}`} style={{ textDecoration: "none" }}>
                      <div
                        style={{
                          padding: "8px 10px",
                          backgroundColor: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          borderRadius: 8,
                          marginBottom: 6,
                          cursor: "pointer",
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; setHoveredWarehouse(wh.id); }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; setHoveredWarehouse(null); }}
                      >
                        <div style={{ fontSize: 11, fontWeight: 600, color: "#e2e8f0", marginBottom: 3 }}>{wh.name}</div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: 10, color: "#64748b" }}>{wh.location.city}</span>
                          <span style={{ fontSize: 12, fontWeight: 600, color: "#34d399" }}>{"\u20B1"}{formatRate(wh.rate)}/sqm</span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  );
}
