"use client";

import { useEffect } from "react";
import { useStore } from "@/store/useStore";
import { TransactionBuilder } from "@stellar/stellar-sdk";
import { useRouter } from "next/navigation";

import { Routes } from "@/constants/routes";

import { ValidationResponseCard } from "@/components/ValidationResponseCard";

import { trackEvent, TrackingEvent } from "@/metrics/tracking";

import { TransactionXdrDisplay } from "./TransactionXdrDisplay";

export const SorobanTransactionXdr = () => {
  const { network, transaction } = useStore();
  const { updateSignActiveView, updateSignImportXdr, updateSorobanBuildXdr } =
    transaction;
  const { soroban, isValid } = transaction.build;
  const { xdr: sorobanXdr } = soroban;
  const router = useRouter();

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

  if (sorobanXdr) {
    return renderSorobanTxResultDisplay({
      sorobanXdr,
      networkPassphrase: network.passphrase,
      onSignClick: () => {
        updateSignImportXdr(sorobanXdr);
        updateSignActiveView("overview");

        trackEvent(TrackingEvent.TRANSACTION_BUILD_SIGN_IN_TX_SIGNER, {
          txType: "smart contract",
        });

        router.push(Routes.SIGN_TRANSACTION);
      },
      onViewXdrClick: () => {
        trackEvent(TrackingEvent.TRANSACTION_BUILD_VIEW_IN_XDR, {
          txType: "smart contract",
        });
      },
    });
  }
  return null;
};

export const renderSorobanTxResultDisplay = ({
  sorobanXdr,
  networkPassphrase,
  onSignClick,
  onViewXdrClick,
}: {
  sorobanXdr: string;
  networkPassphrase: string;
  onSignClick: () => void;
  onViewXdrClick: () => void;
}) => {
  try {
    if (!sorobanXdr) {
      return null;
    }

    const txnHash = TransactionBuilder.fromXDR(sorobanXdr, networkPassphrase)
      .hash()
      .toString("hex");

    return (
      <TransactionXdrDisplay
        xdr={sorobanXdr}
        networkPassphrase={networkPassphrase}
        txnHash={txnHash}
        dataTestId="build-soroban-transaction-envelope-xdr"
        onSignClick={onSignClick}
        onViewXdrClick={onViewXdrClick}
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
