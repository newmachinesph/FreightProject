// src/design-system.ts
var colors = {
  // Brand
  primary: "#2563EB",
  primaryLight: "#EFF6FF",
  primaryDark: "#1D4ED8",
  // Portal accent colors (each portal gets its own accent)
  shipper: "#2563EB",
  // Blue
  carrier: "#059669",
  // Green
  warehouse: "#7C3AED",
  // Purple
  marketplace: "#DB2777",
  // Pink
  // Neutrals
  white: "#FFFFFF",
  background: "#F9FAFB",
  surface: "#FFFFFF",
  border: "#E5E7EB",
  borderLight: "#F3F4F6",
  // Text
  textPrimary: "#111827",
  textSecondary: "#4B5563",
  textTertiary: "#6B7280",
  textMuted: "#9CA3AF",
  // Status
  success: "#059669",
  successLight: "#ECFDF5",
  warning: "#D97706",
  warningLight: "#FFF7ED",
  danger: "#DC2626",
  dangerLight: "#FEF2F2",
  info: "#2563EB",
  infoLight: "#EFF6FF",
  // Status badge colors
  statusOpen: "#059669",
  statusBidding: "#D97706",
  statusAwarded: "#2563EB",
  statusInTransit: "#7C3AED",
  statusDelivered: "#6B7280",
  statusDraft: "#9CA3AF",
  statusCancelled: "#DC2626"
};
var fonts = {
  family: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  size: {
    xs: 10,
    sm: 11,
    body: 13,
    md: 14,
    lg: 16,
    xl: 18,
    "2xl": 20,
    "3xl": 24,
    "4xl": 32
  },
  weight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800
  }
};
var spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40
};
var radius = {
  sm: 4,
  md: 6,
  lg: 8,
  xl: 10,
  "2xl": 12,
  full: 9999
};
var shadows = {
  sm: "0 1px 2px rgba(0,0,0,0.05)",
  md: "0 4px 6px -1px rgba(0,0,0,0.1)",
  lg: "0 10px 15px -3px rgba(0,0,0,0.1)",
  dropdown: "0 10px 25px rgba(0,0,0,0.1)"
};
var layout = {
  sidebarWidth: 260,
  mobileSidebarWidth: 280,
  topNavHeight: 56,
  mobileBreakpoint: 768,
  maxContentWidth: 1200
};
var portalConfigs = {
  shipper: {
    name: "Shipper Portal",
    label: "SHIPPER PORTAL",
    accent: "#2563EB",
    accentLight: "#EFF6FF",
    description: "Post loads & track shipments",
    port: 3003
  },
  carrier: {
    name: "Carrier Portal",
    label: "CARRIER PORTAL",
    accent: "#059669",
    accentLight: "#ECFDF5",
    description: "Manage fleet & trips",
    port: 3004
  },
  warehouse: {
    name: "Warehouse Portal",
    label: "WAREHOUSE PORTAL",
    accent: "#7C3AED",
    accentLight: "#F5F3FF",
    description: "Inventory & operations",
    port: 3005
  }
};
function getAppSwitcherItems(currentPortal) {
  const items = [
    { label: "Main Website", description: "TruckConnect home", href: "http://localhost:3000", color: "#111827", colorBg: "#F3F4F6", iconName: "LayoutGrid" },
    { label: "Marketplace", description: "Browse loads & carriers", href: "http://localhost:3006", color: "#DB2777", colorBg: "#FDF2F8", iconName: "Store" },
    { label: "Shipper Portal", description: "Post loads & track", href: "http://localhost:3003", color: "#2563EB", colorBg: "#EFF6FF", iconName: "Package" },
    { label: "Carrier Portal", description: "Manage fleet & trips", href: "http://localhost:3004", color: "#059669", colorBg: "#ECFDF5", iconName: "Truck" },
    { label: "Warehouse Portal", description: "Inventory & operations", href: "http://localhost:3005", color: "#7C3AED", colorBg: "#F5F3FF", iconName: "Warehouse" },
    { label: "Auth / Settings", description: "Account settings", href: "http://localhost:3001", color: "#6B7280", colorBg: "#F3F4F6", iconName: "Settings" }
  ];
  return items;
}
function getStatusStyle(status) {
  const map = {
    draft: { background: "#F3F4F6", color: "#6B7280", label: "Draft" },
    posted: { background: "#EFF6FF", color: "#2563EB", label: "Posted" },
    open: { background: "#ECFDF5", color: "#059669", label: "Open" },
    bidding: { background: "#FFF7ED", color: "#D97706", label: "Bidding" },
    awarded: { background: "#EFF6FF", color: "#2563EB", label: "Awarded" },
    in_transit: { background: "#F5F3FF", color: "#7C3AED", label: "In Transit" },
    delivered: { background: "#F3F4F6", color: "#6B7280", label: "Delivered" },
    cancelled: { background: "#FEF2F2", color: "#DC2626", label: "Cancelled" }
  };
  return map[status] ?? map.draft;
}
function getDashboardStyles(portal) {
  const config = portalConfigs[portal];
  return {
    layout: { display: "flex", minHeight: "100vh", fontFamily: fonts.family },
    loading: { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", color: colors.textTertiary, fontSize: fonts.size.lg },
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
      overflowY: "auto"
    },
    sidebarHeader: { display: "flex", alignItems: "center", gap: 10, marginBottom: 12, padding: "0 8px" },
    sidebarBrand: { fontSize: fonts.size.xl, fontWeight: fonts.weight.extrabold, color: colors.textPrimary },
    sidebarLabel: {
      fontSize: fonts.size.xs,
      fontWeight: fonts.weight.bold,
      color: colors.textMuted,
      letterSpacing: 1,
      padding: "12px 8px 8px",
      marginTop: 8,
      borderTop: `1px solid ${colors.borderLight}`,
      textTransform: "uppercase"
    },
    nav: { display: "flex", flexDirection: "column", gap: 2, flex: 1 },
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
      transition: "background 0.15s, color 0.15s"
    },
    navActive: { background: config.accentLight, color: config.accent, fontWeight: fonts.weight.semibold },
    sidebarUser: { display: "flex", alignItems: "center", gap: 10, padding: "12px 8px", borderTop: `1px solid ${colors.border}`, marginTop: 8 },
    avatar: {
      width: 36,
      height: 36,
      borderRadius: "50%",
      background: config.accent,
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: fonts.weight.bold,
      fontSize: fonts.size.md
    },
    main: { flex: 1, padding: "0 32px 28px 32px", overflowY: "auto", background: colors.background },
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
      zIndex: 40
    },
    mobileMenuBtn: { display: "none", background: "none", border: "none", cursor: "pointer", padding: 4 },
    appSwitcherBtn: {
      background: "none",
      border: `1px solid ${colors.border}`,
      borderRadius: radius.lg,
      padding: "6px 8px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
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
      padding: 8
    },
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
      marginBottom: 4
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
      paddingBottom: 4
    },
    switcherItem: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "8px 12px",
      textDecoration: "none",
      cursor: "pointer",
      borderRadius: radius.md,
      margin: "2px 4px"
    },
    mobileOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.4)", zIndex: 100, display: "flex" },
    mobileSidebar: {
      width: layout.mobileSidebarWidth,
      background: colors.white,
      padding: "24px 16px",
      display: "flex",
      flexDirection: "column",
      position: "relative",
      height: "100%",
      overflowY: "auto"
    },
    // ─── Card Styles ───
    statsGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 },
    statCard: {
      background: colors.white,
      border: `1px solid ${colors.border}`,
      borderRadius: radius["2xl"],
      padding: "20px 24px"
    },
    statLabel: { fontSize: fonts.size.sm, color: colors.textMuted, fontWeight: fonts.weight.medium, marginBottom: 4 },
    statValue: { fontSize: fonts.size["2xl"], fontWeight: fonts.weight.bold, color: colors.textPrimary },
    card: {
      background: colors.white,
      border: `1px solid ${colors.border}`,
      borderRadius: radius["2xl"],
      padding: 24
    },
    cardTitle: { fontSize: fonts.size.lg, fontWeight: fonts.weight.semibold, color: colors.textPrimary, marginBottom: 16 },
    // ─── Table Styles ───
    table: { width: "100%", borderCollapse: "collapse", fontSize: fonts.size.body },
    th: {
      textAlign: "left",
      padding: "10px 16px",
      fontSize: fonts.size.sm,
      fontWeight: fonts.weight.semibold,
      color: colors.textMuted,
      borderBottom: `1px solid ${colors.border}`,
      background: colors.background,
      textTransform: "uppercase",
      letterSpacing: 0.5
    },
    td: { padding: "12px 16px", borderBottom: `1px solid ${colors.borderLight}`, color: colors.textSecondary },
    // ─── Button Styles ───
    primaryButton: {
      background: config.accent,
      color: "#fff",
      border: "none",
      borderRadius: radius.lg,
      padding: "10px 20px",
      fontSize: fonts.size.md,
      fontWeight: fonts.weight.semibold,
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      gap: 8
    },
    secondaryButton: {
      background: colors.white,
      color: colors.textSecondary,
      border: `1px solid ${colors.border}`,
      borderRadius: radius.lg,
      padding: "10px 20px",
      fontSize: fonts.size.md,
      fontWeight: fonts.weight.medium,
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      gap: 8
    },
    dangerButton: {
      background: colors.danger,
      color: "#fff",
      border: "none",
      borderRadius: radius.lg,
      padding: "10px 20px",
      fontSize: fonts.size.md,
      fontWeight: fonts.weight.semibold,
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      gap: 8
    },
    // ─── Badge ───
    badge: {
      display: "inline-flex",
      alignItems: "center",
      padding: "2px 10px",
      borderRadius: radius.full,
      fontSize: fonts.size.sm,
      fontWeight: fonts.weight.semibold
    },
    // ─── Form ───
    formGroup: { marginBottom: 16 },
    formLabel: { display: "block", fontSize: fonts.size.body, fontWeight: fonts.weight.medium, color: colors.textPrimary, marginBottom: 6 },
    formInput: {
      width: "100%",
      padding: "10px 14px",
      borderRadius: radius.lg,
      border: `1px solid ${colors.border}`,
      fontSize: fonts.size.md,
      color: colors.textPrimary,
      outline: "none",
      boxSizing: "border-box"
    },
    formSelect: {
      width: "100%",
      padding: "10px 14px",
      borderRadius: radius.lg,
      border: `1px solid ${colors.border}`,
      fontSize: fonts.size.md,
      color: colors.textPrimary,
      background: colors.white,
      outline: "none",
      boxSizing: "border-box"
    },
    // ─── Page Header ───
    pageHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
    pageTitle: { fontSize: fonts.size["3xl"], fontWeight: fonts.weight.bold, color: colors.textPrimary },
    pageSubtitle: { fontSize: fonts.size.md, color: colors.textTertiary, marginTop: 4 },
    // ─── Empty State ───
    emptyState: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "60px 20px",
      textAlign: "center"
    },
    emptyStateTitle: { fontSize: fonts.size.lg, fontWeight: fonts.weight.semibold, color: colors.textPrimary, marginTop: 16, marginBottom: 8 },
    emptyStateText: { fontSize: fonts.size.md, color: colors.textTertiary, maxWidth: 400 },
    // ─── Filters ───
    filterBar: { display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" },
    filterPill: {
      padding: "6px 14px",
      borderRadius: radius.full,
      border: `1px solid ${colors.border}`,
      background: colors.white,
      fontSize: fonts.size.body,
      fontWeight: fonts.weight.medium,
      color: colors.textSecondary,
      cursor: "pointer"
    },
    filterPillActive: {
      background: config.accentLight,
      color: config.accent,
      borderColor: config.accent,
      fontWeight: fonts.weight.semibold
    },
    // ─── Search ───
    searchInput: {
      padding: "10px 14px 10px 40px",
      borderRadius: radius.lg,
      border: `1px solid ${colors.border}`,
      fontSize: fonts.size.md,
      color: colors.textPrimary,
      background: colors.white,
      width: 320,
      outline: "none",
      boxSizing: "border-box"
    }
  };
}
export {
  colors,
  fonts,
  getAppSwitcherItems,
  getDashboardStyles,
  getStatusStyle,
  layout,
  portalConfigs,
  radius,
  shadows,
  spacing
};
