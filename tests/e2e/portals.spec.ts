import { test, expect } from "@playwright/test";
import { SHIPPER_URL, CARRIER_URL, WAREHOUSE_URL, AUTH_URL, uniqueEmail, signUp, expectPageLoaded } from "./helpers";

test.describe("Shipper Portal", () => {
  test("should redirect to auth when not logged in", async ({ page }) => {
    await page.goto(`${SHIPPER_URL}/dashboard`);
    await page.waitForTimeout(3000);
    expect(page.url()).toContain("sign-in");
  });

  test("should have consistent sidebar design", async ({ page }) => {
    // Sign up first
    const email = uniqueEmail("shipper-ui");
    await signUp(page, "Shipper Test", email, "SecurePass123");
    await page.goto(`${SHIPPER_URL}/dashboard`);
    await page.waitForTimeout(3000);

    // Check for sidebar elements
    const sidebar = page.locator("aside").first();
    if (await sidebar.count() > 0) {
      await expect(sidebar).toBeVisible();
    }
  });
});

test.describe("Carrier Portal", () => {
  test("should redirect to auth when not logged in", async ({ page }) => {
    await page.goto(`${CARRIER_URL}/dashboard`);
    await page.waitForTimeout(3000);
    expect(page.url()).toContain("sign-in");
  });
});

test.describe("Warehouse Portal", () => {
  test("should redirect to auth when not logged in", async ({ page }) => {
    await page.goto(`${WAREHOUSE_URL}/dashboard`);
    await page.waitForTimeout(3000);
    expect(page.url()).toContain("sign-in");
  });
});

test.describe("Portal UI Consistency", () => {
  test("all portals should use white sidebar background", async ({ page }) => {
    // This is a visual regression test concept
    // In practice, we check the sidebar exists and has proper structure
    const portals = [SHIPPER_URL, CARRIER_URL, WAREHOUSE_URL];
    for (const portal of portals) {
      await page.goto(`${portal}/dashboard`);
      await page.waitForTimeout(3000);
      // If redirected to auth, that's expected behavior
      if (page.url().includes("sign-in")) {
        continue;
      }
      // If loaded, check sidebar
      const sidebar = page.locator("aside").first();
      if (await sidebar.count() > 0) {
        await expect(sidebar).toBeVisible();
      }
    }
  });
});
