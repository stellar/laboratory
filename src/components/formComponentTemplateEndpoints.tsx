import { JSX } from "react";
import { Select, Textarea } from "@stellar/design-system";

import { AssetPicker } from "@/components/FormElements/AssetPicker";
import { PubKeyPicker } from "@/components/FormElements/PubKeyPicker";
import { OrderPicker } from "@/components/FormElements/OrderPicker";
import { CursorPicker } from "@/components/FormElements/CursorPicker";
import { LedgerSeqPicker } from "@/components/FormElements/LedgerSeqPicker";
import { LimitPicker } from "@/components/FormElements/LimitPicker";
import { TextPicker } from "@/components/FormElements/TextPicker";
import { PositiveIntPicker } from "@/components/FormElements/PositiveIntPicker";
import { IncludeFailedPicker } from "@/components/FormElements/IncludeFailedPicker";
import { XdrPicker } from "@/components/FormElements/XdrPicker";
import { AssetMultiPicker } from "@/components/FormElements/AssetMultiPicker";
import { FiltersPicker } from "@/components/FormElements/FiltersPicker";
import { MultiLedgerEntriesPicker } from "@/components/FormElements/XdrLedgerKeyPicker";
import { ConfigSettingIdPicker } from "@/components/FormElements/ConfigSettingIdPicker";
import { RadioPicker } from "@/components/RadioPicker";

import { parseJsonString } from "@/helpers/parseJsonString";
import { removeLeadingZeroes } from "@/helpers/removeLeadingZeroes";

import { validate } from "@/validate";
import {
  AnyObject,
  AssetObjectValue,
  AssetPoolShareObjectValue,
  AssetSinglePoolShareValue,
} from "@/types/types";

type TemplateRenderProps = {
  value: string | undefined;
  error: string | undefined;
  onChange: (val: any) => void;
  isRequired?: boolean;
  disabled?: boolean;
  isReadOnly?: boolean;
};

type TemplateRenderAssetProps = {
  value: AssetObjectValue | undefined;
  error: { code: string | undefined; issuer: string | undefined } | undefined;
  onChange: (
    asset:
      | AssetObjectValue
      | AssetPoolShareObjectValue
      | AssetSinglePoolShareValue
      | undefined,
  ) => void;
  isRequired?: boolean;
  disabled?: boolean;
  isReadOnly?: boolean;
};

type TemplateRenderAssetMultiProps = {
  values: AssetObjectValue[] | undefined;
  error: { code: string | undefined; issuer: string | undefined }[] | undefined;
  onChange: (asset: AssetObjectValue[] | undefined) => void;
  isRequired?: boolean;
};

type TemplateRenderOrderProps = {
  value: string | undefined;
  onChange: (optionId: string | undefined, optionValue?: string) => void;
  isRequired?: boolean;
};

type TemplateRenderIncludeFailedProps = {
  value: string | undefined;
  onChange: (optionId: string | undefined, optionValue?: boolean) => void;
  isRequired?: boolean;
};

type TemplateRenderTxProps = {
  value: string | undefined;
  error:
    | { result: string; message: "string"; originalError?: string }
    | undefined;
  onChange: (val: any) => void;
  isRequired?: boolean;
};

type FormComponentTemplateEndpointsProps = {
  render: (...args: any[]) => JSX.Element;
  validate: ((...args: any[]) => any) | null;
};

export const formComponentTemplateEndpoints = (
  id: string,
  custom?: AnyObject,
): FormComponentTemplateEndpointsProps | null => {
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
            disabled={templ.disabled || templ.isReadOnly}
            copyButton={templ.isReadOnly ? { position: "right" } : undefined}
          />
        ),
        validate: validate.getPublicKeyError,
      };
    case "asset":
      return {
        render: (templ: TemplateRenderAssetProps) => (
          <AssetPicker
            key={id}
            assetInput={custom?.assetInput}
            id={id}
            label="Asset"
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            value={parseJsonString(templ.value)}
            error={templ.error}
            includeNative={custom?.includeNative}
            onChange={templ.onChange}
            includeSingleLiquidityPoolShare={
              custom?.includeSingleLiquidityPoolShare
            }
            disabled={templ.disabled || templ.isReadOnly}
            hasCopyButton={templ.isReadOnly}
          />
        ),
        validate: validate.getAssetError,
      };
    case "asset_code":
      return {
        render: (templ: TemplateRenderProps) => (
          <TextPicker
            key={id}
            id={id}
            label="Asset code"
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            value={templ.value || ""}
            error={templ.error}
            onChange={templ.onChange}
            disabled={templ.disabled}
          />
        ),
        validate: validate.getAssetCodeError,
      };
    case "asset_issuer":
      return {
        render: (templ: TemplateRenderProps) => (
          <PubKeyPicker
            key={id}
            id={id}
            label="Asset issuer"
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            value={templ.value || ""}
            error={templ.error}
            onChange={templ.onChange}
            disabled={templ.disabled}
          />
        ),
        validate: validate.getPublicKeyError,
      };
    case "base_asset":
      return {
        render: (templ: TemplateRenderAssetProps) => (
          <AssetPicker
            key={id}
            assetInput={custom?.assetInput}
            id={id}
            label="Base asset"
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            value={parseJsonString(templ.value)}
            error={templ.error}
            includeNative={custom?.includeNative}
            onChange={templ.onChange}
          />
        ),
        validate: validate.getAssetError,
      };
    case "buying":
      return {
        render: (templ: TemplateRenderAssetProps) => (
          <AssetPicker
            key={id}
            assetInput={custom?.assetInput}
            id={id}
            label="Buying"
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            value={parseJsonString(templ.value)}
            error={templ.error}
            includeNative={custom?.includeNative}
            onChange={templ.onChange}
          />
        ),
        validate: validate.getAssetError,
      };
    case "buying_asset":
      return {
        render: (templ: TemplateRenderAssetProps) => (
          <AssetPicker
            key={id}
            assetInput={custom?.assetInput}
            id={id}
            label="Buying asset"
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            value={parseJsonString(templ.value)}
            error={templ.error}
            includeNative={custom?.includeNative}
            onChange={templ.onChange}
          />
        ),
        validate: validate.getAssetError,
      };
    case "balance_id":
    case "claimable_balance_id":
      return {
        render: (templ: TemplateRenderProps) => (
          <TextPicker
            key={id}
            id={id}
            label="Claimable balance ID"
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            value={templ.value || ""}
            error={templ.error}
            onChange={templ.onChange}
            disabled={templ.disabled || templ.isReadOnly}
            copyButton={templ.isReadOnly ? { position: "right" } : undefined}
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
        validate: validate.getPublicKeyError,
      };
    case "config_setting_id":
      return {
        render: (templ: TemplateRenderProps) => (
          <ConfigSettingIdPicker
            key={id}
            id={id}
            value={templ.value || ""}
            error={templ.error}
            onChange={templ?.onChange}
            disabled={templ.disabled || templ.isReadOnly}
          />
        ),
        validate: null,
      };
    case "contract":
      return {
        render: (templ: {
          value: string | undefined;
          error: string | undefined;
          onChange: (val: any) => void;
          disabled?: boolean;
          isReadOnly?: boolean;
        }) => (
          <TextPicker
            key={id}
            id={id}
            label="Contract"
            placeholder="Ex: CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC"
            value={templ.value || ""}
            error={templ.error}
            onChange={templ.onChange}
            disabled={templ.disabled || templ.isReadOnly}
            copyButton={templ.isReadOnly ? { position: "right" } : undefined}
          />
        ),
        validate: validate.getContractIdError,
      };
    case "counter_asset":
      return {
        render: (templ: TemplateRenderAssetProps) => (
          <AssetPicker
            key={id}
            assetInput={custom?.assetInput}
            id={id}
            label="Counter asset"
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            value={parseJsonString(templ.value)}
            error={templ.error}
            includeNative={custom?.includeNative}
            onChange={templ.onChange}
          />
        ),
        validate: validate.getAssetError,
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
    case "data_name":
      return {
        render: (templ: {
          value: string | undefined;
          error: string | undefined;
          onChange: (val: any) => void;
          disabled?: boolean;
          isReadOnly?: boolean;
        }) => (
          <TextPicker
            key={id}
            id={id}
            label="Data name"
            value={templ.value || ""}
            error={templ.error}
            onChange={templ.onChange}
            disabled={templ.disabled || templ.isReadOnly}
            copyButton={templ.isReadOnly ? { position: "right" } : undefined}
          />
        ),
        validate: null,
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
        validate: validate.getPublicKeyError,
      };
    case "destination_account":
      return {
        render: (templ: TemplateRenderProps) => (
          <PubKeyPicker
            key={id}
            id={id}
            label="Destination account"
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            value={templ.value || ""}
            error={templ.error}
            onChange={templ.onChange}
          />
        ),
        validate: validate.getPublicKeyError,
      };
    case "destination_amount":
      return {
        render: (templ: TemplateRenderProps) => (
          <TextPicker
            key={id}
            id={id}
            label="Destination amount"
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            value={templ.value ? removeLeadingZeroes(templ.value) : ""}
            error={templ.error}
            onChange={templ.onChange}
          />
        ),
        validate: validate.getAmountError,
      };
    case "destination_asset":
      return {
        render: (templ: TemplateRenderAssetProps) => (
          <AssetPicker
            key={id}
            assetInput={custom?.assetInput}
            id={id}
            label="Destination asset"
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            value={parseJsonString(templ.value)}
            error={templ.error}
            includeNative={custom?.includeNative}
            onChange={templ.onChange}
          />
        ),
        validate: validate.getAssetError,
      };
    case "destination_assets":
      return {
        render: (templ: TemplateRenderAssetMultiProps) => (
          <AssetMultiPicker
            key={id}
            id={id}
            label="Destination assets"
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            assetInput="issued"
            values={templ.values}
            error={templ.error}
            onChange={templ.onChange}
          />
        ),
        validate: validate.getAssetMultiError,
      };
    case "durability":
      return {
        render: (templ: {
          value: string | undefined;
          error: string | undefined;
          onChange: (val: any) => void;
          disabled?: boolean;
          isReadOnly?: boolean;
        }) => (
          <RadioPicker
            key={id}
            id={`${id}-type`}
            label="Durability"
            selectedOption={templ.value || ""}
            onChange={templ.onChange}
            disabledOptions={
              templ.disabled || templ.isReadOnly
                ? ["persistent", "temporary"]
                : []
            }
            options={[
              { id: "persistent", label: "Persistent" },
              { id: "temporary", label: "Temporary" },
            ]}
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
            label="End time"
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
    // contract key
    case "key":
      return {
        render: (templ: {
          value: string | undefined;
          error: string | undefined;
          onChange: (val: any) => void;
          disabled?: boolean;
          isReadOnly?: boolean;
        }) => (
          <Textarea
            hasCopyButton={Boolean(templ.value && templ.isReadOnly)}
            fieldSize="md"
            key={id}
            id={id}
            label="Key (ScVal)"
            rows={10}
            placeholder={`{
              "vec": [
                {
                  "symbol": "Balance"
                },
                {
                  "address": "CDGAH7TU7UH3BXGYXRIXLJX63LYRIF6APZPIG64ZAW3NNDCPJ7AAWVTZ"
                }
              ]
            }`}
            // Convert object to string if needed
            value={
              typeof templ.value === "object"
                ? JSON.stringify(templ.value, null, 2)
                : templ.value || ""
            }
            error={templ.error}
            onChange={templ.onChange}
            disabled={templ.disabled || templ.isReadOnly}
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
            label="Ledger sequence"
            placeholder="Ex: 1714814"
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            value={templ.value || ""}
            error={templ.error}
            onChange={templ.onChange}
          />
        ),
        validate: validate.getPositiveIntError,
      };
    case "startLedger":
      return {
        render: (templ: TemplateRenderProps) => (
          <LedgerSeqPicker
            key={id}
            id={id}
            label="Start ledger sequence"
            placeholder="Ex: 1714814"
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            value={templ.value || ""}
            error={templ.error}
            onChange={templ.onChange}
          />
        ),
        validate: validate.getPositiveIntError,
      };
    case "endLedger":
      return {
        render: (templ: TemplateRenderProps) => (
          <PositiveIntPicker
            key={id}
            id={id}
            label="End ledger sequence"
            placeholder="Ex: 1714814"
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            value={templ.value || ""}
            error={templ.error}
            onChange={templ.onChange}
          />
        ),
        validate: validate.getPositiveIntError,
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
        validate: validate.getPositiveIntError,
      };
    case "liquidity_pool_id":
      return {
        render: (templ: TemplateRenderProps) => (
          <TextPicker
            key={id}
            id={id}
            label="Liquidity pool ID"
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            placeholder="Ex: LBTSMDCMDAD3EYX7QUNQUP7BIEMUSNV3AIK3F53UI7Y56EMZR2V3SREB"
            value={templ.value || ""}
            error={templ.error}
            onChange={templ.onChange}
            disabled={templ.disabled || templ.isReadOnly}
            copyButton={templ.isReadOnly ? { position: "right" } : undefined}
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
            disabled={templ.disabled || templ.isReadOnly}
            copyButton={templ.isReadOnly ? { position: "right" } : undefined}
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
        validate: validate.getPositiveIntError,
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
    case "reserves":
      return {
        render: (templ: TemplateRenderAssetMultiProps) => (
          <AssetMultiPicker
            key={id}
            id={id}
            label="Reserves"
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            assetInput="alphanumeric"
            values={templ.values}
            error={templ.error}
            onChange={templ.onChange}
            customButtonLabel="reserve"
          />
        ),
        validate: validate.getAssetMultiError,
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
    case "seller_id":
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
            disabled={templ.disabled || templ.isReadOnly}
            copyButton={templ.isReadOnly ? { position: "right" } : undefined}
          />
        ),
        validate: validate.getPublicKeyError,
      };
    case "selling":
      return {
        render: (templ: TemplateRenderAssetProps) => (
          <AssetPicker
            key={id}
            assetInput={custom?.assetInput}
            id={id}
            label="Selling"
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            value={parseJsonString(templ.value)}
            error={templ.error}
            includeNative={custom?.includeNative}
            onChange={templ.onChange}
          />
        ),
        validate: validate.getAssetError,
      };
    case "selling_asset":
      return {
        render: (templ: TemplateRenderAssetProps) => (
          <AssetPicker
            key={id}
            assetInput={custom?.assetInput}
            id={id}
            label="Selling asset"
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            value={parseJsonString(templ.value)}
            error={templ.error}
            includeNative={custom?.includeNative}
            onChange={templ.onChange}
          />
        ),
        validate: validate.getAssetError,
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
        validate: validate.getPublicKeyError,
      };
    case "source_account":
      return {
        render: (templ: TemplateRenderProps) => (
          <PubKeyPicker
            key={id}
            id={id}
            label="Source account"
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            value={templ.value || ""}
            error={templ.error}
            onChange={templ.onChange}
          />
        ),
        validate: validate.getPublicKeyError,
      };
    case "source_amount":
      return {
        render: (templ: TemplateRenderProps) => (
          <TextPicker
            key={id}
            id={id}
            label="Source amount"
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            value={templ.value ? removeLeadingZeroes(templ.value) : ""}
            error={templ.error}
            onChange={templ.onChange}
          />
        ),
        validate: validate.getAmountError,
      };
    case "source_asset":
      return {
        render: (templ: TemplateRenderAssetProps) => (
          <AssetPicker
            key={id}
            id={id}
            assetInput={custom?.assetInput}
            label="Source asset"
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            value={parseJsonString(templ.value)}
            error={templ.error}
            includeNative={custom?.includeNative}
            onChange={templ.onChange}
          />
        ),
        validate: validate.getAssetError,
      };
    case "source_assets":
      return {
        render: (templ: TemplateRenderAssetMultiProps) => (
          <AssetMultiPicker
            key={id}
            id={id}
            label="Source assets"
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            assetInput="issued"
            values={templ.values}
            error={templ.error}
            onChange={templ.onChange}
          />
        ),
        validate: validate.getAssetMultiError,
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
        validate: validate.getPublicKeyError,
      };
    case "starting_balance":
      return {
        render: (templ: TemplateRenderProps) => (
          <TextPicker
            key={id}
            id={id}
            label="Starting balance"
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            value={templ.value ? removeLeadingZeroes(templ.value) : ""}
            error={templ.error}
            onChange={templ.onChange}
          />
        ),
        validate: validate.getAmountError,
      };
    case "start_time":
      return {
        render: (templ: TemplateRenderProps) => (
          <TextPicker
            key={id}
            id={id}
            label="Start time"
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
            label="Transaction hash"
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            placeholder="Ex: 3389e9f0f1a65f19736cacf544c2e825313e8447f569233bb8db39aa607c8889"
            value={templ.value || ""}
            error={templ.error}
            onChange={templ.onChange}
          />
        ),
        validate: validate.getTransactionHashError,
      };
    case "contract_code":
      return {
        render: (templ: TemplateRenderProps) => (
          <TextPicker
            key={id}
            id={id}
            label="Wasm hash"
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            placeholder="Ex: f5c9668827b4783e1f87a7f6b7406f6c426b72e82f114654a724713e4e6c0de4"
            value={templ.value || ""}
            error={templ.error}
            onChange={templ.onChange}
          />
        ),
        validate: validate.getTransactionHashError,
      };
    case "hash":
      return {
        render: (templ: TemplateRenderProps) => (
          <TextPicker
            key={id}
            id={id}
            label="Wasm hash"
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            placeholder="Ex: 3389e9f0f1a65f19736cacf544c2e825313e8447f569233bb8db39aa607c8889"
            value={templ.value || ""}
            error={templ.error}
            onChange={templ.onChange}
            disabled={templ.disabled || templ.isReadOnly}
            copyButton={templ.isReadOnly ? { position: "right" } : undefined}
          />
        ),
        validate: validate.getTransactionHashError,
      };
    // Hash of the LedgerKey that is associated with this TTLEntry
    case "key_hash":
      return {
        render: (templ: TemplateRenderProps) => (
          <TextPicker
            key={id}
            id={id}
            label="Key hash"
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            placeholder="Ex: 3389e9f0f1a65f19736cacf544c2e825313e8447f569233bb8db39aa607c8889"
            value={templ.value || ""}
            error={templ.error}
            onChange={templ.onChange}
            disabled={templ.disabled || templ.isReadOnly}
            copyButton={templ.isReadOnly ? { position: "right" } : undefined}
          />
        ),
        validate: validate.getTransactionHashError,
      };
    case "tx":
      return {
        render: (templ: TemplateRenderTxProps) => (
          <XdrPicker
            key={id}
            id={id}
            label="Transaction envelope XDR"
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            value={templ.value || ""}
            error={templ.error?.result === "error" ? templ.error?.message : ""}
            onChange={templ.onChange}
          />
        ),
        validate: validate.getXdrError,
      };
    case "ledgerKeyEntries":
      return {
        render: (templ: TemplateRenderTxProps) => {
          return (
            <MultiLedgerEntriesPicker
              key={id}
              id={id}
              value={parseJsonString(templ.value)}
              onChange={templ?.onChange}
              allowMultiple
            />
          );
        },
        validate: null,
      };
    case "filters":
      return {
        render: (templ: TemplateRenderTxProps) => (
          <FiltersPicker
            key={id}
            id={id}
            value={parseJsonString(templ.value)}
            error={templ.error}
            onChange={templ?.onChange}
          />
        ),
        validate: validate.getEventsFiltersError,
      };
    case "resourceConfig":
      return {
        render: (templ: TemplateRenderProps) => (
          <PositiveIntPicker
            key={id}
            id={id}
            label="Resource config - instruction leeway"
            placeholder="Ex: 1714814"
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            value={templ.value || ""}
            error={templ.error}
            onChange={templ.onChange}
          />
        ),
        validate: validate.getPositiveIntError,
      };
    case "xdrFormat":
      return {
        render: (templ: {
          value: string | undefined;
          error: string | undefined;
          onChange: (val: any) => void;
        }) => (
          <RadioPicker
            key={id}
            id={`${id}-type`}
            label="XDR format"
            selectedOption={templ.value || ""}
            onChange={templ.onChange}
            options={[
              { id: "base64", label: "Base64" },
              { id: "json", label: "JSON" },
            ]}
          />
        ),
        validate: null,
      };
    case "authMode":
      return {
        render: (templ: {
          value: string | undefined;
          error: string | undefined;
          onChange: (val: any) => void;
        }) => (
          <Select
            key={id}
            id={id}
            fieldSize="md"
            label="Auth mode"
            labelSuffix="optional"
            value={templ.value || ""}
            onChange={templ.onChange}
          >
            {["none", "enforce", "record", "record_allow_nonroot"].map((i) => (
              <option key={i} id={i} value={i === "none" ? "" : i}>
                {i}
              </option>
            ))}
          </Select>
        ),
        validate: null,
      };
    default:
      return null;
  }
};
