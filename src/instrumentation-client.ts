// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import { isExternalError } from "@/helpers/errorUtils";

// Only initialize Sentry in production
if (process.env.NODE_ENV === "production") {
  Sentry.init({
    dsn: "https://75c875528a113643f9a5f74899b53516@o14203.ingest.us.sentry.io/4508100110450688",

    // Setting this option to true will print useful information to the console while you're setting up Sentry.
    debug: false,

    // Enable logs to be sent to Sentry
    enableLogs: false,

    // Custom error filtering to reduce false positives
    beforeSend(event, hint) {
      const error = hint.originalException;

      // Don't send errors that are already handled in the UI
      if (error && typeof error === "object" && "isHandledError" in error) {
        return null;
      }

      // Auto-detect common validation/parsing errors that are shown to users
      if (error && error instanceof Error) {
        const message = error.message;

        // These are typically user input validation errors - already shown in UI
        if (
          message.includes("Unable to parse") ||
          message.includes("Invalid") ||
          message.includes("not valid base64") ||
          message.includes("validation error") ||
          message.includes("input error")
        ) {
          return null; // Don't send to Sentry
        }

        const stack = error.stack || "";

        // Check for errors from external packages
        if (isExternalError(error)) {
          // Convert to warning and add tags
          event.level = "warning";
          event.tags = {
            ...event.tags,
            source: "external_package",
            package_type: stack.includes("stellar-wallets-kit")
              ? "wallet_kit"
              : "hardware_wallet",
          };

          // Add specific context
          event.contexts = {
            ...event.contexts,
            external_error: {
              is_external: true,
              likely_user_interaction: true,
            },
          };
        }
      }

      return event;
    },

    // Filter out noisy breadcrumbs
    beforeBreadcrumb(breadcrumb) {
      // Filter out console logs and debug breadcrumbs in production
      if (breadcrumb.category === "console" && breadcrumb.level !== "error") {
        return null;
      }
      return breadcrumb;
    },
  });
}

export const onRouterTransitionStart =
  process.env.NODE_ENV === "production"
    ? Sentry.captureRouterTransitionStart
    : undefined;
