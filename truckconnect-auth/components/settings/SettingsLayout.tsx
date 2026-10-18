"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import {
  User, Shield, UserX, Building2, Users,
  UserPlus, Key, Settings, Code, FileText,
  ArrowLeft, LogOut, ChevronDown, Menu, X,
  type LucideIcon,
} from "lucide-react";

interface Props {
  children: React.ReactNode;
  user: { name: string; email: string; image?: string | null; role?: string };
  orgs?: { id: string; name: string; slug: string | null; role: string }[];
  activeOrgId?: string;
}

/* ── Sidebar section definitions ─────────────────────────────────────────── */

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

interface NavSection {
  key: string;
  title: string;
  items: NavItem[];
}

function buildSections(activeOrgId?: string, hasOrgs?: boolean): NavSection[] {
  const orgBase = activeOrgId ? `/org/${activeOrgId}/settings` : "";

  const sections: NavSection[] = [
    {
      key: "account",
      title: "Account",
      items: [
        { href: "/dashboard/settings", label: "Profile", icon: User },
        { href: "/dashboard/settings/security", label: "Security", icon: Shield },
        { href: "/dashboard/settings/close-account", label: "Close Account", icon: UserX },
      ],
    },
  ];

  if (hasOrgs && activeOrgId) {
    sections.push({
      key: "organization",
      title: "Organization",
      items: [
        { href: `${orgBase}`, label: "General Settings", icon: Building2 },
        { href: `/org/${activeOrgId}`, label: "Members & Roles", icon: Users },
        { href: `/org/${activeOrgId}/invite-codes`, label: "Invite Codes", icon: UserPlus },
        { href: `/org/${activeOrgId}/keys`, label: "API Keys", icon: Key },
      ],
    });
  }

  sections.push({
    key: "developer",
    title: "Developer",
    items: [
      { href: "/dashboard/developer", label: "API Documentation", icon: FileText },
      { href: "/dashboard/developer/tokens", label: "Personal Tokens", icon: Code },
    ],
  });

  return sections;
}

/* ── Collapsible section component ───────────────────────────────────────── */

function SidebarSection({
  section,
  pathname,
  defaultOpen,
}: {
  section: NavSection;
  pathname: string;
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div style={{ marginBottom: 4 }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 16px",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.06em",
          textTransform: "uppercase" as const,
          color: "rgba(255,255,255,0.45)",
        }}
      >
        {section.title}
        <ChevronDown
          size={12}
          style={{
            transition: "transform 0.2s",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>

      {open && (
        <div style={{ padding: "0 8px 4px" }}>
          {section.items.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <a
                key={item.href}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "7px 16px",
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: active ? 600 : 400,
                  color: active ? "#fff" : "rgba(255,255,255,0.6)",
                  background: active ? "rgba(255,255,255,0.1)" : "transparent",
                  textDecoration: "none",
                  transition: "background 0.15s, color 0.15s",
                  marginBottom: 1,
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
                    (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.85)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                    (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)";
                  }
                }}
              >
                <Icon size={14} style={{ flexShrink: 0 }} />
                {item.label}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── Org Switcher ────────────────────────────────────────────────────────── */

function OrgSwitcher({
  orgs,
  activeOrgId,
}: {
  orgs: { id: string; name: string; slug: string | null; role: string }[];
  activeOrgId?: string;
}) {
  const [open, setOpen] = useState(false);
  const activeOrg = orgs.find((o) => o.id === activeOrgId);

  if (orgs.length <= 1) return null;

  return (
    <div style={{ padding: "0 16px 8px", position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 12px",
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 8,
          cursor: "pointer",
          color: "#fff",
          fontSize: 13,
          fontWeight: 500,
        }}
      >
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {activeOrg?.name ?? "Select Organization"}
        </span>
        <ChevronDown
          size={12}
          style={{
            flexShrink: 0,
            transition: "transform 0.2s",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            left: 16,
            right: 16,
            top: "100%",
            marginTop: 4,
            background: "#1a2a52",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 8,
            padding: "4px 0",
            zIndex: 50,
            boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
          }}
        >
          {orgs.map((o) => (
            <a
              key={o.id}
              href={`/dashboard/settings?org=${o.id}`}
              onClick={() => setOpen(false)}
              style={{
                display: "block",
                padding: "8px 14px",
                fontSize: 13,
                color: o.id === activeOrgId ? "#fff" : "rgba(255,255,255,0.65)",
                fontWeight: o.id === activeOrgId ? 600 : 400,
                textDecoration: "none",
                background: o.id === activeOrgId ? "rgba(255,255,255,0.08)" : "transparent",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)";
              }}
              onMouseLeave={(e) => {
                if (o.id !== activeOrgId) {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                }
              }}
            >
              {o.name}
              <span
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.35)",
                  marginLeft: 8,
                }}
              >
                {o.role}
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Main layout ─────────────────────────────────────────────────────────── */

export default function SettingsLayout({ children, user, orgs, activeOrgId }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => { setMobileOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const hasOrgs = orgs && orgs.length > 0;
  const sections = buildSections(activeOrgId, hasOrgs);

  // Determine which section contains the current page so we auto-open it
  const activeSectionKey = sections.find((s) =>
    s.items.some((item) => pathname === item.href),
  )?.key;

  async function handleSignOut() {
    await signOut();
    router.push("/sign-in");
  }

  return (
    <div className="app-layout">
      {/* Mobile header */}
      <div className="mobile-header">
        <button className="mobile-menu-btn" onClick={() => setMobileOpen(true)} aria-label="Open menu">
          <Menu size={22} />
        </button>
        <span className="mobile-header-title">Settings</span>
      </div>

      {/* Overlay */}
      <div
        className={`sidebar-overlay${mobileOpen ? " sidebar-overlay-visible" : ""}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <aside
        className={`sidebar${mobileOpen ? " sidebar-open" : ""}`}
        style={{ width: 280 }}
      >
        {/* Close button (mobile) */}
        <button className="sidebar-close-btn" onClick={() => setMobileOpen(false)} aria-label="Close menu">
          <X size={18} />
        </button>

        {/* Back to Dashboard */}
        <div style={{ padding: "16px 16px 8px" }}>
          <a
            href="/dashboard"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 13,
              color: "rgba(255,255,255,0.6)",
              textDecoration: "none",
              padding: "6px 8px",
              borderRadius: 6,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = "#fff";
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)";
              (e.currentTarget as HTMLElement).style.background = "transparent";
            }}
          >
            <ArrowLeft size={14} />
            Back to Dashboard
          </a>
        </div>

        {/* Header */}
        <div style={{ padding: "4px 20px 12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "var(--blue)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Settings size={18} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Settings</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>TruckConnect</div>
            </div>
          </div>
        </div>

        <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "0 16px 8px" }} />

        {/* Org switcher */}
        {hasOrgs && orgs!.length > 1 && (
          <OrgSwitcher orgs={orgs!} activeOrgId={activeOrgId} />
        )}

        {/* Nav sections */}
        <nav style={{ flex: 1, overflowY: "auto", paddingBottom: 8 }}>
          {sections.map((section) => (
            <SidebarSection
              key={section.key}
              section={section}
              pathname={pathname}
              defaultOpen={
                section.key === activeSectionKey ||
                section.key === "account" // always open account by default
              }
            />
          ))}
        </nav>

        {/* User footer */}
        <div style={{ padding: "12px 16px 16px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            {user.image ? (
              <img
                src={user.image}
                alt=""
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "var(--blue)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div style={{ overflow: "hidden" }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#fff",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {user.name}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.45)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {user.email}
              </div>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            style={{
              width: "100%",
              padding: "7px 12px",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8,
              color: "rgba(255,255,255,0.6)",
              fontSize: 13,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              justifyContent: "center",
            }}
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Content area ─────────────────────────────────────────────────── */}
      <main>
        {children}
      </main>
    </div>
  );
}
