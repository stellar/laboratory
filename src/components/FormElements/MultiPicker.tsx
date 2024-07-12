import React from "react";

import { Button, Label } from "@stellar/design-system";

import { arrayItem } from "@/helpers/arrayItem";

import { TextPicker } from "@/components/FormElements/TextPicker";
import { Box } from "@/components/layout/Box";

type Values = string[];

type MultiPickerProps = {
  id: string;
  label: string;
  labelSuffix?: string | React.ReactNode;
  onChange: (val: Values) => void;
  placeholder: string;
  validate: (...args: any[]) => any;
  value: Values;
  autocomplete?: React.HTMLInputAutoCompleteAttribute;
  rightElement?: React.ReactNode;
  buttonLabel?: string;
  limit?: number;
};

export const MultiPicker = ({
  id,
  label,
  labelSuffix,
  onChange,
  placeholder,
  validate,
  value,
  autocomplete,
  rightElement,
  buttonLabel = "Add additional",
  limit,
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
                    return onChange([...val]);
                  }}
                  key={index}
                  value={singleVal}
                  error={errorMessage}
                  placeholder={placeholder}
                  autocomplete={autocomplete}
                  rightElement={rightElement}
                />
              );
            })
          : null}
      </>
      <div>
        <Button
          disabled={value.length === limit}
          size="md"
          variant="secondary"
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
