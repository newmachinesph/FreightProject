import { Page, expect } from "@playwright/test";

export const AUTH_URL = "http://localhost:3001";
export const WEB_URL = "http://localhost:3000";
export const SHIPPER_URL = "http://localhost:3003";
export const CARRIER_URL = "http://localhost:3004";
export const WAREHOUSE_URL = "http://localhost:3005";
export const MARKETPLACE_URL = "http://localhost:3006";

export function uniqueEmail(prefix: string): string {
  return `${prefix}-${Date.now()}@test.com`;
}

export async function signUp(page: Page, name: string, email: string, password: string) {
  await page.goto(`${AUTH_URL}/sign-up`);
  await page.fill('input[name="name"], input[placeholder*="name" i]', name);
  await page.fill('input[name="email"], input[placeholder*="email" i], input[type="email"]', email);
  await page.fill('input[name="password"], input[placeholder*="password" i], input[type="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/(dashboard|sign-in)/, { timeout: 10000 });
}

export async function signIn(page: Page, email: string, password: string) {
  await page.goto(`${AUTH_URL}/sign-in`);
  await page.fill('input[name="email"], input[placeholder*="email" i], input[type="email"]', email);
  await page.fill('input[name="password"], input[placeholder*="password" i], input[type="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/dashboard/, { timeout: 10000 });
}

export async function expectPageLoaded(page: Page) {
  await expect(page).not.toHaveTitle(/error/i);
  const body = page.locator("body");
  await expect(body).toBeVisible();
}
