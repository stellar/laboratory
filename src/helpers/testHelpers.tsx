import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { render as rtlRender } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";

import { reducers } from "config/store";

/* @testing-library/react helpers */

export const render = (
  ui: React.ReactElement,
  {
    preloadedState,
    store = createStore(reducers, applyMiddleware(thunk)),
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
  effects_for_operation = "effects for operation mock response",
  effects_for_transaction = "effects for transaction mock response",
  all_ledgers = "all ledgers mock response",
  single_ledger = "single ledger mock response",
  all_offers = "all offers mock response",
  single_offer = "single offer mock response",
  offers_for_account = "offers for account mock response",
  all_operations = "all operations mock response",
  single_operation = "single operation mock response",
  operations_for_account = "operations for account mock response",
  operations_for_ledger = "operations for ledger mock response",
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
  trades_for_offer = "trades for offer mock response",
  all_transactions = "all transactions mock response",
  single_transaction = "single transaction mock response",
  post_transaction = "post transaction mock response",
  transactions_for_account = "transactions for account mock response",
  transactions_for_ledger = "transactions for ledger mock response",
}

const HORIZON_URL = "https://horizon-testnet.stellar.org";

const server = setupServer(
  // Friendbot
  rest.get("https://friendbot.stellar.org", (_req, res, ctx) => {
    return res(ctx.status(200));
  }),
  // Endpoints: accounts > accounts
  rest.get(`${HORIZON_URL}/accounts`, (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ test: ENDPOINT_RESPONSE.accounts }));
  }),
  // Endpoints: accounts > single account
  rest.get(`${HORIZON_URL}/accounts/:accountId`, (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ test: ENDPOINT_RESPONSE.single_account }),
    );
  }),
  // Endpoints: assets > all assets
  rest.get(`${HORIZON_URL}/assets`, (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ test: ENDPOINT_RESPONSE.all_assets }),
    );
  }),
  // Endpoints: claimable balances > all claimable balances
  rest.get(`${HORIZON_URL}/claimable_balances`, (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ test: ENDPOINT_RESPONSE.all_claimable_balances }),
    );
  }),
  // Endpoints: claimable balances > single claimable balance
  rest.get(
    `${HORIZON_URL}/claimable_balances/:claimableBalanceId`,
    (_req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({ test: ENDPOINT_RESPONSE.single_claimable_balance }),
      );
    },
  ),
  // Endpoints: effects > all effects
  rest.get(`${HORIZON_URL}/effects`, (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ test: ENDPOINT_RESPONSE.all_effects }),
    );
  }),
  // Endpoints: effects > effects for account
  rest.get(
    // TODO: fix URL to have only one / at the end
    `${HORIZON_URL}/accounts//effects`,
    (_req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({ test: ENDPOINT_RESPONSE.effects_for_account }),
      );
    },
  ),
  // Endpoints: effects > effects for ledger
  rest.get(
    // TODO: fix URL to have only one / at the end
    `${HORIZON_URL}/ledgers//effects`,
    (_req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({ test: ENDPOINT_RESPONSE.effects_for_ledger }),
      );
    },
  ),
  // Endpoints: effects > effects for operation
  rest.get(
    // TODO: fix URL to have only one / at the end
    `${HORIZON_URL}/operations//effects`,
    (_req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({ test: ENDPOINT_RESPONSE.effects_for_operation }),
      );
    },
  ),
  // Endpoints: effects > effects for transaction
  rest.get(
    // TODO: fix URL to have only one / at the end
    `${HORIZON_URL}/transactions//effects`,
    (_req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({ test: ENDPOINT_RESPONSE.effects_for_transaction }),
      );
    },
  ),
  // Endpoints: ledger > all ledgers
  rest.get(`${HORIZON_URL}/ledgers`, (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ test: ENDPOINT_RESPONSE.all_ledgers }),
    );
  }),
  // Endpoints: ledger > single ledger
  rest.get(`${HORIZON_URL}/ledgers/:ledger`, (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ test: ENDPOINT_RESPONSE.single_ledger }),
    );
  }),
  // Endpoints: offers > all offers
  rest.get(`${HORIZON_URL}/offers`, (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ test: ENDPOINT_RESPONSE.all_offers }),
    );
  }),
  // Endpoints: offers > single offer
  rest.get(`${HORIZON_URL}/offers/:offerId`, (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ test: ENDPOINT_RESPONSE.single_offer }),
    );
  }),
  // Endpoints: offers > offers for account
  rest.get(
    // TODO: fix URL to have only one / at the end
    `${HORIZON_URL}/accounts//offers`,
    (_req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({ test: ENDPOINT_RESPONSE.offers_for_account }),
      );
    },
  ),
  // Endpoints: operations > all operations
  rest.get(`${HORIZON_URL}/operations`, (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ test: ENDPOINT_RESPONSE.all_operations }),
    );
  }),
  // Endpoints: operations > single operation
  rest.get(`${HORIZON_URL}/operations/:operation`, (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ test: ENDPOINT_RESPONSE.single_operation }),
    );
  }),
  // Endpoints: operations > operations for account
  rest.get(
    // TODO: fix URL to have only one / at the end
    `${HORIZON_URL}/accounts//operations`,
    (_req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({ test: ENDPOINT_RESPONSE.operations_for_account }),
      );
    },
  ),
  // Endpoints: operations > operations for ledger
  rest.get(
    // TODO: fix URL to have only one / at the end
    `${HORIZON_URL}/ledgers//operations`,
    (_req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({ test: ENDPOINT_RESPONSE.operations_for_ledger }),
      );
    },
  ),
  // Endpoints: operations > operations for transaction
  rest.get(
    // TODO: fix URL to have only one / at the end
    `${HORIZON_URL}/transactions//operations`,
    (_req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({ test: ENDPOINT_RESPONSE.operations_for_transaction }),
      );
    },
  ),
  // Endpoints: order book > details
  rest.get(`${HORIZON_URL}/order_book`, (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ test: ENDPOINT_RESPONSE.order_book_details }),
    );
  }),
  // Endpoints: paths > find payment paths
  rest.get(`${HORIZON_URL}/paths`, (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ test: ENDPOINT_RESPONSE.find_payment_paths }),
    );
  }),
  // Endpoints: paths > find strict receive payment paths
  rest.get(`${HORIZON_URL}/paths/strict-receive`, (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ test: ENDPOINT_RESPONSE.find_strict_receive_payment_paths }),
    );
  }),
  // Endpoints: paths > find strict send payment paths
  rest.get(`${HORIZON_URL}/paths/strict-send`, (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ test: ENDPOINT_RESPONSE.find_strict_send_payment_paths }),
    );
  }),
  // Endpoints: payments > all payments
  rest.get(`${HORIZON_URL}/payments`, (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ test: ENDPOINT_RESPONSE.all_payments }),
    );
  }),
  // Endpoints: payments > payments for account
  rest.get(
    // TODO: fix URL to have only one / at the end
    `${HORIZON_URL}/accounts//payments`,
    (_req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({ test: ENDPOINT_RESPONSE.payments_for_account }),
      );
    },
  ),
  // Endpoints: payments > payments for ledger
  rest.get(
    // TODO: fix URL to have only one / at the end
    `${HORIZON_URL}/ledgers//payments`,
    (_req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({ test: ENDPOINT_RESPONSE.payments_for_ledger }),
      );
    },
  ),
  // Endpoints: payments > payments for transaction
  rest.get(
    // TODO: fix URL to have only one / at the end
    `${HORIZON_URL}/transactions//payments`,
    (_req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({ test: ENDPOINT_RESPONSE.payments_for_transaction }),
      );
    },
  ),
  // Endpoints: trade aggregations > trade aggregations
  rest.get(`${HORIZON_URL}/trade_aggregations`, (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ test: ENDPOINT_RESPONSE.trade_aggregations }),
    );
  }),
  // Endpoints: trades > all trades
  rest.get(`${HORIZON_URL}/trades`, (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ test: ENDPOINT_RESPONSE.all_trades }),
    );
  }),
  // Endpoints: trades > trades for account
  rest.get(
    // TODO: fix URL to have only one / at the end
    `${HORIZON_URL}/accounts//trades`,
    (_req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({ test: ENDPOINT_RESPONSE.trades_for_account }),
      );
    },
  ),
  // Endpoints: trades > trades for offer
  rest.get(
    // TODO: fix URL to have only one / at the end
    `${HORIZON_URL}/offers//trades`,
    (_req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({ test: ENDPOINT_RESPONSE.trades_for_offer }),
      );
    },
  ),
  // Endpoints: transactions > all transactions
  rest.get(`${HORIZON_URL}/transactions`, (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ test: ENDPOINT_RESPONSE.all_transactions }),
    );
  }),
  // Endpoints: transactions > single transaction
  rest.get(`${HORIZON_URL}/transactions/:transaction`, (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ test: ENDPOINT_RESPONSE.single_transaction }),
    );
  }),
  // Endpoints: transactions > post transaction
  rest.post(`${HORIZON_URL}/transactions`, (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ test: ENDPOINT_RESPONSE.post_transaction }),
    );
  }),
  // Endpoints: transactions > transactions for account
  rest.get(
    // TODO: fix URL to have only one / at the end
    `${HORIZON_URL}/accounts//transactions`,
    (_req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({ test: ENDPOINT_RESPONSE.transactions_for_account }),
      );
    },
  ),
  // Endpoints: transactions > transactions for ledger
  rest.get(
    // TODO: fix URL to have only one / at the end
    `${HORIZON_URL}/ledgers//transactions`,
    (_req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({ test: ENDPOINT_RESPONSE.transactions_for_ledger }),
      );
    },
  ),
  // fallback
  rest.get("*", (req, res, ctx) => {
    console.error(`No request handler for ${req.url.toString()}`);
    return res(
      ctx.status(500),
      ctx.json({ error: "Must add request handler" }),
    );
  }),
);

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

export { server, rest, ENDPOINT_RESPONSE };
