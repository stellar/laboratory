import { useState } from "react";

import { Select } from "@stellar/design-system";

import { parseJsonString } from "@/helpers/parseJsonString";
import * as StellarXdr from "@/helpers/StellarXdr";

import { Box } from "@/components/layout/Box";

import { AssetPicker } from "@/components/FormElements/AssetPicker";
import { PubKeyPicker } from "@/components/FormElements/PubKeyPicker";
import { TextPicker } from "@/components/FormElements/TextPicker";
import { XdrPicker } from "@/components/FormElements/XdrPicker";

import { useIsXdrInit } from "@/hooks/useIsXdrInit";

import {
  AnyObject,
  FiltersObject,
  FiltersType,
  LedgerEntryType,
  LedgerKeyEntryTypeProps,
} from "@/types/types";

type XdrLedgerKeyPicker = {
  id: string;
  value: FiltersObject;
  onChange: (value: AnyObject | undefined) => void;
  error: AnyObject | undefined;
};

export const XdrLedgerKeyPicker = ({
  id,
  value,
  error,
  onChange,
}: XdrLedgerKeyPicker) => {
  const [ledgerXdr, setLedgerXdr] = useState("");

  const isXdrInit = useIsXdrInit();

  console.log("[XdrLedgerKeyPicker] error: ", error);

  // https://github.com/stellar/stellar-xdr/blob/curr/Stellar-ledger-entries.x#L600
  const ledgerKeyFields: { id: LedgerEntryType; label: string }[] = [
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
      label: "Claimable balance",
    },
    {
      id: "liquidity_pool",
      label: "Liquidity pool",
    },
    {
      id: "contract_data",
      label: "Contract data",
    },
    {
      id: "contract_code",
      label: "Contract code",
    },
    {
      id: "config_setting",
      label: "Config setting",
    },
    {
      id: "ttl",
      label: "Ttl",
    },
  ];

  const xdrDecodeJson = () => {
    if (!(isXdrInit && ledgerXdr)) {
      return null;
    }

    try {
      console.log("xdrDecodeJson ledgerXdr: ", ledgerXdr);
      const xdrJson = StellarXdr.decode("LedgerKey", ledgerXdr);

      return {
        jsonString: xdrJson,
        error: "",
      };
    } catch (e) {
      return {
        jsonString: "",
        error: `Unable to decode input as LedgerKey: ${e}`,
      };
    }
  };

  const xdrJsonDecoded = xdrDecodeJson();

  console.log("[XdrLedgerKeyPicker] xdrJsonDecoded: ", xdrJsonDecoded);
  console.log(
    "[XdrLedgerKeyPicker] parseJson: ",
    parseJsonString(xdrJsonDecoded?.jsonString),
  );
  console.log(
    "object.entries: ",
    Object.entries(parseJsonString(xdrJsonDecoded?.jsonString)),
  );

  const test =
    xdrJsonDecoded?.jsonString &&
    Object.entries(parseJsonString(xdrJsonDecoded?.jsonString)).reduce(
      (res, [key, value]) => {
        console.log("res:", res);
        console.log("key:", key);
        console.log("value:", value);
      },
      [],
    );

  const onUpdate = (val: any, prop: string) => {
    {
      /* "keys": [
      "AAAABgAAAAHMA/50/Q+w3Ni8UXWm/trxFBfAfl6De5kFttaMT0/ACwAAABAAAAABAAAAAgAAAA8AAAAHQ291bnRlcgAAAAASAAAAAAAAAAAg4dbAxsGAGICfBG3iT2cKGYQ6hK4sJWzZ6or1C5v6GAAAAAE=",
      "AAAABgAAAAHXkotywnA8z+r365/0701QSlWouXn8m0UOoshCtNHOYQAAABAAAAABAAAAAgAAAA8AAAAHQmFsYW5jZQAAAAASAAAAAcwD/nT9D7Dc2LxRdab+2vEUF8B+XoN7mQW21oxPT8ALAAAAAQ=="
    ] */
    }

    onChange({
      ...value,
      [prop]: [...val],
    });
  };

  return (
    <Box gap="sm">
      <XdrPicker
        id="ledger-key-xdr"
        label="Ledger Key XDR"
        value={ledgerXdr || ""}
        error={xdrJsonDecoded?.error}
        onChange={(e) => {
          setLedgerXdr(e.target.value);
        }}
      />

      <Select
        id={`${id}-type`}
        fieldSize="md"
        label="Ledger Key"
        value={value?.type}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
          const val = e.target.value as FiltersType;

          if (val) {
            onChange({
              type: val,
              contract_ids: [""],
              topics: [""],
            });
          } else {
            onChange(undefined);
          }
        }}
      >
        <option value="">Select a key</option>

        {ledgerKeyFields.map((f) => (
          <option key={f.id} value={f.id}>
            {f.label}
          </option>
        ))}
      </Select>
      {/* 
      {xdrJsonDecoded?.jsonString ?Object.entries(xdrJsonDecoded?.jsonString).map(item => {
        console.log("item :", item);
        return getComponent(item[1], item[0]); */}
    </Box>
  );
};

const getComponent = (type: LedgerKeyEntryTypeProps, id: string) => {
  switch (type) {
    case "accountID":
      return (
        <PubKeyPicker
          key={id}
          id={id}
          label="Account ID"
          // labelSuffix={!templ.isRequired ? "optional" : undefined}
          value={templ.value || ""}
          error={templ.error}
          onChange={templ.onChange}
        />
      );
    case "asset":
      return (
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
        />
      );
    case "sellerID":
      return (
        <PubKeyPicker
          key={id}
          id={id}
          label="Seller"
          labelSuffix={!templ.isRequired ? "optional" : undefined}
          value={templ.value || ""}
          error={templ.error}
          onChange={templ.onChange}
        />
      );
    case "offerID":
      return (
        <TextPicker
          key={id}
          id={id}
          label="Offer ID"
          labelSuffix={!templ.isRequired ? "optional" : undefined}
          value={templ.value || ""}
          error={templ.error}
          onChange={templ.onChange}
        />
      );
    case "dataName":
      return (
        <TextPicker
          key={id}
          id={id}
          label="Offer ID"
          labelSuffix={!templ.isRequired ? "optional" : undefined}
          value={templ.value || ""}
          error={templ.error}
          onChange={templ.onChange}
        />
      );
    case "balanceID":
      return (
        <TextPicker
          key={id}
          id={id}
          label="Claimable Balance ID"
          labelSuffix={!templ.isRequired ? "optional" : undefined}
          value={templ.value || ""}
          error={templ.error}
          onChange={templ.onChange}
        />
      );
    case "liquidityPoolID":
      return (
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
      );
    case "contract":
      return (
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
      );
    case "key":
      return (
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
      );
    case "durability":
      return (
        <Select
          id={`${id}-type`}
          fieldSize="md"
          label="Filters Type"
          value={value?.type}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            const val = e.target.value as FiltersType;

            if (val) {
              onChange({
                type: val,
                contract_ids: [""],
                topics: [""],
              });
            } else {
              onChange(undefined);
            }
          }}
        >
          <option value="">Select filters type</option>

          {filtersTypeFields.map((f) => (
            <option key={f.id} value={f.id}>
              {f.label}
            </option>
          ))}
        </Select>
      );
    case "hash":
      return (
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
      );
    case "configSettingID":
      return (
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
      );
    case "keyHash":
      return (
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
      );
  }
};
