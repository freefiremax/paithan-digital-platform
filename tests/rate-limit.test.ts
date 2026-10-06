import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { checkRateLimit, RATE_LIMIT_CONFIGS } from "@/lib/rate-limit";
import { Ratelimit } from "@upstash/ratelimit";

vi.mock("@upstash/ratelimit");
vi.mock("@/lib/env", () => ({
  env: {
    UPSTASH_REDIS_REST_URL: "https://test.upstash.io",
    UPSTASH_REDIS_REST_TOKEN: "test-token",
  },
}));

describe("Rate Limiter", () => {
  const mockLimit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (Ratelimit as unknown as ReturnType<typeof vi.fn>).mockImplementation(function (this: unknown) {
      return {
        limit: mockLimit,
      };
    });
  });

  afterEach(() => {
    vi.resetModules();
  });

  describe("checkRateLimit", () => {
    it("should return rate limit result when successful", async () => {
      mockLimit.mockResolvedValue({
        success: true,
        limit: 100,
        remaining: 99,
        reset: Date.now() + 60000,
      });

      const result = await checkRateLimit("test-identifier", { limit: 100, window: "1 m" });
      expect(result).toEqual({
        success: true,
        limit: 100,
        remaining: 99,
        reset: expect.any(Number),
      });
    });

    it("should return rate limit result when limited", async () => {
      mockLimit.mockResolvedValue({
        success: false,
        limit: 100,
        remaining: 0,
        reset: Date.now() + 60000,
      });

      const result = await checkRateLimit("test-identifier", { limit: 100, window: "1 m" });
      expect(result).toEqual({
        success: false,
        limit: 100,
        remaining: 0,
        reset: expect.any(Number),
      });
    });
  });

  describe("RATE_LIMIT_CONFIGS", () => {
    it("should have correct configs", () => {
      expect(RATE_LIMIT_CONFIGS.auth).toEqual({ limit: 5, window: "1 m" });
      expect(RATE_LIMIT_CONFIGS.apiMutation).toEqual({ limit: 30, window: "1 m" });
      expect(RATE_LIMIT_CONFIGS.apiRead).toEqual({ limit: 100, window: "1 m" });
    });
  });
});