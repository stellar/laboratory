"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

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
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(52);

  // Init tracking
  useEffect(() => {
    initTracking();
  }, []);

  // Track header height
  useEffect(() => {
    const headerElement = headerRef.current;
    if (!headerElement) return;

    const updateHeight = () => {
      setHeaderHeight(headerElement.offsetHeight);
    };

    updateHeight();

    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(headerElement);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Handle auto closing float notifications
  useEffect(() => {
    if (floatNotifications.length === 0) {
      return;
    }

    const hasAutoCloseNotifications = floatNotifications.some(
      (notification) => notification.closeAt,
    );

    if (!hasAutoCloseNotifications) {
      return;
    }

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
      <div className="LabLayout__header" ref={headerRef}>
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
              headerHeight={headerHeight}
            />
            {children}
          </LayoutSidebarContent>
        </LayoutWithSidebar>
      </Hydration>
    </div>
  );
};
