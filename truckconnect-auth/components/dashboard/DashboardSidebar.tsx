"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import {
  LayoutDashboard, User, Shield, Building2, Plus,
  FileText, Key, LogOut, UserX, Menu, X,
} from "lucide-react";
import { ORG_ADMIN_ROLES } from "@/lib/auth/constants";

interface Props {
  user: { name: string; email: string; image?: string | null; role?: string };
  orgs: { id: string; name: string; role: string }[];
}

const sectionHeaderStyle: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.35)",
  padding: "16px 16px 6px",
};

export default function DashboardSidebar({ user, orgs }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const adminOrgs = orgs.filter((o) => ORG_ADMIN_ROLES.has(o.role));

  // Close sidebar on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  function isActive(href: string, exact = false) {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  }

  function linkClass(href: string, exact = false) {
    return `sidebar-nav-item${isActive(href, exact) ? " active" : ""}`;
  }

  async function handleSignOut() {
    if (typeof window !== "undefined") localStorage.removeItem("tc_session_token");
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
        <span className="mobile-header-title">TruckConnect</span>
      </div>

      {/* Overlay */}
      <div
        className={`sidebar-overlay${mobileOpen ? " sidebar-overlay-visible" : ""}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Sidebar */}
      <div className={`sidebar${mobileOpen ? " sidebar-open" : ""}`}>
        {/* Close button (mobile only) */}
        <button className="sidebar-close-btn" onClick={() => setMobileOpen(false)} aria-label="Close menu">
          <X size={18} />
        </button>

        {/* Logo */}
        <div style={{ padding: "20px 20px 12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: "var(--blue)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <LayoutDashboard size={18} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>TruckConnect</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>My Account</div>
            </div>
          </div>
        </div>

        <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "0 16px 4px" }} />

        {/* Scrollable nav area */}
        <nav style={{ padding: "0 12px", flex: 1, overflowY: "auto" }}>

          {/* ── NAVIGATION ── */}
          <div style={sectionHeaderStyle}>Navigation</div>
          <a href="/dashboard" className={linkClass("/dashboard", true)}>
            <LayoutDashboard size={16} />
            Overview
          </a>

          {/* ── ACCOUNT ── */}
          <div style={sectionHeaderStyle}>Account</div>
          <a href="/dashboard/settings" className={linkClass("/dashboard/settings", true)}>
            <User size={16} />
            Profile
          </a>
          <a href="/dashboard/settings/security" className={linkClass("/dashboard/settings/security")}>
            <Shield size={16} />
            Security
          </a>

          {/* ── ORGANIZATIONS ── */}
          <div style={sectionHeaderStyle}>Organizations</div>
          {adminOrgs.map((o) => {
            const href = `/org/${o.id}`;
            return (
              <a key={o.id} href={href} className={linkClass(href)}>
                <Building2 size={16} />
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.name}</span>
              </a>
            );
          })}
          <a href="/dashboard/create-org" className={linkClass("/dashboard/create-org")}>
            <Plus size={16} />
            Create Organization
          </a>

          {/* ── DEVELOPER ── */}
          <div style={sectionHeaderStyle}>Developer</div>
          <a href="/dashboard/developer" className={linkClass("/dashboard/developer", true)}>
            <FileText size={16} />
            API Documentation
          </a>
          <a href="/dashboard/developer/tokens" className={linkClass("/dashboard/developer/tokens")}>
            <Key size={16} />
            Personal Tokens
          </a>

          {/* Close Account — muted, at bottom of nav */}
          <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "14px 4px 8px" }} />
          <a
            href="/dashboard/settings/close-account"
            className={linkClass("/dashboard/settings/close-account")}
            style={{ fontSize: 12, color: isActive("/dashboard/settings/close-account") ? undefined : "rgba(255,255,255,0.35)" }}
          >
            <UserX size={14} />
            Close Account
          </a>
        </nav>

        {/* User footer */}
        <div style={{ padding: "12px 16px 16px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            {user.image ? (
              <img src={user.image} alt="" style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }} />
            ) : (
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                background: "var(--blue)", color: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 700, flexShrink: 0,
              }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user.name}
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user.email}
              </div>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            style={{
              width: "100%", padding: "7px 12px",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8, color: "rgba(255,255,255,0.6)",
              fontSize: 13, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 6, justifyContent: "center",
            }}
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
}
