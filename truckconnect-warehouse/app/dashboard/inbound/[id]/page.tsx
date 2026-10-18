"use client";
import { use, useState } from "react";
import {
  ArrowLeft, Package, CheckCircle, AlertTriangle, FileText, Truck,
  Clock, Thermometer, ShieldCheck, Upload, MessageSquare, CircleDot,
  ClipboardCheck, Box, Ship, Container,
} from "lucide-react";
import { inboundShipments } from "@/lib/mock-data";

const PURPLE = "#7C3AED";
const PURPLE_LIGHT = "#F5F3FF";
const PURPLE_BORDER = "#DDD6FE";

const statusColor: Record<string, React.CSSProperties> = {
  Expected:    { background: "#E0E7FF", color: "#3730A3", padding: "4px 14px", borderRadius: 6, fontSize: 13, fontWeight: 600 },
  Arriving:    { background: "#FEF3C7", color: "#92400E", padding: "4px 14px", borderRadius: 6, fontSize: 13, fontWeight: 600 },
  Received:    { background: "#D1FAE5", color: "#065F46", padding: "4px 14px", borderRadius: 6, fontSize: 13, fontWeight: 600 },
  Inspecting:  { background: "#FDE68A", color: "#78350F", padding: "4px 14px", borderRadius: 6, fontSize: 13, fontWeight: 600 },
  "Put Away":  { background: "#ECFDF5", color: "#059669", padding: "4px 14px", borderRadius: 6, fontSize: 13, fontWeight: 600 },
};

const conditionOptions = ["Good", "Damaged", "Partial"] as const;

// Timeline steps
const timelineSteps = ["Expected", "Arriving", "Received", "Inspecting", "Put Away"] as const;
const timelineTimestamps: Record<string, Record<string, string>> = {
  "Put Away": { Expected: "Mar 14, 9:00 AM", Arriving: "Mar 16, 2:30 PM", Received: "Mar 16, 4:15 PM", Inspecting: "Mar 16, 5:00 PM", "Put Away": "Mar 17, 8:30 AM" },
  Received: { Expected: "Mar 15, 10:00 AM", Arriving: "Mar 17, 1:00 PM", Received: "Mar 18, 9:30 AM" },
  Inspecting: { Expected: "Mar 16, 8:00 AM", Arriving: "Mar 18, 11:00 AM", Received: "Mar 19, 9:00 AM", Inspecting: "Mar 19, 2:00 PM" },
  Arriving: { Expected: "Mar 17, 7:00 AM", Arriving: "Mar 19, 10:00 AM" },
  Expected: { Expected: "Mar 18, 9:00 AM" },
};

// Vehicle icons for carriers
const carrierVehicles: Record<string, { type: string; plate: string }> = {
  "JRS Express Trucking": { type: "6-Wheeler Truck", plate: "ABC 1234" },
  "Luen Thai Logistics": { type: "Reefer Van", plate: "XYZ 5678" },
  "2GO Cargo": { type: "Cargo Van", plate: "DEF 9012" },
  "Maersk Philippines": { type: "Container Ship", plate: "MSKU-7281940" },
  "Entrego Freight": { type: "10-Wheeler Truck", plate: "GHI 3456" },
  "Ninja Van Freight": { type: "Closed Van", plate: "JKL 7890" },
  "Evergreen Shipping": { type: "Container Ship", plate: "EGHU-3041562" },
  "Flash Express": { type: "L300 Van", plate: "MNO 1234" },
  "LBC Express Cargo": { type: "Wing Van", plate: "PQR 5678" },
  "Transportify": { type: "4-Wheeler Truck", plate: "STU 9012" },
};

// Mock documents
const mockDocuments = [
  { name: "Delivery Receipt", type: "DR", icon: FileText, color: "#2563EB", uploaded: true },
  { name: "Waybill", type: "WB", icon: FileText, color: PURPLE, uploaded: true },
  { name: "Packing List", type: "PL", icon: ClipboardCheck, color: "#059669", uploaded: true },
  { name: "Bill of Lading", type: "BOL", icon: Ship, color: "#D97706", uploaded: false },
  { name: "Commercial Invoice", type: "CI", icon: FileText, color: "#DC2626", uploaded: false },
];

// Mock temperature log for cold chain
const mockTempLog = [
  { time: "06:00", temp: -17.2 },
  { time: "08:00", temp: -16.8 },
  { time: "10:00", temp: -16.5 },
  { time: "12:00", temp: -15.9 },
  { time: "14:00", temp: -16.1 },
  { time: "16:00", temp: -16.4 },
  { time: "18:00", temp: -16.8 },
  { time: "20:00", temp: -17.0 },
];

interface ReceiveLine {
  sku: string;
  description: string;
  qtyExpected: number;
  qtyReceived: number;
  condition: "Good" | "Damaged" | "Partial";
  checked: boolean;
  qcStatus: "Pending" | "Passed" | "Failed";
}

export default function ReceiveShipmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const shipment = inboundShipments.find((s) => s.shipmentId === id);

  const [lines, setLines] = useState<ReceiveLine[]>(() =>
    shipment?.itemDetails.map((item) => ({
      sku: item.sku,
      description: item.description,
      qtyExpected: item.qtyExpected,
      qtyReceived: item.qtyReceived ?? item.qtyExpected,
      condition: item.condition ?? "Good",
      checked: !!item.qtyReceived,
      qcStatus: item.qtyReceived ? "Passed" : "Pending",
    })) ?? []
  );
  const [putawayNotes, setPutawayNotes] = useState("");
  const [qualityNotes, setQualityNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!shipment) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <h2 style={{ color: "#111827" }}>Shipment Not Found</h2>
        <p style={{ color: "#6B7280" }}>No inbound shipment with ID &quot;{id}&quot;</p>
        <a href="/dashboard/inbound" style={{ color: PURPLE, fontWeight: 600 }}>&larr; Back to Inbound</a>
      </div>
    );
  }

  const isReceivable = shipment.status === "Arriving" || shipment.status === "Inspecting";
  const allChecked = lines.every((l) => l.checked);
  const isColdChain = shipment.itemDetails.some(d => d.sku.startsWith("CLD"));
  const vehicle = carrierVehicles[shipment.carrier] || { type: "Standard Truck", plate: "N/A" };
  const currentStepIdx = timelineSteps.indexOf(shipment.status as typeof timelineSteps[number]);
  const timestamps = timelineTimestamps[shipment.status] || timelineTimestamps.Expected;

  const updateLine = (idx: number, field: string, value: unknown) => {
    setLines((prev) => prev.map((l, i) => i === idx ? { ...l, [field]: value } : l));
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <CheckCircle size={48} color="#059669" />
        <h2 style={{ color: "#111827", marginTop: 16 }}>Shipment Received Successfully</h2>
        <p style={{ color: "#6B7280", marginTop: 8 }}>
          {shipment.shipmentId} has been received. Inventory has been updated.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 24 }}>
          <a href="/dashboard/inbound" style={{ padding: "10px 20px", borderRadius: 8, background: PURPLE, color: "#fff", textDecoration: "none", fontWeight: 600, fontSize: 14 }}>
            Back to Inbound
          </a>
          <a href="/dashboard/inventory" style={{ padding: "10px 20px", borderRadius: 8, background: "#F3F4F6", color: "#374151", textDecoration: "none", fontWeight: 600, fontSize: 14 }}>
            View Inventory
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      <a href="/dashboard/inbound" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#6B7280", textDecoration: "none", fontSize: 13, marginBottom: 20 }}>
        <ArrowLeft size={14} /> Back to Inbound
      </a>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827", margin: 0 }}>
            {isReceivable ? "Receive Shipment" : "Shipment Details"} &mdash; {shipment.shipmentId}
          </h1>
          <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>
            {shipment.supplier} &mdash; via {shipment.carrier}
          </p>
        </div>
        <span style={statusColor[shipment.status]}>{shipment.status}</span>
      </div>

      {/* Shipment Timeline */}
      <div style={s.card}>
        <h3 style={s.cardTitle}>
          <Clock size={16} style={{ verticalAlign: "middle", marginRight: 8, color: PURPLE }} />
          Shipment Timeline
        </h3>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginTop: 20, position: "relative", padding: "0 10px" }}>
          {/* Connecting line */}
          <div style={{ position: "absolute", top: 16, left: 40, right: 40, height: 3, background: "#E5E7EB", zIndex: 0 }}>
            <div style={{
              height: "100%", borderRadius: 2,
              width: `${(currentStepIdx / (timelineSteps.length - 1)) * 100}%`,
              background: `linear-gradient(90deg, ${PURPLE}, #A78BFA)`,
              transition: "width 0.5s ease",
            }} />
          </div>
          {timelineSteps.map((step, idx) => {
            const isCompleted = idx <= currentStepIdx;
            const isCurrent = idx === currentStepIdx;
            const ts = timestamps[step];
            return (
              <div key={step} style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 1, flex: 1 }}>
                <div style={{
                  width: isCurrent ? 34 : 28, height: isCurrent ? 34 : 28, borderRadius: "50%",
                  background: isCompleted ? PURPLE : "#E5E7EB",
                  border: isCurrent ? `3px solid ${PURPLE}40` : "none",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.3s",
                  boxShadow: isCurrent ? `0 0 0 4px ${PURPLE}15` : "none",
                }}>
                  {isCompleted ? (
                    <CheckCircle size={14} color="#fff" />
                  ) : (
                    <CircleDot size={14} color="#9CA3AF" />
                  )}
                </div>
                <span style={{
                  fontSize: 11, fontWeight: isCurrent ? 700 : 500, marginTop: 8,
                  color: isCompleted ? PURPLE : "#9CA3AF",
                }}>
                  {step}
                </span>
                {ts && (
                  <span style={{ fontSize: 9, color: "#9CA3AF", marginTop: 2, textAlign: "center" }}>
                    {ts}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Info Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, marginBottom: 24 }}>
        {/* Shipment Info */}
        <div style={s.card}>
          <h3 style={s.cardTitle}><Truck size={16} style={{ verticalAlign: "middle", marginRight: 8, color: PURPLE }} />Shipment Information</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
            <div>
              <div style={s.fieldLabel}>Shipment ID</div>
              <div style={{ ...s.fieldValue, color: PURPLE, fontFamily: "monospace" }}>{shipment.shipmentId}</div>
            </div>
            <div>
              <div style={s.fieldLabel}>PO Number</div>
              <div style={{ fontFamily: "monospace", fontWeight: 600, color: "#111827" }}>{shipment.poNumber}</div>
            </div>
            <div>
              <div style={s.fieldLabel}>Supplier</div>
              <div style={s.fieldValue}>{shipment.supplier}</div>
            </div>
            <div>
              <div style={s.fieldLabel}>Origin</div>
              <div style={s.fieldValue}>{shipment.origin}</div>
            </div>
            <div>
              <div style={s.fieldLabel}>Expected Arrival</div>
              <div style={s.fieldValue}>{shipment.expectedDate}</div>
            </div>
            <div>
              <div style={s.fieldLabel}>Total Expected Qty</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#111827" }}>{shipment.qtyExpected}</div>
            </div>
          </div>
        </div>

        {/* Carrier Information */}
        <div style={s.card}>
          <h3 style={s.cardTitle}><Truck size={16} style={{ verticalAlign: "middle", marginRight: 8, color: PURPLE }} />Carrier Information</h3>
          <div style={{ marginTop: 16 }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 16, padding: "16px 20px",
              background: PURPLE_LIGHT, borderRadius: 10, border: `1px solid ${PURPLE_BORDER}`,
              marginBottom: 16,
            }}>
              <div style={{
                width: 52, height: 52, borderRadius: 12, background: `${PURPLE}15`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {vehicle.type.includes("Ship") ? <Ship size={24} color={PURPLE} /> :
                 vehicle.type.includes("Van") ? <Box size={24} color={PURPLE} /> :
                 <Truck size={24} color={PURPLE} />}
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>{shipment.carrier}</div>
                <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>{vehicle.type}</div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <div style={s.fieldLabel}>Plate / Container No.</div>
                <div style={{ fontFamily: "monospace", fontWeight: 600, color: "#111827" }}>{vehicle.plate}</div>
              </div>
              <div>
                <div style={s.fieldLabel}>BOC Entry</div>
                {shipment.bocEntry ? (
                  <div style={{ fontWeight: 600, color: PURPLE }}>{shipment.bocEntry}</div>
                ) : (
                  <div style={{ color: "#9CA3AF" }}>Domestic shipment</div>
                )}
              </div>
              {shipment.containerNo && (
                <div>
                  <div style={s.fieldLabel}>Container Number</div>
                  <div style={{ fontFamily: "monospace", fontWeight: 600, color: "#111827" }}>{shipment.containerNo}</div>
                </div>
              )}
              <div>
                <div style={s.fieldLabel}>Items Count</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#111827" }}>{shipment.itemDetails.length}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Document Attachments */}
      <div style={s.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={s.cardTitle}><FileText size={16} style={{ verticalAlign: "middle", marginRight: 8, color: PURPLE }} />Document Attachments</h3>
          <button style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "6px 14px", borderRadius: 8, border: `1px solid ${PURPLE_BORDER}`,
            background: PURPLE_LIGHT, color: PURPLE, fontSize: 12, fontWeight: 600, cursor: "pointer",
          }}>
            <Upload size={12} /> Upload Document
          </button>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 16 }}>
          {mockDocuments.map((doc) => {
            const showForShipment = doc.type === "BOL" ? !!shipment.bocEntry : doc.type === "CI" ? !!shipment.bocEntry : true;
            if (!showForShipment) return null;
            const Icon = doc.icon;
            return (
              <div key={doc.type} style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "10px 16px", borderRadius: 10,
                border: `1px solid ${doc.uploaded ? "#E5E7EB" : "#FDE68A"}`,
                background: doc.uploaded ? "#F9FAFB" : "#FFFBEB",
                cursor: "pointer", transition: "all 0.2s",
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8, background: `${doc.color}14`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon size={16} color={doc.color} />
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>{doc.name}</div>
                  <div style={{ fontSize: 10, color: doc.uploaded ? "#059669" : "#D97706", fontWeight: 600 }}>
                    {doc.uploaded ? "Uploaded" : "Missing"}
                  </div>
                </div>
                {doc.uploaded && (
                  <span style={{ padding: "2px 6px", borderRadius: 4, fontSize: 9, fontWeight: 700, background: "#D1FAE5", color: "#065F46", marginLeft: 4 }}>
                    PDF
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Temperature Log (for cold chain) */}
      {isColdChain && (
        <div style={s.card}>
          <h3 style={s.cardTitle}>
            <Thermometer size={16} style={{ verticalAlign: "middle", marginRight: 8, color: "#2563EB" }} />
            Cold Chain Temperature Log
          </h3>
          <div style={{ marginTop: 16 }}>
            {/* Temperature chart */}
            <div style={{ position: "relative", height: 140, marginBottom: 8 }}>
              {/* Safe zone indicators */}
              <div style={{ position: "absolute", left: 40, right: 0, top: 0, bottom: 20 }}>
                <div style={{ position: "absolute", top: "10%", bottom: "10%", left: 0, right: 0, background: "#DBEAFE20", border: "1px dashed #93C5FD", borderRadius: 4 }}>
                  <span style={{ position: "absolute", right: 4, top: 2, fontSize: 8, color: "#2563EB", fontWeight: 600 }}>Safe: -18 to -15</span>
                </div>
              </div>
              {/* Y-axis */}
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 20, width: 36, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <span style={{ fontSize: 9, color: "#9CA3AF" }}>-14</span>
                <span style={{ fontSize: 9, color: "#9CA3AF" }}>-16</span>
                <span style={{ fontSize: 9, color: "#9CA3AF" }}>-18</span>
              </div>
              {/* Chart */}
              <svg width="calc(100% - 40px)" height="120" viewBox="0 0 300 120" preserveAspectRatio="none" style={{ marginLeft: 40 }}>
                <defs>
                  <linearGradient id="tempGrad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#2563EB" stopOpacity="0.02" />
                  </linearGradient>
                </defs>
                <path
                  d={`M0,${((mockTempLog[0].temp + 14) / (-18 + 14)) * -120 + 120} ${mockTempLog.map((p, i) => {
                    const y = ((p.temp + 14) / 4) * -120 + 120;
                    return `L${(i / (mockTempLog.length - 1)) * 300},${Math.max(0, Math.min(120, y))}`;
                  }).join(" ")} L300,120 L0,120 Z`}
                  fill="url(#tempGrad)"
                />
                <polyline
                  points={mockTempLog.map((p, i) => {
                    const y = ((p.temp + 14) / 4) * -120 + 120;
                    return `${(i / (mockTempLog.length - 1)) * 300},${Math.max(0, Math.min(120, y))}`;
                  }).join(" ")}
                  fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                />
                {mockTempLog.map((p, i) => {
                  const y = ((p.temp + 14) / 4) * -120 + 120;
                  return (
                    <circle key={i} cx={(i / (mockTempLog.length - 1)) * 300} cy={Math.max(0, Math.min(120, y))} r="3" fill="#fff" stroke="#2563EB" strokeWidth="2" />
                  );
                })}
              </svg>
            </div>
            {/* X-axis labels */}
            <div style={{ display: "flex", justifyContent: "space-between", marginLeft: 40, paddingTop: 4 }}>
              {mockTempLog.map(p => (
                <span key={p.time} style={{ fontSize: 9, color: "#9CA3AF" }}>{p.time}</span>
              ))}
            </div>
            {/* Stats row */}
            <div style={{ display: "flex", gap: 16, marginTop: 12, padding: "10px 14px", background: "#EFF6FF", borderRadius: 8 }}>
              <div>
                <span style={{ fontSize: 10, color: "#6B7280" }}>Min: </span>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#2563EB" }}>{Math.min(...mockTempLog.map(t => t.temp)).toFixed(1)}&deg;C</span>
              </div>
              <div>
                <span style={{ fontSize: 10, color: "#6B7280" }}>Max: </span>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#2563EB" }}>{Math.max(...mockTempLog.map(t => t.temp)).toFixed(1)}&deg;C</span>
              </div>
              <div>
                <span style={{ fontSize: 10, color: "#6B7280" }}>Avg: </span>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#2563EB" }}>{(mockTempLog.reduce((a, b) => a + b.temp, 0) / mockTempLog.length).toFixed(1)}&deg;C</span>
              </div>
              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4 }}>
                <ShieldCheck size={12} color="#059669" />
                <span style={{ fontSize: 11, fontWeight: 600, color: "#059669" }}>Within safe range</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Receiving Form / Items Checklist */}
      <div style={s.card}>
        <h3 style={s.cardTitle}>
          <Package size={16} style={{ verticalAlign: "middle", marginRight: 8, color: PURPLE }} />
          {isReceivable ? "Items to Receive - Checklist" : "Received Items Checklist"}
        </h3>
        <div style={{ overflowX: "auto", marginTop: 14 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr>
                {isReceivable && <th style={s.th}>Verify</th>}
                <th style={s.th}>SKU</th>
                <th style={s.th}>Description</th>
                <th style={s.th}>Qty Expected</th>
                <th style={s.th}>Qty Received</th>
                <th style={s.th}>Condition</th>
                <th style={s.th}>QC Status</th>
                <th style={s.th}>Variance</th>
              </tr>
            </thead>
            <tbody>
              {lines.map((line, idx) => {
                const variance = line.qtyReceived - line.qtyExpected;
                const pctReceived = Math.round((line.qtyReceived / line.qtyExpected) * 100);
                return (
                  <tr key={line.sku} style={{ background: line.checked ? "#F0FDF4" : "transparent" }}>
                    {isReceivable && (
                      <td style={s.td}>
                        <input
                          type="checkbox"
                          checked={line.checked}
                          onChange={(e) => updateLine(idx, "checked", e.target.checked)}
                          style={{ width: 18, height: 18, accentColor: PURPLE, cursor: "pointer" }}
                        />
                      </td>
                    )}
                    <td style={s.td}>
                      <a href={`/dashboard/inventory`} style={{ fontFamily: "monospace", fontWeight: 600, color: PURPLE, textDecoration: "none" }}>
                        {line.sku}
                      </a>
                    </td>
                    <td style={{ ...s.td, maxWidth: 220, whiteSpace: "normal" }}>{line.description}</td>
                    <td style={s.td}><span style={{ fontWeight: 600 }}>{line.qtyExpected}</span></td>
                    <td style={s.td}>
                      {isReceivable ? (
                        <div>
                          <input
                            type="number"
                            min={0}
                            value={line.qtyReceived}
                            onChange={(e) => updateLine(idx, "qtyReceived", parseInt(e.target.value) || 0)}
                            style={{ width: 80, padding: "6px 8px", border: "1px solid #E5E7EB", borderRadius: 6, fontSize: 13, textAlign: "center" }}
                          />
                          {/* Progress bar */}
                          <div style={{ width: 80, height: 3, background: "#E5E7EB", borderRadius: 2, marginTop: 4, overflow: "hidden" }}>
                            <div style={{
                              height: "100%", borderRadius: 2, transition: "width 0.3s",
                              width: `${Math.min(100, pctReceived)}%`,
                              background: pctReceived >= 100 ? "#059669" : pctReceived >= 50 ? "#D97706" : "#DC2626",
                            }} />
                          </div>
                        </div>
                      ) : (
                        <div>
                          <span style={{ fontWeight: 600 }}>{line.qtyReceived}</span>
                          <div style={{ width: 60, height: 3, background: "#E5E7EB", borderRadius: 2, marginTop: 4, overflow: "hidden" }}>
                            <div style={{
                              height: "100%", borderRadius: 2, width: `${Math.min(100, pctReceived)}%`,
                              background: pctReceived >= 100 ? "#059669" : "#D97706",
                            }} />
                          </div>
                        </div>
                      )}
                    </td>
                    <td style={s.td}>
                      {isReceivable ? (
                        <select
                          value={line.condition}
                          onChange={(e) => updateLine(idx, "condition", e.target.value)}
                          style={{ padding: "6px 10px", border: "1px solid #E5E7EB", borderRadius: 6, fontSize: 12, cursor: "pointer" }}
                        >
                          {conditionOptions.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                      ) : (
                        <span style={{
                          padding: "3px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600,
                          background: line.condition === "Good" ? "#D1FAE5" : line.condition === "Damaged" ? "#FEE2E2" : "#FEF3C7",
                          color: line.condition === "Good" ? "#065F46" : line.condition === "Damaged" ? "#991B1B" : "#92400E",
                        }}>
                          {line.condition}
                        </span>
                      )}
                    </td>
                    <td style={s.td}>
                      {isReceivable ? (
                        <select
                          value={line.qcStatus}
                          onChange={(e) => updateLine(idx, "qcStatus", e.target.value)}
                          style={{
                            padding: "6px 10px", borderRadius: 6, fontSize: 12, cursor: "pointer",
                            border: `1px solid ${line.qcStatus === "Passed" ? "#A7F3D0" : line.qcStatus === "Failed" ? "#FECACA" : "#E5E7EB"}`,
                            background: line.qcStatus === "Passed" ? "#F0FDF4" : line.qcStatus === "Failed" ? "#FEF2F2" : "#fff",
                          }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Passed">Passed</option>
                          <option value="Failed">Failed</option>
                        </select>
                      ) : (
                        <span style={{
                          display: "inline-flex", alignItems: "center", gap: 4,
                          padding: "3px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600,
                          background: line.qcStatus === "Passed" ? "#D1FAE5" : line.qcStatus === "Failed" ? "#FEE2E2" : "#F3F4F6",
                          color: line.qcStatus === "Passed" ? "#065F46" : line.qcStatus === "Failed" ? "#991B1B" : "#6B7280",
                        }}>
                          {line.qcStatus === "Passed" && <ShieldCheck size={12} />}
                          {line.qcStatus}
                        </span>
                      )}
                    </td>
                    <td style={s.td}>
                      {variance === 0 ? (
                        <span style={{ color: "#059669", fontWeight: 600 }}>Match</span>
                      ) : (
                        <span style={{ color: variance > 0 ? "#2563EB" : "#DC2626", fontWeight: 600 }}>
                          {variance > 0 ? "+" : ""}{variance}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Quality Notes */}
        <div style={{ marginTop: 20, padding: "16px 20px", background: "#F9FAFB", borderRadius: 10, border: "1px solid #E5E7EB" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
            <MessageSquare size={14} color={PURPLE} />
            <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Quality Notes</span>
          </div>
          <textarea
            value={qualityNotes}
            onChange={(e) => setQualityNotes(e.target.value)}
            placeholder="Record any quality observations, discrepancies, packaging issues, damage notes..."
            rows={3}
            style={{
              width: "100%", padding: "10px 12px", border: `1px solid ${PURPLE_BORDER}`, borderRadius: 8,
              fontSize: 13, resize: "vertical", outline: "none", background: "#fff",
            }}
          />
        </div>

        {/* Putaway Notes */}
        {isReceivable && (
          <div style={{ marginTop: 16 }}>
            <label style={s.fieldLabel}>Putaway Instructions / Notes</label>
            <textarea
              value={putawayNotes}
              onChange={(e) => setPutawayNotes(e.target.value)}
              placeholder="Enter putaway zone instructions, special handling notes, etc."
              rows={3}
              style={{ width: "100%", padding: "10px 12px", border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 13, resize: "vertical", marginTop: 6 }}
            />
          </div>
        )}

        {/* Submit */}
        {isReceivable && (
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 20 }}>
            <a href="/dashboard/inbound" style={{ padding: "10px 20px", borderRadius: 8, border: "1px solid #E5E7EB", background: "#fff", color: "#374151", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>
              Cancel
            </a>
            <button
              onClick={handleSubmit}
              disabled={!allChecked}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "10px 24px", borderRadius: 8, border: "none",
                background: allChecked ? PURPLE : "#E5E7EB",
                color: allChecked ? "#fff" : "#9CA3AF",
                fontSize: 14, fontWeight: 600, cursor: allChecked ? "pointer" : "not-allowed",
              }}
            >
              <CheckCircle size={16} />
              Confirm Receipt &amp; Update Inventory
            </button>
          </div>
        )}

        {/* Warning if not all checked */}
        {isReceivable && !allChecked && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, padding: "10px 14px", background: "#FEF3C7", borderRadius: 8 }}>
            <AlertTriangle size={14} color="#D97706" />
            <span style={{ fontSize: 12, color: "#92400E" }}>Check off all items to confirm receipt</span>
          </div>
        )}
      </div>
    </>
  );
}

const s: Record<string, React.CSSProperties> = {
  card: { background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: "20px 24px", marginBottom: 20 },
  cardTitle: { fontSize: 15, fontWeight: 700, color: "#111827", margin: 0 },
  fieldLabel: { fontSize: 11, color: "#9CA3AF", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.3, marginBottom: 4 },
  fieldValue: { fontSize: 14, fontWeight: 600, color: "#111827" },
  th: { textAlign: "left", padding: "10px 12px", borderBottom: "1px solid #E5E7EB", color: "#6B7280", fontWeight: 600, fontSize: 12, whiteSpace: "nowrap" },
  td: { padding: "10px 12px", borderBottom: "1px solid #F3F4F6", color: "#374151", whiteSpace: "nowrap" },
};
