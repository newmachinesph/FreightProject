"use client";
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import VehicleIcon from "@/components/VehicleIcon";
import { loads, formatPeso, type LoadStatus } from "@/lib/mock-data";
import { MapPin, Filter, Plus, Anchor, ChevronDown, ChevronUp, X, Download, Copy, Ban, CheckSquare, Square } from "lucide-react";
import Link from "next/link";

const statusColor: Record<string, { bg: string; color: string; border: string; label: string }> = {
  draft: { bg: "#F3F4F6", color: "#6B7280", border: "#E5E7EB", label: "Draft" },
  posted: { bg: "#DBEAFE", color: "#1E40AF", border: "#93C5FD", label: "Posted" },
  bidding: { bg: "#FEF3C7", color: "#92400E", border: "#FDE68A", label: "Bidding" },
  awarded: { bg: "#D1FAE5", color: "#065F46", border: "#6EE7B7", label: "Awarded" },
  in_transit: { bg: "#E0E7FF", color: "#3730A3", border: "#A5B4FC", label: "In Transit" },
  delivered: { bg: "#DCFCE7", color: "#166534", border: "#86EFAC", label: "Delivered" },
  cancelled: { bg: "#FEE2E2", color: "#991B1B", border: "#FCA5A5", label: "Cancelled" },
};

const filterTabs: { label: string; value: LoadStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Draft", value: "draft" },
  { label: "Posted", value: "posted" },
  { label: "Bidding", value: "bidding" },
  { label: "Awarded", value: "awarded" },
  { label: "In Transit", value: "in_transit" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

export default function MyLoadsPage() {
  const [activeFilter, setActiveFilter] = useState<LoadStatus | "all">("all");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const perPage = 10;

  const filtered = activeFilter === "all" ? loads : loads.filter((l) => l.status === activeFilter);
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const allPageSelected = paginated.length > 0 && paginated.every((l) => selectedIds.has(l.id));
  const someSelected = selectedIds.size > 0;

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (allPageSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        paginated.forEach((l) => next.delete(l.id));
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        paginated.forEach((l) => next.add(l.id));
        return next;
      });
    }
  };

  const clearSelection = () => setSelectedIds(new Set());

  return (
    <DashboardLayout activeNav="/dashboard/loads">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827", margin: 0 }}>My Loads</h1>
          <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>All freight loads you have posted</p>
        </div>
        <Link href="/dashboard/loads/new" style={s.postBtn}>
          <Plus size={16} /> Post New Load
        </Link>
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
        <Filter size={14} color="#9CA3AF" />
        {filterTabs.map((tab) => {
          const sc = tab.value !== "all" ? statusColor[tab.value] : null;
          return (
            <button
              key={tab.value}
              onClick={() => { setActiveFilter(tab.value); setPage(1); }}
              style={{
                padding: "5px 14px", borderRadius: 6, border: "1px solid",
                borderColor: activeFilter === tab.value
                  ? (sc ? sc.border : "#2563EB")
                  : "#E5E7EB",
                background: activeFilter === tab.value
                  ? (sc ? sc.bg : "#EFF6FF")
                  : "#fff",
                color: activeFilter === tab.value
                  ? (sc ? sc.color : "#2563EB")
                  : "#6B7280",
                fontSize: 12, fontWeight: 600, cursor: "pointer",
              }}
            >
              {tab.label}
            </button>
          );
        })}
        <span style={{ fontSize: 12, color: "#9CA3AF", marginLeft: 8 }}>
          Showing {filtered.length} of {loads.length} loads
        </span>
      </div>

      {/* Bulk Action Toolbar */}
      {someSelected && (
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "10px 16px", marginBottom: 12,
          background: "#EFF6FF", border: "1px solid #DBEAFE", borderRadius: 10,
        }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: 13, fontWeight: 700, color: "#2563EB",
          }}>
            <CheckSquare size={16} /> {selectedIds.size} selected
          </span>
          <div style={{ width: 1, height: 20, background: "#BFDBFE" }} />
          <button
            onClick={() => { alert(`Cancelling ${selectedIds.size} load(s): ${[...selectedIds].join(", ")}`); clearSelection(); }}
            style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              padding: "6px 14px", borderRadius: 6, border: "1px solid #FCA5A5",
              background: "#FEF2F2", color: "#DC2626", fontSize: 12, fontWeight: 600, cursor: "pointer",
            }}
          >
            <Ban size={13} /> Cancel Selected
          </button>
          <button
            onClick={() => { alert(`Exporting ${selectedIds.size} load(s) to CSV`); }}
            style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              padding: "6px 14px", borderRadius: 6, border: "1px solid #E5E7EB",
              background: "#fff", color: "#374151", fontSize: 12, fontWeight: 600, cursor: "pointer",
            }}
          >
            <Download size={13} /> Download CSV
          </button>
          <button
            onClick={() => { alert(`Duplicating ${selectedIds.size} load(s)`); clearSelection(); }}
            style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              padding: "6px 14px", borderRadius: 6, border: "1px solid #E5E7EB",
              background: "#fff", color: "#374151", fontSize: 12, fontWeight: 600, cursor: "pointer",
            }}
          >
            <Copy size={13} /> Duplicate
          </button>
          <button
            onClick={clearSelection}
            style={{
              marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 4,
              padding: "6px 10px", borderRadius: 6, border: "none",
              background: "transparent", color: "#6B7280", fontSize: 12, fontWeight: 600, cursor: "pointer",
            }}
          >
            <X size={13} /> Clear
          </button>
        </div>
      )}

      <div style={s.card}>
        <div style={{ overflowX: "auto" }}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={{ ...s.th, width: 40, textAlign: "center" }}>
                  <div
                    onClick={toggleSelectAll}
                    style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                  >
                    {allPageSelected
                      ? <CheckSquare size={16} color="#2563EB" />
                      : <Square size={16} color="#9CA3AF" />
                    }
                  </div>
                </th>
                <th style={s.th}>ID</th>
                <th style={s.th}>Route</th>
                <th style={s.th}>Vehicle</th>
                <th style={s.th}>Cargo</th>
                <th style={s.th}>Weight</th>
                <th style={s.th}>Rate</th>
                <th style={s.th}>Bids</th>
                <th style={s.th}>Status</th>
                <th style={s.th}>Posted</th>
                <th style={s.th}></th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((load) => {
                const sc = statusColor[load.status] || statusColor.draft;
                const isExpanded = expandedRow === load.id;
                const isSelected = selectedIds.has(load.id);
                return (
                  <>
                    <tr key={load.id} style={{ cursor: "pointer", background: isSelected ? "#EFF6FF" : undefined }} onClick={() => setExpandedRow(isExpanded ? null : load.id)}>
                      <td style={{ ...s.td, textAlign: "center", width: 40 }} onClick={(e) => { e.stopPropagation(); toggleSelect(load.id); }}>
                        <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                          {isSelected
                            ? <CheckSquare size={16} color="#2563EB" />
                            : <Square size={16} color="#D1D5DB" />
                          }
                        </div>
                      </td>
                      <td style={{ ...s.td, fontWeight: 600, fontSize: 12 }}>
                        <Link href={`/dashboard/loads/${load.id}`} style={{ color: "#2563EB", textDecoration: "none" }} onClick={(e) => e.stopPropagation()}>{load.id}</Link>
                      </td>
                      <td style={s.td}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <MapPin size={14} color="#9CA3AF" />
                          <span>{load.pickupCity} &rarr; {load.deliveryCity}</span>
                          {load.interIsland && (
                            <span style={{ fontSize: 9, background: "#DBEAFE", color: "#1E40AF", padding: "1px 6px", borderRadius: 4, fontWeight: 600 }}>
                              <Anchor size={8} style={{ verticalAlign: "middle", marginRight: 2 }} />
                              INTER-ISLAND
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={s.td}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <VehicleIcon type={load.vehicleNeeded} size={28} color="#6B7280" />
                          <span style={{ fontSize: 12, color: "#374151" }}>{load.vehicleNeeded}</span>
                        </div>
                      </td>
                      <td style={s.td}><div style={{ fontSize: 13 }}>{load.cargoType}</div></td>
                      <td style={s.td}>{(load.weightKg / 1000).toFixed(1)}t</td>
                      <td style={{ ...s.td, fontWeight: 600 }}>{formatPeso(load.offeredRate)}</td>
                      <td style={{ ...s.td, textAlign: "center" }}>
                        {load.bids > 0 ? (
                          <span style={{
                            background: "#FEF3C7", color: "#92400E",
                            padding: "3px 10px", borderRadius: 999, fontSize: 12, fontWeight: 700,
                            display: "inline-flex", alignItems: "center", gap: 4,
                            border: "1px solid #FDE68A",
                          }}>
                            {load.bids} {load.bids === 1 ? "bid" : "bids"}
                          </span>
                        ) : (
                          <span style={{ background: "#F3F4F6", color: "#9CA3AF", padding: "3px 10px", borderRadius: 999, fontSize: 12, fontWeight: 500 }}>
                            0 bids
                          </span>
                        )}
                      </td>
                      <td style={s.td}>
                        <span style={{
                          ...s.badge,
                          background: sc.bg, color: sc.color,
                          border: `1px solid ${sc.border}`,
                        }}>
                          {sc.label}
                        </span>
                      </td>
                      <td style={{ ...s.td, color: "#9CA3AF", fontSize: 12 }}>{load.postedDate}</td>
                      <td style={s.td}>{isExpanded ? <ChevronUp size={14} color="#9CA3AF" /> : <ChevronDown size={14} color="#9CA3AF" />}</td>
                    </tr>
                    {isExpanded && (
                      <tr key={`${load.id}-detail`}>
                        <td colSpan={11} style={{ padding: 0 }}>
                          <div style={{ background: "#F9FAFB", padding: "16px 24px", borderBottom: "1px solid #E5E7EB" }}>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 12 }}>
                              <div><div style={s.detailLabel}>Pickup Address</div><div style={s.detailValue}>{load.pickupAddress}</div></div>
                              <div><div style={s.detailLabel}>Delivery Address</div><div style={s.detailValue}>{load.deliveryAddress}</div></div>
                              <div><div style={s.detailLabel}>Pickup Date</div><div style={s.detailValue}>{load.pickupDate}</div></div>
                              <div><div style={s.detailLabel}>Time Window</div><div style={s.detailValue}>{load.pickupWindow}</div></div>
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 12 }}>
                              <div><div style={s.detailLabel}>Commodity</div><div style={s.detailValue}>{load.commodity}</div></div>
                              <div><div style={s.detailLabel}>Volume</div><div style={s.detailValue}>{load.volumeCbm} CBM</div></div>
                              <div>
                                <div style={s.detailLabel}>Vehicle</div>
                                <div style={{ ...s.detailValue, display: "flex", alignItems: "center", gap: 6 }}>
                                  <VehicleIcon type={load.vehicleNeeded} size={24} color="#2563EB" />
                                  {load.vehicleNeeded} x{load.numTrucks}
                                </div>
                              </div>
                              <div><div style={s.detailLabel}>Payment Terms</div><div style={s.detailValue}>{load.paymentTerms}</div></div>
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
                              {load.bocEntryNo && <div><div style={s.detailLabel}>BOC Entry No.</div><div style={s.detailValue}>{load.bocEntryNo}</div></div>}
                              {load.specialHandling && <div><div style={s.detailLabel}>Special Handling</div><div style={s.detailValue}>{load.specialHandling}</div></div>}
                              {load.tempRequirement && <div><div style={s.detailLabel}>Temp Requirement</div><div style={s.detailValue}>{load.tempRequirement}</div></div>}
                              {load.referenceNo && <div><div style={s.detailLabel}>Reference No.</div><div style={s.detailValue}>{load.referenceNo}</div></div>}
                              {load.bidDeadline && <div><div style={s.detailLabel}>Bid Deadline</div><div style={s.detailValue}>{load.bidDeadline}</div></div>}
                              {load.interIsland && <div><div style={s.detailLabel}>Island Route</div><div style={s.detailValue}>{load.originIsland} &rarr; {load.destIsland}</div></div>}
                            </div>
                            <div style={{ marginTop: 12 }}>
                              <Link href={`/dashboard/loads/${load.id}`} style={{ fontSize: 13, color: "#2563EB", fontWeight: 600, textDecoration: "none" }}>View Full Details &rarr;</Link>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginTop: 16, paddingTop: 16, borderTop: "1px solid #F3F4F6" }}>
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} style={{ ...s.pageBtn, opacity: page === 1 ? 0.4 : 1, cursor: page === 1 ? "not-allowed" : "pointer" }}>Prev</button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => setPage(i + 1)} style={{ ...s.pageBtn, background: page === i + 1 ? "#2563EB" : "#fff", color: page === i + 1 ? "#fff" : "#374151" }}>{i + 1}</button>
            ))}
            <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} style={{ ...s.pageBtn, opacity: page === totalPages ? 0.4 : 1, cursor: page === totalPages ? "not-allowed" : "pointer" }}>Next</button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

const s: Record<string, React.CSSProperties> = {
  postBtn: { display: "inline-flex", alignItems: "center", gap: 6, background: "#2563EB", color: "#fff", padding: "10px 20px", borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: "none", cursor: "pointer" },
  card: { background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: "20px 24px" },
  table: { width: "100%", borderCollapse: "collapse" as const },
  th: { textAlign: "left" as const, padding: "10px 12px", fontSize: 11, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase" as const, letterSpacing: 0.5, borderBottom: "1px solid #F3F4F6" },
  td: { padding: "12px 12px", fontSize: 13, color: "#374151", borderBottom: "1px solid #F9FAFB" },
  badge: { display: "inline-block", padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600 },
  detailLabel: { fontSize: 10, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase" as const, letterSpacing: 0.5, marginBottom: 2 },
  detailValue: { fontSize: 13, color: "#374151", fontWeight: 500 },
  pageBtn: { padding: "6px 12px", borderRadius: 6, border: "1px solid #E5E7EB", background: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", color: "#374151" },
};
