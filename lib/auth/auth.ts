import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { Adapter, AdapterUser } from "@auth/core/adapters";
import { Role } from "@prisma/client";
import { verify } from "@node-rs/argon2";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { generateCsrfToken, setCsrfCookie } from "@/lib/csrf";
import { verifyTurnstileToken, isTurnstileEnabled } from "@/lib/turnstile";

const baseAdapter = PrismaAdapter(prisma);

const customAdapter: Adapter = {
  ...baseAdapter,
  createUser: async (data: AdapterUser) => {
    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name ?? null,
        passwordHash: "",
        role: Role.PUBLIC,
      },
    });
    return {
      ...user,
      emailVerified: null,
    } as unknown as AdapterUser;
  },
  getUserByEmail: async (email: string) => {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) return null;
    return {
      ...user,
      emailVerified: null,
    } as unknown as AdapterUser;
  },
  getUserByAccount: async ({ provider, providerAccountId }: { provider: string; providerAccountId: string }) => {
    const account = await prisma.account.findUnique({
      where: {
        provider_providerAccountId: {
          provider,
          providerAccountId,
        },
      },
      select: { user: true },
    });
    if (!account?.user) return null;
    return {
      ...account.user,
      emailVerified: null,
    } as unknown as AdapterUser;
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: customAdapter,
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 },
  trustHost: true,
  secret: env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  pages: { signIn: "/admin/login", error: "/admin/login" },
  providers: [
    Google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
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
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.wardId = token.wardId ?? undefined;
        if (token.name) session.user.name = token.name;
        if (token.email) session.user.email = token.email;
        if (token.picture) session.user.image = token.picture;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      try {
        if (new URL(url).origin === baseUrl) return url;
      } catch {
        // fallback
      }
      return baseUrl;
    },
  },
  events: {
    async signIn({ user, isNewUser }) {
      if (isNewUser) {
        await prisma.auditLog.create({
          data: {
            actorId: user.id,
            action: "CREATE",
            entity: "User",
            entityId: user.id,
            after: { email: user.email, role: user.role },
          },
        });
      }
      const csrfToken = await generateCsrfToken();
      const response = new Response();
      setCsrfCookie(response, csrfToken);
    },
    async signOut(message: { token?: { sub?: string } | null; session?: unknown }) {
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
    },
  },
} satisfies NextAuthConfig);