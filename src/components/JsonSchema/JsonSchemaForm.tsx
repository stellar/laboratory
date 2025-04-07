import React, { useEffect, useState } from "react";
import { BASE_FEE, contract } from "@stellar/stellar-sdk";
import { Button, Card, Icon, Input, Text } from "@stellar/design-system";

import type { JSONSchema7, JSONSchema7Definition } from "json-schema";
import { parse, stringify } from "lossless-json";

import { TransactionBuildParams } from "@/store/createStore";
import { useStore } from "@/store/useStore";
import { AnyObject, SorobanInvokeValue, TxnOperation } from "@/types/types";
import { validate } from "@/validate";

import { dereferenceSchema } from "@/helpers/dereferenceSchema";
import { removeLeadingZeroes } from "@/helpers/removeLeadingZeroes";
import { getScValsFromSpec } from "@/helpers/getScValsFromSpec";
import { buildTxWithSorobanData } from "@/helpers/sorobanUtils";
import { getNetworkHeaders } from "@/helpers/getNetworkHeaders";

import { DereferencedSchemaType } from "@/constants/jsonSchema";

import { useRpcPrepareTx } from "@/query/useRpcPrepareTx";

import { Box } from "@/components/layout/Box";
import { PositiveIntPicker } from "@/components/FormElements/PositiveIntPicker";
import { LabelHeading } from "@/components/LabelHeading";
import { ErrorText } from "@/components/ErrorText";
import { ArrayTypePicker } from "@/components/JsonSchema/ArrayTypePicker";

export const JsonSchemaFormRenderer = ({
  name,
  schema,
  path = [],
  formData,
  onChange,
  index,
  // index,
}: {
  name: string;
  schema: JSONSchema7;
  path?: (string | number)[];
  formData: AnyObject;
  onChange: (value: SorobanInvokeValue) => void;
  index?: number;
}) => {
  const { transaction } = useStore();
  const { build } = transaction;

  const { operation: sorobanOperation } = build.soroban;

  const parsedSorobanOperation = parse(
    sorobanOperation.params.invoke_contract,
  ) as AnyObject;

  const invokeContractBaseProps = {
    contract_id: parsedSorobanOperation.contract_id,
    function_name: parsedSorobanOperation.function_name,
  };

  const schemaType = getDefType(schema);

  if (schemaType === "object") {
    return (
      <Box gap="md">
        {Object.entries(schema.properties || {}).map(
          ([key, subSchema], index) => {
            return (
              <JsonSchemaFormRenderer
                name={key}
                key={index}
                schema={subSchema as JSONSchema7}
                onChange={onChange}
                // path={[...path, key]}
                formData={formData}
              />
            );
          },
        )}
      </Box>
    );
  }

  if (schemaType === "array") {
    console.log('schemaType === "array"');
    console.log("parsedSorobanOperation: ", parsedSorobanOperation);
    console.log("path: ", path);
    const storedItems = parsedSorobanOperation.args?.[name] || [];

    const addDefaultSchemaTemplate = () => {
      console.log("storedItems: ", storedItems);

      // template created based on the schema.properties
      const defaultTemplate = Object.keys(schema.properties || {}).reduce(
        (acc: Record<string, string | any[]>, key) => {
          if (schema?.properties?.[key]?.type === "array") {
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
      <Box gap="md" key={index}>
        <Card>
          <Box gap="md">
            <LabelHeading size="lg" infoText={schema.description}>
              {name}
            </LabelHeading>
            {storedItems.length > 0 &&
              storedItems.map((args: any, index: number) => {
                // item:
                // {
                //     "address": "",
                //     "amount": "",
                //     "request_type": ""
                // }
                console.log("args: ", args);

                return (
                  <Box gap="md" key={index}>
                    <Card>
                      <LabelHeading size="lg" infoText={schema.description}>
                        {name}-{index}
                      </LabelHeading>

                      <Box gap="md">
                        {Object.keys(args).map((arg) => {
                          const nested = [];
                          nested.push(name);
                          nested.push(index);
                          nested.push(arg);

                          return (
                            <JsonSchemaFormRenderer
                              name={name}
                              index={index}
                              key={nested.join(".")}
                              schema={schema.properties?.[arg] as JSONSchema7}
                              path={[...path, nested.join(".")]}
                              formData={args}
                              onChange={onChange}
                            />
                          );
                        })}
                      </Box>
                    </Card>
                  </Box>
                );
              })}
          </Box>
        </Card>

        <Card>
          <Button
            variant="secondary"
            size="md"
            onClick={addDefaultSchemaTemplate}
            type="button"
          >
            Add {name}
          </Button>
        </Card>
      </Box>
    );
  }

  switch (schemaType) {
    case "Address":
      return (
        <Input
          id={path.join(".")}
          // key={path.join(".")}
          fieldSize="md"
          label={`${name} (${schemaType})`}
          value={formData?.[name] || ""}
          // error={formError[path.join(".")] || ""}
          // required={requiredFields.includes(path.join("."))}
          onChange={(e) => {
            // updatedFormData[name] = e.target.value;
            // reset the args
            // onChange({
            //   ...invokeContractBaseProps,
            //   args: {},
            // });

            console.log("[function] path:  ", path);

            if (path.length > 0) {
              const result = setNestedValueWithArr(
                parsedSorobanOperation.args,
                path.join("."),
                e.target.value,
              );

              console.log("result: ", result);

              // onChange({
              //   ...invokeContractBaseProps,
              //   args: [...result],
              // });
            }

            //   console.log("result: ", result);
            // } else {
            //   onChange({
            //     ...invokeContractBaseProps,
            //     args: {
            //       ...parsedSorobanOperation.args,
            //       [name]: e.target.value,
            //     },
            //   });
            // }
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
          label={`${name} (${schemaType})`}
          value={parsedSorobanOperation.args?.[name] || ""}
          // error={formError[label] || ""}
          onChange={(e) => {
            // validate the value
          }}
        />
      );
    case "U64":
      return (
        <PositiveIntPicker
          id={path.join(".")}
          key={path.join(".")}
          label={`${name} (${schemaType})`}
          value={removeLeadingZeroes(parsedSorobanOperation.args?.[name] || "")}
          // error={formError[label] || ""}
          onChange={(e) => {}}
        />
      );
    // case "U128":
    //   return (
    //     <PositiveIntPicker
    //       id={key}
    //       key={label}
    //       label={`${label} (${defType})`}
    //       value={removeLeadingZeroes(value.args[label] || "")}
    //       error={formError[label] || ""}
    //       onChange={(e) => {
    //         handleChange(label, removeLeadingZeroes(e.target.value));

    //         // validate the value
    //         const error = validate.getU128Error(e.target.value);
    //         setFormError({
    //           ...formError,
    //           [label]: error,
    //         });
    //       }}
    //     />
    //   );
    // case "U256":
    //   return (
    //     <PositiveIntPicker
    //       id={key}
    //       key={label}
    //       label={`${label} (${defType})`}
    //       value={value.args[label] || ""}
    //       error={formError[label] || ""}
    //       onChange={(e) => {
    //         handleChange(label, e.target.value);

    //         // validate the value
    //         const error = validate.getU256Error(e.target.value);
    //         setFormError({
    //           ...formError,
    //           [label]: error,
    //         });
    //       }}
    //     />
    //   );
    case "I32":
      return (
        <Input
          id={key}
          key={label}
          fieldSize="md"
          label={`${label} (${defType})`}
          value={value.args[label] || ""}
          error={formError[label] || ""}
          required={requiredFields.includes(key)}
          onChange={(e) => {
            handleChange(label, e.target.value);

            // validate the value
            const error = validate.getI32Error(e.target.value);
            setFormError({
              ...formError,
              [label]: error,
            });
          }}
        />
      );
    // case "I64":
    //   return (
    //     <Input
    //       id={key}
    //       key={label}
    //       fieldSize="md"
    //       label={`${label} (${defType})`}
    //       value={value.args[label] || ""}
    //       error={formError[label] || ""}
    //       required={requiredFields.includes(key)}
    //       onChange={(e) => {
    //         handleChange(label, e.target.value);

    //         // validate the value
    //         const error = validate.getI64Error(e.target.value);
    //         setFormError({
    //           ...formError,
    //           [label]: error,
    //         });
    //       }}
    //     />
    //   );
    case "I128":
      return (
        <Input
          id={path.join(".")}
          key={path.join(".")}
          fieldSize="md"
          label={`${name} (${schemaType})`}
          value={parsedSorobanOperation.args?.[name] || ""}
          // error={formError[label] || ""}
          // required={requiredFields.includes(key)}
          onChange={(e) => {}}
        />
      );
    // case "I256":
    //   return (
    //     <Input
    //       id={key}
    //       key={label}
    //       fieldSize="md"
    //       label={`${label} (${defType})`}
    //       value={value.args[label] || ""}
    //       error={formError[label] || ""}
    //       required={requiredFields.includes(key)}
    //       onChange={(e) => {
    //         handleChange(label, e.target.value);

    //         // validate the value
    //         const error = validate.getI256Error(e.target.value);
    //         setFormError({
    //           ...formError,
    //           [label]: error,
    //         });
    //       }}
    //     />
    //   );
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

  const requiredFields = dereferencedSchema.required;
  const missingFields =
    requiredFields && requiredFields.filter((field) => !value.args[field]);

  const [formError, setFormError] = useState<AnyObject>({});

  useEffect(() => {
    // onChange({ ...value, args: {} });

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
      // @TODO write an error
    }
  };

  const render = (schema: DereferencedSchemaType): React.ReactElement => {
    const fields = schema.properties ? Object.entries(schema.properties) : [];
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
            disabled={
              (missingFields && missingFields.length > 0) ||
              Object.values(formError).filter(Boolean).length > 0
            }
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
    {description ? (
      <Text size="sm" as="h3">
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
) => {
  const scVals = getScValsFromSpec(value.function_name, spec, value);

  try {
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
  } catch (e) {
    console.log("[JsonSchema] e :", e);
  }

  return undefined;
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

function parsePath(path: string) {
  return path
    .replace(/\[(\d+)\]/g, ".$1")
    .split(".")
    .map((key) => (/^\d+$/.test(key) ? Number(key) : key));
}

function setNestedValueWithArr(obj: AnyObject, path: string, val: any) {
  const keys = parsePath(path);

  console.log("[setNestedValueWithArr] obj: ", obj);
  console.log("[setNestedValueWithArr] keys: ", keys);

  function helper(current: AnyObject, idx: number): AnyObject {
    const key = keys[idx];

    console.log("[helper] beginning - current: ", current);
    console.log("[helper] beginning - key: ", key);

    // once the index reaches the last
    if (idx === keys.length - 1) {
      // if it is an array
      if (typeof key === "number" && Array.isArray(current)) {
        console.log("[helper] final - current[key]: ", current[key]);

        return { ...current, [key]: [...current[key], val] };
      } else {
        // update its value
        console.log("[helper] final - val: ", val);
        console.log("[helper] final - current: ", current);
        return { ...current, [key]: val };
      }
    }

    const nextKey = keys[idx + 1];
    // console.log("[helper] nextKey === 'number': ", nextKey);

    // let next;

    // // is an array
    if (typeof nextKey === "number") {
      console.log("[next one is array] current[key]: ", current[key]);
      console.log(
        "[next one is array] current[key][nextKey]: ",
        current[key][nextKey],
      );

      return {
        ...current,
        [key]: helper(current[key], idx + 1),
      };

      //   console.log("[helper] checking next - current[key]: ", current[key]);
      //   console.log(
      //     "[helper] checking next - current[key][nextKey]: ",
      //     current[key][nextKey],
      //   );
    }

    //   next = [...current[key]];
    // } else {
    //   next = current?.[nextKey] ?? {};
    // }

    // console.log("[end] current: ", current);
    const next = current[key] ?? [];
    console.log("[end] current: ", current);
    console.log("[end] next: ", next);
    console.log("[end] key: ", key);
    return {
      ...current,
      [key]: helper(next, idx + 1),
    };
  }
  // starts from the index 0
  return helper(obj, 0);
}
