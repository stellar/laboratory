"use client";

import { useEffect } from "react";
import { useStore } from "@/store/useStore";
import { TransactionBuilder } from "@stellar/stellar-sdk";
import { useRouter } from "next/navigation";

import {
  getSorobanTxData,
  buildTxWithSorobanData,
  getContractDataXDR,
} from "@/helpers/sorobanUtils";
import { TransactionBuildParams } from "@/store/createStore";

import { Routes } from "@/constants/routes";

import { SorobanOpType, TxnOperation } from "@/types/types";

import { ValidationResponseCard } from "@/components/ValidationResponseCard";
import { TransactionXdrDisplay } from "./TransactionXdrDisplay";

export const SorobanTransactionXdr = ({
  hasPreBuiltXdr,
}: {
  hasPreBuiltXdr?: boolean;
}) => {
  const { network, transaction } = useStore();
  const { updateSignActiveView, updateSignImportXdr, updateSorobanBuildXdr } =
    transaction;
  const { soroban, isValid, params: txnParams } = transaction.build;
  const { operation } = soroban;
  const router = useRouter();

  const sorobanData = hasPreBuiltXdr
    ? { xdr: soroban.xdr }
    : getTxWithSorobanData({
        operation,
        txnParams,
        networkPassphrase: network.passphrase,
      });

  useEffect(() => {
    if (sorobanData.xdr && !hasPreBuiltXdr) {
      updateSorobanBuildXdr(sorobanData.xdr);
    }
  }, [sorobanData.xdr, updateSorobanBuildXdr, hasPreBuiltXdr]);

  useEffect(() => {
    // Reset transaction.xdr if the transaction is not valid
    if (!(isValid.params && isValid.operations)) {
      updateSorobanBuildXdr("");
    }
    // Not including updateBuildXdr
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValid.params, isValid.operations]);

  if (!(isValid.params && isValid.operations)) {
    return null;
  }

  if (sorobanData?.xdr) {
    return renderSorobanTxResultDisplay({
      sorobanData: { xdr: sorobanData.xdr },
      networkPassphrase: network.passphrase,
      onSignClick: () => {
        updateSignImportXdr(sorobanData.xdr);
        updateSignActiveView("overview");
        router.push(Routes.SIGN_TRANSACTION);
      },
    });
  }
  return null;
};

const getTxWithSorobanData = ({
  operation,
  txnParams,
  networkPassphrase,
}: {
  operation: TxnOperation;
  txnParams: TransactionBuildParams;
  networkPassphrase: string;
}): { xdr: string; error?: string } => {
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
      const sorobanTx = buildTxWithSorobanData({
        sorobanData,
        params: txnParams,
        sorobanOp: operation,
        networkPassphrase: networkPassphrase,
      });

      const sorobanTxXdrString = sorobanTx.toXDR();

      return { xdr: sorobanTxXdrString, error: undefined };
    } else {
      throw new Error("Failed to build Soroban transaction data");
    }
  } catch (e) {
    return { xdr: "", error: `${e}` };
  }
};

export const renderSorobanTxResultDisplay = ({
  sorobanData,
  networkPassphrase,
  onSignClick,
}: {
  sorobanData: { xdr: string };
  networkPassphrase: string;
  onSignClick: () => void;
}) => {
  try {
    if (!sorobanData.xdr) {
      return null;
    }

    const txnHash = TransactionBuilder.fromXDR(
      sorobanData.xdr,
      networkPassphrase,
    )
      .hash()
      .toString("hex");

    return (
      <TransactionXdrDisplay
        xdr={sorobanData.xdr}
        networkPassphrase={networkPassphrase}
        txnHash={txnHash}
        dataTestId="build-soroban-transaction-envelope-xdr"
        onSignClick={onSignClick}
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
};
