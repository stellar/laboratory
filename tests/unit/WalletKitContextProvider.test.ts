const mockOriginalGetAddress = jest.fn();
const mockAuthModal = jest.fn();
const mockRefreshSupportedWallets = jest.fn();
const mockFetchAddress = jest.fn();
const mockStellarWalletsKit = {
  authModal: mockAuthModal,
  fetchAddress: mockFetchAddress,
  getAddress: mockOriginalGetAddress,
  refreshSupportedWallets: mockRefreshSupportedWallets,
  selectedModule: {
    productId: "freighter",
  },
};

jest.mock("@creit.tech/stellar-wallets-kit", () => ({
  StellarWalletsKit: mockStellarWalletsKit,
}));

import { StellarWalletsKit } from "@creit.tech/stellar-wallets-kit";
import "@/components/WalletKit/walletKitAdapter";

type WalletKitAdapter = typeof StellarWalletsKit & {
  openModal: (params?: {
    onWalletSelected?: (option: { id: string }) => Promise<void>;
    onClosed?: () => void;
  }) => Promise<{ address: string }>;
  getAddress: (params?: { skipRequestAccess?: boolean }) => Promise<{
    address: string;
  }>;
};

const walletKit = StellarWalletsKit as WalletKitAdapter;

describe("walletKitAdapter", () => {
  beforeEach(() => {
    mockAuthModal.mockReset();
    mockFetchAddress.mockReset();
    mockOriginalGetAddress.mockReset();
    mockRefreshSupportedWallets.mockReset();
    mockStellarWalletsKit.selectedModule = {
      productId: "freighter",
    };
  });

  it("does not reject when the user closes the wallet modal", async () => {
    const onClosed = jest.fn();

    mockAuthModal.mockRejectedValue({
      message: "The user closed the modal.",
    });

    await expect(walletKit.openModal({ onClosed })).resolves.toEqual({
      address: "",
    });
    expect(onClosed).toHaveBeenCalledTimes(1);
    expect(mockRefreshSupportedWallets).not.toHaveBeenCalled();
  });

  it("rejects when the selected wallet is missing after successful auth", async () => {
    const onWalletSelected = jest.fn();

    mockAuthModal.mockResolvedValue({ address: "GABC" });
    mockRefreshSupportedWallets.mockResolvedValue([{ id: "lobstr" }]);

    await expect(walletKit.openModal({ onWalletSelected })).rejects.toThrow(
      'Selected wallet "freighter" is not supported.',
    );
    expect(onWalletSelected).not.toHaveBeenCalled();
  });

  it("uses the original getAddress method before falling back to fetchAddress", async () => {
    mockOriginalGetAddress.mockResolvedValue({ address: "GCACHED" });

    await expect(walletKit.getAddress()).resolves.toEqual({
      address: "GCACHED",
    });
    expect(mockFetchAddress).not.toHaveBeenCalled();

    mockOriginalGetAddress.mockRejectedValue(new Error("No cached address"));
    mockFetchAddress.mockResolvedValue({ address: "GFRESH" });

    await expect(walletKit.getAddress()).resolves.toEqual({
      address: "GFRESH",
    });
    expect(mockFetchAddress).toHaveBeenCalledTimes(1);
  });
});
