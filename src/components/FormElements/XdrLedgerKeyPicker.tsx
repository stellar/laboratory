import { ReactElement, useEffect, useState } from "react";
import { parse, stringify } from "lossless-json";
import { Button, Card, Icon, Select } from "@stellar/design-system";

import { arrayItem } from "@/helpers/arrayItem";
import { isEmptyObject } from "@/helpers/isEmptyObject";
import { sanitizeObject } from "@/helpers/sanitizeObject";
import * as StellarXdr from "@/helpers/StellarXdr";
import { formatAssetValue } from "@/helpers/formatAssetValue";

import { Box } from "@/components/layout/Box";
import { XdrPicker } from "@/components/FormElements/XdrPicker";
import { formComponentTemplateEndpoints } from "@/components/formComponentTemplateEndpoints";
import { InputSideElement } from "@/components/InputSideElement";

import { useIsXdrInit } from "@/hooks/useIsXdrInit";

import { validate } from "@/validate";

import {
  AnyObject,
  AssetObjectValue,
  ConfigSettingIdType,
  LedgerKeyFieldsType,
  LedgerKeyType,
} from "@/types/types";

type MultiPickerProps = {
  id: string;
  onChange: (val: string[]) => void;
  value: string[];
  buttonLabel?: string;
  limit?: number;
};

type XdrLedgerKeyPicker = {
  value: string;
  onChange: (value: string) => void;
  rightElement: ReactElement | null;
};

// https://github.com/stellar/stellar-xdr/blob/curr/Stellar-ledger-entries.x#L600
const ledgerKeyFields: {
  id: LedgerKeyType;
  label: string;
  fields: string;
  custom?: AnyObject;
}[] = [
  {
    id: "account",
    label: "Account",
    fields: "account_id",
  },
  {
    id: "trustline",
    label: "Trustline",
    fields: "account_id,asset",
    custom: {
      assetInput: "alphanumeric",
      includeSingleLiquidityPoolShare: true,
    },
  },
  {
    id: "offer",
    label: "Offer",
    fields: "seller_id,offer_id",
  },
  {
    id: "data",
    label: "Data",
    fields: "account_id,data_name",
  },
  {
    id: "claimable_balance",
    label: "Claimable Balance",
    fields: "balance_id",
  },
  {
    id: "liquidity_pool",
    label: "Liquidity Pool",
    fields: "liquidity_pool_id",
  },
  {
    id: "contract_data",
    label: "Contract Data",
    fields: "contract,key,durability",
  },
  {
    id: "contract_code",
    label: "Contract Code",
    fields: "hash",
  },
  {
    id: "config_setting",
    label: "Config Setting",
    fields: "config_setting_id",
  },
  {
    id: "ttl",
    label: "TTL",
    fields: "key_hash",
  },
];

export const XdrLedgerKeyPicker = ({
  value,
  onChange,
  rightElement,
}: XdrLedgerKeyPicker) => {
  const [selectedLedgerKey, setSelectedLedgerKey] =
    useState<LedgerKeyFieldsType | null>(null);

  const [isXdrInputActive, setIsXdrInputActive] = useState(true);
  const [formError, setFormError] = useState<AnyObject>({});
  const [ledgerKeyXdrToJsonString, setLedgerKeyJsonString] =
    useState<string>("");
  const [ledgerKeyXdrError, setLedgerKeyXdrError] = useState<string>("");

  const isXdrInit = useIsXdrInit();

  const xdrDecodeLedgerKeyToJson = (xdr: string) => {
    if (!isXdrInit) {
      return null;
    }

    try {
      const xdrToJsonString = StellarXdr.decode("LedgerKey", xdr);
      const xdrToJson = parse(StellarXdr.decode("LedgerKey", xdr));

      return {
        xdrToJson,
        xdrToJsonString,
        error: "",
      };
    } catch (e) {
      return {
        xdrToJson: {},
        xdrToJsonString: "",
        error: `Unable to decode input as LedgerKey: ${e}`,
      };
    }
  };

  const encodeJsonToXdr = (xdrToJson: AnyObject) => {
    console.log("[encodeJsonToXdr] xdrToJson", xdrToJson);
    const jsonToString = stringify(xdrToJson) || "";

    console.log("[encodeJsonToXdr] parse(jsonToString);", parse(jsonToString));

    if (!isXdrInit && !xdrToJson) {
      return null;
    }

    try {
      // check to see if it's a valid JSON
      parse(jsonToString);
    } catch (e) {
      return {
        xdr: "",
        error: "Invalid JSON",
      };
    }

    try {
      const xdr = StellarXdr.encode("LedgerKey", jsonToString);

      return {
        xdr,
        error: "",
      };
    } catch (e) {
      return {
        xdr: "",
        error: `[MEOW] Unable to encode JSON as LedgerKey: ${e}`,
      };
    }
  };

  const reset = () => {
    setFormError({});
    setLedgerKeyJsonString("");
    setLedgerKeyXdrError("");
    onChange("");
  };

  const getLedgerKeyFields = (val: string) =>
    ledgerKeyFields.find((field) => field.id === val);

  // validate the xdr string on input change
  const validateLedgerKeyXdr = (xdrString: string) => {
    // if the xdr string is empty (by deleting the input or other)
    // reset the form
    if (!xdrString) {
      reset();
      return;
    }

    // check error
    const error = validate.getXdrError(xdrString, "LedgerKey");
    const decodedXdrJson = xdrDecodeLedgerKeyToJson(xdrString);

    // check if the xdr string is valid
    if (error?.result === "error") {
      setLedgerKeyXdrError(error.message);
      return;
    }

    // check if there was an error during the xdr string decoding
    if (decodedXdrJson?.error) {
      setLedgerKeyXdrError(decodedXdrJson?.error);
      return;
    }

    // success case: xdr decoded successfully to JSON
    if (decodedXdrJson?.xdrToJson) {
      let xdrJsonToString;

      // reset the existing error
      setLedgerKeyXdrError("");

      const xdrDecodedJSON = decodedXdrJson.xdrToJson as Record<
        LedgerKeyType,
        any
      >;

      // returns the following LedgerKey type:
      //// account
      //// trustline
      //// offer
      //// data
      //// claimable_balance
      //// liquidity_pool
      //// contract_data
      //// contract_code
      //// config_setting
      //// ttl
      const ledgerKey = Object.keys(xdrDecodedJSON)[0] as LedgerKeyType;
      const selectedLedgerKeyFields = getLedgerKeyFields(ledgerKey);

      if (ledgerKey === "trustline") {
        // handle native asset
        if (xdrDecodedJSON[ledgerKey].asset === "native") {
          // transform LedgerKey Trustline's 'asset' object to
          // match what <AssetPicker/> accepts
          xdrDecodedJSON[ledgerKey].asset = {
            code: "",
            issuer: "",
            type: xdrDecodedJSON[ledgerKey].asset,
          };
        }
        // handle credit alphanum asset (credit_alphanum4 or credit_alphanum12)
        const assetType = Object.keys(xdrDecodedJSON[ledgerKey].asset)[0];

        if (
          assetType === "credit_alphanum4" ||
          assetType === "credit_alphanum12"
        ) {
          xdrDecodedJSON[ledgerKey].asset = {
            code: xdrDecodedJSON[ledgerKey].asset[assetType].asset_code,
            issuer: xdrDecodedJSON[ledgerKey].asset[assetType].issuer,
            type: assetType,
          };
        }

        if (assetType === "pool_share") {
          xdrDecodedJSON[ledgerKey].asset = {
            type: "pool_share",
            pool_share: xdrDecodedJSON[ledgerKey].asset.pool_share,
          };
        }

        // convert the xdr decoded JSON to a string
        xdrJsonToString = stringify(xdrDecodedJSON) || "";
      } else {
        // @TODO: handle other ledger key types (or I don't know what this is for)
        xdrJsonToString = stringify(decodedXdrJson.xdrToJson) || "";
      }

      setLedgerKeyJsonString(xdrJsonToString);

      if (selectedLedgerKeyFields) {
        setSelectedLedgerKey(selectedLedgerKeyFields);
      }
      return;
    }
  };

  useEffect(() => {
    // this creates an empty template with default fields based on
    // the value of the LedgerKey dropdown that got selected
    if (!ledgerKeyXdrToJsonString && selectedLedgerKey) {
      const defaultLedgerKeyFields = selectedLedgerKey.fields.split(",");
      const ledgerKeyFieldInputs = defaultLedgerKeyFields.reduce(
        (accr, item) => {
          accr[selectedLedgerKey.id] = {
            ...accr[selectedLedgerKey.id],
            [item]: "",
          };

          return accr;
        },
        {} as AnyObject,
      );

      const ledgerKeyFieldInputsToString = stringify(ledgerKeyFieldInputs);

      if (ledgerKeyFieldInputsToString) {
        setLedgerKeyJsonString(ledgerKeyFieldInputsToString);
      }
    }
  }, [ledgerKeyXdrToJsonString, selectedLedgerKey]);

  const renderLedgerKeyTemplate = () => {
    // if there is no selected ledger key or the xdr string is empty, return null
    if (!selectedLedgerKey || !ledgerKeyXdrToJsonString) {
      return null;
    }

    return selectedLedgerKey.fields.split(",").map((field) => {
      // {
      //   "trustline": {
      //     "account_id": "GDE25LQ34AFCSDMYTOI6AVVEHRXFRJI4MOAVIUGUDUQEC5ZWN5OZDLAZ",
      //     "asset": "{\"code\":\"\",\"issuer\":\"\",\"type\":\"native\"}"
      //   }
      // }
      const ledgerKeyXdrToJson = parse(ledgerKeyXdrToJsonString) as AnyObject;

      // will output
      // {
      //   "account_id": "GDE25LQ34AFCSDMYTOI6AVVEHRXFRJI4MOAVIUGUDUQEC5ZWN5OZDLAZ",
      //   "asset": "{\"code\":\"\",\"issuer\":\"\",\"type\":\"native\"}"
      // }

      // output that fits into the fields
      const formInputs = ledgerKeyXdrToJson[selectedLedgerKey.id];

      let xdrJson: AnyObject = {
        [selectedLedgerKey.id]: {
          ...formInputs, // Start with existing form inputs
        },
      };

      const component = formComponentTemplateEndpoints(
        field,
        selectedLedgerKey?.custom,
      );

      if (component) {
        // handle the change of the input value of the fields
        const handleChange = (val: any) => {
          reset();

          const error = component.validate?.(val);

          if (error && error.result !== "success") {
            setFormError({ ...formError, [field]: error });
          } else {
            setFormError({ ...formError, [field]: "" });
          }

          formInputs[field] = val;

          console.log(
            "[renderLedgerKeyTemplate] formInputs[field]",
            formInputs[field],
          );
          console.log(
            "[renderLedgerKeyTemplate] ledgerKeyXdrToJson",
            ledgerKeyXdrToJson,
          );

          if (field === "key") {
            console.log("[renderLedgerKeyTemplate] field === key");
            console.log(
              "[renderLedgerKeyTemplate] parse(formInputs[field]): ",
              parse(formInputs[field]),
            );

            xdrJson = {
              [selectedLedgerKey.id]: {
                ...formInputs,
                // Parse the nested JSON string key value
                key: parse(formInputs[field]),
              },
            };
          }

          if (field === "asset") {
            const parsedAssetValue = parse(formInputs[field]);

            if (isAssetObjectValue(parsedAssetValue)) {
              xdrJson = {
                [selectedLedgerKey.id]: {
                  ...formInputs,
                  asset: formatAssetValue(parsedAssetValue),
                },
              };
            } else {
              // Handle the case where parsedAssetValue is not of the expected type
              console.error(
                "Parsed asset value is not valid:",
                parsedAssetValue,
              );
            }
          }

          if (field === "offer_id") {
            xdrJson = {
              [selectedLedgerKey.id]: {
                ...formInputs,
                offer_id: Number(formInputs[field]),
              },
            };
          }

          // stringify the updated json with the input value
          const ledgerKeyJsonToString = stringify(ledgerKeyXdrToJson) || "";
          const parsedLedgerKeyJsonToString = parse(ledgerKeyJsonToString);

          console.log(
            "[renderLedgerKeyTemplate] ledgerKeyJsonToString",
            ledgerKeyJsonToString,
          );
          console.log("[renderLedgerKeyTemplate] xdrJson", xdrJson);
          console.log(
            "[renderLedgerKeyTemplate] parsedLedgerKeyJsonToString",
            parsedLedgerKeyJsonToString,
          );

          setLedgerKeyJsonString(ledgerKeyJsonToString || "");

          // for every template that is not an asset, encode the json string
          const jsonToXdr = encodeJsonToXdr(xdrJson || "");

          if (jsonToXdr?.error) {
            setLedgerKeyXdrError(jsonToXdr.error);
            return;
          }

          if (jsonToXdr?.xdr) {
            onChange(jsonToXdr.xdr);
          }
        };

        const baseProps = {
          value: ledgerKeyXdrToJson[selectedLedgerKey.id][field] || "",
          error: formError[field],
          isRequired: true,
          disabled: isXdrInputActive,
        };

        if (field === "asset") {
          return component.render({
            ...baseProps,
            onChange: (assetObjVal: AssetObjectValue) => {
              handleChange(
                isEmptyObject(sanitizeObject(assetObjVal || {}))
                  ? undefined
                  : stringify(assetObjVal),
              );
            },
          });
        }

        if (field === "config_setting_id") {
          return component.render({
            ...baseProps,
            onChange: (selectedConfigSetting: ConfigSettingIdType) => {
              handleChange(selectedConfigSetting);
            },
          });
        }

        return component.render({
          ...baseProps,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            handleChange(e.target.value);
          },
        });
      }
      return null;
    });
  };

  return (
    <Box gap="lg" addlClassName="XdrLedgerKeyPicker">
      <XdrPicker
        id="ledger-key-xdr"
        label="Ledger Key XDR"
        value={value}
        error={ledgerKeyXdrError}
        onChange={(e) => {
          onChange(e.target.value);
          validateLedgerKeyXdr(e.target.value);
        }}
        disabled={!isXdrInputActive}
      />

      <Button
        size="md"
        variant="tertiary"
        icon={<Icon.SwitchVertical01 />}
        type="button"
        onClick={() => {
          setIsXdrInputActive(!isXdrInputActive);
        }}
      >
        Switch input
      </Button>

      <Box gap="sm">
        <Select
          id="ledgerkey"
          fieldSize="md"
          label="Ledger Key"
          value={selectedLedgerKey?.id}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            reset();

            const selectedVal = e.target.value;
            setSelectedLedgerKey(
              selectedVal ? getLedgerKeyFields(selectedVal)! : null,
            );
          }}
          disabled={isXdrInputActive}
        >
          <option value="">Select a key</option>

          {ledgerKeyFields.map((f) => (
            <option key={f.id} value={f.id}>
              {f.label}
            </option>
          ))}
        </Select>
        <>{renderLedgerKeyTemplate()}</>
        <>{rightElement}</>
      </Box>
    </Box>
  );
};

export const MultiLedgerEntriesPicker = ({
  id,
  onChange,
  value = [""],
  buttonLabel = "Add another ledger key",
  limit = 100,
}: MultiPickerProps) => {
  if (!value || !value.length) {
    value = [];
  }

  return (
    <Box gap="md">
      <Box gap="lg">
        {value.length
          ? value.map((singleVal: string, index: number) => (
              <Card key={`${id}-${index}`}>
                <XdrLedgerKeyPicker
                  onChange={(val) => {
                    const updatedVal = arrayItem.update(value, index, val);
                    return onChange([...updatedVal]);
                  }}
                  key={index}
                  value={singleVal}
                  rightElement={
                    index !== 0 ? (
                      <InputSideElement
                        variant="button"
                        onClick={() => {
                          const val = arrayItem.delete(value, index);
                          return onChange([...val]);
                        }}
                        placement="right"
                        icon={<Icon.Trash01 />}
                        addlClassName="MultiPicker__delete"
                      />
                    ) : null
                  }
                />
              </Card>
            ))
          : null}
      </Box>

      <div>
        <Button
          disabled={value.length === limit}
          size="md"
          variant="tertiary"
          onClick={(e) => {
            e.preventDefault();
            onChange([...value, ""]);
          }}
        >
          {buttonLabel}
        </Button>
      </div>
    </Box>
  );
};
