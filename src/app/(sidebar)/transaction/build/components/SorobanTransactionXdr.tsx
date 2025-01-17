"use client";

import { useStore } from "@/store/useStore";
import { TransactionBuilder } from "@stellar/stellar-sdk";
import { useRouter } from "next/navigation";
import { Button } from "@stellar/design-system";

import {
  getSorobanDataResult,
  buildSorobanTx,
  getContractDataXDR,
} from "@/helpers/sorobanUtils";

import { Routes } from "@/constants/routes";

import { SdsLink } from "@/components/SdsLink";
import { ValidationResponseCard } from "@/components/ValidationResponseCard";
import { Box } from "@/components/layout/Box";
import { ViewInXdrButton } from "@/components/ViewInXdrButton";
import { SorobanOpType } from "@/types/types";

export const SorobanTransactionXdr = () => {
  const { network, transaction } = useStore();
  const { updateSignActiveView, updateSignImportXdr, updateSorobanBuildXdr } =
    transaction;
  const { soroban, isValid, params: txnParams } = transaction.build;
  const { operation } = soroban;
  const router = useRouter();

  const sorobanTxData = (): { xdr: string; error?: string } => {
    try {
      if (!isValid.operations || !isValid.params) {
        updateSorobanBuildXdr("");
        return { xdr: "" };
      }

      const contractDataXDR = getContractDataXDR({
        contractAddress: operation.params.contract,
        dataKey: operation.params.key_xdr,
        durability: operation.params.durability,
      });

      const sorobanData = getSorobanDataResult({
        contractDataXDR,
        operationType: operation.operation_type as SorobanOpType,
        fee: operation.params.resource_fee,
      });

      if (sorobanData) {
        const builtXdr = buildSorobanTx({
          sorobanData,
          params: txnParams,
          sorobanParams: operation.params,
          networkPassphrase: network.passphrase,
        });

        const builtXdrString = builtXdr.toXDR();

        updateSorobanBuildXdr(builtXdrString);
        return { xdr: builtXdrString };
      }
      updateSorobanBuildXdr("");
      return { xdr: "" };
    } catch (e) {
      updateSorobanBuildXdr("");
      return { xdr: "", error: `${e}` };
    }
  };

  const sorobanData = sorobanTxData();

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
          title="Success! Transaction Envelope XDR:"
          response={
            <Box gap="xs" data-testid="build-transaction-envelope-xdr">
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

  if (sorobanData?.error) {
    return (
      <ValidationResponseCard
        variant="error"
        title="Transaction Error:"
        response={sorobanData.error}
      />
    );
  }

  return null;
};
