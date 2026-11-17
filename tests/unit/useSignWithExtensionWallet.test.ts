import { useContext, useLayoutEffect, useState } from "react";
import { StellarWalletsKit } from "@creit.tech/stellar-wallets-kit";
import { useStore } from "../../src/store/useStore";
import { useSignWithExtensionWallet } from "../../src/hooks/useSignWithExtensionWallet";

jest.mock("react", () => ({
  useContext: jest.fn(),
  useRef: (initial: unknown) => ({ current: initial }),
  useLayoutEffect: jest.fn(),
  useState: jest.fn(),
}));
jest.mock("@creit.tech/stellar-wallets-kit", () => ({
  Networks: { TESTNET: "Test SDF Network ; September 2015" },
  StellarWalletsKit: { authModal: jest.fn(), signTransaction: jest.fn() },
}));
jest.mock("../../src/components/WalletKit/WalletKitContextProvider", () => ({
  WalletKitContext: {},
}));
jest.mock("../../src/store/useStore", () => ({ useStore: jest.fn() }));

const sign = StellarWalletsKit.signTransaction as jest.Mock;
const choose = StellarWalletsKit.authModal as jest.Mock;
const setLoading = jest.fn();
const updateWalletKit = jest.fn();
const ensureWalletConnect = jest.fn().mockResolvedValue(true);

beforeEach(() => {
  jest.clearAllMocks();
  (useState as jest.Mock).mockReturnValue([false, setLoading]);
  (useContext as jest.Mock).mockReturnValue({
    isInitialized: true,
    ensureWalletConnect,
  });
  (useStore as unknown as jest.Mock).mockReturnValue({
    network: { id: "testnet" },
    walletKit: { publicKey: "first-account" },
    updateWalletKit,
  });
  sign.mockResolvedValue({ signedTxXdr: "signed-envelope" });
  choose.mockResolvedValue({ address: "second-account" });
});

it("only signs on demand and opens the chooser for additional signers", async () => {
  const hook = useSignWithExtensionWallet();
  expect(sign).not.toHaveBeenCalled();
  await expect(hook.signTx("envelope")).resolves.toBe("signed-envelope");
  expect(choose).not.toHaveBeenCalled();
  await hook.signTx("envelope", true);
  expect(ensureWalletConnect).toHaveBeenCalledTimes(1);
  expect(choose).toHaveBeenCalledTimes(1);
  expect(updateWalletKit).toHaveBeenCalledWith({ publicKey: "second-account" });
  expect(sign.mock.calls.map(([, options]) => options.address)).toEqual([
    "first-account",
    "second-account",
  ]);
  expect(setLoading.mock.calls.map(([loading]) => loading)).toEqual([
    true,
    false,
    true,
    false,
  ]);
});

it("allows retry after cancelling the additional signer chooser", async () => {
  choose.mockRejectedValueOnce({ code: -1 });
  const hook = useSignWithExtensionWallet();
  await expect(hook.signTx("envelope", true)).resolves.toBeNull();
  expect(sign).not.toHaveBeenCalled();
  await expect(hook.signTx("envelope", true)).resolves.toBe("signed-envelope");
});

it("releases the signing lock after a wallet error", async () => {
  sign.mockRejectedValueOnce(new Error("Rejected by wallet"));
  const hook = useSignWithExtensionWallet();
  await expect(hook.signTx("envelope")).rejects.toThrow("Rejected by wallet");
  await expect(hook.signTx("envelope")).resolves.toBe("signed-envelope");
});

it("does not open a second prompt while a request is pending", async () => {
  let finish!: (value: { signedTxXdr: string }) => void;
  sign.mockReturnValueOnce(
    new Promise((resolve) => {
      finish = resolve;
    }),
  );
  const hook = useSignWithExtensionWallet();
  const pending = hook.signTx("envelope");
  await expect(hook.signTx("envelope", true)).resolves.toBeNull();
  expect(choose).not.toHaveBeenCalled();
  expect(sign).toHaveBeenCalledTimes(1);
  finish({ signedTxXdr: "signed-envelope" });
  await pending;
});

it("ignores a wallet result after its transaction signing session unmounts", async () => {
  let finish!: (value: { signedTxXdr: string }) => void;
  sign.mockReturnValueOnce(
    new Promise((resolve) => {
      finish = resolve;
    }),
  );
  const hook = useSignWithExtensionWallet();
  const cleanup = (useLayoutEffect as jest.Mock).mock.calls[0][0]();
  const pending = hook.signTx("transaction-A");
  cleanup();
  finish({ signedTxXdr: "signed-A" });
  await expect(pending).resolves.toBeNull();
  await expect(hook.signTx("transaction-A")).resolves.toBeNull();
  expect(sign).toHaveBeenCalledTimes(1);
});

it("does not update the connected account or sign after a stale chooser completes", async () => {
  let finish!: (value: { address: string }) => void;
  choose.mockReturnValueOnce(
    new Promise((resolve) => {
      finish = resolve;
    }),
  );
  const hook = useSignWithExtensionWallet();
  const cleanup = (useLayoutEffect as jest.Mock).mock.calls[0][0]();
  const pending = hook.signTx("transaction-A", true);
  await Promise.resolve();
  cleanup();
  finish({ address: "stale-account" });
  await expect(pending).resolves.toBeNull();
  expect(updateWalletKit).not.toHaveBeenCalled();
  expect(sign).not.toHaveBeenCalled();
});
