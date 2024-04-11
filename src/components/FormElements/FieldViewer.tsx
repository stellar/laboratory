import React from "react";
import {
  Input,
  InputProps,
  Textarea,
  TextareaProps,
} from "@stellar/design-system";

const MIN_LENGTH_FOR_FULL_WIDTH_FIELD = 30;

interface FieldViewerProps extends Omit<InputProps, "fieldSize"> {
  id: string;
  fieldSize?: "sm" | "md" | "lg";
  label: string;
  labelSuffix?: string | React.ReactNode;
  placeholder?: string;
  readOnly?: boolean;
  value: string;
  error: string | undefined;
  onChange?: (e: React.ChangeEvent<any>) => void;
}

// length > 30 to be a full width

export const FieldViewer = ({
  id,
  fieldSize = "md",
  label,
  labelSuffix,
  placeholder = "Ex: GCEXAMPLE5HWNK4AYSTEQ4UWDKHTCKADVS2AHF3UI2ZMO3DPUSM6Q4UG",
  value,
  error,
  readOnly,
  ...props
}: FieldViewerProps) => (
  <Input
    id={id}
    fieldSize={fieldSize}
    label={label}
    labelSuffix={labelSuffix}
    placeholder={placeholder}
    value={value}
    error={error}
    {...props}
  />
);
