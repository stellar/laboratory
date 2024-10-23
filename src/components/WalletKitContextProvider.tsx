"use client";

import { createContext, useEffect, useMemo } from "react";
import { useStore } from "@/store/useStore";

import {
  StellarWalletsKit,
  FreighterModule,
  xBullModule,
  AlbedoModule,
  XBULL_ID,
} from "@creit.tech/stellar-wallets-kit";

import { getWalletKitNetwork } from "@/helpers/getWalletKitNetwork";
import { localStorageSavedTheme } from "@/helpers/localStorageSavedTheme";

type WalletKitProps = {
  walletKit?: StellarWalletsKit;
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

  useEffect(() => {
    const savedTheme = localStorageSavedTheme.get();

    if (savedTheme) {
      setTheme(savedTheme);
    }
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
      modules: [new xBullModule(), new FreighterModule(), new AlbedoModule()],
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
    <WalletKitContext.Provider value={{ walletKit: walletKitInstance }}>
      {children}
    </WalletKitContext.Provider>
  );
};
