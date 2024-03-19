"use client";

import { LayoutSidebarContent } from "@/components/layout/LayoutSidebarContent";
import { EXPLORE_ENDPOINTS_PAGES_HORIZON } from "@/constants/exploreEndpointsPages";

export default function ExploreEndpointsTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // TODO: add saved endpoints
    // TODO: add RPC endpoints
    <LayoutSidebarContent sidebar={[EXPLORE_ENDPOINTS_PAGES_HORIZON]}>
      {children}
    </LayoutSidebarContent>
  );
}
