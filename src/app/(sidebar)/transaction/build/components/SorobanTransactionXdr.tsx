"use client";

import { useEffect } from "react";
import { useStore } from "@/store/useStore";
import { TransactionBuilder } from "@stellar/stellar-sdk";
import { useRouter } from "next/navigation";
import { Button } from "@stellar/design-system";

import {
  getSorobanTxData,
  buildSorobanTx,
  getContractDataXDR,
} from "@/helpers/sorobanUtils";

import { Routes } from "@/constants/routes";

import { SorobanOpType } from "@/types/types";

import { SdsLink } from "@/components/SdsLink";
import { ValidationResponseCard } from "@/components/ValidationResponseCard";
import { Box } from "@/components/layout/Box";
import { ViewInXdrButton } from "@/components/ViewInXdrButton";

export const SorobanTransactionXdr = () => {
  const { network, transaction } = useStore();
  const { updateSignActiveView, updateSignImportXdr, updateSorobanBuildXdr } =
    transaction;
  const { soroban, isValid, params: txnParams } = transaction.build;
  const { operation } = soroban;
  const router = useRouter();

  useEffect(() => {
    // Reset transaction.xdr if the transaction is not valid
    if (!(isValid.params && isValid.operations)) {
      updateSorobanBuildXdr("");
    }
    // Not including updateBuildXdr
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValid.params, isValid.operations]);

  const getSorobanTxDataResult = (): { xdr: string; error?: string } => {
    try {
      const contractDataXDR = getContractDataXDR({
        contractAddress: operation.params.contract,
        dataKey: operation.params.key_xdr,
        durability: operation.params.durability,
      });

      const sorobanData = getSorobanTxData({
        contractDataXDR,
        operationType: operation.operation_type as SorobanOpType,
        fee: operation.params.resource_fee,
      });

      if (sorobanData) {
        const builtXdr = buildSorobanTx({
          sorobanData,
          params: txnParams,
          sorobanOp: operation,
          networkPassphrase: network.passphrase,
        });

        const builtXdrString = builtXdr.toXDR();

        return { xdr: builtXdrString };
      } else {
        throw new Error("Failed to build Soroban transaction data");
      }
    } catch (e) {
      return { xdr: "", error: `${e}` };
    }
  };

  const sorobanData = getSorobanTxDataResult();

  useEffect(() => {
    if (sorobanData.xdr) {
      updateSorobanBuildXdr(sorobanData.xdr);
    }
  }, [sorobanData.xdr, updateSorobanBuildXdr]);

  if (!(isValid.params && isValid.operations)) {
    return null;
  }

  if (sorobanData?.xdr) {
    try {
      const txnHash = TransactionBuilder.fromXDR(
        sorobanData.xdr,
        network.passphrase,
      )
        .hash()
        .toString("hex");

      return (
        <ValidationResponseCard
          variant="success"
          title="Success! Soroban Transaction Envelope XDR:"
          response={
            <Box gap="xs" data-testid="build-soroban-transaction-envelope-xdr">
              <div>
                <div>Network Passphrase:</div>
                <div>{network.passphrase}</div>
              </div>
              <div>
                <div>Hash:</div>
                <div>{txnHash}</div>
              </div>
              <div>
                <div>XDR:</div>
                <div>{sorobanData.xdr}</div>
              </div>
            </Box>
          }
          note={
            <>
              In order for the transaction to make it into the ledger, a
              transaction must be successfully signed and submitted to the
              network. The Lab provides the{" "}
              <SdsLink href={Routes.SIGN_TRANSACTION}>
                Transaction Signer
              </SdsLink>{" "}
              for signing a transaction, and the{" "}
              <SdsLink href={Routes.SUBMIT_TRANSACTION}>
                Post Transaction endpoint
              </SdsLink>{" "}
              for submitting one to the network.
            </>
          }
          footerLeftEl={
            <>
              <Button
                size="md"
                variant="secondary"
                onClick={() => {
                  updateSignImportXdr(sorobanData.xdr);
                  updateSignActiveView("overview");

                  router.push(Routes.SIGN_TRANSACTION);
                }}
              >
                Sign in Transaction Signer
              </Button>

              <ViewInXdrButton xdrBlob={sorobanData.xdr} />
            </>
          }
        />
      );
    } catch (e: any) {
      return (
        <ValidationResponseCard
          variant="error"
          title="Transaction Error:"
          response={e.toString()}
        />
      );
    }
  }

  return null;
};
