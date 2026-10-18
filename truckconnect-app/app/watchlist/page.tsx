"use client";

import { useState, useCallback } from "react";
import {
  ArrowLeft,
  Star,
  Truck,
  Warehouse as WarehouseIcon,
  MapPin,
  Navigation,
  Bell,
  X,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  StickyNote,
  Clock,
  ArrowUpDown,
  CheckSquare,
  Square,
  Trash2,
  Edit3,
  Save,
  AlertTriangle,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { useSession } from "@/lib/auth";

// ── Types ──

interface WatchedCarrier {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  fleetSize: number;
  specializations: string[];
  location: string;
  verified: boolean;
  priceRange: string;
  priceChange: number; // percentage change since added
  availability: "available" | "limited" | "booked";
  addedDate: string;
  lastChecked: string;
  note: string;
}

interface WatchedWarehouse {
  id: string;
  name: string;
  type: string;
  totalArea: string;
  available: string;
  location: string;
  rating: number;
  price: string;
  priceChange: number;
  availability: "available" | "limited" | "booked";
  addedDate: string;
  lastChecked: string;
  note: string;
}

interface WatchedRoute {
  id: string;
  origin: string;
  destination: string;
  currentAvgRate: number;
  alertPrice: number;
  trend: "up" | "down";
  trendPercent: number;
  lastUpdated: string;
  addedDate: string;
  lastChecked: string;
  note: string;
}

// ── Mock Data ──

const initialCarriers: WatchedCarrier[] = [
  {
    id: "CR-001",
    name: "PhilTrans Logistics",
    rating: 4.8,
    reviews: 127,
    fleetSize: 45,
    specializations: ["FTL", "Reefer", "Hazmat"],
    location: "Metro Manila",
    verified: true,
    priceRange: "\u20B115K - \u20B195K",
    priceChange: 5.2,
    availability: "available",
    addedDate: "2026-02-15",
    lastChecked: "2 min ago",
    note: "",
  },
  {
    id: "CR-003",
    name: "IslandFreight Co.",
    rating: 4.6,
    reviews: 89,
    fleetSize: 32,
    specializations: ["Inter-Island", "RoRo", "LTL"],
    location: "Cebu City",
    verified: true,
    priceRange: "\u20B120K - \u20B1120K",
    priceChange: -3.1,
    availability: "limited",
    addedDate: "2026-01-22",
    lastChecked: "15 min ago",
    note: "Good for Cebu routes",
  },
  {
    id: "CR-007",
    name: "Visayas Express Transport",
    rating: 4.5,
    reviews: 64,
    fleetSize: 22,
    specializations: ["FTL", "LTL"],
    location: "Iloilo City",
    verified: false,
    priceRange: "\u20B112K - \u20B165K",
    priceChange: 1.8,
    availability: "available",
    addedDate: "2026-03-01",
    lastChecked: "1 hr ago",
    note: "",
  },
  {
    id: "CR-012",
    name: "Mindanao Cargo Movers",
    rating: 4.3,
    reviews: 41,
    fleetSize: 18,
    specializations: ["FTL", "Agricultural"],
    location: "Davao City",
    verified: true,
    priceRange: "\u20B110K - \u20B180K",
    priceChange: -1.5,
    availability: "available",
    addedDate: "2026-02-28",
    lastChecked: "30 min ago",
    note: "Budget option for Mindanao",
  },
  {
    id: "CR-015",
    name: "LBC Cargo Movers",
    rating: 4.9,
    reviews: 203,
    fleetSize: 60,
    specializations: ["E-Commerce", "Last Mile", "Express"],
    location: "Metro Manila",
    verified: true,
    priceRange: "\u20B18K - \u20B1110K",
    priceChange: 2.4,
    availability: "limited",
    addedDate: "2026-03-10",
    lastChecked: "5 min ago",
    note: "Premium but fast response",
  },
  {
    id: "CR-018",
    name: "Subic Bay Logistics",
    rating: 4.7,
    reviews: 76,
    fleetSize: 22,
    specializations: ["Hazmat", "Chemicals", "Container"],
    location: "Subic, Zambales",
    verified: true,
    priceRange: "\u20B125K - \u20B1130K",
    priceChange: -0.8,
    availability: "booked",
    addedDate: "2026-01-05",
    lastChecked: "2 hr ago",
    note: "Only option for hazmat to Subic",
  },
];

const initialWarehouses: WatchedWarehouse[] = [
  {
    id: "WH-001",
    name: "Manila Central Warehouse",
    type: "Dry",
    totalArea: "5,000 sqm",
    available: "1,200 sqm",
    location: "Tondo, Manila",
    rating: 4.7,
    price: "\u20B1350/sqm/mo",
    priceChange: 3.0,
    availability: "available",
    addedDate: "2026-02-01",
    lastChecked: "10 min ago",
    note: "Primary storage option",
  },
  {
    id: "WH-004",
    name: "Cebu Cold Storage Hub",
    type: "Cold",
    totalArea: "2,500 sqm",
    available: "800 sqm",
    location: "Mandaue, Cebu",
    rating: 4.5,
    price: "\u20B1520/sqm/mo",
    priceChange: -2.1,
    availability: "limited",
    addedDate: "2026-01-15",
    lastChecked: "45 min ago",
    note: "Cold chain for seafood",
  },
  {
    id: "WH-009",
    name: "Clark Freeport Bonded Zone",
    type: "Bonded",
    totalArea: "8,000 sqm",
    available: "3,500 sqm",
    location: "Clark, Pampanga",
    rating: 4.8,
    price: "\u20B1480/sqm/mo",
    priceChange: 1.2,
    availability: "available",
    addedDate: "2026-02-20",
    lastChecked: "20 min ago",
    note: "",
  },
  {
    id: "WH-012",
    name: "Davao Agri Cold Storage",
    type: "Cold",
    totalArea: "3,200 sqm",
    available: "0 sqm",
    location: "Toril, Davao City",
    rating: 4.4,
    price: "\u20B1490/sqm/mo",
    priceChange: 4.5,
    availability: "booked",
    addedDate: "2026-03-05",
    lastChecked: "3 hr ago",
    note: "Waitlisted for Q2",
  },
  {
    id: "WH-015",
    name: "Batangas Port Warehouse",
    type: "Dry",
    totalArea: "6,500 sqm",
    available: "2,100 sqm",
    location: "Batangas Port Area",
    rating: 4.6,
    price: "\u20B1310/sqm/mo",
    priceChange: -1.0,
    availability: "available",
    addedDate: "2026-03-12",
    lastChecked: "1 hr ago",
    note: "Good port proximity",
  },
];

const initialRoutes: WatchedRoute[] = [
  {
    id: "RT-001",
    origin: "Manila",
    destination: "Cebu City",
    currentAvgRate: 78000,
    alertPrice: 70000,
    trend: "up",
    trendPercent: 5.2,
    lastUpdated: "2 hours ago",
    addedDate: "2026-01-10",
    lastChecked: "2 hr ago",
    note: "Main inter-island route",
  },
  {
    id: "RT-002",
    origin: "Batangas",
    destination: "Mindoro",
    currentAvgRate: 28000,
    alertPrice: 25000,
    trend: "down",
    trendPercent: 3.1,
    lastUpdated: "4 hours ago",
    addedDate: "2026-02-05",
    lastChecked: "4 hr ago",
    note: "",
  },
  {
    id: "RT-003",
    origin: "Davao",
    destination: "Cagayan de Oro",
    currentAvgRate: 32000,
    alertPrice: 30000,
    trend: "up",
    trendPercent: 1.8,
    lastUpdated: "1 day ago",
    addedDate: "2026-02-18",
    lastChecked: "1 day ago",
    note: "Mindanao backbone route",
  },
  {
    id: "RT-004",
    origin: "Manila",
    destination: "Clark",
    currentAvgRate: 15000,
    alertPrice: 12000,
    trend: "down",
    trendPercent: 2.5,
    lastUpdated: "30 min ago",
    addedDate: "2026-03-01",
    lastChecked: "30 min ago",
    note: "",
  },
  {
    id: "RT-005",
    origin: "Cebu City",
    destination: "Davao City",
    currentAvgRate: 55000,
    alertPrice: 48000,
    trend: "up",
    trendPercent: 4.0,
    lastUpdated: "3 hours ago",
    addedDate: "2026-03-08",
    lastChecked: "3 hr ago",
    note: "Watch for seasonal dip in April",
  },
];

type WatchlistTab = "carriers" | "warehouses" | "routes";
type SortOption = "recent" | "active" | "priceUp" | "priceDown" | "name";

function formatRate(rate: number): string {
  return new Intl.NumberFormat("en-PH").format(rate);
}

function AvailabilityBadge({ status }: { status: "available" | "limited" | "booked" }) {
  const config = {
    available: { label: "Available Now", bg: "#DCFCE7", color: "#166534" },
    limited: { label: "Limited Slots", bg: "#FEF3C7", color: "#92400E" },
    booked: { label: "Fully Booked", bg: "#FEE2E2", color: "#991B1B" },
  };
  const c = config[status];
  return (
    <span style={{ padding: "2px 8px", borderRadius: 9999, fontSize: 10, fontWeight: 700, backgroundColor: c.bg, color: c.color, whiteSpace: "nowrap" }}>
      {c.label}
    </span>
  );
}

function PriceChangeIndicator({ change }: { change: number }) {
  if (change === 0) return null;
  const isUp = change > 0;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 2,
      fontSize: 11, fontWeight: 700,
      color: isUp ? "#DC2626" : "#059669",
    }}>
      {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
      {isUp ? "+" : ""}{change.toFixed(1)}%
    </span>
  );
}

export default function WatchlistPage() {
  const [activeTab, setActiveTab] = useState<WatchlistTab>("carriers");
  const [carriers, setCarriers] = useState(initialCarriers);
  const [warehouses, setWarehouses] = useState(initialWarehouses);
  const [routes, setRoutes] = useState(initialRoutes);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");
  const [editingThreshold, setEditingThreshold] = useState<string | null>(null);
  const [thresholdText, setThresholdText] = useState("");

  const session = useSession();
  const isSignedIn = session?.data?.user != null;

  // Selection helpers
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const getCurrentItems = useCallback((): { id: string }[] => {
    if (activeTab === "carriers") return carriers;
    if (activeTab === "warehouses") return warehouses;
    return routes;
  }, [activeTab, carriers, warehouses, routes]);

  const selectAll = () => {
    const items = getCurrentItems();
    setSelectedIds(new Set(items.map((i) => i.id)));
  };

  const deselectAll = () => setSelectedIds(new Set());

  const removeSelected = () => {
    if (activeTab === "carriers") setCarriers((prev) => prev.filter((c) => !selectedIds.has(c.id)));
    if (activeTab === "warehouses") setWarehouses((prev) => prev.filter((w) => !selectedIds.has(w.id)));
    if (activeTab === "routes") setRoutes((prev) => prev.filter((r) => !selectedIds.has(r.id)));
    setSelectedIds(new Set());
  };

  const removeItem = (id: string) => {
    if (activeTab === "carriers") setCarriers((prev) => prev.filter((c) => c.id !== id));
    if (activeTab === "warehouses") setWarehouses((prev) => prev.filter((w) => w.id !== id));
    if (activeTab === "routes") setRoutes((prev) => prev.filter((r) => r.id !== id));
    setSelectedIds((prev) => { const n = new Set(prev); n.delete(id); return n; });
  };

  // Note editing
  const startEditNote = (id: string, currentNote: string) => {
    setEditingNote(id);
    setNoteText(currentNote);
  };

  const saveNote = (id: string) => {
    if (activeTab === "carriers") setCarriers((prev) => prev.map((c) => c.id === id ? { ...c, note: noteText } : c));
    if (activeTab === "warehouses") setWarehouses((prev) => prev.map((w) => w.id === id ? { ...w, note: noteText } : w));
    if (activeTab === "routes") setRoutes((prev) => prev.map((r) => r.id === id ? { ...r, note: noteText } : r));
    setEditingNote(null);
    setNoteText("");
  };

  // Threshold editing for routes
  const startEditThreshold = (id: string, currentPrice: number) => {
    setEditingThreshold(id);
    setThresholdText(String(currentPrice));
  };

  const saveThreshold = (id: string) => {
    const val = parseInt(thresholdText.replace(/[^0-9]/g, ""), 10);
    if (!isNaN(val)) {
      setRoutes((prev) => prev.map((r) => r.id === id ? { ...r, alertPrice: val } : r));
    }
    setEditingThreshold(null);
    setThresholdText("");
  };

  // Sorting
  const sortItems = <T extends { id: string; addedDate: string; lastChecked: string; priceChange?: number; name?: string }>(items: T[]): T[] => {
    const sorted = [...items];
    switch (sortBy) {
      case "recent":
        return sorted.sort((a, b) => new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime());
      case "active":
        return sorted.sort((a, b) => {
          const parseChecked = (s: string) => {
            if (s.includes("min")) return parseInt(s);
            if (s.includes("hr") || s.includes("hour")) return parseInt(s) * 60;
            if (s.includes("day")) return parseInt(s) * 1440;
            return 9999;
          };
          return parseChecked(a.lastChecked) - parseChecked(b.lastChecked);
        });
      case "priceUp":
        return sorted.sort((a, b) => (b.priceChange ?? 0) - (a.priceChange ?? 0));
      case "priceDown":
        return sorted.sort((a, b) => (a.priceChange ?? 0) - (b.priceChange ?? 0));
      case "name":
        return sorted.sort((a, b) => (a.name ?? a.id).localeCompare(b.name ?? b.id));
      default:
        return sorted;
    }
  };

  const sortedCarriers = sortItems(carriers.map((c) => ({ ...c, priceChange: c.priceChange })));
  const sortedWarehouses = sortItems(warehouses.map((w) => ({ ...w, priceChange: w.priceChange })));
  const sortedRoutes = sortItems(routes.map((r) => ({ ...r, priceChange: r.trendPercent * (r.trend === "up" ? 1 : -1), name: `${r.origin} ${r.destination}` })));

  const tabs: { key: WatchlistTab; label: string; count: number; icon: typeof Truck }[] = [
    { key: "carriers", label: "Carriers", count: carriers.length, icon: Truck },
    { key: "warehouses", label: "Warehouses", count: warehouses.length, icon: WarehouseIcon },
    { key: "routes", label: "Routes", count: routes.length, icon: Navigation },
  ];

  const selectedCount = selectedIds.size;
  const currentItemCount = getCurrentItems().length;

  const cardStyle: React.CSSProperties = {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    border: "1px solid #e2e8f0",
    padding: "18px 20px",
    transition: "box-shadow 0.2s, border-color 0.2s",
  };

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "recent", label: "Recently Added" },
    { value: "active", label: "Most Active" },
    { value: "priceUp", label: "Price \u2191 (Biggest)" },
    { value: "priceDown", label: "Price \u2193 (Biggest)" },
    { value: "name", label: "Name A-Z" },
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <Navbar active="Watchlist" />

      <div style={{ maxWidth: 920, margin: "0 auto", padding: "20px 24px 64px" }}>
        <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#6B7280", fontSize: 13, textDecoration: "none", marginBottom: 16 }}>
          <ArrowLeft size={14} /> Back to Marketplace
        </a>

        <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "8px 0 6px" }}>
          <Star size={24} color="#d97706" fill="#d97706" />
          <h1 style={{ fontSize: 26, fontWeight: 700, color: "#0f172a", margin: 0 }}>My Watchlist</h1>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#6B7280", backgroundColor: "#f1f5f9", padding: "2px 10px", borderRadius: 9999 }}>
            {carriers.length + warehouses.length + routes.length} items
          </span>
        </div>
        <p style={{ fontSize: 14, color: "#6B7280", margin: "0 0 24px" }}>
          Track carriers, warehouses, and routes with price alerts and availability updates
        </p>

        {!isSignedIn ? (
          <div style={{
            backgroundColor: "#ffffff", borderRadius: 12, border: "1px solid #e2e8f0",
            padding: 48, textAlign: "center",
          }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", backgroundColor: "#FEF3C7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <Star size={28} color="#d97706" />
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: "0 0 8px" }}>Sign in to manage your watchlist</h2>
            <p style={{ fontSize: 14, color: "#6B7280", margin: "0 0 24px", lineHeight: 1.6 }}>
              Star your favorite carriers, warehouses, and routes to keep track of them.
            </p>
            <a
              href={process.env.NEXT_PUBLIC_AUTH_URL ?? "http://localhost:3001"}
              style={{
                display: "inline-block", padding: "12px 32px", border: "none", borderRadius: 10,
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
            <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => { setActiveTab(tab.key); setSelectedIds(new Set()); }}
                    style={{
                      padding: "8px 18px", border: "1px solid #e2e8f0", borderRadius: 8,
                      cursor: "pointer", fontSize: 13, fontWeight: activeTab === tab.key ? 600 : 400,
                      color: activeTab === tab.key ? "#2563eb" : "#6B7280",
                      backgroundColor: activeTab === tab.key ? "#EFF6FF" : "#ffffff",
                      transition: "all 0.15s",
                      display: "flex", alignItems: "center", gap: 6,
                    }}
                  >
                    <Icon size={14} />
                    {tab.label}
                    <span style={{
                      backgroundColor: activeTab === tab.key ? "#2563eb" : "#e2e8f0",
                      color: activeTab === tab.key ? "#ffffff" : "#64748b",
                      padding: "1px 7px", borderRadius: 9999, fontSize: 11, fontWeight: 700,
                    }}>
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Toolbar: Sort + Batch actions */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              marginBottom: 14, padding: "8px 0",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {/* Select all / Deselect */}
                <button
                  onClick={selectedCount === currentItemCount ? deselectAll : selectAll}
                  style={{
                    display: "flex", alignItems: "center", gap: 5, padding: "5px 10px",
                    border: "1px solid #e2e8f0", borderRadius: 6, cursor: "pointer",
                    fontSize: 12, fontWeight: 500, color: "#64748b", backgroundColor: "#ffffff",
                  }}
                >
                  {selectedCount === currentItemCount && currentItemCount > 0 ? <CheckSquare size={13} /> : <Square size={13} />}
                  {selectedCount > 0 ? `${selectedCount} selected` : "Select all"}
                </button>

                {selectedCount > 0 && (
                  <button
                    onClick={removeSelected}
                    style={{
                      display: "flex", alignItems: "center", gap: 5, padding: "5px 10px",
                      border: "1px solid #FCA5A5", borderRadius: 6, cursor: "pointer",
                      fontSize: 12, fontWeight: 600, color: "#DC2626", backgroundColor: "#FEF2F2",
                    }}
                  >
                    <Trash2 size={12} /> Remove {selectedCount}
                  </button>
                )}
              </div>

              {/* Sort */}
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <ArrowUpDown size={13} color="#94a3b8" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  style={{
                    padding: "5px 10px", border: "1px solid #e2e8f0", borderRadius: 6,
                    fontSize: 12, color: "#374151", backgroundColor: "#ffffff", cursor: "pointer",
                  }}
                >
                  {sortOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* ── Carriers Tab ── */}
            {activeTab === "carriers" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {sortedCarriers.length === 0 ? (
                  <div style={{ ...cardStyle, textAlign: "center", padding: 48, color: "#94a3b8" }}>
                    <Truck size={40} color="#e2e8f0" style={{ margin: "0 auto 12px", display: "block" }} />
                    <p style={{ fontSize: 15, fontWeight: 600, color: "#64748b", margin: "0 0 4px" }}>No carriers in your watchlist</p>
                    <p style={{ fontSize: 13, margin: 0 }}>Browse the marketplace and star carriers to add them here.</p>
                  </div>
                ) : (
                  sortedCarriers.map((carrier) => {
                    const isSelected = selectedIds.has(carrier.id);
                    return (
                      <div key={carrier.id} style={{
                        ...cardStyle,
                        borderColor: isSelected ? "#93C5FD" : "#e2e8f0",
                        backgroundColor: isSelected ? "#F0F7FF" : "#ffffff",
                      }}>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                          {/* Checkbox */}
                          <button
                            onClick={() => toggleSelect(carrier.id)}
                            style={{ background: "none", border: "none", cursor: "pointer", padding: 2, marginTop: 2, flexShrink: 0 }}
                          >
                            {isSelected ? <CheckSquare size={18} color="#2563eb" /> : <Square size={18} color="#cbd5e1" />}
                          </button>

                          <div style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: "#ECFDF5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <Truck size={22} color="#059669" />
                          </div>

                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3, flexWrap: "wrap" }}>
                              <span style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>{carrier.name}</span>
                              {carrier.verified && <CheckCircle size={14} color="#2563eb" />}
                              <AvailabilityBadge status={carrier.availability} />
                              <PriceChangeIndicator change={carrier.priceChange} />
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#94a3b8", flexWrap: "wrap" }}>
                              <span>{"\u2605"} {carrier.rating} ({carrier.reviews})</span>
                              <span>&middot;</span>
                              <span>{carrier.fleetSize} trucks</span>
                              <span>&middot;</span>
                              <span style={{ display: "inline-flex", alignItems: "center", gap: 2 }}><MapPin size={11} /> {carrier.location}</span>
                            </div>
                            <div style={{ display: "flex", gap: 4, marginTop: 6, flexWrap: "wrap", alignItems: "center" }}>
                              {carrier.specializations.map((s) => (
                                <span key={s} style={{ padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600, backgroundColor: "#F1F5F9", color: "#64748b" }}>{s}</span>
                              ))}
                              <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600, backgroundColor: "#ECFDF5", color: "#059669" }}>{carrier.priceRange}</span>
                            </div>

                            {/* Note */}
                            <div style={{ marginTop: 8 }}>
                              {editingNote === carrier.id ? (
                                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                  <StickyNote size={12} color="#d97706" />
                                  <input
                                    value={noteText}
                                    onChange={(e) => setNoteText(e.target.value)}
                                    placeholder="Add a note..."
                                    autoFocus
                                    onKeyDown={(e) => e.key === "Enter" && saveNote(carrier.id)}
                                    style={{
                                      flex: 1, padding: "4px 8px", border: "1px solid #d97706", borderRadius: 6,
                                      fontSize: 12, color: "#374151", outline: "none", backgroundColor: "#FFFBEB",
                                    }}
                                  />
                                  <button onClick={() => saveNote(carrier.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
                                    <Save size={14} color="#059669" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => startEditNote(carrier.id, carrier.note)}
                                  style={{
                                    display: "flex", alignItems: "center", gap: 4,
                                    background: "none", border: "none", cursor: "pointer", padding: 0,
                                    fontSize: 12, color: carrier.note ? "#92400E" : "#94a3b8",
                                  }}
                                >
                                  {carrier.note ? (
                                    <>
                                      <StickyNote size={11} color="#d97706" />
                                      <span style={{ fontStyle: "italic" }}>{carrier.note}</span>
                                      <Edit3 size={10} color="#94a3b8" />
                                    </>
                                  ) : (
                                    <>
                                      <Edit3 size={11} /> Add note
                                    </>
                                  )}
                                </button>
                              )}
                            </div>

                            {/* Last checked */}
                            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4, fontSize: 11, color: "#94a3b8" }}>
                              <Clock size={10} /> Last checked: {carrier.lastChecked}
                            </div>
                          </div>

                          <button
                            onClick={() => removeItem(carrier.id)}
                            style={{ background: "none", border: "none", cursor: "pointer", padding: 4, flexShrink: 0 }}
                            title="Remove from watchlist"
                          >
                            <X size={18} color="#94a3b8" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* ── Warehouses Tab ── */}
            {activeTab === "warehouses" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {sortedWarehouses.length === 0 ? (
                  <div style={{ ...cardStyle, textAlign: "center", padding: 48, color: "#94a3b8" }}>
                    <WarehouseIcon size={40} color="#e2e8f0" style={{ margin: "0 auto 12px", display: "block" }} />
                    <p style={{ fontSize: 15, fontWeight: 600, color: "#64748b", margin: "0 0 4px" }}>No warehouses in your watchlist</p>
                    <p style={{ fontSize: 13, margin: 0 }}>Browse warehouses and star them to add them here.</p>
                  </div>
                ) : (
                  sortedWarehouses.map((wh) => {
                    const isSelected = selectedIds.has(wh.id);
                    return (
                      <div key={wh.id} style={{
                        ...cardStyle,
                        borderColor: isSelected ? "#93C5FD" : "#e2e8f0",
                        backgroundColor: isSelected ? "#F0F7FF" : "#ffffff",
                      }}>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                          <button
                            onClick={() => toggleSelect(wh.id)}
                            style={{ background: "none", border: "none", cursor: "pointer", padding: 2, marginTop: 2, flexShrink: 0 }}
                          >
                            {isSelected ? <CheckSquare size={18} color="#2563eb" /> : <Square size={18} color="#cbd5e1" />}
                          </button>

                          <div style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: "#F5F3FF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <WarehouseIcon size={22} color="#7c3aed" />
                          </div>

                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3, flexWrap: "wrap" }}>
                              <span style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>{wh.name}</span>
                              <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600, backgroundColor: "#F1F5F9", color: "#64748b" }}>{wh.type}</span>
                              <AvailabilityBadge status={wh.availability} />
                              <PriceChangeIndicator change={wh.priceChange} />
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#94a3b8", flexWrap: "wrap" }}>
                              <span>{"\u2605"} {wh.rating}</span>
                              <span>&middot;</span>
                              <span>{wh.totalArea} total</span>
                              <span>&middot;</span>
                              <span style={{ color: wh.availability === "booked" ? "#DC2626" : "#059669", fontWeight: 600 }}>{wh.available} available</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#94a3b8", marginTop: 3 }}>
                              <span style={{ display: "inline-flex", alignItems: "center", gap: 2 }}><MapPin size={11} /> {wh.location}</span>
                              <span>&middot;</span>
                              <span style={{ fontWeight: 600, color: "#059669" }}>{wh.price}</span>
                            </div>

                            {/* Note */}
                            <div style={{ marginTop: 8 }}>
                              {editingNote === wh.id ? (
                                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                  <StickyNote size={12} color="#d97706" />
                                  <input
                                    value={noteText}
                                    onChange={(e) => setNoteText(e.target.value)}
                                    placeholder="Add a note..."
                                    autoFocus
                                    onKeyDown={(e) => e.key === "Enter" && saveNote(wh.id)}
                                    style={{
                                      flex: 1, padding: "4px 8px", border: "1px solid #d97706", borderRadius: 6,
                                      fontSize: 12, color: "#374151", outline: "none", backgroundColor: "#FFFBEB",
                                    }}
                                  />
                                  <button onClick={() => saveNote(wh.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
                                    <Save size={14} color="#059669" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => startEditNote(wh.id, wh.note)}
                                  style={{
                                    display: "flex", alignItems: "center", gap: 4,
                                    background: "none", border: "none", cursor: "pointer", padding: 0,
                                    fontSize: 12, color: wh.note ? "#92400E" : "#94a3b8",
                                  }}
                                >
                                  {wh.note ? (
                                    <>
                                      <StickyNote size={11} color="#d97706" />
                                      <span style={{ fontStyle: "italic" }}>{wh.note}</span>
                                      <Edit3 size={10} color="#94a3b8" />
                                    </>
                                  ) : (
                                    <>
                                      <Edit3 size={11} /> Add note
                                    </>
                                  )}
                                </button>
                              )}
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4, fontSize: 11, color: "#94a3b8" }}>
                              <Clock size={10} /> Last checked: {wh.lastChecked}
                            </div>
                          </div>

                          <button
                            onClick={() => removeItem(wh.id)}
                            style={{ background: "none", border: "none", cursor: "pointer", padding: 4, flexShrink: 0 }}
                            title="Remove from watchlist"
                          >
                            <X size={18} color="#94a3b8" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* ── Routes Tab ── */}
            {activeTab === "routes" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {sortedRoutes.length === 0 ? (
                  <div style={{ ...cardStyle, textAlign: "center", padding: 48, color: "#94a3b8" }}>
                    <Navigation size={40} color="#e2e8f0" style={{ margin: "0 auto 12px", display: "block" }} />
                    <p style={{ fontSize: 15, fontWeight: 600, color: "#64748b", margin: "0 0 4px" }}>No routes being watched</p>
                    <p style={{ fontSize: 13, margin: 0 }}>Watch routes to get notified about price changes.</p>
                  </div>
                ) : (
                  sortedRoutes.map((route) => {
                    const isSelected = selectedIds.has(route.id);
                    const isNearThreshold = route.currentAvgRate <= route.alertPrice * 1.1;
                    return (
                      <div key={route.id} style={{
                        ...cardStyle,
                        borderColor: isSelected ? "#93C5FD" : isNearThreshold ? "#FCA5A5" : "#e2e8f0",
                        backgroundColor: isSelected ? "#F0F7FF" : isNearThreshold ? "#FFFBEB" : "#ffffff",
                      }}>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                          <button
                            onClick={() => toggleSelect(route.id)}
                            style={{ background: "none", border: "none", cursor: "pointer", padding: 2, marginTop: 2, flexShrink: 0 }}
                          >
                            {isSelected ? <CheckSquare size={18} color="#2563eb" /> : <Square size={18} color="#cbd5e1" />}
                          </button>

                          <div style={{
                            width: 44, height: 44, borderRadius: 10,
                            backgroundColor: route.trend === "up" ? "#FEE2E2" : "#DCFCE7",
                            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                          }}>
                            {route.trend === "up"
                              ? <TrendingUp size={22} color="#dc2626" />
                              : <TrendingDown size={22} color="#059669" />
                            }
                          </div>

                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3, flexWrap: "wrap" }}>
                              <span style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>
                                {route.origin} {"\u2192"} {route.destination}
                              </span>
                              {isNearThreshold && (
                                <span style={{
                                  display: "inline-flex", alignItems: "center", gap: 3,
                                  padding: "2px 8px", borderRadius: 9999, fontSize: 10, fontWeight: 700,
                                  backgroundColor: "#FEF3C7", color: "#92400E",
                                }}>
                                  <AlertTriangle size={10} /> Near alert
                                </span>
                              )}
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12, color: "#94a3b8", flexWrap: "wrap" }}>
                              <span>Avg: <span style={{ fontWeight: 700, color: "#0f172a" }}>{"\u20B1"}{formatRate(route.currentAvgRate)}</span></span>
                              <span style={{
                                color: route.trend === "up" ? "#dc2626" : "#059669",
                                fontWeight: 600,
                              }}>
                                {route.trend === "up" ? "\u2191" : "\u2193"} {route.trendPercent}%
                              </span>
                            </div>

                            {/* Threshold setting */}
                            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#94a3b8", marginTop: 5 }}>
                              <Bell size={11} color="#d97706" />
                              {editingThreshold === route.id ? (
                                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                  <span>Alert below: {"\u20B1"}</span>
                                  <input
                                    value={thresholdText}
                                    onChange={(e) => setThresholdText(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && saveThreshold(route.id)}
                                    autoFocus
                                    style={{
                                      width: 80, padding: "2px 6px", border: "1px solid #d97706", borderRadius: 4,
                                      fontSize: 12, color: "#374151", outline: "none", backgroundColor: "#FFFBEB",
                                    }}
                                  />
                                  <button onClick={() => saveThreshold(route.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
                                    <Save size={13} color="#059669" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => startEditThreshold(route.id, route.alertPrice)}
                                  style={{
                                    display: "inline-flex", alignItems: "center", gap: 4,
                                    background: "none", border: "none", cursor: "pointer", padding: 0,
                                    fontSize: 12, color: "#92400E",
                                  }}
                                >
                                  Alert when below <span style={{ fontWeight: 600, color: "#d97706" }}>{"\u20B1"}{formatRate(route.alertPrice)}</span>
                                  <Edit3 size={10} color="#94a3b8" />
                                </button>
                              )}
                            </div>

                            {/* Note */}
                            <div style={{ marginTop: 6 }}>
                              {editingNote === route.id ? (
                                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                  <StickyNote size={12} color="#d97706" />
                                  <input
                                    value={noteText}
                                    onChange={(e) => setNoteText(e.target.value)}
                                    placeholder="Add a note..."
                                    autoFocus
                                    onKeyDown={(e) => e.key === "Enter" && saveNote(route.id)}
                                    style={{
                                      flex: 1, padding: "4px 8px", border: "1px solid #d97706", borderRadius: 6,
                                      fontSize: 12, color: "#374151", outline: "none", backgroundColor: "#FFFBEB",
                                    }}
                                  />
                                  <button onClick={() => saveNote(route.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
                                    <Save size={14} color="#059669" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => startEditNote(route.id, route.note)}
                                  style={{
                                    display: "flex", alignItems: "center", gap: 4,
                                    background: "none", border: "none", cursor: "pointer", padding: 0,
                                    fontSize: 12, color: route.note ? "#92400E" : "#94a3b8",
                                  }}
                                >
                                  {route.note ? (
                                    <>
                                      <StickyNote size={11} color="#d97706" />
                                      <span style={{ fontStyle: "italic" }}>{route.note}</span>
                                      <Edit3 size={10} color="#94a3b8" />
                                    </>
                                  ) : (
                                    <>
                                      <Edit3 size={11} /> Add note
                                    </>
                                  )}
                                </button>
                              )}
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4, fontSize: 11, color: "#94a3b8" }}>
                              <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
                                <Clock size={10} /> Updated {route.lastUpdated}
                              </span>
                              <span>&middot;</span>
                              <span>Last checked: {route.lastChecked}</span>
                            </div>
                          </div>

                          <button
                            onClick={() => removeItem(route.id)}
                            style={{ background: "none", border: "none", cursor: "pointer", padding: 4, flexShrink: 0 }}
                            title="Remove from watchlist"
                          >
                            <X size={18} color="#94a3b8" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
