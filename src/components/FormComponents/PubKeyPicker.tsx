import { StrKey } from "@stellar/stellar-sdk";

import TextPicker from "components/FormComponents/TextPicker.js";
import { ImportMark } from "components/ImportMark.js";
import { useFreighter, freighterGetPublicKey } from "helpers/useFreighter.js";

interface PubKeyPickerProps {
  [key: string]: any;
  placeholder?: string;
  value: string;
  onUpdate: (value: string) => void;
}

export default function PubKeyPicker({
  placeholder,
  value,
  onUpdate,
  ...props
}: PubKeyPickerProps) {
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
        validator={(value: string) => {
          if (value.startsWith("M")) {
            // TODO: remove when type is added to stellar-sdk
            // @ts-ignore
            if (!StrKey.isValidMed25519PublicKey(value)) {
              return "Muxed account address is invalid.";
            }
          } else if (!StrKey.isValidEd25519PublicKey(value)) {
            return "Public key is invalid.";
          }

          return null;
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
