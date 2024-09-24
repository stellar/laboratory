import { ReactNode, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Icon } from "@stellar/design-system";

import { Routes } from "@/constants/routes";
import { NextLink } from "@/components/NextLink";

import {
  StellarWalletsKit,
  WalletNetwork,
  allowAllModules,
  ISupportedWallet,
  FREIGHTER_ID,
} from "@creit.tech/stellar-wallets-kit";

type NavLink = {
  href: Routes | string;
  label: string;
  icon?: ReactNode;
};

export const ConnectWallet = () => {
  const responseSuccessEl = useRef<HTMLElement | null>(null);

  const kit: StellarWalletsKit = new StellarWalletsKit({
    network: WalletNetwork.TESTNET,
    selectedWalletId: "",
    modules: allowAllModules(),
  });

  kit;

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

      {link.icon ? <span className="NavLink__icon">{link.icon}</span> : null}
    </NextLink>
  );

  const walletKitButton = await kit.createButton({
    container: responseSuccessEl.current,
    onConnect: ({ address }) => {
      // Do something when the user "connects" the wallet, like fetching the account data
    },
    onDisconnect: () => {
      // Do something when the user "disconnects" the wallet, like clearing all site data and reload
    },
  });

  return (
    <div className="ConnectWallet" ref={responseSuccessEl}>
      <div className="ConnectWallet--primary">
        {primaryNavLinks.map((l) => (
          <NavItem key={l.href} link={l} />
        ))}
      </div>
    </div>
  );
};
