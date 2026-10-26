import { afterEach, describe, expect, it, vi } from "vitest";
vi.mock("@/lib/env", () => ({ env: { TURNSTILE_SECRET_KEY: "unit-secret" } }));
import { verifyTurnstileToken } from "@/lib/turnstile";

describe("Turnstile server validation", () => {
  afterEach(() => vi.unstubAllGlobals());
  it("rejects missing and oversized tokens without calling Cloudflare", async () => {
    const fetchMock = vi.fn(); vi.stubGlobal("fetch", fetchMock);
    for (const token of [undefined, "", " ", "x".repeat(2049)]) {
      expect(await verifyTurnstileToken(token)).toBe(false);
    }
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it("accepts only successful Cloudflare validation and sends credentials server-side", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('{"success":true}'));
    vi.stubGlobal("fetch", fetchMock);
    expect(await verifyTurnstileToken("browser-token")).toBe(true);
    const options = fetchMock.mock.calls[0][1];
    expect(options.body.get("secret")).toBe("unit-secret");
    expect(options.body.get("response")).toBe("browser-token");
    expect(options.signal).toBeInstanceOf(AbortSignal);
    expect(options.cache).toBe("no-store");
  });
  it.each([
    [200, '{"success":false,"error-codes":["timeout-or-duplicate"]}'],
    [500, '{"success":true}'], [200, "null"], [200, "not-json"],
  ])("fails closed for HTTP %s and body %s", async (status, body) => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(body, { status })));
    expect(await verifyTurnstileToken("browser-token")).toBe(false);
  });
  it("rejects network failures", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    expect(await verifyTurnstileToken("browser-token")).toBe(false);
  });
});
