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
      if (event.request?.data) {
        try {
          const data = JSON.parse(event.request.data as string);
          if (data.password) data.password = "[REDACTED]";
          if (data.token) data.token = "[REDACTED]";
          if (data.csrfToken) data.csrfToken = "[REDACTED]";
          event.request.data = JSON.stringify(data);
        } catch {}
      }
      return event;
    },
  });
}

export const onRequestError = Sentry.captureRequestError;