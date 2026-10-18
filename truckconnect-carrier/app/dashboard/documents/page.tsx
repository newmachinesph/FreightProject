"use client";
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  FileText, Upload, ShieldCheck, AlertTriangle, XOctagon,
  Download, Printer, Calendar, X, UploadCloud,
} from "lucide-react";
import { documents } from "@/lib/mock-data";
import type { DocStatus } from "@/lib/mock-data";

const statusStyle: Record<DocStatus, { bg: string; color: string; icon: React.ReactNode; label: string }> = {
  valid: { bg: "#DCFCE7", color: "#16A34A", icon: <ShieldCheck size={12} />, label: "Valid" },
  expiring_soon: { bg: "#FEF3C7", color: "#D97706", icon: <AlertTriangle size={12} />, label: "Expiring Soon" },
  expired: { bg: "#FEE2E2", color: "#DC2626", icon: <XOctagon size={12} />, label: "Expired" },
};

const typeStyle: Record<string, { bg: string; color: string }> = {
  "OR/CR": { bg: "#FEF3C7", color: "#D97706" },
  License: { bg: "#DBEAFE", color: "#2563EB" },
  LTFRB: { bg: "#EDE9FE", color: "#7C3AED" },
  CTPL: { bg: "#FEE2E2", color: "#DC2626" },
  NBI: { bg: "#E0F2FE", color: "#0891B2" },
  "Drug Test": { bg: "#FCE7F3", color: "#DB2777" },
  ePOD: { bg: "#ECFDF5", color: "#059669" },
  Waybill: { bg: "#F3F4F6", color: "#4B5563" },
};

const categories = ["Vehicle Docs", "Driver Docs", "Insurance", "Trip Docs"] as const;

// ── Computed compliance data ───────────────────────────────────────────────────
const categoryStats = categories.map((cat) => {
  const catDocs = documents.filter((d) => d.category === cat);
  const validCount = catDocs.filter((d) => d.status === "valid").length;
  return { category: cat, total: catDocs.length, valid: validCount };
});

const totalDocs = documents.length;
const totalValid = documents.filter((d) => d.status === "valid").length;
const complianceScore = Math.round((totalValid / totalDocs) * 100);

// Documents with expiry dates sorted by expiry
const expiringDocs = documents
  .filter((d) => d.expiry !== "-")
  .sort((a, b) => a.expiry.localeCompare(b.expiry));

// Months for the expiry timeline
const expiryMonths: { month: string; docs: typeof expiringDocs }[] = [];
const seen = new Set<string>();
expiringDocs.forEach((d) => {
  const m = d.expiry.slice(0, 7); // "YYYY-MM"
  if (!seen.has(m)) {
    seen.add(m);
    expiryMonths.push({ month: m, docs: expiringDocs.filter((doc) => doc.expiry.startsWith(m)) });
  }
});

export default function DocumentsPage() {
  const [activeCategory, setActiveCategory] = useState<string>("Vehicle Docs");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);

  const filtered = documents.filter((d) => d.category === activeCategory);
  const validCount = documents.filter((d) => d.status === "valid").length;
  const expiringCount = documents.filter((d) => d.status === "expiring_soon").length;
  const expiredCount = documents.filter((d) => d.status === "expired").length;

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827", margin: 0 }}>Documents &amp; Compliance</h1>
            <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>Manage vehicle, driver, insurance, and trip documents</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setShowUploadModal(true)} style={{
              display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 8,
              border: "none", background: "#2563EB", color: "#FFFFFF", fontSize: 13, fontWeight: 600, cursor: "pointer",
            }}>
              <Upload size={16} /> Upload Document
            </button>
          </div>
        </div>
      </div>

      {/* Compliance Score */}
      <div style={{
        background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 12, padding: 20, marginBottom: 20,
        display: "flex", alignItems: "center", gap: 24,
      }}>
        <div style={{ position: "relative", width: 80, height: 80 }}>
          <svg width="80" height="80" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="34" fill="none" stroke="#F3F4F6" strokeWidth="8" />
            <circle cx="40" cy="40" r="34" fill="none" stroke={complianceScore >= 80 ? "#059669" : complianceScore >= 60 ? "#D97706" : "#DC2626"}
              strokeWidth="8" strokeLinecap="round"
              strokeDasharray={`${(complianceScore / 100) * 213.6} 213.6`}
              transform="rotate(-90 40 40)" />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, color: "#111827" }}>
            {complianceScore}%
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 4 }}>
            Overall Compliance Score: {complianceScore}% Compliant
          </div>
          <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 12 }}>
            {totalValid} of {totalDocs} documents are valid and up-to-date
          </div>
          {/* Category progress bars */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {categoryStats.map((cs) => (
              <div key={cs.category}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#374151" }}>{cs.category}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: cs.valid === cs.total ? "#059669" : "#D97706" }}>
                    {cs.valid}/{cs.total} valid
                  </span>
                </div>
                <div style={{ height: 6, background: "#F3F4F6", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: 3,
                    width: `${cs.total > 0 ? (cs.valid / cs.total) * 100 : 0}%`,
                    background: cs.valid === cs.total ? "#059669" : "#D97706",
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bulk Actions + Timeline Toggle */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        <button style={bulkBtn}>
          <Download size={14} /> Download All
        </button>
        <button style={bulkBtn}>
          <Printer size={14} /> Print Compliance Report
        </button>
        <button onClick={() => setShowTimeline(!showTimeline)} style={{
          ...bulkBtn,
          background: showTimeline ? "#EFF6FF" : "#FFFFFF",
          borderColor: showTimeline ? "#2563EB" : "#E5E7EB",
          color: showTimeline ? "#2563EB" : "#4B5563",
        }}>
          <Calendar size={14} /> {showTimeline ? "Hide" : "Show"} Expiry Timeline
        </button>
      </div>

      {/* Expiry Timeline */}
      {showTimeline && (
        <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 12, padding: 20, marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 16 }}>Document Expiry Timeline</div>
          <div style={{ display: "flex", gap: 16, overflowX: "auto", paddingBottom: 8 }}>
            {expiryMonths.map((em) => {
              const [year, month] = em.month.split("-");
              const monthName = new Date(Number(year), Number(month) - 1).toLocaleString("en", { month: "short", year: "numeric" });
              const isPast = em.month < "2026-03";
              return (
                <div key={em.month} style={{
                  minWidth: 180, background: isPast ? "#FEE2E2" : "#F9FAFB",
                  border: `1px solid ${isPast ? "#FECACA" : "#E5E7EB"}`, borderRadius: 10, padding: 14,
                }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: isPast ? "#DC2626" : "#111827", marginBottom: 8 }}>
                    {monthName}
                  </div>
                  {em.docs.map((d) => {
                    const ss = statusStyle[d.status];
                    return (
                      <div key={d.id} style={{
                        display: "flex", alignItems: "center", gap: 6, padding: "4px 0",
                        borderBottom: "1px solid rgba(0,0,0,0.05)",
                      }}>
                        <span style={{ color: ss.color }}>{ss.icon}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 11, fontWeight: 600, color: "#374151", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {d.name}
                          </div>
                          <div style={{ fontSize: 10, color: "#9CA3AF" }}>{d.expiry}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Status Summary */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        {[
          { ...statusStyle.valid, count: validCount },
          { ...statusStyle.expiring_soon, count: expiringCount },
          { ...statusStyle.expired, count: expiredCount },
        ].map((item) => (
          <div key={item.label} style={{
            display: "flex", alignItems: "center", gap: 8, padding: "10px 18px",
            borderRadius: 8, background: item.bg, color: item.color, fontSize: 13, fontWeight: 600,
          }}>
            {item.icon}
            {item.count} {item.label}
          </div>
        ))}
      </div>

      {/* Category Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {categories.map((cat) => (
          <button key={cat} onClick={() => setActiveCategory(cat)} style={{
            padding: "8px 20px", borderRadius: 8, border: "1px solid",
            borderColor: activeCategory === cat ? "#2563EB" : "#E5E7EB",
            background: activeCategory === cat ? "#EFF6FF" : "#FFFFFF",
            color: activeCategory === cat ? "#2563EB" : "#4B5563",
            fontSize: 13, fontWeight: 600, cursor: "pointer",
          }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Documents Table */}
      <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F9FAFB" }}>
              {["Document", "Type", "Reference", "Status", "Expiry Date"].map((h) => (
                <th key={h} style={{ padding: "10px 16px", fontSize: 11, fontWeight: 600, color: "#6B7280", textAlign: "left" as const, borderBottom: "1px solid #E5E7EB", textTransform: "uppercase" as const, letterSpacing: 0.5 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((doc) => {
              const ss = statusStyle[doc.status];
              const ts = typeStyle[doc.type] ?? { bg: "#F3F4F6", color: "#6B7280" };
              return (
                <tr key={doc.id} style={{ borderBottom: "1px solid #F3F4F6" }}>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <FileText size={14} color="#6B7280" />
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{doc.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ padding: "3px 10px", borderRadius: 4, fontSize: 11, fontWeight: 600, background: ts.bg, color: ts.color }}>
                      {doc.type}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: "#6B7280", fontFamily: "monospace" }}>{doc.reference}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 4,
                      padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600,
                      background: ss.bg, color: ss.color,
                    }}>
                      {ss.icon} {ss.label}
                    </span>
                  </td>
                  <td style={{
                    padding: "12px 16px", fontSize: 13,
                    color: doc.expiry === "-" ? "#D1D5DB" : doc.status === "expired" ? "#DC2626" : doc.status === "expiring_soon" ? "#D97706" : "#9CA3AF",
                    fontWeight: doc.status !== "valid" && doc.expiry !== "-" ? 600 : 400,
                  }}>
                    {doc.expiry === "-" ? "N/A" : doc.expiry}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200,
          display: "flex", alignItems: "center", justifyContent: "center",
        }} onClick={() => setShowUploadModal(false)}>
          <div style={{
            background: "#FFFFFF", borderRadius: 16, padding: 28, width: 480, maxWidth: "90vw",
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: 0 }}>Upload Document</h2>
              <button onClick={() => setShowUploadModal(false)} style={{
                background: "none", border: "none", cursor: "pointer", padding: 4,
              }}>
                <X size={20} color="#6B7280" />
              </button>
            </div>

            {/* Document type selector */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Document Type</label>
              <select style={{
                width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E5E7EB",
                fontSize: 13, color: "#374151", background: "#FFFFFF",
              }}>
                <option>Select type...</option>
                <option>OR/CR</option>
                <option>License</option>
                <option>LTFRB Franchise</option>
                <option>CTPL Insurance</option>
                <option>NBI Clearance</option>
                <option>Drug Test Certificate</option>
                <option>ePOD</option>
                <option>Waybill</option>
              </select>
            </div>

            {/* Category selector */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Category</label>
              <select style={{
                width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E5E7EB",
                fontSize: 13, color: "#374151", background: "#FFFFFF",
              }}>
                <option>Select category...</option>
                {categories.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>

            {/* Drag and Drop Area */}
            <div style={{
              border: "2px dashed #D1D5DB", borderRadius: 12, padding: 40,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              background: "#F9FAFB", marginBottom: 20, cursor: "pointer",
            }}>
              <UploadCloud size={40} color="#9CA3AF" />
              <div style={{ fontSize: 14, fontWeight: 600, color: "#374151", marginTop: 12 }}>
                Drag & drop files here
              </div>
              <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 4 }}>
                or click to browse (PDF, JPG, PNG up to 10MB)
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button onClick={() => setShowUploadModal(false)} style={{
                padding: "10px 20px", borderRadius: 8, border: "1px solid #E5E7EB",
                background: "#FFFFFF", color: "#4B5563", fontSize: 13, fontWeight: 600, cursor: "pointer",
              }}>Cancel</button>
              <button style={{
                padding: "10px 20px", borderRadius: 8, border: "none",
                background: "#2563EB", color: "#FFFFFF", fontSize: 13, fontWeight: 600, cursor: "pointer",
              }}>Upload</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

const bulkBtn: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8,
  border: "1px solid #E5E7EB", background: "#FFFFFF", color: "#4B5563",
  fontSize: 12, fontWeight: 600, cursor: "pointer",
};
