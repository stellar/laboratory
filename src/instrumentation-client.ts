// Sentry
// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://75c875528a113643f9a5f74899b53516@o14203.ingest.us.sentry.io/4508100110450688",
  beforeSend: (event) => {
    // We don't want to capture any sensitive info from the URL, so submitting
    // only origin and pathname of the URL

    // Referer header
    if (event?.request?.headers?.Referer) {
      try {
        const { origin, pathname } = new URL(event.request.headers.Referer);
        event.request.headers.Referer = `${origin}${pathname}`;
      } catch {
        // Do nothing
      }
    }

    // URL field
    if (event?.request?.url) {
      try {
        const { origin, pathname } = new URL(event.request.url);
        event.request.url = `${origin}${pathname}`;
      } catch {
        // Do nothing
      }
    }

    return event;
  },
  allowUrls: [
    /^https?:\/\/[^/]+\.stellar\.org/,
    /^https?:\/\/[^/]+\.stellar-ops\.com\//,
  ],
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
