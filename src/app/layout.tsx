import type { Metadata } from "next";
import React from "react";

import { LayoutMain } from "@/components/layout/LayoutMain";
import { QueryProvider } from "@/query/QueryProvider";
import { StoreProvider } from "@/store/StoreProvider";

import "@/styles/globals.scss";
import "@stellar/design-system/build/styles.min.css";
import { NetworkByPasswordProvider } from "@/components/NetworkByPasswordProvider";

// Needed for CSP
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title:
    "Explore Stellar Lab: Tools, Learning, and Developer Resources for the Stellar Network",
  description:
    "Explore Stellar Lab: Build, sign, and submit transactions. Access tools, Stellar RPC, Horizon, and more. Enhance your skills with Stellar Quest.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div id="root">
          <StoreProvider>
            <QueryProvider>
              <NetworkByPasswordProvider>
                <LayoutMain>{children}</LayoutMain>
              </NetworkByPasswordProvider>
            </QueryProvider>
          </StoreProvider>
        </div>
      </body>
    </html>
  );
}
