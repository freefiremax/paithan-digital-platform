import * as Sentry from "@sentry/nextjs";
import { env } from "@/lib/env";

export function register() {
  if (!env.SENTRY_DSN) {
    return;
  }

  Sentry.init({
    dsn: env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    release: process.env.VERCEL_GIT_COMMIT_SHA,
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
    debug: process.env.NODE_ENV === "development",
    enabled: process.env.NODE_ENV !== "test",
  });
}

export const onRequestError = Sentry.captureRequestError;