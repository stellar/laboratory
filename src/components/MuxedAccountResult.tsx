import { Input } from "@stellar/design-system";

import { PubKeyPicker } from "@/components/FormElements/PubKeyPicker";

export const MuxedAccountResult = ({
  baseAddress,
  muxedId,
  muxedAddress,
}: {
  baseAddress: string;
  muxedId: string;
  muxedAddress: string;
}) => {
  // CAP-84 muxed contract (W...) on a contract (C...) base
  const isMuxedContract = muxedAddress.startsWith("W");

  return (
    <div className="Account__result" data-testid="createAccount-success">
      <PubKeyPicker
        id="muxed-public-key-result"
        label={
          isMuxedContract ? "Base Contract C Address" : "Base Account G Address"
        }
        value={baseAddress || ""}
        error=""
        readOnly
        copyButton={{
          position: "right",
        }}
      />

      <Input
        id="muxed-account-id-result"
        fieldSize="md"
        label="Muxed account ID"
        value={muxedId || ""}
        error=""
        readOnly
        copyButton={{
          position: "right",
        }}
      />

      <Input
        id="muxed-account-address-result"
        fieldSize="md"
        label={
          isMuxedContract
            ? "Muxed Contract W Address"
            : "Muxed Account M Address"
        }
        value={muxedAddress || ""}
        error=""
        readOnly
        copyButton={{
          position: "right",
        }}
      />
    </div>
  );
};
