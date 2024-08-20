import { ReactElement, useEffect, useState } from "react";

import { Select } from "@stellar/design-system";

import * as StellarXdr from "@/helpers/StellarXdr";

import { Box } from "@/components/layout/Box";
import { XdrPicker } from "@/components/FormElements/XdrPicker";
import { formComponentTemplateEndpoints } from "@/components/formComponentTemplateEndpoints";

import { useIsXdrInit } from "@/hooks/useIsXdrInit";

import { validate } from "@/validate";

import { AnyObject, LedgerKeyFieldsType, LedgerKeyType } from "@/types/types";

type XdrLedgerKeyPicker = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  rightElement: ReactElement | null;
};

// https://github.com/stellar/stellar-xdr/blob/curr/Stellar-ledger-entries.x#L600
const ledgerKeyFields: {
  id: LedgerKeyType;
  label: string;
  templates: string;
  addlFields?: AnyObject;
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
    addlFields: {
      asset: {
        type: "",
        code: "",
        issuer: "",
      },
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
    templates: "claimable_balance_id",
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
  id,
  value,
  onChange,
}: XdrLedgerKeyPicker) => {
  const [selectedLedgerKey, selectLedgerKey] =
    useState<LedgerKeyFieldsType | null>(null);

  const [formError, setFormError] = useState<string>("");
  const [ledgerKeyJsonString, setLedgerKeyJsonString] = useState<string>("");
  const [ledgerKeyXdr, setLedgerKeyXdr] = useState<string>("");
  const [ledgerKeyXdrError, setLedgerKeyXdrError] = useState<string>("");

  const isXdrInit = useIsXdrInit();

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
        xdrString: xdrString,
        error: "",
      };
    } catch (e) {
      return {
        xdrString: "",
        error: `Unable to decode JSON as LedgerKey: ${e}`,
      };
    }
  };

  useEffect(() => {
    if (ledgerKeyXdr) {
      onChange(ledgerKeyXdr);
    }
  }, [ledgerKeyXdr]);

  const getKeyType = (val: string) =>
    ledgerKeyFields.find((field) => field.id === val);

  const xdrJsonDecoded = xdrDecodeJson();

  console.log("xdrJsonDecoded?.jsonString: ", xdrJsonDecoded?.jsonString);

  useEffect(() => {
    if (xdrJsonDecoded?.jsonString) {
      setLedgerKeyJsonString(xdrJsonDecoded.jsonString);

      const xdrJsonDecodedJSON = JSON.parse(xdrJsonDecoded.jsonString);
      const decodedKeyType = Object.keys(xdrJsonDecodedJSON)[0];
      const selectedKeyType = getKeyType(decodedKeyType);

      if (selectedKeyType) {
        selectLedgerKey(selectedKeyType);
      }
    }
  }, [xdrJsonDecoded?.jsonString]);

  useEffect(() => {
    if (xdrJsonDecoded?.error) {
      console.log("xdrJsonDecoded?.error: ", xdrJsonDecoded?.error);
    }
  }, [xdrJsonDecoded?.error]);

  useEffect(() => {
    if (ledgerKeyXdr) {
      const error = validate.getXdrError(ledgerKeyXdr);

      if (error) {
        setLedgerKeyXdrError(error.message);
      } else {
        setLedgerKeyXdrError("");
      }
    } else {
      setLedgerKeyXdrError("");
    }
  }, [ledgerKeyXdr]);

  const renderLedgerKeyTemplate = (): React.ReactElement[] | null => {
    if (!selectedLedgerKey) {
      return null;
    }

    if (!ledgerKeyJsonString) {
      const templatesArr = selectedLedgerKey.templates.split(",");
      let formLedgerKeyJson = templatesArr.reduce((accr, item) => {
        accr[selectedLedgerKey.id] = {
          ...accr[selectedLedgerKey.id],
          [item]: "",
        };

        return accr;
      }, {} as AnyObject);

      if (selectedLedgerKey.addlFields) {
        formLedgerKeyJson[selectedLedgerKey.id] = selectedLedgerKey.addlFields;
      }

      const formLedgerKeyJsonString = JSON.stringify(formLedgerKeyJson);
      setLedgerKeyJsonString(formLedgerKeyJsonString);
    }

    return selectedLedgerKey.templates.split(",").map((template) => {
      if (!ledgerKeyJsonString) {
        return null;
      }

      const ledgerKeyJson = JSON.parse(ledgerKeyJsonString);

      const component = formComponentTemplateEndpoints(template);

      const json = JSON.parse(ledgerKeyJsonString);
      const obj = json[selectedLedgerKey!.id];

      if (component) {
        const handleChange = (key: any, val: any) => {
          const error = component.validate?.(val);

          if (error) {
            setFormError(error);
          } else {
            setFormError("");
          }

          obj[key] = val;

          const string = JSON.stringify(json);
          setLedgerKeyJsonString(string);

          const jsonXdrEncoded = jsonEncodeXdr(string);
          console.log("jsonXdrEncoded: ", jsonXdrEncoded);

          if (jsonXdrEncoded?.xdrString) {
            setLedgerKeyXdr(jsonXdrEncoded.xdrString);
          }
        };

        return component.render({
          value: ledgerKeyJson[selectedLedgerKey.id][template],
          error: formError,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            handleChange(template, e.target.value);
          },
          isRequired: true,
        });
      }
      return null;
    });
  };

  const ledgerKeyTemplate = renderLedgerKeyTemplate();

  return (
    <Box gap="sm" key={id}>
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
        id={`${id}-type`}
        fieldSize="md"
        label="Ledger Key"
        value={selectedLedgerKey?.id}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
          const selectedVal = e.target.value;
          setLedgerKeyJsonString("");

          if (selectedVal) {
            const selectedLedgerKey = getKeyType(selectedVal);
            selectLedgerKey(selectedLedgerKey!);
          } else {
            selectLedgerKey(null);
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

      {ledgerKeyTemplate && ledgerKeyTemplate}
    </Box>
  );
};
