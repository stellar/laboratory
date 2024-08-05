import { ReactNode } from "react";
import { Routes } from "@/constants/routes";
import { AnyObject } from "@/types/types";

export type EndpointsPagesFormProps = {
  docsUrl: string;
  docsLabel?: string;
  requestMethod: "GET" | "POST";
  endpointUrlTemplate?: string;
  requiredParams: string;
  rpcMethod?: string;
  isStreaming?: boolean;
  custom?: AnyObject;
};

export type EndpointsPagesProps = {
  instruction?: string;
  navItems: {
    route: Routes;
    label: string;
    form?: EndpointsPagesFormProps;
    nestedItems?: {
      route: Routes;
      label: string;
      form: EndpointsPagesFormProps;
    }[];
    icon?: ReactNode;
  }[];
  hasBottomDivider?: boolean;
};

export const ENDPOINTS_PAGES_RPC: EndpointsPagesProps = {
  instruction: "RPC Endpoints",
  navItems: [
    {
      route: Routes.ENDPOINTS_GET_EVENTS,
      label: "getEvents",
      form: {
        docsUrl:
          "https://developers.stellar.org/docs/data/rpc/api-reference/methods/getEvents",
        docsLabel: "getEvents",
        endpointUrlTemplate: "{?startLedger,cursor,limit,filters}",
        requestMethod: "POST",
        requiredParams: "startLedger,filters",
        rpcMethod: "getEvents",
        isStreaming: false,
      },
    },
    {
      route: Routes.ENDPOINTS_GET_FEE_STATS,
      label: "getFeeStats",
      form: {
        docsUrl:
          "https://developers.stellar.org/docs/data/rpc/api-reference/methods/getFeeStats",
        docsLabel: "getFeeStats",
        requestMethod: "POST",
        requiredParams: "",
        rpcMethod: "getFeeStats",
        isStreaming: false,
      },
    },
    {
      route: Routes.ENDPOINTS_GET_HEALTH,
      label: "getHealth",
      form: {
        docsUrl:
          "https://developers.stellar.org/docs/data/rpc/api-reference/methods/getHealth",
        docsLabel: "getHealth",
        requestMethod: "POST",
        requiredParams: "",
        rpcMethod: "getHealth",
        isStreaming: false,
      },
    },
    {
      route: Routes.ENDPOINTS_GET_LATEST_LEDGER,
      label: "getLatestLedger",
      form: {
        docsUrl:
          "https://developers.stellar.org/docs/data/rpc/api-reference/methods/getLatestLedger",
        docsLabel: "getLatestLedger",
        requestMethod: "POST",
        requiredParams: "",
        rpcMethod: "getLatestLedger",
        isStreaming: false,
      },
    },
    {
      route: Routes.ENDPOINTS_GET_LEDGER_ENTRIES,
      label: "getLedgerEntries",
      form: {
        docsUrl:
          "https://developers.stellar.org/docs/data/rpc/api-reference/methods/getLedgerEntries",
        docsLabel: "getLedgerEntries",
        endpointUrlTemplate: "{?tx}",
        requestMethod: "POST",
        requiredParams: "tx",
        rpcMethod: "getLedgerEntries",
        isStreaming: false,
      },
    },
    {
      route: Routes.ENDPOINTS_GET_NETWORK,
      label: "getNetwork",
      form: {
        docsUrl:
          "https://developers.stellar.org/docs/data/rpc/api-reference/methods/getNetwork",
        docsLabel: "getNetwork",
        requestMethod: "POST",
        requiredParams: "",
        rpcMethod: "getNetwork",
        isStreaming: false,
      },
    },
    {
      route: Routes.ENDPOINTS_GET_TRANSACTION,
      label: "getTransaction",
      form: {
        docsUrl:
          "https://developers.stellar.org/docs/data/rpc/api-reference/methods/getTransaction",
        docsLabel: "getTransaction",
        endpointUrlTemplate: "{?transaction}",
        requestMethod: "POST",
        requiredParams: "transaction",
        rpcMethod: "getTransaction",
        isStreaming: false,
      },
    },
    {
      route: Routes.ENDPOINTS_GET_TRANSACTIONS,
      label: "getTransactions",
      form: {
        docsUrl:
          "https://developers.stellar.org/docs/data/rpc/api-reference/methods/getTransactions",
        docsLabel: "getTransactions",
        endpointUrlTemplate: "{?startLedger,cursor,limit}",
        requestMethod: "POST",
        requiredParams: "startLedger",
        rpcMethod: "getTransactions",
        isStreaming: false,
      },
    },
    {
      route: Routes.ENDPOINTS_GET_VERSION_INFO,
      label: "getVersionInfo",
      form: {
        docsUrl:
          "https://developers.stellar.org/docs/data/rpc/api-reference/methods/getVersionInfo",
        docsLabel: "getVersionInfo",
        requestMethod: "POST",
        requiredParams: "",
        rpcMethod: "getVersionInfo",
        isStreaming: false,
      },
    },
    {
      route: Routes.ENDPOINTS_SEND_TRANSACTION,
      label: "sendTransaction",
      form: {
        docsUrl:
          "https://developers.stellar.org/docs/data/rpc/api-reference/methods/sendTransaction",
        docsLabel: "sendTransaction",
        endpointUrlTemplate: "{?tx}",
        requestMethod: "POST",
        requiredParams: "tx",
        rpcMethod: "sendTransaction",
        isStreaming: false,
      },
    },
    {
      route: Routes.ENDPOINTS_SIMULATE_TRANSACTION,
      label: "simulateTransaction",
      form: {
        docsUrl:
          "https://developers.stellar.org/docs/data/rpc/api-reference/methods/simulateTransaction",
        docsLabel: "simulateTransaction",
        endpointUrlTemplate: "{?tx,resourceConfig}",
        requestMethod: "POST",
        requiredParams: "tx",
        rpcMethod: "simulateTransaction",
        isStreaming: false,
      },
    },
  ],
};

export const ENDPOINTS_PAGES_HORIZON: EndpointsPagesProps = {
  instruction: "Horizon Endpoints",
  navItems: [
    {
      route: Routes.ENDPOINTS_ACCOUNTS,
      label: "Accounts",
      nestedItems: [
        {
          route: Routes.ENDPOINTS_ACCOUNTS,
          label: "All Accounts",
          form: {
            docsUrl:
              "https://developers.stellar.org/network/horizon/resources/list-all-accounts",
            docsLabel: "accounts",
            requestMethod: "GET",
            endpointUrlTemplate:
              "/accounts/{?sponsor,signer,asset,cursor,limit,order}",
            requiredParams: "",
            isStreaming: true,
            custom: {
              asset: {
                assetInput: "issued",
                includeNative: true,
              },
            },
          },
        },
        {
          route: Routes.ENDPOINTS_ACCOUNTS_SINGLE,
          label: "Single Account",
          form: {
            docsUrl:
              "https://developers.stellar.org/network/horizon/resources/retrieve-an-account",
            docsLabel: "account",
            requestMethod: "GET",
            endpointUrlTemplate: "/accounts/{account_id}",
            requiredParams: "account_id",
            isStreaming: true,
          },
        },
      ],
    },
    {
      route: Routes.ENDPOINTS_ASSETS,
      label: "Assets",
      nestedItems: [
        {
          route: Routes.ENDPOINTS_ASSETS,
          label: "All Assets",
          form: {
            docsUrl:
              "https://developers.stellar.org/network/horizon/resources/list-all-assets",
            docsLabel: "assets",
            requestMethod: "GET",
            endpointUrlTemplate:
              "/assets{?asset_code,asset_issuer,cursor,order,limit}",
            requiredParams: "",
            isStreaming: true,
          },
        },
      ],
    },
    {
      route: Routes.ENDPOINTS_CLAIMABLE_BALANCES,
      label: "Claimable Balances",
      nestedItems: [
        {
          route: Routes.ENDPOINTS_CLAIMABLE_BALANCES,
          label: "All Claimable Balances",
          form: {
            docsUrl:
              "https://developers.stellar.org/network/horizon/resources/list-all-claimable-balances",
            docsLabel: "claimable balances",
            requestMethod: "GET",
            endpointUrlTemplate:
              "/claimable_balances/{?sponsor,asset,claimant,cursor,limit,order}",
            requiredParams: "",
            isStreaming: false,
          },
        },
        {
          route: Routes.ENDPOINTS_CLAIMABLE_BALANCES_SINGLE,
          label: "Single Claimable Balance",
          form: {
            docsUrl:
              "https://developers.stellar.org/network/horizon/resources/retrieve-a-claimable-balance",
            docsLabel: "claimable balance",
            requestMethod: "GET",
            endpointUrlTemplate: "/claimable_balances/{claimable_balance_id}",
            requiredParams: "claimable_balance_id",
            isStreaming: false,
          },
        },
      ],
    },
    {
      route: Routes.ENDPOINTS_EFFECTS,
      label: "Effects",
      nestedItems: [
        {
          route: Routes.ENDPOINTS_EFFECTS,
          label: "All Effects",
          form: {
            docsUrl:
              "https://developers.stellar.org/network/horizon/resources/list-all-effects",
            docsLabel: "effects",
            requestMethod: "GET",
            endpointUrlTemplate: "/effects{?cursor,limit,order}",
            requiredParams: "",
            isStreaming: true,
          },
        },
        {
          route: Routes.ENDPOINTS_EFFECTS_ACCOUNT,
          label: "Effects for Account",
          form: {
            docsUrl:
              "https://developers.stellar.org/network/horizon/resources/get-effects-by-account-id",
            docsLabel: "effects for account",
            requestMethod: "GET",
            endpointUrlTemplate:
              "/accounts/{account_id}/effects{?cursor,limit,order}",
            requiredParams: "account_id",
            isStreaming: true,
          },
        },
        {
          route: Routes.ENDPOINTS_EFFECTS_LEDGER,
          label: "Effects for Ledger",
          form: {
            docsUrl:
              "https://developers.stellar.org/network/horizon/resources/retrieve-a-ledgers-effects",
            docsLabel: "effects for ledger",
            requestMethod: "GET",
            endpointUrlTemplate:
              "/ledgers/{ledger}/effects{?cursor,limit,order}",
            requiredParams: "ledger",
            isStreaming: true,
          },
        },
        {
          route: Routes.ENDPOINTS_EFFECTS_LIQUIDITY_POOL,
          label: "Effects for Liquidity Pool",
          form: {
            docsUrl:
              "https://developers.stellar.org/network/horizon/resources/retrieve-related-effects",
            docsLabel: "effects for liquidity pool",
            requestMethod: "GET",
            endpointUrlTemplate:
              "/liquidity_pools/{liquidity_pool_id}/effects{?cursor,limit,order}",
            requiredParams: "liquidity_pool_id",
            isStreaming: true,
          },
        },
        {
          route: Routes.ENDPOINTS_EFFECTS_OPERATION,
          label: "Effects for Operation",
          form: {
            docsUrl:
              "https://developers.stellar.org/network/horizon/resources/retrieve-an-operations-effects",
            docsLabel: "effects for operation",
            requestMethod: "GET",
            endpointUrlTemplate:
              "/operations/{operation}/effects{?cursor,limit,order}",
            requiredParams: "operation",
            isStreaming: true,
          },
        },
        {
          route: Routes.ENDPOINTS_EFFECTS_TRANSACTION,
          label: "Effects for Transaction",
          form: {
            docsUrl:
              "https://developers.stellar.org/network/horizon/resources/retrieve-a-transactions-effects",
            docsLabel: "effects for transaction",
            requestMethod: "GET",
            endpointUrlTemplate:
              "/transactions/{transaction}/effects{?cursor,limit,order}",
            requiredParams: "transaction",
            isStreaming: true,
          },
        },
      ],
    },
    {
      route: Routes.ENDPOINTS_FEE_STATS,
      label: "Fee Stats",
      nestedItems: [
        {
          route: Routes.ENDPOINTS_FEE_STATS,
          label: "All Fee Stats",
          form: {
            docsUrl:
              "https://developers.stellar.org/network/horizon/aggregations/fee-stats/object",
            docsLabel: "fee stats",
            requestMethod: "GET",
            endpointUrlTemplate: "/fee_stats",
            requiredParams: "",
            isStreaming: true,
          },
        },
      ],
    },
    {
      route: Routes.ENDPOINTS_LEDGERS,
      label: "Ledgers",
      nestedItems: [
        {
          route: Routes.ENDPOINTS_LEDGERS,
          label: "All Ledgers",
          form: {
            docsUrl:
              "https://developers.stellar.org/network/horizon/resources/ledgers",
            docsLabel: "ledgers",
            requestMethod: "GET",
            endpointUrlTemplate: "/ledgers{?cursor,limit,order}",
            requiredParams: "",
            isStreaming: true,
          },
        },
        {
          route: Routes.ENDPOINTS_LEDGERS_SINGLE,
          label: "Single Ledger",
          form: {
            docsUrl:
              "https://developers.stellar.org/network/horizon/resources/retrieve-a-ledger",
            docsLabel: "ledger",
            requestMethod: "GET",
            endpointUrlTemplate: "/ledgers/{ledger}",
            requiredParams: "ledger",
            isStreaming: true,
          },
        },
      ],
    },
    {
      route: Routes.ENDPOINTS_LIQUIDITY_POOLS,
      label: "Liquidity Pools",
      nestedItems: [
        {
          route: Routes.ENDPOINTS_LIQUIDITY_POOLS,
          label: "All Liquidity Pools",
          form: {
            docsUrl:
              "https://developers.stellar.org/network/horizon/resources/list-liquidity-pools",
            docsLabel: "liquidity pools",
            requestMethod: "GET",
            endpointUrlTemplate:
              "/liquidity_pools{?reserves,cursor,limit,order}",
            requiredParams: "",
            isStreaming: true,
          },
        },
        {
          route: Routes.ENDPOINTS_LIQUIDITY_POOLS_SINGLE,
          label: "Single Liquidity Pool",
          form: {
            docsUrl:
              "https://developers.stellar.org/network/horizon/resources/retrieve-a-liquidity-pool",
            docsLabel: "liquidity pool",
            requestMethod: "GET",
            endpointUrlTemplate: "/liquidity_pools/{liquidity_pool_id}",
            requiredParams: "liquidity_pool_id",
            isStreaming: true,
          },
        },
      ],
    },
    {
      route: Routes.ENDPOINTS_OFFERS,
      label: "Offers",
      nestedItems: [
        {
          route: Routes.ENDPOINTS_OFFERS,
          label: "All Offers",
          form: {
            docsUrl:
              "https://developers.stellar.org/network/horizon/resources/offers",
            docsLabel: "offers",
            requestMethod: "GET",
            endpointUrlTemplate:
              "/offers{?sponsor,seller,selling,buying,cursor,limit,order}",
            requiredParams: "",
            isStreaming: true,
            custom: {
              selling: {
                assetInput: "issued",
                includeNative: true,
              },
              buying: {
                assetInput: "issued",
                includeNative: true,
              },
            },
          },
        },
        {
          route: Routes.ENDPOINTS_OFFERS_SINGLE,
          label: "Single Offer",
          form: {
            docsUrl:
              "https://developers.stellar.org/network/horizon/resources/get-offer-by-offer-id",
            docsLabel: "offer",
            requestMethod: "GET",
            endpointUrlTemplate: "/offers/{offer_id}",
            requiredParams: "offer_id",
            isStreaming: true,
          },
        },
        {
          route: Routes.ENDPOINTS_OFFERS_ACCOUNT,
          label: "Offers for Account",
          form: {
            docsUrl:
              "https://developers.stellar.org/network/horizon/resources/get-offers-by-account-id",
            docsLabel: "offers for account",
            requestMethod: "GET",
            endpointUrlTemplate:
              "/accounts/{account_id}/offers{?cursor,limit,order}",
            requiredParams: "account_id",
            isStreaming: true,
          },
        },
      ],
    },
    {
      route: Routes.ENDPOINTS_OPERATIONS,
      label: "Operations",
      nestedItems: [
        {
          route: Routes.ENDPOINTS_OPERATIONS,
          label: "All Operations",
          form: {
            docsUrl:
              "https://developers.stellar.org/network/horizon/resources/operations",
            docsLabel: "operations",
            requestMethod: "GET",
            endpointUrlTemplate:
              "/operations{?cursor,limit,order,include_failed}",
            requiredParams: "",
            isStreaming: true,
          },
        },
        {
          route: Routes.ENDPOINTS_OPERATIONS_SINGLE,
          label: "Single Operation",
          form: {
            docsUrl:
              "https://developers.stellar.org/network/horizon/resources/retrieve-an-operation",
            docsLabel: "operation",
            requestMethod: "GET",
            endpointUrlTemplate: "/operations/{operation}",
            requiredParams: "operation",
            isStreaming: true,
          },
        },
        {
          route: Routes.ENDPOINTS_OPERATIONS_ACCOUNT,
          label: "Operations for Account",
          form: {
            docsUrl:
              "https://developers.stellar.org/network/horizon/resources/get-operations-by-account-id",
            docsLabel: "operations for account",
            requestMethod: "GET",
            endpointUrlTemplate:
              "/accounts/{account_id}/operations{?cursor,limit,order,include_failed}",
            requiredParams: "account_id",
            isStreaming: true,
          },
        },
        {
          route: Routes.ENDPOINTS_OPERATIONS_LEDGER,
          label: "Operations for Ledger",
          form: {
            docsUrl:
              "https://developers.stellar.org/network/horizon/resources/retrieve-a-ledgers-operations",
            docsLabel: "operations for ledger",
            requestMethod: "GET",
            endpointUrlTemplate:
              "/ledgers/{ledger}/operations{?cursor,limit,order,include_failed}",
            requiredParams: "ledger",
            isStreaming: true,
          },
        },
        {
          route: Routes.ENDPOINTS_OPERATIONS_LIQUIDITY_POOL,
          label: "Operations for Liquidity Pool",
          form: {
            docsUrl:
              "https://developers.stellar.org/network/horizon/resources/lp-retrieve-related-operations",
            docsLabel: "operations for liquidity pool",
            requestMethod: "GET",
            endpointUrlTemplate:
              "/liquidity_pools/{liquidity_pool_id}/operations{?cursor,limit,order,include_failed}",
            requiredParams: "liquidity_pool_id",
            isStreaming: true,
          },
        },
        {
          route: Routes.ENDPOINTS_OPERATIONS_TRANSACTION,
          label: "Operations for Transaction",
          form: {
            docsUrl:
              "https://developers.stellar.org/network/horizon/resources/retrieve-a-transactions-operations",
            docsLabel: "operations for transaction",
            requestMethod: "GET",
            endpointUrlTemplate:
              "/transactions/{transaction}/operations{?cursor,limit,order}",
            requiredParams: "transaction",
            isStreaming: true,
          },
        },
      ],
    },
    {
      route: Routes.ENDPOINTS_ORDER_BOOK_DETAILS,
      label: "Order Book",
      nestedItems: [
        {
          route: Routes.ENDPOINTS_ORDER_BOOK_DETAILS,
          label: "Details",
          form: {
            docsUrl:
              "https://developers.stellar.org/network/horizon/aggregations/order-books/single",
            docsLabel: "order book",
            requestMethod: "GET",
            endpointUrlTemplate:
              "/order_book{?selling_asset_type,selling_asset_code,selling_asset_issuer,buying_asset_type,buying_asset_code,buying_asset_issuer}",
            requiredParams: "selling_asset,buying_asset",
            isStreaming: true,
            custom: {
              renderComponents: ["selling_asset", "buying_asset"],
              paramMapping: {
                selling_asset_type: "selling_asset.type",
                selling_asset_code: "selling_asset.code",
                selling_asset_issuer: "selling_asset.issuer",
                buying_asset_type: "buying_asset.type",
                buying_asset_code: "buying_asset.code",
                buying_asset_issuer: "buying_asset.issuer",
              },
              selling_asset: {
                assetInput: "alphanumeric",
                includeNative: true,
              },
              buying_asset: {
                assetInput: "alphanumeric",
                includeNative: true,
              },
            },
          },
        },
      ],
    },
    {
      route: Routes.ENDPOINTS_PATHS,
      label: "Paths",
      nestedItems: [
        {
          route: Routes.ENDPOINTS_PATHS,
          label: "Find Payment Paths",
          form: {
            docsUrl:
              "https://developers.stellar.org/network/horizon/aggregations/paths",
            docsLabel: "payment paths",
            requestMethod: "GET",
            endpointUrlTemplate:
              "/paths{?destination_asset_type,destination_asset_code,destination_asset_issuer,destination_amount,destination_account,source_account}",
            requiredParams:
              "source_account,destination_asset,destination_amount",
            isStreaming: true,
            custom: {
              renderComponents: ["destination_asset"],
              paramMapping: {
                destination_asset_type: "destination_asset.type",
                destination_asset_code: "destination_asset.code",
                destination_asset_issuer: "destination_asset.issuer",
              },
              destination_asset: {
                assetInput: "alphanumeric",
                includeNative: true,
              },
            },
          },
        },
        {
          route: Routes.ENDPOINTS_PATHS_STRICT_RECEIVE,
          label: "Find Strict Receive Payment Paths",
          form: {
            docsUrl:
              "https://developers.stellar.org/network/horizon/aggregations/paths/strict-receive",
            docsLabel: "strict receive payment paths",
            requestMethod: "GET",
            endpointUrlTemplate:
              "/paths/strict-receive{?,destination_asset_type,destination_asset_issuer,destination_asset_code,destination_amount,destination_account,source_account,source_assets}",
            requiredParams:
              "source_account,destination_asset,destination_amount",
            isStreaming: true,
            custom: {
              renderComponents: ["destination_asset"],
              paramMapping: {
                destination_asset_type: "destination_asset.type",
                destination_asset_code: "destination_asset.code",
                destination_asset_issuer: "destination_asset.issuer",
              },
              destination_asset: {
                assetInput: "alphanumeric",
                includeNative: true,
              },
            },
          },
        },
        {
          route: Routes.ENDPOINTS_PATHS_STRICT_SEND,
          label: "Find Strict Send Payment Paths",
          form: {
            docsUrl:
              "https://developers.stellar.org/network/horizon/aggregations/paths/strict-send",
            docsLabel: "strict send payment paths",
            requestMethod: "GET",
            endpointUrlTemplate:
              "/paths/strict-send{?source_amount,destination_account,destination_assets,source_asset_type,source_asset_issuer,source_asset_code}",
            requiredParams: "source_asset,source_amount",
            isStreaming: true,
            custom: {
              renderComponents: ["source_asset"],
              paramMapping: {
                source_asset_type: "source_asset.type",
                source_asset_code: "source_asset.code",
                source_asset_issuer: "source_asset.issuer",
              },
              source_asset: {
                assetInput: "alphanumeric",
                includeNative: true,
              },
            },
          },
        },
      ],
    },
    {
      route: Routes.ENDPOINTS_PAYMENTS,
      label: "Payments",
      nestedItems: [
        {
          route: Routes.ENDPOINTS_PAYMENTS,
          label: "All Payments",
          form: {
            docsUrl:
              "https://developers.stellar.org/network/horizon/resources/list-all-payments",
            docsLabel: "payments",
            requestMethod: "GET",
            endpointUrlTemplate:
              "/payments{?cursor,limit,order,include_failed}",
            requiredParams: "",
            isStreaming: true,
          },
        },
        {
          route: Routes.ENDPOINTS_PAYMENTS_ACCOUNT,
          label: "Payments for Account",
          form: {
            docsUrl:
              "https://developers.stellar.org/network/horizon/resources/get-payments-by-account-id",
            docsLabel: "payments for account",
            requestMethod: "GET",
            endpointUrlTemplate:
              "/accounts/{account_id}/payments{?cursor,limit,order,include_failed}",
            requiredParams: "account_id",
            isStreaming: true,
          },
        },
        {
          route: Routes.ENDPOINTS_PAYMENTS_LEDGER,
          label: "Payments for Ledger",
          form: {
            docsUrl:
              "https://developers.stellar.org/network/horizon/resources/retrieve-a-ledgers-payments",
            docsLabel: "payments for ledger",
            requestMethod: "GET",
            endpointUrlTemplate:
              "/ledgers/{ledger}/payments{?cursor,limit,order,include_failed}",
            requiredParams: "ledger",
            isStreaming: true,
          },
        },
        {
          route: Routes.ENDPOINTS_PAYMENTS_TRANSACTION,
          label: "Payments for Transaction",
          form: {
            docsUrl:
              // TODO: no link in the docs for payments for transaction
              "https://developers.stellar.org/network/horizon/resources/transactions",
            docsLabel: "payments for transaction",
            requestMethod: "GET",
            endpointUrlTemplate:
              "/transactions/{transaction}/payments{?cursor,limit,order}",
            requiredParams: "transaction",
            isStreaming: true,
          },
        },
      ],
    },
    {
      route: Routes.ENDPOINTS_TRADE_AGGREGATIONS,
      label: "Trade Aggregations",
      nestedItems: [
        {
          route: Routes.ENDPOINTS_TRADE_AGGREGATIONS,
          label: "All Trade Aggregations",
          form: {
            docsUrl:
              "https://developers.stellar.org/network/horizon/aggregations/trade-aggregations/list",
            docsLabel: "trade aggregations",
            requestMethod: "GET",
            endpointUrlTemplate:
              "/trade_aggregations{?base_asset_type,base_asset_code,base_asset_issuer,counter_asset_type,counter_asset_code,counter_asset_issuer,resolution,start_time,end_time,limit,order}",
            requiredParams: "base_asset,counter_asset,resolution",
            isStreaming: true,
            custom: {
              renderComponents: ["base_asset", "counter_asset"],
              paramMapping: {
                base_asset_type: "base_asset.type",
                base_asset_code: "base_asset.code",
                base_asset_issuer: "base_asset.issuer",
                counter_asset_type: "counter_asset.type",
                counter_asset_code: "counter_asset.code",
                counter_asset_issuer: "counter_asset.issuer",
              },
              base_asset: {
                assetInput: "alphanumeric",
                includeNative: true,
              },
              counter_asset: {
                assetInput: "alphanumeric",
                includeNative: true,
              },
            },
          },
        },
      ],
    },
    {
      route: Routes.ENDPOINTS_TRADES,
      label: "Trades",
      nestedItems: [
        {
          route: Routes.ENDPOINTS_TRADES,
          label: "All Trades",
          form: {
            docsUrl:
              "https://developers.stellar.org/network/horizon/resources/get-all-trades",
            docsLabel: "trades",
            requestMethod: "GET",
            endpointUrlTemplate:
              "/trades{?base_asset_type,base_asset_code,base_asset_issuer,counter_asset_type,counter_asset_code,counter_asset_issuer,offer_id,cursor,limit,order}",
            requiredParams: "",
            isStreaming: true,
            custom: {
              renderComponents: ["base_asset", "counter_asset"],
              paramMapping: {
                base_asset_type: "base_asset.type",
                base_asset_code: "base_asset.code",
                base_asset_issuer: "base_asset.issuer",
                counter_asset_type: "counter_asset.type",
                counter_asset_code: "counter_asset.code",
                counter_asset_issuer: "counter_asset.issuer",
              },
              base_asset: {
                assetInput: "alphanumeric",
                includeNative: true,
              },
              counter_asset: {
                assetInput: "alphanumeric",
                includeNative: true,
              },
            },
          },
        },
        {
          route: Routes.ENDPOINTS_TRADES_ACCOUNT,
          label: "Trades for Account",
          form: {
            docsUrl:
              "https://developers.stellar.org/network/horizon/resources/get-trades-by-account-id",
            docsLabel: "trades for account",
            requestMethod: "GET",
            endpointUrlTemplate:
              "/accounts/{account_id}/trades{?cursor,limit,order}",
            requiredParams: "account_id",
            isStreaming: true,
          },
        },
        {
          route: Routes.ENDPOINTS_TRADES_LIQUIDITY_POOL,
          label: "Trades for Liquidity Pool",
          form: {
            docsUrl:
              "https://developers.stellar.org/network/horizon/resources/retrieve-related-trades",
            docsLabel: "trades for liquidity pool",
            requestMethod: "GET",
            endpointUrlTemplate:
              "/liquidity_pools/{liquidity_pool_id}/trades{?cursor,limit,order}",
            requiredParams: "liquidity_pool_id",
            isStreaming: true,
          },
        },
        {
          route: Routes.ENDPOINTS_TRADES_OFFER,
          label: "Trades for Offer",
          form: {
            docsUrl:
              "https://developers.stellar.org/network/horizon/resources/get-trades-by-offer-id",
            docsLabel: "trades for offer",
            requestMethod: "GET",
            endpointUrlTemplate:
              "/offers/{offer_id}/trades{?cursor,limit,order}",
            requiredParams: "offer_id",
            isStreaming: true,
          },
        },
      ],
    },
    {
      route: Routes.ENDPOINTS_TRANSACTIONS,
      label: "Transactions",
      nestedItems: [
        {
          route: Routes.ENDPOINTS_TRANSACTIONS,
          label: "All Transactions",
          form: {
            docsUrl:
              "https://developers.stellar.org/network/horizon/resources/transactions",
            docsLabel: "transactions",
            requestMethod: "GET",
            endpointUrlTemplate:
              "/transactions{?cursor,limit,order,include_failed}",
            requiredParams: "",
            isStreaming: true,
          },
        },
        {
          route: Routes.ENDPOINTS_TRANSACTIONS_SINGLE,
          label: "Single Transaction",
          form: {
            docsUrl:
              "https://developers.stellar.org/network/horizon/resources/retrieve-a-transaction",
            docsLabel: "transaction",
            requestMethod: "GET",
            endpointUrlTemplate: "/transactions/{transaction}",
            requiredParams: "transaction",
            isStreaming: true,
          },
        },
        {
          route: Routes.ENDPOINTS_TRANSACTIONS_POST,
          label: "Post Transaction",
          form: {
            docsUrl:
              "https://developers.stellar.org/network/horizon/resources/submit-a-transaction",
            docsLabel: "post transaction",
            requestMethod: "POST",
            endpointUrlTemplate: "/transactions{?tx}",
            requiredParams: "tx",
            isStreaming: false,
          },
        },
        {
          route: Routes.ENDPOINTS_TRANSACTIONS_ACCOUNT,
          label: "Transactions for Account",
          form: {
            docsUrl:
              "https://developers.stellar.org/network/horizon/resources/get-transactions-by-account-id",
            docsLabel: "transactions for account",
            requestMethod: "GET",
            endpointUrlTemplate:
              "/accounts/{account_id}/transactions{?cursor,limit,order,include_failed}",
            requiredParams: "account_id",
            isStreaming: true,
          },
        },
        {
          route: Routes.ENDPOINTS_TRANSACTIONS_LEDGER,
          label: "Transactions for Ledger",
          form: {
            docsUrl:
              "https://developers.stellar.org/network/horizon/resources/retrieve-a-ledgers-transactions",
            docsLabel: "transactions for ledger",
            requestMethod: "GET",
            endpointUrlTemplate:
              "/ledgers/{ledger}/transactions{?cursor,limit,order,include_failed}",
            requiredParams: "ledger",
            isStreaming: true,
          },
        },
        {
          route: Routes.ENDPOINTS_TRANSACTIONS_LIQUIDITY_POOL,
          label: "Transactions for Liquidity Pool",
          form: {
            docsUrl:
              "https://developers.stellar.org/network/horizon/resources/lp-retrieve-related-transactions",
            docsLabel: "transactions for liquidity pool",
            requestMethod: "GET",
            endpointUrlTemplate:
              "/liquidity_pools/{liquidity_pool_id}/transactions{?cursor,limit,order,include_failed}",
            requiredParams: "liquidity_pool_id",
            isStreaming: true,
          },
        },
      ],
    },
  ],
};
