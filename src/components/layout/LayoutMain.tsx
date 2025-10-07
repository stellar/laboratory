"use client";

import { ReactNode, useEffect } from "react";

import { MaintenanceBanner } from "@/components/MaintenanceBanner";
import { NetworkNotAvailableBanner } from "@/components/NetworkNotAvailableBanner";
import { Hydration } from "@/components/Hydration";
import { LayoutHeader } from "@/components/layout/LayoutHeader";
import { LayoutWithSidebar } from "@/components/layout/LayoutWithSidebar";
import { LayoutSidebarContent } from "@/components/layout/LayoutSidebarContent";
import { FloatNotification } from "@/components/FloatNotification";

import { initTracking } from "@/metrics/tracking";
import { useStore } from "@/store/useStore";

export const LayoutMain = ({ children }: { children: ReactNode }) => {
  const { floatNotifications, removeFloatNotification } = useStore();

  // Init tracking
  useEffect(() => {
    initTracking();
  }, []);

  return (
    <div className="LabLayout">
      <div className="LabLayout__header">
        <NetworkNotAvailableBanner />
        <MaintenanceBanner />
        <LayoutHeader />
      </div>

      <Hydration>
        <LayoutWithSidebar>
          <LayoutSidebarContent>
            <FloatNotification
              notifications={floatNotifications}
              onClose={removeFloatNotification}
            />
            {children}
          </LayoutSidebarContent>
        </LayoutWithSidebar>
      </Hydration>
    </div>
  );
};
