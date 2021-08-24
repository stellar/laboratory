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
}

const server = setupServer(
  // Friendbot
  rest.get("https://friendbot.stellar.org", (_req, res, ctx) => {
    return res(ctx.status(200));
  }),
  // Endpoints: accounts > accounts
  rest.get("https://horizon-testnet.stellar.org/accounts", (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ test: ENDPOINT_RESPONSE.accounts }));
  }),
  // Endpoints: accounts > single account
  rest.get(
    "https://horizon-testnet.stellar.org/accounts/:accountId",
    (_req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({ test: ENDPOINT_RESPONSE.single_account }),
      );
    },
  ),
  // Endpoints: assets > all assets
  rest.get("https://horizon-testnet.stellar.org/assets", (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ test: ENDPOINT_RESPONSE.all_assets }),
    );
  }),
  // Endpoints: claimable balances > all claimable balances
  rest.get(
    "https://horizon-testnet.stellar.org/claimable_balances",
    (_req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({ test: ENDPOINT_RESPONSE.all_claimable_balances }),
      );
    },
  ),
  // Endpoints: claimable balances > single claimable balance
  rest.get(
    "https://horizon-testnet.stellar.org/claimable_balances/:claimableBalanceId",
    (_req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({ test: ENDPOINT_RESPONSE.single_claimable_balance }),
      );
    },
  ),
  // Endpoints: effects > all effects
  rest.get("https://horizon-testnet.stellar.org/effects", (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ test: ENDPOINT_RESPONSE.all_effects }),
    );
  }),
  // Endpoints: effects > effects for account
  rest.get(
    // TODO: fix URL to have only one / at the end
    "https://horizon-testnet.stellar.org/accounts//effects",
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
    "https://horizon-testnet.stellar.org/ledgers//effects",
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
    "https://horizon-testnet.stellar.org/operations//effects",
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
    "https://horizon-testnet.stellar.org/transactions//effects",
    (_req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({ test: ENDPOINT_RESPONSE.effects_for_transaction }),
      );
    },
  ),
  // Endpoints: ledger > all ledgers
  rest.get("https://horizon-testnet.stellar.org/ledgers", (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ test: ENDPOINT_RESPONSE.all_ledgers }),
    );
  }),
  // Endpoints: ledger > single ledger
  rest.get(
    "https://horizon-testnet.stellar.org/ledgers/:ledger",
    (_req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({ test: ENDPOINT_RESPONSE.single_ledger }),
      );
    },
  ),
  // Endpoints: offers > all offers
  rest.get("https://horizon-testnet.stellar.org/offers", (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ test: ENDPOINT_RESPONSE.all_offers }),
    );
  }),
  // Endpoints: offers > single offer
  rest.get(
    "https://horizon-testnet.stellar.org/offers/:offerId",
    (_req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({ test: ENDPOINT_RESPONSE.single_offer }),
      );
    },
  ),
  // Endpoints: offers > offers for account
  rest.get(
    // TODO: fix URL to have only one / at the end
    "https://horizon-testnet.stellar.org/accounts//offers",
    (_req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({ test: ENDPOINT_RESPONSE.offers_for_account }),
      );
    },
  ),
  // Endpoints: operations > all operations
  rest.get(
    "https://horizon-testnet.stellar.org/operations",
    (_req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({ test: ENDPOINT_RESPONSE.all_operations }),
      );
    },
  ),
  // Endpoints: operations > single operation
  rest.get(
    "https://horizon-testnet.stellar.org/operations/:operation",
    (_req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({ test: ENDPOINT_RESPONSE.single_operation }),
      );
    },
  ),
  // Endpoints: operations > operations for account
  rest.get(
    // TODO: fix URL to have only one / at the end
    "https://horizon-testnet.stellar.org/accounts//operations",
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
    "https://horizon-testnet.stellar.org/ledgers//operations",
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
    "https://horizon-testnet.stellar.org/transactions//operations",
    (_req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({ test: ENDPOINT_RESPONSE.operations_for_transaction }),
      );
    },
  ),
  // Endpoints: order book > details
  rest.get(
    "https://horizon-testnet.stellar.org/order_book",
    (_req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({ test: ENDPOINT_RESPONSE.order_book_details }),
      );
    },
  ),
  // Endpoints: paths > find payment paths
  rest.get("https://horizon-testnet.stellar.org/paths", (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ test: ENDPOINT_RESPONSE.find_payment_paths }),
    );
  }),
  // Endpoints: paths > find strict receive payment paths
  rest.get(
    "https://horizon-testnet.stellar.org/paths/strict-receive",
    (_req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({ test: ENDPOINT_RESPONSE.find_strict_receive_payment_paths }),
      );
    },
  ),
  // Endpoints: paths > find strict send payment paths
  rest.get(
    "https://horizon-testnet.stellar.org/paths/strict-send",
    (_req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({ test: ENDPOINT_RESPONSE.find_strict_send_payment_paths }),
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
