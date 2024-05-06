import { JSX } from "react";

import { PubKeyPicker } from "@/components/FormElements/PubKeyPicker";
import { TextPicker } from "@/components/FormElements/TextPicker";
import { AssetPicker } from "@/components/FormElements/AssetPicker";

import { validate } from "@/validate";
import { AssetObjectValue } from "@/types/types";

// Types
type TemplateRenderProps = {
  value: string | undefined;
  error: string | undefined;
  onChange: (val: any) => void;
  isRequired?: boolean;
};

type TemplateRenderAssetProps = {
  value: AssetPickerInput | undefined;
  error: { code: string | undefined; issuer: string | undefined } | undefined;
  onChange: (asset: AssetObjectValue | undefined) => void;
  isRequired?: boolean;
};

type FormComponentTemplateTxnOpsProps = {
  render: (...args: any[]) => JSX.Element;
  validate: ((...args: any[]) => any) | null;
};

type AssetPickerInput =
  | "native"
  | {
      credit_alphanum4: {
        asset_code: string;
        issuer: string;
      };
    }
  | {
      credit_alphanum12: {
        asset_code: string;
        issuer: string;
      };
    };

const assetPickerValue = (
  value: AssetPickerInput | undefined,
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

export const formComponentTemplateTxnOps = (
  id: string,
): FormComponentTemplateTxnOpsProps | null => {
  switch (id) {
    case "amount":
      return {
        render: (templ: TemplateRenderProps) => (
          <TextPicker
            key={id}
            id={id}
            label="Amount"
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            value={templ.value || ""}
            error={templ.error}
            onChange={templ.onChange}
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
        validate: validate.asset,
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
