"use client";

import React, { useEffect, useState } from "react";

import { useSimulateTx } from "@/query/useSimulateTx";

import { useStore } from "@/store/useStore";
import { SorobanOpType } from "@/types/types";
import { getNetworkHeaders } from "@/helpers/getNetworkHeaders";
import {
  buildSorobanTx,
  getContractDataXDR,
  getSorobanTxData,
} from "@/helpers/sorobanUtils";

import { InputSideElement } from "@/components/InputSideElement";
import { PositiveIntPicker } from "@/components/FormElements/PositiveIntPicker";

const isAllParamsExceptResourceFeeValid = (params: Record<string, any>) => {
  // Create a copy of params without resource_fee
  const { ...requiredParams } = params;

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
      // We add a bogus fee to simualte to fetch the min resource fee from the RPC
      const BOGUS_RESOURCE_FEE = "100";

      let builtXdr, contractDataXDR;

      try {
        contractDataXDR = getContractDataXDR({
          contractAddress: operation.params.contract,
          dataKey: operation.params.key_xdr,
          durability: operation.params.durability,
        });
      } catch (e) {
        throw new Error(`Failed to generate contract data XDR: ${e}`);
      }

      if (!contractDataXDR) {
        throw new Error("Failed to fetch contract data XDR");
      }

      const sorobanData = getSorobanTxData({
        contractDataXDR,
        operationType: operation.operation_type as SorobanOpType,
        fee: BOGUS_RESOURCE_FEE, // simulate purpose only
      });

      if (sorobanData) {
        builtXdr = buildSorobanTx({
          sorobanData,
          params: txnParams,
          sorobanOp: {
            ...operation,
            params: {
              ...operation.params,
              resource_fee: BOGUS_RESOURCE_FEE,
            },
          },
          networkPassphrase: network.passphrase,
        }).toXDR();
      } else {
        throw new Error("Failed to build Soroban transaction data");
      }
      return builtXdr;
    } catch (e) {
      setErrorMessage(`${e}`);
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
