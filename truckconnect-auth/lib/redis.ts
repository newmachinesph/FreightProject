import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

/**
 * Lazy-initialized Redis client.
 * Returns null if UPSTASH_REDIS_REST_URL is not configured — app won't crash.
 */
let _redis: Redis | null = null;

function getRedis(): Redis | null {
  if (_redis) return _redis;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  _redis = new Redis({ url, token });
  return _redis;
}

export { getRedis as redis };

/**
 * Factory to create rate limiters with different configs.
 * Returns a no-op limiter if Redis is not configured — fail open.
 */
function createRateLimiter(prefix: string, maxRequests: number, windowSec: number) {
  return {
    async limit(key: string): Promise<{ success: boolean }> {
      const redis = getRedis();
      if (!redis) return { success: true }; // Fail open
      const rl = new Ratelimit({
        redis,
        limiter: Ratelimit.fixedWindow(maxRequests, `${windowSec} s`),
        prefix: `tc:rl:${prefix}`,
        analytics: true,
      });
      return rl.limit(key);
    },
  };
}

// Pre-configured limiters
export const rateLimiters = {
  signIn: createRateLimiter("sign-in", 10, 300),        // 10/5min
  signUp: createRateLimiter("sign-up", 20, 3600),       // 20/60min
  otp: createRateLimiter("otp", 5, 600),                // 5/10min
  passwordReset: createRateLimiter("pwd-reset", 5, 900), // 5/15min
  apiKey: createRateLimiter("api-key", 60, 60),          // 60/1min
  validatePassword: createRateLimiter("val-pwd", 20, 60), // 20/1min
  metadata: createRateLimiter("metadata", 30, 60),       // 30/1min
  avatar: createRateLimiter("avatar", 10, 60),           // 10/1min
  sessions: createRateLimiter("sessions", 20, 60),       // 20/1min
  otpPhone: createRateLimiter("otp-phone", 3, 300),     // 3/5min per phone
};
