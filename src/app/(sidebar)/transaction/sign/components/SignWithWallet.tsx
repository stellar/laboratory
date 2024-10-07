"use client";

import React, { Dispatch, SetStateAction, useContext } from "react";
import { Button } from "@stellar/design-system";
import { ISupportedWallet } from "@creit.tech/stellar-wallets-kit";

import { shortenStellarAddress } from "@/helpers/shortenStellarAddress";
import { getWalletKitNetwork } from "@/helpers/getWalletKitNetwork";

import { useStore } from "@/store/useStore";

import { WalletKitContext } from "@/components/WalletKitContextProvider";

export const SignWithWallet = ({
  setSignError,
  setSignSuccess,
}: {
  setSignError: Dispatch<SetStateAction<string>>;
  setSignSuccess: Dispatch<SetStateAction<string>>;
}) => {
  const { account, network, transaction } = useStore();
  const { sign, updateSignedTx } = transaction;
  const { walletKitPubKey, updateWalletKitPubKey } = account;
  const networkPassphrase = getWalletKitNetwork(network.id);

  const walletKitInstance = useContext(WalletKitContext);

  const onSignWithWallet = async () => {
    // remove the previously signed tx from the display
    updateSignedTx("");
    setSignError("");
    setSignSuccess("");

    if (walletKitPubKey) {
      try {
        const { signedTxXdr } =
          await walletKitInstance.walletKit!.signTransaction(sign.importXdr, {
            address: walletKitPubKey,
            networkPassphrase,
          });
        updateSignedTx(signedTxXdr);
        setSignSuccess("1 signature(s) added");
      } catch (error: any) {
        if (error?.message) {
          setSignError(error?.message);
        }
      }
    } else {
      // if a user didn't log in via stellar wallet kit in the main nav
      // open a wallet kid modal to sign in
      await walletKitInstance.walletKit!.openModal({
        onWalletSelected: async (option: ISupportedWallet) => {
          try {
            walletKitInstance.walletKit?.setWallet(option.id);
            const addressResult =
              await walletKitInstance.walletKit?.getAddress();

            if (addressResult?.address) {
              updateWalletKitPubKey(addressResult.address);

              const result = await walletKitInstance.walletKit?.signTransaction(
                sign.importXdr,
                {
                  // You could send multiple public keys in case the wallet needs to handle multi signatures
                  address: addressResult.address,
                  networkPassphrase,
                },
              );

              if (result?.signedTxXdr) {
                updateSignedTx(result.signedTxXdr);
                setSignSuccess("1 signature(s) added");
              } else {
                throw { message: "couldn't sign with wallet. try again later" };
              }
            }
          } catch (error: any) {
            if (error?.message) {
              setSignError(error?.message);
            }
          }
        },
      });
    }
  };

  return walletKitPubKey ? (
    <Button size="md" variant="tertiary" onClick={onSignWithWallet}>
      {shortenStellarAddress(walletKitPubKey)}
    </Button>
  ) : null;
};
