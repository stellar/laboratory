"use client";

import { LayoutSidebarContent } from "@/components/layout/LayoutSidebarContent";

export default function TransactionTemplate({
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
