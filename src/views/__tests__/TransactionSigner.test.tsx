/**
 * @jest-environment jsdom
 */
import { Networks, TransactionBuilder } from "@stellar/stellar-sdk";
import { fireEvent, waitFor, screen } from "@testing-library/react";
import { render } from "helpers/testHelpers";
import { TransactionSigner } from "views/TransactionSigner";
import * as transactionSignerActions from "actions/transactionSigner";
import { MOCK_SIGNED_TRANSACTION } from "./__mocks__/transactions";

jest.mock("@stellar/freighter-api", () => ({
  isConnected: () => new Promise((resolve) => resolve(true)),
  signTransaction: () =>
    new Promise((resolve) => resolve(MOCK_SIGNED_TRANSACTION)),
}));

jest.mock("@albedo-link/intent", () => ({
  tx: () =>
    new Promise((resolve) =>
      resolve({ signed_envelope_xdr: MOCK_SIGNED_TRANSACTION }),
    ),
}));

const SOURCE_KEYPAIR = {
  publicKey: "GCQ5VP5V7JP3SCLPZVNWINFWDEY4YDQ2UVI2BSNSGENLPKNTUMK42QUN",
  secretKey: "SDBJANOEQHXOC2LWPP2CVYUJK4VR7MXS2ONKKSHHADOCEBAPOGTT4WHP",
};
const SIGNER_KEYPAIR = {
  publicKey: "GDR34X73SODUQJYO4E7IFWPRGGVQMLJFEWISAAIMEEX3LOGBFCDO735C",
  secretKey: "SA6QM7HQFTQGI5FRQJVP2Q2URI4W2SIEWPUY2XFDAV4BQD3L5JWJJRQN",
};
const TRANSACTION_XDR =
  "AAAAAgAAAACh2r+1+l+5CW/NW2Q0thkxzA4apVGgybIxGreps6MVzQAAAGQAAWl8AAAAAgAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
const FEE_BUMP_XDR =
  "AAAABQAAAADjvl/7k4dIJw7hPoLZ8TGrBi0lJZEgAQwhL7W4wSiG7wAAAAAAAADIAAAAAgAAAACh2r+1+l+5CW/NW2Q0thkxzA4apVGgybIxGreps6MVzQAAAGQAAWl8AAAAAgAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=";
const TRANSACTION = {
  network: Networks.TESTNET,
  hash: "41720fd1171ffd0a14c5fd9d62e6b47105f9dcda180d5c91065d45fc79bdf670",
  source: SOURCE_KEYPAIR.publicKey,
  sequence: "397456273571842",
};

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
    SIGNER_KEYPAIR.publicKey,
  );
  expect(
    screen.getByTestId("transaction-signer-transaction-fee"),
  ).toHaveTextContent("200");
  expect(
    screen.getByTestId("transaction-signer-fee-sig-length"),
  ).toHaveTextContent("0");
  expect(screen.getByTestId("transaction-signer-inner-hash")).toHaveTextContent(
    TRANSACTION.hash,
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
    target: { value: SOURCE_KEYPAIR.secretKey },
  });
  expect(screen.getByTestId("transaction-signer-result")).toBeInTheDocument();
  expect(screen.getByTestId("transaction-signer-result")).toHaveTextContent(
    MOCK_SIGNED_TRANSACTION,
  );
});

test("sign transaction with Ledger", () => {
  const signature = TransactionBuilder.fromXDR(
    MOCK_SIGNED_TRANSACTION,
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
    MOCK_SIGNED_TRANSACTION,
  );
});

test("sign transaction with Trezor", () => {
  const signature = TransactionBuilder.fromXDR(
    MOCK_SIGNED_TRANSACTION,
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
    MOCK_SIGNED_TRANSACTION,
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
    MOCK_SIGNED_TRANSACTION,
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
    MOCK_SIGNED_TRANSACTION,
  );
});
