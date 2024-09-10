"use client";

import { ReactNode, useContext } from "react";
import { Loader } from "@stellar/design-system";
import { WindowContext } from "@/components/layout/LayoutContextProvider";

export const LayoutWithSidebar = ({ children }: { children: ReactNode }) => {
  const { layoutMode } = useContext(WindowContext);

  if (layoutMode === "desktop") {
    return <div className="LabLayout__withSidebar">{children}</div>;
  }

  if (layoutMode === "mobile") {
    return children;
  }

  return <Loader />;
};
