import React from "react";
import { Textarea, TextareaProps } from "@stellar/design-system";

interface XdrPickerProps extends Omit<TextareaProps, "fieldSize"> {
  id: string;
  fieldSize?: "sm" | "md" | "lg";
  labelSuffix?: string | React.ReactNode;
  label: string;
  value: string;
  placeholder?: string;
  error: string | undefined;
  // eslint-disable-next-line no-unused-vars
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const XdrPicker = ({
  id,
  fieldSize = "md",
  labelSuffix,
  label,
  value,
  error,
  onChange,
  ...props
}: XdrPickerProps) => {
  return (
    <Textarea
      id={id}
      fieldSize={fieldSize}
      label={label}
      labelSuffix={labelSuffix}
      placeholder="Ex: AAAAABbxCy3mLg3hiTqX4VUEEp60pFOrJNxYM1JtxXTwXhY2AAAAZAAAAAMAAAAGAAAAAAAAAAEAAAAAAAAAAQAAAAAAAAAJAAAAAAAAAAHwXhY2AAAAQCPAo8QwsZe9FA0sz/deMdhlu6/zrk7SgkBG22ApvtpETBhnGkX4trSFDz8sVlKqvweqGUVgvjUyM0AcHxyXZQw="
      value={value}
      error={error}
      rows={5}
      onChange={onChange}
      {...props}
    />
  );
};
