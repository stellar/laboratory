"use client";

import React from "react";
import { LayoutSidebarContent } from "@/components/layout/LayoutSidebarContent";
import { ENDPOINTS_PAGES_HORIZON } from "@/constants/endpointsPages";

export default function EndpointsTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // TODO: add saved endpoints
    // TODO: add RPC endpoints
    <LayoutSidebarContent sidebar={[ENDPOINTS_PAGES_HORIZON]}>
      {children}
    </LayoutSidebarContent>
  );
}
