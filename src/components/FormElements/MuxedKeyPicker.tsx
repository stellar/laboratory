import React from "react";
import { Input, InputProps } from "@stellar/design-system";

interface MuxedKeyPickerProps extends Omit<InputProps, "fieldSize"> {
  id: string;
  fieldSize?: "sm" | "md" | "lg";
  label: string;
  labelSuffix?: string | React.ReactNode;
  placeholder?: string;
  readOnly?: boolean;
  value: string;
  error: string | undefined;
  // eslint-disable-next-line no-unused-vars
  onChange?: (e: React.ChangeEvent<any>) => void;
}

export const MuxedKeyPicker = ({
  id,
  fieldSize = "md",
  label,
  labelSuffix,
  placeholder = "Ex: MBRWSVNURRYVIYSWLRFQ5AAAUWPKOZZNZVVVIXHFGUSGIRVKLVIDYAAAAAAAAAAD5GJ4U",
  value,
  error,
  onChange,
  ...props
}: MuxedKeyPickerProps) => (
  <Input
    id={id}
    fieldSize={fieldSize}
    label={label}
    labelSuffix={labelSuffix}
    placeholder={placeholder}
    value={value}
    error={error}
    onChange={onChange}
    {...props}
  />
);
