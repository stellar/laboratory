"use client";

import React, { useEffect, useState } from "react";
import { useSimulateTx } from "@/query/useSimulateTx";
import { BASE_FEE } from "@stellar/stellar-sdk";

import { useStore } from "@/store/useStore";
import { getNetworkHeaders } from "@/helpers/getNetworkHeaders";
import {
  buildTxWithSorobanData,
  getContractDataXDR,
  getSorobanTxData,
} from "@/helpers/sorobanUtils";

import { InputSideElement } from "@/components/InputSideElement";
import { PositiveIntPicker } from "@/components/FormElements/PositiveIntPicker";

import { SorobanOpType } from "@/types/types";

const isAllParamsExceptResourceFeeValid = (params: Record<string, any>) => {
  // Create a copy of params without resource_fee
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { resource_fee, ...requiredParams } = params;

  // Check if all remaining fields have truthy values
  return Object.values(requiredParams).every((value) => Boolean(value));
};

interface ResourceFeePickerWithQueryProps {
  id: string;
  labelSuffix?: string | React.ReactNode;
  label: string;
  value: string;
  placeholder?: string;
  error: string | undefined;
  note?: React.ReactNode;
  infoLink?: string;
  disabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// Used only for a Soroban operation
// Includes a simulate transaction button to fetch
// the minimum resource fee
export const ResourceFeePickerWithQuery = ({
  id,
  labelSuffix,
  label,
  value,
  error,
  onChange,
  placeholder,
  note,
  infoLink,
  disabled,
  ...props
}: ResourceFeePickerWithQueryProps) => {
  const { network, transaction } = useStore();
  const { params: txnParams, soroban, isValid } = transaction.build;
  const { operation } = soroban;
  const {
    mutateAsync: simulateTx,
    data: simulateTxData,
    isPending: isSimulateTxPending,
  } = useSimulateTx();

  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined,
  );

  useEffect(() => {
    // Reset error message when operation params change
    setErrorMessage(undefined);
  }, [soroban.operation]);

  // operation.params.resource_fee is required for submitting; however,
  // we don't check for it here in case user doesn't have one and we still want to simulate
  // @TODO should update this from isValid.operations point of view
  // It doesn't validate the input at the moment
  const isOperationValidForSimulateTx = isAllParamsExceptResourceFeeValid(
    operation.params,
  );

  useEffect(() => {
    // If the user has fetched the min resource fee, update the input's value
    if (simulateTxData?.result?.minResourceFee) {
      const syntheticEvent = {
        target: {
          value: simulateTxData.result.minResourceFee.toString(),
        },
      } as React.ChangeEvent<HTMLInputElement>;

      onChange(syntheticEvent);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [simulateTxData?.result?.minResourceFee]);

  // Create a sample transaction to simulate to get the min resource fee
  const buildTxToSimulate = () => {
    try {
      const contractDataXDR = getContractDataXDR({
        contractAddress: operation.params.contract,
        dataKey: operation.params.key_xdr,
        durability: operation.params.durability,
      });

      if (!contractDataXDR) {
        throw new Error("Failed to fetch contract data XDR");
      }

      const sorobanData = getSorobanTxData({
        contractDataXDR,
        operationType: operation.operation_type as SorobanOpType,
        fee: BASE_FEE, // simulate purpose only
      });

      if (!sorobanData) {
        throw new Error("Failed to build Soroban transaction data");
      }

      const builtXdr = buildTxWithSorobanData({
        sorobanData,
        params: txnParams,
        sorobanOp: {
          ...operation,
          params: {
            ...operation.params,
            resource_fee: BASE_FEE,
          },
        },
        networkPassphrase: network.passphrase,
      }).toXDR();

      return builtXdr;
    } catch (e) {
      setErrorMessage(
        `Something went wrong when calculating a resource fee: ${e}`,
      );
      return;
    }
  };

  return (
    <PositiveIntPicker
      key={id}
      id={id}
      label={label}
      placeholder={placeholder}
      labelSuffix={labelSuffix}
      value={value}
      error={error || errorMessage}
      onChange={(e) => {
        onChange(e);
        setErrorMessage(undefined);
      }}
      infoLink={infoLink}
      note={note}
      disabled={disabled}
      rightElement={
        <InputSideElement
          variant="button"
          onClick={async () => {
            const sampleTxnXdr = buildTxToSimulate();

            if (!sampleTxnXdr) {
              return;
            }

            await simulateTx({
              rpcUrl: network.rpcUrl,
              transactionXdr: sampleTxnXdr,
              headers: getNetworkHeaders(network, "rpc"),
            });
          }}
          placement="right"
          // if we can't build a txn to simulate, we can't fetch the min resource fee
          disabled={!(isValid.params && isOperationValidForSimulateTx)}
          isLoading={isSimulateTxPending}
        >
          Fetch minimum resource fee from RPC
        </InputSideElement>
      }
      {...props}
    />
  );
};
