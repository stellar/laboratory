"use client";

import React, { Dispatch, SetStateAction } from "react";
import { Button } from "@stellar/design-system";
import {
  StellarWalletsKit,
  WalletNetwork,
  allowAllModules,
  ISupportedWallet,
  FREIGHTER_ID,
} from "@creit.tech/stellar-wallets-kit";

import { useStore } from "@/store/useStore";

import { NetworkType } from "@/types/types";

const getWalletNetwork = (network: NetworkType) => {
  switch (network) {
    case "testnet":
      return WalletNetwork.TESTNET;
    case "mainnet":
      return WalletNetwork.PUBLIC;
    case "futurenet":
      return WalletNetwork.FUTURENET;
    // @TODO: stellar wallets kit doesn't support CUSTOM
    //   case "custom":
    default:
      return WalletNetwork.TESTNET;
  }
};

export const SignWithWallet = ({
  setSignError,
}: {
  setSignError: Dispatch<SetStateAction<string>>;
}) => {
  const { network, transaction } = useStore();
  const { sign, updateSignedTx } = transaction;

  const kit: StellarWalletsKit = new StellarWalletsKit({
    network: getWalletNetwork(network.id),
    selectedWalletId: FREIGHTER_ID,
    modules: allowAllModules(),
  });

  const onSignWithWallet = async () => {
    // remove the previously signed tx from the display
    updateSignedTx("");

    await kit.openModal({
      onWalletSelected: async (option: ISupportedWallet) => {
        try {
          kit.setWallet(option.id);
          const publicKey = await kit.getPublicKey();
          const networkType = getWalletNetwork(network.id);

          const { result } = await kit.signTx({
            xdr: sign.importXdr,
            // You could send multiple public keys in case the wallet needs to handle multi signatures
            publicKeys: [publicKey],
            network: networkType,
          });

          updateSignedTx(result);
        } catch (error: any) {
          // the error for the following wallets:
          // xbull
          // albedo
          // freighter
          if (
            error?.message?.includes("denied") ||
            error?.error?.code === -4 ||
            error?.includes("User declined access")
          ) {
            setSignError(`User declined access to ${option.id}`);
          }
        }
      },
    });
  };

  return (
    <Button size="md" variant="secondary" onClick={onSignWithWallet}>
      Sign with wallet
    </Button>
  );
};
