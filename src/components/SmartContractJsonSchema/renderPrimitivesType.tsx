import React from "react";
import { Icon, Input, Select } from "@stellar/design-system";
import type { JSONSchema7 } from "json-schema";
import { get } from "lodash";

import { jsonSchema } from "@/helpers/jsonSchema";
import { convertSpecTypeToScValType } from "@/helpers/sorobanUtils";

import { validate } from "@/validate";

import { PositiveIntPicker } from "@/components/FormElements/PositiveIntPicker";

import type { AnyObject, SorobanInvokeValue } from "@/types/types";

export const renderPrimitivesType = ({
  name,
  schema,
  path,
  parsedSorobanOperation,
  onChange,
  formError,
  setFormError,
}: {
  name: string;
  schema: Partial<JSONSchema7>;
  path: string[];
  parsedSorobanOperation: SorobanInvokeValue;
  onChange: (value: SorobanInvokeValue) => void;
  formError: AnyObject;
  setFormError: (error: AnyObject) => void;
}) => {
  const { description } = schema;

  const schemaType = jsonSchema.getSchemaType(schema);

  const nestedItemLabel =
    path.length > 0 ? jsonSchema.getNestedItemLabel(path.join(".")) : path;

  const formErrorKey = [
    parsedSorobanOperation.function_name,
    path.join("."),
  ].join(".");

  const sharedProps = {
    id: path.join("."),
    label: `${nestedItemLabel} (${schemaType})`,
    value: get(parsedSorobanOperation.args, path.join("."))?.value || "",
    error: formError?.[formErrorKey] || undefined,
  };

  const invokeContractBaseProps = {
    contract_id: parsedSorobanOperation.contract_id,
    function_name: parsedSorobanOperation.function_name,
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    schemaType: string,
  ) => {
    const scValType = convertSpecTypeToScValType(schemaType);

    if (path.length > 0) {
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
    let error;

    if (Array.isArray(validateFn)) {
      const errors = validateFn.map((fn) => fn(e.target.value));
      const hasNoError = jsonSchema.hasAnyValidationPassed(errors);

      if (schemaType === "Address") {
        error = hasNoError ? "" : "Invalid Public key or contract ID";
      } else {
        error = hasNoError ? "" : errors.join(" ");
      }
    } else {
      error = validateFn?.(e.target.value);
    }

    if (error) {
      setFormError({
        ...formError,
        [formErrorKey]: error ? error : "",
      });
    } else {
      setFormError((prev: AnyObject) => {
        const newFormError = { ...prev };
        delete newFormError[formErrorKey];
        return newFormError;
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
            handleValidate(e, schemaType, [
              validate.getPublicKeyError,
              validate.getContractIdError,
            ]);
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
          key={path.join(".")}
          onChange={(e) => {
            handleChange(e, schemaType);
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
            handleChange(e, schemaType);
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
            handleChange(e, schemaType);
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
            handleChange(e, schemaType);
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
            handleChange(e, schemaType);
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
            handleChange(e, schemaType);
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
            handleChange(e, schemaType);
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
            handleChange(e, schemaType);
            handleValidate(e, schemaType, validate.getI256Error);
          }}
          fieldSize="md"
        />
      );
    case "Bool":
      return (
        <Select
          {...sharedProps}
          key={path.join(".")}
          fieldSize="md"
          onChange={(e) => {
            handleChange(e, schemaType);
          }}
        >
          <option value="" disabled={true}>
            Select
          </option>
          <option value="true">true</option>
          <option value="false">false</option>
        </Select>
      );
    case "ScString":
    case "ScSymbol":
      return (
        <Input
          {...sharedProps}
          key={path.join(".")}
          onChange={(e) => {
            handleChange(e, schemaType);
            handleValidate(e, schemaType);
          }}
          note={<>{description}</>}
          fieldSize="md"
        />
      );
    case "DataUrl":
      return (
        <Input
          {...sharedProps}
          key={path.join(".")}
          onChange={(e) => {
            handleChange(e, schemaType);
            handleValidate(e, schemaType, validate.getDataUrlError);
          }}
          fieldSize="md"
        />
      );
    default:
      return null;
  }
};
