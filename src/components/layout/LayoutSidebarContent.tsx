"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Icon, Logo } from "@stellar/design-system";
import { Routes } from "@/constants/routes";
import { NextLink } from "@/components/NextLink";
import { GITHUB_URL } from "@/constants/settings";

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
  hasBottomDivider?: boolean;
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
              className={`LabLayout__sidebar__section ${sidebar.hasBottomDivider ? "LabLayout__sidebar__section--divider" : ""}`}
              key={`sidebar-${index}`}
              data-testid="endpoints-sidebar-section"
            >
              {sidebar.instruction ? (
                <NestedNav sidebar={sidebar} pathname={pathname} />
              ) : (
                sidebar.navItems.map((item) => (
                  <Link key={item.route} item={item} pathname={pathname} />
                ))
              )}
            </div>
          ))}
        </div>
        <div className="LabLayout__sidebar--bottom">
          <div className="LabLayout__sidebar__wrapper">
            {bottomItems?.map((bi) => (
              <Link key={bi.route} item={bi} pathname={pathname} />
            ))}
          </div>
          <div className="LabLayout__sidebar__wrapper">
            <NextLink href={`${GITHUB_URL}/issues`} className="SidebarLink">
              <Icon.MessageTextSquare02 /> Got product feedback?
            </NextLink>
            <NextLink href={GITHUB_URL} className="SidebarLink Link--withLogo">
              <Logo.Github /> GitHub
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

const NestedNav = ({
  pathname,
  sidebar,
}: {
  pathname: string;
  sidebar: Sidebar;
}) => {
  const isSelectedParent = sidebar.navItems.some((item) =>
    pathname.includes(item.route),
  );
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    if (isSelectedParent) {
      setIsExpanded(isSelectedParent);
    }
  }, [isSelectedParent]);

  return (
    <div
      className="LabLayout__sidebar__instruction"
      data-testid="endpoints-sidebar-subtitle"
    >
      <div
        className="SidebarLink SidebarLink__toggle"
        onClick={() => {
          setIsExpanded(!isExpanded);
        }}
        data-is-expanded={isExpanded}
        data-testid="endpoints-sidebar-linkToggle"
      >
        {sidebar.instruction} <Icon.ChevronRight />
      </div>

      {sidebar.navItems?.length ? (
        <div
          className="SidebarLink__nestedItemsWrapper"
          data-is-expanded={isExpanded}
          data-testid="endpoints-sidebar-linksContainer"
        >
          <div className="SidebarLink__nestedItems">
            {sidebar.navItems.map((item) => (
              <Link key={item.route} item={item} pathname={pathname} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

const Link = ({ item, pathname }: { item: SidebarLink; pathname: string }) => {
  const isSelectedParent = item.nestedItems?.length
    ? pathname?.split(Routes.ENDPOINTS)?.[1]?.split("/")?.[1] ===
      item.route?.split(Routes.ENDPOINTS)?.[1]?.split("/")?.[1]
    : false;

  useEffect(() => {
    if (isSelectedParent) {
      setIsExpanded(isSelectedParent);
    }
  }, [isSelectedParent]);

  const [isExpanded, setIsExpanded] = useState(isSelectedParent);

  if (item.nestedItems?.length) {
    return (
      <div
        className="SidebarLink--nested"
        data-testid={`endpoints-sidebar${item.route}`}
      >
        <div
          className="SidebarLink SidebarLink__toggle"
          onClick={() => {
            setIsExpanded(!isExpanded);
          }}
          data-testid="endpoints-sidebar-linkToggle"
        >
          {item.label} <Icon.ChevronRight />
        </div>

        {item.nestedItems?.length ? (
          <div
            className="SidebarLink__nestedItemsWrapper"
            data-is-expanded={isExpanded}
            data-testid="endpoints-sidebar-linksContainer"
          >
            <div className="SidebarLink__nestedItems">
              {item.nestedItems.map((nested) => (
                <NextLink
                  key={`nested-${nested.route}`}
                  href={nested.route}
                  className="SidebarLink"
                  data-is-active={pathname === nested.route}
                  data-testid="endpoints-sidebar-link"
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
      {item.label} {item.icon ?? null}
    </NextLink>
  );
};
