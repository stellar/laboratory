import React from "react";
import { Icon, Input, InputProps } from "@stellar/design-system";

interface PubKeyPickerProps extends Omit<InputProps, "fieldSize"> {
  id: string;
  fieldSize?: "sm" | "md" | "lg";
  label: string;
  labelSuffix?: string | React.ReactNode;
  placeholder?: string;
  readOnly?: boolean;
  disabled?: boolean;
  value: string;
  error: string | undefined;
  onChange?: (e: React.ChangeEvent<any>) => void;
}

export const PubKeyPicker = ({
  id,
  fieldSize = "md",
  label,
  labelSuffix,
  placeholder = "Ex: GCEXAMPLE5HWNK4AYSTEQ4UWDKHTCKADVS2AHF3UI2ZMO3DPUSM6Q4UG",
  value,
  error,
  readOnly,
  disabled,
  onChange,
  ...props
}: PubKeyPickerProps) => (
  <Input
    id={id}
    fieldSize={fieldSize}
    label={label}
    labelSuffix={labelSuffix}
    placeholder={placeholder}
    value={value}
    error={error}
    readOnly={readOnly}
    disabled={disabled}
    onChange={onChange}
    infoLinkIcon={<Icon.InfoCircle />}
    {...props}
  />
);
