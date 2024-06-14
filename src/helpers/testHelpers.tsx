import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { render as rtlRender } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";

import { reducers } from "config/store";

/* @testing-library/react helpers */

export const render = (
  ui: React.ReactElement,
  {
    preloadedState,
    store = createStore(reducers, preloadedState, applyMiddleware(thunk)),
    ...renderOptions
  }: any = {},
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return <Provider store={store}>{children}</Provider>;
  };
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
};

enum ENDPOINT_RESPONSE {
  accounts = "accounts mock response",
  single_account = "single account mock response",
  all_assets = "all assets mock response",
  all_claimable_balances = "all claimable balances mock response",
  single_claimable_balance = "single claimable balance mock response",
  all_effects = "all effects mock response",
  effects_for_account = "effects for account mock response",
  effects_for_ledger = "effects for ledger mock response",
  effects_for_liquidity_pool = "effects for liquidity pool mock response",
  effects_for_operation = "effects for operation mock response",
  effects_for_transaction = "effects for transaction mock response",
  all_fee_stats = "all fee stats mock response",
  all_ledgers = "all ledgers mock response",
  single_ledger = "single ledger mock response",
  all_liquidity_pools = "all liquidity pools mock response",
  single_liquidity_pool = "single liquidity pool mock response",
  all_offers = "all offers mock response",
  single_offer = "single offer mock response",
  offers_for_account = "offers for account mock response",
  all_operations = "all operations mock response",
  single_operation = "single operation mock response",
  operations_for_account = "operations for account mock response",
  operations_for_ledger = "operations for ledger mock response",
  operations_for_liquidity_pool = "operations for liquidity pool mock response",
  operations_for_transaction = "operations for transaction mock response",
  order_book_details = "order book details mock response",
  find_payment_paths = "find payment paths mock response",
  find_strict_receive_payment_paths = "find strict receive payments paths mock response",
  find_strict_send_payment_paths = "find strict send payments paths mock response",
  all_payments = "all payments mock response",
  payments_for_account = "payments for account mock response",
  payments_for_ledger = "payments for ledger mock response",
  payments_for_transaction = "payments for transaction mock response",
  trade_aggregations = "trade aggregations mock response",
  all_trades = "all trades mock response",
  trades_for_account = "trades for account mock response",
  trades_for_liquidity_pool = "trades for liquidity pool mock response",
  trades_for_offer = "trades for offer mock response",
  all_transactions = "all transactions mock response",
  single_transaction = "single transaction mock response",
  post_transaction = "post transaction mock response",
  transactions_for_account = "transactions for account mock response",
  transactions_for_ledger = "transactions for ledger mock response",
  transactions_for_liquidity_pool = "transactions for liquidity pool mock response",
}

const HORIZON_URL = "https://horizon-testnet.stellar.org";

const server = setupServer(
  // Friendbot
  http.get("https://friendbot.stellar.org", () => {
    return new HttpResponse(null, { status: 200 });
  }),
  // Endpoints: accounts > accounts
  http.get(`${HORIZON_URL}/accounts`, () => {
    return HttpResponse.json({ test: ENDPOINT_RESPONSE.accounts });
  }),
  // Endpoints: accounts > single account
  http.get(`${HORIZON_URL}/accounts/:accountId`, () => {
    return HttpResponse.json({ test: ENDPOINT_RESPONSE.single_account });
  }),
  // Endpoints: assets > all assets
  http.get(`${HORIZON_URL}/assets`, () => {
    return HttpResponse.json({ test: ENDPOINT_RESPONSE.all_assets });
  }),
  // Endpoints: claimable balances > all claimable balances
  http.get(`${HORIZON_URL}/claimable_balances`, () => {
    return HttpResponse.json({
      test: ENDPOINT_RESPONSE.all_claimable_balances,
    });
  }),
  // Endpoints: claimable balances > single claimable balance
  http.get(`${HORIZON_URL}/claimable_balances/:claimableBalanceId`, () => {
    return HttpResponse.json({
      test: ENDPOINT_RESPONSE.single_claimable_balance,
    });
  }),
  // Endpoints: effects > all effects
  http.get(`${HORIZON_URL}/effects`, () => {
    return HttpResponse.json({ test: ENDPOINT_RESPONSE.all_effects });
  }),
  // Endpoints: effects > effects for account
  http.get(
    // TODO: fix URL to have only one / at the end (missing param)
    `${HORIZON_URL}/accounts//effects`,
    () => {
      return HttpResponse.json({ test: ENDPOINT_RESPONSE.effects_for_account });
    },
  ),
  // Endpoints: effects > effects for ledger
  http.get(
    // TODO: fix URL to have only one / at the end (missing param)
    `${HORIZON_URL}/ledgers//effects`,
    () => {
      return HttpResponse.json({ test: ENDPOINT_RESPONSE.effects_for_ledger });
    },
  ),
  // Endpoints: effects > effects for liquidity pool
  http.get(
    // TODO: fix URL to have only one / at the end (missing param)
    `${HORIZON_URL}/liquidity_pools//effects`,
    () => {
      return HttpResponse.json({
        test: ENDPOINT_RESPONSE.effects_for_liquidity_pool,
      });
    },
  ),
  // Endpoints: effects > effects for operation
  http.get(
    // TODO: fix URL to have only one / at the end (missing param)
    `${HORIZON_URL}/operations//effects`,
    () => {
      return HttpResponse.json({
        test: ENDPOINT_RESPONSE.effects_for_operation,
      });
    },
  ),
  // Endpoints: effects > effects for transaction
  http.get(
    // TODO: fix URL to have only one / at the end (missing param)
    `${HORIZON_URL}/transactions//effects`,
    () => {
      return HttpResponse.json({
        test: ENDPOINT_RESPONSE.effects_for_transaction,
      });
    },
  ),
  // Endpoints: fee_stats > all fee_stats
  http.get(`${HORIZON_URL}/fee_stats`, () => {
    return HttpResponse.json({ test: ENDPOINT_RESPONSE.all_fee_stats });
  }),
  // Endpoints: ledger > all ledgers
  http.get(`${HORIZON_URL}/ledgers`, () => {
    return HttpResponse.json({ test: ENDPOINT_RESPONSE.all_ledgers });
  }),
  // Endpoints: ledger > single ledger
  http.get(`${HORIZON_URL}/ledgers/:ledger`, () => {
    return HttpResponse.json({ test: ENDPOINT_RESPONSE.single_ledger });
  }),
  // Endpoints: liquidity pools > all liquidity pools
  http.get(`${HORIZON_URL}/liquidity_pools`, () => {
    return HttpResponse.json({ test: ENDPOINT_RESPONSE.all_liquidity_pools });
  }),
  // Endpoints: liquidity pools > single liquidity pool
  http.get(`${HORIZON_URL}/liquidity_pools/:liquidity_pool_id`, () => {
    return HttpResponse.json({ test: ENDPOINT_RESPONSE.single_liquidity_pool });
  }),
  // Endpoints: offers > all offers
  http.get(`${HORIZON_URL}/offers`, () => {
    return HttpResponse.json({ test: ENDPOINT_RESPONSE.all_offers });
  }),
  // Endpoints: offers > single offer
  http.get(`${HORIZON_URL}/offers/:offerId`, () => {
    return HttpResponse.json({ test: ENDPOINT_RESPONSE.single_offer });
  }),
  // Endpoints: offers > offers for account
  http.get(
    // TODO: fix URL to have only one / at the end (missing param)
    `${HORIZON_URL}/accounts//offers`,
    () => {
      return HttpResponse.json({ test: ENDPOINT_RESPONSE.offers_for_account });
    },
  ),
  // Endpoints: operations > all operations
  http.get(`${HORIZON_URL}/operations`, () => {
    return HttpResponse.json({ test: ENDPOINT_RESPONSE.all_operations });
  }),
  // Endpoints: operations > single operation
  http.get(`${HORIZON_URL}/operations/:operation`, () => {
    return HttpResponse.json({ test: ENDPOINT_RESPONSE.single_operation });
  }),
  // Endpoints: operations > operations for account
  http.get(
    // TODO: fix URL to have only one / at the end (missing param)
    `${HORIZON_URL}/accounts//operations`,
    () => {
      return HttpResponse.json({
        test: ENDPOINT_RESPONSE.operations_for_account,
      });
    },
  ),
  // Endpoints: operations > operations for ledger
  http.get(
    // TODO: fix URL to have only one / at the end (missing param)
    `${HORIZON_URL}/ledgers//operations`,
    () => {
      return HttpResponse.json({
        test: ENDPOINT_RESPONSE.operations_for_ledger,
      });
    },
  ),
  // Endpoints: operations > operations for liquidity pool
  http.get(
    // TODO: fix URL to have only one / at the end (missing param)
    `${HORIZON_URL}/liquidity_pools//operations`,
    () => {
      return HttpResponse.json({
        test: ENDPOINT_RESPONSE.operations_for_liquidity_pool,
      });
    },
  ),
  // Endpoints: operations > operations for transaction
  http.get(
    // TODO: fix URL to have only one / at the end (missing param)
    `${HORIZON_URL}/transactions//operations`,
    () => {
      return HttpResponse.json({
        test: ENDPOINT_RESPONSE.operations_for_transaction,
      });
    },
  ),
  // Endpoints: order book > details
  http.get(`${HORIZON_URL}/order_book`, () => {
    return HttpResponse.json({ test: ENDPOINT_RESPONSE.order_book_details });
  }),
  // Endpoints: paths > find payment paths
  http.get(`${HORIZON_URL}/paths`, () => {
    return HttpResponse.json({ test: ENDPOINT_RESPONSE.find_payment_paths });
  }),
  // Endpoints: paths > find strict receive payment paths
  http.get(`${HORIZON_URL}/paths/strict-receive`, () => {
    return HttpResponse.json({
      test: ENDPOINT_RESPONSE.find_strict_receive_payment_paths,
    });
  }),
  // Endpoints: paths > find strict send payment paths
  http.get(`${HORIZON_URL}/paths/strict-send`, () => {
    return HttpResponse.json({
      test: ENDPOINT_RESPONSE.find_strict_send_payment_paths,
    });
  }),
  // Endpoints: payments > all payments
  http.get(`${HORIZON_URL}/payments`, () => {
    return HttpResponse.json({ test: ENDPOINT_RESPONSE.all_payments });
  }),
  // Endpoints: payments > payments for account
  http.get(
    // TODO: fix URL to have only one / at the end (missing param)
    `${HORIZON_URL}/accounts//payments`,
    () => {
      return HttpResponse.json({
        test: ENDPOINT_RESPONSE.payments_for_account,
      });
    },
  ),
  // Endpoints: payments > payments for ledger
  http.get(
    // TODO: fix URL to have only one / at the end (missing param)
    `${HORIZON_URL}/ledgers//payments`,
    () => {
      return HttpResponse.json({ test: ENDPOINT_RESPONSE.payments_for_ledger });
    },
  ),
  // Endpoints: payments > payments for transaction
  http.get(
    // TODO: fix URL to have only one / at the end (missing param)
    `${HORIZON_URL}/transactions//payments`,
    () => {
      return HttpResponse.json({
        test: ENDPOINT_RESPONSE.payments_for_transaction,
      });
    },
  ),
  // Endpoints: trade aggregations > trade aggregations
  http.get(`${HORIZON_URL}/trade_aggregations`, () => {
    return HttpResponse.json({ test: ENDPOINT_RESPONSE.trade_aggregations });
  }),
  // Endpoints: trades > all trades
  http.get(`${HORIZON_URL}/trades`, () => {
    return HttpResponse.json({ test: ENDPOINT_RESPONSE.all_trades });
  }),
  // Endpoints: trades > trades for account
  http.get(
    // TODO: fix URL to have only one / at the end (missing param)
    `${HORIZON_URL}/accounts//trades`,
    () => {
      return HttpResponse.json({ test: ENDPOINT_RESPONSE.trades_for_account });
    },
  ),
  // Endpoints: trades > trades for liquidity pool
  http.get(
    // TODO: fix URL to have only one / at the end (missing param)
    `${HORIZON_URL}/liquidity_pools//trades`,
    () => {
      return HttpResponse.json({
        test: ENDPOINT_RESPONSE.trades_for_liquidity_pool,
      });
    },
  ),
  // Endpoints: trades > trades for offer
  http.get(
    // TODO: fix URL to have only one / at the end (missing param)
    `${HORIZON_URL}/offers//trades`,
    () => {
      return HttpResponse.json({ test: ENDPOINT_RESPONSE.trades_for_offer });
    },
  ),
  // Endpoints: transactions > all transactions
  http.get(`${HORIZON_URL}/transactions`, () => {
    return HttpResponse.json({ test: ENDPOINT_RESPONSE.all_transactions });
  }),
  // Endpoints: transactions > single transaction
  http.get(`${HORIZON_URL}/transactions/:transaction`, () => {
    return HttpResponse.json({ test: ENDPOINT_RESPONSE.single_transaction });
  }),
  // Endpoints: transactions > post transaction
  http.post(`${HORIZON_URL}/transactions`, () => {
    return HttpResponse.json({ test: ENDPOINT_RESPONSE.post_transaction });
  }),
  // Endpoints: transactions > transactions for account
  http.get(
    // TODO: fix URL to have only one / at the end (missing param)
    `${HORIZON_URL}/accounts//transactions`,
    () => {
      return HttpResponse.json({
        test: ENDPOINT_RESPONSE.transactions_for_account,
      });
    },
  ),
  // Endpoints: transactions > transactions for ledger
  http.get(
    // TODO: fix URL to have only one / at the end (missing param)
    `${HORIZON_URL}/ledgers//transactions`,
    () => {
      return HttpResponse.json({
        test: ENDPOINT_RESPONSE.transactions_for_ledger,
      });
    },
  ),
  // Endpoints: transactions > transactions for liquidity pool
  http.get(
    // TODO: fix URL to have only one / at the end (missing param)
    `${HORIZON_URL}/liquidity_pools//transactions`,
    () => {
      return HttpResponse.json({
        test: ENDPOINT_RESPONSE.transactions_for_liquidity_pool,
      });
    },
  ),
  // fallback
  http.get("*", () => {
    return new HttpResponse(null, { status: 500 });
    // console.error(`No request handler for ${req.url.toString()}`);
  }),
);

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

export { server, http, ENDPOINT_RESPONSE };
