import React from "react";
import TextPicker from "./TextPicker";
import { StrKey } from "stellar-sdk";

export default function CanonicalAssetTextPicker(props) {
  return (
    <TextPicker
      {...props}
      placeholder={props.placeholder || "Example: native"}
      validator={(value) => {
        let err;
        value.split(",").some((asset) => {
          if (asset != "native") {
            let parts = asset.split(":");
            if (parts.length != 2) {
              err = `Invalid Asset: ${asset}`;
              return true;
            }

            const minLength = 1;
            const maxLength = 12;

            let code = parts[0];
            if (code && !code.match(/^[a-zA-Z0-9]+$/g)) {
              err = `Asset code must consist of only letters and numbers: ${asset}`;
              return true;
            } else if (code.length < minLength || code.length > maxLength) {
              err = `Asset code must be between ${minLength} and ${maxLength} characters long: ${asset}`;
              return true;
            }

            const issuer = parts[1];
            if (!StrKey.isValidEd25519PublicKey(issuer)) {
              err = `Invalid Asset: Public key is invalid ${asset}`;
              return true;
            }
          }
        });
        return err;
      }}
    />
  );
}
