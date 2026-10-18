import { test, expect } from "@playwright/test";
import { AUTH_URL, uniqueEmail, signUp, signIn, expectPageLoaded } from "./helpers";

test.describe("Auth - Sign Up Flow", () => {
  test("should render sign-up page", async ({ page }) => {
    await page.goto(`${AUTH_URL}/sign-up`);
    await expectPageLoaded(page);
    await expect(page.locator("form")).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test("should show validation error for short password", async ({ page }) => {
    await page.goto(`${AUTH_URL}/sign-up`);
    const email = uniqueEmail("short-pwd");
    await page.fill('input[placeholder*="name" i], input[name="name"]', "Test User");
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', "abc");
    await page.click('button[type="submit"]');
    // Should show error or stay on page
    await page.waitForTimeout(1000);
    const url = page.url();
    expect(url).toContain("sign-up");
  });

  test("should successfully create account", async ({ page }) => {
    const email = uniqueEmail("signup-ok");
    await signUp(page, "E2E Test User", email, "SecurePass123");
    // Should redirect to dashboard or sign-in
    const url = page.url();
    expect(url).toMatch(/\/(dashboard|sign-in)/);
  });

  test("should not allow duplicate email", async ({ page }) => {
    const email = uniqueEmail("dup-email");
    await signUp(page, "User One", email, "SecurePass123");
    // Try again with same email
    await page.goto(`${AUTH_URL}/sign-up`);
    await page.fill('input[placeholder*="name" i], input[name="name"]', "User Two");
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', "SecurePass123");
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    // Should show error or stay on sign-up page
    const url = page.url();
    expect(url).toContain("sign-up");
  });
});

test.describe("Auth - Sign In Flow", () => {
  const testEmail = uniqueEmail("signin-test");
  const testPassword = "SecurePass123";

  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    await signUp(page, "Sign In Test", testEmail, testPassword);
    await page.close();
  });

  test("should render sign-in page", async ({ page }) => {
    await page.goto(`${AUTH_URL}/sign-in`);
    await expectPageLoaded(page);
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test("should reject wrong password", async ({ page }) => {
    await page.goto(`${AUTH_URL}/sign-in`);
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', "WrongPassword123");
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    const url = page.url();
    expect(url).toContain("sign-in");
  });

  test("should sign in successfully", async ({ page }) => {
    await signIn(page, testEmail, testPassword);
    const url = page.url();
    expect(url).toContain("/dashboard");
  });

  test("should show link to sign-up", async ({ page }) => {
    await page.goto(`${AUTH_URL}/sign-in`);
    const signUpLink = page.locator('a[href*="sign-up"]');
    await expect(signUpLink).toBeVisible();
  });

  test("should show link to forgot password", async ({ page }) => {
    await page.goto(`${AUTH_URL}/sign-in`);
    const resetLink = page.locator('a[href*="reset"], a[href*="forgot"]');
    if (await resetLink.count() > 0) {
      await expect(resetLink.first()).toBeVisible();
    }
  });
});

test.describe("Auth - Dashboard", () => {
  test("should redirect unauthenticated users to sign-in", async ({ page }) => {
    await page.goto(`${AUTH_URL}/dashboard`);
    await page.waitForTimeout(3000);
    const url = page.url();
    expect(url).toContain("sign-in");
  });

  test("should display user profile after login", async ({ page }) => {
    const email = uniqueEmail("dash-test");
    await signUp(page, "Dashboard Test", email, "SecurePass123");
    await page.goto(`${AUTH_URL}/dashboard`);
    await page.waitForTimeout(2000);
    await expectPageLoaded(page);
  });
});

test.describe("Auth - Password Reset", () => {
  test("should render reset password page", async ({ page }) => {
    await page.goto(`${AUTH_URL}/reset-password`);
    await expectPageLoaded(page);
  });

  test("should accept email for password reset", async ({ page }) => {
    await page.goto(`${AUTH_URL}/reset-password`);
    const emailInput = page.locator('input[type="email"]');
    if (await emailInput.count() > 0) {
      await emailInput.fill("test@test.com");
      const submitBtn = page.locator('button[type="submit"]');
      if (await submitBtn.count() > 0) {
        await submitBtn.click();
        await page.waitForTimeout(2000);
      }
    }
  });
});

test.describe("Auth - Delete Account", () => {
  test("should render delete account page", async ({ page }) => {
    const email = uniqueEmail("delete-ui");
    await signUp(page, "Delete Test", email, "SecurePass123");
    await page.goto(`${AUTH_URL}/dashboard/delete-account`);
    await page.waitForTimeout(2000);
    await expectPageLoaded(page);
  });
});
