"use client";
// TODO: move to SDS
import React, { cloneElement } from "react";
// TODO: update imports
import { Label, Icon } from "@stellar/design-system";
import { FieldNote } from "../FieldNote";
import "./styles.scss";

/** Including all valid [select attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#attributes). */
export interface SelectProps {
  /** ID of the select (should be unique) */
  id: string;
  // Note: cannot use "size" here because it's input's native property
  /** Size of the select */
  fieldSize: "sm" | "md" | "lg";
  /** Select options or optgroup with options */
  children: React.ReactNode;
  /** Label of the select */
  label?: string | React.ReactNode;
  /** Note message of the select */
  note?: string | React.ReactNode;
  /** Error message of the select */
  error?: string | string;
  /** Make label uppercase */
  isLabelUppercase?: boolean;
  /** Select error without a message */
  isError?: boolean;
  /** Use a specific select rather than a generic HTML select (useful for Formik or otherwise controlled selects) */
  customSelect?: React.ReactElement;
}

interface Props
  extends SelectProps,
    React.SelectHTMLAttributes<HTMLSelectElement> {
  id: string;
  children: React.ReactNode;
}

/**
 * The `Select` component is a form `select` element that inherits all native HTML `select` element attributes.
 */
export const Select: React.FC<Props> = ({
  id,
  fieldSize,
  children,
  label,
  note,
  error,
  isLabelUppercase,
  isError,
  customSelect,
  ...props
}: Props) => {
  const additionalClasses = [
    `Select--${fieldSize}`,
    ...(props.disabled ? ["Select--disabled"] : []),
    ...(isError || error ? ["Select--error"] : []),
  ].join(" ");

  const baseSelectProps = {
    id,
    "aria-invalid": !!(isError || error),
  };

  return (
    <div className={`Select ${additionalClasses}`}>
      {label && (
        <Label htmlFor={id} isUppercase={isLabelUppercase} size={fieldSize}>
          {label}
        </Label>
      )}

      <div className="Select__container">
        {customSelect ? (
          cloneElement(customSelect, { ...baseSelectProps, ...props })
        ) : (
          <>
            <select {...baseSelectProps} {...props}>
              {children}
            </select>
            <span className="Select__icon" aria-hidden="true">
              <Icon.ChevronDown />
            </span>
          </>
        )}
      </div>

      {note && <FieldNote size={fieldSize}>{note}</FieldNote>}
      {error && (
        <FieldNote size={fieldSize} variant="error">
          {error}
        </FieldNote>
      )}
    </div>
  );
};

Select.displayName = "Select";
