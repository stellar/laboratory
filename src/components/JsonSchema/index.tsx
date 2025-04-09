import React, { useEffect, useState } from "react";
import { BASE_FEE, contract } from "@stellar/stellar-sdk";
import { Button, Card, Text } from "@stellar/design-system";
import type { JSONSchema7 } from "json-schema";
import { stringify } from "lossless-json";
import { usePrevious } from "@/hooks/usePrevious";
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

import { AnyObject, SorobanInvokeValue, TxnOperation } from "@/types/types";

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
  const { operation: sorobanOperation } = soroban;
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

  const requiredFields = dereferencedSchema.required;
  const [formError, setFormError] = useState<AnyObject>({});
  const [submitTxError, setSubmitTxError] = useState<string>("");

  const hasFormError = Object.values(formError).some((error) => error !== "");
  const prevName = usePrevious(name);
  const prevValue = usePrevious(stringify(value.args));

  // reset form error and submit tx error when the dropdown changes
  useEffect(() => {
    if (prevName !== name) {
      setFormError({});
      setSubmitTxError("");
    }
  }, [prevName, name]);

  // reset submit tx error when the form's argument data changes
  useEffect(() => {
    if (prevValue !== stringify(value.args)) {
      setSubmitTxError("");
    }
  }, [value.args]);

  useEffect(() => {
    if (prepareTxData) {
      updateSorobanBuildXdr(prepareTxData.transactionXdr);
    } else {
      updateSorobanBuildXdr("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prepareTxData]);

  useEffect(() => {
    if (isPrepareTxError) {
      setSubmitTxError(prepareTxError?.result.toString() || "");
    } else {
      setSubmitTxError("");
    }
  }, [isPrepareTxError]);

  const handlePrepareTx = () => {
    setSubmitTxError("");
    resetPrepareTx();

    const { xdr, error } = getTxnToSimulate(
      value,
      spec,
      txnParams,
      sorobanOperation,
      network.passphrase,
    );

    if (xdr) {
      prepareTx({
        rpcUrl: network.rpcUrl,
        transactionXdr: xdr,
        networkPassphrase: network.passphrase,
        headers: getNetworkHeaders(network, "rpc"),
      });
    }

    if (error) {
      if (error.includes("Missing field")) {
        setSubmitTxError(
          `Missing required field(s): ${requiredFields.join(", ")}`,
        );
      } else {
        setSubmitTxError(error);
      }
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
            formError={formError}
            setFormError={setFormError}
          />
        </Box>

        <Box gap="md" direction="row" wrap="wrap">
          <Button
            variant="secondary"
            disabled={!isValid.params || hasFormError}
            isLoading={isPrepareTxPending}
            size="md"
            onClick={handlePrepareTx}
            type="submit"
          >
            Prepare Transaction
          </Button>
        </Box>

        {submitTxError && <ErrorText errorMessage={submitTxError} size="sm" />}
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
    {description ? (
      <Text size="sm" as="div">
        {description}
      </Text>
    ) : null}
  </>
);

const getTxnToSimulate = (
  value: SorobanInvokeValue,
  spec: contract.Spec,
  txnParams: TransactionBuildParams,
  operation: TxnOperation,
  networkPassphrase: string,
): { xdr: string; error: string } => {
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

    return { xdr: builtXdr.toXDR(), error: "" };
  } catch (e: any) {
    return { xdr: "", error: e.message };
  }
};
