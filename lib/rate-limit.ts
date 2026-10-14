import { env } from "@/lib/env";

type DurationUnit = "ms" | "s" | "m" | "h" | "d" | "w";
type Duration = `${number} ${DurationUnit}` | `${number}${DurationUnit}`;

type LocalEntry = {
  count: number;
  reset: number;
};

const localRateLimitCache = new Map<string, LocalEntry>();
let didWarnAboutUpstashFallback = false;

function windowToMilliseconds(window: Duration): number {
  const match = window.match(/^(\d+)\s*(ms|s|m|h|d|w)$/);
  if (!match) return 60_000;

  const value = Number.parseInt(match[1], 10);
  const multipliers = { ms: 1, s: 1_000, m: 60_000, h: 3_600_000, d: 86_400_000, w: 604_800_000 };
  return value * multipliers[match[2] as keyof typeof multipliers];
}

function localLimit(identifier: string, limit: number, window: Duration) {
  const now = Date.now();
  const windowMs = windowToMilliseconds(window);
  const entry = localRateLimitCache.get(identifier);
  const current = !entry || entry.reset <= now ? { count: 0, reset: now + windowMs } : entry;
  current.count += 1;
  localRateLimitCache.set(identifier, current);

  return {
    success: current.count <= limit,
    limit,
    remaining: Math.max(0, limit - current.count),
    reset: current.reset,
  };
}

/**
 * Uses Upstash's HTTP pipeline directly so the chatbot works consistently in
 * Next.js and standalone server runtimes. A small local limiter keeps the
 * endpoint protected if Upstash has a transient outage.
 */
export async function checkRateLimit(
  identifier: string,
  options: { limit?: number; window?: Duration } = {}
) {
  const limit = options.limit ?? 100;
  const window = options.window ?? "1 m";
  const url = env.UPSTASH_REDIS_REST_URL;
  const token = env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  const windowMs = windowToMilliseconds(window);
  const seconds = Math.max(1, Math.ceil(windowMs / 1_000));
  const key = `paithan:ratelimit:${limit}:${window}:${identifier}`;

  try {
    const response = await fetch(`${url.replace(/\/$/, "")}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        ["INCR", key],
        ["EXPIRE", key, seconds, "NX"],
        ["TTL", key],
      ]),
      signal: AbortSignal.timeout(2_500),
    });

    if (!response.ok) throw new Error(`Upstash HTTP ${response.status}`);
    const data = (await response.json()) as Array<{ result?: number }>;
    const count = Number(data[0]?.result);
    const ttlSeconds = Math.max(0, Number(data[2]?.result) || seconds);
    if (!Number.isFinite(count)) throw new Error("Upstash returned an invalid rate-limit count");

    return {
      success: count <= limit,
      limit,
      remaining: Math.max(0, limit - count),
      reset: Date.now() + ttlSeconds * 1_000,
    };
  } catch (error) {
    if (!didWarnAboutUpstashFallback) {
      didWarnAboutUpstashFallback = true;
      console.error("[rate-limit] Upstash unavailable; using this instance's bounded fallback.", error);
    }
    return localLimit(identifier, limit, window);
  }
}

export const RATE_LIMIT_CONFIGS = {
  auth: { limit: 5, window: "1 m" as Duration },
  apiMutation: { limit: 30, window: "1 m" as Duration },
  apiRead: { limit: 100, window: "1 m" as Duration },
  grievanceTrack: { limit: 10, window: "1 m" as Duration },
} as const;
