import React from "react";
import { Button, Input } from "@stellar/design-system";

import { ExpandBox } from "@/components/ExpandBox";
import { RadioPicker } from "@/components/RadioPicker";
import { PubKeyPicker } from "@/components/FormElements/PubKeyPicker";
import { Box } from "@/components/layout/Box";
import { LabelHeading } from "@/components/LabelHeading";

import { AssetObject, AssetObjectValue } from "@/types/types";

type AssetMultiPickerProps = {
  id: string;
  label: string;
  labelSuffix?: string | React.ReactNode;
  values: AssetObjectValue[] | undefined;
  error: { code: string | undefined; issuer: string | undefined }[] | undefined;
  onChange: (asset: AssetObjectValue[] | undefined) => void;
  assetInput: "issued" | "alphanumeric";
  includeNative?: boolean;
  customButtonLabel?: string;
};

export const AssetMultiPicker = ({
  id,
  label,
  labelSuffix,
  values = [],
  error,
  onChange,
  assetInput,
  includeNative = true,
  customButtonLabel = "asset",
}: AssetMultiPickerProps) => {
  let options: AssetObject[] = [];

  if (includeNative) {
    options = [
      {
        id: "native",
        label: "Native",
        value: {
          type: "native",
          code: "",
          issuer: "",
        },
      },
      ...options,
    ];
  }

  if (assetInput === "alphanumeric") {
    options = [
      ...options,
      {
        id: "credit_alphanum4",
        label: "Alphanumeric 4",
        value: {
          type: "credit_alphanum4",
          code: "",
          issuer: "",
        },
      },
      {
        id: "credit_alphanum12",
        label: "Alphanumeric 12",
        value: {
          type: "credit_alphanum12",
          code: "",
          issuer: "",
        },
      },
    ];
  } else {
    options = [
      ...options,
      {
        id: "issued",
        label: "Issued",
        value: {
          type: "issued",
          code: "",
          issuer: "",
        },
      },
    ];
  }

  const updateAssetAtIndex = (value: AssetObjectValue, index: number) => {
    const updatedValues = [...values];
    updatedValues[index] = value;

    return updatedValues;
  };

  return (
    <Box gap="sm">
      <>
        <LabelHeading size="md" labelSuffix={labelSuffix}>
          {label}
        </LabelHeading>
        {values.length ? (
          <Box gap="sm">
            <>
              {values.map((value, index) => (
                <div className="RadioPicker__inset" key={`${id}-${index}`}>
                  <RadioPicker
                    id={`${id}-${index}`}
                    data-testid={`asset-multipicker-${index}`}
                    selectedOption={value.type}
                    label={`#${index + 1}`}
                    onChange={(optionId) => {
                      onChange(
                        updateAssetAtIndex(
                          { type: optionId, code: "", issuer: "" },
                          index,
                        ),
                      );
                    }}
                    options={options}
                  />

                  <ExpandBox
                    isExpanded={Boolean(
                      value.type &&
                        [
                          "issued",
                          "credit_alphanum4",
                          "credit_alphanum12",
                        ].includes(value.type),
                    )}
                    offsetTop="sm"
                  >
                    <AssetPickerFields
                      id={id}
                      code={{
                        value: value.code,
                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                          onChange(
                            updateAssetAtIndex(
                              { ...value, code: e.target.value },
                              index,
                            ),
                          );
                        },
                        error: error?.[index]?.code || "",
                      }}
                      issuer={{
                        value: value.issuer,
                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                          onChange(
                            updateAssetAtIndex(
                              { ...value, issuer: e.target.value },
                              index,
                            ),
                          );
                        },
                        error: error?.[index]?.issuer || "",
                      }}
                    />
                  </ExpandBox>

                  <div>
                    <Button
                      variant="error"
                      size="md"
                      type="button"
                      onClick={() => {
                        const arr = values.filter((_, i) => i !== index);
                        onChange(arr);
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </>
          </Box>
        ) : null}

        <div>
          <Button
            variant="secondary"
            size="md"
            onClick={() => {
              const arr = [...values];
              arr.push({ type: undefined, code: "", issuer: "" });

              onChange(arr);
            }}
            type="button"
          >
            {values.length === 0
              ? `Add ${customButtonLabel}`
              : `Add another ${customButtonLabel}`}
          </Button>
        </div>
      </>
    </Box>
  );
};

type AssetPickerFieldsProps = {
  id: string;
  code: {
    value: string;
    error: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  };
  issuer: {
    value: string;
    error: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  };
};

const AssetPickerFields = ({ id, code, issuer }: AssetPickerFieldsProps) => (
  <div className="RadioPicker__inset">
    <Input
      id={`${id}-code`}
      fieldSize="md"
      label="Asset code"
      value={code.value}
      onChange={code.onChange}
      error={code.error}
    />
    <PubKeyPicker
      id={`${id}-issuer`}
      label="Issuer account ID"
      placeholder="Example: GCEXAMPLE5HWNK4AYSTEQ4UWDKHTCKADVS2AHF3UI2ZMO3DPUSM6Q4UG"
      value={issuer.value}
      onChange={issuer.onChange}
      error={issuer.error}
    />
  </div>
);
