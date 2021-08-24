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
        RegExp(ENDPOINT_RESPONSE.all_assets, "i"),
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

describe("effects", () => {
  const RESOURCE_LINK_LABEL = "effects";
  const SUBMIT_LABEL = "submit";
  let effectsEndpointsContainer: HTMLElement;
  let effectsEndpointInputs: HTMLElement;
  let effectsEndpointSubmitButton: HTMLElement;
  let effectsEndpointResponse: HTMLElement;

  // select resource
  beforeEach(async () => {
    fireEvent.click(
      within(resourceContainer).getByText(RegExp(RESOURCE_LINK_LABEL, "i")),
    );
    await waitFor(() => {
      effectsEndpointsContainer = screen.getByTestId(TEST_ID_ENDPOINT);
    });
  });

  // resource endpoint links
  test("renders all endpoint links", () => {
    expect(within(effectsEndpointsContainer).getAllByRole("link")).toHaveLength(
      5,
    );
  });

  // render resource input form with submit + submit response
  test("resource: all effects submit with response", async () => {
    const allEffectsButton = within(effectsEndpointsContainer).getByText(
      /all effects/i,
    );

    expect(allEffectsButton).toBeInTheDocument();
    fireEvent.click(allEffectsButton);

    await waitFor(() => {
      effectsEndpointInputs = screen.getByTestId(TEST_ID_INPUTS);
    });
    expect(effectsEndpointInputs).toBeInTheDocument();

    await waitFor(() => {
      effectsEndpointSubmitButton = within(effectsEndpointInputs).getByText(
        RegExp(SUBMIT_LABEL, "i"),
      );
    });
    expect(effectsEndpointSubmitButton).toBeInTheDocument();

    fireEvent.click(effectsEndpointSubmitButton);

    await waitFor(() =>
      expect(screen.getByTestId(TEST_ID_RESULT_LOADING)).toBeInTheDocument(),
    );

    await waitFor(() => {
      effectsEndpointResponse = screen.getByTestId(TEST_ID_RESULT_RESPONSE);
    });

    expect(effectsEndpointResponse).toBeInTheDocument();
    expect(
      within(effectsEndpointResponse).getByText(
        RegExp(ENDPOINT_RESPONSE.all_effects, "i"),
      ),
    ).toBeInTheDocument();
  });

  test("resource: effects for account submit with response", async () => {
    const effectsForAccountButton = within(effectsEndpointsContainer).getByText(
      /effects for account/i,
    );

    expect(effectsForAccountButton).toBeInTheDocument();
    fireEvent.click(effectsForAccountButton);

    await waitFor(() => {
      effectsEndpointInputs = screen.getByTestId(TEST_ID_INPUTS);
    });
    expect(effectsEndpointInputs).toBeInTheDocument();

    await waitFor(() => {
      effectsEndpointSubmitButton = within(effectsEndpointInputs).getByText(
        RegExp(SUBMIT_LABEL, "i"),
      );
    });
    expect(effectsEndpointSubmitButton).toBeInTheDocument();

    fireEvent.click(effectsEndpointSubmitButton);

    await waitFor(() =>
      expect(screen.getByTestId(TEST_ID_RESULT_LOADING)).toBeInTheDocument(),
    );

    await waitFor(() => {
      effectsEndpointResponse = screen.getByTestId(TEST_ID_RESULT_RESPONSE);
    });

    expect(effectsEndpointResponse).toBeInTheDocument();
    expect(
      within(effectsEndpointResponse).getByText(
        RegExp(ENDPOINT_RESPONSE.effects_for_account, "i"),
      ),
    ).toBeInTheDocument();
  });

  test("resource: effects for ledger submit with response", async () => {
    const effectsForLedgerButton = within(effectsEndpointsContainer).getByText(
      /effects for ledger/i,
    );

    expect(effectsForLedgerButton).toBeInTheDocument();
    fireEvent.click(effectsForLedgerButton);

    await waitFor(() => {
      effectsEndpointInputs = screen.getByTestId(TEST_ID_INPUTS);
    });
    expect(effectsEndpointInputs).toBeInTheDocument();

    await waitFor(() => {
      effectsEndpointSubmitButton = within(effectsEndpointInputs).getByText(
        RegExp(SUBMIT_LABEL, "i"),
      );
    });
    expect(effectsEndpointSubmitButton).toBeInTheDocument();

    fireEvent.click(effectsEndpointSubmitButton);

    await waitFor(() =>
      expect(screen.getByTestId(TEST_ID_RESULT_LOADING)).toBeInTheDocument(),
    );

    await waitFor(() => {
      effectsEndpointResponse = screen.getByTestId(TEST_ID_RESULT_RESPONSE);
    });

    expect(effectsEndpointResponse).toBeInTheDocument();
    expect(
      within(effectsEndpointResponse).getByText(
        RegExp(ENDPOINT_RESPONSE.effects_for_ledger, "i"),
      ),
    ).toBeInTheDocument();
  });

  test("resource: effects for operation submit with response", async () => {
    const effectsForOperationButton = within(
      effectsEndpointsContainer,
    ).getByText(/effects for operation/i);

    expect(effectsForOperationButton).toBeInTheDocument();
    fireEvent.click(effectsForOperationButton);

    await waitFor(() => {
      effectsEndpointInputs = screen.getByTestId(TEST_ID_INPUTS);
    });
    expect(effectsEndpointInputs).toBeInTheDocument();

    await waitFor(() => {
      effectsEndpointSubmitButton = within(effectsEndpointInputs).getByText(
        RegExp(SUBMIT_LABEL, "i"),
      );
    });
    expect(effectsEndpointSubmitButton).toBeInTheDocument();

    fireEvent.click(effectsEndpointSubmitButton);

    await waitFor(() =>
      expect(screen.getByTestId(TEST_ID_RESULT_LOADING)).toBeInTheDocument(),
    );

    await waitFor(() => {
      effectsEndpointResponse = screen.getByTestId(TEST_ID_RESULT_RESPONSE);
    });

    expect(effectsEndpointResponse).toBeInTheDocument();
    expect(
      within(effectsEndpointResponse).getByText(
        RegExp(ENDPOINT_RESPONSE.effects_for_operation, "i"),
      ),
    ).toBeInTheDocument();
  });

  test("resource: effects for transaction submit with response", async () => {
    const effectsForTransactionButton = within(
      effectsEndpointsContainer,
    ).getByText(/effects for transaction/i);

    expect(effectsForTransactionButton).toBeInTheDocument();
    fireEvent.click(effectsForTransactionButton);

    await waitFor(() => {
      effectsEndpointInputs = screen.getByTestId(TEST_ID_INPUTS);
    });
    expect(effectsEndpointInputs).toBeInTheDocument();

    await waitFor(() => {
      effectsEndpointSubmitButton = within(effectsEndpointInputs).getByText(
        RegExp(SUBMIT_LABEL, "i"),
      );
    });
    expect(effectsEndpointSubmitButton).toBeInTheDocument();

    fireEvent.click(effectsEndpointSubmitButton);

    await waitFor(() =>
      expect(screen.getByTestId(TEST_ID_RESULT_LOADING)).toBeInTheDocument(),
    );

    await waitFor(() => {
      effectsEndpointResponse = screen.getByTestId(TEST_ID_RESULT_RESPONSE);
    });

    expect(effectsEndpointResponse).toBeInTheDocument();
    expect(
      within(effectsEndpointResponse).getByText(
        RegExp(ENDPOINT_RESPONSE.effects_for_transaction, "i"),
      ),
    ).toBeInTheDocument();
  });
});

describe("ledger", () => {
  const RESOURCE_LINK_LABEL = "ledger";
  const SUBMIT_LABEL = "submit";
  let ledgerEndpointsContainer: HTMLElement;
  let ledgerEndpointInputs: HTMLElement;
  let ledgerEndpointSubmitButton: HTMLElement;
  let ledgerEndpointResponse: HTMLElement;

  // select resource
  beforeEach(async () => {
    fireEvent.click(
      within(resourceContainer).getByText(RegExp(RESOURCE_LINK_LABEL, "i")),
    );
    await waitFor(() => {
      ledgerEndpointsContainer = screen.getByTestId(TEST_ID_ENDPOINT);
    });
  });

  // resource endpoint links
  test("renders all endpoint links", () => {
    expect(within(ledgerEndpointsContainer).getAllByRole("link")).toHaveLength(
      2,
    );
  });

  // render resource input form with submit + submit response
  test("resource: all ledgers submit with response", async () => {
    const allLedgersButton = within(ledgerEndpointsContainer).getByText(
      /all ledgers/i,
    );

    expect(allLedgersButton).toBeInTheDocument();
    fireEvent.click(allLedgersButton);

    await waitFor(() => {
      ledgerEndpointInputs = screen.getByTestId(TEST_ID_INPUTS);
    });
    expect(ledgerEndpointInputs).toBeInTheDocument();

    await waitFor(() => {
      ledgerEndpointSubmitButton = within(ledgerEndpointInputs).getByText(
        RegExp(SUBMIT_LABEL, "i"),
      );
    });
    expect(ledgerEndpointSubmitButton).toBeInTheDocument();

    fireEvent.click(ledgerEndpointSubmitButton);

    await waitFor(() =>
      expect(screen.getByTestId(TEST_ID_RESULT_LOADING)).toBeInTheDocument(),
    );

    await waitFor(() => {
      ledgerEndpointResponse = screen.getByTestId(TEST_ID_RESULT_RESPONSE);
    });

    expect(ledgerEndpointResponse).toBeInTheDocument();
    expect(
      within(ledgerEndpointResponse).getByText(
        RegExp(ENDPOINT_RESPONSE.all_ledgers, "i"),
      ),
    ).toBeInTheDocument();
  });

  test("resource: single ledger submit with response", async () => {
    const singleLedgerButton = within(ledgerEndpointsContainer).getByText(
      /single ledger/i,
    );

    expect(singleLedgerButton).toBeInTheDocument();
    fireEvent.click(singleLedgerButton);

    await waitFor(() => {
      ledgerEndpointInputs = screen.getByTestId(TEST_ID_INPUTS);
    });
    expect(ledgerEndpointInputs).toBeInTheDocument();

    await waitFor(() => {
      ledgerEndpointSubmitButton = within(ledgerEndpointInputs).getByText(
        RegExp(SUBMIT_LABEL, "i"),
      );
    });
    expect(ledgerEndpointSubmitButton).toBeInTheDocument();

    fireEvent.click(ledgerEndpointSubmitButton);

    await waitFor(() =>
      expect(screen.getByTestId(TEST_ID_RESULT_LOADING)).toBeInTheDocument(),
    );

    await waitFor(() => {
      ledgerEndpointResponse = screen.getByTestId(TEST_ID_RESULT_RESPONSE);
    });

    expect(ledgerEndpointResponse).toBeInTheDocument();
    expect(
      within(ledgerEndpointResponse).getByText(
        RegExp(ENDPOINT_RESPONSE.single_ledger, "i"),
      ),
    ).toBeInTheDocument();
  });
});

describe("offers", () => {
  const RESOURCE_LINK_LABEL = "offers";
  const SUBMIT_LABEL = "submit";
  let offersEndpointsContainer: HTMLElement;
  let offersEndpointInputs: HTMLElement;
  let offersEndpointSubmitButton: HTMLElement;
  let offersEndpointResponse: HTMLElement;

  // select resource
  beforeEach(async () => {
    fireEvent.click(
      within(resourceContainer).getByText(RegExp(RESOURCE_LINK_LABEL, "i")),
    );
    await waitFor(() => {
      offersEndpointsContainer = screen.getByTestId(TEST_ID_ENDPOINT);
    });
  });

  // resource endpoint links
  test("renders all endpoint links", () => {
    expect(within(offersEndpointsContainer).getAllByRole("link")).toHaveLength(
      3,
    );
  });

  // render resource input form with submit + submit response
  test("resource: all offers submit with response", async () => {
    const allOffersButton = within(offersEndpointsContainer).getByText(
      /all offers/i,
    );

    expect(allOffersButton).toBeInTheDocument();
    fireEvent.click(allOffersButton);

    await waitFor(() => {
      offersEndpointInputs = screen.getByTestId(TEST_ID_INPUTS);
    });
    expect(offersEndpointInputs).toBeInTheDocument();

    await waitFor(() => {
      offersEndpointSubmitButton = within(offersEndpointInputs).getByText(
        RegExp(SUBMIT_LABEL, "i"),
      );
    });
    expect(offersEndpointSubmitButton).toBeInTheDocument();

    fireEvent.click(offersEndpointSubmitButton);

    await waitFor(() =>
      expect(screen.getByTestId(TEST_ID_RESULT_LOADING)).toBeInTheDocument(),
    );

    await waitFor(() => {
      offersEndpointResponse = screen.getByTestId(TEST_ID_RESULT_RESPONSE);
    });

    expect(offersEndpointResponse).toBeInTheDocument();
    expect(
      within(offersEndpointResponse).getByText(
        RegExp(ENDPOINT_RESPONSE.all_offers, "i"),
      ),
    ).toBeInTheDocument();
  });

  test("resource: single offer submit with response", async () => {
    const singleOfferButton = within(offersEndpointsContainer).getByText(
      /single offer/i,
    );

    expect(singleOfferButton).toBeInTheDocument();
    fireEvent.click(singleOfferButton);

    await waitFor(() => {
      offersEndpointInputs = screen.getByTestId(TEST_ID_INPUTS);
    });
    expect(offersEndpointInputs).toBeInTheDocument();

    await waitFor(() => {
      offersEndpointSubmitButton = within(offersEndpointInputs).getByText(
        RegExp(SUBMIT_LABEL, "i"),
      );
    });
    expect(offersEndpointSubmitButton).toBeInTheDocument();

    fireEvent.click(offersEndpointSubmitButton);

    await waitFor(() =>
      expect(screen.getByTestId(TEST_ID_RESULT_LOADING)).toBeInTheDocument(),
    );

    await waitFor(() => {
      offersEndpointResponse = screen.getByTestId(TEST_ID_RESULT_RESPONSE);
    });

    expect(offersEndpointResponse).toBeInTheDocument();
    expect(
      within(offersEndpointResponse).getByText(
        RegExp(ENDPOINT_RESPONSE.single_offer, "i"),
      ),
    ).toBeInTheDocument();
  });

  test("resource: offers for account submit with response", async () => {
    const offersForAccountButton = within(offersEndpointsContainer).getByText(
      /offers for account/i,
    );

    expect(offersForAccountButton).toBeInTheDocument();
    fireEvent.click(offersForAccountButton);

    await waitFor(() => {
      offersEndpointInputs = screen.getByTestId(TEST_ID_INPUTS);
    });
    expect(offersEndpointInputs).toBeInTheDocument();

    await waitFor(() => {
      offersEndpointSubmitButton = within(offersEndpointInputs).getByText(
        RegExp(SUBMIT_LABEL, "i"),
      );
    });
    expect(offersEndpointSubmitButton).toBeInTheDocument();

    fireEvent.click(offersEndpointSubmitButton);

    await waitFor(() =>
      expect(screen.getByTestId(TEST_ID_RESULT_LOADING)).toBeInTheDocument(),
    );

    await waitFor(() => {
      offersEndpointResponse = screen.getByTestId(TEST_ID_RESULT_RESPONSE);
    });

    expect(offersEndpointResponse).toBeInTheDocument();
    expect(
      within(offersEndpointResponse).getByText(
        RegExp(ENDPOINT_RESPONSE.offers_for_account, "i"),
      ),
    ).toBeInTheDocument();
  });
});

describe("operations", () => {
  const RESOURCE_LINK_LABEL = "operations";
  const SUBMIT_LABEL = "submit";
  let operationsEndpointsContainer: HTMLElement;
  let operationsEndpointInputs: HTMLElement;
  let operationsEndpointSubmitButton: HTMLElement;
  let operationsEndpointResponse: HTMLElement;

  // select resource
  beforeEach(async () => {
    fireEvent.click(
      within(resourceContainer).getByText(RegExp(RESOURCE_LINK_LABEL, "i")),
    );
    await waitFor(() => {
      operationsEndpointsContainer = screen.getByTestId(TEST_ID_ENDPOINT);
    });
  });

  // resource endpoint links
  test("renders all endpoint links", () => {
    expect(
      within(operationsEndpointsContainer).getAllByRole("link"),
    ).toHaveLength(5);
  });

  // render resource input form with submit + submit response
  test("resource: all operations submit with response", async () => {
    const allOperationsButton = within(operationsEndpointsContainer).getByText(
      /all operations/i,
    );

    expect(allOperationsButton).toBeInTheDocument();
    fireEvent.click(allOperationsButton);

    await waitFor(() => {
      operationsEndpointInputs = screen.getByTestId(TEST_ID_INPUTS);
    });
    expect(operationsEndpointInputs).toBeInTheDocument();

    await waitFor(() => {
      operationsEndpointSubmitButton = within(
        operationsEndpointInputs,
      ).getByText(RegExp(SUBMIT_LABEL, "i"));
    });
    expect(operationsEndpointSubmitButton).toBeInTheDocument();

    fireEvent.click(operationsEndpointSubmitButton);

    await waitFor(() =>
      expect(screen.getByTestId(TEST_ID_RESULT_LOADING)).toBeInTheDocument(),
    );

    await waitFor(() => {
      operationsEndpointResponse = screen.getByTestId(TEST_ID_RESULT_RESPONSE);
    });

    expect(operationsEndpointResponse).toBeInTheDocument();
    expect(
      within(operationsEndpointResponse).getByText(
        RegExp(ENDPOINT_RESPONSE.all_operations, "i"),
      ),
    ).toBeInTheDocument();
  });

  test("resource: single operation submit with response", async () => {
    const singleOperationButton = within(
      operationsEndpointsContainer,
    ).getByText(/single operation/i);

    expect(singleOperationButton).toBeInTheDocument();
    fireEvent.click(singleOperationButton);

    await waitFor(() => {
      operationsEndpointInputs = screen.getByTestId(TEST_ID_INPUTS);
    });
    expect(operationsEndpointInputs).toBeInTheDocument();

    await waitFor(() => {
      operationsEndpointSubmitButton = within(
        operationsEndpointInputs,
      ).getByText(RegExp(SUBMIT_LABEL, "i"));
    });
    expect(operationsEndpointSubmitButton).toBeInTheDocument();

    fireEvent.click(operationsEndpointSubmitButton);

    await waitFor(() =>
      expect(screen.getByTestId(TEST_ID_RESULT_LOADING)).toBeInTheDocument(),
    );

    await waitFor(() => {
      operationsEndpointResponse = screen.getByTestId(TEST_ID_RESULT_RESPONSE);
    });

    expect(operationsEndpointResponse).toBeInTheDocument();
    expect(
      within(operationsEndpointResponse).getByText(
        RegExp(ENDPOINT_RESPONSE.single_operation, "i"),
      ),
    ).toBeInTheDocument();
  });

  test("resource: operations for account submit with response", async () => {
    const operationsForAccountButton = within(
      operationsEndpointsContainer,
    ).getByText(/operations for account/i);

    expect(operationsForAccountButton).toBeInTheDocument();
    fireEvent.click(operationsForAccountButton);

    await waitFor(() => {
      operationsEndpointInputs = screen.getByTestId(TEST_ID_INPUTS);
    });
    expect(operationsEndpointInputs).toBeInTheDocument();

    await waitFor(() => {
      operationsEndpointSubmitButton = within(
        operationsEndpointInputs,
      ).getByText(RegExp(SUBMIT_LABEL, "i"));
    });
    expect(operationsEndpointSubmitButton).toBeInTheDocument();

    fireEvent.click(operationsEndpointSubmitButton);

    await waitFor(() =>
      expect(screen.getByTestId(TEST_ID_RESULT_LOADING)).toBeInTheDocument(),
    );

    await waitFor(() => {
      operationsEndpointResponse = screen.getByTestId(TEST_ID_RESULT_RESPONSE);
    });

    expect(operationsEndpointResponse).toBeInTheDocument();
    expect(
      within(operationsEndpointResponse).getByText(
        RegExp(ENDPOINT_RESPONSE.operations_for_account, "i"),
      ),
    ).toBeInTheDocument();
  });

  test("resource: operations for ledger submit with response", async () => {
    const operationsForLedgerButton = within(
      operationsEndpointsContainer,
    ).getByText(/operations for ledger/i);

    expect(operationsForLedgerButton).toBeInTheDocument();
    fireEvent.click(operationsForLedgerButton);

    await waitFor(() => {
      operationsEndpointInputs = screen.getByTestId(TEST_ID_INPUTS);
    });
    expect(operationsEndpointInputs).toBeInTheDocument();

    await waitFor(() => {
      operationsEndpointSubmitButton = within(
        operationsEndpointInputs,
      ).getByText(RegExp(SUBMIT_LABEL, "i"));
    });
    expect(operationsEndpointSubmitButton).toBeInTheDocument();

    fireEvent.click(operationsEndpointSubmitButton);

    await waitFor(() =>
      expect(screen.getByTestId(TEST_ID_RESULT_LOADING)).toBeInTheDocument(),
    );

    await waitFor(() => {
      operationsEndpointResponse = screen.getByTestId(TEST_ID_RESULT_RESPONSE);
    });

    expect(operationsEndpointResponse).toBeInTheDocument();
    expect(
      within(operationsEndpointResponse).getByText(
        RegExp(ENDPOINT_RESPONSE.operations_for_ledger, "i"),
      ),
    ).toBeInTheDocument();
  });

  test("resource: operations for transaction submit with response", async () => {
    const operationsForTransactionButton = within(
      operationsEndpointsContainer,
    ).getByText(/operations for transaction/i);

    expect(operationsForTransactionButton).toBeInTheDocument();
    fireEvent.click(operationsForTransactionButton);

    await waitFor(() => {
      operationsEndpointInputs = screen.getByTestId(TEST_ID_INPUTS);
    });
    expect(operationsEndpointInputs).toBeInTheDocument();

    await waitFor(() => {
      operationsEndpointSubmitButton = within(
        operationsEndpointInputs,
      ).getByText(RegExp(SUBMIT_LABEL, "i"));
    });
    expect(operationsEndpointSubmitButton).toBeInTheDocument();

    fireEvent.click(operationsEndpointSubmitButton);

    await waitFor(() =>
      expect(screen.getByTestId(TEST_ID_RESULT_LOADING)).toBeInTheDocument(),
    );

    await waitFor(() => {
      operationsEndpointResponse = screen.getByTestId(TEST_ID_RESULT_RESPONSE);
    });

    expect(operationsEndpointResponse).toBeInTheDocument();
    expect(
      within(operationsEndpointResponse).getByText(
        RegExp(ENDPOINT_RESPONSE.operations_for_transaction, "i"),
      ),
    ).toBeInTheDocument();
  });
});
