/**
 * @jest-environment jsdom
 */
import { Networks, TransactionBuilder } from "stellar-sdk";
import { fireEvent, waitFor, screen } from "@testing-library/react";
import { render } from "helpers/testHelpers";
import { TransactionSigner } from "views/TransactionSigner";
import * as transactionSignerActions from "actions/transactionSigner";

jest.mock("@stellar/freighter-api", () => ({
  isConnected: () => new Promise((resolve) => resolve(true)),
  signTransaction: () => new Promise((resolve) => resolve(SIGNED_TRANSACTION)),
}));

jest.mock("@albedo-link/intent", () => ({
  tx: () =>
    new Promise((resolve) =>
      resolve({ signed_envelope_xdr: SIGNED_TRANSACTION }),
    ),
}));

const TRANSACTION_XDR =
  "AAAAAgAAAADYMr0vKfmdLXQTWwns9YavTU2ZCDzl7+L/dWEqn05dqQAAAGQAABjxAAAACwAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
const FEE_BUMP_XDR =
  "AAAABQAAAACafGsfMQylseeF9Du5owr05nhq/IDVl47HGz6PHGwWfwAAAAAAAADIAAAAAgAAAADYMr0vKfmdLXQTWwns9YavTU2ZCDzl7+L/dWEqn05dqQAAAGQAABjxAAAACwAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=";
const TRANSACTION = {
  network: Networks.TESTNET,
  hash: "00f6f2a06f339bcfca7a530d10edb014983c8e752fced4d4a0d8a274c5ddb416",
  source: "GDMDFPJPFH4Z2LLUCNNQT3HVQ2XU2TMZBA6OL37C752WCKU7JZO2S52R",
  sequence: "27423366184971",
};
const SECRET_KEY = "SB3NTRERB67ZPAFLLP3G6ZFUHYKFEQXX2D7RDWSRUZ5PSHRB7QJVASUU";
const SIGNED_TRANSACTION =
  "AAAAAgAAAADYMr0vKfmdLXQTWwns9YavTU2ZCDzl7+L/dWEqn05dqQAAAGQAABjxAAAACwAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABNWx3HwAAAEA9lwXxqMqkvo4obKnTR4K6lxycn7NoBQ2oFY1HT/nJJcQvxz6DgY3yHlxJRNIovwX1JoEBIX9B7tegdl+bJYoF";

test("renders TransactionSigner page", async () => {
  render(<TransactionSigner />);
  await waitFor(() => screen.getByTestId("page-transaction-signer"));
  expect(screen.getByTestId("page-transaction-signer")).toBeInTheDocument();
});

test("renders set options transaction from xdr in url param", async () => {
  render(<TransactionSigner />, {
    preloadedState: { transactionSigner: { xdr: TRANSACTION_XDR } },
  });
  await waitFor(() =>
    screen.getByTestId("transaction-signer-transaction-overview"),
  );
  expect(screen.getByTestId("transaction-signer-network")).toHaveTextContent(
    TRANSACTION.network,
  );
  expect(screen.getByTestId("transaction-signer-xdr")).toHaveTextContent(
    TRANSACTION_XDR,
  );
  expect(screen.getByTestId("transaction-signer-hash")).toHaveTextContent(
    TRANSACTION.hash,
  );
  expect(screen.getByTestId("transaction-signer-source")).toHaveTextContent(
    TRANSACTION.source,
  );
  expect(screen.getByTestId("transaction-signer-sequence")).toHaveTextContent(
    TRANSACTION.sequence,
  );
  expect(screen.getByTestId("transaction-signer-op-length")).toHaveTextContent(
    "1",
  );
  expect(screen.getByTestId("transaction-signer-sig-length")).toHaveTextContent(
    "0",
  );
  expect(
    screen.getByTestId("transaction-signer-signatures"),
  ).toBeInTheDocument();
});

test("renders fee bump transaction from  xdr in url param", async () => {
  render(<TransactionSigner />, {
    preloadedState: { transactionSigner: { xdr: FEE_BUMP_XDR } },
  });
  await waitFor(() =>
    screen.getByTestId("transaction-signer-transaction-overview"),
  );
  expect(screen.getByTestId("transaction-signer-network")).toHaveTextContent(
    TRANSACTION.network,
  );
  expect(screen.getByTestId("transaction-signer-xdr")).toHaveTextContent(
    TRANSACTION_XDR,
  );
  expect(screen.getByTestId("transaction-signer-inner-hash")).toHaveTextContent(
    TRANSACTION.hash,
  );
  expect(screen.getByTestId("transaction-signer-fee-source")).toHaveTextContent(
    "GCNHY2Y7GEGKLMPHQX2DXONDBL2OM6DK7SANLF4OY4NT5DY4NQLH7TGC",
  );
  expect(
    screen.getByTestId("transaction-signer-transaction-fee"),
  ).toHaveTextContent("200");
  expect(
    screen.getByTestId("transaction-signer-fee-sig-length"),
  ).toHaveTextContent("0");
  expect(screen.getByTestId("transaction-signer-inner-hash")).toHaveTextContent(
    "00f6f2a06f339bcfca7a530d10edb014983c8e752fced4d4a0d8a274c5ddb416",
  );
  expect(
    screen.getByTestId("transaction-signer-inner-source"),
  ).toHaveTextContent(TRANSACTION.source);
  expect(
    screen.getByTestId("transaction-signer-inner-sequence"),
  ).toHaveTextContent(TRANSACTION.sequence);
  expect(screen.getByTestId("transaction-signer-inner-fee")).toHaveTextContent(
    "100",
  );
  expect(
    screen.getByTestId("transaction-signer-inner-op-length"),
  ).toHaveTextContent("1");
  expect(
    screen.getByTestId("transaction-signer-inner-sig-length"),
  ).toHaveTextContent("0");
  expect(
    screen.getByTestId("transaction-signer-signatures"),
  ).toBeInTheDocument();
});

test("renders import textarea to load transaction", async () => {
  render(<TransactionSigner />);
  await waitFor(() => screen.getByTestId("transaction-importer-input"));
  expect(screen.getByTestId("transaction-importer-input")).toBeInTheDocument();
});

test("imports transaction from xdr string", async () => {
  render(<TransactionSigner />, {
    preloadedState: { transactionSigner: { signers: [""] } },
  });
  fireEvent.change(screen.getByTestId("transaction-importer-input"), {
    target: { value: TRANSACTION_XDR },
  });
  fireEvent.click(screen.getByTestId("transaction-importer-button"));
  await waitFor(() =>
    screen.getByTestId("transaction-signer-transaction-overview"),
  );
  expect(screen.getByTestId("transaction-signer-network")).toHaveTextContent(
    TRANSACTION.network,
  );
  expect(screen.getByTestId("transaction-signer-xdr")).toHaveTextContent(
    TRANSACTION_XDR,
  );
  expect(screen.getByTestId("transaction-signer-hash")).toHaveTextContent(
    TRANSACTION.hash,
  );
  expect(screen.getByTestId("transaction-signer-source")).toHaveTextContent(
    TRANSACTION.source,
  );
  expect(screen.getByTestId("transaction-signer-sequence")).toHaveTextContent(
    TRANSACTION.sequence,
  );
  expect(screen.getByTestId("transaction-signer-op-length")).toHaveTextContent(
    "1",
  );
  expect(screen.getByTestId("transaction-signer-sig-length")).toHaveTextContent(
    "0",
  );
  expect(
    screen.getByTestId("transaction-signer-signatures"),
  ).toBeInTheDocument();
});

test("adds manual signer to transaction", () => {
  render(<TransactionSigner />, {
    preloadedState: { transactionSigner: { xdr: TRANSACTION_XDR } },
  });
  expect(
    screen.queryByText("submit in transaction submitter"),
  ).not.toBeInTheDocument();
  fireEvent.change(screen.getByTestId("secret-key-picker"), {
    target: { value: SECRET_KEY },
  });
  expect(screen.getByTestId("transaction-signer-result")).toBeInTheDocument();
  expect(screen.getByTestId("transaction-signer-result")).toHaveTextContent(
    SIGNED_TRANSACTION,
  );
});

test("sign transaction with Ledger", () => {
  const signature = TransactionBuilder.fromXDR(
    SIGNED_TRANSACTION,
    Networks.TESTNET,
  ).signatures[0];

  jest.spyOn(transactionSignerActions, "signWithLedger").mockImplementation(
    () => (dispatch) =>
      dispatch({
        type: transactionSignerActions.LEDGER_WALLET_SIGN_SUCCESS,
        signature,
      }),
  );

  render(<TransactionSigner />, {
    preloadedState: { transactionSigner: { xdr: TRANSACTION_XDR } },
  });

  fireEvent.click(screen.getByTestId("transaction-signer-ledger-sign-button"));
  expect(screen.getByTestId("transaction-signer-result")).toBeInTheDocument();
  expect(screen.getByTestId("transaction-signer-result")).toHaveTextContent(
    SIGNED_TRANSACTION,
  );
});

test("sign transaction with Trezor", () => {
  const signature = TransactionBuilder.fromXDR(
    SIGNED_TRANSACTION,
    Networks.TESTNET,
  ).signatures[0];

  jest.spyOn(transactionSignerActions, "signWithTrezor").mockImplementation(
    () => (dispatch) =>
      dispatch({
        type: transactionSignerActions.TREZOR_WALLET_SIGN_SUCCESS,
        signature,
      }),
  );

  render(<TransactionSigner />, {
    preloadedState: { transactionSigner: { xdr: TRANSACTION_XDR } },
  });

  fireEvent.click(screen.getByTestId("transaction-signer-trezor-sign-button"));
  expect(screen.getByTestId("transaction-signer-result")).toBeInTheDocument();
  expect(screen.getByTestId("transaction-signer-result")).toHaveTextContent(
    SIGNED_TRANSACTION,
  );
});

test("sign transaction with Freighter", async () => {
  render(<TransactionSigner />, {
    preloadedState: { transactionSigner: { xdr: TRANSACTION_XDR } },
  });

  fireEvent.click(
    screen.getByTestId("transaction-signer-freighter-sign-button"),
  );
  await waitFor(() => screen.getByTestId("transaction-signer-result"));
  expect(screen.getByTestId("transaction-signer-result")).toHaveTextContent(
    SIGNED_TRANSACTION,
  );
});

test("sign transaction with Albedo", async () => {
  render(<TransactionSigner />, {
    preloadedState: { transactionSigner: { xdr: TRANSACTION_XDR } },
  });

  fireEvent.click(
    screen.getByTestId("transaction-signer-freighter-sign-button"),
  );
  await waitFor(() => screen.getByTestId("transaction-signer-result"));
  expect(screen.getByTestId("transaction-signer-result")).toHaveTextContent(
    SIGNED_TRANSACTION,
  );
});
