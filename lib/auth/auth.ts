import NextAuth, { CredentialsSignin, type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { Role } from "@prisma/client";
import { verify } from "@node-rs/argon2";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { verifyTurnstileToken, isTurnstileEnabled } from "@/lib/turnstile";
import { checkRateLimit, RATE_LIMIT_CONFIGS } from "@/lib/rate-limit";
import { loginSchema } from "@/lib/validation";

class AccountNotFoundError extends CredentialsSignin {
  code = "account_not_found";
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 },
  trustHost: true,
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || env.NEXTAUTH_SECRET,
  pages: { signIn: "/login", error: "/login" },
  logger: {
    error: () => console.error("[auth] Authentication operation failed."),
    warn: () => console.warn("[auth] Authentication configuration warning."),
    debug: () => { /* Authentication payloads must not be logged. */ },
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
      authorize: async (credentials, request) => {
        const parsed = loginSchema.safeParse({ email: credentials?.email, password: credentials?.password });
        if (!parsed.success || parsed.data.password.length > 128) return null;
        const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
        const [ipLimit, emailLimit] = await Promise.all([
          checkRateLimit(`login:ip:${ip}`, RATE_LIMIT_CONFIGS.auth),
          checkRateLimit(`login:email:${parsed.data.email.toLowerCase()}`, RATE_LIMIT_CONFIGS.auth),
        ]);
        if (!ipLimit.success || !emailLimit.success) return null;

        if (isTurnstileEnabled()) {
          const turnstileValid = await verifyTurnstileToken(credentials.turnstileToken as string | undefined);
          if (!turnstileValid) return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        });
        if (!user) throw new AccountNotFoundError();
        if (!user.passwordHash) return null;

        const valid = await verify(user.passwordHash, parsed.data.password);
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
    async signIn({ account, profile }) {
      if (account?.provider === "google") return profile?.email_verified === true;
      return true;
    },
    async jwt({ token, user, profile }) {
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
      // Recheck authorization on session reads as well as client update requests.
      if (!user && (token.id || token.sub)) {
        const storedUser = await prisma.user.findUnique({ where: { id: (token.id || token.sub) as string } });
        if (!storedUser) return null;
        token.role = storedUser.role;
        token.wardId = storedUser.wardId;
        token.name = storedUser.name;
        token.picture = storedUser.image;
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
      } catch {
        console.error("[auth] Sign-in audit write failed.");
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
      } catch {
        console.error("[auth] Sign-out audit write failed.");
      }
    },
  },
} satisfies NextAuthConfig);
