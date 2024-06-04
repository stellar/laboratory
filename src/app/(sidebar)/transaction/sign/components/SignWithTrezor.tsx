"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import { Button } from "@stellar/design-system";
import {
  StellarWalletsKit,
  WalletNetwork,
  allowAllModules,
  ISupportedWallet,
  FREIGHTER_ID,
} from "@creit.tech/stellar-wallets-kit";

import { useStore } from "@/store/useStore";

import { NetworkType, TrezorResponse } from "@/types/types";

import TrezorConnect, { StellarSignedTx } from "@trezor/connect-web";
import transformTransaction from "@trezor/connect-plugin-stellar";

import {
  Keypair,
  StrKey,
  Transaction,
  TransactionBuilder,
  xdr,
} from "@stellar/stellar-sdk";

export const SignWithTrezor = ({
  bipPathErrorMsg,
  setSignError,
}: {
  bipPathErrorMsg: string;
  setSignError: Dispatch<SetStateAction<string>>;
}) => {
  const { network, transaction } = useStore();
  const { sign, updateSignedTx } = transaction;

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSignWithTrezor = async () => {
    // remove the previously signed tx from the display
    updateSignedTx("");

    setIsLoading(true);

    // 'TransactionBuilder.fromXDR'' returns FeeBumpTransaction & Transaction
    // However, Trezor's method 'transformTransaction' param
    // only supports Transaction
    let transaction = TransactionBuilder.fromXDR(
      sign.importXdr,
      network.passphrase,
    ) as Transaction;
    const path = `m/${sign.bipPath}`;

    console.log("**LOG** SignWithTrezor path - ", path);
    console.log("**LOG** SignWithTrezor transaction - ", transaction);

    let onError = (err: string) => {
      err = err || "Couldn't sign transaction with Trezor device.";

      setSignError(err);
    };

    let onConnect = (trezorResponse: TrezorResponse) => {
      console.log("trezorResponse: ", trezorResponse);
      if (trezorResponse.success) {
        const signedTx: StellarSignedTx =
          trezorResponse.payload as StellarSignedTx;
        const signature = Buffer.from(signedTx.signature, "hex");
        const publicKeyBytes = Buffer.from(signedTx.publicKey, "hex");
        const encodedPublicKey = StrKey.encodeEd25519PublicKey(publicKeyBytes);

        let keyPair = Keypair.fromPublicKey(encodedPublicKey);
        let hint = keyPair.signatureHint();
        let decorated = new xdr.DecoratedSignature({ hint, signature });

        console.log("**decorated** ", decorated);
        //   dispatch({
        //     type: TREZOR_WALLET_SIGN_SUCCESS,
        //     signature: decorated,
        //   });
      } else {
        const errorPayload = trezorResponse.payload as { error: string };
        onError(errorPayload.error);
      }
    };

    TrezorConnect.manifest({
      email: "accounts+trezor@stellar.org",
      appUrl: "https://laboratory.stellar.org/",
    });

    console.log("**transaction** :", transaction);
    const trezorParams = transformTransaction(path, transaction);

    console.log("trezorParams :", trezorParams);

    TrezorConnect.stellarSignTransaction(trezorParams)
      .then(onConnect)
      .catch(onError);
  };

  console.log("bipPathErrorMsg.length: ", Boolean(bipPathErrorMsg.length));
  console.log("Boolean(bipPathErrorMsg): ", Boolean(bipPathErrorMsg));
  return (
    <Button
      disabled={Boolean(bipPathErrorMsg) || Boolean(!sign.bipPath)}
      isLoading={isLoading}
      onClick={onSignWithTrezor}
      size="md"
      variant="tertiary"
    >
      Sign with Trezor
    </Button>
  );
};
