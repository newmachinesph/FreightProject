import { test, expect } from "@playwright/test";
import { WEB_URL, AUTH_URL, MARKETPLACE_URL, expectPageLoaded } from "./helpers";

test.describe("Responsive - Mobile (375px)", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("website home page renders on mobile", async ({ page }) => {
    await page.goto(WEB_URL);
    await expectPageLoaded(page);
    // Hamburger menu should be visible on mobile
    const hamburger = page.locator('button[aria-label*="menu" i], .show-mobile').first();
    if (await hamburger.count() > 0) {
      await expect(hamburger).toBeVisible();
    }
  });

  test("sign-in page works on mobile", async ({ page }) => {
    await page.goto(`${AUTH_URL}/sign-in`);
    await expectPageLoaded(page);
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test("marketplace loads on mobile", async ({ page }) => {
    await page.goto(MARKETPLACE_URL);
    await expectPageLoaded(page);
    await expect(page.locator("body")).toContainText(/load|freight|marketplace/i);
  });

  test("website pricing page renders on mobile", async ({ page }) => {
    await page.goto(`${WEB_URL}/pricing`);
    await expectPageLoaded(page);
    await expect(page.locator("body")).toContainText(/free|starter|business/i);
  });

  test("website about page renders on mobile", async ({ page }) => {
    await page.goto(`${WEB_URL}/about`);
    await expectPageLoaded(page);
  });
});

test.describe("Responsive - Tablet (768px)", () => {
  test.use({ viewport: { width: 768, height: 1024 } });

  test("website renders on tablet", async ({ page }) => {
    await page.goto(WEB_URL);
    await expectPageLoaded(page);
  });

  test("marketplace renders on tablet", async ({ page }) => {
    await page.goto(MARKETPLACE_URL);
    await expectPageLoaded(page);
  });

  test("sign-up page renders on tablet", async ({ page }) => {
    await page.goto(`${AUTH_URL}/sign-up`);
    await expectPageLoaded(page);
  });
});

test.describe("Responsive - Desktop (1440px)", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("website renders on large desktop", async ({ page }) => {
    await page.goto(WEB_URL);
    await expectPageLoaded(page);
    // Desktop nav should be visible
    const desktopNav = page.locator(".hide-mobile").first();
    if (await desktopNav.count() > 0) {
      await expect(desktopNav).toBeVisible();
    }
  });

  test("marketplace renders on large desktop", async ({ page }) => {
    await page.goto(MARKETPLACE_URL);
    await expectPageLoaded(page);
  });
});
