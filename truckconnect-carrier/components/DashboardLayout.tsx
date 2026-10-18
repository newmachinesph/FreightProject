"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "@/lib/auth";
import Link from "next/link";
import {
  Truck,
  Package,
  DollarSign,
  FileText,
  Settings,
  Navigation,
  LayoutDashboard,
  Users,
  Building2,
  Gavel,
  ChevronDown,
  ArrowRightLeft,
  Grid3X3,
  Menu,
  X,
  Store,
  Warehouse,
  BarChart3,
  Bell,
  Map,
} from "lucide-react";

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL ?? "http://localhost:3001";
const SHIPPER_URL = process.env.NEXT_PUBLIC_SHIPPER_URL ?? "http://localhost:3003";
const WAREHOUSE_URL = process.env.NEXT_PUBLIC_WAREHOUSE_URL ?? "http://localhost:3005";
const MARKETPLACE_URL = process.env.NEXT_PUBLIC_MARKETPLACE_URL ?? "http://localhost:3006";

const navItems: { label: string; icon: typeof LayoutDashboard; href: string; external?: boolean; badge?: number }[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Load Board", icon: Package, href: "/dashboard/loads" },
  { label: "My Bids", icon: Gavel, href: "/dashboard/bids" },
  { label: "Trips", icon: Navigation, href: "/dashboard/trips" },
  { label: "Fleet Management", icon: Truck, href: "/dashboard/fleet" },
  { label: "Drivers", icon: Users, href: "/dashboard/drivers" },
  { label: "Earnings", icon: DollarSign, href: "/dashboard/earnings" },
  { label: "Analytics", icon: BarChart3, href: "/dashboard/analytics" },
  { label: "Notifications", icon: Bell, href: "/dashboard/notifications", badge: 3 },
  { label: "Route Planner", icon: Map, href: "/dashboard/route-planner" },
  { label: "Company Profile", icon: Building2, href: "/dashboard/company" },
  { label: "Documents", icon: FileText, href: "/dashboard/documents" },
  { label: "Settings", icon: Settings, href: `${AUTH_URL}/dashboard`, external: true },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();
  const pathname = usePathname();
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [appSwitcherOpen, setAppSwitcherOpen] = useState(false);
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
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  const sidebar = (
    <>
      <div style={s.sidebarHeader}>
        <Truck size={24} color="#2563EB" />
        <span style={s.sidebarBrand}>TruckConnect</span>
      </div>

      {/* Portal Label */}
      <div style={s.portalLabel}>CARRIER PORTAL</div>

      {/* Portal Switcher */}
      <div style={{ position: "relative", margin: "0 8px" }}>
        <button onClick={() => setSwitcherOpen(!switcherOpen)} style={s.switcherBtn}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: "#ECFDF5", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Truck size={14} color="#059669" />
            </div>
            <div style={{ textAlign: "left" as const }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#111827" }}>Carrier Portal</div>
              <div style={{ fontSize: 10, color: "#9CA3AF" }}>Fleet & deliveries</div>
            </div>
          </div>
          <ChevronDown size={14} color="#9CA3AF" style={{ transform: switcherOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
        </button>
        {switcherOpen && (
          <div style={s.switcherDropdown}>
            <div style={{ padding: "8px 12px", fontSize: 10, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase" as const, letterSpacing: 1 }}>Switch Portal</div>
            <a href={SHIPPER_URL} style={s.switcherItem}>
              <div style={{ width: 28, height: 28, borderRadius: 6, background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Package size={14} color="#2563EB" />
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>Shipper Portal</div>
                <div style={{ fontSize: 10, color: "#9CA3AF" }}>Post & manage loads</div>
              </div>
              <ArrowRightLeft size={12} color="#9CA3AF" style={{ marginLeft: "auto" }} />
            </a>
            <a href={WAREHOUSE_URL} style={s.switcherItem}>
              <div style={{ width: 28, height: 28, borderRadius: 6, background: "#FFF7ED", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Warehouse size={14} color="#D97706" />
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>Warehouse Portal</div>
                <div style={{ fontSize: 10, color: "#9CA3AF" }}>Manage storage</div>
              </div>
              <ArrowRightLeft size={12} color="#9CA3AF" style={{ marginLeft: "auto" }} />
            </a>
            <a href={MARKETPLACE_URL} style={s.switcherItem}>
              <div style={{ width: 28, height: 28, borderRadius: 6, background: "#FDF2F8", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Store size={14} color="#DB2777" />
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>Marketplace</div>
                <div style={{ fontSize: 10, color: "#9CA3AF" }}>Browse loads & carriers</div>
              </div>
              <ArrowRightLeft size={12} color="#9CA3AF" style={{ marginLeft: "auto" }} />
            </a>
            <a href={AUTH_URL} style={s.switcherItem}>
              <div style={{ width: 28, height: 28, borderRadius: 6, background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Settings size={14} color="#6B7280" />
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>Auth / Settings</div>
                <div style={{ fontSize: 10, color: "#9CA3AF" }}>Account settings</div>
              </div>
              <ArrowRightLeft size={12} color="#9CA3AF" style={{ marginLeft: "auto" }} />
            </a>
            <a href="http://localhost:3000" style={s.switcherItem}>
              <div style={{ width: 28, height: 28, borderRadius: 6, background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Grid3X3 size={14} color="#111827" />
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>Main Website</div>
                <div style={{ fontSize: 10, color: "#9CA3AF" }}>TruckConnect home</div>
              </div>
              <ArrowRightLeft size={12} color="#9CA3AF" style={{ marginLeft: "auto" }} />
            </a>
          </div>
        )}
      </div>

      <div style={s.sidebarLabel}>NAVIGATION</div>
      <nav style={s.nav}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          const navStyle: React.CSSProperties = {
            ...s.navItem,
            ...(active ? s.navActive : {}),
          };
          if (item.external) {
            return (
              <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" style={navStyle}>
                <Icon size={18} /> {item.label}
                <span style={{ marginLeft: "auto", fontSize: 10, color: "#9CA3AF" }}>ext</span>
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
      <div style={s.sidebarUser}>
        <div style={s.avatar}>{user.name.charAt(0).toUpperCase()}</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{user.name}</div>
          <div style={{ fontSize: 11, color: "#9CA3AF" }}>{user.email}</div>
        </div>
      </div>
    </>
  );

  return (
    <div style={s.layout}>
      {/* Desktop sidebar */}
      <aside className="carrier-sidebar" style={s.sidebar}>{sidebar}</aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div style={s.mobileOverlay} onClick={() => setMobileOpen(false)}>
          <aside style={s.mobileSidebar} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setMobileOpen(false)} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", cursor: "pointer" }}>
              <X size={20} color="#6B7280" />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" as const, minHeight: "100vh" }}>
        {/* Top navbar */}
        <header style={s.topNav}>
          <button onClick={() => setMobileOpen(true)} className="carrier-mobile-menu-btn" style={s.mobileMenuBtn}>
            <Menu size={20} color="#374151" />
          </button>
          <div style={{ flex: 1 }} />
          {/* App Switcher Icon */}
          <div style={{ position: "relative" }}>
            <button onClick={() => setAppSwitcherOpen(!appSwitcherOpen)} style={s.appSwitcherBtn} title="Switch App">
              <Grid3X3 size={18} color="#6B7280" />
            </button>
            {appSwitcherOpen && (
              <div style={s.appSwitcherDropdown}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", borderBottom: "1px solid #F3F4F6", marginBottom: 4 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase" as const, letterSpacing: 1 }}>Apps</span>
                  <button onClick={() => setAppSwitcherOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
                    <X size={14} color="#9CA3AF" />
                  </button>
                </div>
                <a href={SHIPPER_URL} style={s.appSwitcherItem}>
                  <Package size={16} color="#2563EB" />
                  <span>Shipper Portal</span>
                </a>
                <div style={{ ...s.appSwitcherItem, background: "#ECFDF5", borderRadius: 6, fontWeight: 600, color: "#059669" }}>
                  <Truck size={16} color="#059669" />
                  <span>Carrier Portal</span>
                  <span style={{ marginLeft: "auto", fontSize: 10, color: "#059669" }}>Current</span>
                </div>
                <a href={WAREHOUSE_URL} style={s.appSwitcherItem}>
                  <Warehouse size={16} color="#7C3AED" />
                  <span>Warehouse Portal</span>
                </a>
                <a href={MARKETPLACE_URL} style={s.appSwitcherItem}>
                  <Store size={16} color="#DB2777" />
                  <span>Marketplace</span>
                </a>
                <a href={AUTH_URL} style={s.appSwitcherItem}>
                  <Settings size={16} color="#6B7280" />
                  <span>Auth / Settings</span>
                </a>
                <a href="http://localhost:3000" style={s.appSwitcherItem}>
                  <Grid3X3 size={16} color="#111827" />
                  <span>Main Website</span>
                </a>
              </div>
            )}
          </div>
        </header>

        <main style={{ flex: 1, padding: "32px 40px", overflowY: "auto", background: "#F9FAFB" }}>
          {children}
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .carrier-mobile-menu-btn { display: flex !important; }
          .carrier-sidebar { display: none !important; }
        }
      `}</style>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  layout: { display: "flex", minHeight: "100vh", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" },
  loading: { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", color: "#6B7280", fontSize: 16 },

  sidebar: { width: 260, background: "#FFFFFF", borderRight: "1px solid #E5E7EB", padding: "24px 16px", display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh", overflowY: "auto" },
  sidebarHeader: { display: "flex", alignItems: "center", gap: 10, marginBottom: 4, padding: "0 8px" },
  sidebarBrand: { fontSize: 18, fontWeight: 800, color: "#111827" },
  portalLabel: { fontSize: 10, fontWeight: 600, color: "#9CA3AF", letterSpacing: 1, padding: "0 8px", marginBottom: 12, textTransform: "uppercase" as const },
  switcherBtn: { display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "8px 10px", background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 8, cursor: "pointer", marginBottom: 4 },
  switcherDropdown: { position: "absolute", top: "100%", left: 0, right: 0, background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", zIndex: 50, marginTop: 4, paddingBottom: 4 },
  switcherItem: { display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", textDecoration: "none", cursor: "pointer", borderRadius: 6, margin: "2px 4px" },
  sidebarLabel: { fontSize: 10, fontWeight: 700, color: "#9CA3AF", letterSpacing: 1, padding: "12px 8px 8px", marginTop: 8, borderTop: "1px solid #F3F4F6" },
  nav: { display: "flex", flexDirection: "column", gap: 2, flex: 1 },
  navItem: { display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, fontSize: 14, color: "#4B5563", textDecoration: "none", fontWeight: 500 },
  navActive: { background: "#ECFDF5", color: "#059669", fontWeight: 600 },
  sidebarUser: { display: "flex", alignItems: "center", gap: 10, padding: "12px 8px", borderTop: "1px solid #E5E7EB", marginTop: 8 },
  avatar: { width: 36, height: 36, borderRadius: "50%", background: "#059669", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14 },

  topNav: { height: 56, background: "#FFFFFF", borderBottom: "1px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "0 24px", gap: 12, position: "sticky", top: 0, zIndex: 40 },
  mobileMenuBtn: { display: "none", background: "none", border: "none", cursor: "pointer", padding: 4, marginRight: "auto" },

  appSwitcherBtn: { width: 36, height: 36, borderRadius: 8, border: "1px solid #E5E7EB", background: "#FFFFFF", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
  appSwitcherDropdown: { position: "absolute", top: 44, right: 0, width: 240, background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 12, boxShadow: "0 10px 25px rgba(0,0,0,0.1)", padding: 8, zIndex: 100 },
  appSwitcherItem: { display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", textDecoration: "none", cursor: "pointer", borderRadius: 6, margin: "2px 4px", fontSize: 13, color: "#374151", fontWeight: 500 },

  mobileOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.4)", zIndex: 100, display: "flex" },
  mobileSidebar: { width: 280, background: "#FFFFFF", padding: "24px 16px", display: "flex", flexDirection: "column", position: "relative", height: "100%", overflowY: "auto" },
};
