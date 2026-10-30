import { beforeEach, describe, expect, it, vi } from "vitest";
import type { NextAuthConfig } from "next-auth";
import { NextRequest } from "next/server";

const captured = vi.hoisted(() => ({ config: undefined as NextAuthConfig | undefined }));
vi.mock("next-auth", () => ({ default: (config: NextAuthConfig) => { captured.config = config; return {}; } }));
vi.mock("next-auth/providers/credentials", () => ({ default: (options: unknown) => ({ id: "credentials", ...options as object }) }));
vi.mock("next-auth/providers/google", () => ({ default: (options: unknown) => ({ id: "google", ...options as object }) }));
vi.mock("@auth/prisma-adapter", () => ({ PrismaAdapter: () => ({}) }));
vi.mock("@/lib/db", () => ({ prisma: { user: { findUnique: vi.fn(), create: vi.fn() } } }));
vi.mock("@node-rs/argon2", () => ({ hash: vi.fn(async () => "hashed-password"), verify: vi.fn(async () => true) }));
vi.mock("@/lib/env", () => ({ env: { NEXTAUTH_SECRET: "test-secret", GOOGLE_CLIENT_ID: "test-id", GOOGLE_CLIENT_SECRET: "test-secret" } }));
vi.mock("@/lib/rate-limit", () => ({ checkRateLimit: vi.fn(), RATE_LIMIT_CONFIGS: { auth: {}, apiMutation: {} } }));
vi.mock("@/lib/turnstile", () => ({ isTurnstileEnabled: vi.fn(), verifyTurnstileToken: vi.fn() }));
import "@/lib/auth/auth";
import { prisma } from "@/lib/db";
import { checkRateLimit } from "@/lib/rate-limit";
import { isTurnstileEnabled, verifyTurnstileToken } from "@/lib/turnstile";
import { POST } from "@/app/api/auth/register/route";
import { citizenCallbackUrl } from "@/lib/auth/redirect";

const credentials = () => captured.config!.providers.find(p => typeof p !== "function" && p.id === "credentials") as unknown as { authorize: (credentials: Record<string, unknown>, request: Request) => Promise<unknown> };
const request = () => new Request("https://portal.test/api/auth/callback/credentials", { headers: { "x-forwarded-for": "192.0.2.1" } });
const registration = (extra = {}) => new NextRequest("https://portal.test/api/auth/register", { method: "POST", body: JSON.stringify({ email: "citizen@example.com", password: "long-passphrase-123", name: "Citizen", turnstileToken: "token", ...extra }) });

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(checkRateLimit).mockResolvedValue({ success: true, limit: 5, remaining: 4, reset: 0 });
  vi.mocked(isTurnstileEnabled).mockReturnValue(true);
  vi.mocked(verifyTurnstileToken).mockResolvedValue(true);
  vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
});

describe("Citizen registration authorization", () => {
  it.each([{ role: "ADMIN" }, { role: "EDITOR" }, { wardId: "c123456789012345678901234" }])("rejects privileged fields %o before database writes", async extra => {
    expect((await POST(registration(extra))).status).toBe(400);
    expect(prisma.user.create).not.toHaveBeenCalled();
  });
  it("rejects an omitted challenge before looking up accounts", async () => {
    vi.mocked(verifyTurnstileToken).mockResolvedValue(false);
    expect((await POST(registration({ turnstileToken: undefined }))).status).toBe(400);
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
  });
  it("persists only a PUBLIC account and hashed password after verification", async () => {
    vi.mocked(prisma.user.create).mockResolvedValue({ id: "citizen", role: "PUBLIC" } as Awaited<ReturnType<typeof prisma.user.create>>);
    expect((await POST(registration())).status).toBe(201);
    const data = vi.mocked(prisma.user.create).mock.calls[0][0]!.data;
    expect(data.role).toBe("PUBLIC");
    expect(data.passwordHash).toBe("hashed-password");
    expect(data).not.toHaveProperty("turnstileToken");
    expect(data).not.toHaveProperty("wardId");
  });
});

describe("Actual authentication callbacks", () => {
  it("rejects credential requests without Turnstile when enabled", async () => {
    vi.mocked(verifyTurnstileToken).mockResolvedValue(false);
    expect(await credentials().authorize({ email: "citizen@example.com", password: "password" }, request())).toBeNull();
    expect(verifyTurnstileToken).toHaveBeenCalledWith(undefined);
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
  });
  it("accepts verified credentials using the stored account role", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: "citizen", email: "citizen@example.com", name: "Citizen", passwordHash: "hashed-password", role: "PUBLIC", wardId: null } as Awaited<ReturnType<typeof prisma.user.findUnique>>);
    expect(await credentials().authorize({ email: "citizen@example.com", password: "password", turnstileToken: "token", role: "ADMIN" }, request())).toMatchObject({ id: "citizen", role: "PUBLIC" });
    expect(verifyTurnstileToken).toHaveBeenCalledWith("token");
  });
  it("rate limits password attempts before verifying credentials", async () => {
    vi.mocked(checkRateLimit).mockResolvedValue({ success: false, limit: 5, remaining: 0, reset: 0 });
    expect(await credentials().authorize({ email: "citizen@example.com", password: "password", turnstileToken: "token" }, request())).toBeNull();
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
    expect(verifyTurnstileToken).not.toHaveBeenCalled();
  });
  it("ignores client authorization claims and refreshes from the database", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: "citizen", role: "PUBLIC", wardId: null, name: "Citizen", image: null } as Awaited<ReturnType<typeof prisma.user.findUnique>>);
    const jwt = captured.config!.callbacks!.jwt!;
    const result = await jwt({ token: { id: "citizen", role: "PUBLIC" }, trigger: "update", session: { role: "ADMIN", wardId: "other-ward" } } as Parameters<typeof jwt>[0]);
    expect(result).toMatchObject({ role: "PUBLIC", wardId: null });
  });
  it("invalidates refreshes for deleted accounts", async () => {
    const jwt = captured.config!.callbacks!.jwt!;
    expect(await jwt({ token: { id: "deleted" }, trigger: "update", session: {} } as Parameters<typeof jwt>[0])).toBeNull();
  });
});

describe("Citizen redirect destinations", () => {
  it.each(["https://evil.example", "//evil.example", "/en/admin/users", "/en/login", "/en/register", "/api/auth/session", "/en/%5cevil", "/en/%00"]) ("rejects unsafe destination %s", value => {
    expect(citizenCallbackUrl(value, "mr")).toBe("/mr");
  });
  it("preserves a public path and query", () => {
    expect(citizenCallbackUrl("/mr/grievances/track?ticket=example", "mr")).toBe("/mr/grievances/track?ticket=example");
  });
});
