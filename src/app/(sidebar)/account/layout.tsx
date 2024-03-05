"use client";

import { LayoutSidebarContent } from "@/components/layout/LayoutSidebarContent";
import { Routes } from "@/constants/routes";

export default function AccountTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutSidebarContent
      sidebar={{
        navItems: [
          {
            route: Routes.CREATE_ACCOUNT,
            label: "Create Account",
          },
          {
            route: Routes.FUND_ACCOUNT,
            label: "Fund Account",
          },
        ],
      }}
    >
      {children}
    </LayoutSidebarContent>
  );
}
