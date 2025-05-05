"use client";
import {
  GoogleAnalytics as NextGoogleAnalytics,
  GoogleTagManager,
} from "@next/third-parties/google";

const GA_MEASUREMENT_ID = "GTM-KCNDDL3";

export const GoogleAnalytics = () => {
  const isGoogleTrackingEnabled = process.env.NODE_ENV === "production";

  if (!isGoogleTrackingEnabled) {
    return null;
  }

  return (
    <>
      <GoogleTagManager gtmId={GA_MEASUREMENT_ID} />
      <NextGoogleAnalytics gaId={GA_MEASUREMENT_ID} />
    </>
  );
};
