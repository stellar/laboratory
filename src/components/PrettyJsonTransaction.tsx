import { useEffect } from "react";
import { toSafeNumberOrThrow } from "lossless-json";

import { PrettyJson } from "@/components/PrettyJson";
import { signatureHint } from "@/helpers/signatureHint";
import { xdrUtils } from "@/helpers/xdr/utils";
import { formatAmount } from "@/helpers/formatAmount";
import { getNetworkHeaders } from "@/helpers/getNetworkHeaders";

import { useCheckTxSignatures } from "@/query/useCheckTxSignatures";
import { useStore } from "@/store/useStore";

import { AnyObject } from "@/types/types";

type PrettyJsonTransactionProps = {
  xdr: string;
  json: AnyObject;
  isCodeWrapped?: boolean;
};

export const PrettyJsonTransaction = ({
  xdr,
  json,
  isCodeWrapped,
}: PrettyJsonTransactionProps) => {
  const { network } = useStore();
  const { data, error, isFetching, isLoading, refetch } = useCheckTxSignatures({
    xdr,
    networkPassphrase: network.passphrase,
    networkUrl: network.horizonUrl,
    headers: getNetworkHeaders(network, "horizon"),
  });

  const isTx = Boolean(json?.tx || json?.tx_fee_bump);

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

    // Amount
    const amountKeys = [
      "amount",
      "buy_amount",
      "starting_balance",
      "send_max",
      "send_amount",
      "dest_min",
      "dest_amount",
      "limit",
    ];

    if (amountKeys.includes(key)) {
      const parsedAmount = xdrUtils.fromAmount(item);
      let formattedAmount = "";

      try {
        formattedAmount = formatAmount(toSafeNumberOrThrow(parsedAmount));
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        // It might fail for BigInt
        formattedAmount = formatAmount(parsedAmount as any);
      }

      if (formattedAmount) {
        return PrettyJson.renderStringValue({
          item: `${formattedAmount} (raw: ${item})`,
          itemType: "number",
        });
      }

      return PrettyJson.renderStringValue({ item });
    }

    // Manage data
    if (parentKey === "manage_data") {
      if (key === "data_name") {
        return PrettyJson.renderStringValue({
          item: `${item} (hex: ${Buffer.from(item).toString("base64")})`,
        });
      }

      if (key === "data_value") {
        return PrettyJson.renderStringValue({
          item: `${Buffer.from(item, "hex").toString()} (hex: ${Buffer.from(item, "hex").toString("base64")})`,
        });
      }
    }

    return null;
  };

  const customKeyRenderer = (item: any, key: string) => {
    if (key === "signatures") {
      if (error) {
        return (
          <div className="PrettyJson--error">
            <div className="PrettyJson__key__note">{error.toString()}</div>
          </div>
        );
      }

      if (item?.length > 0) {
        return (
          <div className="PrettyJson__key__note">· Signatures Checked</div>
        );
      }
    }

    return null;
  };

  return (
    <PrettyJson
      json={json}
      customValueRenderer={customValueRenderer}
      customKeyRenderer={customKeyRenderer}
      isLoading={isLoading || isFetching}
      isCodeWrapped={isCodeWrapped}
    />
  );
};
