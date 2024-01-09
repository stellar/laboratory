import type { Metadata } from "next";

import { MainLayout } from "./ui/MainLayout";

import "@stellar/design-system/build/styles.min.css";
import "./globals.scss";

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
          <MainLayout>{children}</MainLayout>
        </div>
      </body>
    </html>
  );
}
