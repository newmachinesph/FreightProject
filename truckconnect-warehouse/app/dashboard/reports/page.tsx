"use client";
import { useState } from "react";
import {
  ArrowDownToLine, ArrowUpFromLine, Clock, Building2, BarChart3, FileText,
  Package, AlertTriangle, Thermometer, TrendingUp, TrendingDown, Activity, Zap,
  DollarSign, CheckCircle, RotateCcw,
} from "lucide-react";
import { inventoryItems, inboundShipments, outboundShipments, facilityProfile, monthlyVolume, capacityTrend, storageZones } from "@/lib/mock-data";

type ReportTab = "kpi" | "summary" | "volume" | "capacity" | "expiring" | "topsku" | "dockutil" | "throughput" | "turnover" | "spacerev" | "tempcomp" | "fulfillment";

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<ReportTab>("kpi");
  const fp = facilityProfile;
  const usedArea = fp.totalArea - fp.availableCapacity.sqm;
  const usedPct = Math.round((usedArea / fp.totalArea) * 100);
  const totalSKUs = inventoryItems.length;
  const lowStock = inventoryItems.filter((i) => i.status === "low_stock").length;
  const expired = inventoryItems.filter((i) => i.status === "expired").length;
  const totalUnits = inventoryItems.reduce((sum, i) => sum + i.qtyOnHand, 0);

  // Category breakdown
  const categoryMap = new Map<string, { count: number; units: number }>();
  inventoryItems.forEach((i) => {
    const existing = categoryMap.get(i.category) || { count: 0, units: 0 };
    categoryMap.set(i.category, { count: existing.count + 1, units: existing.units + i.qtyOnHand });
  });
  const categories = Array.from(categoryMap.entries()).sort((a, b) => b[1].units - a[1].units);

  // Expiring items (within 90 days from now = 2026-03-20)
  const today = new Date("2026-03-20");
  const expiringItems = inventoryItems
    .filter((i) => i.expiryDate && i.status !== "expired")
    .map((i) => {
      const exp = new Date(i.expiryDate!);
      const daysUntil = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return { ...i, daysUntilExpiry: daysUntil };
    })
    .filter((i) => i.daysUntilExpiry <= 90 && i.daysUntilExpiry > 0)
    .sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry);

  // Top SKUs by movement
  const skuMovements = inventoryItems.map((item) => {
    const totalMoved = item.movements.reduce((sum, m) => sum + m.qty, 0);
    const inQty = item.movements.filter(m => m.type === "in").reduce((sum, m) => sum + m.qty, 0);
    const outQty = item.movements.filter(m => m.type === "out").reduce((sum, m) => sum + m.qty, 0);
    return { ...item, totalMoved, inQty, outQty };
  }).sort((a, b) => b.totalMoved - a.totalMoved);
  const topSKUs = skuMovements.slice(0, 10);
  const maxMovement = topSKUs.length > 0 ? topSKUs[0].totalMoved : 1;

  // Zone utilization over time (simulated per-zone trend)
  const zoneUtilTrend = storageZones.map(z => {
    const pct = Math.round((z.usedArea / z.area) * 100);
    return {
      name: z.name,
      color: z.color,
      type: z.type,
      data: [
        { month: "Oct", pct: pct - 12 },
        { month: "Nov", pct: pct - 8 },
        { month: "Dec", pct: pct + 5 },
        { month: "Jan", pct: pct - 3 },
        { month: "Feb", pct: pct - 5 },
        { month: "Mar", pct },
      ],
    };
  });

  const maxMonthlyVolume = Math.max(...monthlyVolume.flatMap((m) => [m.inbound, m.outbound]));
  const maxCapacity = 100;

  // KPI calculations
  const inboundReceived = inboundShipments.filter(s => s.status === "Received" || s.status === "Put Away").length;
  const outboundDispatched = outboundShipments.filter(s => s.status === "Dispatched").length;
  const fillRate = outboundShipments.length > 0 ? Math.round((outboundDispatched / outboundShipments.length) * 100) : 0;
  const dockUtilization = Math.round((4 / fp.loadingDocks) * 100); // simulated 4 active docks

  // ── Dock utilization per hour (6AM-10PM) ──
  const dockHours = Array.from({ length: 17 }, (_, i) => {
    const hour = i + 6;
    const label = hour <= 12 ? `${hour}${hour < 12 ? "AM" : "PM"}` : `${hour - 12}PM`;
    // Simulated utilization per dock per hour
    const docks = Array.from({ length: fp.loadingDocks }, (_, d) => {
      // Busier mid-morning and mid-afternoon
      const base = (hour >= 8 && hour <= 11) || (hour >= 14 && hour <= 17) ? 0.7 : 0.3;
      const noise = Math.sin(d * 3.7 + hour * 1.3) * 0.25;
      return Math.min(1, Math.max(0, base + noise));
    });
    return { hour, label, docks };
  });

  // ── Throughput trend (6 months inbound vs outbound overlay) ──
  const throughputData = monthlyVolume.map(m => ({
    month: m.month.split(" ")[0],
    inbound: m.inbound,
    outbound: m.outbound,
  }));
  const maxThroughput = Math.max(...throughputData.flatMap(d => [d.inbound, d.outbound]));

  // ── Inventory turnover rate (top 10 SKUs) ──
  const turnoverData = skuMovements.slice(0, 10).map(item => {
    const avgInventory = item.qtyOnHand > 0 ? item.qtyOnHand : 1;
    const turnsPerMonth = parseFloat((item.outQty / avgInventory).toFixed(2));
    return { sku: item.sku, description: item.description, turnsPerMonth, outQty: item.outQty, avgInventory };
  });
  const maxTurnover = Math.max(...turnoverData.map(d => d.turnsPerMonth), 1);

  // ── Space revenue per zone ──
  const spaceRevenueData = storageZones.map(z => {
    // Simulated monthly revenue based on used area and rate card + zone premium
    const premium = z.type === "Cold" ? 1.8 : z.type === "Hazmat" ? 1.5 : z.type === "Pharmaceutical" ? 2.0 : 1.0;
    const monthlyRev = Math.round(z.usedArea * fp.rateCard * premium);
    const revPerSqm = Math.round(monthlyRev / (z.area || 1));
    return { name: z.name, type: z.type, color: z.color, area: z.area, usedArea: z.usedArea, monthlyRev, revPerSqm };
  });
  const maxRevPerSqm = Math.max(...spaceRevenueData.map(d => d.revPerSqm), 1);
  const totalRevenue = spaceRevenueData.reduce((s, d) => s + d.monthlyRev, 0);

  // ── Temperature compliance ──
  const tempComplianceData = [
    { zone: "Cold Storage", target: "-18\u00B0C to 4\u00B0C", compliance: 99.7, excursions: 2, totalReadings: 720, lastExcursion: "2026-02-14 03:22" },
    { zone: "Pharmaceutical", target: "2\u00B0C to 8\u00B0C", compliance: 99.9, excursions: 1, totalReadings: 720, lastExcursion: "2026-01-28 14:15" },
    { zone: "Dry Storage A", target: "15\u00B0C to 30\u00B0C", compliance: 100.0, excursions: 0, totalReadings: 720, lastExcursion: "N/A" },
    { zone: "Dry Storage B", target: "15\u00B0C to 30\u00B0C", compliance: 100.0, excursions: 0, totalReadings: 720, lastExcursion: "N/A" },
    { zone: "Hazmat / Chemical", target: "15\u00B0C to 25\u00B0C", compliance: 99.8, excursions: 1, totalReadings: 720, lastExcursion: "2026-03-02 08:41" },
  ];
  const TARGET_COMPLIANCE = 99.5;

  // ── Order fulfillment rate ──
  const fulfillmentData = [
    { month: "Oct 2025", total: 38, onTime: 35, late: 3 },
    { month: "Nov 2025", total: 45, onTime: 43, late: 2 },
    { month: "Dec 2025", total: 62, onTime: 57, late: 5 },
    { month: "Jan 2026", total: 48, onTime: 46, late: 2 },
    { month: "Feb 2026", total: 44, onTime: 43, late: 1 },
    { month: "Mar 2026", total: 52, onTime: 50, late: 2 },
  ];
  const overallFulfillment = Math.round(
    (fulfillmentData.reduce((s, d) => s + d.onTime, 0) / fulfillmentData.reduce((s, d) => s + d.total, 0)) * 100
  );

  const tabs: { key: ReportTab; label: string }[] = [
    { key: "kpi", label: "KPI Dashboard" },
    { key: "summary", label: "Inventory Summary" },
    { key: "volume", label: "Volume Trends" },
    { key: "topsku", label: "Top SKUs" },
    { key: "capacity", label: "Zone Utilization" },
    { key: "expiring", label: "Expiring Items" },
    { key: "dockutil", label: "Dock Utilization" },
    { key: "throughput", label: "Throughput" },
    { key: "turnover", label: "Inventory Turnover" },
    { key: "spacerev", label: "Space Revenue" },
    { key: "tempcomp", label: "Temp Compliance" },
    { key: "fulfillment", label: "Fulfillment Rate" },
  ];

  return (
    <>
      <header style={{ ...s.header, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={s.pageTitle}>Reports</h1>
          <p style={s.pageSubtitle}>Warehouse analytics and performance metrics &mdash; {fp.name}</p>
        </div>
      </header>

      {/* Summary Cards */}
      <div style={s.statsGrid}>
        {[
          { label: "Inbound This Month", value: inboundShipments.length.toString(), icon: ArrowDownToLine, color: "#2563EB", bg: "#2563EB14" },
          { label: "Outbound This Month", value: outboundShipments.length.toString(), icon: ArrowUpFromLine, color: "#059669", bg: "#05966914" },
          { label: "Avg Processing Time", value: "3.8 hrs", icon: Clock, color: "#D97706", bg: "#D9770614" },
          { label: "Space Utilization", value: `${usedPct}%`, icon: Building2, color: "#7C3AED", bg: "#7C3AED14" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} style={s.statCard}>
              <div style={{ ...s.statIcon, background: stat.bg, color: stat.color }}><Icon size={20} /></div>
              <div><div style={s.statValue}>{stat.value}</div><div style={s.statLabel}>{stat.label}</div></div>
            </div>
          );
        })}
      </div>

      {/* Report Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20, borderBottom: "1px solid #E5E7EB", paddingBottom: 0, flexWrap: "wrap" }}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: "10px 18px", border: "none", borderBottom: activeTab === tab.key ? "2px solid #7C3AED" : "2px solid transparent",
              background: "transparent", cursor: "pointer", fontSize: 13, fontWeight: 600,
              color: activeTab === tab.key ? "#7C3AED" : "#6B7280",
              marginBottom: -1,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: KPI Dashboard */}
      {activeTab === "kpi" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 20 }}>
            {/* Inbound Received */}
            <div style={{ ...s.card, margin: 0, textAlign: "center" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#2563EB14", color: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ArrowDownToLine size={22} />
                </div>
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#111827" }}>{inboundReceived}</div>
              <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>Inbound Received</div>
              <div style={{ fontSize: 11, color: "#2563EB", fontWeight: 600, marginTop: 4 }}>of {inboundShipments.length} total</div>
            </div>
            {/* Outbound Dispatched */}
            <div style={{ ...s.card, margin: 0, textAlign: "center" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#05966914", color: "#059669", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ArrowUpFromLine size={22} />
                </div>
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#111827" }}>{outboundDispatched}</div>
              <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>Outbound Dispatched</div>
              <div style={{ fontSize: 11, color: "#059669", fontWeight: 600, marginTop: 4 }}>of {outboundShipments.length} total</div>
            </div>
            {/* Fill Rate */}
            <div style={{ ...s.card, margin: 0, textAlign: "center" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#7C3AED14", color: "#7C3AED", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Activity size={22} />
                </div>
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#111827" }}>{fillRate}%</div>
              <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>Fill Rate</div>
              <div style={{ width: "70%", height: 6, background: "#F3F4F6", borderRadius: 4, overflow: "hidden", margin: "8px auto 0" }}>
                <div style={{ height: "100%", width: fillRate + "%", background: "#7C3AED", borderRadius: 4 }} />
              </div>
            </div>
            {/* Dock Utilization */}
            <div style={{ ...s.card, margin: 0, textAlign: "center" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#D9770614", color: "#D97706", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Zap size={22} />
                </div>
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#111827" }}>{dockUtilization}%</div>
              <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>Dock Utilization</div>
              <div style={{ fontSize: 11, color: "#D97706", fontWeight: 600, marginTop: 4 }}>{4} of {fp.loadingDocks} active</div>
            </div>
          </div>

          {/* Weekly Performance Summary */}
          <div style={s.card}>
            <h3 style={s.cardTitle}>Weekly Performance Summary</h3>
            <div style={s.tableWrap}>
              <table style={s.table}>
                <thead>
                  <tr>
                    {["Metric", "This Week", "Last Week", "Change"].map((h) => (
                      <th key={h} style={s.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { metric: "Inbound Shipments Received", thisWeek: 8, lastWeek: 6, change: "+33%" },
                    { metric: "Outbound Orders Dispatched", thisWeek: 6, lastWeek: 7, change: "-14%" },
                    { metric: "Avg Dock Turnaround Time", thisWeek: "3.8 hrs", lastWeek: "4.2 hrs", change: "-10%" },
                    { metric: "Space Utilization", thisWeek: `${usedPct}%`, lastWeek: "55%", change: `+${usedPct - 55}%` },
                    { metric: "Low Stock Alerts", thisWeek: lowStock, lastWeek: 2, change: lowStock > 2 ? `+${Math.round(((lowStock - 2) / 2) * 100)}%` : "0%" },
                    { metric: "Temperature Excursions", thisWeek: 0, lastWeek: 1, change: "-100%" },
                    { metric: "BOC Entries Cleared", thisWeek: 2, lastWeek: 1, change: "+100%" },
                    { metric: "QC Pass Rate", thisWeek: "98%", lastWeek: "96%", change: "+2%" },
                  ].map((row) => (
                    <tr key={row.metric}>
                      <td style={s.td}><span style={{ fontWeight: 600, color: "#111827" }}>{row.metric}</span></td>
                      <td style={s.td}>{row.thisWeek}</td>
                      <td style={s.td}>{row.lastWeek}</td>
                      <td style={s.td}>
                        <span style={{
                          display: "inline-flex", alignItems: "center", gap: 4,
                          color: String(row.change).startsWith("+") ? "#059669" : String(row.change).startsWith("-") ? "#DC2626" : "#6B7280",
                          fontWeight: 600,
                        }}>
                          {String(row.change).startsWith("+") ? <TrendingUp size={14} /> : String(row.change).startsWith("-") ? <TrendingDown size={14} /> : null}
                          {row.change}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Tab: Inventory Summary */}
      {activeTab === "summary" && (
        <>
          {/* Inventory Health */}
          <div style={s.card}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <Package size={18} color="#7C3AED" />
              <h3 style={s.cardTitle}>Inventory Health</h3>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
              <div style={s.metricBox}>
                <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>Total SKUs</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#111827" }}>{totalSKUs}</div>
              </div>
              <div style={s.metricBox}>
                <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>Total Units</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#111827" }}>{totalUnits.toLocaleString()}</div>
              </div>
              <div style={s.metricBox}>
                <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>Low Stock Alerts</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#D97706", display: "flex", alignItems: "center", gap: 6 }}>
                  {lowStock} <AlertTriangle size={16} />
                </div>
              </div>
              <div style={s.metricBox}>
                <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>Expired Items</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#DC2626", display: "flex", alignItems: "center", gap: 6 }}>
                  {expired} <AlertTriangle size={16} />
                </div>
              </div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div style={s.card}>
            <h3 style={s.cardTitle}>Inventory by Category</h3>
            <div style={{ marginTop: 16 }}>
              {categories.map(([cat, data]) => {
                const pct = Math.round((data.units / totalUnits) * 100);
                return (
                  <div key={cat} style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{cat}</span>
                      <span style={{ fontSize: 12, color: "#6B7280" }}>{data.count} SKUs &middot; {data.units.toLocaleString()} units ({pct}%)</span>
                    </div>
                    <div style={{ width: "100%", height: 8, background: "#F3F4F6", borderRadius: 4, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: pct + "%", background: "#7C3AED", borderRadius: 4, transition: "width .4s ease" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Temperature Compliance */}
          <div style={s.card}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <Thermometer size={18} color="#2563EB" />
              <h3 style={s.cardTitle}>Zone Temperature Compliance</h3>
            </div>
            <div style={s.tableWrap}>
              <table style={s.table}>
                <thead>
                  <tr>
                    {["Zone", "Target Temp", "Current Temp", "Status", "Last Checked"].map((h) => (
                      <th key={h} style={s.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { zone: "Dry Storage A", target: "Ambient", current: "26\u00B0C", ok: true, time: "10 min ago" },
                    { zone: "Dry Storage B", target: "Ambient", current: "27\u00B0C", ok: true, time: "10 min ago" },
                    { zone: "Cold Storage", target: "-18\u00B0C to 4\u00B0C", current: "-16\u00B0C", ok: true, time: "5 min ago" },
                    { zone: "Hazmat / Chemical", target: "Ambient", current: "25\u00B0C", ok: true, time: "15 min ago" },
                    { zone: "Staging Area", target: "Ambient", current: "28\u00B0C", ok: true, time: "12 min ago" },
                  ].map((row) => (
                    <tr key={row.zone}>
                      <td style={s.td}><span style={{ fontWeight: 600, color: "#111827" }}>{row.zone}</span></td>
                      <td style={s.td}>{row.target}</td>
                      <td style={s.td}><span style={{ fontWeight: 600 }}>{row.current}</span></td>
                      <td style={s.td}>
                        <span style={{
                          padding: "3px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600,
                          background: row.ok ? "#D1FAE5" : "#FEE2E2",
                          color: row.ok ? "#065F46" : "#991B1B",
                        }}>
                          {row.ok ? "Compliant" : "Alert"}
                        </span>
                      </td>
                      <td style={s.td}><span style={{ fontSize: 12, color: "#9CA3AF" }}>{row.time}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Tab: Monthly Volume with Bar Charts */}
      {activeTab === "volume" && (
        <div style={s.card}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <BarChart3 size={18} color="#7C3AED" />
            <h3 style={s.cardTitle}>Monthly Inbound / Outbound Volume</h3>
          </div>

          {/* Bar chart */}
          <div style={{ display: "flex", alignItems: "flex-end", gap: 16, height: 250, padding: "0 10px", marginBottom: 20 }}>
            {monthlyVolume.map((m) => (
              <div key={m.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 200, width: "100%" }}>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "center" }}>
                    <span style={{ fontSize: 10, fontWeight: 600, color: "#7C3AED", marginBottom: 4 }}>{m.inbound}</span>
                    <div style={{
                      width: "100%", height: (m.inbound / maxMonthlyVolume) * 180,
                      background: "linear-gradient(180deg, #7C3AED, #A855F7)",
                      borderRadius: "4px 4px 0 0", minHeight: 8,
                    }} />
                  </div>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "center" }}>
                    <span style={{ fontSize: 10, fontWeight: 600, color: "#059669", marginBottom: 4 }}>{m.outbound}</span>
                    <div style={{
                      width: "100%", height: (m.outbound / maxMonthlyVolume) * 180,
                      background: "linear-gradient(180deg, #059669, #34D399)",
                      borderRadius: "4px 4px 0 0", minHeight: 8,
                    }} />
                  </div>
                </div>
                <span style={{ fontSize: 10, color: "#6B7280", marginTop: 4, whiteSpace: "nowrap" }}>{m.month}</span>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div style={{ display: "flex", gap: 20, justifyContent: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: "#7C3AED" }} />
              <span style={{ fontSize: 12, color: "#6B7280" }}>Inbound</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: "#059669" }} />
              <span style={{ fontSize: 12, color: "#6B7280" }}>Outbound</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Top SKUs by Movement */}
      {activeTab === "topsku" && (
        <div style={s.card}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <TrendingUp size={18} color="#7C3AED" />
            <h3 style={s.cardTitle}>Top 10 SKUs by Movement</h3>
          </div>
          <div style={{ marginTop: 8 }}>
            {topSKUs.map((item, idx) => {
              const pct = Math.round((item.totalMoved / maxMovement) * 100);
              const inPct = item.totalMoved > 0 ? Math.round((item.inQty / item.totalMoved) * 100) : 0;
              return (
                <div key={item.sku} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: idx < topSKUs.length - 1 ? "1px solid #F3F4F6" : "none" }}>
                  <span style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: idx < 3 ? "#7C3AED" : "#F3F4F6",
                    color: idx < 3 ? "#fff" : "#6B7280",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontWeight: 700, flexShrink: 0,
                  }}>
                    {idx + 1}
                  </span>
                  <div style={{ flex: "0 0 80px" }}>
                    <span style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 600, color: "#7C3AED" }}>{item.sku}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.description}</div>
                    <div style={{ display: "flex", gap: 0, width: "100%", height: 8, borderRadius: 4, overflow: "hidden", marginTop: 4 }}>
                      <div style={{ height: "100%", width: (inPct * pct / 100) + "%", background: "#7C3AED" }} />
                      <div style={{ height: "100%", width: ((100 - inPct) * pct / 100) + "%", background: "#059669" }} />
                      <div style={{ height: "100%", flex: 1, background: "#F3F4F6" }} />
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{item.totalMoved.toLocaleString()}</div>
                    <div style={{ fontSize: 10, color: "#6B7280" }}>
                      <span style={{ color: "#7C3AED" }}>{item.inQty} in</span> / <span style={{ color: "#059669" }}>{item.outQty} out</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {/* Legend */}
          <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: "#7C3AED" }} />
              <span style={{ fontSize: 11, color: "#6B7280" }}>Inbound</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: "#059669" }} />
              <span style={{ fontSize: 11, color: "#6B7280" }}>Outbound</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Zone Utilization Over Time */}
      {activeTab === "capacity" && (
        <>
          {/* Overall Capacity Trend Bar Chart */}
          <div style={s.card}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <Building2 size={18} color="#7C3AED" />
              <h3 style={s.cardTitle}>Overall Capacity Utilization Trend</h3>
            </div>

            <div style={{ display: "flex", alignItems: "flex-end", gap: 16, height: 250, padding: "0 10px", marginBottom: 20 }}>
              {capacityTrend.map((m) => (
                <div key={m.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{ display: "flex", alignItems: "flex-end", height: 200, width: "100%" }}>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "center" }}>
                      <span style={{ fontSize: 10, fontWeight: 600, color: m.utilization > 80 ? "#DC2626" : "#7C3AED", marginBottom: 4 }}>{m.utilization}%</span>
                      <div style={{
                        width: "100%", height: (m.utilization / maxCapacity) * 180,
                        background: m.utilization > 80 ? "linear-gradient(180deg, #DC2626, #F87171)" : "linear-gradient(180deg, #7C3AED, #A855F7)",
                        borderRadius: "4px 4px 0 0", minHeight: 8,
                      }} />
                    </div>
                  </div>
                  <span style={{ fontSize: 10, color: "#6B7280", marginTop: 4, whiteSpace: "nowrap" }}>{m.month}</span>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 20 }}>
              <div style={s.metricBox}>
                <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>Current Utilization</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#7C3AED" }}>{usedPct}%</div>
              </div>
              <div style={s.metricBox}>
                <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>Used Area</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#111827" }}>{usedArea.toLocaleString()} sqm</div>
              </div>
              <div style={s.metricBox}>
                <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>Available</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#059669" }}>{fp.availableCapacity.sqm.toLocaleString()} sqm</div>
              </div>
            </div>
          </div>

          {/* Per-Zone Utilization Trend */}
          <div style={s.card}>
            <h3 style={{ ...s.cardTitle, marginBottom: 16 }}>Zone Utilization Trend (6 months)</h3>
            {zoneUtilTrend.map((zone) => (
              <div key={zone.name} style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{zone.name}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: zone.color }}>{zone.data[zone.data.length - 1].pct}%</span>
                </div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 50 }}>
                  {zone.data.map((d, i) => {
                    const clamped = Math.max(0, Math.min(100, d.pct));
                    return (
                      <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div style={{
                          width: "100%", height: (clamped / 100) * 40,
                          background: clamped > 85 ? "#DC2626" : zone.color,
                          borderRadius: "3px 3px 0 0", minHeight: 3, opacity: 0.7 + (i * 0.05),
                        }} />
                        <span style={{ fontSize: 8, color: "#9CA3AF", marginTop: 2 }}>{d.month}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Tab: Expiring Items */}
      {activeTab === "expiring" && (
        <div style={s.card}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <AlertTriangle size={18} color="#D97706" />
            <h3 style={s.cardTitle}>Items Expiring Within 90 Days</h3>
          </div>
          {expiringItems.length === 0 ? (
            <div style={{ padding: 24, textAlign: "center", color: "#059669", fontSize: 14, fontWeight: 600 }}>
              No items expiring within the next 90 days.
            </div>
          ) : (
            <div style={s.tableWrap}>
              <table style={s.table}>
                <thead>
                  <tr>
                    {["SKU", "Description", "Category", "Qty", "Expiry Date", "Days Left", "Zone", "Action"].map((h) => (
                      <th key={h} style={s.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {expiringItems.map((item) => (
                    <tr key={item.sku}>
                      <td style={s.td}><span style={{ fontFamily: "monospace", fontWeight: 600 }}>{item.sku}</span></td>
                      <td style={{ ...s.td, maxWidth: 200, whiteSpace: "normal" }}>{item.description}</td>
                      <td style={s.td}><span style={{ fontSize: 11, color: "#6B7280" }}>{item.category}</span></td>
                      <td style={s.td}><span style={{ fontWeight: 600 }}>{item.qtyOnHand}</span></td>
                      <td style={s.td}>{item.expiryDate}</td>
                      <td style={s.td}>
                        <span style={{
                          padding: "3px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600,
                          background: item.daysUntilExpiry <= 7 ? "#FEE2E2" : item.daysUntilExpiry <= 30 ? "#FEF3C7" : "#EFF6FF",
                          color: item.daysUntilExpiry <= 7 ? "#991B1B" : item.daysUntilExpiry <= 30 ? "#92400E" : "#1E40AF",
                        }}>
                          {item.daysUntilExpiry} days
                        </span>
                      </td>
                      <td style={s.td}>{item.zone}</td>
                      <td style={s.td}>
                        <a href={`/dashboard/inventory/${item.id}`} style={{ fontSize: 12, color: "#7C3AED", textDecoration: "none", fontWeight: 600 }}>View</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── NEW TAB: Dock Utilization Heat Map ── */}
      {activeTab === "dockutil" && (
        <div style={s.card}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <Zap size={18} color="#D97706" />
            <h3 style={s.cardTitle}>Loading Dock Utilization by Hour</h3>
          </div>
          <p style={{ fontSize: 12, color: "#6B7280", margin: "0 0 20px" }}>Hourly usage across {fp.loadingDocks} loading docks (6 AM &ndash; 10 PM). Darker = higher utilization.</p>

          {/* Heat map grid */}
          <div style={{ overflowX: "auto" }}>
            {/* Hour labels row */}
            <div style={{ display: "flex", gap: 2, marginBottom: 2, paddingLeft: 72 }}>
              {dockHours.map(h => (
                <div key={h.hour} style={{ flex: 1, minWidth: 36, textAlign: "center", fontSize: 9, fontWeight: 600, color: "#9CA3AF" }}>
                  {h.label}
                </div>
              ))}
            </div>

            {/* Dock rows */}
            {Array.from({ length: fp.loadingDocks }, (_, dockIdx) => (
              <div key={dockIdx} style={{ display: "flex", gap: 2, marginBottom: 2, alignItems: "center" }}>
                <div style={{ width: 70, fontSize: 11, fontWeight: 600, color: "#374151", flexShrink: 0 }}>Dock {dockIdx + 1}</div>
                {dockHours.map(h => {
                  const util = h.docks[dockIdx];
                  const intensity = Math.round(util * 255);
                  const bg = util > 0.7
                    ? `rgba(220, 38, 38, ${0.3 + util * 0.7})`
                    : util > 0.4
                    ? `rgba(217, 119, 6, ${0.3 + util * 0.6})`
                    : `rgba(5, 150, 105, ${0.2 + util * 0.5})`;
                  return (
                    <div
                      key={h.hour}
                      title={`Dock ${dockIdx + 1} @ ${h.label}: ${Math.round(util * 100)}%`}
                      style={{
                        flex: 1, minWidth: 36, height: 28, borderRadius: 4,
                        background: bg,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 9, fontWeight: 600,
                        color: util > 0.5 ? "#fff" : "#374151",
                      }}
                    >
                      {Math.round(util * 100)}%
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 20, flexWrap: "wrap" }}>
            {[
              { label: "Low (<40%)", color: "rgba(5, 150, 105, 0.45)" },
              { label: "Medium (40-70%)", color: "rgba(217, 119, 6, 0.6)" },
              { label: "High (>70%)", color: "rgba(220, 38, 38, 0.8)" },
            ].map(l => (
              <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 16, height: 16, borderRadius: 3, background: l.color }} />
                <span style={{ fontSize: 11, color: "#6B7280" }}>{l.label}</span>
              </div>
            ))}
          </div>

          {/* Summary metrics */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 20 }}>
            <div style={s.metricBox}>
              <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>Peak Hour</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#DC2626" }}>10 AM</div>
            </div>
            <div style={s.metricBox}>
              <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>Avg Utilization</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#D97706" }}>{dockUtilization}%</div>
            </div>
            <div style={s.metricBox}>
              <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>Active Docks Now</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#059669" }}>4 / {fp.loadingDocks}</div>
            </div>
          </div>
        </div>
      )}

      {/* ── NEW TAB: Throughput Trend ── */}
      {activeTab === "throughput" && (
        <div style={s.card}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <Activity size={18} color="#7C3AED" />
            <h3 style={s.cardTitle}>Throughput Trend &mdash; Inbound vs Outbound (6 Months)</h3>
          </div>
          <p style={{ fontSize: 12, color: "#6B7280", margin: "0 0 20px" }}>Overlay bar comparison of inbound receiving and outbound dispatch volumes.</p>

          {/* Overlay bar chart */}
          <div style={{ display: "flex", alignItems: "flex-end", gap: 20, height: 280, padding: "0 10px", marginBottom: 20 }}>
            {throughputData.map((d) => {
              const inH = (d.inbound / maxThroughput) * 220;
              const outH = (d.outbound / maxThroughput) * 220;
              return (
                <div key={d.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
                  <div style={{ position: "relative", width: "100%", height: 240, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
                    {/* Inbound bar (behind) */}
                    <div style={{
                      position: "absolute", bottom: 0, left: "10%", right: "10%",
                      height: inH, background: "rgba(124, 58, 237, 0.35)",
                      borderRadius: "4px 4px 0 0", border: "2px solid #7C3AED",
                    }} />
                    {/* Outbound bar (front, narrower) */}
                    <div style={{
                      position: "absolute", bottom: 0, left: "25%", right: "25%",
                      height: outH, background: "rgba(5, 150, 105, 0.5)",
                      borderRadius: "4px 4px 0 0", border: "2px solid #059669",
                    }} />
                    {/* Labels */}
                    <div style={{ position: "absolute", top: -4, left: 0, right: 0, textAlign: "center" }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: "#7C3AED" }}>{d.inbound}</span>
                      <span style={{ fontSize: 10, color: "#9CA3AF", margin: "0 2px" }}>/</span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: "#059669" }}>{d.outbound}</span>
                    </div>
                  </div>
                  <span style={{ fontSize: 11, color: "#6B7280", marginTop: 8, fontWeight: 600 }}>{d.month}</span>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div style={{ display: "flex", gap: 20, justifyContent: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 14, height: 14, borderRadius: 3, background: "rgba(124, 58, 237, 0.35)", border: "2px solid #7C3AED" }} />
              <span style={{ fontSize: 12, color: "#6B7280" }}>Inbound</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 14, height: 14, borderRadius: 3, background: "rgba(5, 150, 105, 0.5)", border: "2px solid #059669" }} />
              <span style={{ fontSize: 12, color: "#6B7280" }}>Outbound</span>
            </div>
          </div>

          {/* Summary */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginTop: 20 }}>
            <div style={s.metricBox}>
              <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>Total Inbound (6mo)</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#7C3AED" }}>{throughputData.reduce((s, d) => s + d.inbound, 0)}</div>
            </div>
            <div style={s.metricBox}>
              <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>Total Outbound (6mo)</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#059669" }}>{throughputData.reduce((s, d) => s + d.outbound, 0)}</div>
            </div>
            <div style={s.metricBox}>
              <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>Avg Monthly Inbound</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#111827" }}>{Math.round(throughputData.reduce((s, d) => s + d.inbound, 0) / 6)}</div>
            </div>
            <div style={s.metricBox}>
              <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>Net Flow</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#D97706" }}>
                +{throughputData.reduce((s, d) => s + d.inbound, 0) - throughputData.reduce((s, d) => s + d.outbound, 0)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── NEW TAB: Inventory Turnover Rate ── */}
      {activeTab === "turnover" && (
        <div style={s.card}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <RotateCcw size={18} color="#7C3AED" />
            <h3 style={s.cardTitle}>Inventory Turnover Rate &mdash; Top 10 SKUs</h3>
          </div>
          <p style={{ fontSize: 12, color: "#6B7280", margin: "0 0 20px" }}>Turns per month = outbound units / average on-hand inventory. Higher turnover indicates faster-moving stock.</p>

          <div style={{ marginTop: 8 }}>
            {turnoverData.map((item, idx) => {
              const barPct = Math.round((item.turnsPerMonth / maxTurnover) * 100);
              const isHigh = item.turnsPerMonth >= 0.5;
              const isMed = item.turnsPerMonth >= 0.2;
              const barColor = isHigh ? "#059669" : isMed ? "#D97706" : "#DC2626";
              return (
                <div key={item.sku} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: idx < turnoverData.length - 1 ? "1px solid #F3F4F6" : "none" }}>
                  <span style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: isHigh ? "#D1FAE5" : isMed ? "#FEF3C7" : "#FEE2E2",
                    color: barColor,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontWeight: 700, flexShrink: 0,
                  }}>
                    {idx + 1}
                  </span>
                  <div style={{ flex: "0 0 80px" }}>
                    <span style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 600, color: "#7C3AED" }}>{item.sku}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.description}</div>
                    <div style={{ width: "100%", height: 8, background: "#F3F4F6", borderRadius: 4, overflow: "hidden", marginTop: 4 }}>
                      <div style={{ height: "100%", width: barPct + "%", background: barColor, borderRadius: 4, transition: "width .4s ease" }} />
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0, minWidth: 90 }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: barColor }}>{item.turnsPerMonth}x</div>
                    <div style={{ fontSize: 10, color: "#6B7280" }}>{item.outQty} out / {item.avgInventory} avg</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 16 }}>
            {[
              { label: "High (>=0.5x)", color: "#059669" },
              { label: "Medium (0.2-0.5x)", color: "#D97706" },
              { label: "Low (<0.2x)", color: "#DC2626" },
            ].map(l => (
              <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: l.color }} />
                <span style={{ fontSize: 11, color: "#6B7280" }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── NEW TAB: Space Revenue ── */}
      {activeTab === "spacerev" && (
        <div style={s.card}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <DollarSign size={18} color="#059669" />
            <h3 style={s.cardTitle}>Revenue per Square Meter by Zone</h3>
          </div>
          <p style={{ fontSize: 12, color: "#6B7280", margin: "0 0 20px" }}>
            Monthly revenue derived from occupied area at base rate PHP {fp.rateCard}/sqm + zone premiums.
            Total estimated revenue: <strong>PHP {totalRevenue.toLocaleString()}</strong>/month.
          </p>

          <div style={s.tableWrap}>
            <table style={s.table}>
              <thead>
                <tr>
                  {["Zone", "Type", "Area (sqm)", "Used (sqm)", "Revenue/sqm", "Monthly Revenue", ""].map((h, i) => (
                    <th key={i} style={s.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {spaceRevenueData.map((z) => {
                  const barPct = Math.round((z.revPerSqm / maxRevPerSqm) * 100);
                  return (
                    <tr key={z.name}>
                      <td style={s.td}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 10, height: 10, borderRadius: "50%", background: z.color, flexShrink: 0 }} />
                          <span style={{ fontWeight: 600, color: "#111827" }}>{z.name}</span>
                        </div>
                      </td>
                      <td style={s.td}>
                        <span style={{
                          padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600,
                          background: z.type === "Cold" ? "#DBEAFE" : z.type === "Hazmat" ? "#FEE2E2" : "#F3F4F6",
                          color: z.type === "Cold" ? "#1E40AF" : z.type === "Hazmat" ? "#991B1B" : "#374151",
                        }}>{z.type}</span>
                      </td>
                      <td style={s.td}>{z.area.toLocaleString()}</td>
                      <td style={s.td}>{z.usedArea.toLocaleString()}</td>
                      <td style={s.td}><span style={{ fontWeight: 700, color: "#059669" }}>PHP {z.revPerSqm.toLocaleString()}</span></td>
                      <td style={s.td}><span style={{ fontWeight: 700, color: "#111827" }}>PHP {z.monthlyRev.toLocaleString()}</span></td>
                      <td style={{ ...s.td, width: 120 }}>
                        <div style={{ width: "100%", height: 8, background: "#F3F4F6", borderRadius: 4, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: barPct + "%", background: z.color, borderRadius: 4 }} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Summary cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 20 }}>
            <div style={s.metricBox}>
              <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>Total Monthly Revenue</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#059669" }}>PHP {totalRevenue.toLocaleString()}</div>
            </div>
            <div style={s.metricBox}>
              <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>Avg Rev/sqm</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#111827" }}>PHP {Math.round(totalRevenue / fp.totalArea).toLocaleString()}</div>
            </div>
            <div style={s.metricBox}>
              <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>Base Rate</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#7C3AED" }}>PHP {fp.rateCard}/sqm</div>
            </div>
          </div>
        </div>
      )}

      {/* ── NEW TAB: Temperature Compliance ── */}
      {activeTab === "tempcomp" && (
        <div style={s.card}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <Thermometer size={18} color="#2563EB" />
            <h3 style={s.cardTitle}>Temperature Compliance Report</h3>
          </div>
          <p style={{ fontSize: 12, color: "#6B7280", margin: "0 0 20px" }}>
            Percentage of time each cold/controlled zone stayed within target range. Target: <strong>&gt;{TARGET_COMPLIANCE}%</strong>
          </p>

          {/* Compliance bars */}
          {tempComplianceData.map((z) => {
            const meetsTarget = z.compliance >= TARGET_COMPLIANCE;
            const barColor = meetsTarget ? "#059669" : "#DC2626";
            return (
              <div key={z.zone} style={{ padding: "14px 0", borderBottom: "1px solid #F3F4F6" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{z.zone}</span>
                    <span style={{ fontSize: 12, color: "#6B7280", marginLeft: 12 }}>Target: {z.target}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{
                      padding: "3px 10px", borderRadius: 6, fontSize: 12, fontWeight: 700,
                      background: meetsTarget ? "#D1FAE5" : "#FEE2E2",
                      color: meetsTarget ? "#065F46" : "#991B1B",
                    }}>
                      {z.compliance}%
                    </span>
                    {meetsTarget
                      ? <CheckCircle size={16} color="#059669" />
                      : <AlertTriangle size={16} color="#DC2626" />
                    }
                  </div>
                </div>
                {/* Full-width compliance bar */}
                <div style={{ width: "100%", height: 12, background: "#F3F4F6", borderRadius: 6, overflow: "hidden", position: "relative" }}>
                  <div style={{ height: "100%", width: z.compliance + "%", background: barColor, borderRadius: 6, transition: "width .4s ease" }} />
                  {/* Target line */}
                  <div style={{
                    position: "absolute", top: 0, bottom: 0, left: TARGET_COMPLIANCE + "%",
                    width: 2, background: "#111827", opacity: 0.4,
                  }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                  <span style={{ fontSize: 11, color: "#6B7280" }}>{z.excursions} excursion{z.excursions !== 1 ? "s" : ""} / {z.totalReadings} readings</span>
                  <span style={{ fontSize: 11, color: "#9CA3AF" }}>Last excursion: {z.lastExcursion}</span>
                </div>
              </div>
            );
          })}

          {/* Overall compliance */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 20 }}>
            <div style={s.metricBox}>
              <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>Overall Compliance</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#059669" }}>
                {(tempComplianceData.reduce((s, d) => s + d.compliance, 0) / tempComplianceData.length).toFixed(1)}%
              </div>
            </div>
            <div style={s.metricBox}>
              <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>Total Excursions</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#DC2626" }}>
                {tempComplianceData.reduce((s, d) => s + d.excursions, 0)}
              </div>
            </div>
            <div style={s.metricBox}>
              <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>Target</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#7C3AED" }}>&gt;{TARGET_COMPLIANCE}%</div>
            </div>
          </div>
        </div>
      )}

      {/* ── NEW TAB: Order Fulfillment Rate ── */}
      {activeTab === "fulfillment" && (
        <div style={s.card}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <CheckCircle size={18} color="#059669" />
            <h3 style={s.cardTitle}>Order Fulfillment Rate</h3>
          </div>
          <p style={{ fontSize: 12, color: "#6B7280", margin: "0 0 20px" }}>
            Percentage of outbound orders completed on time over the past 6 months.
            Overall rate: <strong>{overallFulfillment}%</strong>
          </p>

          {/* Stacked bar chart */}
          <div style={{ display: "flex", alignItems: "flex-end", gap: 20, height: 280, padding: "0 10px", marginBottom: 20 }}>
            {fulfillmentData.map((d) => {
              const maxTotal = Math.max(...fulfillmentData.map(f => f.total));
              const totalH = (d.total / maxTotal) * 220;
              const onTimeH = (d.onTime / d.total) * totalH;
              const lateH = totalH - onTimeH;
              const pct = Math.round((d.onTime / d.total) * 100);
              return (
                <div key={d.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: pct >= 95 ? "#059669" : "#D97706", marginBottom: 4 }}>{pct}%</span>
                  <div style={{ width: "60%", height: 230, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                    <div style={{
                      width: "100%", height: lateH,
                      background: "#FEE2E2", borderRadius: lateH > 0 ? "4px 4px 0 0" : 0,
                      borderLeft: "2px solid #DC2626", borderRight: "2px solid #DC2626", borderTop: "2px solid #DC2626",
                    }} />
                    <div style={{
                      width: "100%", height: onTimeH,
                      background: "linear-gradient(180deg, #059669, #34D399)",
                      borderRadius: lateH > 0 ? "0 0 0 0" : "4px 4px 0 0",
                    }} />
                  </div>
                  <div style={{ marginTop: 6, textAlign: "center" }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#374151" }}>{d.month.split(" ")[0]}</div>
                    <div style={{ fontSize: 9, color: "#9CA3AF" }}>{d.onTime}/{d.total}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div style={{ display: "flex", gap: 20, justifyContent: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: "#059669" }} />
              <span style={{ fontSize: 12, color: "#6B7280" }}>On Time</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: "#FEE2E2", border: "2px solid #DC2626" }} />
              <span style={{ fontSize: 12, color: "#6B7280" }}>Late</span>
            </div>
          </div>

          {/* Summary */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginTop: 20 }}>
            <div style={s.metricBox}>
              <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>Overall Fulfillment</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#059669" }}>{overallFulfillment}%</div>
            </div>
            <div style={s.metricBox}>
              <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>Total Orders (6mo)</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#111827" }}>{fulfillmentData.reduce((s, d) => s + d.total, 0)}</div>
            </div>
            <div style={s.metricBox}>
              <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>On Time</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#059669" }}>{fulfillmentData.reduce((s, d) => s + d.onTime, 0)}</div>
            </div>
            <div style={s.metricBox}>
              <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>Late</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#DC2626" }}>{fulfillmentData.reduce((s, d) => s + d.late, 0)}</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const s: Record<string, React.CSSProperties> = {
  header: { marginBottom: 28 },
  pageTitle: { fontSize: 24, fontWeight: 800, color: "#111827", margin: 0 },
  pageSubtitle: { fontSize: 14, color: "#6B7280", marginTop: 4 },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 },
  statCard: { background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: "18px 20px", display: "flex", alignItems: "center", gap: 14 },
  statIcon: { width: 42, height: 42, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" },
  statValue: { fontSize: 22, fontWeight: 800, color: "#111827" },
  statLabel: { fontSize: 12, color: "#6B7280", marginTop: 2 },
  card: { background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: "20px 24px", marginBottom: 20 },
  cardTitle: { fontSize: 16, fontWeight: 700, color: "#111827", margin: 0 },
  metricBox: { padding: "14px 16px", background: "#F9FAFB", borderRadius: 10, border: "1px solid #E5E7EB" },
  tableWrap: { overflowX: "auto", marginTop: 14 },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 13 },
  th: { textAlign: "left", padding: "10px 12px", borderBottom: "1px solid #E5E7EB", color: "#6B7280", fontWeight: 600, fontSize: 12, whiteSpace: "nowrap" },
  td: { padding: "10px 12px", borderBottom: "1px solid #F3F4F6", color: "#374151", whiteSpace: "nowrap" },
};
