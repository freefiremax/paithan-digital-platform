import { z } from "zod";

const emptyToUndefined = (val: unknown) =>
  typeof val === "string" && val.trim() === "" ? undefined : val;

const optionalString = z.preprocess(emptyToUndefined, z.string().optional());
const optionalUrl = z
  .preprocess(emptyToUndefined, z.string().optional())
  .pipe(z.string().url().optional());

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  DATABASE_URL: z.preprocess(
    emptyToUndefined,
    z.string().default("postgresql://neondb_owner:dummy@ep-little-wildflower-b36tvjmx-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require")
  ),
  DIRECT_URL: z.preprocess(
    emptyToUndefined,
    z.string().default("postgresql://neondb_owner:dummy@ep-little-wildflower-b36tvjmx.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require")
  ),
  NEXTAUTH_SECRET: z.preprocess(
    emptyToUndefined,
    z.string().default("i1CFVlmHkFZmulYwQx9+lvmY1usQBpkEkGVHKiCh+wE=")
  ),
  NEXTAUTH_URL: z.preprocess(
    emptyToUndefined,
    z.string().default("http://localhost:3000")
  ),
  GEMINI_API_KEY: optionalString,
  UPSTASH_REDIS_REST_URL: optionalUrl,
  UPSTASH_REDIS_REST_TOKEN: optionalString,
  CLOUDINARY_CLOUD_NAME: optionalString,
  CLOUDINARY_API_KEY: optionalString,
  CLOUDINARY_API_SECRET: optionalString,
  INITIAL_ADMIN_EMAIL: optionalString,
  INITIAL_ADMIN_PASSWORD: optionalString,
  INITIAL_ADMIN_NAME: optionalString,
  SENTRY_DSN: optionalUrl,
  SENTRY_ORG: optionalString,
  SENTRY_PROJECT: optionalString,
  SENTRY_AUTH_TOKEN: optionalString,
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: optionalString,
  TURNSTILE_SECRET_KEY: optionalString,
  CSRF_SECRET: z.preprocess(
    emptyToUndefined,
    z.string().default("csrf-secret-change-in-production-at-least-32-chars")
  ),
  GOOGLE_CLIENT_ID: optionalString,
  GOOGLE_CLIENT_SECRET: optionalString,
});

export type Env = z.infer<typeof envSchema>;

let cachedEnv: Env | null = null;

export function getEnv(): Env {
  if (cachedEnv) return cachedEnv;

  const rawEnv = {
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    DIRECT_URL: process.env.DIRECT_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || process.env.AUTH_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined),
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
    CSRF_SECRET: process.env.CSRF_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  };

  const parsed = envSchema.safeParse(rawEnv);
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