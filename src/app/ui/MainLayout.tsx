"use client";

import { ReactNode } from "react";
import { Layout } from "@stellar/design-system";

export const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Layout.Header
        projectId="stellar-laboratory"
        projectTitle="Laboratory"
        hasThemeSwitch
      />
      <Layout.Content>{children}</Layout.Content>
      <Layout.Footer gitHubLink="https://github.com/stellar/laboratory" />
    </>
  );
};
