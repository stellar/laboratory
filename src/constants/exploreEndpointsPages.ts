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
            info: string;
            requestMethod: "GET" | "POST";
            endpointPath: string;
            endpointPathParams: string;
            endpointParams: string;
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
            info: "https://developers.stellar.org/docs/fundamentals-and-concepts/stellar-data-structures/accounts",
            requestMethod: "GET",
            endpointPath: "/accounts",
            endpointPathParams: "",
            endpointParams: "sponsor,signer,asset,cursor,limit,order",
            requiredParams: "",
            isStreaming: true,
            custom: {
              asset: {
                assetInput: "issued",
                includeNone: true,
                includeNative: true,
              },
            },
          },
        },
        {
          route: Routes.EXPLORE_ENDPOINTS_ACCOUNTS_SINGLE,
          label: "Single Account",
          form: {
            info: "https://developers.stellar.org/api/resources/accounts/single/",
            requestMethod: "GET",
            endpointPath: "/accounts",
            endpointPathParams: "account_id",
            endpointParams: "",
            requiredParams: "account_id",
            isStreaming: false,
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
          form: undefined,
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
          form: undefined,
        },
        {
          route: Routes.EXPLORE_ENDPOINTS_CLAIMABLE_BALANCES_SINGLE,
          label: "Single Claimable Balance",
          form: undefined,
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
          form: undefined,
        },
        {
          route: Routes.EXPLORE_ENDPOINTS_EFFECTS_ACCOUNT,
          label: "Effects for Account",
          form: undefined,
        },
        {
          route: Routes.EXPLORE_ENDPOINTS_EFFECTS_LEDGER,
          label: "Effects for Ledger",
          form: undefined,
        },
        {
          route: Routes.EXPLORE_ENDPOINTS_EFFECTS_LIQUIDITY_POOL,
          label: "Effects for Liquidity Pool",
          form: undefined,
        },
        {
          route: Routes.EXPLORE_ENDPOINTS_EFFECTS_OPERATION,
          label: "Effects for Operation",
          form: undefined,
        },
        {
          route: Routes.EXPLORE_ENDPOINTS_EFFECTS_TRANSACTION,
          label: "Effects for Transaction",
          form: undefined,
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
          form: undefined,
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
