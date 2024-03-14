import { usePathname } from "next/navigation";

import { Routes } from "@/constants/routes";
import { NextLink } from "@/components/NextLink";

type NavLink = {
  href: Routes | string;
  label: string;
};

const primaryNavLinks: NavLink[] = [
  {
    href: Routes.ROOT,
    label: "Introduction",
  },
  {
    href: Routes.ACCOUNT_CREATE,
    label: "Account",
  },
  {
    href: Routes.EXPLORE_ENDPOINTS,
    label: "Explore Endpoints",
  },
  {
    href: Routes.BUILD_TRANSACTION,
    label: "Transactions",
  },
  {
    href: Routes.VIEW_XDR,
    label: "View XDR",
  },
  {
    href: Routes.SOROBAN_CONTRACT_EXPLORER,
    label: "Soroban",
  },
];

const secondaryNavLinks: NavLink[] = [
  {
    href: "https://developers.stellar.org/docs",
    label: "View Documentation",
  },
];

export const MainNav = () => {
  const pathname = usePathname();

  const isActiveRoute = (link: string) => {
    if (link.startsWith("http")) {
      return false;
    }

    return pathname.split("/")[1] === link.split("/")[1];
  };

  const NavItem = ({ link }: { link: NavLink }) => (
    <NextLink
      href={link.href}
      className={`NavLink ${isActiveRoute(link.href) ? "NavLink--active" : ""}`}
    >
      {link.label}
    </NextLink>
  );

  return (
    <nav className="LabLayout__header__nav">
      {/* Primary nav links */}
      <div className="LabLayout__header__nav--primary">
        {primaryNavLinks.map((l) => (
          <NavItem key={l.href} link={l} />
        ))}
      </div>
      {/* Secondary nav links */}
      <div className="LabLayout__header__nav--secondary">
        {secondaryNavLinks.map((sl) => (
          <NavItem key={sl.href} link={sl} />
        ))}
      </div>
    </nav>
  );
};
