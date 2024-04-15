import React from "react";
import { Textarea, TextareaProps } from "@stellar/design-system";

interface XdrPickerProps extends Omit<TextareaProps, "fieldSize"> {
  id: string;
  fieldSize?: "sm" | "md" | "lg";
  labelSuffix?: string | React.ReactNode;
  label: string | React.ReactNode;
  value: string;
  placeholder?: string;
  error?: string | undefined;
  success?: string | React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  readOnly?: boolean;
}

export const XdrPicker = ({
  id,
  fieldSize = "md",
  labelSuffix,
  label,
  value,
  error,
  success,
  onChange,
  readOnly,
  ...props
}: XdrPickerProps) => (
  <Textarea
    id={id}
    fieldSize={fieldSize}
    label={label}
    labelSuffix={labelSuffix}
    placeholder="Ex: AAAAABbxCy3mLg3hiTqX4VUEEp60pFOrJNxYM1JtxXTwXhY2AAAAZAAAAAMAAAAGAAAAAAAAAAEAAAAAAAAAAQAAAAAAAAAJAAAAAAAAAAHwXhY2AAAAQCPAo8QwsZe9FA0sz/deMdhlu6/zrk7SgkBG22ApvtpETBhnGkX4trSFDz8sVlKqvweqGUVgvjUyM0AcHxyXZQw="
    value={value}
    error={error}
    success={success}
    rows={5}
    onChange={onChange}
    readOnly={readOnly}
    {...props}
  />
);
