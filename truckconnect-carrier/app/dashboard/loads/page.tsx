"use client";
import { useState, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import VehicleIcon from "@/components/VehicleIcon";
import {
  MapPin, Package, Truck, Ship, Snowflake, Clock,
  DollarSign, Weight, Box, Search, Users, Filter, CheckCircle,
} from "lucide-react";
import { loads, vehicles } from "@/lib/mock-data";
import type { Load } from "@/lib/mock-data";

const filters = ["All", "FTL", "LTL", "Reefer", "Inter-Island"] as const;
type FilterType = (typeof filters)[number];

/** Format relative deadline like "2h left", "Expires tomorrow", "Expired" */
function formatDeadline(deadline: string): { text: string; color: string; urgent: boolean } {
  const now = new Date("2026-03-20T10:00:00");
  const dl = new Date(deadline + "T23:59:59");
  const diffMs = dl.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffMs < 0) return { text: "Expired", color: "#DC2626", urgent: true };
  if (diffHours <= 6) return { text: `${Math.ceil(diffHours)}h left`, color: "#DC2626", urgent: true };
  if (diffHours <= 24) return { text: "Expires today", color: "#D97706", urgent: true };
  if (diffDays <= 2) return { text: "Expires tomorrow", color: "#D97706", urgent: false };
  if (diffDays <= 3) return { text: `${Math.ceil(diffDays)} days left`, color: "#059669", urgent: false };
  return { text: `${Math.ceil(diffDays)} days left`, color: "#6B7280", urgent: false };
}

export default function LoadBoardPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");
  const [search, setSearch] = useState("");
  const [roroOnly, setRoroOnly] = useState(false);

  // Carrier's available vehicle types for fleet matching
  const availableVehicleTypes = useMemo(() => {
    return new Set(
      vehicles
        .filter((v) => v.status === "available")
        .map((v) => v.type)
    );
  }, []);

  const filtered: Load[] = loads.filter((l) => {
    const matchesFilter = activeFilter === "All"
      ? true
      : activeFilter === "Inter-Island"
        ? l.interIsland
        : l.loadType === activeFilter;
    const matchesSearch = search === "" ||
      l.origin.toLowerCase().includes(search.toLowerCase()) ||
      l.destination.toLowerCase().includes(search.toLowerCase()) ||
      l.cargoType.toLowerCase().includes(search.toLowerCase());
    const matchesRoro = !roroOnly || l.roroRequired;
    return matchesFilter && matchesSearch && matchesRoro;
  });

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827", margin: 0 }}>Load Board</h1>
        <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>Browse available loads and place bids</p>
      </div>

      {/* Filter Bar */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        {filters.map((f) => (
          <button key={f} onClick={() => setActiveFilter(f)} style={{
            padding: "8px 18px", borderRadius: 8, border: "1px solid",
            borderColor: activeFilter === f ? "#2563EB" : "#E5E7EB",
            background: activeFilter === f ? "#EFF6FF" : "#FFFFFF",
            color: activeFilter === f ? "#2563EB" : "#4B5563",
            fontSize: 13, fontWeight: 600, cursor: "pointer",
          }}>
            {f === "Inter-Island" && <Ship size={12} style={{ marginRight: 4, verticalAlign: "middle" }} />}
            {f === "Reefer" && <Snowflake size={12} style={{ marginRight: 4, verticalAlign: "middle" }} />}
            {f}
          </button>
        ))}
        <button onClick={() => setRoroOnly(!roroOnly)} style={{
          padding: "8px 14px", borderRadius: 8, border: "1px solid",
          borderColor: roroOnly ? "#2563EB" : "#E5E7EB",
          background: roroOnly ? "#EFF6FF" : "#FFFFFF",
          color: roroOnly ? "#2563EB" : "#4B5563",
          fontSize: 13, fontWeight: 600, cursor: "pointer",
        }}>
          <Ship size={12} style={{ marginRight: 4, verticalAlign: "middle" }} />
          RoRo Only
        </button>
        <div style={{ marginLeft: "auto", position: "relative" }}>
          <Search size={14} color="#9CA3AF" style={{ position: "absolute", left: 10, top: 10 }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search origin, destination, cargo..."
            style={{ padding: "8px 12px 8px 32px", borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 13, width: 260, outline: "none" }} />
        </div>
      </div>

      <div style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 16 }}>
        {filtered.length} load{filtered.length !== 1 ? "s" : ""} available
      </div>

      {/* Load Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
        {filtered.map((load) => {
          const deadline = formatDeadline(load.bidDeadline);
          const hasMatch = availableVehicleTypes.has(load.vehicleNeeded);

          return (
            <div key={load.id} style={{
              background: "#FFFFFF", border: hasMatch ? "1.5px solid #86EFAC" : "1px solid #E5E7EB",
              borderRadius: 12, padding: 20, position: "relative",
            }}>
              {/* Fleet Match Badge */}
              {hasMatch && (
                <div style={{
                  position: "absolute", top: 12, right: 12,
                  display: "flex", alignItems: "center", gap: 4,
                  padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                  background: "#DCFCE7", color: "#16A34A",
                }}>
                  <CheckCircle size={11} /> Fleet Match
                </div>
              )}

              {/* Route */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <MapPin size={16} color="#2563EB" />
                <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{load.origin}</span>
                <span style={{ color: "#D1D5DB", fontSize: 16 }}>&rarr;</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{load.destination}</span>
              </div>

              {/* Budget Range - Prominent */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "6px 14px", borderRadius: 8,
                background: "#ECFDF5", border: "1px solid #BBF7D0",
                marginBottom: 12,
              }}>
                <DollarSign size={14} color="#059669" />
                <span style={{ fontSize: 16, fontWeight: 800, color: "#059669" }}>
                  {"\u20B1"}{(load.budgetMin / 1000).toFixed(0)}K - {"\u20B1"}{(load.budgetMax / 1000).toFixed(0)}K
                </span>
              </div>

              {/* Cargo Details */}
              <div style={{ display: "flex", gap: 10, fontSize: 12, color: "#6B7280", marginBottom: 10, flexWrap: "wrap" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Package size={12} /> {load.cargoType}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Weight size={12} /> {load.weight.toLocaleString()} kg</span>
                <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Box size={12} /> {load.cbm} CBM</span>
              </div>

              {/* Badges with VehicleIcon */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
                <span style={{
                  padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600,
                  background: hasMatch ? "#DCFCE7" : "#F3F4F6",
                  color: hasMatch ? "#16A34A" : "#4B5563",
                  display: "inline-flex", alignItems: "center", gap: 4,
                }}>
                  <VehicleIcon type={load.vehicleNeeded} size={22} color={hasMatch ? "#16A34A" : "#6B7280"} />
                  {load.vehicleNeeded}
                </span>
                <span style={{
                  padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600,
                  background: load.loadType === "FTL" ? "#DBEAFE" : load.loadType === "Reefer" ? "#E0F2FE" : load.loadType === "Inter-Island" ? "#EDE9FE" : "#FEF3C7",
                  color: load.loadType === "FTL" ? "#2563EB" : load.loadType === "Reefer" ? "#0891B2" : load.loadType === "Inter-Island" ? "#7C3AED" : "#D97706",
                }}>
                  {load.loadType}
                </span>
                {load.roroRequired && (
                  <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600, background: "#DBEAFE", color: "#1D4ED8" }}>
                    <Ship size={10} style={{ marginRight: 3, verticalAlign: "middle" }} /> RoRo
                  </span>
                )}
                <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, color: "#9CA3AF" }}>
                  <Users size={10} /> {load.bidCount} bid{load.bidCount !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Payment & Deadline */}
              <div style={{ display: "flex", gap: 16, fontSize: 11, color: "#9CA3AF", marginBottom: 14, alignItems: "center" }}>
                <span><DollarSign size={10} style={{ marginRight: 2, verticalAlign: "middle" }} />{load.paymentTerms}</span>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 3,
                  padding: deadline.urgent ? "2px 8px" : undefined,
                  borderRadius: deadline.urgent ? 4 : undefined,
                  background: deadline.urgent ? (deadline.color === "#DC2626" ? "#FEE2E2" : "#FEF3C7") : undefined,
                  color: deadline.color, fontWeight: deadline.urgent ? 700 : 500,
                }}>
                  <Clock size={10} /> {deadline.text}
                </span>
              </div>

              {/* Footer */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #F3F4F6", paddingTop: 12 }}>
                <div style={{ fontSize: 12, color: "#9CA3AF" }}>{load.shipperName}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#2563EB" }}>{"\u20B1"}{load.rate.toLocaleString()}</div>
                  <a href={`/dashboard/loads/${load.id}`} style={{
                    padding: "8px 22px", borderRadius: 6, border: "none",
                    background: "#2563EB", color: "#FFFFFF", fontSize: 12, fontWeight: 600,
                    textDecoration: "none", cursor: "pointer",
                  }}>
                    Bid
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: 40, color: "#9CA3AF" }}>No loads match your filters.</div>
      )}
    </DashboardLayout>
  );
}
