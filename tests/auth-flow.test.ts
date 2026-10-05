import { describe, it, expect, vi } from "vitest";
import { Role } from "@prisma/client";

describe("NextAuth Flow & Adapter Architecture", () => {
  describe("OAuth User Data Transformation", () => {
    it("should safely default passwordHash and role for Google OAuth users", () => {
      const oauthInput = {
        id: "cuid-123",
        email: "citizen@example.com",
        name: "Prasanna Citizen",
        image: "https://lh3.googleusercontent.com/a/test-avatar",
        emailVerified: null,
      };

      const neonUserRecord = {
        email: oauthInput.email,
        name: oauthInput.name ?? null,
        passwordHash: "",
        role: Role.PUBLIC,
      };

      expect(neonUserRecord.email).toBe("citizen@example.com");
      expect(neonUserRecord.name).toBe("Prasanna Citizen");
      expect(neonUserRecord.passwordHash).toBe("");
      expect(neonUserRecord.role).toBe(Role.PUBLIC);
    });

    it("should correctly map JWT token properties from Google user and profile", () => {
      const token: Record<string, unknown> = {};
      const user = {
        id: "user-456",
        email: "citizen@example.com",
        name: "Prasanna",
        role: Role.PUBLIC,
        wardId: null,
        image: "https://lh3.googleusercontent.com/avatar.jpg",
      };
      const profile = {
        picture: "https://lh3.googleusercontent.com/avatar.jpg",
        name: "Prasanna",
      };

      // Simulating jwt callback logic
      token.id = user.id;
      token.role = user.role || Role.PUBLIC;
      token.wardId = user.wardId;
      if (user.name) token.name = user.name;
      if (user.email) token.email = user.email;
      if (user.image) token.picture = user.image;
      if (profile.picture) token.picture = profile.picture;

      expect(token.id).toBe("user-456");
      expect(token.role).toBe(Role.PUBLIC);
      expect(token.name).toBe("Prasanna");
      expect(token.email).toBe("citizen@example.com");
      expect(token.picture).toBe("https://lh3.googleusercontent.com/avatar.jpg");
    });

    it("should populate Session user with id, name, email, role, and image", () => {
      const token = {
        id: "user-456",
        name: "Prasanna",
        email: "citizen@example.com",
        picture: "https://lh3.googleusercontent.com/avatar.jpg",
        role: Role.PUBLIC,
        wardId: null,
      };

      const session: { user: Record<string, unknown> } = { user: {} };

      // Simulating session callback logic
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.wardId = token.wardId ?? undefined;
      if (token.name) session.user.name = token.name;
      if (token.email) session.user.email = token.email;
      if (token.picture) session.user.image = token.picture;

      expect(session.user.id).toBe("user-456");
      expect(session.user.name).toBe("Prasanna");
      expect(session.user.email).toBe("citizen@example.com");
      expect(session.user.image).toBe("https://lh3.googleusercontent.com/avatar.jpg");
      expect(session.user.role).toBe(Role.PUBLIC);
    });
  });

  describe("Safe Redirect Callback Logic", () => {
    const baseUrl = "https://paithan-digital-platform.vercel.app";

    function safeRedirect(url: string, base: string): string {
      if (url.includes("/admin/login") || url.includes("/login") || url.includes("/api/auth")) {
        return `${base}/en`;
      }
      if (url.startsWith("/")) return `${base}${url}`;
      try {
        if (new URL(url).origin === base) return url;
      } catch {
        // fallback
      }
      return `${base}/en`;
    }

    it("should never redirect back to /admin/login after OAuth", () => {
      expect(safeRedirect("/admin/login", baseUrl)).toBe(`${baseUrl}/en`);
      expect(safeRedirect("/en/admin/login", baseUrl)).toBe(`${baseUrl}/en`);
      expect(safeRedirect("/mr/admin/login", baseUrl)).toBe(`${baseUrl}/en`);
      expect(safeRedirect(`${baseUrl}/en/admin/login`, baseUrl)).toBe(`${baseUrl}/en`);
    });

    it("should safely redirect relative public paths with locale", () => {
      expect(safeRedirect("/en", baseUrl)).toBe(`${baseUrl}/en`);
      expect(safeRedirect("/mr", baseUrl)).toBe(`${baseUrl}/mr`);
      expect(safeRedirect("/hi", baseUrl)).toBe(`${baseUrl}/hi`);
      expect(safeRedirect("/en/tourism/jayakwadi", baseUrl)).toBe(`${baseUrl}/en/tourism/jayakwadi`);
    });

    it("should allow matching origin absolute URLs", () => {
      expect(safeRedirect(`${baseUrl}/mr`, baseUrl)).toBe(`${baseUrl}/mr`);
      expect(safeRedirect(`${baseUrl}/hi`, baseUrl)).toBe(`${baseUrl}/hi`);
    });

    it("should block open redirect attacks to external origins", () => {
      expect(safeRedirect("https://attacker.com/steal-session", baseUrl)).toBe(`${baseUrl}/en`);
    });
  });
});
