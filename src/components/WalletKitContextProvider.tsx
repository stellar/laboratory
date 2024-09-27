"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { throttle } from "lodash";
import { useStore } from "@/store/useStore";

import {
  StellarWalletsKit,
  WalletNetwork,
  allowAllModules,
  ISupportedWallet,
  FREIGHTER_ID,
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
    [],
  );

  return (
    <WalletKitContext.Provider value={{ walletKit: walletKitInstance }}>
      {children}
    </WalletKitContext.Provider>
  );
};
