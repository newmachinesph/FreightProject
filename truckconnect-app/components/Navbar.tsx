"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Truck,
  Package,
  Warehouse as WarehouseIcon,
  LayoutGrid,
  X,
  User,
  Bell,
  Settings,
  Globe,
  Send,
  ShoppingBag,
  Menu,
  Star,
  Columns,
  LogOut,
  Search,
} from "lucide-react";
import { useSession, signOut } from "@/lib/auth";

const navLinks = [
  { label: "Load Board", href: "/" },
  { label: "Carriers", href: "/carriers" },
  { label: "Warehouses", href: "/warehouses" },
  { label: "Companies", href: "/company" },
  { label: "Cargo Calculator", href: "/tools/cargo-calculator" },
  { label: "Rate Calculator", href: "/tools/rate-calculator" },
  { label: "My Activity", href: "/activity" },
  { label: "Watchlist", href: "/watchlist" },
  { label: "Compare", href: "/compare" },
  { label: "Reviews", href: "/reviews" },
];

const appSwitcherItems = [
  { label: "Main Website",     description: "Landing & marketing site", icon: Globe,          href: "http://localhost:3000", color: "#0ea5e9" },
  { label: "Auth / Settings",  description: "Account & security",       icon: Settings,       href: "http://localhost:3001", color: "#64748b" },
  { label: "Shipper Portal",   description: "Post loads & manage bids", icon: Send,           href: "http://localhost:3003", color: "#f59e0b" },
  { label: "Carrier Portal",   description: "Find & accept loads",      icon: Truck,          href: "http://localhost:3004", color: "#059669" },
  { label: "Warehouse Portal", description: "Inventory & operations",   icon: WarehouseIcon,  href: "http://localhost:3005", color: "#7c3aed" },
  { label: "Marketplace",      description: "Freight marketplace",      icon: ShoppingBag,    href: "http://localhost:3006", color: "#2563eb", active: true },
];

interface NavbarProps {
  active?: string;
}

export default function Navbar({ active }: NavbarProps) {
  const [showAppSwitcher, setShowAppSwitcher] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const session = useSession();
  const isSignedIn = session?.data?.user != null;
  const userName = session?.data?.user?.name ?? "";
  const userInitial = userName ? userName.charAt(0).toUpperCase() : "";

  const authUrl = process.env.NEXT_PUBLIC_AUTH_URL ?? "http://localhost:3001";

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        height: 56,
        minHeight: 56,
        backgroundColor: "#0f172a",
        zIndex: 50,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        position: "sticky",
        top: 0,
      }}
    >
      {/* Left: Logo + Links */}
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "linear-gradient(135deg, #2563eb, #3b82f6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 12px rgba(37,99,235,0.4)",
            }}
          >
            <Truck size={18} color="#ffffff" strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: 17, fontWeight: 700, color: "#ffffff", letterSpacing: -0.3 }}>TruckConnect</span>
        </a>

        <div style={{ width: 1, height: 24, backgroundColor: "rgba(255,255,255,0.1)" }} />

        <div className="mp-nav-links" style={{ display: "flex", gap: 2 }}>
          {navLinks.map((link) => {
            const isActive = active === link.label;
            return (
              <a
                key={link.label}
                href={link.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 14px",
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? "#ffffff" : "#94a3b8",
                  backgroundColor: isActive ? "rgba(255,255,255,0.1)" : "transparent",
                  textDecoration: "none",
                  transition: "all 0.15s",
                }}
              >
                {link.label}
              </a>
            );
          })}
        </div>
      </div>

      {/* Search */}
      <div className="mp-nav-search" style={{ position: "relative", display: "flex", alignItems: "center" }}>
        <Search
          size={14}
          color="#64748b"
          style={{ position: "absolute", left: 10, pointerEvents: "none" }}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && searchQuery.trim()) {
              router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            }
          }}
          placeholder="Search loads, carriers, warehouses..."
          style={{
            width: 240,
            height: 32,
            paddingLeft: 32,
            paddingRight: 32,
            borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.12)",
            backgroundColor: "rgba(255,255,255,0.06)",
            color: "#e2e8f0",
            fontSize: 12,
            outline: "none",
          }}
        />
        {searchQuery && (
          <button
            onClick={() => {
              if (searchQuery.trim()) {
                router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
              }
            }}
            style={{
              position: "absolute",
              right: 6,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 4,
            }}
            title="Search"
          >
            <Search size={13} color="#94a3b8" />
          </button>
        )}
      </div>

      {/* Right */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {/* App Switcher */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowAppSwitcher(!showAppSwitcher)}
            style={{
              border: "none",
              background: showAppSwitcher ? "rgba(255,255,255,0.1)" : "none",
              cursor: "pointer",
              padding: 8,
              borderRadius: 6,
              display: "flex",
            }}
            title="Switch App"
          >
            <LayoutGrid size={18} color={showAppSwitcher ? "#93c5fd" : "#64748b"} />
          </button>
          {showAppSwitcher && (
            <div
              style={{
                position: "absolute",
                top: 44,
                right: 0,
                width: 300,
                background: "#1e293b",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
                padding: 10,
                zIndex: 100,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, padding: "0 4px" }}>
                <span style={{ fontSize: 10, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5 }}>Switch App</span>
                <button onClick={() => setShowAppSwitcher(false)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2, display: "flex" }}>
                  <X size={12} color="#64748b" />
                </button>
              </div>
              {appSwitcherItems.map((app) => {
                const AppIcon = app.icon;
                return (
                  <a
                    key={app.label}
                    href={app.href}
                    onClick={() => setShowAppSwitcher(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "8px 10px",
                      borderRadius: 8,
                      textDecoration: "none",
                      background: app.active ? "rgba(37,99,235,0.12)" : "transparent",
                      cursor: "pointer",
                      marginBottom: 2,
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        background: `${app.color}20`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <AppIcon size={16} color={app.color} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>
                        {app.label}
                        {app.active && (
                          <span style={{
                            marginLeft: 6,
                            fontSize: 9,
                            fontWeight: 700,
                            color: "#60a5fa",
                            backgroundColor: "rgba(37,99,235,0.2)",
                            padding: "1px 6px",
                            borderRadius: 4,
                            textTransform: "uppercase",
                            letterSpacing: 0.5,
                          }}>
                            Current
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 10, color: "#64748b" }}>{app.description}</div>
                    </div>
                  </a>
                );
              })}
            </div>
          )}
        </div>

        {/* Notification Bell */}
        <button style={{ border: "none", background: "none", cursor: "pointer", padding: 8, borderRadius: 6, display: "flex", position: "relative" }}>
          <Bell size={18} color="#64748b" />
          <span
            style={{
              position: "absolute",
              top: 4,
              right: 4,
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: "#ef4444",
              border: "2px solid #0f172a",
            }}
          />
        </button>

        {/* User / Auth */}
        {isSignedIn ? (
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 10px 4px 4px",
                borderRadius: 9999,
                backgroundColor: "rgba(255,255,255,0.06)",
                cursor: "pointer",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#ffffff",
                }}
              >
                {userInitial || <User size={14} color="#ffffff" />}
              </div>
              <span style={{ fontSize: 12, fontWeight: 500, color: "#cbd5e1" }}>{userName || "User"}</span>
            </div>
            <button
              onClick={() => signOut()}
              style={{
                border: "none",
                background: "none",
                cursor: "pointer",
                padding: 6,
                borderRadius: 6,
                display: "flex",
              }}
              title="Sign Out"
            >
              <LogOut size={16} color="#64748b" />
            </button>
          </div>
        ) : (
          <a
            href={authUrl}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 10px 4px 4px",
              borderRadius: 9999,
              backgroundColor: "rgba(255,255,255,0.06)",
              cursor: "pointer",
              border: "1px solid rgba(255,255,255,0.08)",
              textDecoration: "none",
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <User size={14} color="#ffffff" />
            </div>
            <span style={{ fontSize: 12, fontWeight: 500, color: "#cbd5e1" }}>Sign In</span>
          </a>
        )}

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="mp-mobile-menu-btn"
          style={{ display: "none", background: "none", border: "none", cursor: "pointer", padding: 4 }}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={22} color="#94a3b8" /> : <Menu size={22} color="#94a3b8" />}
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="mp-mobile-menu" style={{
          position: "absolute", top: 56, left: 0, right: 0,
          background: "#0f172a", borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "12px 24px 16px", zIndex: 51,
        }}>
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} onClick={() => setMobileMenuOpen(false)} style={{
              display: "block", padding: "10px 0", fontSize: 14, fontWeight: active === link.label ? 600 : 400,
              color: active === link.label ? "#ffffff" : "#94a3b8", textDecoration: "none",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}>
              {link.label}
            </a>
          ))}
        </div>
      )}

      <style>{`
        .mp-nav-links { display: flex !important; }
        .mp-mobile-menu-btn { display: none !important; }
        .mp-nav-search { display: flex !important; }
        .mp-nav-search input::placeholder { color: #64748b; }
        .mp-nav-search input:focus { border-color: rgba(59,130,246,0.5); background-color: rgba(255,255,255,0.1); }
        @media (max-width: 768px) {
          .mp-nav-links { display: none !important; }
          .mp-mobile-menu-btn { display: flex !important; }
          .mp-nav-search { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
