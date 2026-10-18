"use client";
import { useState, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import VehicleIcon from "@/components/VehicleIcon";
import {
  Truck, Plus, ChevronDown, ChevronUp, Snowflake, Wrench,
  Navigation, CreditCard, Fuel, Gauge, Phone, MapPin, Search,
  X, Shield, Calendar, Activity, BarChart3, TrendingUp,
} from "lucide-react";
import { vehicles } from "@/lib/mock-data";
import type { Vehicle } from "@/lib/mock-data";

const statusColor: Record<string, { bg: string; color: string; label: string }> = {
  available: { bg: "#DCFCE7", color: "#16A34A", label: "Available" },
  on_trip: { bg: "#DBEAFE", color: "#2563EB", label: "On Trip" },
  maintenance: { bg: "#FEE2E2", color: "#DC2626", label: "Maintenance" },
  inactive: { bg: "#F3F4F6", color: "#6B7280", label: "Inactive" },
};

const statusFilters = ["All", "Available", "On Trip", "Maintenance", "Inactive"] as const;

// Vehicle dimensions & specs data (L x W x H in meters, fuel consumption L/100km)
const vehicleSpecs: Record<string, { length: number; width: number; height: number; fuelConsumption: number }> = {
  "L300 Van": { length: 4.7, width: 1.7, height: 1.9, fuelConsumption: 10 },
  "Closed Van": { length: 5.8, width: 2.1, height: 2.4, fuelConsumption: 14 },
  "Elf Truck": { length: 6.2, width: 2.2, height: 2.6, fuelConsumption: 16 },
  "Wing Van": { length: 7.5, width: 2.4, height: 2.7, fuelConsumption: 22 },
  "Dropside": { length: 7.8, width: 2.4, height: 2.0, fuelConsumption: 24 },
  "10-Wheeler": { length: 9.5, width: 2.5, height: 3.0, fuelConsumption: 30 },
  "Refrigerated Van": { length: 6.5, width: 2.2, height: 2.5, fuelConsumption: 18 },
  "Trailer": { length: 12.0, width: 2.5, height: 3.2, fuelConsumption: 35 },
  "Sedan": { length: 4.4, width: 1.7, height: 1.5, fuelConsumption: 7 },
  "MPV/SUV": { length: 4.7, width: 1.8, height: 1.8, fuelConsumption: 9 },
  "Tanker": { length: 10.0, width: 2.5, height: 3.5, fuelConsumption: 32 },
  "Flatbed": { length: 8.0, width: 2.5, height: 1.8, fuelConsumption: 26 },
};

// Mock trip history for vehicles
const tripHistory: Record<string, { date: string; from: string; to: string; revenue: number }[]> = {
  v1: [
    { date: "2026-03-18", from: "Quezon City", to: "Meycauayan, Bulacan", revenue: 5500 },
    { date: "2026-03-15", from: "Makati", to: "San Fernando, Pampanga", revenue: 8000 },
    { date: "2026-03-12", from: "Taguig", to: "Cabanatuan, Nueva Ecija", revenue: 12000 },
  ],
  v2: [
    { date: "2026-03-20", from: "Manila Port", to: "Clark, Pampanga", revenue: 15000 },
    { date: "2026-03-17", from: "Pasig", to: "Batangas City", revenue: 11000 },
  ],
  v3: [
    { date: "2026-03-19", from: "Caloocan", to: "Tarlac City", revenue: 14000 },
    { date: "2026-03-16", from: "Valenzuela", to: "Dagupan, Pangasinan", revenue: 18000 },
  ],
  v4: [
    { date: "2026-03-20", from: "Manila Port", to: "Cebu City (via RoRo)", revenue: 85000 },
    { date: "2026-03-14", from: "Subic", to: "Manila Port", revenue: 25000 },
  ],
  v5: [
    { date: "2026-03-10", from: "Meycauayan", to: "Olongapo City", revenue: 22000 },
  ],
  v6: [
    { date: "2026-03-20", from: "Batangas Port", to: "Iloilo City (via RoRo)", revenue: 95000 },
    { date: "2026-03-15", from: "Manila", to: "Batangas Port", revenue: 30000 },
  ],
  v7: [
    { date: "2026-03-19", from: "Navotas Fish Port", to: "SM Megamall", revenue: 18000 },
    { date: "2026-03-17", from: "Bulacan Cold Storage", to: "BGC", revenue: 15000 },
    { date: "2026-03-14", from: "Navotas", to: "Alabang", revenue: 12000 },
  ],
  v8: [
    { date: "2026-03-18", from: "Manila Port", to: "Baguio City", revenue: 55000 },
    { date: "2026-03-13", from: "Subic", to: "Manila Port", revenue: 40000 },
  ],
  v12: [
    { date: "2026-03-20", from: "Valenzuela", to: "Lipa, Batangas", revenue: 13000 },
    { date: "2026-03-18", from: "Quezon City", to: "San Pablo, Laguna", revenue: 10000 },
  ],
};

// Compliance mock
const complianceDates: Record<string, { insurance: string; ltfrbExp: string; emissionTest: string }> = {
  v1: { insurance: "2027-01-15", ltfrbExp: "2026-12-31", emissionTest: "2026-09-15" },
  v2: { insurance: "2026-12-01", ltfrbExp: "2026-11-30", emissionTest: "2026-08-20" },
  v3: { insurance: "2026-09-30", ltfrbExp: "2026-08-31", emissionTest: "2026-07-10" },
  v4: { insurance: "2027-03-20", ltfrbExp: "2027-02-28", emissionTest: "2026-12-15" },
  v5: { insurance: "2026-06-15", ltfrbExp: "2026-05-31", emissionTest: "2026-04-01" },
  v6: { insurance: "2027-05-10", ltfrbExp: "2027-04-30", emissionTest: "2027-01-20" },
  v7: { insurance: "2026-11-20", ltfrbExp: "2026-10-31", emissionTest: "2026-08-10" },
  v8: { insurance: "2026-08-05", ltfrbExp: "2026-07-31", emissionTest: "2026-06-01" },
  v9: { insurance: "2027-02-28", ltfrbExp: "2027-01-31", emissionTest: "2026-11-15" },
  v10: { insurance: "2027-04-15", ltfrbExp: "2027-03-31", emissionTest: "2027-01-10" },
  v11: { insurance: "2026-05-01", ltfrbExp: "2026-04-30", emissionTest: "2026-02-15" },
  v12: { insurance: "2027-06-30", ltfrbExp: "2027-05-31", emissionTest: "2027-03-01" },
};

// Color palette for type breakdown
const typeColors: Record<string, string> = {
  "L300 Van": "#3B82F6",
  "Closed Van": "#6366F1",
  "Elf Truck": "#8B5CF6",
  "Wing Van": "#EC4899",
  "Dropside": "#F59E0B",
  "10-Wheeler": "#EF4444",
  "Refrigerated Van": "#06B6D4",
  "Trailer": "#10B981",
  "Sedan": "#84CC16",
  "MPV/SUV": "#F97316",
  "Tanker": "#6B7280",
  "Flatbed": "#14B8A6",
};

export default function FleetPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const filtered = vehicles.filter((v) => {
    const matchesFilter = filter === "All" || statusColor[v.status]?.label === filter;
    const matchesSearch = search === "" ||
      v.plateNo.toLowerCase().includes(search.toLowerCase()) ||
      v.type.toLowerCase().includes(search.toLowerCase()) ||
      v.make.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Fleet overview stats
  const fleetStats = useMemo(() => {
    const totalCapacityKg = vehicles.reduce((sum, v) => sum + v.capacity.kg, 0);
    const totalCapacityCbm = vehicles.reduce((sum, v) => sum + v.capacity.cbm, 0);
    const availableCapacityKg = vehicles.filter(v => v.status === "available").reduce((sum, v) => sum + v.capacity.kg, 0);
    const inUseCapacityKg = vehicles.filter(v => v.status === "on_trip").reduce((sum, v) => sum + v.capacity.kg, 0);

    // Type breakdown
    const typeBreakdown: Record<string, number> = {};
    vehicles.forEach(v => {
      typeBreakdown[v.type] = (typeBreakdown[v.type] || 0) + 1;
    });

    // Status breakdown
    const statusBreakdown: Record<string, number> = {};
    vehicles.forEach(v => {
      statusBreakdown[v.status] = (statusBreakdown[v.status] || 0) + 1;
    });

    // Max capacity for bar scaling
    const maxCapacityKg = Math.max(...vehicles.map(v => v.capacity.kg));

    return { totalCapacityKg, totalCapacityCbm, availableCapacityKg, inUseCapacityKg, typeBreakdown, statusBreakdown, maxCapacityKg };
  }, []);

  return (
    <DashboardLayout>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827", margin: 0 }}>Fleet Management</h1>
            <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>
              {vehicles.length} vehicles registered &middot; {vehicles.filter((v) => v.status === "available").length} available
            </p>
          </div>
          <a href="/dashboard/fleet/new" style={{
            display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 8,
            border: "none", background: "#2563EB", color: "#FFFFFF", fontSize: 13, fontWeight: 600,
            textDecoration: "none", cursor: "pointer",
          }}>
            <Plus size={16} /> Add Vehicle
          </a>
        </div>
      </div>

      {/* Fleet Overview Section */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {/* Total Capacity */}
        <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 12, padding: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <BarChart3 size={18} color="#2563EB" />
            </div>
            <div style={{ fontSize: 12, color: "#6B7280", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>Total Capacity</div>
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#111827" }}>{(fleetStats.totalCapacityKg / 1000).toFixed(1)}t</div>
          <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>{fleetStats.totalCapacityCbm.toLocaleString()} CBM total</div>
        </div>

        {/* Available Capacity */}
        <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 12, padding: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: "#DCFCE7", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <TrendingUp size={18} color="#16A34A" />
            </div>
            <div style={{ fontSize: 12, color: "#6B7280", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>Available</div>
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#16A34A" }}>{(fleetStats.availableCapacityKg / 1000).toFixed(1)}t</div>
          <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>{Math.round((fleetStats.availableCapacityKg / fleetStats.totalCapacityKg) * 100)}% of fleet capacity</div>
        </div>

        {/* In-Use Capacity */}
        <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 12, padding: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: "#DBEAFE", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Navigation size={18} color="#2563EB" />
            </div>
            <div style={{ fontSize: 12, color: "#6B7280", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>In Use</div>
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#2563EB" }}>{(fleetStats.inUseCapacityKg / 1000).toFixed(1)}t</div>
          <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>{Math.round((fleetStats.inUseCapacityKg / fleetStats.totalCapacityKg) * 100)}% deployed</div>
        </div>

        {/* Utilization */}
        <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 12, padding: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: "#FEF3C7", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Activity size={18} color="#D97706" />
            </div>
            <div style={{ fontSize: 12, color: "#6B7280", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>Utilization</div>
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#D97706" }}>
            {Math.round(((fleetStats.statusBreakdown["on_trip"] || 0) / vehicles.length) * 100)}%
          </div>
          <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>
            {fleetStats.statusBreakdown["on_trip"] || 0} of {vehicles.length} on trip
          </div>
        </div>
      </div>

      {/* Vehicle Type Breakdown */}
      <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 12, padding: 20, marginBottom: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 14 }}>Vehicle Type Breakdown</div>
        <div style={{ display: "flex", gap: 2, height: 28, borderRadius: 6, overflow: "hidden", marginBottom: 12 }}>
          {Object.entries(fleetStats.typeBreakdown).map(([type, count]) => (
            <div
              key={type}
              style={{
                flex: count,
                background: typeColors[type] || "#9CA3AF",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, fontWeight: 700, color: "#FFFFFF",
                minWidth: count > 1 ? 40 : 24,
              }}
              title={`${type}: ${count}`}
            >
              {count > 1 ? count : ""}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          {Object.entries(fleetStats.typeBreakdown).map(([type, count]) => (
            <div key={type} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#4B5563" }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: typeColors[type] || "#9CA3AF" }} />
              {type} ({count})
            </div>
          ))}
        </div>
      </div>

      {/* Capacity Bar Chart */}
      <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 12, padding: 20, marginBottom: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 14 }}>Payload Capacity by Vehicle</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {vehicles.sort((a, b) => b.capacity.kg - a.capacity.kg).map(v => {
            const pct = (v.capacity.kg / fleetStats.maxCapacityKg) * 100;
            const sc = statusColor[v.status];
            return (
              <div key={v.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 80, fontSize: 11, color: "#6B7280", fontWeight: 600, textAlign: "right", flexShrink: 0 }}>
                  {v.plateNo}
                </div>
                <div style={{ flex: 1, height: 20, background: "#F3F4F6", borderRadius: 4, overflow: "hidden", position: "relative" }}>
                  <div style={{
                    width: `${pct}%`, height: "100%", borderRadius: 4,
                    background: `linear-gradient(90deg, ${sc.color}CC, ${sc.color})`,
                    display: "flex", alignItems: "center", paddingLeft: 6,
                    transition: "width 0.5s ease",
                  }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#FFFFFF", whiteSpace: "nowrap" }}>
                      {v.capacity.kg >= 1000 ? `${(v.capacity.kg / 1000).toFixed(0)}t` : `${v.capacity.kg}kg`}
                    </span>
                  </div>
                </div>
                <div style={{ width: 60, fontSize: 10, color: "#9CA3AF", flexShrink: 0 }}>{v.type}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        {statusFilters.map((f) => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: "7px 16px", borderRadius: 8, border: "1px solid",
            borderColor: filter === f ? "#2563EB" : "#E5E7EB",
            background: filter === f ? "#EFF6FF" : "#FFFFFF",
            color: filter === f ? "#2563EB" : "#4B5563",
            fontSize: 13, fontWeight: 600, cursor: "pointer",
          }}>
            {f}
          </button>
        ))}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ position: "relative" }}>
            <Search size={14} color="#9CA3AF" style={{ position: "absolute", left: 10, top: 10 }} />
            <input
              value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search plate, type, make..."
              style={{
                padding: "8px 12px 8px 32px", borderRadius: 8, border: "1px solid #E5E7EB",
                fontSize: 13, width: 220, outline: "none",
              }}
            />
          </div>
          <div style={{ display: "flex", gap: 2, background: "#F3F4F6", borderRadius: 6, padding: 2 }}>
            <button onClick={() => setViewMode("table")} style={{
              padding: "6px 12px", borderRadius: 4, border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer",
              background: viewMode === "table" ? "#FFFFFF" : "transparent", color: viewMode === "table" ? "#111827" : "#9CA3AF",
            }}>Table</button>
            <button onClick={() => setViewMode("grid")} style={{
              padding: "6px 12px", borderRadius: 4, border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer",
              background: viewMode === "grid" ? "#FFFFFF" : "transparent", color: viewMode === "grid" ? "#111827" : "#9CA3AF",
            }}>Grid</button>
          </div>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {filtered.map((v) => {
            const sc = statusColor[v.status];
            const specs = vehicleSpecs[v.type];
            return (
              <div
                key={v.id}
                onClick={() => setSelectedVehicle(v)}
                style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 12, padding: 18, cursor: "pointer", transition: "box-shadow 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)")}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 10 }}>
                  <VehicleIcon type={v.type} size={56} color={sc.color} />
                  <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 10, fontWeight: 600, background: sc.bg, color: sc.color }}>
                    {sc.label}
                  </span>
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#111827", letterSpacing: 0.5 }}>{v.plateNo}</div>
                <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>{v.type} &middot; {v.make}</div>
                <div style={{ display: "flex", gap: 12, fontSize: 12, color: "#6B7280", marginTop: 8, marginBottom: 8 }}>
                  <span>{v.capacity.kg.toLocaleString()} kg</span>
                  <span>{v.capacity.cbm} CBM</span>
                  <span>{v.bodyType}</span>
                </div>
                {/* Capacity bar */}
                <div style={{ height: 6, background: "#F3F4F6", borderRadius: 3, overflow: "hidden", marginBottom: 8 }}>
                  <div style={{ width: `${(v.capacity.kg / fleetStats.maxCapacityKg) * 100}%`, height: "100%", background: sc.color, borderRadius: 3 }} />
                </div>
                {specs && (
                  <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 6 }}>
                    {specs.length}m x {specs.width}m x {specs.height}m
                  </div>
                )}
                {v.reefer && <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#0891B2", marginBottom: 6 }}><Snowflake size={12} /> Reefer Capable</div>}
                <div style={{ fontSize: 12, color: "#9CA3AF", borderTop: "1px solid #F3F4F6", paddingTop: 8 }}>
                  {v.driver ? `Driver: ${v.driver.name}` : "Unassigned"}
                </div>
                <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 4 }}>
                  OR/CR Exp: {v.orcrExpiry} &middot; {v.yearModel}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 12, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" as const, fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
                <th style={th}>Vehicle</th>
                <th style={th}>Type</th>
                <th style={th}>Make/Model</th>
                <th style={th}>Capacity</th>
                <th style={th}>Dimensions</th>
                <th style={th}>Status</th>
                <th style={th}>Driver</th>
                <th style={th}>OR/CR Expiry</th>
                <th style={th}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((v, i) => {
                const sc = statusColor[v.status];
                const isExpanded = expandedId === v.id;
                return (
                  <VehicleRow key={v.id} v={v} sc={sc} isExpanded={isExpanded}
                    isLast={i === filtered.length - 1}
                    maxCapacity={fleetStats.maxCapacityKg}
                    onToggle={() => setExpandedId(isExpanded ? null : v.id)}
                    onDetail={() => setSelectedVehicle(v)}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: 40, color: "#9CA3AF" }}>
          No vehicles match your filters.
        </div>
      )}

      {/* Vehicle Detail Modal */}
      {selectedVehicle && (
        <VehicleDetailModal
          vehicle={selectedVehicle}
          onClose={() => setSelectedVehicle(null)}
        />
      )}
    </DashboardLayout>
  );
}

function VehicleRow({ v, sc, isExpanded, isLast, maxCapacity, onToggle, onDetail }: {
  v: Vehicle; sc: { bg: string; color: string; label: string };
  isExpanded: boolean; isLast: boolean; maxCapacity: number;
  onToggle: () => void; onDetail: () => void;
}) {
  const Chevron = isExpanded ? ChevronUp : ChevronDown;
  const specs = vehicleSpecs[v.type];
  return (
    <>
      <tr style={{ borderBottom: isLast && !isExpanded ? "none" : "1px solid #F3F4F6", cursor: "pointer" }} onClick={onToggle}>
        <td style={td}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <VehicleIcon type={v.type} size={36} color={sc.color} />
            <span style={{ fontWeight: 700, color: "#111827", letterSpacing: 0.3 }}>{v.plateNo}</span>
          </div>
        </td>
        <td style={td}><span style={{ color: "#4B5563" }}>{v.type}</span></td>
        <td style={td}><span style={{ color: "#4B5563" }}>{v.make} ({v.yearModel})</span></td>
        <td style={td}>
          <div>
            <div style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ color: "#111827", fontWeight: 600 }}>{v.capacity.kg.toLocaleString()} kg</span>
              <span style={{ color: "#9CA3AF" }}>/ {v.capacity.cbm} CBM</span>
            </div>
            {/* Mini capacity bar */}
            <div style={{ width: 80, height: 4, background: "#F3F4F6", borderRadius: 2, marginTop: 4, overflow: "hidden" }}>
              <div style={{ width: `${(v.capacity.kg / maxCapacity) * 100}%`, height: "100%", background: sc.color, borderRadius: 2 }} />
            </div>
          </div>
        </td>
        <td style={td}>
          {specs ? (
            <span style={{ color: "#6B7280", fontSize: 11, fontFamily: "monospace" }}>
              {specs.length} x {specs.width} x {specs.height}m
            </span>
          ) : (
            <span style={{ color: "#D1D5DB", fontSize: 11 }}>--</span>
          )}
        </td>
        <td style={td}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 20,
            fontSize: 11, fontWeight: 600, background: sc.bg, color: sc.color,
          }}>
            {v.status === "maintenance" && <Wrench size={11} />}
            {v.status === "on_trip" && <Navigation size={11} />}
            {sc.label}
          </span>
        </td>
        <td style={td}><span style={{ color: "#4B5563" }}>{v.driver?.name ?? "Unassigned"}</span></td>
        <td style={td}><span style={{ color: "#6B7280", fontSize: 12 }}>{v.orcrExpiry}</span></td>
        <td style={td}><Chevron size={14} color="#9CA3AF" /></td>
      </tr>
      {isExpanded && (
        <tr style={{ borderBottom: isLast ? "none" : "1px solid #F3F4F6" }}>
          <td colSpan={9} style={{ padding: 0 }}>
            <div style={{ background: "#F9FAFB", padding: "16px 24px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 12 }}>
                <DetailItem icon={<CreditCard size={13} color="#6B7280" />} label="LTO OR" value={v.ltoOR} />
                <DetailItem icon={<CreditCard size={13} color="#6B7280" />} label="LTO CR" value={v.ltoCR} />
                <DetailItem icon={<CreditCard size={13} color="#6B7280" />} label="LTFRB Franchise" value={v.ltfrbFranchise} />
                <DetailItem icon={<Fuel size={13} color="#6B7280" />} label="Fuel Type" value={v.fuelType.charAt(0).toUpperCase() + v.fuelType.slice(1)} />
                <DetailItem icon={<Gauge size={13} color="#6B7280" />} label="GPS Device" value={v.gpsDeviceId ?? "None"} />
                <DetailItem icon={<Snowflake size={13} color="#6B7280" />} label="Reefer Capable" value={v.reefer ? "Yes" : "No"} />
                {specs && (
                  <>
                    <DetailItem icon={<Truck size={13} color="#6B7280" />} label="Dimensions (L x W x H)" value={`${specs.length} x ${specs.width} x ${specs.height} m`} />
                    <DetailItem icon={<Fuel size={13} color="#6B7280" />} label="Fuel Consumption" value={`${specs.fuelConsumption} L/100km`} />
                  </>
                )}
                {v.driver && (
                  <>
                    <DetailItem icon={<CreditCard size={13} color="#6B7280" />} label="Driver License" value={v.driver.license} />
                    <DetailItem icon={<Phone size={13} color="#6B7280" />} label="Driver Mobile" value={v.driver.mobile} />
                  </>
                )}
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); onDetail(); }}
                style={{
                  padding: "6px 16px", borderRadius: 6, border: "1px solid #2563EB",
                  background: "#EFF6FF", color: "#2563EB", fontSize: 12, fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                View Full Details
              </button>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

/* ── Vehicle Detail Modal ─────────────────────────────────────────────────── */
function VehicleDetailModal({ vehicle, onClose }: { vehicle: Vehicle; onClose: () => void }) {
  const sc = statusColor[vehicle.status];
  const specs = vehicleSpecs[vehicle.type];
  const compliance = complianceDates[vehicle.id];
  const trips = tripHistory[vehicle.id] || [];

  const isDateExpiring = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date("2026-03-20");
    const diff = (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return diff < 60;
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#FFFFFF", borderRadius: 16, width: "100%", maxWidth: 800,
          maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        }}
      >
        {/* Modal Header */}
        <div style={{ padding: "24px 28px 0", display: "flex", justifyContent: "space-between", alignItems: "start" }}>
          <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
            <div style={{
              background: `${sc.bg}`, borderRadius: 12, padding: 12,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <VehicleIcon type={vehicle.type} size={100} color={sc.color} />
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#111827", letterSpacing: 0.5 }}>{vehicle.plateNo}</div>
              <div style={{ fontSize: 14, color: "#6B7280", marginTop: 2 }}>{vehicle.type} &middot; {vehicle.make} ({vehicle.yearModel})</div>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 12px", borderRadius: 20,
                fontSize: 12, fontWeight: 600, background: sc.bg, color: sc.color, marginTop: 8,
              }}>
                {vehicle.status === "maintenance" && <Wrench size={12} />}
                {vehicle.status === "on_trip" && <Navigation size={12} />}
                {sc.label}
              </span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
            <X size={20} color="#9CA3AF" />
          </button>
        </div>

        <div style={{ padding: "20px 28px 28px" }}>
          {/* Specs Grid */}
          <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 12 }}>Vehicle Specifications</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
            <SpecCard label="Payload Capacity" value={`${vehicle.capacity.kg.toLocaleString()} kg`} sub={`${vehicle.capacity.cbm} CBM volume`} />
            {specs && (
              <>
                <SpecCard label="Dimensions (L x W x H)" value={`${specs.length} x ${specs.width} x ${specs.height} m`} sub={`${(specs.length * specs.width * specs.height).toFixed(1)} m\u00B3 gross`} />
                <SpecCard label="Fuel Consumption" value={`${specs.fuelConsumption} L/100km`} sub={vehicle.fuelType.charAt(0).toUpperCase() + vehicle.fuelType.slice(1)} />
              </>
            )}
            <SpecCard label="Body Type" value={vehicle.bodyType} sub={vehicle.reefer ? "Reefer Capable" : "Standard"} />
            <SpecCard label="Year Model" value={String(vehicle.yearModel)} sub={vehicle.make} />
            <SpecCard label="GPS Tracker" value={vehicle.gpsDeviceId ? "Active" : "Not Installed"} sub={vehicle.gpsDeviceId || "N/A"} />
          </div>

          {/* Driver Assignment */}
          <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 12 }}>Driver Assignment</div>
          {vehicle.driver ? (
            <div style={{ background: "#F9FAFB", borderRadius: 10, padding: 16, display: "flex", gap: 20, marginBottom: 24, alignItems: "center" }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#DBEAFE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700, color: "#2563EB" }}>
                {vehicle.driver.name.charAt(0)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{vehicle.driver.name}</div>
                <div style={{ display: "flex", gap: 16, marginTop: 4 }}>
                  <span style={{ fontSize: 12, color: "#6B7280", display: "flex", alignItems: "center", gap: 4 }}>
                    <CreditCard size={12} /> {vehicle.driver.license}
                  </span>
                  <span style={{ fontSize: 12, color: "#6B7280", display: "flex", alignItems: "center", gap: 4 }}>
                    <Phone size={12} /> {vehicle.driver.mobile}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ background: "#FEF3C7", borderRadius: 10, padding: 16, marginBottom: 24, color: "#92400E", fontSize: 13, fontWeight: 600 }}>
              No driver assigned to this vehicle
            </div>
          )}

          {/* GPS Status */}
          <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 12 }}>GPS Status</div>
          <div style={{ background: "#F9FAFB", borderRadius: 10, padding: 16, marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 10, height: 10, borderRadius: "50%",
              background: vehicle.gpsDeviceId ? "#16A34A" : "#D1D5DB",
              boxShadow: vehicle.gpsDeviceId ? "0 0 6px #16A34A" : "none",
            }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>
                {vehicle.gpsDeviceId ? "Online - Tracking Active" : "No GPS Device"}
              </div>
              <div style={{ fontSize: 12, color: "#6B7280" }}>
                {vehicle.gpsDeviceId ? `Device: ${vehicle.gpsDeviceId} | Last ping: 2 min ago` : "Install a GPS device to enable tracking"}
              </div>
            </div>
          </div>

          {/* Compliance Status */}
          <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 12 }}>
            <Shield size={14} style={{ display: "inline", verticalAlign: "text-bottom", marginRight: 6 }} />
            Compliance Status
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10, marginBottom: 24 }}>
            <ComplianceItem
              label="OR/CR Expiry"
              date={vehicle.orcrExpiry}
              expiring={isDateExpiring(vehicle.orcrExpiry)}
            />
            {compliance && (
              <>
                <ComplianceItem label="Insurance" date={compliance.insurance} expiring={isDateExpiring(compliance.insurance)} />
                <ComplianceItem label="LTFRB Franchise" date={compliance.ltfrbExp} expiring={isDateExpiring(compliance.ltfrbExp)} />
                <ComplianceItem label="Emission Test" date={compliance.emissionTest} expiring={isDateExpiring(compliance.emissionTest)} />
              </>
            )}
          </div>

          {/* Trip History */}
          <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 12 }}>Recent Trip History</div>
          {trips.length > 0 ? (
            <div style={{ borderRadius: 10, overflow: "hidden", border: "1px solid #E5E7EB" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ background: "#F9FAFB" }}>
                    <th style={{ ...th, fontSize: 10, padding: "8px 12px" }}>Date</th>
                    <th style={{ ...th, fontSize: 10, padding: "8px 12px" }}>From</th>
                    <th style={{ ...th, fontSize: 10, padding: "8px 12px" }}>To</th>
                    <th style={{ ...th, fontSize: 10, padding: "8px 12px", textAlign: "right" as const }}>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {trips.map((trip, i) => (
                    <tr key={i} style={{ borderBottom: i < trips.length - 1 ? "1px solid #F3F4F6" : "none" }}>
                      <td style={{ padding: "8px 12px", color: "#6B7280", fontFamily: "monospace" }}>{trip.date}</td>
                      <td style={{ padding: "8px 12px", color: "#111827" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <MapPin size={11} color="#9CA3AF" /> {trip.from}
                        </div>
                      </td>
                      <td style={{ padding: "8px 12px", color: "#111827" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <MapPin size={11} color="#2563EB" /> {trip.to}
                        </div>
                      </td>
                      <td style={{ padding: "8px 12px", color: "#16A34A", fontWeight: 700, textAlign: "right", fontFamily: "monospace" }}>
                        PHP {trip.revenue.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ background: "#F9FAFB", borderRadius: 10, padding: 16, color: "#9CA3AF", fontSize: 12, textAlign: "center" }}>
              No recent trips recorded
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Helpers ──────────────────────────────────────────────────────────────── */

function DetailItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      {icon}
      <div>
        <div style={{ fontSize: 10, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</div>
        <div style={{ fontSize: 13, color: "#111827", fontWeight: 500, fontFamily: "monospace" }}>{value}</div>
      </div>
    </div>
  );
}

function SpecCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div style={{ background: "#F9FAFB", borderRadius: 8, padding: 14 }}>
      <div style={{ fontSize: 10, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{value}</div>
      <div style={{ fontSize: 11, color: "#6B7280", marginTop: 2 }}>{sub}</div>
    </div>
  );
}

function ComplianceItem({ label, date, expiring }: { label: string; date: string; expiring: boolean }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      background: expiring ? "#FEF2F2" : "#F0FDF4", borderRadius: 8, padding: "10px 14px",
    }}>
      <div>
        <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: expiring ? "#DC2626" : "#16A34A", fontFamily: "monospace" }}>
          {date}
        </div>
      </div>
      <div style={{
        width: 8, height: 8, borderRadius: "50%",
        background: expiring ? "#EF4444" : "#22C55E",
      }} />
    </div>
  );
}

const th: React.CSSProperties = {
  textAlign: "left" as const, padding: "12px 12px", fontSize: 11, fontWeight: 600, color: "#6B7280",
  textTransform: "uppercase" as const, letterSpacing: 0.5,
};
const td: React.CSSProperties = { padding: "12px 12px" };
