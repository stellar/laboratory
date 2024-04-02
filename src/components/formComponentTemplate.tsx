import { JSX } from "react";

import { AssetPicker } from "@/components/FormElements/AssetPicker";
import { PubKeyPicker } from "@/components/FormElements/PubKeyPicker";
import { OrderPicker } from "@/components/FormElements/OrderPicker";
import { CursorPicker } from "@/components/FormElements/CursorPicker";
import { LimitPicker } from "@/components/FormElements/LimitPicker";
import { TextPicker } from "@/components/FormElements/TextPicker";
import { PositiveIntPicker } from "@/components/FormElements/PositiveIntPicker";
import { IncludeFailedPicker } from "@/components/FormElements/IncludeFailedPicker";
import { XdrPicker } from "@/components/FormElements/XdrPicker";

import { parseJsonString } from "@/helpers/parseJsonString";
import { validate } from "@/validate";
import { AnyObject, AssetObjectValue } from "@/types/types";

type TemplateRenderProps = {
  value: string | undefined;
  error: string | undefined;
  // eslint-disable-next-line no-unused-vars
  onChange: (val: any) => void;
  isRequired?: boolean;
};

type TemplateRenderAssetProps = {
  value: AssetObjectValue | undefined;
  error: { code: string | undefined; issuer: string | undefined } | undefined;
  // eslint-disable-next-line no-unused-vars
  onChange: (asset: AssetObjectValue | undefined) => void;
  isRequired?: boolean;
};

type TemplateRenderOrderProps = {
  value: string | undefined;
  // eslint-disable-next-line no-unused-vars
  onChange: (optionId: string | undefined, optionValue?: string) => void;
  isRequired?: boolean;
};

type TemplateRenderIncludeFailedProps = {
  value: string | undefined;
  // eslint-disable-next-line no-unused-vars
  onChange: (optionId: string | undefined, optionValue?: boolean) => void;
  isRequired?: boolean;
};

type FormComponentTemplate = {
  // eslint-disable-next-line no-unused-vars
  render: (...args: any[]) => JSX.Element;
  // eslint-disable-next-line no-unused-vars
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
            includeNative={custom?.includeNative}
            onChange={templ.onChange}
          />
        ),
        validate: validate.asset,
      };
    case "asset_code":
      return {
        render: (templ: TemplateRenderProps) => (
          <TextPicker
            key={id}
            id={id}
            label="Asset Code"
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            value={templ.value || ""}
            error={templ.error}
            onChange={templ.onChange}
          />
        ),
        validate: validate.assetCode,
      };
    case "asset_issuer":
      return {
        render: (templ: TemplateRenderProps) => (
          <PubKeyPicker
            key={id}
            id={id}
            label="Asset Issuer"
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            value={templ.value || ""}
            error={templ.error}
            onChange={templ.onChange}
          />
        ),
        validate: validate.publicKey,
      };
    case "base_asset":
      return {
        render: (templ: TemplateRenderAssetProps) => (
          <AssetPicker
            key={id}
            assetInput={custom?.assetInput}
            id="base_asset"
            label="Base Asset"
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            value={parseJsonString(templ.value)}
            error={templ.error}
            includeNative={custom?.includeNative}
            onChange={templ.onChange}
          />
        ),
        validate: validate.asset,
      };
    case "buying":
      return {
        render: (templ: TemplateRenderAssetProps) => (
          <AssetPicker
            key={id}
            assetInput={custom?.assetInput}
            id="buying"
            label="Buying"
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            value={parseJsonString(templ.value)}
            error={templ.error}
            includeNative={custom?.includeNative}
            onChange={templ.onChange}
          />
        ),
        validate: validate.asset,
      };
    case "buying_asset":
      return {
        render: (templ: TemplateRenderAssetProps) => (
          <AssetPicker
            key={id}
            assetInput={custom?.assetInput}
            id="buying_asset"
            label="Buying Asset"
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            value={parseJsonString(templ.value)}
            error={templ.error}
            includeNative={custom?.includeNative}
            onChange={templ.onChange}
          />
        ),
        validate: validate.asset,
      };
    case "claimable_balance_id":
      return {
        render: (templ: TemplateRenderProps) => (
          <TextPicker
            key={id}
            id={id}
            label="Claimable Balance ID"
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            value={templ.value || ""}
            error={templ.error}
            onChange={templ.onChange}
          />
        ),
        validate: null,
      };
    case "claimant":
      return {
        render: (templ: TemplateRenderProps) => (
          <PubKeyPicker
            key={id}
            id={id}
            label="Claimant"
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            value={templ.value || ""}
            error={templ.error}
            onChange={templ.onChange}
          />
        ),
        validate: validate.publicKey,
      };
    case "counter_asset":
      return {
        render: (templ: TemplateRenderAssetProps) => (
          <AssetPicker
            key={id}
            assetInput={custom?.assetInput}
            id="counter_asset"
            label="Counter Asset"
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            value={parseJsonString(templ.value)}
            error={templ.error}
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
    case "end_time":
      return {
        render: (templ: TemplateRenderProps) => (
          <TextPicker
            key={id}
            id={id}
            label="End Time"
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            value={templ.value || ""}
            error={templ.error}
            onChange={templ.onChange}
          />
        ),
        validate: null,
      };
    case "include_failed":
      return {
        render: (templ: TemplateRenderIncludeFailedProps) => (
          <IncludeFailedPicker
            key={id}
            id={id}
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            selectedOption={templ.value}
            onChange={templ.onChange}
          />
        ),
        validate: null,
      };
    case "ledger":
      return {
        render: (templ: TemplateRenderProps) => (
          <PositiveIntPicker
            key={id}
            id={id}
            label="Ledger Sequence"
            placeholder="Ex: 1714814"
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            value={templ.value || ""}
            error={templ.error}
            onChange={templ.onChange}
          />
        ),
        validate: validate.positiveInt,
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
    case "liquidity_pool_id":
      return {
        render: (templ: TemplateRenderProps) => (
          <TextPicker
            key={id}
            id={id}
            label="Liquidity Pool ID"
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            placeholder="Ex: 67260c4c1807b262ff851b0a3fe141194936bb0215b2f77447f1df11998eabb9"
            value={templ.value || ""}
            error={templ.error}
            onChange={templ.onChange}
          />
        ),
        validate: null,
      };
    case "offer_id":
      return {
        render: (templ: TemplateRenderProps) => (
          <TextPicker
            key={id}
            id={id}
            label="Offer ID"
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            value={templ.value || ""}
            error={templ.error}
            onChange={templ.onChange}
          />
        ),
        validate: null,
      };
    case "operation":
      return {
        render: (templ: TemplateRenderProps) => (
          <PositiveIntPicker
            key={id}
            id={id}
            label="Operation ID"
            placeholder="Ex: 55834578945"
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
    case "resolution":
      return {
        render: (templ: TemplateRenderProps) => (
          <TextPicker
            key={id}
            id={id}
            label="Resolution"
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            value={templ.value || ""}
            error={templ.error}
            onChange={templ.onChange}
          />
        ),
        validate: null,
      };
    case "seller":
      return {
        render: (templ: TemplateRenderProps) => (
          <PubKeyPicker
            key={id}
            id={id}
            label="Seller"
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            value={templ.value || ""}
            error={templ.error}
            onChange={templ.onChange}
          />
        ),
        validate: validate.publicKey,
      };
    case "selling":
      return {
        render: (templ: TemplateRenderAssetProps) => (
          <AssetPicker
            key={id}
            assetInput={custom?.assetInput}
            id="selling"
            label="Selling"
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            value={parseJsonString(templ.value)}
            error={templ.error}
            includeNative={custom?.includeNative}
            onChange={templ.onChange}
          />
        ),
        validate: validate.asset,
      };
    case "selling_asset":
      return {
        render: (templ: TemplateRenderAssetProps) => (
          <AssetPicker
            key={id}
            assetInput={custom?.assetInput}
            id="selling_asset"
            label="Selling Asset"
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            value={parseJsonString(templ.value)}
            error={templ.error}
            includeNative={custom?.includeNative}
            onChange={templ.onChange}
          />
        ),
        validate: validate.asset,
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
    case "start_time":
      return {
        render: (templ: TemplateRenderProps) => (
          <TextPicker
            key={id}
            id={id}
            label="Start Time"
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            value={templ.value || ""}
            error={templ.error}
            onChange={templ.onChange}
          />
        ),
        validate: null,
      };
    case "transaction":
      return {
        render: (templ: TemplateRenderProps) => (
          <TextPicker
            key={id}
            id={id}
            label="Transaction Hash"
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            placeholder="Ex: 3389e9f0f1a65f19736cacf544c2e825313e8447f569233bb8db39aa607c8889"
            value={templ.value || ""}
            error={templ.error}
            onChange={templ.onChange}
          />
        ),
        validate: validate.transactionHash,
      };
    case "tx":
      return {
        render: (templ: TemplateRenderProps) => (
          <XdrPicker
            key={id}
            id={id}
            label="Transaction Envelope XDR"
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            value={templ.value || ""}
            error={templ.error}
            onChange={templ.onChange}
          />
        ),
        validate: validate.xdr,
      };
    default:
      return null;
  }
};
