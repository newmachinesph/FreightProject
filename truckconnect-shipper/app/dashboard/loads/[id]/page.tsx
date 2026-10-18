"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { loads, bookings, formatPeso, getBidsForLoad, getBookingForLoad } from "@/lib/mock-data";
import {
  MapPin,
  Package,
  Truck,
  Calendar,
  CreditCard,
  Anchor,
  Thermometer,
  AlertTriangle,
  FileText,
  Star,
  Check,
  X,
  Clock,
  Phone,
  CheckCircle2,
  Circle,
  Navigation,
  Ship,
  ArrowLeft,
  Camera,
  Share2,
  Copy,
  Award,
  Zap,
  TrendingDown,
  Box,
  Weight,
  Maximize,
} from "lucide-react";
import Link from "next/link";

const statusColor: Record<string, { bg: string; color: string; label: string }> = {
  draft: { bg: "#F3F4F6", color: "#6B7280", label: "Draft" },
  posted: { bg: "#DBEAFE", color: "#1E40AF", label: "Posted" },
  bidding: { bg: "#FEF3C7", color: "#92400E", label: "Bidding" },
  awarded: { bg: "#D1FAE5", color: "#065F46", label: "Awarded" },
  in_transit: { bg: "#E0E7FF", color: "#3730A3", label: "In Transit" },
  delivered: { bg: "#DCFCE7", color: "#166534", label: "Delivered" },
  cancelled: { bg: "#FEE2E2", color: "#991B1B", label: "Cancelled" },
};

// Vehicle icon SVG-like component
function VehicleIcon({ type, size = 28 }: { type: string; size?: number }) {
  const color = type.includes("Reefer") ? "#0EA5E9" : type.includes("Tanker") ? "#F59E0B" : type.includes("Wing") ? "#7C3AED" : type.includes("Trailer") ? "#DC2626" : type.includes("10-Wheeler") ? "#EA580C" : type.includes("L300") ? "#059669" : "#2563EB";
  return (
    <div style={{ width: size, height: size, borderRadius: 6, background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <Truck size={size * 0.55} color={color} />
    </div>
  );
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

// Full load lifecycle steps
const lifecycleSteps = [
  { key: "draft", label: "Draft", icon: FileText },
  { key: "posted", label: "Posted", icon: Package },
  { key: "bidding", label: "Bidding", icon: TrendingDown },
  { key: "awarded", label: "Awarded", icon: Award },
  { key: "pickup", label: "Pickup", icon: Truck },
  { key: "in_transit", label: "In Transit", icon: Navigation },
  { key: "delivered", label: "Delivered", icon: CheckCircle2 },
];

function getLifecycleStep(status: string): number {
  switch (status) {
    case "draft": return 0;
    case "posted": return 1;
    case "bidding": return 2;
    case "awarded": return 3;
    case "in_transit": return 5;
    case "delivered": return 6;
    case "cancelled": return -1;
    default: return 0;
  }
}

export default function LoadDetailPage() {
  const params = useParams();
  const loadId = params.id as string;
  const load = loads.find((l) => l.id === loadId);
  const loadBids = getBidsForLoad(loadId);
  const booking = getBookingForLoad(loadId);
  const [acceptedBid, setAcceptedBid] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);

  if (!load) {
    return (
      <DashboardLayout activeNav="/dashboard/loads">
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 80 }}>
          <Package size={48} color="#D1D5DB" />
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#374151", marginTop: 16 }}>Load not found</h2>
          <Link href="/dashboard/loads" style={{ marginTop: 12, color: "#2563EB", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>&larr; Back to My Loads</Link>
        </div>
      </DashboardLayout>
    );
  }

  const sc = statusColor[load.status] || statusColor.draft;
  const currentLifecycle = getLifecycleStep(load.status);

  // Find best value (lowest bid) and fastest (earliest delivery)
  const lowestBid = loadBids.length > 0 ? loadBids.reduce((min, b) => b.bidAmount < min.bidAmount ? b : min, loadBids[0]) : null;
  const fastestBid = loadBids.length > 0 ? loadBids.reduce((fast, b) => b.estimatedDelivery < fast.estimatedDelivery ? b : fast, loadBids[0]) : null;

  // Rate per km estimate (mock distance)
  const mockDistanceKm: Record<string, number> = {
    "Manila": 0, "Makati": 10, "Cebu": 570, "Clark": 80, "Batangas": 110,
    "Pasig": 15, "Davao": 1500, "General Santos": 1600, "Naga": 380,
    "Baguio": 250, "Pampanga": 65, "CDO": 800, "Iloilo": 630,
    "Laguna": 55, "Taguig": 18, "Subic": 120, "Bataan": 135,
    "Dumaguete": 670, "Quezon City": 12,
  };
  const distPickup = mockDistanceKm[load.pickupCity] ?? 0;
  const distDelivery = mockDistanceKm[load.deliveryCity] ?? 100;
  const estimatedKm = Math.max(Math.abs(distDelivery - distPickup), 20);

  // Tracking timeline for in_transit/delivered/awarded
  const timelineSteps = load.interIsland
    ? ["Load Posted", "Carrier Assigned", "Picked Up", "At Port", "On Vessel", "Delivered"]
    : ["Load Posted", "Carrier Assigned", "Picked Up", "In Transit", "Delivered"];

  let currentTimelineStep = 0;
  if (load.status === "posted" || load.status === "bidding") currentTimelineStep = 0;
  else if (load.status === "awarded") currentTimelineStep = 1;
  else if (load.status === "in_transit") currentTimelineStep = load.interIsland ? 4 : 3;
  else if (load.status === "delivered") currentTimelineStep = timelineSteps.length - 1;

  const handleShareLink = () => {
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  return (
    <DashboardLayout activeNav="/dashboard/loads">
      {/* Breadcrumb */}
      <div style={{ marginBottom: 16 }}>
        <Link href="/dashboard/loads" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#6B7280", fontSize: 13, textDecoration: "none", fontWeight: 500 }}>
          <ArrowLeft size={14} /> Back to My Loads
        </Link>
      </div>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827", margin: 0 }}>{load.id}</h1>
            <span style={{ display: "inline-block", padding: "4px 14px", borderRadius: 999, fontSize: 12, fontWeight: 600, background: sc.bg, color: sc.color }}>{sc.label}</span>
            {load.interIsland && (
              <span style={{ fontSize: 10, background: "#DBEAFE", color: "#1E40AF", padding: "3px 10px", borderRadius: 4, fontWeight: 600 }}>INTER-ISLAND</span>
            )}
            {load.instantBook && (
              <span style={{ fontSize: 10, background: "#DCFCE7", color: "#166534", padding: "3px 10px", borderRadius: 4, fontWeight: 600 }}>INSTANT BOOK</span>
            )}
          </div>
          <p style={{ fontSize: 14, color: "#6B7280", margin: 0 }}>Posted on {load.postedDate}</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={handleShareLink}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px",
              background: linkCopied ? "#DCFCE7" : "#F9FAFB", color: linkCopied ? "#059669" : "#374151",
              border: "1px solid", borderColor: linkCopied ? "#BBF7D0" : "#D1D5DB",
              borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
            }}
          >
            {linkCopied ? <><Check size={14} /> Link Copied!</> : <><Share2 size={14} /> Share Load</>}
          </button>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#059669" }}>{formatPeso(load.offeredRate)}</div>
        </div>
      </div>

      {/* Load Lifecycle Bar */}
      {load.status !== "cancelled" && (
        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: "16px 24px", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {lifecycleSteps.map((step, idx) => {
              const StepIcon = step.icon;
              const isCompleted = idx <= currentLifecycle;
              const isCurrent = idx === currentLifecycle;
              return (
                <div key={step.key} style={{ display: "flex", alignItems: "center", flex: idx < lifecycleSteps.length - 1 ? 1 : "none" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, position: "relative" }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: "50%",
                      background: isCompleted ? "#2563EB" : "#F3F4F6",
                      color: isCompleted ? "#fff" : "#9CA3AF",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      border: isCurrent ? "2px solid #93C5FD" : "2px solid transparent",
                      boxShadow: isCurrent ? "0 0 0 4px rgba(37,99,235,0.12)" : "none",
                      transition: "all 0.2s",
                    }}>
                      <StepIcon size={14} />
                    </div>
                    <span style={{
                      fontSize: 10, fontWeight: isCurrent ? 700 : 500,
                      color: isCompleted ? "#111827" : "#9CA3AF",
                      whiteSpace: "nowrap",
                    }}>
                      {step.label}
                    </span>
                  </div>
                  {idx < lifecycleSteps.length - 1 && (
                    <div style={{
                      flex: 1, height: 2, margin: "0 6px",
                      background: idx < currentLifecycle ? "#2563EB" : "#E5E7EB",
                      marginBottom: 18,
                    }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
      {load.status === "cancelled" && (
        <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 12, padding: "14px 24px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
          <X size={18} color="#DC2626" />
          <span style={{ fontSize: 14, fontWeight: 600, color: "#991B1B" }}>This load has been cancelled</span>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
        {/* Left column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Route visualization */}
          <div style={ds.card}>
            <h3 style={ds.cardTitle}><MapPin size={16} color="#2563EB" style={{ marginRight: 6, verticalAlign: "middle" }} />Route Information</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <div style={ds.label}>Pickup</div>
                <div style={ds.value}>{load.pickupAddress}</div>
                <div style={{ fontSize: 12, color: "#2563EB", fontWeight: 600, marginTop: 2 }}>{load.pickupCity}</div>
              </div>
              <div>
                <div style={ds.label}>Delivery</div>
                <div style={ds.value}>{load.deliveryAddress}</div>
                <div style={{ fontSize: 12, color: "#2563EB", fontWeight: 600, marginTop: 2 }}>{load.deliveryCity}</div>
              </div>
            </div>
            {load.interIsland && (
              <div style={{ marginTop: 12, padding: "10px 14px", background: "#EFF6FF", borderRadius: 8, display: "flex", alignItems: "center", gap: 8 }}>
                <Anchor size={14} color="#1E40AF" />
                <span style={{ fontSize: 13, color: "#1E40AF", fontWeight: 600 }}>{load.originIsland} &rarr; {load.destIsland} (RoRo)</span>
              </div>
            )}
            {/* Inline route map visualization */}
            <div style={{
              marginTop: 16, background: "linear-gradient(135deg, #EFF6FF 0%, #F0FDF4 100%)",
              border: "1px solid #DBEAFE", borderRadius: 10, padding: "20px 24px",
              position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, opacity: 0.04 }}>
                <svg width="100%" height="100%" viewBox="0 0 400 120">
                  <path d="M0,60 Q100,20 200,60 T400,60" fill="none" stroke="#2563EB" strokeWidth="80" />
                </svg>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
                {/* Origin */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#2563EB", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(37,99,235,0.25)" }}>
                    <MapPin size={18} />
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1E40AF" }}>{load.pickupCity}</div>
                  <div style={{ fontSize: 10, color: "#6B7280", maxWidth: 120, textAlign: "center" }}>{load.pickupAddress.split(",")[0]}</div>
                </div>
                {/* Route line with distance */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "0 16px" }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#6B7280" }}>~{estimatedKm} km</div>
                  <div style={{ width: "100%", position: "relative", height: 2 }}>
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "#D1D5DB" }} />
                    <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 2, background: "linear-gradient(90deg, #2563EB, #059669)" }} />
                    {/* Truck icon in the middle */}
                    <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", background: "#fff", borderRadius: 6, padding: "2px 6px", border: "1px solid #E5E7EB" }}>
                      {load.interIsland ? <Ship size={14} color="#1E40AF" /> : <Truck size={14} color="#2563EB" />}
                    </div>
                  </div>
                  <div style={{ fontSize: 10, color: "#9CA3AF" }}>{load.interIsland ? "Sea + Land Route" : "Land Route"}</div>
                </div>
                {/* Destination */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#059669", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(5,150,105,0.25)" }}>
                    <MapPin size={18} />
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#065F46" }}>{load.deliveryCity}</div>
                  <div style={{ fontSize: 10, color: "#6B7280", maxWidth: 120, textAlign: "center" }}>{load.deliveryAddress.split(",")[0]}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Cargo visualization */}
          <div style={ds.card}>
            <h3 style={ds.cardTitle}><Package size={16} color="#D97706" style={{ marginRight: 6, verticalAlign: "middle" }} />Cargo Details</h3>
            {/* Cargo visual card */}
            <div style={{
              display: "flex", gap: 16, padding: "16px 20px", marginBottom: 16,
              background: "linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)",
              borderRadius: 10, border: "1px solid #FDE68A",
            }}>
              <div style={{
                width: 72, height: 72, borderRadius: 12,
                background: "#fff", border: "1px solid #FDE68A",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, flexShrink: 0,
              }}>
                <VehicleIcon type={load.vehicleNeeded} size={32} />
                <span style={{ fontSize: 9, fontWeight: 600, color: "#92400E", textAlign: "center" }}>{load.vehicleNeeded}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 4 }}>{load.commodity}</div>
                <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 8 }}>{load.cargoCategory} / {load.cargoType}</div>
                <div style={{ display: "flex", gap: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Weight size={12} color="#92400E" />
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>{(load.weightKg / 1000).toFixed(1)}t</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Maximize size={12} color="#92400E" />
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>{load.volumeCbm} CBM</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Truck size={12} color="#92400E" />
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>x{load.numTrucks} {load.vehicleNeeded}</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              <div><div style={ds.label}>Category</div><div style={ds.value}>{load.cargoCategory}</div></div>
              <div><div style={ds.label}>Commodity</div><div style={ds.value}>{load.commodity}</div></div>
              <div><div style={ds.label}>Cargo Type</div><div style={ds.value}>{load.cargoType}</div></div>
              <div><div style={ds.label}>Weight</div><div style={ds.value}>{(load.weightKg / 1000).toFixed(1)} tons ({load.weightKg.toLocaleString()} kg)</div></div>
              <div><div style={ds.label}>Volume</div><div style={ds.value}>{load.volumeCbm} CBM</div></div>
              <div><div style={ds.label}>Vehicle Needed</div><div style={ds.value}>{load.vehicleNeeded} x{load.numTrucks}</div></div>
            </div>
            {(load.specialHandling || load.tempRequirement || load.hazmatClass) && (
              <div style={{ marginTop: 16, padding: "12px 14px", background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 8 }}>
                {load.specialHandling && (
                  <div style={{ marginBottom: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#92400E" }}>SPECIAL HANDLING: </span>
                    <span style={{ fontSize: 13, color: "#374151" }}>{load.specialHandling}</span>
                  </div>
                )}
                {load.tempRequirement && (
                  <div style={{ marginBottom: 6, display: "flex", alignItems: "center", gap: 4 }}>
                    <Thermometer size={12} color="#92400E" />
                    <span style={{ fontSize: 13, color: "#374151" }}>Temperature: {load.tempRequirement}</span>
                  </div>
                )}
                {load.hazmatClass && (
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <AlertTriangle size={12} color="#DC2626" />
                    <span style={{ fontSize: 13, color: "#DC2626", fontWeight: 600 }}>{load.hazmatClass}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Enhanced Bids section */}
          {(load.status === "posted" || load.status === "bidding") && loadBids.length > 0 && (
            <div style={ds.card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <h3 style={{ ...ds.cardTitle, margin: 0 }}>
                  <Award size={16} color="#7C3AED" style={{ marginRight: 6, verticalAlign: "middle" }} />
                  Carrier Bids ({loadBids.length})
                </h3>
                <div style={{ display: "flex", gap: 8 }}>
                  {lowestBid && (
                    <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 999, background: "#DCFCE7", color: "#166534", fontWeight: 600 }}>
                      Best: {formatPeso(lowestBid.bidAmount)}
                    </span>
                  )}
                  <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 999, background: "#F3F4F6", color: "#6B7280", fontWeight: 600 }}>
                    Avg: {formatPeso(Math.round(loadBids.reduce((s, b) => s + b.bidAmount, 0) / loadBids.length))}
                  </span>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {loadBids.map((bid) => {
                  const isBestValue = lowestBid && bid.id === lowestBid.id;
                  const isFastest = fastestBid && bid.id === fastestBid.id && (!isBestValue || loadBids.length === 1);
                  const ratePerKm = estimatedKm > 0 ? bid.bidAmount / estimatedKm : 0;
                  // Fleet size mock based on trips
                  const fleetSize = bid.tripsCompleted >= 20 ? "25+ trucks" : bid.tripsCompleted >= 10 ? "10-25 trucks" : "5-10 trucks";

                  return (
                    <div key={bid.id} style={{
                      border: acceptedBid === bid.id ? "2px solid #059669" : isBestValue ? "2px solid #2563EB" : "1px solid #E5E7EB",
                      borderRadius: 12, padding: "18px 22px",
                      background: acceptedBid === bid.id ? "#ECFDF5" : "#fff",
                      position: "relative",
                    }}>
                      {/* Badges */}
                      <div style={{ position: "absolute", top: -8, right: 16, display: "flex", gap: 6 }}>
                        {isBestValue && (
                          <span style={{
                            display: "inline-flex", alignItems: "center", gap: 3,
                            padding: "3px 10px", borderRadius: 999,
                            background: "#2563EB", color: "#fff", fontSize: 10, fontWeight: 700,
                            boxShadow: "0 1px 4px rgba(37,99,235,0.3)",
                          }}>
                            <TrendingDown size={10} /> Best Value
                          </span>
                        )}
                        {isFastest && (
                          <span style={{
                            display: "inline-flex", alignItems: "center", gap: 3,
                            padding: "3px 10px", borderRadius: 999,
                            background: "#F59E0B", color: "#fff", fontSize: 10, fontWeight: 700,
                            boxShadow: "0 1px 4px rgba(245,158,11,0.3)",
                          }}>
                            <Zap size={10} /> Fastest
                          </span>
                        )}
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                          {/* Carrier avatar */}
                          <div style={{
                            width: 44, height: 44, borderRadius: 10, background: "#EFF6FF",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 16, fontWeight: 800, color: "#2563EB", flexShrink: 0,
                          }}>
                            {bid.carrier.split(" ").map(w => w[0]).slice(0, 2).join("")}
                          </div>
                          <div>
                            <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{bid.carrier}</div>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4, flexWrap: "wrap" }}>
                              {/* Star rating */}
                              <StarRating rating={bid.carrierRating} size={12} />
                              <span style={{ fontSize: 11, color: "#6B7280", display: "flex", alignItems: "center", gap: 3 }}>
                                <Truck size={10} /> {fleetSize}
                              </span>
                              <span style={{ fontSize: 11, color: "#9CA3AF" }}>{bid.tripsCompleted} trips completed</span>
                            </div>
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 20, fontWeight: 800, color: "#059669" }}>{formatPeso(bid.bidAmount)}</div>
                          <div style={{ fontSize: 11, color: "#6B7280", marginTop: 2 }}>{formatPeso(Math.round(ratePerKm))}/km</div>
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 12, padding: "10px 14px", background: "#F9FAFB", borderRadius: 8 }}>
                        <div>
                          <span style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 600 }}>VEHICLE</span>
                          <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                            <VehicleIcon type={bid.vehicleOffered} size={20} />
                            <span style={{ fontSize: 12, color: "#374151", fontWeight: 500 }}>{bid.vehicleOffered}</span>
                          </div>
                        </div>
                        <div>
                          <span style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 600 }}>PLATE NO.</span>
                          <div style={{ fontSize: 12, color: "#374151", fontWeight: 500, fontFamily: "monospace", marginTop: 2 }}>{bid.plateNo}</div>
                        </div>
                        <div>
                          <span style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 600 }}>EST. PICKUP</span>
                          <div style={{ fontSize: 12, color: "#374151", fontWeight: 500, marginTop: 2 }}>{bid.estimatedPickup}</div>
                        </div>
                        <div>
                          <span style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 600 }}>EST. DELIVERY</span>
                          <div style={{ fontSize: 12, color: "#374151", fontWeight: 500, marginTop: 2 }}>{bid.estimatedDelivery}</div>
                        </div>
                      </div>

                      {bid.notes && (
                        <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 12, fontStyle: "italic", padding: "8px 12px", background: "#F9FAFB", borderRadius: 6, borderLeft: "3px solid #E5E7EB" }}>
                          &quot;{bid.notes}&quot;
                        </div>
                      )}

                      <div style={{ display: "flex", gap: 8 }}>
                        {acceptedBid === bid.id ? (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "8px 20px", background: "#DCFCE7", color: "#059669", borderRadius: 8, fontSize: 13, fontWeight: 700 }}>
                            <CheckCircle2 size={16} /> Bid Accepted
                          </span>
                        ) : (
                          <>
                            <button onClick={() => setAcceptedBid(bid.id)} style={{
                              display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 20px",
                              background: "#2563EB", color: "#fff", border: "none", borderRadius: 8,
                              fontSize: 13, fontWeight: 600, cursor: "pointer",
                              boxShadow: "0 1px 3px rgba(37,99,235,0.3)",
                            }}>
                              <Check size={14} /> Accept Bid
                            </button>
                            <button style={{
                              display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 20px",
                              background: "#fff", color: "#DC2626", border: "1px solid #FECACA", borderRadius: 8,
                              fontSize: 13, fontWeight: 600, cursor: "pointer",
                            }}>
                              <X size={14} /> Decline
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Assigned carrier info */}
          {booking && (load.status === "awarded" || load.status === "in_transit" || load.status === "delivered") && (
            <div style={ds.card}>
              <h3 style={ds.cardTitle}><Truck size={16} color="#059669" style={{ marginRight: 6, verticalAlign: "middle" }} />Assigned Carrier</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                <div><div style={ds.label}>Carrier</div><div style={{ ...ds.value, fontWeight: 700 }}>{booking.carrier}</div></div>
                <div><div style={ds.label}>Contact</div><div style={{ ...ds.value, display: "flex", alignItems: "center", gap: 4 }}><Phone size={12} color="#9CA3AF" />{booking.carrierContact}</div></div>
                <div><div style={ds.label}>Agreed Rate</div><div style={{ ...ds.value, fontWeight: 800, color: "#059669" }}>{formatPeso(booking.agreedRate)}</div></div>
                <div><div style={ds.label}>Vehicle</div><div style={ds.value}>{booking.vehicle}</div></div>
                <div><div style={ds.label}>Plate No.</div><div style={{ ...ds.value, fontFamily: "monospace" }}>{booking.plateNo}</div></div>
                <div><div style={ds.label}>Payment Terms</div><div style={ds.value}>{booking.paymentTerms}</div></div>
              </div>
            </div>
          )}

          {/* Tracking timeline */}
          {(load.status === "in_transit" || load.status === "delivered" || load.status === "awarded") && (
            <div style={ds.card}>
              <h3 style={ds.cardTitle}><Navigation size={16} color="#3730A3" style={{ marginRight: 6, verticalAlign: "middle" }} />Tracking Timeline</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {timelineSteps.map((step, idx) => {
                  const isCompleted = idx <= currentTimelineStep;
                  const isCurrent = idx === currentTimelineStep;
                  return (
                    <div key={step} style={{ display: "flex", gap: 12, position: "relative" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div style={{
                          width: 24, height: 24, borderRadius: "50%",
                          background: isCompleted ? "#2563EB" : "#F3F4F6",
                          color: isCompleted ? "#fff" : "#9CA3AF",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          border: isCurrent ? "2px solid #93C5FD" : "none",
                          boxShadow: isCurrent ? "0 0 0 4px rgba(37,99,235,0.1)" : "none",
                          flexShrink: 0,
                        }}>
                          {isCompleted ? <CheckCircle2 size={12} /> : <Circle size={12} />}
                        </div>
                        {idx < timelineSteps.length - 1 && (
                          <div style={{ width: 2, height: 32, background: idx < currentTimelineStep ? "#2563EB" : "#E5E7EB" }} />
                        )}
                      </div>
                      <div style={{ paddingBottom: 16 }}>
                        <div style={{ fontSize: 13, fontWeight: isCurrent ? 700 : 500, color: isCompleted ? "#111827" : "#9CA3AF" }}>{step}</div>
                        {isCurrent && <div style={{ fontSize: 11, color: "#6B7280", marginTop: 2 }}>Current status</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* POD / Delivery confirmation */}
          {load.status === "delivered" && (
            <div style={ds.card}>
              <h3 style={ds.cardTitle}><Camera size={16} color="#059669" style={{ marginRight: 6, verticalAlign: "middle" }} />Proof of Delivery</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div><div style={ds.label}>Delivered On</div><div style={ds.value}>{load.deliveryDate ?? load.pickupDate}</div></div>
                <div><div style={ds.label}>Received By</div><div style={ds.value}>Warehouse Manager</div></div>
                <div><div style={ds.label}>Condition</div><div style={{ ...ds.value, color: "#059669", fontWeight: 600 }}>Good - No Damage</div></div>
              </div>
              <div style={{ background: "#F9FAFB", border: "1px dashed #D1D5DB", borderRadius: 8, padding: 32, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <Camera size={24} color="#D1D5DB" />
                <span style={{ fontSize: 12, color: "#9CA3AF" }}>POD photos attached</span>
              </div>
            </div>
          )}
        </div>

        {/* Right column - summary */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Schedule card */}
          <div style={ds.card}>
            <h3 style={ds.cardTitle}><Calendar size={16} color="#059669" style={{ marginRight: 6, verticalAlign: "middle" }} />Schedule</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div><div style={ds.label}>Pickup Date</div><div style={ds.value}>{load.pickupDate}</div></div>
              <div><div style={ds.label}>Time Window</div><div style={ds.value}>{load.pickupWindow}</div></div>
              {load.deliveryDate && <div><div style={ds.label}>Delivery Date</div><div style={ds.value}>{load.deliveryDate}</div></div>}
              {load.bidDeadline && <div><div style={ds.label}>Bid Deadline</div><div style={{ ...ds.value, color: "#DC2626", fontWeight: 600 }}>{load.bidDeadline}</div></div>}
            </div>
          </div>

          {/* Payment card */}
          <div style={ds.card}>
            <h3 style={ds.cardTitle}><CreditCard size={16} color="#D97706" style={{ marginRight: 6, verticalAlign: "middle" }} />Payment</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div><div style={ds.label}>Offered Rate</div><div style={{ fontSize: 20, fontWeight: 800, color: "#059669" }}>{formatPeso(load.offeredRate)}</div></div>
              <div><div style={ds.label}>Rate per km</div><div style={{ fontSize: 14, fontWeight: 600, color: "#6B7280" }}>{formatPeso(Math.round(load.offeredRate / estimatedKm))}/km</div></div>
              <div><div style={ds.label}>Payment Terms</div><div style={ds.value}>{load.paymentTerms}</div></div>
              {booking && <div><div style={ds.label}>Agreed Rate</div><div style={{ fontSize: 18, fontWeight: 800, color: "#2563EB" }}>{formatPeso(booking.agreedRate)}</div></div>}
            </div>
          </div>

          {/* Reference card */}
          <div style={ds.card}>
            <h3 style={ds.cardTitle}><FileText size={16} color="#6B7280" style={{ marginRight: 6, verticalAlign: "middle" }} />Reference</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {load.referenceNo && <div><div style={ds.label}>Reference No.</div><div style={ds.value}>{load.referenceNo}</div></div>}
              {load.bocEntryNo && <div><div style={ds.label}>BOC Entry No.</div><div style={ds.value}>{load.bocEntryNo}</div></div>}
              <div><div style={ds.label}>Load ID</div><div style={{ ...ds.value, fontFamily: "monospace" }}>{load.id}</div></div>
            </div>
          </div>

          {/* Bid summary */}
          <div style={ds.card}>
            <h3 style={ds.cardTitle}>Bid Summary</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div><div style={ds.label}>Total Bids</div><div style={{ fontSize: 24, fontWeight: 800, color: "#111827" }}>{load.bids}</div></div>
              {loadBids.length > 0 && (
                <>
                  <div>
                    <div style={ds.label}>Lowest Bid</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 16, fontWeight: 700, color: "#059669" }}>{formatPeso(Math.min(...loadBids.map((b) => b.bidAmount)))}</span>
                      <span style={{ fontSize: 10, padding: "2px 6px", borderRadius: 999, background: "#DCFCE7", color: "#166534", fontWeight: 600 }}>BEST</span>
                    </div>
                  </div>
                  <div><div style={ds.label}>Highest Bid</div><div style={{ fontSize: 16, fontWeight: 700, color: "#DC2626" }}>{formatPeso(Math.max(...loadBids.map((b) => b.bidAmount)))}</div></div>
                  <div><div style={ds.label}>Savings vs Offered</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#059669" }}>
                      {formatPeso(load.offeredRate - Math.min(...loadBids.map((b) => b.bidAmount)))}
                      <span style={{ fontSize: 11, color: "#6B7280", fontWeight: 400, marginLeft: 4 }}>
                        ({Math.round(((load.offeredRate - Math.min(...loadBids.map((b) => b.bidAmount))) / load.offeredRate) * 100)}%)
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

const ds: Record<string, React.CSSProperties> = {
  card: { background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: "20px 24px" },
  cardTitle: { fontSize: 14, fontWeight: 700, color: "#111827", margin: "0 0 14px 0", display: "flex", alignItems: "center" },
  label: { fontSize: 10, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase" as const, letterSpacing: 0.5, marginBottom: 2 },
  value: { fontSize: 13, color: "#374151", fontWeight: 500 },
};
