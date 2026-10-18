import { test, expect } from "@playwright/test";
import { AUTH_URL, WEB_URL, MARKETPLACE_URL, SHIPPER_URL, uniqueEmail, signUp, signIn, expectPageLoaded } from "./helpers";

test.describe("Journey: New User Discovery → Sign Up → Explore", () => {
  test("user discovers platform from website, signs up, explores marketplace", async ({ page }) => {
    // Step 1: User lands on website
    await page.goto(WEB_URL);
    await expectPageLoaded(page);
    await expect(page.locator("body")).toContainText("TruckConnect");

    // Step 2: User browses products
    await page.click('a[href="/products"]');
    await page.waitForTimeout(1000);
    await expect(page.locator("body")).toContainText("Shipper");

    // Step 3: User checks pricing
    await page.click('a[href="/pricing"]');
    await page.waitForTimeout(1000);
    await expect(page.locator("body")).toContainText(/free|beta/i);

    // Step 4: User clicks "Get Started" → goes to sign up
    const ctaBtn = page.locator('a[href*="sign-up"]').first();
    if (await ctaBtn.count() > 0) {
      const href = await ctaBtn.getAttribute("href");
      expect(href).toContain("sign-up");
    }

    // Step 5: Sign up
    const email = uniqueEmail("journey-discover");
    await signUp(page, "Discovery User", email, "SecurePass123");

    // Step 6: User visits marketplace to browse loads
    await page.goto(MARKETPLACE_URL);
    await expectPageLoaded(page);
    await expect(page.locator("body")).toContainText(/load|freight|marketplace/i);
  });
});

test.describe("Journey: Shipper Posts Load → Checks Marketplace", () => {
  test("shipper signs up and navigates shipper portal", async ({ page }) => {
    const email = uniqueEmail("journey-shipper");
    await signUp(page, "Manila FMCG Corp", email, "SecurePass123");

    // Navigate to shipper portal
    await page.goto(`${SHIPPER_URL}/dashboard`);
    await page.waitForTimeout(3000);

    // If redirected to sign-in, that's expected (cross-origin)
    if (page.url().includes("sign-in")) {
      // Sign in again from auth
      await signIn(page, email, "SecurePass123");
      await page.goto(`${SHIPPER_URL}/dashboard`);
      await page.waitForTimeout(3000);
    }
  });
});

test.describe("Journey: Carrier Discovery Flow", () => {
  test("carrier browses marketplace load board", async ({ page }) => {
    await page.goto(`${MARKETPLACE_URL}/loads`);
    await expectPageLoaded(page);

    // Should see load listings
    await expect(page.locator("body")).toContainText(/Manila|Cebu|load/i);

    // Try search
    const searchInput = page.locator('input[placeholder*="search" i], input[type="search"]').first();
    if (await searchInput.count() > 0) {
      await searchInput.fill("Manila");
      await page.waitForTimeout(500);
    }

    // Browse carriers
    await page.goto(`${MARKETPLACE_URL}/carriers`);
    await expectPageLoaded(page);
    await expect(page.locator("body")).toContainText(/carrier|fleet|truck/i);
  });
});

test.describe("Journey: Warehouse Discovery Flow", () => {
  test("warehouse operator browses warehouses", async ({ page }) => {
    await page.goto(`${MARKETPLACE_URL}/warehouses`);
    await expectPageLoaded(page);
    await expect(page.locator("body")).toContainText(/warehouse|storage/i);
  });
});
