import React from "react";
import { Input } from "@stellar/design-system";

import { ExpandBox } from "@/components/ExpandBox";
import { RadioPicker } from "@/components/RadioPicker";
import { PubKeyPicker } from "@/components/FormElements/PubKeyPicker";

import { AssetObject, AssetObjectValue } from "@/types/types";

type AssetPickerProps = {
  id: string;
  label: string;
  labelSuffix?: string | React.ReactNode;
  value: AssetObjectValue | undefined;
  error: { code: string | undefined; issuer: string | undefined } | undefined;
  note?: React.ReactNode;
  onChange: (asset: AssetObjectValue | undefined) => void;
  assetInput: "issued" | "alphanumeric";
  fitContent?: boolean;
  includeNative?: boolean;
};

export const AssetPicker = ({
  id,
  label,
  labelSuffix,
  value = { type: undefined, code: "", issuer: "" },
  error,
  note,
  onChange,
  assetInput,
  fitContent,
  includeNative = true,
}: AssetPickerProps) => {
  let options: AssetObject[] = [];

  if (includeNative) {
    options = [
      {
        id: "native",
        label: "Native",
        value: {
          type: "native",
          code: "",
          issuer: "",
        },
      },
      ...options,
    ];
  }

  if (assetInput === "alphanumeric") {
    options = [
      ...options,
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
  } else {
    options = [
      ...options,
      {
        id: "issued",
        label: "Issued",
        value: {
          type: "issued",
          code: "",
          issuer: "",
        },
      },
    ];
  }

  return (
    <div className="RadioPicker__inset">
      <RadioPicker
        id={id}
        selectedOption={value.type}
        label={label}
        labelSuffix={labelSuffix}
        onChange={(optionId) => {
          onChange({ type: optionId, code: "", issuer: "" });
        }}
        options={options}
        fitContent={fitContent}
      />

      <ExpandBox
        isExpanded={Boolean(
          value.type &&
            ["issued", "credit_alphanum4", "credit_alphanum12"].includes(
              value.type,
            ),
        )}
        offsetTop="sm"
      >
        <AssetPickerFields
          id={id}
          code={{
            value: value.code,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
              onChange({ ...value, code: e.target.value });
            },
            error: error?.code || "",
          }}
          issuer={{
            value: value.issuer,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
              onChange({ ...value, issuer: e.target.value });
            },
            error: error?.issuer || "",
          }}
        />
      </ExpandBox>

      {note ? (
        <div className="FieldNote FieldNote--note FieldNote--md">{note}</div>
      ) : null}
    </div>
  );
};

type AssetPickerFieldsProps = {
  id: string;
  code: {
    value: string;
    error: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  };
  issuer: {
    value: string;
    error: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
      error={code.error}
    />
    <PubKeyPicker
      id={`${id}-issuer`}
      label="Issuer Account ID"
      placeholder="Example: GCEXAMPLE5HWNK4AYSTEQ4UWDKHTCKADVS2AHF3UI2ZMO3DPUSM6Q4UG"
      value={issuer.value}
      onChange={issuer.onChange}
      error={issuer.error}
    />
  </div>
);
