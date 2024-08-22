import React from "react";
import { Input, InputProps } from "@stellar/design-system";

interface LimitPickerProps extends Omit<InputProps, "fieldSize"> {
  id: string;
  fieldSize?: "sm" | "md" | "lg";
  labelSuffix?: string | React.ReactNode;
  value: string;
  placeholder?: string;
  error: string | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const LimitPicker = ({
  id,
  fieldSize = "md",
  labelSuffix,
  value,
  error,
  onChange,
  ...props
}: LimitPickerProps) => {
  return (
    <Input
      id={id}
      fieldSize={fieldSize}
      label="Limit"
      labelSuffix={labelSuffix}
      value={value}
      error={error}
      onChange={onChange}
      {...props}
    />
  );
};
