"use client";

import { createContext, useEffect, useMemo } from "react";
import { useStore } from "@/store/useStore";

import {
  AlbedoModule,
  FreighterModule,
  HanaModule,
  LobstrModule,
  RabetModule,
  StellarWalletsKit,
  XBULL_ID,
  xBullModule,
} from "@creit.tech/stellar-wallets-kit";
import { LedgerModule } from "@creit.tech/stellar-wallets-kit/modules/ledger.module";

import { getWalletKitNetwork } from "@/helpers/getWalletKitNetwork";
import { localStorageSavedTheme } from "@/helpers/localStorageSavedTheme";
import { localStorageSavedWallet } from "@/helpers/localStorageSavedWallet";

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
  const networkType = getWalletKitNetwork(network.id);
  const savedWallet = localStorageSavedWallet.get();

  useEffect(() => {
    const savedTheme = localStorageSavedTheme.get();

    if (savedTheme) {
      setTheme(savedTheme);
    }
    // Run only when component mounts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const walletKitInstance = useMemo(() => {
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

    return new StellarWalletsKit({
      network: networkType,
      selectedWalletId: XBULL_ID,
      modules: [
        new AlbedoModule(),
        new xBullModule(),
        new FreighterModule(),
        new LobstrModule(),
        new RabetModule(),
        new HanaModule(),
        new LedgerModule(),
      ],
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
  }, [networkType, theme]);

  return (
    <WalletKitContext.Provider
      value={{
        walletKit: walletKitInstance,
        walletId: savedWallet,
      }}
    >
      {children}
    </WalletKitContext.Provider>
  );
};
