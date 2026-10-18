"use client";
import { useState } from "react";
import {
  AlertTriangle, Bell, Thermometer, Package, Truck, ShieldCheck, Server,
  CheckCircle, Clock, X,
} from "lucide-react";

const ACCENT = "#7C3AED";

type Severity = "CRITICAL" | "WARNING" | "INFO";
type Category = "Inventory" | "Temperature" | "Shipments" | "Compliance" | "System";

interface Alert {
  id: number;
  message: string;
  timeAgo: string;
  category: Category;
  severity: Severity;
  acknowledged: boolean;
}

const initialAlerts: Alert[] = [
  { id: 1, message: "LOW STOCK: Frozen Tiger Prawns (CLD-2002) — only 8 units remaining", timeAgo: "5 min ago", category: "Inventory", severity: "CRITICAL", acknowledged: false },
  { id: 2, message: "EXPIRING: Chilled Chicken 1.2kg expires in 5 days", timeAgo: "30 min ago", category: "Inventory", severity: "WARNING", acknowledged: false },
  { id: 3, message: "TEMP ALERT: Zone C cold storage at -16°C (target: -18°C)", timeAgo: "1 hour ago", category: "Temperature", severity: "WARNING", acknowledged: false },
  { id: 4, message: "Inbound INB-5001 arriving today from Nueva Ecija", timeAgo: "2 hours ago", category: "Shipments", severity: "INFO", acknowledged: false },
  { id: 5, message: "Outbound OUT-6001 picking incomplete — 20/40 items", timeAgo: "2 hours ago", category: "Shipments", severity: "WARNING", acknowledged: false },
  { id: 6, message: "Zone D hazmat inspection due in 7 days", timeAgo: "3 hours ago", category: "Compliance", severity: "WARNING", acknowledged: false },
  { id: 7, message: "FDA License renewal in 90 days", timeAgo: "4 hours ago", category: "Compliance", severity: "INFO", acknowledged: false },
  { id: 8, message: "Inbound INB-5003 delayed — new ETA tomorrow", timeAgo: "5 hours ago", category: "Shipments", severity: "INFO", acknowledged: false },
  { id: 9, message: "Storage capacity at 80% — Zone A", timeAgo: "6 hours ago", category: "Inventory", severity: "WARNING", acknowledged: false },
  { id: 10, message: "EXPIRED: Magnolia Ice Cream batch MIC-2025-B expired", timeAgo: "1 day ago", category: "Inventory", severity: "CRITICAL", acknowledged: false },
  { id: 11, message: "Outbound OUT-6003 dispatched via Ninja Van", timeAgo: "1 day ago", category: "Shipments", severity: "INFO", acknowledged: false },
  { id: 12, message: "Fire suppression system maintenance scheduled", timeAgo: "2 days ago", category: "System", severity: "INFO", acknowledged: false },
  { id: 13, message: "New SKU registered: Samsung Galaxy Tab A9", timeAgo: "3 days ago", category: "System", severity: "INFO", acknowledged: false },
  { id: 14, message: "PEZA accreditation renewal due in 120 days", timeAgo: "4 days ago", category: "Compliance", severity: "INFO", acknowledged: false },
  { id: 15, message: "Monthly inventory report generated", timeAgo: "5 days ago", category: "System", severity: "INFO", acknowledged: false },
];

const tabs: Array<{ label: string; value: Category | "All" }> = [
  { label: "All", value: "All" },
  { label: "Inventory", value: "Inventory" },
  { label: "Temperature", value: "Temperature" },
  { label: "Shipments", value: "Shipments" },
  { label: "Compliance", value: "Compliance" },
  { label: "System", value: "System" },
];

const severityConfig: Record<Severity, { bg: string; color: string; border: string }> = {
  CRITICAL: { bg: "#FEF2F2", color: "#DC2626", border: "#FECACA" },
  WARNING: { bg: "#FFFBEB", color: "#D97706", border: "#FDE68A" },
  INFO: { bg: "#EFF6FF", color: "#2563EB", border: "#BFDBFE" },
};

const categoryIcon: Record<Category, typeof Package> = {
  Inventory: Package,
  Temperature: Thermometer,
  Shipments: Truck,
  Compliance: ShieldCheck,
  System: Server,
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [activeTab, setActiveTab] = useState<Category | "All">("All");

  const filtered = activeTab === "All" ? alerts : alerts.filter((a) => a.category === activeTab);

  const criticalCount = alerts.filter((a) => a.severity === "CRITICAL" && !a.acknowledged).length;
  const warningCount = alerts.filter((a) => a.severity === "WARNING" && !a.acknowledged).length;
  const infoCount = alerts.filter((a) => a.severity === "INFO").length;

  const handleAcknowledge = (id: number) => {
    setAlerts(alerts.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)));
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <Bell size={22} color={ACCENT} />
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0 }}>
            Alerts &amp; Notifications
          </h1>
        </div>
        <p style={{ fontSize: 14, color: "#6B7280", margin: 0 }}>
          Warehouse operational alerts and notifications
        </p>
      </div>

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Critical", count: criticalCount, bg: "#FEF2F2", color: "#DC2626", icon: AlertTriangle },
          { label: "Warnings", count: warningCount, bg: "#FFFBEB", color: "#D97706", icon: Clock },
          { label: "Informational", count: infoCount, bg: "#EFF6FF", color: "#2563EB", icon: Bell },
          { label: "Total Alerts", count: alerts.length, bg: "#F5F3FF", color: ACCENT, icon: Bell },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              style={{
                background: "#FFFFFF",
                borderRadius: 12,
                padding: "18px 20px",
                border: "1px solid #E5E7EB",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: 0.5 }}>
                  {card.label}
                </span>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: card.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={16} color={card.color} />
                </div>
              </div>
              <div style={{ fontSize: 28, fontWeight: 700, color: card.color }}>{card.count}</div>
            </div>
          );
        })}
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
        {tabs.map((tab) => {
          const active = activeTab === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              style={{
                padding: "7px 16px",
                borderRadius: 20,
                border: "1px solid",
                borderColor: active ? ACCENT : "#E5E7EB",
                background: active ? ACCENT : "#FFFFFF",
                color: active ? "#FFFFFF" : "#374151",
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
                transition: "all .15s",
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Alert list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: 40, color: "#9CA3AF", fontSize: 14 }}>
            No alerts in this category.
          </div>
        )}
        {filtered.map((alert) => {
          const sev = severityConfig[alert.severity];
          const CatIcon = categoryIcon[alert.category];
          return (
            <div
              key={alert.id}
              style={{
                background: alert.acknowledged ? "#F9FAFB" : "#FFFFFF",
                borderRadius: 12,
                padding: "16px 20px",
                border: `1px solid ${alert.acknowledged ? "#E5E7EB" : sev.border}`,
                borderLeft: `4px solid ${sev.color}`,
                display: "flex",
                alignItems: "flex-start",
                gap: 14,
                opacity: alert.acknowledged ? 0.65 : 1,
                transition: "opacity .2s",
              }}
            >
              {/* Category icon */}
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: sev.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginTop: 2,
                }}
              >
                <CatIcon size={18} color={sev.color} />
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: "#111827", marginBottom: 4, lineHeight: 1.4 }}>
                  {alert.message}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  {/* Severity badge */}
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: sev.color,
                      background: sev.bg,
                      padding: "2px 8px",
                      borderRadius: 10,
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                    }}
                  >
                    {alert.severity}
                  </span>
                  {/* Category badge */}
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      color: "#6B7280",
                      background: "#F3F4F6",
                      padding: "2px 8px",
                      borderRadius: 10,
                    }}
                  >
                    {alert.category}
                  </span>
                  {/* Time */}
                  <span style={{ fontSize: 12, color: "#9CA3AF" }}>
                    {alert.timeAgo}
                  </span>
                  {alert.acknowledged && (
                    <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#10B981", fontWeight: 500 }}>
                      <CheckCircle size={12} /> Acknowledged
                    </span>
                  )}
                </div>
              </div>

              {/* Acknowledge button */}
              {(alert.severity === "CRITICAL" || alert.severity === "WARNING") && !alert.acknowledged && (
                <button
                  onClick={() => handleAcknowledge(alert.id)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 8,
                    border: "1px solid #E5E7EB",
                    background: "#FFFFFF",
                    color: "#374151",
                    fontSize: 12,
                    fontWeight: 500,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    transition: "background .15s",
                    flexShrink: 0,
                  }}
                >
                  Acknowledge
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
