import React from "react";
import { LayoutWithSidebar } from "@/components/layout/LayoutWithSidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <LayoutWithSidebar>{children}</LayoutWithSidebar>;
}
