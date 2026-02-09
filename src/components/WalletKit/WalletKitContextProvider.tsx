"use client";

import { createContext, useEffect, useState } from "react";
import { useStore } from "@/store/useStore";

import { StellarWalletsKit } from "@creit-tech/stellar-wallets-kit/sdk";
import { AlbedoModule } from "@creit-tech/stellar-wallets-kit/modules/albedo";
import { FreighterModule } from "@creit-tech/stellar-wallets-kit/modules/freighter";
import { HanaModule } from "@creit-tech/stellar-wallets-kit/modules/hana";
import { LobstrModule } from "@creit-tech/stellar-wallets-kit/modules/lobstr";
import { RabetModule } from "@creit-tech/stellar-wallets-kit/modules/rabet";
import { HotWalletModule } from "@creit-tech/stellar-wallets-kit/modules/hotwallet";
import { xBullModule } from "@creit-tech/stellar-wallets-kit/modules/xbull";
import { LedgerModule } from "@creit-tech/stellar-wallets-kit/modules/ledger";

import { getWalletKitNetwork } from "@/helpers/getWalletKitNetwork";
import { localStorageSavedTheme } from "@/helpers/localStorageSavedTheme";
import { localStorageSavedWallet } from "@/helpers/localStorageSavedWallet";
import { SavedWallet } from "@/types/types";

type WalletKitProps = {
  isInitialized: boolean;
  walletId?: string;
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
  const [savedWallet, setSavedWallet] = useState<SavedWallet | null>(null);
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
    const savedWallet = localStorageSavedWallet.get();

    if (savedWallet && savedWallet.network.id === network.id) {
      setSavedWallet(savedWallet);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Only initialize on client side to avoid "window is not defined" errors in terminal
    if (typeof window === "undefined") {
      return;
    }

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
      modules: network.id === "mainnet" ? PROD_MODULES : TEST_MODULES,
      network: networkType,
      selectedWalletId: savedWallet?.id,
    });

    setIsInitialized(true);
  }, [network.id, networkType, savedWallet?.id, theme]);

  return (
    <WalletKitContext.Provider
      value={{
        isInitialized,
        walletId: savedWallet?.id,
      }}
    >
      {children}
    </WalletKitContext.Provider>
  );
};
