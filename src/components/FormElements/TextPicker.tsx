import React from "react";
import { Input, InputProps } from "@stellar/design-system";

interface TextPickerProps extends Omit<InputProps, "fieldSize"> {
  id: string;
  fieldSize?: "sm" | "md" | "lg";
  labelSuffix?: string | React.ReactNode;
  label: string;
  value: string;
  placeholder?: string;
  error?: string | undefined;
  readOnly?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const TextPicker = ({
  id,
  fieldSize = "md",
  labelSuffix,
  label,
  value,
  error,
  readOnly,
  onChange,
  ...props
}: TextPickerProps) => (
  <Input
    id={id}
    fieldSize={fieldSize}
    label={label}
    labelSuffix={labelSuffix}
    value={value}
    error={error}
    readOnly={readOnly}
    onChange={onChange}
    {...props}
  />
);
