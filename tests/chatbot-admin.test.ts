import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { GET, POST } from "@/app/api/admin/chatbot/knowledge/route";
import { requireAuth } from "@/lib/auth/guard";
import { persistPublicKnowledge } from "@/lib/chatbot/public-data";

vi.mock("@/lib/auth/guard", () => ({ requireAuth: vi.fn() }));
vi.mock("@/lib/chatbot/public-data", () => ({ publicDataHealth: { records: 0 }, persistPublicKnowledge: vi.fn().mockResolvedValue({ indexed: 215 }) }));
vi.mock("@/lib/rate-limit", () => ({ checkRateLimit: vi.fn().mockResolvedValue(null), RATE_LIMIT_CONFIGS: { auth: { limit: 5, window: "1 m" } } }));

beforeEach(() => { vi.clearAllMocks(); vi.mocked(requireAuth).mockResolvedValue({ user: { id: "test-admin", email: "test@example.invalid", role: "ADMIN" } }); });
describe("Knowledge administration authorization", () => {
  it("rejects unauthenticated diagnostics", async () => {
    vi.mocked(requireAuth).mockRejectedValue(new Error("UNAUTHENTICATED"));
    expect((await GET()).status).toBe(401);
    expect(persistPublicKnowledge).not.toHaveBeenCalled();
  });
  it("requires the administrator role", async () => {
    await GET();
    expect(requireAuth).toHaveBeenCalledWith("ADMIN");
  });
  it("rejects cross-origin refresh before writing any rows", async () => {
    const response = await POST(new NextRequest("http://localhost/api/admin/chatbot/knowledge", { method: "POST", headers: { origin: "https://other.example" }, body: "{}" }));
    expect(response.status).toBe(403);
    expect(persistPublicKnowledge).not.toHaveBeenCalled();
  });
  it("runs a retrieval evaluation without database writes", async () => {
    const response = await POST(new NextRequest("http://localhost/api/admin/chatbot/knowledge", { method: "POST", headers: { origin: "http://localhost" }, body: JSON.stringify({ action: "evaluate" }) }));
    expect(response.status).toBe(200);
    expect((await response.json()).results.every((result: { passed: boolean }) => result.passed)).toBe(true);
    expect(persistPublicKnowledge).not.toHaveBeenCalled();
  });
});
