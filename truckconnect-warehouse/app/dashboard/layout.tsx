"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "@/lib/auth";
import {
  Warehouse, Package, ArrowDownToLine, ArrowUpFromLine,
  Building2, BarChart3, Settings, LayoutGrid, Truck, ShoppingCart, X,
  MapPin, Ship, User, Menu, ChevronDown, Tag, AlertTriangle, Users,
} from "lucide-react";

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL ?? "http://localhost:3001";

const ACCENT = "#7C3AED";
const ACCENT_LIGHT = "#F5F3FF";
const FONT_FAMILY = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

const navItems: { label: string; icon: typeof Warehouse; href: string; badge?: number }[] = [
  { label: "Dashboard", icon: Warehouse, href: "/dashboard" },
  { label: "Inventory", icon: Package, href: "/dashboard/inventory" },
  { label: "Inbound / Receiving", icon: ArrowDownToLine, href: "/dashboard/inbound" },
  { label: "Outbound / Dispatch", icon: ArrowUpFromLine, href: "/dashboard/outbound" },
  { label: "Storage Zones", icon: MapPin, href: "/dashboard/zones" },
  { label: "Facility Profile", icon: Building2, href: "/dashboard/facility" },
  { label: "Reports", icon: BarChart3, href: "/dashboard/reports" },
  { label: "Labels / Barcodes", icon: Tag, href: "/dashboard/labels" },
  { label: "Alerts", icon: AlertTriangle, href: "/dashboard/alerts", badge: 3 },
  { label: "Clients", icon: Users, href: "/dashboard/clients" },
];

const portalSwitcherItems = [
  { label: "Shipper Portal", description: "Ship & track loads", icon: Ship, href: "http://localhost:3003", color: "#2563EB" },
  { label: "Carrier Portal", description: "Manage fleet & jobs", icon: Truck, href: "http://localhost:3004", color: "#059669" },
  { label: "Marketplace", description: "Freight marketplace", icon: ShoppingCart, href: "http://localhost:3006", color: "#DB2777" },
  { label: "Auth / Settings", description: "Account & settings", icon: User, href: "http://localhost:3001", color: "#6B7280" },
  { label: "Main Website", description: "TruckConnect home", icon: LayoutGrid, href: "http://localhost:3000", color: "#111827" },
];

const appSwitcherItems = [
  { label: "Shipper Portal", icon: Ship, href: "http://localhost:3003", color: "#2563EB" },
  { label: "Carrier Portal", icon: Truck, href: "http://localhost:3004", color: "#059669" },
  { label: "Warehouse", icon: Warehouse, href: "/dashboard", color: ACCENT, active: true },
  { label: "Marketplace", icon: ShoppingCart, href: "http://localhost:3006", color: "#DB2777" },
  { label: "Auth / Settings", icon: User, href: "http://localhost:3001", color: "#6B7280" },
  { label: "Main Website", icon: LayoutGrid, href: "http://localhost:3000", color: "#111827" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();
  const pathname = usePathname();
  const [portalSwitcherOpen, setPortalSwitcherOpen] = useState(false);
  const [showAppSwitcher, setShowAppSwitcher] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (isPending) return <div style={s.loading}>Loading...</div>;

  if (!session?.user) {
    if (typeof window !== "undefined") {
      window.location.href = `${AUTH_URL}/sign-in?redirect=${encodeURIComponent(window.location.href)}`;
    }
    return <div style={s.loading}>Redirecting to sign in...</div>;
  }

  const user = session.user;

  const isActive = (href: string) =>
    pathname === href || (href !== "/dashboard" && pathname.startsWith(href));

  const renderNavItems = (onNavigate?: () => void) => (
    <>
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href);
        return (
          <a
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: active ? 600 : 500,
              textDecoration: "none",
              background: active ? ACCENT_LIGHT : "transparent",
              color: active ? ACCENT : "#374151",
              transition: "background .15s, color .15s",
            }}
          >
            <Icon size={18} />
            <span>{item.label}</span>
            {item.badge && <span style={{ marginLeft: "auto", background: "#EF4444", color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: 9999, minWidth: 18, height: 18, display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "0 5px" }}>{item.badge}</span>}
          </a>
        );
      })}
      <a
        href={`${AUTH_URL}/dashboard`}
        onClick={onNavigate}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 12px",
          borderRadius: 8,
          fontSize: 14,
          fontWeight: 500,
          textDecoration: "none",
          background: "transparent",
          color: "#374151",
          transition: "background .15s, color .15s",
        }}
      >
        <Settings size={18} />
        <span>Settings</span>
      </a>
    </>
  );

  const renderPortalSwitcher = () => (
    <div style={{ position: "relative", marginBottom: 12 }}>
      <button
        onClick={() => setPortalSwitcherOpen(!portalSwitcherOpen)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          width: "100%",
          padding: "8px 10px",
          borderRadius: 8,
          border: "1px solid #E5E7EB",
          background: portalSwitcherOpen ? ACCENT_LIGHT : "#F9FAFB",
          cursor: "pointer",
          fontSize: 13,
          fontWeight: 500,
          color: "#374151",
          fontFamily: FONT_FAMILY,
        }}
      >
        <div style={{
          width: 24, height: 24, borderRadius: 6,
          background: `${ACCENT}15`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Warehouse size={14} color={ACCENT} />
        </div>
        <span style={{ flex: 1, textAlign: "left" }}>Warehouse</span>
        <ChevronDown size={14} color="#9CA3AF" style={{ transform: portalSwitcherOpen ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
      </button>
      {portalSwitcherOpen && (
        <div style={{
          background: "#FFFFFF",
          borderRadius: 10,
          padding: 8,
          marginTop: 4,
          border: "1px solid #E5E7EB",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.5, padding: "4px 8px 8px", borderBottom: "1px solid #F3F4F6", marginBottom: 4 }}>
            Switch Portal
          </div>
          {portalSwitcherItems.map((app) => {
            const AppIcon = app.icon;
            return (
              <a
                key={app.label}
                href={app.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 10px",
                  borderRadius: 8,
                  textDecoration: "none",
                  background: "transparent",
                  cursor: "pointer",
                  marginBottom: 2,
                  transition: "background .15s",
                }}
              >
                <div style={{
                  width: 30, height: 30, borderRadius: 8,
                  background: `${app.color}12`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <AppIcon size={15} color={app.color} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{app.label}</div>
                  <div style={{ fontSize: 10, color: "#9CA3AF" }}>{app.description}</div>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <div style={s.layout}>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.4)", zIndex: 100, display: "flex",
          }}
          onClick={() => setMobileOpen(false)}
        >
          <div
            style={{
              width: 280, background: "#FFFFFF",
              display: "flex", flexDirection: "column",
              padding: "24px 16px", position: "relative",
              height: "100%", overflowY: "auto",
              borderRight: "1px solid #E5E7EB",
              boxShadow: "2px 0 12px rgba(0,0,0,0.08)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setMobileOpen(false)}
              style={{
                position: "absolute", top: 16, right: 16,
                background: "none", border: "none", cursor: "pointer",
                display: "flex", padding: 4,
              }}
            >
              <X size={20} color="#6B7280" />
            </button>

            {/* Brand */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4, paddingLeft: 8 }}>
              <Warehouse size={22} color={ACCENT} />
              <span style={{ fontSize: 16, fontWeight: 800, color: "#111827" }}>TruckConnect</span>
            </div>
            <div style={{ fontSize: 10, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, paddingLeft: 8, marginBottom: 20 }}>
              Warehouse Portal
            </div>

            {renderPortalSwitcher()}

            <nav style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
              {renderNavItems(() => setMobileOpen(false))}
            </nav>

            {/* User section */}
            <div style={s.sidebarUser}>
              <div style={s.avatar}>{user.name.charAt(0).toUpperCase()}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{user.name}</div>
                <div style={{ fontSize: 11, color: "#6B7280" }}>{user.email}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className="wh-sidebar" style={s.sidebar}>
        {/* Brand */}
        <div style={s.logoWrap}>
          <Warehouse size={22} color={ACCENT} />
          <span style={s.logoText}>TruckConnect</span>
        </div>
        <div style={s.portalLabel}>Warehouse Portal</div>

        {/* Portal switcher */}
        {renderPortalSwitcher()}

        {/* Navigation */}
        <nav style={s.nav}>
          {renderNavItems()}
        </nav>

        {/* User section */}
        <div style={s.sidebarUser}>
          <div style={s.avatar}>{user.name.charAt(0).toUpperCase()}</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</div>
            <div style={{ fontSize: 11, color: "#6B7280", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={s.main}>
        {/* Top bar */}
        <div style={s.topBar}>
          <button
            onClick={() => setMobileOpen(true)}
            className="wh-mobile-menu-btn"
            style={{ display: "none", background: "none", border: "none", cursor: "pointer", padding: 4, marginRight: 8 }}
          >
            <Menu size={22} color="#374151" />
          </button>
          <div style={{ flex: 1 }} />

          {/* App switcher */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowAppSwitcher(!showAppSwitcher)}
              style={{
                background: showAppSwitcher ? "#F3F4F6" : "transparent",
                border: "1px solid",
                borderColor: showAppSwitcher ? "#D1D5DB" : "transparent",
                borderRadius: 8,
                padding: 8,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background .15s",
              }}
              title="Switch App"
            >
              <LayoutGrid size={18} color={showAppSwitcher ? ACCENT : "#6B7280"} />
            </button>
            {showAppSwitcher && (
              <div style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                background: "#FFFFFF",
                borderRadius: 12,
                padding: 8,
                minWidth: 220,
                border: "1px solid #E5E7EB",
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                zIndex: 50,
              }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.5, padding: "4px 8px 8px" }}>
                  Apps
                </div>
                {appSwitcherItems.map((app) => {
                  const AppIcon = app.icon;
                  return (
                    <a
                      key={app.label}
                      href={app.href}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "8px 10px",
                        borderRadius: 8,
                        textDecoration: "none",
                        background: app.active ? ACCENT_LIGHT : "transparent",
                        cursor: "pointer",
                        transition: "background .15s",
                      }}
                    >
                      <div style={{
                        width: 30, height: 30, borderRadius: 8,
                        background: `${app.color}15`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <AppIcon size={15} color={app.color} />
                      </div>
                      <span style={{ fontSize: 13, fontWeight: app.active ? 600 : 500, color: app.active ? ACCENT : "#374151" }}>
                        {app.label}
                      </span>
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Page content */}
        {children}
      </main>

      <style>{`
        @media (max-width: 768px) {
          .wh-mobile-menu-btn { display: flex !important; }
          .wh-sidebar { display: none !important; }
        }
      `}</style>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  loading: {
    display: "flex", justifyContent: "center", alignItems: "center",
    height: "100vh", color: "#6B7280", fontSize: 16,
    fontFamily: FONT_FAMILY,
  },
  layout: {
    display: "flex", minHeight: "100vh",
    fontFamily: FONT_FAMILY, background: "#F9FAFB",
  },
  sidebar: {
    width: 260,
    background: "#FFFFFF",
    borderRight: "1px solid #E5E7EB",
    display: "flex",
    flexDirection: "column",
    padding: "24px 16px",
    position: "sticky" as const,
    top: 0,
    height: "100vh",
    overflowY: "auto",
  },
  logoWrap: {
    display: "flex", alignItems: "center", gap: 10,
    marginBottom: 4, paddingLeft: 8,
  },
  logoText: {
    fontSize: 16, fontWeight: 800, color: "#111827",
  },
  portalLabel: {
    fontSize: 10, fontWeight: 600, color: "#9CA3AF",
    textTransform: "uppercase", letterSpacing: 1,
    paddingLeft: 8, marginBottom: 20,
  },
  nav: {
    display: "flex", flexDirection: "column", gap: 4, flex: 1,
  },
  sidebarUser: {
    display: "flex", alignItems: "center", gap: 10,
    borderTop: "1px solid #E5E7EB", paddingTop: 16, marginTop: 8,
  },
  avatar: {
    width: 34, height: 34, borderRadius: "50%",
    background: ACCENT, color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: 700, fontSize: 14, flexShrink: 0,
  },
  main: {
    flex: 1, padding: "24px 36px", maxWidth: 1200, overflow: "auto",
  },
  topBar: {
    display: "flex", alignItems: "center", marginBottom: 24,
  },
};
