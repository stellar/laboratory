"use client";

import React from "react";
import { Icon } from "@stellar/design-system";
import { LayoutSidebarContent } from "@/components/layout/LayoutSidebarContent";
import {
  ENDPOINTS_PAGES_RPC,
  ENDPOINTS_PAGES_HORIZON,
  EndpointsPagesProps,
} from "@/constants/endpointsPages";
import { Routes } from "@/constants/routes";

export default function EndpointsTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const ENDPOINTS_PAGES_INTRO: EndpointsPagesProps = {
    navItems: [
      {
        route: Routes.ENDPOINTS,
        label: "About Endpoints",
      },
    ],
    hasBottomDivider: false,
  };
  const ENDPOINTS_PAGES_SAVED: EndpointsPagesProps = {
    navItems: [
      {
        route: Routes.ENDPOINTS_SAVED,
        label: "Saved Endpoints",
        icon: <Icon.Save03 />,
      },
    ],
    hasBottomDivider: true,
  };

  return (
    <LayoutSidebarContent
      sidebar={[
        ENDPOINTS_PAGES_SAVED,
        ENDPOINTS_PAGES_INTRO,
        ENDPOINTS_PAGES_RPC,
        ENDPOINTS_PAGES_HORIZON,
      ]}
    >
      {children}
    </LayoutSidebarContent>
  );
}
