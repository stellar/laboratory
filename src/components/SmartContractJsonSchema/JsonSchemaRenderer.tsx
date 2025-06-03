import React from "react";
import { Card, Text } from "@stellar/design-system";
import type { JSONSchema7 } from "json-schema";

import { jsonSchema } from "@/helpers/jsonSchema";

import { Box } from "@/components/layout/Box";
import { LabelHeading } from "@/components/LabelHeading";

import { JsonSchemaFormProps } from "@/types/types";

import { renderPrimitivesType } from "./renderPrimitivesType";
import { renderArrayType } from "./renderArrayType";
import { renderOneOf } from "./renderOneOf";

// react context gets the latest
export const JsonSchemaRenderer = ({
  name,
  schema,
  path = [],
  onChange,
  requiredFields,
  parsedSorobanOperation,
}: JsonSchemaFormProps) => {
  const schemaType = jsonSchema.getSchemaType(schema);

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
                      <JsonSchemaRenderer
                        name={path.length > 0 ? path.join(".") : key}
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
            // console.log("[OUTSIDE] path", path);
            // console.log("[OUTSIDE] key", key);
            return (
              <JsonSchemaRenderer
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
      renderer: JsonSchemaRenderer,
    });
  }

  if (schemaType === "oneOf") {
    return renderOneOf({
      name,
      schema,
      path,
      parsedSorobanOperation,
      onChange,
      renderer: JsonSchemaRenderer,
    });
  }

  // Recursion Base Case
  return renderPrimitivesType({
    name,
    path,
    schema,
    parsedSorobanOperation,
    onChange,
  });
};
