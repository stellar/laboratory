"use client";

import { ReactNode } from "react";

import { MaintenanceBanner } from "@/components/MaintenanceBanner";
import { Hydration } from "@/components/Hydration";
import { LayoutHeader } from "@/components/layout/LayoutHeader";

export const LayoutMain = ({ children }: { children: ReactNode }) => {
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
