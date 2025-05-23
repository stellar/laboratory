"use client";

import { ReactNode, useContext } from "react";
import { Loader } from "@stellar/design-system";
import { WindowContext } from "@/components/layout/LayoutContextProvider";
import { useStore } from "@/store/useStore";

export const LayoutWithSidebar = ({ children }: { children: ReactNode }) => {
  const { layoutMode } = useContext(WindowContext);
  const { isMainNavHidden } = useStore();

  if (layoutMode === "desktop") {
    return (
      <div className="LabLayout__withSidebar" data-is-hidden={isMainNavHidden}>
        {children}
      </div>
    );
  }

  if (layoutMode === "mobile") {
    return children;
  }

  return (
    <div className="LabLayout__loader">
      <Loader size="1.5rem" />
    </div>
  );
};
