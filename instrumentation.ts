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
    ignoreErrors: [
      "NEXT_REDIRECT",
      "NEXT_NOT_FOUND",
      "ChunkLoadError",
      "Loading chunk",
      "Loading CSS chunk",
      "hydration",
      "Hydration failed",
    ],
    beforeSend(event, hint) {
      const error = hint.originalException;
      if (error instanceof Error) {
        if (error.message === "NEXT_REDIRECT" || error.message === "NEXT_NOT_FOUND") {
          return null;
        }
      }
      return event;
    },
    beforeSendTransaction(event) {
      if (event.transaction?.includes("/_next/")) {
        return null;
      }
      return event;
    },
  });
}

export const onRequestError = Sentry.captureRequestError;