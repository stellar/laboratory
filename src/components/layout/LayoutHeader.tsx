import { useContext } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Icon,
  IconButton,
  ProjectLogo,
  Select,
  ThemeSwitch,
} from "@stellar/design-system";

import { MainNav } from "@/components/MainNav";
import { WindowContext } from "@/components/layout/LayoutContextProvider";
import { NetworkSelector } from "@/components/NetworkSelector";
import { Hydration } from "@/components/Hydration";
import { Box } from "@/components/layout/Box";
import { FloaterDropdown } from "@/components/FloaterDropdown";

import { isExternalLink } from "@/helpers/isExternalLink";
import { Routes } from "@/constants/routes";
import {
  ACCOUNT_NAV_ITEMS,
  ENDPOINTS_NAV_ITEMS,
  TRANSACTION_NAV_ITEMS,
  XDR_NAV_ITEMS,
} from "@/constants/navItems";

const NAV = [
  {
    label: "View XDR",
    subNav: XDR_NAV_ITEMS,
  },
  {
    label: "Account",
    subNav: ACCOUNT_NAV_ITEMS,
  },
  {
    label: "Endpoints",
    subNav: ENDPOINTS_NAV_ITEMS,
  },
  {
    label: "Transactions",
    subNav: TRANSACTION_NAV_ITEMS,
  },
];

export const LayoutHeader = () => {
  const { layoutMode } = useContext(WindowContext);
  const route = useRouter();
  const pathname = usePathname();

  const handleNavChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    route.push(event.target.value);
  };

  const renderNav = () => {
    return (
      <>
        <option value={Routes.ROOT}>Introduction</option>
        {NAV.map((mainNav) => {
          return (
            <optgroup key={mainNav.label} label={mainNav.label}>
              <>
                {mainNav.subNav.map((subItem) => {
                  const subSection = (subItem as any)?.instruction;

                  return (
                    <>
                      {subSection ? (
                        <option key={subSection} disabled>
                          {subSection}
                        </option>
                      ) : null}
                      {subItem.navItems.map((item: any) => (
                        <option key={item.route} value={item.route}>
                          {item.label}
                        </option>
                      ))}
                    </>
                  );
                })}
              </>
            </optgroup>
          );
        })}
      </>
    );
  };

  if (layoutMode === "desktop") {
    return (
      <div className="LabLayout__header">
        <header className="LabLayout__header__main">
          <ProjectLogo
            title="Lab"
            link="/"
            customAnchor={<Link href="/" prefetch={true} />}
          />

          <MainNav />

          <div className="LabLayout__header__settings">
            <Hydration>
              <ThemeSwitch storageKeyId="stellarTheme:Laboratory" />
            </Hydration>
            <NetworkSelector />
          </div>
        </header>
      </div>
    );
  }

  if (layoutMode === "mobile") {
    return (
      <div className="LabLayout__header">
        <header className="LabLayout__header__main">
          <Select
            id="mobile-nav"
            fieldSize="md"
            onChange={handleNavChange}
            value={pathname}
          >
            {renderNav()}
          </Select>

          <Box gap="md" direction="row" align="center">
            <NetworkSelector />

            <FloaterDropdown
              triggerEl={<IconButton icon={<Icon.Menu01 />} altText="Menu" />}
              offset={14}
            >
              <>
                <DropdownItem label="Theme">
                  <Hydration>
                    <ThemeSwitch storageKeyId="stellarTheme:Laboratory" />
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
          </Box>
        </header>
      </div>
    );
  }

  return null;
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