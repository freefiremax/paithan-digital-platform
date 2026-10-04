import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { env } from "@/lib/env";

type Duration = `${number} ${"ms" | "s" | "m" | "h" | "d" | "w"}` | `${number}${"ms" | "s" | "m" | "h" | "d" | "w"}`;

let redisClient: Redis | null = null;
const ratelimitCache = new Map<string, Ratelimit>();

function getRedisClient(): Redis | null {
  if (redisClient) return redisClient;

  const url = env.UPSTASH_REDIS_REST_URL;
  const token = env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    console.warn("Upstash Redis not configured, rate limiting disabled");
    return null;
  }

  redisClient = new Redis({ url, token });
  return redisClient;
}

function getCacheKey(limit: number, window: Duration): string {
  return `${limit}:${window}`;
}

function getOrCreateRatelimit(limit: number, window: Duration): Ratelimit | null {
  const client = getRedisClient();
  if (!client) return null;

  const cacheKey = getCacheKey(limit, window);
  const cached = ratelimitCache.get(cacheKey);
  if (cached) return cached;

  const ratelimit = new Ratelimit({
    redis: client,
    limiter: Ratelimit.slidingWindow(limit, window),
    prefix: "paithan:ratelimit",
  });

  ratelimitCache.set(cacheKey, ratelimit);
  return ratelimit;
}

export async function checkRateLimit(
  identifier: string,
  options?: { limit?: number; window?: Duration }
): Promise<{ success: boolean; limit: number; remaining: number; reset: number } | null> {
  const limit = options?.limit ?? 100;
  const window = (options?.window ?? "1 m") as Duration;

  const ratelimit = getOrCreateRatelimit(limit, window);
  if (!ratelimit) return null;

  return ratelimit.limit(identifier);
}

export const RATE_LIMIT_CONFIGS = {
  auth: { limit: 5, window: "1 m" },
  apiMutation: { limit: 30, window: "1 m" },
  apiRead: { limit: 100, window: "1 m" },
  grievanceTrack: { limit: 10, window: "1 m" },
} as const;