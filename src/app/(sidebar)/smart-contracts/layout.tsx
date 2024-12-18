"use client";

import React from "react";
import { LayoutSidebarContent } from "@/components/layout/LayoutSidebarContent";
import { SMART_CONTRACTS_NAV_ITEMS } from "@/constants/navItems";

import "./styles.scss";

export default function SmartContractsTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutSidebarContent sidebar={SMART_CONTRACTS_NAV_ITEMS}>
      {children}
    </LayoutSidebarContent>
  );
}
