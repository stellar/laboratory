import { ReactElement, useEffect, useState } from "react";
import { parse, stringify } from "lossless-json";

import { Button, Card, Icon, Select } from "@stellar/design-system";

import { arrayItem } from "@/helpers/arrayItem";
import { isEmptyObject } from "@/helpers/isEmptyObject";
import { sanitizeObject } from "@/helpers/sanitizeObject";
import * as StellarXdr from "@/helpers/StellarXdr";

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
  templates: string;
  custom?: AnyObject;
}[] = [
  {
    id: "account",
    label: "Account",
    templates: "account_id",
  },
  {
    id: "trustline",
    label: "Trustline",
    templates: "account_id,asset",
    custom: {
      assetInput: "alphanumeric",
      includeSingleLiquidityPoolShare: true,
    },
  },
  {
    id: "offer",
    label: "Offer",
    templates: "seller_id,offer_id",
  },
  {
    id: "data",
    label: "Data",
    templates: "account_id,data_name",
  },
  {
    id: "claimable_balance",
    label: "Claimable Balance",
    templates: "balance_id",
  },
  {
    id: "liquidity_pool",
    label: "Liquidity Pool",
    templates: "liquidity_pool_id",
  },
  {
    id: "contract_data",
    label: "Contract Data",
    templates: "contract,key,durability",
  },
  {
    id: "contract_code",
    label: "Contract Code",
    templates: "hash",
  },
  {
    id: "config_setting",
    label: "Config Setting",
    templates: "config_setting_id",
  },
  {
    id: "ttl",
    label: "TTL",
    templates: "key_hash",
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
  const [ledgerKeyXdrJsonString, setLedgerKeyJsonString] = useState<string>("");
  const [ledgerKeyXdrError, setLedgerKeyXdrError] = useState<string>("");

  const isXdrInit = useIsXdrInit();

  const xdrDecodeLedgerKeyJson = (xdr: string) => {
    if (!isXdrInit) {
      return null;
    }

    try {
      const xdrJson = parse(StellarXdr.decode("LedgerKey", xdr));

      return {
        xdrJson,
        error: "",
      };
    } catch (e) {
      return {
        error: `Unable to decode input as LedgerKey: ${e}`,
      };
    }
  };

  const jsonEncodeXdr = (str: string) => {
    if (!isXdrInit && !str) {
      return null;
    }

    try {
      // check to see if it's a valid JSON
      parse(str);
    } catch (e) {
      return {
        xdrString: "",
        error: "Invalid JSON",
      };
    }

    try {
      const xdrString = StellarXdr.encode("LedgerKey", str);

      return {
        xdrString,
        error: "",
      };
    } catch (e) {
      return {
        xdrString: "",
        error: `Unable to encode JSON as LedgerKey: ${e}`,
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
    const xdrJsonDecoded = xdrDecodeLedgerKeyJson(xdrString);

    // check if the xdr string is valid
    if (error?.result === "error") {
      setLedgerKeyXdrError(error.message);
      return;
    }

    // check if there was an error during the xdr string decoding
    if (xdrJsonDecoded?.error) {
      setLedgerKeyXdrError(xdrJsonDecoded?.error);
      return;
    }

    // success case: xdr decoded successfully to JSON
    if (xdrJsonDecoded?.xdrJson) {
      let xdrJsonToString;

      // reset the existing error
      setLedgerKeyXdrError("");

      const xdrDecodedJSON = xdrJsonDecoded.xdrJson as Record<
        LedgerKeyType,
        any
      >;

      // returns the following ledger key type:
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
      const selectedLedgerKeyField = getLedgerKeyFields(ledgerKey);

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
        xdrJsonToString = stringify(xdrJsonDecoded.xdrJson) || "";
      }

      setLedgerKeyJsonString(xdrJsonToString);

      if (selectedLedgerKeyField) {
        setSelectedLedgerKey(selectedLedgerKeyField);
      }
      return;
    }
  };

  useEffect(() => {
    // this creates a form based on the ledger key that got selected from the dropdown
    // this is used to create the form for the ledger key template
    // ledgerKeyFields
    if (!ledgerKeyXdrJsonString && selectedLedgerKey) {
      const templatesArr = selectedLedgerKey.templates.split(",");
      const formLedgerKeyJson = templatesArr.reduce((accr, item) => {
        accr[selectedLedgerKey.id] = {
          ...accr[selectedLedgerKey.id],
          [item]: "",
        };

        return accr;
      }, {} as AnyObject);

      const formLedgerKeyJsonString = JSON.stringify(formLedgerKeyJson);

      setLedgerKeyJsonString(formLedgerKeyJsonString);
    }
  }, [ledgerKeyXdrJsonString, selectedLedgerKey]);

  const renderLedgerKeyTemplate = () => {
    // if there is no selected ledger key or the xdr string is empty, return null
    if (!selectedLedgerKey || !ledgerKeyXdrJsonString) {
      return null;
    }

    return selectedLedgerKey.templates.split(",").map((template) => {
      const ledgerKeyStringToJson = parse(ledgerKeyXdrJsonString) as AnyObject;
      const obj = ledgerKeyStringToJson[selectedLedgerKey!.id];

      let jsonXdrEncoded;

      const component = formComponentTemplateEndpoints(
        template,
        selectedLedgerKey?.custom,
      );

      if (component) {
        // handle the change of the input value of the forms created from the
        // Ledger Key dropdown (not the Ledger Key XDR input)
        const handleChange = (val: any) => {
          const error = component.validate?.(val);

          if (error && error.result !== "success") {
            setFormError({ ...formError, [template]: error });
          } else {
            setFormError({ ...formError, [template]: "" });
          }

          obj[template] = val;

          // For Contract Data Ledger Key
          // we need to parse the key value because it's a nested JSON string
          if (template === "key") {
            ledgerKeyStringToJson[selectedLedgerKey.id].key = parse(
              obj[template],
            );
          }

          // update each template's field with an input value
          if (template === "asset") {
            const newObj = {
              [selectedLedgerKey.id]: {
                ...obj,
              },
            };

            const parsedObj = obj.asset ? JSON.parse(obj.asset) : obj.asset;

            if (parsedObj.type === "native") {
              newObj[selectedLedgerKey.id].asset = parsedObj.type;
            }

            if (parsedObj.type.includes("credit_alphanum4")) {
              newObj[selectedLedgerKey.id].asset = {
                [parsedObj.type]: {
                  asset_code: parsedObj.code,
                  issuer: parsedObj.issuer,
                },
              };
            }

            // use 67260c4c1807b262ff851b0a3fe141194936bb0215b2f77447f1df11998eabb9 as an example
            if (parsedObj.type === "pool_share") {
              newObj[selectedLedgerKey.id].asset = {
                [parsedObj.type]: "pool_share",
                pool_share: parsedObj.pool_share,
              };
            }

            const newObjToString = stringify(newObj) || "";
            jsonXdrEncoded = jsonEncodeXdr(newObjToString);
          }

          // stringify the updated json with the input value
          const ledgerKeyJsonToString = stringify(ledgerKeyStringToJson);

          setLedgerKeyJsonString(ledgerKeyJsonToString || "");

          // for every template that is not an asset, encode the json string
          jsonXdrEncoded = jsonEncodeXdr(ledgerKeyJsonToString || "");

          if (jsonXdrEncoded?.error) {
            setLedgerKeyXdrError(jsonXdrEncoded.error);
            return;
          }

          if (jsonXdrEncoded?.xdrString) {
            onChange(jsonXdrEncoded.xdrString);
          }
        };

        const baseProps = {
          value: ledgerKeyStringToJson[selectedLedgerKey.id][template] || "",
          error: formError[template],
          isRequired: true,
          disabled: isXdrInputActive,
        };

        if (template === "asset") {
          return component.render({
            ...baseProps,
            onChange: (assetObjVal: AssetObjectValue) => {
              handleChange(
                isEmptyObject(sanitizeObject(assetObjVal || {}))
                  ? undefined
                  : JSON.stringify(assetObjVal),
              );
            },
          });
        }

        if (template === "config_setting_id") {
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
