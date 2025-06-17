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

export const JsonSchemaRenderer = ({
  name,
  schema,
  path = [],
  onChange,
  parsedSorobanOperation,
  formError,
  setFormError,
}: JsonSchemaFormProps) => {
  const schemaType = jsonSchema.getSchemaType(schema);

  // function schema always starts with an object type
  if (!schemaType) {
    return null;
  }

  if (schemaType === "object") {
    return (
      <Box gap="md" key={`${name}-${path.join(".")}`}>
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
                        parsedSorobanOperation={parsedSorobanOperation}
                        formError={formError}
                        setFormError={setFormError}
                      />
                    </Card>
                  </Box>
                </React.Fragment>
              );
            }

            return (
              <JsonSchemaRenderer
                key={`${key}-${index}`}
                name={key}
                schema={propertySchema as JSONSchema7}
                path={[...path, key]}
                onChange={onChange}
                parsedSorobanOperation={parsedSorobanOperation}
                formError={formError}
                setFormError={setFormError}
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
      formError,
      setFormError,
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
      formError,
      setFormError,
    });
  }

  // Recursion Base Case
  return renderPrimitivesType({
    name,
    path,
    schema,
    parsedSorobanOperation,
    onChange,
    formError,
    setFormError,
  });
};
