import { Input } from "@stellar/design-system";
import { useStore } from "@/store/useStore";

import { PubKeyPicker } from "@/components/FormElements/PubKeyPicker";

export const MuxedAccountResult = () => {
  const { account } = useStore();

  return (
    <div className="Account__result">
      <PubKeyPicker
        id="muxed-public-key-result"
        label="Base Account G Address"
        value={account.parsedMuxedAccount?.baseAddress || ""}
        error=""
        readOnly={true}
        copyButton={{
          position: "right",
        }}
      />

      <Input
        id="muxed-account-id-result"
        fieldSize="md"
        label="Muxed Account Id"
        value={account.parsedMuxedAccount?.id}
        error=""
        readOnly={true}
        copyButton={{
          position: "right",
        }}
      />

      <Input
        id="muxed-account-address-result"
        fieldSize="md"
        label="Muxed Account M Address"
        value={account.parsedMuxedAccount?.muxedAddress}
        error=""
        readOnly={true}
        copyButton={{
          position: "right",
        }}
      />
    </div>
  );
};
