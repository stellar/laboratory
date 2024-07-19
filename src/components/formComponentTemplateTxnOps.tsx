import { JSX } from "react";

import { Box } from "@/components/layout/Box";
import { SdsLink } from "@/components/SdsLink";

import { PubKeyPicker } from "@/components/FormElements/PubKeyPicker";
import { TextPicker } from "@/components/FormElements/TextPicker";
import { AssetPicker } from "@/components/FormElements/AssetPicker";
import { PositiveIntPicker } from "@/components/FormElements/PositiveIntPicker";
import { AssetMultiPicker } from "@/components/FormElements/AssetMultiPicker";
import { FlagFieldPicker } from "@/components/FormElements/FlagFieldPicker";
import { SignerPicker } from "@/components/FormElements/SignerPicker";
import { AuthorizePicker } from "@/components/FormElements/AuthorizePicker";
import { NumberFractionPicker } from "@/components/FormElements/NumberFractionPicker";
import { RevokeSponsorshipPicker } from "@/components/FormElements/RevokeSponsorshipPicker";
import { ClaimantsPicker } from "@/components/FormElements/ClaimantsPicker";

import { validate } from "@/validate";
import {
  AnyObject,
  AssetObjectValue,
  AssetPoolShareObjectValue,
  NumberFractionValue,
  OptionSigner,
  RevokeSponsorshipValue,
} from "@/types/types";

// Types
type TemplateRenderProps = {
  value: string | undefined;
  error: string | undefined;
  onChange: (val: any) => void;
  isRequired?: boolean;
};

type TemplateRenderAssetProps = {
  value: AssetObjectValue | undefined;
  error: { code: string | undefined; issuer: string | undefined } | undefined;
  onChange: (
    asset: AssetObjectValue | AssetPoolShareObjectValue | undefined,
  ) => void;
  isRequired?: boolean;
};

type TemplateRenderAssetMultiProps = {
  value: AssetObjectValue[];
  error: { code: string | undefined; issuer: string | undefined }[];
  onChange: (asset: AssetObjectValue[] | undefined) => void;
  isRequired?: boolean;
};

type TemplateRenderFlagFieldProps = {
  value: string[];
  onChange: (val: string[]) => void;
  isRequired?: boolean;
};

type TemplateRenderSignerProps = {
  value: OptionSigner | undefined;
  error: { key: string | undefined; weight: string | undefined } | undefined;
  onChange: (val: OptionSigner | undefined) => void;
  isRequired?: boolean;
};

type TemplateRenderNumberFractionProps = {
  value: NumberFractionValue | undefined;
  error: string | undefined;
  onChange: (val: NumberFractionValue | undefined) => void;
  isRequired?: boolean;
};

type TemplateRenderRevokeSponsorshipProps = {
  value: RevokeSponsorshipValue | undefined;
  error: AnyObject | undefined;
  onChange: (val: RevokeSponsorshipValue | undefined) => void;
  isRequired?: boolean;
};

type TemplateRenderClaimantsProps = {
  value: AnyObject[] | undefined;
  error: (AnyObject | undefined)[] | undefined;
  onChange: (val: AnyObject[] | undefined) => void;
  isRequired?: boolean;
};

type FormComponentTemplateTxnOpsProps = {
  render: (...args: any[]) => JSX.Element;
  validate: ((...args: any[]) => any) | null;
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
    case "send_amount":
    case "dest_min":
    case "send_max":
    case "dest_amount":
    case "max_amount_a":
    case "max_amount_b":
    case "min_amount_a":
    case "min_amount_b":
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
        validate: validate.getAmountError,
      };
    case "asset":
    case "send_asset":
    case "dest_asset":
      return {
        render: (templ: TemplateRenderAssetProps) => (
          <AssetPicker
            key={id}
            assetInput="alphanumeric"
            id={id}
            label={custom?.label ?? "Asset"}
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            value={templ.value}
            error={templ.error}
            note={custom?.note}
            includeNative={
              typeof custom?.includeNative === "undefined"
                ? true
                : custom?.includeNative
            }
            onChange={templ.onChange}
          />
        ),
        validate: validate.getAssetError,
      };
    case "assetCode":
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
            note={custom?.note}
          />
        ),
        validate: validate.getAssetCodeError,
      };
    case "authorize":
      return {
        render: (templ: TemplateRenderProps) => (
          <AuthorizePicker
            key={id}
            id={id}
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            onChange={templ.onChange}
            selectedOption={templ.value}
          />
        ),
        validate: null,
      };
    case "balance_id":
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
        validate: validate.getClaimableBalanceIdError,
      };
    case "bump_to":
      return {
        render: (templ: TemplateRenderProps) => (
          <PositiveIntPicker
            key={id}
            id={id}
            label="Bump To"
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            value={templ.value || ""}
            error={templ.error}
            onChange={templ.onChange}
          />
        ),
        validate: validate.getPositiveIntError,
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
            value={templ.value}
            error={templ.error}
            includeNative
            onChange={templ.onChange}
          />
        ),
        validate: validate.getAssetError,
      };
    case "claimants":
      return {
        render: (templ: TemplateRenderClaimantsProps) => (
          <ClaimantsPicker
            id={id}
            key={id}
            claimants={templ.value}
            onChange={templ.onChange}
            error={templ.error}
          />
        ),
        validate: validate.getClaimaintsError,
      };
    case "clear_flags":
      return {
        render: (templ: TemplateRenderFlagFieldProps) => (
          <FlagFieldPicker
            key={id}
            id={id}
            selectedOptions={templ.value || []}
            label="Clear Flags"
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            note={
              <>
                Selected{" "}
                <SdsLink href="https://en.wikipedia.org/wiki/Flag_field">
                  flags
                </SdsLink>{" "}
                mean to remove selected flags already present on the account.
              </>
            }
            onChange={templ.onChange}
            options={custom?.options}
          />
        ),
        validate: null,
      };
    case "data_name":
      return {
        render: (templ: TemplateRenderProps) => (
          <TextPicker
            key={id}
            id={id}
            label="Entry name"
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            value={templ.value || ""}
            error={templ.error}
            onChange={templ.onChange}
          />
        ),
        validate: validate.getDataNameError,
      };
    case "data_value":
      return {
        render: (templ: TemplateRenderProps) => (
          <TextPicker
            key={id}
            id={id}
            label="Entry value"
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            value={templ.value || ""}
            error={templ.error}
            onChange={templ.onChange}
            note={
              custom?.note && custom?.note_add ? (
                <>
                  {custom.note}
                  <br />
                  {custom.note_add}
                </>
              ) : (
                custom?.note
              )
            }
          />
        ),
        validate: validate.getDataValueError,
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
    case "from":
      return {
        render: (templ: TemplateRenderProps) => (
          <PubKeyPicker
            key={id}
            id={id}
            label="From"
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            value={templ.value || ""}
            error={templ.error}
            onChange={templ.onChange}
          />
        ),
        validate: validate.getPublicKeyError,
      };
    case "home_domain":
      return {
        render: (templ: TemplateRenderProps) => (
          <TextPicker
            key={id}
            id={id}
            label="Home Domain"
            placeholder="Ex: example.com"
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            value={templ.value || ""}
            error={templ.error}
            onChange={templ.onChange}
            infoLink="https://developers.stellar.org/docs/glossary#home-domain"
          />
        ),
        validate: null,
      };
    case "inflation_dest":
      return {
        render: (templ: TemplateRenderProps) => (
          <PubKeyPicker
            key={id}
            id={id}
            label="Inflation Destination"
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            value={templ.value || ""}
            error={templ.error}
            onChange={templ.onChange}
            infoLink="https://developers.stellar.org/docs/learn/encyclopedia/inflation"
          />
        ),
        validate: validate.getPublicKeyError,
      };
    case "limit":
      return {
        render: (templ: TemplateRenderProps) => (
          <PositiveIntPicker
            key={id}
            id={id}
            label={custom?.label || "Trust Limit"}
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            value={templ.value || ""}
            error={templ.error}
            onChange={templ.onChange}
            note={
              custom?.note && custom?.note_add ? (
                <>
                  {custom.note}
                  <br />
                  {custom.note_add}
                </>
              ) : (
                custom?.note
              )
            }
            infoLink={custom?.infoLink}
          />
        ),
        validate: validate.getPositiveNumberError,
      };
    case "line":
      return {
        render: (templ: TemplateRenderAssetProps) => (
          <AssetPicker
            key={id}
            assetInput="alphanumeric"
            id={id}
            label="Asset"
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            value={templ.value}
            error={templ.error}
            includeNative={false}
            includeLiquidityPoolShares
            onChange={templ.onChange}
          />
        ),
        validate: validate.getAssetError,
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
    case "master_weight":
    case "low_threshold":
    case "med_threshold":
    case "high_threshold":
      return {
        render: (templ: TemplateRenderProps) => (
          <Box gap="xs">
            <PositiveIntPicker
              key={id}
              id={id}
              label={custom?.label || "Threshold"}
              labelSuffix={!templ.isRequired ? "optional" : undefined}
              placeholder="0 - 255"
              value={templ.value || ""}
              error={templ.error}
              onChange={templ.onChange}
              note={custom?.note}
              infoLink={custom?.infoLink}
            />
            <>
              {custom?.showWarning ? (
                <div className="FieldNote FieldNote--error FieldNote--md">
                  This can result in a permanently locked account. Are you sure
                  you know what you’re doing?
                </div>
              ) : null}
            </>
          </Box>
        ),
        validate: validate.getAccountThresholdError,
      };
    case "min_price":
    case "max_price":
      return {
        render: (templ: TemplateRenderNumberFractionProps) => (
          <NumberFractionPicker
            key={id}
            id={id}
            label={custom?.label}
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            value={templ.value || undefined}
            error={templ.error}
            onChange={templ.onChange}
            note={custom?.note}
          />
        ),
        validate: validate.getNumberFractionError,
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
        validate: validate.getPositiveIntError,
      };
    case "path":
      return {
        render: (templ: TemplateRenderAssetMultiProps) => (
          <AssetMultiPicker
            key={id}
            id={id}
            label="Intermediate Path"
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            assetInput="alphanumeric"
            values={templ.value}
            error={templ.error}
            onChange={templ.onChange}
            customButtonLabel="intermediate asset"
          />
        ),
        validate: validate.getAssetMultiError,
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
        validate: validate.getPositiveNumberError,
      };
    // Custom operation
    case "revokeSponsorship":
      return {
        render: (templ: TemplateRenderRevokeSponsorshipProps) => (
          <RevokeSponsorshipPicker
            key={id}
            id={id}
            value={templ.value}
            onChange={templ.onChange}
            error={templ.error}
          />
        ),
        validate: validate.getRevokeSponsorshipError,
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
            value={templ.value}
            error={templ.error}
            includeNative
            onChange={templ.onChange}
          />
        ),
        validate: validate.getAssetError,
      };
    case "set_flags":
      return {
        render: (templ: TemplateRenderFlagFieldProps) => (
          <FlagFieldPicker
            key={id}
            id={id}
            selectedOptions={templ.value || []}
            label="Set Flags"
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            note={
              <>
                Selected{" "}
                <SdsLink href="https://en.wikipedia.org/wiki/Flag_field">
                  flags
                </SdsLink>{" "}
                mean to add selected flags in addition to flags already present
                on the account.
              </>
            }
            onChange={templ.onChange}
            options={custom?.options}
          />
        ),
        validate: null,
      };
    case "signer":
      return {
        render: (templ: TemplateRenderSignerProps) => (
          <SignerPicker
            key={id}
            id={id}
            label="Signer Type"
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            value={templ.value}
            error={templ.error}
            onChange={templ.onChange}
            note="Used to add/remove or adjust weight of an additional signer on the account."
            infoLink="https://developers.stellar.org/docs/encyclopedia/signatures-multisig#multisig"
          />
        ),
        validate: validate.getOptionsSignerError,
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
        validate: validate.getPublicKeyError,
      };
    case "sponsored_id":
      return {
        render: (templ: TemplateRenderProps) => (
          <PubKeyPicker
            key={id}
            id={id}
            label="Sponsored ID"
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
            label="Starting Balance"
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            value={templ.value || ""}
            error={templ.error}
            onChange={templ.onChange}
          />
        ),
        validate: validate.getAmountError,
      };
    case "trustor":
      return {
        render: (templ: TemplateRenderProps) => (
          <PubKeyPicker
            key={id}
            id={id}
            label="Trustor"
            labelSuffix={!templ.isRequired ? "optional" : undefined}
            value={templ.value || ""}
            error={templ.error}
            onChange={templ.onChange}
          />
        ),
        validate: validate.getPublicKeyError,
      };
    default:
      return null;
  }
};
