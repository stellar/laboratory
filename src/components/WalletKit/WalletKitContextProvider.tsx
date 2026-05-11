"use client";

import { createContext, useEffect, useState } from "react";
import { useStore } from "@/store/useStore";

import type { ModuleInterface } from "@creit.tech/stellar-wallets-kit";

import { getWalletKitNetwork } from "@/helpers/getWalletKitNetwork";
import { localStorageSavedTheme } from "@/helpers/localStorageSavedTheme";
import { localStorageSavedWallet } from "@/helpers/localStorageSavedWallet";
import { SavedWallet } from "@/types/types";
import type { StellarWalletsKitAdapter } from "@/components/WalletKit/walletKitAdapter";

type WalletKitProps = {
  walletKit?: StellarWalletsKitAdapter;
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
  const [walletKitInstance, setWalletKitInstance] =
    useState<StellarWalletsKitAdapter>();
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
    let isMounted = true;

    const initWalletKit = async () => {
      // Only initialize on client side to avoid "window is not defined" errors in terminal
      if (typeof window === "undefined") {
        return;
      }

      const [
        { SwkAppDarkTheme, SwkAppLightTheme },
        { AlbedoModule },
        { CactusLinkModule },
        { FreighterModule },
        { HanaModule },
        { LobstrModule },
        { RabetModule },
        { HotWalletModule },
        { xBullModule },
        { LedgerModule },
        { walletKit },
      ] = await Promise.all([
        import("@creit.tech/stellar-wallets-kit"),
        import("@creit.tech/stellar-wallets-kit/modules/albedo"),
        import("@creit.tech/stellar-wallets-kit/modules/cactuslink"),
        import("@creit.tech/stellar-wallets-kit/modules/freighter"),
        import("@creit.tech/stellar-wallets-kit/modules/hana"),
        import("@creit.tech/stellar-wallets-kit/modules/lobstr"),
        import("@creit.tech/stellar-wallets-kit/modules/rabet"),
        import("@creit.tech/stellar-wallets-kit/modules/hotwallet"),
        import("@creit.tech/stellar-wallets-kit/modules/xbull"),
        import("@creit.tech/stellar-wallets-kit/modules/ledger"),
        import("@/components/WalletKit/walletKitAdapter"),
      ]);

      if (!isMounted) {
        return;
      }

      const TEST_MODULES: ModuleInterface[] = [
        new AlbedoModule(),
        new xBullModule(),
        new FreighterModule(),
        new LobstrModule(),
        new RabetModule(),
        new HanaModule(),
        new CactusLinkModule(),
        new LedgerModule(),
      ];

      const PROD_MODULES = [...TEST_MODULES, new HotWalletModule()];

      walletKit.init({
        network: networkType,
        selectedWalletId: savedWallet?.id || "",
        modules: network.id === "mainnet" ? PROD_MODULES : TEST_MODULES,
        ...(theme && {
          theme:
            theme === "sds-theme-dark" ? SwkAppDarkTheme : SwkAppLightTheme,
        }),
      });

      setWalletKitInstance(() => walletKit);
    };

    void initWalletKit();

    return () => {
      isMounted = false;
    };
  }, [network.id, networkType, savedWallet?.id, theme]);

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
