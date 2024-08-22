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
      includeLiquidityPoolShares: true,
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
  const [ledgerKeyJsonString, setLedgerKeyJsonString] = useState<string>("");
  const [ledgerKeyXdr, setLedgerKeyXdr] = useState<string>("");
  const [ledgerKeyXdrError, setLedgerKeyXdrError] = useState<string>("");

  const isXdrInit = useIsXdrInit();

  useEffect(() => {
    if (isXdrInit) {
      const jsonSchema = StellarXdr.schema("LedgerKey");
    }
  }, [isXdrInit]);

  const xdrDecodeJson = () => {
    if (!isXdrInit) {
      return null;
    }

    try {
      const xdrJson = StellarXdr.decode("LedgerKey", value);

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

  // useEffect(() => {
  //   if (ledgerKeyXdr) {
  //     onChange(ledgerKeyXdr);
  //   }
  // }, [ledgerKeyXdr]);

  const reset = () => {
    setFormError({});
    onChange("");
  };

  const getKeyType = (val: string) =>
    ledgerKeyFields.find((field) => field.id === val);

  const xdrJsonDecoded = xdrDecodeJson();

  useEffect(() => {
    if (xdrJsonDecoded?.jsonString) {
      setLedgerKeyJsonString(xdrJsonDecoded.jsonString);

      const xdrJsonDecodedJSON = JSON.parse(xdrJsonDecoded.jsonString);
      const decodedKeyType = Object.keys(xdrJsonDecodedJSON)[0];
      const selectedKeyType = getKeyType(decodedKeyType);

      if (selectedKeyType) {
        setSelectedLedgerKey(selectedKeyType);
      }
    }
  }, [xdrJsonDecoded?.jsonString]);

  useEffect(() => {
    if (value && xdrJsonDecoded?.error) {
      setLedgerKeyXdrError(xdrJsonDecoded?.error);
    } else {
      setLedgerKeyXdrError("");
    }
  }, [xdrJsonDecoded?.error]);

  useEffect(() => {
    if (ledgerKeyXdr) {
      const error = validate.getXdrError(ledgerKeyXdr, "LedgerKey");

      if (error?.result === "error") {
        setLedgerKeyXdrError(error.message);
      } else {
        setLedgerKeyXdrError("");
      }
    } else {
      setLedgerKeyXdrError("");
    }
  }, [ledgerKeyXdr]);

  useEffect(() => {
    if (!ledgerKeyJsonString && selectedLedgerKey) {
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
  }, [ledgerKeyJsonString, selectedLedgerKey]);

  const renderLedgerKeyTemplate = () => {
    if (!selectedLedgerKey || !ledgerKeyJsonString) {
      return null;
    }

    return selectedLedgerKey.templates.split(",").map((template) => {
      const ledgerKeyJson = JSON.parse(ledgerKeyJsonString);
      const json = JSON.parse(ledgerKeyJsonString);
      const obj = json[selectedLedgerKey!.id];

      const component = formComponentTemplateEndpoints(
        template,
        selectedLedgerKey?.custom,
      );

      if (component) {
        const handleChange = (templateKey: any, val: any) => {
          const error = component.validate?.(val);

          if (error && error.result !== "success") {
            setFormError({ ...formError, [template]: error });
          } else {
            setFormError({ ...formError, [template]: "" });
          }

          obj[template] = val;

          const string = JSON.stringify(json);
          setLedgerKeyJsonString(string);

          const jsonXdrEncoded = jsonEncodeXdr(string);

          if (jsonXdrEncoded?.xdrString) {
            // setLedgerKeyXdr(jsonXdrEncoded.xdrString);
            onChange(jsonXdrEncoded.xdrString);
          }
        };

        if (template === "asset") {
          return component.render({
            value: ledgerKeyJson[selectedLedgerKey.id][template],
            error: formError[template],
            onChange: (assetObjVal: AssetObjectValue) => {
              handleChange(
                assetObjVal,
                isEmptyObject(sanitizeObject(assetObjVal || {}))
                  ? undefined
                  : JSON.stringify(assetObjVal),
              );
            },
            isRequired: true,
          });
        }

        return component.render({
          value: ledgerKeyJson[selectedLedgerKey.id][template],
          error: formError[template],
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            handleChange(template, e.target.value);
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
          setLedgerKeyJsonString("");
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
