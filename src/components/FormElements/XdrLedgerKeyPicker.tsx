import { ReactElement, useEffect, useState } from "react";

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
      includePoolShare: true,
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
    templates: "transaction",
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

  const [formError, setFormError] = useState<AnyObject>({});
  const [ledgerKeyXdrJsonString, setLedgerKeyJsonString] = useState<string>("");
  const [ledgerKeyXdrError, setLedgerKeyXdrError] = useState<string>("");

  const isXdrInit = useIsXdrInit();

  const xdrDecodeJson = (xdr: string) => {
    if (!isXdrInit) {
      return null;
    }

    try {
      const xdrJson = StellarXdr.decode("LedgerKey", xdr);

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

  const jsonEncodeXdr = (str: string) => {
    if (!(isXdrInit && str && "LedgerKey")) {
      return null;
    }

    try {
      JSON.parse(str);
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
        error: `Unable to decode JSON as LedgerKey: ${e}`,
      };
    }
  };

  const reset = () => {
    setFormError({});
    setLedgerKeyJsonString("");
    onChange("");
  };

  const getKeyType = (val: string) =>
    ledgerKeyFields.find((field) => field.id === val);

  const validateLedgerKeyXdr = (xdrString: string) => {
    if (!xdrString) {
      setLedgerKeyXdrError("");
      return;
    }
    // check error
    const error = validate.getXdrError(xdrString, "LedgerKey");
    const xdrJsonDecoded = xdrDecodeJson(xdrString);

    if (error?.result === "error") {
      setLedgerKeyXdrError(error.message);
      return;
    }

    if (xdrJsonDecoded?.error) {
      setLedgerKeyXdrError(xdrJsonDecoded?.error);
      return;
    }

    // success case:
    // xdr decoded successfully to JSON
    if (xdrJsonDecoded?.jsonString) {
      setLedgerKeyXdrError("");

      const xdrDecodedJSON = JSON.parse(xdrJsonDecoded.jsonString);
      const key = Object.keys(xdrDecodedJSON)[0];
      const selectedKeyType = getKeyType(key);

      // Transform LedgerKey Trustline's 'asset' object to match what <AssetPicker/> accepts
      if (key === "trustline") {
        if (xdrDecodedJSON[key].asset === "native") {
          xdrDecodedJSON[key].asset = {
            code: "",
            issuer: "",
            type: xdrDecodedJSON[key].asset,
          };
        }

        if (xdrJsonDecoded.jsonString.includes("credit_alphanum")) {
          const assetType = Object.keys(xdrDecodedJSON[key].asset)[0];

          xdrDecodedJSON[key].asset = {
            code: xdrDecodedJSON[key].asset[assetType].asset_code,
            issuer: xdrDecodedJSON[key].asset[assetType].issuer,
            type: assetType,
          };
        }

        if (xdrJsonDecoded.jsonString.includes("pool_share")) {
          xdrDecodedJSON[key].asset = {
            type: "pool_share",
            pool_share: xdrDecodedJSON[key].asset.pool_share,
          };
        }

        const xdrDecodedJsonToString = JSON.stringify(xdrDecodedJSON);
        setLedgerKeyJsonString(xdrDecodedJsonToString);
      } else {
        setLedgerKeyJsonString(xdrJsonDecoded.jsonString);
      }

      if (selectedKeyType) {
        setSelectedLedgerKey(selectedKeyType);
      }
      return;
    }
  };

  useEffect(() => {
    // this creates a form based on the ledger key that got selected from the dropdown
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
    if (!selectedLedgerKey || !ledgerKeyXdrJsonString) {
      return null;
    }

    return selectedLedgerKey.templates.split(",").map((template) => {
      const ledgerKeyStringToJson = JSON.parse(ledgerKeyXdrJsonString);
      const obj = ledgerKeyStringToJson[selectedLedgerKey!.id];

      let jsonXdrEncoded;

      const component = formComponentTemplateEndpoints(
        template,
        selectedLedgerKey?.custom,
      );

      if (component) {
        const handleChange = (val: any) => {
          const error = component.validate?.(val);

          if (error && error.result !== "success") {
            setFormError({ ...formError, [template]: error });
          } else {
            setFormError({ ...formError, [template]: "" });
          }

          obj[template] = val;

          // stringify the updated json with the input value
          const ledgerKeyJsonToString = JSON.stringify(ledgerKeyStringToJson);
          setLedgerKeyJsonString(ledgerKeyJsonToString);

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

            const newObjToString = JSON.stringify(newObj);
            jsonXdrEncoded = jsonEncodeXdr(newObjToString);
          } else {
            jsonXdrEncoded = jsonEncodeXdr(ledgerKeyJsonToString);
          }

          if (jsonXdrEncoded?.xdrString) {
            onChange(jsonXdrEncoded.xdrString);
          }
        };

        if (template === "asset") {
          return component.render({
            value: ledgerKeyStringToJson[selectedLedgerKey.id][template],
            error: formError[template],
            onChange: (assetObjVal: AssetObjectValue) => {
              handleChange(
                isEmptyObject(sanitizeObject(assetObjVal || {}))
                  ? undefined
                  : JSON.stringify(assetObjVal),
              );
            },
            isRequired: true,
          });
        }

        return component.render({
          value: ledgerKeyStringToJson[selectedLedgerKey.id][template],
          error: formError[template],
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            handleChange(e.target.value);
          },
          isRequired: true,
        });
      }
      return null;
    });
  };

  return (
    <Box gap="sm">
      <XdrPicker
        id="ledger-key-xdr"
        label="Ledger Key XDR"
        value={value}
        error={ledgerKeyXdrError}
        onChange={(e) => {
          onChange(e.target.value);
          validateLedgerKeyXdr(e.target.value);
        }}
      />

      <Select
        id="ledgerkey"
        fieldSize="md"
        label="Ledger Key"
        value={selectedLedgerKey?.id}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
          reset();

          const selectedVal = e.target.value;
          setSelectedLedgerKey(selectedVal ? getKeyType(selectedVal)! : null);
        }}
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
