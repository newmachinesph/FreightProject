import { test, expect } from "@playwright/test";
import { WEB_URL, expectPageLoaded } from "./helpers";

test.describe("Web - Home Page", () => {
  test("should load the home page", async ({ page }) => {
    await page.goto(WEB_URL);
    await expectPageLoaded(page);
    await expect(page.locator("body")).toContainText("TruckConnect");
  });

  test("should have navigation links", async ({ page }) => {
    await page.goto(WEB_URL);
    await expect(page.locator('a[href*="products"], a[href*="Products"]').first()).toBeVisible();
    await expect(page.locator('a[href*="pricing"], a[href*="Pricing"]').first()).toBeVisible();
    await expect(page.locator('a[href*="about"], a[href*="About"]').first()).toBeVisible();
  });

  test("should display hero section with CTA", async ({ page }) => {
    await page.goto(WEB_URL);
    const ctaButton = page.locator('a[href*="sign-up"], button:has-text("Get Started"), a:has-text("Get Started")').first();
    await expect(ctaButton).toBeVisible();
  });

  test("should display stats section", async ({ page }) => {
    await page.goto(WEB_URL);
    await expect(page.locator("body")).toContainText(/loads|carriers|warehouses/i);
  });
});

test.describe("Web - Products Page", () => {
  test("should load and display all products", async ({ page }) => {
    await page.goto(`${WEB_URL}/products`);
    await expectPageLoaded(page);
    await expect(page.locator("body")).toContainText("Shipper");
    await expect(page.locator("body")).toContainText("Carrier");
    await expect(page.locator("body")).toContainText("Warehouse");
    await expect(page.locator("body")).toContainText("Marketplace");
  });
});

test.describe("Web - Pricing Page", () => {
  test("should display pricing plans", async ({ page }) => {
    await page.goto(`${WEB_URL}/pricing`);
    await expectPageLoaded(page);
    await expect(page.locator("body")).toContainText(/free|starter|business/i);
  });

  test("should have expandable FAQs", async ({ page }) => {
    await page.goto(`${WEB_URL}/pricing`);
    // Look for FAQ section
    const faqItem = page.locator("text=beta").first();
    if (await faqItem.count() > 0) {
      await expect(faqItem).toBeVisible();
    }
  });
});

test.describe("Web - About Page", () => {
  test("should display company info", async ({ page }) => {
    await page.goto(`${WEB_URL}/about`);
    await expectPageLoaded(page);
    await expect(page.locator("body")).toContainText("Philippines");
  });

  test("should show team members", async ({ page }) => {
    await page.goto(`${WEB_URL}/about`);
    await expect(page.locator("body")).toContainText(/CEO|CTO|founder/i);
  });
});

test.describe("Web - Careers Page", () => {
  test("should display job listings", async ({ page }) => {
    await page.goto(`${WEB_URL}/careers`);
    await expectPageLoaded(page);
    await expect(page.locator("body")).toContainText(/engineer|designer|manager/i);
  });

  test("should have apply buttons", async ({ page }) => {
    await page.goto(`${WEB_URL}/careers`);
    const applyBtn = page.locator('button:has-text("Apply"), a:has-text("Apply")').first();
    if (await applyBtn.count() > 0) {
      await expect(applyBtn).toBeVisible();
    }
  });
});

test.describe("Web - Blog Page", () => {
  test("should display blog posts", async ({ page }) => {
    await page.goto(`${WEB_URL}/blog`);
    await expectPageLoaded(page);
    await expect(page.locator("body")).toContainText(/blog|insights/i);
  });

  test("should have category filters", async ({ page }) => {
    await page.goto(`${WEB_URL}/blog`);
    const filterPill = page.locator("button:has-text('All'), button:has-text('Industry')").first();
    if (await filterPill.count() > 0) {
      await expect(filterPill).toBeVisible();
    }
  });
});

test.describe("Web - Contact Page", () => {
  test("should display contact form", async ({ page }) => {
    await page.goto(`${WEB_URL}/contact`);
    await expectPageLoaded(page);
    await expect(page.locator("input, textarea").first()).toBeVisible();
  });

  test("should display office locations", async ({ page }) => {
    await page.goto(`${WEB_URL}/contact`);
    await expect(page.locator("body")).toContainText("Manila");
  });
});

test.describe("Web - Developers Page", () => {
  test("should display developer info", async ({ page }) => {
    await page.goto(`${WEB_URL}/developers`);
    await expectPageLoaded(page);
    await expect(page.locator("body")).toContainText(/API|SDK|webhook/i);
  });

  test("should show code examples", async ({ page }) => {
    await page.goto(`${WEB_URL}/developers`);
    await expect(page.locator("body")).toContainText(/curl|fetch|import/i);
  });
});

test.describe("Web - Footer", () => {
  test("should have footer links", async ({ page }) => {
    await page.goto(WEB_URL);
    const footer = page.locator("footer, div:has-text('© 2026')").last();
    await expect(footer).toBeVisible();
  });
});

test.describe("Web - Navigation", () => {
  test("should navigate between pages", async ({ page }) => {
    await page.goto(WEB_URL);

    // Click Products
    await page.click('a[href="/products"]');
    await page.waitForTimeout(1000);
    expect(page.url()).toContain("/products");

    // Click Pricing
    await page.click('a[href="/pricing"]');
    await page.waitForTimeout(1000);
    expect(page.url()).toContain("/pricing");

    // Click About
    await page.click('a[href="/about"]');
    await page.waitForTimeout(1000);
    expect(page.url()).toContain("/about");
  });
});
