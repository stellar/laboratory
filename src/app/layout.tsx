import React from "react";
import type { Metadata } from "next";

import { LayoutMain } from "@/components/layout/LayoutMain";
import { Hydration } from "@/components/Hydration";
import { QueryProvider } from "@/query/QueryProvider";
import { StoreProvider } from "@/store/StoreProvider";

import "@stellar/design-system/build/styles.min.css";
import "@/styles/globals.scss";

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
              <Hydration>
                <LayoutMain>{children}</LayoutMain>
              </Hydration>
            </QueryProvider>
          </StoreProvider>
        </div>
      </body>
    </html>
  );
}
