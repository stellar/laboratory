import { useRouter } from "next/navigation";
import { CustomKeyValueLinkMap, PrettyJson } from "@/components/PrettyJson";

import { useStore } from "@/store/useStore";
import { Routes } from "@/constants/routes";
import { AnyObject } from "@/types/types";
import { delayedAction } from "@/helpers/delayedAction";

export const EndpointsJsonResponse = ({ json }: { json: AnyObject }) => {
  const { xdr, endpoints } = useStore();
  const router = useRouter();

  const handleLinkXdr = (val: string, key?: string) => {
    let xdrType = "";

    switch (key) {
      case "envelope_xdr":
        xdrType = "TransactionEnvelope";
        break;
      case "result_xdr":
        xdrType = "TransactionResult";
        break;
      case "result_meta_xdr":
        xdrType = "TransactionMeta";
        break;
      case "fee_meta_xdr":
        xdrType = "OperationMeta";
        break;
      case "header_xdr":
        xdrType = "LedgerHeader";
        break;
      default:
      // Do nothing
    }

    if (xdrType) {
      xdr.updateXdrBlob(val);
      xdr.updateXdrType(xdrType);

      router.push(Routes.VIEW_XDR);
    }
  };

  const handleLinkAccount = (val: string) => {
    if (val.length !== 56) {
      return;
    }

    router.push(Routes.ENDPOINTS_ACCOUNTS_SINGLE);

    delayedAction({
      action: () => {
        endpoints.setParams({ account_id: val });
      },
      delay: 200,
    });
  };

  const customKeyValueLinkAction: CustomKeyValueLinkMap = {
    // Account
    id: {
      action: handleLinkAccount,
      condition: (val: string) => val.length === 56,
    },
    public_key: {
      action: handleLinkAccount,
    },
    account_id: {
      action: handleLinkAccount,
    },
    funder: {
      action: handleLinkAccount,
    },
    account: {
      action: handleLinkAccount,
    },
    source_account: {
      action: handleLinkAccount,
    },
    destination_account: {
      action: handleLinkAccount,
    },
    // XDR
    envelope_xdr: {
      action: handleLinkXdr,
    },
    result_xdr: {
      action: handleLinkXdr,
    },
    result_meta_xdr: {
      action: handleLinkXdr,
    },
    fee_meta_xdr: {
      action: handleLinkXdr,
    },
    header_xdr: {
      action: handleLinkXdr,
    },
  };

  return (
    <PrettyJson json={json} customKeyValueLinkMap={customKeyValueLinkAction} />
  );
};
