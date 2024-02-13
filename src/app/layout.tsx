import type { Metadata } from "next";

import { LayoutMain } from "@/components/LayoutMain";

import "@stellar/design-system/build/styles.min.css";
import "@/styles/globals.scss";

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
