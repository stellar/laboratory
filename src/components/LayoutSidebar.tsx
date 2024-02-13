"use client";

import { ReactNode } from "react";

export const LayoutSidebar = ({ children }: { children: ReactNode }) => {
  return <div className="LabLayout__withSidebar">{children}</div>;
};
