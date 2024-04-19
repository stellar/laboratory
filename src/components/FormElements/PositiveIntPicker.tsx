import React from "react";
import { Input, InputProps } from "@stellar/design-system";

interface PositiveIntPickerProps extends Omit<InputProps, "fieldSize"> {
  id: string;
  fieldSize?: "sm" | "md" | "lg";
  labelSuffix?: string | React.ReactNode;
  label: string;
  value: string;
  placeholder?: string;
  error: string | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PositiveIntPicker = ({
  id,
  fieldSize = "md",
  labelSuffix,
  label,
  value,
  error,
  onChange,
  onBlur,
  ...props
}: PositiveIntPickerProps) => {
  return (
    <Input
      id={id}
      fieldSize={fieldSize}
      label={label}
      labelSuffix={labelSuffix}
      value={value}
      error={error}
      onChange={onChange}
      onBlur={onBlur}
      {...props}
    />
  );
};
