"use client";

import React from "react";

import { LayoutSidebarContent } from "@/components/layout/LayoutSidebarContent";
import { Routes } from "@/constants/routes";

export const XDR_NAV_ITEMS = [
  {
    navItems: [
      {
        route: Routes.VIEW_XDR,
        label: "XDR to JSON",
      },
      {
        route: Routes.TO_XDR,
        label: "JSON to XDR",
      },
    ],
  },
];

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
