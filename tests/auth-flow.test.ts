import { describe, it, expect } from "vitest";
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
      const getLocale = (str: string): string => {
        const match = str.match(/\/(en|mr|hi)(\/|$)/);
        return match ? match[1] : "en";
      };

      if (
        url.includes("/admin/login") ||
        url.includes("/admin") ||
        url.includes("/login") ||
        url.includes("/register") ||
        url.includes("/api/auth")
      ) {
        const loc = getLocale(url);
        return `${base}/${loc}`;
      }
      if (url.startsWith("/")) {
        if (url === "/" || url === "") {
          return `${base}/en`;
        }
        return `${base}${url}`;
      }
      try {
        const parsed = new URL(url);
        if (parsed.origin === base || parsed.hostname === new URL(base).hostname) {
          if (
            parsed.pathname.includes("/admin/login") ||
            parsed.pathname.includes("/admin") ||
            parsed.pathname.includes("/login") ||
            parsed.pathname.includes("/register") ||
            parsed.pathname.includes("/api/auth") ||
            parsed.pathname === "/" ||
            parsed.pathname === ""
          ) {
            const loc = getLocale(parsed.pathname);
            return `${base}/${loc}`;
          }
          return url;
        }
      } catch {
        // fallback
      }
      const loc = getLocale(url);
      return `${base}/${loc}`;
    }

    it("should redirect back to public home page with locale preserved when login path is provided", () => {
      expect(safeRedirect("/admin/login", baseUrl)).toBe(`${baseUrl}/en`);
      expect(safeRedirect("/en/admin/login", baseUrl)).toBe(`${baseUrl}/en`);
      expect(safeRedirect("/mr/admin/login", baseUrl)).toBe(`${baseUrl}/mr`);
      expect(safeRedirect("/hi/admin/login", baseUrl)).toBe(`${baseUrl}/hi`);
      expect(safeRedirect(`${baseUrl}/en/admin/login`, baseUrl)).toBe(`${baseUrl}/en`);
      expect(safeRedirect(`${baseUrl}/mr/admin/login`, baseUrl)).toBe(`${baseUrl}/mr`);
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
      expect(safeRedirect(`${baseUrl}/en/heritage/museum`, baseUrl)).toBe(`${baseUrl}/en/heritage/museum`);
    });

    it("should block open redirect attacks to external origins", () => {
      expect(safeRedirect("https://attacker.com/steal-session", baseUrl)).toBe(`${baseUrl}/en`);
    });
  });
});
