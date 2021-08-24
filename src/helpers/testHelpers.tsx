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
  assets_all = "all assets mock response",
  all_claimable_balances = "all claimable balances mock response",
  single_claimable_balance = "single claimable balance mock response",
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
      ctx.json({ test: ENDPOINT_RESPONSE.assets_all }),
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
