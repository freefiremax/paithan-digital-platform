import * as Sentry from "@sentry/nextjs";
import { env } from "@/lib/env";

const dsn = env.SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    tracesSampleRate: 1.0,
    sendDefaultPii: false,
    debug: env.NODE_ENV === "development",
    replaysOnErrorSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    integrations: [
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
    beforeSend(event) {
      if (event.request?.cookies) {
        delete event.request.cookies;
      }
      if (event.request?.headers) {
        const headers = { ...event.request.headers };
        delete headers.authorization;
        delete headers.cookie;
        event.request.headers = headers;
      }
      return event;
    },
  });
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;