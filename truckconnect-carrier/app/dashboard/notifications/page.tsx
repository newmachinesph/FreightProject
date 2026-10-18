"use client";
import { useState, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Bell, Package, Navigation, Truck, DollarSign, Monitor, Check, Filter, ExternalLink, Settings, Inbox, AlertCircle } from "lucide-react";
import Link from "next/link";

type NotifCategory = "All" | "Loads" | "Trips" | "Fleet" | "Payments" | "System";
type Priority = "critical" | "important" | "normal";

interface Notification {
  id: number;
  message: string;
  time: string;
  category: Exclude<NotifCategory, "All">;
  read: boolean;
  priority: Priority;
  groupKey?: string;
  actionLabel?: string;
  actionHref?: string;
}

const priorityDot: Record<Priority, string> = {
  critical: "#DC2626",
  important: "#D97706",
  normal: "#9CA3AF",
};

const initialNotifications: Notification[] = [
  { id: 1, message: "New load matching your fleet: Manila \u2192 Cebu, \u20B1145,000", time: "15 min ago", category: "Loads", read: false, priority: "important", actionLabel: "Bid Now", actionHref: "/dashboard/loads/L1" },
  { id: 2, message: "Your bid on Load #L1 was accepted!", time: "1 hour ago", category: "Loads", read: false, priority: "important", actionLabel: "View Load", actionHref: "/dashboard/loads/L1" },
  { id: 3, message: "Trip TRP-2026-003 picked up at QC", time: "2 hours ago", category: "Trips", read: false, priority: "normal", actionLabel: "View Trip", actionHref: "/dashboard/trips" },
  { id: 4, message: "Payment received: \u20B128,000 for Trip TRP-2026-004", time: "3 hours ago", category: "Payments", read: false, priority: "normal", actionLabel: "View Payment", actionHref: "/dashboard/payments" },
  { id: 5, message: "Vehicle DEF 9012 OR/CR expires in 30 days", time: "4 hours ago", category: "Fleet", read: false, priority: "critical", groupKey: "doc-expiry", actionLabel: "Renew Document", actionHref: "/dashboard/fleet" },
  { id: 6, message: "Driver Tito Bert drug test expired", time: "5 hours ago", category: "Fleet", read: true, priority: "critical", groupKey: "doc-expiry", actionLabel: "Renew Document", actionHref: "/dashboard/fleet" },
  { id: 7, message: "Load #L7 deadline in 12 hours \u2014 no bids yet", time: "6 hours ago", category: "Loads", read: true, priority: "important", actionLabel: "Bid Now", actionHref: "/dashboard/loads/L7" },
  { id: 8, message: "Trip TRP-2026-001 arrived at Batangas Port", time: "8 hours ago", category: "Trips", read: true, priority: "normal", actionLabel: "View Trip", actionHref: "/dashboard/trips" },
  { id: 9, message: "New shipper review: 4.5\u2605 from Manila FMCG Corp", time: "1 day ago", category: "System", read: true, priority: "normal" },
  { id: 10, message: "LTFRB franchise renewal due in 45 days", time: "2 days ago", category: "Fleet", read: true, priority: "critical", groupKey: "doc-expiry", actionLabel: "Renew Document", actionHref: "/dashboard/fleet" },
  { id: 11, message: "Monthly earnings report: \u20B1346,000", time: "3 days ago", category: "Payments", read: true, priority: "normal", actionLabel: "View Report", actionHref: "/dashboard/payments" },
  { id: 12, message: "GPS device offline: Vehicle JKL 7890", time: "4 days ago", category: "Fleet", read: true, priority: "important", actionLabel: "Check Fleet", actionHref: "/dashboard/fleet" },
  { id: 13, message: "Vehicle ABC 1234 LTO registration expires in 15 days", time: "1 day ago", category: "Fleet", read: false, priority: "critical", groupKey: "doc-expiry", actionLabel: "Renew Document", actionHref: "/dashboard/fleet" },
];

const categoryIcon: Record<Exclude<NotifCategory, "All">, React.ElementType> = {
  Loads: Package,
  Trips: Navigation,
  Fleet: Truck,
  Payments: DollarSign,
  System: Monitor,
};

const categoryColor: Record<Exclude<NotifCategory, "All">, string> = {
  Loads: "#2563EB",
  Trips: "#7C3AED",
  Fleet: "#059669",
  Payments: "#D97706",
  System: "#6B7280",
};

const tabs: NotifCategory[] = ["All", "Loads", "Trips", "Fleet", "Payments", "System"];

const emptyStateMessages: Record<NotifCategory, { icon: React.ElementType; title: string; subtitle: string }> = {
  All: { icon: Inbox, title: "All caught up!", subtitle: "You have no notifications right now." },
  Loads: { icon: Package, title: "No load notifications", subtitle: "New load matches and bid updates will appear here." },
  Trips: { icon: Navigation, title: "No trip updates", subtitle: "Trip status and milestone updates will show up here." },
  Fleet: { icon: Truck, title: "No fleet alerts", subtitle: "Vehicle and driver compliance alerts will appear here." },
  Payments: { icon: DollarSign, title: "No payment notifications", subtitle: "Payment receipts and reminders will appear here." },
  System: { icon: Monitor, title: "No system notifications", subtitle: "System alerts and updates will appear here." },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [activeTab, setActiveTab] = useState<NotifCategory>("All");

  const filtered = activeTab === "All" ? notifications : notifications.filter((n) => n.category === activeTab);
  const unreadCount = notifications.filter((n) => !n.read).length;
  const criticalCount = notifications.filter((n) => !n.read && n.priority === "critical").length;
  const weekTotal = notifications.length;

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const toggleRead = (id: number) =>
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n)));

  // Smart grouping
  const groupedFiltered = useMemo(() => {
    const groups: { key: string | null; items: Notification[] }[] = [];
    const groupMap = new Map<string, Notification[]>();
    const seen = new Set<string>();

    filtered.forEach((n) => {
      if (n.groupKey) {
        if (!groupMap.has(n.groupKey)) groupMap.set(n.groupKey, []);
        groupMap.get(n.groupKey)!.push(n);
      }
    });

    filtered.forEach((n) => {
      if (n.groupKey) {
        if (!seen.has(n.groupKey)) {
          seen.add(n.groupKey);
          groups.push({ key: n.groupKey, items: groupMap.get(n.groupKey)! });
        }
      } else {
        groups.push({ key: null, items: [n] });
      }
    });
    return groups;
  }, [filtered]);

  return (
    <DashboardLayout>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827", margin: 0 }}>Notifications</h1>
            <p style={{ fontSize: 14, color: "#6B7280", margin: "4px 0 0" }}>
              {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "All caught up!"}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Link
              href="/dashboard/settings"
              style={{
                display: "flex", alignItems: "center", gap: 5,
                fontSize: 13, fontWeight: 600, color: "#6B7280",
                textDecoration: "none", padding: "8px 14px",
                border: "1px solid #E5E7EB", borderRadius: 8,
              }}
            >
              <Settings size={14} /> Manage settings
            </Link>
            {unreadCount > 0 && (
              <button onClick={markAllRead} style={s.markAllBtn}>
                <Check size={14} /> Mark all read
              </button>
            )}
          </div>
        </div>

        {/* Digest Summary Card */}
        <div style={{
          display: "flex", alignItems: "center", gap: 20,
          background: "linear-gradient(135deg, #F0FDF4 0%, #EFF6FF 100%)",
          border: "1px solid #BBF7D0",
          borderRadius: 12, padding: "14px 20px", marginBottom: 20,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Bell size={18} color="#059669" />
            <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>Today:</span>
            <span style={{ fontSize: 14, color: "#374151" }}>
              {unreadCount} new{criticalCount > 0 && <>, <span style={{ color: "#DC2626", fontWeight: 700 }}>{criticalCount} critical</span></>}
            </span>
          </div>
          <div style={{ width: 1, height: 20, background: "#D1D5DB" }} />
          <div style={{ fontSize: 14, color: "#6B7280" }}>
            This week: <span style={{ fontWeight: 600, color: "#374151" }}>{weekTotal} total</span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
          {tabs.map((tab) => {
            const count = tab === "All" ? notifications.length : notifications.filter((n) => n.category === tab).length;
            const active = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: "8px 16px",
                  borderRadius: 20,
                  border: active ? "none" : "1px solid #E5E7EB",
                  background: active ? "#059669" : "#FFFFFF",
                  color: active ? "#FFFFFF" : "#4B5563",
                  fontSize: 13,
                  fontWeight: active ? 600 : 500,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                {tab === "All" && <Filter size={13} />}
                {tab} ({count})
              </button>
            );
          })}
        </div>

        {/* Notification List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {groupedFiltered.length === 0 && (() => {
            const es = emptyStateMessages[activeTab];
            const EsIcon = es.icon;
            return (
              <div style={{ textAlign: "center", padding: 48 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12, background: "#F3F4F6",
                  display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 12,
                }}>
                  <EsIcon size={22} color="#9CA3AF" />
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#374151", marginBottom: 4 }}>{es.title}</div>
                <div style={{ fontSize: 13, color: "#9CA3AF" }}>{es.subtitle}</div>
              </div>
            );
          })()}
          {groupedFiltered.map((group) => {
            const isGrouped = group.key !== null && group.items.length > 1;

            if (isGrouped) {
              const groupLabel = group.key === "doc-expiry"
                ? `${group.items.length} document expiry alerts`
                : `${group.items.length} notifications for ${group.key}`;
              return (
                <div key={group.key} style={{
                  border: "1px solid #BBF7D0", borderRadius: 12, overflow: "hidden",
                }}>
                  {/* Group header */}
                  <div style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "10px 16px", background: "#F0FDF4",
                    borderBottom: "1px solid #BBF7D0",
                  }}>
                    <AlertCircle size={13} color="#DC2626" />
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#059669" }}>
                      {groupLabel}
                    </span>
                    {group.items[0].actionHref && (
                      <Link
                        href={group.items[0].actionHref}
                        style={{
                          marginLeft: "auto", fontSize: 12, fontWeight: 600,
                          color: "#059669", textDecoration: "none",
                          display: "inline-flex", alignItems: "center", gap: 4,
                        }}
                      >
                        View All <ExternalLink size={11} />
                      </Link>
                    )}
                  </div>
                  {group.items.map((n) => (
                    <CarrierNotifRow key={n.id} n={n} toggleRead={toggleRead} />
                  ))}
                </div>
              );
            }

            const n = group.items[0];
            return <CarrierNotifRow key={n.id} n={n} toggleRead={toggleRead} />;
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}

function CarrierNotifRow({ n, toggleRead }: { n: Notification; toggleRead: (id: number) => void }) {
  const Icon = categoryIcon[n.category];
  const color = categoryColor[n.category];
  return (
    <div
      onClick={() => toggleRead(n.id)}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 14,
        padding: "16px 20px",
        background: n.read ? "#FFFFFF" : "#F0FDF4",
        border: n.read ? "1px solid #E5E7EB" : "1px solid #BBF7D0",
        borderRadius: 12,
        cursor: "pointer",
        transition: "all 0.15s",
        marginBottom: 4,
      }}
    >
      {/* Priority dot */}
      <div style={{
        width: 8, minWidth: 8, height: 8, borderRadius: "50%",
        background: n.read ? "transparent" : priorityDot[n.priority],
        marginTop: 6,
        boxShadow: !n.read && n.priority === "critical" ? `0 0 0 3px ${priorityDot.critical}30` : "none",
      }} />
      {/* Category icon */}
      <div
        style={{
          width: 40,
          height: 40,
          minWidth: 40,
          borderRadius: 10,
          background: `${color}14`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon size={18} color={color} />
      </div>
      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 14, fontWeight: n.read ? 400 : 600, color: "#111827", lineHeight: 1.5 }}>
          {n.message}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
          <span style={{ fontSize: 12, color: "#9CA3AF" }}>{n.time}</span>
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: color,
              background: `${color}14`,
              padding: "2px 8px",
              borderRadius: 10,
            }}
          >
            {n.category}
          </span>
          {n.priority !== "normal" && (
            <span style={{
              fontSize: 10, fontWeight: 700,
              color: priorityDot[n.priority],
              textTransform: "uppercase",
              letterSpacing: 0.3,
            }}>
              {n.priority}
            </span>
          )}
        </div>
      </div>
      {/* Action button */}
      {n.actionLabel && n.actionHref && (
        <Link
          href={n.actionHref}
          onClick={(e) => e.stopPropagation()}
          style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            padding: "6px 12px", borderRadius: 6, fontSize: 12, fontWeight: 600,
            color: "#059669", background: "#F0FDF4", border: "1px solid #BBF7D0",
            textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0, marginTop: 4,
          }}
        >
          {n.actionLabel} <ExternalLink size={11} />
        </Link>
      )}
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  markAllBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 16px",
    borderRadius: 8,
    border: "1px solid #059669",
    background: "#FFFFFF",
    color: "#059669",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  },
};
