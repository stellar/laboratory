import {
  type AuthModalParams,
  type ISupportedWallet,
  StellarWalletsKit,
  type StellarWalletsKitInitParams,
} from "@creit.tech/stellar-wallets-kit";

export type StellarWalletsKitAdapter = Omit<
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

type StellarWalletsKitWithOriginalGetAddress = typeof StellarWalletsKit & {
  __stellarLabOriginalGetAddress?: typeof StellarWalletsKit.getAddress;
};

const USER_CLOSED_MODAL_MESSAGE = "The user closed the modal.";

const stellarWalletsKit =
  StellarWalletsKit as StellarWalletsKitWithOriginalGetAddress;
const originalGetAddress =
  stellarWalletsKit.__stellarLabOriginalGetAddress ??
  StellarWalletsKit.getAddress.bind(StellarWalletsKit);

stellarWalletsKit.__stellarLabOriginalGetAddress = originalGetAddress;

export const walletKit =
  StellarWalletsKit as unknown as StellarWalletsKitAdapter;

walletKit.openModal = async ({
  onWalletSelected,
  onClosed,
  ...params
} = {}) => {
  try {
    const addressResult = await StellarWalletsKit.authModal(params);

    if (onWalletSelected) {
      const selectedWalletId = StellarWalletsKit.selectedModule.productId;
      const selectedWallet =
        await StellarWalletsKit.refreshSupportedWallets().then((wallets) =>
          wallets.find((wallet) => wallet.id === selectedWalletId),
        );

      if (!selectedWallet) {
        throw new Error(
          `Selected wallet "${selectedWalletId}" is not supported.`,
        );
      }

      await onWalletSelected(selectedWallet);
    }

    return addressResult;
  } catch (error) {
    if (
      (error as { message?: string })?.message === USER_CLOSED_MODAL_MESSAGE
    ) {
      onClosed?.();
      return { address: "" };
    }

    throw error;
  }
};

walletKit.getAddress = async (params) => {
  if (params?.skipRequestAccess) {
    return StellarWalletsKit.fetchAddress();
  }

  return originalGetAddress().catch(() => StellarWalletsKit.fetchAddress());
};
