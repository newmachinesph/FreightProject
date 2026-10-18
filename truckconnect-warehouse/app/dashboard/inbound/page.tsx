"use client";
import { useState } from "react";
import { ArrowDownToLine, Ship, FileText, Search, Filter, Phone, Thermometer, Package } from "lucide-react";
import { inboundShipments } from "@/lib/mock-data";

const statusColor: Record<string, React.CSSProperties> = {
  Expected:    { background: "#E0E7FF", color: "#3730A3", padding: "3px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600 },
  Arriving:    { background: "#FEF3C7", color: "#92400E", padding: "3px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600 },
  Received:    { background: "#D1FAE5", color: "#065F46", padding: "3px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600 },
  Inspecting:  { background: "#FDE68A", color: "#78350F", padding: "3px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600 },
  "Put Away":  { background: "#ECFDF5", color: "#059669", padding: "3px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600 },
};

const statusOptions = ["All", "Expected", "Arriving", "Inspecting", "Received", "Put Away"];

const timelineSteps = ["Expected", "Arriving", "Received", "Inspecting", "Put Away"];
const stepIndex: Record<string, number> = { Expected: 0, Arriving: 1, Received: 2, Inspecting: 3, "Put Away": 4 };

// Simulated carrier phone numbers
const carrierPhones: Record<string, string> = {
  "JRS Express Trucking": "+63 917 123 4567",
  "Luen Thai Logistics": "+63 918 234 5678",
  "2GO Cargo": "+63 919 345 6789",
  "Maersk Philippines": "+63 920 456 7890",
  "Entrego Freight": "+63 921 567 8901",
  "Ninja Van Freight": "+63 922 678 9012",
  "Evergreen Shipping": "+63 923 789 0123",
  "Flash Express": "+63 924 890 1234",
  "LBC Express Cargo": "+63 925 901 2345",
  "Transportify": "+63 926 012 3456",
};

// Simulated cold-chain temps for arriving shipments
const coldChainTemps: Record<string, string> = {
  "INB-5002": "-17.2\u00B0C",
  "INB-5006": "2.1\u00B0C",
};

export default function InboundPage() {
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = inboundShipments.filter((s) => {
    const matchesStatus = statusFilter === "All" || s.status === statusFilter;
    const matchesSearch = searchQuery === "" ||
      s.shipmentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.carrier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.items.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.poNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const arriving = inboundShipments.filter((s) => s.status === "Arriving").length;
  const received = inboundShipments.filter((s) => s.status === "Received" || s.status === "Put Away").length;
  const expected = inboundShipments.filter((s) => s.status === "Expected").length;
  const inspecting = inboundShipments.filter((s) => s.status === "Inspecting").length;
  const importCount = inboundShipments.filter((s) => s.bocEntry).length;

  return (
    <>
      <header style={s.header}>
        <div>
          <h1 style={s.pageTitle}>Inbound / Receiving</h1>
          <p style={s.pageSubtitle}>Track incoming deliveries, BOC entries, and receiving status</p>
        </div>
      </header>

      {/* Summary Cards */}
      <div style={s.statsGrid}>
        {[
          { label: "Expected", value: expected, color: "#4F46E5", bg: "#4F46E514" },
          { label: "Arriving", value: arriving, color: "#D97706", bg: "#D9770614" },
          { label: "Inspecting", value: inspecting, color: "#9D174D", bg: "#9D174D14" },
          { label: "Received / Put Away", value: received, color: "#059669", bg: "#05966914" },
        ].map((stat) => (
          <div key={stat.label} style={s.statCard}>
            <div style={{ ...s.statIcon, background: stat.bg, color: stat.color }}>
              <ArrowDownToLine size={20} />
            </div>
            <div>
              <div style={s.statValue}>{stat.value}</div>
              <div style={s.statLabel}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Import Notice */}
      {importCount > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderRadius: 10, background: "#F5F3FF", border: "1px solid #DDD6FE", marginBottom: 20 }}>
          <Ship size={18} color="#7C3AED" />
          <span style={{ fontSize: 13, fontWeight: 600, color: "#6D28D9" }}>{importCount} import shipment(s) with BOC entry</span>
        </div>
      )}

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
            placeholder="Search shipment ID, supplier, carrier..."
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
              {opt}
            </button>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#6B7280", fontSize: 12, marginBottom: 12 }}>
        <Filter size={12} />
        <span>{filtered.length} shipments</span>
      </div>

      {/* Shipment Cards with Timeline */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 24 }}>
        {filtered.map((row) => {
          const currentStep = stepIndex[row.status] ?? 0;
          const isColdChain = !!coldChainTemps[row.shipmentId];
          const itemCount = row.itemDetails.length;
          const phone = carrierPhones[row.carrier] || "+63 900 000 0000";

          return (
            <div key={row.shipmentId} style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: "20px 24px", position: "relative" }}>
              {/* Top row: ID, BOC badge, Items count */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <a href={`/dashboard/inbound/${row.shipmentId}`} style={{ fontWeight: 700, fontSize: 16, color: "#7C3AED", textDecoration: "none" }}>
                    {row.shipmentId}
                  </a>
                  {/* Items count badge */}
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 4,
                    padding: "3px 10px", borderRadius: 12, fontSize: 11, fontWeight: 600,
                    background: "#F3F4F6", color: "#374151",
                  }}>
                    <Package size={10} /> {itemCount} item{itemCount > 1 ? "s" : ""}
                  </span>
                  {/* BOC Entry badge */}
                  {row.bocEntry && (
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 4,
                      padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700,
                      background: "#F5F3FF", color: "#7C3AED", border: "1px solid #DDD6FE",
                    }}>
                      <FileText size={10} /> {row.bocEntry}
                    </span>
                  )}
                </div>
                <span style={statusColor[row.status]}>{row.status}</span>
              </div>

              {/* Shipment Timeline */}
              <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 16, padding: "10px 0" }}>
                {timelineSteps.map((step, idx) => {
                  const isCompleted = idx <= currentStep;
                  const isCurrent = idx === currentStep;
                  return (
                    <div key={step} style={{ display: "flex", alignItems: "center", flex: idx < timelineSteps.length - 1 ? 1 : "none" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
                        <div style={{
                          width: isCurrent ? 28 : 20, height: isCurrent ? 28 : 20, borderRadius: "50%",
                          background: isCompleted ? "#7C3AED" : "#E5E7EB",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          border: isCurrent ? "3px solid #DDD6FE" : "none",
                          transition: "all .3s",
                        }}>
                          {isCompleted && (
                            <span style={{ color: "#fff", fontSize: isCurrent ? 12 : 10, fontWeight: 700 }}>
                              {idx < currentStep ? "\u2713" : (idx + 1)}
                            </span>
                          )}
                        </div>
                        <span style={{
                          fontSize: 9, marginTop: 4, color: isCompleted ? "#7C3AED" : "#9CA3AF",
                          fontWeight: isCurrent ? 700 : 500, whiteSpace: "nowrap",
                        }}>
                          {step}
                        </span>
                      </div>
                      {idx < timelineSteps.length - 1 && (
                        <div style={{
                          flex: 1, height: 3, marginLeft: 4, marginRight: 4, marginBottom: 16,
                          background: idx < currentStep ? "#7C3AED" : "#E5E7EB",
                          borderRadius: 2, transition: "background .3s",
                        }} />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Details grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 10, color: "#9CA3AF", textTransform: "uppercase", fontWeight: 600, marginBottom: 3 }}>Origin</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{row.origin}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: "#9CA3AF", textTransform: "uppercase", fontWeight: 600, marginBottom: 3 }}>Supplier</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{row.supplier}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: "#9CA3AF", textTransform: "uppercase", fontWeight: 600, marginBottom: 3 }}>Carrier</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{row.carrier}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                    <Phone size={10} color="#7C3AED" />
                    <span style={{ fontSize: 11, color: "#7C3AED", fontWeight: 500 }}>{phone}</span>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: "#9CA3AF", textTransform: "uppercase", fontWeight: 600, marginBottom: 3 }}>ETA / Received</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{row.expectedDate}</div>
                  <div style={{ fontSize: 11, color: "#6B7280", marginTop: 1 }}>PO: {row.poNumber}</div>
                </div>
              </div>

              {/* Items and quantity */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 12px", background: "#F9FAFB", borderRadius: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 12, color: "#6B7280" }}>Items:</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#111827", flex: 1 }}>{row.items}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#7C3AED" }}>{row.qtyExpected} units expected</span>
              </div>

              {/* Cold chain temperature indicator */}
              {isColdChain && (row.status === "Arriving" || row.status === "Inspecting") && (
                <div style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "8px 12px", background: "#EFF6FF", borderRadius: 8, border: "1px solid #BFDBFE",
                }}>
                  <Thermometer size={14} color="#2563EB" />
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#1E40AF" }}>Cold Chain Active</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#2563EB", marginLeft: "auto" }}>{coldChainTemps[row.shipmentId]}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#059669", background: "#D1FAE5", padding: "2px 8px", borderRadius: 4 }}>In Range</span>
                </div>
              )}

              {/* Action */}
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
                {(row.status === "Arriving" || row.status === "Inspecting") ? (
                  <a
                    href={`/dashboard/inbound/${row.shipmentId}`}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 4,
                      padding: "8px 18px", borderRadius: 6, border: "none",
                      background: "#7C3AED", color: "#fff", fontSize: 13, fontWeight: 600,
                      textDecoration: "none", cursor: "pointer",
                    }}
                  >
                    Receive
                  </a>
                ) : row.status === "Expected" ? (
                  <span style={{ fontSize: 12, color: "#9CA3AF" }}>Not yet arrived</span>
                ) : (
                  <span style={{ fontSize: 12, color: "#059669", fontWeight: 600 }}>Completed</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
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
};
