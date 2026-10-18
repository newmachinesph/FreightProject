"use client";
import DashboardLayout from "@/components/DashboardLayout";
import {
  loads,
  bookings,
  formatPeso,
  getActiveLoads,
  getInTransit,
  getDeliveredThisMonth,
  getTotalSpend,
  preferredCarriers,
  blockedCarriers,
} from "@/lib/mock-data";
import {
  Package,
  Truck,
  MapPin,
  CreditCard,
  Plus,
  ClipboardList,
  Navigation,
  Star,
  ShieldBan,
  CheckCircle2,
  Leaf,
  Route,
  Activity,
  Clock,
  Gavel,
  Award,
  Banknote,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const statusColor: Record<string, { bg: string; color: string }> = {
  draft: { bg: "#F3F4F6", color: "#6B7280" },
  posted: { bg: "#DBEAFE", color: "#1E40AF" },
  bidding: { bg: "#FEF3C7", color: "#92400E" },
  awarded: { bg: "#D1FAE5", color: "#065F46" },
  in_transit: { bg: "#E0E7FF", color: "#3730A3" },
  delivered: { bg: "#DCFCE7", color: "#166534" },
  cancelled: { bg: "#FEE2E2", color: "#991B1B" },
};

const recentActivities = [
  { id: 1, type: "load_posted", message: "New load posted: Manila to Cebu", detail: "20T Electronics", time: "12 min ago", icon: Plus, iconBg: "#DBEAFE", iconColor: "#2563EB" },
  { id: 2, type: "bid_received", message: "Bid received from FastHaul Logistics", detail: "₱45,000 for LD-2024-007", time: "38 min ago", icon: Gavel, iconBg: "#FEF3C7", iconColor: "#D97706" },
  { id: 3, type: "load_awarded", message: "Load LD-2024-003 awarded", detail: "PH Express Trucking accepted", time: "1 hr ago", icon: Award, iconBg: "#D1FAE5", iconColor: "#059669" },
  { id: 4, type: "payment_sent", message: "Payment processed for LD-2024-001", detail: "₱62,500 via bank transfer", time: "3 hrs ago", icon: Banknote, iconBg: "#ECFDF5", iconColor: "#059669" },
  { id: 5, type: "delivered", message: "Shipment delivered: Davao to GenSan", detail: "Signed by J. Reyes", time: "5 hrs ago", icon: CheckCircle2, iconBg: "#DCFCE7", iconColor: "#166534" },
];

const topRoutes = [
  { origin: "Manila", destination: "Cebu", count: 24, trend: "+12%" },
  { origin: "Manila", destination: "Davao", count: 18, trend: "+8%" },
  { origin: "Cebu", destination: "Cagayan de Oro", count: 12, trend: "+3%" },
  { origin: "Clark", destination: "Subic", count: 9, trend: "-2%" },
];

const carbonData = {
  totalKg: 4820,
  tripsCount: 42,
  avgPerTrip: 114.8,
  savedKg: 380,
  offsetPct: 7.9,
};

export default function ShipperDashboard() {
  const recentLoads = loads.slice(0, 8);
  const activeShipments = loads.filter((l) => l.status === "in_transit" || l.status === "awarded");

  const stats = [
    { label: "Active Loads", value: getActiveLoads(), icon: Package, color: "#2563EB", bg: "#EFF6FF" },
    { label: "In Transit", value: getInTransit(), icon: Truck, color: "#7C3AED", bg: "#F5F3FF" },
    { label: "Delivered This Month", value: getDeliveredThisMonth(), icon: CheckCircle2, color: "#059669", bg: "#ECFDF5" },
    { label: "Total Spend", value: formatPeso(getTotalSpend()), icon: CreditCard, color: "#D97706", bg: "#FFFBEB" },
  ];

  return (
    <DashboardLayout activeNav="/dashboard">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#111827", margin: 0 }}>Dashboard</h1>
        <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>Overview of your freight operations</p>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} style={s.statCard}>
              <div style={{ ...s.statIcon, background: stat.bg, color: stat.color }}>
                <Icon size={20} />
              </div>
              <div>
                <div style={s.statLabel}>{stat.label}</div>
                <div style={s.statValue}>{stat.value}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick actions */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
        <Link href="/dashboard/loads/new" style={s.quickAction}>
          <div style={{ ...s.qaIcon, background: "#2563EB" }}>
            <Plus size={18} color="#fff" />
          </div>
          <div>
            <span style={s.qaText}>Post New Load</span>
            <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 1 }}>Create a shipment request</div>
          </div>
        </Link>
        <Link href="/dashboard/tracking" style={s.quickAction}>
          <div style={{ ...s.qaIcon, background: "#7C3AED" }}>
            <Navigation size={18} color="#fff" />
          </div>
          <div>
            <span style={s.qaText}>Track Shipments</span>
            <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 1 }}>Real-time GPS tracking</div>
          </div>
        </Link>
        <Link href="/dashboard/bookings" style={s.quickAction}>
          <div style={{ ...s.qaIcon, background: "#059669" }}>
            <ClipboardList size={18} color="#fff" />
          </div>
          <div>
            <span style={s.qaText}>View Bookings</span>
            <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 1 }}>Manage confirmations</div>
          </div>
        </Link>
        <Link href="/dashboard/payments" style={s.quickAction}>
          <div style={{ ...s.qaIcon, background: "#D97706" }}>
            <CreditCard size={18} color="#fff" />
          </div>
          <div>
            <span style={s.qaText}>Payments</span>
            <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 1 }}>Invoices & transactions</div>
          </div>
        </Link>
      </div>

      {/* Activity Feed + Carbon + Top Routes */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
        {/* Recent Activity Feed */}
        <div style={s.card}>
          <div style={s.cardHeader}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Activity size={16} color="#2563EB" />
              <h2 style={s.cardTitle}>Recent Activity</h2>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {recentActivities.map((act, idx) => {
              const Icon = act.icon;
              return (
                <div key={act.id} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 0", borderBottom: idx < recentActivities.length - 1 ? "1px solid #F3F4F6" : "none" }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: act.iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                    <Icon size={14} color={act.iconColor} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{act.message}</div>
                    <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>{act.detail}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                    <Clock size={11} color="#9CA3AF" />
                    <span style={{ fontSize: 11, color: "#9CA3AF", whiteSpace: "nowrap" }}>{act.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column: Carbon + Top Routes */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Carbon Footprint */}
          <div style={{ ...s.card, background: "linear-gradient(135deg, #ECFDF5 0%, #F0FDF4 100%)", border: "1px solid #BBF7D0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "#059669", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Leaf size={18} color="#fff" />
              </div>
              <div>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: "#065F46", margin: 0 }}>Carbon Footprint</h2>
                <div style={{ fontSize: 11, color: "#059669" }}>Last 30 days estimate</div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <div style={{ background: "rgba(255,255,255,0.7)", borderRadius: 8, padding: "10px 12px", textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#065F46" }}>{(carbonData.totalKg / 1000).toFixed(1)}t</div>
                <div style={{ fontSize: 11, color: "#059669" }}>Total CO2</div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.7)", borderRadius: 8, padding: "10px 12px", textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#065F46" }}>{carbonData.avgPerTrip}</div>
                <div style={{ fontSize: 11, color: "#059669" }}>kg/trip avg</div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.7)", borderRadius: 8, padding: "10px 12px", textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#16A34A" }}>{carbonData.savedKg}kg</div>
                <div style={{ fontSize: 11, color: "#059669" }}>Saved via optimization</div>
              </div>
            </div>
            <div style={{ marginTop: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: "#059669" }}>Carbon offset progress</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#065F46" }}>{carbonData.offsetPct}%</span>
              </div>
              <div style={{ width: "100%", height: 6, background: "rgba(255,255,255,0.5)", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ width: `${carbonData.offsetPct}%`, height: "100%", background: "#059669", borderRadius: 4 }} />
              </div>
            </div>
          </div>

          {/* Top Routes */}
          <div style={s.card}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <Route size={16} color="#2563EB" />
              <h2 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: 0 }}>Top Routes</h2>
              <span style={{ fontSize: 11, color: "#9CA3AF", marginLeft: "auto" }}>This month</span>
            </div>
            {topRoutes.map((route, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: idx < topRoutes.length - 1 ? "1px solid #F3F4F6" : "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 24, height: 24, borderRadius: 6, background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#2563EB" }}>
                    {idx + 1}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 600, color: "#374151" }}>
                    {route.origin}
                    <ArrowRight size={12} color="#9CA3AF" />
                    {route.destination}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{route.count}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: route.trend.startsWith("+") ? "#059669" : "#DC2626", background: route.trend.startsWith("+") ? "#ECFDF5" : "#FEF2F2", padding: "2px 6px", borderRadius: 4 }}>
                    {route.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent loads table */}
      <div style={s.card}>
        <div style={s.cardHeader}>
          <h2 style={s.cardTitle}>Recent Loads</h2>
          <Link href="/dashboard/loads" style={s.viewAll}>View All</Link>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>ID</th>
                <th style={s.th}>Route</th>
                <th style={s.th}>Cargo</th>
                <th style={s.th}>Weight</th>
                <th style={s.th}>Rate</th>
                <th style={s.th}>Bids</th>
                <th style={s.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentLoads.map((load) => {
                const sc = statusColor[load.status] || statusColor.draft;
                return (
                  <tr key={load.id} style={{ cursor: "pointer" }}>
                    <td style={{ ...s.td, fontWeight: 600, fontSize: 12 }}>
                      <Link href={`/dashboard/loads/${load.id}`} style={{ color: "#2563EB", textDecoration: "none" }}>{load.id}</Link>
                    </td>
                    <td style={s.td}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <MapPin size={14} color="#9CA3AF" />
                        {load.pickupCity} &rarr; {load.deliveryCity}
                        {load.interIsland && (
                          <span style={{ fontSize: 9, background: "#DBEAFE", color: "#1E40AF", padding: "1px 6px", borderRadius: 4, fontWeight: 600 }}>INTER-ISLAND</span>
                        )}
                      </div>
                    </td>
                    <td style={s.td}>
                      <div style={{ fontSize: 13 }}>{load.commodity}</div>
                      <div style={{ fontSize: 11, color: "#9CA3AF" }}>{load.cargoType}</div>
                    </td>
                    <td style={s.td}>{(load.weightKg / 1000).toFixed(1)}t</td>
                    <td style={{ ...s.td, fontWeight: 600 }}>{formatPeso(load.offeredRate)}</td>
                    <td style={{ ...s.td, textAlign: "center" }}>
                      <span style={{ background: load.bids > 0 ? "#FEF3C7" : "#F3F4F6", color: load.bids > 0 ? "#92400E" : "#9CA3AF", padding: "2px 10px", borderRadius: 999, fontSize: 12, fontWeight: 600 }}>
                        {load.bids}
                      </span>
                    </td>
                    <td style={s.td}>
                      <span style={{ ...s.badge, background: sc.bg, color: sc.color }}>
                        {load.status.replace("_", " ")}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Active shipments */}
      {activeShipments.length > 0 && (
        <div style={{ ...s.card, marginTop: 20 }}>
          <div style={s.cardHeader}>
            <h2 style={s.cardTitle}>Active Shipments</h2>
            <Link href="/dashboard/tracking" style={s.viewAll}>Track All</Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {activeShipments.map((load) => {
              const booking = bookings.find((b) => b.loadId === load.id);
              return (
                <Link href={`/dashboard/loads/${load.id}`} key={load.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "#F9FAFB", borderRadius: 8, textDecoration: "none", border: "1px solid #E5E7EB" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: load.status === "in_transit" ? "#E0E7FF" : "#D1FAE5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {load.status === "in_transit" ? <Truck size={16} color="#3730A3" /> : <Package size={16} color="#065F46" />}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{load.pickupCity} &rarr; {load.deliveryCity}</div>
                      <div style={{ fontSize: 11, color: "#9CA3AF" }}>{load.commodity} | {booking?.carrier ?? "Awaiting carrier"}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ ...s.badge, background: load.status === "in_transit" ? "#E0E7FF" : "#D1FAE5", color: load.status === "in_transit" ? "#3730A3" : "#065F46" }}>
                      {load.status === "in_transit" ? "In Transit" : "Awarded"}
                    </span>
                    <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 4 }}>ETA: {load.deliveryDate ?? load.pickupDate}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Preferred & Blocked */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 20 }}>
        <div style={s.card}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <Star size={16} color="#D97706" />
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111827", margin: 0 }}>Preferred Carriers</h3>
          </div>
          {preferredCarriers.map((c) => (
            <div key={c.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #F3F4F6" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{c.name}</div>
                <div style={{ fontSize: 11, color: "#9CA3AF" }}>{c.trips} trips completed</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <Star size={12} color="#F59E0B" fill="#F59E0B" />
                <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>{c.rating}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={s.card}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <ShieldBan size={16} color="#DC2626" />
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111827", margin: 0 }}>Blocked Carriers</h3>
          </div>
          {blockedCarriers.map((c) => (
            <div key={c.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #F3F4F6" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{c.name}</div>
                <div style={{ fontSize: 11, color: "#EF4444" }}>{c.reason}</div>
              </div>
              <span style={{ fontSize: 10, background: "#FEE2E2", color: "#991B1B", padding: "2px 8px", borderRadius: 4, fontWeight: 600 }}>BLOCKED</span>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

const s: Record<string, React.CSSProperties> = {
  statCard: { display: "flex", alignItems: "center", gap: 14, background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: 20 },
  statIcon: { width: 42, height: 42, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" },
  statLabel: { fontSize: 12, color: "#6B7280", marginBottom: 2 },
  statValue: { fontSize: 22, fontWeight: 800, color: "#111827" },

  quickAction: { display: "flex", alignItems: "center", gap: 10, background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10, padding: "12px 16px", textDecoration: "none", cursor: "pointer" },
  qaIcon: { width: 36, height: 36, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  qaText: { fontSize: 13, fontWeight: 600, color: "#111827" },

  card: { background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: "20px 24px" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  cardTitle: { fontSize: 16, fontWeight: 700, color: "#111827", margin: 0 },
  viewAll: { fontSize: 13, color: "#2563EB", textDecoration: "none", fontWeight: 600 },

  table: { width: "100%", borderCollapse: "collapse" as const },
  th: { textAlign: "left" as const, padding: "10px 12px", fontSize: 11, fontWeight: 600, color: "#6B7280", textTransform: "uppercase" as const, letterSpacing: 0.5, background: "#F9FAFB", borderBottom: "1px solid #F3F4F6" },
  td: { padding: "12px 16px", fontSize: 13, color: "#374151", borderBottom: "1px solid #F3F4F6" },
  badge: { display: "inline-block", padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600, textTransform: "capitalize" as const },
};
