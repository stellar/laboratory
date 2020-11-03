/** @format */
import React from "react";
import { StrKey } from "stellar-sdk";

import TextPicker from "./TextPicker";
import { ImportMark } from "../ImportMark";
import {
  useFreighter,
  freighterGetPublicKey,
} from "../../utilities/useFreighter";

export default function PubKeyPicker({
  placeholder,
  value,
  onUpdate,
  ...props
}) {
  const hasFreighter = useFreighter();

  return (
    <div className="PubKeyPicker">
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
      {hasFreighter && (
        <button
          type="button"
          onClick={() => freighterGetPublicKey(onUpdate)}
          className="s-button__icon PubKeyPicker__activator"
        >
          <ImportMark width={24} />
        </button>
      )}
    </div>
  );
}
