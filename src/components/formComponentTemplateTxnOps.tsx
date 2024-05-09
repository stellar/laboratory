import { JSX } from "react";

import { PubKeyPicker } from "@/components/FormElements/PubKeyPicker";
import { TextPicker } from "@/components/FormElements/TextPicker";
import { AssetPicker } from "@/components/FormElements/AssetPicker";
import { PositiveIntPicker } from "@/components/FormElements/PositiveIntPicker";

import { validate } from "@/validate";
import { AnyObject, AssetObjectValue, JsonAsset } from "@/types/types";

// Types
type TemplateRenderProps = {
  value: string | undefined;
  error: string | undefined;
  onChange: (val: any) => void;
  isRequired?: boolean;
};

type TemplateRenderAssetProps = {
  value: JsonAsset | undefined;
  error: { code: string | undefined; issuer: string | undefined } | undefined;
  onChange: (asset: AssetObjectValue | undefined) => void;
  isRequired?: boolean;
};

type FormComponentTemplateTxnOpsProps = {
  render: (...args: any[]) => JSX.Element;
  validate: ((...args: any[]) => any) | null;
};

const assetPickerValue = (
  value: JsonAsset | undefined,
): AssetObjectValue | undefined => {
  if (!value) {
    return undefined;
  }

  if (value === "native") {
    return { type: "native", code: "", issuer: "" };
  }

  const type = Object.keys(value)[0] as keyof typeof value;
  const val = value[type] as {
    asset_code: string;
    issuer: string;
  };

  return {
    type,
    code: val.asset_code,
    issuer: val.issuer,
  };
};

export const formComponentTemplateTxnOps = ({
  param,
  opType,
  index,
  custom,
}: {
  param: string;
  opType: string;
  index: number;
  custom?: AnyObject;
}): FormComponentTemplateTxnOpsProps | null => {
  const id = `${index}-${opType}-${param}`;

  switch (param) {
    case "amount":
    case "buy_amount":
      return {
        render: (templ: TemplateRenderProps) => (
          <TextPicker
            key={id}
            id={id}
            label={custom?.label || "Amount"}
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            value={templ.value || ""}
            error={templ.error}
            onChange={templ.onChange}
            note={custom?.note}
          />
        ),
        validate: validate.amount,
      };
    case "asset":
      return {
        render: (templ: TemplateRenderAssetProps) => (
          <AssetPicker
            key={id}
            assetInput="alphanumeric"
            id={id}
            label="Asset"
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            value={assetPickerValue(templ.value)}
            error={templ.error}
            includeNative
            onChange={templ.onChange}
          />
        ),
        validate: validate.assetJson,
      };
    case "buying":
      return {
        render: (templ: TemplateRenderAssetProps) => (
          <AssetPicker
            key={id}
            assetInput="alphanumeric"
            id={id}
            label="Buying"
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            value={assetPickerValue(templ.value)}
            error={templ.error}
            includeNative
            onChange={templ.onChange}
          />
        ),
        validate: validate.assetJson,
      };
    case "destination":
      return {
        render: (templ: TemplateRenderProps) => (
          <PubKeyPicker
            key={id}
            id={id}
            label="Destination"
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            value={templ.value || ""}
            error={templ.error}
            onChange={templ.onChange}
          />
        ),
        validate: validate.publicKey,
      };
    case "offer_id":
      return {
        render: (templ: TemplateRenderProps) => (
          <PositiveIntPicker
            key={id}
            id={id}
            label={custom?.label || "Offer ID"}
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            value={templ.value || ""}
            error={templ.error}
            onChange={templ.onChange}
            note={custom?.note}
          />
        ),
        validate: validate.positiveInt,
      };
    case "price":
      return {
        render: (templ: TemplateRenderProps) => (
          <TextPicker
            key={id}
            id={id}
            label={custom?.label || "Price"}
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            value={templ.value || ""}
            error={templ.error}
            onChange={templ.onChange}
          />
        ),
        validate: validate.positiveNumber,
      };
    case "selling":
      return {
        render: (templ: TemplateRenderAssetProps) => (
          <AssetPicker
            key={id}
            assetInput="alphanumeric"
            id={id}
            label="Selling"
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            value={assetPickerValue(templ.value)}
            error={templ.error}
            includeNative
            onChange={templ.onChange}
          />
        ),
        validate: validate.assetJson,
      };
    case "source_account":
      return {
        render: (templ: TemplateRenderProps) => (
          <PubKeyPicker
            key={id}
            id={id}
            label="Source Account"
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            value={templ.value || ""}
            error={templ.error}
            onChange={templ.onChange}
          />
        ),
        validate: validate.publicKey,
      };
    case "starting_balance":
      return {
        render: (templ: TemplateRenderProps) => (
          <TextPicker
            key={id}
            id={id}
            label="Starting Balance"
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            value={templ.value || ""}
            error={templ.error}
            onChange={templ.onChange}
          />
        ),
        validate: validate.amount,
      };
    default:
      return null;
  }
};
