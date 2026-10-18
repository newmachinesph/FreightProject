"use client";

import { useState, useMemo } from "react";
import {
  Search, Warehouse as WarehouseIcon, Star, MapPin, ArrowLeft,
  Snowflake, Shield, Award, Thermometer,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { warehouses } from "@/lib/mock-data";

const warehouseTypeLabels: Record<string, { label: string; bg: string; color: string; border: string }> = {
  dry: { label: "Dry", bg: "#FFFBEB", color: "#D97706", border: "#FDE68A" },
  cold: { label: "Cold", bg: "#EFF6FF", color: "#2563EB", border: "#BFDBFE" },
  bonded: { label: "Bonded", bg: "#F0FDF4", color: "#16A34A", border: "#BBF7D0" },
  cross_dock: { label: "Cross-Dock", bg: "#ECFDF5", color: "#059669", border: "#A7F3D0" },
  pharmaceutical: { label: "Pharma", bg: "#FDF2F8", color: "#9D174D", border: "#FBCFE8" },
};

const certBadgeColors: Record<string, { bg: string; color: string }> = {
  "PEZA": { bg: "#EFF6FF", color: "#2563EB" },
  "FDA-LTO": { bg: "#FDF2F8", color: "#9D174D" },
  "HACCP": { bg: "#F0FDF4", color: "#16A34A" },
  "BOC Bonded": { bg: "#FFFBEB", color: "#D97706" },
  "ISO 9001": { bg: "#F5F3FF", color: "#7C3AED" },
  "EU Export Certified": { bg: "#ECFDF5", color: "#059669" },
  "SBMA License": { bg: "#FEF3C7", color: "#92400E" },
};

function getCertStyle(cert: string): { bg: string; color: string } {
  // Match partial cert names
  for (const key of Object.keys(certBadgeColors)) {
    if (cert.includes(key) || key.includes(cert)) return certBadgeColors[key];
  }
  return { bg: "#F3F4F6", color: "#6B7280" };
}

function formatRate(rate: number): string {
  return new Intl.NumberFormat("en-PH").format(rate);
}

/** Extract the coldest temperature from zones for display */
function getColdZoneTemps(zones: { name: string; temp: string }[]): string[] {
  return zones
    .filter((z) => z.temp !== "Ambient")
    .map((z) => `${z.name.replace(/^Zone \w+ - /, "")}: ${z.temp}`);
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

const typeFilters = ["All Types", "Cold", "Dry", "Bonded", "Cross-Dock", "Pharma"] as const;
const typeFilterMap: Record<string, string> = {
  "Cold": "cold", "Dry": "dry", "Bonded": "bonded", "Cross-Dock": "cross_dock", "Pharma": "pharmaceutical",
};
const regionFilters = ["All Regions", "Metro Manila", "Pampanga", "Cebu", "Davao del Sur", "Zambales", "Batangas", "South Cotabato", "Laguna"] as const;

const sortOptions = [
  { value: "rating", label: "Highest Rating" },
  { value: "rate_asc", label: "Lowest Rate" },
  { value: "rate_desc", label: "Highest Rate" },
  { value: "area_desc", label: "Most Available" },
  { value: "area_asc", label: "Least Available" },
] as const;

export default function WarehousesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("All Types");
  const [regionFilter, setRegionFilter] = useState<string>("All Regions");
  const [sortBy, setSortBy] = useState<string>("rating");

  const filteredWarehouses = useMemo(() => {
    let result = warehouses.filter((wh) => {
      const matchesSearch = searchQuery === "" ||
        wh.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wh.location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wh.location.province.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wh.types.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesType = typeFilter === "All Types" ||
        wh.types.includes(typeFilterMap[typeFilter] as any);
      const matchesRegion = regionFilter === "All Regions" || wh.location.province === regionFilter;
      return matchesSearch && matchesType && matchesRegion;
    });

    result.sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "rate_asc") return a.rate - b.rate;
      if (sortBy === "rate_desc") return b.rate - a.rate;
      if (sortBy === "area_desc") return b.availableArea - a.availableArea;
      if (sortBy === "area_asc") return a.availableArea - b.availableArea;
      return 0;
    });

    return result;
  }, [searchQuery, typeFilter, regionFilter, sortBy]);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <Navbar active="Warehouses" />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "20px 24px 64px" }}>
        <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#6B7280", fontSize: 13, textDecoration: "none", marginBottom: 12 }}>
          <ArrowLeft size={14} /> Back to Marketplace
        </a>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#0f172a", margin: "8px 0 6px" }}>Warehouse Directory</h1>
        <p style={{ fontSize: 14, color: "#6B7280", margin: "0 0 20px" }}>Find {warehouses.length} warehouses and storage facilities across the Philippines</p>

        {/* Search */}
        <div style={{
          maxWidth: 500, display: "flex", alignItems: "center",
          backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 10, padding: "0 14px", marginBottom: 14,
        }}>
          <Search size={16} color="#9CA3AF" />
          <input type="text" placeholder="Search warehouses by name, city, type..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ flex: 1, padding: "10px 10px", border: "none", background: "none", outline: "none", fontSize: 13, color: "#0f172a" }} />
        </div>

        {/* Type Filter */}
        <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, color: "#6B7280", display: "flex", alignItems: "center", marginRight: 4 }}>Type:</span>
          {typeFilters.map((f) => (
            <button key={f} onClick={() => setTypeFilter(f)} style={{
              padding: "5px 12px", border: "1px solid #e2e8f0", borderRadius: 6, cursor: "pointer",
              fontSize: 12, fontWeight: 500,
              color: typeFilter === f ? "#fff" : "#6B7280",
              backgroundColor: typeFilter === f ? "#7C3AED" : "#fff",
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

        <p style={{ fontSize: 12, color: "#6B7280", marginBottom: 14 }}>{filteredWarehouses.length} warehouses found</p>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {filteredWarehouses.map((wh) => {
            const usedPercent = Math.round(((wh.totalArea - wh.availableArea) / wh.totalArea) * 100);
            const coldTemps = getColdZoneTemps(wh.zones);
            const hasCold = wh.types.includes("cold");

            return (
              <a key={wh.id} href={`/warehouses/${wh.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                <div
                  style={{
                    backgroundColor: "#ffffff", borderRadius: 10, border: "1px solid #e2e8f0",
                    overflow: "hidden", cursor: "pointer", transition: "box-shadow 0.2s, transform 0.2s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
                >
                  {/* Header */}
                  <div style={{ height: 120, background: "linear-gradient(135deg, #1e293b, #334155)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                    <WarehouseIcon size={40} color="#475569" />
                    {/* Temperature indicator for cold storage */}
                    {hasCold && coldTemps.length > 0 && (
                      <div style={{ position: "absolute", bottom: 8, left: 8, display: "flex", flexDirection: "column", gap: 2 }}>
                        {coldTemps.slice(0, 2).map((t, i) => (
                          <span key={i} style={{
                            display: "flex", alignItems: "center", gap: 3,
                            padding: "2px 7px", borderRadius: 5,
                            fontSize: 9, fontWeight: 600,
                            backgroundColor: "rgba(14,165,233,0.2)", color: "#7DD3FC",
                          }}>
                            <Thermometer size={9} /> {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div style={{ padding: 14 }}>
                    {/* Name */}
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", marginBottom: 3 }}>{wh.name}</div>

                    {/* Location */}
                    <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#6B7280", marginBottom: 8 }}>
                      <MapPin size={11} /> {wh.location.city}, {wh.location.province}
                    </div>

                    {/* Type badges - color coded */}
                    <div style={{ display: "flex", gap: 5, marginBottom: 8, flexWrap: "wrap" }}>
                      {wh.types.map((type) => {
                        const t = warehouseTypeLabels[type];
                        if (!t) return null;
                        return (
                          <span key={type} style={{
                            padding: "3px 8px", borderRadius: 6,
                            fontSize: 10, fontWeight: 600,
                            color: t.color, backgroundColor: t.bg,
                            border: `1px solid ${t.border}`,
                            display: "flex", alignItems: "center", gap: 3,
                          }}>
                            {type === "cold" && <Snowflake size={10} />}
                            {type === "bonded" && <Shield size={10} />}
                            {t.label}
                          </span>
                        );
                      })}
                    </div>

                    {/* Certification badges */}
                    {wh.certifications.length > 0 && (
                      <div style={{ display: "flex", gap: 4, marginBottom: 8, flexWrap: "wrap" }}>
                        {wh.certifications.map((cert) => {
                          const cs = getCertStyle(cert);
                          return (
                            <span key={cert} style={{
                              display: "flex", alignItems: "center", gap: 2,
                              padding: "2px 6px", borderRadius: 4,
                              fontSize: 9, fontWeight: 700,
                              color: cs.color, backgroundColor: cs.bg,
                            }}>
                              <Award size={8} /> {cert}
                            </span>
                          );
                        })}
                      </div>
                    )}

                    {/* Capacity progress bar */}
                    <div style={{ marginBottom: 8 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#6B7280", marginBottom: 3 }}>
                        <span>{formatRate(wh.availableArea)} sqm available</span>
                        <span>{usedPercent}% occupied</span>
                      </div>
                      <div style={{ width: "100%", height: 6, backgroundColor: "#F1F5F9", borderRadius: 3, overflow: "hidden" }}>
                        <div style={{
                          width: `${usedPercent}%`, height: "100%", borderRadius: 3,
                          backgroundColor: usedPercent > 80 ? "#EF4444" : usedPercent > 60 ? "#F59E0B" : "#22C55E",
                          transition: "width 0.3s",
                        }} />
                      </div>
                    </div>

                    {/* Docks + zones + hours */}
                    <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 8 }}>
                      {wh.loadingDocks} docks &middot; {wh.zones.length} zones &middot; {wh.operatingHours}
                    </div>

                    {/* Rate + total area */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: 11, color: "#6B7280" }}>Rate</div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: "#059669" }}>{"\u20B1"}{formatRate(wh.rate)}<span style={{ fontSize: 11, fontWeight: 500, color: "#6B7280" }}>/sqm/mo</span></div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 11, color: "#6B7280" }}>Total Area</div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>{formatRate(wh.totalArea)} sqm</div>
                      </div>
                    </div>

                    {/* Rating footer */}
                    <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <StarRating rating={wh.rating} size={12} />
                      </div>
                      <span style={{ fontSize: 11, color: "#9CA3AF" }}>{formatRate(wh.totalArea)} sqm total</span>
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
