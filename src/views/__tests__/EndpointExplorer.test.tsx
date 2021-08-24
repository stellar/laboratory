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
    const singleAccountButton = within(accountsEndpointsContainer).getByText(
      /single account/i,
    );

    expect(singleAccountButton).toBeInTheDocument();
    fireEvent.click(singleAccountButton);

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
        RegExp(ENDPOINT_RESPONSE.single_account, "i"),
      ),
    ).toBeInTheDocument();
  });
});

describe("assets", () => {
  const RESOURCE_LINK_LABEL = "assets";
  const SUBMIT_LABEL = "submit";
  let assetsEndpointsContainer: HTMLElement;
  let assetsEndpointInputs: HTMLElement;
  let assetsEndpointSubmitButton: HTMLElement;
  let assetsEndpointResponse: HTMLElement;

  // select resource
  beforeEach(async () => {
    fireEvent.click(
      within(resourceContainer).getByText(RegExp(RESOURCE_LINK_LABEL, "i")),
    );
    await waitFor(() => {
      assetsEndpointsContainer = screen.getByTestId(TEST_ID_ENDPOINT);
    });
  });

  // resource endpoint links
  test("renders all endpoint links", () => {
    expect(within(assetsEndpointsContainer).getAllByRole("link")).toHaveLength(
      1,
    );
  });

  // render resource input form with submit + submit response
  test("resource: all assets submit with response", async () => {
    const allAssetsButton = within(assetsEndpointsContainer).getByText(
      /all assets/i,
    );

    expect(allAssetsButton).toBeInTheDocument();
    fireEvent.click(allAssetsButton);

    await waitFor(() => {
      assetsEndpointInputs = screen.getByTestId(TEST_ID_INPUTS);
    });
    expect(assetsEndpointInputs).toBeInTheDocument();

    await waitFor(() => {
      assetsEndpointSubmitButton = within(assetsEndpointInputs).getByText(
        RegExp(SUBMIT_LABEL, "i"),
      );
    });
    expect(assetsEndpointSubmitButton).toBeInTheDocument();

    fireEvent.click(assetsEndpointSubmitButton);

    await waitFor(() =>
      expect(screen.getByTestId(TEST_ID_RESULT_LOADING)).toBeInTheDocument(),
    );

    await waitFor(() => {
      assetsEndpointResponse = screen.getByTestId(TEST_ID_RESULT_RESPONSE);
    });

    expect(assetsEndpointResponse).toBeInTheDocument();
    expect(
      within(assetsEndpointResponse).getByText(
        RegExp(ENDPOINT_RESPONSE.assets_all, "i"),
      ),
    ).toBeInTheDocument();
  });
});

describe("claimable balances", () => {
  const RESOURCE_LINK_LABEL = "claimable balances";
  const SUBMIT_LABEL = "submit";
  let claimableBalancessContainer: HTMLElement;
  let claimableBalancesInputs: HTMLElement;
  let claimableBalancesSubmitButton: HTMLElement;
  let claimableBalancesResponse: HTMLElement;

  // select resource
  beforeEach(async () => {
    fireEvent.click(
      within(resourceContainer).getByText(RegExp(RESOURCE_LINK_LABEL, "i")),
    );
    await waitFor(() => {
      claimableBalancessContainer = screen.getByTestId(TEST_ID_ENDPOINT);
    });
  });

  // resource endpoint links
  test("renders all endpoint links", () => {
    expect(
      within(claimableBalancessContainer).getAllByRole("link"),
    ).toHaveLength(2);
  });

  // render resource input form with submit + submit response
  test("resource: all claimable balances submit with response", async () => {
    const allClaimableBalancesButton = within(
      claimableBalancessContainer,
    ).getByText(/all claimable balances/i);

    expect(allClaimableBalancesButton).toBeInTheDocument();
    fireEvent.click(allClaimableBalancesButton);

    await waitFor(() => {
      claimableBalancesInputs = screen.getByTestId(TEST_ID_INPUTS);
    });
    expect(claimableBalancesInputs).toBeInTheDocument();

    await waitFor(() => {
      claimableBalancesSubmitButton = within(claimableBalancesInputs).getByText(
        RegExp(SUBMIT_LABEL, "i"),
      );
    });
    expect(claimableBalancesSubmitButton).toBeInTheDocument();

    fireEvent.click(claimableBalancesSubmitButton);

    await waitFor(() =>
      expect(screen.getByTestId(TEST_ID_RESULT_LOADING)).toBeInTheDocument(),
    );

    await waitFor(() => {
      claimableBalancesResponse = screen.getByTestId(TEST_ID_RESULT_RESPONSE);
    });

    expect(claimableBalancesResponse).toBeInTheDocument();
    expect(
      within(claimableBalancesResponse).getByText(
        RegExp(ENDPOINT_RESPONSE.all_claimable_balances, "i"),
      ),
    ).toBeInTheDocument();
  });

  test("resource: single claimable balance submit with response", async () => {
    const singleClaimableBalanceButton = within(
      claimableBalancessContainer,
    ).getByText(/single claimable balance/i);

    expect(singleClaimableBalanceButton).toBeInTheDocument();
    fireEvent.click(singleClaimableBalanceButton);

    await waitFor(() => {
      claimableBalancesInputs = screen.getByTestId(TEST_ID_INPUTS);
    });
    expect(claimableBalancesInputs).toBeInTheDocument();

    await waitFor(() => {
      claimableBalancesSubmitButton = within(claimableBalancesInputs).getByText(
        RegExp(SUBMIT_LABEL, "i"),
      );
    });
    expect(claimableBalancesSubmitButton).toBeInTheDocument();

    fireEvent.click(claimableBalancesSubmitButton);

    await waitFor(() =>
      expect(screen.getByTestId(TEST_ID_RESULT_LOADING)).toBeInTheDocument(),
    );

    await waitFor(() => {
      claimableBalancesResponse = screen.getByTestId(TEST_ID_RESULT_RESPONSE);
    });

    expect(claimableBalancesResponse).toBeInTheDocument();
    expect(
      within(claimableBalancesResponse).getByText(
        RegExp(ENDPOINT_RESPONSE.single_claimable_balance, "i"),
      ),
    ).toBeInTheDocument();
  });
});
