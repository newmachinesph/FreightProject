"use client";
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { payments, formatPeso, type PaymentStatus, type PaymentMethod } from "@/lib/mock-data";
import {
  MapPin,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Wallet,
  Building2,
  Banknote,
  FileCheck,
  Clock,
  Filter,
  Download,
  TrendingUp,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
} from "lucide-react";
import Link from "next/link";

const statusColor: Record<PaymentStatus, { bg: string; color: string }> = {
  Paid: { bg: "#DCFCE7", color: "#166534" },
  Pending: { bg: "#FEF3C7", color: "#92400E" },
  Processing: { bg: "#E0E7FF", color: "#3730A3" },
  Overdue: { bg: "#FEE2E2", color: "#991B1B" },
};

const methodStyle: Record<PaymentMethod, { bg: string; color: string; icon: typeof Wallet; logoText?: string }> = {
  GCash: { bg: "#DBEAFE", color: "#1E40AF", icon: Wallet, logoText: "G" },
  "Bank Transfer": { bg: "#E0E7FF", color: "#3730A3", icon: Building2 },
  COD: { bg: "#FEF3C7", color: "#92400E", icon: Banknote },
  Check: { bg: "#F3F4F6", color: "#374151", icon: FileCheck },
};

const totalPaid = payments.filter((p) => p.status === "Paid").reduce((sum, p) => sum + p.amount, 0);
const totalPending = payments.filter((p) => p.status === "Pending" || p.status === "Processing").reduce((sum, p) => sum + p.amount, 0);
const totalOverdue = payments.filter((p) => p.status === "Overdue").reduce((sum, p) => sum + p.amount, 0);
const totalAll = payments.reduce((sum, p) => sum + p.amount, 0);

// Monthly spending data (mock last 6 months)
const monthlySpending = [
  { month: "Oct", amount: 185000, label: "Oct 2025" },
  { month: "Nov", amount: 245000, label: "Nov 2025" },
  { month: "Dec", amount: 312000, label: "Dec 2025" },
  { month: "Jan", amount: 198000, label: "Jan 2026" },
  { month: "Feb", amount: 420000, label: "Feb 2026" },
  { month: "Mar", amount: totalAll, label: "Mar 2026" },
];
const maxSpend = Math.max(...monthlySpending.map((m) => m.amount));

const filterTabs: { label: string; value: PaymentStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Paid", value: "Paid" },
  { label: "Pending", value: "Pending" },
  { label: "Processing", value: "Processing" },
  { label: "Overdue", value: "Overdue" },
];

export default function PaymentsPage() {
  const [activeFilter, setActiveFilter] = useState<PaymentStatus | "all">("all");
  const filtered = activeFilter === "all" ? payments : payments.filter((p) => p.status === activeFilter);

  return (
    <DashboardLayout activeNav="/dashboard/payments">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827", margin: 0 }}>Payments</h1>
        <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>Invoice and payment tracking for your loads</p>
      </div>

      {/* Summary cards - enhanced with outstanding/paid MTD/overdue focus */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Total Outstanding", value: formatPeso(totalPending), subtitle: `${payments.filter((p) => p.status === "Pending" || p.status === "Processing").length} invoices`, icon: Clock, color: "#D97706", bg: "#FFFBEB", border: "#FDE68A" },
          { label: "Total Paid (MTD)", value: formatPeso(totalPaid), subtitle: `${payments.filter((p) => p.status === "Paid").length} invoices`, icon: CheckCircle2, color: "#059669", bg: "#ECFDF5", border: "#BBF7D0" },
          { label: "Overdue", value: formatPeso(totalOverdue), subtitle: totalOverdue > 0 ? "Action required" : "None", icon: AlertTriangle, color: "#DC2626", bg: totalOverdue > 0 ? "#FEF2F2" : "#F9FAFB", border: totalOverdue > 0 ? "#FECACA" : "#E5E7EB" },
          { label: "Total Spend", value: formatPeso(totalAll), subtitle: `${payments.length} transactions`, icon: DollarSign, color: "#2563EB", bg: "#EFF6FF", border: "#BFDBFE" },
        ].map((card) => {
          const Icon = card.icon;
          const isOverdue = card.label === "Overdue" && totalOverdue > 0;
          return (
            <div key={card.label} style={{
              ...s.summaryCard,
              borderColor: card.border,
              background: card.bg,
              ...(isOverdue ? { animation: "none", boxShadow: "0 0 0 2px rgba(220,38,38,0.1)" } : {}),
            }}>
              <div style={{ ...s.summaryIcon, background: isOverdue ? "#FEE2E2" : "#fff", color: card.color }}>
                <Icon size={22} />
              </div>
              <div>
                <div style={s.summaryLabel}>{card.label}</div>
                <div style={{ ...s.summaryValue, color: isOverdue ? "#DC2626" : "#111827" }}>{card.value}</div>
                <div style={{ fontSize: 11, color: isOverdue ? "#DC2626" : "#9CA3AF", marginTop: 2, fontWeight: isOverdue ? 600 : 400 }}>{card.subtitle}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Monthly Spending Chart */}
      <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: "20px 24px", marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <BarChart3 size={18} color="#2563EB" />
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: 0 }}>Monthly Spending (Last 6 Months)</h3>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#059669", fontWeight: 600 }}>
            <ArrowUpRight size={14} />
            <span>+{Math.round(((monthlySpending[5].amount - monthlySpending[4].amount) / monthlySpending[4].amount) * 100)}% vs last month</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 160, padding: "0 8px" }}>
          {monthlySpending.map((m, idx) => {
            const heightPct = (m.amount / maxSpend) * 100;
            const isCurrentMonth = idx === monthlySpending.length - 1;
            return (
              <div key={m.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: "#374151" }}>{formatPeso(m.amount)}</span>
                <div style={{
                  width: "100%", maxWidth: 56, borderRadius: "6px 6px 0 0",
                  height: `${heightPct}%`, minHeight: 8,
                  background: isCurrentMonth
                    ? "linear-gradient(180deg, #2563EB 0%, #3B82F6 100%)"
                    : "linear-gradient(180deg, #93C5FD 0%, #BFDBFE 100%)",
                  transition: "height 0.3s ease",
                  position: "relative",
                }}>
                  {isCurrentMonth && (
                    <div style={{
                      position: "absolute", top: -6, left: "50%", transform: "translateX(-50%)",
                      width: 8, height: 8, borderRadius: "50%", background: "#2563EB",
                      border: "2px solid #fff", boxShadow: "0 0 0 2px #2563EB",
                    }} />
                  )}
                </div>
                <span style={{
                  fontSize: 11, fontWeight: isCurrentMonth ? 700 : 500,
                  color: isCurrentMonth ? "#2563EB" : "#6B7280",
                }}>
                  {m.month}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment method breakdown with icons */}
      <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: "16px 24px", marginBottom: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111827", margin: "0 0 12px 0" }}>Payment Method Breakdown - March 2026</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {(["GCash", "Bank Transfer", "COD", "Check"] as PaymentMethod[]).map((method) => {
            const ms = methodStyle[method];
            const MethodIcon = ms.icon;
            const methodTotal = payments.filter((p) => p.paymentMethod === method).reduce((s, p) => s + p.amount, 0);
            const methodCount = payments.filter((p) => p.paymentMethod === method).length;
            return (
              <div key={method} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: ms.bg + "40", borderRadius: 10, border: `1px solid ${ms.bg}` }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10, background: ms.bg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  position: "relative",
                }}>
                  {method === "GCash" ? (
                    <span style={{ fontSize: 18, fontWeight: 900, color: ms.color, fontFamily: "system-ui" }}>G</span>
                  ) : (
                    <MethodIcon size={20} color={ms.color} />
                  )}
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: ms.color }}>{method}</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#111827" }}>{formatPeso(methodTotal)}</div>
                  <div style={{ fontSize: 10, color: "#9CA3AF" }}>{methodCount} transaction{methodCount !== 1 ? "s" : ""}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
        <Filter size={14} color="#9CA3AF" />
        {filterTabs.map((tab) => {
          const count = tab.value === "all" ? payments.length : payments.filter((p) => p.status === tab.value).length;
          return (
            <button
              key={tab.value}
              onClick={() => setActiveFilter(tab.value)}
              style={{
                padding: "5px 14px", borderRadius: 6, border: "1px solid",
                borderColor: activeFilter === tab.value ? "#2563EB" : "#E5E7EB",
                background: activeFilter === tab.value ? "#EFF6FF" : "#fff",
                color: activeFilter === tab.value ? "#2563EB" : "#6B7280",
                fontSize: 12, fontWeight: 600, cursor: "pointer",
                display: "inline-flex", alignItems: "center", gap: 4,
              }}
            >
              {tab.label}
              <span style={{
                fontSize: 10, padding: "1px 6px", borderRadius: 999,
                background: activeFilter === tab.value ? "#2563EB" : "#F3F4F6",
                color: activeFilter === tab.value ? "#fff" : "#9CA3AF",
                fontWeight: 700,
              }}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Payments table */}
      <div style={s.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: 0 }}>All Invoices</h2>
          <span style={{ fontSize: 12, color: "#6B7280" }}>{filtered.length} invoice{filtered.length !== 1 ? "s" : ""}</span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Transaction ID</th>
                <th style={s.th}>Invoice</th>
                <th style={s.th}>Load (Route)</th>
                <th style={s.th}>Carrier</th>
                <th style={s.th}>Amount</th>
                <th style={s.th}>Method</th>
                <th style={s.th}>Status</th>
                <th style={s.th}>Due Date</th>
                <th style={s.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const sc = statusColor[p.status];
                const ms = methodStyle[p.paymentMethod];
                const MethodIcon = ms.icon;
                const isOverdue = p.status === "Overdue";
                return (
                  <tr key={p.id} style={{
                    background: isOverdue ? "#FFF5F5" : "transparent",
                    borderLeft: isOverdue ? "3px solid #DC2626" : "3px solid transparent",
                  }}>
                    <td style={{ ...s.td, fontWeight: 600, color: "#374151", fontSize: 12, fontFamily: "monospace" }}>{p.id}</td>
                    <td style={{ ...s.td, fontWeight: 600, color: "#2563EB" }}>{p.invoice}</td>
                    <td style={s.td}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <MapPin size={14} color="#9CA3AF" />
                        {p.route}
                      </div>
                      <Link href={`/dashboard/loads/${p.loadId}`} style={{ fontSize: 10, color: "#2563EB", marginTop: 2, display: "block", textDecoration: "none" }}>{p.loadId}</Link>
                    </td>
                    <td style={{ ...s.td, fontWeight: 500 }}>{p.carrier}</td>
                    <td style={{ ...s.td, fontWeight: 700, fontSize: 14, color: isOverdue ? "#DC2626" : "#111827" }}>{formatPeso(p.amount)}</td>
                    <td style={s.td}>
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: 6,
                        background: ms.bg, color: ms.color,
                        padding: "4px 12px", borderRadius: 6, fontSize: 11, fontWeight: 600,
                      }}>
                        {p.paymentMethod === "GCash" ? (
                          <span style={{ fontSize: 13, fontWeight: 900, fontFamily: "system-ui" }}>G</span>
                        ) : (
                          <MethodIcon size={12} />
                        )}
                        {p.paymentMethod}
                      </span>
                    </td>
                    <td style={s.td}>
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: 4,
                        padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600,
                        background: sc.bg, color: sc.color,
                        ...(isOverdue ? { border: "1px solid #FECACA" } : {}),
                      }}>
                        {isOverdue && <AlertTriangle size={10} />}
                        {p.status}
                      </span>
                    </td>
                    <td style={s.td}>
                      <div style={{
                        color: isOverdue ? "#DC2626" : "#6B7280",
                        fontWeight: isOverdue ? 700 : 400, fontSize: 13,
                      }}>
                        {p.dueDate}
                        {isOverdue && (
                          <div style={{ fontSize: 10, color: "#DC2626", marginTop: 2, fontWeight: 600 }}>
                            OVERDUE
                          </div>
                        )}
                      </div>
                      {p.paidDate && (
                        <div style={{ fontSize: 10, color: "#059669", marginTop: 2 }}>Paid: {p.paidDate}</div>
                      )}
                    </td>
                    <td style={s.td}>
                      <button
                        style={{
                          display: "inline-flex", alignItems: "center", gap: 4,
                          padding: "5px 10px", borderRadius: 6,
                          background: "#F9FAFB", border: "1px solid #E5E7EB",
                          color: "#374151", fontSize: 11, fontWeight: 600,
                          cursor: "pointer", whiteSpace: "nowrap" as const,
                        }}
                        title={`Download invoice ${p.invoice}`}
                      >
                        <Download size={12} />
                        Invoice
                      </button>
                    </td>
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
  summaryCard: { display: "flex", alignItems: "center", gap: 14, background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: "18px 20px" },
  summaryIcon: { width: 48, height: 48, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  summaryValue: { fontSize: 22, fontWeight: 800, color: "#111827" },
  summaryLabel: { fontSize: 11, color: "#6B7280", fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: 0.3, marginBottom: 2 },
  breakdownLabel: { fontSize: 11, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase" as const, letterSpacing: 0.5, marginBottom: 2 },
  breakdownValue: { fontSize: 15, fontWeight: 700, color: "#111827" },
  card: { background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: "20px 24px" },
  table: { width: "100%", borderCollapse: "collapse" as const },
  th: { textAlign: "left" as const, padding: "10px 12px", fontSize: 11, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase" as const, letterSpacing: 0.5, borderBottom: "1px solid #F3F4F6", whiteSpace: "nowrap" as const },
  td: { padding: "12px 12px", fontSize: 13, color: "#374151", borderBottom: "1px solid #F9FAFB" },
};
