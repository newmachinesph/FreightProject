declare const colors: {
    readonly primary: "#2563EB";
    readonly primaryLight: "#EFF6FF";
    readonly primaryDark: "#1D4ED8";
    readonly shipper: "#2563EB";
    readonly carrier: "#059669";
    readonly warehouse: "#7C3AED";
    readonly marketplace: "#DB2777";
    readonly white: "#FFFFFF";
    readonly background: "#F9FAFB";
    readonly surface: "#FFFFFF";
    readonly border: "#E5E7EB";
    readonly borderLight: "#F3F4F6";
    readonly textPrimary: "#111827";
    readonly textSecondary: "#4B5563";
    readonly textTertiary: "#6B7280";
    readonly textMuted: "#9CA3AF";
    readonly success: "#059669";
    readonly successLight: "#ECFDF5";
    readonly warning: "#D97706";
    readonly warningLight: "#FFF7ED";
    readonly danger: "#DC2626";
    readonly dangerLight: "#FEF2F2";
    readonly info: "#2563EB";
    readonly infoLight: "#EFF6FF";
    readonly statusOpen: "#059669";
    readonly statusBidding: "#D97706";
    readonly statusAwarded: "#2563EB";
    readonly statusInTransit: "#7C3AED";
    readonly statusDelivered: "#6B7280";
    readonly statusDraft: "#9CA3AF";
    readonly statusCancelled: "#DC2626";
};
declare const fonts: {
    readonly family: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    readonly size: {
        readonly xs: 10;
        readonly sm: 11;
        readonly body: 13;
        readonly md: 14;
        readonly lg: 16;
        readonly xl: 18;
        readonly "2xl": 20;
        readonly "3xl": 24;
        readonly "4xl": 32;
    };
    readonly weight: {
        readonly normal: 400;
        readonly medium: 500;
        readonly semibold: 600;
        readonly bold: 700;
        readonly extrabold: 800;
    };
};
declare const spacing: {
    readonly xs: 4;
    readonly sm: 8;
    readonly md: 12;
    readonly lg: 16;
    readonly xl: 20;
    readonly "2xl": 24;
    readonly "3xl": 32;
    readonly "4xl": 40;
};
declare const radius: {
    readonly sm: 4;
    readonly md: 6;
    readonly lg: 8;
    readonly xl: 10;
    readonly "2xl": 12;
    readonly full: 9999;
};
declare const shadows: {
    readonly sm: "0 1px 2px rgba(0,0,0,0.05)";
    readonly md: "0 4px 6px -1px rgba(0,0,0,0.1)";
    readonly lg: "0 10px 15px -3px rgba(0,0,0,0.1)";
    readonly dropdown: "0 10px 25px rgba(0,0,0,0.1)";
};
declare const layout: {
    readonly sidebarWidth: 260;
    readonly mobileSidebarWidth: 280;
    readonly topNavHeight: 56;
    readonly mobileBreakpoint: 768;
    readonly maxContentWidth: 1200;
};
type PortalType = "shipper" | "carrier" | "warehouse";
interface PortalConfig {
    name: string;
    label: string;
    accent: string;
    accentLight: string;
    description: string;
    port: number;
}
declare const portalConfigs: Record<PortalType, PortalConfig>;
interface AppSwitcherItem {
    label: string;
    description: string;
    href: string;
    color: string;
    colorBg: string;
    iconName: string;
}
declare function getAppSwitcherItems(currentPortal?: PortalType): AppSwitcherItem[];
type LoadStatus = "draft" | "posted" | "open" | "bidding" | "awarded" | "in_transit" | "delivered" | "cancelled";
declare function getStatusStyle(status: LoadStatus): {
    background: string;
    color: string;
    label: string;
};
declare function getDashboardStyles(portal: PortalType): {
    layout: {
        display: "flex";
        minHeight: string;
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    };
    loading: {
        display: "flex";
        justifyContent: "center";
        alignItems: "center";
        height: string;
        color: "#6B7280";
        fontSize: 16;
    };
    sidebar: {
        width: 260;
        background: "#FFFFFF";
        borderRight: string;
        padding: string;
        display: "flex";
        flexDirection: "column";
        position: "sticky";
        top: number;
        height: string;
        overflowY: "auto";
    };
    sidebarHeader: {
        display: "flex";
        alignItems: "center";
        gap: number;
        marginBottom: number;
        padding: string;
    };
    sidebarBrand: {
        fontSize: 18;
        fontWeight: 800;
        color: "#111827";
    };
    sidebarLabel: {
        fontSize: 10;
        fontWeight: 700;
        color: "#9CA3AF";
        letterSpacing: number;
        padding: string;
        marginTop: number;
        borderTop: string;
        textTransform: "uppercase";
    };
    nav: {
        display: "flex";
        flexDirection: "column";
        gap: number;
        flex: number;
    };
    navItem: {
        display: "flex";
        alignItems: "center";
        gap: number;
        padding: string;
        borderRadius: 8;
        fontSize: 14;
        color: "#4B5563";
        textDecoration: string;
        fontWeight: 500;
        transition: string;
    };
    navActive: {
        background: string;
        color: string;
        fontWeight: 600;
    };
    sidebarUser: {
        display: "flex";
        alignItems: "center";
        gap: number;
        padding: string;
        borderTop: string;
        marginTop: number;
    };
    avatar: {
        width: number;
        height: number;
        borderRadius: string;
        background: string;
        color: string;
        display: "flex";
        alignItems: "center";
        justifyContent: "center";
        fontWeight: 700;
        fontSize: 14;
    };
    main: {
        flex: number;
        padding: string;
        overflowY: "auto";
        background: "#F9FAFB";
    };
    topNav: {
        display: "flex";
        alignItems: "center";
        justifyContent: "flex-end";
        padding: string;
        marginBottom: number;
        height: 56;
        position: "sticky";
        top: number;
        background: "#F9FAFB";
        zIndex: number;
    };
    mobileMenuBtn: {
        display: "none";
        background: string;
        border: string;
        cursor: string;
        padding: number;
    };
    appSwitcherBtn: {
        background: string;
        border: string;
        borderRadius: 8;
        padding: string;
        cursor: string;
        display: "flex";
        alignItems: "center";
        justifyContent: "center";
    };
    appSwitcherDropdown: {
        position: "absolute";
        top: string;
        right: number;
        background: "#FFFFFF";
        border: string;
        borderRadius: 12;
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)";
        zIndex: number;
        marginTop: number;
        width: number;
        padding: number;
    };
    switcherBtn: {
        display: "flex";
        alignItems: "center";
        justifyContent: "space-between";
        width: string;
        padding: string;
        background: "#F9FAFB";
        border: string;
        borderRadius: 8;
        cursor: string;
        marginBottom: number;
    };
    switcherDropdown: {
        position: "absolute";
        top: string;
        left: number;
        right: number;
        background: "#FFFFFF";
        border: string;
        borderRadius: 8;
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)";
        zIndex: number;
        marginTop: number;
        paddingBottom: number;
    };
    switcherItem: {
        display: "flex";
        alignItems: "center";
        gap: number;
        padding: string;
        textDecoration: string;
        cursor: string;
        borderRadius: 6;
        margin: string;
    };
    mobileOverlay: {
        position: "fixed";
        top: number;
        left: number;
        right: number;
        bottom: number;
        background: string;
        zIndex: number;
        display: "flex";
    };
    mobileSidebar: {
        width: 280;
        background: "#FFFFFF";
        padding: string;
        display: "flex";
        flexDirection: "column";
        position: "relative";
        height: string;
        overflowY: "auto";
    };
    statsGrid: {
        display: "grid";
        gridTemplateColumns: string;
        gap: number;
    };
    statCard: {
        background: "#FFFFFF";
        border: string;
        borderRadius: 12;
        padding: string;
    };
    statLabel: {
        fontSize: 11;
        color: "#9CA3AF";
        fontWeight: 500;
        marginBottom: number;
    };
    statValue: {
        fontSize: 20;
        fontWeight: 700;
        color: "#111827";
    };
    card: {
        background: "#FFFFFF";
        border: string;
        borderRadius: 12;
        padding: number;
    };
    cardTitle: {
        fontSize: 16;
        fontWeight: 600;
        color: "#111827";
        marginBottom: number;
    };
    table: {
        width: string;
        borderCollapse: "collapse";
        fontSize: 13;
    };
    th: {
        textAlign: "left";
        padding: string;
        fontSize: 11;
        fontWeight: 600;
        color: "#9CA3AF";
        borderBottom: string;
        background: "#F9FAFB";
        textTransform: "uppercase";
        letterSpacing: number;
    };
    td: {
        padding: string;
        borderBottom: string;
        color: "#4B5563";
    };
    primaryButton: {
        background: string;
        color: string;
        border: string;
        borderRadius: 8;
        padding: string;
        fontSize: 14;
        fontWeight: 600;
        cursor: string;
        display: "inline-flex";
        alignItems: "center";
        gap: number;
    };
    secondaryButton: {
        background: "#FFFFFF";
        color: "#4B5563";
        border: string;
        borderRadius: 8;
        padding: string;
        fontSize: 14;
        fontWeight: 500;
        cursor: string;
        display: "inline-flex";
        alignItems: "center";
        gap: number;
    };
    dangerButton: {
        background: "#DC2626";
        color: string;
        border: string;
        borderRadius: 8;
        padding: string;
        fontSize: 14;
        fontWeight: 600;
        cursor: string;
        display: "inline-flex";
        alignItems: "center";
        gap: number;
    };
    badge: {
        display: "inline-flex";
        alignItems: "center";
        padding: string;
        borderRadius: 9999;
        fontSize: 11;
        fontWeight: 600;
    };
    formGroup: {
        marginBottom: number;
    };
    formLabel: {
        display: "block";
        fontSize: 13;
        fontWeight: 500;
        color: "#111827";
        marginBottom: number;
    };
    formInput: {
        width: string;
        padding: string;
        borderRadius: 8;
        border: string;
        fontSize: 14;
        color: "#111827";
        outline: string;
        boxSizing: "border-box";
    };
    formSelect: {
        width: string;
        padding: string;
        borderRadius: 8;
        border: string;
        fontSize: 14;
        color: "#111827";
        background: "#FFFFFF";
        outline: string;
        boxSizing: "border-box";
    };
    pageHeader: {
        display: "flex";
        justifyContent: "space-between";
        alignItems: "center";
        marginBottom: number;
    };
    pageTitle: {
        fontSize: 24;
        fontWeight: 700;
        color: "#111827";
    };
    pageSubtitle: {
        fontSize: 14;
        color: "#6B7280";
        marginTop: number;
    };
    emptyState: {
        display: "flex";
        flexDirection: "column";
        alignItems: "center";
        justifyContent: "center";
        padding: string;
        textAlign: "center";
    };
    emptyStateTitle: {
        fontSize: 16;
        fontWeight: 600;
        color: "#111827";
        marginTop: number;
        marginBottom: number;
    };
    emptyStateText: {
        fontSize: 14;
        color: "#6B7280";
        maxWidth: number;
    };
    filterBar: {
        display: "flex";
        gap: number;
        marginBottom: number;
        flexWrap: "wrap";
    };
    filterPill: {
        padding: string;
        borderRadius: 9999;
        border: string;
        background: "#FFFFFF";
        fontSize: 13;
        fontWeight: 500;
        color: "#4B5563";
        cursor: string;
    };
    filterPillActive: {
        background: string;
        color: string;
        borderColor: string;
        fontWeight: 600;
    };
    searchInput: {
        padding: string;
        borderRadius: 8;
        border: string;
        fontSize: 14;
        color: "#111827";
        background: "#FFFFFF";
        width: number;
        outline: string;
        boxSizing: "border-box";
    };
};

export { type AppSwitcherItem, type LoadStatus, type PortalConfig, type PortalType, colors, fonts, getAppSwitcherItems, getDashboardStyles, getStatusStyle, layout, portalConfigs, radius, shadows, spacing };
