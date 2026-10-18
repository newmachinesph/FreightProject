/**
 * POST /api/auth/validate-password
 *
 * Validates a password against TruckConnect's password policy.
 * Uses shared rules from @/lib/auth/constants.
 */

import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { PASSWORD_RULES, COMMON_PASSWORDS } from "@/lib/auth/constants";
import { rateLimiters } from "@/lib/redis";

async function checkBreach(password: string): Promise<boolean> {
  try {
    const sha1 = createHash("sha1").update(password).digest("hex").toUpperCase();
    const prefix = sha1.slice(0, 5);
    const suffix = sha1.slice(5);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
      signal: controller.signal,
      headers: { "Add-Padding": "true" },
    });
    clearTimeout(timer);

    if (!res.ok) return false;
    const text = await res.text();
    return text.split("\n").some(line => {
      const [hash, count] = line.trim().split(":");
      return hash === suffix && parseInt(count, 10) > 0;
    });
  } catch {
    return false; // Fail open — don't block signup if HIBP is down
  }
}

export async function POST(req: NextRequest) {
  // Rate limit by IP to prevent password enumeration
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const { success } = await rateLimiters.validatePassword.limit(ip);
    if (!success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
  } catch { /* fail open if Redis unavailable */ }

  let body: { password?: string } = {};
  try { body = await req.json(); } catch {}

  const password = body.password;
  if (!password || typeof password !== "string") {
    return NextResponse.json({ valid: false, errors: ["Password is required"], strength: "weak" });
  }

  const errors: string[] = [];
  for (const rule of PASSWORD_RULES) {
    if (!rule.test(password)) errors.push(rule.msg);
  }
  if (COMMON_PASSWORDS.has(password.toLowerCase())) {
    errors.push("This password is too common");
  }

  if (errors.length === 0) {
    const breached = await checkBreach(password);
    if (breached) {
      errors.push("This password has appeared in a data breach — choose a different one");
    }
  }

  return NextResponse.json({
    valid: errors.length === 0,
    errors,
    strength: errors.length === 0 ? "strong" : errors.length <= 1 ? "fair" : "weak",
  });
}
