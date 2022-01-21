import All from "components/SetupPanes/All";
import Accounts from "components/SetupPanes/Accounts";
import AllAssets from "components/SetupPanes/AllAssets";
import { AllLiquidityPools } from "components/SetupPanes/AllLiquidityPools";
import AllOffers from "components/SetupPanes/AllOffers";
import AllWithFailed from "components/SetupPanes/AllWithFailed";
import ClaimableBalances from "components/SetupPanes/ClaimableBalances";
import FindPaymentPaths from "components/SetupPanes/FindPaymentPaths";
import FindStrictSendPaymentPaths from "components/SetupPanes/FindStrictSendPaymentPaths";
import FindStrictReceivePaymentPaths from "components/SetupPanes/FindStrictReceivePaymentPaths";
import ForAccount from "components/SetupPanes/ForAccount";
import ForAccountWithFailed from "components/SetupPanes/ForAccountWithFailed";
import ForLedger from "components/SetupPanes/ForLedger";
import { ForLiquidityPool } from "components/SetupPanes/ForLiquidityPool";
import { ForLiquidityPoolWithFailed } from "components/SetupPanes/ForLiquidityPoolWithFailed";
import ForLedgerWithFailed from "components/SetupPanes/ForLedgerWithFailed";
import ForOffer from "components/SetupPanes/ForOffer";
import ForOperation from "components/SetupPanes/ForOperation";
import ForTransaction from "components/SetupPanes/ForTransaction";
import OrderBookDetails from "components/SetupPanes/OrderBookDetails";
import PostTransaction from "components/SetupPanes/PostTransaction";
import SingleAccount from "components/SetupPanes/SingleAccount";
import SingleClaimableBalance from "components/SetupPanes/SingleClaimableBalance";
import SingleLedger from "components/SetupPanes/SingleLedger";
import { SingleLiquidityPool } from "components/SetupPanes/SingleLiquidityPool";
import SingleOperation from "components/SetupPanes/SingleOperation";
import SingleOffer from "components/SetupPanes/SingleOffer";
import SingleTransaction from "components/SetupPanes/SingleTransaction";
import TradeAggregations from "components/SetupPanes/TradeAggregations";
import Trades from "components/SetupPanes/Trades";
import { EndpointItemProps, RequestMethod } from "types/types.d";

type EndpointsMap = {
  [key: string]: EndpointItemProps;
};

export const endpointsMap: EndpointsMap = {
  accounts: {
    label: "Accounts",
    endpoints: {
      multiple: {
        label: "Accounts",
        helpUrl: "https://developers.stellar.org/docs/glossary/accounts/",
        method: RequestMethod.GET,
        path: {
          template: "/accounts/{?sponsor,signer,asset,cursor,limit,order}",
        },
        setupComponent: Accounts,
      },
      single: {
        label: "Single Account",
        helpUrl:
          "https://developers.stellar.org/api/resources/accounts/single/",
        method: RequestMethod.GET,
        path: {
          template: "/accounts/{account_id}",
        },
        setupComponent: SingleAccount,
      },
    },
  },
  assets: {
    label: "Assets",
    endpoints: {
      single: {
        label: "All Assets",
        helpUrl: "https://developers.stellar.org/api/resources/assets/",
        method: RequestMethod.GET,
        path: {
          template: "/assets{?asset_code,asset_issuer,cursor,order,limit}",
        },
        setupComponent: AllAssets,
      },
    },
  },
  claimable_balances: {
    label: "Claimable Balances",
    endpoints: {
      multiple: {
        label: "All Claimable Balances",
        helpUrl:
          "https://developers.stellar.org/api/resources/claimablebalances/list/",
        method: RequestMethod.GET,
        disableStreaming: true,
        path: {
          template:
            "/claimable_balances/{?sponsor,asset,claimant,cursor,limit,order}",
        },
        setupComponent: ClaimableBalances,
      },
      single: {
        label: "Single Claimable Balance",
        helpUrl:
          "https://developers.stellar.org/api/resources/claimablebalances/single/",
        method: RequestMethod.GET,
        disableStreaming: true,
        path: {
          template: "/claimable_balances/{claimable_balance_id}",
        },
        setupComponent: SingleClaimableBalance,
      },
    },
  },
  effects: {
    label: "Effects",
    endpoints: {
      all: {
        label: "All Effects",
        helpUrl: "https://developers.stellar.org/api/resources/effects/list/",
        method: RequestMethod.GET,
        path: {
          template: "/effects{?cursor,limit,order}",
        },
        setupComponent: All,
      },
      for_account: {
        label: "Effects for Account",
        helpUrl:
          "https://developers.stellar.org/api/resources/accounts/effects/",
        method: RequestMethod.GET,
        path: {
          template: "/accounts/{account_id}/effects{?cursor,limit,order}",
        },
        setupComponent: ForAccount,
      },
      for_ledger: {
        label: "Effects for Ledger",
        helpUrl:
          // TODO: vcarl Replace this with a glossary link. This one 404s: https://developers.stellar.org/docs/glossary/effects/
          "https://developers.stellar.org/api/resources/effects/",
        method: RequestMethod.GET,
        path: {
          template: "/ledgers/{ledger}/effects{?cursor,limit,order}",
        },
        setupComponent: ForLedger,
      },
      for_liquidity_pool: {
        label: "Effects for Liquidity Pool",
        helpUrl:
          "https://developers.stellar.org/api/resources/liquiditypools/effects/",
        method: RequestMethod.GET,
        path: {
          template:
            "/liquidity_pools/{liquidity_pool_id}/effects{?cursor,limit,order}",
        },
        setupComponent: ForLiquidityPool,
      },
      for_operation: {
        label: "Effects for Operation",
        helpUrl:
          "https://developers.stellar.org/api/resources/operations/effects/",
        method: RequestMethod.GET,
        path: {
          template: "/operations/{operation}/effects{?cursor,limit,order}",
        },
        setupComponent: ForOperation,
      },
      for_transaction: {
        label: "Effects for Transaction",
        helpUrl:
          "https://developers.stellar.org/api/resources/transactions/effects/",
        method: RequestMethod.GET,
        path: {
          template: "/transactions/{transaction}/effects{?cursor,limit,order}",
        },
        setupComponent: ForTransaction,
      },
    },
  },
  fee_stats: {
    label: "Fee Stats",
    endpoints: {
      all: {
        label: "Fee Stats",
        helpUrl: "https://developers.stellar.org/api/aggregations/fee-stats/object/",
        method: RequestMethod.GET,
        path: {
            template: "/fee_stats",
        },
        setupComponent: All,
      },
    },
  },
  ledgers: {
    label: "Ledger",
    endpoints: {
      all: {
        label: "All Ledgers",
        helpUrl: "https://developers.stellar.org/api/resources/ledgers/",
        method: RequestMethod.GET,
        path: {
          template: "/ledgers{?cursor,limit,order}",
        },
        setupComponent: All,
      },
      single: {
        label: "Single Ledger",
        helpUrl: "https://developers.stellar.org/api/resources/ledgers/single/",
        method: RequestMethod.GET,
        path: {
          template: "/ledgers/{ledger}",
        },
        setupComponent: SingleLedger,
      },
    },
  },
  liquidity_pools: {
    label: "Liquidity Pools",
    endpoints: {
      all: {
        label: "All Liquidity Pools",
        helpUrl: "https://developers.stellar.org/api/resources/liquiditypools/",
        method: RequestMethod.GET,
        path: {
          template: "/liquidity_pools{?reserves,cursor,limit,order}",
        },
        setupComponent: AllLiquidityPools,
      },
      single: {
        label: "Single Liquidity Pool",
        helpUrl:
          "https://developers.stellar.org/api/resources/liquiditypools/single/",
        method: RequestMethod.GET,
        path: {
          template: "/liquidity_pools/{liquidity_pool_id}",
        },
        setupComponent: SingleLiquidityPool,
      },
    },
  },
  offers: {
    label: "Offers",
    endpoints: {
      all: {
        label: "All Offers",
        helpUrl: "https://developers.stellar.org/api/resources/offers/list/",
        method: RequestMethod.GET,
        path: {
          template:
            "/offers{?sponsor,selling,buying,seller,cursor,limit,order}",
        },
        setupComponent: AllOffers,
      },
      single: {
        label: "Single Offer",
        helpUrl: "https://developers.stellar.org/api/resources/offers/",
        method: RequestMethod.GET,
        path: {
          template: "/offers/{offer_id}",
        },
        setupComponent: SingleOffer,
      },
      for_account: {
        label: "Offers for Account",
        helpUrl:
          "https://developers.stellar.org/api/resources/accounts/offers/",
        method: RequestMethod.GET,
        path: {
          template: "/accounts/{account_id}/offers{?cursor,limit,order}",
        },
        setupComponent: ForAccount,
      },
    },
  },
  operations: {
    label: "Operations",
    endpoints: {
      all: {
        label: "All Operations",
        helpUrl: "https://developers.stellar.org/api/resources/operations/",
        method: RequestMethod.GET,
        path: {
          template: "/operations{?cursor,limit,order,include_failed}",
        },
        setupComponent: AllWithFailed,
      },
      single: {
        label: "Single Operation",
        helpUrl:
          "https://developers.stellar.org/api/resources/operations/single/",
        method: RequestMethod.GET,
        path: {
          template: "/operations/{operation}",
        },
        setupComponent: SingleOperation,
      },
      for_account: {
        label: "Operations for Account",
        helpUrl:
          "https://developers.stellar.org/api/resources/accounts/operations/",
        method: RequestMethod.GET,
        path: {
          template:
            "/accounts/{account_id}/operations{?cursor,limit,order,include_failed}",
        },
        setupComponent: ForAccountWithFailed,
      },
      for_ledger: {
        label: "Operations for Ledger",
        helpUrl:
          "https://developers.stellar.org/api/resources/ledgers/operations/",
        method: RequestMethod.GET,
        path: {
          template:
            "/ledgers/{ledger}/operations{?cursor,limit,order,include_failed}",
        },
        setupComponent: ForLedgerWithFailed,
      },
      for_liquidity_pool: {
        label: "Operations for Liquidity Pool",
        helpUrl:
          "https://developers.stellar.org/api/resources/liquiditypools/operations/",
        method: RequestMethod.GET,
        path: {
          template:
            "/liquidity_pools/{liquidity_pool_id}/operations{?cursor,limit,order,include_failed}",
        },
        setupComponent: ForLiquidityPoolWithFailed,
      },
      for_transaction: {
        label: "Operations for Transaction",
        helpUrl:
          "https://developers.stellar.org/api/resources/transactions/operations/",
        method: RequestMethod.GET,
        path: {
          template:
            "/transactions/{transaction}/operations{?cursor,limit,order}",
        },
        setupComponent: ForTransaction,
      },
    },
  },
  order_book: {
    label: "Order Book",
    endpoints: {
      details: {
        label: "Details",
        helpUrl: "https://developers.stellar.org/api/aggregations/order-books/",
        method: RequestMethod.GET,
        path: {
          template:
            "/order_book{?selling_asset_type,selling_asset_code,selling_asset_issuer,buying_asset_type,buying_asset_code,buying_asset_issuer}",
          selling_asset_type: "selling_asset.type",
          selling_asset_code: "selling_asset.code",
          selling_asset_issuer: "selling_asset.issuer",
          buying_asset_type: "buying_asset.type",
          buying_asset_code: "buying_asset.code",
          buying_asset_issuer: "buying_asset.issuer",
        },
        setupComponent: OrderBookDetails,
      },
    },
  },
  paths: {
    label: "Paths",
    endpoints: {
      all: {
        label: "Find Payment Paths",
        helpUrl: "https://developers.stellar.org/api/aggregations/paths/",
        method: RequestMethod.GET,
        path: {
          template:
            "/paths{?source_account,destination_account,destination_asset_type,destination_asset_code,destination_asset_issuer,destination_amount}",
          destination_asset_type: "destination_asset.type",
          destination_asset_code: "destination_asset.code",
          destination_asset_issuer: "destination_asset.issuer",
        },
        setupComponent: FindPaymentPaths,
      },
      strict_receive: {
        label: "Find Strict Receive Payment Paths",
        helpUrl:
          "https://developers.stellar.org/api/aggregations/paths/strict-receive/",
        method: RequestMethod.GET,
        path: {
          template:
            "/paths/strict-receive{?source_assets,source_account,destination_account,destination_asset_type,destination_asset_issuer,destination_asset_code,destination_amount}",
          destination_asset_type: "destination_asset.type",
          destination_asset_code: "destination_asset.code",
          destination_asset_issuer: "destination_asset.issuer",
        },
        setupComponent: FindStrictReceivePaymentPaths,
      },
      strict_send: {
        label: "Find Strict Send Payment Paths",
        helpUrl:
          "https://developers.stellar.org/api/aggregations/paths/strict-send/",
        method: RequestMethod.GET,
        path: {
          template:
            "/paths/strict-send{?destination_account,destination_assets,source_asset_type,source_asset_issuer,source_asset_code,source_amount}",
          source_asset_type: "source_asset.type",
          source_asset_code: "source_asset.code",
          source_asset_issuer: "source_asset.issuer",
        },
        setupComponent: FindStrictSendPaymentPaths,
      },
    },
  },
  payments: {
    label: "Payments",
    endpoints: {
      all: {
        label: "All Payments",
        helpUrl:
          // TODO: vcarl This doesn't have a replacement page yet
          "https://www.stellar.org/developers/horizon/reference/endpoints/payments-all.html",
        method: RequestMethod.GET,
        path: {
          template: "/payments{?cursor,limit,order,include_failed}",
        },
        setupComponent: AllWithFailed,
      },
      for_account: {
        label: "Payments for Account",
        helpUrl:
          // TODO: vcarl This doesn't have a replacement page yet
          "https://www.stellar.org/developers/horizon/reference/endpoints/payments-for-account.html",
        method: RequestMethod.GET,
        path: {
          template:
            "/accounts/{account_id}/payments{?cursor,limit,order,include_failed}",
        },
        setupComponent: ForAccountWithFailed,
      },
      for_ledger: {
        label: "Payments for Ledger",
        helpUrl:
          "https://developers.stellar.org/api/resources/ledgers/payments/",
        method: RequestMethod.GET,
        path: {
          template:
            "/ledgers/{ledger}/payments{?cursor,limit,order,include_failed}",
        },
        setupComponent: ForLedgerWithFailed,
      },
      for_transaction: {
        label: "Payments for Transaction",
        helpUrl:
          // TODO: vcarl This doesn't have a replacement page yet
          "https://www.stellar.org/developers/horizon/reference/endpoints/payments-for-transaction.html",
        method: RequestMethod.GET,
        path: {
          template: "/transactions/{transaction}/payments{?cursor,limit,order}",
        },
        setupComponent: ForTransaction,
      },
    },
  },
  trade_aggregations: {
    label: "Trade Aggregations",
    endpoints: {
      all: {
        label: "Trade Aggregations",
        helpUrl:
          "https://developers.stellar.org/api/aggregations/trade-aggregations/",
        method: RequestMethod.GET,
        path: {
          template:
            "/trade_aggregations{?base_asset_type,base_asset_code,base_asset_issuer,counter_asset_type,counter_asset_code,counter_asset_issuer,start_time,end_time,resolution,limit,order}",
          base_asset_type: "base_asset.type",
          base_asset_code: "base_asset.code",
          base_asset_issuer: "base_asset.issuer",
          counter_asset_type: "counter_asset.type",
          counter_asset_code: "counter_asset.code",
          counter_asset_issuer: "counter_asset.issuer",
          start_time: "start_time",
          end_time: "end_time",
          resolution: "resolution",
        },
        setupComponent: TradeAggregations,
      },
    },
  },
  trades: {
    label: "Trades",
    endpoints: {
      all: {
        label: "All Trades",
        helpUrl: "https://developers.stellar.org/api/resources/trades/",
        method: RequestMethod.GET,
        path: {
          template:
            "/trades{?base_asset_type,base_asset_code,base_asset_issuer,counter_asset_type,counter_asset_code,counter_asset_issuer,offer_id,cursor,limit,order}",
          base_asset_type: "base_asset.type",
          base_asset_code: "base_asset.code",
          base_asset_issuer: "base_asset.issuer",
          counter_asset_type: "counter_asset.type",
          counter_asset_code: "counter_asset.code",
          counter_asset_issuer: "counter_asset.issuer",
          offer_id: "offer_id",
        },
        setupComponent: Trades,
      },
      for_account: {
        label: "Trades for Account",
        helpUrl:
          "https://developers.stellar.org/api/resources/accounts/trades/",
        method: RequestMethod.GET,
        path: {
          template: "/accounts/{account_id}/trades{?cursor,limit,order}",
        },
        setupComponent: ForAccount,
      },
      for_liquidity_pool: {
        label: "Trades for Liquidity Pool",
        // TODO: need docs
        helpUrl:
          "https://developers.stellar.org/api/resources/liquiditypools/trades/",
        method: RequestMethod.GET,
        path: {
          template:
            "/liquidity_pools/{liquidity_pool_id}/trades{?cursor,limit,order}",
        },
        setupComponent: ForLiquidityPool,
      },
      for_offer: {
        label: "Trades for Offer",
        helpUrl:
          // TODO: vcarl This doesn't have a replacement page yet
          "https://www.stellar.org/developers/horizon/reference/endpoints/trades-for-offer.html",
        method: RequestMethod.GET,
        path: {
          template: "/offers/{offer_id}/trades{?cursor,limit,order}",
        },
        setupComponent: ForOffer,
      },
    },
  },
  transactions: {
    label: "Transactions",
    endpoints: {
      all: {
        label: "All Transactions",
        helpUrl:
          "https://developers.stellar.org/api/resources/transactions/list/",
        method: RequestMethod.GET,
        path: {
          template: "/transactions{?cursor,limit,order,include_failed}",
        },
        setupComponent: AllWithFailed,
      },
      single: {
        label: "Single Transaction",
        helpUrl:
          "https://developers.stellar.org/api/resources/transactions/single/",
        method: RequestMethod.GET,
        path: {
          template: "/transactions/{transaction}",
        },
        setupComponent: SingleTransaction,
      },
      create: {
        label: "Post Transaction",
        helpUrl:
          // TODO: vcarl This doesn't have a replacement page yet
          "https://www.stellar.org/developers/horizon/reference/endpoints/transactions-create.html",
        method: RequestMethod.POST,
        disableStreaming: true,
        path: {
          template: "/transactions",
        },
        setupComponent: PostTransaction,
      },
      for_account: {
        label: "Transactions for Account",
        helpUrl:
          "https://developers.stellar.org/api/resources/accounts/transactions/",
        method: RequestMethod.GET,
        path: {
          template:
            "/accounts/{account_id}/transactions{?cursor,limit,order,include_failed}",
        },
        setupComponent: ForAccountWithFailed,
      },
      for_ledger: {
        label: "Transactions for Ledger",
        helpUrl:
          "https://developers.stellar.org/api/resources/ledgers/transactions/",
        method: RequestMethod.GET,
        path: {
          template:
            "/ledgers/{ledger}/transactions{?cursor,limit,order,include_failed}",
        },
        setupComponent: ForLedgerWithFailed,
      },
      for_liquidity_pool: {
        label: "Transactions for Liquidity Pool",
        helpUrl:
          "https://developers.stellar.org/api/resources/liquiditypools/transactions/",
        method: RequestMethod.GET,
        path: {
          template:
            "/liquidity_pools/{liquidity_pool_id}/transactions{?cursor,limit,order,include_failed}",
        },
        setupComponent: ForLiquidityPoolWithFailed,
      },
    },
  },
};
