// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

// Only load Sentry in production
if (process.env.NODE_ENV === "production") {
  import("@sentry/nextjs").then((Sentry) => {
    Sentry.init({
      dsn: "https://75c875528a113643f9a5f74899b53516@o14203.ingest.us.sentry.io/4508100110450688",
      // Enable logs to be sent to Sentry
      enableLogs: true,

      // Setting this option to true will print useful information to the console while you're setting up Sentry.
      debug: false,
    });
  });
}

// Only export router transition capture in production
export const onRouterTransitionStart =
  process.env.NODE_ENV === "production"
    ? // eslint-disable-next-line @typescript-eslint/no-require-imports
      require("@sentry/nextjs").captureRouterTransitionStart
    : undefined;
