"use client";

import React from "react";

import { LayoutSidebarContent } from "@/components/layout/LayoutSidebarContent";

export default function ExplorerTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LayoutSidebarContent sidebar={[]}>{children}</LayoutSidebarContent>;
}
