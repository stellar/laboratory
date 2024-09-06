import { useEffect } from "react";
import { PrettyJson } from "@/components/PrettyJson";
import { signatureHint } from "@/helpers/signatureHint";
import { useCheckTxSignatures } from "@/query/useCheckTxSignatures";
import { useStore } from "@/store/useStore";
import { AnyObject } from "@/types/types";

type PrettyJsonTransactionProps = {
  xdr: string;
  json: AnyObject;
};

export const PrettyJsonTransaction = ({
  xdr,
  json,
}: PrettyJsonTransactionProps) => {
  const { network } = useStore();
  const { data, isFetching, isLoading, refetch } = useCheckTxSignatures({
    xdr,
    networkPassphrase: network.passphrase,
    networkUrl: network.horizonUrl,
  });

  const isTx = json?.tx || json?.tx_fee_bump;

  useEffect(() => {
    // Check transaction signatures
    if (isTx) {
      refetch();
    }
  }, [isTx, refetch]);

  const customValueRenderer = (item: any, key: string, parentKey?: string) => {
    // Signature hint
    if (parentKey === "signatures" && key === "hint") {
      return PrettyJson.renderStringValue({ item: signatureHint(item) });
    }

    // Signature check
    if (data && parentKey === "signatures" && key === "signature") {
      const match = data.find((s) => s.sig.equals(Buffer.from(item, "hex")));

      if (match) {
        return PrettyJson.renderStringValue({
          item,
          addlClassName: match.isValid
            ? "PrettyJson--success"
            : "PrettyJson--error",
        });
      }

      return item;
    }

    return null;
  };

  return (
    <PrettyJson
      json={json}
      customValueRenderer={customValueRenderer}
      isLoading={isLoading || isFetching}
    />
  );
};
