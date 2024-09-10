"use client";

import React from "react";

import { LayoutSidebarContent } from "@/components/layout/LayoutSidebarContent";
import { TRANSACTION_NAV_ITEMS } from "@/constants/navItems";

export default function TransactionTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutSidebarContent sidebar={TRANSACTION_NAV_ITEMS}>
      {children}
    </LayoutSidebarContent>
  );
}
