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

import { getWalletKitNetwork } from "@/helpers/getWalletKitNetwork";

import { useStore } from "@/store/useStore";

export const SignWithWallet = ({
  setSignError,
  setSignSuccess,
}: {
  setSignError: Dispatch<SetStateAction<string>>;
  setSignSuccess: Dispatch<SetStateAction<string>>;
}) => {
  const { network, transaction, walletKit, walletKitAddress } = useStore();
  const { sign, updateSignedTx } = transaction;

  console.log("walletKit: ", walletKit);

  const onSignWithWallet = async () => {
    const networkPassphrase = getWalletKitNetwork(network.id);

    // remove the previously signed tx from the display
    updateSignedTx("");
    setSignError("");
    setSignSuccess("");

    if (walletKit && walletKitAddress) {
      try {
        const { signedTxXdr } = await walletKit.signTransaction(
          sign.importXdr,
          {
            address: walletKitAddress,
            networkPassphrase,
          },
        );

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
    } else {
      // if there is no connected wallet kit in store
      // create one just for signing
      const kit: StellarWalletsKit = new StellarWalletsKit({
        network: networkPassphrase,
        selectedWalletId: FREIGHTER_ID,
        modules: allowAllModules(),
      });

      await kit.openModal({
        onWalletSelected: async (option: ISupportedWallet) => {
          try {
            kit.setWallet(option.id);
            const { address } = await kit.getAddress();
            const { signedTxXdr } = await kit.signTransaction(sign.importXdr, {
              // You could send multiple public keys in case the wallet needs to handle multi signatures
              address,
              networkPassphrase,
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
    }
  };

  return (
    <Button size="md" variant="tertiary" onClick={onSignWithWallet}>
      Sign with wallet
    </Button>
  );
};
