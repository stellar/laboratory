import React, { Suspense } from "react";
import type { Metadata } from "next";
import { headers } from "next/headers";

import { LayoutMain } from "@/components/layout/LayoutMain";
import { LayoutContextProvider } from "@/components/layout/LayoutContextProvider";
import { WalletKitContextProvider } from "@/components/WalletKit/WalletKitContextProvider";
import { CustomAiButton } from "@/components/CustomAiButton";

import { QueryProvider } from "@/query/QueryProvider";
import { StoreProvider } from "@/store/StoreProvider";
import { GoogleAnalytics } from "@/metrics/GoogleAnalytics";
import { GoogleTranslateMountPoint } from "@/components/GoogleTranslateMountPoint";

import "@stellar/design-system/build/styles.min.css";
import "@/styles/globals.scss";

export const metadata: Metadata = {
  title: "Stellar Lab",
  description:
    "Explore Stellar Lab: Build, sign, and submit transactions. Access tools, Stellar RPC, Horizon, and more. Enhance your skills with Stellar Quest.",
};

// Automatically generates nonce for script and style tags
export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const nonce = (await headers()).get("x-nonce") ?? "";

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Translate init — must carry nonce to pass the app's CSP.
            suppressHydrationWarning is required because browsers strip nonce
            attributes from the DOM after load (to prevent CSS exfiltration),
            so the client-side React tree sees nonce="" while the server-rendered
            HTML has the real value. The nonce is still present in the raw HTML
            that the browser parses for CSP enforcement before React runs. */}
        <script
          nonce={nonce}
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `
              function googleTranslateElementInit() {
                var mount = document.getElementById('google_translate_element');
                if (!mount) {
                  requestAnimationFrame(googleTranslateElementInit);
                  return;
                }
                new google.translate.TranslateElement({
                  pageLanguage: 'en',
                  autoDisplay: false,
                }, 'google_translate_element');
              }
            `,
          }}
        />
        <script
          src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          nonce={nonce}
          suppressHydrationWarning
          async
        />
      </head>
      <body suppressHydrationWarning>
        <Suspense>
          <div id="root">
            <StoreProvider>
              <QueryProvider>
                <LayoutContextProvider>
                  <WalletKitContextProvider>
                    <LayoutMain>{children}</LayoutMain>
                  </WalletKitContextProvider>
                  <CustomAiButton />
                </LayoutContextProvider>
              </QueryProvider>
            </StoreProvider>
          </div>
          <GoogleAnalytics />
          <GoogleTranslateMountPoint />
        </Suspense>
      </body>
    </html>
  );
}
