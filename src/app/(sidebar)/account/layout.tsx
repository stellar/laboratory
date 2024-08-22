"use client";

import React from "react";

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
            route: Routes.ACCOUNT_CREATE,
            label: "Create Account Keypair",
          },
          {
            route: Routes.ACCOUNT_FUND,
            label: "Fund Account",
          },
          {
            route: Routes.ACCOUNT_CREATE_MUXED,
            label: "Create Muxed Account",
          },
          {
            route: Routes.ACCOUNT_PARSE_MUXED,
            label: "Parse Muxed Account",
          },
        ],
      }}
    >
      {children}
    </LayoutSidebarContent>
  );
}
