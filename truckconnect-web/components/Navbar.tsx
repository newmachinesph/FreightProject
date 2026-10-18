"use client";

import { auth } from "@/lib/auth";
import {
  Truck,
  Package,
  Warehouse,
  Store,
  Settings,
  Shield,
  Grid3X3,
  Menu,
  X,
  LogOut,
  User,
  Activity,
} from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect, type CSSProperties, type ReactNode } from "react";

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL ?? "http://localhost:3001";

const COLORS = {
  navy: "#1B2D5E",
  navyDark: "#142248",
  blue: "#2563EB",
  blueHover: "#1d4ed8",
  white: "#ffffff",
  gray50: "#f8fafc",
  gray100: "#f1f5f9",
  gray200: "#e2e8f0",
  gray300: "#cbd5e1",
  gray400: "#94a3b8",
  gray500: "#64748b",
  gray600: "#475569",
  gray700: "#334155",
  gray800: "#1e293b",
  gray900: "#0f172a",
  green: "#059669",
  red: "#dc2626",
};

const NAV_LINKS = [
  { label: "Products", href: "/products" },
  { label: "Pricing", href: "/pricing" },
  { label: "Developers", href: "/developers" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
];

interface AppItem {
  icon: ReactNode;
  bgColor: string;
  name: string;
  url: string;
  adminOnly?: boolean;
}

const APP_ITEMS: AppItem[] = [
  { icon: <Package size={24} color={COLORS.blue} />, bgColor: "#dbeafe", name: "Shipper Portal", url: "http://localhost:3003" },
  { icon: <Truck size={24} color="#059669" />, bgColor: "#dcfce7", name: "Carrier Portal", url: "http://localhost:3004" },
  { icon: <Warehouse size={24} color="#d97706" />, bgColor: "#fef3c7", name: "Warehouse Portal", url: "http://localhost:3005" },
  { icon: <Store size={24} color="#7c3aed" />, bgColor: "#ede9fe", name: "Marketplace", url: "http://localhost:3006" },
  { icon: <Settings size={24} color={COLORS.gray600} />, bgColor: COLORS.gray100, name: "Account Settings", url: `${AUTH_URL}/dashboard` },
  { icon: <Shield size={24} color={COLORS.red} />, bgColor: "#fee2e2", name: "Admin Console", url: `${AUTH_URL}/admin`, adminOnly: true },
];

export default function Navbar() {
  const { data: session, isPending } = auth.useSession();
  const [launcherOpen, setLauncherOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const launcherRef = useRef<HTMLDivElement>(null);

  const isSignedIn = !!session?.user;
  const isSuperAdmin = session?.user?.role === "admin" || session?.user?.role === "super_admin";
  const userName = session?.user?.name ?? "";
  const userImage = session?.user?.image;

  // Close launcher on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (launcherRef.current && !launcherRef.current.contains(e.target as Node)) {
        setLauncherOpen(false);
      }
    }
    if (launcherOpen) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [launcherOpen]);

  const handleSignOut = async () => {
    localStorage.removeItem("tc_session_token");
    await auth.signOut();
    window.location.href = "/";
  };

  const visibleApps = APP_ITEMS.filter((app) => !app.adminOnly || isSuperAdmin);

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        backgroundColor: COLORS.white,
        borderBottom: `1px solid ${COLORS.gray200}`,
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 64,
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
          <Truck size={26} color={COLORS.blue} />
          <span style={{ fontSize: 22, fontWeight: 700, color: COLORS.navy }}>
            <span style={{ color: COLORS.blue }}>Truck</span>Connect
          </span>
        </Link>

        {/* Center nav links (desktop) */}
        <div style={{ display: "flex", gap: 32, alignItems: "center" }} className="hide-mobile">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              style={{
                color: COLORS.gray600,
                textDecoration: "none",
                fontSize: 15,
                fontWeight: 500,
                transition: "color 0.2s",
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {isPending ? (
            <div style={{ width: 120 }} />
          ) : isSignedIn ? (
            <>
              {/* App Launcher Grid Icon */}
              <div ref={launcherRef} style={{ position: "relative" }}>
                <button
                  onClick={() => setLauncherOpen(!launcherOpen)}
                  style={{
                    background: launcherOpen ? COLORS.gray100 : "none",
                    border: "none",
                    borderRadius: 8,
                    width: 40,
                    height: 40,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                  aria-label="Open app launcher"
                >
                  <Grid3X3 size={20} color={COLORS.gray600} />
                </button>

                {/* App Launcher Dropdown */}
                {launcherOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 8px)",
                      right: 0,
                      width: 320,
                      backgroundColor: COLORS.white,
                      borderRadius: 12,
                      boxShadow: "0 10px 40px rgba(0,0,0,0.15), 0 2px 10px rgba(0,0,0,0.08)",
                      border: `1px solid ${COLORS.gray200}`,
                      padding: 12,
                      zIndex: 1001,
                    }}
                  >
                    <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.gray400, textTransform: "uppercase", letterSpacing: 1, padding: "4px 8px 12px", borderBottom: `1px solid ${COLORS.gray100}`, marginBottom: 8 }}>
                      Apps
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 4,
                      }}
                    >
                      {visibleApps.map((app) => (
                        <a
                          key={app.name}
                          href={app.url}
                          onClick={() => setLauncherOpen(false)}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 8,
                            padding: "16px 8px",
                            borderRadius: 8,
                            textDecoration: "none",
                            transition: "background 0.15s",
                            cursor: "pointer",
                            background: "transparent",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = COLORS.gray50)}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        >
                          <div
                            style={{
                              width: 48,
                              height: 48,
                              borderRadius: 12,
                              backgroundColor: app.bgColor,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {app.icon}
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 500, color: COLORS.gray700, textAlign: "center", lineHeight: 1.3 }}>
                            {app.name}
                          </span>
                        </a>
                      ))}
                    </div>
                    {/* Sign out button at bottom */}
                    <div style={{ borderTop: `1px solid ${COLORS.gray100}`, marginTop: 8, paddingTop: 8 }}>
                      <button
                        onClick={handleSignOut}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          width: "100%",
                          padding: "10px 12px",
                          border: "none",
                          background: "transparent",
                          borderRadius: 8,
                          cursor: "pointer",
                          fontSize: 13,
                          fontWeight: 500,
                          color: COLORS.gray600,
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = COLORS.gray50)}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* User Avatar */}
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: `2px solid ${COLORS.gray200}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: COLORS.blue,
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                {userImage ? (
                  <img src={userImage} alt={userName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <span style={{ color: COLORS.white, fontSize: 14, fontWeight: 600 }}>
                    {userName.charAt(0).toUpperCase() || <User size={18} color={COLORS.white} />}
                  </span>
                )}
              </div>
            </>
          ) : (
            /* Not signed in */
            <div style={{ display: "flex", gap: 12, alignItems: "center" }} className="hide-mobile">
              <a
                href={`${AUTH_URL}/sign-in`}
                style={{
                  color: COLORS.gray700,
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: 500,
                  padding: "8px 16px",
                }}
              >
                Sign In
              </a>
              <a
                href={`${AUTH_URL}/sign-up`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 20px",
                  backgroundColor: COLORS.blue,
                  color: COLORS.white,
                  border: "none",
                  borderRadius: 6,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  textDecoration: "none",
                }}
              >
                Get Started
              </a>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: "none",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 4,
            }}
            className="show-mobile"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} color={COLORS.gray700} /> : <Menu size={24} color={COLORS.gray700} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div
          style={{
            borderTop: `1px solid ${COLORS.gray200}`,
            padding: "16px 24px",
            backgroundColor: COLORS.white,
          }}
          className="show-mobile"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  color: COLORS.gray700,
                  textDecoration: "none",
                  fontSize: 16,
                  fontWeight: 500,
                }}
              >
                {link.label}
              </Link>
            ))}
            {!isSignedIn && (
              <>
                <a
                  href={`${AUTH_URL}/sign-in`}
                  style={{ color: COLORS.gray700, textDecoration: "none", fontSize: 16, fontWeight: 500 }}
                >
                  Sign In
                </a>
                <a
                  href={`${AUTH_URL}/sign-up`}
                  style={{
                    display: "inline-block",
                    padding: "10px 20px",
                    backgroundColor: COLORS.blue,
                    color: COLORS.white,
                    borderRadius: 6,
                    fontSize: 14,
                    fontWeight: 600,
                    textDecoration: "none",
                    textAlign: "center",
                  }}
                >
                  Get Started
                </a>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        .hide-mobile { display: flex !important; }
        .show-mobile { display: none !important; }
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
          .show-mobile { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
