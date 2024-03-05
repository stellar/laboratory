"use client";

import { ReactNode, useState } from "react";
import { usePathname } from "next/navigation";
import { Icon } from "@stellar/design-system";
import { Routes } from "@/constants/routes";
import { NextLink } from "@/components/NextLink";

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
  sidebar: Sidebar | Sidebar[];
}) => {
  const pathname = usePathname();

  const sidebarArray = Array.isArray(sidebar) ? sidebar : [sidebar];
  const bottomItems = sidebarArray?.reduce((res, cur) => {
    if (cur.bottomItems?.length) {
      return [...res, ...cur.bottomItems];
    }

    return res;
  }, [] as SidebarLink[]);

  return (
    <>
      <div className="LabLayout__sidebar">
        <div className="LabLayout__sidebar--top">
          {sidebarArray.map((sidebar, index) => (
            <div
              className="LabLayout__sidebar__section"
              key={`sidebar-${index}`}
            >
              {sidebar.instruction ? (
                <div className="LabLayout__sidebar__instruction">
                  {sidebar.instruction}
                </div>
              ) : null}

              {sidebar.navItems.map((item) => (
                <Link key={item.route} item={item} pathname={pathname} />
              ))}
            </div>
          ))}
        </div>
        <div
          className={`LabLayout__sidebar--bottom ${
            bottomItems?.length ? "LabLayout__sidebar--bottom--border" : ""
          }`}
        >
          <div className="LabLayout__sidebar__wrapper">
            {bottomItems?.map((bi) => (
              <Link key={bi.route} item={bi} pathname={pathname} />
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

const Link = ({ item, pathname }: { item: SidebarLink; pathname: string }) => {
  const isSelectedParent = item.nestedItems?.length
    ? pathname?.split(Routes.EXPLORE_ENDPOINTS)?.[1]?.split("/")?.[1] ===
      item.route?.split(Routes.EXPLORE_ENDPOINTS)?.[1]?.split("/")?.[1]
    : false;

  const [isExpanded, setIsExpanded] = useState(isSelectedParent);

  if (item.nestedItems?.length) {
    return (
      <div className="SidebarLink--nested">
        <div
          className="SidebarLink SidebarLink__toggle"
          onClick={() => {
            setIsExpanded(!isExpanded);
          }}
        >
          <Icon.ChevronRight /> {item.label}
        </div>

        {item.nestedItems?.length ? (
          <div
            className="SidebarLink__nestedItemsWrapper"
            data-is-expanded={isExpanded}
          >
            <div className="SidebarLink__nestedItems">
              {item.nestedItems.map((nested) => (
                <NextLink
                  key={`nested-${nested.route}`}
                  href={nested.route}
                  className="SidebarLink"
                  data-is-active={pathname === nested.route}
                >
                  {nested.label}
                </NextLink>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <NextLink
      href={item.route}
      className="SidebarLink"
      data-is-active={pathname === item.route}
    >
      {item.icon ?? null} {item.label}
    </NextLink>
  );
};
