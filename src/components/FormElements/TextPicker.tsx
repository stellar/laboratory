import React from "react";
import { Input, InputProps } from "@stellar/design-system";

interface TextPickerProps extends Omit<InputProps, "fieldSize"> {
  id: string;
  fieldSize?: "sm" | "md" | "lg";
  labelSuffix?: string | React.ReactNode;
  label: string;
  value: string;
  error: string | undefined;
  // eslint-disable-next-line no-unused-vars
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const TextPicker = ({
  id,
  fieldSize = "md",
  labelSuffix,
  label,
  value,
  error,
  onChange,
  ...props
}: TextPickerProps) => {
  return (
    <Input
      id={id}
      fieldSize={fieldSize}
      label={label}
      labelSuffix={labelSuffix}
      value={value}
      error={error}
      onChange={onChange}
      {...props}
    />
  );
};
