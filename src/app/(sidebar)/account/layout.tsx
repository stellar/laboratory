"use client";

import React from "react";

import { LayoutSidebarContent } from "@/components/layout/LayoutSidebarContent";
import { Routes } from "@/constants/routes";
import { useIsTestingNetwork } from "@/hooks/useIsTestingNetwork";

// Includes navigation items that should ONLY display
// in TESTNET or FUTURENET
const DEFAULT_ACCOUNT_NAV_ITEMS = [
  {
    route: Routes.ACCOUNT_CREATE,
    label: "Create Account",
  },
  {
    route: Routes.ACCOUNT_FUND,
    label: "Fund Account",
    isTestnetOnly: true,
  },
  {
    route: Routes.ACCOUNT_CREATE_MUXED,
    label: "Create Muxed Account",
  },
  {
    route: Routes.ACCOUNT_PARSE_MUXED,
    label: "Parse Muxed Account",
  },
];

export default function AccountTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const IS_TESTING_NETWORK = useIsTestingNetwork();

  // Filtered navigation items for MAINNET
  const filteredNavItems = DEFAULT_ACCOUNT_NAV_ITEMS.filter(
    ({ isTestnetOnly }) => !isTestnetOnly,
  );

  const navItems = IS_TESTING_NETWORK
    ? DEFAULT_ACCOUNT_NAV_ITEMS
    : filteredNavItems;

  return (
    <LayoutSidebarContent
      sidebar={{
        navItems,
      }}
    >
      {children}
    </LayoutSidebarContent>
  );
}
