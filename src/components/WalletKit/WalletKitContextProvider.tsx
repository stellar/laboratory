"use client";

import { createContext, useEffect, useMemo, useRef, useState } from "react";
import { useStore } from "@/store/useStore";

import {
  StellarWalletsKit,
  SwkAppDarkTheme,
  SwkAppLightTheme,
} from "@creit.tech/stellar-wallets-kit";
import { AlbedoModule } from "@creit.tech/stellar-wallets-kit/modules/albedo";
import { CactusLinkModule } from "@creit.tech/stellar-wallets-kit/modules/cactuslink";
import { FreighterModule } from "@creit.tech/stellar-wallets-kit/modules/freighter";
import { FordefiModule } from "@creit.tech/stellar-wallets-kit/modules/fordefi";
import { HanaModule } from "@creit.tech/stellar-wallets-kit/modules/hana";
import { HotWalletModule } from "@creit.tech/stellar-wallets-kit/modules/hotwallet";
import { LedgerModule } from "@creit.tech/stellar-wallets-kit/modules/ledger";
import { LobstrModule } from "@creit.tech/stellar-wallets-kit/modules/lobstr";
import { RabetModule } from "@creit.tech/stellar-wallets-kit/modules/rabet";
import { xBullModule } from "@creit.tech/stellar-wallets-kit/modules/xbull";
import type { ModuleInterface } from "@creit.tech/stellar-wallets-kit/types";

import {
  loadWalletConnectModule,
  WALLET_CONNECT_ID,
} from "@/components/WalletKit/walletConnect";
import { getWalletKitNetwork } from "@/helpers/getWalletKitNetwork";
import { localStorageSavedTheme } from "@/helpers/localStorageSavedTheme";
import { localStorageSavedWallet } from "@/helpers/localStorageSavedWallet";

type WalletKitProps = {
  isInitialized: boolean;
  /**
   * Loads WalletConnect's chunk and registers it with the kit, resolving once
   * it's usable. Safe to call repeatedly — the module itself is created once.
   *
   * WalletConnect isn't registered at startup because it pulls in
   * `@reown/appkit` and the WalletConnect sign client, roughly 320 kB gzipped
   * that most sessions never need. Call this before anything that requires the
   * module — opening the wallet modal, or restoring a saved session — so it's
   * registered before the kit reads its module list.
   *
   * Resolves `false` when WalletConnect isn't available for the current network.
   */
  ensureWalletConnect: () => Promise<boolean>;
};

export const WalletKitContext = createContext<WalletKitProps>({
  isInitialized: false,
  ensureWalletConnect: () => Promise.resolve(false),
});

export const WalletKitContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { network, theme, setTheme } = useStore();
  const [isInitialized, setIsInitialized] = useState(false);
  const networkType = getWalletKitNetwork(network.id);

  // Set by the init effect below so `ensureWalletConnect` can re-initialize the
  // kit with the module list, network and theme that are currently in effect.
  const registerWalletConnect = useRef<(() => Promise<boolean>) | null>(null);

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
      savedWallet && savedWallet.network.id === network.id
        ? savedWallet.id
        : "";

    const isDarkTheme = theme === "sds-theme-dark";

    const TEST_MODULES = [
      new AlbedoModule(),
      new CactusLinkModule(),
      new xBullModule(),
      new FreighterModule(),
      new FordefiModule(),
      new LobstrModule(),
      new RabetModule(),
      new HanaModule(),
      new LedgerModule(),
    ];

    const PROD_MODULES = [...TEST_MODULES, new HotWalletModule()];

    // Build the list once so a later re-init reuses the same module instances
    // instead of swapping in fresh ones (which would, for example, drop the
    // transport a connected Ledger is holding onto).
    const modules = network.id === "mainnet" ? PROD_MODULES : TEST_MODULES;

    const initKit = (kitModules: ModuleInterface[], walletId: string) => {
      StellarWalletsKit.init({
        network: networkType,
        // `init` calls `setWallet`, which throws on an id that isn't in the
        // module list — and WalletConnect is registered lazily. Passing "" skips
        // that call, and the kit rehydrates `selectedModuleId` from localStorage
        // anyway, so the saved selection survives.
        selectedWalletId:
          kitModules.find((m) => m.productId === walletId)?.productId ?? "",
        modules: kitModules,
        theme: isDarkTheme ? SwkAppDarkTheme : SwkAppLightTheme,
      });
    };

    initKit(modules, walletIdForNetwork);
    setIsInitialized(true);

    let isStale = false;

    registerWalletConnect.current = async () => {
      try {
        const walletConnectModule = await loadWalletConnectModule({
          networkId: network.id,
          isDarkTheme,
        });

        // Either unsupported on this network, or the network/theme changed while
        // the chunk was loading and a newer effect run owns the kit now.
        if (!walletConnectModule || isStale) {
          return false;
        }

        initKit([...modules, walletConnectModule], walletIdForNetwork);

        return true;
      } catch {
        // Leave the kit initialized without WalletConnect
        return false;
      }
    };

    // A returning WalletConnect user needs the module either way, so start
    // loading it now instead of making the restore path wait for the chunk and
    // the sign client after its 750ms delay. Everyone else still never fetches
    // it. Deliberately not awaited: this only warms the cache that
    // `ensureWalletConnect` reads, and failures surface there instead.
    if (walletIdForNetwork === WALLET_CONNECT_ID) {
      registerWalletConnect.current().catch(() => undefined);
    }

    return () => {
      isStale = true;
    };
  }, [network.id, networkType, theme]);

  // Memoized because `useStore()` subscribes to the whole store, so this
  // provider re-renders on any store change anywhere in Lab. Consumers list the
  // context value in effect dependency arrays — `ConnectWallet`'s auto-connect
  // timer among them — so an unstable reference would restart those effects on
  // every unrelated keystroke.
  const contextValue = useMemo(
    () => ({
      isInitialized,
      ensureWalletConnect: () =>
        registerWalletConnect.current?.() ?? Promise.resolve(false),
    }),
    [isInitialized],
  );

  return (
    <WalletKitContext.Provider value={contextValue}>
      {children}
    </WalletKitContext.Provider>
  );
};
