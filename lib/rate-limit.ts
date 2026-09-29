import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { env } from "@/lib/env";

type Duration = `${number} ${"ms" | "s" | "m" | "h" | "d" | "w"}` | `${number}${"ms" | "s" | "m" | "h" | "d" | "w"}`;

let ratelimit: Ratelimit | null = null;

function getRatelimit(): Ratelimit | null {
  if (ratelimit) return ratelimit;

  const url = env.UPSTASH_REDIS_REST_URL;
  const token = env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    console.warn("Upstash Redis not configured, rate limiting disabled");
    return null;
  }

  const redis = new Redis({ url, token });
  ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, "1 m"),
    analytics: true,
    prefix: "paithan:ratelimit",
  });

  return ratelimit;
}

function createRatelimit(limit: number, window: Duration): Ratelimit | null {
  const url = env.UPSTASH_REDIS_REST_URL;
  const token = env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return null;
  }

  const redis = new Redis({ url, token });
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(limit, window),
    analytics: true,
    prefix: "paithan:ratelimit",
  });
}

export async function checkRateLimit(
  identifier: string,
  options?: { limit?: number; window?: Duration }
): Promise<{ success: boolean; limit: number; remaining: number; reset: number } | null> {
  const rl = getRatelimit();
  if (!rl) return null;

  const limit = options?.limit ?? 100;
  const window = (options?.window ?? "1 m") as Duration;

  const customRatelimit = createRatelimit(limit, window);
  if (!customRatelimit) return null;

  return customRatelimit.limit(identifier);
}

export const RATE_LIMIT_CONFIGS = {
  auth: { limit: 5, window: "1 m" },
  apiMutation: { limit: 30, window: "1 m" },
  apiRead: { limit: 100, window: "1 m" },
} as const;