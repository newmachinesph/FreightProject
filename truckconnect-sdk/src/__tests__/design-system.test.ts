import { describe, it, expect } from "vitest";
import {
  colors, fonts, spacing, radius, shadows, layout,
  portalConfigs, getAppSwitcherItems, getStatusStyle, getDashboardStyles
} from "../design-system";

describe("Colors", () => {
  it("has all required color categories", () => {
    expect(colors.primary).toBe("#2563EB");
    expect(colors.shipper).toBe("#2563EB");
    expect(colors.carrier).toBe("#059669");
    expect(colors.warehouse).toBe("#7C3AED");
    expect(colors.white).toBe("#FFFFFF");
    expect(colors.background).toBe("#F9FAFB");
  });

  it("has valid hex color format for all colors", () => {
    const hexRegex = /^#[0-9A-Fa-f]{6}$/;
    Object.entries(colors).forEach(([key, value]) => {
      expect(value).toMatch(hexRegex);
    });
  });

  it("has status colors defined", () => {
    expect(colors.success).toBe("#059669");
    expect(colors.warning).toBe("#D97706");
    expect(colors.danger).toBe("#DC2626");
    expect(colors.info).toBe("#2563EB");
  });

  it("has text hierarchy colors", () => {
    expect(colors.textPrimary).toBe("#111827");
    expect(colors.textSecondary).toBe("#4B5563");
    expect(colors.textTertiary).toBe("#6B7280");
    expect(colors.textMuted).toBe("#9CA3AF");
  });
});

describe("Fonts", () => {
  it("has a font family defined", () => {
    expect(fonts.family).toBeTruthy();
    expect(fonts.family).toContain("sans-serif");
  });

  it("has size scale from xs to 4xl", () => {
    expect(fonts.size.xs).toBe(10);
    expect(fonts.size.body).toBe(13);
    expect(fonts.size["4xl"]).toBe(32);
  });

  it("has weight scale", () => {
    expect(fonts.weight.normal).toBe(400);
    expect(fonts.weight.bold).toBe(700);
    expect(fonts.weight.extrabold).toBe(800);
  });
});

describe("Spacing", () => {
  it("has spacing scale from xs to 4xl", () => {
    expect(spacing.xs).toBe(4);
    expect(spacing.sm).toBe(8);
    expect(spacing.md).toBe(12);
    expect(spacing.lg).toBe(16);
    expect(spacing["4xl"]).toBe(40);
  });
});

describe("Radius", () => {
  it("has radius scale", () => {
    expect(radius.sm).toBe(4);
    expect(radius.md).toBe(6);
    expect(radius.full).toBe(9999);
  });
});

describe("Shadows", () => {
  it("has shadow variants", () => {
    expect(shadows.sm).toBeTruthy();
    expect(shadows.md).toBeTruthy();
    expect(shadows.lg).toBeTruthy();
    expect(shadows.dropdown).toBeTruthy();
  });

  it("shadows contain rgba values", () => {
    Object.values(shadows).forEach((shadow) => {
      expect(shadow).toContain("rgba");
    });
  });
});

describe("Portal Configs", () => {
  it("has configs for all three portals", () => {
    expect(portalConfigs.shipper).toBeDefined();
    expect(portalConfigs.carrier).toBeDefined();
    expect(portalConfigs.warehouse).toBeDefined();
  });

  it("has correct accent colors", () => {
    expect(portalConfigs.shipper.accent).toBe("#2563EB");
    expect(portalConfigs.carrier.accent).toBe("#059669");
    expect(portalConfigs.warehouse.accent).toBe("#7C3AED");
  });

  it("has correct port numbers", () => {
    expect(portalConfigs.shipper.port).toBe(3003);
    expect(portalConfigs.carrier.port).toBe(3004);
    expect(portalConfigs.warehouse.port).toBe(3005);
  });

  it("has names and labels for all portals", () => {
    const portals = ["shipper", "carrier", "warehouse"] as const;
    portals.forEach((portal) => {
      expect(portalConfigs[portal].name).toBeTruthy();
      expect(portalConfigs[portal].label).toBeTruthy();
      expect(portalConfigs[portal].description).toBeTruthy();
    });
  });

  it("has accent light colors for all portals", () => {
    expect(portalConfigs.shipper.accentLight).toBe("#EFF6FF");
    expect(portalConfigs.carrier.accentLight).toBe("#ECFDF5");
    expect(portalConfigs.warehouse.accentLight).toBe("#F5F3FF");
  });
});

describe("getAppSwitcherItems", () => {
  it("returns 6 items", () => {
    const items = getAppSwitcherItems();
    expect(items.length).toBe(6);
  });

  it("includes all portals", () => {
    const items = getAppSwitcherItems();
    const labels = items.map(i => i.label);
    expect(labels).toContain("Shipper Portal");
    expect(labels).toContain("Carrier Portal");
    expect(labels).toContain("Warehouse Portal");
    expect(labels).toContain("Marketplace");
  });

  it("includes auth/settings and main website", () => {
    const items = getAppSwitcherItems();
    const labels = items.map(i => i.label);
    expect(labels).toContain("Main Website");
    expect(labels).toContain("Auth / Settings");
  });

  it("each item has required fields", () => {
    const items = getAppSwitcherItems();
    items.forEach((item) => {
      expect(item.label).toBeTruthy();
      expect(item.description).toBeTruthy();
      expect(item.href).toBeTruthy();
      expect(item.color).toBeTruthy();
      expect(item.colorBg).toBeTruthy();
      expect(item.iconName).toBeTruthy();
    });
  });
});

describe("getStatusStyle", () => {
  it("returns correct styles for all statuses", () => {
    const statuses = ["draft", "posted", "open", "bidding", "awarded", "in_transit", "delivered", "cancelled"] as const;
    statuses.forEach(status => {
      const style = getStatusStyle(status);
      expect(style.background).toBeTruthy();
      expect(style.color).toBeTruthy();
      expect(style.label).toBeTruthy();
    });
  });

  it("has green for open status", () => {
    const style = getStatusStyle("open");
    expect(style.color).toBe("#059669");
    expect(style.label).toBe("Open");
  });

  it("has correct label for in_transit", () => {
    const style = getStatusStyle("in_transit");
    expect(style.label).toBe("In Transit");
    expect(style.color).toBe("#7C3AED");
  });

  it("has red for cancelled status", () => {
    const style = getStatusStyle("cancelled");
    expect(style.color).toBe("#DC2626");
    expect(style.label).toBe("Cancelled");
  });

  it("has amber for bidding status", () => {
    const style = getStatusStyle("bidding");
    expect(style.color).toBe("#D97706");
    expect(style.label).toBe("Bidding");
  });
});

describe("getDashboardStyles", () => {
  it("returns styles object for each portal", () => {
    const portals = ["shipper", "carrier", "warehouse"] as const;
    portals.forEach(portal => {
      const styles = getDashboardStyles(portal);
      expect(styles.layout).toBeDefined();
      expect(styles.sidebar).toBeDefined();
      expect(styles.navItem).toBeDefined();
      expect(styles.primaryButton).toBeDefined();
    });
  });

  it("uses portal accent color in primary button", () => {
    const shipperStyles = getDashboardStyles("shipper");
    expect(shipperStyles.primaryButton.background).toBe("#2563EB");

    const carrierStyles = getDashboardStyles("carrier");
    expect(carrierStyles.primaryButton.background).toBe("#059669");

    const warehouseStyles = getDashboardStyles("warehouse");
    expect(warehouseStyles.primaryButton.background).toBe("#7C3AED");
  });

  it("all portals use white sidebar", () => {
    const portals = ["shipper", "carrier", "warehouse"] as const;
    portals.forEach(portal => {
      const styles = getDashboardStyles(portal);
      expect(styles.sidebar.background).toBe("#FFFFFF");
    });
  });

  it("sidebar width matches layout constant", () => {
    const portals = ["shipper", "carrier", "warehouse"] as const;
    portals.forEach(portal => {
      const styles = getDashboardStyles(portal);
      expect(styles.sidebar.width).toBe(layout.sidebarWidth);
    });
  });

  it("has table styles", () => {
    const styles = getDashboardStyles("shipper");
    expect(styles.table).toBeDefined();
    expect(styles.th).toBeDefined();
    expect(styles.td).toBeDefined();
  });

  it("has form styles", () => {
    const styles = getDashboardStyles("carrier");
    expect(styles.formGroup).toBeDefined();
    expect(styles.formLabel).toBeDefined();
    expect(styles.formInput).toBeDefined();
    expect(styles.formSelect).toBeDefined();
  });

  it("has card styles", () => {
    const styles = getDashboardStyles("warehouse");
    expect(styles.card).toBeDefined();
    expect(styles.cardTitle).toBeDefined();
    expect(styles.statCard).toBeDefined();
    expect(styles.statsGrid).toBeDefined();
  });

  it("has button variants", () => {
    const styles = getDashboardStyles("shipper");
    expect(styles.primaryButton).toBeDefined();
    expect(styles.secondaryButton).toBeDefined();
    expect(styles.dangerButton).toBeDefined();
    expect(styles.dangerButton.background).toBe("#DC2626");
  });

  it("has empty state styles", () => {
    const styles = getDashboardStyles("carrier");
    expect(styles.emptyState).toBeDefined();
    expect(styles.emptyStateTitle).toBeDefined();
    expect(styles.emptyStateText).toBeDefined();
  });
});

describe("Layout Constants", () => {
  it("has correct sidebar width", () => {
    expect(layout.sidebarWidth).toBe(260);
  });

  it("has correct mobile breakpoint", () => {
    expect(layout.mobileBreakpoint).toBe(768);
  });

  it("has correct top nav height", () => {
    expect(layout.topNavHeight).toBe(56);
  });

  it("has max content width", () => {
    expect(layout.maxContentWidth).toBe(1200);
  });

  it("mobile sidebar is wider than desktop sidebar", () => {
    expect(layout.mobileSidebarWidth).toBeGreaterThan(layout.sidebarWidth);
  });
});
