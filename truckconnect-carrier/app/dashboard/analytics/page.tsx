"use client";
import DashboardLayout from "@/components/DashboardLayout";
import {
  TrendingUp, Truck, Star, Navigation, Fuel, BarChart3, CheckCircle2, Package,
} from "lucide-react";
import { trips, vehicles, earnings, drivers } from "@/lib/mock-data";

const GREEN = "#059669";
const GREEN_BG = "#ECFDF5";
const GREEN_LIGHT = "#D1FAE5";

// ── Computed analytics data ────────────────────────────────────────────────────

const monthLabels = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
const monthlyRevenue = [
  320000, 410000, 385000, 196000, 344000,
  earnings.filter((e) => e.date.startsWith("2026-03")).reduce((s, e) => s + e.amount, 0),
];
const maxRevenue = Math.max(...monthlyRevenue);

const mtdRevenue = monthlyRevenue[5];
const activeTrips = trips.filter((t) => t.status !== "delivered").length;
const fleetTotal = vehicles.length;
const fleetActive = vehicles.filter((v) => v.status === "available" || v.status === "on_trip").length;
const fleetUtil = Math.round((fleetActive / fleetTotal) * 100);
const avgRating = 4.8;

// Top routes
const routeMap: Record<string, { trips: number; revenue: number }> = {};
trips.forEach((t) => {
  const key = `${t.origin.split("(")[0].trim()} - ${t.destination.split("(")[0].trim()}`;
  if (!routeMap[key]) routeMap[key] = { trips: 0, revenue: 0 };
  routeMap[key].trips += 1;
  routeMap[key].revenue += t.rate;
});
const topRoutes = Object.entries(routeMap)
  .map(([route, data]) => ({ route, ...data }))
  .sort((a, b) => b.revenue - a.revenue)
  .slice(0, 5);

// Fleet efficiency by truck type
const typeMap: Record<string, { total: number; active: number }> = {};
vehicles.forEach((v) => {
  if (!typeMap[v.type]) typeMap[v.type] = { total: 0, active: 0 };
  typeMap[v.type].total += 1;
  if (v.status === "available" || v.status === "on_trip") typeMap[v.type].active += 1;
});
const fleetEfficiency = Object.entries(typeMap).map(([type, data]) => ({
  type,
  utilization: Math.round((data.active / data.total) * 100),
}));
const maxUtil = 100;

// Driver performance
const driverPerf = drivers.map((d) => {
  const driverTrips = trips.filter((t) => t.driver === d.name);
  const completed = driverTrips.filter((t) => t.status === "delivered").length;
  const total = driverTrips.length;
  const onTime = total > 0 ? Math.round((completed / Math.max(total, 1)) * 100) : 0;
  const rating = (4.5 + Math.random() * 0.5).toFixed(1);
  return { name: d.name, trips: total, completed, onTimePercent: onTime, rating };
}).sort((a, b) => b.completed - a.completed);

// Fuel cost estimate
const fuelPricePerLiter = { diesel: 62, gasoline: 68 };
const avgKmPerTrip = 350;
const fuelConsumptionPerKm: Record<string, number> = {
  "L300 Van": 0.10, "Closed Van": 0.12, "Elf Truck": 0.14, "Wing Van": 0.16,
  Dropside: 0.15, "10-Wheeler": 0.22, Trailer: 0.28, "Refrigerated Van": 0.18,
  Sedan: 0.08, "MPV/SUV": 0.09, Tanker: 0.25,
};
const monthlyFuel = [42000, 55000, 48000, 38000, 52000, 0];
trips.filter((t) => t.startDate.startsWith("2026-03")).forEach((t) => {
  const v = vehicles.find((veh) => veh.plateNo === t.vehiclePlate);
  if (v) {
    const consumption = fuelConsumptionPerKm[v.type] ?? 0.15;
    const price = fuelPricePerLiter[v.fuelType];
    monthlyFuel[5] += Math.round(avgKmPerTrip * consumption * price);
  }
});
const maxFuel = Math.max(...monthlyFuel);

// Load acceptance rate
const acceptanceRates = [72, 68, 75, 80, 78, 82];

// Revenue by cargo type
const cargoRevenue: Record<string, number> = {};
trips.forEach((t) => {
  const load = { l1: "Perishable", l2: "FMCG", l3: "General Cargo", l4: "Perishable", l5: "Automotive", l6: "FMCG", l7: "Construction", l8: "Agriculture", l9: "Electronics", l10: "FMCG" } as Record<string, string>;
  const cat = load[t.loadId] ?? "Other";
  cargoRevenue[cat] = (cargoRevenue[cat] || 0) + t.rate;
});
const cargoBreakdown = Object.entries(cargoRevenue)
  .map(([category, revenue]) => ({ category, revenue }))
  .sort((a, b) => b.revenue - a.revenue);
const maxCargoRevenue = Math.max(...cargoBreakdown.map((c) => c.revenue));

const cargoColors: Record<string, string> = {
  Perishable: "#059669", FMCG: "#2563EB", "General Cargo": "#7C3AED",
  Automotive: "#D97706", Construction: "#DC2626", Agriculture: "#16A34A",
  Electronics: "#0891B2", Other: "#6B7280",
};

// ── Helper: format PHP currency ────────────────────────────────────────────────
function formatPHP(amount: number) {
  return `₱${amount.toLocaleString()}`;
}

// ── Component ──────────────────────────────────────────────────────────────────
export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827", margin: 0 }}>Fleet Analytics</h1>
        <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>Performance insights for your fleet operations</p>
      </div>

      {/* KPI Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
        {[
          { label: "Total Revenue (MTD)", value: formatPHP(mtdRevenue), icon: <TrendingUp size={20} color={GREEN} />, sub: "March 2026" },
          { label: "Active Trips", value: String(activeTrips), icon: <Navigation size={20} color={GREEN} />, sub: "In progress" },
          { label: "Fleet Utilization", value: `${fleetUtil}%`, icon: <Truck size={20} color={GREEN} />, sub: `${fleetActive} of ${fleetTotal} active` },
          { label: "Avg Rating", value: String(avgRating), icon: <Star size={20} color={GREEN} />, sub: "Out of 5.0" },
        ].map((kpi) => (
          <div key={kpi.label} style={card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#6B7280", marginBottom: 4 }}>{kpi.label}</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: "#111827" }}>{kpi.value}</div>
                <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>{kpi.sub}</div>
              </div>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: GREEN_BG, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {kpi.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Row: Revenue Trend + Top Routes */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 20 }}>
        {/* Revenue Trend Bar Chart */}
        <div style={card}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 16 }}>Monthly Revenue (Last 6 Months)</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 180 }}>
            {monthlyRevenue.map((rev, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: "#6B7280", marginBottom: 4 }}>{formatPHP(rev)}</div>
                <div style={{
                  width: "100%", borderRadius: "6px 6px 0 0",
                  height: `${(rev / maxRevenue) * 140}px`,
                  background: i === 5 ? GREEN : GREEN_LIGHT,
                  transition: "height 0.3s",
                }} />
                <div style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", marginTop: 6 }}>{monthLabels[i]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Routes */}
        <div style={card}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 16 }}>Top Performing Routes</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {topRoutes.map((r, i) => (
              <div key={r.route} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 24, height: 24, borderRadius: 6, background: i === 0 ? GREEN : "#F3F4F6",
                  color: i === 0 ? "#FFF" : "#6B7280", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 700,
                }}>{i + 1}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.route}</div>
                  <div style={{ fontSize: 11, color: "#9CA3AF" }}>{r.trips} trips</div>
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: GREEN }}>{formatPHP(r.revenue)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row: Fleet Efficiency + Driver Performance */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        {/* Fleet Efficiency */}
        <div style={card}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 16 }}>Fleet Efficiency by Vehicle Type</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {fleetEfficiency.map((f) => (
              <div key={f.type}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>{f.type}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: GREEN }}>{f.utilization}%</span>
                </div>
                <div style={{ height: 8, background: "#F3F4F6", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: 4,
                    width: `${(f.utilization / maxUtil) * 100}%`,
                    background: f.utilization === 100 ? GREEN : f.utilization >= 50 ? "#34D399" : "#FCD34D",
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Driver Performance */}
        <div style={card}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 16 }}>Driver Performance</div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Driver", "Trips", "On-Time %", "Rating"].map((h) => (
                  <th key={h} style={{ fontSize: 10, fontWeight: 700, color: "#9CA3AF", textAlign: "left", padding: "0 8px 8px 0", textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {driverPerf.map((d) => (
                <tr key={d.name} style={{ borderTop: "1px solid #F3F4F6" }}>
                  <td style={{ padding: "8px 8px 8px 0", fontSize: 12, fontWeight: 600, color: "#111827" }}>{d.name}</td>
                  <td style={{ padding: "8px 8px 8px 0", fontSize: 12, color: "#6B7280" }}>{d.completed}/{d.trips}</td>
                  <td style={{ padding: "8px 8px 8px 0" }}>
                    <span style={{
                      fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 4,
                      background: d.onTimePercent >= 80 ? GREEN_BG : "#FEF3C7",
                      color: d.onTimePercent >= 80 ? GREEN : "#D97706",
                    }}>{d.onTimePercent}%</span>
                  </td>
                  <td style={{ padding: "8px 8px 8px 0", fontSize: 12, color: "#6B7280" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
                      <Star size={10} color="#F59E0B" fill="#F59E0B" /> {d.rating}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Row: Fuel Cost + Acceptance Rate + Cargo Revenue */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        {/* Fuel Cost Estimate */}
        <div style={card}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
            <Fuel size={16} color={GREEN} />
            <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>Fuel Cost Estimate</span>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120 }}>
            {monthlyFuel.map((cost, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{
                  width: "100%", borderRadius: "4px 4px 0 0",
                  height: `${(cost / maxFuel) * 90}px`,
                  background: i === 5 ? "#DC2626" : "#FCA5A5",
                }} />
                <div style={{ fontSize: 9, color: "#9CA3AF", marginTop: 4 }}>{monthLabels[i]}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 8, fontSize: 12, color: "#6B7280" }}>
            This month: <strong style={{ color: "#DC2626" }}>{formatPHP(monthlyFuel[5])}</strong>
          </div>
        </div>

        {/* Load Acceptance Rate Trend */}
        <div style={card}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
            <CheckCircle2 size={16} color={GREEN} />
            <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>Acceptance Rate Trend</span>
          </div>
          <div style={{ position: "relative", height: 120 }}>
            {/* Line chart approximation */}
            <svg width="100%" height="120" viewBox="0 0 240 120" preserveAspectRatio="none">
              <polyline
                fill="none" stroke={GREEN} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"
                points={acceptanceRates.map((r, i) => `${i * 48},${120 - (r / 100) * 110}`).join(" ")}
              />
              <polyline
                fill={GREEN_BG} stroke="none" opacity="0.5"
                points={`0,120 ${acceptanceRates.map((r, i) => `${i * 48},${120 - (r / 100) * 110}`).join(" ")} 240,120`}
              />
              {acceptanceRates.map((r, i) => (
                <circle key={i} cx={i * 48} cy={120 - (r / 100) * 110} r="4" fill={GREEN} />
              ))}
            </svg>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
            {monthLabels.map((m) => (
              <span key={m} style={{ fontSize: 9, color: "#9CA3AF" }}>{m}</span>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 8, fontSize: 12, color: "#6B7280" }}>
            Current: <strong style={{ color: GREEN }}>{acceptanceRates[5]}%</strong>
          </div>
        </div>

        {/* Revenue by Cargo Type */}
        <div style={card}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
            <Package size={16} color={GREEN} />
            <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>Revenue by Cargo Type</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {cargoBreakdown.map((c) => (
              <div key={c.category}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#374151" }}>{c.category}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: cargoColors[c.category] ?? "#6B7280" }}>{formatPHP(c.revenue)}</span>
                </div>
                <div style={{ height: 6, background: "#F3F4F6", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: 3,
                    width: `${(c.revenue / maxCargoRevenue) * 100}%`,
                    background: cargoColors[c.category] ?? "#9CA3AF",
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

const card: React.CSSProperties = {
  background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 12, padding: 20,
};
