import { Select } from "@stellar/design-system";

import { Box } from "@/components/layout/Box";
import { ExpandBox } from "@/components/ExpandBox";
import { PubKeyPicker } from "@/components/FormElements/PubKeyPicker";
import { AssetPicker } from "@/components/FormElements/AssetPicker";
import { PositiveIntPicker } from "@/components/FormElements/PositiveIntPicker";
import { TextPicker } from "@/components/FormElements/TextPicker";
import { SignerPicker } from "@/components/FormElements/SignerPicker";

import {
  AnyObject,
  RevokeSponsorshipValue,
  SponsorshipType,
} from "@/types/types";

type RevokeSponsorshipPickerProps = {
  id: string;
  value: RevokeSponsorshipValue | undefined;
  onChange: (value: RevokeSponsorshipValue | undefined) => void;
  error: AnyObject | undefined;
};

export const RevokeSponsorshipPicker = ({
  id,
  value,
  onChange,
  error,
}: RevokeSponsorshipPickerProps) => {
  const fields: { id: SponsorshipType; label: string }[] = [
    {
      id: "account",
      label: "Account",
    },
    {
      id: "trustline",
      label: "Trustline",
    },
    {
      id: "offer",
      label: "Offer",
    },
    {
      id: "data",
      label: "Data",
    },
    {
      id: "claimable_balance",
      label: "Claimable Balance",
    },
    {
      id: "signer",
      label: "Signer",
    },
  ];

  const initData = (type: string) => {
    switch (type) {
      case "account":
        return { account_id: undefined };
      case "trustline":
        return {
          account_id: undefined,
          asset: undefined,
        };
      case "offer":
        return {
          seller_id: undefined,
          offer_id: undefined,
        };
      case "data":
        return {
          account_id: undefined,
          data_name: undefined,
        };
      case "claimable_balance":
        return { balance_id: undefined };
      case "signer":
        return {
          account_id: undefined,
          signer_key: undefined,
        };
      default:
        return {};
    }
  };

  const getInputId = (type: string, inputId: string) =>
    `${id}-${type}-${inputId}`;

  const renderInputs = () => {
    if (!value?.type) {
      return null;
    }

    switch (value.type) {
      case "account":
        return (
          <Box gap="sm">
            <PubKeyPicker
              key={getInputId(value.type, "account_id")}
              id={getInputId(value.type, "account_id")}
              label="Account"
              value={value.data?.account_id || ""}
              error={error?.account_id}
              onChange={(e) => {
                onChange({ ...value, data: { account_id: e.target.value } });
              }}
            />
          </Box>
        );
      case "trustline":
        return (
          <Box gap="sm">
            <PubKeyPicker
              key={getInputId(value.type, "account_id")}
              id={getInputId(value.type, "account_id")}
              label="Account"
              value={value.data?.account_id || ""}
              error={error?.account_id}
              onChange={(e) => {
                onChange({
                  ...value,
                  data: { ...value.data, account_id: e.target.value },
                });
              }}
            />

            <AssetPicker
              key={getInputId(value.type, "asset")}
              id={getInputId(value.type, "asset")}
              assetInput="alphanumeric"
              label="Asset"
              value={value.data?.asset}
              error={error?.asset}
              includeNative={false}
              onChange={(asset) => {
                onChange({ ...value, data: { ...value.data, asset } });
              }}
            />
          </Box>
        );
      case "offer":
        return (
          <Box gap="sm">
            <PubKeyPicker
              key={getInputId(value.type, "seller_id")}
              id={getInputId(value.type, "seller_id")}
              label="Seller"
              value={value.data?.seller_id || ""}
              error={error?.seller_id}
              onChange={(e) => {
                onChange({
                  ...value,
                  data: { ...value.data, seller_id: e.target.value },
                });
              }}
            />

            <PositiveIntPicker
              key={getInputId(value.type, "offer_id")}
              id={getInputId(value.type, "offer_id")}
              label="Offer ID"
              value={value.data?.offer_id || ""}
              error={error?.offer_id}
              onChange={(e) => {
                onChange({
                  ...value,
                  data: { ...value.data, offer_id: e.target.value },
                });
              }}
              note="Offer ID is a number"
            />
          </Box>
        );
      case "data":
        return (
          <Box gap="sm">
            <PubKeyPicker
              key={getInputId(value.type, "account_id")}
              id={getInputId(value.type, "account_id")}
              label="Account"
              value={value.data?.account_id || ""}
              error={error?.account_id}
              onChange={(e) => {
                onChange({
                  ...value,
                  data: { ...value.data, account_id: e.target.value },
                });
              }}
            />

            <TextPicker
              key={getInputId(value.type, "data_name")}
              id={getInputId(value.type, "data_name")}
              label="Data name"
              value={value.data?.data_name || ""}
              error={error?.data_name}
              onChange={(e) => {
                onChange({
                  ...value,
                  data: { ...value.data, data_name: e.target.value },
                });
              }}
            />
          </Box>
        );
      case "claimable_balance":
        return (
          <Box gap="sm">
            <TextPicker
              key={getInputId(value.type, "balance_id")}
              id={getInputId(value.type, "balance_id")}
              label="Claimable Balance ID"
              value={value.data?.balance_id || ""}
              error={error?.balance_id}
              onChange={(e) => {
                onChange({
                  ...value,
                  data: { ...value.data, balance_id: e.target.value },
                });
              }}
            />
          </Box>
        );
      case "signer":
        return (
          <Box gap="sm">
            <PubKeyPicker
              key={getInputId(value.type, "account_id")}
              id={getInputId(value.type, "account_id")}
              label="Account"
              value={value.data?.account_id || ""}
              error={error?.account_id}
              onChange={(e) => {
                onChange({
                  ...value,
                  data: { ...value.data, account_id: e.target.value },
                });
              }}
            />

            <SignerPicker
              key={getInputId(value.type, "signer")}
              id={getInputId(value.type, "signer")}
              label="Signer Type"
              value={value.data?.signer}
              error={error?.signer}
              onChange={(signer) => {
                onChange({
                  ...value,
                  data: { ...value.data, signer },
                });
              }}
              excludeWeight
            />
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box gap="sm">
      <Select
        id={`${id}-type`}
        fieldSize="md"
        label="Revoke Sponsorship Type"
        value={value?.type}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
          const val = e.target.value;

          if (val) {
            onChange({ type: val, data: initData(val) });
          } else {
            onChange(undefined);
          }
        }}
      >
        <option>Select sponsorship type</option>
        {fields.map((f) => (
          <option key={f.id} value={f.id}>
            {f.label}
          </option>
        ))}
      </Select>

      <ExpandBox isExpanded={Boolean(value?.type)} offsetTop="sm">
        {renderInputs()}
      </ExpandBox>
    </Box>
  );
};
