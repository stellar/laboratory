/**
 * @jest-environment jsdom
 */
import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import StellarSdk from "stellar-sdk";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { render } from "helpers/testHelpers";
import AccountCreator from "views/AccountCreator";

const PUBLIC_KEY = "foo";
const SECRET_KEY = "bar";
const MUXED_ACCOUNT_ID = 1;
const MUXED_ACCOUNT_CREATED = "baz-1";
const MUXED_ACCOUNT_PARSED = "baz-2";

const server = setupServer(
  rest.get("https://friendbot.stellar.org/", (_req, res, ctx) => {
    return res(ctx.status(200));
  }),
  // fallback
  rest.get("*", (req, res, ctx) => {
    console.error(`No request handler for ${req.url.toString()}`);
    return res(
      ctx.status(500),
      ctx.json({ error: "Must add request handler" }),
    );
  }),
);

jest.mock("stellar-sdk");

StellarSdk.Keypair.random.mockReturnValue({
  publicKey: () => PUBLIC_KEY,
  secret: () => SECRET_KEY,
});

StellarSdk.MuxedAccount.mockImplementation(() => {
  return {
    accountId: jest.fn(() => MUXED_ACCOUNT_CREATED),
  };
});

StellarSdk.MuxedAccount.fromAddress.mockImplementation(() => {
  return {
    baseAccount: jest.fn(() => ({
      accountId: jest.fn(() => MUXED_ACCOUNT_PARSED),
    })),
    id: jest.fn(() => MUXED_ACCOUNT_ID),
  };
});

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

beforeEach(() => {
  render(<AccountCreator />);
});

test("renders create account page", async () => {
  await waitFor(() => screen.queryByTestId("page-account-creator"));
  expect(screen.getByTestId("page-account-creator")).toBeInTheDocument();
});

test("keypair generator: generates a keypair on testnet", async () => {
  fireEvent.click(screen.getByText(/generate keypair/i));
  await waitFor(() => screen.queryByTestId("publicKey"));

  expect(screen.getByTestId("publicKey")).toHaveTextContent(PUBLIC_KEY);
  expect(screen.getByTestId("secretKey")).toHaveTextContent(SECRET_KEY);
});

test("friendbot: prefill address when link is clicked", async () => {
  const friendbotLinkSelector =
    /fund this account on the test network using the friendbot tool below/i;

  fireEvent.click(screen.getByText(/generate keypair/i));
  await waitFor(() => {
    fireEvent.click(screen.getByText(friendbotLinkSelector));
  });

  expect(screen.getByTestId("friendbot-test-account")).toHaveValue(PUBLIC_KEY);
});

test("friendbot: account funded successfully", async () => {
  const friendbotLinkSelector =
    /fund this account on the test network using the friendbot tool below/i;

  fireEvent.click(screen.getByText(/generate keypair/i));
  await waitFor(() => {
    fireEvent.click(screen.getByText(friendbotLinkSelector));
  });

  await waitFor(() => {
    fireEvent.click(screen.getByText(/get test network lumens/i));
  });

  const friendbotContainer = screen.getByTestId("page-friendbot");

  await waitFor(() => {
    within(friendbotContainer).queryByText(/loading/i);
  });

  await waitFor(() => {
    within(friendbotContainer).queryByText(/successfully funded/i);
  });

  expect(
    within(friendbotContainer).getByText(/successfully funded/i),
  ).toBeInTheDocument();
});

test("muxed account: renders on the page", async () => {
  await waitFor(() => screen.getByTestId("page-muxed-account"));
  expect(screen.getByTestId("page-muxed-account")).toBeInTheDocument();
});

test("muxed account: creates m address", async () => {
  const baseAccountInput = screen.getByTestId("muxed-create-g-address");
  const muxedAccountIdInput = screen.getByTestId("muxed-create-m-id");
  const createButton = screen.getByTestId("muxed-create-button");

  fireEvent.change(baseAccountInput, { target: { value: PUBLIC_KEY } });
  fireEvent.change(muxedAccountIdInput, {
    target: { value: MUXED_ACCOUNT_ID },
  });
  fireEvent.click(createButton);

  await waitFor(() =>
    within(screen.getByTestId("page-muxed-account")).getByText(
      MUXED_ACCOUNT_CREATED,
    ),
  );

  expect(
    within(screen.getByTestId("page-muxed-account")).getByText(
      MUXED_ACCOUNT_CREATED,
    ),
  ).toBeInTheDocument();
});

test("muxed account: parses m address", async () => {
  const mAccountInput = screen.getByTestId("muxed-parse-m-address");
  const parseButton = screen.getByTestId("muxed-parse-button");

  fireEvent.change(mAccountInput, { target: { value: MUXED_ACCOUNT_CREATED } });
  fireEvent.click(parseButton);

  await waitFor(() =>
    within(screen.getByTestId("page-muxed-account")).getByText(
      MUXED_ACCOUNT_PARSED,
    ),
  );

  expect(
    within(screen.getByTestId("page-muxed-account")).getByText(
      MUXED_ACCOUNT_PARSED,
    ),
  ).toBeInTheDocument();
});
