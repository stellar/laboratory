"use client";

import { createContext, useEffect, useMemo } from "react";
import { useStore } from "@/store/useStore";

import {
  StellarWalletsKit,
  allowAllModules,
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

    setTheme(savedTheme);
  }, []);

  const walletKitInstance = useMemo(() => {
    const isDarkTheme = theme === "sds-theme-dark";

    return new StellarWalletsKit({
      network: networkType,
      selectedWalletId: XBULL_ID,
      modules: allowAllModules(),
      buttonTheme: {
        bgColor: isDarkTheme ? "#161616" : "#fcfcfc",
        textColor: isDarkTheme ? "#fcfcfc" : "#161616",
        solidTextColor: isDarkTheme ? "#fcfcfc" : "#161616",
        dividerColor: isDarkTheme ? "#fcfcfc" : "#161616",
        buttonPadding: "0.5rem 1.25rem",
        buttonBorderRadius: "0.5rem",
      },
      modalTheme: {
        bgColor: isDarkTheme ? "#161616" : "#fcfcfc",
        textColor: isDarkTheme ? "#fcfcfc" : "#161616",
        solidTextColor: isDarkTheme ? "#fcfcfc" : "#161616",
        dividerColor: isDarkTheme ? "#161616" : "#fcfcfc",
        headerButtonColor: isDarkTheme ? "#161616" : "#fcfcfc",
        helpBgColor: isDarkTheme ? "#161616" : "#fcfcfc",
        notAvailableTextColor: isDarkTheme ? "#fcfcfc" : "#161616",
        notAvailableBgColor: isDarkTheme ? "#161616" : "#fcfcfc",
        notAvailableBorderColor: isDarkTheme ? "#fcfcfc" : "#161616",
      },
    });
  }, [networkType, theme]);

  return (
    <WalletKitContext.Provider value={{ walletKit: walletKitInstance }}>
      {children}
    </WalletKitContext.Provider>
  );
};
