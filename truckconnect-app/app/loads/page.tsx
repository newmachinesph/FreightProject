"use client";

import { useState, useMemo } from "react";
import {
  Search, MapPin, ArrowRight, Filter, ArrowLeft,
  Anchor, Gavel, Package, Zap, CheckCircle, Truck,
  Clock, Ship, Thermometer,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { loads } from "@/lib/mock-data";
import type { MarketplaceLoad } from "@/lib/mock-data";

const statusColors: Record<MarketplaceLoad["status"], { bg: string; text: string; label: string }> = {
  open: { bg: "#DCFCE7", text: "#166534", label: "Open" },
  bidding: { bg: "#DBEAFE", text: "#1E40AF", label: "Bidding" },
  awarded: { bg: "#E0E7FF", text: "#3730A3", label: "Awarded" },
  in_transit: { bg: "#FEF3C7", text: "#92400E", label: "In Transit" },
  delivered: { bg: "#F3F4F6", text: "#374151", label: "Delivered" },
};

const biddingModeLabels: Record<string, { label: string; color: string }> = {
  open_auction: { label: "Auction", color: "#D97706" },
  sealed_bid: { label: "Sealed Bid", color: "#7C3AED" },
  direct_award: { label: "Direct Award", color: "#059669" },
  instant_book: { label: "Instant Book", color: "#2563EB" },
};

function formatRate(rate: number): string {
  return new Intl.NumberFormat("en-PH").format(rate);
}

/** Haversine distance in km between two lat/lng pairs */
function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (n: number) => (n * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Time remaining until deadline in human-readable form */
function timeRemaining(deadline: string): string {
  const now = new Date("2026-03-20T08:00:00Z"); // current simulated date
  const end = new Date(deadline);
  const diffMs = end.getTime() - now.getTime();
  if (diffMs <= 0) return "Expired";
  const h = Math.floor(diffMs / 3600000);
  const m = Math.floor((diffMs % 3600000) / 60000);
  if (h >= 48) return `${Math.floor(h / 24)}d left`;
  if (h >= 1) return `${h}h ${m}m left`;
  return `${m}m left`;
}

/** Extract temperature from specialRequirements if reefer */
function extractTemp(load: MarketplaceLoad): string | null {
  if (load.cargoType !== "Reefer" || !load.specialRequirements) return null;
  const match = load.specialRequirements.match(/-?\d+\s*°?\s*C\s*(to\s*-?\d+\s*°?\s*C)?/i);
  if (match) return match[0].replace(/\s+/g, "");
  return null;
}

/** Simple vehicle type icon as inline SVG */
function VehicleIcon({ type, size = 20 }: { type: string; size?: number }) {
  const t = type.toLowerCase();
  if (t.includes("wing van")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="6" width="15" height="10" rx="1" />
        <path d="M16 10h4l3 3v3h-7V10z" />
        <circle cx="6" cy="18" r="2" />
        <circle cx="20" cy="18" r="2" />
        <path d="M5 10h7" />
      </svg>
    );
  }
  if (t.includes("closed van")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="6" width="15" height="10" rx="1" />
        <path d="M16 10h4l3 3v3h-7V10z" />
        <circle cx="6" cy="18" r="2" />
        <circle cx="20" cy="18" r="2" />
      </svg>
    );
  }
  if (t.includes("reefer")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#0891B2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="6" width="15" height="10" rx="1" />
        <path d="M16 10h4l3 3v3h-7V10z" />
        <circle cx="6" cy="18" r="2" />
        <circle cx="20" cy="18" r="2" />
        <line x1="8" y1="8" x2="8" y2="14" />
        <line x1="5" y1="11" x2="11" y2="11" />
      </svg>
    );
  }
  if (t.includes("flatbed")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="1" y1="14" x2="16" y2="14" />
        <path d="M16 10h4l3 3v3h-7V10z" />
        <circle cx="6" cy="18" r="2" />
        <circle cx="20" cy="18" r="2" />
        <line x1="1" y1="14" x2="1" y2="16" />
      </svg>
    );
  }
  if (t.includes("tanker")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="8" cy="11" rx="7" ry="5" />
        <path d="M16 10h4l3 3v3h-7V10z" />
        <circle cx="6" cy="18" r="2" />
        <circle cx="20" cy="18" r="2" />
      </svg>
    );
  }
  // default truck
  return <Truck size={size} color="#64748b" />;
}

const cargoFilters = ["All", "FTL", "LTL", "Reefer", "Inter-Island", "Hazmat"] as const;
const biddingFilters = ["All Modes", "Auction", "Sealed Bid", "Direct Award", "Instant Book"] as const;
const biddingModeMap: Record<string, string> = {
  "Auction": "open_auction", "Sealed Bid": "sealed_bid", "Direct Award": "direct_award", "Instant Book": "instant_book",
};

const sortOptions = [
  { value: "rate_desc", label: "Highest Rate" },
  { value: "rate_asc", label: "Lowest Rate" },
  { value: "deadline", label: "Deadline Soonest" },
  { value: "distance", label: "Shortest Distance" },
] as const;

export default function LoadBoardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [biddingFilter, setBiddingFilter] = useState<string>("All Modes");
  const [sortBy, setSortBy] = useState<string>("rate_desc");

  // Pre-compute distances
  const loadsWithDistance = useMemo(() =>
    loads.map((load) => ({
      ...load,
      distanceKm: Math.round(haversineKm(load.origin.lat, load.origin.lng, load.destination.lat, load.destination.lng)),
    })), []);

  const filteredLoads = useMemo(() => {
    let result = loadsWithDistance.filter((load) => {
      const matchesSearch = searchQuery === "" ||
        load.origin.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        load.destination.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        load.commodity.toLowerCase().includes(searchQuery.toLowerCase()) ||
        load.shipper.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        load.id.toLowerCase().includes(searchQuery.toLowerCase());
      let matchesCargo = true;
      if (activeFilter === "Reefer") matchesCargo = load.cargoType === "Reefer";
      if (activeFilter === "Hazmat") matchesCargo = load.cargoType === "Hazmat";
      if (activeFilter === "LTL") matchesCargo = load.cargoType === "LTL";
      if (activeFilter === "FTL") matchesCargo = load.cargoType === "FTL";
      if (activeFilter === "Inter-Island") matchesCargo = load.interIsland;
      let matchesBidding = true;
      if (biddingFilter !== "All Modes") matchesBidding = load.biddingMode === biddingModeMap[biddingFilter];
      return matchesSearch && matchesCargo && matchesBidding;
    });

    // Sort
    result.sort((a, b) => {
      if (sortBy === "rate_desc") return b.offeredRate - a.offeredRate;
      if (sortBy === "rate_asc") return a.offeredRate - b.offeredRate;
      if (sortBy === "deadline") return new Date(a.bidDeadline).getTime() - new Date(b.bidDeadline).getTime();
      if (sortBy === "distance") return a.distanceKm - b.distanceKm;
      return 0;
    });

    return result;
  }, [loadsWithDistance, searchQuery, activeFilter, biddingFilter, sortBy]);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <Navbar active="Load Board" />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "20px 24px 64px" }}>
        <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#6B7280", fontSize: 13, textDecoration: "none", marginBottom: 12 }}>
          <ArrowLeft size={14} /> Back to Marketplace
        </a>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#0f172a", margin: "8px 0 6px" }}>Load Board</h1>
        <p style={{ fontSize: 14, color: "#6B7280", margin: "0 0 20px" }}>Browse {loads.length} freight loads across the Philippines</p>

        {/* Search + Filters */}
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 10, flexWrap: "wrap" }}>
          <div style={{
            flex: 1, maxWidth: 500, display: "flex", alignItems: "center",
            backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 10, padding: "0 14px",
          }}>
            <Search size={16} color="#9CA3AF" />
            <input type="text" placeholder="Search by city, commodity, shipper..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ flex: 1, padding: "10px 10px", border: "none", background: "none", outline: "none", fontSize: 13, color: "#0f172a" }} />
          </div>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            {cargoFilters.map((f) => (
              <button key={f} onClick={() => setActiveFilter(f)} style={{
                padding: "8px 14px", border: "1px solid #e2e8f0", borderRadius: 8, cursor: "pointer",
                fontSize: 12, fontWeight: 500,
                color: activeFilter === f ? "#ffffff" : "#374151",
                backgroundColor: activeFilter === f ? "#2563EB" : "#ffffff",
              }}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Bidding mode filter + Sort */}
        <div style={{ display: "flex", gap: 5, marginBottom: 14, flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: 11, color: "#6B7280", display: "flex", alignItems: "center", marginRight: 4 }}>Bidding:</span>
            {biddingFilters.map((f) => (
              <button key={f} onClick={() => setBiddingFilter(f)} style={{
                padding: "5px 12px", border: "1px solid #e2e8f0", borderRadius: 6, cursor: "pointer",
                fontSize: 12, fontWeight: 500,
                color: biddingFilter === f ? "#ffffff" : "#6B7280",
                backgroundColor: biddingFilter === f ? "#7C3AED" : "#ffffff",
              }}>
                {f}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 11, color: "#6B7280" }}>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: "5px 10px", border: "1px solid #e2e8f0", borderRadius: 6,
                fontSize: 12, color: "#374151", backgroundColor: "#fff", cursor: "pointer", outline: "none",
              }}
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#6B7280", fontSize: 12, marginBottom: 14 }}>
          <Filter size={13} />
          <span>{filteredLoads.length} loads found</span>
        </div>

        {/* Load Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {filteredLoads.map((load) => {
            const sc = statusColors[load.status];
            const bm = biddingModeLabels[load.biddingMode];
            const ratePerKm = load.distanceKm > 0 ? (load.offeredRate / load.distanceKm).toFixed(1) : "—";
            const temp = extractTemp(load);
            const deadline = timeRemaining(load.bidDeadline);
            const deadlineExpired = deadline === "Expired";

            return (
              <a key={load.id} href={`/loads/${load.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                <div
                  style={{
                    backgroundColor: "#ffffff", borderRadius: 10, border: "1px solid #e2e8f0",
                    overflow: "hidden", cursor: "pointer", transition: "box-shadow 0.2s, transform 0.2s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
                >
                  {/* Card Header */}
                  <div style={{ position: "relative", height: 100, background: "linear-gradient(135deg, #0f172a, #1e293b)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <VehicleIcon type={load.vehicleType} size={36} />
                    <span style={{ position: "absolute", top: 8, right: 8, padding: "3px 10px", borderRadius: 6, fontSize: 10, fontWeight: 600, backgroundColor: sc.bg, color: sc.text }}>{sc.label}</span>
                    <span style={{ position: "absolute", top: 8, left: 8, padding: "3px 8px", borderRadius: 6, fontSize: 10, fontWeight: 600, backgroundColor: "rgba(0,0,0,0.6)", color: "#ffffff" }}>{load.id}</span>
                    {/* Inter-island RoRo badge */}
                    {load.interIsland && (
                      <span style={{ position: "absolute", bottom: 8, left: 8, padding: "2px 8px", borderRadius: 6, fontSize: 9, fontWeight: 600, backgroundColor: "#0891B2", color: "#fff", display: "flex", alignItems: "center", gap: 3 }}>
                        <Ship size={9} /> RoRo / Inter-Island
                      </span>
                    )}
                    {/* Reefer temp badge */}
                    {temp && (
                      <span style={{ position: "absolute", bottom: 8, right: 8, padding: "2px 8px", borderRadius: 6, fontSize: 9, fontWeight: 600, backgroundColor: "#0EA5E9", color: "#fff", display: "flex", alignItems: "center", gap: 3 }}>
                        <Thermometer size={9} /> {temp}
                      </span>
                    )}
                  </div>

                  {/* Card Body */}
                  <div style={{ padding: 14 }}>
                    {/* Route with arrow */}
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                      <MapPin size={13} color="#2563EB" />
                      <span style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>{load.origin.city}</span>
                      <ArrowRight size={14} color="#2563EB" />
                      <span style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>{load.destination.city}</span>
                    </div>

                    {/* Distance + vehicle type with icon */}
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#6B7280", marginBottom: 4 }}>
                      <VehicleIcon type={load.vehicleType} size={14} />
                      <span>{load.vehicleType}</span>
                      <span style={{ color: "#d1d5db" }}>|</span>
                      <span style={{ fontWeight: 600, color: "#475569" }}>{formatRate(load.distanceKm)} km</span>
                    </div>

                    {/* Commodity + weight */}
                    <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 6 }}>
                      {load.commodity} &middot; {(load.weightKg / 1000).toFixed(1)}T
                    </div>

                    {/* Badges row */}
                    <div style={{ display: "flex", gap: 5, marginBottom: 8, flexWrap: "wrap" }}>
                      <span style={{ padding: "2px 7px", borderRadius: 4, fontSize: 10, fontWeight: 600, color: bm.color, background: `${bm.color}15` }}>{bm.label}</span>
                      <span style={{ padding: "2px 7px", borderRadius: 4, fontSize: 10, fontWeight: 600, color: "#6B7280", background: "#F3F4F6" }}>{load.cargoType}</span>
                      {load.bids > 0 && <span style={{ padding: "2px 7px", borderRadius: 4, fontSize: 10, fontWeight: 600, color: "#D97706", background: "#FFFBEB" }}>{load.bids} bid{load.bids !== 1 ? "s" : ""}</span>}
                    </div>

                    {/* Rate + rate per km */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 6 }}>
                      <div>
                        <span style={{ fontSize: 18, fontWeight: 700, color: "#059669" }}>{"\u20B1"}{formatRate(load.offeredRate)}</span>
                        <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 1 }}>{"\u20B1"}{ratePerKm}/km</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                        {load.shipper.verified && <CheckCircle size={11} color="#2563EB" />}
                        <span style={{ fontSize: 11, color: "#6B7280" }}>{load.shipper.name}</span>
                      </div>
                    </div>

                    {/* Pickup + Deadline */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 6, borderTop: "1px solid #f1f5f9" }}>
                      <div style={{ fontSize: 11, color: "#9CA3AF" }}>
                        Pickup: {load.pickupDate}
                      </div>
                      <div style={{
                        display: "flex", alignItems: "center", gap: 3,
                        fontSize: 11, fontWeight: 600,
                        color: deadlineExpired ? "#9CA3AF" : "#DC2626",
                      }}>
                        <Clock size={11} />
                        {deadline}
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
