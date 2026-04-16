"use client";

import { createContext, useEffect, useState } from "react";
import { useStore } from "@/store/useStore";

import {
  StellarWalletsKit,
  SwkAppDarkTheme,
  SwkAppLightTheme,
} from "@creit.tech/stellar-wallets-kit";
import { AlbedoModule } from "@creit.tech/stellar-wallets-kit/modules/albedo";
import { FreighterModule } from "@creit.tech/stellar-wallets-kit/modules/freighter";
import { HanaModule } from "@creit.tech/stellar-wallets-kit/modules/hana";
import { HotWalletModule } from "@creit.tech/stellar-wallets-kit/modules/hotwallet";
import { LedgerModule } from "@creit.tech/stellar-wallets-kit/modules/ledger";
import { LobstrModule } from "@creit.tech/stellar-wallets-kit/modules/lobstr";
import { RabetModule } from "@creit.tech/stellar-wallets-kit/modules/rabet";
import { xBullModule } from "@creit.tech/stellar-wallets-kit/modules/xbull";

import { getWalletKitNetwork } from "@/helpers/getWalletKitNetwork";
import { localStorageSavedTheme } from "@/helpers/localStorageSavedTheme";
import { localStorageSavedWallet } from "@/helpers/localStorageSavedWallet";

type WalletKitProps = {
  isInitialized: boolean;
};

export const WalletKitContext = createContext<WalletKitProps>({
  isInitialized: false,
});

export const WalletKitContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { network, theme, setTheme } = useStore();
  const [isInitialized, setIsInitialized] = useState(false);
  const networkType = getWalletKitNetwork(network.id);

  useEffect(() => {
    const savedTheme = localStorageSavedTheme.get();

    if (savedTheme) {
      setTheme(savedTheme);
    }
    // Run only when component mounts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Only initialize on client side to avoid "window is not defined" errors in terminal
    if (typeof window === "undefined") {
      return;
    }

    // Re-read the saved wallet whenever the network changes so we don't pass
    // a wallet id that was persisted for a different network.
    const savedWallet = localStorageSavedWallet.get();
    const walletIdForNetwork =
      savedWallet && savedWallet.network.id === network.id ? savedWallet.id : "";

    const isDarkTheme = theme === "sds-theme-dark";

    const TEST_MODULES = [
      new AlbedoModule(),
      new xBullModule(),
      new FreighterModule(),
      new LobstrModule(),
      new RabetModule(),
      new HanaModule(),
      new LedgerModule(),
    ];

    const PROD_MODULES = [...TEST_MODULES, new HotWalletModule()];

    StellarWalletsKit.init({
      network: networkType,
      selectedWalletId: walletIdForNetwork,
      modules: network.id === "mainnet" ? PROD_MODULES : TEST_MODULES,
      theme: isDarkTheme ? SwkAppDarkTheme : SwkAppLightTheme,
    });

    setIsInitialized(true);
  }, [network.id, networkType, theme]);

  return (
    <WalletKitContext.Provider
      value={{
        isInitialized,
      }}
    >
      {children}
    </WalletKitContext.Provider>
  );
};
