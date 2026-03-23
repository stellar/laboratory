"use client";

import React, { useState } from "react";

import { PubKeyPicker } from "@/components/FormElements/PubKeyPicker";
import { SignerSelector } from "@/components/SignerSelector";

type PubKeyPickerWithSignerSelectorProps = {
  id: string;
  label: string;
  labelSuffix?: string | React.ReactNode;
  placeholder?: string;
  value: string;
  error: string | undefined;
  onChange: (val: string) => void;
};

/**
 * PubKeyPicker wrapped with SignerSelector to allow selecting from
 * saved keypairs or connected wallet.
 *
 * @param id - unique HTML id for the input element
 * @param label - visible label text for the input
 * @param labelSuffix - optional suffix rendered next to the label (e.g. "optional")
 * @param placeholder - placeholder text for the input
 * @param value - controlled input value
 * @param error - validation error message to display, or undefined if valid
 * @param onChange - called with the new value string on both text input and
 *   SignerSelector dropdown selection
 *
 * @example
 * <PubKeyPickerWithSignerSelector
 *   id="source_account"
 *   label="Source account"
 *   value={value}
 *   error={error}
 *   onChange={(val) => handleChange(val)}
 * />
 */
export const PubKeyPickerWithSignerSelector = ({
  id,
  label,
  labelSuffix,
  placeholder,
  value,
  error,
  onChange,
}: PubKeyPickerWithSignerSelectorProps) => {
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  return (
    <div className="SignerSelectorWrapper">
      <PubKeyPicker
        id={id}
        label={label}
        labelSuffix={labelSuffix}
        placeholder={placeholder}
        value={value}
        error={error}
        onChange={(e) => onChange(e.target.value)}
        rightElement={
          <SignerSelector.Button
            mode="public"
            onClick={() => setIsSelectorOpen(!isSelectorOpen)}
          />
        }
      />
      <SignerSelector.Dropdown
        mode="public"
        onChange={(val) => {
          onChange(val);
          setIsSelectorOpen(false);
        }}
        isOpen={isSelectorOpen}
        onClose={() => setIsSelectorOpen(false)}
      />
    </div>
  );
};
