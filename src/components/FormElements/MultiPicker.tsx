import React from "react";

import { Label } from "@stellar/design-system";
import { arrayItem } from "@/helpers/arrayItem";

import { TextPicker } from "@/components/FormElements/TextPicker";
import { Box } from "@/components/layout/Box";

type Values = string[];

type MultiPickerProps = {
  id: string;
  label: string;
  labelSuffix?: string | React.ReactNode;
  onUpdate: (val: Values) => void;
  placeholder: string;
  validate: (...args: any[]) => any;
  value: Values;
  autocomplete?: React.HTMLInputAutoCompleteAttribute;
};

export const MultiPicker = ({
  id,
  label,
  labelSuffix,
  onUpdate,
  placeholder,
  validate,
  value,
  autocomplete,
}: MultiPickerProps) => {
  if (!value || !value.length) {
    value = [];
  }

  return (
    <Box gap="sm">
      <Label htmlFor="" size="md" labelSuffix={labelSuffix}>
        {label}
      </Label>
      <>
        {value.length
          ? value.map((singleVal: string, index: number) => {
              const errorMessage = singleVal ? validate(singleVal) : false;

              return (
                <TextPicker
                  id={`${id}-${index}`}
                  onChange={(e) => {
                    const val = arrayItem.update(value, index, e.target.value);
                    return onUpdate([...val]);
                  }}
                  key={index}
                  value={singleVal}
                  error={errorMessage}
                  placeholder={placeholder}
                  autocomplete={autocomplete}
                />
              );
            })
          : null}
      </>
    </Box>
  );
};
