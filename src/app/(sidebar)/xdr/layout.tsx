"use client";

import React from "react";

import { LayoutSidebarContent } from "@/components/layout/LayoutSidebarContent";
import { Routes } from "@/constants/routes";

export default function XdrTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutSidebarContent
      sidebar={{
        navItems: [
          {
            route: Routes.VIEW_XDR,
            label: "View XDR",
          },
          {
            route: Routes.TO_XDR,
            label: "To XDR",
          },
        ],
      }}
    >
      {children}
    </LayoutSidebarContent>
  );
}
