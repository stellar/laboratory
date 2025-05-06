import React, { useEffect, useState } from "react";
import { BASE_FEE, nativeToScVal, xdr } from "@stellar/stellar-sdk";
import { Button, Card, Text } from "@stellar/design-system";
import type { JSONSchema7 } from "json-schema";
import { stringify } from "lossless-json";
import { usePrevious } from "@/hooks/usePrevious";
import { TransactionBuildParams } from "@/store/createStore";
import { useStore } from "@/store/useStore";

import { DereferencedSchemaType } from "@/constants/jsonSchema";

import { dereferenceSchema } from "@/helpers/dereferenceSchema";
import { buildTxWithSorobanData } from "@/helpers/sorobanUtils";
import { getNetworkHeaders } from "@/helpers/getNetworkHeaders";
import { isEmptyObject } from "@/helpers/isEmptyObject";

import { useRpcPrepareTx } from "@/query/useRpcPrepareTx";

import { Box } from "@/components/layout/Box";
import { ErrorText } from "@/components/ErrorText";

import { AnyObject, SorobanInvokeValue, TxnOperation } from "@/types/types";

import { JsonSchemaFormRenderer } from "./JsonSchemaFormRenderer";

export const JsonSchemaForm = ({
  name,
  value,
  onChange,
  funcSchema,
}: {
  name: string;
  value: SorobanInvokeValue;
  onChange: (value: SorobanInvokeValue) => void;
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

  const missingReqFields = requiredFields.reduce((res, cur) => {
    if (value.args[cur].length === 0) {
      return [...res, cur];
    }

    if (!value.args[cur]) {
      return [...res, cur];
    }

    if (value.args[cur] && Array.isArray(value.args[cur])) {
      if (value.args[cur].some((v: any) => isEmptyObject(v))) {
        return [...res, cur];
      }
    }

    return res;
  }, [] as string[]);

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
  }, [prevValue, value.args]);

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
  }, [isPrepareTxError, prepareTxError?.result]);

  const handlePrepareTx = () => {
    setSubmitTxError("");
    resetPrepareTx();

    const { xdr, error } = getTxnToSimulate(
      value,
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
            onChange={onChange}
            formError={formError}
            setFormError={setFormError}
          />
        </Box>

        <Box gap="md" direction="row" wrap="wrap">
          <Button
            variant="secondary"
            disabled={
              !isValid.params || hasFormError || missingReqFields.length > 0
            }
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
  txnParams: TransactionBuildParams,
  operation: TxnOperation,
  networkPassphrase: string,
): { xdr: string; error: string } => {
  try {
    const argsToScVals = getScValsFromArgs(value.args);
    const builtXdr = buildTxWithSorobanData({
      params: txnParams,
      sorobanOp: {
        ...operation,
        params: {
          ...operation.params,
          contract_id: value.contract_id,
          function_name: value.function_name,
          args: argsToScVals,
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

const convertObjectToScVal = (obj: Record<string, any>): xdr.ScVal => {
  const convertedValue: Record<string, any> = {};
  const typeHints: Record<string, [string, string]> = {};
  // obj input example:
  //  {
  //    "address": {
  //      "value": "CDVQVKOY2YSXS2IC7KN6MNASSHPAO7UN2UR2ON4OI2SKMFJNVAMDX6DP",
  //      "type": "Address"
  //    },
  //    "amount": {
  //      "value": "2",
  //      "type": "I128"
  //    },
  //    "request_type": {
  //      "value": "4",
  //      "type": "U32"
  //    }
  //  }

  //  for an array of objects, `nativeToScVal` expects the following type for `val`:
  //  https://stellar.github.io/js-stellar-sdk/global.html#nativeToScVal
  //  {
  //     "address": "CDVQVKOY2YSXS2IC7KN6MNASSHPAO7UN2UR2ON4OI2SKMFJNVAMDX6DP",
  //     "amount": "2",
  //     "request_type": "2"
  //  }
  //  for `type`, it expects the following type:
  //   {
  //     "address": [
  //       "symbol", // matching the key type
  //       "address" // matching the value type
  //     ],
  //     "amount": [
  //       "symbol", // matching the key type
  //       "i128" // matching the value type
  //     ],
  //     "request_type": [
  //       "symbol", // matching the key type
  //       "u32" // matching the value type
  //     ]
  //  }

  for (const key in obj) {
    convertedValue[key] = obj[key].value;
    // toLowerCase() is needed because the type we save from the label is in uppercase
    // but nativeToScval expects the type to be in lowercase
    typeHints[key] = ["symbol", obj[key].type.toLowerCase()];
  }

  return nativeToScVal(convertedValue, { type: typeHints });
};

const getScValsFromArgs = (args: SorobanInvokeValue["args"]): xdr.ScVal[] => {
  const scVals: xdr.ScVal[] = [];

  for (const argKey in args) {
    const argValue = args[argKey];
    // Note: argValue is either an object or array of objects
    if (Array.isArray(argValue) && Object.values(argValue).length > 0) {
      // array of objects
      if (argValue.some((v) => typeof Object.values(v)[0] === "object")) {
        const arrayScVals = argValue.map((v) => convertObjectToScVal(v));
        scVals.push(...arrayScVals);
      } else {
        // array of primitives example:
        //   {
        //     "value": "GBPIMUEJFYS7RT23QO2ACH2JMKGXLXZI4E5ACBSQMF32RKZ5H3SVNL5F",
        //     "type": "Address"
        // }
        const arrayScVals = argValue.reduce((acc, v) => {
          acc.push(v.value);
          return acc;
        }, []);

        const scVal = nativeToScVal(arrayScVals, {
          type: argValue[0].type.toLowerCase(),
        });

        scVals.push(scVal);
      }
    } else {
      scVals.push(
        nativeToScVal(argValue.value, { type: argValue.type.toLowerCase() }),
      );
    }
  }

  return scVals;
};
