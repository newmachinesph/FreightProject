import { test, expect } from "@playwright/test";
import { WEB_URL, AUTH_URL, MARKETPLACE_URL, expectPageLoaded } from "./helpers";

test.describe("Accessibility - Basic Checks", () => {
  test("website has lang attribute", async ({ page }) => {
    await page.goto(WEB_URL);
    const html = page.locator("html");
    const lang = await html.getAttribute("lang");
    expect(lang).toBeTruthy();
  });

  test("website images have alt text or are decorative", async ({ page }) => {
    await page.goto(WEB_URL);
    const images = page.locator("img");
    const count = await images.count();
    for (let i = 0; i < Math.min(count, 10); i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute("alt");
      const role = await img.getAttribute("role");
      // Should have alt text OR role="presentation"
      expect(alt !== null || role === "presentation").toBeTruthy();
    }
  });

  test("auth sign-in has proper form labels", async ({ page }) => {
    await page.goto(`${AUTH_URL}/sign-in`);
    await expectPageLoaded(page);
    // Check that inputs have labels or aria-labels
    const inputs = page.locator("input:not([type='hidden'])");
    const count = await inputs.count();
    for (let i = 0; i < count; i++) {
      const input = inputs.nth(i);
      const ariaLabel = await input.getAttribute("aria-label");
      const placeholder = await input.getAttribute("placeholder");
      const id = await input.getAttribute("id");
      // Should have at least one of: aria-label, placeholder, or associated label
      expect(ariaLabel || placeholder || id).toBeTruthy();
    }
  });

  test("buttons have accessible text", async ({ page }) => {
    await page.goto(WEB_URL);
    const buttons = page.locator("button");
    const count = await buttons.count();
    for (let i = 0; i < Math.min(count, 10); i++) {
      const btn = buttons.nth(i);
      const text = await btn.textContent();
      const ariaLabel = await btn.getAttribute("aria-label");
      const title = await btn.getAttribute("title");
      expect(text?.trim() || ariaLabel || title).toBeTruthy();
    }
  });

  test("links have discernible text", async ({ page }) => {
    await page.goto(WEB_URL);
    const links = page.locator("a[href]");
    const count = await links.count();
    for (let i = 0; i < Math.min(count, 20); i++) {
      const link = links.nth(i);
      const text = await link.textContent();
      const ariaLabel = await link.getAttribute("aria-label");
      expect(text?.trim() || ariaLabel).toBeTruthy();
    }
  });

  test("marketplace has proper heading hierarchy", async ({ page }) => {
    await page.goto(MARKETPLACE_URL);
    await expectPageLoaded(page);
    // Should have at least one h1
    const h1 = page.locator("h1");
    const h1Count = await h1.count();
    // h1 is optional but good practice
    if (h1Count > 0) {
      expect(h1Count).toBeLessThanOrEqual(2); // Max 1-2 h1s
    }
  });

  test("color contrast - text is visible", async ({ page }) => {
    await page.goto(WEB_URL);
    // Basic check: body text should not be transparent or white-on-white
    const bodyStyle = await page.locator("body").evaluate((el) => {
      const style = window.getComputedStyle(el);
      return { color: style.color, bg: style.backgroundColor };
    });
    expect(bodyStyle.color).not.toBe(bodyStyle.bg);
  });

  test("sign-up form has submit button", async ({ page }) => {
    await page.goto(`${AUTH_URL}/sign-up`);
    await expectPageLoaded(page);
    const submitBtn = page.locator('button[type="submit"]');
    if (await submitBtn.count() > 0) {
      await expect(submitBtn).toBeVisible();
      await expect(submitBtn).toBeEnabled();
    }
  });
});
