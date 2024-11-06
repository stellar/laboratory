import React from "react";
import type { Metadata } from "next";
import { headers } from "next/headers";

import { LayoutMain } from "@/components/layout/LayoutMain";
import { LayoutContextProvider } from "@/components/layout/LayoutContextProvider";
import { WalletKitContextProvider } from "@/components/WalletKitContextProvider";
import { QueryProvider } from "@/query/QueryProvider";
import { StoreProvider } from "@/store/StoreProvider";

import "@stellar/design-system/build/styles.min.css";
import "@/styles/globals.scss";

// Needed for CSP
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Stellar Lab",
  description:
    "Explore Stellar Lab: Build, sign, and submit transactions. Access tools, Stellar RPC, Horizon, and more. Enhance your skills with Stellar Quest.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  headers();

  return (
    <html lang="en">
      <body>
        <div id="root">
          <StoreProvider>
            <QueryProvider>
              <LayoutContextProvider>
                <WalletKitContextProvider>
                  <LayoutMain>{children}</LayoutMain>
                </WalletKitContextProvider>
              </LayoutContextProvider>
            </QueryProvider>
          </StoreProvider>
        </div>
      </body>
    </html>
  );
}
