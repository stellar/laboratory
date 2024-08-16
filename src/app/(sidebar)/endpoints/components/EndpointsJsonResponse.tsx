import { useRouter } from "next/navigation";
import { CustomKeyValueLinkMap, PrettyJson } from "@/components/PrettyJson";

import { useStore } from "@/store/useStore";
import { Routes } from "@/constants/routes";
import { delayedAction } from "@/helpers/delayedAction";
import { sanitizeArray } from "@/helpers/sanitizeArray";
import { AnyObject } from "@/types/types";

export const EndpointsJsonResponse = ({
  json,
  onReset,
}: {
  json: AnyObject;
  onReset: () => void;
}) => {
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
      onReset();
    }
  };

  const handleLinkAccount = (val: string) => {
    if (val.length !== 56) {
      return;
    }

    router.push(Routes.ENDPOINTS_ACCOUNTS_SINGLE);
    onReset();

    delayedAction({
      action: () => {
        endpoints.setParams({ account_id: val });
      },
      delay: 200,
    });
  };

  const parseUrl = (val: string) => {
    if (!val) {
      return {};
    }

    const url = new URL(val);

    const paths = sanitizeArray(url.pathname.split("/")).map((pn) => {
      // Remove { "%7B" character
      return pn.replace("%7B", "");
    });

    return { paths, searchParams: url.searchParams };
  };

  const handleLinkHref = (val: string) => {
    let route: Routes | null = null;
    let params: AnyObject = {};

    const { paths, searchParams } = parseUrl(val);

    if (!paths) {
      return;
    }

    // Get the route
    switch (paths[0]) {
      // Accounts
      case "accounts":
        if (paths.length === 2) {
          route = Routes.ENDPOINTS_ACCOUNTS_SINGLE;
        } else if (paths.length === 3) {
          switch (paths[2]) {
            case "transactions":
              route = Routes.ENDPOINTS_TRANSACTIONS_ACCOUNT;
              break;
            case "operations":
              route = Routes.ENDPOINTS_OPERATIONS_ACCOUNT;
              break;
            case "payments":
              route = Routes.ENDPOINTS_PAYMENTS_ACCOUNT;
              break;
            case "effects":
              route = Routes.ENDPOINTS_EFFECTS_ACCOUNT;
              break;
            case "offers":
              route = Routes.ENDPOINTS_OFFERS_ACCOUNT;
              break;
            case "trades":
              route = Routes.ENDPOINTS_TRADES_ACCOUNT;
              break;
            default:
            // Do nothing
          }
        } else {
          route = Routes.ENDPOINTS_ACCOUNTS;
        }

        if (paths[1]) {
          params = { account_id: paths[1] };
        }
        break;
      // Assets
      case "assets":
        if (paths[0]) {
          route = Routes.ENDPOINTS_ASSETS;
        }

        break;
      // Claimable balances
      case "claimable_balances":
        if (paths.length === 2) {
          route = Routes.ENDPOINTS_CLAIMABLE_BALANCES_SINGLE;
        } else {
          route = Routes.ENDPOINTS_CLAIMABLE_BALANCES;
        }

        if (paths[1]) {
          params = { claimable_balance_id: paths[1] };
        }

        break;
      // Effects
      case "effects":
        if (paths[0]) {
          route = Routes.ENDPOINTS_EFFECTS;
        }

        break;
      // Ledgers
      case "ledgers":
        if (paths.length === 2) {
          route = Routes.ENDPOINTS_LEDGERS_SINGLE;
        } else if (paths.length === 3) {
          switch (paths[2]) {
            case "transactions":
              route = Routes.ENDPOINTS_TRANSACTIONS_LEDGER;
              break;
            case "operations":
              route = Routes.ENDPOINTS_OPERATIONS_LEDGER;
              break;
            case "payments":
              route = Routes.ENDPOINTS_PAYMENTS_LEDGER;
              break;
            case "effects":
              route = Routes.ENDPOINTS_EFFECTS_LEDGER;
              break;
            default:
            // Do nothing
          }
        } else {
          route = Routes.ENDPOINTS_LEDGERS;
        }

        if (paths[1]) {
          params = { ledger: paths[1] };
        }

        break;
      // Liquidity pools
      case "liquidity_pools":
        if (paths.length === 2) {
          route = Routes.ENDPOINTS_LIQUIDITY_POOLS_SINGLE;
        } else if (paths.length === 3) {
          switch (paths[2]) {
            case "transactions":
              route = Routes.ENDPOINTS_TRANSACTIONS_LIQUIDITY_POOL;
              break;
            case "operations":
              route = Routes.ENDPOINTS_OPERATIONS_LIQUIDITY_POOL;
              break;
            default:
            // Do nothing
          }
        } else {
          route = Routes.ENDPOINTS_LIQUIDITY_POOLS;
        }

        if (paths[1]) {
          params = { liquidity_pool_id: paths[1] };
        }

        break;
      // Offers
      case "offers":
        if (paths.length === 2) {
          route = Routes.ENDPOINTS_OFFERS_SINGLE;
        } else {
          route = Routes.ENDPOINTS_OFFERS;
        }

        if (paths[1]) {
          params = { offer_id: paths[1] };
        }

        break;
      // Operations
      case "operations":
        if (paths.length === 2) {
          route = Routes.ENDPOINTS_OPERATIONS_SINGLE;
        } else if (paths.length === 3) {
          switch (paths[2]) {
            case "effects":
              route = Routes.ENDPOINTS_EFFECTS_OPERATION;
              break;
            default:
            // Do nothing
          }
        } else {
          route = Routes.ENDPOINTS_OPERATIONS;
        }

        if (paths[1]) {
          params = { operation: paths[1] };
        }

        break;
      // Payments
      case "payments":
        if (paths[0]) {
          route = Routes.ENDPOINTS_PAYMENTS;
        }
        break;
      // Trades
      case "trades":
        if (paths[0]) {
          route = Routes.ENDPOINTS_TRADES;
        }
        break;
      // Transactions
      case "transactions":
        if (paths.length === 2) {
          route = Routes.ENDPOINTS_TRANSACTIONS_SINGLE;
        } else if (paths.length === 3) {
          switch (paths[2]) {
            case "operations":
              route = Routes.ENDPOINTS_OPERATIONS_TRANSACTION;
              break;
            case "effects":
              route = Routes.ENDPOINTS_EFFECTS_TRANSACTION;
              break;
            default:
            // Do nothing
          }
        } else {
          route = Routes.ENDPOINTS_TRANSACTIONS;
        }

        if (paths[1]) {
          params = { transaction: paths[1] };
        }

        break;
      default:
      // Do nothing
    }

    // Add search params
    for (const [key, val] of searchParams.entries()) {
      if (key && val) {
        // Asset requires special formatting
        if (key === "asset") {
          let asset = JSON.stringify({ code: "", issuer: "", type: "native" });

          if (val !== "native") {
            const [code, issuer] = val.split(":");

            asset = JSON.stringify({ code, issuer, type: "issued" });

            params = { ...params, asset };
          }
        } else {
          params = { ...params, [key]: val };
        }
      }
    }

    if (route) {
      router.push(route);
      onReset();

      delayedAction({
        action: () => {
          endpoints.setParams(params);
        },
        delay: 200,
      });
    }
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
    // Link
    href: {
      action: handleLinkHref,
      condition: (val: string) => {
        const { paths } = parseUrl(val);

        if (!paths) {
          return false;
        }

        if (paths[0] === "accounts" && paths[2] === "data") {
          return false;
        }

        // TODO: We currently don't have transactions and operations for
        // claimable balances
        if (
          paths[0] === "claimable_balances" &&
          ["transactions", "operations"].includes(paths[2])
        ) {
          return false;
        }

        return true;
      },
    },
  };

  return (
    <PrettyJson json={json} customKeyValueLinkMap={customKeyValueLinkAction} />
  );
};
