import { StrKey } from "@stellar/stellar-sdk";

import TextPicker from "components/FormComponents/TextPicker.js";
import { ImportMark } from "components/ImportMark.js";
import { useFreighter, freighterGetPublicKey } from "helpers/useFreighter.js";

interface MuxedKeyPickerProps {
  [key: string]: any;
  placeholder?: string;
  value: string;
  onUpdate: (value: string) => void;
}

export default function MuxedKeyPicker({
  placeholder,
  value,
  onUpdate,
  ...props
}: MuxedKeyPickerProps) {
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
        validator={(value: string) => {
          // TODO: remove when type is added to @stellar/stellar-sdk
          // @ts-ignore
          if (!StrKey.isValidMed25519PublicKey(value)) {
            return "Muxed account address is invalid.";
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
