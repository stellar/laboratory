import React, { useEffect, useState } from "react";
import { BASE_FEE, contract } from "@stellar/stellar-sdk";
import { Button, Card, Icon, Input, Text } from "@stellar/design-system";

import type { JSONSchema7, JSONSchema7Definition } from "json-schema";

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
  // index,
}: {
  name: string;
  schema: JSONSchema7;
  path?: (string | number)[];
  formData: AnyObject;
  // index?: number;
}) => {
  const { transaction } = useStore();
  const { updateSorobanBuildOperationInvokeValue } = transaction;

  const schemaType = getDefType(schema);

  if (schema.type === "object") {
    return (
      <Box gap="md">
        {Object.entries(schema.properties || {}).map(
          ([key, subSchema], index) => {
            return (
              <JsonSchemaFormRenderer
                name={key}
                key={index}
                schema={subSchema as JSONSchema7}
                path={[...path, key]}
                formData={formData}
              />
            );
          },
        )}
      </Box>
    );
  }

  if (schema.type === "array") {
    const items = formData;
    console.log("schema: ", schema);
    console.log("items: ", items);

    const defaultEmptyObject = Object.keys(schema.properties || {}).reduce(
      (acc: Record<string, string>, key) => {
        acc[key] = "";

        return acc;
      },
      {},
    );

    return (
      <Box gap="md">
        <Card>
          <Box gap="md">
            <LabelHeading size="lg" infoText={schema.description}>
              {name}
            </LabelHeading>
            {items.length > 0 &&
              items.map((item: any, index: number) => (
                <JsonSchemaFormRenderer
                  name={name}
                  key={index}
                  schema={schema.items as JSONSchema7}
                  path={[...path, index]}
                  formData={item}
                />
              ))}
          </Box>
        </Card>

        <Card>
          <Button
            variant="secondary"
            size="md"
            onClick={() => {
              console.log("[JsonSchemaFormRenderer] items: ", items);
              console.log(
                "[JsonSchemaFormRenderer] [...path, items.length]: ",
                [...path, items.length],
              );

              updateSorobanBuildOperationInvokeValue(
                [...path, items.length],
                {},
              );
            }}
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
          value={formData?.[path[path.length - 1]] || ""}
          // error={formError[path.join(".")] || ""}
          // required={requiredFields.includes(path.join("."))}
          onChange={(e) => {
            updateSorobanBuildOperationInvokeValue(path, e.target.value);

            // validate the value
            // const error = validate.getPublicKeyError(e.target.value);
            // setFormError({
            //   ...formError,
            //   [label]: error,
            // });
          }}
          infoText={schema.description || ""}
          leftElement={<Icon.User03 />}
          note={<>{schema.description}</>}
        />
      );
  }
  //   case "ScString":
  //     return (
  //       <Input
  //         id={key}
  //         key={label}
  //         fieldSize="md"
  //         label={`${label} (${defType})`}
  //         value={value.args[label] || ""}
  //         error={""}
  //         required={requiredFields.includes(key)}
  //         onChange={(e) => {
  //           handleChange(label, e.target.value);
  //         }}
  //         note={<>{prop.description}</>}
  //       />
  //     );
  //   case "ScSymbol":
  //     return (
  //       <Input
  //         id={key}
  //         key={label}
  //         fieldSize="md"
  //         label={`${label} (${defType})`}
  //         value={value.args[label] || ""}
  //         error={""}
  //         required={requiredFields.includes(key)}
  //         onChange={(e) => {
  //           handleChange(label, e.target.value);

  //           // @TODO add an error handling
  //         }}
  //         note={<>{prop.description}</>}
  //       />
  //     );
  //   case "DataUrl":
  //     return (
  //       <Input
  //         id={key}
  //         key={label}
  //         fieldSize="md"
  //         label={`${label} (${defType})`}
  //         value={value.args[label] || ""}
  //         error={formError[label] || ""}
  //         required={requiredFields.includes(key)}
  //         onChange={(e) => {
  //           handleChange(label, e.target.value);

  //           // validate the value
  //           const error = Boolean(validate.getDataUrlError(e.target.value));
  //           setFormError({
  //             ...formError,
  //             [label]: error,
  //           });
  //         }}
  //       />
  //     );
  //   case "U32":
  //     return (
  //       <PositiveIntPicker
  //         id={key}
  //         key={label}
  //         label={`${label} (${defType})`}
  //         value={value.args[label] || ""}
  //         error={formError[label] || ""}
  //         onChange={(e) => {
  //           // validate the value
  //           handleChange(label, e.target.value);

  //           const error = validate.getU32Error(e.target.value);
  //           setFormError({
  //             ...formError,
  //             [label]: error,
  //           });
  //         }}
  //       />
  //     );
  //   case "U64":
  //     return (
  //       <PositiveIntPicker
  //         id={key}
  //         key={label}
  //         label={`${label} (${defType})`}
  //         value={removeLeadingZeroes(value.args[label] || "")}
  //         error={formError[label] || ""}
  //         onChange={(e) => {
  //           handleChange(label, removeLeadingZeroes(e.target.value));

  //           // validate the value
  //           const error = validate.getU64Error(e.target.value);
  //           setFormError({
  //             ...formError,
  //             [label]: error,
  //           });
  //         }}
  //       />
  //     );
  //   case "U128":
  //     return (
  //       <PositiveIntPicker
  //         id={key}
  //         key={label}
  //         label={`${label} (${defType})`}
  //         value={removeLeadingZeroes(value.args[label] || "")}
  //         error={formError[label] || ""}
  //         onChange={(e) => {
  //           handleChange(label, removeLeadingZeroes(e.target.value));

  //           // validate the value
  //           const error = validate.getU128Error(e.target.value);
  //           setFormError({
  //             ...formError,
  //             [label]: error,
  //           });
  //         }}
  //       />
  //     );
  //   case "U256":
  //     return (
  //       <PositiveIntPicker
  //         id={key}
  //         key={label}
  //         label={`${label} (${defType})`}
  //         value={value.args[label] || ""}
  //         error={formError[label] || ""}
  //         onChange={(e) => {
  //           handleChange(label, e.target.value);

  //           // validate the value
  //           const error = validate.getU256Error(e.target.value);
  //           setFormError({
  //             ...formError,
  //             [label]: error,
  //           });
  //         }}
  //       />
  //     );

  //   case "I32":
  //     return (
  //       <Input
  //         id={key}
  //         key={label}
  //         fieldSize="md"
  //         label={`${label} (${defType})`}
  //         value={value.args[label] || ""}
  //         error={formError[label] || ""}
  //         required={requiredFields.includes(key)}
  //         onChange={(e) => {
  //           handleChange(label, e.target.value);

  //           // validate the value
  //           const error = validate.getI32Error(e.target.value);
  //           setFormError({
  //             ...formError,
  //             [label]: error,
  //           });
  //         }}
  //       />
  //     );
  //   case "I64":
  //     return (
  //       <Input
  //         id={key}
  //         key={label}
  //         fieldSize="md"
  //         label={`${label} (${defType})`}
  //         value={value.args[label] || ""}
  //         error={formError[label] || ""}
  //         required={requiredFields.includes(key)}
  //         onChange={(e) => {
  //           handleChange(label, e.target.value);

  //           // validate the value
  //           const error = validate.getI64Error(e.target.value);
  //           setFormError({
  //             ...formError,
  //             [label]: error,
  //           });
  //         }}
  //       />
  //     );
  //   case "I128":
  //     return (
  //       <Input
  //         id={key}
  //         key={label}
  //         fieldSize="md"
  //         label={`${label} (${defType})`}
  //         value={value.args[label] || ""}
  //         error={formError[label] || ""}
  //         required={requiredFields.includes(key)}
  //         onChange={(e) => {
  //           handleChange(label, e.target.value);

  //           // validate the value
  //           const error = validate.getI128Error(e.target.value);
  //           setFormError({
  //             ...formError,
  //             [label]: error,
  //           });
  //         }}
  //       />
  //     );
  //   case "I256":
  //     return (
  //       <Input
  //         id={key}
  //         key={label}
  //         fieldSize="md"
  //         label={`${label} (${defType})`}
  //         value={value.args[label] || ""}
  //         error={formError[label] || ""}
  //         required={requiredFields.includes(key)}
  //         onChange={(e) => {
  //           handleChange(label, e.target.value);

  //           // validate the value
  //           const error = validate.getI256Error(e.target.value);
  //           setFormError({
  //             ...formError,
  //             [label]: error,
  //           });
  //         }}
  //       />
  //     );
  //   // prop.type
  //   case "array":
  //     console.log("meow");
  //     return (
  //       <Box gap="md" key={label}>
  //         <Card>
  //           <Box gap="md">
  //             <LabelHeading size="lg" infoText={prop.description}>
  //               {label}
  //             </LabelHeading>

  //             <>
  //               {prop.description ? (
  //                 <Text size="sm" as="h3">
  //                   {prop.description}
  //                 </Text>
  //               ) : null}
  //             </>

  //             <ArrayTypePicker
  //               valueKey={key}
  //               prop={prop}
  //               value={value}
  //               onChange={handleChange}
  //               renderComponent={renderComponent}
  //             />
  //           </Box>
  //         </Card>
  //       </Box>
  //     );
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
  // handleSorobanOperationParamChange
  // const updatedOperation = {
  //   ...sorobanOperation,
  //   operation_type: opType,
  //   params: sanitizeObject({
  //     ...sorobanOperation?.params,
  //     [opParam]: opValue,
  //   }),
  // };
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

  // console.log("funcSchema:", funcSchema);

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

  const handleChange = (key: string, newVal: any) => {
    if (soroban.xdr) {
      updateSorobanBuildXdr("");
    }

    // reset
    // onChange({ ...value, args: {} });

    // only updates the opValue from value prop
    // for flat structure

    onChange({
      ...value,
      args: {
        ...value.args,
        [key]: newVal,
      },
    });
  };

  // key: argument label
  // prop: argument object
  //   // value: argument value that includes the key
  //   // type: argument type
  //   // description: argument description
  //   // pattern
  //   // min-length; max-length
  const renderComponent = (
    key: string,
    prop: any,
    handleChange: (key: string, newVal: any) => void,
    index?: number,
  ) => {
    const getDefType = (prop: any) => {
      if (prop.$ref) {
        return prop.$ref.replace("#/definitions/", "");
      }
      return prop.type;
    };

    const defType = getDefType(prop);

    // useful for array type component
    // it will output address, address-1, address-2
    const label = index !== undefined ? `${key}-${index}` : key;

    switch (defType) {
      case "Address":
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
              const error = validate.getPublicKeyError(e.target.value);
              setFormError({
                ...formError,
                [label]: error,
              });
            }}
            infoText={prop.description || ""}
            leftElement={<Icon.User03 />}
            note={<>{prop.description}</>}
          />
        );
      case "ScString":
        return (
          <Input
            id={key}
            key={label}
            fieldSize="md"
            label={`${label} (${defType})`}
            value={value.args[label] || ""}
            error={""}
            required={requiredFields.includes(key)}
            onChange={(e) => {
              handleChange(label, e.target.value);
            }}
            note={<>{prop.description}</>}
          />
        );
      case "ScSymbol":
        return (
          <Input
            id={key}
            key={label}
            fieldSize="md"
            label={`${label} (${defType})`}
            value={value.args[label] || ""}
            error={""}
            required={requiredFields.includes(key)}
            onChange={(e) => {
              handleChange(label, e.target.value);

              // @TODO add an error handling
            }}
            note={<>{prop.description}</>}
          />
        );
      case "DataUrl":
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
              const error = Boolean(validate.getDataUrlError(e.target.value));
              setFormError({
                ...formError,
                [label]: error,
              });
            }}
          />
        );
      case "U32":
        return (
          <PositiveIntPicker
            id={key}
            key={label}
            label={`${label} (${defType})`}
            value={value.args[label] || ""}
            error={formError[label] || ""}
            onChange={(e) => {
              // validate the value
              handleChange(label, e.target.value);

              const error = validate.getU32Error(e.target.value);
              setFormError({
                ...formError,
                [label]: error,
              });
            }}
          />
        );
      case "U64":
        return (
          <PositiveIntPicker
            id={key}
            key={label}
            label={`${label} (${defType})`}
            value={removeLeadingZeroes(value.args[label] || "")}
            error={formError[label] || ""}
            onChange={(e) => {
              handleChange(label, removeLeadingZeroes(e.target.value));

              // validate the value
              const error = validate.getU64Error(e.target.value);
              setFormError({
                ...formError,
                [label]: error,
              });
            }}
          />
        );
      case "U128":
        return (
          <PositiveIntPicker
            id={key}
            key={label}
            label={`${label} (${defType})`}
            value={removeLeadingZeroes(value.args[label] || "")}
            error={formError[label] || ""}
            onChange={(e) => {
              handleChange(label, removeLeadingZeroes(e.target.value));

              // validate the value
              const error = validate.getU128Error(e.target.value);
              setFormError({
                ...formError,
                [label]: error,
              });
            }}
          />
        );
      case "U256":
        return (
          <PositiveIntPicker
            id={key}
            key={label}
            label={`${label} (${defType})`}
            value={value.args[label] || ""}
            error={formError[label] || ""}
            onChange={(e) => {
              handleChange(label, e.target.value);

              // validate the value
              const error = validate.getU256Error(e.target.value);
              setFormError({
                ...formError,
                [label]: error,
              });
            }}
          />
        );

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
      case "I64":
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
              const error = validate.getI64Error(e.target.value);
              setFormError({
                ...formError,
                [label]: error,
              });
            }}
          />
        );
      case "I128":
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
              const error = validate.getI128Error(e.target.value);
              setFormError({
                ...formError,
                [label]: error,
              });
            }}
          />
        );
      case "I256":
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
              const error = validate.getI256Error(e.target.value);
              setFormError({
                ...formError,
                [label]: error,
              });
            }}
          />
        );
      // prop.type
      case "array":
        return (
          <Box gap="md" key={label}>
            <Card>
              <Box gap="md">
                <LabelHeading size="lg" infoText={prop.description}>
                  {label}
                </LabelHeading>

                <>
                  {prop.description ? (
                    <Text size="sm" as="h3">
                      {prop.description}
                    </Text>
                  ) : null}
                </>

                {/* <ArrayTypePicker
                  valueKey={key}
                  prop={prop}
                  value={value}
                  onChange={handleChange}
                  renderComponent={renderComponent}
                /> */}
              </Box>
            </Card>
          </Box>
        );

      default:
        return <React.Fragment />;
    }
  };

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

    console.log("[JsonSchemaForm] schema.properties: ", schema.properties);

    return (
      <Box gap="md">
        {renderTitle(name, description)}

        <Box gap="md" key={name}>
          <JsonSchemaFormRenderer
            name={name}
            schema={dereferencedSchema as JSONSchema7}
            formData={value.args}
          />
          {/* {Object.entries(schema.properties).map(([key, subSchema], index) => {
            return (
              <JsonSchemaFormRenderer
                name={key}
                key={index}
                schema={subSchema as JSONSchema7}
                // path={[...path, key]}
                formData={value.args}
              />
            );
          })} */}

          {/* {fields.map(([key, prop]) => {
            return <>{renderComponent(key, prop, handleChange)}</>;
          })} */}
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
  if (prop.$ref) {
    return prop.$ref.replace("#/definitions/", "");
  }
  return prop.type;
};
