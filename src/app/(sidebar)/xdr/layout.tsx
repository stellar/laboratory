"use client";

import React from "react";

import { LayoutSidebarContent } from "@/components/layout/LayoutSidebarContent";
import { XDR_NAV_ITEMS } from "@/constants/navItems";

export default function XdrTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutSidebarContent sidebar={XDR_NAV_ITEMS}>
      {children}
    </LayoutSidebarContent>
  );
}
