import { baseURL } from "../../playwright.config";
import { test, expect, Page } from "@playwright/test";

/**
 * E2E tests for Soroban auth entry detection and signing in the Simulate step
 * of the single-page transaction build flow.
 *
 * Strategy: Seed sessionStorage with a pre-built Soroban invoke transaction
 * at the simulate step, then mock the RPC simulateTransaction response to
 * return auth entries. This avoids needing to load wasm files or interact
 * with the build step.
 */

// A valid Soroban invokeHostFunction transaction XDR — atomic swap on testnet
const MOCK_BUILT_XDR =
  "AAAAAgAAAABehlCJLiX4z1uDtAEfSWKNdd8o4ToBBlBhd6irPT7lVgAAAMgAFrXYAAAAEwAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAGAAAAAAAAAABfR984Fi8pqygq69PddL9vXaSLgP7qLlpsaqO5YL+IZsAAAAEc3dhcAAAAAgAAAASAAAAAAAAAAAh5dYXbG+vCChQsGMYfg8k2ABTTz0GHlyHZd1Q+bf9dAAAABIAAAAAAAAAAMwJGsOjTzw4CL/dwI16iaHPIxQi4W5zveD3yDEJrwyeAAAAEgAAAAHXkotywnA8z+r365/0701QSlWouXn8m0UOoshCtNHOYQAAABIAAAABUEXNXsBymnaP1a0CUFhS308Cjc6DDlrFIgm6SEg7LwEAAAAKAAAAAAAAAAAAAAAAAAAACgAAAAoAAAAAAAAAAAAAAAAAAAAyAAAACgAAAAAAAAAAAAAAAAAAAGQAAAAKAAAAAAAAAAAAAAAAAAAABQAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";

// Valid SorobanAuthorizationEntry XDRs from an atomic swap simulation (2 entries)
const MOCK_AUTH_ENTRY_XDR_1 =
  "AAAAAQAAAAAAAAAAIeXWF2xvrwgoULBjGH4PJNgAU089Bh5ch2XdUPm3/XRzFw9PTWlqNwAAAAAAAAABAAAAAAAAAAF9H3zgWLymrKCrr0910v29dpIuA/uouWmxqo7lgv4hmwAAAARzd2FwAAAABAAAABIAAAAB15KLcsJwPM/q9+uf9O9NUEpVqLl5/JtFDqLIQrTRzmEAAAASAAAAAVBFzV7Acpp2j9WtAlBYUt9PAo3Ogw5axSIJukhIOy8BAAAACgAAAAAAAAAAAAAAAAAAAAoAAAAKAAAAAAAAAAAAAAAAAAAAMgAAAAEAAAAAAAAAAdeSi3LCcDzP6vfrn/TvTVBKVai5efybRQ6iyEK00c5hAAAACHRyYW5zZmVyAAAAAwAAABIAAAAAAAAAACHl1hdsb68IKFCwYxh+DyTYAFNPPQYeXIdl3VD5t/10AAAAEgAAAAF9H3zgWLymrKCrr0910v29dpIuA/uouWmxqo7lgv4hmwAAAAoAAAAAAAAAAAAAAAAAAAAKAAAAAA==";

const MOCK_AUTH_ENTRY_XDR_2 =
  "AAAAAQAAAAAAAAAAzAkaw6NPPDgIv93AjXqJoc8jFCLhbnO94PfIMQmvDJ5cUEEAVfhFCAAAAAAAAAABAAAAAAAAAAF9H3zgWLymrKCrr0910v29dpIuA/uouWmxqo7lgv4hmwAAAARzd2FwAAAABAAAABIAAAABUEXNXsBymnaP1a0CUFhS308Cjc6DDlrFIgm6SEg7LwEAAAASAAAAAdeSi3LCcDzP6vfrn/TvTVBKVai5efybRQ6iyEK00c5hAAAACgAAAAAAAAAAAAAAAAAAAGQAAAAKAAAAAAAAAAAAAAAAAAAABQAAAAEAAAAAAAAAAVBFzV7Acpp2j9WtAlBYUt9PAo3Ogw5axSIJukhIOy8BAAAACHRyYW5zZmVyAAAAAwAAABIAAAAAAAAAAMwJGsOjTzw4CL/dwI16iaHPIxQi4W5zveD3yDEJrwyeAAAAEgAAAAF9H3zgWLymrKCrr0910v29dpIuA/uouWmxqo7lgv4hmwAAAAoAAAAAAAAAAAAAAAAAAABkAAAAAA==";

const buildStoreState = () => ({
  state: {
    activeStep: "simulate",
    highestCompletedStep: "build",
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
      xdrFormat: "json",
      authMode: "record",
      simulationResultJson: "",
      authEntriesXdr: [],
      signedAuthEntriesXdr: [],
      isValid: false,
    },
    sign: { signedXdr: "" },
    submit: { submitResultJson: "" },
    feeBump: { source_account: "", fee: "200", signedXdr: "", isEnabled: false },
  },
  version: 0,
});

const seedSessionStorageAndNavigate = async (page: Page) => {
  const storeState = buildStoreState();

  // Navigate first so sessionStorage is on the correct origin
  await page.goto(`${baseURL}/transaction/build`);

  await page.evaluate(
    (stateJson) => {
      sessionStorage.setItem("stellar_lab_tx_flow_build", stateJson);

      // Seed localStorage with testnet so the NetworkSelector doesn't open
      // a "Load Network" modal on reload (CI has no saved network).
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
 * Mock simulateTransaction to return a response WITH auth entries.
 * Both json and base64 format requests are handled since the component
 * fires two parallel requests.
 */
const mockSimulateWithAuthEntries = async (page: Page) => {
  await page.route("https://soroban-testnet.stellar.org", async (route) => {
    const request = route.request();
    const postData = request.postDataJSON();

    if (postData?.method === "simulateTransaction") {
      const responseBody = {
        jsonrpc: "2.0",
        id: 1,
        result: {
          transactionData:
            "AAAAAAAAAAUAAAAAAAAAAEI+fQXy7K+/7BkrIVo/G+lq7bjY5wJUq+NBPgIH3layAAAABgAAAAFQRc1ewHKado/VrQJQWFLfTwKNzoMOWsUiCbpISDsvAQAAABQAAAABAAAABgAAAAF9H3zgWLymrKCrr0910v29dpIuA/uouWmxqo7lgv4hmwAAABQAAAABAAAABgAAAAHXkotywnA8z+r365/0701QSlWouXn8m0UOoshCtNHOYQAAABQAAAABAAAAB0rCp4XpzUPVfkGwEWAJ/P/1rsfXSQqmV88QO9jclRq+AAAACAAAAAAAAAAAIeXWF2xvrwgoULBjGH4PJNgAU089Bh5ch2XdUPm3/XQAAAAAAAAAAMwJGsOjTzw4CL/dwI16iaHPIxQi4W5zveD3yDEJrwyeAAAAAQAAAAAh5dYXbG+vCChQsGMYfg8k2ABTTz0GHlyHZd1Q+bf9dAAAAAFVU0RDAAAAAEI+fQXy7K+/7BkrIVo/G+lq7bjY5wJUq+NBPgIH3layAAAAAQAAAADMCRrDo088OAi/3cCNeomhzyMUIuFuc73g98gxCa8MngAAAAFVU0RDAAAAAEI+fQXy7K+/7BkrIVo/G+lq7bjY5wJUq+NBPgIH3layAAAABgAAAAAAAAAAIeXWF2xvrwgoULBjGH4PJNgAU089Bh5ch2XdUPm3/XQAAAAVcxcPT01pajcAAAAAAAAABgAAAAAAAAAAzAkaw6NPPDgIv93AjXqJoc8jFCLhbnO94PfIMQmvDJ4AAAAVXFBBAFX4RQgAAAAAAAAABgAAAAFQRc1ewHKado/VrQJQWFLfTwKNzoMOWsUiCbpISDsvAQAAABAAAAABAAAAAgAAAA8AAAAHQmFsYW5jZQAAAAASAAAAAX0ffOBYvKasoKuvT3XS/b12ki4D+6i5abGqjuWC/iGbAAAAAQAAAAYAAAAB15KLcsJwPM/q9+uf9O9NUEpVqLl5/JtFDqLIQrTRzmEAAAAQAAAAAQAAAAIAAAAPAAAAB0JhbGFuY2UAAAAAEgAAAAF9H3zgWLymrKCrr0910v29dpIuA/uouWmxqo7lgv4hmwAAAAEAJlGtAAAC/AAABLgAAAAAAAetVQ==",
          minResourceFee: "503125",
          latestLedger: 1901916,
          results: [
            {
              auth: [MOCK_AUTH_ENTRY_XDR_1, MOCK_AUTH_ENTRY_XDR_2],
              xdr: "AAAAAQ==",
            },
          ],
        },
      };

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(responseBody),
      });
    } else {
      await route.continue();
    }
  });
};

/**
 * Mock simulateTransaction to return a response WITHOUT auth entries
 * (no results[].auth array).
 */
const mockSimulateWithoutAuthEntries = async (page: Page) => {
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
            transactionData:
              "AAAAAAAAAAUAAAAAAAAAAEI+fQXy7K+/7BkrIVo/G+lq7bjY5wJUq+NBPgIH3layAAAABgAAAAFQRc1ewHKado/VrQJQWFLfTwKNzoMOWsUiCbpISDsvAQAAABQAAAABAAAABgAAAAF9H3zgWLymrKCrr0910v29dpIuA/uouWmxqo7lgv4hmwAAABQAAAABAAAABgAAAAHXkotywnA8z+r365/0701QSlWouXn8m0UOoshCtNHOYQAAABQAAAABAAAAB0rCp4XpzUPVfkGwEWAJ/P/1rsfXSQqmV88QO9jclRq+AAAACAAAAAAAAAAAIeXWF2xvrwgoULBjGH4PJNgAU089Bh5ch2XdUPm3/XQAAAAAAAAAAMwJGsOjTzw4CL/dwI16iaHPIxQi4W5zveD3yDEJrwyeAAAAAQAAAAAh5dYXbG+vCChQsGMYfg8k2ABTTz0GHlyHZd1Q+bf9dAAAAAFVU0RDAAAAAEI+fQXy7K+/7BkrIVo/G+lq7bjY5wJUq+NBPgIH3layAAAAAQAAAADMCRrDo088OAi/3cCNeomhzyMUIuFuc73g98gxCa8MngAAAAFVU0RDAAAAAEI+fQXy7K+/7BkrIVo/G+lq7bjY5wJUq+NBPgIH3layAAAABgAAAAAAAAAAIeXWF2xvrwgoULBjGH4PJNgAU089Bh5ch2XdUPm3/XQAAAAVcxcPT01pajcAAAAAAAAABgAAAAAAAAAAzAkaw6NPPDgIv93AjXqJoc8jFCLhbnO94PfIMQmvDJ4AAAAVXFBBAFX4RQgAAAAAAAAABgAAAAFQRc1ewHKado/VrQJQWFLfTwKNzoMOWsUiCbpISDsvAQAAABAAAAABAAAAAgAAAA8AAAAHQmFsYW5jZQAAAAASAAAAAX0ffOBYvKasoKuvT3XS/b12ki4D+6i5abGqjuWC/iGbAAAAAQAAAAYAAAAB15KLcsJwPM/q9+uf9O9NUEpVqLl5/JtFDqLIQrTRzmEAAAAQAAAAAQAAAAIAAAAPAAAAB0JhbGFuY2UAAAAAEgAAAAF9H3zgWLymrKCrr0910v29dpIuA/uouWmxqo7lgv4hmwAAAAEAJlGtAAAC/AAABLgAAAAAAAetVQ==",
            minResourceFee: "93373",
            cost: {
              cpuInsns: "12345678",
              memBytes: "654321",
            },
            latestLedger: 567838,
          },
        }),
      });
    } else {
      await route.continue();
    }
  });
};

test.describe("Soroban Auth Entry Detection and Signing", () => {
  test.describe("Auth entry detection after simulation", () => {
    test("Shows auth signing card when simulation returns auth entries", async ({
      page,
    }) => {
      await mockSimulateWithAuthEntries(page);
      await seedSessionStorageAndNavigate(page);

      const simulateButton = page.getByRole("button", { name: "Simulate", exact: true });
      await simulateButton.click();

      // Wait for simulation result
      await expect(
        page.getByTestId("simulate-step-response"),
      ).toBeVisible();

      // Auth signing card should appear
      await expect(
        page.getByText(
          "This transaction requires additional authorization signatures",
        ),
      ).toBeVisible();

      await expect(
        page.getByText("2 authorization entries detected"),
      ).toBeVisible();
    });

    test("Does not show auth signing card when simulation has no auth entries", async ({
      page,
    }) => {
      await mockSimulateWithoutAuthEntries(page);
      await seedSessionStorageAndNavigate(page);

      const simulateButton = page.getByRole("button", { name: "Simulate", exact: true });
      await simulateButton.click();

      // Wait for simulation result
      await expect(
        page.getByTestId("simulate-step-response"),
      ).toBeVisible();

      // Auth signing card should NOT appear
      await expect(
        page.getByText(
          "This transaction requires additional authorization signatures",
        ),
      ).not.toBeVisible();
    });
  });

  test.describe("Auth signing card interaction", () => {
    test("Expands auth entries when clicking 'View auth entries'", async ({
      page,
    }) => {
      await mockSimulateWithAuthEntries(page);
      await seedSessionStorageAndNavigate(page);

      const simulateButton = page.getByRole("button", { name: "Simulate", exact: true });
      await simulateButton.click();

      await expect(
        page.getByText(
          "This transaction requires additional authorization signatures",
        ),
      ).toBeVisible();

      // Click to expand
      const viewButton = page.getByRole("button", {
        name: "View auth entries",
      });
      await viewButton.click();

      // Sign mode radios should be visible
      await expect(page.getByLabel("Sign all entries")).toBeVisible();
      await expect(page.getByLabel("Sign individually")).toBeVisible();

      // Entry should be listed
      await expect(page.getByText("Entry #1")).toBeVisible();
    });

    test("Defaults to 'Sign all entries' mode", async ({ page }) => {
      await mockSimulateWithAuthEntries(page);
      await seedSessionStorageAndNavigate(page);

      const simulateButton = page.getByRole("button", { name: "Simulate", exact: true });
      await simulateButton.click();

      await expect(
        page.getByText(
          "This transaction requires additional authorization signatures",
        ),
      ).toBeVisible();

      const viewButton = page.getByRole("button", {
        name: "View auth entries",
      });
      await viewButton.click();

      // "Sign all entries" should be checked by default
      const signAllRadio = page.getByLabel("Sign all entries");
      await expect(signAllRadio).toBeChecked();
    });

    test("Can switch to 'Sign individually' mode", async ({ page }) => {
      await mockSimulateWithAuthEntries(page);
      await seedSessionStorageAndNavigate(page);

      const simulateButton = page.getByRole("button", { name: "Simulate", exact: true });
      await simulateButton.click();

      await expect(
        page.getByText(
          "This transaction requires additional authorization signatures",
        ),
      ).toBeVisible();

      const viewButton = page.getByRole("button", {
        name: "View auth entries",
      });
      await viewButton.click();

      // Switch to individual mode — click the label because the SDS
      // RadioButton has a custom span overlay that intercepts pointer events
      await page.locator('label[for="sign-mode-individual"]').click();
      await expect(page.getByLabel("Sign individually")).toBeChecked();
    });
  });

  test.describe("Auth mode picker", () => {
    test("Shows auth mode selector for invoke contract operations", async ({
      page,
    }) => {
      await seedSessionStorageAndNavigate(page);

      // Auth mode picker should be visible for invoke_contract_function
      const authModeSelect = page.locator("#simulate-auth-mode");
      await expect(authModeSelect).toBeVisible();
    });
  });
});
