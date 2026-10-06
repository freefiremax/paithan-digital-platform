import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { Adapter, AdapterUser, AdapterAccount } from "@auth/core/adapters";
import { Role } from "@prisma/client";
import { verify } from "@node-rs/argon2";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { verifyTurnstileToken, isTurnstileEnabled } from "@/lib/turnstile";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 },
  trustHost: true,
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || env.NEXTAUTH_SECRET,
  pages: { signIn: "/login", error: "/login" },
  logger: {
    error: (error) => console.error("[NextAuth Error]", error),
    warn: (message) => console.warn("[NextAuth Warn]", message),
    debug: (message) => console.debug("[NextAuth Debug]", message),
  },
  providers: [
    Google({
      clientId:
        process.env.AUTH_GOOGLE_ID ||
        process.env.GOOGLE_CLIENT_ID ||
        process.env.GOOGLE_ID ||
        env.GOOGLE_CLIENT_ID,
      clientSecret:
        process.env.AUTH_GOOGLE_SECRET ||
        process.env.GOOGLE_CLIENT_SECRET ||
        process.env.GOOGLE_SECRET ||
        env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          scope: "openid email profile",
          access_type: "offline",
          prompt: "select_account",
          response_type: "code",
        },
      },
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        turnstileToken: { label: "Turnstile Token", type: "text" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) return null;

        if (isTurnstileEnabled() && credentials.turnstileToken) {
          const turnstileValid = await verifyTurnstileToken(credentials.turnstileToken as string | undefined);
          if (!turnstileValid) return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });
        if (!user?.passwordHash) return null;

        const valid = await verify(user.passwordHash, credentials.password as string);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          wardId: user.wardId,
        };
      },
    }),
  ],
  callbacks: {
    async signIn() {
      return true;
    },
    async jwt({ token, user, trigger, session, profile }) {
      if (user) {
        token.id = user.id;
        token.role = (user.role as Role) || Role.PUBLIC;
        token.wardId = user.wardId;
        if (user.name) token.name = user.name;
        if (user.email) token.email = user.email;
        if (user.image) token.picture = user.image;
      }
      if (profile) {
        if ((profile as { picture?: string }).picture) {
          token.picture = (profile as { picture?: string }).picture;
        }
        if ((profile as { name?: string }).name) {
          token.name = (profile as { name?: string }).name;
        }
      }
      if (trigger === "update" && session) {
        token.role = (session.role as Role) ?? token.role;
        token.wardId = (session.wardId as string | null | undefined) ?? token.wardId;
        if (session.name) token.name = session.name;
        if (session.image) token.picture = session.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = (token.id || token.sub) as string;
        session.user.role = (token.role as Role) || Role.PUBLIC;
        session.user.wardId = (token.wardId as string | undefined) ?? undefined;
        if (token.name) session.user.name = token.name as string;
        if (token.email) session.user.email = token.email as string;
        if (token.picture) session.user.image = token.picture as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      const getLocale = (str: string): string => {
        const match = str.match(/\/(en|mr|hi)(\/|$)/);
        return match ? match[1] : "en";
      };

      // 1. If destination is admin login, public login, register or api/auth, redirect to the real public homepage with locale preserved
      if (
        url.includes("/admin/login") ||
        url.includes("/login") ||
        url.includes("/register") ||
        url.includes("/api/auth")
      ) {
        const loc = getLocale(url);
        return `${baseUrl}/${loc}`;
      }

      // 2. Relative URLs
      if (url.startsWith("/")) {
        if (url === "/" || url === "") {
          return `${baseUrl}/en`;
        }
        return `${baseUrl}${url}`;
      }

      // 3. Absolute URLs on same origin
      try {
        const parsed = new URL(url);
        if (parsed.origin === baseUrl || parsed.hostname === new URL(baseUrl).hostname) {
          if (
            parsed.pathname.includes("/admin/login") ||
            parsed.pathname.includes("/login") ||
            parsed.pathname.includes("/register") ||
            parsed.pathname.includes("/api/auth") ||
            parsed.pathname === "/" ||
            parsed.pathname === ""
          ) {
            const loc = getLocale(parsed.pathname);
            return `${baseUrl}/${loc}`;
          }
          return url;
        }
      } catch {
        // invalid URL
      }

      const loc = getLocale(url);
      return `${baseUrl}/${loc}`;
    },
  },
  events: {
    async signIn({ user, isNewUser }) {
      try {
        if (isNewUser && user?.id) {
          await prisma.auditLog.create({
            data: {
              actorId: user.id,
              action: "CREATE",
              entity: "User",
              entityId: user.id,
              after: { email: user.email, role: user.role || Role.PUBLIC },
            },
          });
        }
      } catch (err) {
        console.error("[auth][events.signIn] Failed to create audit log:", err);
      }
    },
    async signOut(message: { token?: { sub?: string } | null; session?: unknown }) {
      try {
        const token = message.token;
        if (token?.sub) {
          await prisma.auditLog.create({
            data: {
              actorId: token.sub,
              action: "UPDATE",
              entity: "User",
              entityId: token.sub,
              after: { event: "signOut" },
            },
          });
        }
      } catch (err) {
        console.error("[auth][events.signOut] Failed to create audit log:", err);
      }
    },
  },
} satisfies NextAuthConfig);