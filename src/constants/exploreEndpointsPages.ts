import { Routes } from "@/constants/routes";
import { AnyObject } from "@/types/types";

type ExploreEndpointsPagesProps = {
  instruction: string;
  navItems: {
    route: Routes;
    label: string;
    nestedItems: {
      route: Routes;
      label: string;
      form:
        | {
            docsUrl: string;
            docsLabel?: string;
            requestMethod: "GET" | "POST";
            endpointUrlTemplate: string;
            requiredParams: string;
            isStreaming?: boolean;
            custom?: AnyObject;
          }
        // TODO: remove once all pages are filled
        | undefined;
    }[];
  }[];
};

export const EXPLORE_ENDPOINTS_PAGES_HORIZON: ExploreEndpointsPagesProps = {
  instruction: "Horizon Endpoints",
  navItems: [
    {
      route: Routes.EXPLORE_ENDPOINTS_ACCOUNTS,
      label: "Accounts",
      nestedItems: [
        {
          route: Routes.EXPLORE_ENDPOINTS_ACCOUNTS,
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
          route: Routes.EXPLORE_ENDPOINTS_ACCOUNTS_SINGLE,
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
      route: Routes.EXPLORE_ENDPOINTS_ASSETS,
      label: "Assets",
      nestedItems: [
        {
          route: Routes.EXPLORE_ENDPOINTS_ASSETS,
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
      route: Routes.EXPLORE_ENDPOINTS_CLAIMABLE_BALANCES,
      label: "Claimable Balances",
      nestedItems: [
        {
          route: Routes.EXPLORE_ENDPOINTS_CLAIMABLE_BALANCES,
          label: "All Claimable Balances",
          form: {
            docsUrl:
              "https://developers.stellar.org/network/horizon/resources/list-all-claimable-balances",
            docsLabel: "claimable balance",
            requestMethod: "GET",
            endpointUrlTemplate:
              "/claimable_balances/{?sponsor,asset,claimant,cursor,limit,order}",
            requiredParams: "",
            isStreaming: false,
          },
        },
        {
          route: Routes.EXPLORE_ENDPOINTS_CLAIMABLE_BALANCES_SINGLE,
          label: "Single Claimable Balance",
          form: {
            docsUrl:
              "https://developers.stellar.org/network/horizon/resources/retrieve-a-claimable-balance",
            docsLabel: "claimable balances",
            requestMethod: "GET",
            endpointUrlTemplate: "/claimable_balances/{claimable_balance_id}",
            requiredParams: "claimable_balance_id",
            isStreaming: false,
          },
        },
      ],
    },
    {
      route: Routes.EXPLORE_ENDPOINTS_EFFECTS,
      label: "Effects",
      nestedItems: [
        {
          route: Routes.EXPLORE_ENDPOINTS_EFFECTS,
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
          route: Routes.EXPLORE_ENDPOINTS_EFFECTS_ACCOUNT,
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
          route: Routes.EXPLORE_ENDPOINTS_EFFECTS_LEDGER,
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
          route: Routes.EXPLORE_ENDPOINTS_EFFECTS_LIQUIDITY_POOL,
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
          route: Routes.EXPLORE_ENDPOINTS_EFFECTS_OPERATION,
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
          route: Routes.EXPLORE_ENDPOINTS_EFFECTS_TRANSACTION,
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
      route: Routes.EXPLORE_ENDPOINTS_FEE_STATS,
      label: "Fee Stats",
      nestedItems: [
        {
          route: Routes.EXPLORE_ENDPOINTS_FEE_STATS,
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
      route: Routes.EXPLORE_ENDPOINTS_LEDGERS,
      label: "Ledgers",
      nestedItems: [
        {
          route: Routes.EXPLORE_ENDPOINTS_LEDGERS,
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
          route: Routes.EXPLORE_ENDPOINTS_LEDGERS_SINGLE,
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
      route: Routes.EXPLORE_ENDPOINTS_LIQUIDITY_POOLS,
      label: "Liquidity Pools",
      nestedItems: [
        {
          route: Routes.EXPLORE_ENDPOINTS_LIQUIDITY_POOLS,
          label: "All Liquidity Pools",
          form: undefined,
        },
        {
          route: Routes.EXPLORE_ENDPOINTS_LIQUIDITY_POOLS_SINGLE,
          label: "Single Liquidity Pool",
          form: undefined,
        },
      ],
    },
    {
      route: Routes.EXPLORE_ENDPOINTS_OFFERS,
      label: "Offers",
      nestedItems: [
        {
          route: Routes.EXPLORE_ENDPOINTS_OFFERS,
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
          route: Routes.EXPLORE_ENDPOINTS_OFFERS_SINGLE,
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
          route: Routes.EXPLORE_ENDPOINTS_OFFERS_ACCOUNT,
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
      route: Routes.EXPLORE_ENDPOINTS_OPERATIONS,
      label: "Operations",
      nestedItems: [
        {
          route: Routes.EXPLORE_ENDPOINTS_OPERATIONS,
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
          route: Routes.EXPLORE_ENDPOINTS_OPERATIONS_SINGLE,
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
          route: Routes.EXPLORE_ENDPOINTS_OPERATIONS_ACCOUNT,
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
          route: Routes.EXPLORE_ENDPOINTS_OPERATIONS_LEDGER,
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
          route: Routes.EXPLORE_ENDPOINTS_OPERATIONS_LIQUIDITY_POOL,
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
          route: Routes.EXPLORE_ENDPOINTS_OPERATIONS_TRANSACTION,
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
      route: Routes.EXPLORE_ENDPOINTS_ORDER_BOOK_DETAILS,
      label: "Order Book",
      nestedItems: [
        {
          route: Routes.EXPLORE_ENDPOINTS_ORDER_BOOK_DETAILS,
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
      route: Routes.EXPLORE_ENDPOINTS_PATHS_PAYMENT,
      label: "Paths",
      nestedItems: [
        {
          route: Routes.EXPLORE_ENDPOINTS_PATHS_PAYMENT,
          label: "Find Payment Paths",
          form: undefined,
        },
        {
          route: Routes.EXPLORE_ENDPOINTS_PATHS_STRICT_RECEIVE,
          label: "Find Strict Receive Payment Paths",
          form: undefined,
        },
        {
          route: Routes.EXPLORE_ENDPOINTS_PATHS_STRICT_SEND,
          label: "Find Strict Send Payment Paths",
          form: undefined,
        },
      ],
    },
    {
      route: Routes.EXPLORE_ENDPOINTS_PAYMENTS,
      label: "Payments",
      nestedItems: [
        {
          route: Routes.EXPLORE_ENDPOINTS_PAYMENTS,
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
          route: Routes.EXPLORE_ENDPOINTS_PAYMENTS_ACCOUNT,
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
          route: Routes.EXPLORE_ENDPOINTS_PAYMENTS_LEDGER,
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
          route: Routes.EXPLORE_ENDPOINTS_PAYMENTS_TRANSACTION,
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
      route: Routes.EXPLORE_ENDPOINTS_TRADE_AGGREGATIONS,
      label: "Trade Aggregations",
      nestedItems: [
        {
          route: Routes.EXPLORE_ENDPOINTS_TRADE_AGGREGATIONS,
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
      route: Routes.EXPLORE_ENDPOINTS_TRADES,
      label: "Trades",
      nestedItems: [
        {
          route: Routes.EXPLORE_ENDPOINTS_TRADES,
          label: "All Trades",
          form: undefined,
        },
        {
          route: Routes.EXPLORE_ENDPOINTS_TRADES_ACCOUNT,
          label: "Trades for Account",
          form: undefined,
        },
        {
          route: Routes.EXPLORE_ENDPOINTS_TRADES_LIQUIDITY_POOL,
          label: "Trades for Liquidity Pool",
          form: undefined,
        },
        {
          route: Routes.EXPLORE_ENDPOINTS_TRADES_OFFER,
          label: "Trades for Offer",
          form: undefined,
        },
      ],
    },
    {
      route: Routes.EXPLORE_ENDPOINTS_TRANSACTIONS,
      label: "Transactions",
      nestedItems: [
        {
          route: Routes.EXPLORE_ENDPOINTS_TRANSACTIONS,
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
          route: Routes.EXPLORE_ENDPOINTS_TRANSACTIONS_SINGLE,
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
          route: Routes.EXPLORE_ENDPOINTS_TRANSACTIONS_POST,
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
          route: Routes.EXPLORE_ENDPOINTS_TRANSACTIONS_ACCOUNT,
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
          route: Routes.EXPLORE_ENDPOINTS_TRANSACTIONS_LEDGER,
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
          route: Routes.EXPLORE_ENDPOINTS_TRANSACTIONS_LIQUIDITY_POOL,
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
