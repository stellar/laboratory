import React from "react";
import { Icon, Input } from "@stellar/design-system";
import type { JSONSchema7 } from "json-schema";
import { get } from "lodash";

import { jsonSchema } from "@/helpers/jsonSchema";

// import { validate } from "@/validate";

import { PositiveIntPicker } from "@/components/FormElements/PositiveIntPicker";

import type { SorobanInvokeValue } from "@/types/types";
import { convertSpecTypeToScValType } from "@/helpers/sorobanUtils";

export const renderPrimitivesType = ({
  name,
  schema,
  path,
  parsedSorobanOperation,
  onChange,
}: {
  name: string;
  schema: Partial<JSONSchema7>;
  path: string[];
  parsedSorobanOperation: SorobanInvokeValue;
  onChange: (value: SorobanInvokeValue) => void;
}) => {
  const { description } = schema;
  const schemaType = jsonSchema.getSchemaType(schema);

  const sharedProps = {
    id: path.join("."),
    label: `${name} (${schemaType})`,
    value: get(parsedSorobanOperation.args, path.join("."))?.value || "",
  };

  const invokeContractBaseProps = {
    contract_id: parsedSorobanOperation.contract_id,
    function_name: parsedSorobanOperation.function_name,
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    schemaType: string,
  ) => {
    const scValType = convertSpecTypeToScValType(schemaType);

    if (path.length > 0) {
      // if (jsonSchema.isTuple(schema)) {
      //   const keyName = Object.keys(parsedSorobanOperation.args)[0];

      //   const updatedTupleList = jsonSchema.setDeepValue(
      //     parsedSorobanOperation.args[keyName],
      //     path.join("."),
      //     {
      //       value: e.target.value,
      //       type: scValType,
      //     },
      //   );

      //   onChange({
      //     ...invokeContractBaseProps,
      //     args: {
      //       ...parsedSorobanOperation.args,
      //       [keyName]: updatedTupleList,
      //     },
      //   });
      // } else

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

  switch (schemaType) {
    case "Address":
      return (
        <Input
          {...sharedProps}
          onChange={(e) => {
            handleChange(e, schemaType);
          }}
          key={path.join(".")}
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
          error="" // @TODO
          key={path.join(".")}
          onChange={(e) => {
            handleChange(e, schemaType);
          }}
        />
      );
    case "U64":
      return (
        <PositiveIntPicker
          {...sharedProps}
          error="" // @TODO
          key={path.join(".")}
          onChange={(e) => {
            handleChange(e, schemaType);
          }}
        />
      );
    case "U128":
      return (
        <PositiveIntPicker
          {...sharedProps}
          error="" // @TODO
          key={path.join(".")}
          onChange={(e) => {
            handleChange(e, schemaType);
          }}
        />
      );
    case "U256":
      return (
        <PositiveIntPicker
          {...sharedProps}
          error="" // @TODO
          key={path.join(".")}
          onChange={(e) => {
            handleChange(e, schemaType);
          }}
        />
      );
    case "I32":
      return (
        <Input
          {...sharedProps}
          key={path.join(".")}
          onChange={(e) => {
            handleChange(e, schemaType);
          }}
          fieldSize="md"
        />
      );
    case "I64":
      return (
        <Input
          {...sharedProps}
          error="" // @TODO
          key={path.join(".")}
          onChange={(e) => {
            handleChange(e, schemaType);
          }}
          fieldSize="md"
        />
      );
    case "I128":
      return (
        <Input
          {...sharedProps}
          error="" // @TODO
          key={path.join(".")}
          onChange={(e) => {
            handleChange(e, schemaType);
          }}
          fieldSize="md"
        />
      );
    case "I256":
      return (
        <Input
          {...sharedProps}
          error="" // @TODO
          key={path.join(".")}
          onChange={(e) => {
            handleChange(e, schemaType);
          }}
          fieldSize="md"
        />
      );
    case "ScString":
    case "ScSymbol":
      return (
        <Input
          {...sharedProps}
          error="" // @TODO
          key={path.join(".")}
          onChange={(e) => {
            handleChange(e, schemaType);
          }}
          note={<>{description}</>}
          fieldSize="md"
        />
      );
    case "DataUrl":
      return (
        <Input
          {...sharedProps}
          error="" // @TODO
          key={path.join(".")}
          onChange={(e) => {
            handleChange(e, schemaType);
          }}
          fieldSize="md"
        />
      );
    default:
      return null;
  }
};
