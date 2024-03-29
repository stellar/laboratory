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
          form: undefined,
        },
        {
          route: Routes.EXPLORE_ENDPOINTS_LEDGERS_SINGLE,
          label: "Single Ledger",
          form: undefined,
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
          form: undefined,
        },
        {
          route: Routes.EXPLORE_ENDPOINTS_OFFERS_SINGLE,
          label: "Single Offer",
          form: undefined,
        },
        {
          route: Routes.EXPLORE_ENDPOINTS_OFFERS_ACCOUNT,
          label: "Offers for Account",
          form: undefined,
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
          form: undefined,
        },
        {
          route: Routes.EXPLORE_ENDPOINTS_OPERATIONS_SINGLE,
          label: "Single Operation",
          form: undefined,
        },
        {
          route: Routes.EXPLORE_ENDPOINTS_OPERATIONS_ACCOUNT,
          label: "Operations for Account",
          form: undefined,
        },
        {
          route: Routes.EXPLORE_ENDPOINTS_OPERATIONS_LEDGER,
          label: "Operations for Ledger",
          form: undefined,
        },
        {
          route: Routes.EXPLORE_ENDPOINTS_OPERATIONS_LIQUIDITY_POOL,
          label: "Operations for Liquidity Pool",
          form: undefined,
        },
        {
          route: Routes.EXPLORE_ENDPOINTS_OPERATIONS_TRANSACTION,
          label: "Operations for Transaction",
          form: undefined,
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
          form: undefined,
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
          form: undefined,
        },
        {
          route: Routes.EXPLORE_ENDPOINTS_PAYMENTS_ACCOUNT,
          label: "Payments for Account",
          form: undefined,
        },
        {
          route: Routes.EXPLORE_ENDPOINTS_PAYMENTS_LEDGER,
          label: "Payments for Ledger",
          form: undefined,
        },
        {
          route: Routes.EXPLORE_ENDPOINTS_PAYMENTS_TRANSACTION,
          label: "Payments for Transaction",
          form: undefined,
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
          form: undefined,
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
          form: undefined,
        },
        {
          route: Routes.EXPLORE_ENDPOINTS_TRANSACTIONS_SINGLE,
          label: "Single Transaction",
          form: undefined,
        },
        {
          route: Routes.EXPLORE_ENDPOINTS_TRANSACTIONS_POST,
          label: "Post Transaction",
          form: undefined,
        },
        {
          route: Routes.EXPLORE_ENDPOINTS_TRANSACTIONS_ACCOUNT,
          label: "Transactions for Account",
          form: undefined,
        },
        {
          route: Routes.EXPLORE_ENDPOINTS_TRANSACTIONS_LEDGER,
          label: "Transactions for Ledger",
          form: undefined,
        },
        {
          route: Routes.EXPLORE_ENDPOINTS_TRANSACTIONS_LIQUIDITY_POOL,
          label: "Transactions for Liquidity Pool",
          form: undefined,
        },
      ],
    },
  ],
};
