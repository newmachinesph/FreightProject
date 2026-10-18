"use client";

import { useState, useMemo } from "react";
import {
  Calculator, MapPin, Truck, Package, Weight, Ship,
  ArrowRight, Leaf, Clock, DollarSign, BarChart3,
  ChevronDown, Zap, TrendingUp,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { calculateFreightRate, estimateRouteCO2, VEHICLE_SPECS } from "@/lib/ph-routes";

// ─── Philippine Cities with GPS ───
const PH_CITIES = [
  { name: "Manila", lat: 14.5995, lng: 120.9842 },
  { name: "Cebu City", lat: 10.3157, lng: 123.8854 },
  { name: "Davao City", lat: 7.1907, lng: 125.4553 },
  { name: "Clark (Pampanga)", lat: 15.1860, lng: 120.5460 },
  { name: "Batangas City", lat: 13.7565, lng: 121.0583 },
  { name: "Iloilo City", lat: 10.6918, lng: 122.5644 },
  { name: "Cagayan de Oro", lat: 8.4809, lng: 124.6383 },
  { name: "General Santos", lat: 6.0878, lng: 125.1672 },
  { name: "Bacolod", lat: 10.6840, lng: 122.9470 },
  { name: "Zamboanga City", lat: 6.9214, lng: 122.0790 },
];

const VEHICLE_TYPES = [
  { type: "L300 Van", icon: "van", color: "#94a3b8", payload: "1,000 kg" },
  { type: "Closed Van (4W)", icon: "truck-sm", color: "#60a5fa", payload: "2,500 kg" },
  { type: "Closed Van (6W)", icon: "truck-md", color: "#3b82f6", payload: "5,000 kg" },
  { type: "Wing Van (6W)", icon: "wing", color: "#2563eb", payload: "7,000 kg" },
  { type: "10-Wheeler Wing Van", icon: "truck-lg", color: "#1d4ed8", payload: "15,000 kg" },
  { type: "Reefer Van (6W)", icon: "reefer", color: "#0891b2", payload: "4,500 kg" },
  { type: "Flatbed Trailer", icon: "flatbed", color: "#78716c", payload: "25,000 kg" },
  { type: "Container Truck (20ft)", icon: "container", color: "#dc2626", payload: "18,000 kg" },
];

const CARGO_TYPES = [
  { name: "FMCG", color: "#F59E0B", bg: "#FFFBEB" },
  { name: "Agricultural", color: "#16A34A", bg: "#F0FDF4" },
  { name: "Electronics", color: "#2563EB", bg: "#EFF6FF" },
  { name: "Pharmaceuticals", color: "#9D174D", bg: "#FDF2F8" },
  { name: "Hazmat", color: "#DC2626", bg: "#FEF2F2" },
  { name: "Construction", color: "#78716C", bg: "#F5F5F4" },
  { name: "Frozen Seafood", color: "#0891B2", bg: "#ECFEFF" },
  { name: "General Cargo", color: "#6B7280", bg: "#F9FAFB" },
];

// Haversine formula for distance
function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Simple vehicle SVGs
function VehicleIcon({ type, size = 40, color }: { type: string; size?: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      {type === "van" && (
        <>
          <rect x="4" y="14" width="32" height="16" rx="3" fill={color} />
          <rect x="4" y="14" width="12" height="16" rx="3" fill={`${color}cc`} />
          <circle cx="12" cy="32" r="3" fill="#1e293b" />
          <circle cx="28" cy="32" r="3" fill="#1e293b" />
          <rect x="6" y="17" width="8" height="6" rx="1" fill="#ffffff30" />
        </>
      )}
      {type === "truck-sm" && (
        <>
          <rect x="14" y="12" width="22" height="18" rx="2" fill={color} />
          <rect x="4" y="16" width="12" height="14" rx="2" fill={`${color}dd`} />
          <circle cx="10" cy="32" r="3" fill="#1e293b" />
          <circle cx="30" cy="32" r="3" fill="#1e293b" />
          <rect x="5" y="18" width="6" height="5" rx="1" fill="#ffffff30" />
        </>
      )}
      {type === "truck-md" && (
        <>
          <rect x="12" y="10" width="24" height="20" rx="2" fill={color} />
          <rect x="2" y="14" width="12" height="16" rx="2" fill={`${color}dd`} />
          <circle cx="8" cy="32" r="3" fill="#1e293b" />
          <circle cx="22" cy="32" r="3" fill="#1e293b" />
          <circle cx="30" cy="32" r="3" fill="#1e293b" />
          <rect x="3" y="16" width="7" height="5" rx="1" fill="#ffffff30" />
        </>
      )}
      {type === "wing" && (
        <>
          <rect x="10" y="8" width="26" height="22" rx="2" fill={color} />
          <rect x="2" y="14" width="10" height="16" rx="2" fill={`${color}dd`} />
          <line x1="10" y1="8" x2="10" y2="30" stroke="#ffffff20" strokeWidth="1" />
          <line x1="23" y1="8" x2="23" y2="30" stroke="#ffffff20" strokeWidth="1" />
          <circle cx="8" cy="32" r="3" fill="#1e293b" />
          <circle cx="28" cy="32" r="3" fill="#1e293b" />
          <rect x="3" y="16" width="6" height="5" rx="1" fill="#ffffff30" />
        </>
      )}
      {type === "truck-lg" && (
        <>
          <rect x="8" y="6" width="28" height="24" rx="2" fill={color} />
          <rect x="1" y="12" width="9" height="18" rx="2" fill={`${color}dd`} />
          <circle cx="6" cy="32" r="3" fill="#1e293b" />
          <circle cx="20" cy="32" r="2.5" fill="#1e293b" />
          <circle cx="26" cy="32" r="2.5" fill="#1e293b" />
          <circle cx="32" cy="32" r="2.5" fill="#1e293b" />
          <rect x="2" y="14" width="5" height="4" rx="1" fill="#ffffff30" />
        </>
      )}
      {type === "reefer" && (
        <>
          <rect x="12" y="10" width="24" height="20" rx="2" fill={color} />
          <rect x="2" y="14" width="12" height="16" rx="2" fill={`${color}dd`} />
          <rect x="33" y="12" width="4" height="8" rx="1" fill="#0f172a" />
          <circle cx="8" cy="32" r="3" fill="#1e293b" />
          <circle cx="28" cy="32" r="3" fill="#1e293b" />
          <path d="M35 14 L35 18" stroke="#38bdf8" strokeWidth="1.5" />
          <rect x="3" y="16" width="7" height="5" rx="1" fill="#ffffff30" />
        </>
      )}
      {type === "flatbed" && (
        <>
          <rect x="8" y="22" width="28" height="4" rx="1" fill={color} />
          <rect x="1" y="14" width="9" height="16" rx="2" fill="#64748b" />
          <circle cx="6" cy="32" r="3" fill="#1e293b" />
          <circle cx="22" cy="32" r="2.5" fill="#1e293b" />
          <circle cx="28" cy="32" r="2.5" fill="#1e293b" />
          <circle cx="34" cy="32" r="2.5" fill="#1e293b" />
          <rect x="2" y="16" width="5" height="4" rx="1" fill="#ffffff30" />
        </>
      )}
      {type === "container" && (
        <>
          <rect x="10" y="8" width="26" height="22" rx="1" fill={color} />
          <rect x="2" y="14" width="10" height="16" rx="2" fill="#64748b" />
          <line x1="16" y1="8" x2="16" y2="30" stroke="#ffffff15" strokeWidth="1" />
          <line x1="22" y1="8" x2="22" y2="30" stroke="#ffffff15" strokeWidth="1" />
          <line x1="28" y1="8" x2="28" y2="30" stroke="#ffffff15" strokeWidth="1" />
          <circle cx="7" cy="32" r="3" fill="#1e293b" />
          <circle cx="24" cy="32" r="2.5" fill="#1e293b" />
          <circle cx="32" cy="32" r="2.5" fill="#1e293b" />
          <rect x="3" y="16" width="5" height="4" rx="1" fill="#ffffff30" />
        </>
      )}
    </svg>
  );
}

function formatPHP(value: number): string {
  return new Intl.NumberFormat("en-PH").format(value);
}

export default function RateCalculatorPage() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [cargoType, setCargoType] = useState("");
  const [weight, setWeight] = useState("");
  const [interIsland, setInterIsland] = useState(false);
  const [calculated, setCalculated] = useState(false);

  const originCity = PH_CITIES.find((c) => c.name === origin);
  const destCity = PH_CITIES.find((c) => c.name === destination);

  const results = useMemo(() => {
    if (!originCity || !destCity || !vehicleType || !cargoType) return null;

    const straightLine = haversineKm(originCity.lat, originCity.lng, destCity.lat, destCity.lng);
    // Road distance is roughly 1.3x straight line in PH (winding roads, mountains)
    const roadDistance = Math.round(straightLine * 1.3);

    const rates = calculateFreightRate(roadDistance, vehicleType, cargoType, interIsland);
    const co2 = estimateRouteCO2(roadDistance, vehicleType, 0.75);
    const spec = VEHICLE_SPECS.find((v) => v.type === vehicleType);

    // Transit time estimate
    const avgSpeedKmh = roadDistance > 500 ? 35 : roadDistance > 200 ? 40 : 45;
    let transitHours = roadDistance / avgSpeedKmh;
    if (interIsland) transitHours += 18; // Ferry time
    const transitDays = Math.ceil(transitHours / 24);
    const transitDisplay = transitDays <= 1
      ? `${Math.round(transitHours)} hours`
      : `${transitDays} day${transitDays > 1 ? "s" : ""}`;

    // Vehicle capacity utilization
    const weightNum = parseFloat(weight) || 0;
    const capacityUtil = spec ? Math.min(Math.round((weightNum / spec.maxPayloadKg) * 100), 100) : 0;

    return {
      distance: roadDistance,
      straightLine: Math.round(straightLine),
      rates,
      co2,
      transitDisplay,
      transitHours: Math.round(transitHours),
      ratePerKm: Math.round(rates.avg / roadDistance),
      capacityUtil,
      maxPayload: spec?.maxPayloadKg ?? 0,
    };
  }, [originCity, destCity, vehicleType, cargoType, weight, interIsland]);

  const canCalculate = origin && destination && vehicleType && cargoType && origin !== destination;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <Navbar active="Rate Calculator" />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 24px 64px" }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: "linear-gradient(135deg, #2563eb, #7c3aed)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Calculator size={20} color="#ffffff" />
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", margin: 0 }}>Freight Rate Calculator</h1>
          </div>
          <p style={{ fontSize: 14, color: "#64748b", margin: 0, paddingLeft: 50 }}>
            Estimate freight rates between Philippine cities. Uses real PH trucking data, vehicle specs, and route calculations.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {/* ── Left: Input Form ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Origin & Destination */}
            <div style={{ backgroundColor: "#ffffff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 24 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", margin: "0 0 16px", display: "flex", alignItems: "center", gap: 6 }}>
                <MapPin size={14} color="#2563eb" /> Route
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 4, display: "block" }}>Origin City</label>
                  <div style={{ position: "relative" }}>
                    <select
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      style={{
                        width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #e2e8f0",
                        fontSize: 14, color: origin ? "#0f172a" : "#9CA3AF", backgroundColor: "#f8fafc",
                        appearance: "none", cursor: "pointer",
                      }}
                    >
                      <option value="">Select origin city</option>
                      {PH_CITIES.map((c) => (
                        <option key={c.name} value={c.name} disabled={c.name === destination}>{c.name}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} color="#9CA3AF" style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%", backgroundColor: "#EFF6FF",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <ArrowRight size={16} color="#2563eb" style={{ transform: "rotate(90deg)" }} />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 4, display: "block" }}>Destination City</label>
                  <div style={{ position: "relative" }}>
                    <select
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      style={{
                        width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #e2e8f0",
                        fontSize: 14, color: destination ? "#0f172a" : "#9CA3AF", backgroundColor: "#f8fafc",
                        appearance: "none", cursor: "pointer",
                      }}
                    >
                      <option value="">Select destination city</option>
                      {PH_CITIES.map((c) => (
                        <option key={c.name} value={c.name} disabled={c.name === origin}>{c.name}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} color="#9CA3AF" style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle Type */}
            <div style={{ backgroundColor: "#ffffff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 24 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", margin: "0 0 16px", display: "flex", alignItems: "center", gap: 6 }}>
                <Truck size={14} color="#2563eb" /> Vehicle Type
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
                {VEHICLE_TYPES.map((v) => (
                  <button
                    key={v.type}
                    onClick={() => setVehicleType(v.type)}
                    style={{
                      padding: "10px 12px", borderRadius: 10,
                      border: vehicleType === v.type ? `2px solid ${v.color}` : "2px solid #f1f5f9",
                      backgroundColor: vehicleType === v.type ? `${v.color}10` : "#f8fafc",
                      cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
                      transition: "all 0.15s",
                    }}
                  >
                    <VehicleIcon type={v.icon} size={32} color={v.color} />
                    <div style={{ textAlign: "left" }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: "#0f172a", lineHeight: 1.2 }}>{v.type}</div>
                      <div style={{ fontSize: 10, color: "#9CA3AF" }}>{v.payload}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Cargo Type */}
            <div style={{ backgroundColor: "#ffffff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 24 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", margin: "0 0 16px", display: "flex", alignItems: "center", gap: 6 }}>
                <Package size={14} color="#2563eb" /> Cargo Type
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                {CARGO_TYPES.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setCargoType(c.name)}
                    style={{
                      padding: "10px 8px", borderRadius: 8, textAlign: "center",
                      border: cargoType === c.name ? `2px solid ${c.color}` : "2px solid #f1f5f9",
                      backgroundColor: cargoType === c.name ? c.bg : "#f8fafc",
                      cursor: "pointer", transition: "all 0.15s",
                    }}
                  >
                    <div style={{ fontSize: 11, fontWeight: 600, color: cargoType === c.name ? c.color : "#374151" }}>{c.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Weight & Inter-island */}
            <div style={{ backgroundColor: "#ffffff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 24 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 4, display: "flex", alignItems: "center", gap: 4 }}>
                    <Weight size={12} /> Cargo Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="e.g. 5000"
                    style={{
                      width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #e2e8f0",
                      fontSize: 14, color: "#0f172a", backgroundColor: "#f8fafc", boxSizing: "border-box",
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 4, display: "flex", alignItems: "center", gap: 4 }}>
                    <Ship size={12} /> Inter-Island
                  </label>
                  <button
                    onClick={() => setInterIsland(!interIsland)}
                    style={{
                      width: "100%", padding: "10px 14px", borderRadius: 8,
                      border: interIsland ? "2px solid #2563eb" : "2px solid #e2e8f0",
                      backgroundColor: interIsland ? "#EFF6FF" : "#f8fafc",
                      fontSize: 14, fontWeight: 600, cursor: "pointer",
                      color: interIsland ? "#2563eb" : "#6B7280",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    }}
                  >
                    <Ship size={14} />
                    {interIsland ? "Yes - RoRo / Ferry" : "No - Land Only"}
                  </button>
                </div>
              </div>
            </div>

            {/* Calculate Button */}
            <button
              disabled={!canCalculate}
              onClick={() => setCalculated(true)}
              style={{
                width: "100%", padding: "16px 24px", border: "none", borderRadius: 12,
                fontSize: 15, fontWeight: 700, color: "#ffffff",
                background: canCalculate ? "linear-gradient(135deg, #2563eb, #7c3aed)" : "#cbd5e1",
                cursor: canCalculate ? "pointer" : "not-allowed",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                transition: "all 0.2s",
              }}
            >
              <Calculator size={18} /> Calculate Freight Rate
            </button>
          </div>

          {/* ── Right: Results ── */}
          <div>
            {!calculated || !results ? (
              <div style={{
                backgroundColor: "#ffffff", borderRadius: 12, border: "1px solid #e2e8f0",
                padding: 48, display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center", minHeight: 500, textAlign: "center",
              }}>
                <div style={{
                  width: 80, height: 80, borderRadius: 20,
                  background: "linear-gradient(135deg, #2563eb15, #7c3aed15)",
                  display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20,
                }}>
                  <Calculator size={36} color="#94a3b8" />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#374151", margin: "0 0 8px" }}>Configure Your Shipment</h3>
                <p style={{ fontSize: 13, color: "#9CA3AF", margin: 0, maxWidth: 280 }}>
                  Select origin, destination, vehicle type, and cargo type, then click calculate to see estimated rates.
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {/* Rate Card */}
                <div style={{
                  backgroundColor: "#ffffff", borderRadius: 14, border: "1px solid #e2e8f0",
                  padding: 28, position: "relative", overflow: "hidden",
                }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg, #2563eb, #7c3aed, #ec4899)" }} />
                  <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 4 }}>Estimated Rate Range</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 16 }}>
                    <span style={{ fontSize: 14, color: "#9CA3AF" }}>{"\u20B1"}{formatPHP(results.rates.min)}</span>
                    <span style={{ fontSize: 36, fontWeight: 800, color: "#2563eb" }}>{"\u20B1"}{formatPHP(results.rates.avg)}</span>
                    <span style={{ fontSize: 14, color: "#9CA3AF" }}>{"\u20B1"}{formatPHP(results.rates.max)}</span>
                  </div>

                  {/* Rate bar visualization */}
                  <div style={{ position: "relative", height: 8, backgroundColor: "#f1f5f9", borderRadius: 9999, marginBottom: 20 }}>
                    <div style={{
                      position: "absolute", left: "15%", right: "15%", top: 0, height: "100%",
                      background: "linear-gradient(90deg, #93c5fd, #2563eb, #93c5fd)",
                      borderRadius: 9999,
                    }} />
                    <div style={{
                      position: "absolute", left: "50%", top: -4, width: 4, height: 16,
                      backgroundColor: "#1d4ed8", borderRadius: 2, transform: "translateX(-50%)",
                    }} />
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#9CA3AF" }}>
                    <span>Min</span>
                    <span style={{ fontWeight: 700, color: "#2563eb" }}>Average</span>
                    <span>Max</span>
                  </div>
                </div>

                {/* Route Info */}
                <div style={{ backgroundColor: "#ffffff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{origin}</div>
                    <div style={{
                      flex: 1, height: 2, backgroundColor: "#e2e8f0", position: "relative",
                      backgroundImage: "repeating-linear-gradient(90deg, #2563eb 0, #2563eb 8px, transparent 8px, transparent 16px)",
                    }} />
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{destination}</div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                    <div style={{ padding: "10px 14px", background: "#f8fafc", borderRadius: 8, textAlign: "center" }}>
                      <MapPin size={14} color="#2563eb" style={{ margin: "0 auto 4px" }} />
                      <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>{formatPHP(results.distance)} km</div>
                      <div style={{ fontSize: 10, color: "#9CA3AF" }}>Est. Road Distance</div>
                    </div>
                    <div style={{ padding: "10px 14px", background: "#f8fafc", borderRadius: 8, textAlign: "center" }}>
                      <DollarSign size={14} color="#059669" style={{ margin: "0 auto 4px" }} />
                      <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>{"\u20B1"}{results.ratePerKm}/km</div>
                      <div style={{ fontSize: 10, color: "#9CA3AF" }}>Rate per Kilometer</div>
                    </div>
                    <div style={{ padding: "10px 14px", background: "#f8fafc", borderRadius: 8, textAlign: "center" }}>
                      <Clock size={14} color="#F59E0B" style={{ margin: "0 auto 4px" }} />
                      <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>{results.transitDisplay}</div>
                      <div style={{ fontSize: 10, color: "#9CA3AF" }}>Est. Transit Time</div>
                    </div>
                  </div>
                </div>

                {/* CO2 & Sustainability */}
                <div style={{ backgroundColor: "#ffffff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 20 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", margin: "0 0 12px", display: "flex", alignItems: "center", gap: 6 }}>
                    <Leaf size={14} color="#16A34A" /> Carbon Footprint
                  </h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                    <div style={{ padding: "12px 14px", background: "#F0FDF4", borderRadius: 10, textAlign: "center", border: "1px solid #BBF7D0" }}>
                      <div style={{ fontSize: 20, fontWeight: 800, color: "#16A34A" }}>{results.co2.totalKg}</div>
                      <div style={{ fontSize: 11, color: "#6B7280" }}>kg CO2</div>
                    </div>
                    <div style={{ padding: "12px 14px", background: "#F0FDF4", borderRadius: 10, textAlign: "center", border: "1px solid #BBF7D0" }}>
                      <div style={{ fontSize: 20, fontWeight: 800, color: "#16A34A" }}>{results.co2.perTonKm}</div>
                      <div style={{ fontSize: 11, color: "#6B7280" }}>kg CO2/ton-km</div>
                    </div>
                    <div style={{ padding: "12px 14px", background: "#F0FDF4", borderRadius: 10, textAlign: "center", border: "1px solid #BBF7D0" }}>
                      <div style={{ fontSize: 20, fontWeight: 800, color: "#16A34A" }}>{results.co2.treesEquivalent}</div>
                      <div style={{ fontSize: 11, color: "#6B7280" }}>trees/year equiv.</div>
                    </div>
                  </div>
                </div>

                {/* Vehicle Capacity */}
                {parseFloat(weight) > 0 && (
                  <div style={{ backgroundColor: "#ffffff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 20 }}>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", margin: "0 0 12px", display: "flex", alignItems: "center", gap: 6 }}>
                      <BarChart3 size={14} color="#7C3AED" /> Vehicle Capacity Utilization
                    </h3>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                          <span style={{ fontSize: 12, color: "#6B7280" }}>{formatPHP(parseFloat(weight))} kg / {formatPHP(results.maxPayload)} kg</span>
                          <span style={{
                            fontSize: 13, fontWeight: 700,
                            color: results.capacityUtil > 90 ? "#EF4444" : results.capacityUtil > 70 ? "#F59E0B" : "#059669",
                          }}>{results.capacityUtil}%</span>
                        </div>
                        <div style={{ height: 10, backgroundColor: "#f1f5f9", borderRadius: 9999, overflow: "hidden" }}>
                          <div style={{
                            height: "100%", width: `${results.capacityUtil}%`,
                            background: results.capacityUtil > 90
                              ? "linear-gradient(90deg, #EF4444, #DC2626)"
                              : results.capacityUtil > 70
                              ? "linear-gradient(90deg, #F59E0B, #D97706)"
                              : "linear-gradient(90deg, #10B981, #059669)",
                            borderRadius: 9999,
                          }} />
                        </div>
                        <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 6 }}>
                          {results.capacityUtil < 50
                            ? "Consider a smaller vehicle for better cost efficiency."
                            : results.capacityUtil > 90
                            ? "Near maximum capacity. Ensure weight is within legal limits."
                            : "Good capacity utilization for this vehicle type."}
                        </div>
                      </div>
                      <div style={{
                        width: 64, height: 64, borderRadius: "50%",
                        background: `conic-gradient(${results.capacityUtil > 90 ? "#EF4444" : results.capacityUtil > 70 ? "#F59E0B" : "#059669"} ${results.capacityUtil * 3.6}deg, #f1f5f9 0deg)`,
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                      }}>
                        <div style={{ width: 48, height: 48, borderRadius: "50%", backgroundColor: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>{results.capacityUtil}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Summary Card */}
                <div style={{
                  background: "linear-gradient(135deg, #0f172a, #1e293b)", borderRadius: 14,
                  padding: 24, color: "#ffffff",
                }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 14px", display: "flex", alignItems: "center", gap: 6 }}>
                    <Zap size={14} color="#F59E0B" /> Rate Summary
                  </h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: 13 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #334155" }}>
                      <span style={{ color: "#94a3b8" }}>Route</span>
                      <span style={{ fontWeight: 600 }}>{origin} → {destination}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #334155" }}>
                      <span style={{ color: "#94a3b8" }}>Vehicle</span>
                      <span style={{ fontWeight: 600 }}>{vehicleType}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #334155" }}>
                      <span style={{ color: "#94a3b8" }}>Cargo</span>
                      <span style={{ fontWeight: 600 }}>{cargoType}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #334155" }}>
                      <span style={{ color: "#94a3b8" }}>Inter-island</span>
                      <span style={{ fontWeight: 600 }}>{interIsland ? "Yes (+35%)" : "No"}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #334155" }}>
                      <span style={{ color: "#94a3b8" }}>Distance</span>
                      <span style={{ fontWeight: 600 }}>{formatPHP(results.distance)} km</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #334155" }}>
                      <span style={{ color: "#94a3b8" }}>Transit</span>
                      <span style={{ fontWeight: 600 }}>{results.transitDisplay}</span>
                    </div>
                  </div>
                  <div style={{ marginTop: 16, padding: "14px 18px", background: "#2563eb20", borderRadius: 10, textAlign: "center" }}>
                    <div style={{ fontSize: 12, color: "#93c5fd", marginBottom: 4 }}>Estimated Total Rate</div>
                    <div style={{ fontSize: 28, fontWeight: 800, color: "#60a5fa" }}>{"\u20B1"}{formatPHP(results.rates.avg)}</div>
                  </div>
                </div>

                {/* Disclaimer */}
                <div style={{ padding: "12px 16px", background: "#FFFBEB", borderRadius: 8, border: "1px solid #FDE68A" }}>
                  <p style={{ fontSize: 11, color: "#92400E", margin: 0, lineHeight: 1.5 }}>
                    <strong>Disclaimer:</strong> These are estimated rates based on typical Philippine freight market data. Actual rates may vary based on fuel prices, road conditions, season, and carrier negotiations. Contact carriers directly for exact quotations.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
