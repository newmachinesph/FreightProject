"use client";
import {
  Package, ArrowDownToLine, ArrowUpFromLine, Building2,
  Thermometer, AlertTriangle, Shield, Clock, Eye,
  ClipboardList, Truck, PackageCheck, SnowflakeIcon,
  Activity, BarChart3, AlertCircle, ArrowRight,
  Boxes, PackageX, PackagePlus,
} from "lucide-react";
import Link from "next/link";
import { facilityProfile, inventoryItems, inboundShipments, outboundShipments, storageZones } from "@/lib/mock-data";

const statusColor: Record<string, React.CSSProperties> = {
  Expected:    { background: "#E0E7FF", color: "#3730A3", padding: "3px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600 },
  Arriving:    { background: "#FEF3C7", color: "#92400E", padding: "3px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600 },
  Received:    { background: "#D1FAE5", color: "#065F46", padding: "3px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600 },
  Inspecting:  { background: "#FDE68A", color: "#78350F", padding: "3px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600 },
  "Put Away":  { background: "#D1FAE5", color: "#065F46", padding: "3px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600 },
  Picking:     { background: "#FEF3C7", color: "#92400E", padding: "3px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600 },
  Packing:     { background: "#DBEAFE", color: "#1E40AF", padding: "3px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600 },
  Dispatched:  { background: "#D1FAE5", color: "#065F46", padding: "3px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600 },
  QC_Check:    { background: "#FCE7F3", color: "#9D174D", padding: "3px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600 },
  Ready:       { background: "#ECFDF5", color: "#059669", padding: "3px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600 },
};

const recentMovements = [
  { id: 1, type: "inbound", message: "Received: 500 units Electronics from TechCo", detail: "PO-2024-0891 — Zone A, Rack 12", time: "18 min ago", icon: ArrowDownToLine, iconBg: "#EDE9FE", iconColor: "#7C3AED" },
  { id: 2, type: "outbound", message: "Dispatched: 200 cartons to SM Retail", detail: "WB-2024-4521 — Via LBC Express", time: "45 min ago", icon: ArrowUpFromLine, iconBg: "#DBEAFE", iconColor: "#2563EB" },
  { id: 3, type: "inbound", message: "Inspecting: Frozen goods from AgriPH", detail: "PO-2024-0890 — Cold Storage Zone C", time: "1 hr ago", icon: PackageCheck, iconBg: "#FEF3C7", iconColor: "#D97706" },
  { id: 4, type: "outbound", message: "Picking: 150 units for Lazada fulfillment", detail: "ORD-2024-3345 — Zone B, Racks 4-6", time: "2 hrs ago", icon: ClipboardList, iconBg: "#EDE9FE", iconColor: "#7C3AED" },
  { id: 5, type: "inbound", message: "Put Away: 800 bags Rice from NFA", detail: "PO-2024-0885 — Zone D, Bulk Area", time: "3 hrs ago", icon: PackagePlus, iconBg: "#DCFCE7", iconColor: "#059669" },
];

const temperatureAlerts = [
  { zone: "Cold Storage - Zone C", current: "2.8°C", target: "0-4°C", status: "normal" as const },
  { zone: "Freezer - Zone C2", current: "-18.2°C", target: "-20 to -16°C", status: "normal" as const },
  { zone: "Pharma Cold Room", current: "6.1°C", target: "2-8°C", status: "warning" as const },
  { zone: "Chilled Section - Zone E", current: "9.5°C", target: "4-8°C", status: "critical" as const },
];

const lowStockAlerts = [
  { sku: "SKU-0142", name: "Surgical Masks (Box/50)", current: 12, minimum: 50, unit: "boxes" },
  { sku: "SKU-0089", name: "Canned Sardines (Case)", current: 8, minimum: 30, unit: "cases" },
  { sku: "SKU-0213", name: "Printer Paper A4 (Ream)", current: 15, minimum: 40, unit: "reams" },
  { sku: "SKU-0067", name: "Hand Sanitizer 500ml", current: 5, minimum: 25, unit: "bottles" },
];

export default function WarehouseDashboard() {
  const fp = facilityProfile;
  const totalSKUs = inventoryItems.length;
  const inboundToday = inboundShipments.filter((s) => s.status === "Arriving" || s.status === "Inspecting").length;
  const outboundToday = outboundShipments.filter((s) => s.status === "Picking" || s.status === "Packing" || s.status === "QC_Check" || s.status === "Ready").length;
  const usedArea = fp.totalArea - fp.availableCapacity.sqm;
  const usedPct = Math.round((usedArea / fp.totalArea) * 100);

  const lowStockItems = inventoryItems.filter((i) => i.status === "low_stock");
  const expiredItems = inventoryItems.filter((i) => i.status === "expired");
  const pendingReceiving = inboundShipments.filter((s) => s.status === "Arriving" || s.status === "Inspecting");

  const recentInbound = inboundShipments.slice(0, 5);
  const recentOutbound = outboundShipments.slice(0, 5);

  return (
    <>
      <header style={s.header}>
        <div>
          <h1 style={s.pageTitle}>Warehouse Overview</h1>
          <p style={s.pageSubtitle}>{fp.name} &mdash; {fp.address}</p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {fp.pezaAccredited && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: "#ECFDF5", color: "#065F46" }}>
              <Shield size={12} /> PEZA Accredited
            </span>
          )}
          <span style={{ padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: "#EFF6FF", color: "#1E40AF" }}>
            FDA: {fp.baiFdaLicense}
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: "#F3F4F6", color: "#374151" }}>
            <Clock size={10} /> {fp.operatingHours}
          </span>
        </div>
      </header>

      {/* Stats Row */}
      <div style={s.statsGrid}>
        {[
          { label: "Total SKUs", value: totalSKUs.toString(), icon: Package, color: "#7C3AED", bg: "#EDE9FE" },
          { label: "Inbound Today", value: inboundToday.toString(), icon: ArrowDownToLine, color: "#2563EB", bg: "#DBEAFE" },
          { label: "Outbound Today", value: outboundToday.toString(), icon: ArrowUpFromLine, color: "#059669", bg: "#DCFCE7" },
          { label: "Capacity Used", value: `${usedPct}%`, icon: Building2, color: usedPct > 80 ? "#DC2626" : "#7C3AED", bg: usedPct > 80 ? "#FEF2F2" : "#EDE9FE" },
        ].map((stat) => {
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

      {/* Quick Actions */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
        <Link href="/dashboard/inbound" style={s.quickAction}>
          <div style={{ ...s.qaIcon, background: "#7C3AED" }}>
            <ArrowDownToLine size={18} color="#fff" />
          </div>
          <div>
            <span style={s.qaText}>Receive Shipment</span>
            <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 1 }}>Process incoming goods</div>
          </div>
        </Link>
        <Link href="/dashboard/outbound" style={s.quickAction}>
          <div style={{ ...s.qaIcon, background: "#7C3AED" }}>
            <Truck size={18} color="#fff" />
          </div>
          <div>
            <span style={s.qaText}>Dispatch Order</span>
            <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 1 }}>Pick, pack & ship</div>
          </div>
        </Link>
        <Link href="/dashboard/inventory" style={s.quickAction}>
          <div style={{ ...s.qaIcon, background: "#7C3AED" }}>
            <Boxes size={18} color="#fff" />
          </div>
          <div>
            <span style={s.qaText}>View Inventory</span>
            <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 1 }}>Stock levels & locations</div>
          </div>
        </Link>
      </div>

      {/* Alerts Section */}
      {(lowStockItems.length > 0 || expiredItems.length > 0 || pendingReceiving.length > 0) && (
        <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
          {lowStockItems.length > 0 && (
            <Link href="/dashboard/inventory" style={{ flex: 1, minWidth: 220, display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderRadius: 10, background: "#FEF3C7", border: "1px solid #FDE68A", textDecoration: "none" }}>
              <AlertTriangle size={18} color="#D97706" />
              <span style={{ fontSize: 13, fontWeight: 600, color: "#92400E" }}>{lowStockItems.length} item(s) below reorder level</span>
            </Link>
          )}
          {expiredItems.length > 0 && (
            <Link href="/dashboard/inventory" style={{ flex: 1, minWidth: 220, display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderRadius: 10, background: "#FEE2E2", border: "1px solid #FECACA", textDecoration: "none" }}>
              <AlertTriangle size={18} color="#DC2626" />
              <span style={{ fontSize: 13, fontWeight: 600, color: "#991B1B" }}>{expiredItems.length} item(s) expired</span>
            </Link>
          )}
          {pendingReceiving.length > 0 && (
            <Link href="/dashboard/inbound" style={{ flex: 1, minWidth: 220, display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderRadius: 10, background: "#EDE9FE", border: "1px solid #C4B5FD", textDecoration: "none" }}>
              <ArrowDownToLine size={18} color="#7C3AED" />
              <span style={{ fontSize: 13, fontWeight: 600, color: "#5B21B6" }}>{pendingReceiving.length} shipment(s) pending receiving</span>
            </Link>
          )}
        </div>
      )}

      {/* Capacity + Temperature side by side */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        {/* Storage Capacity Overview */}
        <div style={s.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <BarChart3 size={16} color="#7C3AED" />
              <h3 style={s.cardTitle}>Storage Capacity</h3>
            </div>
            <Link href="/dashboard/zones" style={{ fontSize: 12, color: "#7C3AED", textDecoration: "none", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 4 }}>
              <Eye size={12} /> View Zones
            </Link>
          </div>
          <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 14px" }}>
            {usedArea.toLocaleString()} sqm used of {fp.totalArea.toLocaleString()} sqm total &mdash; {fp.availableCapacity.pallets} pallets available
          </p>
          <div style={s.progressBg}>
            <div style={{ ...s.progressFill, width: usedPct + "%", background: usedPct > 85 ? "linear-gradient(90deg, #EF4444, #F87171)" : "linear-gradient(90deg, #7C3AED, #A855F7)" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, marginBottom: 16 }}>
            <span style={{ fontSize: 12, color: "#9CA3AF" }}>0 sqm</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: usedPct > 85 ? "#DC2626" : "#7C3AED" }}>{usedPct}%</span>
            <span style={{ fontSize: 12, color: "#9CA3AF" }}>{fp.totalArea.toLocaleString()} sqm</span>
          </div>

          {/* Zone bars */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {storageZones.map((zone) => {
              const pct = Math.round((zone.usedArea / zone.area) * 100);
              return (
                <div key={zone.id} style={{ padding: "10px 12px", background: "#F9FAFB", borderRadius: 8, border: "1px solid #E5E7EB" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>{zone.name}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {zone.type === "Cold" && (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 2, fontSize: 10, color: "#2563EB" }}>
                          <Thermometer size={9} /> {zone.currentTemp}
                        </span>
                      )}
                      <span style={{ fontSize: 11, fontWeight: 700, color: pct > 85 ? "#DC2626" : zone.color }}>{pct}%</span>
                    </div>
                  </div>
                  <div style={{ width: "100%", height: 6, background: "#E5E7EB", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: pct + "%", background: pct > 85 ? "#EF4444" : zone.color, borderRadius: 4, transition: "width .4s ease" }} />
                  </div>
                  <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 3 }}>
                    {zone.usedArea.toLocaleString()}/{zone.area.toLocaleString()} sqm
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Temperature + Low Stock */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Temperature Alerts */}
          <div style={{ ...s.card, border: "1px solid #BFDBFE", background: "linear-gradient(135deg, #EFF6FF 0%, #F0F9FF 100%)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <SnowflakeIcon size={16} color="#fff" />
              </div>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1E40AF", margin: 0 }}>Temperature Monitoring</h3>
                <div style={{ fontSize: 11, color: "#3B82F6" }}>Cold storage zones</div>
              </div>
            </div>
            {temperatureAlerts.map((alert, idx) => (
              <div key={idx} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "10px 12px", marginBottom: idx < temperatureAlerts.length - 1 ? 8 : 0,
                borderRadius: 8, background: "rgba(255,255,255,0.7)",
                border: `1px solid ${alert.status === "critical" ? "#FECACA" : alert.status === "warning" ? "#FDE68A" : "#E5E7EB"}`,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Thermometer size={14} color={alert.status === "critical" ? "#DC2626" : alert.status === "warning" ? "#D97706" : "#3B82F6"} />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>{alert.zone}</div>
                    <div style={{ fontSize: 11, color: "#6B7280" }}>Target: {alert.target}</div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{
                    fontSize: 16, fontWeight: 800,
                    color: alert.status === "critical" ? "#DC2626" : alert.status === "warning" ? "#D97706" : "#1E40AF",
                  }}>
                    {alert.current}
                  </div>
                  <span style={{
                    fontSize: 10, fontWeight: 600, padding: "1px 6px", borderRadius: 4,
                    background: alert.status === "critical" ? "#FEE2E2" : alert.status === "warning" ? "#FEF3C7" : "#DCFCE7",
                    color: alert.status === "critical" ? "#991B1B" : alert.status === "warning" ? "#92400E" : "#065F46",
                  }}>
                    {alert.status === "critical" ? "CRITICAL" : alert.status === "warning" ? "WARNING" : "NORMAL"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Low Stock Alerts */}
          <div style={{ ...s.card, border: "1px solid #FDE68A", background: "#FFFBF0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "#D97706", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <PackageX size={16} color="#fff" />
              </div>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#92400E", margin: 0 }}>Low Stock Alerts</h3>
                <div style={{ fontSize: 11, color: "#D97706" }}>{lowStockAlerts.length} items below minimum</div>
              </div>
            </div>
            {lowStockAlerts.map((item, idx) => {
              const pct = Math.round((item.current / item.minimum) * 100);
              return (
                <div key={idx} style={{
                  padding: "10px 12px", marginBottom: idx < lowStockAlerts.length - 1 ? 8 : 0,
                  borderRadius: 8, background: "rgba(255,255,255,0.7)", border: "1px solid #FDE68A",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>{item.name}</div>
                      <div style={{ fontSize: 10, color: "#9CA3AF" }}>{item.sku}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: 14, fontWeight: 800, color: pct < 30 ? "#DC2626" : "#D97706" }}>{item.current}</span>
                      <span style={{ fontSize: 11, color: "#9CA3AF" }}> / {item.minimum} {item.unit}</span>
                    </div>
                  </div>
                  <div style={{ width: "100%", height: 4, background: "#FDE68A", borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ width: `${pct}%`, height: "100%", background: pct < 30 ? "#DC2626" : "#D97706", borderRadius: 2 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div style={{ ...s.card, marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <Activity size={16} color="#7C3AED" />
          <h3 style={s.cardTitle}>Recent Movements</h3>
          <span style={{ marginLeft: "auto", fontSize: 11, background: "#EDE9FE", color: "#7C3AED", padding: "2px 8px", borderRadius: 4, fontWeight: 600 }}>Live</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {recentMovements.map((mov, idx) => {
            const Icon = mov.icon;
            return (
              <div key={mov.id} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 0", borderBottom: idx < recentMovements.length - 1 ? "1px solid #F3F4F6" : "none" }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: mov.iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                  <Icon size={14} color={mov.iconColor} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{
                      fontSize: 9, fontWeight: 700, padding: "1px 6px", borderRadius: 3,
                      background: mov.type === "inbound" ? "#EDE9FE" : "#DBEAFE",
                      color: mov.type === "inbound" ? "#7C3AED" : "#2563EB",
                      textTransform: "uppercase",
                    }}>
                      {mov.type}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginTop: 2 }}>{mov.message}</div>
                  <div style={{ fontSize: 12, color: "#6B7280", marginTop: 1 }}>{mov.detail}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                  <Clock size={11} color="#9CA3AF" />
                  <span style={{ fontSize: 11, color: "#9CA3AF", whiteSpace: "nowrap" }}>{mov.time}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Inbound */}
      <div style={s.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={s.cardTitle}>Recent Inbound</h3>
          <Link href="/dashboard/inbound" style={{ fontSize: 12, color: "#7C3AED", textDecoration: "none", fontWeight: 600 }}>View All &rarr;</Link>
        </div>
        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead>
              <tr>
                {["Shipment ID", "Supplier", "Carrier", "Items", "PO #", "Status", "ETA"].map((h) => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentInbound.map((row) => (
                <tr key={row.shipmentId} style={{ cursor: "pointer" }}>
                  <td style={s.td}><Link href={`/dashboard/inbound/${row.shipmentId}`} style={{ fontWeight: 600, color: "#7C3AED", textDecoration: "none" }}>{row.shipmentId}</Link></td>
                  <td style={s.td}>{row.supplier}</td>
                  <td style={s.td}>{row.carrier}</td>
                  <td style={{ ...s.td, maxWidth: 200 }}>{row.items}</td>
                  <td style={s.td}><span style={{ fontSize: 11, color: "#6B7280" }}>{row.poNumber}</span></td>
                  <td style={s.td}><span style={statusColor[row.status]}>{row.status}</span></td>
                  <td style={s.td}>{row.expectedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Outbound */}
      <div style={s.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={s.cardTitle}>Recent Outbound</h3>
          <Link href="/dashboard/outbound" style={{ fontSize: 12, color: "#7C3AED", textDecoration: "none", fontWeight: 600 }}>View All &rarr;</Link>
        </div>
        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead>
              <tr>
                {["Order ID", "Consignee", "Carrier", "Waybill/DR", "Status", "Ship By"].map((h) => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentOutbound.map((row) => (
                <tr key={row.orderId}>
                  <td style={s.td}><span style={{ fontWeight: 600, color: "#111827" }}>{row.orderId}</span></td>
                  <td style={s.td}>{row.consignee}</td>
                  <td style={s.td}>{row.carrier}</td>
                  <td style={s.td}><span style={{ fontSize: 11, fontFamily: "monospace", color: "#6B7280" }}>{row.waybillDr}</span></td>
                  <td style={s.td}><span style={statusColor[row.status]}>{row.status === "QC_Check" ? "QC Check" : row.status}</span></td>
                  <td style={s.td}>{row.shipBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

const s: Record<string, React.CSSProperties> = {
  header: { marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 },
  pageTitle: { fontSize: 24, fontWeight: 700, color: "#111827", margin: 0 },
  pageSubtitle: { fontSize: 14, color: "#6B7280", marginTop: 4 },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 },
  statCard: { background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: 20, display: "flex", alignItems: "center", gap: 14 },
  statIcon: { width: 42, height: 42, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" },
  statLabel: { fontSize: 12, color: "#6B7280", marginBottom: 2 },
  statValue: { fontSize: 22, fontWeight: 800, color: "#111827" },
  card: { background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: "20px 24px", marginBottom: 20 },
  cardTitle: { fontSize: 16, fontWeight: 700, color: "#111827", margin: 0 },
  quickAction: { display: "flex", alignItems: "center", gap: 10, background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10, padding: "12px 16px", textDecoration: "none", cursor: "pointer" },
  qaIcon: { width: 36, height: 36, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  qaText: { fontSize: 13, fontWeight: 600, color: "#111827" },
  tableWrap: { overflowX: "auto", marginTop: 14 },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 13 },
  th: { textAlign: "left", padding: "10px 12px", fontSize: 11, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: 0.5, background: "#F9FAFB", borderBottom: "1px solid #F3F4F6", whiteSpace: "nowrap" },
  td: { padding: "12px 16px", fontSize: 13, color: "#374151", borderBottom: "1px solid #F3F4F6", whiteSpace: "nowrap" },
  progressBg: { width: "100%", height: 12, background: "#F3F4F6", borderRadius: 6, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 6, transition: "width .4s ease" },
};
