import { AssetPicker } from "@/components/FormElements/AssetPicker";
import { PubKeyPicker } from "@/components/FormElements/PubKeyPicker";

import { parseJsonString } from "@/helpers/parseJsonString";
import { validate } from "@/validate";
import { AnyObject, AssetObjectValue } from "@/types/types";
import { OrderPicker } from "@/components/FormElements/OrderPicker";
import { CursorPicker } from "@/components/FormElements/CursorPicker";
import { LimitPicker } from "@/components/FormElements/LimitPicker";

type TemplateRenderProps = {
  value: string | undefined;
  error: string | undefined;
  onChange: (val: any) => void;
  isRequired?: boolean;
};

type TemplateRenderAssetProps = {
  value: AssetObjectValue | undefined;
  error: { code: string | undefined; issuer: string | undefined } | undefined;
  onChange: (asset: AssetObjectValue | undefined) => void;
  isRequired?: boolean;
};

type TemplateRenderOrderProps = {
  value: string | undefined;
  onChange: (optionId: string | undefined, optionValue?: string) => void;
  isRequired?: boolean;
};

type FormComponentTemplate = {
  render: (...args: any[]) => JSX.Element;
  validate: ((...args: any[]) => any) | null;
};

export const formComponentTemplate = (
  id: string,
  custom?: AnyObject,
): FormComponentTemplate | null => {
  switch (id) {
    case "account_id":
      return {
        render: (templ: TemplateRenderProps) => (
          <PubKeyPicker
            key={id}
            id={id}
            label="Account ID"
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            value={templ.value || ""}
            error={templ.error}
            onChange={templ.onChange}
          />
        ),
        validate: validate.publicKey,
      };
    case "asset":
      return {
        render: (templ: TemplateRenderAssetProps) => (
          <AssetPicker
            key={id}
            assetInput={custom?.assetInput}
            id="asset"
            label="Asset"
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            value={parseJsonString(templ.value)}
            error={templ.error}
            includeNone={custom?.includeNone}
            includeNative={custom?.includeNative}
            onChange={templ.onChange}
          />
        ),
        validate: validate.asset,
      };
    case "cursor":
      return {
        render: (templ: TemplateRenderProps) => (
          <CursorPicker
            key={id}
            id={id}
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            value={templ.value || ""}
            error={templ.error}
            onChange={templ.onChange}
          />
        ),
        validate: null,
      };
    case "limit":
      return {
        render: (templ: TemplateRenderProps) => (
          <LimitPicker
            key={id}
            id={id}
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            value={templ.value || ""}
            error={templ.error}
            onChange={templ.onChange}
          />
        ),
        validate: validate.positiveInt,
      };
    case "order":
      return {
        render: (templ: TemplateRenderOrderProps) => (
          <OrderPicker
            key={id}
            id={id}
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            selectedOption={templ.value}
            onChange={templ.onChange}
          />
        ),
        validate: null,
      };
    case "signer":
      return {
        render: (templ: TemplateRenderProps) => (
          <PubKeyPicker
            key={id}
            id={id}
            label="Signer"
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            value={templ.value || ""}
            error={templ.error}
            onChange={templ.onChange}
          />
        ),
        validate: validate.publicKey,
      };
    case "sponsor":
      return {
        render: (templ: TemplateRenderProps) => (
          <PubKeyPicker
            key={id}
            id={id}
            label="Sponsor"
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            value={templ.value || ""}
            error={templ.error}
            onChange={templ.onChange}
          />
        ),
        validate: validate.publicKey,
      };
    default:
      return null;
  }
};
