"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import LedgerTransportWebUSB from "@ledgerhq/hw-transport-webusb";
import LedgerStr from "@ledgerhq/hw-app-str";
import { Button } from "@stellar/design-system";
import { Keypair, TransactionBuilder, xdr } from "@stellar/stellar-sdk";

import { useStore } from "@/store/useStore";

import { LedgerErrorResponse } from "@/types/types";

interface LedgerApi {
  getPublicKey(path: string): Promise<{ publicKey: string }>;
  signHash(path: string, hash: Buffer): Promise<{ signature: Buffer }>;
  signTransaction(
    path: string,
    transaction: Buffer,
  ): Promise<{ signature: Buffer }>;
}

export const SignWithLedger = ({
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

  const onSignWithLedger = async () => {
    // reset the previously returned status values
    updateSignedTx("");
    setSignError("");
    setSignSuccess(false);

    setIsLoading(true);

    const transaction = TransactionBuilder.fromXDR(
      sign.importXdr,
      network.passphrase,
    );

    const onError = (err: LedgerErrorResponse) => {
      setIsLoading(false);

      let error;

      if (err.message) {
        error = err.message;
      } else if (err.errorCode == 2) {
        error = `Couldn't connect to Ledger device. Connection can only be established using a secure connection.`;
      } else if (err.errorCode == 5) {
        error = `Connection timeout.`;
      }

      setSignError(error || "");
    };

    const onConnect = (ledgerApi: LedgerApi) => {
      let publicKey: string;

      ledgerApi
        .getPublicKey(sign.bipPath)
        .then((result: { publicKey: string }) => (publicKey = result.publicKey))
        .then(() => {
          // @TODO waiting on design
          // if (isHash) {
          //   return ledgerApi.signHash(sign.bipPath, transaction.hash());
          // }
          return ledgerApi.signTransaction(
            sign.bipPath,
            transaction.signatureBase(),
          );
        })
        .then((result: { signature: Buffer }) => {
          setIsLoading(false);

          const { signature } = result;
          const keyPair = Keypair.fromPublicKey(publicKey);
          const hint = keyPair.signatureHint();
          const decorated = new xdr.DecoratedSignature({ hint, signature });

          updateHardWalletSigs([decorated]);
          setSignSuccess(true);
        })
        .catch(onError);
    };

    LedgerTransportWebUSB.request()
      .then((transport) => {
        onConnect(new LedgerStr(transport));
      })
      .catch(onError);
  };

  return (
    <Button
      disabled={isDisabled}
      isLoading={isLoading}
      onClick={onSignWithLedger}
      size="md"
      variant="tertiary"
    >
      Sign with Ledger
    </Button>
  );
};
