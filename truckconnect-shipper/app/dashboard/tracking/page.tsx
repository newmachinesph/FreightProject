"use client";
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import VehicleIcon from "@/components/VehicleIcon";
import { loads, bookings } from "@/lib/mock-data";
import {
  MapPin,
  Truck,
  Clock,
  CheckCircle2,
  Circle,
  Anchor,
  Ship,
  Navigation,
  Map,
  Thermometer,
  Route,
  Timer,
  Phone,
  Camera,
  Send,
  CloudRain,
  Sun,
  Cloud,
  AlertTriangle,
  MapPinned,
  Image,
} from "lucide-react";
import Link from "next/link";

const interIslandSteps = ["Pickup", "In Transit", "At Port", "On Vessel", "Delivered"];
const regularSteps = ["Pickup", "In Transit", "Delivered"];

// Distance estimates for route info
const cityDistances: Record<string, Record<string, number>> = {
  "Manila": { "Cebu": 570, "Davao": 1500, "CDO": 880, "Pampanga": 70, "Baguio": 250, "Naga": 380, "Iloilo": 630 },
  "Cebu": { "Dumaguete": 220, "CDO": 350, "Manila": 570 },
  "Davao": { "General Santos": 180, "CDO": 380 },
  "Laguna": { "Taguig": 45, "Davao": 1520, "Iloilo": 660 },
  "Bataan": { "Quezon City": 140 },
  "Makati": { "Clark": 100 },
};

function getDistance(origin: string, dest: string): number {
  return cityDistances[origin]?.[dest] || cityDistances[dest]?.[origin] || 300;
}

// RoRo port routes
const roroRoutes: Record<string, Record<string, string>> = {
  "Luzon-Visayas": { origin: "Batangas International Port", dest: "Cebu International Port", via: "RoRo via Batangas-Cebu sea lane" },
  "Visayas-Mindanao": { origin: "Port of Liloan (Cebu)", dest: "Port of Cagayan de Oro", via: "RoRo via Cebu-CDO sea lane" },
  "Luzon-Mindanao": { origin: "Manila South Harbor", dest: "Davao Sasa Port", via: "RoRo via Manila-Davao direct route" },
  "Mindanao-Luzon": { origin: "Port of General Santos", dest: "Manila South Harbor", via: "RoRo via GenSan-Manila route" },
};

function getRoroRoute(originIsland?: string, destIsland?: string) {
  if (!originIsland || !destIsland) return null;
  return roroRoutes[`${originIsland}-${destIsland}`] || roroRoutes[`${destIsland}-${originIsland}`] || null;
}

// Weather conditions for routes
const routeWeather: Record<string, { condition: string; icon: "sun" | "cloud" | "rain"; warning?: string }> = {
  "Manila-Cebu": { condition: "Partly Cloudy", icon: "cloud" },
  "Manila-Davao": { condition: "Clear Skies", icon: "sun" },
  "Manila-Naga": { condition: "Rain expected in Bicol", icon: "rain", warning: "Tropical depression approaching Bicol region" },
  "Manila-Baguio": { condition: "Foggy in Benguet", icon: "cloud", warning: "Low visibility on Kennon Road" },
  "Cebu-CDO": { condition: "Clear", icon: "sun" },
  "Laguna-Taguig": { condition: "Clear Skies", icon: "sun" },
  "Laguna-Davao": { condition: "Rain expected in Bicol", icon: "rain" },
  "Bataan-Quezon City": { condition: "Clear Skies", icon: "sun" },
  "Makati-Clark": { condition: "Clear Skies", icon: "sun" },
};

function getRouteWeather(origin: string, dest: string) {
  return routeWeather[`${origin}-${dest}`] || routeWeather[`${dest}-${origin}`] || { condition: "Clear Skies", icon: "sun" as const };
}

// Geofence milestones for in-transit shipments
const geofenceMilestones: Record<string, { milestones: { location: string; time: string; type: "entered" | "departed" }[] }> = {
  default_transit: {
    milestones: [
      { location: "Manila Metro", time: "06:30 AM", type: "departed" },
      { location: "Laguna Province", time: "07:45 AM", type: "entered" },
      { location: "Batangas Region", time: "09:00 AM", type: "entered" },
    ],
  },
  default_interisland: {
    milestones: [
      { location: "Manila Metro", time: "05:00 AM", type: "departed" },
      { location: "Batangas Port Area", time: "07:30 AM", type: "entered" },
      { location: "Port Loading Zone", time: "08:15 AM", type: "entered" },
    ],
  },
};

// Delay info for specific shipments
const delayInfo: Record<string, { delayed: boolean; delayHours: number; reason: string }> = {};

// Mock driver info
const driverInfo: Record<string, { name: string; phone: string }> = {
  "Santos Trucking Co.": { name: "Juan dela Cruz", phone: "+63 917 123 4567" },
  "FastHaul Logistics": { name: "Pedro Santos", phone: "+63 918 234 5678" },
  "Island Cargo Express": { name: "Miguel Reyes", phone: "+63 919 345 6789" },
  "Visayas Freight": { name: "Carlos Garcia", phone: "+63 920 456 7890" },
  "Metro Express Cargo": { name: "Ramon Flores", phone: "+63 921 567 8901" },
};

// Photo proof mock data
interface PhotoProof {
  type: string;
  label: string;
  timestamp: string | null;
  available: boolean;
}

function getPhotoProofs(status: string): PhotoProof[] {
  if (status === "delivered") {
    return [
      { type: "pickup", label: "Pickup Photo", timestamp: "Mar 14, 8:00 AM", available: true },
      { type: "cargo", label: "Cargo Loaded", timestamp: "Mar 14, 8:15 AM", available: true },
      { type: "delivery", label: "Delivery Photo", timestamp: "Mar 14, 2:30 PM", available: true },
    ];
  }
  return [
    { type: "pickup", label: "Pickup Photo", timestamp: "Mar 19, 6:30 AM", available: true },
    { type: "cargo", label: "Cargo Loaded", timestamp: "Mar 19, 6:45 AM", available: true },
    { type: "delivery", label: "Delivery Photo", timestamp: null, available: false },
  ];
}

// Calculate "X minutes ago" from a timestamp string
function getTimeAgo(timestamp: string): string {
  const now = new Date("2026-03-20T10:30:00");
  const updated = new Date(timestamp.replace(" ", "T"));
  const diffMs = now.getTime() - updated.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ${diffMins % 60}m ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ${diffHours % 24}h ago`;
}

// ETA countdown calculator
function getETACountdown(eta: string): { hours: number; minutes: number; total: number } | null {
  if (eta === "Delivered" || !eta) return null;
  const now = new Date("2026-03-20T10:30:00");
  const etaDate = new Date(eta + "T18:00:00");
  const diffMs = etaDate.getTime() - now.getTime();
  if (diffMs <= 0) return null;
  const hours = Math.floor(diffMs / 3600000);
  const minutes = Math.floor((diffMs % 3600000) / 60000);
  return { hours, minutes, total: diffMs };
}

const trackingData = loads
  .filter((l) => l.status === "in_transit" || l.status === "delivered")
  .map((load) => {
    const booking = bookings.find((b) => b.loadId === load.id);
    const isInterIsland = load.interIsland;

    let currentStep: number;
    if (load.status === "delivered") {
      currentStep = isInterIsland ? 4 : 2;
    } else if (isInterIsland) {
      if (load.id === "LD-2026-010") currentStep = 3;
      else currentStep = 2;
    } else {
      currentStep = 1;
    }

    const dist = getDistance(load.pickupCity, load.deliveryCity);
    const roro = getRoroRoute(load.originIsland, load.destIsland);

    // Calculate progress percentage for map
    const totalSteps = isInterIsland ? 4 : 2;
    const progressPct = Math.min(100, Math.round((currentStep / totalSteps) * 100));

    // Distance remaining
    const distRemaining = load.status === "delivered" ? 0 : Math.round(dist * (1 - progressPct / 100));

    const lastUpdateRaw = load.status === "delivered" ? "2026-03-14 14:30" : "2026-03-19 09:15";

    // Weather for route
    const weather = getRouteWeather(load.pickupCity, load.deliveryCity);

    // Delay simulation — first in-transit load gets a delay
    const isDelayed = load.status === "in_transit" && load.id === loads.filter(l => l.status === "in_transit")[0]?.id;

    // Driver info
    const carrierName = booking?.carrier ?? "Santos Trucking Co.";
    const driver = driverInfo[carrierName] || { name: "Driver Assigned", phone: "+63 917 000 0000" };

    return {
      id: load.id,
      pickupCity: load.pickupCity,
      deliveryCity: load.deliveryCity,
      cargo: load.commodity,
      cargoType: load.cargoType,
      carrier: booking?.carrier ?? "Pending Assignment",
      vehicle: booking?.vehicle ?? load.vehicleNeeded,
      plateNo: booking?.plateNo ?? "---",
      status: load.status as "in_transit" | "delivered",
      interIsland: isInterIsland,
      originIsland: load.originIsland,
      destIsland: load.destIsland,
      currentStep,
      lastUpdate: lastUpdateRaw,
      lastUpdateAgo: getTimeAgo(lastUpdateRaw),
      lastLocation: load.status === "delivered"
        ? load.deliveryCity
        : isInterIsland
          ? (currentStep >= 3 ? `En route via vessel (${load.originIsland} to ${load.destIsland})` : `Port of ${load.pickupCity}`)
          : `En route to ${load.deliveryCity}`,
      eta: load.status === "delivered" ? "Delivered" : load.deliveryDate ?? load.pickupDate,
      tempReq: load.tempRequirement,
      distance: dist,
      distRemaining,
      roro,
      progressPct,
      weather,
      isDelayed,
      delayHours: isDelayed ? 2 : 0,
      delayReason: isDelayed ? "Heavy traffic on SLEX" : "",
      driver,
      photoProofs: getPhotoProofs(load.status),
      geofence: isInterIsland ? geofenceMilestones.default_interisland : geofenceMilestones.default_transit,
      etaCountdown: getETACountdown(load.status === "delivered" ? "Delivered" : (load.deliveryDate ?? load.pickupDate)),
    };
  });

export default function TrackingPage() {
  // Pulse animation for live indicator
  const [pulse, setPulse] = useState(true);
  useEffect(() => {
    const interval = setInterval(() => setPulse(p => !p), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <DashboardLayout activeNav="/dashboard/tracking">
      <style>{`
        @keyframes livePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.3); }
        }
        @keyframes countdownGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(217, 119, 6, 0.2); }
          50% { box-shadow: 0 0 0 8px rgba(217, 119, 6, 0); }
        }
        @keyframes delayPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.85; }
        }
      `}</style>

      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827", margin: 0 }}>Track Shipments</h1>
        <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>Monitor your in-transit and delivered loads in real time</p>
      </div>

      {/* Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 20 }}>
        <div style={s.summaryCard}>
          <div style={{ ...s.summaryIcon, background: "#E0E7FF", color: "#3730A3" }}><Truck size={18} /></div>
          <div><div style={{ fontSize: 20, fontWeight: 800, color: "#111827" }}>{trackingData.filter((t) => t.status === "in_transit").length}</div><div style={{ fontSize: 12, color: "#9CA3AF" }}>In Transit</div></div>
        </div>
        <div style={s.summaryCard}>
          <div style={{ ...s.summaryIcon, background: "#DCFCE7", color: "#166534" }}><CheckCircle2 size={18} /></div>
          <div><div style={{ fontSize: 20, fontWeight: 800, color: "#111827" }}>{trackingData.filter((t) => t.status === "delivered").length}</div><div style={{ fontSize: 12, color: "#9CA3AF" }}>Delivered</div></div>
        </div>
        <div style={s.summaryCard}>
          <div style={{ ...s.summaryIcon, background: "#DBEAFE", color: "#1E40AF" }}><Anchor size={18} /></div>
          <div><div style={{ fontSize: 20, fontWeight: 800, color: "#111827" }}>{trackingData.filter((t) => t.interIsland).length}</div><div style={{ fontSize: 12, color: "#9CA3AF" }}>Inter-Island</div></div>
        </div>
        <div style={s.summaryCard}>
          <div style={{ ...s.summaryIcon, background: "#FEF2F2", color: "#DC2626" }}><AlertTriangle size={18} /></div>
          <div><div style={{ fontSize: 20, fontWeight: 800, color: "#111827" }}>{trackingData.filter((t) => t.isDelayed).length}</div><div style={{ fontSize: 12, color: "#9CA3AF" }}>Delayed</div></div>
        </div>
      </div>

      {trackingData.length === 0 && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 60, background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12 }}>
          <Navigation size={40} color="#D1D5DB" />
          <p style={{ color: "#6B7280", marginTop: 12 }}>No shipments to track right now.</p>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {trackingData.map((item) => {
          const steps = item.interIsland ? interIslandSteps : regularSteps;
          const stepIcons = item.interIsland
            ? [Truck, Navigation, Anchor, Ship, CheckCircle2]
            : [Truck, Navigation, CheckCircle2];

          const WeatherIcon = item.weather.icon === "rain" ? CloudRain : item.weather.icon === "cloud" ? Cloud : Sun;
          const weatherColor = item.weather.icon === "rain" ? "#2563EB" : item.weather.icon === "cloud" ? "#6B7280" : "#F59E0B";

          return (
            <div key={item.id} style={{ ...s.card, border: item.isDelayed ? "2px solid #FCA5A5" : "1px solid #E5E7EB" }}>
              {/* Delay Banner */}
              {item.isDelayed && (
                <div style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "12px 20px", marginBottom: 16,
                  background: "linear-gradient(135deg, #FEF2F2, #FEE2E2)", borderRadius: 10,
                  border: "1px solid #FECACA", animation: "delayPulse 3s infinite",
                }}>
                  <AlertTriangle size={18} color="#DC2626" />
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#DC2626" }}>Delayed by ~{item.delayHours} hours</span>
                    <span style={{ fontSize: 12, color: "#991B1B", marginLeft: 12 }}>{item.delayReason}</span>
                  </div>
                  <span style={{ fontSize: 11, color: "#DC2626", fontWeight: 600, background: "#FEE2E2", padding: "3px 10px", borderRadius: 6 }}>DELAY ALERT</span>
                </div>
              )}

              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Link href={`/dashboard/loads/${item.id}`} style={{ fontSize: 13, fontWeight: 700, color: "#2563EB", textDecoration: "none" }}>{item.id}</Link>
                    {/* LIVE indicator */}
                    {item.status === "in_transit" && (
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: 5, fontSize: 10, fontWeight: 700,
                        color: "#059669", background: "#ECFDF5", padding: "3px 10px", borderRadius: 999,
                        border: "1px solid #A7F3D0",
                      }}>
                        <span style={{
                          display: "inline-block", width: 8, height: 8, borderRadius: "50%",
                          background: "#10B981", animation: "livePulse 1.5s ease-in-out infinite",
                        }} />
                        LIVE
                      </span>
                    )}
                    {item.interIsland && (
                      <span style={{ fontSize: 10, background: "#DBEAFE", color: "#1E40AF", padding: "2px 8px", borderRadius: 4, fontWeight: 600 }}>
                        INTER-ISLAND: {item.originIsland} &rarr; {item.destIsland}
                      </span>
                    )}
                    {item.tempReq && (
                      <span style={{ fontSize: 10, background: "#FEF3C7", color: "#92400E", padding: "2px 8px", borderRadius: 4, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 3 }}>
                        <Thermometer size={10} /> {item.tempReq}
                      </span>
                    )}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 15, fontWeight: 600, color: "#111827", marginTop: 4 }}>
                    <MapPin size={14} color="#9CA3AF" />
                    {item.pickupCity} &rarr; {item.deliveryCity}
                  </div>
                  {/* Weather indicator */}
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
                    <WeatherIcon size={14} color={weatherColor} />
                    <span style={{ fontSize: 12, color: weatherColor, fontWeight: 500 }}>{item.weather.condition}</span>
                    {item.weather.warning && (
                      <span style={{ fontSize: 11, color: "#DC2626", fontWeight: 500, marginLeft: 4 }}>
                        — {item.weather.warning}
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                  <span style={{
                    display: "inline-block", padding: "4px 12px", borderRadius: 999, fontSize: 12, fontWeight: 600,
                    background: item.status === "delivered" ? "#DCFCE7" : item.isDelayed ? "#FEE2E2" : "#E0E7FF",
                    color: item.status === "delivered" ? "#166534" : item.isDelayed ? "#DC2626" : "#3730A3",
                  }}>
                    {item.status === "delivered" ? "Delivered" : item.isDelayed ? "Delayed" : "In Transit"}
                  </span>
                  {/* ETA Countdown */}
                  {item.etaCountdown && item.status === "in_transit" ? (
                    <div style={{
                      padding: "10px 16px", borderRadius: 10,
                      background: "linear-gradient(135deg, #FFFBEB, #FEF3C7)",
                      border: "1px solid #FDE68A",
                      animation: "countdownGlow 3s infinite",
                      textAlign: "center",
                    }}>
                      <div style={{ fontSize: 9, fontWeight: 700, color: "#92400E", textTransform: "uppercase" as const, letterSpacing: 1 }}>
                        ARRIVING IN
                      </div>
                      <div style={{ fontSize: 22, fontWeight: 900, color: "#D97706", fontVariantNumeric: "tabular-nums", lineHeight: 1.2 }}>
                        {item.isDelayed
                          ? `${item.etaCountdown.hours + item.delayHours}h ${item.etaCountdown.minutes}m`
                          : `${item.etaCountdown.hours}h ${item.etaCountdown.minutes}m`
                        }
                      </div>
                      {item.isDelayed && (
                        <div style={{ fontSize: 9, color: "#DC2626", fontWeight: 600, marginTop: 2 }}>
                          +{item.delayHours}h from original ETA
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{
                      padding: "6px 12px", borderRadius: 8,
                      background: item.eta === "Delivered" ? "#F0FDF4" : "#FFFBEB",
                      border: `1px solid ${item.eta === "Delivered" ? "#BBF7D0" : "#FDE68A"}`,
                    }}>
                      <div style={{ fontSize: 9, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase" as const, letterSpacing: 0.5 }}>
                        {item.eta === "Delivered" ? "COMPLETED" : "ETA"}
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: item.eta === "Delivered" ? "#059669" : "#D97706" }}>
                        {item.eta}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Details */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16, marginBottom: 20, padding: "12px 0", borderTop: "1px solid #F3F4F6", borderBottom: "1px solid #F3F4F6" }}>
                <div style={s.detailItem}><span style={s.detailLabel}>Cargo</span><span style={s.detailValue}>{item.cargo}</span><span style={{ fontSize: 10, color: "#9CA3AF" }}>{item.cargoType}</span></div>
                <div style={s.detailItem}><span style={s.detailLabel}>Carrier</span><span style={s.detailValue}>{item.carrier}</span></div>
                <div style={s.detailItem}>
                  <span style={s.detailLabel}>Vehicle / Plate</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <VehicleIcon type={item.vehicle} size={24} color="#6B7280" />
                    <span style={s.detailValue}>{item.vehicle}</span>
                  </div>
                  <span style={{ fontSize: 11, color: "#6B7280", fontFamily: "monospace" }}>{item.plateNo}</span>
                </div>
                <div style={s.detailItem}><span style={s.detailLabel}>Last Location</span><span style={s.detailValue}>{item.lastLocation}</span></div>
                <div style={s.detailItem}>
                  <span style={s.detailLabel}>Last Update</span>
                  <span style={{ ...s.detailValue, display: "flex", alignItems: "center", gap: 4 }}><Clock size={12} color="#9CA3AF" />{item.lastUpdate}</span>
                  <span style={{ fontSize: 10, color: item.status === "in_transit" ? "#2563EB" : "#9CA3AF", fontWeight: 600, display: "flex", alignItems: "center", gap: 3, marginTop: 2 }}>
                    <Timer size={10} /> {item.lastUpdateAgo}
                  </span>
                </div>
              </div>

              {/* Driver Contact & Customer Communication */}
              {item.status === "in_transit" && (
                <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                  <button style={{
                    display: "flex", alignItems: "center", gap: 8, padding: "10px 20px",
                    background: "#059669", color: "#FFFFFF", border: "none", borderRadius: 10,
                    fontSize: 13, fontWeight: 700, cursor: "pointer", flex: 1, justifyContent: "center",
                  }}>
                    <Phone size={15} />
                    Call Driver — {item.driver.name}
                  </button>
                  <button style={{
                    display: "flex", alignItems: "center", gap: 8, padding: "10px 20px",
                    background: "#2563EB", color: "#FFFFFF", border: "none", borderRadius: 10,
                    fontSize: 13, fontWeight: 700, cursor: "pointer", flex: 1, justifyContent: "center",
                  }}>
                    <Send size={15} />
                    Send Update to Customer
                  </button>
                </div>
              )}

              {/* Geofence Milestones */}
              <div style={{ marginBottom: 16, padding: "14px 18px", background: "#FAFAFA", borderRadius: 10, border: "1px solid #E5E7EB" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                  <MapPinned size={14} color="#6B7280" />
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#374151", textTransform: "uppercase" as const, letterSpacing: 0.5 }}>Geofence Milestones</span>
                </div>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  {item.geofence.milestones.map((m, idx) => (
                    <div key={idx} style={{
                      display: "flex", alignItems: "center", gap: 8, padding: "6px 14px",
                      background: m.type === "departed" ? "#FEF2F2" : "#ECFDF5",
                      border: `1px solid ${m.type === "departed" ? "#FECACA" : "#A7F3D0"}`,
                      borderRadius: 8,
                    }}>
                      <div style={{
                        width: 6, height: 6, borderRadius: "50%",
                        background: m.type === "departed" ? "#EF4444" : "#10B981",
                      }} />
                      <span style={{ fontSize: 12, fontWeight: 600, color: m.type === "departed" ? "#991B1B" : "#065F46" }}>
                        {m.type === "departed" ? "Departed" : "Entered"} {m.location}
                      </span>
                      <span style={{ fontSize: 10, color: "#9CA3AF" }}>{m.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Route details */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, padding: "10px 14px", background: "#F9FAFB", borderRadius: 8, border: "1px solid #E5E7EB" }}>
                <Route size={16} color="#6B7280" />
                <div style={{ display: "flex", alignItems: "center", gap: 16, flex: 1, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 12, color: "#374151", fontWeight: 600 }}>
                    Distance: ~{item.distance} km
                  </span>
                  {item.status !== "delivered" && (
                    <>
                      <span style={{ fontSize: 11, color: "#9CA3AF" }}>|</span>
                      <span style={{ fontSize: 12, color: "#D97706", fontWeight: 600 }}>
                        ~{item.distRemaining} km remaining
                      </span>
                    </>
                  )}
                  {item.status === "delivered" && (
                    <>
                      <span style={{ fontSize: 11, color: "#9CA3AF" }}>|</span>
                      <span style={{ fontSize: 12, color: "#059669", fontWeight: 600 }}>
                        Completed
                      </span>
                    </>
                  )}
                  {item.roro && (
                    <>
                      <span style={{ fontSize: 11, color: "#9CA3AF" }}>|</span>
                      <span style={{ fontSize: 12, color: "#1E40AF", fontWeight: 500, display: "flex", alignItems: "center", gap: 4 }}>
                        <Ship size={12} />
                        {item.roro.via}
                      </span>
                      <span style={{ fontSize: 11, color: "#9CA3AF" }}>|</span>
                      <span style={{ fontSize: 11, color: "#6B7280" }}>
                        {item.roro.origin} &rarr; {item.roro.dest}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Route visualization */}
              <div style={{ marginBottom: 16, background: "#F0F9FF", border: "1px solid #BAE6FD", borderRadius: 10, padding: "20px 24px", position: "relative", overflow: "hidden" }}>
                {/* Route header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#1E40AF", textTransform: "uppercase" as const, letterSpacing: 0.5 }}>Route Progress</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#2563EB" }}>{item.progressPct}% complete</span>
                </div>

                {/* Main route bar */}
                <div style={{ position: "relative", height: 56, display: "flex", alignItems: "center" }}>
                  {/* Origin marker */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 2, width: 70 }}>
                    <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#059669", border: "3px solid #fff", boxShadow: "0 0 0 2px #059669" }} />
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#059669", marginTop: 6, whiteSpace: "nowrap" }}>{item.pickupCity}</span>
                    <span style={{ fontSize: 8, color: "#6B7280", marginTop: 1 }}>Origin</span>
                  </div>

                  {/* Road / progress bar */}
                  <div style={{ flex: 1, position: "relative", height: 8, margin: "0 8px" }}>
                    {/* Background road (gray remaining) */}
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 8, background: "#D1D5DB", borderRadius: 4 }} />
                    {/* Completed portion (green) */}
                    <div style={{ position: "absolute", top: 0, left: 0, width: `${item.progressPct}%`, height: 8, background: "linear-gradient(90deg, #059669, #10B981)", borderRadius: 4, transition: "width 0.3s" }} />
                    {/* Road dashes */}
                    <div style={{ position: "absolute", top: 3, left: 0, right: 0, height: 2, backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(255,255,255,0.4) 10px, rgba(255,255,255,0.4) 16px)", borderRadius: 1 }} />

                    {/* Inter-island port markers */}
                    {item.interIsland && (
                      <>
                        {/* Origin port */}
                        <div style={{ position: "absolute", left: "30%", top: -20, transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", zIndex: 2 }}>
                          <div style={{ background: item.currentStep >= 2 ? "#1E40AF" : "#94A3B8", borderRadius: 6, padding: "3px 5px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Anchor size={11} color="#fff" />
                          </div>
                          <span style={{ fontSize: 8, fontWeight: 600, color: "#1E40AF", marginTop: 28, whiteSpace: "nowrap" }}>
                            {item.roro?.origin?.split("(")[0]?.trim()?.split(" ").slice(-1)[0] || "Port"}
                          </span>
                        </div>
                        {/* Vessel segment indicator */}
                        <div style={{ position: "absolute", left: "30%", right: "30%", top: -4, height: 2, background: item.currentStep >= 3 ? "#1E40AF" : "#CBD5E1", borderRadius: 1 }} />
                        {/* Destination port */}
                        <div style={{ position: "absolute", left: "70%", top: -20, transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", zIndex: 2 }}>
                          <div style={{ background: item.currentStep >= 3 ? "#1E40AF" : "#94A3B8", borderRadius: 6, padding: "3px 5px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Ship size={11} color="#fff" />
                          </div>
                          <span style={{ fontSize: 8, fontWeight: 600, color: "#1E40AF", marginTop: 28, whiteSpace: "nowrap" }}>
                            {item.roro?.dest?.split("(")[0]?.trim()?.split(" ").slice(-1)[0] || "Port"}
                          </span>
                        </div>
                      </>
                    )}

                    {/* Current location marker (truck at progress %) */}
                    {item.status !== "delivered" && (
                      <div style={{
                        position: "absolute",
                        left: `${item.progressPct}%`,
                        top: -18,
                        transform: "translateX(-50%)",
                        zIndex: 4,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}>
                        <div style={{
                          background: "#2563EB",
                          borderRadius: 8,
                          padding: "4px 8px",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          justifyContent: "center",
                          boxShadow: "0 2px 8px rgba(37,99,235,0.35)",
                        }}>
                          <Truck size={14} color="#fff" />
                        </div>
                        <div style={{ fontSize: 8, fontWeight: 700, color: "#2563EB", marginTop: 30, whiteSpace: "nowrap", textAlign: "center", maxWidth: 80 }}>
                          {item.lastLocation.length > 25 ? item.lastLocation.slice(0, 22) + "..." : item.lastLocation}
                        </div>
                      </div>
                    )}

                    {/* Delivered checkmark at end */}
                    {item.status === "delivered" && (
                      <div style={{ position: "absolute", right: -4, top: -10, zIndex: 4 }}>
                        <div style={{ background: "#059669", borderRadius: "50%", width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 6px rgba(5,150,105,0.3)" }}>
                          <CheckCircle2 size={14} color="#fff" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Destination marker */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 2, width: 70 }}>
                    <div style={{
                      width: 14, height: 14, borderRadius: "50%",
                      background: item.status === "delivered" ? "#059669" : "#DC2626",
                      border: "3px solid #fff",
                      boxShadow: `0 0 0 2px ${item.status === "delivered" ? "#059669" : "#DC2626"}`,
                    }} />
                    <span style={{ fontSize: 10, fontWeight: 700, color: item.status === "delivered" ? "#059669" : "#DC2626", marginTop: 6, whiteSpace: "nowrap" }}>{item.deliveryCity}</span>
                    <span style={{ fontSize: 8, color: "#6B7280", marginTop: 1 }}>Destination</span>
                  </div>
                </div>

                {/* Bottom info row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14, paddingTop: 10, borderTop: "1px solid #BAE6FD" }}>
                  <span style={{ fontSize: 10, color: "#6B7280" }}>
                    ~{item.distance} km total {item.interIsland ? "(incl. sea crossing)" : "(road)"}
                  </span>
                  {item.status !== "delivered" && (
                    <span style={{ fontSize: 10, fontWeight: 600, color: "#D97706", display: "flex", alignItems: "center", gap: 4 }}>
                      <Navigation size={10} /> ~{item.distRemaining} km remaining
                    </span>
                  )}
                  <span style={{ fontSize: 10, color: "#6B7280", display: "flex", alignItems: "center", gap: 4 }}>
                    <Timer size={10} /> Last Updated: {item.lastUpdateAgo}
                  </span>
                </div>
              </div>

              {/* Photo Proof Updates */}
              <div style={{ marginBottom: 16, padding: "14px 18px", background: "#FAFAFA", borderRadius: 10, border: "1px solid #E5E7EB" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
                  <Camera size={14} color="#6B7280" />
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#374151", textTransform: "uppercase" as const, letterSpacing: 0.5 }}>Photo Proof Updates</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                  {item.photoProofs.map((photo, idx) => (
                    <div key={idx} style={{
                      display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                      padding: "14px 10px", borderRadius: 10,
                      background: photo.available ? "#F0FDF4" : "#F9FAFB",
                      border: `1px dashed ${photo.available ? "#A7F3D0" : "#D1D5DB"}`,
                    }}>
                      <div style={{
                        width: 48, height: 48, borderRadius: 8,
                        background: photo.available ? "#DCFCE7" : "#E5E7EB",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        {photo.available
                          ? <Image size={22} color="#059669" />
                          : <Camera size={22} color="#9CA3AF" />
                        }
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 600, color: photo.available ? "#065F46" : "#9CA3AF" }}>{photo.label}</span>
                      {photo.timestamp ? (
                        <span style={{ fontSize: 10, color: "#6B7280" }}>{photo.timestamp}</span>
                      ) : (
                        <span style={{ fontSize: 10, color: "#D1D5DB", fontStyle: "italic" }}>Pending</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress tracker */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                {steps.map((step, idx) => {
                  const isCompleted = idx <= item.currentStep;
                  const isCurrent = idx === item.currentStep;
                  const StepIcon = stepIcons[idx];
                  return (
                    <div key={step} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                        {idx > 0 && <div style={{ flex: 1, height: 3, background: idx <= item.currentStep ? "#2563EB" : "#E5E7EB", borderRadius: 2 }} />}
                        <div style={{
                          width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                          background: isCompleted ? "#2563EB" : "#F3F4F6", color: isCompleted ? "#fff" : "#9CA3AF", flexShrink: 0,
                          border: isCurrent ? "2px solid #93C5FD" : "none",
                          boxShadow: isCurrent ? "0 0 0 4px rgba(59,130,246,0.1)" : "none",
                        }}>
                          {isCompleted ? <StepIcon size={14} /> : <Circle size={14} />}
                        </div>
                        {idx < steps.length - 1 && <div style={{ flex: 1, height: 3, background: idx < item.currentStep ? "#2563EB" : "#E5E7EB", borderRadius: 2 }} />}
                      </div>
                      <span style={{ fontSize: 10, fontWeight: isCurrent ? 700 : 500, color: isCompleted ? "#2563EB" : "#9CA3AF", marginTop: 6, textAlign: "center" }}>{step}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}

const s: Record<string, React.CSSProperties> = {
  summaryCard: { display: "flex", alignItems: "center", gap: 14, background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: "18px 20px" },
  summaryIcon: { width: 44, height: 44, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" },
  card: { background: "#fff", borderRadius: 12, padding: "20px 24px" },
  detailItem: { display: "flex", flexDirection: "column", gap: 2 },
  detailLabel: { fontSize: 10, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase" as const, letterSpacing: 0.5 },
  detailValue: { fontSize: 13, fontWeight: 500, color: "#374151" },
};
