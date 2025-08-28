import * as Sentry from "@sentry/nextjs";
import { isSentryEnabled } from "@/constants/settings";

export async function register() {
  if (isSentryEnabled) {
    if (process.env.NEXT_RUNTIME === "nodejs") {
      await import("../sentry.server.config");
    }

    if (process.env.NEXT_RUNTIME === "edge") {
      await import("../sentry.edge.config");
    }
  }
}

export const onRequestError = Sentry.captureRequestError;
