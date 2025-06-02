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

import { PositiveIntPicker } from "@/components/FormElements/PositiveIntPicker";

import { jsonSchema } from "@/helpers/jsonSchema";
import type { SorobanInvokeValue } from "@/types/types";

export const renderPrimitives = ({
  schema,
  sharedProps,
  path,
  parsedSorobanOperation,
  onChange,
}: {
  schema: Partial<JSONSchema7>;
  sharedProps: any;
  path: string[];
  parsedSorobanOperation: SorobanInvokeValue;
  onChange: (value: SorobanInvokeValue) => void;
}) => {
  const { description } = schema;
  const schemaType = jsonSchema.getSchemaType(schema);

  switch (schemaType) {
    case "Address":
      return (
        <Input
          {...sharedProps}
          key={path.join(".")}
          onChange={(e) => {}}
          infoText={description || ""}
          leftElement={<Icon.User03 />}
          note={<>{description}</>}
          fieldSize="md"
        />
      );
    case "U32":
      return (
        <PositiveIntPicker
          {...sharedProps}
          key={path.join(".")}
          onChange={(e) => {}}
        />
      );
    case "U64":
      return (
        <PositiveIntPicker
          {...sharedProps}
          key={path.join(".")}
          onChange={(e) => {}}
        />
      );
    case "U128":
      return (
        <PositiveIntPicker
          {...sharedProps}
          key={path.join(".")}
          onChange={(e) => {}}
        />
      );
    case "U256":
      return (
        <PositiveIntPicker
          {...sharedProps}
          key={path.join(".")}
          onChange={(e) => {}}
        />
      );
    case "I32":
      return (
        <Input
          {...sharedProps}
          key={path.join(".")}
          onChange={(e) => {}}
          fieldSize="md"
        />
      );
    case "I64":
      return (
        <Input
          {...sharedProps}
          key={path.join(".")}
          onChange={(e) => {}}
          fieldSize="md"
        />
      );
    case "I128":
      return (
        <Input
          {...sharedProps}
          key={path.join(".")}
          onChange={(e) => {}}
          fieldSize="md"
        />
      );
    case "I256":
      return (
        <Input
          {...sharedProps}
          key={path.join(".")}
          onChange={(e) => {}}
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
          onChange={(e) => {}}
          note={<>{description}</>}
          fieldSize="md"
        />
      );
    case "DataUrl":
      return (
        <Input
          {...sharedProps}
          key={path.join(".")}
          onChange={(e) => {}}
          fieldSize="md"
        />
      );
    default:
      return null;
  }
};
