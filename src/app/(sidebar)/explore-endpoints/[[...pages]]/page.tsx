"use client";

import { Routes } from "@/constants/routes";
import { usePathname } from "next/navigation";

export default function ExploreEndpoints() {
  const pathname = usePathname();

  if (pathname === Routes.EXPLORE_ENDPOINTS) {
    return <div>Endpoints landing</div>;
  }

  return renderPage(pathname);
}

const renderPage = (pathname: string) => {
  // TODO: add switch to render path component
  return <div>{`Explore Endpoints: ${pathname}`}</div>;
};
