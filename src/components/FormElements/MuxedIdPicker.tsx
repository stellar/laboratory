import React from "react";
import { Input, InputProps } from "@stellar/design-system";

interface MuxedIdPickerProps extends Omit<InputProps, "fieldSize"> {
  id: string;
  fieldSize?: "sm" | "md" | "lg";
  label: string;
  labelSuffix?: string | React.ReactNode;
  placeholder?: string;
  readOnly?: boolean;
  value: string;
  error: string | undefined | false;
  // eslint-disable-next-line no-unused-vars
  onChange?: (e: React.ChangeEvent<any>) => void;
}

export const MuxedIdPicker = ({
  id,
  fieldSize = "md",
  label,
  labelSuffix,
  placeholder = "Ex: 1",
  value,
  error,
  onChange,
  ...props
}: MuxedIdPickerProps) => (
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
