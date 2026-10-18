"use client";
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  MapPin, Truck, Fuel, DollarSign, Clock, Route, Leaf, Ship, Calculator,
  ArrowRight, ChevronDown, Plus, X, Save, Calendar, User, CloudRain, Sun,
  Cloud, Coffee, History, FileText, CheckCircle2, AlertCircle,
} from "lucide-react";

const cities = [
  "Manila", "Cebu City", "Davao City", "Cagayan de Oro", "Zamboanga City",
  "Bacolod", "Iloilo City", "General Santos", "Batangas", "Clark/Pampanga",
];

const vehicleTypes = [
  { label: "4-Wheeler (Van)", fuelPer100km: 12, icon: "van" },
  { label: "6-Wheeler Truck", fuelPer100km: 18, icon: "6w" },
  { label: "10-Wheeler Truck", fuelPer100km: 28, icon: "10w" },
  { label: "Trailer (40ft)", fuelPer100km: 38, icon: "trailer" },
];

const DIESEL_PRICE = 58; // PHP per liter

// Fleet vehicles for assignment
const fleetVehicles = [
  { id: "FV-001", plate: "ABC 1234", type: "6-Wheeler Truck", status: "Available" },
  { id: "FV-002", plate: "DEF 5678", type: "10-Wheeler Truck", status: "Available" },
  { id: "FV-003", plate: "GHI 9012", type: "Trailer (40ft)", status: "Available" },
  { id: "FV-004", plate: "JKL 3456", type: "4-Wheeler (Van)", status: "In Use" },
  { id: "FV-005", plate: "MNO 7890", type: "6-Wheeler Truck", status: "Available" },
];

// Drivers for assignment
const drivers = [
  { id: "DRV-001", name: "Juan dela Cruz", license: "N04-12-345678", status: "Available" },
  { id: "DRV-002", name: "Pedro Santos", license: "N07-15-234567", status: "Available" },
  { id: "DRV-003", name: "Miguel Reyes", license: "N01-18-345678", status: "On Route" },
  { id: "DRV-004", name: "Carlos Garcia", license: "N03-20-456789", status: "Available" },
  { id: "DRV-005", name: "Ramon Flores", license: "N09-16-567890", status: "Available" },
];

// Historical route data
const historicalRoutes: Record<string, { lastDate: string; duration: string; cost: string; notes: string }> = {
  "Batangas-Manila": { lastDate: "Mar 10, 2026", duration: "2.8 hours", cost: "4,200", notes: "Light traffic, no delays" },
  "Cebu City-Manila": { lastDate: "Mar 5, 2026", duration: "24 hours", cost: "22,500", notes: "Vessel delayed 2 hours at port" },
  "Clark/Pampanga-Manila": { lastDate: "Mar 12, 2026", duration: "1.8 hours", cost: "3,100", notes: "NLEX congested near Valenzuela" },
  "Cagayan de Oro-Davao City": { lastDate: "Mar 8, 2026", duration: "11 hours", cost: "12,400", notes: "Road construction near Bukidnon" },
  "Davao City-Manila": { lastDate: "Feb 28, 2026", duration: "52 hours", cost: "31,800", notes: "Vessel schedule change" },
};

// Weather forecast data
const weatherForecast = [
  { day: "Today", date: "Mar 20", icon: "sun" as const, temp: "32°C", condition: "Sunny" },
  { day: "Tomorrow", date: "Mar 21", icon: "cloud" as const, temp: "29°C", condition: "Cloudy" },
  { day: "Mar 22", date: "Mar 22", icon: "rain" as const, temp: "27°C", condition: "Rain" },
];

// Rest stop suggestions for long routes
const restStops: Record<string, { name: string; km: number; facilities: string }[]> = {
  "Batangas-Manila": [
    { name: "Petron SLEX Calamba", km: 45, facilities: "Fuel, restrooms, food court" },
  ],
  "Clark/Pampanga-Manila": [
    { name: "Shell NLEX Marilao", km: 55, facilities: "Fuel, convenience store, restrooms" },
  ],
  "Cagayan de Oro-Davao City": [
    { name: "Valencia Rest Area", km: 65, facilities: "Fuel, restrooms, eateries" },
    { name: "Malaybalay Truck Stop", km: 140, facilities: "Fuel, parking, overnight rest" },
    { name: "Maramag Service Area", km: 210, facilities: "Fuel, restrooms, mechanic" },
    { name: "Bukidnon Plateau Rest", km: 320, facilities: "Fuel, food stalls" },
  ],
  "Cebu City-Manila": [
    { name: "Cebu Port Rest Area", km: 15, facilities: "Restrooms, waiting lounge" },
  ],
  "Davao City-Manila": [
    { name: "Sasa Port Lounge", km: 10, facilities: "Restrooms, canteen" },
  ],
};

// Saved route plans
interface SavedRoute {
  id: string;
  origin: string;
  destination: string;
  stops: string[];
  vehicle: string;
  driver: string;
  savedDate: string;
  totalCost: string;
  totalTime: string;
}

const initialSavedRoutes: SavedRoute[] = [
  {
    id: "RP-001",
    origin: "Clark/Pampanga",
    destination: "Batangas",
    stops: ["Manila"],
    vehicle: "FV-002 — 10-Wheeler Truck (DEF 5678)",
    driver: "Pedro Santos",
    savedDate: "Mar 15, 2026",
    totalCost: "7,800",
    totalTime: "4.5 hrs",
  },
  {
    id: "RP-002",
    origin: "Manila",
    destination: "Davao City",
    stops: [],
    vehicle: "FV-003 — Trailer (GHI 9012)",
    driver: "Juan dela Cruz",
    savedDate: "Mar 12, 2026",
    totalCost: "31,200",
    totalTime: "50 hrs",
  },
  {
    id: "RP-003",
    origin: "Cebu City",
    destination: "Cagayan de Oro",
    stops: [],
    vehicle: "FV-001 — 6-Wheeler (ABC 1234)",
    driver: "Carlos Garcia",
    savedDate: "Mar 10, 2026",
    totalCost: "18,500",
    totalTime: "12 hrs",
  },
];

interface RouteOption {
  name: string;
  distanceKm: number;
  driveHours: number;
  tollways: { name: string; fee: number }[];
  isInterIsland: boolean;
  roroDetails?: { route: string; fare: number; hours: number };
}

// Mock route database
function getRoutes(origin: string, destination: string): RouteOption[] {
  const key = [origin, destination].sort().join("-");

  const routeDB: Record<string, RouteOption[]> = {
    "Cebu City-Manila": [
      {
        name: "Via Shipping (Direct)",
        distanceKm: 50,
        driveHours: 2,
        tollways: [],
        isInterIsland: true,
        roroDetails: { route: "Manila Port \u2192 Cebu Port", fare: 18000, hours: 20 },
      },
      {
        name: "Via RORO (Batangas-Calapan-Mindoro-Panay-Cebu)",
        distanceKm: 380,
        driveHours: 10,
        tollways: [{ name: "SLEX", fee: 150 }, { name: "STAR", fee: 100 }],
        isInterIsland: true,
        roroDetails: { route: "Multi-island RORO hop", fare: 12000, hours: 14 },
      },
    ],
    "Batangas-Manila": [
      {
        name: "Via SLEX + STAR Tollway",
        distanceKm: 110,
        driveHours: 2.5,
        tollways: [{ name: "SLEX", fee: 150 }, { name: "STAR", fee: 100 }],
        isInterIsland: false,
      },
      {
        name: "Via Coastal Road (No Toll)",
        distanceKm: 130,
        driveHours: 3.5,
        tollways: [],
        isInterIsland: false,
      },
    ],
    "Clark/Pampanga-Manila": [
      {
        name: "Via NLEX",
        distanceKm: 83,
        driveHours: 1.5,
        tollways: [{ name: "NLEX", fee: 200 }],
        isInterIsland: false,
      },
      {
        name: "Via SCTEX + NLEX",
        distanceKm: 95,
        driveHours: 1.75,
        tollways: [{ name: "SCTEX", fee: 250 }, { name: "NLEX", fee: 200 }],
        isInterIsland: false,
      },
    ],
    "Davao City-Manila": [
      {
        name: "Via Shipping (Direct)",
        distanceKm: 60,
        driveHours: 2,
        tollways: [],
        isInterIsland: true,
        roroDetails: { route: "Manila Port \u2192 Davao Port", fare: 25000, hours: 48 },
      },
    ],
    "Cagayan de Oro-Davao City": [
      {
        name: "Via National Highway",
        distanceKm: 580,
        driveHours: 10,
        tollways: [],
        isInterIsland: false,
      },
    ],
    "Bacolod-Iloilo City": [
      {
        name: "Via RORO (Dumangas-Bacolod)",
        distanceKm: 30,
        driveHours: 1,
        tollways: [],
        isInterIsland: true,
        roroDetails: { route: "Iloilo (Dumangas) \u2192 Bacolod", fare: 3500, hours: 1.5 },
      },
    ],
  };

  const routes = routeDB[key];
  if (routes) return routes;

  // Generate a default route for any pair
  const baseDist = Math.abs(cities.indexOf(origin) - cities.indexOf(destination)) * 180 + 120;
  const sameIslandGroup: Record<string, string[]> = {
    luzon: ["Manila", "Batangas", "Clark/Pampanga"],
    visayas: ["Cebu City", "Bacolod", "Iloilo City"],
    mindanao: ["Davao City", "Cagayan de Oro", "Zamboanga City", "General Santos"],
  };
  let sameIsland = false;
  for (const group of Object.values(sameIslandGroup)) {
    if (group.includes(origin) && group.includes(destination)) {
      sameIsland = true;
      break;
    }
  }

  if (sameIsland) {
    return [
      {
        name: "Via Main Highway",
        distanceKm: baseDist,
        driveHours: baseDist / 55,
        tollways: baseDist > 200 ? [{ name: "Expressway Toll", fee: 200 }] : [],
        isInterIsland: false,
      },
    ];
  }

  return [
    {
      name: "Via Shipping",
      distanceKm: 80,
      driveHours: 3,
      tollways: [],
      isInterIsland: true,
      roroDetails: { route: `${origin} \u2192 ${destination} (Sea)`, fare: 15000, hours: 24 },
    },
  ];
}

function getHistoricalRoute(origin: string, destination: string) {
  const key = [origin, destination].sort().join("-");
  return historicalRoutes[key] || null;
}

function getRestStops(origin: string, destination: string) {
  const key = [origin, destination].sort().join("-");
  return restStops[key] || [];
}

export default function RoutePlannerPage() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [vehicleIdx, setVehicleIdx] = useState(0);
  const [loadRate, setLoadRate] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [intermediateStops, setIntermediateStops] = useState<string[]>([]);
  const [assignedVehicle, setAssignedVehicle] = useState("");
  const [assignedDriver, setAssignedDriver] = useState("");
  const [savedRoutes, setSavedRoutes] = useState<SavedRoute[]>(initialSavedRoutes);
  const [saveConfirmation, setSaveConfirmation] = useState(false);

  const vehicle = vehicleTypes[vehicleIdx];
  const routes = origin && destination && origin !== destination ? getRoutes(origin, destination) : [];
  const historical = origin && destination ? getHistoricalRoute(origin, destination) : null;
  const routeRestStops = origin && destination ? getRestStops(origin, destination) : [];

  const handleCalculate = () => {
    if (origin && destination && origin !== destination) setShowResults(true);
  };

  const addStop = () => {
    if (intermediateStops.length < 3) {
      setIntermediateStops([...intermediateStops, ""]);
      setShowResults(false);
    }
  };

  const removeStop = (idx: number) => {
    setIntermediateStops(intermediateStops.filter((_, i) => i !== idx));
    setShowResults(false);
  };

  const updateStop = (idx: number, value: string) => {
    const updated = [...intermediateStops];
    updated[idx] = value;
    setIntermediateStops(updated);
    setShowResults(false);
  };

  const handleSaveRoute = () => {
    if (!origin || !destination) return;
    const route = routes[0];
    if (!route) return;
    const fuel = calcFuel(route.distanceKm);
    const toll = calcToll(route.tollways);
    const roro = route.roroDetails?.fare ?? 0;
    const total = fuel + toll + roro;
    const time = totalTime(route);

    const newRoute: SavedRoute = {
      id: `RP-${String(savedRoutes.length + 1).padStart(3, "0")}`,
      origin,
      destination,
      stops: intermediateStops.filter(s => s),
      vehicle: assignedVehicle || "Not assigned",
      driver: assignedDriver || "Not assigned",
      savedDate: "Mar 20, 2026",
      totalCost: total.toLocaleString(),
      totalTime: `${time.toFixed(1)} hrs`,
    };
    setSavedRoutes([newRoute, ...savedRoutes]);
    setSaveConfirmation(true);
    setTimeout(() => setSaveConfirmation(false), 3000);
  };

  const calcFuel = (distKm: number) => Math.round((distKm / 100) * vehicle.fuelPer100km * DIESEL_PRICE);
  const calcToll = (tollways: { name: string; fee: number }[]) => tollways.reduce((sum, t) => sum + t.fee, 0);
  const calcCO2 = (distKm: number) => ((distKm / 100) * vehicle.fuelPer100km * 2.68).toFixed(1);

  const totalCost = (r: RouteOption) => calcFuel(r.distanceKm) + calcToll(r.tollways) + (r.roroDetails?.fare ?? 0);
  const totalTime = (r: RouteOption) => r.driveHours + (r.roroDetails?.hours ?? 0);

  // All used cities (to filter from dropdowns)
  const usedCities = [origin, destination, ...intermediateStops].filter(Boolean);

  return (
    <DashboardLayout>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827", margin: 0 }}>Route Planner</h1>
          <p style={{ fontSize: 14, color: "#6B7280", margin: "4px 0 0" }}>
            Plan multi-stop routes, assign vehicles and drivers, and calculate profitability
          </p>
        </div>

        {/* Weather Forecast Bar */}
        <div style={{
          display: "flex", alignItems: "center", gap: 20, padding: "14px 20px", marginBottom: 20,
          background: "linear-gradient(135deg, #EFF6FF, #F0F9FF)", borderRadius: 12,
          border: "1px solid #BFDBFE",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Cloud size={16} color="#2563EB" />
            <span style={{ fontSize: 13, fontWeight: 700, color: "#1E40AF" }}>Route Weather Forecast</span>
          </div>
          <div style={{ display: "flex", gap: 16, flex: 1, justifyContent: "center" }}>
            {weatherForecast.map((w, idx) => {
              const WIcon = w.icon === "rain" ? CloudRain : w.icon === "cloud" ? Cloud : Sun;
              const iconColor = w.icon === "rain" ? "#2563EB" : w.icon === "cloud" ? "#6B7280" : "#F59E0B";
              return (
                <div key={idx} style={{
                  display: "flex", alignItems: "center", gap: 8, padding: "6px 14px",
                  background: "#FFFFFF", borderRadius: 8, border: "1px solid #E5E7EB",
                }}>
                  <WIcon size={18} color={iconColor} />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#111827" }}>{w.day}</div>
                    <div style={{ fontSize: 11, color: "#6B7280" }}>{w.temp} — {w.condition}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Input Section */}
        <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 16, padding: 28, marginBottom: 24 }}>
          {/* Origin & Destination */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
            <div>
              <label style={s.label}><MapPin size={14} color="#059669" /> Origin</label>
              <select value={origin} onChange={(e) => { setOrigin(e.target.value); setShowResults(false); }} style={s.select}>
                <option value="">Select origin city</option>
                {cities.filter((c) => c !== destination && !intermediateStops.includes(c)).map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={s.label}><MapPin size={14} color="#DC2626" /> Destination</label>
              <select value={destination} onChange={(e) => { setDestination(e.target.value); setShowResults(false); }} style={s.select}>
                <option value="">Select destination city</option>
                {cities.filter((c) => c !== origin && !intermediateStops.includes(c)).map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Intermediate Stops */}
          {intermediateStops.length > 0 && (
            <div style={{ marginBottom: 20, padding: "16px 18px", background: "#FAFAFA", borderRadius: 12, border: "1px solid #E5E7EB" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
                <MapPin size={14} color="#7C3AED" />
                <span style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>Intermediate Stops</span>
                <span style={{ fontSize: 11, color: "#9CA3AF" }}>({intermediateStops.length}/3 stops)</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {intermediateStops.map((stop, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{
                      width: 24, height: 24, borderRadius: "50%", background: "#7C3AED", color: "#FFF",
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0,
                    }}>
                      {idx + 1}
                    </span>
                    <select
                      value={stop}
                      onChange={(e) => updateStop(idx, e.target.value)}
                      style={{ ...s.select, flex: 1 }}
                    >
                      <option value="">Select stop {idx + 1}</option>
                      {cities.filter((c) => !usedCities.includes(c) || c === stop).map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => removeStop(idx)}
                      style={{
                        width: 32, height: 32, borderRadius: 8, border: "1px solid #FECACA",
                        background: "#FEF2F2", color: "#DC2626", cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                      }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add Stop Button */}
          {intermediateStops.length < 3 && (
            <button
              onClick={addStop}
              style={{
                display: "flex", alignItems: "center", gap: 6, padding: "10px 18px",
                borderRadius: 10, border: "1px dashed #D1D5DB", background: "#FAFAFA",
                color: "#6B7280", fontSize: 13, fontWeight: 600, cursor: "pointer",
                marginBottom: 20, width: "100%", justifyContent: "center",
              }}
            >
              <Plus size={14} />
              Add Intermediate Stop ({3 - intermediateStops.length} remaining)
            </button>
          )}

          {/* Vehicle Type */}
          <div style={{ marginBottom: 20 }}>
            <label style={s.label}><Truck size={14} color="#059669" /> Vehicle Type</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
              {vehicleTypes.map((v, i) => (
                <button
                  key={v.label}
                  onClick={() => { setVehicleIdx(i); setShowResults(false); }}
                  style={{
                    padding: "12px 10px",
                    borderRadius: 10,
                    border: vehicleIdx === i ? "2px solid #059669" : "1px solid #E5E7EB",
                    background: vehicleIdx === i ? "#F0FDF4" : "#FFFFFF",
                    cursor: "pointer",
                    textAlign: "center",
                  }}
                >
                  <Truck size={20} color={vehicleIdx === i ? "#059669" : "#9CA3AF"} style={{ marginBottom: 4 }} />
                  <div style={{ fontSize: 12, fontWeight: vehicleIdx === i ? 700 : 500, color: vehicleIdx === i ? "#059669" : "#4B5563" }}>
                    {v.label}
                  </div>
                  <div style={{ fontSize: 10, color: "#9CA3AF" }}>{v.fuelPer100km} L/100km</div>
                </button>
              ))}
            </div>
          </div>

          {/* Vehicle & Driver Assignment */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
            <div>
              <label style={s.label}><Truck size={14} color="#2563EB" /> Assign Fleet Vehicle</label>
              <select value={assignedVehicle} onChange={(e) => setAssignedVehicle(e.target.value)} style={s.select}>
                <option value="">Select a vehicle...</option>
                {fleetVehicles.map((v) => (
                  <option key={v.id} value={`${v.id} — ${v.type} (${v.plate})`} disabled={v.status === "In Use"}>
                    {v.id} — {v.type} ({v.plate}) {v.status === "In Use" ? "[In Use]" : ""}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={s.label}><User size={14} color="#2563EB" /> Assign Driver</label>
              <select value={assignedDriver} onChange={(e) => setAssignedDriver(e.target.value)} style={s.select}>
                <option value="">Select a driver...</option>
                {drivers.map((d) => (
                  <option key={d.id} value={d.name} disabled={d.status === "On Route"}>
                    {d.name} ({d.license}) {d.status === "On Route" ? "[On Route]" : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Historical Route Data */}
          {historical && (
            <div style={{
              display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", marginBottom: 20,
              background: "#FFFBEB", borderRadius: 10, border: "1px solid #FDE68A",
            }}>
              <History size={18} color="#D97706" />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#92400E" }}>Historical Route Data</div>
                <div style={{ fontSize: 12, color: "#78350F", marginTop: 2 }}>
                  This route was last done on <strong>{historical.lastDate}</strong> — took <strong>{historical.duration}</strong>, cost <strong>\u20B1{historical.cost}</strong>
                </div>
                <div style={{ fontSize: 11, color: "#A16207", marginTop: 2 }}>
                  Note: {historical.notes}
                </div>
              </div>
            </div>
          )}

          {/* Route preview (multi-stop) */}
          {origin && destination && intermediateStops.some(s => s) && (
            <div style={{
              display: "flex", alignItems: "center", gap: 8, padding: "12px 18px", marginBottom: 20,
              background: "#F5F3FF", borderRadius: 10, border: "1px solid #DDD6FE",
              flexWrap: "wrap",
            }}>
              <Route size={14} color="#7C3AED" />
              <span style={{ fontSize: 13, fontWeight: 700, color: "#5B21B6" }}>Planned Route:</span>
              <span style={{ fontSize: 13, color: "#059669", fontWeight: 600 }}>{origin}</span>
              {intermediateStops.filter(s => s).map((stop, idx) => (
                <span key={idx} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <ArrowRight size={12} color="#9CA3AF" />
                  <span style={{ fontSize: 13, color: "#7C3AED", fontWeight: 600 }}>{stop}</span>
                </span>
              ))}
              <ArrowRight size={12} color="#9CA3AF" />
              <span style={{ fontSize: 13, color: "#DC2626", fontWeight: 600 }}>{destination}</span>
            </div>
          )}

          <button
            onClick={handleCalculate}
            disabled={!origin || !destination || origin === destination}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: 10,
              border: "none",
              background: origin && destination && origin !== destination ? "#059669" : "#D1D5DB",
              color: "#FFFFFF",
              fontSize: 15,
              fontWeight: 700,
              cursor: origin && destination && origin !== destination ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <Route size={18} /> Calculate Routes
          </button>
        </div>

        {/* Results */}
        {showResults && routes.length > 0 && (
          <>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 16 }}>
              {routes.length} Route{routes.length > 1 ? "s" : ""} Found: {origin} <ArrowRight size={16} style={{ verticalAlign: "middle" }} /> {destination}
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {routes.map((route, idx) => {
                const fuel = calcFuel(route.distanceKm);
                const toll = calcToll(route.tollways);
                const roro = route.roroDetails?.fare ?? 0;
                const total = fuel + toll + roro;
                const time = totalTime(route);
                const co2 = calcCO2(route.distanceKm);
                const rate = parseFloat(loadRate) || 0;
                const profit = rate > 0 ? rate - total : 0;
                const needsRestStop = time > 4;

                return (
                  <div key={idx} style={{ background: "#FFFFFF", border: idx === 0 ? "2px solid #059669" : "1px solid #E5E7EB", borderRadius: 16, overflow: "hidden" }}>
                    {/* Route Header */}
                    <div style={{ padding: "16px 24px", background: idx === 0 ? "#F0FDF4" : "#F9FAFB", borderBottom: "1px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        {route.isInterIsland ? <Ship size={18} color="#059669" /> : <Route size={18} color="#059669" />}
                        <span style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{route.name}</span>
                        {idx === 0 && <span style={{ fontSize: 10, fontWeight: 700, background: "#059669", color: "#FFF", padding: "2px 8px", borderRadius: 10 }}>RECOMMENDED</span>}
                      </div>
                      {route.isInterIsland && (
                        <span style={{ fontSize: 11, fontWeight: 600, color: "#2563EB", background: "#EFF6FF", padding: "4px 10px", borderRadius: 8 }}>
                          Inter-Island
                        </span>
                      )}
                    </div>

                    {/* Stats Row */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 1, padding: "20px 24px", borderBottom: "1px solid #F3F4F6" }}>
                      <div style={s.stat}>
                        <Route size={16} color="#6B7280" />
                        <div style={s.statValue}>{route.distanceKm} km</div>
                        <div style={s.statLabel}>Distance</div>
                      </div>
                      <div style={s.stat}>
                        <Clock size={16} color="#6B7280" />
                        <div style={s.statValue}>{time.toFixed(1)} hrs</div>
                        <div style={s.statLabel}>Total Time</div>
                      </div>
                      <div style={s.stat}>
                        <Fuel size={16} color="#D97706" />
                        <div style={s.statValue}>\u20B1{fuel.toLocaleString()}</div>
                        <div style={s.statLabel}>Fuel Cost</div>
                      </div>
                      <div style={s.stat}>
                        <DollarSign size={16} color="#7C3AED" />
                        <div style={s.statValue}>\u20B1{toll.toLocaleString()}</div>
                        <div style={s.statLabel}>Toll Fees</div>
                      </div>
                      <div style={s.stat}>
                        <Leaf size={16} color="#059669" />
                        <div style={s.statValue}>{co2} kg</div>
                        <div style={s.statLabel}>CO2 Emission</div>
                      </div>
                    </div>

                    {/* RoRo Details if inter-island */}
                    {route.roroDetails && (
                      <div style={{ padding: "14px 24px", background: "#EFF6FF", borderBottom: "1px solid #F3F4F6", display: "flex", alignItems: "center", gap: 12 }}>
                        <Ship size={16} color="#2563EB" />
                        <div style={{ flex: 1 }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: "#1E40AF" }}>RoRo / Shipping: </span>
                          <span style={{ fontSize: 13, color: "#374151" }}>{route.roroDetails.route}</span>
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#1E40AF" }}>\u20B1{route.roroDetails.fare.toLocaleString()}</span>
                        <span style={{ fontSize: 11, color: "#6B7280" }}>({route.roroDetails.hours} hrs sea travel)</span>
                      </div>
                    )}

                    {/* Tollway breakdown */}
                    {route.tollways.length > 0 && (
                      <div style={{ padding: "12px 24px", background: "#FAFAFA", borderBottom: "1px solid #F3F4F6", display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#6B7280" }}>Tollways:</span>
                        {route.tollways.map((t) => (
                          <span key={t.name} style={{ fontSize: 12, color: "#374151", background: "#FFFFFF", border: "1px solid #E5E7EB", padding: "3px 10px", borderRadius: 6 }}>
                            {t.name}: \u20B1{t.fee}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Rest Stop Suggestions */}
                    {needsRestStop && routeRestStops.length > 0 && (
                      <div style={{ padding: "14px 24px", background: "#FFFBEB", borderBottom: "1px solid #F3F4F6" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                          <Coffee size={16} color="#D97706" />
                          <span style={{ fontSize: 13, fontWeight: 700, color: "#92400E" }}>Recommended Rest Stops</span>
                          <span style={{ fontSize: 11, color: "#A16207" }}>(route exceeds 4 hours)</span>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          {routeRestStops.map((stop, sIdx) => (
                            <div key={sIdx} style={{
                              display: "flex", alignItems: "center", gap: 12, padding: "8px 14px",
                              background: "#FFFFFF", borderRadius: 8, border: "1px solid #FDE68A",
                            }}>
                              <div style={{
                                width: 28, height: 28, borderRadius: "50%", background: "#FEF3C7",
                                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                              }}>
                                <Coffee size={13} color="#D97706" />
                              </div>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{stop.name}</div>
                                <div style={{ fontSize: 11, color: "#6B7280" }}>{stop.facilities}</div>
                              </div>
                              <span style={{ fontSize: 12, fontWeight: 600, color: "#D97706", background: "#FEF3C7", padding: "3px 10px", borderRadius: 6, whiteSpace: "nowrap" }}>
                                km {stop.km}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {needsRestStop && routeRestStops.length === 0 && (
                      <div style={{ padding: "12px 24px", background: "#FFFBEB", borderBottom: "1px solid #F3F4F6", display: "flex", alignItems: "center", gap: 8 }}>
                        <Coffee size={14} color="#D97706" />
                        <span style={{ fontSize: 12, color: "#92400E" }}>
                          Route exceeds 4 hours. Plan rest stops along the route for driver safety.
                        </span>
                      </div>
                    )}

                    {/* Cost Breakdown */}
                    <div style={{ padding: "20px 24px" }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 12 }}>Cost Breakdown</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", color: "#4B5563" }}>
                          <span>Fuel ({route.distanceKm} km x {vehicle.fuelPer100km} L/100km x \u20B1{DIESEL_PRICE}/L)</span>
                          <span style={{ fontWeight: 600 }}>\u20B1{fuel.toLocaleString()}</span>
                        </div>
                        {toll > 0 && (
                          <div style={{ display: "flex", justifyContent: "space-between", color: "#4B5563" }}>
                            <span>Toll Fees</span>
                            <span style={{ fontWeight: 600 }}>\u20B1{toll.toLocaleString()}</span>
                          </div>
                        )}
                        {roro > 0 && (
                          <div style={{ display: "flex", justifyContent: "space-between", color: "#4B5563" }}>
                            <span>RoRo / Shipping Fare</span>
                            <span style={{ fontWeight: 600 }}>\u20B1{roro.toLocaleString()}</span>
                          </div>
                        )}
                        <div style={{ display: "flex", justifyContent: "space-between", borderTop: "2px solid #059669", paddingTop: 10, marginTop: 4 }}>
                          <span style={{ fontWeight: 800, color: "#059669", fontSize: 15 }}>Total Operating Cost</span>
                          <span style={{ fontWeight: 800, color: "#059669", fontSize: 15 }}>\u20B1{total.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Profitability Calculator */}
                      <div style={{ marginTop: 20, padding: 16, background: "#F9FAFB", borderRadius: 12, border: "1px solid #E5E7EB" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                          <Calculator size={16} color="#059669" />
                          <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Profitability Calculator</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <label style={{ fontSize: 13, color: "#4B5563", whiteSpace: "nowrap" }}>Load Rate (\u20B1):</label>
                          <input
                            type="number"
                            value={loadRate}
                            onChange={(e) => setLoadRate(e.target.value)}
                            placeholder="e.g. 45000"
                            style={{
                              flex: 1,
                              padding: "10px 14px",
                              borderRadius: 8,
                              border: "1px solid #E5E7EB",
                              fontSize: 14,
                              outline: "none",
                            }}
                          />
                        </div>
                        {rate > 0 && (
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14, padding: "12px 16px", borderRadius: 10, background: profit > 0 ? "#F0FDF4" : "#FEF2F2", border: `1px solid ${profit > 0 ? "#BBF7D0" : "#FECACA"}` }}>
                            <div>
                              <div style={{ fontSize: 12, color: "#6B7280" }}>Projected Profit</div>
                              <div style={{ fontSize: 20, fontWeight: 800, color: profit > 0 ? "#059669" : "#DC2626" }}>
                                {profit > 0 ? "+" : ""}\u20B1{profit.toLocaleString()}
                              </div>
                            </div>
                            <div style={{ textAlign: "right" }}>
                              <div style={{ fontSize: 12, color: "#6B7280" }}>Margin</div>
                              <div style={{ fontSize: 16, fontWeight: 700, color: profit > 0 ? "#059669" : "#DC2626" }}>
                                {rate > 0 ? ((profit / rate) * 100).toFixed(1) : 0}%
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Save Route Plan Button */}
            <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
              <button
                onClick={handleSaveRoute}
                style={{
                  flex: 1, padding: "14px", borderRadius: 10, border: "none",
                  background: saveConfirmation ? "#059669" : "#2563EB",
                  color: "#FFFFFF", fontSize: 15, fontWeight: 700, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  transition: "background 0.3s",
                }}
              >
                {saveConfirmation ? (
                  <>
                    <CheckCircle2 size={18} /> Route Saved Successfully!
                  </>
                ) : (
                  <>
                    <Save size={18} /> Save as Planned Route
                  </>
                )}
              </button>
            </div>
          </>
        )}

        {/* Saved Route Plans */}
        <div style={{ marginTop: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <FileText size={18} color="#374151" />
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: 0 }}>Saved Route Plans</h2>
            <span style={{ fontSize: 12, color: "#9CA3AF", background: "#F3F4F6", padding: "2px 10px", borderRadius: 999, fontWeight: 600 }}>
              {savedRoutes.length}
            </span>
          </div>

          {savedRoutes.length === 0 ? (
            <div style={{
              padding: "40px 20px", textAlign: "center", background: "#FAFAFA",
              borderRadius: 12, border: "1px dashed #D1D5DB",
            }}>
              <Route size={32} color="#D1D5DB" />
              <p style={{ color: "#9CA3AF", marginTop: 8 }}>No saved route plans yet. Calculate a route and save it.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {savedRoutes.map((plan) => (
                <div key={plan.id} style={{
                  background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 12,
                  padding: "16px 20px", display: "flex", alignItems: "center", gap: 16,
                }}>
                  {/* Route ID */}
                  <div style={{
                    width: 48, height: 48, borderRadius: 10, background: "#EFF6FF",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <Route size={20} color="#2563EB" />
                  </div>

                  {/* Route Info */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#2563EB" }}>{plan.id}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>
                        {plan.origin}
                        {plan.stops.length > 0 && plan.stops.map((stop, idx) => (
                          <span key={idx} style={{ color: "#7C3AED" }}> \u2192 {stop}</span>
                        ))}
                        <span style={{ color: "#DC2626" }}> \u2192 {plan.destination}</span>
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#6B7280" }}>
                      <span><Truck size={11} style={{ verticalAlign: "middle", marginRight: 4 }} />{plan.vehicle}</span>
                      <span><User size={11} style={{ verticalAlign: "middle", marginRight: 4 }} />{plan.driver}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 14, fontWeight: 800, color: "#059669" }}>\u20B1{plan.totalCost}</div>
                      <div style={{ fontSize: 10, color: "#9CA3AF" }}>Est. Cost</div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 14, fontWeight: 800, color: "#D97706" }}>{plan.totalTime}</div>
                      <div style={{ fontSize: 10, color: "#9CA3AF" }}>Duration</div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: "#6B7280" }}>{plan.savedDate}</div>
                      <div style={{ fontSize: 10, color: "#9CA3AF" }}>Saved</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

const s: Record<string, React.CSSProperties> = {
  label: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 13,
    fontWeight: 600,
    color: "#374151",
    marginBottom: 8,
  },
  select: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 10,
    border: "1px solid #E5E7EB",
    fontSize: 14,
    color: "#111827",
    background: "#FFFFFF",
    outline: "none",
    cursor: "pointer",
    appearance: "none" as const,
  },
  stat: {
    textAlign: "center" as const,
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 800,
    color: "#111827",
  },
  statLabel: {
    fontSize: 11,
    color: "#9CA3AF",
  },
};
