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

import {
  AnyObject,
  JsonSchemaFormProps,
  SorobanInvokeValue,
} from "@/types/types";
import { renderPrimitives } from "./renderPrimitivesType";
import { renderArrayType } from "./renderArrayType";
import { renderUnionType } from "./renderUnionType";

// react context gets the latest
export const JsonSchemaFormRendererTwo = ({
  name,
  schema,
  path = [],
  onChange,
  index,
  requiredFields,
  parsedSorobanOperation,
}: JsonSchemaFormProps) => {
  const schemaType = jsonSchema.getSchemaType(schema);

  console.log("[JsonSchemaFormRendererTwo] schema: ", schema);
  console.log("[JsonSchemaFormRendererTwo] path: ", path);

  const invokeContractBaseProps = {
    contract_id: parsedSorobanOperation.contract_id,
    function_name: parsedSorobanOperation.function_name,
  };

  // function schema always starts with an object type
  if (!schemaType) {
    return null;
  }

  if (schemaType === "object") {
    return (
      <Box gap="md">
        {Object.entries(schema.properties || {}).map(
          ([key, propertySchema], index) => {
            const propertySchemaType = jsonSchema.getSchemaType(propertySchema);
            const propertySchemaObject = jsonSchema.isSchemaObject(
              propertySchema,
            )
              ? propertySchema
              : undefined;

            if (propertySchemaType === "object" && propertySchemaObject) {
              return (
                <React.Fragment key={`${key}-${index}`}>
                  <LabelHeading size="md" infoText={schema.description}>
                    {key}
                  </LabelHeading>

                  {propertySchemaObject?.description ? (
                    <Text as="div" size="xs">
                      {propertySchemaObject.description}
                    </Text>
                  ) : null}

                  <Box gap="md">
                    <Card>
                      <JsonSchemaFormRendererTwo
                        name={path.length > 0 ? path.join(".") : key}
                        key={`${key}-${index}`}
                        path={[...path, key]}
                        schema={propertySchema as JSONSchema7}
                        onChange={onChange}
                        requiredFields={schema.required}
                        parsedSorobanOperation={parsedSorobanOperation}
                      />
                    </Card>
                  </Box>
                </React.Fragment>
              );
            }

            return (
              <JsonSchemaFormRendererTwo
                key={key}
                name={key}
                schema={propertySchema as JSONSchema7}
                path={[...path, key]}
                onChange={onChange}
                parsedSorobanOperation={parsedSorobanOperation}
                // requiredFields={[...(requiredFields || []), key]}
              />
            );
          },
        )}
      </Box>
    );
  }

  if (schemaType === "array") {
    return renderArrayType({
      schema,
      path,
      parsedSorobanOperation,
      onChange,
      renderer: JsonSchemaFormRendererTwo,
    });
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

    console.log("[JsonSchemaFormRendererTwo] selectedSchema: ", selectedSchema);

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
        jsonSchema.isTaggedUnion(selectedSchema as JSONSchema7)
          ? renderUnionType({
              name,
              path,
              schema: selectedSchema as JSONSchema7,
              onChange,
              parsedSorobanOperation,
              renderer: JsonSchemaFormRendererTwo,
              //   formError,
              //   setFormError,
            })
          : null}
      </Box>
    );
  }

  const sharedProps = {
    id: path.join("."),
    label: name,
    value: get(parsedSorobanOperation.args, path.join("."))?.value,
  };

  // Recursion Base Case
  return renderPrimitives({
    schema,
    sharedProps,
    path,
    parsedSorobanOperation,
    onChange,
  });
};
