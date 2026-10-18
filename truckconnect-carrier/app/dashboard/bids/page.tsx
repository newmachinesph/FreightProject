"use client";
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  MapPin, Clock, Truck, CheckCircle, XCircle, AlertCircle, Timer, ChevronDown, ChevronUp, CheckSquare, Square, X, Ban,
} from "lucide-react";
import { bids, loads } from "@/lib/mock-data";

const statusFilters = ["All", "Pending", "Accepted", "Rejected", "Expired"] as const;

const statusConfig: Record<string, { bg: string; color: string; borderColor: string; icon: typeof Clock; label: string }> = {
  pending: { bg: "#FEF3C7", color: "#D97706", borderColor: "#FDE68A", icon: Timer, label: "Pending" },
  accepted: { bg: "#DCFCE7", color: "#16A34A", borderColor: "#BBF7D0", icon: CheckCircle, label: "Accepted" },
  rejected: { bg: "#FEE2E2", color: "#DC2626", borderColor: "#FECACA", icon: XCircle, label: "Rejected" },
  expired: { bg: "#F3F4F6", color: "#6B7280", borderColor: "#E5E7EB", icon: AlertCircle, label: "Expired" },
};

/** Calculate countdown for pending bids */
function getCountdown(loadId: string): string | null {
  const load = loads.find((l) => l.id === loadId);
  if (!load) return null;
  const now = new Date("2026-03-20T10:00:00");
  const deadline = new Date(load.bidDeadline + "T23:59:59");
  const diffMs = deadline.getTime() - now.getTime();
  if (diffMs <= 0) return "Deadline passed";
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  if (hours > 24) return `${Math.ceil(hours / 24)}d ${hours % 24}h left`;
  if (hours > 0) return `${hours}h ${minutes}m left`;
  return `${minutes}m left`;
}

export default function BidsPage() {
  const [filter, setFilter] = useState("All");
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    pending: true, accepted: true, rejected: false, expired: false,
  });
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filtered = bids.filter((b) => filter === "All" || b.status === filter.toLowerCase());

  // Group bids by status
  const grouped: Record<string, typeof bids> = { pending: [], accepted: [], rejected: [], expired: [] };
  filtered.forEach((b) => {
    if (grouped[b.status]) grouped[b.status].push(b);
  });

  const pendingBids = bids.filter((b) => b.status === "pending");
  const allPendingSelected = pendingBids.length > 0 && pendingBids.every((b) => selectedIds.has(b.id));
  const someSelected = selectedIds.size > 0;

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSelectAllPending = () => {
    if (allPendingSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        pendingBids.forEach((b) => next.delete(b.id));
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        pendingBids.forEach((b) => next.add(b.id));
        return next;
      });
    }
  };

  const clearSelection = () => setSelectedIds(new Set());

  const toggleSection = (status: string) => {
    setExpandedSections((prev) => ({ ...prev, [status]: !prev[status] }));
  };

  // Count summary
  const counts = {
    pending: bids.filter((b) => b.status === "pending").length,
    accepted: bids.filter((b) => b.status === "accepted").length,
    rejected: bids.filter((b) => b.status === "rejected").length,
    expired: bids.filter((b) => b.status === "expired").length,
  };

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827", margin: 0 }}>My Bids</h1>
        <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>
          {bids.length} total bids &middot; {counts.pending} pending &middot; {counts.accepted} accepted
        </p>
      </div>

      {/* Status Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
        {(["pending", "accepted", "rejected", "expired"] as const).map((status) => {
          const cfg = statusConfig[status];
          const Icon = cfg.icon;
          const count = counts[status];
          const isActive = filter === status.charAt(0).toUpperCase() + status.slice(1);
          return (
            <button
              key={status}
              onClick={() => setFilter(isActive ? "All" : status.charAt(0).toUpperCase() + status.slice(1))}
              style={{
                display: "flex", alignItems: "center", gap: 12, padding: "14px 16px",
                borderRadius: 10, border: `1.5px solid ${isActive ? cfg.color : cfg.borderColor}`,
                background: isActive ? cfg.bg : "#FFFFFF", cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: 8, background: cfg.bg,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon size={18} color={cfg.color} />
              </div>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#111827" }}>{count}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: cfg.color, textTransform: "capitalize" }}>{cfg.label}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {statusFilters.map((f) => {
          const count = f === "All" ? bids.length : bids.filter((b) => b.status === f.toLowerCase()).length;
          return (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: "8px 18px", borderRadius: 8, border: "1px solid",
              borderColor: filter === f ? "#2563EB" : "#E5E7EB",
              background: filter === f ? "#EFF6FF" : "#FFFFFF",
              color: filter === f ? "#2563EB" : "#4B5563",
              fontSize: 13, fontWeight: 600, cursor: "pointer",
            }}>
              {f} ({count})
            </button>
          );
        })}
      </div>

      {/* Bulk Action Toolbar */}
      {someSelected && (
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "10px 16px", marginBottom: 12,
          background: "#FEF3C7", border: "1px solid #FDE68A", borderRadius: 10,
        }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: 13, fontWeight: 700, color: "#D97706",
          }}>
            <CheckSquare size={16} /> {selectedIds.size} selected
          </span>
          <div style={{ width: 1, height: 20, background: "#FDE68A" }} />
          <button
            onClick={() => { alert(`Withdrawing ${selectedIds.size} bid(s): ${[...selectedIds].join(", ")}`); clearSelection(); }}
            style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              padding: "6px 14px", borderRadius: 6, border: "1px solid #FCA5A5",
              background: "#FEF2F2", color: "#DC2626", fontSize: 12, fontWeight: 600, cursor: "pointer",
            }}
          >
            <Ban size={13} /> Withdraw Selected Bids
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

      {/* Grouped Bids */}
      {filter === "All" ? (
        // Show grouped sections
        Object.entries(grouped).map(([status, statusBids]) => {
          if (statusBids.length === 0) return null;
          const cfg = statusConfig[status];
          const Icon = cfg.icon;
          const isExpanded = expandedSections[status];
          const isPending = status === "pending";

          return (
            <div key={status} style={{ marginBottom: 16 }}>
              {/* Section header */}
              <button
                onClick={() => toggleSection(status)}
                style={{
                  display: "flex", alignItems: "center", gap: 8, width: "100%",
                  padding: "10px 16px", borderRadius: "10px 10px" + (isExpanded ? " 0 0" : " 10px 10px"),
                  border: `1px solid ${cfg.borderColor}`,
                  background: cfg.bg, cursor: "pointer",
                  borderBottom: isExpanded ? `1px solid ${cfg.borderColor}` : `1px solid ${cfg.borderColor}`,
                }}
              >
                <Icon size={16} color={cfg.color} />
                <span style={{ fontSize: 14, fontWeight: 700, color: cfg.color, textTransform: "capitalize" }}>
                  {cfg.label}
                </span>
                <span style={{ fontSize: 12, fontWeight: 600, color: cfg.color, background: "#FFFFFF", padding: "1px 8px", borderRadius: 10 }}>
                  {statusBids.length}
                </span>
                <div style={{ marginLeft: "auto" }}>
                  {isExpanded ? <ChevronUp size={14} color={cfg.color} /> : <ChevronDown size={14} color={cfg.color} />}
                </div>
              </button>

              {/* Section content */}
              {isExpanded && (
                <div style={{ background: "#FFFFFF", border: `1px solid ${cfg.borderColor}`, borderTop: "none", borderRadius: "0 0 10px 10px", overflow: "hidden" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
                        {isPending && (
                          <th style={{ ...th, width: 40, textAlign: "center" }}>
                            <div onClick={(e) => { e.stopPropagation(); toggleSelectAllPending(); }} style={{ cursor: "pointer", display: "inline-flex" }}>
                              {allPendingSelected ? <CheckSquare size={15} color="#D97706" /> : <Square size={15} color="#9CA3AF" />}
                            </div>
                          </th>
                        )}
                        {["Bid ID", "Load Route", "Vehicle", "Offered Rate", isPending ? "Countdown" : "Pickup", "Submitted", ""].map((h) => (
                          <th key={h} style={th}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {statusBids.map((bid) => (
                        <BidRow key={bid.id} bid={bid} showCountdown={isPending} showCheckbox={isPending} isSelected={selectedIds.has(bid.id)} onToggle={toggleSelect} />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })
      ) : (
        // Show flat table for single status filter
        <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 12, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
                {filter === "Pending" && (
                  <th style={{ ...th, width: 40, textAlign: "center" }}>
                    <div onClick={toggleSelectAllPending} style={{ cursor: "pointer", display: "inline-flex" }}>
                      {allPendingSelected ? <CheckSquare size={15} color="#D97706" /> : <Square size={15} color="#9CA3AF" />}
                    </div>
                  </th>
                )}
                {["Bid ID", "Load Route", "Vehicle", "Offered Rate", filter === "Pending" ? "Countdown" : "Proposed Pickup", "Status", "Submitted", ""].map((h) => (
                  <th key={h} style={th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((bid) => {
                const ss = statusConfig[bid.status];
                const Icon = ss.icon;
                const countdown = bid.status === "pending" ? getCountdown(bid.loadId) : null;
                const isPending = bid.status === "pending";

                return (
                  <tr key={bid.id} style={{ borderBottom: "1px solid #F3F4F6", background: selectedIds.has(bid.id) ? "#FEF3C7" : undefined }}>
                    {isPending && (
                      <td style={{ ...td, textAlign: "center", width: 40 }} onClick={() => toggleSelect(bid.id)}>
                        <div style={{ cursor: "pointer", display: "inline-flex" }}>
                          {selectedIds.has(bid.id) ? <CheckSquare size={15} color="#D97706" /> : <Square size={15} color="#D1D5DB" />}
                        </div>
                      </td>
                    )}
                    <td style={td}>
                      <span style={{ fontWeight: 600, color: "#111827", fontFamily: "monospace", fontSize: 12 }}>{bid.id}</span>
                    </td>
                    <td style={td}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <MapPin size={12} color="#2563EB" />
                        <span style={{ fontWeight: 600, color: "#111827" }}>{bid.loadRoute}</span>
                      </div>
                    </td>
                    <td style={td}>
                      <div>
                        <div style={{ fontWeight: 500, color: "#111827" }}>{bid.vehiclePlate}</div>
                        <div style={{ fontSize: 11, color: "#9CA3AF" }}>{bid.vehicleType}</div>
                      </div>
                    </td>
                    <td style={td}>
                      <span style={{ fontWeight: 700, color: "#2563EB", fontSize: 14 }}>{"\u20B1"}{bid.offeredRate.toLocaleString()}</span>
                    </td>
                    <td style={td}>
                      {countdown ? (
                        <div style={{
                          display: "inline-flex", alignItems: "center", gap: 4,
                          padding: "3px 10px", borderRadius: 6, fontSize: 12, fontWeight: 700,
                          background: countdown.includes("passed") ? "#FEE2E2" : countdown.includes("m left") || countdown.includes("h ") ? "#FEF3C7" : "#EFF6FF",
                          color: countdown.includes("passed") ? "#DC2626" : countdown.includes("m left") || (countdown.includes("h ") && !countdown.includes("d")) ? "#D97706" : "#2563EB",
                        }}>
                          <Timer size={11} /> {countdown}
                        </div>
                      ) : (
                        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#6B7280" }}>
                          <Clock size={11} /> {bid.proposedPickup}
                        </div>
                      )}
                    </td>
                    <td style={td}>
                      <span style={{
                        padding: "3px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600,
                        background: ss.bg, color: ss.color, textTransform: "capitalize",
                        display: "inline-flex", alignItems: "center", gap: 4,
                      }}>
                        <Icon size={11} /> {bid.status}
                      </span>
                    </td>
                    <td style={td}>
                      <span style={{ fontSize: 12, color: "#9CA3AF" }}>{bid.submittedDate}</span>
                    </td>
                    <td style={td}>
                      <a href={`/dashboard/loads/${bid.loadId}`} style={{
                        fontSize: 12, color: "#2563EB", fontWeight: 600, textDecoration: "none",
                      }}>
                        View Load
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: 40, color: "#9CA3AF" }}>No bids match this filter.</div>
      )}
    </DashboardLayout>
  );
}

function BidRow({ bid, showCountdown, showCheckbox, isSelected, onToggle }: { bid: typeof bids[0]; showCountdown: boolean; showCheckbox?: boolean; isSelected?: boolean; onToggle?: (id: string) => void }) {
  const countdown = showCountdown ? getCountdown(bid.loadId) : null;

  return (
    <tr style={{ borderBottom: "1px solid #F3F4F6", background: isSelected ? "#FEF3C7" : undefined }}>
      {showCheckbox && (
        <td style={{ ...td, textAlign: "center", width: 40 }} onClick={() => onToggle?.(bid.id)}>
          <div style={{ cursor: "pointer", display: "inline-flex" }}>
            {isSelected ? <CheckSquare size={15} color="#D97706" /> : <Square size={15} color="#D1D5DB" />}
          </div>
        </td>
      )}
      <td style={td}>
        <span style={{ fontWeight: 600, color: "#111827", fontFamily: "monospace", fontSize: 12 }}>{bid.id}</span>
      </td>
      <td style={td}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <MapPin size={12} color="#2563EB" />
          <span style={{ fontWeight: 600, color: "#111827" }}>{bid.loadRoute}</span>
        </div>
      </td>
      <td style={td}>
        <div>
          <div style={{ fontWeight: 500, color: "#111827" }}>{bid.vehiclePlate}</div>
          <div style={{ fontSize: 11, color: "#9CA3AF" }}>{bid.vehicleType}</div>
        </div>
      </td>
      <td style={td}>
        <span style={{ fontWeight: 700, color: "#2563EB", fontSize: 14 }}>{"\u20B1"}{bid.offeredRate.toLocaleString()}</span>
      </td>
      <td style={td}>
        {countdown ? (
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            padding: "3px 10px", borderRadius: 6, fontSize: 12, fontWeight: 700,
            background: countdown.includes("passed") ? "#FEE2E2" : countdown.includes("m left") || (countdown.includes("h ") && !countdown.includes("d")) ? "#FEF3C7" : "#EFF6FF",
            color: countdown.includes("passed") ? "#DC2626" : countdown.includes("m left") || (countdown.includes("h ") && !countdown.includes("d")) ? "#D97706" : "#2563EB",
          }}>
            <Timer size={11} /> {countdown}
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#6B7280" }}>
            <Clock size={11} /> {bid.proposedPickup}
          </div>
        )}
      </td>
      <td style={td}>
        <span style={{ fontSize: 12, color: "#9CA3AF" }}>{bid.submittedDate}</span>
      </td>
      <td style={td}>
        <a href={`/dashboard/loads/${bid.loadId}`} style={{
          fontSize: 12, color: "#2563EB", fontWeight: 600, textDecoration: "none",
        }}>
          View Load
        </a>
      </td>
    </tr>
  );
}

const th: React.CSSProperties = {
  textAlign: "left", padding: "12px 14px", fontSize: 11, fontWeight: 600, color: "#6B7280",
  textTransform: "uppercase", letterSpacing: 0.5,
};
const td: React.CSSProperties = { padding: "12px 14px" };
