/** @format */
import React from "react";
import { StrKey } from "stellar-sdk";

import TextPicker from "./TextPicker";
import { ImportMark } from "../ImportMark";
import {
  useFreighter,
  freighterGetPublicKey,
} from "../../utilities/useFreighter";

export default function MuxedKeyPicker({
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
          "Example: MBRWSVNURRYVIYSWLRFQ5AAAUWPKOZZNZVVVIXHFGUSGIRVKLVIDYAAAAAAAAAAD5GJ4U"
        }
        validator={(value) => {
          if (!value.startsWith("M") || value.length !== 69) {
            return "Muxed account address is invalid.";
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
