import React, { useEffect, useState } from "react";
import { BASE_FEE, contract } from "@stellar/stellar-sdk";
import { Button, Card, Icon, Input, Text } from "@stellar/design-system";

import type { JSONSchema7 } from "json-schema";
import { parse } from "lossless-json";

import { TransactionBuildParams } from "@/store/createStore";
import { useStore } from "@/store/useStore";
import { AnyObject, SorobanInvokeValue, TxnOperation } from "@/types/types";
import { validate } from "@/validate";

import { dereferenceSchema } from "@/helpers/dereferenceSchema";
import { getScValsFromSpec } from "@/helpers/getScValsFromSpec";
import { buildTxWithSorobanData } from "@/helpers/sorobanUtils";
import { getNetworkHeaders } from "@/helpers/getNetworkHeaders";

import { DereferencedSchemaType } from "@/constants/jsonSchema";

import { useRpcPrepareTx } from "@/query/useRpcPrepareTx";

import { Box } from "@/components/layout/Box";
import { PositiveIntPicker } from "@/components/FormElements/PositiveIntPicker";
import { LabelHeading } from "@/components/LabelHeading";
import { ErrorText } from "@/components/ErrorText";
import { arrayItem } from "@/helpers/arrayItem";

export const JsonSchemaFormRenderer = ({
  name,
  schema,
  path = [],
  formData,
  onChange,
  index,
  requiredFields,
}: {
  name: string;
  schema: JSONSchema7;
  path?: (string | number)[];
  formData: AnyObject;
  onChange: (value: SorobanInvokeValue) => void;
  index?: number;
  requiredFields?: string[];
}) => {
  const { transaction } = useStore();
  const { build } = transaction;
  const { operation: sorobanOperation } = build.soroban;

  const [formError, setFormError] = useState<AnyObject>({});

  // parse stringified soroban operation
  const parsedSorobanOperation = parse(
    sorobanOperation.params.invoke_contract,
  ) as AnyObject;

  const invokeContractBaseProps = {
    contract_id: parsedSorobanOperation.contract_id,
    function_name: parsedSorobanOperation.function_name,
  };

  const schemaType = getDefType(schema);
  const label = path.length > 0 ? getNestedValueLabel(path.join(".")) : name;
  const labelWithSchemaType = `${label} (${schemaType})`;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    validateFn?: (value: string, required?: boolean) => string | false,
  ) => {
    /**
     * Example of how setNestedValueWithArr works:
     *
     * For a path like 'requests.1.request_type':
     *
     * obj = {
     *   requests: [
     *     { address: "", amount: "", request_type: "" },
     *     { address: "", amount: "", request_type: "" }
     *   ]
     * }
     *
     * path = "requests.1.request_type"
     * val = e.target.value
     *
     * This will update the value of requests[1].request_type
     */
    if (path.length > 0) {
      const result = setNestedValueWithArr(
        parsedSorobanOperation.args,
        path.join("."),
        e.target.value,
      );
      onChange({
        ...invokeContractBaseProps,
        args: {
          ...result,
        },
      });
    } else {
      // if path is not set, then set the value of the field directly
      onChange({
        ...invokeContractBaseProps,
        args: {
          ...parsedSorobanOperation.args,
          [name]: e.target.value,
        },
      });
    }

    // Validate the value
    const error = validateFn?.(e.target.value, requiredFields?.includes(label));
    const currentPath = path.length > 0 ? path.join(".") : name;

    setFormError({
      ...formError,
      [currentPath]: error ? error : "",
    });
  };

  if (schemaType === "object") {
    return (
      <Box gap="md">
        {Object.entries(schema.properties || {}).map(
          ([key, subSchema], index) => (
            <JsonSchemaFormRenderer
              name={key}
              key={`${key}-${index}`}
              schema={subSchema as JSONSchema7}
              onChange={onChange}
              formData={formData}
              requiredFields={schema.required}
            />
          ),
        )}
      </Box>
    );
  }

  if (schemaType === "array") {
    const storedItems = parsedSorobanOperation.args?.[name] || [];

    const addDefaultSchemaTemplate = () => {
      // template created based on the schema.properties
      const defaultTemplate = Object.keys(schema.properties || {}).reduce(
        (acc: Record<string, string | any[]>, key) => {
          if (getSchemaProperty(schema, key)?.type === "array") {
            acc[key] = [];
          } else {
            acc[key] = "";
          }

          return acc;
        },
        {},
      );

      const args = parsedSorobanOperation.args?.[name] || [];
      args.push(defaultTemplate);

      onChange({
        ...invokeContractBaseProps,
        args: {
          ...parsedSorobanOperation.args,
          [name]: args,
        },
      });
    };

    return (
      <Box gap="md" key={`${name}-${index}`}>
        <LabelHeading size="md" infoText={schema.description}>
          {name}
        </LabelHeading>

        <Box gap="md">
          {storedItems.length > 0 &&
            storedItems.map((args: any, index: number) => (
              <Box gap="md" key={`${name}-${index}`}>
                <Card>
                  <Box gap="md" key={`${name}-${index}`}>
                    <LabelHeading size="lg">
                      {name}-{index + 1}
                    </LabelHeading>

                    <Box gap="md">
                      <>
                        {Object.keys(args).map((arg) => {
                          const nestedPath = [name, index, arg].join(".");

                          return (
                            <JsonSchemaFormRenderer
                              name={name}
                              index={index}
                              key={nestedPath}
                              schema={schema.properties?.[arg] as JSONSchema7}
                              path={[...path, nestedPath]}
                              formData={args}
                              onChange={onChange}
                              requiredFields={schema.required}
                            />
                          );
                        })}
                      </>

                      <Box gap="sm" direction="row" align="center">
                        <Button
                          size="md"
                          variant="tertiary"
                          icon={<Icon.Trash01 />}
                          type="button"
                          onClick={() => {
                            const updatedList = arrayItem.delete(
                              getNestedValue(parsedSorobanOperation.args, name),
                              index,
                            );

                            onChange({
                              ...invokeContractBaseProps,
                              args: {
                                ...parsedSorobanOperation.args,
                                [name]: updatedList,
                              },
                            });
                          }}
                        ></Button>
                      </Box>
                    </Box>
                  </Box>
                </Card>
              </Box>
            ))}
        </Box>

        <Box gap="md" direction="row" align="center">
          <Button
            variant="secondary"
            size="md"
            onClick={addDefaultSchemaTemplate}
            type="button"
          >
            Add {name}
          </Button>
        </Box>
      </Box>
    );
  }

  switch (schemaType) {
    case "Address":
      return (
        <Input
          id={path.join(".")}
          key={path.join(".")}
          fieldSize="md"
          label={labelWithSchemaType}
          value={getNestedValue(parsedSorobanOperation.args, path.join("."))}
          error={path.length > 0 ? formError[path.join(".")] : formError[name]}
          onChange={(e) => {
            handleChange(e, validate.getPublicKeyError);
          }}
          infoText={schema.description || ""}
          leftElement={<Icon.User03 />}
          note={<>{schema.description}</>}
        />
      );
    case "U32":
      return (
        <PositiveIntPicker
          id={path.join(".")}
          key={path.join(".")}
          label={labelWithSchemaType}
          value={getNestedValue(parsedSorobanOperation.args, path.join("."))}
          error={path.length > 0 ? formError[path.join(".")] : formError[name]}
          onChange={(e) => {
            handleChange(e, validate.getU32Error);
          }}
        />
      );
    case "U64":
      return (
        <PositiveIntPicker
          id={path.join(".")}
          key={path.join(".")}
          label={labelWithSchemaType}
          value={getNestedValue(parsedSorobanOperation.args, path.join("."))}
          error={path.length > 0 ? formError[path.join(".")] : formError[name]}
          onChange={(e) => {
            handleChange(e, validate.getU64Error);
          }}
        />
      );
    case "U128":
      return (
        <PositiveIntPicker
          id={path.join(".")}
          key={path.join(".")}
          label={labelWithSchemaType}
          value={getNestedValue(parsedSorobanOperation.args, path.join("."))}
          error={path.length > 0 ? formError[path.join(".")] : formError[name]}
          onChange={(e) => {
            handleChange(e, validate.getU128Error);
          }}
        />
      );
    case "U256":
      return (
        <PositiveIntPicker
          id={path.join(".")}
          key={path.join(".")}
          label={labelWithSchemaType}
          value={getNestedValue(parsedSorobanOperation.args, path.join("."))}
          error={path.length > 0 ? formError[path.join(".")] : formError[name]}
          onChange={(e) => {
            handleChange(e, validate.getU256Error);
          }}
        />
      );
    case "I32":
      return (
        <Input
          id={path.join(".")}
          key={path.join(".")}
          fieldSize="md"
          label={labelWithSchemaType}
          value={getNestedValue(parsedSorobanOperation.args, path.join("."))}
          error={path.length > 0 ? formError[path.join(".")] : formError[name]}
          onChange={(e) => {
            handleChange(e, validate.getI32Error);
          }}
        />
      );
    case "I64":
      return (
        <Input
          id={path.join(".")}
          key={path.join(".")}
          fieldSize="md"
          label={labelWithSchemaType}
          value={getNestedValue(parsedSorobanOperation.args, path.join("."))}
          error={path.length > 0 ? formError[path.join(".")] : formError[name]}
          onChange={(e) => {
            handleChange(e, validate.getI64Error);
          }}
        />
      );
    case "I128":
      return (
        <Input
          id={path.join(".")}
          key={path.join(".")}
          fieldSize="md"
          label={labelWithSchemaType}
          value={getNestedValue(parsedSorobanOperation.args, path.join("."))}
          error={path.length > 0 ? formError[path.join(".")] : formError[name]}
          onChange={(e) => {
            handleChange(e, validate.getI128Error);
          }}
        />
      );
    case "I256":
      return (
        <Input
          id={path.join(".")}
          key={path.join(".")}
          fieldSize="md"
          label={labelWithSchemaType}
          value={getNestedValue(parsedSorobanOperation.args, path.join("."))}
          error={path.length > 0 ? formError[path.join(".")] : formError[name]}
          onChange={(e) => {
            handleChange(e, validate.getI256Error);
          }}
        />
      );
    case "ScString":
    case "ScSymbol":
      return (
        <Input
          id={path.join(".")}
          key={path.join(".")}
          fieldSize="md"
          label={label}
          value={getNestedValue(parsedSorobanOperation.args, path.join("."))}
          error={""}
          onChange={(e) => {
            // @TODO validate the value via length
            handleChange(e);
          }}
          note={<>{schema.description}</>}
        />
      );
    case "DataUrl":
      return (
        <Input
          id={path.join(".")}
          key={path.join(".")}
          fieldSize="md"
          label={label}
          value={getNestedValue(parsedSorobanOperation.args, path.join("."))}
          error={path.length > 0 ? formError[path.join(".")] : formError[name]}
          onChange={(e) => {
            handleChange(e, validate.getDataUrlError);
          }}
        />
      );
    default:
      return null;
  }
};

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

const getDefType = (prop: any) => {
  if (!prop) return undefined;

  if (prop.$ref) {
    return prop.$ref.replace("#/definitions/", "");
  }
  return prop.type;
};

const isSchemaObject = (schema: any): schema is JSONSchema7 => {
  return schema && typeof schema === "object" && !Array.isArray(schema);
};

const getSchemaProperty = (
  schema: any,
  key: string,
): JSONSchema7 | undefined => {
  if (!isSchemaObject(schema) || !schema.properties) return undefined;
  const prop = schema.properties[key];
  return isSchemaObject(prop) ? prop : undefined;
};

function parsePath(path: string): (string | number)[] {
  return path.split(".").map((key) => {
    const parsed = Number(key);
    return isNaN(parsed) ? key : parsed;
  });
}

function setNestedValueWithArr(
  obj: AnyObject,
  path: string,
  val: any,
): AnyObject {
  const keys = parsePath(path);

  function helper(current: any, idx: number): any {
    const key = keys[idx];

    // If it's the last key, set the value
    if (idx === keys.length - 1) {
      if (Array.isArray(current)) {
        const newArr = [...current];
        newArr[key as number] = val;
        return newArr;
      }
      return { ...current, [key]: val };
    }

    const nextKey = keys[idx + 1];

    // If current is an array
    if (Array.isArray(current)) {
      const index = key as number;
      const nextVal = helper(
        current[index] ?? (typeof nextKey === "number" ? [] : {}),
        idx + 1,
      );
      const newArr = [...current];
      newArr[index] = nextVal;
      return newArr;
    }

    // Otherwise, treat as object
    return {
      ...current,
      [key]: helper(
        current?.[key] ?? (typeof nextKey === "number" ? [] : {}),
        idx + 1,
      ),
    };
  }

  return helper(obj, 0);
}

const getNestedValue = (obj: AnyObject, path: string): any => {
  const keys = parsePath(path);

  return keys.reduce((acc, key) => {
    if (acc === undefined || acc === null) return undefined;
    return acc[key];
  }, obj);
};

const getNestedValueLabel = (path: string): string => {
  const keys = parsePath(path);
  return keys[keys.length - 1].toString();
};
