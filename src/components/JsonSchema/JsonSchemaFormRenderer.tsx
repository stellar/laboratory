import React from "react";
import {
  Button,
  Card,
  Icon,
  Input,
  Select,
  Text,
} from "@stellar/design-system";
import type { JSONSchema7 } from "json-schema";
import { get } from "lodash";

import { validate } from "@/validate";

import { arrayItem } from "@/helpers/arrayItem";
import { convertSpecTypeToScValType } from "@/helpers/sorobanUtils";
import { jsonSchema } from "@/helpers/jsonSchema";

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
  path?: string[];
  onChange: (value: SorobanInvokeValue) => void;
  index?: number;
  requiredFields?: string[];
  formError: AnyObject;
  setFormError: (formError: AnyObject) => void;
  parsedSorobanOperation: SorobanInvokeValue;
}) => {
  const schemaType = jsonSchema.getSchemaType(schema);

  // this is where we get the primitive name
  const nestedItemLabel =
    path.length > 0 ? jsonSchema.getNestedItemLabel(path.join("-")) : name;
  // const nestedItemLabel =
  //   path.length > 0 ? jsonSchema.getNestedItemLabel(path.join("-")) : name;

  const label = Number(jsonSchema.getNestedItemLabel(path.join("-")))
    ? schemaType
    : `${nestedItemLabel || name} (${schemaType})`;

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

  const handleStoreChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    schemaType: string,
  ) => {
    const scValType = convertSpecTypeToScValType(schemaType);

    const isUnionTuple =
      Object.values(parsedSorobanOperation.args)[0] &&
      "tag" in Object.values(parsedSorobanOperation.args)[0] &&
      "values" in Object.values(parsedSorobanOperation.args)[0];

    if (path.length > 0) {
      if (isUnionTuple) {
        const keyName = Object.keys(parsedSorobanOperation.args)[0];

        const updatedTupleList = jsonSchema.setDeepValue(
          parsedSorobanOperation.args[keyName],
          path.join("."),
          {
            value: e.target.value,
            type: scValType,
          },
        );

        onChange({
          ...invokeContractBaseProps,
          args: {
            ...parsedSorobanOperation.args,
            [keyName]: updatedTupleList,
          },
        });
      } else {
        const updatedList = jsonSchema.setDeepValue(
          parsedSorobanOperation.args,
          path.join("."),
          {
            value: e.target.value,
            type: scValType,
          },
        );

        onChange({
          ...invokeContractBaseProps,
          args: {
            ...updatedList,
          },
        });
      }
    } else {
      // if path is not set, then set the value of the field directly
      onChange({
        ...invokeContractBaseProps,
        args: {
          ...parsedSorobanOperation.args,
          [name]: { value: e.target.value, type: scValType },
        },
      });
    }
  };

  const handleValidate = (
    e: React.ChangeEvent<HTMLInputElement>,
    schemaType: string,
    validateFn?:
      | ((value: string, required?: boolean) => string | false)
      | ((value: string, required?: boolean) => string | false)[],
  ) => {
    // Validate the value
    let error;

    if (Array.isArray(validateFn)) {
      const errors = validateFn.map((fn) =>
        fn(e.target.value, requiredFields?.includes(nestedItemLabel)),
      );
      const hasNoError = jsonSchema.hasAnyValidationPassed(errors);

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

  if (!schemaType) {
    return null;
  }

  if (schemaType === "oneOf" && schema.oneOf) {
    const keyName = Object.keys(parsedSorobanOperation.args)[0];

    let tagName;

    if (path.length > 0) {
      tagName = get(parsedSorobanOperation.args[keyName], path.join("."))?.tag;
    } else {
      tagName = parsedSorobanOperation.args[keyName]?.tag;
    }

    const selectedSchema = schema.oneOf.find(
      (oneOf) => jsonSchema.isSchemaObject(oneOf) && oneOf?.title === tagName,
    );

    return (
      <Box gap="md">
        <Select
          id="json-schema-form-renderer-one-of"
          fieldSize="md"
          label={name}
          value={get(parsedSorobanOperation.args, path.join("."))?.tag}
          onChange={(e) => {
            if (path.length) {
              const keyName = Object.keys(parsedSorobanOperation.args)[0];
              const updatedTupleList = jsonSchema.setDeepValue(
                parsedSorobanOperation.args[keyName],
                path.join("."),
                {
                  tag: e.target.value,
                  values: [],
                },
              );

              onChange({
                ...invokeContractBaseProps,
                args: {
                  ...parsedSorobanOperation.args,
                  [keyName]: updatedTupleList,
                },
              });
            } else {
              onChange({
                ...invokeContractBaseProps,
                args: {
                  ...parsedSorobanOperation.args,
                  [name]: {
                    tag: e.target.value,
                    values: [],
                  },
                },
              });
            }
          }}
        >
          {/* title is the tag */}
          <option value="">Select</option>

          {schema.oneOf.map((oneOf) => {
            if (typeof oneOf === "boolean") return null;

            return (
              <option id={oneOf?.title} value={oneOf?.title} key={oneOf?.title}>
                {oneOf?.title}
              </option>
            );
          })}
        </Select>

        {selectedSchema &&
        jsonSchema.isSchemaObject(selectedSchema) &&
        isTaggedTuple(selectedSchema as JSONSchema7)
          ? renderTaggedUnion(
              name,
              path,
              selectedSchema as JSONSchema7,
              onChange,
              parsedSorobanOperation,
              formError,
              setFormError,
            )
          : null}
      </Box>
    );
  }

  if (schemaType === "object") {
    return (
      <Box gap="md">
        {Object.entries(schema.properties || {}).map(
          ([key, subSchema], index) => {
            const schemaProperty = jsonSchema.getSchemaProperty(schema, key);

            if (schemaProperty?.type === "object") {
              return (
                <React.Fragment key={`${key}-${index}`}>
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
                        name={path.length > 0 ? path.join(".") : key}
                        key={`${key}-${index}`}
                        path={path}
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
                name={path.length > 0 ? path.join(".") : key}
                key={`${key}-${index}`}
                path={path}
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
    const schemaItems = jsonSchema.getSchemaItems(schema);

    if (jsonSchema.isTuple(schema) && schemaItems.length > 0) {
      return schemaItems.map((item: JSONSchema7, index: number) => {
        const nestedPath = [name, index].join(".");

        if (item.type === "array" && jsonSchema.isTuple(item)) {
          return (
            <Box gap="md">
              <LabelHeading size="md">{nestedPath} TUPLE ARRAY</LabelHeading>
              <Card>
                <Box gap="md">
                  <JsonSchemaFormRenderer
                    name={nestedPath}
                    path={[nestedPath]}
                    schema={item}
                    onChange={onChange}
                    requiredFields={schema.required}
                    setFormError={setFormError}
                    formError={formError}
                    parsedSorobanOperation={parsedSorobanOperation}
                  />
                </Box>
              </Card>
            </Box>
          );
        }

        // non tuple array
        return (
          <JsonSchemaFormRenderer
            name={`${nestedPath}-"nonTuple"`}
            path={[nestedPath]}
            schema={item}
            onChange={onChange}
            requiredFields={schema.required}
            setFormError={setFormError}
            formError={formError}
            parsedSorobanOperation={parsedSorobanOperation}
          />
        );
      });
    }

    const addDefaultSchemaTemplate = () => {
      // template created based on the schema.properties
      let defaultTemplate: AnyObject = {};

      if (
        jsonSchema.isSchemaObject(schema.items) &&
        schema.items.type === "object"
      ) {
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
      } else if (
        jsonSchema.isSchemaObject(schema.items) &&
        schema.items.type === "array"
      ) {
        // defaultTemplate = Object.keys(schemaItems || {}).reduce(
        //   (acc: Record<string, string | AnyObject>, key) => {
        //     // For example, if the schema.items has an array of object type like following:
        //     // acc[key] = acc[key].;
        //     // return acc;
        //   },
        //   {},
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

    const addedEmptyItem = parsedSorobanOperation.args?.[name] || [];

    return (
      <Box gap="md" key={`${name}-${index}`}>
        <LabelHeading size="md" infoText={schema.description}>
          {name.split(".").join("-")} [do we need this]
        </LabelHeading>

        {schema.description ? (
          <Text as="div" size="xs">
            {schema.description}
          </Text>
        ) : null}

        {addedEmptyItem.length > 0 &&
          addedEmptyItem.map((args: any, index: number) => {
            const nestedPathTitle = [name, index].join(".");

            return (
              <Box gap="md" key={`${name}-${index}`}>
                <Card>
                  <Box gap="md" key={`${name}-${index}`}>
                    <LabelHeading size="lg">{nestedPathTitle}</LabelHeading>

                    <Box gap="md">
                      <>
                        {/* Check if we're dealing with an array of objects */}
                        {jsonSchema.isSchemaObject(schema.items) &&
                        schema.items.type === "object" ? (
                          Object.keys(args).map((arg, nestedIndex) => {
                            const nestedPath = [
                              name,
                              index,
                              arg,
                              nestedIndex,
                            ].join(".");

                            return (
                              <JsonSchemaFormRenderer
                                name={path.length > 0 ? path.join(".") : name}
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
                            name={path.length > 0 ? path.join(".") : name}
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
                              const newFormError =
                                jsonSchema.deleteNestedItemError(
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
            );
          })}

        {!jsonSchema.isTuple(schema) && (
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
        )}
      </Box>
    );
  }

  // Recursion Base Case
  switch (schemaType) {
    case "Address":
      return (
        <Input
          {...sharedProps}
          key={path.join(".")}
          onChange={(e) => {
            handleStoreChange(e, schemaType);
            handleValidate(e, schemaType, [
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
            handleStoreChange(e, schemaType);
            handleValidate(e, schemaType, validate.getU32Error);
          }}
        />
      );
    case "U64":
      return (
        <PositiveIntPicker
          {...sharedProps}
          key={path.join(".")}
          onChange={(e) => {
            handleStoreChange(e, schemaType);
            handleValidate(e, schemaType, validate.getU64Error);
          }}
        />
      );
    case "U128":
      return (
        <PositiveIntPicker
          {...sharedProps}
          key={path.join(".")}
          onChange={(e) => {
            handleStoreChange(e, schemaType);
            handleValidate(e, schemaType, validate.getU128Error);
          }}
        />
      );
    case "U256":
      return (
        <PositiveIntPicker
          {...sharedProps}
          key={path.join(".")}
          onChange={(e) => {
            handleStoreChange(e, schemaType);
            handleValidate(e, schemaType, validate.getU256Error);
          }}
        />
      );
    case "I32":
      return (
        <Input
          {...sharedProps}
          key={path.join(".")}
          onChange={(e) => {
            handleStoreChange(e, schemaType);
            handleValidate(e, schemaType, validate.getI32Error);
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
            handleStoreChange(e, schemaType);
            handleValidate(e, schemaType, validate.getI64Error);
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
            handleStoreChange(e, schemaType);
            handleValidate(e, schemaType, validate.getI128Error);
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
            handleStoreChange(e, schemaType);
            handleValidate(e, schemaType, validate.getI256Error);
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
            handleStoreChange(e, schemaType);
            // @TODO validate the value via length
            handleValidate(e, schemaType);
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
            handleStoreChange(e, schemaType);
            handleValidate(e, schemaType, validate.getDataUrlError);
          }}
          fieldSize="md"
        />
      );
    default:
      return null;
  }
};

const isTaggedTuple = (schema: JSONSchema7): boolean => {
  return Boolean(
    schema.properties?.tag &&
      schema.properties?.values &&
      schema.required?.includes("tag") &&
      schema.required?.includes("values"),
  );
};

const renderTaggedUnion = (
  name: string,
  path: string[],
  schema: JSONSchema7,
  onChange: (value: SorobanInvokeValue) => void,
  parsedSorobanOperation: SorobanInvokeValue,
  formError: AnyObject,
  setFormError: (formError: AnyObject) => void,
) => {
  if (!parsedSorobanOperation.args[name]?.tag || !schema.properties?.values) {
    return null;
  }

  // from the schema, the tag is "values"
  const label = "values";

  return (
    <Box gap="md">
      <LabelHeading size="md" infoText={schema.description}>
        {parsedSorobanOperation.args[name]?.tag}
      </LabelHeading>

      <Card>
        <Box gap="md">
          <LabelHeading size="md" infoText={schema.description}>
            {label}
          </LabelHeading>
          <Card>
            <Box gap="md">
              <JsonSchemaFormRenderer
                name={label}
                path={path}
                schema={schema.properties.values as JSONSchema7}
                onChange={onChange}
                requiredFields={schema.required}
                setFormError={setFormError}
                formError={formError}
                parsedSorobanOperation={parsedSorobanOperation}
              />
            </Box>
          </Card>
        </Box>
      </Card>
    </Box>
  );
};

const renderEmptyItem = (
  name: string,
  path: string[],
  schema: JSONSchema7,
  onChange: (value: SorobanInvokeValue) => void,
  parsedSorobanOperation: SorobanInvokeValue,
) => {
  return null;
};
