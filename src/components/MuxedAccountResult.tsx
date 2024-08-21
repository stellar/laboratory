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
}) => (
  <div className="Account__result" data-testid="createAccount-success">
    <PubKeyPicker
      id="muxed-public-key-result"
      label="Base Account G Address"
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
      label="Muxed Account ID"
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
      label="Muxed Account M Address"
      value={muxedAddress || ""}
      error=""
      readOnly
      copyButton={{
        position: "right",
      }}
    />
  </div>
);
