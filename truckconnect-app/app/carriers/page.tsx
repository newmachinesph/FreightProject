"use client";

import { useState, useMemo } from "react";
import {
  Search, Truck, Star, CheckCircle, ArrowLeft, MapPin,
  ShieldCheck, Phone,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import ImageWithFallback from "@/components/ImageWithFallback";
import { carriers } from "@/lib/mock-data";

/** Small vehicle type icon as inline SVG */
function VehicleTypeIcon({ type, size = 16 }: { type: string; size?: number }) {
  const t = type.toLowerCase();
  if (t.includes("wing van")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="1" y1="14" x2="16" y2="14" />
        <path d="M16 10h4l3 3v3h-7V10z" />
        <circle cx="6" cy="18" r="2" />
        <circle cx="20" cy="18" r="2" />
      </svg>
    );
  }
  if (t.includes("tanker")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="8" cy="11" rx="7" ry="5" />
        <path d="M16 10h4l3 3v3h-7V10z" />
        <circle cx="6" cy="18" r="2" />
        <circle cx="20" cy="18" r="2" />
      </svg>
    );
  }
  if (t.includes("container")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="5" width="15" height="11" rx="0" />
        <path d="M16 10h4l3 3v3h-7V10z" />
        <circle cx="6" cy="18" r="2" />
        <circle cx="20" cy="18" r="2" />
        <line x1="5" y1="5" x2="5" y2="16" />
        <line x1="9" y1="5" x2="9" y2="16" />
        <line x1="13" y1="5" x2="13" y2="16" />
      </svg>
    );
  }
  return <Truck size={size} />;
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

/** Extract short region labels from lanes */
function extractRegions(lanes: string[]): string[] {
  const cities = new Set<string>();
  lanes.forEach((lane) => {
    lane.split(" - ").forEach((c) => {
      const trimmed = c.trim().replace(/ \(.*\)/, "");
      if (trimmed) cities.add(trimmed);
    });
  });
  return Array.from(cities).slice(0, 4);
}

const vehicleTypeFilters = ["All Types", "Wing Van", "Closed Van", "Reefer Van", "Flatbed", "Tanker", "Container"] as const;
const regionFilters = ["All Regions", "NCR", "Central Luzon", "CALABARZON", "Central Visayas", "Western Visayas", "Davao Region", "SOCCSKSARGEN", "Ilocos Region"] as const;

const sortOptions = [
  { value: "rating", label: "Highest Rating" },
  { value: "fleet", label: "Largest Fleet" },
  { value: "price_asc", label: "Lowest Rate" },
  { value: "price_desc", label: "Highest Rate" },
  { value: "trips", label: "Most Trips" },
] as const;

export default function CarriersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [vehicleFilter, setVehicleFilter] = useState<string>("All Types");
  const [regionFilter, setRegionFilter] = useState<string>("All Regions");
  const [sortBy, setSortBy] = useState<string>("rating");

  const filteredCarriers = useMemo(() => {
    let result = carriers.filter((c) => {
      const matchesSearch = searchQuery === "" ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.vehicleTypes.some((v) => v.toLowerCase().includes(searchQuery.toLowerCase())) ||
        c.lanes.some((l) => l.toLowerCase().includes(searchQuery.toLowerCase())) ||
        c.specializations.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesVehicle = vehicleFilter === "All Types" ||
        c.vehicleTypes.some((v) => v.toLowerCase().includes(vehicleFilter.toLowerCase()));
      const matchesRegion = regionFilter === "All Regions" || c.location.region === regionFilter;
      return matchesSearch && matchesVehicle && matchesRegion;
    });

    result.sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "fleet") return b.vehicleCount - a.vehicleCount;
      if (sortBy === "price_asc") return a.baseRate - b.baseRate;
      if (sortBy === "price_desc") return b.baseRate - a.baseRate;
      if (sortBy === "trips") return b.completedTrips - a.completedTrips;
      return 0;
    });

    return result;
  }, [searchQuery, vehicleFilter, regionFilter, sortBy]);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <Navbar active="Carriers" />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "20px 24px 64px" }}>
        <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#6B7280", fontSize: 13, textDecoration: "none", marginBottom: 12 }}>
          <ArrowLeft size={14} /> Back to Marketplace
        </a>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#0f172a", margin: "8px 0 6px" }}>Carrier Directory</h1>
        <p style={{ fontSize: 14, color: "#6B7280", margin: "0 0 20px" }}>Find {carriers.length} verified carriers across the Philippines</p>

        {/* Search */}
        <div style={{
          maxWidth: 500, display: "flex", alignItems: "center",
          backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 10, padding: "0 14px", marginBottom: 14,
        }}>
          <Search size={16} color="#9CA3AF" />
          <input type="text" placeholder="Search carriers by name, city, vehicle type, specialization..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ flex: 1, padding: "10px 10px", border: "none", background: "none", outline: "none", fontSize: 13, color: "#0f172a" }} />
        </div>

        {/* Vehicle Type Filter */}
        <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, color: "#6B7280", display: "flex", alignItems: "center", marginRight: 4 }}>Vehicle:</span>
          {vehicleTypeFilters.map((f) => (
            <button key={f} onClick={() => setVehicleFilter(f)} style={{
              padding: "5px 12px", border: "1px solid #e2e8f0", borderRadius: 6, cursor: "pointer",
              fontSize: 12, fontWeight: 500,
              color: vehicleFilter === f ? "#fff" : "#6B7280",
              backgroundColor: vehicleFilter === f ? "#2563EB" : "#fff",
            }}>
              {f}
            </button>
          ))}
        </div>

        {/* Region Filter + Sort */}
        <div style={{ display: "flex", gap: 6, marginBottom: 18, flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: 11, color: "#6B7280", display: "flex", alignItems: "center", marginRight: 4 }}>Region:</span>
            {regionFilters.map((f) => (
              <button key={f} onClick={() => setRegionFilter(f)} style={{
                padding: "5px 12px", border: "1px solid #e2e8f0", borderRadius: 6, cursor: "pointer",
                fontSize: 12, fontWeight: 500,
                color: regionFilter === f ? "#fff" : "#6B7280",
                backgroundColor: regionFilter === f ? "#059669" : "#fff",
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

        <p style={{ fontSize: 12, color: "#6B7280", marginBottom: 14 }}>{filteredCarriers.length} carriers found</p>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
          {filteredCarriers.map((carrier) => {
            const regions = extractRegions(carrier.lanes);
            // Compute fleet availability from actual fleet data
            const availableCount = carrier.fleet.filter((v) => v.status === "available").length;
            const totalFleet = carrier.fleet.length;
            const availabilityPct = totalFleet > 0 ? (availableCount / totalFleet) * 100 : 0;

            // Count per vehicle type
            const typeCountMap = new Map<string, number>();
            carrier.fleet.forEach((v) => {
              typeCountMap.set(v.type, (typeCountMap.get(v.type) || 0) + 1);
            });

            return (
              <a key={carrier.id} href={`/carriers/${carrier.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                <div
                  style={{
                    backgroundColor: "#ffffff", borderRadius: 10, border: "1px solid #e2e8f0",
                    overflow: "hidden", cursor: "pointer", transition: "box-shadow 0.2s, transform 0.2s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
                >
                  {/* Header with verified badge */}
                  <div style={{ height: 120, background: "linear-gradient(135deg, #1e293b, #334155)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                    <Truck size={40} color="#475569" />
                    {carrier.verified && (
                      <span style={{
                        position: "absolute", top: 8, right: 8,
                        display: "inline-flex", alignItems: "center", gap: 4,
                        padding: "4px 10px", borderRadius: 8,
                        fontSize: 11, fontWeight: 700,
                        color: "#ffffff",
                        backgroundColor: "#16A34A",
                        boxShadow: "0 2px 6px rgba(22,163,74,0.4)",
                      }}>
                        <ShieldCheck size={13} /> Verified
                      </span>
                    )}
                  </div>

                  <div style={{ padding: 14 }}>
                    {/* Name */}
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", marginBottom: 3 }}>{carrier.name}</div>

                    {/* Location */}
                    <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#6B7280", marginBottom: 6 }}>
                      <MapPin size={11} /> {carrier.location.city} &middot; {carrier.location.region}
                    </div>

                    {/* Vehicle fleet icons row with counts */}
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6, color: "#64748b", flexWrap: "wrap" }}>
                      {carrier.vehicleTypes.map((vt) => {
                        const count = typeCountMap.get(vt) || 0;
                        return (
                          <div key={vt} title={vt} style={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <VehicleTypeIcon type={vt} size={16} />
                            {count > 0 && (
                              <span style={{ fontSize: 10, fontWeight: 700, color: "#6B7280" }}>{count}x</span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Fleet availability bar */}
                    <div style={{ marginBottom: 6 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                        <span style={{ fontSize: 11, fontWeight: 600, color: "#059669" }}>
                          {availableCount} available
                        </span>
                        <span style={{ fontSize: 10, color: "#9CA3AF" }}>/ {totalFleet} total</span>
                      </div>
                      <div style={{ height: 5, backgroundColor: "#f1f5f9", borderRadius: 3, overflow: "hidden" }}>
                        <div style={{
                          width: `${availabilityPct}%`,
                          height: "100%",
                          backgroundColor: availabilityPct > 60 ? "#059669" : availabilityPct > 30 ? "#D97706" : "#DC2626",
                          borderRadius: 3,
                          transition: "width 0.3s",
                        }} />
                      </div>
                    </div>

                    {/* Service area */}
                    <div style={{ display: "flex", gap: 3, flexWrap: "wrap", marginBottom: 6 }}>
                      {regions.map((r) => (
                        <span key={r} style={{ fontSize: 9, fontWeight: 600, color: "#475569", background: "#f1f5f9", padding: "2px 5px", borderRadius: 3 }}>{r}</span>
                      ))}
                    </div>

                    {/* Specializations */}
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8 }}>
                      {carrier.specializations.slice(0, 2).map((sp) => (
                        <span key={sp} style={{ fontSize: 10, fontWeight: 600, color: "#64748b", background: "#f1f5f9", padding: "2px 6px", borderRadius: 4 }}>{sp}</span>
                      ))}
                    </div>

                    {/* Rating stars + base rate */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <StarRating rating={carrier.rating} size={12} />
                        <span style={{ fontSize: 10, color: "#9CA3AF" }}>({carrier.completedTrips})</span>
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#059669" }}>{"\u20B1"}{carrier.baseRate}/km</span>
                    </div>

                    {/* Contact button */}
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                      style={{
                        width: "100%", padding: "8px 0",
                        border: "1px solid #2563EB", borderRadius: 8,
                        backgroundColor: "#EFF6FF", color: "#2563EB",
                        fontSize: 12, fontWeight: 600, cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                        transition: "background-color 0.15s",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#DBEAFE"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#EFF6FF"; }}
                    >
                      <Phone size={12} /> Contact Carrier
                    </button>
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
