/**
 * @jest-environment jsdom
 */

import { fireEvent, waitFor, screen } from "@testing-library/react";
import { render } from "helpers/testHelpers";
import TransactionSubmitter from "views/TransactionSubmitter";
// import { MOCK_SIGNED_TRANSACTION } from "./__mocks__/transactions";

test("renders TransactionSubmitter page", async () => {
  render(<TransactionSubmitter />);
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

// test("shows error on invalid xdr", () => {
//   render(<TransactionSubmitter />);
//   fireEvent.change(screen.getByTestId("transaction-submitter-input"), {
//     target: { value: "foo" },
//   });
//   expect(screen.getByTestId("transaction-submitter-alert")).toHaveTextContent(
//     "Unable to decode input as TransactionEnvelope",
//   );
// });
