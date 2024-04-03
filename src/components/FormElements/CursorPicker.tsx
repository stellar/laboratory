import React from "react";
import { Input, InputProps } from "@stellar/design-system";

interface CursorPickerProps extends Omit<InputProps, "fieldSize"> {
  id: string;
  fieldSize?: "sm" | "md" | "lg";
  labelSuffix?: string | React.ReactNode;
  placeholder?: string;
  value: string;
  error: string | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CursorPicker = ({
  id,
  fieldSize = "md",
  labelSuffix,
  value,
  error,
  onChange,
  ...props
}: CursorPickerProps) => {
  return (
    <Input
      id={id}
      fieldSize={fieldSize}
      label="Cursor"
      labelSuffix={labelSuffix}
      value={value}
      error={error}
      onChange={onChange}
      {...props}
    />
  );
};
