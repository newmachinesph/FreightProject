"use client";
import { useState, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  DollarSign, TrendingUp, Clock, Wallet, Smartphone, Building2,
  CreditCard, Settings, BarChart3, MapPin,
} from "lucide-react";
import { earnings } from "@/lib/mock-data";

const statusStyle: Record<string, { bg: string; color: string }> = {
  paid: { bg: "#DCFCE7", color: "#16A34A" },
  pending: { bg: "#FEF3C7", color: "#D97706" },
  processing: { bg: "#DBEAFE", color: "#2563EB" },
};

const months = [
  { key: "2026-03", label: "March 2026" },
  { key: "2026-02", label: "February 2026" },
  { key: "2026-01", label: "January 2026" },
  { key: "2025-12", label: "December 2025" },
  { key: "2025-11", label: "November 2025" },
  { key: "2025-10", label: "October 2025" },
];

export default function EarningsPage() {
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [showPayoutSettings, setShowPayoutSettings] = useState(false);

  const filtered = selectedMonth === "all"
    ? earnings
    : earnings.filter((e) => e.date.startsWith(selectedMonth));

  const totalEarnings = earnings.reduce((s, e) => s + e.amount, 0);
  const pendingAmount = earnings.filter((e) => e.status === "pending" || e.status === "processing").reduce((s, e) => s + e.amount, 0);
  const processingAmount = earnings.filter((e) => e.status === "processing").reduce((s, e) => s + e.amount, 0);
  const paidAmount = earnings.filter((e) => e.status === "paid").reduce((s, e) => s + e.amount, 0);
  const pendingOnlyAmount = earnings.filter((e) => e.status === "pending").reduce((s, e) => s + e.amount, 0);

  const monthlyBreakdown = months.map((m) => {
    const monthEarnings = earnings.filter((e) => e.date.startsWith(m.key));
    return {
      ...m,
      total: monthEarnings.reduce((s, e) => s + e.amount, 0),
      count: monthEarnings.length,
    };
  });

  // Top routes by revenue
  const topRoutes = useMemo(() => {
    const routeMap: Record<string, { route: string; total: number; count: number }> = {};
    earnings.forEach((e) => {
      if (!routeMap[e.route]) routeMap[e.route] = { route: e.route, total: 0, count: 0 };
      routeMap[e.route].total += e.amount;
      routeMap[e.route].count += 1;
    });
    return Object.values(routeMap).sort((a, b) => b.total - a.total).slice(0, 5);
  }, []);

  const maxRouteRevenue = topRoutes.length > 0 ? topRoutes[0].total : 1;

  // Payment status breakdown totals
  const paymentTotal = paidAmount + processingAmount + pendingOnlyAmount;
  const paidPct = paymentTotal > 0 ? (paidAmount / paymentTotal) * 100 : 0;
  const processingPct = paymentTotal > 0 ? (processingAmount / paymentTotal) * 100 : 0;
  const pendingPct = paymentTotal > 0 ? (pendingOnlyAmount / paymentTotal) * 100 : 0;

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827", margin: 0 }}>Earnings</h1>
        <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>Track your revenue and payouts</p>
      </div>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
        {[
          { label: "Total Earnings", value: totalEarnings, icon: DollarSign, color: "#059669", bg: "#ECFDF5" },
          { label: "This Month", value: monthlyBreakdown[0]?.total || 0, icon: TrendingUp, color: "#2563EB", bg: "#DBEAFE" },
          { label: "Pending Payments", value: pendingAmount, icon: Clock, color: "#D97706", bg: "#FEF3C7" },
          { label: "Paid Out", value: totalEarnings - pendingAmount, icon: Wallet, color: "#7C3AED", bg: "#EDE9FE" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} style={cardStyle}>
              <div style={{ width: 42, height: 42, borderRadius: 10, background: stat.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={20} color={stat.color} />
              </div>
              <div>
                <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 2 }}>{stat.label}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#111827" }}>{"\u20B1"}{stat.value.toLocaleString()}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Three-column analytics row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginBottom: 32 }}>
        {/* Monthly Trend Chart (6 months) */}
        <div style={panelStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
            <BarChart3 size={16} color="#2563EB" />
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111827", margin: 0 }}>6-Month Trend</h3>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-end", height: 120, padding: "0 4px" }}>
            {[...monthlyBreakdown].reverse().map((m) => {
              const maxVal = Math.max(...monthlyBreakdown.map((x) => x.total), 1);
              const height = maxVal > 0 ? Math.max((m.total / maxVal) * 100, 4) : 4;
              const isCurrentMonth = m.key === "2026-03";
              return (
                <div key={m.key} style={{ flex: 1, textAlign: "center", position: "relative" }}>
                  {m.total > 0 && (
                    <div style={{ fontSize: 9, color: "#6B7280", marginBottom: 2, fontWeight: 600 }}>
                      {"\u20B1"}{(m.total / 1000).toFixed(0)}K
                    </div>
                  )}
                  <div style={{
                    height,
                    background: isCurrentMonth ? "#2563EB" : "#93C5FD",
                    borderRadius: "4px 4px 0 0",
                    transition: "height 0.3s ease",
                  }} />
                  <div style={{
                    fontSize: 9, color: isCurrentMonth ? "#2563EB" : "#6B7280",
                    fontWeight: isCurrentMonth ? 700 : 400, marginTop: 4,
                  }}>
                    {m.label.split(" ")[0].slice(0, 3)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Routes by Revenue */}
        <div style={panelStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
            <MapPin size={16} color="#2563EB" />
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111827", margin: 0 }}>Top Routes</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {topRoutes.map((r, i) => (
              <div key={r.route}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>
                    {i + 1}. {r.route}
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#2563EB" }}>
                    {"\u20B1"}{r.total.toLocaleString()}
                  </span>
                </div>
                <div style={{ height: 6, background: "#F3F4F6", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: 3,
                    width: `${(r.total / maxRouteRevenue) * 100}%`,
                    background: i === 0 ? "#2563EB" : i === 1 ? "#3B82F6" : "#93C5FD",
                  }} />
                </div>
                <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 1 }}>
                  {r.count} trip{r.count !== 1 ? "s" : ""}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Status Breakdown */}
        <div style={panelStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
            <CreditCard size={16} color="#2563EB" />
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111827", margin: 0 }}>Payment Status</h3>
          </div>

          {/* Stacked progress bar */}
          <div style={{ height: 20, borderRadius: 10, overflow: "hidden", display: "flex", marginBottom: 16 }}>
            <div style={{ width: `${paidPct}%`, background: "#16A34A", transition: "width 0.3s" }} />
            <div style={{ width: `${processingPct}%`, background: "#2563EB", transition: "width 0.3s" }} />
            <div style={{ width: `${pendingPct}%`, background: "#D97706", transition: "width 0.3s" }} />
          </div>

          {/* Legend items with individual bars */}
          {[
            { label: "Paid", amount: paidAmount, pct: paidPct, color: "#16A34A", bg: "#DCFCE7" },
            { label: "Processing", amount: processingAmount, pct: processingPct, color: "#2563EB", bg: "#DBEAFE" },
            { label: "Pending", amount: pendingOnlyAmount, pct: pendingPct, color: "#D97706", bg: "#FEF3C7" },
          ].map((item) => (
            <div key={item.label} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: item.color }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>{item.label}</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: item.color }}>
                  {"\u20B1"}{item.amount.toLocaleString()}
                </span>
              </div>
              <div style={{ height: 6, background: "#F3F4F6", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${item.pct}%`, background: item.color, borderRadius: 3 }} />
              </div>
              <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 2 }}>{item.pct.toFixed(1)}% of total</div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Breakdown + Payout Settings */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
        <div style={panelStyle}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: "0 0 16px 0" }}>Monthly Breakdown</h3>
          {monthlyBreakdown.map((m) => (
            <div key={m.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #F3F4F6" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{m.label}</div>
                <div style={{ fontSize: 11, color: "#9CA3AF" }}>{m.count} transaction{m.count !== 1 ? "s" : ""}</div>
              </div>
              <span style={{ fontSize: 16, fontWeight: 700, color: "#2563EB" }}>{"\u20B1"}{m.total.toLocaleString()}</span>
            </div>
          ))}
        </div>

        {/* Payout Settings */}
        <div style={panelStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: 0 }}>Payout Settings</h3>
            <button onClick={() => setShowPayoutSettings(!showPayoutSettings)} style={{
              padding: "6px 14px", borderRadius: 6, border: "1px solid #E5E7EB",
              background: "#FFFFFF", color: "#4B5563", fontSize: 12, fontWeight: 600, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 4,
            }}>
              <Settings size={12} /> Edit
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 14, background: "#F9FAFB", borderRadius: 8 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: "#DBEAFE", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Building2 size={18} color="#2563EB" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>Bank Transfer (Primary)</div>
                <div style={{ fontSize: 12, color: "#6B7280" }}>BDO Savings &middot; ****4567</div>
              </div>
              <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600, background: "#DCFCE7", color: "#16A34A" }}>Active</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 14, background: "#F9FAFB", borderRadius: 8 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Smartphone size={18} color="#2563EB" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>GCash (Secondary)</div>
                <div style={{ fontSize: 12, color: "#6B7280" }}>0917 *** 4567</div>
              </div>
              <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600, background: "#DCFCE7", color: "#16A34A" }}>Active</span>
            </div>
          </div>
          <div style={{ marginTop: 16, padding: 12, background: "#FEF3C7", borderRadius: 8, fontSize: 12, color: "#92400E" }}>
            Payouts are processed every Monday and Thursday. Minimum payout: {"\u20B1"}5,000.
          </div>
        </div>
      </div>

      {/* Month Filter */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button onClick={() => setSelectedMonth("all")} style={{
          padding: "7px 14px", borderRadius: 6, border: "1px solid",
          borderColor: selectedMonth === "all" ? "#2563EB" : "#E5E7EB",
          background: selectedMonth === "all" ? "#EFF6FF" : "#FFFFFF",
          color: selectedMonth === "all" ? "#2563EB" : "#4B5563",
          fontSize: 12, fontWeight: 600, cursor: "pointer",
        }}>All</button>
        {months.slice(0, 3).map((m) => (
          <button key={m.key} onClick={() => setSelectedMonth(m.key)} style={{
            padding: "7px 14px", borderRadius: 6, border: "1px solid",
            borderColor: selectedMonth === m.key ? "#2563EB" : "#E5E7EB",
            background: selectedMonth === m.key ? "#EFF6FF" : "#FFFFFF",
            color: selectedMonth === m.key ? "#2563EB" : "#4B5563",
            fontSize: 12, fontWeight: 600, cursor: "pointer",
          }}>{m.label}</button>
        ))}
      </div>

      {/* Transactions Table */}
      <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #E5E7EB" }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: 0 }}>Transaction History</h2>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F9FAFB" }}>
              {["Trip", "Route", "Shipper", "Amount", "Status", "Payout Method", "Date"].map((h) => (
                <th key={h} style={th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => {
              const ss = statusStyle[row.status];
              return (
                <tr key={row.id} style={{ borderBottom: "1px solid #F3F4F6" }}>
                  <td style={td}><span style={{ fontWeight: 600, color: "#111827", fontFamily: "monospace", fontSize: 12 }}>{row.tripId}</span></td>
                  <td style={td}><span style={{ fontSize: 13, color: "#374151" }}>{row.route}</span></td>
                  <td style={td}><span style={{ fontSize: 13, color: "#6B7280" }}>{row.shipperName}</span></td>
                  <td style={td}><span style={{ fontSize: 14, fontWeight: 700, color: "#2563EB" }}>{"\u20B1"}{row.amount.toLocaleString()}</span></td>
                  <td style={td}>
                    <span style={{
                      padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600,
                      background: ss.bg, color: ss.color, textTransform: "capitalize",
                    }}>
                      {row.status}
                    </span>
                  </td>
                  <td style={td}>
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 4,
                      padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600,
                      background: row.payoutMethod === "GCash" ? "#DBEAFE" : "#F3F4F6",
                      color: row.payoutMethod === "GCash" ? "#2563EB" : "#4B5563",
                    }}>
                      {row.payoutMethod === "GCash" ? <Smartphone size={10} /> : <Building2 size={10} />}
                      {row.payoutMethod}
                    </span>
                  </td>
                  <td style={td}><span style={{ fontSize: 13, color: "#9CA3AF" }}>{row.date}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}

const cardStyle: React.CSSProperties = {
  background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 12,
  padding: "18px 20px", display: "flex", alignItems: "center", gap: 14,
};

const panelStyle: React.CSSProperties = {
  background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 12, padding: 20,
};

const th: React.CSSProperties = {
  padding: "10px 14px", fontSize: 11, fontWeight: 600, color: "#6B7280",
  textAlign: "left", borderBottom: "1px solid #E5E7EB", textTransform: "uppercase", letterSpacing: 0.5,
};

const td: React.CSSProperties = { padding: "12px 14px" };
