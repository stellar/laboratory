/**
 * @jest-environment jsdom
 */

import { fireEvent, waitFor, screen } from "@testing-library/react";
import * as StellarSdk from "@stellar/stellar-sdk";
import { render } from "helpers/testHelpers";
import { TransactionSubmitter } from "views/TransactionSubmitter";
import * as extrapolateFromXdr from "helpers/extrapolateFromXdr";
import * as xdrViewerActions from "actions/xdrViewer";
import { FETCHED_SIGNERS } from "constants/fetched_signers";
import { SIGNATURE } from "constants/signature";
import {
  MOCK_SIGNED_TRANSACTION,
  MOCK_SIGNATURE_BUFFER,
} from "./__mocks__/transactions";

const MOCK_SERVER_RESPONSE_SUCCESS = {
  fee_meta_xdr: "fooMetaXdr",
  hash: "fooHash",
  ledger: 128015,
  operation_count: 1,
  paging_token: "549820238401536",
  result_meta_xdr: "fooResultMetaXdr",
  result_xdr: "fooXdr",
  successful: true,
};

jest.mock("@stellar/stellar-sdk", () => ({
  ...jest.requireActual("@stellar/stellar-sdk"),
  Server: jest.fn().mockImplementation(() => ({
    submitTransaction: () => new Promise((resolve) => resolve({})),
  })),
}));

/* extrapolatedFromXdr doesn't work in @react/testing-library (seemingly) because of the difference in the way the browser and node's
  engines handle Buffers.
  Until it can be refactored to work across engines, we manually mock an extrapolated `MOCK_SIGNED_TRANSACTION` that uses a Buffer for a signature
  instead of Uint8Array. */

const MOCK_EXTRAPOLATED_SIGNED_TRANSACTION = [
  {
    type: "TransactionEnvelope",
    value: "[envelopeTypeTx]",
    nodes: [
      {
        type: "v1",
        nodes: [
          {
            type: "tx",
            nodes: [
              {
                type: "sourceAccount",
                value: "[keyTypeEd25519]",
                nodes: [
                  {
                    type: "ed25519",
                    value: {
                      type: "code",
                      value:
                        "GCQ5VP5V7JP3SCLPZVNWINFWDEY4YDQ2UVI2BSNSGENLPKNTUMK42QUN",
                    },
                  },
                ],
              },
              { type: "fee", value: "100" },
              { type: "seqNum", value: "397456273571842" },
              {
                type: "timeBounds",
                nodes: [
                  { type: "minTime", value: "0" },
                  { type: "maxTime", value: "0" },
                ],
              },
              { type: "memo", value: "[memoNone]" },
              {
                type: "operations",
                value: "Array[1]",
                nodes: [
                  {
                    type: "[0]",
                    nodes: [
                      { type: "sourceAccount" },
                      {
                        type: "body",
                        value: "[setOptions]",
                        nodes: [
                          {
                            type: "setOptionsOp",
                            nodes: [
                              { type: "inflationDest" },
                              { type: "clearFlags" },
                              { type: "setFlags" },
                              { type: "masterWeight" },
                              { type: "lowThreshold" },
                              { type: "medThreshold" },
                              { type: "highThreshold" },
                              { type: "homeDomain" },
                              { type: "signer" },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              { type: "ext", value: "[undefined]" },
            ],
          },
          {
            type: "signatures",
            value: "Array[1]",
            nodes: [
              {
                type: "[0]",
                nodes: [
                  {
                    type: "hint",
                    value: {
                      type: "code",
                      value:
                        "G______________________________________________TUMK4____",
                    },
                  },
                  {
                    type: "signature",
                    value: {
                      type: "code",
                      raw: MOCK_SIGNATURE_BUFFER,
                      value:
                        "Lv3HnBG8qOLGguHXL2gb/jFJAgyemSlxnf4FeLHEhoff3VQ+1d23Vck4Zqt3Q0CpW88yLWm1/kKN+kAee/6nBg==",
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

test("renders TransactionSubmitter page", async () => {
  render(<TransactionSubmitter />);
  await waitFor(() => screen.getByTestId("page-transaction-submitter"));
  expect(screen.getByTestId("page-transaction-submitter")).toBeInTheDocument();
  expect(
    screen.getByTestId("transaction-submitter-submit-btn"),
  ).toHaveAttribute("disabled");
});

test("shows error on invalid xdr", () => {
  render(<TransactionSubmitter />);
  expect(screen.getByTestId("transaction-submitter-alert")).toHaveTextContent(
    "Enter a base-64 encoded XDR blob to decode.",
  );
  fireEvent.change(screen.getByTestId("transaction-submitter-input"), {
    target: { value: "foo" },
  });
  expect(screen.getByTestId("transaction-submitter-alert")).toHaveTextContent(
    "Unable to decode input as TransactionEnvelope",
  );
});

describe("valid signature path", () => {
  beforeEach(() => {
    jest
      .spyOn(extrapolateFromXdr, "default")
      .mockReturnValue(MOCK_EXTRAPOLATED_SIGNED_TRANSACTION);
    jest.spyOn(xdrViewerActions, "fetchSigners").mockImplementation(
      () => (dispatch) =>
        dispatch({
          type: FETCHED_SIGNERS.SUCCESS,
          result: [
            {
              isValid: SIGNATURE.VALID,
              sig: MOCK_SIGNATURE_BUFFER,
            },
          ],
        }),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("shows properly encoded XDR with valid signature", async () => {
    render(<TransactionSubmitter />);
    fireEvent.change(screen.getByTestId("transaction-submitter-input"), {
      target: {
        value: MOCK_SIGNED_TRANSACTION,
      },
    });
    await waitFor(() => screen.getByTestId("tree-view-signature"));
    expect(screen.getByTestId("tree-view-signature")).toHaveStyle(
      "color: green",
    );
    expect(
      screen.getByTestId("transaction-submitter-submit-btn"),
    ).not.toHaveAttribute("disabled");
  });

  test("submits properly encoded XDR with valid signature", async () => {
    // @ts-ignore
    StellarSdk.Server.mockImplementation(() => ({
      submitTransaction: () =>
        new Promise((resolve) => resolve(MOCK_SERVER_RESPONSE_SUCCESS)),
    }));

    render(<TransactionSubmitter />);
    fireEvent.change(screen.getByTestId("transaction-submitter-input"), {
      target: {
        value: MOCK_SIGNED_TRANSACTION,
      },
    });
    fireEvent.click(screen.getByTestId("transaction-submitter-submit-btn"));
    await waitFor(() =>
      screen.getByTestId("transaction-submitter-response-success"),
    );
    expect(
      screen.getByTestId("transaction-submitter-response-success"),
    ).toHaveTextContent("Transaction submitted!");
    expect(
      screen.getByTestId("transaction-submitter-response-status"),
    ).toHaveTextContent("Transaction succeeded with 1 operation(s).");
    expect(
      screen.getByTestId("transaction-submitter-response-hash"),
    ).toHaveTextContent(MOCK_SERVER_RESPONSE_SUCCESS.hash);
    expect(
      screen.getByTestId("transaction-submitter-response-ledger"),
    ).toHaveTextContent(MOCK_SERVER_RESPONSE_SUCCESS.ledger.toString());
    expect(
      screen.getByTestId("transaction-submitter-response-token"),
    ).toHaveTextContent(MOCK_SERVER_RESPONSE_SUCCESS.paging_token);
    expect(
      screen.getByTestId("transaction-submitter-response-result-xdr"),
    ).toHaveTextContent(MOCK_SERVER_RESPONSE_SUCCESS.result_xdr);
    expect(
      screen.getByTestId("transaction-submitter-response-result-meta-xdr"),
    ).toHaveTextContent(MOCK_SERVER_RESPONSE_SUCCESS.result_meta_xdr);
    expect(
      screen.getByTestId("transaction-submitter-response-fee-meta-xdr"),
    ).toHaveTextContent(MOCK_SERVER_RESPONSE_SUCCESS.fee_meta_xdr);
  });

  test("shows memo error on submit", async () => {
    // @ts-ignore
    StellarSdk.Server.mockImplementation(() => ({
      submitTransaction: () =>
        new Promise((_resolve, reject) =>
          reject(
            new StellarSdk.AccountRequiresMemoError("memoError", "account1", 2),
          ),
        ),
    }));

    render(<TransactionSubmitter />);
    fireEvent.change(screen.getByTestId("transaction-submitter-input"), {
      target: {
        value: MOCK_SIGNED_TRANSACTION,
      },
    });
    fireEvent.click(screen.getByTestId("transaction-submitter-submit-btn"));
    await waitFor(() =>
      screen.getByTestId("transaction-submitter-response-error"),
    );
    expect(
      screen.getByTestId("transaction-submitter-response-error"),
    ).toHaveTextContent("Transaction failed!");
    expect(
      screen.getByTestId("transaction-submitter-error-message"),
    ).toHaveTextContent("This destination requires a memo.");
    expect(
      screen.getByTestId("transaction-submitter-error-account-id"),
    ).toHaveTextContent("account1");
    expect(
      screen.getByTestId("transaction-submitter-error-op-index"),
    ).toHaveTextContent("2");
  });

  test("shows response error on submit", async () => {
    // @ts-ignore
    StellarSdk.Server.mockImplementation(() => ({
      submitTransaction: () =>
        new Promise((_resolve, reject) =>
          reject(
            new StellarSdk.BadResponseError("badResponseMsg", {
              data: {
                extras: { result_xdr: "foo", result_codes: { code: 500 } },
              },
            }),
          ),
        ),
    }));

    render(<TransactionSubmitter />);
    fireEvent.change(screen.getByTestId("transaction-submitter-input"), {
      target: {
        value: MOCK_SIGNED_TRANSACTION,
      },
    });
    fireEvent.click(screen.getByTestId("transaction-submitter-submit-btn"));
    await waitFor(() =>
      screen.getByTestId("transaction-submitter-response-error"),
    );
    expect(
      screen.getByTestId("transaction-submitter-response-error"),
    ).toHaveTextContent("Transaction failed!");
    expect(
      screen.getByTestId("transaction-submitter-error-message"),
    ).toHaveTextContent("badResponseMsg");
    expect(
      screen.getByTestId("transaction-submitter-error-code"),
    ).toHaveTextContent(`{"code":500}`);
    expect(
      screen.getByTestId("transaction-submitter-error-xdr"),
    ).toHaveTextContent("foo");
  });

  test("shows no response error on submit", async () => {
    // @ts-ignore
    StellarSdk.Server.mockImplementation(() => ({
      submitTransaction: () =>
        new Promise((_resolve, reject) => reject(new Error("noResponseMsg"))),
    }));

    render(<TransactionSubmitter />);
    fireEvent.change(screen.getByTestId("transaction-submitter-input"), {
      target: {
        value: MOCK_SIGNED_TRANSACTION,
      },
    });
    fireEvent.click(screen.getByTestId("transaction-submitter-submit-btn"));
    await waitFor(() =>
      screen.getByTestId("transaction-submitter-response-error"),
    );
    expect(
      screen.getByTestId("transaction-submitter-response-error"),
    ).toHaveTextContent("Transaction failed!");
    expect(
      screen.getByTestId("transaction-submitter-error-message"),
    ).toHaveTextContent("An unknown error occurred.");
    expect(
      screen.getByTestId("transaction-submitter-error-original"),
    ).toHaveTextContent("{}");
  });

  test("shows no response BadResponseError on submit", async () => {
    // @ts-ignore
    StellarSdk.Server.mockImplementation(() => ({
      submitTransaction: () =>
        new Promise((_resolve, reject) =>
          reject(new StellarSdk.BadResponseError("noResponseMsg", "")),
        ),
    }));

    render(<TransactionSubmitter />);
    fireEvent.change(screen.getByTestId("transaction-submitter-input"), {
      target: {
        value: MOCK_SIGNED_TRANSACTION,
      },
    });
    fireEvent.click(screen.getByTestId("transaction-submitter-submit-btn"));
    await waitFor(() =>
      screen.getByTestId("transaction-submitter-response-error"),
    );
    expect(
      screen.getByTestId("transaction-submitter-response-error"),
    ).toHaveTextContent("Transaction failed!");
    expect(
      screen.getByTestId("transaction-submitter-error-message"),
    ).toHaveTextContent("Received a bad response when submitting.");
    expect(
      screen.getByTestId("transaction-submitter-error-original"),
    ).toHaveTextContent(`"name": "BadResponseError"`);
  });
});

test("shows properly encoded XDR with invalid signature", async () => {
  const wrongSignature = Buffer.from([
    45, 253, 199, 156, 17, 188, 168, 226, 198, 130, 225, 215, 47, 104, 27, 254,
    49, 73, 2, 12, 158, 150, 41, 113, 157, 254, 5, 120, 177, 196, 134, 135, 223,
    221, 84, 62, 213, 221, 183, 85, 201, 56, 102, 171, 119, 67, 64, 169, 91,
    207, 50, 45, 105, 181, 254, 66, 141, 250, 64, 30, 123, 254, 167, 5,
  ]);
  // @ts-ignore
  MOCK_EXTRAPOLATED_SIGNED_TRANSACTION[0].nodes[0].nodes[1].nodes[0].nodes[1].value.raw =
    wrongSignature;
  jest
    .spyOn(extrapolateFromXdr, "default")
    .mockReturnValue(MOCK_EXTRAPOLATED_SIGNED_TRANSACTION);
  jest.spyOn(xdrViewerActions, "fetchSigners").mockImplementation(
    () => (dispatch) =>
      dispatch({
        type: FETCHED_SIGNERS.SUCCESS,
        result: [
          {
            isValid: SIGNATURE.INVALID,
            sig: wrongSignature,
          },
        ],
      }),
  );

  render(<TransactionSubmitter />);
  fireEvent.change(screen.getByTestId("transaction-submitter-input"), {
    target: {
      value: MOCK_SIGNED_TRANSACTION,
    },
  });
  await waitFor(() => screen.getByTestId("tree-view-signature"));
  expect(screen.getByTestId("tree-view-signature")).toHaveStyle("color: red");
  expect(
    screen.getByTestId("transaction-submitter-submit-btn"),
  ).not.toHaveAttribute("disabled");
});
