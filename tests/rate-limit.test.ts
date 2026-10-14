import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/env", () => ({
  env: {
    UPSTASH_REDIS_REST_URL: "https://test.upstash.io",
    UPSTASH_REDIS_REST_TOKEN: "test-token",
  },
}));

import { checkRateLimit, RATE_LIMIT_CONFIGS } from "@/lib/rate-limit";

describe("Rate Limiter", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("uses the Upstash REST pipeline result", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify([{ result: 100 }, { result: 1 }, { result: 59 }]), { status: 200 })
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(checkRateLimit("test-identifier", { limit: 100, window: "1 m" })).resolves.toEqual({
      success: true,
      limit: 100,
      remaining: 0,
      reset: expect.any(Number),
    });
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("uses a bounded local limiter when Upstash is unavailable", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));

    await expect(checkRateLimit("offline-test", { limit: 1, window: "1 m" })).resolves.toMatchObject({
      success: true,
      limit: 1,
      remaining: 0,
    });
    await expect(checkRateLimit("offline-test", { limit: 1, window: "1 m" })).resolves.toMatchObject({
      success: false,
      limit: 1,
      remaining: 0,
    });
  });

  it("keeps the route policies stable", () => {
    expect(RATE_LIMIT_CONFIGS.auth).toEqual({ limit: 5, window: "1 m" });
    expect(RATE_LIMIT_CONFIGS.apiMutation).toEqual({ limit: 30, window: "1 m" });
    expect(RATE_LIMIT_CONFIGS.apiRead).toEqual({ limit: 100, window: "1 m" });
  });
});
