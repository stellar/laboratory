"use client";

import { LayoutSidebarContent } from "@/components/layout/LayoutSidebarContent";

export default function ExploreEndpointsTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutSidebarContent
      sidebar={{
        navItems: [],
      }}
    >
      {children}
    </LayoutSidebarContent>
  );
}
