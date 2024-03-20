import React from "react";
import type { Metadata } from "next";

import { LayoutMain } from "@/components/layout/LayoutMain";
import { QueryProvider } from "@/query/QueryProvider";
import { StoreProvider } from "@/store/StoreProvider";

import "@stellar/design-system/build/styles.min.css";
import "@/styles/globals.scss";

export const dynamic = "force-dynamic";

// TODO: update metadata
export const metadata: Metadata = {
  title: "Laboratory - Stellar",
  description: "",
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
              <LayoutMain>{children}</LayoutMain>
            </QueryProvider>
          </StoreProvider>
        </div>
      </body>
    </html>
  );
}
