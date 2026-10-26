import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
vi.mock("@/lib/turnstile", () => ({ verifyTurnstileToken: vi.fn() }));
vi.mock("@/lib/rate-limit", () => ({ checkRateLimit: vi.fn() }));
import { verifyTurnstileToken } from "@/lib/turnstile";
import { checkRateLimit } from "@/lib/rate-limit";
import { POST } from "@/app/api/security/verify/route";
const request = (body: string) => new NextRequest("http://localhost/api/security/verify", { method: "POST", body });
describe("Portal security verification", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(checkRateLimit).mockResolvedValue({ success: true, limit: 20, remaining: 19, reset: 0 });
  });
  it("never accepts an invalid token", async () => {
    vi.mocked(verifyTurnstileToken).mockResolvedValue(false);
    expect((await POST(request('{"token":"bad"}'))).status).toBe(400);
  });
  it.each(["null", "{}", "not-json", '{"token":3}'])("rejects malformed input %s", async body => {
    expect((await POST(request(body))).status).toBe(400);
    expect(verifyTurnstileToken).not.toHaveBeenCalled();
  });
  it("returns success only after server verification", async () => {
    vi.mocked(verifyTurnstileToken).mockResolvedValue(true);
    const result = await POST(request('{"token":"valid"}'));
    expect(result.status).toBe(200);
    expect(result.headers.get("cache-control")).toBe("no-store");
    expect(verifyTurnstileToken).toHaveBeenCalledWith("valid");
  });
  it("rate limits before validating a token", async () => {
    vi.mocked(checkRateLimit).mockResolvedValue({ success: false, limit: 20, remaining: 0, reset: 0 });
    expect((await POST(request('{"token":"valid"}'))).status).toBe(429);
    expect(verifyTurnstileToken).not.toHaveBeenCalled();
  });
});
