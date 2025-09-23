// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import { isExternalError } from "@/helpers/errorUtils";

// Only initialize Sentry in production
if (process.env.NODE_ENV === "production") {
  Sentry.init({
    dsn: "https://75c875528a113643f9a5f74899b53516@o14203.ingest.us.sentry.io/4508100110450688",

    // Enable logs to be sent to Sentry only for errors
    enableLogs: true,

    // Setting this option to true will print useful information to the console while you're setting up Sentry.
    debug: false,

    // Custom error filtering for server-side errors
    beforeSend(event, hint) {
      const error = hint.originalException;

      // Don't send errors that are already handled in the UI
      if (error && typeof error === "object" && "isHandledError" in error) {
        return null;
      }

      // Tag server-side errors from external packages
      if (error && error instanceof Error) {
        if (isExternalError(error)) {
          event.level = "warning";
          event.tags = {
            ...event.tags,
            source: "external_package",
            environment: "server",
          };
        }
      }

      return event;
    },
  });
}
