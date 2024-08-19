import { stringify } from "zustand-querystring";

import { CustomKeyValueLinkMap, PrettyJson } from "@/components/PrettyJson";
import { Routes } from "@/constants/routes";
import { sanitizeArray } from "@/helpers/sanitizeArray";
import { isEmptyObject } from "@/helpers/isEmptyObject";

import { AnyObject } from "@/types/types";

export const EndpointsJsonResponse = ({ json }: { json: AnyObject }) => {
  const buildHref = (route: Routes | null, params: AnyObject = {}) => {
    if (!route) {
      return "";
    }

    const SPLIT_CHAR = ";&";
    const END_CHAR = ";;";

    const storeParams = window.location.search
      .replace(END_CHAR, "")
      .split(SPLIT_CHAR)
      .map((i) => {
        // Trigger PR preview
        // Remove existing Endpoints or XDR params
        if (i.startsWith("endpoints$") || i.startsWith("xdr$")) {
          return "";
        }

        return i;
      });

    // Add XDR params
    if (route.startsWith("/xdr")) {
      storeParams.push(`xdr$${stringify(params)}`);
    }

    // Add Endpoints params
    if (route.startsWith("/endpoints") && !isEmptyObject(params)) {
      storeParams.push(`endpoints$params$${stringify(params)}`);
    }

    return `${route}${sanitizeArray(storeParams).join(SPLIT_CHAR)}${END_CHAR}`;
  };

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
      return buildHref(Routes.VIEW_XDR, { blob: val, type: xdrType });
    }

    return "";
  };

  const handleLinkAccount = (val: string) => {
    if (val.length !== 56) {
      return "";
    }

    return buildHref(Routes.ENDPOINTS_ACCOUNTS_SINGLE, { account_id: val });
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
      return "";
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

    return buildHref(route, params);
  };

  const customKeyValueLinkAction: CustomKeyValueLinkMap = {
    // Account
    id: {
      getHref: handleLinkAccount,
      condition: (val: string) => val.length === 56,
    },
    public_key: {
      getHref: handleLinkAccount,
    },
    account_id: {
      getHref: handleLinkAccount,
    },
    funder: {
      getHref: handleLinkAccount,
    },
    account: {
      getHref: handleLinkAccount,
    },
    source_account: {
      getHref: handleLinkAccount,
    },
    destination_account: {
      getHref: handleLinkAccount,
    },
    // XDR
    envelope_xdr: {
      getHref: handleLinkXdr,
    },
    result_xdr: {
      getHref: handleLinkXdr,
    },
    result_meta_xdr: {
      getHref: handleLinkXdr,
    },
    fee_meta_xdr: {
      getHref: handleLinkXdr,
    },
    header_xdr: {
      getHref: handleLinkXdr,
    },
    // Link
    href: {
      getHref: handleLinkHref,
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
