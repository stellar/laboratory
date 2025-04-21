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
  disabled?: boolean;
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
  disabled,
  ...props
}: XdrPickerProps) => {

  //Internal function that cleans up the input by removing newlines and extra spaces
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      // Clean the value by removing all whitespace (including newlines)
      const cleanedValue = e.target.value.replace(/\s+/g, '');
      
      // Create a new event with the cleaned value
      const newEvent = {
        ...e,
        target: {
          ...e.target,
          value: cleanedValue
        }
      } as React.ChangeEvent<HTMLTextAreaElement>;
      
      // Pass the cleaned event to the parent component
      onChange(newEvent);
    }
  };

  return (
    <Textarea
      id={id}
      fieldSize={fieldSize}
      label={label}
      value={value}
      labelSuffix={labelSuffix}
      placeholder="Ex: AAAAABbxCy3mLg3hiTqX4VUEEp60pFOrJNxYM1JtxXTwXhY2AAAAZAAAAAMAAAAGAAAAAAAAAAEAAAAAAAAAAQAAAAAAAAAJAAAAAAAAAAHwXhY2AAAAQCPAo8QwsZe9FA0sz/deMdhlu6/zrk7SgkBG22ApvtpETBhnGkX4trSFDz8sVlKqvweqGUVgvjUyM0AcHxyXZQw="
      error={error}
      success={success}
      rows={5}
      onChange={handleChange}
      readOnly={readOnly}
      disabled={disabled}
      {...props}
    >
      {props.children}
    </Textarea>
  );
};
