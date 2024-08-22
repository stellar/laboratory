import React from "react";
import { Input, InputProps } from "@stellar/design-system";

interface TextPickerProps extends Omit<InputProps, "fieldSize"> {
  id: string;
  fieldSize?: "sm" | "md" | "lg";
  labelSuffix?: string | React.ReactNode;
  label?: string;
  value: string;
  placeholder?: string;
  error?: string | undefined;
  readOnly?: boolean;
  autocomplete?: React.HTMLInputAutoCompleteAttribute;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const TextPicker = ({
  id,
  fieldSize = "md",
  labelSuffix,
  label,
  value,
  error,
  onChange,
  readOnly,
  autocomplete,
  ...props
}: TextPickerProps) => (
  <Input
    id={id}
    fieldSize={fieldSize}
    label={label}
    labelSuffix={labelSuffix}
    value={value}
    error={error}
    onChange={onChange}
    readOnly={readOnly}
    autoComplete={autocomplete}
    {...props}
  />
);
