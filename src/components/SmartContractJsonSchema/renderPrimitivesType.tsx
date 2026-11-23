import React, { useState } from "react";
import { Icon, Input, InputProps, Select } from "@stellar/design-system";
import type { JSONSchema7 } from "json-schema";
import { get } from "lodash";

import { jsonSchema } from "@/helpers/jsonSchema";
import { convertSpecTypeToScValType } from "@/helpers/sorobanUtils";

import { validate } from "@/validate";

import { PositiveIntPicker } from "@/components/FormElements/PositiveIntPicker";
import { ColorTypePill } from "@/components/ColorTypePill";
import { SdsLink } from "@/components/SdsLink";
import { AddressSelector as AddressSelectorComponent } from "@/components/AddressSelector";

import type { AnyObject, SorobanInvokeValue } from "@/types/types";

/**
 * Address Input with AddressSelector for selecting from saved keypairs or
 * connected wallet.
 */
const AddressInputSelector = (
  props: InputProps &
    React.InputHTMLAttributes<HTMLInputElement> & {
      onValueSelect: (val: string) => void;
    },
) => {
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const { onValueSelect, ...inputProps } = props;

  return (
    <div className="AddressSelectorWrapper">
      <Input
        {...inputProps}
        rightElement={
          <AddressSelectorComponent.Button
            mode="ScAddress"
            onClick={() => setIsSelectorOpen(!isSelectorOpen)}
          />
        }
      />
      <AddressSelectorComponent.Dropdown
        mode="ScAddress"
        onChange={(val) => {
          onValueSelect(val);
          setIsSelectorOpen(false);
        }}
        isOpen={isSelectorOpen}
        onClose={() => setIsSelectorOpen(false)}
      />
    </div>
  );
};

export const renderPrimitivesType = ({
  name,
  schema,
  path,
  parsedSorobanOperation,
  onChange,
  formError,
  setFormError,
  isOptional,
}: {
  name: string;
  schema: Partial<JSONSchema7>;
  path: string[];
  parsedSorobanOperation: SorobanInvokeValue;
  onChange: (value: SorobanInvokeValue) => void;
  formError: AnyObject;
  setFormError: (error: AnyObject) => void;
  isOptional?: boolean;
}) => {
  const { description } = schema;

  const schemaType = jsonSchema.getSchemaType(schema);

  const nestedItemLabel =
    path.length > 0 ? jsonSchema.getNestedItemLabel(path.join(".")) : path;

  const renameType = (type: string) => {
    switch (type) {
      case "MuxedAddress":
        return "muxed_address";
      case "ScSymbol":
        return "symbol";
      case "ScString":
        return "string";
      case "DataUrl":
        return "dataUrl";
      default:
        return type;
    }
  };

  const formErrorKey = [
    parsedSorobanOperation.function_name,
    path.join("."),
  ].join(".");

  const sharedProps = {
    id: path.join("."),
    value: get(parsedSorobanOperation.args, path.join("."))?.value || "",
    error: formError?.[formErrorKey] || undefined,
    labelSuffix: isOptional ? "optional" : undefined,
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
    const formattedPath = jsonSchema.formatPathWithBrackets(path);

    if (path.length > 0) {
      const updatedList = jsonSchema.setDeepValue(
        parsedSorobanOperation.args,
        formattedPath,
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
    validateFn?:
      | ((value: string, required?: boolean) => string | false)
      | ((value: string, required?: boolean) => string | false)[],
  ) => {
    let error;

    if (Array.isArray(validateFn)) {
      const errors = validateFn.map((fn) => fn(e.target.value));
      const hasNoError = jsonSchema.hasAnyValidationPassed(errors);

      error = hasNoError ? "" : errors.join(" ");
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

  const InputLabel = (
    <div className="InvokeContractForm__label">
      {renameType(nestedItemLabel as string)}
      {/* A MuxedAddress takes a plain address too, so show both (CAP-67) */}
      {schemaType === "MuxedAddress" ? <ColorTypePill type="address" /> : null}
      <ColorTypePill type={renameType(schemaType)} />
    </div>
  );

  switch (schemaType) {
    case "Address":
      return (
        <AddressInputSelector
          {...sharedProps}
          label={InputLabel}
          onChange={(e) => {
            handleChange(e, schemaType);
            handleValidate(e, validate.getAddressError);
          }}
          onValueSelect={(val) => {
            const syntheticEvent = {
              target: { value: val },
            } as React.ChangeEvent<HTMLInputElement>;
            handleChange(syntheticEvent, schemaType);
            handleValidate(syntheticEvent, validate.getAddressError);
          }}
          key={path.join(".")}
          infoText={description || ""}
          leftElement={<Icon.User03 />}
          note={<>{description}</>}
          fieldSize="md"
        />
      );
    case "MuxedAddress":
      return (
        <Input
          {...sharedProps}
          label={InputLabel}
          onChange={(e) => {
            handleChange(e, schemaType);
            handleValidate(e, validate.getMuxedAddressError);
          }}
          key={path.join(".")}
          infoText={
            <>
              <div>
                In addition to plain address, the Stellar Asset Contract’s{" "}
                <code>transfer</code> takes a muxed address for <code>to</code>{" "}
                so custodians can identify the recipient without a memo, which
                Soroban transactions don’t allow.{" "}
                <SdsLink href="https://github.com/stellar/stellar-protocol/blob/master/core/cap-0067.md#update-the-sac-transfer-function-to-support-muxed-addresses">
                  (CAP 0067)
                </SdsLink>
              </div>
            </>
          }
          leftElement={<Icon.User03 />}
          note={<>{description}</>}
          fieldSize="md"
        />
      );
    case "U32":
      return (
        <PositiveIntPicker
          {...sharedProps}
          label={InputLabel}
          key={path.join(".")}
          onChange={(e) => {
            handleChange(e, schemaType);
            handleValidate(e, validate.getU32Error);
          }}
        />
      );
    case "U64":
      return (
        <PositiveIntPicker
          {...sharedProps}
          label={
            <div className="InvokeContractForm__label">
              {nestedItemLabel}
              <ColorTypePill type={schemaType} />
            </div>
          }
          key={path.join(".")}
          onChange={(e) => {
            handleChange(e, schemaType);
            handleValidate(e, validate.getU64Error);
          }}
        />
      );
    case "U128":
      return (
        <PositiveIntPicker
          {...sharedProps}
          label={InputLabel}
          key={path.join(".")}
          onChange={(e) => {
            handleChange(e, schemaType);
            handleValidate(e, validate.getU128Error);
          }}
        />
      );
    case "U256":
      return (
        <PositiveIntPicker
          {...sharedProps}
          key={path.join(".")}
          label={InputLabel}
          onChange={(e) => {
            handleChange(e, schemaType);
            handleValidate(e, validate.getU256Error);
          }}
        />
      );
    case "I32":
      return (
        <Input
          {...sharedProps}
          key={path.join(".")}
          label={InputLabel}
          onChange={(e) => {
            handleChange(e, schemaType);
            handleValidate(e, validate.getI32Error);
          }}
          fieldSize="md"
        />
      );
    case "I64":
      return (
        <Input
          {...sharedProps}
          key={path.join(".")}
          label={InputLabel}
          onChange={(e) => {
            handleChange(e, schemaType);
            handleValidate(e, validate.getI64Error);
          }}
          fieldSize="md"
        />
      );
    case "I128":
      return (
        <Input
          {...sharedProps}
          key={path.join(".")}
          label={InputLabel}
          onChange={(e) => {
            handleChange(e, schemaType);
            handleValidate(e, validate.getI128Error);
          }}
          fieldSize="md"
        />
      );
    case "I256":
      return (
        <Input
          {...sharedProps}
          key={path.join(".")}
          label={InputLabel}
          onChange={(e) => {
            handleChange(e, schemaType);
            handleValidate(e, validate.getI256Error);
          }}
          fieldSize="md"
        />
      );
    case "Bool":
      return (
        <Select
          {...sharedProps}
          key={path.join(".")}
          label={InputLabel}
          fieldSize="md"
          onChange={(e) => {
            handleChange(e, schemaType);
          }}
        >
          <option key="bool-empty" value="" disabled={!isOptional}>
            Select
          </option>
          <option key="bool-true" value="true">
            true
          </option>
          <option key="bool-false" value="false">
            false
          </option>
        </Select>
      );
    case "ScString":
    case "ScSymbol":
      return (
        <Input
          {...sharedProps}
          key={path.join(".")}
          label={InputLabel}
          onChange={(e) => {
            handleChange(e, schemaType);
            handleValidate(e);
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
          label={InputLabel}
          onChange={(e) => {
            handleChange(e, schemaType);
            handleValidate(e, validate.getDataUrlError);
          }}
          fieldSize="md"
        />
      );
    default:
      return null;
  }
};
