/**
 * @jest-environment jsdom
 */

import { fireEvent, waitFor, screen } from "@testing-library/react";
import { render } from "helpers/testHelpers";
import XdrViewer from "views/XdrViewer";

test("renders XDR Viewer page", async () => {
  render(<XdrViewer />);
  await waitFor(() => screen.getByTestId("page-xdr-viewer"));
  expect(screen.getByTestId("page-xdr-viewer")).toBeInTheDocument();
  expect(screen.getByTestId("xdr-viewer-results")).toHaveTextContent(
    "Enter a base-64 encoded XDR blob to decode.",
  );
});

test("shows error on bad input", () => {
  render(<XdrViewer />);
  fireEvent.change(screen.getByTestId("xdr-viewer-input"), {
    target: { value: "foo" },
  });
  expect(screen.getByTestId("xdr-viewer-results")).toHaveTextContent(
    "Unable to decode input as TransactionEnvelope",
  );
});
