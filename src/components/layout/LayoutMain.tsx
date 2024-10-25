"use client";

import { ReactNode, useEffect } from "react";

import { MaintenanceBanner } from "@/components/MaintenanceBanner";
import { Hydration } from "@/components/Hydration";
import { LayoutHeader } from "@/components/layout/LayoutHeader";

export const LayoutMain = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    console.log(
      ">>> process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY_1: ",
      process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY_1,
    );
    console.log(
      ">>> process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY_2: ",
      process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY_2,
    );
    console.log(
      ">>> process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY_3: ",
      process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY_3,
    );
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
