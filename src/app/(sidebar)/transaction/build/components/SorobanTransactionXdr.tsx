"use client";

import { useEffect } from "react";
import { useStore } from "@/store/useStore";
import { TransactionBuilder } from "@stellar/stellar-sdk";
import { useRouter } from "next/navigation";

import {
  getSorobanTxData,
  buildSorobanTx,
  getContractDataXDR,
} from "@/helpers/sorobanUtils";

import { Routes } from "@/constants/routes";

import { SorobanOpType } from "@/types/types";

import { ValidationResponseCard } from "@/components/ValidationResponseCard";
import { TransactionXdrDisplay } from "./TransactionXdrDisplay";

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
  const sorobanDataXdr = sorobanData?.xdr || "";

  useEffect(() => {
    if (sorobanDataXdr) {
      updateSorobanBuildXdr(sorobanDataXdr);
    }
  }, [sorobanDataXdr, updateSorobanBuildXdr]);

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
        <TransactionXdrDisplay
          xdr={sorobanData.xdr}
          networkPassphrase={network.passphrase}
          txnHash={txnHash}
          dataTestId="build-soroban-transaction-envelope-xdr"
          onSignClick={() => {
            updateSignImportXdr(sorobanData.xdr);
            updateSignActiveView("overview");
            router.push(Routes.SIGN_TRANSACTION);
          }}
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
