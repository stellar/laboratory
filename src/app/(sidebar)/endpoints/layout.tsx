"use client";

import React from "react";
import { LayoutSidebarContent } from "@/components/layout/LayoutSidebarContent";
import { ENDPOINTS_NAV_ITEMS } from "@/constants/navItems";

export default function EndpointsTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutSidebarContent sidebar={ENDPOINTS_NAV_ITEMS}>
      {children}
    </LayoutSidebarContent>
  );
}
