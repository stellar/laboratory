import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Icon } from "@stellar/design-system";

import { Routes } from "@/constants/routes";
import { NextLink } from "@/components/NextLink";
import { trackEvent, TrackingEvent } from "@/metrics/tracking";

type NavLink = {
  href: Routes | string;
  label: string;
  icon?: ReactNode;
};

const primaryNavLinks: NavLink[] = [
  {
    href: Routes.ROOT,
    label: "Introduction",
  },
  {
    href: Routes.VIEW_XDR,
    label: "View XDR",
  },
  {
    href: Routes.ACCOUNT_CREATE,
    label: "Account",
  },
  {
    href: Routes.BUILD_TRANSACTION,
    label: "Transactions",
  },
  {
    href: Routes.ENDPOINTS,
    label: "API Explorer",
  },
  process.env.NEXT_PUBLIC_ENABLE_EXPLORER !== "true" && {
    href: Routes.SMART_CONTRACTS_CONTRACT_EXPLORER,
    label: "Smart Contracts",
  },
  process.env.NEXT_PUBLIC_ENABLE_EXPLORER === "true" && {
    href: Routes.TRANSACTIONS_EXPLORER,
    label: "Transactions Explorer",
  },
  {
    href: "https://developers.stellar.org/",
    label: "View Docs",
    icon: <Icon.LinkExternal01 />,
  },
].filter(Boolean) as NavLink[];

export const MainNav = ({ excludeDocs }: { excludeDocs?: boolean }) => {
  const pathname = usePathname();

  const isActiveRoute = (link: string) => {
    if (link.startsWith("http")) {
      return false;
    }

    return pathname?.split("/")[1] === link.split("/")[1];
  };

  const NavItem = ({ link }: { link: NavLink }) => (
    <NextLink
      href={link.href}
      onClick={() => {
        trackEvent(TrackingEvent.MAIN_NAV_CLICKED, { page: link.label });
      }}
      className={`NavLink ${isActiveRoute(link.href) ? "NavLink--active" : ""}`}
    >
      {link.label}

      {link.icon ? <span className="NavLink__icon">{link.icon}</span> : null}
    </NextLink>
  );

  const links = excludeDocs
    ? primaryNavLinks.filter((l) => l.label !== "View Docs")
    : primaryNavLinks;

  return (
    <nav className="LabLayout__header__nav">
      <div className="LabLayout__header__nav--primary">
        {links.map((l) => (
          <NavItem key={l.href} link={l} />
        ))}
      </div>
    </nav>
  );
};
