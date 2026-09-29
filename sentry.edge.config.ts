import * as Sentry from "@sentry/nextjs";
import { env } from "@/lib/env";

const dsn = env.SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    tracesSampleRate: 1.0,
    sendDefaultPii: false,
    debug: env.NODE_ENV === "development",
    beforeSend(event) {
      if (event.request?.cookies) {
        delete event.request.cookies;
      }
      if (event.request?.headers) {
        const headers = { ...event.request.headers };
        delete headers.authorization;
        delete headers.cookie;
        delete headers["x-csrf-token"];
        event.request.headers = headers;
      }
      return event;
    },
  });
}