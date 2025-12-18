import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Notification,
  Text,
  Textarea,
} from "@stellar/design-system";
import type { JSONSchema7 } from "json-schema";
import { parse, stringify } from "lossless-json";
import { usePrevious } from "@/hooks/usePrevious";
import { useStore } from "@/store/useStore";

import { type DereferencedSchemaType } from "@/constants/jsonSchema";

import { dereferenceSchema } from "@/helpers/dereferenceSchema";
import { getTxnToSimulate } from "@/helpers/sorobanUtils";
import { getNetworkHeaders } from "@/helpers/getNetworkHeaders";
import { isEmptyObject } from "@/helpers/isEmptyObject";

import { useRpcPrepareTx } from "@/query/useRpcPrepareTx";

import { Box } from "@/components/layout/Box";
import { ErrorText } from "@/components/ErrorText";

import { AnyObject, SorobanInvokeValue } from "@/types/types";

import { JsonSchemaRenderer } from "./JsonSchemaRenderer";

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
    isSuccess: isPrepareTxSuccess,
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
    if (value.args[cur]?.length === 0) {
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

    const updatedTxnParams = {
      ...txnParams,
      memo: {}, // starting with p23, soroban tx no longer support memos
    };
    const { xdr, error } = getTxnToSimulate(
      value,
      updatedTxnParams,
      sorobanOperation,
      network.passphrase,
      dereferencedSchema.argOrder,
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
          <JsonSchemaRenderer
            name={name}
            schema={dereferencedSchema as JSONSchema7}
            onChange={onChange}
            parsedSorobanOperation={
              parse(
                sorobanOperation.params.invoke_contract,
              ) as SorobanInvokeValue
            }
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

        {isPrepareTxSuccess && txnParams.memo && (
          <Box
            gap="md"
            addlClassName="FieldNote FieldNote--note FieldNote--md"
            direction="row"
          >
            <Notification
              variant="warning"
              title="Note: Your memo was removed because Soroban transactions no longer support memos as of Protocol 23."
            ></Notification>
          </Box>
        )}

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

const renderTitle = (name: string, description: string) => {
  return (
    <>
      <Text size="lg" as="h2">
        {name}
      </Text>
      {description ? (
        <Textarea
          id={`json-schema-description-${name}`}
          fieldSize="md"
          disabled
          rows={description.length > 100 ? 7 : 1}
          value={description}
          spellCheck="false"
        >
          {description}
        </Textarea>
      ) : null}
    </>
  );
};
