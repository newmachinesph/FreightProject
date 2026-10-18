import { NextRequest, NextResponse } from "next/server";
import { getOtp, clearOtp } from "@/lib/sms/dev-store";
import { normalizePHNumber } from "@/lib/sms/semaphore";

/**
 * Dev-only endpoint — returns the last OTP sent to a given phone number.
 * Used by Python test scripts to retrieve the generated code without SMS.
 *
 * Returns 404 in production (DEV_STATIC_OTP not set).
 *
 * GET  /api/test/otp?phone=639171234567          → { code: "847291" }
 * DELETE /api/test/otp?phone=639171234567        → clears stored OTP
 */

function guardDev() {
  if (process.env.NODE_ENV === "production" || !process.env.DEV_STATIC_OTP) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return null;
}

export function GET(req: NextRequest) {
  const guard = guardDev();
  if (guard) return guard;

  const rawPhone = req.nextUrl.searchParams.get("phone");
  if (!rawPhone) {
    return NextResponse.json({ error: "Missing ?phone=" }, { status: 400 });
  }
  const phone = normalizePHNumber(rawPhone);

  const code = getOtp(phone);
  if (!code) {
    return NextResponse.json(
      { error: `No OTP found for ${phone}` },
      { status: 404 }
    );
  }

  return NextResponse.json({ phone, code });
}

export function DELETE(req: NextRequest) {
  const guard = guardDev();
  if (guard) return guard;

  const rawPhone = req.nextUrl.searchParams.get("phone");
  if (!rawPhone) {
    return NextResponse.json({ error: "Missing ?phone=" }, { status: 400 });
  }

  clearOtp(normalizePHNumber(rawPhone));
  return NextResponse.json({ cleared: true });
}
