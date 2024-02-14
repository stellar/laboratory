import type { Metadata } from "next";

import { LayoutMain } from "@/components/layout/LayoutMain";

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
        <div id="root" className="LabLayout">
          <LayoutMain>{children}</LayoutMain>
        </div>
      </body>
    </html>
  );
}
