"use client";

import React, { useEffect, useState } from "react";
import { Card, Notification, Text, Textarea } from "@stellar/design-system";
import type { JSONSchema7 } from "json-schema";
import { parse, stringify } from "lossless-json";
import { usePrevious } from "@/hooks/usePrevious";
import { useStore } from "@/store/useStore";
import { useBuildFlowStore } from "@/store/createTransactionFlowStore";

import { type DereferencedSchemaType } from "@/constants/jsonSchema";

import { dereferenceSchema } from "@/helpers/dereferenceSchema";
import { getTxnToSimulate } from "@/helpers/sorobanUtils";
import { isEmptyObject } from "@/helpers/isEmptyObject";

import { Box } from "@/components/layout/Box";
import { ErrorText } from "@/components/ErrorText";

import { AnyObject, SorobanInvokeValue } from "@/types/types";

import { JsonSchemaRenderer } from "./JsonSchemaRenderer";

// Used in Build Transaction's smart contract methods
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
  const { network } = useStore();
  const { build, setBuildSorobanXdr } = useBuildFlowStore();
  const { soroban, params: txnParams } = build;

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
    setSubmitTxError("");
  }, []);

  useEffect(() => {
    // @TODO we need to add validation for required forms
    if (!missingReqFields.length && !hasFormError) {
      const { xdr, error } = getTxnToSimulate(
        value,
        txnParams,
        soroban.operation,
        network.passphrase,
        dereferencedSchema.argOrder,
      );

      if (xdr && !error) {
        setBuildSorobanXdr(xdr);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, missingReqFields.length, hasFormError]);

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
                soroban.operation.params.invoke_contract,
              ) as SorobanInvokeValue
            }
            formError={formError}
            setFormError={setFormError}
          />
        </Box>

        {txnParams.memo && (
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
