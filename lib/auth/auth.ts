import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { verify } from "@node-rs/argon2";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { generateCsrfToken, setCsrfCookie } from "@/lib/csrf";
import { verifyTurnstileToken, isTurnstileEnabled } from "@/lib/turnstile";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 },
  pages: { signIn: "/admin/login", error: "/admin/login" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        turnstileToken: { label: "Turnstile Token", type: "text" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) return null;

        if (isTurnstileEnabled()) {
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
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.wardId = user.wardId;
      }
      if (trigger === "update" && session) {
        token.role = session.role ?? token.role;
        token.wardId = session.wardId ?? token.wardId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.wardId = token.wardId ?? undefined;
      }
      return session;
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
  secret: env.NEXTAUTH_SECRET,
} satisfies NextAuthConfig);