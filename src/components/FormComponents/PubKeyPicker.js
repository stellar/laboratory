import React from "react";
import TextPicker from "./TextPicker";
import { StrKey } from "stellar-sdk";

export default function PubKeyPicker({
  placeholder,
  value,
  onUpdate,
  ...props
}) {
  return (
    <TextPicker
      {...props}
      value={value}
      onUpdate={onUpdate}
      placeholder={
        placeholder ||
        "Example: GCEXAMPLE5HWNK4AYSTEQ4UWDKHTCKADVS2AHF3UI2ZMO3DPUSM6Q4UG"
      }
      validator={(value) => {
        if (!StrKey.isValidEd25519PublicKey(value)) {
          return "Public key is invalid.";
        }
      }}
    />
  );
}
