/**
 * Dev-only OTP store — writes to a temp JSON file so the test endpoint
 * can read it even across Next.js HMR reloads.
 *
 * NEVER imported in production (guarded by DEV_STATIC_OTP env flag).
 */
import { readFileSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

const STORE_PATH = join(tmpdir(), "truckconnect-dev-otps.json");

function read(): Record<string, string> {
  try {
    return JSON.parse(readFileSync(STORE_PATH, "utf8"));
  } catch {
    return {};
  }
}

export function storeOtp(phone: string, code: string) {
  const data = read();
  data[phone] = code;
  writeFileSync(STORE_PATH, JSON.stringify(data, null, 2));
}

export function getOtp(phone: string): string | undefined {
  return read()[phone];
}

export function clearOtp(phone: string) {
  const data = read();
  delete data[phone];
  writeFileSync(STORE_PATH, JSON.stringify(data, null, 2));
}
