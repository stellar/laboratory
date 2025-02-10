import React, { useEffect, useState } from "react";
import type { JSONSchema7 } from "json-schema";
import {
  Button,
  Card,
  Checkbox,
  Icon,
  Input,
  Label,
  Loader,
  Text,
} from "@stellar/design-system";

import {
  getDereferenceSchema,
  DereferencedSchema,
} from "@/helpers/dereferenceSchema";

import { Box } from "@/components/layout/Box";
import { TextPicker } from "@/components/FormElements/TextPicker";
import { PositiveIntPicker } from "@/components/FormElements/PositiveIntPicker";

export const JsonSchemaForm = ({
  schema,
  name,
}: {
  schema: JSONSchema7;
  name: string;
}) => {
  const [dereferencedSchema, setDereferencedSchema] =
    useState<DereferencedSchema>({
      properties: {},
      required: [],
      additionalProperties: false,
    });

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
  const renderComponent = (key: string, prop: any) => {
    console.log("[renderComponent] key: ", key);
    console.log("[renderComponent] value: ", prop);

    const onChange = (key: string, value: string) => {
      console.log("[onChange] key: ", key);
      console.log("[onChange] value: ", value);
    };

    switch (prop.specType) {
      case "Address":
      case "ScString":
      case "ScSymbol":
      case "DataUrl":
        return <TextPicker id={key} label={key} value={""} onChange={} />;
      case "U32":
      case "U64":
      case "U128":
      case "U256":
        return (
          <PositiveIntPicker
            id={key}
            label={key}
            value={""}
            error={""}
            onChange={() => {}}
          />
        );

      case "I32":
      case "I64":
      case "I128":
      case "I256":
        return <TextPicker id={key} label={key} value={""} onChange={} />;
      default:
        return null;
    }
  };

  const renderTitle = (labels: string[], fields: [string, any][]) => {
    if (labels) {
      const mappedLabels = labels.map((label) => {
        const field = fields.find(([key]) => key === label);
        return `${label}: ${field?.[1]?.specType}`;
      });

      return (
        <Text size="lg" as="p">
          {name}({mappedLabels.join(", ")})
        </Text>
      );
    }

    return null;
  };

  const render = (item: any): React.ReactElement => {
    const argLabels = item.properties ? Object.keys(item.properties) : [];
    const fields = item.properties ? Object.entries(item.properties) : [];

    return (
      <>
        {renderTitle(argLabels, fields)}
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
