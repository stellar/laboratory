/**
 * @jest-environment jsdom
 */

import { fireEvent, waitFor, screen } from "@testing-library/react";
import { render } from "helpers/testHelpers";
import { XdrViewer } from "views/XdrViewer";
import * as extrapolateFromXdr from "helpers/extrapolateFromXdr";
import * as xdrViewerActions from "actions/xdrViewer";
import { FETCHED_SIGNERS } from "constants/fetched_signers";
import { SIGNATURE } from "constants/signature";
import {
  MOCK_SIGNED_TRANSACTION,
  MOCK_SIGNATURE_BUFFER,
} from "./__mocks__/transactions";

const testNetwork = {
  name: "foo",
  horizonURL: "https://foo.baz",
  networkPassphrase: "bar",
};

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
  const extrapolateFromXdrSpy = jest.spyOn(extrapolateFromXdr, "default");
  const fetchSignersSpy = jest.spyOn(xdrViewerActions, "fetchSigners");
  render(<XdrViewer />, {
    preloadedState: { network: { current: testNetwork } },
  });
  await waitFor(() => screen.getByTestId("page-xdr-viewer"));
  fireEvent.change(screen.getByTestId("xdr-viewer-input"), {
    target: { value: MOCK_SIGNED_TRANSACTION },
  });
  expect(extrapolateFromXdrSpy).toHaveBeenCalledWith(
    MOCK_SIGNED_TRANSACTION,
    "TransactionEnvelope",
  );
  expect(fetchSignersSpy).toHaveBeenCalledWith(
    MOCK_SIGNED_TRANSACTION,
    testNetwork.horizonURL,
    testNetwork.networkPassphrase,
  );
});
