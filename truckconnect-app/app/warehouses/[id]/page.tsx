"use client";

import { use, useState } from "react";
import {
  Warehouse as WarehouseIcon, Star, MapPin, ArrowLeft,
  Snowflake, Shield, MessageSquare, Thermometer, DoorOpen,
  Clock, CheckCircle, Award, Phone, Mail, User, Navigation,
  Anchor, Car, Package, Ruler, ChevronRight, Quote,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import MapView from "@/components/MapView";
import { warehouses, companies } from "@/lib/mock-data";

const warehouseTypeLabels: Record<string, { label: string; color: string; bg: string }> = {
  dry: { label: "Dry Storage", color: "#D97706", bg: "#FFFBEB" },
  cold: { label: "Cold Storage", color: "#2563EB", bg: "#EFF6FF" },
  bonded: { label: "Bonded Warehouse", color: "#7C3AED", bg: "#F5F3FF" },
  cross_dock: { label: "Cross-Dock", color: "#059669", bg: "#ECFDF5" },
  pharmaceutical: { label: "Pharmaceutical", color: "#9D174D", bg: "#FDF2F8" },
};

const certBadgeColors: Record<string, { bg: string; color: string; icon: string }> = {
  "PEZA": { bg: "#EFF6FF", color: "#2563EB", icon: "shield" },
  "FDA-LTO": { bg: "#FDF2F8", color: "#9D174D", icon: "pill" },
  "HACCP": { bg: "#F0FDF4", color: "#16A34A", icon: "check" },
  "BOC Bonded": { bg: "#FFFBEB", color: "#D97706", icon: "lock" },
  "ISO 9001": { bg: "#F5F3FF", color: "#7C3AED", icon: "award" },
  "EU Export Certified": { bg: "#ECFDF5", color: "#059669", icon: "globe" },
  "SBMA License": { bg: "#FEF3C7", color: "#92400E", icon: "file" },
  "ISO 22000": { bg: "#F0FDF4", color: "#16A34A", icon: "award" },
  "GMP": { bg: "#FDF2F8", color: "#9D174D", icon: "check" },
  "BFAD": { bg: "#FDF2F8", color: "#9D174D", icon: "pill" },
};

function getCertStyle(cert: string): { bg: string; color: string; icon: string } {
  for (const key of Object.keys(certBadgeColors)) {
    if (cert.includes(key) || key.includes(cert)) return certBadgeColors[key];
  }
  return { bg: "#F3F4F6", color: "#6B7280", icon: "check" };
}

const zoneColors: Record<string, { bg: string; border: string; label: string }> = {
  "Dry": { bg: "#FEF3C7", border: "#F59E0B", label: "Dry Storage" },
  "Cold": { bg: "#DBEAFE", border: "#3B82F6", label: "Cold Storage" },
  "Bonded": { bg: "#EDE9FE", border: "#8B5CF6", label: "Bonded" },
  "Pharma": { bg: "#FCE7F3", border: "#EC4899", label: "Pharmaceutical" },
  "Cross": { bg: "#D1FAE5", border: "#10B981", label: "Cross-Dock" },
  "Frozen": { bg: "#CFFAFE", border: "#06B6D4", label: "Frozen" },
  "Ambient": { bg: "#F3F4F6", border: "#9CA3AF", label: "General" },
};

function getZoneColor(zoneName: string) {
  for (const key of Object.keys(zoneColors)) {
    if (zoneName.toLowerCase().includes(key.toLowerCase())) return zoneColors[key];
  }
  return zoneColors["Ambient"];
}

function formatRate(rate: number): string {
  return new Intl.NumberFormat("en-PH").format(rate);
}

// Mock reviews
const mockReviews = [
  {
    name: "Ricardo Santos",
    company: "Santos Logistics Inc.",
    rating: 5,
    date: "2026-02-15",
    comment: "Excellent warehouse facility with top-notch cold storage. Our frozen goods were maintained at perfect temperatures throughout the 3-month contract. The staff is professional and the loading docks are efficient.",
    avatar: "RS",
  },
  {
    name: "Maria Reyes",
    company: "Visayas FMCG Distribution",
    rating: 4,
    date: "2026-01-28",
    comment: "Great location and well-maintained facility. The inventory management system integration was smooth. Minor delays during peak season but overall very satisfied with the service quality.",
    avatar: "MR",
  },
  {
    name: "Chen Wei",
    company: "Asia Pacific Trading Co.",
    rating: 5,
    date: "2025-12-10",
    comment: "The bonded warehouse section is perfectly managed. Customs documentation support was invaluable for our import operations. Security is excellent with 24/7 CCTV and strict access control. Highly recommend.",
    avatar: "CW",
  },
];

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

export default function WarehouseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const wh = warehouses.find((w) => w.id === id);
  const [activeTab, setActiveTab] = useState<"overview" | "zones" | "reviews">("overview");

  if (!wh) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
        <Navbar active="Warehouses" />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "calc(100vh - 56px)" }}>
          <div style={{ textAlign: "center" }}>
            <WarehouseIcon size={48} color="#9CA3AF" />
            <h1 style={{ fontSize: 24, fontWeight: 700, color: "#111827", marginTop: 16 }}>Warehouse not found</h1>
            <p style={{ color: "#6B7280", marginBottom: 24 }}>The warehouse &quot;{id}&quot; does not exist.</p>
            <a href="/warehouses" style={{ color: "#2563EB", textDecoration: "none", fontWeight: 500 }}>Back to Warehouse Directory</a>
          </div>
        </div>
      </div>
    );
  }

  const linkedCompany = companies.find((c) => c.warehouseIds?.includes(wh.id));
  const utilization = Math.round(((wh.totalArea - wh.availableArea) / wh.totalArea) * 100);
  const totalShelves = wh.zones.reduce((sum, z) => sum + z.shelves, 0);
  const totalZoneArea = wh.zones.reduce((sum, z) => sum + z.area, 0);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <Navbar active="Warehouses" />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 24px 64px" }}>
        <a href="/warehouses" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#6B7280", fontSize: 13, textDecoration: "none", marginBottom: 16 }}>
          <ArrowLeft size={14} /> Back to Warehouse Directory
        </a>

        {/* ── Header Card ── */}
        <div style={{
          backgroundColor: "#ffffff", borderRadius: 14, border: "1px solid #e2e8f0",
          padding: 28, marginBottom: 20, position: "relative", overflow: "hidden",
        }}>
          {/* Decorative gradient strip */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg, #2563eb, #7c3aed, #ec4899)" }} />

          <div style={{ display: "flex", alignItems: "flex-start", gap: 20 }}>
            <div style={{
              width: 72, height: 72, borderRadius: 16,
              background: "linear-gradient(135deg, #1e293b, #334155)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <WarehouseIcon size={36} color="#94a3b8" />
            </div>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", margin: "0 0 6px" }}>{wh.name}</h1>
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#6B7280", fontSize: 13, marginBottom: 10 }}>
                <MapPin size={14} /> {wh.location.city}, {wh.location.province}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <StarRating rating={wh.rating} size={18} />

                <span style={{ fontSize: 12, color: "#9CA3AF" }}>({mockReviews.length} reviews)</span>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                {wh.types.map((type) => {
                  const t = warehouseTypeLabels[type];
                  if (!t) return null;
                  return (
                    <span key={type} style={{
                      padding: "5px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                      color: t.color, backgroundColor: t.bg,
                      display: "flex", alignItems: "center", gap: 4,
                      border: `1px solid ${t.color}22`,
                    }}>
                      {type === "cold" && <Snowflake size={12} />}
                      {type === "bonded" && <Shield size={12} />}
                      {type === "pharmaceutical" && <Package size={12} />}
                      {t.label}
                    </span>
                  );
                })}
              </div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 2 }}>Storage Rate</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#2563eb" }}>{"\u20B1"}{formatRate(wh.rate)}<span style={{ fontSize: 14, fontWeight: 500, color: "#94a3b8" }}>/sqm</span></div>
              <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>per month</div>
              {linkedCompany && (
                <a href={`/company/${linkedCompany.slug}`} style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                  color: "#2563EB", backgroundColor: "#EFF6FF", border: "1px solid #BFDBFE",
                  textDecoration: "none", marginTop: 10,
                }}>
                  <Package size={13} /> View Company Profile
                </a>
              )}
            </div>
          </div>
        </div>

        {/* ── Key Stats ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 20 }}>
          {[
            { label: "Total Area", value: `${formatRate(wh.totalArea)} sqm`, icon: WarehouseIcon, color: "#7C3AED", bg: "#F5F3FF" },
            { label: "Available", value: `${formatRate(wh.availableArea)} sqm`, icon: Ruler, color: "#059669", bg: "#ECFDF5" },
            { label: "Rate/sqm", value: `\u20B1${formatRate(wh.rate)}`, icon: Package, color: "#2563EB", bg: "#EFF6FF" },
            { label: "Loading Docks", value: wh.loadingDocks.toString(), icon: DoorOpen, color: "#D97706", bg: "#FFFBEB" },
            { label: "Operating Hours", value: wh.operatingHours, icon: Clock, color: "#9D174D", bg: "#FDF2F8" },
          ].map((stat) => (
            <div key={stat.label} style={{
              backgroundColor: "#ffffff", borderRadius: 10, border: "1px solid #e2e8f0",
              padding: "14px 16px", display: "flex", alignItems: "center", gap: 10,
            }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: stat.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <stat.icon size={18} color={stat.color} />
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>{stat.value}</div>
                <div style={{ fontSize: 11, color: "#6B7280" }}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Capacity Visualization ── */}
        <div style={{ backgroundColor: "#ffffff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 24, marginBottom: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", margin: "0 0 16px" }}>Capacity Utilization</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: "#6B7280" }}>Space Used: {formatRate(wh.totalArea - wh.availableArea)} sqm</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: utilization > 80 ? "#EF4444" : utilization > 50 ? "#F59E0B" : "#059669" }}>{utilization}%</span>
              </div>
              <div style={{ height: 14, backgroundColor: "#f1f5f9", borderRadius: 9999, overflow: "hidden", position: "relative" }}>
                <div style={{
                  height: "100%", width: `${utilization}%`,
                  background: utilization > 80
                    ? "linear-gradient(90deg, #EF4444, #DC2626)"
                    : utilization > 50
                    ? "linear-gradient(90deg, #F59E0B, #D97706)"
                    : "linear-gradient(90deg, #10B981, #059669)",
                  borderRadius: 9999, transition: "width 0.5s ease",
                }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                <span style={{ fontSize: 11, color: "#9CA3AF" }}>0%</span>
                <span style={{ fontSize: 11, color: "#9CA3AF" }}>50%</span>
                <span style={{ fontSize: 11, color: "#9CA3AF" }}>100%</span>
              </div>
            </div>
            <div style={{
              width: 80, height: 80, borderRadius: "50%",
              background: `conic-gradient(${utilization > 80 ? "#EF4444" : utilization > 50 ? "#F59E0B" : "#059669"} ${utilization * 3.6}deg, #f1f5f9 0deg)`,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <div style={{ width: 60, height: 60, borderRadius: "50%", backgroundColor: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 16, fontWeight: 800, color: "#0f172a" }}>{utilization}%</span>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 24, padding: "12px 16px", background: "#f8fafc", borderRadius: 10 }}>
            <div>
              <div style={{ fontSize: 11, color: "#9CA3AF" }}>Total Shelves</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>{formatRate(totalShelves)}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#9CA3AF" }}>Zones</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>{wh.zones.length}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#9CA3AF" }}>Available Space</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#059669" }}>{formatRate(wh.availableArea)} sqm</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#9CA3AF" }}>Est. Monthly Cost (avail.)</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#2563eb" }}>{"\u20B1"}{formatRate(wh.rate * wh.availableArea)}</div>
            </div>
          </div>
        </div>

        {/* ── 3D Zone Visualization (top-down map) ── */}
        <div style={{ backgroundColor: "#ffffff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 24, marginBottom: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", margin: "0 0 6px" }}>Zone Layout Map</h3>
          <p style={{ fontSize: 12, color: "#94a3b8", margin: "0 0 16px" }}>Top-down view showing relative zone sizes and types</p>

          <div style={{
            background: "#0f172a", borderRadius: 12, padding: 24, position: "relative",
            minHeight: 220, display: "flex", flexDirection: "column", gap: 8,
          }}>
            {/* Grid lines */}
            <div style={{ position: "absolute", inset: 24, pointerEvents: "none", opacity: 0.08 }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={`h-${i}`} style={{ position: "absolute", left: 0, right: 0, top: `${i * 20}%`, height: 1, backgroundColor: "#ffffff" }} />
              ))}
              {Array.from({ length: 11 }).map((_, i) => (
                <div key={`v-${i}`} style={{ position: "absolute", top: 0, bottom: 0, left: `${i * 10}%`, width: 1, backgroundColor: "#ffffff" }} />
              ))}
            </div>

            {/* Zone rectangles */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", position: "relative", zIndex: 1 }}>
              {wh.zones.map((zone) => {
                const widthPct = Math.max((zone.area / totalZoneArea) * 100, 15);
                const zc = getZoneColor(zone.name);
                const isTemp = zone.temp !== "Ambient";
                return (
                  <div
                    key={zone.name}
                    style={{
                      flex: `0 0 calc(${widthPct}% - 8px)`,
                      minWidth: 120,
                      minHeight: 140,
                      backgroundColor: `${zc.bg}dd`,
                      border: `2px solid ${zc.border}`,
                      borderRadius: 10,
                      padding: "14px 16px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {/* Zone pattern overlay */}
                    <div style={{
                      position: "absolute", inset: 0, opacity: 0.05,
                      backgroundImage: `repeating-linear-gradient(45deg, ${zc.border} 0, ${zc.border} 1px, transparent 0, transparent 10px)`,
                    }} />
                    <div style={{ position: "relative", zIndex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>{zone.name}</div>
                      {isTemp && (
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 3, padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600, color: "#2563EB", background: "#EFF6FFcc" }}>
                          <Thermometer size={10} /> {zone.temp}
                        </div>
                      )}
                    </div>
                    <div style={{ position: "relative", zIndex: 1 }}>
                      <div style={{ fontSize: 18, fontWeight: 800, color: "#0f172a" }}>{formatRate(zone.area)} <span style={{ fontSize: 11, fontWeight: 500, color: "#6B7280" }}>sqm</span></div>
                      <div style={{ fontSize: 11, color: "#6B7280" }}>{zone.shelves} shelves</div>
                      {/* Mini utilization bar */}
                      <div style={{ height: 4, backgroundColor: "#0f172a15", borderRadius: 9999, marginTop: 6, overflow: "hidden" }}>
                        <div style={{
                          height: "100%", width: `${Math.min(Math.round((zone.area / wh.totalArea) * 100 * 1.5), 100)}%`,
                          backgroundColor: zc.border, borderRadius: 9999,
                        }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div style={{ display: "flex", gap: 16, marginTop: 12, justifyContent: "center" }}>
              {Object.entries(zoneColors).filter(([key]) => {
                return wh.zones.some(z => z.name.toLowerCase().includes(key.toLowerCase()));
              }).map(([key, val]) => (
                <div key={key} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#94a3b8" }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: val.border }} />
                  {val.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Zone Breakdown Cards ── */}
        <div style={{ backgroundColor: "#ffffff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 24, marginBottom: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", margin: "0 0 16px" }}>Zone Details</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
            {wh.zones.map((zone) => {
              const isTemp = zone.temp !== "Ambient";
              const zoneUtil = Math.round((zone.area / wh.totalArea) * 100);
              const zc = getZoneColor(zone.name);
              return (
                <div key={zone.name} style={{
                  padding: "16px 20px", background: "#f8fafc", borderRadius: 12,
                  border: `1px solid #f1f5f9`, position: "relative", overflow: "hidden",
                }}>
                  <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: 4, backgroundColor: zc.border }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", margin: 0 }}>{zone.name}</h4>
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 3,
                      padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600,
                      color: isTemp ? "#2563EB" : "#6B7280",
                      background: isTemp ? "#EFF6FF" : "#f1f5f9",
                    }}>
                      <Thermometer size={11} /> {zone.temp}
                    </span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
                    <div>
                      <div style={{ fontSize: 10, color: "#9CA3AF", marginBottom: 2 }}>Area</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>{formatRate(zone.area)} sqm</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: "#9CA3AF", marginBottom: 2 }}>Shelves</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>{zone.shelves}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: "#9CA3AF", marginBottom: 2 }}>% of Total</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>{zoneUtil}%</div>
                    </div>
                  </div>
                  {/* Utilization bar */}
                  <div style={{ height: 6, backgroundColor: "#e2e8f0", borderRadius: 9999, overflow: "hidden" }}>
                    <div style={{
                      height: "100%", width: `${zoneUtil}%`,
                      backgroundColor: zc.border, borderRadius: 9999, transition: "width 0.3s",
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Features & Certifications ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
          {/* Features */}
          <div style={{ backgroundColor: "#ffffff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", margin: "0 0 16px", display: "flex", alignItems: "center", gap: 6 }}>
              <Package size={15} color="#2563eb" /> Warehouse Features
            </h3>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {wh.features.map((feature) => (
                <span key={feature} style={{
                  display: "inline-flex", alignItems: "center", gap: 4,
                  padding: "6px 14px", borderRadius: 9999, fontSize: 12, fontWeight: 500,
                  color: "#374151", background: "#f1f5f9", border: "1px solid #e2e8f0",
                }}>
                  <CheckCircle size={12} color="#059669" />
                  {feature}
                </span>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div style={{ backgroundColor: "#ffffff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", margin: "0 0 16px", display: "flex", alignItems: "center", gap: 6 }}>
              <Award size={15} color="#7C3AED" /> Certifications
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {wh.certifications.map((cert) => {
                const cs = getCertStyle(cert);
                return (
                  <div key={cert} style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 16px", borderRadius: 10, backgroundColor: cs.bg,
                    border: `1px solid ${cs.color}20`,
                  }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8, backgroundColor: `${cs.color}15`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Award size={16} color={cs.color} />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: cs.color }}>{cert}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Security & Location ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
          {/* Security */}
          <div style={{ backgroundColor: "#ffffff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", margin: "0 0 16px", display: "flex", alignItems: "center", gap: 6 }}>
              <Shield size={15} color="#7C3AED" /> Security Features
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {wh.security.map((sec) => (
                <div key={sec} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "#f8fafc", borderRadius: 8 }}>
                  <div style={{ width: 24, height: 24, borderRadius: 6, backgroundColor: "#ECFDF5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <CheckCircle size={14} color="#059669" />
                  </div>
                  <span style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>{sec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Location Info */}
          <div style={{ backgroundColor: "#ffffff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", margin: "0 0 16px", display: "flex", alignItems: "center", gap: 6 }}>
              <Navigation size={15} color="#2563eb" /> Location Information
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "#f8fafc", borderRadius: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <MapPin size={16} color="#2563eb" />
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "#9CA3AF" }}>Address</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{wh.location.city}, {wh.location.province}</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "#f8fafc", borderRadius: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Anchor size={16} color="#2563eb" />
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "#9CA3AF" }}>Nearest Port</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{wh.nearestPort}</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "#f8fafc", borderRadius: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Car size={16} color="#2563eb" />
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "#9CA3AF" }}>Nearest Highway</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{wh.nearestHighway}</div>
                </div>
              </div>
            </div>

            {/* Mini Map */}
            <div style={{ marginTop: 12, borderRadius: 10, overflow: "hidden", border: "1px solid #e2e8f0" }}>
              <MapView
                markers={[{
                  lat: wh.location.lat, lng: wh.location.lng,
                  label: wh.name, color: "#7c3aed",
                  info: `${wh.name} - ${wh.location.city}`,
                }]}
                center={{ lat: wh.location.lat, lng: wh.location.lng }}
                zoom={14}
                height={180}
              />
            </div>
          </div>
        </div>

        {/* ── Contact Section ── */}
        <div style={{ backgroundColor: "#ffffff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 24, marginBottom: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", margin: "0 0 16px" }}>Contact Information</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", background: "#f8fafc", borderRadius: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: "#F5F3FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <User size={18} color="#7C3AED" />
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#9CA3AF" }}>Contact Person</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>{wh.contactPerson}</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", background: "#f8fafc", borderRadius: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Phone size={18} color="#2563EB" />
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#9CA3AF" }}>Phone</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>{wh.phone}</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", background: "#f8fafc", borderRadius: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: "#ECFDF5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Mail size={18} color="#059669" />
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#9CA3AF" }}>Email</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>info@{wh.orgSlug}.ph</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Reviews ── */}
        <div style={{ backgroundColor: "#ffffff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 24, marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", margin: 0 }}>Shipper Reviews</h3>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <StarRating rating={wh.rating} size={14} />

              <span style={{ fontSize: 12, color: "#9CA3AF" }}>({mockReviews.length} reviews)</span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {mockReviews.map((review, idx) => (
              <div key={idx} style={{
                padding: "18px 20px", background: "#f8fafc", borderRadius: 12,
                border: "1px solid #f1f5f9", position: "relative",
              }}>
                <Quote size={20} color="#e2e8f0" style={{ position: "absolute", top: 14, right: 18 }} />
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: "linear-gradient(135deg, #1e293b, #334155)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 14, fontWeight: 700, color: "#94a3b8",
                  }}>
                    {review.avatar}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>{review.name}</div>
                    <div style={{ fontSize: 12, color: "#6B7280" }}>{review.company}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <StarRating rating={review.rating} size={12} showValue={false} />
                    <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>{review.date}</div>
                  </div>
                </div>
                <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.6, margin: 0 }}>{review.comment}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Action Buttons ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <button
            onClick={() => alert("Request Quote feature coming soon! Sign in to submit a quote request.")}
            style={{
              width: "100%", padding: "16px 24px", border: "2px solid #2563eb", borderRadius: 12,
              fontSize: 15, fontWeight: 700, color: "#2563eb", backgroundColor: "#ffffff",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#EFF6FF"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#ffffff"; }}
          >
            <MessageSquare size={18} /> Request Quote
          </button>
          <button
            onClick={() => alert("Book Space feature coming soon! Sign in to reserve warehouse space.")}
            style={{
              width: "100%", padding: "16px 24px", border: "none", borderRadius: 12,
              fontSize: 15, fontWeight: 700, color: "#ffffff",
              background: "linear-gradient(135deg, #2563eb, #7c3aed)",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.9"; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
          >
            <WarehouseIcon size={18} /> Book Space <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
