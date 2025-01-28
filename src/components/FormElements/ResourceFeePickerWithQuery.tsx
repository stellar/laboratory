"use client";

import React, { useEffect } from "react";

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
// Includes a simulate transaction function to fetch
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

  useEffect(() => {
    if (simulateTxData?.result?.minResourceFee) {
      const syntheticEvent = {
        target: {
          value: simulateTxData.result.minResourceFee.toString(),
        },
      } as React.ChangeEvent<HTMLInputElement>;

      onChange(syntheticEvent);
    }
  }, [simulateTxData?.result?.minResourceFee]);

  // Create a sample transaction (txn) to simulate to get the min resource fee
  const buildTxToSimulate = () => {
    try {
      // we don't check for operation.params.resource_fee here
      // in case user doesn't have one and we still want to simulate
      const isOperationValid = Boolean(
        operation.params.contract &&
          operation.params.key_xdr &&
          operation.params.durability,
      );

      const BOGUS_RESOURCE_FEE = "100";

      if (!isValid.params || !isOperationValid) {
        return;
      }

      let sorobanData, builtXdr;

      const contractDataXDR = getContractDataXDR({
        contractAddress: operation.params.contract,
        dataKey: operation.params.key_xdr,
        durability: operation.params.durability,
      });

      if (contractDataXDR) {
        sorobanData = getSorobanTxData({
          contractDataXDR,
          operationType: operation.operation_type as SorobanOpType,
          fee: BOGUS_RESOURCE_FEE, // simulate purpose only
        });
      }

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
      }
      return builtXdr;
    } catch (e) {
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
      error={error}
      onChange={onChange}
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
          disabled={!buildTxToSimulate()}
          isLoading={isSimulateTxPending}
        >
          Fetch minimum resource fee from RPC
        </InputSideElement>
      }
      {...props}
    />
  );
};
