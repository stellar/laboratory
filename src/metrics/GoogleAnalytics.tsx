"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { Routes } from "@/constants/routes";

declare global {
  interface Window {
    gtag?: any;
  }
}

const GA_MEASUREMENT_ID = "GTM-KCNDDL3";
const SCRIPT_SRC = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;

const excludedGoogleTrackingRoutes = [
  Routes.SIGN_TRANSACTION,
  Routes.CLI_SIGN_TRANSACTION,
  Routes.ACCOUNT_CREATE,
  Routes.ACCOUNT_CREATE_MUXED,
];

export const GoogleAnalytics = () => {
  const pathname = usePathname();

  const isGoogleTrackingEnabled =
    process.env.NODE_ENV === "production" &&
    !excludedGoogleTrackingRoutes.some((route) => pathname.startsWith(route));

  useEffect(() => {
    if (isGoogleTrackingEnabled && typeof window.gtag === "function") {
      // We don't want to include search params
      window.gtag("config", GA_MEASUREMENT_ID, {
        page_path: pathname,
      });
    }

    return () => {
      // Remove scripts on paths we don't want to track
      const sourceScript = document.getElementById("gtag-source");
      const initScript = document.getElementById("gtag-init");

      sourceScript?.remove();
      initScript?.remove();
    };
  }, [isGoogleTrackingEnabled, pathname]);

  if (!isGoogleTrackingEnabled) {
    return null;
  }

  return (
    <>
      <Script id="gtag-source" async src={SCRIPT_SRC} />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());

                  // Disable automatic page view tracking by default
                  gtag('config', '${GA_MEASUREMENT_ID}', {
                    send_page_view: false
                  });
                `,
        }}
      />
    </>
  );
};
