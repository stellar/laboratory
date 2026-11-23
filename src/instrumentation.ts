export async function register() {
  // No code runs on the Edge runtime (proxy.ts is Node.js-only in Next.js 16),
  // so only the Node.js Sentry config is needed.
  if (
    process.env.NODE_ENV === "production" &&
    process.env.NEXT_RUNTIME === "nodejs"
  ) {
    await import("../sentry.server.config");
  }
}

// Only load Sentry's onRequestError in production
export const onRequestError =
  process.env.NODE_ENV === "production"
    ? // eslint-disable-next-line @typescript-eslint/no-require-imports
      require("@sentry/nextjs").captureRequestError
    : undefined;
