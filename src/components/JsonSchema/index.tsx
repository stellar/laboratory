import React, { useEffect } from "react";
import { BASE_FEE, contract } from "@stellar/stellar-sdk";
import { Button, Card, Text } from "@stellar/design-system";
import type { JSONSchema7 } from "json-schema";

import { TransactionBuildParams } from "@/store/createStore";
import { useStore } from "@/store/useStore";

import { DereferencedSchemaType } from "@/constants/jsonSchema";

import { dereferenceSchema } from "@/helpers/dereferenceSchema";
import { getScValsFromSpec } from "@/helpers/getScValsFromSpec";
import { buildTxWithSorobanData } from "@/helpers/sorobanUtils";
import { getNetworkHeaders } from "@/helpers/getNetworkHeaders";

import { useRpcPrepareTx } from "@/query/useRpcPrepareTx";

import { Box } from "@/components/layout/Box";
import { ErrorText } from "@/components/ErrorText";

import { SorobanInvokeValue, TxnOperation } from "@/types/types";

import { JsonSchemaFormRenderer } from "./JsonSchemaFormRenderer";

export const JsonSchemaForm = ({
  name,
  value,
  onChange,
  spec,
  funcSchema,
}: {
  name: string;
  value: SorobanInvokeValue;
  onChange: (value: SorobanInvokeValue) => void;
  spec: contract.Spec;
  funcSchema: JSONSchema7;
}) => {
  const { network, transaction } = useStore();
  const { updateSorobanBuildXdr } = transaction;
  const { isValid } = transaction.build;
  const { params: txnParams, soroban } = transaction.build;
  const { operation } = soroban;
  const {
    mutate: prepareTx,
    isPending: isPrepareTxPending,
    isError: isPrepareTxError,
    error: prepareTxError,
    data: prepareTxData,
    reset: resetPrepareTx,
  } = useRpcPrepareTx();

  const dereferencedSchema: DereferencedSchemaType = dereferenceSchema(
    funcSchema,
    name,
  );

  useEffect(() => {
    if (prepareTxData) {
      updateSorobanBuildXdr(prepareTxData.transactionXdr);
    } else {
      updateSorobanBuildXdr("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prepareTxData]);

  const handlePrepareTx = () => {
    resetPrepareTx();

    const sampleTxnXdr = getTxnToSimulate(
      value,
      spec,
      txnParams,
      operation,
      network.passphrase,
    );

    if (sampleTxnXdr) {
      prepareTx({
        rpcUrl: network.rpcUrl,
        transactionXdr: sampleTxnXdr,
        networkPassphrase: network.passphrase,
        headers: getNetworkHeaders(network, "rpc"),
      });
    } else {
      return undefined;
    }
  };

  const render = (schema: DereferencedSchemaType): React.ReactElement => {
    const { name, description } = schema;

    return (
      <Box gap="md">
        {renderTitle(name, description)}

        <Box gap="md" key={name}>
          <JsonSchemaFormRenderer
            name={name}
            schema={dereferencedSchema as JSONSchema7}
            formData={value.args}
            onChange={onChange}
          />
        </Box>

        <Box gap="md" direction="row" wrap="wrap">
          <Button
            variant="secondary"
            disabled={!(isValid.params && isValid.operations)}
            isLoading={isPrepareTxPending}
            size="md"
            onClick={handlePrepareTx}
            type="button"
          >
            Prepare Transaction
          </Button>
        </Box>

        {isPrepareTxError && prepareTxError?.result.toString() ? (
          <ErrorText
            errorMessage={prepareTxError?.result.toString()}
            size="sm"
          />
        ) : (
          <></>
        )}
      </Box>
    );
  };

  return (
    <Box gap="md">
      <Card>{render(dereferencedSchema)}</Card>
    </Box>
  );
};

const renderTitle = (name: string, description: string) => (
  <>
    <Text size="lg" as="h2">
      {name}
    </Text>
    {description ? <div>{description}</div> : null}
  </>
);

const getTxnToSimulate = (
  value: SorobanInvokeValue,
  spec: contract.Spec,
  txnParams: TransactionBuildParams,
  operation: TxnOperation,
  networkPassphrase: string,
) => {
  try {
    const scVals = getScValsFromSpec(value.function_name, spec, value);
    const builtXdr = buildTxWithSorobanData({
      params: txnParams,
      sorobanOp: {
        ...operation,
        params: {
          ...operation.params,
          contract_id: value.contract_id,
          function_name: value.function_name,
          args: scVals,
          resource_fee: BASE_FEE, // bogus resource fee for simulation purpose
        },
      },
      networkPassphrase,
    });

    return builtXdr.toXDR();
  } catch (e: any) {
    console.error("e", e);
    return undefined;
  }
};
