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
  setSignSuccess,
}: {
  setSignError: Dispatch<SetStateAction<string>>;
  setSignSuccess: Dispatch<SetStateAction<string>>;
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
    setSignError("");
    setSignSuccess("");

    await kit.openModal({
      onWalletSelected: async (option: ISupportedWallet) => {
        try {
          kit.setWallet(option.id);
          const { address } = await kit.getAddress();
          const networkType = getWalletNetwork(network.id);

          const { signedTxXdr } = await kit.signTransaction(sign.importXdr, {
            // You could send multiple public keys in case the wallet needs to handle multi signatures
            address,
            networkPassphrase: networkType,
          });

          updateSignedTx(signedTxXdr);
          setSignSuccess("1 signature(s) added");
        } catch (error: any) {
          // the error for the following wallets:
          // xbull
          // albedo
          // freighter
          if (error?.message) {
            setSignError(error?.message);
          }
        }
      },
    });
  };

  return (
    <Button size="md" variant="tertiary" onClick={onSignWithWallet}>
      Sign with wallet
    </Button>
  );
};
