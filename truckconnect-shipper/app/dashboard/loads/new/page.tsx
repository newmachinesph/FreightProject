"use client";
import { useState, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import VehicleIcon from "@/components/VehicleIcon";
import {
  vehicleTypes,
  cargoCategories,
  phCities,
  islands,
  paymentTermOptions,
  timeWindows,
  formatPeso,
} from "@/lib/mock-data";
import {
  MapPin,
  Package,
  Calendar,
  CreditCard,
  Truck,
  Anchor,
  Thermometer,
  AlertTriangle,
  FileText,
  ToggleLeft,
  ToggleRight,
  ChevronRight,
  ChevronLeft,
  Check,
  Eye,
  Leaf,
  TrendingUp,
  Ship,
} from "lucide-react";

interface FormData {
  // Step 1: Route
  pickupCity: string;
  deliveryCity: string;
  interIsland: boolean;
  originIsland: string;
  destIsland: string;
  portOrigin: string;
  portDestination: string;
  // Step 2: Cargo
  vehicleNeeded: string;
  cargoCategory: string;
  weightKg: string;
  volumeCbm: string;
  commodity: string;
  specialHandling: string;
  tempRequirement: string;
  hazmatClass: string;
  // Step 3: Schedule & Budget
  pickupDate: string;
  pickupWindow: string;
  deliveryDate: string;
  offeredRate: string;
  paymentTerms: string;
  bidDeadline: string;
  instantBook: boolean;
  // Step 4: PH-specific
  bocEntryNo: string;
  referenceNo: string;
}

const initialForm: FormData = {
  pickupCity: "", deliveryCity: "", interIsland: false, originIsland: "", destIsland: "", portOrigin: "", portDestination: "",
  vehicleNeeded: "", cargoCategory: "", weightKg: "", volumeCbm: "", commodity: "", specialHandling: "", tempRequirement: "", hazmatClass: "",
  pickupDate: "", pickupWindow: "", deliveryDate: "", offeredRate: "", paymentTerms: "", bidDeadline: "", instantBook: false,
  bocEntryNo: "", referenceNo: "",
};

const steps = [
  { label: "Route", icon: MapPin },
  { label: "Cargo", icon: Package },
  { label: "Schedule & Budget", icon: Calendar },
  { label: "Review & Post", icon: Eye },
];

// ─── RoRo port options per island ─────────────────────────────────────────
const roroPortsByIsland: Record<string, string[]> = {
  Luzon: [
    "Batangas International Port",
    "Manila South Harbor",
    "Manila North Harbor",
    "Port of Subic",
    "Port of Lucena",
    "Port of Tabaco (Albay)",
    "Port of Matnog (Sorsogon)",
  ],
  Visayas: [
    "Cebu International Port",
    "Port of Liloan (Cebu)",
    "Port of Toledo (Cebu)",
    "Port of Iloilo",
    "Port of Dumaguete",
    "Port of Tacloban",
    "Port of Ormoc",
    "Port of Roxas",
  ],
  Mindanao: [
    "Port of Cagayan de Oro",
    "Port of Ozamiz",
    "Port of Iligan",
    "Davao Sasa Port",
    "Port of General Santos",
    "Port of Zamboanga",
    "Port of Surigao",
    "Port of Nasipit (Agusan)",
  ],
};

// ─── Distance estimation (km) ─────────────────────────────────────────────
const cityDistances: Record<string, Record<string, number>> = {
  "Manila": { "Makati": 12, "Quezon City": 15, "Pasig": 18, "Taguig": 20, "Laguna": 65, "Cebu": 570, "Davao": 1500, "Clark": 95, "Batangas": 110, "Subic": 140, "Bataan": 130, "Baguio": 250, "Naga": 380, "Iloilo": 630, "CDO": 880, "General Santos": 1550, "Pampanga": 70, "Dumaguete": 690, "Legazpi": 450, "Zamboanga": 850, "Tacloban": 700 },
  "Makati": { "Manila": 12, "Quezon City": 18, "Pasig": 10, "Taguig": 8, "Laguna": 50, "Clark": 100, "Batangas": 100, "Pampanga": 80 },
  "Cebu": { "Manila": 570, "Davao": 680, "CDO": 350, "Iloilo": 280, "Dumaguete": 220, "Tacloban": 270, "General Santos": 750 },
  "Davao": { "Manila": 1500, "Cebu": 680, "CDO": 380, "General Santos": 180, "Zamboanga": 650 },
  "Laguna": { "Manila": 65, "Taguig": 45, "Makati": 50, "Clark": 120, "Iloilo": 660, "Davao": 1520 },
  "Clark": { "Manila": 95, "Makati": 100, "Subic": 55, "Pampanga": 15, "Baguio": 170 },
  "Batangas": { "Manila": 110, "Pasig": 125, "Laguna": 70 },
  "Baguio": { "Manila": 250, "Clark": 170, "Pampanga": 185 },
  "General Santos": { "Davao": 180, "CDO": 560, "Manila": 1550 },
};

function getDistance(origin: string, dest: string): number {
  if (origin === dest) return 0;
  const d = cityDistances[origin]?.[dest] || cityDistances[dest]?.[origin];
  return d || 400; // default fallback
}

// ─── CO2 estimation ───────────────────────────────────────────────────────
const co2PerKmPerTon: Record<string, number> = {
  "Sedan": 0.21,
  "MPV/SUV": 0.19,
  "L300": 0.16,
  "Closed Van": 0.12,
  "Dropside": 0.11,
  "Elf": 0.10,
  "Wing Van": 0.08,
  "10-Wheeler": 0.07,
  "Trailer": 0.06,
  "Tanker": 0.09,
  "Reefer Van": 0.14,
};

// ─── Rate suggestion ──────────────────────────────────────────────────────
const baseRatePerKm: Record<string, number> = {
  "Sedan": 18,
  "MPV/SUV": 22,
  "L300": 28,
  "Closed Van": 42,
  "Dropside": 38,
  "Elf": 35,
  "Wing Van": 55,
  "10-Wheeler": 65,
  "Trailer": 75,
  "Tanker": 70,
  "Reefer Van": 60,
};

const cargoMultiplier: Record<string, number> = {
  "General": 1.0,
  "Refrigerated": 1.25,
  "Hazmat": 1.4,
  "Electronics": 1.15,
  "Construction": 1.05,
  "Food/Beverage": 1.1,
  "E-commerce": 1.08,
  "Automotive": 1.12,
  "Pharmaceutical": 1.3,
  "Agricultural": 1.05,
};

export default function PostLoadWizard() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(initialForm);
  const [posted, setPosted] = useState(false);
  const [hoveredVehicle, setHoveredVehicle] = useState<string | null>(null);

  const set = (key: keyof FormData, value: string | boolean) => setForm((prev) => ({ ...prev, [key]: value }));

  const canNext = () => {
    if (step === 0) return form.pickupCity && form.deliveryCity;
    if (step === 1) return form.vehicleNeeded && form.cargoCategory && form.weightKg && form.commodity;
    if (step === 2) return form.pickupDate && form.offeredRate && form.paymentTerms;
    return true;
  };

  const handlePost = () => {
    setPosted(true);
  };

  // Computed values
  const distance = useMemo(() => {
    if (form.pickupCity && form.deliveryCity) return getDistance(form.pickupCity, form.deliveryCity);
    return 0;
  }, [form.pickupCity, form.deliveryCity]);

  const co2Estimate = useMemo(() => {
    if (!distance || !form.vehicleNeeded || !form.weightKg) return null;
    const factor = co2PerKmPerTon[form.vehicleNeeded] || 0.1;
    const tons = Number(form.weightKg) / 1000;
    const co2Kg = distance * factor * tons;
    return Math.round(co2Kg);
  }, [distance, form.vehicleNeeded, form.weightKg]);

  const rateSuggestion = useMemo(() => {
    if (!distance || !form.vehicleNeeded) return null;
    const base = baseRatePerKm[form.vehicleNeeded] || 40;
    const cargoMult = form.cargoCategory ? (cargoMultiplier[form.cargoCategory] || 1.0) : 1.0;
    const interIslandSurcharge = form.interIsland ? 1.3 : 1.0;
    const estimated = distance * base * cargoMult * interIslandSurcharge;
    const low = Math.round(estimated * 0.85 / 100) * 100;
    const high = Math.round(estimated * 1.15 / 100) * 100;
    return { low, high, mid: Math.round(estimated / 100) * 100 };
  }, [distance, form.vehicleNeeded, form.cargoCategory, form.interIsland]);

  if (posted) {
    return (
      <DashboardLayout activeNav="/dashboard/loads/new">
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 80 }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#DCFCE7", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
            <Check size={32} color="#059669" />
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111827", margin: "0 0 8px" }}>Load Posted Successfully!</h2>
          <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 24, textAlign: "center" }}>
            Your load from {form.pickupCity} to {form.deliveryCity} has been posted.<br />
            Carriers will start bidding soon.
          </p>
          {co2Estimate && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16, padding: "8px 16px", background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 8 }}>
              <Leaf size={14} color="#16A34A" />
              <span style={{ fontSize: 13, color: "#166534" }}>Estimated CO2: {co2Estimate} kg</span>
            </div>
          )}
          <div style={{ display: "flex", gap: 12 }}>
            <a href="/dashboard/loads" style={{ padding: "10px 24px", background: "#2563EB", color: "#fff", borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: "none" }}>View My Loads</a>
            <button onClick={() => { setForm(initialForm); setStep(0); setPosted(false); }} style={{ padding: "10px 24px", background: "#fff", color: "#374151", border: "1px solid #D1D5DB", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Post Another</button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeNav="/dashboard/loads/new">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827", margin: 0 }}>Post New Load</h1>
        <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>Create a freight load for carriers to bid on</p>
      </div>

      {/* Step indicator */}
      <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 28, background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: "16px 24px" }}>
        {steps.map((s, i) => {
          const Icon = s.icon;
          const isActive = i === step;
          const isCompleted = i < step;
          return (
            <div key={s.label} style={{ display: "flex", alignItems: "center", flex: 1 }}>
              <div
                onClick={() => { if (i < step) setStep(i); }}
                style={{
                  display: "flex", alignItems: "center", gap: 8, cursor: i < step ? "pointer" : "default",
                }}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: isCompleted ? "#059669" : isActive ? "#2563EB" : "#F3F4F6",
                  color: isCompleted || isActive ? "#fff" : "#9CA3AF",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  border: isActive ? "2px solid #93C5FD" : "none",
                  boxShadow: isActive ? "0 0 0 4px rgba(37,99,235,0.1)" : "none",
                }}>
                  {isCompleted ? <Check size={14} /> : <Icon size={14} />}
                </div>
                <span style={{ fontSize: 13, fontWeight: isActive ? 700 : 500, color: isActive ? "#2563EB" : isCompleted ? "#059669" : "#9CA3AF" }}>
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div style={{ flex: 1, height: 2, background: isCompleted ? "#059669" : "#E5E7EB", margin: "0 12px", borderRadius: 1 }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Step content */}
      <div style={cs.card}>
        {step === 0 && (
          <>
            <div style={cs.sectionHeader}>
              <MapPin size={18} color="#2563EB" />
              <h2 style={cs.sectionTitle}>Step 1: Route</h2>
            </div>
            <div style={cs.formGrid}>
              <div style={cs.field}>
                <label style={cs.label}>Origin City *</label>
                <select style={cs.select} value={form.pickupCity} onChange={(e) => set("pickupCity", e.target.value)}>
                  <option value="">Select city</option>
                  {phCities.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div style={cs.field}>
                <label style={cs.label}>Destination City *</label>
                <select style={cs.select} value={form.deliveryCity} onChange={(e) => set("deliveryCity", e.target.value)}>
                  <option value="">Select city</option>
                  {phCities.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Distance info */}
            {distance > 0 && (
              <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "#EFF6FF", borderRadius: 8, border: "1px solid #BFDBFE" }}>
                <MapPin size={14} color="#2563EB" />
                <span style={{ fontSize: 13, color: "#1E40AF", fontWeight: 600 }}>Estimated distance: ~{distance.toLocaleString()} km</span>
              </div>
            )}

            <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "#F9FAFB", borderRadius: 8, border: "1px solid #E5E7EB" }}>
              <button type="button" onClick={() => set("interIsland", !form.interIsland)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", padding: 0 }}>
                {form.interIsland ? <ToggleRight size={28} color="#2563EB" /> : <ToggleLeft size={28} color="#9CA3AF" />}
              </button>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>Inter-Island Shipment (RoRo)</div>
                <div style={{ fontSize: 11, color: "#9CA3AF" }}>Toggle if cargo crosses islands via Roll-on/Roll-off</div>
              </div>
            </div>
            {form.interIsland && (
              <div style={{ marginTop: 12 }}>
                <div style={cs.formGrid}>
                  <div style={cs.field}>
                    <label style={cs.label}><Anchor size={13} style={{ marginRight: 4, verticalAlign: "middle" }} />Origin Island</label>
                    <select style={cs.select} value={form.originIsland} onChange={(e) => { set("originIsland", e.target.value); set("portOrigin", ""); }}>
                      <option value="">Select island</option>
                      {islands.map((i) => <option key={i} value={i}>{i}</option>)}
                    </select>
                  </div>
                  <div style={cs.field}>
                    <label style={cs.label}><Anchor size={13} style={{ marginRight: 4, verticalAlign: "middle" }} />Destination Island</label>
                    <select style={cs.select} value={form.destIsland} onChange={(e) => { set("destIsland", e.target.value); set("portDestination", ""); }}>
                      <option value="">Select island</option>
                      {islands.map((i) => <option key={i} value={i}>{i}</option>)}
                    </select>
                  </div>
                </div>

                {/* RoRo Port selectors */}
                <div style={{ ...cs.formGrid, marginTop: 12 }}>
                  {form.originIsland && (
                    <div style={cs.field}>
                      <label style={cs.label}><Ship size={13} style={{ marginRight: 4, verticalAlign: "middle" }} />Origin RoRo Port</label>
                      <select style={cs.select} value={form.portOrigin} onChange={(e) => set("portOrigin", e.target.value)}>
                        <option value="">Select port</option>
                        {(roroPortsByIsland[form.originIsland] || []).map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  {form.destIsland && (
                    <div style={cs.field}>
                      <label style={cs.label}><Ship size={13} style={{ marginRight: 4, verticalAlign: "middle" }} />Destination RoRo Port</label>
                      <select style={cs.select} value={form.portDestination} onChange={(e) => set("portDestination", e.target.value)}>
                        <option value="">Select port</option>
                        {(roroPortsByIsland[form.destIsland] || []).map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {form.portOrigin && form.portDestination && (
                  <div style={{ marginTop: 10, padding: "10px 14px", background: "#EFF6FF", borderRadius: 8, border: "1px solid #BFDBFE", display: "flex", alignItems: "center", gap: 8 }}>
                    <Anchor size={14} color="#2563EB" />
                    <span style={{ fontSize: 12, color: "#1E40AF", fontWeight: 500 }}>
                      RoRo Route: {form.portOrigin} &rarr; {form.portDestination}
                    </span>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {step === 1 && (
          <>
            <div style={cs.sectionHeader}>
              <Package size={18} color="#D97706" />
              <h2 style={cs.sectionTitle}>Step 2: Cargo Details</h2>
            </div>

            {/* Vehicle type selector with icons */}
            <div style={cs.field}>
              <label style={cs.label}><Truck size={13} style={{ marginRight: 4, verticalAlign: "middle" }} />Vehicle Type Needed *</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginTop: 4 }}>
                {vehicleTypes.map((v) => {
                  const isSelected = form.vehicleNeeded === v;
                  const isHovered = hoveredVehicle === v;
                  return (
                    <button
                      key={v}
                      type="button"
                      onMouseEnter={() => setHoveredVehicle(v)}
                      onMouseLeave={() => setHoveredVehicle(null)}
                      onClick={() => set("vehicleNeeded", v)}
                      style={{
                        display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                        padding: "12px 8px", borderRadius: 10,
                        border: isSelected ? "2px solid #2563EB" : "1px solid #E5E7EB",
                        background: isSelected ? "#EFF6FF" : isHovered ? "#F9FAFB" : "#fff",
                        cursor: "pointer",
                        boxShadow: isSelected ? "0 0 0 3px rgba(37,99,235,0.1)" : "none",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <VehicleIcon type={v} size={48} color={isSelected ? "#2563EB" : "#9CA3AF"} />
                      <span style={{ fontSize: 11, fontWeight: isSelected ? 700 : 500, color: isSelected ? "#2563EB" : "#374151", textAlign: "center" }}>{v}</span>
                      {isSelected && (
                        <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Check size={10} color="#fff" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ ...cs.formGrid, marginTop: 16 }}>
              <div style={cs.field}>
                <label style={cs.label}>Cargo Category *</label>
                <select style={cs.select} value={form.cargoCategory} onChange={(e) => set("cargoCategory", e.target.value)}>
                  <option value="">Select category</option>
                  {cargoCategories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div style={cs.field}>
                <label style={cs.label}>Weight (kg) *</label>
                <input type="number" placeholder="e.g. 18000" min={0} style={cs.input} value={form.weightKg} onChange={(e) => set("weightKg", e.target.value)} />
              </div>
              <div style={cs.field}>
                <label style={cs.label}>Volume (CBM)</label>
                <input type="number" placeholder="e.g. 42" min={0} step={0.1} style={cs.input} value={form.volumeCbm} onChange={(e) => set("volumeCbm", e.target.value)} />
              </div>
              <div style={{ ...cs.field, gridColumn: "1 / -1" }}>
                <label style={cs.label}>Commodity / Description *</label>
                <input type="text" placeholder="e.g. Canned goods & instant noodles" style={cs.input} value={form.commodity} onChange={(e) => set("commodity", e.target.value)} />
              </div>
              <div style={{ ...cs.field, gridColumn: "1 / -1" }}>
                <label style={cs.label}>Special Handling Instructions</label>
                <textarea rows={3} placeholder="e.g. Keep dry, stack max 5 layers, fragile items on top..." style={{ ...cs.input, resize: "vertical", fontFamily: "inherit" }} value={form.specialHandling} onChange={(e) => set("specialHandling", e.target.value)} />
              </div>
              <div style={cs.field}>
                <label style={cs.label}><Thermometer size={13} style={{ marginRight: 4, verticalAlign: "middle" }} />Temperature Requirement</label>
                <input type="text" placeholder="e.g. 2-8C or -18C" style={cs.input} value={form.tempRequirement} onChange={(e) => set("tempRequirement", e.target.value)} />
              </div>
              <div style={cs.field}>
                <label style={cs.label}><AlertTriangle size={13} style={{ marginRight: 4, verticalAlign: "middle" }} />Hazmat Class</label>
                <input type="text" placeholder="e.g. Class 3 - Flammable Liquids" style={cs.input} value={form.hazmatClass} onChange={(e) => set("hazmatClass", e.target.value)} />
              </div>
            </div>

            {/* CO2 Estimate + Rate Suggestion */}
            {(co2Estimate || rateSuggestion) && (
              <div style={{ display: "grid", gridTemplateColumns: co2Estimate && rateSuggestion ? "1fr 1fr" : "1fr", gap: 12, marginTop: 16 }}>
                {co2Estimate !== null && (
                  <div style={{ padding: "14px 16px", background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 10, display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: "#DCFCE7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Leaf size={18} color="#16A34A" />
                    </div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: "#166534", textTransform: "uppercase" as const, letterSpacing: 0.5 }}>Est. Carbon Footprint</div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: "#15803D" }}>{co2Estimate.toLocaleString()} kg CO2</div>
                      <div style={{ fontSize: 10, color: "#6B7280" }}>{distance} km x {form.vehicleNeeded} x {(Number(form.weightKg) / 1000).toFixed(1)}t</div>
                    </div>
                  </div>
                )}
                {rateSuggestion && (
                  <div style={{ padding: "14px 16px", background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 10, display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: "#FEF3C7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <TrendingUp size={18} color="#D97706" />
                    </div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: "#92400E", textTransform: "uppercase" as const, letterSpacing: 0.5 }}>Suggested Rate Range</div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: "#B45309" }}>
                        {formatPeso(rateSuggestion.low)} - {formatPeso(rateSuggestion.high)}
                      </div>
                      <div style={{ fontSize: 10, color: "#6B7280" }}>
                        Based on {distance} km, {form.vehicleNeeded}{form.cargoCategory ? `, ${form.cargoCategory}` : ""}{form.interIsland ? " + inter-island" : ""}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {step === 2 && (
          <>
            <div style={cs.sectionHeader}>
              <Calendar size={18} color="#059669" />
              <h2 style={cs.sectionTitle}>Step 3: Schedule & Budget</h2>
            </div>
            <div style={cs.formGrid}>
              <div style={cs.field}>
                <label style={cs.label}>Pickup Date *</label>
                <input type="date" style={cs.input} value={form.pickupDate} onChange={(e) => set("pickupDate", e.target.value)} />
              </div>
              <div style={cs.field}>
                <label style={cs.label}>Pickup Time Window</label>
                <select style={cs.select} value={form.pickupWindow} onChange={(e) => set("pickupWindow", e.target.value)}>
                  <option value="">Select window</option>
                  {timeWindows.map((w) => <option key={w} value={w}>{w}</option>)}
                </select>
              </div>
              <div style={cs.field}>
                <label style={cs.label}>Delivery Date</label>
                <input type="date" style={cs.input} value={form.deliveryDate} onChange={(e) => set("deliveryDate", e.target.value)} />
              </div>
              <div style={cs.field}>
                <label style={cs.label}>Offered Rate (PHP) *</label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#6B7280", fontSize: 14, fontWeight: 600 }}>{"\u20B1"}</span>
                  <input type="number" placeholder="e.g. 145000" min={0} style={{ ...cs.input, paddingLeft: 28 }} value={form.offeredRate} onChange={(e) => set("offeredRate", e.target.value)} />
                </div>
                {rateSuggestion && form.offeredRate && (
                  <div style={{ marginTop: 4, fontSize: 11, color: Number(form.offeredRate) < rateSuggestion.low ? "#DC2626" : Number(form.offeredRate) > rateSuggestion.high ? "#D97706" : "#059669", fontWeight: 500 }}>
                    {Number(form.offeredRate) < rateSuggestion.low
                      ? "Below market range -- may receive fewer bids"
                      : Number(form.offeredRate) > rateSuggestion.high
                        ? "Above market range -- should attract many bids"
                        : "Within market range"}
                  </div>
                )}
              </div>
              <div style={cs.field}>
                <label style={cs.label}>Payment Terms *</label>
                <select style={cs.select} value={form.paymentTerms} onChange={(e) => set("paymentTerms", e.target.value)}>
                  <option value="">Select terms</option>
                  {paymentTermOptions.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div style={cs.field}>
                <label style={cs.label}>Bid Deadline</label>
                <input type="date" style={cs.input} value={form.bidDeadline} onChange={(e) => set("bidDeadline", e.target.value)} />
              </div>
            </div>
            <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "#F9FAFB", borderRadius: 8, border: "1px solid #E5E7EB" }}>
              <button type="button" onClick={() => set("instantBook", !form.instantBook)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", padding: 0 }}>
                {form.instantBook ? <ToggleRight size={28} color="#2563EB" /> : <ToggleLeft size={28} color="#9CA3AF" />}
              </button>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>Instant Book</div>
                <div style={{ fontSize: 11, color: "#9CA3AF" }}>Allow carriers to book immediately at your offered rate</div>
              </div>
            </div>
            {/* PH-specific fields */}
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid #F3F4F6" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase" as const, letterSpacing: 0.5, marginBottom: 12 }}>PH-Specific Fields</div>
              <div style={cs.formGrid}>
                <div style={cs.field}>
                  <label style={cs.label}><FileText size={13} style={{ marginRight: 4, verticalAlign: "middle" }} />BOC Import Entry No.</label>
                  <input type="text" placeholder="e.g. BOC-2026-BTG-04521" style={cs.input} value={form.bocEntryNo} onChange={(e) => set("bocEntryNo", e.target.value)} />
                </div>
                <div style={cs.field}>
                  <label style={cs.label}><FileText size={13} style={{ marginRight: 4, verticalAlign: "middle" }} />Reference / PO Number</label>
                  <input type="text" placeholder="e.g. PO-FMCG-2026-0312" style={cs.input} value={form.referenceNo} onChange={(e) => set("referenceNo", e.target.value)} />
                </div>
              </div>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div style={cs.sectionHeader}>
              <Eye size={18} color="#7C3AED" />
              <h2 style={cs.sectionTitle}>Step 4: Review & Post</h2>
            </div>

            {/* Summary preview card */}
            <div style={{ background: "linear-gradient(135deg, #EFF6FF 0%, #F0FDF4 100%)", border: "1px solid #BFDBFE", borderRadius: 12, padding: "20px 24px", marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <VehicleIcon type={form.vehicleNeeded || "Closed Van"} size={56} color="#2563EB" />
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#111827" }}>
                      {form.pickupCity || "Origin"} &rarr; {form.deliveryCity || "Destination"}
                    </div>
                    <div style={{ fontSize: 13, color: "#6B7280", marginTop: 2 }}>
                      {form.vehicleNeeded || "Vehicle"} | {form.commodity || "Cargo"} | {form.weightKg ? `${(Number(form.weightKg)/1000).toFixed(1)}t` : "-- t"}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#059669" }}>
                    {form.offeredRate ? formatPeso(Number(form.offeredRate)) : "--"}
                  </div>
                  <div style={{ fontSize: 11, color: "#6B7280" }}>{form.paymentTerms || "Payment terms"}</div>
                </div>
              </div>

              {/* Quick stats row */}
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                {distance > 0 && (
                  <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#374151", background: "#fff", padding: "4px 10px", borderRadius: 6, border: "1px solid #E5E7EB" }}>
                    <MapPin size={12} color="#2563EB" /> ~{distance} km
                  </div>
                )}
                {form.interIsland && (
                  <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#1E40AF", background: "#DBEAFE", padding: "4px 10px", borderRadius: 6 }}>
                    <Anchor size={12} /> Inter-Island RoRo
                  </div>
                )}
                {co2Estimate && (
                  <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#166534", background: "#DCFCE7", padding: "4px 10px", borderRadius: 6 }}>
                    <Leaf size={12} /> {co2Estimate} kg CO2
                  </div>
                )}
                {form.instantBook && (
                  <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#7C3AED", background: "#EDE9FE", padding: "4px 10px", borderRadius: 6 }}>
                    <Check size={12} /> Instant Book
                  </div>
                )}
                {form.tempRequirement && (
                  <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#92400E", background: "#FEF3C7", padding: "4px 10px", borderRadius: 6 }}>
                    <Thermometer size={12} /> {form.tempRequirement}
                  </div>
                )}
                {form.hazmatClass && (
                  <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#991B1B", background: "#FEE2E2", padding: "4px 10px", borderRadius: 6 }}>
                    <AlertTriangle size={12} /> Hazmat
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              {/* Route */}
              <div style={cs.reviewSection}>
                <div style={cs.reviewTitle}>Route</div>
                <div style={cs.reviewRow}><span style={cs.reviewLabel}>Origin</span><span style={cs.reviewValue}>{form.pickupCity || "Not set"}</span></div>
                <div style={cs.reviewRow}><span style={cs.reviewLabel}>Destination</span><span style={cs.reviewValue}>{form.deliveryCity || "Not set"}</span></div>
                {distance > 0 && <div style={cs.reviewRow}><span style={cs.reviewLabel}>Distance</span><span style={cs.reviewValue}>~{distance} km</span></div>}
                {form.interIsland && (
                  <>
                    <div style={cs.reviewRow}><span style={cs.reviewLabel}>Inter-Island</span><span style={{ ...cs.reviewValue, color: "#2563EB" }}>Yes (RoRo)</span></div>
                    <div style={cs.reviewRow}><span style={cs.reviewLabel}>Islands</span><span style={cs.reviewValue}>{form.originIsland} &rarr; {form.destIsland}</span></div>
                    {form.portOrigin && <div style={cs.reviewRow}><span style={cs.reviewLabel}>Origin Port</span><span style={cs.reviewValue}>{form.portOrigin}</span></div>}
                    {form.portDestination && <div style={cs.reviewRow}><span style={cs.reviewLabel}>Dest. Port</span><span style={cs.reviewValue}>{form.portDestination}</span></div>}
                  </>
                )}
              </div>
              {/* Cargo */}
              <div style={cs.reviewSection}>
                <div style={cs.reviewTitle}>Cargo</div>
                <div style={cs.reviewRow}><span style={cs.reviewLabel}>Vehicle</span><span style={{ ...cs.reviewValue, display: "flex", alignItems: "center", gap: 6, justifyContent: "flex-end" }}><VehicleIcon type={form.vehicleNeeded} size={28} color="#2563EB" />{form.vehicleNeeded || "Not set"}</span></div>
                <div style={cs.reviewRow}><span style={cs.reviewLabel}>Category</span><span style={cs.reviewValue}>{form.cargoCategory || "Not set"}</span></div>
                <div style={cs.reviewRow}><span style={cs.reviewLabel}>Weight</span><span style={cs.reviewValue}>{form.weightKg ? `${Number(form.weightKg).toLocaleString()} kg` : "Not set"}</span></div>
                {form.volumeCbm && <div style={cs.reviewRow}><span style={cs.reviewLabel}>Volume</span><span style={cs.reviewValue}>{form.volumeCbm} CBM</span></div>}
                <div style={cs.reviewRow}><span style={cs.reviewLabel}>Commodity</span><span style={cs.reviewValue}>{form.commodity || "Not set"}</span></div>
                {form.tempRequirement && <div style={cs.reviewRow}><span style={cs.reviewLabel}>Temp Req</span><span style={cs.reviewValue}>{form.tempRequirement}</span></div>}
                {form.hazmatClass && <div style={cs.reviewRow}><span style={cs.reviewLabel}>Hazmat</span><span style={{ ...cs.reviewValue, color: "#DC2626" }}>{form.hazmatClass}</span></div>}
              </div>
              {/* Schedule */}
              <div style={cs.reviewSection}>
                <div style={cs.reviewTitle}>Schedule</div>
                <div style={cs.reviewRow}><span style={cs.reviewLabel}>Pickup Date</span><span style={cs.reviewValue}>{form.pickupDate || "Not set"}</span></div>
                {form.pickupWindow && <div style={cs.reviewRow}><span style={cs.reviewLabel}>Window</span><span style={cs.reviewValue}>{form.pickupWindow}</span></div>}
                {form.deliveryDate && <div style={cs.reviewRow}><span style={cs.reviewLabel}>Delivery Date</span><span style={cs.reviewValue}>{form.deliveryDate}</span></div>}
                {form.bidDeadline && <div style={cs.reviewRow}><span style={cs.reviewLabel}>Bid Deadline</span><span style={cs.reviewValue}>{form.bidDeadline}</span></div>}
                <div style={cs.reviewRow}><span style={cs.reviewLabel}>Instant Book</span><span style={cs.reviewValue}>{form.instantBook ? "Yes" : "No"}</span></div>
              </div>
              {/* Budget */}
              <div style={cs.reviewSection}>
                <div style={cs.reviewTitle}>Budget & Payment</div>
                <div style={cs.reviewRow}><span style={cs.reviewLabel}>Offered Rate</span><span style={{ ...cs.reviewValue, fontWeight: 800, color: "#059669", fontSize: 16 }}>{form.offeredRate ? formatPeso(Number(form.offeredRate)) : "Not set"}</span></div>
                {rateSuggestion && (
                  <div style={cs.reviewRow}><span style={cs.reviewLabel}>Market Range</span><span style={{ ...cs.reviewValue, fontSize: 11, color: "#6B7280" }}>{formatPeso(rateSuggestion.low)} - {formatPeso(rateSuggestion.high)}</span></div>
                )}
                <div style={cs.reviewRow}><span style={cs.reviewLabel}>Payment Terms</span><span style={cs.reviewValue}>{form.paymentTerms || "Not set"}</span></div>
                {form.bocEntryNo && <div style={cs.reviewRow}><span style={cs.reviewLabel}>BOC Entry</span><span style={cs.reviewValue}>{form.bocEntryNo}</span></div>}
                {form.referenceNo && <div style={cs.reviewRow}><span style={cs.reviewLabel}>Reference No.</span><span style={cs.reviewValue}>{form.referenceNo}</span></div>}
                {co2Estimate && <div style={cs.reviewRow}><span style={cs.reviewLabel}>CO2 Estimate</span><span style={{ ...cs.reviewValue, color: "#16A34A" }}>{co2Estimate} kg</span></div>}
              </div>
            </div>
            {form.specialHandling && (
              <div style={{ marginTop: 16, padding: "12px 16px", background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#92400E", marginBottom: 4 }}>SPECIAL HANDLING</div>
                <div style={{ fontSize: 13, color: "#374151" }}>{form.specialHandling}</div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Navigation buttons */}
      <div style={{ marginTop: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "10px 20px", borderRadius: 8, fontSize: 14, fontWeight: 600,
            background: step === 0 ? "#F3F4F6" : "#fff",
            color: step === 0 ? "#9CA3AF" : "#374151",
            border: "1px solid #D1D5DB",
            cursor: step === 0 ? "not-allowed" : "pointer",
          }}
        >
          <ChevronLeft size={16} /> Back
        </button>
        <div style={{ display: "flex", gap: 8 }}>
          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canNext()}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "10px 24px", borderRadius: 8, fontSize: 14, fontWeight: 600,
                background: canNext() ? "#2563EB" : "#9CA3AF",
                color: "#fff", border: "none",
                cursor: canNext() ? "pointer" : "not-allowed",
                opacity: canNext() ? 1 : 0.6,
              }}
            >
              Next <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={handlePost}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "10px 28px", borderRadius: 8, fontSize: 14, fontWeight: 700,
                background: "#059669", color: "#fff", border: "none", cursor: "pointer",
              }}
            >
              <Check size={16} /> Post Load
            </button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

const cs: Record<string, React.CSSProperties> = {
  card: { background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: "24px 28px" },
  sectionHeader: { display: "flex", alignItems: "center", gap: 8, marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid #F3F4F6" },
  sectionTitle: { fontSize: 15, fontWeight: 700, color: "#111827", margin: 0 },
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
  field: { display: "flex", flexDirection: "column" },
  label: { fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6, display: "flex", alignItems: "center" },
  input: { padding: "10px 12px", border: "1px solid #D1D5DB", borderRadius: 8, fontSize: 14, color: "#111827", outline: "none", background: "#fff" },
  select: { padding: "10px 12px", border: "1px solid #D1D5DB", borderRadius: 8, fontSize: 14, color: "#111827", outline: "none", background: "#fff", cursor: "pointer" },
  reviewSection: { background: "#F9FAFB", borderRadius: 8, padding: "16px 20px" },
  reviewTitle: { fontSize: 12, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase" as const, letterSpacing: 0.5, marginBottom: 10, paddingBottom: 8, borderBottom: "1px solid #E5E7EB" },
  reviewRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0" },
  reviewLabel: { fontSize: 12, color: "#9CA3AF", fontWeight: 500 },
  reviewValue: { fontSize: 13, color: "#111827", fontWeight: 600, textAlign: "right" as const },
};
