"use client";
import { useState, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Bell,
  Gavel,
  Truck,
  CreditCard,
  Settings,
  CheckCheck,
  Circle,
  ExternalLink,
  AlertCircle,
  Inbox,
} from "lucide-react";
import Link from "next/link";

// ─── Types ───

type NotificationCategory = "All" | "Bids" | "Shipments" | "Payments" | "System";
type Priority = "critical" | "important" | "normal";

interface Notification {
  id: number;
  title: string;
  time: string;
  category: Exclude<NotificationCategory, "All">;
  read: boolean;
  priority: Priority;
  groupKey?: string;
  actionLabel?: string;
  actionHref?: string;
}

// ─── Priority Config ───

const priorityDot: Record<Priority, string> = {
  critical: "#DC2626",
  important: "#D97706",
  normal: "#9CA3AF",
};

// ─── Mock Data ───

const initialNotifications: Notification[] = [
  { id: 1, title: "New bid received on LD-2026-001 Manila \u2192 Cebu", time: "10 min ago", category: "Bids", read: false, priority: "important", groupKey: "LD-2026-001", actionLabel: "View Bid", actionHref: "/dashboard/loads/LD-2026-001" },
  { id: 2, title: "Bid accepted by JMD Trucking for LD-2026-003", time: "1 hour ago", category: "Bids", read: false, priority: "important", actionLabel: "View Load", actionHref: "/dashboard/loads/LD-2026-003" },
  { id: 3, title: "Shipment LD-2026-006 picked up by Visayas Express", time: "2 hours ago", category: "Shipments", read: false, priority: "normal", actionLabel: "Track", actionHref: "/dashboard/track" },
  { id: 4, title: "Payment of \u20B1140,000 processed for BK-003", time: "3 hours ago", category: "Payments", read: false, priority: "normal", actionLabel: "View Payment", actionHref: "/dashboard/payments" },
  { id: 5, title: "Load LD-2026-004 delivered to General Santos", time: "5 hours ago", category: "Shipments", read: true, priority: "normal", actionLabel: "View Load", actionHref: "/dashboard/loads/LD-2026-004" },
  { id: 6, title: "3 new bids on LD-2026-008 CDO \u2192 Zamboanga", time: "6 hours ago", category: "Bids", read: false, priority: "important", groupKey: "LD-2026-008", actionLabel: "View Bids", actionHref: "/dashboard/loads/LD-2026-008" },
  { id: 7, title: "Payment overdue: \u20B1140,000 for BK-001", time: "1 day ago", category: "Payments", read: true, priority: "critical", actionLabel: "Pay Now", actionHref: "/dashboard/payments" },
  { id: 8, title: "Carrier rating reminder for BK-005", time: "1 day ago", category: "System", read: true, priority: "normal" },
  { id: 9, title: "Load LD-2026-002 bid deadline in 6 hours", time: "1 day ago", category: "System", read: false, priority: "critical", actionLabel: "View Load", actionHref: "/dashboard/loads/LD-2026-002" },
  { id: 10, title: "Shipment LD-2026-010 arrived at Batangas Port", time: "2 days ago", category: "Shipments", read: true, priority: "normal", actionLabel: "Track", actionHref: "/dashboard/track" },
  { id: 11, title: "New carrier verified: Northern Luzon Express", time: "3 days ago", category: "System", read: true, priority: "normal" },
  { id: 12, title: "Monthly shipping report ready", time: "5 days ago", category: "System", read: true, priority: "normal" },
  { id: 13, title: "Second bid on LD-2026-001 from Metro Haulers", time: "25 min ago", category: "Bids", read: false, priority: "important", groupKey: "LD-2026-001", actionLabel: "View Bid", actionHref: "/dashboard/loads/LD-2026-001" },
  { id: 14, title: "Third bid on LD-2026-001 from Luzon Freight", time: "45 min ago", category: "Bids", read: false, priority: "important", groupKey: "LD-2026-001", actionLabel: "View Bid", actionHref: "/dashboard/loads/LD-2026-001" },
];

const tabs: NotificationCategory[] = ["All", "Bids", "Shipments", "Payments", "System"];

const categoryIcon: Record<Exclude<NotificationCategory, "All">, typeof Bell> = {
  Bids: Gavel,
  Shipments: Truck,
  Payments: CreditCard,
  System: Settings,
};

const categoryColor: Record<Exclude<NotificationCategory, "All">, string> = {
  Bids: "#2563EB",
  Shipments: "#059669",
  Payments: "#D97706",
  System: "#6B7280",
};

const emptyStateMessages: Record<NotificationCategory, { icon: typeof Bell; title: string; subtitle: string }> = {
  All: { icon: Inbox, title: "All caught up!", subtitle: "You have no notifications right now." },
  Bids: { icon: Gavel, title: "No bid notifications", subtitle: "When carriers bid on your loads, notifications will appear here." },
  Shipments: { icon: Truck, title: "No shipment updates", subtitle: "Shipment tracking updates will show up here." },
  Payments: { icon: CreditCard, title: "No payment notifications", subtitle: "Payment confirmations and reminders will appear here." },
  System: { icon: Settings, title: "No system notifications", subtitle: "System alerts and updates will appear here." },
};

// ─── Component ───

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<NotificationCategory>("All");
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const filtered = activeTab === "All" ? notifications : notifications.filter((n) => n.category === activeTab);
  const unreadCount = notifications.filter((n) => !n.read).length;
  const criticalCount = notifications.filter((n) => !n.read && n.priority === "critical").length;
  const weekTotal = notifications.length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  // Smart grouping: group notifications by groupKey
  const groupedFiltered = useMemo(() => {
    const groups: { key: string | null; items: Notification[] }[] = [];
    const groupMap = new Map<string, Notification[]>();
    const ungrouped: Notification[] = [];

    filtered.forEach((n) => {
      if (n.groupKey) {
        if (!groupMap.has(n.groupKey)) groupMap.set(n.groupKey, []);
        groupMap.get(n.groupKey)!.push(n);
      } else {
        ungrouped.push(n);
      }
    });

    // Interleave groups with ungrouped based on the first item's position
    const allItems: { type: "group"; key: string; items: Notification[] }[] | { type: "single"; item: Notification }[] = [];
    const seen = new Set<string>();
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
    <DashboardLayout activeNav="/dashboard/notifications">
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827", margin: 0 }}>Notifications</h1>
          {unreadCount > 0 && (
            <span style={{
              background: "#2563EB",
              color: "#fff",
              fontSize: 11,
              fontWeight: 700,
              borderRadius: 9999,
              padding: "2px 8px",
              minWidth: 20,
              textAlign: "center",
            }}>
              {unreadCount}
            </span>
          )}
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
            <Settings size={14} /> Manage notification settings
          </Link>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "none",
                border: "1px solid #E5E7EB",
                borderRadius: 8,
                padding: "8px 14px",
                fontSize: 13,
                fontWeight: 600,
                color: "#2563EB",
                cursor: "pointer",
              }}
            >
              <CheckCheck size={16} /> Mark all as read
            </button>
          )}
        </div>
      </div>

      {/* Digest Summary Card */}
      <div style={{
        display: "flex", alignItems: "center", gap: 20,
        background: "linear-gradient(135deg, #EFF6FF 0%, #F0FDF4 100%)",
        border: "1px solid #DBEAFE",
        borderRadius: 12, padding: "14px 20px", marginBottom: 20,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Bell size={18} color="#2563EB" />
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

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20, borderBottom: "1px solid #E5E7EB", paddingBottom: 0 }}>
        {tabs.map((tab) => {
          const isActive = tab === activeTab;
          const tabCount = tab === "All" ? notifications.filter((n) => !n.read).length : notifications.filter((n) => n.category === tab && !n.read).length;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "10px 16px",
                fontSize: 13,
                fontWeight: isActive ? 700 : 500,
                color: isActive ? "#2563EB" : "#6B7280",
                background: "none",
                border: "none",
                borderBottom: isActive ? "2px solid #2563EB" : "2px solid transparent",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginBottom: -1,
              }}
            >
              {tab}
              {tabCount > 0 && (
                <span style={{
                  background: isActive ? "#EFF6FF" : "#F3F4F6",
                  color: isActive ? "#2563EB" : "#6B7280",
                  fontSize: 10,
                  fontWeight: 700,
                  borderRadius: 9999,
                  padding: "1px 6px",
                }}>
                  {tabCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Notification list */}
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E5E7EB", overflow: "hidden" }}>
        {groupedFiltered.length === 0 ? (
          (() => {
            const es = emptyStateMessages[activeTab];
            const EsIcon = es.icon;
            return (
              <div style={{ padding: 48, textAlign: "center" }}>
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
          })()
        ) : (
          groupedFiltered.map((group, gIdx) => {
            const isGrouped = group.key !== null && group.items.length > 1;

            if (isGrouped) {
              // Render grouped notifications
              return (
                <div key={group.key} style={{
                  borderBottom: gIdx < groupedFiltered.length - 1 ? "1px solid #F3F4F6" : "none",
                }}>
                  {/* Group header */}
                  <div style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "10px 20px", background: "#F9FAFB",
                    borderBottom: "1px solid #F3F4F6",
                  }}>
                    <Gavel size={13} color="#2563EB" />
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#2563EB" }}>
                      {group.items.length} notifications for {group.key}
                    </span>
                    <Link
                      href={group.items[0].actionHref || "#"}
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        marginLeft: "auto", fontSize: 12, fontWeight: 600,
                        color: "#2563EB", textDecoration: "none",
                        display: "inline-flex", alignItems: "center", gap: 4,
                      }}
                    >
                      View All <ExternalLink size={11} />
                    </Link>
                  </div>
                  {group.items.map((n, idx) => (
                    <NotificationRow
                      key={n.id}
                      n={n}
                      isLast={idx === group.items.length - 1 && gIdx === groupedFiltered.length - 1}
                      markRead={markRead}
                    />
                  ))}
                </div>
              );
            }

            // Render single notification
            const n = group.items[0];
            return (
              <NotificationRow
                key={n.id}
                n={n}
                isLast={gIdx === groupedFiltered.length - 1}
                markRead={markRead}
              />
            );
          })
        )}
      </div>
    </DashboardLayout>
  );
}

function NotificationRow({ n, isLast, markRead }: { n: Notification; isLast: boolean; markRead: (id: number) => void }) {
  const Icon = categoryIcon[n.category];
  const color = categoryColor[n.category];
  return (
    <div
      onClick={() => markRead(n.id)}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 14,
        padding: "16px 20px",
        borderBottom: isLast ? "none" : "1px solid #F3F4F6",
        background: n.read ? "#fff" : "#EFF6FF",
        cursor: n.read ? "default" : "pointer",
        transition: "background 0.15s",
      }}
    >
      {/* Priority dot */}
      <div style={{
        width: 8, minWidth: 8, height: 8, borderRadius: "50%",
        background: n.read ? "transparent" : priorityDot[n.priority],
        marginTop: 8, flexShrink: 0,
        boxShadow: !n.read && n.priority === "critical" ? `0 0 0 3px ${priorityDot.critical}30` : "none",
      }} />

      {/* Icon */}
      <div style={{
        width: 38,
        height: 38,
        borderRadius: 10,
        background: n.read ? "#F3F4F6" : `${color}15`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        marginTop: 2,
      }}>
        <Icon size={18} color={n.read ? "#9CA3AF" : color} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 14,
          fontWeight: n.read ? 400 : 700,
          color: n.read ? "#4B5563" : "#111827",
          lineHeight: 1.4,
        }}>
          {n.title}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
          <span style={{
            fontSize: 11,
            fontWeight: 600,
            color: color,
            background: `${color}15`,
            padding: "1px 8px",
            borderRadius: 9999,
          }}>
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
          <span style={{ fontSize: 12, color: "#9CA3AF" }}>{n.time}</span>
        </div>
      </div>

      {/* Action button */}
      {n.actionLabel && n.actionHref && (
        <Link
          href={n.actionHref}
          onClick={(e) => { e.stopPropagation(); markRead(n.id); }}
          style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            padding: "6px 12px", borderRadius: 6, fontSize: 12, fontWeight: 600,
            color: "#2563EB", background: "#EFF6FF", border: "1px solid #DBEAFE",
            textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0, marginTop: 4,
          }}
        >
          {n.actionLabel} <ExternalLink size={11} />
        </Link>
      )}
    </div>
  );
}
