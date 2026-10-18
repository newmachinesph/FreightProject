"use client";
import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth";
import Link from "next/link";
import {
  Package,
  Truck,
  BarChart3,
  Settings,
  Plus,
  ClipboardList,
  Navigation,
  CreditCard,
  Building2,
  ChevronDown,
  ArrowRightLeft,
  Grid3X3,
  Menu,
  X,
  Store,
  Warehouse,
  LayoutGrid,
  Bell,
  FileText,
} from "lucide-react";

// ─── Inlined Design System Constants (from @truckconnect/sdk/design-system) ───

const colors = {
  primary: "#2563EB",
  primaryLight: "#EFF6FF",
  primaryDark: "#1D4ED8",
  shipper: "#2563EB",
  carrier: "#059669",
  warehouse: "#7C3AED",
  marketplace: "#DB2777",
  white: "#FFFFFF",
  background: "#F9FAFB",
  surface: "#FFFFFF",
  border: "#E5E7EB",
  borderLight: "#F3F4F6",
  textPrimary: "#111827",
  textSecondary: "#4B5563",
  textTertiary: "#6B7280",
  textMuted: "#9CA3AF",
} as const;

const fonts = {
  family: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  size: { xs: 10, sm: 11, body: 13, md: 14, lg: 16, xl: 18, "2xl": 20, "3xl": 24, "4xl": 32 },
  weight: { normal: 400, medium: 500, semibold: 600, bold: 700, extrabold: 800 },
} as const;

const radius = { sm: 4, md: 6, lg: 8, xl: 10, "2xl": 12, full: 9999 } as const;
const shadows = { sm: "0 1px 2px rgba(0,0,0,0.05)", md: "0 4px 6px -1px rgba(0,0,0,0.1)", lg: "0 10px 15px -3px rgba(0,0,0,0.1)", dropdown: "0 10px 25px rgba(0,0,0,0.1)" } as const;
const layout = { sidebarWidth: 260, mobileSidebarWidth: 280, topNavHeight: 56, mobileBreakpoint: 768 } as const;

// Portal-specific
const ACCENT = colors.shipper;
const ACCENT_LIGHT = colors.primaryLight;
const PORTAL_LABEL = "SHIPPER PORTAL";

// ─── URLs ───
const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL ?? "http://localhost:3001";
const CARRIER_URL = process.env.NEXT_PUBLIC_CARRIER_URL ?? "http://localhost:3004";
const MARKETPLACE_URL = process.env.NEXT_PUBLIC_MARKETPLACE_URL ?? "http://localhost:3006";
const WAREHOUSE_URL = process.env.NEXT_PUBLIC_WAREHOUSE_URL ?? "http://localhost:3005";
const MAIN_URL = "http://localhost:3000";

// ─── Sidebar Nav Items ───
const sidebarNav: { label: string; href: string; icon: typeof BarChart3; highlight?: boolean; external?: boolean; badge?: number }[] = [
  { label: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { label: "Post Load", href: "/dashboard/loads/new", icon: Plus, highlight: true },
  { label: "My Loads", href: "/dashboard/loads", icon: Package },
  { label: "Bookings", href: "/dashboard/bookings", icon: ClipboardList },
  { label: "Track Shipments", href: "/dashboard/tracking", icon: Navigation },
  { label: "Payments", href: "/dashboard/payments", icon: CreditCard },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "Notifications", href: "/dashboard/notifications", icon: Bell, badge: 3 },
  { label: "Templates", href: "/dashboard/templates", icon: FileText },
  { label: "Company Profile", href: "/dashboard/company", icon: Building2 },
  { label: "Settings", href: `${AUTH_URL}/dashboard`, icon: Settings, external: true },
];

// ─── Portal Switcher Items ───
const portalSwitcherItems = [
  { label: "Carrier Portal", description: "Manage fleet & trips", href: CARRIER_URL, color: colors.carrier, colorBg: "#ECFDF5", icon: Truck },
  { label: "Warehouse Portal", description: "Inventory & operations", href: WAREHOUSE_URL, color: colors.warehouse, colorBg: "#F5F3FF", icon: Warehouse },
  { label: "Marketplace", description: "Browse loads & carriers", href: MARKETPLACE_URL, color: colors.marketplace, colorBg: "#FDF2F8", icon: Store },
  { label: "Auth / Settings", description: "Account settings", href: AUTH_URL, color: colors.textTertiary, colorBg: colors.borderLight, icon: Settings },
  { label: "Main Website", description: "TruckConnect home", href: MAIN_URL, color: colors.textPrimary, colorBg: colors.borderLight, icon: LayoutGrid },
];

// ─── App Switcher Items (top nav grid) ───
const appSwitcherItems = [
  { label: "Main Website", href: MAIN_URL, color: colors.textPrimary, colorBg: colors.borderLight, icon: LayoutGrid },
  { label: "Marketplace", href: MARKETPLACE_URL, color: colors.marketplace, colorBg: "#FDF2F8", icon: Store },
  { label: "Shipper Portal", href: "/dashboard", color: ACCENT, colorBg: ACCENT_LIGHT, icon: Package, current: true },
  { label: "Carrier Portal", href: CARRIER_URL, color: colors.carrier, colorBg: "#ECFDF5", icon: Truck },
  { label: "Warehouse Portal", href: WAREHOUSE_URL, color: colors.warehouse, colorBg: "#F5F3FF", icon: Warehouse },
  { label: "Auth / Settings", href: AUTH_URL, color: colors.textTertiary, colorBg: colors.borderLight, icon: Settings },
];

// ─── Component ───

interface Props {
  children: React.ReactNode;
  activeNav: string;
}

export default function DashboardLayout({ children, activeNav }: Props) {
  const { data: session, isPending } = useSession();
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [appSwitcherOpen, setAppSwitcherOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = () => {
      setSwitcherOpen(false);
      setAppSwitcherOpen(false);
    };
    if (switcherOpen || appSwitcherOpen) {
      document.addEventListener("click", handleClick);
      return () => document.removeEventListener("click", handleClick);
    }
  }, [switcherOpen, appSwitcherOpen]);

  if (isPending) return <div style={s.loading}>Loading...</div>;

  if (!session?.user) {
    if (typeof window !== "undefined") {
      window.location.href = `${AUTH_URL}/sign-in?redirect=${encodeURIComponent(window.location.href)}`;
    }
    return <div style={s.loading}>Redirecting to sign in...</div>;
  }

  const user = session.user;

  // ─── Sidebar Content (shared between desktop & mobile) ───
  const sidebarContent = (
    <>
      {/* Brand */}
      <div style={s.sidebarHeader}>
        <Truck size={24} color={ACCENT} />
        <span style={s.sidebarBrand}>TruckConnect</span>
      </div>

      {/* Portal label with accent bar */}
      <div style={s.portalLabel}>
        <div style={s.portalLabelBar} />
        <span>{PORTAL_LABEL}</span>
      </div>

      {/* Portal Switcher */}
      <div style={{ position: "relative", margin: "0 8px 4px" }}>
        <button
          onClick={(e) => { e.stopPropagation(); setSwitcherOpen(!switcherOpen); }}
          style={s.switcherBtn}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: radius.md, background: ACCENT_LIGHT, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Package size={14} color={ACCENT} />
            </div>
            <div style={{ textAlign: "left" as const }}>
              <div style={{ fontSize: fonts.size.body, fontWeight: fonts.weight.bold, color: colors.textPrimary }}>Shipper Portal</div>
              <div style={{ fontSize: fonts.size.xs, color: colors.textMuted }}>Post loads & track</div>
            </div>
          </div>
          <ChevronDown size={14} color={colors.textMuted} style={{ transform: switcherOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
        </button>
        {switcherOpen && (
          <div style={s.switcherDropdown} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: "8px 12px", fontSize: fonts.size.xs, fontWeight: fonts.weight.bold, color: colors.textMuted, textTransform: "uppercase" as const, letterSpacing: 1 }}>
              Switch Portal
            </div>
            {portalSwitcherItems.map((item) => {
              const Icon = item.icon;
              return (
                <a key={item.label} href={item.href} style={s.switcherItem}>
                  <div style={{ width: 28, height: 28, borderRadius: radius.md, background: item.colorBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={14} color={item.color} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: fonts.weight.semibold, color: colors.textPrimary }}>{item.label}</div>
                    <div style={{ fontSize: fonts.size.xs, color: colors.textMuted }}>{item.description}</div>
                  </div>
                  <ArrowRightLeft size={12} color={colors.textMuted} />
                </a>
              );
            })}
          </div>
        )}
      </div>

      {/* Navigation label */}
      <div style={s.sidebarLabel}>NAVIGATION</div>

      {/* Nav items */}
      <nav style={s.nav}>
        {sidebarNav.map((item) => {
          const Icon = item.icon;
          const isActive = item.href === activeNav;
          const isHighlight = item.highlight && !isActive;
          const navStyle: React.CSSProperties = {
            ...s.navItem,
            ...(isActive ? s.navActive : {}),
            ...(isHighlight
              ? { background: ACCENT, color: "#fff", fontWeight: fonts.weight.semibold }
              : {}),
          };
          if (item.external) {
            return (
              <a key={item.label} href={item.href} style={navStyle} target="_blank" rel="noopener noreferrer">
                <Icon size={18} /> {item.label}
                <span style={{ marginLeft: "auto", fontSize: fonts.size.xs, color: isActive ? ACCENT : colors.textMuted }}>ext</span>
              </a>
            );
          }
          return (
            <Link key={item.label} href={item.href} style={navStyle} onClick={() => setMobileOpen(false)}>
              <Icon size={18} /> {item.label}
              {item.badge && <span style={{ marginLeft: "auto", background: "#EF4444", color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: 9999, minWidth: 18, height: 18, display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "0 5px" }}>{item.badge}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div style={s.sidebarUser}>
        <div style={s.avatar}>{user.name?.charAt(0).toUpperCase() ?? "U"}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: fonts.size.body, fontWeight: fonts.weight.semibold, color: colors.textPrimary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{user.name}</div>
          <div style={{ fontSize: fonts.size.sm, color: colors.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{user.email}</div>
        </div>
      </div>
    </>
  );

  return (
    <div style={s.layout}>
      {/* Desktop sidebar */}
      <aside className="shipper-sidebar" style={s.sidebar}>
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div style={s.mobileOverlay} onClick={() => setMobileOpen(false)}>
          <aside style={s.mobileSidebar} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setMobileOpen(false)}
              style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", cursor: "pointer" }}
            >
              <X size={20} color={colors.textTertiary} />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main content area */}
      <main style={s.main}>
        {/* Top navbar */}
        <div style={s.topNav}>
          <button
            onClick={() => setMobileOpen(true)}
            className="shipper-mobile-menu-btn"
            style={s.mobileMenuBtn}
          >
            <Menu size={20} color="#374151" />
          </button>
          <div style={{ flex: 1 }} />

          {/* App Switcher */}
          <div style={{ position: "relative" }}>
            <button
              onClick={(e) => { e.stopPropagation(); setAppSwitcherOpen(!appSwitcherOpen); }}
              style={{
                ...s.appSwitcherBtn,
                background: appSwitcherOpen ? ACCENT_LIGHT : "none",
              }}
              title="Switch App"
            >
              <Grid3X3 size={18} color={colors.textTertiary} />
            </button>
            {appSwitcherOpen && (
              <div style={s.appSwitcherDropdown} onClick={(e) => e.stopPropagation()}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 8px 8px", borderBottom: `1px solid ${colors.borderLight}`, marginBottom: 4 }}>
                  <span style={{ fontSize: fonts.size.sm, fontWeight: fonts.weight.bold, color: colors.textTertiary, textTransform: "uppercase" as const, letterSpacing: 0.5 }}>
                    Switch App
                  </span>
                  <button onClick={() => setAppSwitcherOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
                    <X size={14} color={colors.textMuted} />
                  </button>
                </div>
                {appSwitcherItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      style={{
                        ...s.appSwitcherItem,
                        ...(item.current ? { background: ACCENT_LIGHT, color: ACCENT, fontWeight: fonts.weight.semibold } : {}),
                      }}
                    >
                      <div style={{
                        width: 28, height: 28, borderRadius: radius.md,
                        background: item.current ? ACCENT : item.colorBg,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <Icon size={14} color={item.current ? "#fff" : item.color} />
                      </div>
                      <span>{item.label}</span>
                      {item.current && (
                        <span style={{ marginLeft: "auto", fontSize: fonts.size.xs, color: ACCENT }}>Current</span>
                      )}
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Sign-in banner (if session lost) */}
        {!session && (
          <div style={{
            background: ACCENT_LIGHT,
            borderBottom: "1px solid #BFDBFE",
            padding: "10px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            margin: "0 -32px 20px -32px",
          }}>
            <span style={{ fontSize: fonts.size.body, color: "#1E40AF" }}>Sign in to access all features</span>
            <a
              href={`${AUTH_URL}/sign-in?redirect=http://localhost:3003/auth/callback`}
              style={{ fontSize: fonts.size.body, fontWeight: fonts.weight.semibold, color: ACCENT, textDecoration: "none" }}
            >
              Sign In &rarr;
            </a>
          </div>
        )}
        {children}
      </main>

      <style>{`
        @media (max-width: ${layout.mobileBreakpoint}px) {
          .shipper-mobile-menu-btn { display: flex !important; }
          .shipper-sidebar { display: none !important; }
        }
      `}</style>
    </div>
  );
}

// ─── Styles ───

const s: Record<string, React.CSSProperties> = {
  layout: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: fonts.family,
  },
  loading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    color: colors.textTertiary,
    fontSize: fonts.size.lg,
  },

  // ─── Sidebar ───
  sidebar: {
    width: layout.sidebarWidth,
    background: colors.white,
    borderRight: `1px solid ${colors.border}`,
    padding: "24px 16px",
    display: "flex",
    flexDirection: "column",
    position: "sticky",
    top: 0,
    height: "100vh",
    overflowY: "auto",
  },
  sidebarHeader: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 4,
    padding: "0 8px",
  },
  sidebarBrand: {
    fontSize: fonts.size.xl,
    fontWeight: fonts.weight.extrabold,
    color: colors.textPrimary,
  },
  portalLabel: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "0 8px",
    marginBottom: 12,
  },
  portalLabelBar: {
    width: 3,
    height: 12,
    borderRadius: 2,
    background: ACCENT,
  },
  sidebarLabel: {
    fontSize: fonts.size.xs,
    fontWeight: fonts.weight.bold,
    color: colors.textMuted,
    letterSpacing: 1,
    padding: "12px 8px 8px",
    marginTop: 8,
    borderTop: `1px solid ${colors.borderLight}`,
    textTransform: "uppercase",
  },

  // ─── Portal Switcher ───
  switcherBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    padding: "8px 10px",
    background: colors.background,
    border: `1px solid ${colors.border}`,
    borderRadius: radius.lg,
    cursor: "pointer",
    marginBottom: 4,
  },
  switcherDropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    background: colors.white,
    border: `1px solid ${colors.border}`,
    borderRadius: radius.lg,
    boxShadow: shadows.dropdown,
    zIndex: 50,
    marginTop: 4,
    paddingBottom: 4,
  },
  switcherItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "8px 12px",
    textDecoration: "none",
    cursor: "pointer",
    borderRadius: radius.md,
    margin: "2px 4px",
  },

  // ─── Nav ───
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    flex: 1,
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 12px",
    borderRadius: radius.lg,
    fontSize: fonts.size.md,
    color: colors.textSecondary,
    textDecoration: "none",
    fontWeight: fonts.weight.medium,
    transition: "background 0.15s, color 0.15s",
  },
  navActive: {
    background: ACCENT_LIGHT,
    color: ACCENT,
    fontWeight: fonts.weight.semibold,
  },

  // ─── User Section ───
  sidebarUser: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "12px 8px",
    borderTop: `1px solid ${colors.border}`,
    marginTop: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    background: ACCENT,
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: fonts.weight.bold,
    fontSize: fonts.size.md,
    flexShrink: 0,
  },

  // ─── Main Area ───
  main: {
    flex: 1,
    padding: "0 32px 28px 32px",
    overflowY: "auto",
    background: colors.background,
  },
  topNav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "12px 0",
    marginBottom: 8,
    height: layout.topNavHeight,
    position: "sticky",
    top: 0,
    background: colors.background,
    zIndex: 40,
  },
  mobileMenuBtn: {
    display: "none",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 4,
  },

  // ─── App Switcher (top nav) ───
  appSwitcherBtn: {
    background: "none",
    border: `1px solid ${colors.border}`,
    borderRadius: radius.lg,
    padding: "6px 8px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  appSwitcherDropdown: {
    position: "absolute",
    top: "100%",
    right: 0,
    background: colors.white,
    border: `1px solid ${colors.border}`,
    borderRadius: radius["2xl"],
    boxShadow: shadows.dropdown,
    zIndex: 50,
    marginTop: 4,
    width: 260,
    padding: 8,
  },
  appSwitcherItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "8px 12px",
    textDecoration: "none",
    cursor: "pointer",
    borderRadius: radius.md,
    margin: "2px 4px",
    fontSize: fonts.size.body,
    color: colors.textSecondary,
    fontWeight: fonts.weight.medium,
  },

  // ─── Mobile ───
  mobileOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.4)",
    zIndex: 100,
    display: "flex",
  },
  mobileSidebar: {
    width: layout.mobileSidebarWidth,
    background: colors.white,
    padding: "24px 16px",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    height: "100%",
    overflowY: "auto",
  },
};
