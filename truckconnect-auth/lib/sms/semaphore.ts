/**
 * Semaphore SMS Gateway — Philippines
 * https://semaphore.co/docs
 *
 * Used as the SMS backend for:
 *  - Phone OTP (carrier / driver verification)
 *  - Trip status alerts (Phase 2)
 *
 * Features: 5s timeout, 2 retries with backoff
 */

const SEMAPHORE_API = "https://api.semaphore.co/api/v4/messages";
const TIMEOUT_MS = 5_000;
const MAX_RETRIES = 2;

interface SemaphoreResponse {
  message_id: number;
  user_id: number;
  user: string;
  account_id: number;
  account: string;
  recipient: string;
  message: string;
  sender_name: string;
  network: string;
  status: string;
  type: string;
  source: string;
  created_at: string;
  updated_at: string;
}

export async function sendSMS({
  to,
  message,
}: {
  to: string;
  message: string;
}): Promise<SemaphoreResponse[]> {
  const apiKey = process.env.SEMAPHORE_API_KEY;
  if (!apiKey) {
    throw new Error("[semaphore] SEMAPHORE_API_KEY is not set");
  }

  const normalized = normalizePHNumber(to);

  const body = new URLSearchParams({
    apikey: apiKey,
    number: normalized,
    message,
    sendername: process.env.SEMAPHORE_SENDER_NAME ?? "TRUCKCONNECT",
  });

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const res = await fetch(SEMAPHORE_API, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`[semaphore] HTTP ${res.status}: ${text}`);
      }

      return res.json() as Promise<SemaphoreResponse[]>;
    } catch (err: unknown) {
      clearTimeout(timer);
      lastError = err instanceof Error ? err : new Error(String(err));

      if (attempt < MAX_RETRIES && (lastError.name === "AbortError" || lastError.message.includes("fetch"))) {
        const delay = 200 * Math.pow(2, attempt);
        await new Promise(r => setTimeout(r, delay));
        continue;
      }
      break;
    }
  }

  throw lastError ?? new Error("[semaphore] Unknown failure");
}

export async function sendOTPSms({
  to,
  code,
  appName = "TruckConnect",
}: {
  to: string;
  code: string;
  appName?: string;
}) {
  const message = `Your ${appName} verification code is: ${code}. Valid for 10 minutes. Do not share this code.`;
  return sendSMS({ to, message });
}

/**
 * Normalize Philippine mobile numbers to international format (no +).
 * Accepts: 09171234567 | +639171234567 | 639171234567 | 9171234567
 * Returns: 639171234567
 * Throws: if number cannot be normalized to valid PH format
 */
export function normalizePHNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  let result: string;

  if (digits.startsWith("63") && digits.length >= 12) {
    result = digits.slice(0, 12);
  } else if (digits.startsWith("0") && digits.length >= 11) {
    result = `63${digits.slice(1, 11)}`;
  } else if (digits.length === 10 && digits.startsWith("9")) {
    result = `63${digits}`;
  } else {
    throw new Error(`[semaphore] Cannot normalize phone number: ${phone}`);
  }

  if (result.length !== 12) {
    throw new Error(`[semaphore] Invalid PH number length after normalization: ${result}`);
  }

  return result;
}
