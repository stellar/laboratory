import React, { Suspense } from "react";
import type { Metadata } from "next";

import { LayoutMain } from "@/components/layout/LayoutMain";
import { LayoutContextProvider } from "@/components/layout/LayoutContextProvider";
import { DynamicWalletKitProvider } from "@/components/WalletKit/DynamicWalletKitProvider";
import { CustomAiButton } from "@/components/CustomAiButton";

import { QueryProvider } from "@/query/QueryProvider";
import { StoreProvider } from "@/store/StoreProvider";
import { GoogleAnalytics } from "@/metrics/GoogleAnalytics";

import "@stellar/design-system/build/styles.min.css";
import "@/styles/globals.scss";

export const metadata: Metadata = {
  title: "Stellar Lab",
  description:
    "Explore Stellar Lab: Build, sign, and submit transactions. Access tools, Stellar RPC, Horizon, and more. Enhance your skills with Stellar Quest.",
};

// Automatically generates nonce for script and style tags
export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Suspense>
          <div id="root">
            <StoreProvider>
              <QueryProvider>
                <LayoutContextProvider>
                  <DynamicWalletKitProvider>
                    <LayoutMain>{children}</LayoutMain>
                  </DynamicWalletKitProvider>
                  <CustomAiButton />
                </LayoutContextProvider>
              </QueryProvider>
            </StoreProvider>
          </div>
          <GoogleAnalytics />
        </Suspense>
      </body>
    </html>
  );
}
