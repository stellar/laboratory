"use client";

import { Icon } from "@stellar/design-system";
import { LayoutSidebarContent } from "@/components/LayoutSidebarContent";
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
          {
            route: Routes.CREATE_MUXED_ACCOUNT,
            label: "Create Muxed Account",
          },
          {
            route: Routes.PARSE_MUXED_ACCOUNT,
            label: "Parse Muxed Account",
          },
        ],
      }}
    >
      {children}
    </LayoutSidebarContent>
  );
}
