import React, { useEffect, useState } from "react";
import { BASE_FEE, nativeToScVal, xdr } from "@stellar/stellar-sdk";
import { Button, Card, Text } from "@stellar/design-system";
import type { JSONSchema7 } from "json-schema";
import { stringify } from "lossless-json";
import { usePrevious } from "@/hooks/usePrevious";
import { TransactionBuildParams } from "@/store/createStore";
import { useStore } from "@/store/useStore";
import { useRouter } from "next/navigation";

import { DereferencedSchemaType } from "@/constants/jsonSchema";

import { dereferenceSchema } from "@/helpers/dereferenceSchema";
import { buildTxWithSorobanData } from "@/helpers/sorobanUtils";
import { getNetworkHeaders } from "@/helpers/getNetworkHeaders";

import { useRpcPrepareTx } from "@/query/useRpcPrepareTx";

import { Box } from "@/components/layout/Box";
import { ErrorText } from "@/components/ErrorText";

import { AnyObject, SorobanInvokeValue, TxnOperation } from "@/types/types";

import { JsonSchemaFormRenderer } from "./JsonSchemaFormRenderer";
import { trackEvent, TrackingEvent } from "@/metrics/tracking";

import { XDR_TYPE_TRANSACTION_ENVELOPE } from "@/constants/settings";

import { Routes } from "@/constants/routes";
import { delayedAction } from "@/helpers/delayedAction";

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
  const { network, transaction, xdr } = useStore();
  const { updateXdrBlob, updateXdrType } = xdr;
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

  const router = useRouter();

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

  // const onViewSubmitTxn = () => {
  //   if (sign.signedTx) {
  //     xdr.updateXdrBlob(sign.signedTx);
  //     xdr.updateXdrType(XDR_TYPE_TRANSACTION_ENVELOPE);

  //     delayedAction({
  //       action: () => {
  //         trackEvent(TrackingEvent.TRANSACTION_SIGN_SUBMIT_IN_TX_SUBMITTER);
  //         router.push(Routes.SUBMIT_TRANSACTION);
  //       },
  //       delay: 200,
  //     });
  //   }
  // };

  // const onSimulateTxn = () => {
  //   if (sign.signedTx) {
  //     xdr.updateXdrBlob(sign.signedTx);
  //     xdr.updateXdrType(XDR_TYPE_TRANSACTION_ENVELOPE);

  //   transaction.updateSimulateTriggerOnLaunch(true);

  //   // Adding delay to make sure the store will update
  //   delayedAction({
  //     action: () => {
  //       trackEvent(TrackingEvent.TRANSACTION_SIGN_SIMULATE);
  //       router.push(Routes.SIMULATE_TRANSACTION);
  //     },
  //     delay: 200,
  //   });
  // }
  // };

  const handleSimulateTx = () => {
    setSubmitTxError("");
    resetPrepareTx();

    const { xdr, error } = getTxnToSimulate(
      value,
      txnParams,
      sorobanOperation,
      network.passphrase,
    );

    console.log("xdr", xdr);

    // updateXdrBlob(sign.signedTx);
    // updateXdrType(XDR_TYPE_TRANSACTION_ENVELOPE);

    if (xdr) {
      updateXdrBlob(xdr);
      updateXdrType(XDR_TYPE_TRANSACTION_ENVELOPE);

      transaction.updateSimulateTriggerOnLaunch(true);

      // Adding delay to make sure the store will update
      delayedAction({
        action: () => {
          trackEvent(TrackingEvent.TRANSACTION_SIGN_SIMULATE);
          router.push(Routes.SIMULATE_TRANSACTION);
        },
        delay: 200,
      });
    }

    // prepareTx({
    //   rpcUrl: network.rpcUrl,
    //   transactionXdr: xdr,
    //   networkPassphrase: network.passphrase,
    //   headers: getNetworkHeaders(network, "rpc"),
    // });
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
            onClick={handleSimulateTx}
            type="submit"
          >
            Simulate Transaction
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

const getScValsFromArgs = (args: SorobanInvokeValue["args"]): xdr.ScVal[] => {
  const scVals: xdr.ScVal[] = [];

  for (const argKey in args) {
    const argValue = args[argKey];
    // Note: argValue is either an object or array of objects
    if (Array.isArray(argValue)) {
      const arrayScVals = argValue.map((v) => {
        const convertedValue: Record<string, any> = {};
        const typeHints: Record<string, [string, string]> = {};

        for (const key in v) {
          convertedValue[key] = v[key].value;
          // toLowerCase() is needed because the type we save from the label is in uppercase
          // but nativeToScval expects the type to be in lowercase
          typeHints[key] = ["symbol", v[key].type.toLowerCase()];
        }

        // for an array of objects, `nativeToScVal` expects the following type for val:
        //   {
        //     "address": "CDVQVKOY2YSXS2IC7KN6MNASSHPAO7UN2UR2ON4OI2SKMFJNVAMDX6DP",
        //     "amount": "2",
        //     "request_type": "2"
        // }
        // for `type`, it expects the following type:
        //   {
        //     "address": [
        //         "symbol", // matching the key type
        //         "address" // matching the value type
        //     ],
        //     "amount": [
        //         "symbol", // matching the key type
        //         "i128" // matching the value type
        //     ],
        //     "request_type": [
        //         "symbol", // matching the key type
        //         "u32" // matching the value type
        //     ]
        // }
        return nativeToScVal(convertedValue, { type: typeHints });
      });

      scVals.push(...arrayScVals);
    } else {
      scVals.push(
        nativeToScVal(argValue.value, { type: argValue.type.toLowerCase() }),
      );
    }
  }

  return scVals;
};
