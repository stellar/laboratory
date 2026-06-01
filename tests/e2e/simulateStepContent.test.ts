import { baseURL } from "../../playwright.config";
import { test, expect, Page } from "@playwright/test";

/**
 * E2E tests for the Simulate step in the single-page transaction build flow.
 *
 * Focuses on re-simulation clearing stale assembled XDR so that outdated
 * data cannot leak through to downstream steps.
 */

// A valid Soroban invokeHostFunction transaction XDR (testnet)
const MOCK_BUILT_XDR =
  "AAAAAgAAAABehlCJLiX4z1uDtAEfSWKNdd8o4ToBBlBhd6irPT7lVgAAAMgAFrXYAAAAEwAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAGAAAAAAAAAABfR984Fi8pqygq69PddL9vXaSLgP7qLlpsaqO5YL+IZsAAAAEc3dhcAAAAAgAAAASAAAAAAAAAAAh5dYXbG+vCChQsGMYfg8k2ABTTz0GHlyHZd1Q+bf9dAAAABIAAAAAAAAAAMwJGsOjTzw4CL/dwI16iaHPIxQi4W5zveD3yDEJrwyeAAAAEgAAAAHXkotywnA8z+r365/0701QSlWouXn8m0UOoshCtNHOYQAAABIAAAABUEXNXsBymnaP1a0CUFhS308Cjc6DDlrFIgm6SEg7LwEAAAAKAAAAAAAAAAAAAAAAAAAACgAAAAoAAAAAAAAAAAAAAAAAAAAyAAAACgAAAAAAAAAAAAAAAAAAAGQAAAAKAAAAAAAAAAAAAAAAAAAABQAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";

// A mock auth entry XDR (sorobanCredentialsAddress — requires explicit signing)
const MOCK_AUTH_ENTRY_XDR =
  "AAAAAQAAAAAAAAAAIeXWF2xvrwgoULBjGH4PJNgAU089Bh5ch2XdUPm3/XRzFw9PTWlqNwAAAAAAAAABAAAAAAAAAAF9H3zgWLymrKCrr0910v29dpIuA/uouWmxqo7lgv4hmwAAAARzd2FwAAAABAAAABIAAAAB15KLcsJwPM/q9+uf9O9NUEpVqLl5/JtFDqLIQrTRzmEAAAASAAAAAVBFzV7Acpp2j9WtAlBYUt9PAo3Ogw5axSIJukhIOy8BAAAACgAAAAAAAAAAAAAAAAAAAAoAAAAKAAAAAAAAAAAAAAAAAAAAMgAAAAEAAAAAAAAAAdeSi3LCcDzP6vfrn/TvTVBKVai5efybRQ6iyEK00c5hAAAACHRyYW5zZmVyAAAAAwAAABIAAAAAAAAAACHl1hdsb68IKFCwYxh+DyTYAFNPPQYeXIdl3VD5t/10AAAAEgAAAAF9H3zgWLymrKCrr0910v29dpIuA/uouWmxqo7lgv4hmwAAAAoAAAAAAAAAAAAAAAAAAAAKAAAAAA==";

// A mock auth entry XDR (sorobanCredentialsSourceAccount — authorized by
// the transaction envelope signature, no separate signing needed)
const MOCK_SOURCE_ACCOUNT_AUTH_ENTRY_XDR =
  "AAAAAAAAAAAAAAABfR984Fi8pqygq69PddL9vXaSLgP7qLlpsaqO5YL+IZsAAAAEc3dhcAAAAAAAAAAA";

// Fake assembled XDR — just needs to be non-empty to represent stale data
const STALE_ASSEMBLED_XDR = "STALE_ASSEMBLED_XDR_PLACEHOLDER";

const MOCK_TRANSACTION_DATA =
  "AAAAAAAAAAUAAAAAAAAAAEI+fQXy7K+/7BkrIVo/G+lq7bjY5wJUq+NBPgIH3layAAAABgAAAAFQRc1ewHKado/VrQJQWFLfTwKNzoMOWsUiCbpISDsvAQAAABQAAAABAAAABgAAAAF9H3zgWLymrKCrr0910v29dpIuA/uouWmxqo7lgv4hmwAAABQAAAABAAAABgAAAAHXkotywnA8z+r365/0701QSlWouXn8m0UOoshCtNHOYQAAABQAAAABAAAAB0rCp4XpzUPVfkGwEWAJ/P/1rsfXSQqmV88QO9jclRq+AAAACAAAAAAAAAAAIeXWF2xvrwgoULBjGH4PJNgAU089Bh5ch2XdUPm3/XQAAAAAAAAAAMwJGsOjTzw4CL/dwI16iaHPIxQi4W5zveD3yDEJrwyeAAAAAQAAAAAh5dYXbG+vCChQsGMYfg8k2ABTTz0GHlyHZd1Q+bf9dAAAAAFVU0RDAAAAAEI+fQXy7K+/7BkrIVo/G+lq7bjY5wJUq+NBPgIH3layAAAAAQAAAADMCRrDo088OAi/3cCNeomhzyMUIuFuc73g98gxCa8MngAAAAFVU0RDAAAAAEI+fQXy7K+/7BkrIVo/G+lq7bjY5wJUq+NBPgIH3layAAAABgAAAAAAAAAAIeXWF2xvrwgoULBjGH4PJNgAU089Bh5ch2XdUPm3/XQAAAAVcxcPT01pajcAAAAAAAAABgAAAAAAAAAAzAkaw6NPPDgIv93AjXqJoc8jFCLhbnO94PfIMQmvDJ4AAAAVXFBBAFX4RQgAAAAAAAAABgAAAAFQRc1ewHKado/VrQJQWFLfTwKNzoMOWsUiCbpISDsvAQAAABAAAAABAAAAAgAAAA8AAAAHQmFsYW5jZQAAAAASAAAAAX0ffOBYvKasoKuvT3XS/b12ki4D+6i5abGqjuWC/iGbAAAAAQAAAAYAAAAB15KLcsJwPM/q9+uf9O9NUEpVqLl5/JtFDqLIQrTRzmEAAAAQAAAAAQAAAAIAAAAPAAAAB0JhbGFuY2UAAAAAEgAAAAF9H3zgWLymrKCrr0910v29dpIuA/uouWmxqo7lgv4hmwAAAAEAJlGtAAAC/AAABLgAAAAAAAetVQ==";

/**
 * Build a store state where the simulate step was already completed —
 * assembledXdr is populated, representing a previous successful simulation.
 */
const buildStoreStateWithStaleAssembly = () => ({
  state: {
    activeStep: "simulate",
    highestCompletedStep: "simulate",
    build: {
      classic: { operations: [], xdr: "" },
      soroban: {
        operation: {
          operation_type: "invoke_contract_function",
          params: {},
          source_account: "",
        },
        xdr: MOCK_BUILT_XDR,
      },
      params: {
        source_account: "",
        fee: "100",
        seq_num: "",
        cond: { time: { min_time: "", max_time: "" } },
        memo: {},
      },
      error: { params: [], operations: [] },
      isValid: { params: true, operations: true },
    },
    simulate: {
      xdrFormat: "base64",
      authMode: "record",
      simulationResultJson: JSON.stringify({ result: {} }),
      authEntriesXdr: [],
      signedAuthEntriesXdr: [],
      assembledXdr: STALE_ASSEMBLED_XDR,
      isSimulationReadOnly: false,
      isValid: true,
    },
    sign: { signedXdr: "" },
    submit: { submitResultJson: "" },
    feeBump: { source_account: "", fee: "200", signedXdr: "", isEnabled: false },
  },
  version: 0,
});

const seedSessionStorageAndNavigate = async (page: Page) => {
  const storeState = buildStoreStateWithStaleAssembly();

  await page.goto(`${baseURL}/transaction/build`);

  await page.evaluate(
    (stateJson) => {
      sessionStorage.setItem("stellar_lab_tx_flow_build", stateJson);

      localStorage.setItem(
        "stellar_lab_network",
        JSON.stringify({
          id: "testnet",
          label: "Testnet",
          horizonUrl: "https://horizon-testnet.stellar.org",
          rpcUrl: "https://soroban-testnet.stellar.org",
          passphrase: "Test SDF Network ; September 2015",
        }),
      );
    },
    JSON.stringify(storeState),
  );

  await page.reload();
};

/**
 * Mock simulateTransaction to return a response with the given auth entries.
 */
const mockSimulateWithAuth = async (page: Page, authEntries: string[]) => {
  await page.route("https://soroban-testnet.stellar.org", async (route) => {
    const request = route.request();
    const postData = request.postDataJSON();

    if (postData?.method === "simulateTransaction") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          result: {
            transactionData: MOCK_TRANSACTION_DATA,
            minResourceFee: "503125",
            latestLedger: 1901916,
            results: [
              {
                auth: authEntries,
                xdr: "AAAAAQ==",
              },
            ],
          },
        }),
      });
    } else {
      await route.continue();
    }
  });
};

test.describe("Simulate Step — Re-simulation clears stale state", () => {
  test("Re-simulating clears stale assembledXdr so Next is disabled until auth entries are signed", async ({
    page,
  }) => {
    await mockSimulateWithAuth(page, [MOCK_AUTH_ENTRY_XDR]);
    await seedSessionStorageAndNavigate(page);

    // Precondition: Next button should be enabled because stale
    // assembledXdr exists from the previous simulation.
    const nextButton = page.locator('[data-position="right"]');
    await expect(nextButton).toBeEnabled();

    // Re-simulate
    const simulateButton = page.getByRole("button", {
      name: "Simulate",
      exact: true,
    });
    await simulateButton.click();

    // Wait for simulation result
    await expect(page.getByTestId("simulate-step-response")).toBeVisible();

    // Auth entries should be detected
    await expect(
      page.getByText(
        "This transaction requires additional authorization signatures",
      ),
    ).toBeVisible();

    // Next button should now be DISABLED because:
    // 1. assembledXdr was cleared at the start of re-simulation
    // 2. New auth entries need signing before assembly can happen
    await expect(nextButton).toBeDisabled();
  });
});

test.describe("Simulate Step — Source account auth entries skip signing", () => {
  test("All source account auth entries auto-assemble without showing the auth signing card", async ({
    page,
  }) => {
    await mockSimulateWithAuth(page, [MOCK_SOURCE_ACCOUNT_AUTH_ENTRY_XDR]);
    await seedSessionStorageAndNavigate(page);

    const simulateButton = page.getByRole("button", {
      name: "Simulate",
      exact: true,
    });
    await simulateButton.click();

    // Wait for simulation result
    await expect(page.getByTestId("simulate-step-response")).toBeVisible();

    // Auth signing card should NOT appear — source account entries are
    // authorized by the transaction envelope signature
    await expect(
      page.getByText(
        "This transaction requires additional authorization signatures",
      ),
    ).not.toBeVisible();

    // Next button should be ENABLED — auto-assembly happened
    const nextButton = page.locator('[data-position="right"]');
    await expect(nextButton).toBeEnabled();
  });

  test("Mixed entries: auth signing card shows, but only address entries need signing", async ({
    page,
  }) => {
    await mockSimulateWithAuth(page, [
      MOCK_SOURCE_ACCOUNT_AUTH_ENTRY_XDR,
      MOCK_AUTH_ENTRY_XDR,
    ]);
    await seedSessionStorageAndNavigate(page);

    const simulateButton = page.getByRole("button", {
      name: "Simulate",
      exact: true,
    });
    await simulateButton.click();

    // Wait for simulation result
    await expect(page.getByTestId("simulate-step-response")).toBeVisible();

    // Auth signing card SHOULD appear — there's an address credential entry
    await expect(
      page.getByText(
        "This transaction requires additional authorization signatures",
      ),
    ).toBeVisible();

    // Source account entry (#1) should be pre-signed, address entry (#2) unsigned
    const viewButton = page.getByRole("button", {
      name: "View auth entries",
    });
    await viewButton.click();

    await expect(page.getByText("Entry #1")).toBeVisible();
    await expect(page.getByText("Entry #2")).toBeVisible();

    // Entry #1 (source account) is pre-populated as Signed
    const entry1 = page.locator(".SorobanAuthSigning__entry").nth(0);
    await expect(entry1.getByText("Signed")).toBeVisible();

    // Entry #2 (address) still needs signing
    const entry2 = page.locator(".SorobanAuthSigning__entry").nth(1);
    await expect(entry2.getByText("Unsigned")).toBeVisible();

    // Next button should be DISABLED — address entry still needs signing
    const nextButton = page.locator('[data-position="right"]');
    await expect(nextButton).toBeDisabled();
  });
});
