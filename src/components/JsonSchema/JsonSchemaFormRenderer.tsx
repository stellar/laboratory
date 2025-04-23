import React from "react";
import { Button, Card, Icon, Input, Text } from "@stellar/design-system";
import type { JSONSchema7 } from "json-schema";
import { parse } from "lossless-json";

import { useStore } from "@/store/useStore";
import { validate } from "@/validate";

import { arrayItem } from "@/helpers/arrayItem";

import { Box } from "@/components/layout/Box";
import { PositiveIntPicker } from "@/components/FormElements/PositiveIntPicker";
import { LabelHeading } from "@/components/LabelHeading";

import { AnyObject, SorobanInvokeValue } from "@/types/types";

export const JsonSchemaFormRenderer = ({
  name,
  schema,
  path = [],
  formData,
  onChange,
  index,
  requiredFields,
  formError,
  setFormError,
}: {
  name: string;
  schema: JSONSchema7;
  path?: (string | number)[];
  formData: AnyObject;
  onChange: (value: SorobanInvokeValue) => void;
  index?: number;
  requiredFields?: string[];
  formError: AnyObject;
  setFormError: (formError: AnyObject) => void;
}) => {
  const { transaction } = useStore();
  const { build } = transaction;
  const { operation: sorobanOperation } = build.soroban;

  // parse stringified soroban operation
  const parsedSorobanOperation = parse(
    sorobanOperation.params.invoke_contract,
  ) as AnyObject;

  const schemaType = getDefType(schema);
  const label = path.length > 0 ? getNestedValueLabel(path.join(".")) : name;
  const labelWithSchemaType = `${label} (${schemaType})`;

  const invokeContractBaseProps = {
    contract_id: parsedSorobanOperation.contract_id,
    function_name: parsedSorobanOperation.function_name,
  };
  const sharedProps = {
    id: path.join("."),
    label: labelWithSchemaType,
    value: getNestedValue(parsedSorobanOperation.args, path.join("."))?.value,
    error: path.length > 0 ? formError[path.join(".")] : formError[name],
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    schemaType: string,
    validateFn?:
      | ((value: string, required?: boolean) => string | false)
      | ((value: string, required?: boolean) => string | false)[],
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
        { value: e.target.value, type: schemaType },
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
          [name]: { value: e.target.value, type: schemaType },
        },
      });
    }

    // Validate the value
    let error;

    if (Array.isArray(validateFn)) {
      const errors = validateFn.map((fn) =>
        fn(e.target.value, requiredFields?.includes(label)),
      );
      const hasNoError = hasAnyValidationPassed(errors);

      // Address type validates both public key and contract address
      if (schemaType === "Address") {
        error = hasNoError ? "" : "Invalid Public key or contract ID";
        // unlikely there'll be an array of validation other than Address type
        // but just in case
      } else {
        error = hasNoError ? "" : errors.join(" ");
      }
    } else {
      error = validateFn?.(e.target.value, requiredFields?.includes(label));
    }

    const currentPath = path.length > 0 ? path.join(".") : name;

    setFormError({
      ...formError,
      [currentPath]: error ? error : "",
    });
  };

  if (schemaType === null || schemaType === undefined) {
    return (
      <Box gap="md">
        <Box gap="md">
          <div>No schema found</div>
        </Box>
      </Box>
    );
  }

  if (schemaType === "object") {
    return (
      <Box gap="md">
        {Object.entries(schema.properties || {}).map(
          ([key, subSchema], index) => {
            const subSchemaObj = getSchemaProperty(schema, key);

            if (subSchemaObj?.type === "object") {
              return (
                <>
                  <LabelHeading size="md" infoText={schema.description}>
                    {key}
                  </LabelHeading>
                  {subSchemaObj?.description ? (
                    <Text as="div" size="xs">
                      {subSchemaObj.description}
                    </Text>
                  ) : null}

                  <Box gap="md">
                    <Card>
                      <JsonSchemaFormRenderer
                        name={key}
                        key={`${key}-${index}`}
                        schema={subSchema as JSONSchema7}
                        onChange={onChange}
                        formData={formData}
                        requiredFields={schema.required}
                        setFormError={setFormError}
                        formError={formError}
                      />
                    </Card>
                  </Box>
                </>
              );
            }

            return (
              <JsonSchemaFormRenderer
                name={key}
                key={`${key}-${index}`}
                schema={subSchema as JSONSchema7}
                onChange={onChange}
                formData={formData}
                requiredFields={schema.required}
                setFormError={setFormError}
                formError={formError}
              />
            );
          },
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
                              setFormError={setFormError}
                              formError={formError}
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
          {...sharedProps}
          key={path.join(".")}
          onChange={(e) => {
            handleChange(e, schemaType, [
              validate.getPublicKeyError,
              validate.getContractIdError,
            ]);
          }}
          infoText={schema.description || ""}
          leftElement={<Icon.User03 />}
          note={<>{schema.description}</>}
          fieldSize="md"
        />
      );
    case "U32":
      return (
        <PositiveIntPicker
          {...sharedProps}
          key={path.join(".")}
          onChange={(e) => {
            handleChange(e, schemaType, validate.getU32Error);
          }}
        />
      );
    case "U64":
      return (
        <PositiveIntPicker
          {...sharedProps}
          key={path.join(".")}
          onChange={(e) => {
            handleChange(e, schemaType, validate.getU64Error);
          }}
        />
      );
    case "U128":
      return (
        <PositiveIntPicker
          {...sharedProps}
          key={path.join(".")}
          onChange={(e) => {
            handleChange(e, schemaType, validate.getU128Error);
          }}
        />
      );
    case "U256":
      return (
        <PositiveIntPicker
          {...sharedProps}
          key={path.join(".")}
          onChange={(e) => {
            handleChange(e, schemaType, validate.getU256Error);
          }}
        />
      );
    case "I32":
      return (
        <Input
          {...sharedProps}
          key={path.join(".")}
          onChange={(e) => {
            handleChange(e, schemaType, validate.getI32Error);
          }}
          fieldSize="md"
        />
      );
    case "I64":
      return (
        <Input
          {...sharedProps}
          key={path.join(".")}
          onChange={(e) => {
            handleChange(e, schemaType, validate.getI64Error);
          }}
          fieldSize="md"
        />
      );
    case "I128":
      return (
        <Input
          {...sharedProps}
          key={path.join(".")}
          onChange={(e) => {
            handleChange(e, schemaType, validate.getI128Error);
          }}
          fieldSize="md"
        />
      );
    case "I256":
      return (
        <Input
          {...sharedProps}
          key={path.join(".")}
          onChange={(e) => {
            handleChange(e, schemaType, validate.getI256Error);
          }}
          fieldSize="md"
        />
      );
    case "ScString":
    case "ScSymbol":
      return (
        <Input
          {...sharedProps}
          key={path.join(".")}
          error="" // @TODO
          onChange={(e) => {
            // @TODO validate the value via length
            handleChange(e, schemaType);
          }}
          note={<>{schema.description}</>}
          fieldSize="md"
        />
      );
    case "DataUrl":
      return (
        <Input
          {...sharedProps}
          key={path.join(".")}
          onChange={(e) => {
            handleChange(e, schemaType, validate.getDataUrlError);
          }}
          fieldSize="md"
        />
      );
    default:
      return null;
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

const hasAnyValidationPassed = (errors: (string | false)[]): boolean =>
  errors.some((error) => error === false);
