"use client";
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import VehicleIcon from "@/components/VehicleIcon";
import {
  MapPin, Ship, CheckCircle, Upload, Clock, Navigation,
  Truck, Package, ChevronDown, ChevronUp, Phone, User,
  Anchor,
} from "lucide-react";
import { trips, vehicles, drivers } from "@/lib/mock-data";
import type { Trip } from "@/lib/mock-data";

const statusFilters = ["All", "Active", "Delivered"] as const;

const tripStatusStyle: Record<string, { bg: string; color: string; label: string }> = {
  assigned: { bg: "#FEF3C7", color: "#D97706", label: "Assigned" },
  picked_up: { bg: "#DBEAFE", color: "#2563EB", label: "Picked Up" },
  in_transit: { bg: "#ECFDF5", color: "#059669", label: "In Transit" },
  delivered: { bg: "#DCFCE7", color: "#16A34A", label: "Delivered" },
};

const epodStyle: Record<string, { bg: string; color: string; label: string }> = {
  pending: { bg: "#FEF3C7", color: "#D97706", label: "ePOD Pending" },
  uploaded: { bg: "#DBEAFE", color: "#2563EB", label: "ePOD Uploaded" },
  confirmed: { bg: "#DCFCE7", color: "#16A34A", label: "ePOD Confirmed" },
};

// Timeline step config with icons
const timelineSteps = [
  { key: "assigned", label: "Assigned", icon: Package },
  { key: "picked_up", label: "Pickup", icon: Upload },
  { key: "in_transit", label: "In Transit", icon: Navigation },
  { key: "delivered", label: "Delivered", icon: CheckCircle },
];

export default function TripsPage() {
  const [filter, setFilter] = useState("All");
  const [expandedTrip, setExpandedTrip] = useState<string | null>(null);
  const [tripStatuses, setTripStatuses] = useState<Record<string, string>>({});
  const [epodStatuses, setEpodStatuses] = useState<Record<string, string>>({});

  const getStatus = (trip: Trip) => tripStatuses[trip.id] || trip.status;
  const getEpod = (trip: Trip) => epodStatuses[trip.id] || trip.epodStatus;

  const filtered = trips.filter((t) => {
    const status = getStatus(t);
    if (filter === "All") return true;
    if (filter === "Active") return status !== "delivered";
    return status === "delivered";
  });

  const advanceStatus = (tripId: string, currentStatus: string) => {
    const order = ["assigned", "picked_up", "in_transit", "delivered"];
    const idx = order.indexOf(currentStatus);
    if (idx < order.length - 1) {
      setTripStatuses((prev) => ({ ...prev, [tripId]: order[idx + 1] }));
    }
  };

  const uploadEpod = (tripId: string) => {
    setEpodStatuses((prev) => ({ ...prev, [tripId]: "uploaded" }));
  };

  const activeCount = trips.filter((t) => getStatus(t) !== "delivered").length;
  const deliveredCount = trips.filter((t) => getStatus(t) === "delivered").length;

  // Get driver info by name
  const getDriverInfo = (driverName: string) => {
    const driver = drivers.find((d) => d.name === driverName);
    if (driver) return driver;
    // Fallback: search in vehicles
    const vehicle = vehicles.find((v) => v.driver?.name === driverName);
    return vehicle?.driver ? { name: vehicle.driver.name, phone: vehicle.driver.mobile } : null;
  };

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827", margin: 0 }}>Trips</h1>
        <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>
          {activeCount} active &middot; {deliveredCount} completed
        </p>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {statusFilters.map((f) => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: "8px 18px", borderRadius: 8, border: "1px solid",
            borderColor: filter === f ? "#2563EB" : "#E5E7EB",
            background: filter === f ? "#EFF6FF" : "#FFFFFF",
            color: filter === f ? "#2563EB" : "#4B5563",
            fontSize: 13, fontWeight: 600, cursor: "pointer",
          }}>
            {f}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {filtered.map((trip) => {
          const status = getStatus(trip);
          const epod = getEpod(trip);
          const ss = tripStatusStyle[status] || tripStatusStyle.assigned;
          const isExpanded = expandedTrip === trip.id;
          const driverInfo = getDriverInfo(trip.driver);

          return (
            <div key={trip.id} style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 12, overflow: "hidden" }}>
              {/* Header */}
              <div style={{ padding: 20, cursor: "pointer" }} onClick={() => setExpandedTrip(isExpanded ? null : trip.id)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <MapPin size={14} color="#2563EB" />
                      <span style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{trip.origin}</span>
                      <span style={{ color: "#D1D5DB" }}>&rarr;</span>
                      <span style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{trip.destination}</span>
                      {trip.interIsland && (
                        <span style={{ padding: "2px 6px", borderRadius: 4, fontSize: 10, fontWeight: 600, background: "#DBEAFE", color: "#1D4ED8" }}>
                          <Ship size={9} style={{ marginRight: 2, verticalAlign: "middle" }} />Inter-Island
                        </span>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: 12, fontSize: 12, color: "#6B7280", alignItems: "center" }}>
                      <span>{trip.shipperName}</span>
                      {/* Vehicle with icon */}
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                        <VehicleIcon type={trip.vehicleType} size={24} color="#2563EB" />
                        <span style={{ fontWeight: 600, color: "#374151" }}>{trip.vehiclePlate}</span>
                        <span style={{ color: "#9CA3AF" }}>({trip.vehicleType})</span>
                      </span>
                      {/* Driver with phone */}
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                        <User size={11} color="#6B7280" />
                        <span style={{ fontWeight: 600, color: "#374151" }}>{trip.driver}</span>
                        {driverInfo && "phone" in driverInfo && (
                          <a
                            href={`tel:${driverInfo.phone}`}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              display: "inline-flex", alignItems: "center", gap: 2,
                              padding: "1px 6px", borderRadius: 4, fontSize: 10, fontWeight: 600,
                              background: "#DCFCE7", color: "#16A34A", textDecoration: "none",
                            }}
                          >
                            <Phone size={9} /> Call
                          </a>
                        )}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 18, fontWeight: 800, color: "#2563EB" }}>{"\u20B1"}{trip.rate.toLocaleString()}</div>
                      <div style={{ fontSize: 11, color: "#9CA3AF", fontFamily: "monospace" }}>{trip.id}</div>
                    </div>
                    <span style={{
                      padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600,
                      background: ss.bg, color: ss.color,
                    }}>
                      {ss.label}
                    </span>
                    {isExpanded ? <ChevronUp size={16} color="#9CA3AF" /> : <ChevronDown size={16} color="#9CA3AF" />}
                  </div>
                </div>

                {/* Compact timeline progress bar (always visible) */}
                <div style={{ marginTop: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
                    {timelineSteps.map((step, i) => {
                      const statusOrder = ["assigned", "picked_up", "in_transit", "delivered"];
                      const currentIdx = statusOrder.indexOf(status);
                      const isDone = i <= currentIdx;
                      const isCurrent = i === currentIdx;
                      const StepIcon = step.icon;

                      return (
                        <div key={step.key} style={{ display: "flex", alignItems: "center", flex: i < timelineSteps.length - 1 ? 1 : 0 }}>
                          <div style={{ position: "relative" }}>
                            <div style={{
                              width: 24, height: 24, borderRadius: "50%",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              background: isDone ? "#2563EB" : "#F3F4F6",
                              border: isCurrent ? "2px solid #2563EB" : "none",
                              boxShadow: isCurrent ? "0 0 0 3px rgba(37,99,235,0.2)" : "none",
                            }}>
                              <StepIcon size={11} color={isDone ? "#FFFFFF" : "#D1D5DB"} />
                            </div>
                          </div>
                          {i < timelineSteps.length - 1 && (
                            <div style={{
                              flex: 1, height: 3, borderRadius: 2,
                              background: isDone && i < currentIdx ? "#2563EB" : "#E5E7EB",
                              margin: "0 2px",
                            }} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                    {timelineSteps.map((step, i) => {
                      const statusOrder = ["assigned", "picked_up", "in_transit", "delivered"];
                      const currentIdx = statusOrder.indexOf(status);
                      const isDone = i <= currentIdx;
                      return (
                        <span key={step.key} style={{
                          fontSize: 9, fontWeight: isDone ? 700 : 400,
                          color: isDone ? "#2563EB" : "#9CA3AF",
                          textAlign: i === 0 ? "left" : i === timelineSteps.length - 1 ? "right" : "center",
                          flex: 1,
                        }}>
                          {step.label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div style={{ borderTop: "1px solid #F3F4F6", padding: 20 }}>
                  {/* Driver & Vehicle Info Cards */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                    {/* Driver Card */}
                    <div style={{ padding: 14, background: "#F9FAFB", borderRadius: 10, display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: "50%", background: "#EFF6FF",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 16, fontWeight: 700, color: "#2563EB",
                      }}>
                        {trip.driver.charAt(0)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{trip.driver}</div>
                        {driverInfo && "phone" in driverInfo && (
                          <div style={{ fontSize: 12, color: "#6B7280" }}>{driverInfo.phone}</div>
                        )}
                      </div>
                      {driverInfo && "phone" in driverInfo && (
                        <a
                          href={`tel:${driverInfo.phone}`}
                          style={{
                            display: "inline-flex", alignItems: "center", gap: 4,
                            padding: "6px 14px", borderRadius: 6, fontSize: 12, fontWeight: 600,
                            background: "#2563EB", color: "#FFFFFF", textDecoration: "none",
                          }}
                        >
                          <Phone size={12} /> Call Driver
                        </a>
                      )}
                    </div>

                    {/* Vehicle Card */}
                    <div style={{ padding: 14, background: "#F9FAFB", borderRadius: 10, display: "flex", alignItems: "center", gap: 12 }}>
                      <VehicleIcon type={trip.vehicleType} size={48} color="#2563EB" />
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{trip.vehiclePlate}</div>
                        <div style={{ fontSize: 12, color: "#6B7280" }}>{trip.vehicleType}</div>
                      </div>
                    </div>
                  </div>

                  {/* Detailed Timeline */}
                  <h4 style={{ fontSize: 13, fontWeight: 700, color: "#111827", margin: "0 0 16px 0" }}>Trip Timeline</h4>
                  <div style={{ display: "flex", gap: 0, marginBottom: 20 }}>
                    {trip.milestones.map((m, i) => {
                      const statusOrder = ["assigned", "picked_up", "in_transit", "delivered"];
                      const currentIdx = statusOrder.indexOf(status);
                      const isDone = i <= currentIdx;
                      const isCurrent = i === currentIdx;
                      // Check for port step on inter-island
                      const isPortStep = trip.interIsland && i === 2;

                      return (
                        <div key={m.label} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                            <div style={{
                              width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                              background: isDone ? "#2563EB" : "#F3F4F6",
                              border: isCurrent ? "2.5px solid #2563EB" : "2px solid transparent",
                              boxShadow: isCurrent ? "0 0 0 4px rgba(37,99,235,0.15)" : "none",
                            }}>
                              {isDone ? <CheckCircle size={14} color="#FFFFFF" /> : <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#D1D5DB" }} />}
                            </div>
                            <span style={{ fontSize: 10, fontWeight: isDone ? 700 : 500, color: isDone ? "#2563EB" : "#9CA3AF", whiteSpace: "nowrap" }}>
                              {isPortStep && trip.interIsland ? (
                                <span style={{ display: "flex", alignItems: "center", gap: 2 }}>
                                  <Anchor size={9} /> {m.label}
                                </span>
                              ) : m.label}
                            </span>
                            {m.date && <span style={{ fontSize: 9, color: "#9CA3AF" }}>{m.date}</span>}
                          </div>
                          {i < trip.milestones.length - 1 && (
                            <div style={{ flex: 1, height: 2, background: isDone && i < currentIdx ? "#2563EB" : "#E5E7EB", margin: "0 4px", marginBottom: 30 }} />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    {status !== "delivered" && (
                      <button onClick={() => advanceStatus(trip.id, status)} style={{
                        padding: "10px 20px", borderRadius: 8, border: "none",
                        background: "#2563EB", color: "#FFFFFF", fontSize: 13, fontWeight: 600, cursor: "pointer",
                        display: "flex", alignItems: "center", gap: 6,
                      }}>
                        <Navigation size={14} />
                        {status === "assigned" ? "Mark as Picked Up" :
                          status === "picked_up" ? "Start Transit" :
                            "Mark as Delivered"}
                      </button>
                    )}

                    {status === "delivered" && (!epod || epod === "pending") && (
                      <button onClick={() => uploadEpod(trip.id)} style={{
                        padding: "10px 20px", borderRadius: 8, border: "none",
                        background: "#059669", color: "#FFFFFF", fontSize: 13, fontWeight: 600, cursor: "pointer",
                        display: "flex", alignItems: "center", gap: 6,
                      }}>
                        <Upload size={14} /> Upload ePOD
                      </button>
                    )}

                    {epod && (
                      <span style={{
                        padding: "10px 16px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                        background: epodStyle[epod]?.bg || "#F3F4F6",
                        color: epodStyle[epod]?.color || "#6B7280",
                        display: "flex", alignItems: "center", gap: 6,
                      }}>
                        {epod === "confirmed" && <CheckCircle size={12} />}
                        {epod === "uploaded" && <Upload size={12} />}
                        {epod === "pending" && <Clock size={12} />}
                        {epodStyle[epod]?.label || "N/A"}
                      </span>
                    )}

                    <div style={{ marginLeft: "auto", fontSize: 12, color: "#9CA3AF" }}>
                      Started: {trip.startDate}
                      {trip.endDate && <> &middot; Completed: {trip.endDate}</>}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: 40, color: "#9CA3AF" }}>No trips match this filter.</div>
      )}
    </DashboardLayout>
  );
}
