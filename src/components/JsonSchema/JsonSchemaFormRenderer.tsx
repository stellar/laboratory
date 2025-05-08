import React from "react";
import { Button, Card, Icon, Input, Text } from "@stellar/design-system";
import type { JSONSchema7 } from "json-schema";
import { get, set } from "lodash";

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
  onChange,
  index,
  requiredFields,
  formError,
  setFormError,
  parsedSorobanOperation,
}: {
  name: string;
  schema: JSONSchema7;
  path?: (string | number)[];
  onChange: (value: SorobanInvokeValue) => void;
  index?: number;
  requiredFields?: string[];
  formError: AnyObject;
  setFormError: (formError: AnyObject) => void;
  parsedSorobanOperation: SorobanInvokeValue;
}) => {
  const schemaType = getDefType(schema);

  const nestedItemLabel =
    path.length > 0 ? getNestedItemLabel(path.join(".")) : name;
  const label = Number(getNestedItemLabel(path.join(".")))
    ? schemaType
    : `${nestedItemLabel} (${schemaType})`;

  const invokeContractBaseProps = {
    contract_id: parsedSorobanOperation.contract_id,
    function_name: parsedSorobanOperation.function_name,
  };
  const sharedProps = {
    id: path.join("."),
    label,
    value: get(parsedSorobanOperation.args, path.join("."))?.value,
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
      const updatedList = set(parsedSorobanOperation.args, path.join("."), {
        value: e.target.value,
        type: schemaType,
      });
      onChange({
        ...invokeContractBaseProps,
        args: {
          ...updatedList,
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
        fn(e.target.value, requiredFields?.includes(nestedItemLabel)),
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
      error = validateFn?.(
        e.target.value,
        requiredFields?.includes(nestedItemLabel),
      );
    }

    const currentPath = path.length > 0 ? path.join(".") : name;

    if (error) {
      setFormError({
        ...formError,
        [currentPath]: error ? error : "",
      });
    } else {
      const newFormError = { ...formError };
      delete newFormError[currentPath];
      setFormError(newFormError);
    }
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
            const schemaProperty = getSchemaProperty(schema, key);

            if (schemaProperty?.type === "object") {
              return (
                <React.Fragment key={index}>
                  <LabelHeading size="md" infoText={schema.description}>
                    {key}
                  </LabelHeading>

                  {schemaProperty?.description ? (
                    <Text as="div" size="xs">
                      {schemaProperty.description}
                    </Text>
                  ) : null}

                  <Box gap="md">
                    <Card>
                      <JsonSchemaFormRenderer
                        name={key}
                        key={`${key}-${index}`}
                        schema={subSchema as JSONSchema7}
                        onChange={onChange}
                        requiredFields={schema.required}
                        setFormError={setFormError}
                        formError={formError}
                        parsedSorobanOperation={parsedSorobanOperation}
                      />
                    </Card>
                  </Box>
                </React.Fragment>
              );
            }

            return (
              <JsonSchemaFormRenderer
                name={key}
                key={`${key}-${index}`}
                schema={subSchema as JSONSchema7}
                onChange={onChange}
                requiredFields={schema.required}
                setFormError={setFormError}
                formError={formError}
                parsedSorobanOperation={parsedSorobanOperation}
              />
            );
          },
        )}
      </Box>
    );
  }

  if (schemaType === "array") {
    const storedNestedItems = parsedSorobanOperation.args?.[name] || [];
    const schemaItems = getSchemaItems(schema);

    const addDefaultSchemaTemplate = () => {
      // template created based on the schema.properties
      let defaultTemplate;

      if (isSchemaObject(schema.items) && schema.items.type === "object") {
        defaultTemplate = Object.keys(schemaItems || {}).reduce(
          (acc: Record<string, string | AnyObject>, key) => {
            // For example, if the schema.items has an array of object type like following:
            // {
            //   "items": {
            //     "type": "object",
            //     "properties": {
            //       "address": { "type": "string" },
            //       "amount": { "type": "string" },
            //       "request_type": { "type": "string" }
            //     }
            //   }
            // }
            // then the defaultTemplate will be:
            // {
            //   "address": {},
            //   "amount": {},
            //   "request_type": {}
            // }
            acc[key] = {};
            return acc;
          },
          {},
        );
      } else {
        // if the schema.items is not an object,
        // we don't need to add any default template with a key
        defaultTemplate = {};
      }

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

        {schema.description ? (
          <Text as="div" size="xs">
            {schema.description}
          </Text>
        ) : null}

        {storedNestedItems.length > 0 &&
          storedNestedItems.map((args: any, index: number) => (
            <Box gap="md" key={`${name}-${index}`}>
              <Card>
                <Box gap="md" key={`${name}-${index}`}>
                  <LabelHeading size="lg">
                    {name}-{index + 1}
                  </LabelHeading>

                  <Box gap="md">
                    <>
                      {/* Check if we're dealing with an array of objects */}
                      {isSchemaObject(schema.items) &&
                      schema.items.type === "object" ? (
                        Object.keys(args).map((arg) => {
                          const nestedPath = [name, index, arg].join(".");
                          return (
                            <JsonSchemaFormRenderer
                              name={name}
                              index={index}
                              key={nestedPath}
                              schema={schemaItems?.[arg] as JSONSchema7}
                              path={[...path, nestedPath]}
                              onChange={onChange}
                              requiredFields={schema.required}
                              setFormError={setFormError}
                              formError={formError}
                              parsedSorobanOperation={parsedSorobanOperation}
                            />
                          );
                        })
                      ) : (
                        // for an argument array that carries non-object type
                        <JsonSchemaFormRenderer
                          name={name}
                          index={index}
                          key={[name, index].join(".")}
                          schema={schemaItems}
                          path={[[name, index].join(".")]}
                          onChange={onChange}
                          requiredFields={schema.required}
                          setFormError={setFormError}
                          formError={formError}
                          parsedSorobanOperation={parsedSorobanOperation}
                        />
                      )}
                    </>

                    <Box gap="sm" direction="row" align="center">
                      <Button
                        size="md"
                        variant="tertiary"
                        icon={<Icon.Trash01 />}
                        type="button"
                        onClick={() => {
                          const updatedList = arrayItem.delete(
                            get(parsedSorobanOperation.args, name),
                            index,
                          );

                          const nestedErrorKeys = Object.keys(
                            get(
                              parsedSorobanOperation.args,
                              `${name}[${index}]`,
                            ),
                          );

                          if (nestedErrorKeys.length > 0) {
                            const nestedKeyPath = `${name}.${index}`;
                            const newFormError = deleteNestedItemError(
                              nestedErrorKeys,
                              formError,
                              nestedKeyPath,
                            );

                            setFormError(newFormError);
                          }

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

const getSchemaItems = (schema: any) => {
  if (schema.items && typeof schema.items !== "boolean") {
    if (schema.items.properties) {
      return schema.items.properties;
    }
    return schema.items;
  }
  return {};
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

const getNestedItemLabel = (path: string): string => {
  const keys = parsePath(path);
  return keys[keys.length - 1] ? keys[keys.length - 1].toString() : "";
};

const hasAnyValidationPassed = (errors: (string | false)[]): boolean =>
  errors.some((error) => error === false);

const deleteNestedItemError = (
  nestedKey: string[],
  formError: AnyObject,
  nameIndex: string,
) => {
  const newFormError = { ...formError };

  for (const item of nestedKey) {
    const deletedPath = [nameIndex, item].join(".");
    delete newFormError[deletedPath];
  }

  return newFormError;
};
