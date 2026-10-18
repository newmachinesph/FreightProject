"use client";
import { useState, useEffect, useMemo, use } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import VehicleIcon from "@/components/VehicleIcon";
import {
  ArrowLeft, MapPin, Package, Weight, Box, Truck, Ship,
  DollarSign, Clock, Users, Check, MessageSquare, Fuel,
  Route, TrendingUp, Info,
} from "lucide-react";
import { loads, vehicles, bids } from "@/lib/mock-data";

// Estimated distances (km) for known routes - simple lookup
const routeDistances: Record<string, { km: number; fuelRate: number }> = {
  "l1": { km: 870, fuelRate: 12 },  // Manila-Cebu via RoRo
  "l2": { km: 1500, fuelRate: 8 },  // Batangas-Davao
  "l3": { km: 85, fuelRate: 10 },   // Pampanga-Makati
  "l4": { km: 750, fuelRate: 12 },  // Laguna-Iloilo
  "l5": { km: 1400, fuelRate: 8 },  // Subic-CDO
  "l6": { km: 250, fuelRate: 10 },  // QC-Baguio
  "l7": { km: 1600, fuelRate: 6 },  // Taguig-Zamboanga
  "l8": { km: 480, fuelRate: 10 },  // Bulacan-Legazpi
  "l9": { km: 1700, fuelRate: 8 },  // Manila-GenSan
  "l10": { km: 120, fuelRate: 12 }, // Valenzuela-Tarlac
  "l11": { km: 900, fuelRate: 12 }, // Clark-Tacloban
  "l12": { km: 80, fuelRate: 14 },  // Pasig-Angeles
  "l13": { km: 800, fuelRate: 12 }, // Cavite-Bacolod
  "l14": { km: 90, fuelRate: 14 },  // Marikina-Lipa
  "l15": { km: 700, fuelRate: 10 }, // Paranaque-Puerto Princesa
};

const DIESEL_PRICE = 58; // PHP per liter

export default function LoadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const load = loads.find((l) => l.id === id);
  const existingBids = bids.filter((b) => b.loadId === id);
  const availableVehicles = vehicles.filter((v) => v.status === "available");

  // Smart vehicle suggestion: find best match by type, then capacity
  const suggestedVehicle = useMemo(() => {
    if (!load) return null;
    // Exact type match first
    const exactMatch = availableVehicles.find((v) => v.type === load.vehicleNeeded);
    if (exactMatch) return exactMatch;
    // Then by capacity (smallest vehicle that can handle the load)
    const byCapacity = availableVehicles
      .filter((v) => v.capacity.kg >= load.weight && v.capacity.cbm >= load.cbm)
      .sort((a, b) => a.capacity.kg - b.capacity.kg);
    return byCapacity[0] || null;
  }, [load, availableVehicles]);

  const [bidForm, setBidForm] = useState({
    offeredRate: "",
    vehiclePlate: "",
    proposedPickup: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  // Pre-select suggested vehicle
  useEffect(() => {
    if (suggestedVehicle && !bidForm.vehiclePlate) {
      setBidForm((prev) => ({ ...prev, vehiclePlate: suggestedVehicle.plateNo }));
    }
  }, [suggestedVehicle]);

  if (!load) {
    return (
      <DashboardLayout>
        <div style={{ textAlign: "center", padding: 60 }}>
          <h2 style={{ color: "#6B7280" }}>Load not found</h2>
          <a href="/dashboard/loads" style={{ color: "#2563EB", textDecoration: "none" }}>Back to Load Board</a>
        </div>
      </DashboardLayout>
    );
  }

  // Route & fuel calculations
  const routeInfo = routeDistances[id];
  const selectedVehicle = vehicles.find((v) => v.plateNo === bidForm.vehiclePlate);
  const fuelConsumption = routeInfo ? routeInfo.fuelRate : 10; // km/L default
  const estFuelLiters = routeInfo ? routeInfo.km / fuelConsumption : 0;
  const estFuelCost = Math.round(estFuelLiters * DIESEL_PRICE);
  const offeredRateNum = parseFloat(bidForm.offeredRate) || 0;
  const estProfit = offeredRateNum > 0 ? offeredRateNum - estFuelCost : 0;
  const profitMargin = offeredRateNum > 0 ? ((estProfit / offeredRateNum) * 100).toFixed(1) : "0";

  const handleSubmit = () => {
    if (!bidForm.offeredRate || !bidForm.vehiclePlate) {
      alert("Please fill in offered rate and select a vehicle.");
      return;
    }
    setSubmitted(true);
  };

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 24 }}>
        <a href="/dashboard/loads" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "#6B7280", textDecoration: "none", marginBottom: 8 }}>
          <ArrowLeft size={14} /> Back to Load Board
        </a>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827", margin: 0 }}>Load Details</h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 24 }}>
        {/* Load Info */}
        <div>
          <div style={panel}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <MapPin size={20} color="#2563EB" />
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>{load.origin}</div>
                <div style={{ fontSize: 12, color: "#9CA3AF" }}>Origin</div>
              </div>
              <span style={{ color: "#D1D5DB", fontSize: 24, margin: "0 12px" }}>&rarr;</span>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>{load.destination}</div>
                <div style={{ fontSize: 12, color: "#9CA3AF" }}>Destination</div>
              </div>
            </div>

            {/* Route Details Card */}
            {routeInfo && (
              <div style={{
                display: "flex", gap: 20, padding: 14, borderRadius: 10,
                background: "#F0F9FF", border: "1px solid #BAE6FD", marginBottom: 20,
              }}>
                <div style={{ textAlign: "center" }}>
                  <Route size={16} color="#0284C7" />
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#0284C7" }}>{routeInfo.km} km</div>
                  <div style={{ fontSize: 10, color: "#6B7280" }}>Distance</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <Fuel size={16} color="#0284C7" />
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#0284C7" }}>{Math.round(estFuelLiters)} L</div>
                  <div style={{ fontSize: 10, color: "#6B7280" }}>Est. Fuel</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <DollarSign size={16} color="#D97706" />
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#D97706" }}>{"\u20B1"}{estFuelCost.toLocaleString()}</div>
                  <div style={{ fontSize: 10, color: "#6B7280" }}>Fuel Cost</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <Info size={16} color="#6B7280" />
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#6B7280" }}>~{fuelConsumption} km/L</div>
                  <div style={{ fontSize: 10, color: "#6B7280" }}>Consumption</div>
                </div>
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              <InfoRow icon={<Package size={14} />} label="Cargo Type" value={load.cargoType} />
              <InfoRow icon={<Box size={14} />} label="Category" value={load.cargoCategory} />
              <InfoRow icon={<Weight size={14} />} label="Weight" value={`${load.weight.toLocaleString()} kg`} />
              <InfoRow icon={<Box size={14} />} label="Volume" value={`${load.cbm} CBM`} />
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <VehicleIcon type={load.vehicleNeeded} size={28} color="#2563EB" />
                <div>
                  <div style={{ fontSize: 10, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.5 }}>Vehicle Needed</div>
                  <div style={{ fontSize: 13, color: "#111827", fontWeight: 500 }}>{load.vehicleNeeded}</div>
                </div>
              </div>
              <InfoRow icon={<Users size={14} />} label="Shipper" value={load.shipperName} />
              <InfoRow icon={<DollarSign size={14} />} label="Budget Range" value={`\u20B1${load.budgetMin.toLocaleString()} - \u20B1${load.budgetMax.toLocaleString()}`} />
              <InfoRow icon={<DollarSign size={14} />} label="Payment Terms" value={load.paymentTerms} />
              <InfoRow icon={<Clock size={14} />} label="Bid Deadline" value={load.bidDeadline} />
              <InfoRow icon={<Clock size={14} />} label="Posted" value={load.postedDate} />
            </div>

            <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
              <span style={{ padding: "3px 10px", borderRadius: 4, fontSize: 11, fontWeight: 600, background: "#DBEAFE", color: "#2563EB" }}>{load.loadType}</span>
              {load.roroRequired && <span style={{ padding: "3px 10px", borderRadius: 4, fontSize: 11, fontWeight: 600, background: "#DBEAFE", color: "#1D4ED8" }}><Ship size={10} style={{ marginRight: 3, verticalAlign: "middle" }} /> RoRo Required</span>}
              {load.interIsland && <span style={{ padding: "3px 10px", borderRadius: 4, fontSize: 11, fontWeight: 600, background: "#EDE9FE", color: "#7C3AED" }}>Inter-Island</span>}
            </div>

            <div style={{ background: "#F9FAFB", borderRadius: 8, padding: 14, fontSize: 13, color: "#4B5563", lineHeight: 1.6 }}>
              <strong style={{ color: "#111827" }}>Description:</strong> {load.description}
            </div>
          </div>

          {/* Previous Bids */}
          {existingBids.length > 0 && (
            <div style={{ ...panel, marginTop: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111827", margin: "0 0 12px 0" }}>
                Previous Bids on This Load ({existingBids.length})
              </h3>
              {existingBids.map((b) => (
                <div key={b.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #F3F4F6" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{b.vehiclePlate} - {b.vehicleType}</div>
                    <div style={{ fontSize: 11, color: "#9CA3AF" }}>{b.submittedDate}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#2563EB" }}>{"\u20B1"}{b.offeredRate.toLocaleString()}</span>
                    <span style={{
                      padding: "2px 8px", borderRadius: 12, fontSize: 10, fontWeight: 600,
                      background: b.status === "pending" ? "#FEF3C7" : b.status === "accepted" ? "#DCFCE7" : "#FEE2E2",
                      color: b.status === "pending" ? "#D97706" : b.status === "accepted" ? "#16A34A" : "#DC2626",
                      textTransform: "capitalize",
                    }}>
                      {b.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bid Form */}
        <div style={panel}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: "0 0 4px 0" }}>Place Your Bid</h2>
          <p style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 20 }}>Submit a competitive bid for this load</p>

          {submitted ? (
            <div style={{ textAlign: "center", padding: 30 }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#ECFDF5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <Check size={24} color="#059669" />
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: "0 0 8px 0" }}>Bid Submitted!</h3>
              <p style={{ fontSize: 13, color: "#6B7280" }}>Your bid has been submitted. The shipper will review and respond.</p>
              <a href="/dashboard/bids" style={{ display: "inline-block", marginTop: 16, fontSize: 13, fontWeight: 600, color: "#2563EB", textDecoration: "none" }}>
                View My Bids &rarr;
              </a>
            </div>
          ) : (
            <>
              {/* Rate Slider with Budget Reference */}
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Offered Rate ({"\u20B1"}) *</label>
                <input type="number" value={bidForm.offeredRate}
                  onChange={(e) => setBidForm({ ...bidForm, offeredRate: e.target.value })}
                  placeholder={`e.g. ${Math.round((load.budgetMin + load.budgetMax) / 2).toLocaleString()}`}
                  style={inputStyle} />
                {/* Visual range slider */}
                <div style={{ marginTop: 8 }}>
                  <input
                    type="range"
                    min={Math.round(load.budgetMin * 0.8)}
                    max={Math.round(load.budgetMax * 1.1)}
                    step={500}
                    value={bidForm.offeredRate || Math.round((load.budgetMin + load.budgetMax) / 2)}
                    onChange={(e) => setBidForm({ ...bidForm, offeredRate: e.target.value })}
                    style={{ width: "100%", accentColor: "#2563EB", cursor: "pointer" }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#9CA3AF", marginTop: 2 }}>
                    <span>{"\u20B1"}{Math.round(load.budgetMin * 0.8).toLocaleString()}</span>
                    <span style={{ color: "#059669", fontWeight: 600 }}>Budget: {"\u20B1"}{load.budgetMin.toLocaleString()} - {"\u20B1"}{load.budgetMax.toLocaleString()}</span>
                    <span>{"\u20B1"}{Math.round(load.budgetMax * 1.1).toLocaleString()}</span>
                  </div>
                  {/* Reference marks for budget range */}
                  <div style={{ position: "relative", height: 6, marginTop: 2 }}>
                    <div style={{
                      position: "absolute",
                      left: `${((load.budgetMin - load.budgetMin * 0.8) / (load.budgetMax * 1.1 - load.budgetMin * 0.8)) * 100}%`,
                      width: `${((load.budgetMax - load.budgetMin) / (load.budgetMax * 1.1 - load.budgetMin * 0.8)) * 100}%`,
                      height: 4, background: "#BBF7D0", borderRadius: 2, top: 0,
                    }} />
                  </div>
                </div>
              </div>

              {/* Profit Estimation Card */}
              {offeredRateNum > 0 && routeInfo && (
                <div style={{
                  padding: 14, borderRadius: 10, marginBottom: 16,
                  background: estProfit > 0 ? "#ECFDF5" : "#FEF2F2",
                  border: `1px solid ${estProfit > 0 ? "#BBF7D0" : "#FECACA"}`,
                }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>
                    <TrendingUp size={12} style={{ marginRight: 4, verticalAlign: "middle" }} />
                    Profit Estimation
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <div>
                      <div style={{ fontSize: 10, color: "#9CA3AF" }}>Your Bid</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{"\u20B1"}{offeredRateNum.toLocaleString()}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: "#9CA3AF" }}>Est. Fuel Cost</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#DC2626" }}>- {"\u20B1"}{estFuelCost.toLocaleString()}</div>
                    </div>
                    <div style={{ gridColumn: "span 2", borderTop: "1px solid #D1D5DB", paddingTop: 8, marginTop: 4 }}>
                      <div style={{ fontSize: 10, color: "#9CA3AF" }}>Projected Profit (fuel only)</div>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                        <span style={{ fontSize: 18, fontWeight: 800, color: estProfit > 0 ? "#059669" : "#DC2626" }}>
                          {"\u20B1"}{estProfit.toLocaleString()}
                        </span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: estProfit > 0 ? "#059669" : "#DC2626" }}>
                          ({profitMargin}% margin)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>
                  Select Vehicle from Fleet *
                  {suggestedVehicle && (
                    <span style={{ marginLeft: 8, fontSize: 10, fontWeight: 500, color: "#059669", background: "#DCFCE7", padding: "1px 6px", borderRadius: 4 }}>
                      Suggested: {suggestedVehicle.plateNo}
                    </span>
                  )}
                </label>
                <select value={bidForm.vehiclePlate}
                  onChange={(e) => setBidForm({ ...bidForm, vehiclePlate: e.target.value })}
                  style={{ ...inputStyle, background: "#FFFFFF", cursor: "pointer" }}>
                  <option value="">Choose a vehicle...</option>
                  {availableVehicles.map((v) => {
                    const isMatch = v.type === load.vehicleNeeded;
                    return (
                      <option key={v.id} value={v.plateNo}>
                        {isMatch ? "\u2713 " : ""}{v.plateNo} - {v.type} ({v.capacity.kg.toLocaleString()} kg / {v.capacity.cbm} CBM)
                      </option>
                    );
                  })}
                </select>
                {/* Show selected vehicle icon */}
                {selectedVehicle && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, padding: 8, background: "#F9FAFB", borderRadius: 8 }}>
                    <VehicleIcon type={selectedVehicle.type} size={40} color="#2563EB" />
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>{selectedVehicle.type} - {selectedVehicle.make}</div>
                      <div style={{ fontSize: 11, color: "#6B7280" }}>
                        {selectedVehicle.capacity.kg.toLocaleString()} kg / {selectedVehicle.capacity.cbm} CBM
                        {selectedVehicle.driver && <> &middot; Driver: {selectedVehicle.driver.name}</>}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Proposed Pickup Time</label>
                <input type="datetime-local" value={bidForm.proposedPickup}
                  onChange={(e) => setBidForm({ ...bidForm, proposedPickup: e.target.value })}
                  style={inputStyle} />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Message to Shipper</label>
                <textarea value={bidForm.message}
                  onChange={(e) => setBidForm({ ...bidForm, message: e.target.value })}
                  rows={3} placeholder="Why should the shipper choose you?"
                  style={{ ...inputStyle, resize: "vertical" }} />
              </div>

              <button onClick={handleSubmit} style={{
                width: "100%", padding: "12px", borderRadius: 8, border: "none",
                background: "#2563EB", color: "#FFFFFF", fontSize: 14, fontWeight: 600, cursor: "pointer",
              }}>
                Submit Bid
              </button>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ color: "#9CA3AF" }}>{icon}</div>
      <div>
        <div style={{ fontSize: 10, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</div>
        <div style={{ fontSize: 13, color: "#111827", fontWeight: 500 }}>{value}</div>
      </div>
    </div>
  );
}

const panel: React.CSSProperties = {
  background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 12, padding: 24,
};

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6,
};

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E5E7EB",
  fontSize: 13, outline: "none", boxSizing: "border-box",
};
