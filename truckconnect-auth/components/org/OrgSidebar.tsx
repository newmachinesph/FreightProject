"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import {
  Users, Mail, UserPlus, Key, Settings, Building2,
  ArrowLeft, LogOut, Menu, X,
} from "lucide-react";

interface Props {
  user: { name: string; email: string; image?: string | null };
  orgId: string;
  orgName: string;
  orgType: string;
}

const ORG_TYPE_LABEL: Record<string, string> = {
  tc_platform: "TruckConnect Platform",
  enterprise_shipper: "Enterprise Shipper",
  msme_shipper: "MSME Shipper",
  carrier_fleet: "Carrier Fleet",
  freight_forwarder: "Freight Forwarder",
  warehouse_operator: "Warehouse Operator",
};

const sectionHeaderStyle: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.35)",
  padding: "16px 16px 6px",
};

export default function OrgSidebar({ user, orgId, orgName, orgType }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const base = `/org/${orgId}`;

  useEffect(() => { setMobileOpen(false); }, [pathname]);

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
        <span className="mobile-header-title" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {orgName}
        </span>
      </div>

      {/* Overlay */}
      <div
        className={`sidebar-overlay${mobileOpen ? " sidebar-overlay-visible" : ""}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Sidebar */}
      <div className={`sidebar${mobileOpen ? " sidebar-open" : ""}`}>
        {/* Close button (mobile) */}
        <button className="sidebar-close-btn" onClick={() => setMobileOpen(false)} aria-label="Close menu">
          <X size={18} />
        </button>

        {/* Org header */}
        <div style={{ padding: "20px 20px 12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: "var(--blue)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <Building2 size={18} color="#fff" />
            </div>
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {orgName}
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>
                {ORG_TYPE_LABEL[orgType] ?? orgType}
              </div>
            </div>
          </div>
        </div>

        <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "0 16px 4px" }} />

        {/* Nav */}
        <nav style={{ padding: "0 12px", flex: 1, overflowY: "auto" }}>

          {/* ── MANAGEMENT ── */}
          <div style={sectionHeaderStyle}>Management</div>
          <a href={base} className={linkClass(base, true)}>
            <Users size={16} />
            Members
          </a>
          <a href={`${base}/invitations`} className={linkClass(`${base}/invitations`)}>
            <Mail size={16} />
            Invitations
          </a>
          <a href={`${base}/invite-codes`} className={linkClass(`${base}/invite-codes`)}>
            <UserPlus size={16} />
            Invite Codes
          </a>
          <a href={`${base}/keys`} className={linkClass(`${base}/keys`)}>
            <Key size={16} />
            API Keys
          </a>

          {/* ── SETTINGS ── */}
          <div style={sectionHeaderStyle}>Settings</div>
          <a href={`${base}/settings`} className={linkClass(`${base}/settings`, true)}>
            <Settings size={16} />
            General
          </a>

          {/* Divider + back link */}
          <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "14px 4px 8px" }} />
          <a href="/dashboard" className="sidebar-nav-item">
            <ArrowLeft size={16} />
            Back to Dashboard
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
