"use client";

import { createContext, useMemo } from "react";
import { useStore } from "@/store/useStore";

import {
  StellarWalletsKit,
  allowAllModules,
  XBULL_ID,
} from "@creit.tech/stellar-wallets-kit";

import { getWalletKitNetwork } from "@/helpers/getWalletKitNetwork";

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
  const { network } = useStore();
  const networkType = getWalletKitNetwork(network.id);

  const walletKitInstance = useMemo(
    () =>
      new StellarWalletsKit({
        network: networkType,
        selectedWalletId: XBULL_ID,
        modules: allowAllModules(),
      }),
    [networkType],
  );

  return (
    <WalletKitContext.Provider value={{ walletKit: walletKitInstance }}>
      {children}
    </WalletKitContext.Provider>
  );
};
