/**
 * @jest-environment jsdom
 */
import { fireEvent, screen, waitFor, within } from "@testing-library/react";

import { render, ENDPOINT_RESPONSE } from "helpers/testHelpers";
import EndpointExplorer from "views/EndpointExplorer";

let resourceContainer: HTMLElement;

const TEST_ID_ENDPOINT = "endpoint-explorer-endpoint";
const TEST_ID_INPUTS = "page-endpoint-inputs";
const TEST_ID_RESULT_LOADING = "page-endpoint-result-loading";
const TEST_ID_RESULT_RESPONSE = "page-endpoint-result-response";

beforeEach(async () => {
  render(<EndpointExplorer />);

  await waitFor(() => screen.queryByTestId("endpoint-explorer-resource"));
  resourceContainer = screen.getByTestId("endpoint-explorer-resource");
});

test("renders endpoint explorer page", async () => {
  await waitFor(() =>
    expect(screen.getByTestId("page-endpoint-explorer")).toBeInTheDocument(),
  );
});

test("renders all resource links", () => {
  expect(resourceContainer).toBeInTheDocument();
  expect(within(resourceContainer).getAllByRole("link")).toHaveLength(13);
});

describe("accounts", () => {
  const RESOURCE_LINK_LABEL = "accounts";
  const SUBMIT_LABEL = "submit";
  let accountsEndpointsContainer: HTMLElement;
  let accountsEndpointInputs: HTMLElement;
  let accountsEndpointSubmitButton: HTMLElement;
  let accountsEndpointResponse: HTMLElement;

  // select resource
  beforeEach(async () => {
    fireEvent.click(
      within(resourceContainer).getByText(RegExp(RESOURCE_LINK_LABEL, "i")),
    );
    await waitFor(() => {
      accountsEndpointsContainer = screen.getByTestId(TEST_ID_ENDPOINT);
    });
  });

  // resource endpoint links
  test("renders all endpoint links", () => {
    expect(
      within(accountsEndpointsContainer).getAllByRole("link"),
    ).toHaveLength(2);
  });

  // render resource input form with submit + submit response
  test("resource: accounts submit with response", async () => {
    const accountsButton = within(accountsEndpointsContainer).getByText(
      /accounts/i,
    );
    expect(accountsButton).toBeInTheDocument();
    fireEvent.click(accountsButton);

    await waitFor(() => {
      accountsEndpointInputs = screen.getByTestId(TEST_ID_INPUTS);
    });
    expect(accountsEndpointInputs).toBeInTheDocument();

    await waitFor(() => {
      accountsEndpointSubmitButton = within(accountsEndpointInputs).getByText(
        RegExp(SUBMIT_LABEL, "i"),
      );
    });
    expect(accountsEndpointSubmitButton).toBeInTheDocument();

    fireEvent.click(accountsEndpointSubmitButton);

    await waitFor(() =>
      expect(screen.getByTestId(TEST_ID_RESULT_LOADING)).toBeInTheDocument(),
    );

    await waitFor(() => {
      accountsEndpointResponse = screen.getByTestId(TEST_ID_RESULT_RESPONSE);
    });

    expect(accountsEndpointResponse).toBeInTheDocument();
    expect(
      within(accountsEndpointResponse).getByText(
        RegExp(ENDPOINT_RESPONSE.accounts, "i"),
      ),
    ).toBeInTheDocument();
  });

  test("resource: single account submit with response", async () => {
    const accountsButton = within(accountsEndpointsContainer).getByText(
      /single account/i,
    );
    expect(accountsButton).toBeInTheDocument();
    fireEvent.click(accountsButton);

    await waitFor(() => {
      accountsEndpointInputs = screen.getByTestId(TEST_ID_INPUTS);
    });
    expect(accountsEndpointInputs).toBeInTheDocument();

    await waitFor(() => {
      accountsEndpointSubmitButton = within(accountsEndpointInputs).getByText(
        RegExp(SUBMIT_LABEL, "i"),
      );
    });
    expect(accountsEndpointSubmitButton).toBeInTheDocument();

    fireEvent.click(accountsEndpointSubmitButton);

    await waitFor(() =>
      expect(screen.getByTestId(TEST_ID_RESULT_LOADING)).toBeInTheDocument(),
    );

    await waitFor(() => {
      accountsEndpointResponse = screen.getByTestId(TEST_ID_RESULT_RESPONSE);
    });

    expect(accountsEndpointResponse).toBeInTheDocument();
    expect(
      within(accountsEndpointResponse).getByText(
        RegExp(ENDPOINT_RESPONSE.account_single, "i"),
      ),
    ).toBeInTheDocument();
  });
});
