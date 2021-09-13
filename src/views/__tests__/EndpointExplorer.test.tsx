/**
 * @jest-environment jsdom
 */
import { fireEvent, screen, waitFor, within } from "@testing-library/react";

import { render, ENDPOINT_RESPONSE } from "helpers/testHelpers";
import { EndpointExplorer } from "views/EndpointExplorer";

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
  expect(within(resourceContainer).getAllByRole("link")).toHaveLength(14);
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
      6,
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

  test("resource: effects for liquidity pool submit with response", async () => {
    const effectsForLiquidityPoolButton = within(
      effectsEndpointsContainer,
    ).getByText(/effects for liquidity pool/i);

    expect(effectsForLiquidityPoolButton).toBeInTheDocument();
    fireEvent.click(effectsForLiquidityPoolButton);

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
        RegExp(ENDPOINT_RESPONSE.effects_for_liquidity_pool, "i"),
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

describe("liquidity pools", () => {
  const RESOURCE_LINK_LABEL = "liquidity pools";
  const SUBMIT_LABEL = "submit";
  let liquidityPoolsEndpointsContainer: HTMLElement;
  let liquidityPoolsEndpointInputs: HTMLElement;
  let liquidityPoolsEndpointSubmitButton: HTMLElement;
  let liquidityPoolsEndpointResponse: HTMLElement;

  // select resource
  beforeEach(async () => {
    fireEvent.click(
      within(resourceContainer).getByText(RegExp(RESOURCE_LINK_LABEL, "i")),
    );
    await waitFor(() => {
      liquidityPoolsEndpointsContainer = screen.getByTestId(TEST_ID_ENDPOINT);
    });
  });

  // resource endpoint links
  test("renders all endpoint links", () => {
    expect(
      within(liquidityPoolsEndpointsContainer).getAllByRole("link"),
    ).toHaveLength(2);
  });

  // render resource input form with submit + submit response
  test("resource: all liquidity pools submit with response", async () => {
    const allLiquidityPoolsButton = within(
      liquidityPoolsEndpointsContainer,
    ).getByText(/all liquidity pools/i);

    expect(allLiquidityPoolsButton).toBeInTheDocument();
    fireEvent.click(allLiquidityPoolsButton);

    await waitFor(() => {
      liquidityPoolsEndpointInputs = screen.getByTestId(TEST_ID_INPUTS);
    });
    expect(liquidityPoolsEndpointInputs).toBeInTheDocument();

    await waitFor(() => {
      liquidityPoolsEndpointSubmitButton = within(
        liquidityPoolsEndpointInputs,
      ).getByText(RegExp(SUBMIT_LABEL, "i"));
    });
    expect(liquidityPoolsEndpointSubmitButton).toBeInTheDocument();

    fireEvent.click(liquidityPoolsEndpointSubmitButton);

    await waitFor(() =>
      expect(screen.getByTestId(TEST_ID_RESULT_LOADING)).toBeInTheDocument(),
    );

    await waitFor(() => {
      liquidityPoolsEndpointResponse = screen.getByTestId(
        TEST_ID_RESULT_RESPONSE,
      );
    });

    expect(liquidityPoolsEndpointResponse).toBeInTheDocument();
    expect(
      within(liquidityPoolsEndpointResponse).getByText(
        RegExp(ENDPOINT_RESPONSE.all_liquidity_pools, "i"),
      ),
    ).toBeInTheDocument();
  });

  test("resource: single liquidity pool submit with response", async () => {
    const singleLiquidityPoolButton = within(
      liquidityPoolsEndpointsContainer,
    ).getByText(/single liquidity pool/i);

    expect(singleLiquidityPoolButton).toBeInTheDocument();
    fireEvent.click(singleLiquidityPoolButton);

    await waitFor(() => {
      liquidityPoolsEndpointInputs = screen.getByTestId(TEST_ID_INPUTS);
    });
    expect(liquidityPoolsEndpointInputs).toBeInTheDocument();

    await waitFor(() => {
      liquidityPoolsEndpointSubmitButton = within(
        liquidityPoolsEndpointInputs,
      ).getByText(RegExp(SUBMIT_LABEL, "i"));
    });
    expect(liquidityPoolsEndpointSubmitButton).toBeInTheDocument();

    fireEvent.click(liquidityPoolsEndpointSubmitButton);

    await waitFor(() =>
      expect(screen.getByTestId(TEST_ID_RESULT_LOADING)).toBeInTheDocument(),
    );

    await waitFor(() => {
      liquidityPoolsEndpointResponse = screen.getByTestId(
        TEST_ID_RESULT_RESPONSE,
      );
    });

    expect(liquidityPoolsEndpointResponse).toBeInTheDocument();
    expect(
      within(liquidityPoolsEndpointResponse).getByText(
        RegExp(ENDPOINT_RESPONSE.single_liquidity_pool, "i"),
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
    ).toHaveLength(6);
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

  test("resource: operations for liquidity pool submit with response", async () => {
    const operationsForLiquidityPoolButton = within(
      operationsEndpointsContainer,
    ).getByText(/operations for liquidity pool/i);

    expect(operationsForLiquidityPoolButton).toBeInTheDocument();
    fireEvent.click(operationsForLiquidityPoolButton);

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
        RegExp(ENDPOINT_RESPONSE.operations_for_liquidity_pool, "i"),
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

describe("order book", () => {
  const RESOURCE_LINK_LABEL = "order book";
  const SUBMIT_LABEL = "submit";
  let orderBookEndpointsContainer: HTMLElement;
  let orderBookEndpointInputs: HTMLElement;
  let orderBookEndpointSubmitButton: HTMLElement;
  let orderBookEndpointResponse: HTMLElement;

  // select resource
  beforeEach(async () => {
    fireEvent.click(
      within(resourceContainer).getByText(RegExp(RESOURCE_LINK_LABEL, "i")),
    );
    await waitFor(() => {
      orderBookEndpointsContainer = screen.getByTestId(TEST_ID_ENDPOINT);
    });
  });

  // resource endpoint links
  test("renders all endpoint links", () => {
    expect(
      within(orderBookEndpointsContainer).getAllByRole("link"),
    ).toHaveLength(1);
  });

  // render resource input form with submit + submit response
  test("resource: details submit with response", async () => {
    const detailsButton = within(orderBookEndpointsContainer).getByText(
      /details/i,
    );

    expect(detailsButton).toBeInTheDocument();
    fireEvent.click(detailsButton);

    await waitFor(() => {
      orderBookEndpointInputs = screen.getByTestId(TEST_ID_INPUTS);
    });
    expect(orderBookEndpointInputs).toBeInTheDocument();

    await waitFor(() => {
      orderBookEndpointSubmitButton = within(orderBookEndpointInputs).getByText(
        RegExp(SUBMIT_LABEL, "i"),
      );
    });
    expect(orderBookEndpointSubmitButton).toBeInTheDocument();

    fireEvent.click(orderBookEndpointSubmitButton);

    await waitFor(() =>
      expect(screen.getByTestId(TEST_ID_RESULT_LOADING)).toBeInTheDocument(),
    );

    await waitFor(() => {
      orderBookEndpointResponse = screen.getByTestId(TEST_ID_RESULT_RESPONSE);
    });

    expect(orderBookEndpointResponse).toBeInTheDocument();
    expect(
      within(orderBookEndpointResponse).getByText(
        RegExp(ENDPOINT_RESPONSE.order_book_details, "i"),
      ),
    ).toBeInTheDocument();
  });
});

describe("paths", () => {
  const RESOURCE_LINK_LABEL = "paths";
  const SUBMIT_LABEL = "submit";
  let pathsEndpointsContainer: HTMLElement;
  let pathsEndpointInputs: HTMLElement;
  let pathsEndpointSubmitButton: HTMLElement;
  let pathsEndpointResponse: HTMLElement;

  // select resource
  beforeEach(async () => {
    fireEvent.click(
      within(resourceContainer).getByText(RegExp(RESOURCE_LINK_LABEL, "i")),
    );
    await waitFor(() => {
      pathsEndpointsContainer = screen.getByTestId(TEST_ID_ENDPOINT);
    });
  });

  // resource endpoint links
  test("renders all endpoint links", () => {
    expect(within(pathsEndpointsContainer).getAllByRole("link")).toHaveLength(
      3,
    );
  });

  // render resource input form with submit + submit response
  test("resource: find payment paths submit with response", async () => {
    const findPaymentPathsButton = within(pathsEndpointsContainer).getByText(
      /find payment paths/i,
    );

    expect(findPaymentPathsButton).toBeInTheDocument();
    fireEvent.click(findPaymentPathsButton);

    await waitFor(() => {
      pathsEndpointInputs = screen.getByTestId(TEST_ID_INPUTS);
    });
    expect(pathsEndpointInputs).toBeInTheDocument();

    await waitFor(() => {
      pathsEndpointSubmitButton = within(pathsEndpointInputs).getByText(
        RegExp(SUBMIT_LABEL, "i"),
      );
    });
    expect(pathsEndpointSubmitButton).toBeInTheDocument();

    fireEvent.click(pathsEndpointSubmitButton);

    await waitFor(() =>
      expect(screen.getByTestId(TEST_ID_RESULT_LOADING)).toBeInTheDocument(),
    );

    await waitFor(() => {
      pathsEndpointResponse = screen.getByTestId(TEST_ID_RESULT_RESPONSE);
    });

    expect(pathsEndpointResponse).toBeInTheDocument();
    expect(
      within(pathsEndpointResponse).getByText(
        RegExp(ENDPOINT_RESPONSE.find_payment_paths, "i"),
      ),
    ).toBeInTheDocument();
  });

  test("resource: find strict receive payment paths submit with response", async () => {
    const findReceivePaymentPathsButton = within(
      pathsEndpointsContainer,
    ).getByText(/find strict receive payment paths/i);

    expect(findReceivePaymentPathsButton).toBeInTheDocument();
    fireEvent.click(findReceivePaymentPathsButton);

    await waitFor(() => {
      pathsEndpointInputs = screen.getByTestId(TEST_ID_INPUTS);
    });
    expect(pathsEndpointInputs).toBeInTheDocument();

    await waitFor(() => {
      pathsEndpointSubmitButton = within(pathsEndpointInputs).getByText(
        RegExp(SUBMIT_LABEL, "i"),
      );
    });
    expect(pathsEndpointSubmitButton).toBeInTheDocument();

    fireEvent.click(pathsEndpointSubmitButton);

    await waitFor(() =>
      expect(screen.getByTestId(TEST_ID_RESULT_LOADING)).toBeInTheDocument(),
    );

    await waitFor(() => {
      pathsEndpointResponse = screen.getByTestId(TEST_ID_RESULT_RESPONSE);
    });

    expect(pathsEndpointResponse).toBeInTheDocument();
    expect(
      within(pathsEndpointResponse).getByText(
        RegExp(ENDPOINT_RESPONSE.find_strict_receive_payment_paths, "i"),
      ),
    ).toBeInTheDocument();
  });

  test("resource: find strict send payment paths submit with response", async () => {
    const findSendPaymentPathsButton = within(
      pathsEndpointsContainer,
    ).getByText(/find strict send payment paths/i);

    expect(findSendPaymentPathsButton).toBeInTheDocument();
    fireEvent.click(findSendPaymentPathsButton);

    await waitFor(() => {
      pathsEndpointInputs = screen.getByTestId(TEST_ID_INPUTS);
    });
    expect(pathsEndpointInputs).toBeInTheDocument();

    await waitFor(() => {
      pathsEndpointSubmitButton = within(pathsEndpointInputs).getByText(
        RegExp(SUBMIT_LABEL, "i"),
      );
    });
    expect(pathsEndpointSubmitButton).toBeInTheDocument();

    fireEvent.click(pathsEndpointSubmitButton);

    await waitFor(() =>
      expect(screen.getByTestId(TEST_ID_RESULT_LOADING)).toBeInTheDocument(),
    );

    await waitFor(() => {
      pathsEndpointResponse = screen.getByTestId(TEST_ID_RESULT_RESPONSE);
    });

    expect(pathsEndpointResponse).toBeInTheDocument();
    expect(
      within(pathsEndpointResponse).getByText(
        RegExp(ENDPOINT_RESPONSE.find_strict_send_payment_paths, "i"),
      ),
    ).toBeInTheDocument();
  });
});

describe("payments", () => {
  const RESOURCE_LINK_LABEL = "payments";
  const SUBMIT_LABEL = "submit";
  let paymentsEndpointsContainer: HTMLElement;
  let paymentsEndpointInputs: HTMLElement;
  let paymentsEndpointSubmitButton: HTMLElement;
  let paymentsEndpointResponse: HTMLElement;

  // select resource
  beforeEach(async () => {
    fireEvent.click(
      within(resourceContainer).getByText(RegExp(RESOURCE_LINK_LABEL, "i")),
    );
    await waitFor(() => {
      paymentsEndpointsContainer = screen.getByTestId(TEST_ID_ENDPOINT);
    });
  });

  // resource endpoint links
  test("renders all endpoint links", () => {
    expect(
      within(paymentsEndpointsContainer).getAllByRole("link"),
    ).toHaveLength(4);
  });

  // render resource input form with submit + submit response
  test("resource: all payments submit with response", async () => {
    const allPaymentsButton = within(paymentsEndpointsContainer).getByText(
      /all payments/i,
    );

    expect(allPaymentsButton).toBeInTheDocument();
    fireEvent.click(allPaymentsButton);

    await waitFor(() => {
      paymentsEndpointInputs = screen.getByTestId(TEST_ID_INPUTS);
    });
    expect(paymentsEndpointInputs).toBeInTheDocument();

    await waitFor(() => {
      paymentsEndpointSubmitButton = within(paymentsEndpointInputs).getByText(
        RegExp(SUBMIT_LABEL, "i"),
      );
    });
    expect(paymentsEndpointSubmitButton).toBeInTheDocument();

    fireEvent.click(paymentsEndpointSubmitButton);

    await waitFor(() =>
      expect(screen.getByTestId(TEST_ID_RESULT_LOADING)).toBeInTheDocument(),
    );

    await waitFor(() => {
      paymentsEndpointResponse = screen.getByTestId(TEST_ID_RESULT_RESPONSE);
    });

    expect(paymentsEndpointResponse).toBeInTheDocument();
    expect(
      within(paymentsEndpointResponse).getByText(
        RegExp(ENDPOINT_RESPONSE.all_payments, "i"),
      ),
    ).toBeInTheDocument();
  });

  test("resource: payments for account submit with response", async () => {
    const paymentsForAccountButton = within(
      paymentsEndpointsContainer,
    ).getByText(/payments for account/i);

    expect(paymentsForAccountButton).toBeInTheDocument();
    fireEvent.click(paymentsForAccountButton);

    await waitFor(() => {
      paymentsEndpointInputs = screen.getByTestId(TEST_ID_INPUTS);
    });
    expect(paymentsEndpointInputs).toBeInTheDocument();

    await waitFor(() => {
      paymentsEndpointSubmitButton = within(paymentsEndpointInputs).getByText(
        RegExp(SUBMIT_LABEL, "i"),
      );
    });
    expect(paymentsEndpointSubmitButton).toBeInTheDocument();

    fireEvent.click(paymentsEndpointSubmitButton);

    await waitFor(() =>
      expect(screen.getByTestId(TEST_ID_RESULT_LOADING)).toBeInTheDocument(),
    );

    await waitFor(() => {
      paymentsEndpointResponse = screen.getByTestId(TEST_ID_RESULT_RESPONSE);
    });

    expect(paymentsEndpointResponse).toBeInTheDocument();
    expect(
      within(paymentsEndpointResponse).getByText(
        RegExp(ENDPOINT_RESPONSE.payments_for_account, "i"),
      ),
    ).toBeInTheDocument();
  });

  test("resource: payments for ledger submit with response", async () => {
    const paymentsForLedgerButton = within(
      paymentsEndpointsContainer,
    ).getByText(/payments for ledger/i);

    expect(paymentsForLedgerButton).toBeInTheDocument();
    fireEvent.click(paymentsForLedgerButton);

    await waitFor(() => {
      paymentsEndpointInputs = screen.getByTestId(TEST_ID_INPUTS);
    });
    expect(paymentsEndpointInputs).toBeInTheDocument();

    await waitFor(() => {
      paymentsEndpointSubmitButton = within(paymentsEndpointInputs).getByText(
        RegExp(SUBMIT_LABEL, "i"),
      );
    });
    expect(paymentsEndpointSubmitButton).toBeInTheDocument();

    fireEvent.click(paymentsEndpointSubmitButton);

    await waitFor(() =>
      expect(screen.getByTestId(TEST_ID_RESULT_LOADING)).toBeInTheDocument(),
    );

    await waitFor(() => {
      paymentsEndpointResponse = screen.getByTestId(TEST_ID_RESULT_RESPONSE);
    });

    expect(paymentsEndpointResponse).toBeInTheDocument();
    expect(
      within(paymentsEndpointResponse).getByText(
        RegExp(ENDPOINT_RESPONSE.payments_for_ledger, "i"),
      ),
    ).toBeInTheDocument();
  });

  test("resource: payments for transaction submit with response", async () => {
    const paymentsForTransactionButton = within(
      paymentsEndpointsContainer,
    ).getByText(/payments for transaction/i);

    expect(paymentsForTransactionButton).toBeInTheDocument();
    fireEvent.click(paymentsForTransactionButton);

    await waitFor(() => {
      paymentsEndpointInputs = screen.getByTestId(TEST_ID_INPUTS);
    });
    expect(paymentsEndpointInputs).toBeInTheDocument();

    await waitFor(() => {
      paymentsEndpointSubmitButton = within(paymentsEndpointInputs).getByText(
        RegExp(SUBMIT_LABEL, "i"),
      );
    });
    expect(paymentsEndpointSubmitButton).toBeInTheDocument();

    fireEvent.click(paymentsEndpointSubmitButton);

    await waitFor(() =>
      expect(screen.getByTestId(TEST_ID_RESULT_LOADING)).toBeInTheDocument(),
    );

    await waitFor(() => {
      paymentsEndpointResponse = screen.getByTestId(TEST_ID_RESULT_RESPONSE);
    });

    expect(paymentsEndpointResponse).toBeInTheDocument();
    expect(
      within(paymentsEndpointResponse).getByText(
        RegExp(ENDPOINT_RESPONSE.payments_for_transaction, "i"),
      ),
    ).toBeInTheDocument();
  });
});

describe("trade aggregations", () => {
  const RESOURCE_LINK_LABEL = "trade aggregations";
  const SUBMIT_LABEL = "submit";
  let tradeAggregationsEndpointsContainer: HTMLElement;
  let tradeAggregationsEndpointInputs: HTMLElement;
  let tradeAggregationsEndpointSubmitButton: HTMLElement;
  let tradeAggregationsEndpointResponse: HTMLElement;

  // select resource
  beforeEach(async () => {
    fireEvent.click(
      within(resourceContainer).getByText(RegExp(RESOURCE_LINK_LABEL, "i")),
    );
    await waitFor(() => {
      tradeAggregationsEndpointsContainer =
        screen.getByTestId(TEST_ID_ENDPOINT);
    });
  });

  // resource endpoint links
  test("renders all endpoint links", () => {
    expect(
      within(tradeAggregationsEndpointsContainer).getAllByRole("link"),
    ).toHaveLength(1);
  });

  // render resource input form with submit + submit response
  test("resource: trade aggregations submit with response", async () => {
    const tradeAggregationsButton = within(
      tradeAggregationsEndpointsContainer,
    ).getByText(/trade aggregations/i);

    expect(tradeAggregationsButton).toBeInTheDocument();
    fireEvent.click(tradeAggregationsButton);

    await waitFor(() => {
      tradeAggregationsEndpointInputs = screen.getByTestId(TEST_ID_INPUTS);
    });
    expect(tradeAggregationsEndpointInputs).toBeInTheDocument();

    await waitFor(() => {
      tradeAggregationsEndpointSubmitButton = within(
        tradeAggregationsEndpointInputs,
      ).getByText(RegExp(SUBMIT_LABEL, "i"));
    });
    expect(tradeAggregationsEndpointSubmitButton).toBeInTheDocument();

    fireEvent.click(tradeAggregationsEndpointSubmitButton);

    await waitFor(() =>
      expect(screen.getByTestId(TEST_ID_RESULT_LOADING)).toBeInTheDocument(),
    );

    await waitFor(() => {
      tradeAggregationsEndpointResponse = screen.getByTestId(
        TEST_ID_RESULT_RESPONSE,
      );
    });

    expect(tradeAggregationsEndpointResponse).toBeInTheDocument();
    expect(
      within(tradeAggregationsEndpointResponse).getByText(
        RegExp(ENDPOINT_RESPONSE.trade_aggregations, "i"),
      ),
    ).toBeInTheDocument();
  });
});

describe("trades", () => {
  const RESOURCE_LINK_LABEL = "trades";
  const SUBMIT_LABEL = "submit";
  let tradesEndpointsContainer: HTMLElement;
  let tradesEndpointInputs: HTMLElement;
  let tradesEndpointSubmitButton: HTMLElement;
  let tradesEndpointResponse: HTMLElement;

  // select resource
  beforeEach(async () => {
    fireEvent.click(
      within(resourceContainer).getByText(RegExp(RESOURCE_LINK_LABEL, "i")),
    );
    await waitFor(() => {
      tradesEndpointsContainer = screen.getByTestId(TEST_ID_ENDPOINT);
    });
  });

  // resource endpoint links
  test("renders all endpoint links", () => {
    expect(within(tradesEndpointsContainer).getAllByRole("link")).toHaveLength(
      4,
    );
  });

  // render resource input form with submit + submit response
  test("resource: all trades submit with response", async () => {
    const allTradesButton = within(tradesEndpointsContainer).getByText(
      /all trades/i,
    );

    expect(allTradesButton).toBeInTheDocument();
    fireEvent.click(allTradesButton);

    await waitFor(() => {
      tradesEndpointInputs = screen.getByTestId(TEST_ID_INPUTS);
    });
    expect(tradesEndpointInputs).toBeInTheDocument();

    await waitFor(() => {
      tradesEndpointSubmitButton = within(tradesEndpointInputs).getByText(
        RegExp(SUBMIT_LABEL, "i"),
      );
    });
    expect(tradesEndpointSubmitButton).toBeInTheDocument();

    fireEvent.click(tradesEndpointSubmitButton);

    await waitFor(() =>
      expect(screen.getByTestId(TEST_ID_RESULT_LOADING)).toBeInTheDocument(),
    );

    await waitFor(() => {
      tradesEndpointResponse = screen.getByTestId(TEST_ID_RESULT_RESPONSE);
    });

    expect(tradesEndpointResponse).toBeInTheDocument();
    expect(
      within(tradesEndpointResponse).getByText(
        RegExp(ENDPOINT_RESPONSE.all_trades, "i"),
      ),
    ).toBeInTheDocument();
  });

  test("resource: trades for account submit with response", async () => {
    const tradesForAccountButton = within(tradesEndpointsContainer).getByText(
      /trades for account/i,
    );

    expect(tradesForAccountButton).toBeInTheDocument();
    fireEvent.click(tradesForAccountButton);

    await waitFor(() => {
      tradesEndpointInputs = screen.getByTestId(TEST_ID_INPUTS);
    });
    expect(tradesEndpointInputs).toBeInTheDocument();

    await waitFor(() => {
      tradesEndpointSubmitButton = within(tradesEndpointInputs).getByText(
        RegExp(SUBMIT_LABEL, "i"),
      );
    });
    expect(tradesEndpointSubmitButton).toBeInTheDocument();

    fireEvent.click(tradesEndpointSubmitButton);

    await waitFor(() =>
      expect(screen.getByTestId(TEST_ID_RESULT_LOADING)).toBeInTheDocument(),
    );

    await waitFor(() => {
      tradesEndpointResponse = screen.getByTestId(TEST_ID_RESULT_RESPONSE);
    });

    expect(tradesEndpointResponse).toBeInTheDocument();
    expect(
      within(tradesEndpointResponse).getByText(
        RegExp(ENDPOINT_RESPONSE.trades_for_account, "i"),
      ),
    ).toBeInTheDocument();
  });

  test("resource: trades for liquidity pool submit with response", async () => {
    const tradesForLiquidityPoolButton = within(
      tradesEndpointsContainer,
    ).getByText(/trades for liquidity pool/i);

    expect(tradesForLiquidityPoolButton).toBeInTheDocument();
    fireEvent.click(tradesForLiquidityPoolButton);

    await waitFor(() => {
      tradesEndpointInputs = screen.getByTestId(TEST_ID_INPUTS);
    });
    expect(tradesEndpointInputs).toBeInTheDocument();

    await waitFor(() => {
      tradesEndpointSubmitButton = within(tradesEndpointInputs).getByText(
        RegExp(SUBMIT_LABEL, "i"),
      );
    });
    expect(tradesEndpointSubmitButton).toBeInTheDocument();

    fireEvent.click(tradesEndpointSubmitButton);

    await waitFor(() =>
      expect(screen.getByTestId(TEST_ID_RESULT_LOADING)).toBeInTheDocument(),
    );

    await waitFor(() => {
      tradesEndpointResponse = screen.getByTestId(TEST_ID_RESULT_RESPONSE);
    });

    expect(tradesEndpointResponse).toBeInTheDocument();
    expect(
      within(tradesEndpointResponse).getByText(
        RegExp(ENDPOINT_RESPONSE.trades_for_liquidity_pool, "i"),
      ),
    ).toBeInTheDocument();
  });

  test("resource: trades for offer submit with response", async () => {
    const tradesForOfferButton = within(tradesEndpointsContainer).getByText(
      /trades for offer/i,
    );

    expect(tradesForOfferButton).toBeInTheDocument();
    fireEvent.click(tradesForOfferButton);

    await waitFor(() => {
      tradesEndpointInputs = screen.getByTestId(TEST_ID_INPUTS);
    });
    expect(tradesEndpointInputs).toBeInTheDocument();

    await waitFor(() => {
      tradesEndpointSubmitButton = within(tradesEndpointInputs).getByText(
        RegExp(SUBMIT_LABEL, "i"),
      );
    });
    expect(tradesEndpointSubmitButton).toBeInTheDocument();

    fireEvent.click(tradesEndpointSubmitButton);

    await waitFor(() =>
      expect(screen.getByTestId(TEST_ID_RESULT_LOADING)).toBeInTheDocument(),
    );

    await waitFor(() => {
      tradesEndpointResponse = screen.getByTestId(TEST_ID_RESULT_RESPONSE);
    });

    expect(tradesEndpointResponse).toBeInTheDocument();
    expect(
      within(tradesEndpointResponse).getByText(
        RegExp(ENDPOINT_RESPONSE.trades_for_offer, "i"),
      ),
    ).toBeInTheDocument();
  });
});

describe("transactions", () => {
  const RESOURCE_LINK_LABEL = "transactions";
  const SUBMIT_LABEL = "submit";
  let transactionsEndpointsContainer: HTMLElement;
  let transactionsEndpointInputs: HTMLElement;
  let transactionsEndpointSubmitButton: HTMLElement;
  let transactionsEndpointResponse: HTMLElement;

  // select resource
  beforeEach(async () => {
    fireEvent.click(
      within(resourceContainer).getByText(RegExp(RESOURCE_LINK_LABEL, "i")),
    );
    await waitFor(() => {
      transactionsEndpointsContainer = screen.getByTestId(TEST_ID_ENDPOINT);
    });
  });

  // resource endpoint links
  test("renders all endpoint links", () => {
    expect(
      within(transactionsEndpointsContainer).getAllByRole("link"),
    ).toHaveLength(6);
  });

  // render resource input form with submit + submit response
  test("resource: all transactions submit with response", async () => {
    const allTransactionsButton = within(
      transactionsEndpointsContainer,
    ).getByText(/all transactions/i);

    expect(allTransactionsButton).toBeInTheDocument();
    fireEvent.click(allTransactionsButton);

    await waitFor(() => {
      transactionsEndpointInputs = screen.getByTestId(TEST_ID_INPUTS);
    });
    expect(transactionsEndpointInputs).toBeInTheDocument();

    await waitFor(() => {
      transactionsEndpointSubmitButton = within(
        transactionsEndpointInputs,
      ).getByText(RegExp(SUBMIT_LABEL, "i"));
    });
    expect(transactionsEndpointSubmitButton).toBeInTheDocument();

    fireEvent.click(transactionsEndpointSubmitButton);

    await waitFor(() =>
      expect(screen.getByTestId(TEST_ID_RESULT_LOADING)).toBeInTheDocument(),
    );

    await waitFor(() => {
      transactionsEndpointResponse = screen.getByTestId(
        TEST_ID_RESULT_RESPONSE,
      );
    });

    expect(transactionsEndpointResponse).toBeInTheDocument();
    expect(
      within(transactionsEndpointResponse).getByText(
        RegExp(ENDPOINT_RESPONSE.all_transactions, "i"),
      ),
    ).toBeInTheDocument();
  });

  test("resource: single transaction submit with response", async () => {
    const singleTransactionButton = within(
      transactionsEndpointsContainer,
    ).getByText(/single transaction/i);

    expect(singleTransactionButton).toBeInTheDocument();
    fireEvent.click(singleTransactionButton);

    await waitFor(() => {
      transactionsEndpointInputs = screen.getByTestId(TEST_ID_INPUTS);
    });
    expect(transactionsEndpointInputs).toBeInTheDocument();

    await waitFor(() => {
      transactionsEndpointSubmitButton = within(
        transactionsEndpointInputs,
      ).getByText(RegExp(SUBMIT_LABEL, "i"));
    });
    expect(transactionsEndpointSubmitButton).toBeInTheDocument();

    fireEvent.click(transactionsEndpointSubmitButton);

    await waitFor(() =>
      expect(screen.getByTestId(TEST_ID_RESULT_LOADING)).toBeInTheDocument(),
    );

    await waitFor(() => {
      transactionsEndpointResponse = screen.getByTestId(
        TEST_ID_RESULT_RESPONSE,
      );
    });

    expect(transactionsEndpointResponse).toBeInTheDocument();
    expect(
      within(transactionsEndpointResponse).getByText(
        RegExp(ENDPOINT_RESPONSE.single_transaction, "i"),
      ),
    ).toBeInTheDocument();
  });

  test("resource: post transaction submit with response", async () => {
    const postTransactionButton = within(
      transactionsEndpointsContainer,
    ).getByText(/post transaction/i);

    expect(postTransactionButton).toBeInTheDocument();
    fireEvent.click(postTransactionButton);

    await waitFor(() => {
      transactionsEndpointInputs = screen.getByTestId(TEST_ID_INPUTS);
    });
    expect(transactionsEndpointInputs).toBeInTheDocument();

    await waitFor(() => {
      transactionsEndpointSubmitButton = within(
        transactionsEndpointInputs,
      ).getByText(RegExp(SUBMIT_LABEL, "i"));
    });
    expect(transactionsEndpointSubmitButton).toBeInTheDocument();

    fireEvent.click(transactionsEndpointSubmitButton);

    await waitFor(() =>
      expect(screen.getByTestId(TEST_ID_RESULT_LOADING)).toBeInTheDocument(),
    );

    await waitFor(() => {
      transactionsEndpointResponse = screen.getByTestId(
        TEST_ID_RESULT_RESPONSE,
      );
    });

    expect(transactionsEndpointResponse).toBeInTheDocument();
    expect(
      within(transactionsEndpointResponse).getByText(
        RegExp(ENDPOINT_RESPONSE.post_transaction, "i"),
      ),
    ).toBeInTheDocument();
  });

  test("resource: transactions for account submit with response", async () => {
    const transactionsForAccountButton = within(
      transactionsEndpointsContainer,
    ).getByText(/transactions for account/i);

    expect(transactionsForAccountButton).toBeInTheDocument();
    fireEvent.click(transactionsForAccountButton);

    await waitFor(() => {
      transactionsEndpointInputs = screen.getByTestId(TEST_ID_INPUTS);
    });
    expect(transactionsEndpointInputs).toBeInTheDocument();

    await waitFor(() => {
      transactionsEndpointSubmitButton = within(
        transactionsEndpointInputs,
      ).getByText(RegExp(SUBMIT_LABEL, "i"));
    });
    expect(transactionsEndpointSubmitButton).toBeInTheDocument();

    fireEvent.click(transactionsEndpointSubmitButton);

    await waitFor(() =>
      expect(screen.getByTestId(TEST_ID_RESULT_LOADING)).toBeInTheDocument(),
    );

    await waitFor(() => {
      transactionsEndpointResponse = screen.getByTestId(
        TEST_ID_RESULT_RESPONSE,
      );
    });

    expect(transactionsEndpointResponse).toBeInTheDocument();
    expect(
      within(transactionsEndpointResponse).getByText(
        RegExp(ENDPOINT_RESPONSE.transactions_for_account, "i"),
      ),
    ).toBeInTheDocument();
  });

  test("resource: transactions for ledger submit with response", async () => {
    const transactionsForLedgerButton = within(
      transactionsEndpointsContainer,
    ).getByText(/transactions for ledger/i);

    expect(transactionsForLedgerButton).toBeInTheDocument();
    fireEvent.click(transactionsForLedgerButton);

    await waitFor(() => {
      transactionsEndpointInputs = screen.getByTestId(TEST_ID_INPUTS);
    });
    expect(transactionsEndpointInputs).toBeInTheDocument();

    await waitFor(() => {
      transactionsEndpointSubmitButton = within(
        transactionsEndpointInputs,
      ).getByText(RegExp(SUBMIT_LABEL, "i"));
    });
    expect(transactionsEndpointSubmitButton).toBeInTheDocument();

    fireEvent.click(transactionsEndpointSubmitButton);

    await waitFor(() =>
      expect(screen.getByTestId(TEST_ID_RESULT_LOADING)).toBeInTheDocument(),
    );

    await waitFor(() => {
      transactionsEndpointResponse = screen.getByTestId(
        TEST_ID_RESULT_RESPONSE,
      );
    });

    expect(transactionsEndpointResponse).toBeInTheDocument();
    expect(
      within(transactionsEndpointResponse).getByText(
        RegExp(ENDPOINT_RESPONSE.transactions_for_ledger, "i"),
      ),
    ).toBeInTheDocument();
  });

  test("resource: transactions for liquidity pool submit with response", async () => {
    const transactionsForLiquidityPoolButton = within(
      transactionsEndpointsContainer,
    ).getByText(/transactions for liquidity pool/i);

    expect(transactionsForLiquidityPoolButton).toBeInTheDocument();
    fireEvent.click(transactionsForLiquidityPoolButton);

    await waitFor(() => {
      transactionsEndpointInputs = screen.getByTestId(TEST_ID_INPUTS);
    });
    expect(transactionsEndpointInputs).toBeInTheDocument();

    await waitFor(() => {
      transactionsEndpointSubmitButton = within(
        transactionsEndpointInputs,
      ).getByText(RegExp(SUBMIT_LABEL, "i"));
    });
    expect(transactionsEndpointSubmitButton).toBeInTheDocument();

    fireEvent.click(transactionsEndpointSubmitButton);

    await waitFor(() =>
      expect(screen.getByTestId(TEST_ID_RESULT_LOADING)).toBeInTheDocument(),
    );

    await waitFor(() => {
      transactionsEndpointResponse = screen.getByTestId(
        TEST_ID_RESULT_RESPONSE,
      );
    });

    expect(transactionsEndpointResponse).toBeInTheDocument();
    expect(
      within(transactionsEndpointResponse).getByText(
        RegExp(ENDPOINT_RESPONSE.transactions_for_liquidity_pool, "i"),
      ),
    ).toBeInTheDocument();
  });
});
