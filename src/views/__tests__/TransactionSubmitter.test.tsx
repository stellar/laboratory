/**
 * @jest-environment jsdom
 */

import { fireEvent, waitFor, screen } from "@testing-library/react";
import { render } from "helpers/testHelpers";
import TransactionSubmitter from "views/TransactionSubmitter";
import { defaultNetwork } from "reducers/network";
// import * as xdrViewerActions from "actions/xdrViewer";
// import FETCHED_SIGNERS from "constants/fetched_signers";
// import { MOCK_SIGNED_TRANSACTION } from "./__mocks__/transactions";

// jest.spyOn(xdrViewerActions, "fetchSigners").mockImplementation(
//   () => (dispatch) =>
//     dispatch({
//       type: FETCHED_SIGNERS.SUCCESS,
//       result: signature,
//     }),
// );

test("renders TransactionSubmitter page", async () => {
  render(<TransactionSubmitter />, {
    preloadedState: { network: { current: defaultNetwork } },
  });
  await waitFor(() => screen.getByTestId("page-transaction-submitter"));
  expect(screen.getByTestId("page-transaction-submitter")).toBeInTheDocument();
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

test("shows error on invalid xdr", () => {
  render(<TransactionSubmitter />);
  fireEvent.change(screen.getByTestId("transaction-submitter-input"), {
    target: { value: "foo" },
  });
  expect(screen.getByTestId("transaction-submitter-alert")).toHaveTextContent(
    "Unable to decode input as TransactionEnvelope",
  );
});
