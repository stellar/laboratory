import { useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Icon } from "@stellar/design-system";

import { Routes } from "@/constants/routes";
import { NavItem } from "@/constants/navItems";

import { NextLink } from "@/components/NextLink";
import { sanitizeArray } from "@/helpers/sanitizeArray";
import { scrollElIntoView } from "@/helpers/scrollElIntoView";
import { trackEvent, TrackingEvent } from "@/metrics/tracking";

export const NavLink = ({ item, level }: { item: NavItem; level: number }) => {
  const pathname = usePathname() || "";

  const isActive = isActivePath(pathname, item.route, level);
  const [isExpanded, setIsExpanded] = useState(isActive);
  const linkRef = useRef<HTMLAnchorElement | null>(null);

  useLayoutEffect(() => {
    if (isExpanded && linkRef) {
      scrollElIntoView(linkRef);
    }
    // Scroll to link only on initial render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (item.subNav?.length) {
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
          data-is-active-parent={isActive}
        >
          {item.label} <Icon.ChevronRight />
        </div>

        {item.subNav?.length ? (
          <div
            className="SidebarLink__nestedItemsWrapper"
            data-is-expanded={isExpanded}
            data-testid="endpoints-sidebar-linksContainer"
          >
            <div className="SidebarLink__nestedItems">
              {item.subNav.map((nested) => (
                <NavLink
                  key={`${nested.label}-${nested.route}`}
                  item={nested}
                  level={level + 1}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <NextLink
      key={`nested-${item.route}`}
      ref={linkRef}
      href={item.route || ""}
      className="SidebarLink"
      data-is-active={isActive}
      data-testid="endpoints-sidebar-link"
      onClick={() => {
        trackEvent(TrackingEvent.SUBNAV_CLICKED, {
          route: item.route,
        });
      }}
    >
      {item.icon ?? null} {item.label}
    </NextLink>
  );
};

const isActivePath = (
  pathname: string,
  route: Routes | undefined,
  level: number,
) => {
  if (pathname === route) {
    return true;
  }

  if (pathname && route) {
    const pathnameSections = sanitizeArray(pathname.split("/"));
    const routeSections = sanitizeArray(route.split("/"));

    if (
      level >= 0 &&
      level <= pathnameSections.length &&
      level <= routeSections.length
    ) {
      const pathnameSlice = pathnameSections.slice(0, level + 1);
      const routeSlice = routeSections.slice(0, level + 1);
      return pathnameSlice.join("/") === routeSlice.join("/");
    }
  }

  return false;
};
