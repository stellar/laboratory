import React, { useEffect, useState } from "react";
import type { JSONSchema7 } from "json-schema";
import { Button, Card, Icon, Input, Text } from "@stellar/design-system";

import {
  getDereferenceSchema,
  DereferencedSchema,
} from "@/helpers/dereferenceSchema";

import { AnyObject } from "@/types/types";

import { Box } from "@/components/layout/Box";
import { PositiveIntPicker } from "@/components/FormElements/PositiveIntPicker";
import { LabelHeading } from "@/components/LabelHeading";

export const JsonSchemaForm = ({
  schema,
  name,
  onChange,
  // @todo for now
  schemaValue,
}: {
  schema: JSONSchema7;
  name: string;
  onChange: (
    argObj: AnyObject,
    key: string,
    val: string,
    index?: number,
  ) => void;
  schemaValue: AnyObject;
}) => {
  const [dereferencedSchema, setDereferencedSchema] =
    useState<DereferencedSchema>({
      properties: {},
      required: [],
      additionalProperties: false,
    });

  console.log("schemaValue :", schemaValue);

  useEffect(() => {
    const dereferencedSchema = getDereferenceSchema(schema, name);
    setDereferencedSchema(dereferencedSchema);
  }, [schema, name]);

  // key: argument label
  // value: argument value that includes
  // type: argument type
  // description: argument description
  // sometimes format
  // pattern
  // min-length; max-length
  const renderComponent = (key: string, prop: any, index?: number) => {
    const getSpecType = (prop: any) => {
      if (prop.specType) {
        return prop.specType;
      }
      if (prop.$ref) {
        return prop.$ref.replace("#/definitions/", "");
      }
      return prop.type;
    };

    const specType = getSpecType(prop);
    const label = index !== undefined ? `${key}-${index + 1}` : key;

    if (getSpecType(prop)) {
      switch (specType) {
        case "Address":
          return (
            <Input
              id={key}
              fieldSize="md"
              label={label}
              value={schemaValue[label] || ""}
              error={""}
              onChange={(e) => {
                onChange(schemaValue, label, e.target.value);
              }}
              infoText={prop.description || ""}
              leftElement={<Icon.User03 />}
            />
          );
        case "ScString":
        case "ScSymbol":
        case "DataUrl":
          return (
            <Input
              id={key}
              fieldSize="md"
              label={label}
              value={schemaValue[label] || ""}
              error={""}
              onChange={(e) => {
                onChange(schemaValue, label, e.target.value);
              }}
            />
          );
        case "U32":
        case "U64":
        case "U128":
        case "U256":
          return (
            <PositiveIntPicker
              id={key}
              label={label}
              value={schemaValue[label] || ""}
              error={""}
              onChange={(e) => {
                onChange(schemaValue, label, e.target.value);
              }}
            />
          );

        case "I32":
        case "I64":
        case "I128":
        case "I256":
          return null;
        // prop.type
        case "array":
          // if the array has items, render the items
          if (Array.isArray(prop.items)) {
            // @todo add minLength and maxLength
            return prop.items.map((item: any, index: number) =>
              renderComponent(key, item, index),
            );
          }
          // render a button to add an item to the array
          return (
            <Box gap="sm">
              <LabelHeading size="md">{label}</LabelHeading>
              <div>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => {}}
                  type="button"
                >
                  Add {label}
                </Button>
              </div>
            </Box>
          );

        default:
          return null;
      }
    }
  };

  const render = (item: any): React.ReactElement => {
    const argLabels = item.properties ? Object.keys(item.properties) : [];
    const fields = item.properties ? Object.entries(item.properties) : [];

    return (
      <>
        {renderTitle(name, argLabels, fields)}

        <Box gap="md">
          {fields.map(([key, prop]) => (
            <>{renderComponent(key, prop)}</>
          ))}
        </Box>
      </>
    );
  };

  return (
    <Box gap="md">
      <Card>{render(dereferencedSchema)}</Card>
    </Box>
  );
};

const getTupleLabel = (items: any[]): string => {
  const typeLabels = items.map((item) => {
    if (item.$ref) {
      // Handle single reference type (e.g., Address)
      return item.$ref.replace("#/definitions/", "");
    }
    if (item.type === "array" && item.items?.$ref) {
      // Handle array type (e.g., vec<Address>)
      const innerType = item.items.$ref.replace("#/definitions/", "");
      return `vec<${innerType}>`;
    }
    return item.type;
  });

  return `tuple<${typeLabels.join(",")}>`;
};

const renderTitle = (
  name: string,
  labels: string[],
  fields: [string, any][],
) => {
  if (labels) {
    const mappedLabels = labels.map((label) => {
      const field = fields.find(([key]) => key === label);

      if (field) {
        if (field?.[1]?.specType) {
          return `${label}: ${field?.[1]?.specType}`;
        }
        // for an array type that doesn't have a specType
        if (field?.[1]?.type === "array") {
          if (field?.[1]?.items?.$ref) {
            // ex: will output 'Address[]' for `"#/definitions/Address"`
            const refPath = field?.[1]?.items?.$ref.replace(
              "#/definitions/",
              "",
            );
            return `${label}: ${refPath}[]`;
          }
          if (Array.isArray(field?.[1]?.items)) {
            // Handle tuple case
            const tupleLabel = getTupleLabel(field[1].items);
            return `${label}: ${tupleLabel}`;
          }
          return `${label}: array`;
        }
      }
      return label;
    });

    return (
      <Text size="lg" as="p">
        {name}({mappedLabels.join(", ")})
      </Text>
    );
  }

  return null;
};
