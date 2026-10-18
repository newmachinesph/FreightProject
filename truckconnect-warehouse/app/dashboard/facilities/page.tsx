"use client";
import { useState } from "react";
import {
  Building2, MapPin, Thermometer, ArrowLeftRight, ChevronRight,
  Package, Layers, BarChart3, Map, Truck, Box, Snowflake, Shield,
} from "lucide-react";
import { storageZones } from "@/lib/mock-data";

const PURPLE = "#7C3AED";
const PURPLE_LIGHT = "#F5F3FF";
const PURPLE_BORDER = "#DDD6FE";

// Mock facility data for multi-facility view
const facilities = [
  {
    id: "fac-001",
    name: "Clark Freeport Cold Storage Hub",
    shortName: "Clark Hub",
    address: "Bldg 2114, Manuel Roxas Highway, Clark Freeport Zone, Pampanga",
    region: "Central Luzon",
    type: "Cold Storage + Dry",
    totalArea: 5000,
    usedArea: 2900,
    totalPallets: 2000,
    usedPallets: 1160,
    loadingDocks: 8,
    lat: 15.1854,
    lng: 120.5466,
    zones: [
      { name: "Dry Storage A", type: "Dry", area: 1200, usedArea: 900, color: "#D97706", temp: "Ambient" },
      { name: "Dry Storage B", type: "Dry", area: 800, usedArea: 600, color: "#F59E0B", temp: "Ambient" },
      { name: "Cold Storage", type: "Cold", area: 1500, usedArea: 1200, color: "#2563EB", temp: "-18 to 4\u00B0C" },
      { name: "Hazmat / Chemical", type: "Hazmat", area: 300, usedArea: 180, color: "#DC2626", temp: "Ambient" },
      { name: "Staging Area", type: "Staging", area: 700, usedArea: 350, color: PURPLE, temp: "Ambient" },
    ],
    status: "Active",
    manager: "Maria Santos",
    skuCount: 50,
    inboundToday: 3,
    outboundToday: 5,
  },
  {
    id: "fac-002",
    name: "Cebu Port Bonded Warehouse",
    shortName: "Cebu Port",
    address: "Pier 5, North Reclamation Area, Cebu City, Cebu",
    region: "Central Visayas",
    type: "Bonded",
    totalArea: 3500,
    usedArea: 2800,
    totalPallets: 1400,
    usedPallets: 1120,
    loadingDocks: 6,
    lat: 10.3157,
    lng: 123.8854,
    zones: [
      { name: "Bonded Zone A", type: "Dry", area: 1500, usedArea: 1350, color: "#D97706", temp: "Ambient" },
      { name: "Bonded Zone B", type: "Dry", area: 1000, usedArea: 750, color: "#F59E0B", temp: "Ambient" },
      { name: "Cold Room", type: "Cold", area: 600, usedArea: 480, color: "#2563EB", temp: "-20 to 0\u00B0C" },
      { name: "Staging/Cross-Dock", type: "Staging", area: 400, usedArea: 220, color: PURPLE, temp: "Ambient" },
    ],
    status: "Active",
    manager: "Jose Reyes",
    skuCount: 34,
    inboundToday: 2,
    outboundToday: 4,
  },
  {
    id: "fac-003",
    name: "Davao Agri Cold Chain Center",
    shortName: "Davao Agri",
    address: "Km 14, Davao-Bukidnon Road, Calinan, Davao City",
    region: "Davao Region",
    type: "Cold Storage",
    totalArea: 2800,
    usedArea: 1680,
    totalPallets: 1100,
    usedPallets: 660,
    loadingDocks: 4,
    lat: 7.0707,
    lng: 125.6087,
    zones: [
      { name: "Reefer Zone 1", type: "Cold", area: 1200, usedArea: 840, color: "#2563EB", temp: "-25 to -18\u00B0C" },
      { name: "Reefer Zone 2", type: "Cold", area: 800, usedArea: 480, color: "#0EA5E9", temp: "0 to 4\u00B0C" },
      { name: "Dry Pack", type: "Dry", area: 500, usedArea: 250, color: "#D97706", temp: "Ambient" },
      { name: "Staging", type: "Staging", area: 300, usedArea: 110, color: PURPLE, temp: "Ambient" },
    ],
    status: "Active",
    manager: "Ana Villanueva",
    skuCount: 28,
    inboundToday: 1,
    outboundToday: 2,
  },
  {
    id: "fac-004",
    name: "Laguna Fulfillment Center",
    shortName: "Laguna FC",
    address: "Lot 5, Laguna Technopark, Binan, Laguna",
    region: "CALABARZON",
    type: "Fulfillment Center",
    totalArea: 4200,
    usedArea: 3360,
    totalPallets: 1700,
    usedPallets: 1360,
    loadingDocks: 10,
    lat: 14.3294,
    lng: 121.0841,
    zones: [
      { name: "Pick Zone A", type: "Dry", area: 1800, usedArea: 1620, color: "#D97706", temp: "Ambient" },
      { name: "Pick Zone B", type: "Dry", area: 1200, usedArea: 960, color: "#F59E0B", temp: "Ambient" },
      { name: "Returns/QC", type: "Staging", area: 500, usedArea: 350, color: "#DC2626", temp: "Ambient" },
      { name: "Packing/Dispatch", type: "Staging", area: 700, usedArea: 430, color: PURPLE, temp: "Ambient" },
    ],
    status: "Active",
    manager: "Carlos Mendoza",
    skuCount: 120,
    inboundToday: 8,
    outboundToday: 15,
  },
];

type ViewMode = "cards" | "map";

export default function FacilitiesPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const [selectedFacility, setSelectedFacility] = useState<string | null>(null);
  const [showTransferModal, setShowTransferModal] = useState(false);

  const totalArea = facilities.reduce((a, f) => a + f.totalArea, 0);
  const totalUsed = facilities.reduce((a, f) => a + f.usedArea, 0);
  const totalSkus = facilities.reduce((a, f) => a + f.skuCount, 0);
  const totalDocks = facilities.reduce((a, f) => a + f.loadingDocks, 0);

  return (
    <>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827", margin: 0 }}>Multi-Facility Overview</h1>
          <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>{facilities.length} warehouse locations across the Philippines</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => setShowTransferModal(true)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "10px 18px", borderRadius: 8, border: `1px solid ${PURPLE_BORDER}`,
              background: PURPLE_LIGHT, color: PURPLE, fontSize: 13, fontWeight: 600, cursor: "pointer",
            }}
          >
            <ArrowLeftRight size={14} /> Transfer Between Facilities
          </button>
          <div style={{ display: "flex", borderRadius: 8, border: "1px solid #E5E7EB", overflow: "hidden" }}>
            <button
              onClick={() => setViewMode("cards")}
              style={{
                padding: "8px 14px", border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer",
                background: viewMode === "cards" ? PURPLE : "#fff",
                color: viewMode === "cards" ? "#fff" : "#6B7280",
              }}
            >
              <Layers size={14} />
            </button>
            <button
              onClick={() => setViewMode("map")}
              style={{
                padding: "8px 14px", border: "none", borderLeft: "1px solid #E5E7EB", fontSize: 12, fontWeight: 600, cursor: "pointer",
                background: viewMode === "map" ? PURPLE : "#fff",
                color: viewMode === "map" ? "#fff" : "#6B7280",
              }}
            >
              <Map size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* Network Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Total Facilities", value: facilities.length, icon: <Building2 size={20} />, color: PURPLE },
          { label: "Total Area", value: `${totalArea.toLocaleString()} sqm`, icon: <Layers size={20} />, color: "#2563EB" },
          { label: "Active SKUs", value: totalSkus, icon: <Package size={20} />, color: "#059669" },
          { label: "Loading Docks", value: totalDocks, icon: <Truck size={20} />, color: "#D97706" },
        ].map((stat, i) => (
          <div key={i} style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: "18px 20px", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 42, height: 42, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: `${stat.color}14`, color: stat.color }}>
              {stat.icon}
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#111827" }}>{stat.value}</div>
              <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Capacity Comparison */}
      <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: "20px 24px", marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
            <BarChart3 size={16} color={PURPLE} /> Capacity Comparison
          </h3>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: PURPLE }} />
              <span style={{ fontSize: 10, color: "#6B7280" }}>Used</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: "#E5E7EB" }} />
              <span style={{ fontSize: 10, color: "#6B7280" }}>Available</span>
            </div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${facilities.length}, 1fr)`, gap: 16 }}>
          {facilities.map((f) => {
            const pct = Math.round((f.usedArea / f.totalArea) * 100);
            const palletPct = Math.round((f.usedPallets / f.totalPallets) * 100);
            return (
              <div key={f.id} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#111827", marginBottom: 10 }}>{f.shortName}</div>
                {/* Vertical bar */}
                <div style={{
                  width: 48, height: 140, background: "#E5E7EB", borderRadius: 8, margin: "0 auto",
                  position: "relative", overflow: "hidden",
                }}>
                  <div style={{
                    position: "absolute", bottom: 0, left: 0, right: 0,
                    height: `${pct}%`,
                    background: pct > 85 ? "linear-gradient(180deg, #EF4444, #FCA5A5)" : `linear-gradient(180deg, ${PURPLE}, #A78BFA)`,
                    borderRadius: "0 0 8px 8px", transition: "height 0.5s ease",
                  }} />
                  <div style={{
                    position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                    fontSize: 16, fontWeight: 800, color: pct > 50 ? "#fff" : "#374151",
                    textShadow: pct > 50 ? "0 1px 2px rgba(0,0,0,0.2)" : "none",
                  }}>
                    {pct}%
                  </div>
                </div>
                <div style={{ marginTop: 8 }}>
                  <div style={{ fontSize: 10, color: "#6B7280" }}>{f.totalArea.toLocaleString()} sqm</div>
                  <div style={{ fontSize: 10, color: "#9CA3AF" }}>{palletPct}% pallets</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cards or Map View */}
      {viewMode === "cards" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, marginBottom: 20 }}>
          {facilities.map((f) => {
            const pct = Math.round((f.usedArea / f.totalArea) * 100);
            const isExpanded = selectedFacility === f.id;
            return (
              <div key={f.id} style={{
                background: "#fff", border: isExpanded ? `2px solid ${PURPLE}` : "1px solid #E5E7EB",
                borderRadius: 12, padding: "20px 24px", transition: "all 0.2s",
              }}>
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 10, background: `${PURPLE}14`,
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>
                      <Building2 size={22} color={PURPLE} />
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{f.name}</div>
                      <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
                        <MapPin size={10} /> {f.region}
                      </div>
                    </div>
                  </div>
                  <span style={{
                    padding: "3px 10px", borderRadius: 6, fontSize: 10, fontWeight: 700,
                    background: "#D1FAE5", color: "#065F46",
                  }}>
                    {f.status}
                  </span>
                </div>

                {/* Type badge */}
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                  <span style={{ padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: PURPLE_LIGHT, color: PURPLE, border: `1px solid ${PURPLE_BORDER}` }}>
                    {f.type}
                  </span>
                  <span style={{ padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 500, background: "#F3F4F6", color: "#6B7280" }}>
                    {f.loadingDocks} docks
                  </span>
                  <span style={{ padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 500, background: "#F3F4F6", color: "#6B7280" }}>
                    {f.skuCount} SKUs
                  </span>
                </div>

                {/* Capacity bar */}
                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 11, color: "#6B7280" }}>{f.usedArea.toLocaleString()} / {f.totalArea.toLocaleString()} sqm</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: pct > 85 ? "#DC2626" : PURPLE }}>{pct}%</span>
                  </div>
                  <div style={{ width: "100%", height: 8, background: "#E5E7EB", borderRadius: 6, overflow: "hidden" }}>
                    <div style={{
                      height: "100%", borderRadius: 6, transition: "width 0.4s",
                      width: `${pct}%`,
                      background: pct > 85 ? "linear-gradient(90deg, #EF4444, #F87171)" : `linear-gradient(90deg, ${PURPLE}, #A78BFA)`,
                    }} />
                  </div>
                </div>

                {/* Quick stats */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
                  <div style={{ padding: "8px 10px", background: "#F9FAFB", borderRadius: 8, textAlign: "center" }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: "#059669" }}>{f.inboundToday}</div>
                    <div style={{ fontSize: 9, color: "#6B7280" }}>Inbound Today</div>
                  </div>
                  <div style={{ padding: "8px 10px", background: "#F9FAFB", borderRadius: 8, textAlign: "center" }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: "#2563EB" }}>{f.outboundToday}</div>
                    <div style={{ fontSize: 9, color: "#6B7280" }}>Outbound Today</div>
                  </div>
                  <div style={{ padding: "8px 10px", background: "#F9FAFB", borderRadius: 8, textAlign: "center" }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: PURPLE }}>{f.zones.length}</div>
                    <div style={{ fontSize: 9, color: "#6B7280" }}>Zones</div>
                  </div>
                </div>

                {/* Toggle zone breakdown */}
                <button
                  onClick={() => setSelectedFacility(isExpanded ? null : f.id)}
                  style={{
                    width: "100%", padding: "8px 12px", borderRadius: 8, border: `1px solid ${PURPLE_BORDER}`,
                    background: isExpanded ? PURPLE_LIGHT : "#fff", color: PURPLE,
                    fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  }}
                >
                  {isExpanded ? "Hide" : "Show"} Zone Breakdown
                  <ChevronRight size={12} style={{ transform: isExpanded ? "rotate(90deg)" : "none", transition: "transform 0.2s" }} />
                </button>

                {/* Zone breakdown */}
                {isExpanded && (
                  <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
                    {f.zones.map((z) => {
                      const zPct = Math.round((z.usedArea / z.area) * 100);
                      return (
                        <div key={z.name} style={{ padding: "10px 14px", background: "#F9FAFB", borderRadius: 8, border: "1px solid #E5E7EB" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <div style={{ width: 8, height: 8, borderRadius: 2, background: z.color }} />
                              <span style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>{z.name}</span>
                            </div>
                            <span style={{ fontSize: 12, fontWeight: 700, color: z.color }}>{zPct}%</span>
                          </div>
                          <div style={{ width: "100%", height: 4, background: "#E5E7EB", borderRadius: 3, overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${zPct}%`, background: z.color, borderRadius: 3 }} />
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                            <span style={{ fontSize: 9, color: "#9CA3AF" }}>{z.area.toLocaleString()} sqm</span>
                            <span style={{ fontSize: 9, color: "#9CA3AF", display: "flex", alignItems: "center", gap: 2 }}>
                              {z.temp !== "Ambient" && <Snowflake size={8} color="#2563EB" />}
                              {z.temp}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Footer */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, paddingTop: 12, borderTop: "1px solid #F3F4F6" }}>
                  <span style={{ fontSize: 11, color: "#6B7280" }}>Manager: {f.manager}</span>
                  <a href="/dashboard/facility" style={{ fontSize: 11, color: PURPLE, textDecoration: "none", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                    View Details <ChevronRight size={10} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {viewMode === "map" && (
        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: "20px 24px", marginBottom: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: "0 0 16px", display: "flex", alignItems: "center", gap: 8 }}>
            <Map size={16} color={PURPLE} /> Facility Locations
          </h3>

          {/* Simple inline map of Philippines */}
          <div style={{
            position: "relative", width: "100%", height: 500,
            background: "linear-gradient(180deg, #EFF6FF 0%, #DBEAFE 100%)",
            borderRadius: 12, overflow: "hidden", border: "1px solid #BFDBFE",
          }}>
            {/* Philippines outline - simplified SVG */}
            <svg viewBox="0 0 400 600" width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0 }}>
              {/* Luzon */}
              <path d="M180,100 L220,80 L260,90 L270,120 L260,160 L240,200 L230,230 L200,250 L180,240 L160,200 L155,160 L160,130 Z"
                fill="#D1D5DB40" stroke="#9CA3AF" strokeWidth="1.5" />
              {/* Visayas */}
              <path d="M170,300 L210,280 L250,290 L260,310 L240,330 L200,340 L170,320 Z"
                fill="#D1D5DB40" stroke="#9CA3AF" strokeWidth="1.5" />
              {/* Mindanao */}
              <path d="M160,380 L220,360 L270,370 L290,400 L280,440 L250,460 L200,470 L170,450 L150,420 Z"
                fill="#D1D5DB40" stroke="#9CA3AF" strokeWidth="1.5" />
              {/* Labels */}
              <text x="210" y="170" fontSize="12" fill="#6B7280" textAnchor="middle" fontWeight="600">LUZON</text>
              <text x="215" y="310" fontSize="11" fill="#6B7280" textAnchor="middle" fontWeight="600">VISAYAS</text>
              <text x="220" y="420" fontSize="12" fill="#6B7280" textAnchor="middle" fontWeight="600">MINDANAO</text>
            </svg>

            {/* Facility pins */}
            {facilities.map((f, idx) => {
              // Map lat/lng to approximate positions on SVG
              const positions: Record<string, { x: string; y: string }> = {
                "fac-001": { x: "51%", y: "28%" },  // Clark, Pampanga
                "fac-002": { x: "56%", y: "50%" },  // Cebu City
                "fac-003": { x: "58%", y: "68%" },  // Davao
                "fac-004": { x: "52%", y: "35%" },  // Laguna
              };
              const pos = positions[f.id] || { x: "50%", y: "50%" };
              const pct = Math.round((f.usedArea / f.totalArea) * 100);

              return (
                <div
                  key={f.id}
                  onClick={() => setSelectedFacility(selectedFacility === f.id ? null : f.id)}
                  style={{
                    position: "absolute", left: pos.x, top: pos.y, transform: "translate(-50%, -100%)",
                    cursor: "pointer", zIndex: selectedFacility === f.id ? 10 : 5,
                  }}
                >
                  {/* Pin */}
                  <div style={{
                    display: "flex", flexDirection: "column", alignItems: "center",
                  }}>
                    {/* Info card on hover/select */}
                    {selectedFacility === f.id && (
                      <div style={{
                        position: "absolute", bottom: "100%", left: "50%", transform: "translateX(-50%)",
                        background: "#fff", borderRadius: 10, padding: "12px 16px", minWidth: 200,
                        border: `2px solid ${PURPLE}`, boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        marginBottom: 8, zIndex: 20,
                      }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{f.name}</div>
                        <div style={{ fontSize: 11, color: "#6B7280", marginTop: 2 }}>{f.region} &middot; {f.type}</div>
                        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                          <span style={{ fontSize: 10, color: "#6B7280" }}>{f.totalArea.toLocaleString()} sqm</span>
                          <span style={{ fontSize: 10, fontWeight: 700, color: PURPLE }}>{pct}% used</span>
                        </div>
                        <div style={{ width: "100%", height: 4, background: "#E5E7EB", borderRadius: 2, marginTop: 6, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${pct}%`, background: PURPLE, borderRadius: 2 }} />
                        </div>
                        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                          <span style={{ fontSize: 10, color: "#059669" }}>{f.inboundToday} in</span>
                          <span style={{ fontSize: 10, color: "#2563EB" }}>{f.outboundToday} out</span>
                          <span style={{ fontSize: 10, color: "#6B7280" }}>{f.skuCount} SKUs</span>
                        </div>
                      </div>
                    )}
                    {/* Pin marker */}
                    <div style={{
                      width: selectedFacility === f.id ? 40 : 32,
                      height: selectedFacility === f.id ? 40 : 32,
                      borderRadius: "50% 50% 50% 0",
                      background: PURPLE,
                      transform: "rotate(-45deg)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: selectedFacility === f.id ? `0 0 0 6px ${PURPLE}25` : "0 2px 6px rgba(0,0,0,0.2)",
                      transition: "all 0.2s",
                    }}>
                      <Building2 size={selectedFacility === f.id ? 16 : 12} color="#fff" style={{ transform: "rotate(45deg)" }} />
                    </div>
                    {/* Label */}
                    <div style={{
                      marginTop: 4, padding: "2px 8px", borderRadius: 4,
                      background: selectedFacility === f.id ? PURPLE : "#fff",
                      color: selectedFacility === f.id ? "#fff" : "#374151",
                      fontSize: 9, fontWeight: 700, whiteSpace: "nowrap",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                    }}>
                      {f.shortName}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Scale legend */}
            <div style={{ position: "absolute", bottom: 12, right: 12, background: "#fff", borderRadius: 8, padding: "8px 12px", fontSize: 10, color: "#6B7280", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}>
                <div style={{ width: 12, height: 12, borderRadius: "50% 50% 50% 0", background: PURPLE, transform: "rotate(-45deg) scale(0.7)" }} />
                <span>Warehouse Location</span>
              </div>
              <div style={{ fontSize: 9, color: "#9CA3AF" }}>Click pin for details</div>
            </div>
          </div>
        </div>
      )}

      {/* Transfer Modal */}
      {showTransferModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000,
        }}>
          <div style={{
            background: "#fff", borderRadius: 16, padding: "28px 32px", width: 520,
            maxHeight: "80vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: "#111827", margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                <ArrowLeftRight size={18} color={PURPLE} /> Inter-Facility Transfer
              </h3>
              <button onClick={() => setShowTransferModal(false)} style={{
                width: 28, height: 28, borderRadius: 6, border: "none", background: "#F3F4F6",
                cursor: "pointer", fontSize: 14, fontWeight: 600, color: "#6B7280",
              }}>
                x
              </button>
            </div>

            <div style={{ display: "grid", gap: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, color: "#6B7280", fontWeight: 600, marginBottom: 6 }}>From Facility</label>
                <select style={{ width: "100%", padding: "10px 14px", border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 13, cursor: "pointer" }}>
                  <option value="">Select origin...</option>
                  {facilities.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
              </div>

              <div style={{ display: "flex", justifyContent: "center" }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: PURPLE_LIGHT, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ArrowLeftRight size={16} color={PURPLE} />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, color: "#6B7280", fontWeight: 600, marginBottom: 6 }}>To Facility</label>
                <select style={{ width: "100%", padding: "10px 14px", border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 13, cursor: "pointer" }}>
                  <option value="">Select destination...</option>
                  {facilities.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, color: "#6B7280", fontWeight: 600, marginBottom: 6 }}>Items to Transfer</label>
                <textarea
                  placeholder="Enter SKUs and quantities to transfer (e.g., DRY-1001 x50, CLD-2001 x20)"
                  rows={3}
                  style={{ width: "100%", padding: "10px 14px", border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 13, resize: "vertical" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, color: "#6B7280", fontWeight: 600, marginBottom: 6 }}>Transfer Notes</label>
                <input
                  type="text"
                  placeholder="Reason for transfer, special handling instructions..."
                  style={{ width: "100%", padding: "10px 14px", border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 13 }}
                />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
              <button onClick={() => setShowTransferModal(false)} style={{
                padding: "10px 20px", borderRadius: 8, border: "1px solid #E5E7EB",
                background: "#fff", color: "#374151", fontSize: 13, fontWeight: 600, cursor: "pointer",
              }}>
                Cancel
              </button>
              <button onClick={() => setShowTransferModal(false)} style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "10px 20px", borderRadius: 8, border: "none",
                background: PURPLE, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer",
              }}>
                <ArrowLeftRight size={14} /> Initiate Transfer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
