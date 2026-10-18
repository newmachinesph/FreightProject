"use client";
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import VehicleIcon from "@/components/VehicleIcon";
import { bookings, formatPeso, type BookingStatus } from "@/lib/mock-data";
import { MapPin, Phone, ClipboardList, Filter, Star } from "lucide-react";
import Link from "next/link";

const statusColor: Record<string, { bg: string; color: string; border: string }> = {
  confirmed: { bg: "#DBEAFE", color: "#1E40AF", border: "#93C5FD" },
  picked_up: { bg: "#FEF3C7", color: "#92400E", border: "#FDE68A" },
  in_transit: { bg: "#E0E7FF", color: "#3730A3", border: "#A5B4FC" },
  delivered: { bg: "#DCFCE7", color: "#166534", border: "#86EFAC" },
  cancelled: { bg: "#FEE2E2", color: "#991B1B", border: "#FCA5A5" },
};

const paymentStatusColor: Record<string, { bg: string; color: string; border: string }> = {
  Pending: { bg: "#FEF3C7", color: "#92400E", border: "#FDE68A" },
  Processing: { bg: "#E0E7FF", color: "#3730A3", border: "#A5B4FC" },
  Paid: { bg: "#DCFCE7", color: "#166534", border: "#86EFAC" },
};

const filterTabs: { label: string; value: BookingStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Picked Up", value: "picked_up" },
  { label: "In Transit", value: "in_transit" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

function StarRating({ rating, size = 14, showValue = true }: { rating: number; size?: number; showValue?: boolean }) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.3 && rating - full < 0.8;
  const stars = [];
  for (let i = 0; i < 5; i++) {
    if (i < full) {
      stars.push(<Star key={i} size={size} fill="#F59E0B" color="#F59E0B" />);
    } else if (i === full && hasHalf) {
      stars.push(
        <span key={i} style={{ position: "relative", display: "inline-block", width: size, height: size }}>
          <Star size={size} fill="none" color="#E5E7EB" style={{ position: "absolute", top: 0, left: 0 }} />
          <span style={{ position: "absolute", top: 0, left: 0, width: "50%", overflow: "hidden" }}>
            <Star size={size} fill="#F59E0B" color="#F59E0B" />
          </span>
        </span>
      );
    } else {
      stars.push(<Star key={i} size={size} fill="none" color="#E5E7EB" />);
    }
  }
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
      {stars}
      {showValue && <span style={{ marginLeft: 4, fontSize: size - 2, fontWeight: 600, color: "#374151" }}>{rating.toFixed(1)}</span>}
    </span>
  );
}

export default function BookingsPage() {
  const [activeFilter, setActiveFilter] = useState<BookingStatus | "all">("all");

  const filtered = activeFilter === "all" ? bookings : bookings.filter((b) => b.status === activeFilter);

  return (
    <DashboardLayout activeNav="/dashboard/bookings">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827", margin: 0 }}>Bookings</h1>
        <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>Carrier bookings for your posted loads</p>
      </div>

      {/* Summary stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14, marginBottom: 20 }}>
        {[
          { label: "Confirmed", count: bookings.filter((b) => b.status === "confirmed").length, bg: "#DBEAFE", color: "#1E40AF" },
          { label: "Picked Up", count: bookings.filter((b) => b.status === "picked_up").length, bg: "#FEF3C7", color: "#92400E" },
          { label: "In Transit", count: bookings.filter((b) => b.status === "in_transit").length, bg: "#E0E7FF", color: "#3730A3" },
          { label: "Delivered", count: bookings.filter((b) => b.status === "delivered").length, bg: "#DCFCE7", color: "#166534" },
          { label: "Cancelled", count: bookings.filter((b) => b.status === "cancelled").length, bg: "#FEE2E2", color: "#991B1B" },
        ].map((stat) => (
          <div key={stat.label} style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: stat.bg, display: "flex", alignItems: "center", justifyContent: "center", color: stat.color, fontWeight: 800, fontSize: 16 }}>
              {stat.count}
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
        <Filter size={14} color="#9CA3AF" />
        {filterTabs.map((tab) => {
          const sc = tab.value !== "all" ? statusColor[tab.value] : null;
          return (
            <button
              key={tab.value}
              onClick={() => setActiveFilter(tab.value)}
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
      </div>

      <div style={s.card}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <ClipboardList size={16} color="#9CA3AF" />
          <span style={{ fontSize: 12, color: "#9CA3AF" }}>Showing {filtered.length} bookings</span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Booking ID</th>
                <th style={s.th}>Load (Route)</th>
                <th style={s.th}>Carrier</th>
                <th style={s.th}>Vehicle</th>
                <th style={s.th}>Plate No.</th>
                <th style={s.th}>Agreed Rate</th>
                <th style={s.th}>Payment</th>
                <th style={s.th}>Status</th>
                <th style={s.th}>Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((bk) => {
                const sc = statusColor[bk.status] || statusColor.confirmed;
                const ps = paymentStatusColor[bk.paymentStatus] || paymentStatusColor.Pending;
                return (
                  <tr key={bk.id}>
                    <td style={{ ...s.td, fontWeight: 600, color: "#2563EB", fontSize: 12 }}>{bk.id}</td>
                    <td style={s.td}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <MapPin size={14} color="#9CA3AF" />
                        <span>{bk.route}</span>
                      </div>
                      <Link href={`/dashboard/loads/${bk.loadId}`} style={{ fontSize: 10, color: "#2563EB", marginTop: 2, display: "block", textDecoration: "none" }}>{bk.loadId}</Link>
                    </td>
                    <td style={s.td}>
                      <div style={{ fontWeight: 600, color: "#111827" }}>{bk.carrier}</div>
                      <StarRating rating={bk.carrierRating} size={11} />
                      <div style={{ fontSize: 11, color: "#9CA3AF", display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                        <Phone size={10} /> {bk.carrierContact}
                      </div>
                    </td>
                    <td style={s.td}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <VehicleIcon type={bk.vehicle} size={28} color="#6B7280" />
                        <span style={{ fontSize: 12 }}>{bk.vehicle}</span>
                      </div>
                    </td>
                    <td style={{ ...s.td, fontFamily: "monospace", fontSize: 12, fontWeight: 600 }}>{bk.plateNo}</td>
                    <td style={{ ...s.td, fontWeight: 700 }}>{formatPeso(bk.agreedRate)}</td>
                    <td style={s.td}>
                      <span style={{
                        ...s.badge,
                        background: ps.bg, color: ps.color,
                        border: `1px solid ${ps.border}`,
                      }}>
                        {bk.paymentStatus}
                      </span>
                    </td>
                    <td style={s.td}>
                      <span style={{
                        ...s.badge,
                        background: sc.bg, color: sc.color,
                        border: `1px solid ${sc.border}`,
                      }}>
                        {bk.status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                      </span>
                    </td>
                    <td style={{ ...s.td, color: "#9CA3AF", fontSize: 12 }}>{bk.date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}

const s: Record<string, React.CSSProperties> = {
  card: { background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: "20px 24px" },
  table: { width: "100%", borderCollapse: "collapse" as const },
  th: { textAlign: "left" as const, padding: "10px 12px", fontSize: 11, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase" as const, letterSpacing: 0.5, borderBottom: "1px solid #F3F4F6", whiteSpace: "nowrap" as const },
  td: { padding: "12px 12px", fontSize: 13, color: "#374151", borderBottom: "1px solid #F9FAFB" },
  badge: { display: "inline-block", padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" as const },
};
