"use client";

import { useContext, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Button,
  Icon,
  IconButton,
  ProjectLogo,
  Select,
  ThemeSwitch,
} from "@stellar/design-system";
import { useStore } from "@/store/useStore";

import { WindowContext } from "@/components/layout/LayoutContextProvider";
import { NetworkSelector } from "@/components/NetworkSelector";
import { Hydration } from "@/components/Hydration";
import { Box } from "@/components/layout/Box";
import { FloaterDropdown } from "@/components/FloaterDropdown";
import { ConnectWallet } from "@/components/WalletKit/ConnectWallet";

import { isExternalLink } from "@/helpers/isExternalLink";
import { LOCAL_STORAGE_SAVED_THEME } from "@/constants/settings";
import { NAV, NavItem } from "@/constants/navItems";

import { trackEvent, TrackingEvent } from "@/metrics/tracking";
import { ThemeColorType } from "@/types/types";

export const LayoutHeader = () => {
  const { layoutMode } = useContext(WindowContext);
  const { setTheme, isMainNavHidden, toggleIsMainNavHidden } = useStore();
  const route = useRouter();
  const pathname = usePathname();

  // Make sure we always have the theme set in the store
  useEffect(() => {
    const attr = "data-sds-theme";
    const getVal = () => document.body.getAttribute(attr);

    const currentTheme = getVal();

    if (currentTheme) {
      setTheme(currentTheme as ThemeColorType);
      return;
    }

    const observer = new MutationObserver(() => {
      const theme = getVal();

      if (theme) {
        observer.disconnect();
        setTheme(theme as ThemeColorType);
      }
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: [attr],
    });

    return () => {
      observer.disconnect();
    };
  }, [setTheme]);

  const handleNavChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    route.push(event.target.value);
    trackEvent(TrackingEvent.MOBILE_NAV_CLICKED, { page: event.target.value });
  };

  type MobileNavItem = {
    label: string;
    value: string;
  };

  type MobileNavGroup = {
    groupTitle: string;
    options: MobileNavItem[];
  };

  // Flatten the nav structure for mobile nav dropdown. Nested sub-navs are their own group (Horizon Endpoints methods,
  // for example)
  const formatNavToMobileNav = () => {
    const processNavItem = (item: NavItem): MobileNavItem => ({
      label: item.label,
      value: item.route.toString(),
    });

    const processSubNav = (navItem: NavItem) => {
      const result = navItem.subNav?.reduce(
        (
          acc: {
            options: MobileNavItem[];
            nestedOptions: (MobileNavItem | MobileNavGroup)[];
          },
          sn,
        ) => {
          if (!sn.subNav) {
            acc.options.push(processNavItem(sn));
            return acc;
          }

          const subGroup = {
            groupTitle: sn.label,
            options: sn.subNav.filter((i) => !i.subNav).map(processNavItem),
          };

          const nestedGroups = sn.subNav
            .filter((i) => i.subNav)
            .map((i) => ({
              groupTitle: i.label,
              options: i?.subNav?.map(processNavItem) || [],
            }));

          acc.nestedOptions.push(subGroup, ...nestedGroups);
          return acc;
        },
        { options: [], nestedOptions: [] },
      );

      return [
        { groupTitle: navItem.label, options: result?.options || [] },
        ...(result?.nestedOptions || []),
      ];
    };

    return NAV.reduce(
      (res: (MobileNavItem | MobileNavGroup)[], cur: NavItem) =>
        cur.subNav
          ? [...res, ...processSubNav(cur)]
          : [...res, processNavItem(cur)],
      [],
    );
  };

  const renderNav = () => {
    return (
      <>
        {formatNavToMobileNav().map(
          (fn: MobileNavItem | MobileNavGroup, groupIdx) => {
            if ("groupTitle" in fn) {
              return (
                <optgroup
                  key={`${fn.groupTitle}-${groupIdx}`}
                  label={fn.groupTitle}
                >
                  {fn.options.map((op) => (
                    <option
                      key={`${fn.groupTitle}-${op.value}`}
                      value={op.value}
                    >
                      {op.label}
                    </option>
                  ))}
                </optgroup>
              );
            }

            return (
              <option key={`${fn.value}-${groupIdx}`} value={fn.value}>
                {fn.label}
              </option>
            );
          },
        )}
      </>
    );
  };

  const renderTheme = (isDarkMode: boolean) => {
    const theme = isDarkMode ? "sds-theme-dark" : "sds-theme-light";
    setTheme(theme);

    trackEvent(TrackingEvent.THEME_SET, { theme });
  };

  const renderSettingsDropdown = () => {
    return (
      <FloaterDropdown
        triggerEl={<IconButton icon={<Icon.Settings01 />} altText="Menu" />}
        offset={14}
      >
        <>
          <div className="LabLayout__header__dropdown__item">
            <div className="LabLayout__header__dropdown__item__label">
              <ConnectWallet />
            </div>
          </div>

          <DropdownItem label="Theme">
            <Hydration>
              <ThemeSwitch
                storageKeyId={LOCAL_STORAGE_SAVED_THEME}
                onActionEnd={renderTheme}
              />
            </Hydration>
          </DropdownItem>

          <DropdownItem
            label="View documentation"
            href="https://developers.stellar.org/"
          />

          <DropdownItem
            label="Got product feedback?"
            href="https://github.com/stellar/laboratory/issues"
          />

          <DropdownItem
            label="GitHub"
            href="https://github.com/stellar/laboratory"
          />
        </>
      </FloaterDropdown>
    );
  };

  if (!layoutMode) {
    return null;
  }

  // Mobile
  if (layoutMode === "mobile") {
    return (
      <div className="LabLayout__header">
        <header className="LabLayout__header__main">
          <div className="LabLayout__header__mobileNav">
            <Select
              id="mobile-nav"
              fieldSize="md"
              onChange={handleNavChange}
              value={pathname || undefined}
            >
              {renderNav()}
            </Select>
            <Icon.Menu01 aria-hidden="true" />
          </div>
          <Box gap="md" direction="row" align="center">
            <NetworkSelector />
            {renderSettingsDropdown()}
          </Box>
        </header>
      </div>
    );
  }

  // Desktop
  return (
    <div className="LabLayout__header">
      <header className="LabLayout__header__main">
        <Box
          gap="md"
          direction="row"
          align="center"
          addlClassName="LabLayout__header__left"
        >
          <Button
            size="md"
            variant="tertiary"
            onClick={() => toggleIsMainNavHidden(!isMainNavHidden)}
          >
            <div
              className="LabLayout__header__navIcon"
              data-is-hidden={isMainNavHidden}
            >
              <Icon.Menu01 aria-hidden={!isMainNavHidden} />
              <Icon.AlignLeft01 aria-hidden={isMainNavHidden} />
            </div>
          </Button>
          <ProjectLogo
            title="Lab"
            link="/"
            customAnchor={<Link href="/" prefetch={true} />}
          />
        </Box>

        <div className="LabLayout__header__settings">
          <Hydration>
            <ThemeSwitch
              storageKeyId={LOCAL_STORAGE_SAVED_THEME}
              onActionEnd={renderTheme}
            />
          </Hydration>
          <NetworkSelector />
          <ConnectWallet />
        </div>
      </header>
    </div>
  );
};

const DropdownItem = ({
  label,
  children,
  href,
}: {
  label: React.ReactNode;
  children?: React.ReactNode;
  href?: string;
}) => {
  const renderContent = (content?: React.ReactNode) => {
    const _content = content || children;

    return (
      <>
        <div className="LabLayout__header__dropdown__item__label">{label}</div>
        {_content ? (
          <div className="LabLayout__header__dropdown__item__value">
            {_content}
          </div>
        ) : null}
      </>
    );
  };

  if (href) {
    const isExternal = isExternalLink(href);
    const externalLinkProps = isExternal
      ? { rel: "noreferrer noopener", target: "_blank" }
      : {};

    return (
      <Link
        className="LabLayout__header__dropdown__item LabLayout__header__dropdown__item--link"
        href={href}
        prefetch={true}
        {...externalLinkProps}
      >
        {renderContent(isExternal ? <Icon.LinkExternal01 /> : null)}
      </Link>
    );
  }

  return (
    <div className="LabLayout__header__dropdown__item">{renderContent()}</div>
  );
};
