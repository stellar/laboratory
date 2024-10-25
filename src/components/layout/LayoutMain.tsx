"use client";

import { ReactNode, useEffect } from "react";

import { MaintenanceBanner } from "@/components/MaintenanceBanner";
import { Hydration } from "@/components/Hydration";
import { LayoutHeader } from "@/components/layout/LayoutHeader";

export const LayoutMain = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    Object.entries(process.env).forEach((env) => {
      console.log(">>> env: ", env);
    });
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
