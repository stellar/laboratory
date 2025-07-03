import React from "react";
import { Icon, Input, InputProps } from "@stellar/design-system";

interface PositiveIntPickerProps extends Omit<InputProps, "fieldSize"> {
  id: string;
  fieldSize?: "sm" | "md" | "lg";
  labelSuffix?: string | React.ReactNode;
  label: string | React.ReactNode;
  value: string;
  placeholder?: string;
  error: string | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
  disabled?: boolean;
}

export const PositiveIntPicker = ({
  id,
  fieldSize = "md",
  labelSuffix,
  label,
  value,
  error,
  onChange,
  readOnly,
  disabled,
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
      readOnly={readOnly}
      disabled={disabled}
      infoLinkIcon={<Icon.InfoCircle />}
      {...props}
    />
  );
};
