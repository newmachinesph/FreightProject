"use client";
import { useState } from "react";
import { ArrowUpFromLine, Plus, CheckCircle, XCircle, Search, Filter, MapPin, Truck, AlertCircle } from "lucide-react";
import { outboundShipments } from "@/lib/mock-data";

const statusColor: Record<string, React.CSSProperties> = {
  Picking:    { background: "#FEF3C7", color: "#92400E", padding: "3px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600 },
  Packing:    { background: "#DBEAFE", color: "#1E40AF", padding: "3px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600 },
  Dispatched: { background: "#D1FAE5", color: "#065F46", padding: "3px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600 },
  QC_Check:   { background: "#FCE7F3", color: "#9D174D", padding: "3px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600 },
  Ready:      { background: "#ECFDF5", color: "#059669", padding: "3px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600 },
};

const statusOptions = ["All", "Picking", "Packing", "QC_Check", "Ready", "Dispatched"];

// Priority assignment based on ship-by date proximity
function getPriority(shipBy: string): { label: string; color: string; bg: string; border: string } {
  const today = new Date("2026-03-20");
  const shipDate = new Date(shipBy);
  const daysLeft = Math.ceil((shipDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (daysLeft <= 0) return { label: "OVERDUE", color: "#991B1B", bg: "#FEE2E2", border: "#FECACA" };
  if (daysLeft <= 1) return { label: "URGENT", color: "#DC2626", bg: "#FEE2E2", border: "#FECACA" };
  if (daysLeft <= 3) return { label: "HIGH", color: "#D97706", bg: "#FEF3C7", border: "#FDE68A" };
  return { label: "NORMAL", color: "#059669", bg: "#ECFDF5", border: "#A7F3D0" };
}

// Carrier assignment status
function getCarrierStatus(status: string): { label: string; color: string; bg: string } {
  if (status === "Dispatched" || status === "Ready") return { label: "Assigned", color: "#065F46", bg: "#D1FAE5" };
  if (status === "Packing" || status === "QC_Check") return { label: "Assigned", color: "#065F46", bg: "#D1FAE5" };
  return { label: "Pending", color: "#D97706", bg: "#FEF3C7" };
}

export default function OutboundPage() {
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = outboundShipments.filter((s) => {
    const matchesStatus = statusFilter === "All" || s.status === statusFilter;
    const matchesSearch = searchQuery === "" ||
      s.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.consignee.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.carrier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.items.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const picking = outboundShipments.filter((s) => s.status === "Picking").length;
  const packing = outboundShipments.filter((s) => s.status === "Packing").length;
  const dispatched = outboundShipments.filter((s) => s.status === "Dispatched").length;
  const qcCheck = outboundShipments.filter((s) => s.status === "QC_Check").length;
  const ready = outboundShipments.filter((s) => s.status === "Ready").length;

  return (
    <>
      <header style={{ ...s.header, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={s.pageTitle}>Outbound / Dispatch</h1>
          <p style={s.pageSubtitle}>Manage orders, picking, QC checks, and dispatch</p>
        </div>
        <a
          href="/dashboard/outbound/new"
          style={s.createBtn}
        >
          <Plus size={16} />
          Create Shipment
        </a>
      </header>

      {/* Summary Cards */}
      <div style={s.statsGrid}>
        {[
          { label: "Picking", value: picking, color: "#D97706", bg: "#D9770614" },
          { label: "Packing", value: packing, color: "#2563EB", bg: "#2563EB14" },
          { label: "QC Check", value: qcCheck, color: "#9D174D", bg: "#9D174D14" },
          { label: "Ready", value: ready, color: "#059669", bg: "#05966914" },
        ].map((stat) => (
          <div key={stat.label} style={s.statCard}>
            <div style={{ ...s.statIcon, background: stat.bg, color: stat.color }}>
              <ArrowUpFromLine size={20} />
            </div>
            <div>
              <div style={s.statValue}>{stat.value}</div>
              <div style={s.statLabel}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
        <div style={{
          flex: 1, minWidth: 250, maxWidth: 400,
          display: "flex", alignItems: "center",
          backgroundColor: "#ffffff", border: "1px solid #E5E7EB", borderRadius: 10, padding: "0 12px",
        }}>
          <Search size={16} color="#9CA3AF" />
          <input
            type="text"
            placeholder="Search order ID, consignee, carrier..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1, padding: "10px 10px", border: "none", background: "none", outline: "none", fontSize: 13, color: "#111827" }}
          />
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {statusOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => setStatusFilter(opt)}
              style={{
                padding: "8px 14px", border: "1px solid #E5E7EB", borderRadius: 8,
                cursor: "pointer", fontSize: 12, fontWeight: 500,
                color: statusFilter === opt ? "#fff" : "#374151",
                backgroundColor: statusFilter === opt ? "#7C3AED" : "#fff",
              }}
            >
              {opt === "QC_Check" ? "QC" : opt}
            </button>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#6B7280", fontSize: 12, marginBottom: 12 }}>
        <Filter size={12} />
        <span>{filtered.length} orders</span>
      </div>

      {/* Outbound Table */}
      <div style={s.card}>
        <h3 style={s.cardTitle}>All Outbound Orders</h3>
        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead>
              <tr>
                {["Order ID", "Priority", "Consignee", "Destination", "Fulfillment Progress", "Carrier", "Carrier Status", "Waybill / DR", "QC", "Status", "Ship By"].map((h) => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => {
                const priority = getPriority(row.shipBy);
                const carrierSt = getCarrierStatus(row.status);
                // Calculate picking progress
                const totalOrdered = row.itemDetails.reduce((sum, d) => sum + d.qtyOrdered, 0);
                const totalPicked = row.itemDetails.reduce((sum, d) => sum + (d.qtyPicked || 0), 0);
                const pickPct = totalOrdered > 0 ? Math.round((totalPicked / totalOrdered) * 100) : 0;

                return (
                  <tr key={row.orderId}>
                    <td style={s.td}><span style={{ fontWeight: 600, color: "#111827" }}>{row.orderId}</span></td>
                    {/* Priority Badge */}
                    <td style={s.td}>
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: 4,
                        padding: "3px 8px", borderRadius: 5, fontSize: 10, fontWeight: 700,
                        letterSpacing: 0.5,
                        background: priority.bg, color: priority.color, border: `1px solid ${priority.border}`,
                      }}>
                        {priority.label === "URGENT" || priority.label === "OVERDUE" ? <AlertCircle size={10} /> : null}
                        {priority.label}
                      </span>
                    </td>
                    <td style={s.td}>{row.consignee}</td>
                    {/* Destination with map pin */}
                    <td style={{ ...s.td, maxWidth: 180 }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 4 }}>
                        <MapPin size={12} color="#7C3AED" style={{ marginTop: 2, flexShrink: 0 }} />
                        <span style={{ fontSize: 12, whiteSpace: "normal", lineHeight: "1.3" }}>{row.destination}</span>
                      </div>
                    </td>
                    {/* Fulfillment / Picking Progress */}
                    <td style={s.td}>
                      <div style={{ minWidth: 140 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                          <span style={{ fontSize: 12, fontWeight: 600, color: pickPct === 100 ? "#059669" : "#D97706" }}>
                            {totalPicked}/{totalOrdered} picked
                          </span>
                          <span style={{ fontSize: 11, fontWeight: 700, color: pickPct === 100 ? "#059669" : "#7C3AED" }}>{pickPct}%</span>
                        </div>
                        <div style={{ width: "100%", height: 6, background: "#F3F4F6", borderRadius: 4, overflow: "hidden" }}>
                          <div style={{
                            height: "100%", width: pickPct + "%",
                            background: pickPct === 100 ? "#059669" : "linear-gradient(90deg, #7C3AED, #A855F7)",
                            borderRadius: 4, transition: "width .3s ease",
                          }} />
                        </div>
                      </div>
                    </td>
                    <td style={s.td}>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <Truck size={12} color="#6B7280" />
                        <span style={{ fontSize: 12 }}>{row.carrier}</span>
                      </div>
                    </td>
                    {/* Carrier Assignment Status */}
                    <td style={s.td}>
                      <span style={{
                        padding: "3px 8px", borderRadius: 5, fontSize: 11, fontWeight: 600,
                        background: carrierSt.bg, color: carrierSt.color,
                      }}>
                        {carrierSt.label}
                      </span>
                    </td>
                    <td style={s.td}>
                      <span style={{ fontSize: 11, fontFamily: "monospace", color: "#6B7280" }}>{row.waybillDr}</span>
                    </td>
                    <td style={s.td}>
                      {row.qcPassed === true ? (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, color: "#065F46" }}>
                          <CheckCircle size={14} color="#059669" /> Passed
                        </span>
                      ) : row.qcPassed === false ? (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, color: "#991B1B" }}>
                          <XCircle size={14} color="#DC2626" /> Failed
                        </span>
                      ) : (
                        <span style={{ color: "#D1D5DB", fontSize: 11 }}>Pending</span>
                      )}
                    </td>
                    <td style={s.td}><span style={statusColor[row.status]}>{row.status === "QC_Check" ? "QC Check" : row.status}</span></td>
                    <td style={s.td}>
                      <span style={{ fontWeight: 600, color: getPriority(row.shipBy).label === "URGENT" || getPriority(row.shipBy).label === "OVERDUE" ? "#DC2626" : "#111827" }}>
                        {row.shipBy}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

const s: Record<string, React.CSSProperties> = {
  header: { marginBottom: 28 },
  pageTitle: { fontSize: 24, fontWeight: 800, color: "#111827", margin: 0 },
  pageSubtitle: { fontSize: 14, color: "#6B7280", marginTop: 4 },
  createBtn: {
    display: "inline-flex", alignItems: "center", gap: 6,
    padding: "10px 18px", borderRadius: 8, border: "none",
    background: "#7C3AED", color: "#fff", fontSize: 14, fontWeight: 600,
    cursor: "pointer", textDecoration: "none",
  },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 },
  statCard: { background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: "18px 20px", display: "flex", alignItems: "center", gap: 14 },
  statIcon: { width: 42, height: 42, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" },
  statValue: { fontSize: 22, fontWeight: 800, color: "#111827" },
  statLabel: { fontSize: 12, color: "#6B7280", marginTop: 2 },
  card: { background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: "20px 24px", marginBottom: 20 },
  cardTitle: { fontSize: 16, fontWeight: 700, color: "#111827", margin: 0 },
  tableWrap: { overflowX: "auto", marginTop: 14 },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 13 },
  th: { textAlign: "left", padding: "10px 12px", borderBottom: "1px solid #E5E7EB", color: "#6B7280", fontWeight: 600, fontSize: 12, whiteSpace: "nowrap" },
  td: { padding: "10px 12px", borderBottom: "1px solid #F3F4F6", color: "#374151", whiteSpace: "nowrap" },
};
