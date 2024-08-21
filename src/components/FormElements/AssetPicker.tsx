import React from "react";
import { Input } from "@stellar/design-system";

import { ExpandBox } from "@/components/ExpandBox";
import { RadioPicker } from "@/components/RadioPicker";
import { PubKeyPicker } from "@/components/FormElements/PubKeyPicker";
import { LiquidityPoolShares } from "@/components/FormElements/LiquidityPoolShares";

import {
  AssetError,
  AssetObject,
  AssetObjectValue,
  AssetPoolShareError,
  AssetPoolShareObjectValue,
} from "@/types/types";

type AssetPickerProps = {
  id: string;
  label: string;
  labelSuffix?: string | React.ReactNode;
  value: AssetObjectValue | AssetPoolShareObjectValue | undefined;
  error: AssetError | AssetPoolShareError | undefined;
  note?: React.ReactNode;
  onChange: (
    asset: AssetObjectValue | AssetPoolShareObjectValue | undefined,
  ) => void;
  assetInput: "issued" | "alphanumeric";
  fitContent?: boolean;
  includeNative?: boolean;
  includeLiquidityPoolShares?: boolean;
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
  includeLiquidityPoolShares,
}: AssetPickerProps) => {
  let options: AssetObject[] = [];

  const initAssetValue = {
    code: "",
    issuer: "",
  };

  const initPoolSharesValue: AssetPoolShareObjectValue = {
    type: "liquidity_pool_shares",
    asset_a: { ...initAssetValue, type: undefined },
    asset_b: { ...initAssetValue, type: undefined },
    fee: "30",
  };

  if (includeNative) {
    options = [
      {
        id: "native",
        label: "Native",
        value: {
          ...initAssetValue,
          type: "native",
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
          ...initAssetValue,
          type: "credit_alphanum4",
        },
      },
      {
        id: "credit_alphanum12",
        label: "Alphanumeric 12",
        value: {
          ...initAssetValue,
          type: "credit_alphanum12",
        },
      },
    ];

    if (includeLiquidityPoolShares) {
      options.push({
        id: "liquidity_pool_shares",
        label: "Liquidity pool shares",
        value: initPoolSharesValue,
      });
    }
  } else {
    options = [
      ...options,
      {
        id: "issued",
        label: "Issued",
        value: {
          ...initAssetValue,
          type: "issued",
        },
      },
    ];
  }

  const renderPickerFields = () => {
    if (value.type === "liquidity_pool_shares") {
      const poolShareValue = value as AssetPoolShareObjectValue;
      const poolShareError = error as AssetPoolShareError;

      return (
        <LiquidityPoolShares
          id={`${id}-lp`}
          value={poolShareValue}
          error={poolShareError}
          onChange={(poolShare: AssetPoolShareObjectValue | undefined) => {
            onChange(poolShare);
          }}
        />
      );
    }

    const assetValue = value as AssetObjectValue;
    const assetError = error as AssetError;

    return (
      <AssetPickerFields
        id={id}
        code={{
          value: assetValue.code,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            onChange({ ...assetValue, code: e.target.value });
          },
          error: assetError?.code || "",
        }}
        issuer={{
          value: assetValue.issuer,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            onChange({ ...assetValue, issuer: e.target.value });
          },
          error: assetError?.issuer || "",
        }}
      />
    );
  };

  return (
    <div className="RadioPicker__inset">
      <RadioPicker
        id={id}
        selectedOption={value.type}
        label={label}
        labelSuffix={labelSuffix}
        onChange={(optionId) => {
          const val =
            optionId === "liquidity_pool_shares"
              ? {
                  ...initPoolSharesValue,
                  type: optionId,
                }
              : { ...initAssetValue, type: optionId };

          onChange(val);
        }}
        options={options}
        fitContent={fitContent}
      />

      <ExpandBox
        isExpanded={Boolean(
          value.type &&
            [
              "issued",
              "credit_alphanum4",
              "credit_alphanum12",
              "liquidity_pool_shares",
            ].includes(value.type),
        )}
        offsetTop="sm"
      >
        {renderPickerFields()}
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
