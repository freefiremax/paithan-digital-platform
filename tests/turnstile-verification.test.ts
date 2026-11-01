import { afterEach, describe, expect, it, vi } from "vitest";
vi.mock("@/lib/env", () => ({ env: { TURNSTILE_SECRET_KEY: "test-secret" } }));
import { verifyTurnstileToken } from "@/lib/turnstile";

afterEach(() => vi.unstubAllGlobals());

describe("Turnstile verification", () => {
  it("does not trust client-generated fallback tokens", async () => {
    const fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: false }) });
    vi.stubGlobal("fetch", fetch);
    expect(await verifyTurnstileToken("cf_fallback_123_reg")).toBe(false);
    expect(fetch).toHaveBeenCalledOnce();
  });
  it("accepts a token only after successful server verification", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: true }) }));
    expect(await verifyTurnstileToken("real-challenge-token")).toBe(true);
  });
});
