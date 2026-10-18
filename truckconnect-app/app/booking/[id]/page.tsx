"use client";

import { Star, Truck, MapPin, Phone, Mail, FileText, Clock, CheckCircle, Circle, Package, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";

/* ── StarRating component ────────────────────────────────────── */
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

/* ── Mock booking data ───────────────────────────────────────── */
const booking = {
  id: "BK-2026-03871",
  status: "In Transit" as const,
  load: {
    commodity: "FMCG Products (Canned Goods & Beverages)",
    weight: "12,400 kg",
    volume: "38 CBM",
    packaging: "Palletized (26 pallets)",
    specialInstructions: "Keep dry. Stack max 3 high. Handle with care.",
  },
  carrier: {
    name: "JMD Trucking Services",
    rating: 4.8,
    fleetSize: 45,
    completedTrips: 1_247,
    phone: "+63 917 555 1234",
    email: "dispatch@jmdtrucking.ph",
  },
  vehicle: {
    type: "Wing Van",
    plate: "ABC 1234",
    capacity: "15,000 kg / 42 CBM",
  },
  driver: {
    name: "Ramon dela Cruz",
    license: "N04-12-345678",
    phone: "+63 928 555 6789",
  },
  route: {
    origin: "Manila (Tondo Warehouse)",
    destination: "Cebu City (North Reclamation Area)",
    distance: "572 km (via RORO)",
    estimatedTransit: "18-22 hours",
  },
  dates: {
    requested: "2026-03-17 09:30",
    confirmed: "2026-03-17 11:15",
    pickup: "2026-03-18 06:00",
    estimatedDelivery: "2026-03-19 04:00",
  },
  cost: {
    freightRate: 45_000,
    fuelSurcharge: 3_500,
    roroFee: 8_200,
    insurance: 1_800,
    documentation: 500,
    total: 59_000,
  },
  documents: [
    { name: "Bill of Lading", code: "BOL-2026-03871", status: "Issued" },
    { name: "Waybill", code: "WB-2026-03871", status: "Issued" },
    { name: "Cargo Insurance", code: "INS-2026-03871", status: "Active" },
    { name: "Invoice", code: "INV-2026-03871", status: "Pending" },
  ],
  timeline: [
    { stage: "Requested", date: "Mar 17, 09:30 AM", done: true },
    { stage: "Confirmed", date: "Mar 17, 11:15 AM", done: true },
    { stage: "Picked Up", date: "Mar 18, 06:20 AM", done: true },
    { stage: "In Transit", date: "Mar 18, 07:00 AM", done: true, current: true },
    { stage: "Delivered", date: "Est. Mar 19, 04:00 AM", done: false },
  ],
};

const statusColors: Record<string, { bg: string; text: string }> = {
  Confirmed: { bg: "#DBEAFE", text: "#2563EB" },
  "In Transit": { bg: "#FEF3C7", text: "#D97706" },
  Delivered: { bg: "#D1FAE5", text: "#059669" },
};

const peso = (n: number) => "\u20B1" + n.toLocaleString("en-PH");

export default function BookingDetailPage() {
  const sc = statusColors[booking.status];

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 20px 64px" }}>
        {/* ── Header ──────────────────────────────── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111827", margin: 0 }}>Booking {booking.id}</h1>
            <p style={{ fontSize: 13, color: "#6B7280", marginTop: 4 }}>Created {booking.dates.requested}</p>
          </div>
          <span style={{
            padding: "6px 18px", borderRadius: 20, fontSize: 13, fontWeight: 700,
            background: sc.bg, color: sc.text,
          }}>
            {booking.status}
          </span>
        </div>

        {/* ── Route visualization ─────────────────── */}
        <div style={{
          background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 14, padding: "24px 28px", marginBottom: 20,
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            {/* Origin */}
            <div style={{ flex: 1, minWidth: 160 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <MapPin size={16} color="#059669" />
                <span style={{ fontSize: 11, fontWeight: 600, color: "#059669", textTransform: "uppercase", letterSpacing: 0.5 }}>Origin</span>
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{booking.route.origin}</div>
              <div style={{ fontSize: 12, color: "#6B7280" }}>Pickup: {booking.dates.pickup}</div>
            </div>
            {/* Progress bar */}
            <div style={{ flex: 2, minWidth: 200, padding: "0 12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 6 }}>
                <div style={{ flex: 1, height: 6, background: "#E5E7EB", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ width: "65%", height: "100%", background: "linear-gradient(90deg, #059669, #2563EB)", borderRadius: 3, transition: "width 0.5s" }} />
                </div>
                <Truck size={18} color="#2563EB" />
              </div>
              <div style={{ textAlign: "center", fontSize: 11, color: "#6B7280" }}>{booking.route.distance} | {booking.route.estimatedTransit}</div>
            </div>
            {/* Destination */}
            <div style={{ flex: 1, minWidth: 160, textAlign: "right" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "flex-end", marginBottom: 4 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: "#DC2626", textTransform: "uppercase", letterSpacing: 0.5 }}>Destination</span>
                <MapPin size={16} color="#DC2626" />
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{booking.route.destination}</div>
              <div style={{ fontSize: 12, color: "#6B7280" }}>ETA: {booking.dates.estimatedDelivery}</div>
            </div>
          </div>
        </div>

        {/* ── Two-column layout ───────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
          {/* Load details */}
          <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 14, padding: "22px 24px" }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
              <Package size={16} /> Load Details
            </h2>
            {[
              ["Commodity", booking.load.commodity],
              ["Weight", booking.load.weight],
              ["Volume", booking.load.volume],
              ["Packaging", booking.load.packaging],
            ].map(([label, value]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #F3F4F6" }}>
                <span style={{ fontSize: 13, color: "#6B7280" }}>{label}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{value}</span>
              </div>
            ))}
            <div style={{ marginTop: 10, padding: "8px 12px", background: "#FFFBEB", borderRadius: 8, fontSize: 12, color: "#92400E" }}>
              {booking.load.specialInstructions}
            </div>
          </div>

          {/* Carrier info */}
          <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 14, padding: "22px 24px" }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
              <Truck size={16} /> Carrier Information
            </h2>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 6 }}>{booking.carrier.name}</div>
            <div style={{ marginBottom: 10 }}>
              <StarRating rating={booking.carrier.rating} size={14} />
              <span style={{ fontSize: 12, color: "#6B7280", marginLeft: 6 }}>({booking.carrier.completedTrips} trips)</span>
            </div>
            {[
              ["Fleet Size", `${booking.carrier.fleetSize} vehicles`],
              ["Vehicle", `${booking.vehicle.type} (${booking.vehicle.plate})`],
              ["Capacity", booking.vehicle.capacity],
              ["Driver", booking.driver.name],
              ["License", booking.driver.license],
            ].map(([label, value]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #F3F4F6" }}>
                <span style={{ fontSize: 13, color: "#6B7280" }}>{label}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{value}</span>
              </div>
            ))}
            <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
              <span style={{ fontSize: 12, color: "#2563EB", display: "flex", alignItems: "center", gap: 4 }}><Phone size={12} />{booking.carrier.phone}</span>
              <span style={{ fontSize: 12, color: "#2563EB", display: "flex", alignItems: "center", gap: 4 }}><Mail size={12} />{booking.carrier.email}</span>
            </div>
          </div>
        </div>

        {/* ── Cost breakdown + Documents ──────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
          {/* Cost */}
          <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 14, padding: "22px 24px" }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 14 }}>Cost Breakdown</h2>
            {[
              ["Freight Rate", booking.cost.freightRate],
              ["Fuel Surcharge", booking.cost.fuelSurcharge],
              ["RORO Fee", booking.cost.roroFee],
              ["Cargo Insurance", booking.cost.insurance],
              ["Documentation", booking.cost.documentation],
            ].map(([label, value]) => (
              <div key={label as string} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #F3F4F6" }}>
                <span style={{ fontSize: 13, color: "#6B7280" }}>{label}</span>
                <span style={{ fontSize: 13, fontWeight: 500, color: "#374151" }}>{peso(value as number)}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0 0", marginTop: 4 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>Total</span>
              <span style={{ fontSize: 18, fontWeight: 800, color: "#059669" }}>{peso(booking.cost.total)}</span>
            </div>
          </div>

          {/* Documents */}
          <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 14, padding: "22px 24px" }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
              <FileText size={16} /> Documents
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {booking.documents.map((doc) => {
                const isActive = doc.status === "Issued" || doc.status === "Active";
                return (
                  <div key={doc.code} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "10px 14px", background: "#F9FAFB", borderRadius: 8,
                  }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{doc.name}</div>
                      <div style={{ fontSize: 11, color: "#9CA3AF" }}>{doc.code}</div>
                    </div>
                    <span style={{
                      padding: "3px 10px", borderRadius: 12, fontSize: 11, fontWeight: 600,
                      background: isActive ? "#D1FAE5" : "#FEF3C7",
                      color: isActive ? "#059669" : "#D97706",
                    }}>
                      {doc.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Timeline ────────────────────────────── */}
        <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 14, padding: "22px 28px" }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 18, display: "flex", alignItems: "center", gap: 6 }}>
            <Clock size={16} /> Booking Timeline
          </h2>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", position: "relative" }}>
            {/* Connecting line */}
            <div style={{
              position: "absolute", top: 14, left: 32, right: 32, height: 3, background: "#E5E7EB", zIndex: 0,
            }} />
            <div style={{
              position: "absolute", top: 14, left: 32, height: 3, zIndex: 1,
              width: `${(booking.timeline.filter((s) => s.done).length - 1) / (booking.timeline.length - 1) * (100 - 6.4)}%`,
              background: "linear-gradient(90deg, #059669, #2563EB)",
              borderRadius: 2,
            }} />

            {booking.timeline.map((step, i) => (
              <div key={step.stage} style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 2, flex: 1 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: step.done ? (step.current ? "#2563EB" : "#059669") : "#E5E7EB",
                  border: step.current ? "3px solid #BFDBFE" : "none",
                  marginBottom: 8,
                }}>
                  {step.done ? <CheckCircle size={14} color="#fff" /> : <Circle size={14} color="#9CA3AF" />}
                </div>
                <span style={{ fontSize: 12, fontWeight: step.current ? 700 : 600, color: step.done ? "#111827" : "#9CA3AF" }}>{step.stage}</span>
                <span style={{ fontSize: 10, color: "#9CA3AF", marginTop: 2, textAlign: "center" }}>{step.date}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
