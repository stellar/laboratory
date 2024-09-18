"use client";

import React from "react";

import { LayoutSidebarContent } from "@/components/layout/LayoutSidebarContent";
import { ACCOUNT_NAV_ITEMS } from "@/constants/navItems";

export default function AccountTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutSidebarContent sidebar={ACCOUNT_NAV_ITEMS}>
      {children}
    </LayoutSidebarContent>
  );
}
