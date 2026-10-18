"use client";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Truck, Package, Navigation, DollarSign, Gavel,
  ChevronRight, MapPin, TrendingUp, Clock,
  Search, Settings, Wallet, Users, ShieldAlert,
  FileWarning, AlertTriangle, CheckCircle2,
  Timer, UserCheck, UserX, Activity,
} from "lucide-react";
import Link from "next/link";
import { vehicles, loads, trips, bids, earnings, carrierStats, companyProfile } from "@/lib/mock-data";

const statusColor: Record<string, { bg: string; color: string; label: string }> = {
  available: { bg: "#DCFCE7", color: "#16A34A", label: "Available" },
  on_trip: { bg: "#DBEAFE", color: "#2563EB", label: "On Trip" },
  maintenance: { bg: "#FEE2E2", color: "#DC2626", label: "Maintenance" },
  inactive: { bg: "#F3F4F6", color: "#6B7280", label: "Inactive" },
};

const bidStatusColor: Record<string, { bg: string; color: string }> = {
  pending: { bg: "#FEF3C7", color: "#D97706" },
  accepted: { bg: "#DCFCE7", color: "#16A34A" },
  rejected: { bg: "#FEE2E2", color: "#DC2626" },
  expired: { bg: "#F3F4F6", color: "#6B7280" },
};

const recentBidActivity = [
  { id: 1, type: "bid_won", message: "Bid won: Manila to Cebu", detail: "₱52,000 — Load LD-2024-012", time: "25 min ago", icon: CheckCircle2, iconBg: "#DCFCE7", iconColor: "#059669" },
  { id: 2, type: "bid_placed", message: "Bid placed: Davao to GenSan", detail: "₱18,500 — Awaiting response", time: "1 hr ago", icon: Gavel, iconBg: "#FEF3C7", iconColor: "#D97706" },
  { id: 3, type: "bid_expired", message: "Bid expired: Clark to Subic", detail: "₱12,000 — No response from shipper", time: "3 hrs ago", icon: Timer, iconBg: "#F3F4F6", iconColor: "#6B7280" },
  { id: 4, type: "bid_placed", message: "Bid placed: Batangas to Lucena", detail: "₱9,800 — Competitive pricing", time: "5 hrs ago", icon: Gavel, iconBg: "#FEF3C7", iconColor: "#D97706" },
  { id: 5, type: "bid_won", message: "Bid won: Cebu to Tacloban", detail: "₱35,000 — Inter-island route", time: "8 hrs ago", icon: CheckCircle2, iconBg: "#DCFCE7", iconColor: "#059669" },
];

const driverSummary = {
  available: 8,
  onTrip: 5,
  offDuty: 3,
  total: 16,
};

const complianceAlerts = [
  { id: 1, type: "expiring", label: "LTFRB Franchise Renewal", detail: "Expires in 15 days", severity: "warning" as const },
  { id: 2, type: "expiring", label: "Vehicle Insurance — ABC-1234", detail: "Expires in 7 days", severity: "critical" as const },
  { id: 3, type: "expiring", label: "Driver License — J. Santos", detail: "Expires in 30 days", severity: "warning" as const },
  { id: 4, type: "missing", label: "OR/CR Missing — XYZ-5678", detail: "Upload required for compliance", severity: "critical" as const },
];

export default function CarrierDashboard() {
  const todayDispatches = trips.filter((t) => t.status !== "delivered" && t.startDate.startsWith("2026-03"));
  const recentBids = bids.slice(0, 5);

  const available = vehicles.filter((v) => v.status === "available").length;
  const onTrip = vehicles.filter((v) => v.status === "on_trip").length;
  const maint = vehicles.filter((v) => v.status === "maintenance").length;
  const inactive = vehicles.filter((v) => v.status === "inactive").length;
  const total = vehicles.length;
  const utilizationPct = total > 0 ? Math.round((onTrip / total) * 100) : 0;

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#111827", margin: 0 }}>Dashboard Overview</h1>
        <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>Welcome back, {companyProfile.owner} &mdash; {companyProfile.name}</p>
      </div>

      {/* Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Active Vehicles", value: carrierStats.activeVehicles, icon: Truck, color: "#059669", bg: "#ECFDF5" },
          { label: "Open Bids", value: carrierStats.openBids, icon: Gavel, color: "#D97706", bg: "#FEF3C7" },
          { label: "Active Trips", value: carrierStats.activeTrips, icon: Navigation, color: "#2563EB", bg: "#EFF6FF" },
          { label: "Monthly Earnings", value: `\u20B1${carrierStats.monthlyRevenue.toLocaleString()}`, icon: DollarSign, color: "#059669", bg: "#ECFDF5" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} style={panelCard}>
              <div style={{ width: 42, height: 42, borderRadius: 10, background: stat.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={20} color={stat.color} />
              </div>
              <div>
                <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 2 }}>{stat.label}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#111827" }}>{stat.value}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
        <Link href="/dashboard/loads" style={qaStyle}>
          <div style={{ ...qaIconBox, background: "#059669" }}>
            <Search size={18} color="#fff" />
          </div>
          <div>
            <span style={qaTextStyle}>Browse Loads</span>
            <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 1 }}>Find available shipments</div>
          </div>
        </Link>
        <Link href="/dashboard/fleet" style={qaStyle}>
          <div style={{ ...qaIconBox, background: "#059669" }}>
            <Settings size={18} color="#fff" />
          </div>
          <div>
            <span style={qaTextStyle}>Manage Fleet</span>
            <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 1 }}>Vehicles & maintenance</div>
          </div>
        </Link>
        <Link href="/dashboard/earnings" style={qaStyle}>
          <div style={{ ...qaIconBox, background: "#059669" }}>
            <Wallet size={18} color="#fff" />
          </div>
          <div>
            <span style={qaTextStyle}>View Earnings</span>
            <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 1 }}>Revenue & payouts</div>
          </div>
        </Link>
      </div>

      {/* Fleet Utilization + Driver Availability */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
        {/* Fleet Utilization Gauge */}
        <div style={panelStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: 0 }}>Fleet Utilization</h2>
            <Link href="/dashboard/fleet" style={linkStyle}>Manage Fleet <ChevronRight size={14} /></Link>
          </div>
          {/* Large circular-style gauge representation */}
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <div style={{ position: "relative", width: 120, height: 120, flexShrink: 0 }}>
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#E5E7EB" strokeWidth="10" />
                <circle cx="60" cy="60" r="50" fill="none" stroke="#059669" strokeWidth="10"
                  strokeDasharray={`${utilizationPct * 3.14} ${314 - utilizationPct * 3.14}`}
                  strokeDashoffset="78.5" strokeLinecap="round" />
              </svg>
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: "#059669" }}>{utilizationPct}%</div>
                <div style={{ fontSize: 10, color: "#6B7280" }}>Utilized</div>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              {[
                { label: "Available", count: available, color: "#22C55E" },
                { label: "On Trip", count: onTrip, color: "#059669" },
                { label: "Maintenance", count: maint, color: "#EF4444" },
                { label: "Inactive", count: inactive, color: "#9CA3AF" },
              ].map((item) => (
                <div key={item.label} style={{ marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <span style={{ fontSize: 12, color: "#6B7280", display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ width: 8, height: 8, borderRadius: 2, background: item.color, display: "inline-block" }} />
                      {item.label}
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#111827" }}>{item.count}</span>
                  </div>
                  <div style={{ width: "100%", height: 4, background: "#F3F4F6", borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ width: total > 0 ? `${(item.count / total) * 100}%` : "0%", height: "100%", background: item.color, borderRadius: 2 }} />
                  </div>
                </div>
              ))}
              <div style={{ fontSize: 12, color: "#6B7280", marginTop: 8, paddingTop: 8, borderTop: "1px solid #F3F4F6" }}>
                Total Fleet: <strong style={{ color: "#111827" }}>{total} vehicles</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Driver Availability */}
        <div style={panelStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: 0 }}>Driver Availability</h2>
            <Link href="/dashboard/drivers" style={linkStyle}>View All <ChevronRight size={14} /></Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
            <div style={{ background: "#ECFDF5", borderRadius: 10, padding: "16px 14px", textAlign: "center" }}>
              <UserCheck size={20} color="#059669" style={{ marginBottom: 6 }} />
              <div style={{ fontSize: 24, fontWeight: 800, color: "#059669" }}>{driverSummary.available}</div>
              <div style={{ fontSize: 11, color: "#065F46", fontWeight: 600 }}>Available</div>
            </div>
            <div style={{ background: "#EFF6FF", borderRadius: 10, padding: "16px 14px", textAlign: "center" }}>
              <Truck size={20} color="#2563EB" style={{ marginBottom: 6 }} />
              <div style={{ fontSize: 24, fontWeight: 800, color: "#2563EB" }}>{driverSummary.onTrip}</div>
              <div style={{ fontSize: 11, color: "#1E40AF", fontWeight: 600 }}>On Trip</div>
            </div>
            <div style={{ background: "#F3F4F6", borderRadius: 10, padding: "16px 14px", textAlign: "center" }}>
              <UserX size={20} color="#6B7280" style={{ marginBottom: 6 }} />
              <div style={{ fontSize: 24, fontWeight: 800, color: "#6B7280" }}>{driverSummary.offDuty}</div>
              <div style={{ fontSize: 11, color: "#4B5563", fontWeight: 600 }}>Off Duty</div>
            </div>
          </div>
          <div style={{ background: "#F9FAFB", borderRadius: 8, padding: "12px 14px", border: "1px solid #E5E7EB" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: "#6B7280" }}>Overall Availability</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#059669" }}>{Math.round((driverSummary.available / driverSummary.total) * 100)}%</span>
            </div>
            <div style={{ width: "100%", height: 8, background: "#E5E7EB", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ display: "flex", height: "100%" }}>
                <div style={{ width: `${(driverSummary.available / driverSummary.total) * 100}%`, background: "#059669", borderRadius: "4px 0 0 4px" }} />
                <div style={{ width: `${(driverSummary.onTrip / driverSummary.total) * 100}%`, background: "#3B82F6" }} />
                <div style={{ width: `${(driverSummary.offDuty / driverSummary.total) * 100}%`, background: "#9CA3AF", borderRadius: "0 4px 4px 0" }} />
              </div>
            </div>
            <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 6 }}>
              {driverSummary.total} total drivers registered
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Alerts */}
      {complianceAlerts.length > 0 && (
        <div style={{ ...panelStyle, marginBottom: 24, border: "1px solid #FDE68A", background: "#FFFBF0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <ShieldAlert size={18} color="#D97706" />
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#92400E", margin: 0 }}>Compliance Alerts</h2>
            <span style={{ marginLeft: "auto", fontSize: 11, background: "#FEF3C7", color: "#92400E", padding: "2px 8px", borderRadius: 4, fontWeight: 700 }}>
              {complianceAlerts.length} items
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {complianceAlerts.map((alert) => (
              <div key={alert.id} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 8,
                background: alert.severity === "critical" ? "#FEF2F2" : "#FFFBEB",
                border: `1px solid ${alert.severity === "critical" ? "#FECACA" : "#FDE68A"}`,
              }}>
                {alert.severity === "critical"
                  ? <AlertTriangle size={16} color="#DC2626" />
                  : <FileWarning size={16} color="#D97706" />
                }
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: alert.severity === "critical" ? "#991B1B" : "#92400E" }}>{alert.label}</div>
                  <div style={{ fontSize: 11, color: alert.severity === "critical" ? "#DC2626" : "#D97706" }}>{alert.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
        {/* Today's Dispatches */}
        <div style={panelStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: 0 }}>Today&apos;s Dispatches</h2>
            <Link href="/dashboard/trips" style={linkStyle}>View All <ChevronRight size={14} /></Link>
          </div>
          {todayDispatches.length === 0 ? (
            <div style={{ color: "#9CA3AF", fontSize: 13, padding: 20, textAlign: "center" }}>No dispatches today</div>
          ) : (
            todayDispatches.map((t) => (
              <div key={t.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #F3F4F6" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "#111827" }}>
                    <MapPin size={12} color="#059669" />
                    {t.origin} &rarr; {t.destination}
                  </div>
                  <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>{t.vehiclePlate} &middot; {t.driver}</div>
                </div>
                <span style={{
                  padding: "3px 10px", borderRadius: 20, fontSize: 10, fontWeight: 600,
                  background: t.status === "assigned" ? "#FEF3C7" : t.status === "picked_up" ? "#DBEAFE" : t.status === "in_transit" ? "#ECFDF5" : "#DCFCE7",
                  color: t.status === "assigned" ? "#D97706" : t.status === "picked_up" ? "#2563EB" : t.status === "in_transit" ? "#059669" : "#16A34A",
                  textTransform: "capitalize",
                }}>
                  {t.status.replace("_", " ")}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Recent Bids Activity Feed */}
        <div style={panelStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Activity size={16} color="#059669" />
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: 0 }}>Recent Bid Activity</h2>
            </div>
            <Link href="/dashboard/bids" style={linkStyle}>View All <ChevronRight size={14} /></Link>
          </div>
          {recentBidActivity.map((act, idx) => {
            const Icon = act.icon;
            return (
              <div key={act.id} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 0", borderBottom: idx < recentBidActivity.length - 1 ? "1px solid #F3F4F6" : "none" }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: act.iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                  <Icon size={14} color={act.iconColor} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{act.message}</div>
                  <div style={{ fontSize: 11, color: "#6B7280", marginTop: 1 }}>{act.detail}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 3, flexShrink: 0 }}>
                  <Clock size={10} color="#9CA3AF" />
                  <span style={{ fontSize: 10, color: "#9CA3AF", whiteSpace: "nowrap" }}>{act.time}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Bids Table */}
      <div style={panelStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: 0 }}>Active Bids</h2>
          <Link href="/dashboard/bids" style={linkStyle}>View All <ChevronRight size={14} /></Link>
        </div>
        {recentBids.map((b) => {
          const bs = bidStatusColor[b.status];
          return (
            <div key={b.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #F3F4F6" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{b.loadRoute}</div>
                <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>{b.id} &middot; {b.vehiclePlate}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#059669" }}>{"\u20B1"}{b.offeredRate.toLocaleString()}</span>
                <span style={{
                  padding: "3px 10px", borderRadius: 20, fontSize: 10, fontWeight: 600,
                  background: bs.bg, color: bs.color, textTransform: "capitalize",
                }}>
                  {b.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}

const panelCard: React.CSSProperties = {
  background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 12,
  padding: 20, display: "flex", alignItems: "center", gap: 14,
};

const panelStyle: React.CSSProperties = {
  background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 12, padding: 20,
};

const linkStyle: React.CSSProperties = {
  fontSize: 13, color: "#059669", fontWeight: 600, textDecoration: "none",
  display: "flex", alignItems: "center", gap: 4,
};

const qaStyle: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 10, background: "#fff",
  border: "1px solid #E5E7EB", borderRadius: 10, padding: "12px 16px",
  textDecoration: "none", cursor: "pointer",
};

const qaIconBox: React.CSSProperties = {
  width: 36, height: 36, borderRadius: 8, display: "flex",
  alignItems: "center", justifyContent: "center", flexShrink: 0,
};

const qaTextStyle: React.CSSProperties = {
  fontSize: 13, fontWeight: 600, color: "#111827",
};
