import React from "react";
import { Input, InputProps } from "@stellar/design-system";
import { validatePublicKey } from "@/helpers/validatePublicKey";

interface PubKeyPickerProps extends Omit<InputProps, "fieldSize"> {
  id: string;
  fieldSize?: "sm" | "md" | "lg";
  label: string;
  labelSuffix?: string | React.ReactNode;
  placeholder?: string;
  value: string;
  error: string | "";
  // eslint-disable-next-line no-unused-vars
  onChange: (value: string, error: string) => void;
  // eslint-disable-next-line no-unused-vars
  onBlur: (value: string, error: string) => void;
}

export const PubKeyPicker = ({
  id,
  fieldSize = "md",
  label,
  labelSuffix,
  placeholder = "Example: GCEXAMPLE5HWNK4AYSTEQ4UWDKHTCKADVS2AHF3UI2ZMO3DPUSM6Q4UG",
  value,
  error,
  onChange,
  onBlur,
  ...props
}: PubKeyPickerProps) => (
  <Input
    id={id}
    fieldSize={fieldSize}
    label={label}
    labelSuffix={labelSuffix}
    placeholder={placeholder}
    value={value}
    onChange={(e) => {
      const error = validatePublicKey(e.target.value);
      onChange(e.target.value, error);
    }}
    onBlur={(e) => {
      const error = validatePublicKey(e.target.value);
      onBlur(e.target.value, error);
    }}
    error={error}
    {...props}
  />
);
