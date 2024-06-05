"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import { Button } from "@stellar/design-system";

import { useStore } from "@/store/useStore";

import { TrezorResponse } from "@/types/types";

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
  isDisabled,
  setSignError,
  setSignSuccess,
}: {
  isDisabled: boolean;
  setSignError: Dispatch<SetStateAction<string>>;
  setSignSuccess: Dispatch<SetStateAction<boolean>>;
}) => {
  const { network, transaction } = useStore();
  const { sign, updateSignedTx, updateHardWalletSigs } = transaction;

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSignWithTrezor = async () => {
    // reset the previously returned status values
    updateSignedTx("");
    setSignError("");
    setSignSuccess(false);

    setIsLoading(true);

    // 'TransactionBuilder.fromXDR'' returns FeeBumpTransaction & Transaction
    // However, Trezor's method 'transformTransaction' param
    // only supports Transaction
    const transaction = TransactionBuilder.fromXDR(
      sign.importXdr,
      network.passphrase,
    ) as Transaction;
    const path = `m/${sign.bipPath}`;

    const onError = (err: string) => {
      err = err || "Couldn't sign transaction with Trezor device.";

      setSignError(err);
    };

    const onConnect = (trezorResponse: TrezorResponse) => {
      if (trezorResponse.success) {
        const signedTx: StellarSignedTx =
          trezorResponse.payload as StellarSignedTx;
        const signature = Buffer.from(signedTx.signature, "hex");
        const publicKeyBytes = Buffer.from(signedTx.publicKey, "hex");
        const encodedPublicKey = StrKey.encodeEd25519PublicKey(publicKeyBytes);

        const keyPair = Keypair.fromPublicKey(encodedPublicKey);
        const hint = keyPair.signatureHint();
        const decorated = new xdr.DecoratedSignature({ hint, signature });

        updateHardWalletSigs([decorated]);
        setSignSuccess(true);
      } else {
        const errorPayload = trezorResponse.payload as { error: string };
        onError(errorPayload.error);
      }

      setIsLoading(false);
    };

    TrezorConnect.manifest({
      email: "accounts+trezor@stellar.org",
      appUrl: "https://laboratory.stellar.org/",
    });

    const trezorParams = transformTransaction(path, transaction);

    TrezorConnect.stellarSignTransaction(trezorParams)
      .then(onConnect)
      .catch(onError);
  };

  return (
    <Button
      disabled={isDisabled}
      isLoading={isLoading}
      onClick={onSignWithTrezor}
      size="md"
      variant="tertiary"
    >
      Sign with Trezor
    </Button>
  );
};
