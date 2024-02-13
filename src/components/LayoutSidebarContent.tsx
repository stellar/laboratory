"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import NextLink from "next/link";
import { Routes } from "@/constants/routes";
import { Icon } from "@stellar/design-system";

export type SidebarLink = {
  route: Routes | string;
  label: string;
  icon?: ReactNode;
  nestedItems?: SidebarLink[];
};

export type Sidebar = {
  navItems: SidebarLink[];
  instruction?: string;
  bottomItems?: SidebarLink[];
};

export const LayoutSidebarContent = ({
  children,
  sidebar,
}: {
  children: ReactNode;
  sidebar: Sidebar;
}) => {
  const pathname = usePathname();

  const Link = ({ item }: { item: SidebarLink }) => (
    <NextLink
      href={item.route}
      className={`SidebarLink ${
        pathname === item.route ? "SidebarLink--active" : ""
      }`}
    >
      {item.icon ?? null} {item.label}
    </NextLink>
  );

  return (
    <>
      <div className="LabLayout__sidebar">
        <div className="LabLayout__sidebar--top">
          {/* TODO: add instruction */}
          {/* TODO: render nested items */}

          {sidebar.navItems.map((item) => (
            <Link key={item.route} item={item} />
          ))}
        </div>
        <div
          className={`LabLayout__sidebar--bottom ${
            sidebar.bottomItems?.length
              ? "LabLayout__sidebar--bottom--border"
              : ""
          }`}
        >
          <div className="LabLayout__sidebar__wrapper">
            {sidebar.bottomItems?.map((bi) => (
              <Link key={bi.route} item={bi} />
            ))}
          </div>
          <div className="LabLayout__sidebar__wrapper">
            <NextLink href="https://stellar.org" className="SidebarLink">
              <Icon.MessageTextSquare02 /> Got product feedback?
            </NextLink>
          </div>
        </div>
      </div>
      <div className="LabLayout__container">
        <div className="LabLayout__content">{children}</div>
      </div>
    </>
  );
};
