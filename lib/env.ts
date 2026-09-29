import { z } from "zod";

// Check if we're in build mode (Next.js build process)
const isBuildTime = process.env.NEXT_PHASE === "phase-production-build" || 
                     process.env.NEXT_PHASE === "phase-development-build" ||
                     (process.env.NODE_ENV === "production" && !process.env.DATABASE_URL?.includes("neon.tech"));

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  DATABASE_URL: z.string().url().min(1, "DATABASE_URL is required"),
  DIRECT_URL: z.string().url().min(1, "DIRECT_URL is required"),
  NEXTAUTH_SECRET: isBuildTime ? z.string() : z.string().min(32, "NEXTAUTH_SECRET must be at least 32 characters"),
  NEXTAUTH_URL: z.string().url().min(1, "NEXTAUTH_URL is required"),
  GEMINI_API_KEY: z.string().optional(),
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  INITIAL_ADMIN_EMAIL: z.string().email().optional(),
  INITIAL_ADMIN_PASSWORD: z.string().min(12).optional(),
  INITIAL_ADMIN_NAME: z.string().optional(),
  SENTRY_DSN: z.string().url().optional(),
  SENTRY_ORG: z.string().optional(),
  SENTRY_PROJECT: z.string().optional(),
  SENTRY_AUTH_TOKEN: z.string().optional(),
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().optional(),
  TURNSTILE_SECRET_KEY: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

let cachedEnv: Env | null = null;

export function getEnv(): Env {
  if (cachedEnv) return cachedEnv;

  const envWithDefaults = {
    NODE_ENV: process.env.NODE_ENV || "development",
    DATABASE_URL: process.env.DATABASE_URL || "postgresql://dummy:dummy@localhost:5432/dummy",
    DIRECT_URL: process.env.DIRECT_URL || "postgresql://dummy:dummy@localhost:5432/dummy",
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || "dummy-build-secret-key-32-characters-long",
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || "http://localhost:3000",
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    INITIAL_ADMIN_EMAIL: process.env.INITIAL_ADMIN_EMAIL,
    INITIAL_ADMIN_PASSWORD: process.env.INITIAL_ADMIN_PASSWORD,
    INITIAL_ADMIN_NAME: process.env.INITIAL_ADMIN_NAME,
    SENTRY_DSN: process.env.SENTRY_DSN,
    SENTRY_ORG: process.env.SENTRY_ORG,
    SENTRY_PROJECT: process.env.SENTRY_PROJECT,
    SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
    TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
  };

  const parsed = envSchema.safeParse(envWithDefaults);
  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    const messages = Object.entries(errors)
      .flatMap(([key, val]) => val?.map((v) => `${key}: ${v}`) ?? [])
      .join("\n");
    throw new Error(`Invalid environment variables:\n${messages}`);
  }

  cachedEnv = parsed.data;
  return cachedEnv;
}

export const env = getEnv();