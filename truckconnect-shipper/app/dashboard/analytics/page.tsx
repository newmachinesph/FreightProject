"use client";
import DashboardLayout from "@/components/DashboardLayout";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Truck,
  Star,
  MapPin,
  Leaf,
  DollarSign,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
} from "lucide-react";

// ─── Mock Data ───

const monthlyVolume = [
  { month: "Oct 2025", loads: 18 },
  { month: "Nov 2025", loads: 24 },
  { month: "Dec 2025", loads: 31 },
  { month: "Jan 2026", loads: 22 },
  { month: "Feb 2026", loads: 28 },
  { month: "Mar 2026", loads: 35 },
];

const spendByRoute = [
  { route: "Manila - Cebu", spend: 285000, pct: 32 },
  { route: "Manila - Davao", spend: 195000, pct: 22 },
  { route: "Laguna - Iloilo", spend: 142000, pct: 16 },
  { route: "Cebu - CDO", spend: 118000, pct: 13 },
  { route: "Other Routes", spend: 152000, pct: 17 },
];

const spendByCargoType = [
  { type: "Dry Goods", spend: 320000, pct: 36 },
  { type: "Refrigerated", spend: 248000, pct: 28 },
  { type: "Heavy Equipment", spend: 165000, pct: 18 },
  { type: "Perishables", spend: 98000, pct: 11 },
  { type: "Documents", spend: 61000, pct: 7 },
];

const spendByCarrier = [
  { carrier: "JRS Express", spend: 210000, pct: 24 },
  { carrier: "LBC Cargo", spend: 185000, pct: 21 },
  { carrier: "2GO Freight", spend: 168000, pct: 19 },
  { carrier: "Air21 Logistics", spend: 145000, pct: 16 },
  { carrier: "Others", spend: 184000, pct: 20 },
];

const rateTrend = [
  { month: "Oct", rate: 28.5 },
  { month: "Nov", rate: 29.1 },
  { month: "Dec", rate: 31.8 },
  { month: "Jan", rate: 30.2 },
  { month: "Feb", rate: 29.8 },
  { month: "Mar", rate: 30.5 },
];

const topCarriers = [
  { name: "JRS Express", rating: 4.8, onTime: 96, loads: 42 },
  { name: "LBC Cargo", rating: 4.7, onTime: 94, loads: 38 },
  { name: "2GO Freight", rating: 4.6, onTime: 91, loads: 35 },
  { name: "Air21 Logistics", rating: 4.5, onTime: 89, loads: 30 },
  { name: "AP Cargo", rating: 4.4, onTime: 87, loads: 24 },
];

const routeEfficiency = [
  { route: "Laguna - Taguig", distance: 45, avgCost: 3200, costPerKm: 71.1, efficiency: "high" as const },
  { route: "Manila - Pampanga", distance: 70, avgCost: 4100, costPerKm: 58.6, efficiency: "high" as const },
  { route: "Manila - Cebu", distance: 570, avgCost: 18500, costPerKm: 32.5, efficiency: "medium" as const },
  { route: "Manila - Davao", distance: 1500, avgCost: 35000, costPerKm: 23.3, efficiency: "medium" as const },
  { route: "Cebu - CDO", distance: 350, avgCost: 14200, costPerKm: 40.6, efficiency: "low" as const },
];

const carbonData = {
  totalKg: 12840,
  prevMonthKg: 11200,
  trendPct: 14.6,
  trendUp: true,
  breakdown: [
    { source: "Road Transport", kg: 8960, pct: 70 },
    { source: "Sea Freight (RoRo)", kg: 2568, pct: 20 },
    { source: "Last Mile", kg: 1312, pct: 10 },
  ],
};

// ─── Helpers ───

const maxVolume = Math.max(...monthlyVolume.map((m) => m.loads));

function formatPeso(v: number): string {
  return "\u20B1" + v.toLocaleString();
}

// ─── Component ───

export default function AnalyticsPage() {
  return (
    <DashboardLayout activeNav="/dashboard/analytics">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827", margin: 0 }}>Analytics & Reports</h1>
        <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>Insights on your shipping performance and spend</p>
      </div>

      {/* KPI Summary Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        <KpiCard icon={<Package size={18} />} iconBg="#DBEAFE" iconColor="#1E40AF" label="Total Loads (6mo)" value="158" change="+18%" up />
        <KpiCard icon={<DollarSign size={18} />} iconBg="#FEF3C7" iconColor="#92400E" label="Total Spend (6mo)" value={formatPeso(892000)} change="+12%" up />
        <KpiCard icon={<TrendingUp size={18} />} iconBg="#DCFCE7" iconColor="#166534" label="Avg Rate / km" value={formatPeso(30.5)} change="-2.1%" up={false} />
        <KpiCard icon={<Clock size={18} />} iconBg="#E0E7FF" iconColor="#3730A3" label="On-time Delivery" value="93%" change="+3%" up />
      </div>

      {/* Row 1: Shipping Volume + Spend Breakdown */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        {/* Shipping Volume Bar Chart */}
        <div style={s.card}>
          <div style={s.cardHeader}>
            <BarChart3 size={16} color="#2563EB" />
            <span style={s.cardTitle}>Shipping Volume</span>
          </div>
          <p style={{ fontSize: 11, color: "#9CA3AF", margin: "0 0 16px" }}>Loads posted per month</p>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 160 }}>
            {monthlyVolume.map((m) => {
              const barH = Math.max(8, (m.loads / maxVolume) * 140);
              return (
                <div key={m.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#111827", marginBottom: 4 }}>{m.loads}</span>
                  <div style={{ width: "100%", height: barH, background: "linear-gradient(180deg, #2563EB, #3B82F6)", borderRadius: "4px 4px 0 0", minWidth: 24 }} />
                  <span style={{ fontSize: 9, color: "#6B7280", marginTop: 6, whiteSpace: "nowrap" }}>{m.month.replace("20", "'")}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Spend Breakdown */}
        <div style={s.card}>
          <div style={s.cardHeader}>
            <DollarSign size={16} color="#2563EB" />
            <span style={s.cardTitle}>Spend Breakdown</span>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 0, marginBottom: 14, borderBottom: "1px solid #E5E7EB" }}>
            <SpendTab label="By Route" active />
            <SpendTab label="By Cargo" />
            <SpendTab label="By Carrier" />
          </div>

          {/* By Route (default view) */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {spendByRoute.map((r) => (
              <div key={r.route}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 500, color: "#374151" }}>{r.route}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>{formatPeso(r.spend)}</span>
                </div>
                <div style={{ height: 6, background: "#F3F4F6", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: 6, width: `${r.pct}%`, background: "#2563EB", borderRadius: 3 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Rate Trend + Carrier Performance */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        {/* Average Rate Trend */}
        <div style={s.card}>
          <div style={s.cardHeader}>
            <TrendingUp size={16} color="#2563EB" />
            <span style={s.cardTitle}>Average Rate per km</span>
          </div>
          <p style={{ fontSize: 11, color: "#9CA3AF", margin: "0 0 16px" }}>Rate trend over last 6 months</p>

          {/* Simple line chart using SVG */}
          <div style={{ position: "relative", height: 140, marginBottom: 8 }}>
            <svg width="100%" height="140" viewBox="0 0 300 140" preserveAspectRatio="none">
              {/* Grid lines */}
              {[0, 1, 2, 3, 4].map((i) => (
                <line key={i} x1="0" y1={i * 35} x2="300" y2={i * 35} stroke="#F3F4F6" strokeWidth="1" />
              ))}
              {/* Area fill */}
              <path
                d={`M0,${140 - ((rateTrend[0].rate - 25) / 10) * 140} ${rateTrend.map((p, i) => `L${(i / (rateTrend.length - 1)) * 300},${140 - ((p.rate - 25) / 10) * 140}`).join(" ")} L300,140 L0,140 Z`}
                fill="rgba(37,99,235,0.08)"
              />
              {/* Line */}
              <polyline
                fill="none"
                stroke="#2563EB"
                strokeWidth="2.5"
                strokeLinejoin="round"
                points={rateTrend.map((p, i) => `${(i / (rateTrend.length - 1)) * 300},${140 - ((p.rate - 25) / 10) * 140}`).join(" ")}
              />
              {/* Data points */}
              {rateTrend.map((p, i) => (
                <circle
                  key={i}
                  cx={(i / (rateTrend.length - 1)) * 300}
                  cy={140 - ((p.rate - 25) / 10) * 140}
                  r="4"
                  fill="#fff"
                  stroke="#2563EB"
                  strokeWidth="2"
                />
              ))}
            </svg>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {rateTrend.map((p) => (
              <span key={p.month} style={{ fontSize: 9, color: "#6B7280" }}>{p.month}</span>
            ))}
          </div>
        </div>

        {/* Carrier Performance */}
        <div style={s.card}>
          <div style={s.cardHeader}>
            <Truck size={16} color="#2563EB" />
            <span style={s.cardTitle}>Top Carrier Performance</span>
          </div>
          <p style={{ fontSize: 11, color: "#9CA3AF", margin: "0 0 12px" }}>By rating and on-time delivery</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {/* Table header */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 8, padding: "8px 0", borderBottom: "1px solid #E5E7EB" }}>
              <span style={s.tableHeader}>Carrier</span>
              <span style={{ ...s.tableHeader, textAlign: "center" }}>Rating</span>
              <span style={{ ...s.tableHeader, textAlign: "center" }}>On-time</span>
              <span style={{ ...s.tableHeader, textAlign: "center" }}>Loads</span>
            </div>
            {topCarriers.map((c, i) => (
              <div key={c.name} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 8, padding: "10px 0", borderBottom: i < topCarriers.length - 1 ? "1px solid #F3F4F6" : "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#9CA3AF", width: 16 }}>#{i + 1}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>{c.name}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 3 }}>
                  <Star size={11} color="#F59E0B" fill="#F59E0B" />
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>{c.rating}</span>
                </div>
                <div style={{ textAlign: "center" }}>
                  <span style={{
                    fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 999,
                    background: c.onTime >= 93 ? "#DCFCE7" : c.onTime >= 90 ? "#FEF3C7" : "#FEE2E2",
                    color: c.onTime >= 93 ? "#166534" : c.onTime >= 90 ? "#92400E" : "#991B1B",
                  }}>{c.onTime}%</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 500, color: "#374151", textAlign: "center" }}>{c.loads}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Route Efficiency + Carbon Footprint */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Route Efficiency */}
        <div style={s.card}>
          <div style={s.cardHeader}>
            <MapPin size={16} color="#2563EB" />
            <span style={s.cardTitle}>Route Efficiency</span>
          </div>
          <p style={{ fontSize: 11, color: "#9CA3AF", margin: "0 0 12px" }}>Cost per km comparison</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 8, padding: "8px 0", borderBottom: "1px solid #E5E7EB" }}>
              <span style={s.tableHeader}>Route</span>
              <span style={{ ...s.tableHeader, textAlign: "right" }}>Dist.</span>
              <span style={{ ...s.tableHeader, textAlign: "right" }}>Avg Cost</span>
              <span style={{ ...s.tableHeader, textAlign: "right" }}>/km</span>
            </div>
            {routeEfficiency.map((r, i) => (
              <div key={r.route} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 8, padding: "10px 0", borderBottom: i < routeEfficiency.length - 1 ? "1px solid #F3F4F6" : "none" }}>
                <span style={{ fontSize: 12, fontWeight: 500, color: "#111827" }}>{r.route}</span>
                <span style={{ fontSize: 12, color: "#6B7280", textAlign: "right" }}>{r.distance} km</span>
                <span style={{ fontSize: 12, fontWeight: 500, color: "#374151", textAlign: "right" }}>{formatPeso(r.avgCost)}</span>
                <div style={{ textAlign: "right" }}>
                  <span style={{
                    fontSize: 11, fontWeight: 600, padding: "2px 6px", borderRadius: 4,
                    background: r.efficiency === "high" ? "#FEE2E2" : r.efficiency === "low" ? "#DCFCE7" : "#FEF3C7",
                    color: r.efficiency === "high" ? "#991B1B" : r.efficiency === "low" ? "#166534" : "#92400E",
                  }}>
                    {formatPeso(r.costPerKm)}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, padding: "8px 12px", background: "#F9FAFB", borderRadius: 6, border: "1px solid #E5E7EB" }}>
            <span style={{ fontSize: 10, color: "#6B7280" }}>
              Higher cost/km for short routes is normal due to fixed costs. Long-haul routes (Manila-Davao) are most cost-effective per km.
            </span>
          </div>
        </div>

        {/* Carbon Footprint */}
        <div style={s.card}>
          <div style={s.cardHeader}>
            <Leaf size={16} color="#059669" />
            <span style={s.cardTitle}>Carbon Footprint</span>
          </div>
          <p style={{ fontSize: 11, color: "#9CA3AF", margin: "0 0 16px" }}>Estimated CO2 emissions this month</p>

          {/* Big number */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 32, fontWeight: 800, color: "#111827" }}>{(carbonData.totalKg / 1000).toFixed(1)}</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#6B7280" }}>tonnes CO2</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 20 }}>
            {carbonData.trendUp ? <ArrowUpRight size={14} color="#DC2626" /> : <ArrowDownRight size={14} color="#059669" />}
            <span style={{ fontSize: 12, fontWeight: 600, color: carbonData.trendUp ? "#DC2626" : "#059669" }}>
              {carbonData.trendUp ? "+" : "-"}{carbonData.trendPct}% vs last month
            </span>
            <span style={{ fontSize: 11, color: "#9CA3AF" }}>({(carbonData.prevMonthKg / 1000).toFixed(1)}t prev)</span>
          </div>

          {/* Breakdown */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {carbonData.breakdown.map((b) => (
              <div key={b.source}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 500, color: "#374151" }}>{b.source}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>{(b.kg / 1000).toFixed(1)}t ({b.pct}%)</span>
                </div>
                <div style={{ height: 8, background: "#F3F4F6", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ height: 8, width: `${b.pct}%`, background: b.pct >= 50 ? "#059669" : b.pct >= 15 ? "#10B981" : "#6EE7B7", borderRadius: 4 }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 16, padding: "10px 14px", background: "#F0FDF4", borderRadius: 8, border: "1px solid #BBF7D0" }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#166534", marginBottom: 4 }}>Optimization tip</div>
            <span style={{ fontSize: 11, color: "#374151" }}>
              Consolidating Manila-Cebu shipments could reduce sea freight emissions by ~15%. Consider batching loads on the same RoRo schedule.
            </span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

// ─── Sub-components ───

function KpiCard({ icon, iconBg, iconColor, label, value, change, up }: {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string;
  change: string;
  up: boolean;
}) {
  return (
    <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: "18px 20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: iconBg, color: iconColor, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {icon}
        </div>
        <span style={{ fontSize: 11, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase" as const, letterSpacing: 0.5 }}>{label}</span>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <span style={{ fontSize: 22, fontWeight: 800, color: "#111827" }}>{value}</span>
        <span style={{ fontSize: 11, fontWeight: 600, color: up ? "#059669" : "#DC2626", display: "flex", alignItems: "center", gap: 2 }}>
          {up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {change}
        </span>
      </div>
    </div>
  );
}

function SpendTab({ label, active }: { label: string; active?: boolean }) {
  return (
    <div style={{
      padding: "8px 14px",
      fontSize: 11,
      fontWeight: active ? 700 : 500,
      color: active ? "#2563EB" : "#6B7280",
      borderBottom: active ? "2px solid #2563EB" : "2px solid transparent",
      cursor: "pointer",
    }}>
      {label}
    </div>
  );
}

// ─── Styles ───

const s: Record<string, React.CSSProperties> = {
  card: {
    background: "#fff",
    border: "1px solid #E5E7EB",
    borderRadius: 12,
    padding: "20px 24px",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: "#111827",
  },
  tableHeader: {
    fontSize: 10,
    fontWeight: 600,
    color: "#9CA3AF",
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
  },
};
