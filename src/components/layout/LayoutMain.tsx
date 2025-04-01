"use client";

import { ReactNode, useEffect } from "react";

import { MaintenanceBanner } from "@/components/MaintenanceBanner";
import { Hydration } from "@/components/Hydration";
import { LayoutHeader } from "@/components/layout/LayoutHeader";
import { initTracking } from "@/metrics/tracking";

export const LayoutMain = ({ children }: { children: ReactNode }) => {
  // Init tracking
  useEffect(() => {
    initTracking();
  }, []);

  return (
    <div className="LabLayout">
      <div>
        <MaintenanceBanner />
        <LayoutHeader />
      </div>

      <Hydration>{children}</Hydration>
    </div>
  );
};
