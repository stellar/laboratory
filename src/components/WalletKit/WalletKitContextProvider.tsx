"use client";

import { createContext, useEffect, useMemo, useState } from "react";
import { useStore } from "@/store/useStore";

import {
  type AuthModalParams,
  type ISupportedWallet,
  type ModuleInterface,
  StellarWalletsKit,
  type StellarWalletsKitInitParams,
  SwkAppDarkTheme,
  SwkAppLightTheme,
} from "@creit.tech/stellar-wallets-kit";
import { AlbedoModule } from "@creit.tech/stellar-wallets-kit/modules/albedo";
import { CactusLinkModule } from "@creit.tech/stellar-wallets-kit/modules/cactuslink";
import { FreighterModule } from "@creit.tech/stellar-wallets-kit/modules/freighter";
import { HanaModule } from "@creit.tech/stellar-wallets-kit/modules/hana";
import { LobstrModule } from "@creit.tech/stellar-wallets-kit/modules/lobstr";
import { RabetModule } from "@creit.tech/stellar-wallets-kit/modules/rabet";
import { HotWalletModule } from "@creit.tech/stellar-wallets-kit/modules/hotwallet";
import { xBullModule } from "@creit.tech/stellar-wallets-kit/modules/xbull";
import { LedgerModule } from "@creit.tech/stellar-wallets-kit/modules/ledger";

import { getWalletKitNetwork } from "@/helpers/getWalletKitNetwork";
import { localStorageSavedTheme } from "@/helpers/localStorageSavedTheme";
import { localStorageSavedWallet } from "@/helpers/localStorageSavedWallet";
import { SavedWallet } from "@/types/types";

type StellarWalletsKitAdapter = Omit<
  typeof StellarWalletsKit,
  "getAddress" | "init"
> & {
  init: (params: StellarWalletsKitInitParams) => typeof StellarWalletsKit;
  getAddress: (params?: { skipRequestAccess?: boolean }) => Promise<{
    address: string;
  }>;
  openModal: (
    params?: AuthModalParams & {
      onWalletSelected?: (option: ISupportedWallet) => Promise<void>;
      onClosed?: () => void;
    },
  ) => Promise<{ address: string }>;
};

type WalletKitProps = {
  walletKit?: StellarWalletsKitAdapter;
  walletId?: string;
};

const walletKit = StellarWalletsKit as unknown as StellarWalletsKitAdapter;

walletKit.openModal = async ({ onWalletSelected, onClosed, ...params } = {}) => {
  try {
    const addressResult = await StellarWalletsKit.authModal(params);
    const selectedWallet = await StellarWalletsKit.refreshSupportedWallets().then(
      (wallets) =>
        wallets.find(
          (wallet) => wallet.id === StellarWalletsKit.selectedModule.productId,
        ),
    );

    if (selectedWallet) {
      await onWalletSelected?.(selectedWallet);
    }

    return addressResult;
  } catch (error) {
    if ((error as { message?: string })?.message === "The user closed the modal.") {
      onClosed?.();
    }

    throw error;
  }
};

walletKit.getAddress = async (params) => {
  if (params?.skipRequestAccess) {
    return StellarWalletsKit.fetchAddress();
  }

  return StellarWalletsKit.getAddress().catch(() =>
    StellarWalletsKit.fetchAddress(),
  );
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

    return walletKit;
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
