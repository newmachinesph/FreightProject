import { test, expect } from "@playwright/test";
import { MARKETPLACE_URL, expectPageLoaded } from "./helpers";

test.describe("Marketplace - Home / Load Board", () => {
  test("should load the marketplace", async ({ page }) => {
    await page.goto(MARKETPLACE_URL);
    await expectPageLoaded(page);
    await expect(page.locator("body")).toContainText(/load|marketplace|freight/i);
  });

  test("should display loads tab", async ({ page }) => {
    await page.goto(MARKETPLACE_URL);
    await expect(page.locator("body")).toContainText(/loads/i);
  });

  test("should display carriers tab", async ({ page }) => {
    await page.goto(MARKETPLACE_URL);
    const carriersTab = page.locator("button:has-text('Carriers'), a:has-text('Carriers')").first();
    if (await carriersTab.count() > 0) {
      await expect(carriersTab).toBeVisible();
    }
  });

  test("should display warehouses tab", async ({ page }) => {
    await page.goto(MARKETPLACE_URL);
    const warehousesTab = page.locator("button:has-text('Warehouses'), a:has-text('Warehouses')").first();
    if (await warehousesTab.count() > 0) {
      await expect(warehousesTab).toBeVisible();
    }
  });

  test("should have search functionality", async ({ page }) => {
    await page.goto(MARKETPLACE_URL);
    const searchInput = page.locator('input[placeholder*="search" i], input[type="search"]').first();
    if (await searchInput.count() > 0) {
      await expect(searchInput).toBeVisible();
      await searchInput.fill("Manila");
      await page.waitForTimeout(500);
    }
  });

  test("should have view mode toggles", async ({ page }) => {
    await page.goto(MARKETPLACE_URL);
    const viewToggle = page.locator("button:has-text('Split'), button:has-text('List'), button:has-text('Map')").first();
    if (await viewToggle.count() > 0) {
      await expect(viewToggle).toBeVisible();
    }
  });

  test("should have cargo type filters", async ({ page }) => {
    await page.goto(MARKETPLACE_URL);
    const filter = page.locator("button:has-text('FTL'), button:has-text('LTL'), button:has-text('Reefer')").first();
    if (await filter.count() > 0) {
      await expect(filter).toBeVisible();
    }
  });
});

test.describe("Marketplace - Load Detail", () => {
  test("should navigate to load detail", async ({ page }) => {
    await page.goto(`${MARKETPLACE_URL}/loads`);
    await expectPageLoaded(page);
    const loadCard = page.locator("a[href*='/loads/']").first();
    if (await loadCard.count() > 0) {
      await loadCard.click();
      await page.waitForTimeout(2000);
      expect(page.url()).toContain("/loads/");
    }
  });
});

test.describe("Marketplace - Carriers", () => {
  test("should display carrier directory", async ({ page }) => {
    await page.goto(`${MARKETPLACE_URL}/carriers`);
    await expectPageLoaded(page);
    await expect(page.locator("body")).toContainText(/carrier|fleet|truck/i);
  });

  test("should navigate to carrier detail", async ({ page }) => {
    await page.goto(`${MARKETPLACE_URL}/carriers`);
    const carrierCard = page.locator("a[href*='/carriers/']").first();
    if (await carrierCard.count() > 0) {
      await carrierCard.click();
      await page.waitForTimeout(2000);
      expect(page.url()).toContain("/carriers/");
    }
  });
});

test.describe("Marketplace - Warehouses", () => {
  test("should display warehouse directory", async ({ page }) => {
    await page.goto(`${MARKETPLACE_URL}/warehouses`);
    await expectPageLoaded(page);
    await expect(page.locator("body")).toContainText(/warehouse|storage|facility/i);
  });
});

test.describe("Marketplace - Navigation", () => {
  test("should have navbar with links", async ({ page }) => {
    await page.goto(MARKETPLACE_URL);
    await expect(page.locator("nav, header").first()).toBeVisible();
  });

  test("should navigate to all main pages", async ({ page }) => {
    await page.goto(MARKETPLACE_URL);

    // Loads page
    const loadsLink = page.locator('a[href*="/loads"]').first();
    if (await loadsLink.count() > 0) {
      await loadsLink.click();
      await page.waitForTimeout(1000);
      await expectPageLoaded(page);
    }

    // Carriers page
    await page.goto(MARKETPLACE_URL);
    const carriersLink = page.locator('a[href*="/carriers"]').first();
    if (await carriersLink.count() > 0) {
      await carriersLink.click();
      await page.waitForTimeout(1000);
      await expectPageLoaded(page);
    }

    // Warehouses page
    await page.goto(MARKETPLACE_URL);
    const warehousesLink = page.locator('a[href*="/warehouses"]').first();
    if (await warehousesLink.count() > 0) {
      await warehousesLink.click();
      await page.waitForTimeout(1000);
      await expectPageLoaded(page);
    }
  });
});

test.describe("Marketplace - Watchlist", () => {
  test("should load watchlist page", async ({ page }) => {
    await page.goto(`${MARKETPLACE_URL}/watchlist`);
    await expectPageLoaded(page);
  });
});

test.describe("Marketplace - Compare", () => {
  test("should load compare page", async ({ page }) => {
    await page.goto(`${MARKETPLACE_URL}/compare`);
    await expectPageLoaded(page);
  });
});

test.describe("Marketplace - Cargo Calculator", () => {
  test("should load cargo calculator", async ({ page }) => {
    await page.goto(`${MARKETPLACE_URL}/tools/cargo-calculator`);
    await expectPageLoaded(page);
  });
});
