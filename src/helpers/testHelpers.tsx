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
  account_single = "single account mock response",
}

const server = setupServer(
  // Friendbot
  rest.get("https://friendbot.stellar.org", (_req, res, ctx) => {
    return res(ctx.status(200));
  }),
  // Endpoints: accounts > accounts
  rest.get(
    "https://horizon-testnet.stellar.org/accounts/",
    (_req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({ test: ENDPOINT_RESPONSE.accounts }),
      );
    },
  ),
  // Endpoints: accounts > single account
  rest.get(
    "https://horizon-testnet.stellar.org/accounts/:accountId",
    (_req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({ test: ENDPOINT_RESPONSE.account_single }),
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
