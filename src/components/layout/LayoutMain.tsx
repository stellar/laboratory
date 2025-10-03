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

  // Handle auto closing float notifications
  useEffect(() => {
    if (floatNotifications.length === 0) {
      return;
    }

    // No need to check if there are no auto closing notifications
    const hasAutoCloseNotifications = floatNotifications.some(
      (notification) => notification.closeAt,
    );

    if (!hasAutoCloseNotifications) {
      return;
    }

    // Check every 100ms for expired notifications
    const interval = setInterval(() => {
      const now = Date.now();
      floatNotifications.forEach((notification) => {
        if (notification.closeAt && now >= notification.closeAt) {
          removeFloatNotification(notification.id);
        }
      });
    }, 100);

    return () => clearInterval(interval);
  }, [floatNotifications, removeFloatNotification]);

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
