"use client";

import { ReactNode, useEffect } from "react";

import { MaintenanceBanner } from "@/components/MaintenanceBanner";
import { NetworkNotAvailableBanner } from "@/components/NetworkNotAvailableBanner";
import { Hydration } from "@/components/Hydration";
import { LayoutHeader } from "@/components/layout/LayoutHeader";
import { LayoutWithSidebar } from "@/components/layout/LayoutWithSidebar";
import { LayoutSidebarContent } from "@/components/layout/LayoutSidebarContent";
import { initTracking } from "@/metrics/tracking";

export const LayoutMain = ({ children }: { children: ReactNode }) => {
  // Init tracking
  useEffect(() => {
    initTracking();
  }, []);

  return (
    <div className="LabLayout">
      <div>
        <NetworkNotAvailableBanner />
        <MaintenanceBanner />
        <LayoutHeader />
      </div>

      <Hydration>
        <LayoutWithSidebar>
          <LayoutSidebarContent>{children}</LayoutSidebarContent>
        </LayoutWithSidebar>
      </Hydration>
    </div>
  );
};
