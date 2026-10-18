"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import {
  LayoutDashboard,
  Users,
  Building2,
  Shield,
  LogOut,
  Activity,
  Menu,
  X,
} from "lucide-react";

interface Props {
  user: { name: string; email: string; role?: string | null };
}

const NAV = [
  { href: "/admin",               label: "Overview",      icon: LayoutDashboard },
  { href: "/admin/users",         label: "Users",         icon: Users },
  { href: "/admin/organizations", label: "Organizations", icon: Building2 },
  { href: "/admin/roles",         label: "Roles & RBAC",  icon: Shield },
  { href: "/admin/activity",      label: "Activity",      icon: Activity },
];

export default function AdminSidebar({ user }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  async function handleSignOut() {
    await signOut();
    router.push("/sign-in");
  }

  return (
    <>
      {/* Mobile header */}
      <div className="mobile-header">
        <button className="mobile-menu-btn" onClick={() => setMobileOpen(true)} aria-label="Open menu">
          <Menu size={22} />
        </button>
        <span className="mobile-header-title">Admin Console</span>
      </div>

      {/* Overlay */}
      <div
        className={`sidebar-overlay${mobileOpen ? " sidebar-overlay-visible" : ""}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`sidebar${mobileOpen ? " sidebar-open" : ""}`}>
        {/* Close button (mobile) */}
        <button className="sidebar-close-btn" onClick={() => setMobileOpen(false)} aria-label="Close menu">
          <X size={18} />
        </button>

        {/* Logo */}
        <div style={{ padding: "20px 16px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 34, height: 34,
              background: "#2563EB",
              borderRadius: 8,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M3 17L9 11L13 15L21 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17 7H21V11" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>TruckConnect</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: "0.05em", textTransform: "uppercase" }}>Admin Console</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: "12px 8px", display: "flex", flexDirection: "column", gap: 2 }}>
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`sidebar-nav-item${active ? " active" : ""}`}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* User + Sign out */}
        <div style={{ padding: "12px 8px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{
            padding: "10px 12px",
            borderRadius: 8,
            marginBottom: 4,
          }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user.name}
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user.email}
            </div>
            <div style={{ marginTop: 4 }}>
              <span className="badge badge-blue" style={{ fontSize: 10 }}>Super Admin</span>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="sidebar-nav-item"
            style={{ width: "100%", border: "none", background: "none", textAlign: "left" }}
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
