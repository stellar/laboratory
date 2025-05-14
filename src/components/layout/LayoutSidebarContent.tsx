"use client";

import { ReactNode, useContext } from "react";
import { Icon, Loader, Logo } from "@stellar/design-system";

import { GITHUB_URL } from "@/constants/settings";
import { NAV } from "@/constants/navItems";

import { NextLink } from "@/components/NextLink";
import { NavLink } from "@/components/NavLink";

import { WindowContext } from "./LayoutContextProvider";

export const LayoutSidebarContent = ({ children }: { children: ReactNode }) => {
  const { layoutMode } = useContext(WindowContext);

  if (layoutMode === "desktop") {
    return (
      <>
        {/* Sidebar */}
        <div className="LabLayout__sidebar">
          {/* Nav links */}
          <div className="LabLayout__sidebar--top" data-testid="sidebar-links">
            {NAV.map((item) => (
              <NavLink
                key={`${item.label}-${item.route}`}
                item={item}
                level={0}
              />
            ))}
          </div>

          {/* External links */}
          <div className="LabLayout__sidebar--bottom">
            <div className="LabLayout__sidebar__wrapper">
              <NextLink
                href="https://developers.stellar.org/"
                className="SidebarLink"
              >
                <Icon.BookClosed /> Documentation
              </NextLink>
              <NextLink href={`${GITHUB_URL}/issues`} className="SidebarLink">
                <Icon.MessageTextSquare02 /> Got product feedback?
              </NextLink>
              <NextLink
                href={GITHUB_URL}
                className="SidebarLink Link--withLogo"
              >
                <Logo.Github /> GitHub
              </NextLink>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="LabLayout__container">
          <div className="LabLayout__content">{children}</div>
        </div>
      </>
    );
  }

  if (layoutMode === "mobile") {
    return (
      <div className="LabLayout__container">
        <div className="LabLayout__content">{children}</div>
      </div>
    );
  }

  return <Loader />;
};
