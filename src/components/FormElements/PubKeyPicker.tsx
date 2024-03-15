import React from "react";
import { StrKey } from "stellar-sdk";
import { Input, InputProps } from "@stellar/design-system";

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
}: PubKeyPickerProps) => {
  const validatePublicKey = (issuer: string) => {
    if (!issuer) {
      return "Asset issuer is required.";
    }

    if (issuer.startsWith("M")) {
      if (!StrKey.isValidMed25519PublicKey(issuer)) {
        return "Muxed account address is invalid.";
      }
    } else if (!StrKey.isValidEd25519PublicKey(issuer)) {
      return "Public key is invalid.";
    }

    return "";
  };

  return (
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
};
