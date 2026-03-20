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
  onChange: (e: React.ChangeEvent<any>) => void;
  onValueChange?: (val: string) => void;
};

/**
 * PubKeyPicker wrapped with SignerSelector to allow selecting from
 * saved keypairs or connected wallet.
 *
 * @param onChange - standard input change handler (e.target.value)
 * @param onValueChange - optional direct value change handler used by
 *   SignerSelector dropdown (receives the selected address string directly)
 *
 * @example
 * <PubKeyPickerWithSignerSelector
 *   id="source_account"
 *   label="Source account"
 *   value={value}
 *   error={error}
 *   onChange={(e) => handleChange(e.target.value)}
 *   onValueChange={(val) => handleChange(val)}
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
  onValueChange,
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
        onChange={onChange}
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
          if (onValueChange) {
            onValueChange(val);
          }
          setIsSelectorOpen(false);
        }}
        isOpen={isSelectorOpen}
        onClose={() => setIsSelectorOpen(false)}
      />
    </div>
  );
};
