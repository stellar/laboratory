import React, { useState } from "react";
import { Input } from "@stellar/design-system";

import { ExpandBox } from "@/components/ExpandBox";
import { RadioPicker } from "@/components/RadioPicker";
import { PubKeyPicker } from "@/components/FormElements/PubKeyPicker";

import {
  AssetObject,
  AssetObjectValue,
  AssetString,
  AssetType,
} from "@/types/types";

type AssetPickerProps = (
  | {
      variant: "string";
      value: string | undefined;
      includeNone?: boolean;
      includeNative?: undefined;
      onChange: (
        // eslint-disable-next-line no-unused-vars
        optionId: AssetType | undefined,
        // eslint-disable-next-line no-unused-vars
        optionValue: string | undefined,
      ) => void;
    }
  | {
      variant: "object";
      value: AssetObjectValue | undefined;
      includeNone?: undefined;
      includeNative?: boolean;
      onChange: (
        // eslint-disable-next-line no-unused-vars
        optionId: AssetType | undefined,
        // eslint-disable-next-line no-unused-vars
        optionValue: AssetObjectValue | undefined,
      ) => void;
    }
) & {
  id: string;
  selectedOption: AssetType | undefined;
  label: string;
  labelSuffix?: string | React.ReactNode;
  fitContent?: boolean;
};

export const AssetPicker = ({
  id,
  variant,
  selectedOption,
  label,
  value,
  includeNone,
  includeNative = true,
  onChange,
  labelSuffix,
  fitContent,
}: AssetPickerProps) => {
  const initErrorState = {
    code: "",
    issuer: "",
  };

  const getInitialValue = () => {
    if (variant === "string") {
      const assetString = value?.split(":");
      return {
        type: undefined,
        code: assetString?.[0] ?? "",
        issuer: assetString?.[1] ?? "",
      };
    }

    return {
      type: value?.type,
      code: value?.code ?? "",
      issuer: value?.issuer ?? "",
    };
  };

  const [stateValue, setStateValue] = useState(getInitialValue());
  const [error, setError] = useState(initErrorState);

  let stringOptions: AssetString[] = [
    {
      id: "native",
      label: "Native",
      value: "native",
    },
    {
      id: "issued",
      label: "Issued",
      value: "",
    },
  ];

  if (includeNone) {
    stringOptions = [
      {
        id: "none",
        label: "None",
        value: "",
      },
      ...stringOptions,
    ];
  }

  let objectOptions: AssetObject[] = [
    {
      id: "credit_alphanum4",
      label: "Alphanumeric 4",
      value: {
        type: "credit_alphanum4",
        code: "",
        issuer: "",
      },
    },
    {
      id: "credit_alphanum12",
      label: "Alphanumeric 12",
      value: {
        type: "credit_alphanum12",
        code: "",
        issuer: "",
      },
    },
    // TODO: add Liquidity Pool shares (for Change Trust operation)
  ];

  if (includeNative) {
    objectOptions = [
      {
        id: "native",
        label: "Native",
        value: {
          type: "native",
          code: "",
          issuer: "",
        },
      },
      ...objectOptions,
    ];
  }

  // Extra helper function to make TypeScript happy to get the right type
  const handleOnChange = (
    id: AssetType | undefined,
    value: string | AssetObjectValue | undefined,
  ) => {
    if (!value) {
      onChange(id, undefined);
    }

    if (variant === "string") {
      onChange(id, value as string);
    } else {
      onChange(id, value as AssetObjectValue);
    }
  };

  const handleOptionChange = (
    optionId: AssetType | undefined,
    optionValue: string | AssetObjectValue | undefined,
  ) => {
    handleOnChange(optionId, optionValue);
    setStateValue({ type: optionId, code: "", issuer: "" });
    setError(initErrorState);
  };

  const validateCode = (code: string, assetType: AssetType | undefined) => {
    if (!code) {
      return "Asset code is required.";
    }

    let minLength;
    let maxLength;

    switch (assetType) {
      case "credit_alphanum4":
        minLength = 1;
        maxLength = 4;
        break;
      case "credit_alphanum12":
        minLength = 5;
        maxLength = 12;
        break;
      default:
        minLength = 1;
        maxLength = 12;
    }

    if (!code.match(/^[a-zA-Z0-9]+$/g)) {
      return "Asset code must consist of only letters and numbers.";
    } else if (code.length < minLength || code.length > maxLength) {
      return `Asset code must be between ${minLength} and ${maxLength} characters long.`;
    }

    return undefined;
  };

  const handleCodeError = (value: string) => {
    const codeError = validateCode(value, stateValue.type);
    setError({ ...error, code: codeError || "" });
    return codeError;
  };

  return (
    <div className="RadioPicker__inset">
      <RadioPicker
        id={id}
        selectedOption={selectedOption}
        label={label}
        labelSuffix={labelSuffix}
        onChange={handleOptionChange}
        options={variant === "string" ? stringOptions : objectOptions}
        fitContent={fitContent}
      />

      <ExpandBox
        isExpanded={Boolean(
          selectedOption &&
            ["issued", "credit_alphanum4", "credit_alphanum12"].includes(
              selectedOption,
            ),
        )}
      >
        <AssetPickerFields
          id={id}
          code={{
            value: stateValue.code,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
              setStateValue({ ...stateValue, code: e.target.value });
              handleCodeError(e.target.value);
            },
            onBlur: (e) => {
              const codeError = handleCodeError(e.target.value);

              if (!codeError && stateValue.issuer) {
                handleOnChange(
                  selectedOption,
                  variant === "string"
                    ? `${stateValue.code}:${stateValue.issuer}`
                    : stateValue,
                );
              }
            },
            error: error.code,
          }}
          issuer={{
            value: stateValue.issuer,
            onChange: (value: string, issuerError: string) => {
              setStateValue({ ...stateValue, issuer: value });
              setError({ ...error, issuer: issuerError });
            },
            onBlur: (value, issuerError) => {
              setError({ ...error, issuer: issuerError });

              if (!issuerError && stateValue.code) {
                handleOnChange(
                  selectedOption,
                  variant === "string"
                    ? `${stateValue.code}:${value}`
                    : stateValue,
                );
              }
            },
            error: error.issuer,
          }}
        />
      </ExpandBox>
    </div>
  );
};

type AssetPickerFieldsProps = {
  id: string;
  code: {
    value: string;
    error: string;
    // eslint-disable-next-line no-unused-vars
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    // eslint-disable-next-line no-unused-vars
    onBlur: (e: React.ChangeEvent<HTMLInputElement>) => void;
  };
  issuer: {
    value: string;
    error: string;
    // eslint-disable-next-line no-unused-vars
    onChange: (value: string, issuerError: string) => void;
    // eslint-disable-next-line no-unused-vars
    onBlur: (value: string, issuerError: string) => void;
  };
};

const AssetPickerFields = ({ id, code, issuer }: AssetPickerFieldsProps) => (
  <div className="RadioPicker__inset">
    <Input
      id={`${id}-code`}
      fieldSize="md"
      label="Asset Code"
      value={code.value}
      onChange={code.onChange}
      onBlur={code.onBlur}
      error={code.error}
    />
    <PubKeyPicker
      id={`${id}-issuer`}
      label="Issuer Account ID"
      placeholder="Example: GCEXAMPLE5HWNK4AYSTEQ4UWDKHTCKADVS2AHF3UI2ZMO3DPUSM6Q4UG"
      value={issuer.value}
      onChange={issuer.onChange}
      onBlur={issuer.onBlur}
      error={issuer.error}
    />
  </div>
);
