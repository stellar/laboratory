import React, { useEffect, useState } from "react";
import type { JSONSchema7 } from "json-schema";
import { Contract, contract, nativeToScVal, xdr } from "@stellar/stellar-sdk";
import { Button, Card, Icon, Input, Text } from "@stellar/design-system";

import { isSpecTypeNumber } from "@/helpers/isSpecTypeNumber";
import { readObj } from "@/helpers/readObj";
import {
  dereferenceSchema,
  DereferencedSchemaType,
} from "@/helpers/dereferenceSchema";
import { removeLeadingZeroes } from "@/helpers/removeLeadingZeroes";

import { Box } from "@/components/layout/Box";
import { PositiveIntPicker } from "@/components/FormElements/PositiveIntPicker";
import { LabelHeading } from "@/components/LabelHeading";
import { AnyObject, SorobanInvokeValue } from "@/types/types";
import { validate } from "@/validate";
import { useStore } from "@/store/useStore";
import { getScValsFromSpec } from "@/helpers/getScValsFromSpec";

export const JsonSchemaForm = ({
  name,
  value,
  onChange,
  spec,
}: {
  name: string;
  value: SorobanInvokeValue;
  onChange: (value: SorobanInvokeValue) => void;
  spec: contract.Spec;
}) => {
  const { transaction } = useStore();
  const { updateSorobanBuildXdr } = transaction;

  const selectedFuncSchema: JSONSchema7 | undefined = spec.jsonSchema(name);

  if (!selectedFuncSchema) {
    return null;
  }

  const dereferencedSchema: DereferencedSchemaType = dereferenceSchema(
    selectedFuncSchema,
    name,
  );
  const requiredFields = dereferencedSchema.required;
  const missingFields = requiredFields.filter((field) => !value.args[field]);

  const [formError, setFormError] = useState<AnyObject>({});

  useEffect(() => {
    // const missingFields = requiredFields.filter((field) => !value.args[field]);
  }, [value.args]);

  const handleChange = (key: string, newVal: any) => {
    console.log("[handleChange] typeof newVal: ", typeof newVal);
    console.log("[handleChange] newVal: ", newVal);

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

    switch (specType) {
      case "Address":
        return (
          <Input
            id={key}
            key={label}
            fieldSize="md"
            label={label}
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
            label={label}
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
            label={label}
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
            label={label}
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
            label={label}
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
            label={label}
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
            label={label}
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
            label={label}
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
            label={label}
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
            label={label}
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
            label={label}
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
            label={label}
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
        // if the array has items, render the items
        if (Array.isArray(prop.items) && prop.items.length > 0) {
          return prop.items.map((item: any, index: number) =>
            renderComponent(key, item, index),
          );
        }
        // render a button to add an item to the array
        return (
          <Box gap="sm" key={label}>
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
  };

  const render = (item: any): React.ReactElement => {
    const argLabels = item.properties ? Object.keys(item.properties) : [];
    const fields = item.properties ? Object.entries(item.properties) : [];
    const { name, description } = dereferencedSchema;

    return (
      <Box gap="md">
        {renderTitle(name, description, argLabels, fields)}

        <Box gap="md" key={name}>
          {fields.map(([key, prop]) => (
            <>{renderComponent(key, prop)}</>
          ))}
        </Box>

        <Box gap="md" direction="row" wrap="wrap">
          <Button
            variant="secondary"
            disabled={
              missingFields.length > 0 ||
              Object.values(formError).filter(Boolean).length > 0
            }
            size="md"
            onClick={() => {
              const scVals = getScValsFromSpec(
                value.function_name,
                spec,
                value,
              );

              const scValsToXdr = scVals.map((val) => val.toXDR("base64"));

              onChange({
                ...value,
                scValsXdr: scValsToXdr,
              });

              console.log("scValsToXdr: ", scValsToXdr);
              console.log("scVals: ", scVals);
            }}
            type="button"
          >
            Call Contract
          </Button>
        </Box>
      </Box>
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
  description: string,
  labels: string[],
  fields: [string, any][],
) => {
  // if (labels.length) {
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
          const refPath = field?.[1]?.items?.$ref.replace("#/definitions/", "");
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
    <>
      <Text size="lg" as="h2">
        {name} ({mappedLabels.join(", ")})
      </Text>
      {description ? (
        <Text size="sm" as="h3">
          {description}
        </Text>
      ) : null}
    </>
  );
};
