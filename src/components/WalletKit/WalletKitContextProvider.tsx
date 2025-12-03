"use client";

import { createContext, useEffect, useState } from "react";
import { useStore } from "@/store/useStore";

import { StellarWalletsKit } from "@creit-tech/stellar-wallets-kit/sdk";
import { defaultModules } from "@creit-tech/stellar-wallets-kit/modules/utils";
import { LedgerModule } from "@creit-tech/stellar-wallets-kit/modules/ledger";
import { HotWalletModule } from "@creit-tech/stellar-wallets-kit/modules/hotwallet";

import { getWalletKitNetwork } from "@/helpers/getWalletKitNetwork";
import { localStorageSavedTheme } from "@/helpers/localStorageSavedTheme";
import { localStorageSavedWallet } from "@/helpers/localStorageSavedWallet";
import { SavedWallet } from "@/types/types";

type WalletKitProps = {
  walletKit: typeof StellarWalletsKit;
  walletId?: string;
};

export const WalletKitContext = createContext<WalletKitProps>({
  walletKit: StellarWalletsKit,
});

export const WalletKitContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { network, theme, setTheme } = useStore();
  const [savedWallet, setSavedWallet] = useState<SavedWallet | null>(null);
  const [isClient, setIsClient] = useState(false);
  const networkType = getWalletKitNetwork(network.id);

  // Set isClient flag after mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const savedTheme = localStorageSavedTheme.get();

    if (savedTheme) {
      setTheme(savedTheme);
    }
    // Run only when component mounts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const savedWallet = localStorageSavedWallet.get();

    if (savedWallet && savedWallet.network.id === network.id) {
      setSavedWallet(savedWallet);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Initialize wallet kit when dependencies change
  useEffect(() => {
    // Only initialize on client side
    if (!isClient) {
      return;
    }

    const isDarkTheme = theme === "sds-theme-dark";

    const commonDarkTheme = {
      bgColor: "#161616",
      textColor: "#fcfcfc",
      solidTextColor: "#fcfcfc",
      dividerColor: "#fcfcfc",
    };

    const commonLightTheme = {
      bgColor: "#fcfcfc",
      textColor: "#161616",
      solidTextColor: "#161616",
      dividerColor: "#161616",
    };

    const modalDarkTheme = {
      ...commonDarkTheme,
      dividerColor: "#161616",
      headerButtonColor: "#161616",
      helpBgColor: "#161616",
      notAvailableTextColor: "#fcfcfc",
      notAvailableBgColor: "#161616",
      notAvailableBorderColor: "#fcfcfc",
    };

    const modalLightTheme = {
      ...commonLightTheme,
      dividerColor: "#fcfcfc",
      headerButtonColor: "#fcfcfc",
      helpBgColor: "#fcfcfc",
      notAvailableTextColor: "#161616",
      notAvailableBgColor: "#fcfcfc",
      notAvailableBorderColor: "#161616",
    };

    const TEST_MODULES = [...defaultModules(), new LedgerModule()];

    const PROD_MODULES = [...TEST_MODULES, new HotWalletModule()];

    StellarWalletsKit.init({
      network: networkType,
      selectedWalletId: savedWallet?.id || "",
      modules: network.id === "mainnet" ? PROD_MODULES : TEST_MODULES,
      ...(theme && {
        buttonTheme: isDarkTheme
          ? {
              ...commonDarkTheme,
              buttonPadding: "0.5rem 1.25rem",
              buttonBorderRadius: "0.5rem",
            }
          : {
              ...commonLightTheme,
              buttonPadding: "0.5rem 1.25rem",
              buttonBorderRadius: "0.5rem",
            },
        modalTheme: isDarkTheme ? modalDarkTheme : modalLightTheme,
      }),
    });
  }, [network.id, networkType, savedWallet?.id, theme]);

  return (
    <WalletKitContext.Provider
      value={{
        walletKit: StellarWalletsKit,
        walletId: savedWallet?.id,
      }}
    >
      {children}
    </WalletKitContext.Provider>
  );
};
