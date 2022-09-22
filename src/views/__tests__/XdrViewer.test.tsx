/**
 * @jest-environment jsdom
 */

import { fireEvent, waitFor, screen } from "@testing-library/react";
import { render } from "helpers/testHelpers";
import { XdrViewer } from "views/XdrViewer";
import * as extrapolateFromXdr from "helpers/extrapolateFromXdr";
import { MOCK_SIGNED_TRANSACTION } from "./__mocks__/transactions";

test("renders XDR Viewer page", async () => {
  render(<XdrViewer />);
  await waitFor(() => screen.getByTestId("page-xdr-viewer"));
  expect(screen.getByTestId("page-xdr-viewer")).toBeInTheDocument();
  expect(screen.getByTestId("xdr-viewer-results")).toHaveTextContent(
    "Enter a base-64 encoded XDR blob to decode.",
  );
});

test("shows error on bad input", async () => {
  render(<XdrViewer />);
  await waitFor(() => screen.getByTestId("page-xdr-viewer"));
  fireEvent.change(screen.getByTestId("xdr-viewer-input"), {
    target: { value: "foo" },
  });
  expect(screen.getByTestId("xdr-viewer-results")).toHaveTextContent(
    "Unable to decode input as TransactionEnvelope",
  );
});

test("extrapolate XDR on input change", async () => {
  const extrapolateFromXdrSpy = jest.spyOn(extrapolateFromXdr, "default");
  render(<XdrViewer />);
  await waitFor(() => screen.getByTestId("page-xdr-viewer"));
  fireEvent.change(screen.getByTestId("xdr-viewer-input"), {
    target: { value: MOCK_SIGNED_TRANSACTION },
  });
  expect(extrapolateFromXdrSpy).toHaveBeenCalledWith(
    MOCK_SIGNED_TRANSACTION,
    "TransactionEnvelope",
  );
});
