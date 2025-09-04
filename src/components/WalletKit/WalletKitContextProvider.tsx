"use client";

import { createContext, useEffect, useMemo, useState } from "react";
import { useStore } from "@/store/useStore";

import {
  AlbedoModule,
  FreighterModule,
  HanaModule,
  LobstrModule,
  RabetModule,
  StellarWalletsKit,
  HotWalletModule,
  xBullModule,
} from "@creit.tech/stellar-wallets-kit";
import { LedgerModule } from "@creit.tech/stellar-wallets-kit/modules/ledger.module";

import { getWalletKitNetwork } from "@/helpers/getWalletKitNetwork";
import { localStorageSavedTheme } from "@/helpers/localStorageSavedTheme";
import { localStorageSavedWallet } from "@/helpers/localStorageSavedWallet";
import { SavedWallet } from "@/types/types";

type WalletKitProps = {
  walletKit?: StellarWalletsKit;
  walletId?: string;
};

export const WalletKitContext = createContext<WalletKitProps>({
  walletKit: undefined,
});

export const WalletKitContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { network, theme, setTheme } = useStore();
  const [savedWallet, setSavedWallet] = useState<SavedWallet | null>(null);
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
    const savedWallet = localStorageSavedWallet.get();

    if (savedWallet && savedWallet.network.id === network.id) {
      setSavedWallet(savedWallet);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const walletKitInstance = useMemo(() => {
    // Only initialize on client side to avoid "window is not defined" errors in terminal
    if (typeof window === "undefined") {
      return undefined;
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

    return new StellarWalletsKit({
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
  }, [network.id, networkType, theme]);

  return (
    <WalletKitContext.Provider
      value={{
        walletKit: walletKitInstance,
        walletId: savedWallet?.id,
      }}
    >
      {children}
    </WalletKitContext.Provider>
  );
};
