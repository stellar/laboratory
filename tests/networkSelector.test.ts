import { test, expect } from "@playwright/test";

test.describe("Network selector", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/");
  });

  test("Defaults to Testnet", async ({ page }) => {
    await expect(page.getByTestId("networkSelector-button")).toHaveText(
      "Testnet",
    );
    await expect(page.getByTestId("networkSelector-dropdown")).toBeHidden();
  });

  test("Shows network dropdown with all selectable network options", async ({
    page,
  }) => {
    await page.getByTestId("networkSelector-button").click();
    await expect(page.getByTestId("networkSelector-dropdown")).toBeVisible();

    await expect(
      page
        .getByTestId("networkSelector-dropdown")
        .getByTestId("networkSelector-option"),
    ).toContainText(["Testnet", "Mainnet", "Futurenet", "Custom"]);
  });

  test("Shows correct network data for the selected network", async ({
    page,
  }) => {
    await page.getByTestId("networkSelector-button").click();
    await expect(page.getByTestId("networkSelector-dropdown")).toBeVisible();

    // Selected network option
    await expect(
      page
        .getByTestId("networkSelector-dropdown")
        .getByTestId("networkSelector-option")
        .filter({ has: page.getByText("Testnet") }),
    ).toContainText("Selected");

    // RPC URL
    const rpcField = page
      .getByTestId("networkSelector-dropdown")
      .locator("#rpc-url");
    await expect(rpcField).toHaveValue("https://soroban-testnet.stellar.org");
    await expect(rpcField).toBeEnabled();

    // Horizon URL
    const horizonUrlField = page
      .getByTestId("networkSelector-dropdown")
      .locator("#network-url");
    await expect(horizonUrlField).toHaveValue(
      "https://horizon-testnet.stellar.org",
    );
    await expect(horizonUrlField).toBeEnabled();

    // Network Passphrase
    const networkPassphraseField = page
      .getByTestId("networkSelector-dropdown")
      .locator("#network-passphrase");
    await expect(networkPassphraseField).toHaveValue(
      "Test SDF Network ; September 2015",
    );
    await expect(networkPassphraseField).toBeDisabled();

    // Submit button
    const submitButton = page.getByTestId("networkSelector-submit-button");
    await expect(submitButton).toHaveText("Switch to Testnet");
    await expect(submitButton).toBeDisabled();
  });

  test("Updates network data when a different network is selected", async ({
    page,
  }) => {
    await page.getByTestId("networkSelector-button").click();
    await expect(page.getByTestId("networkSelector-dropdown")).toBeVisible();

    // Selected Futurenet
    await page
      .getByTestId("networkSelector-dropdown")
      .getByTestId("networkSelector-option")
      .filter({ has: page.getByText("Futurenet") })
      .click();

    // RPC URL
    const rpcField = page
      .getByTestId("networkSelector-dropdown")
      .locator("#rpc-url");
    await expect(rpcField).toHaveValue("https://rpc-futurenet.stellar.org");
    await expect(rpcField).toBeEnabled();

    // Horizon URL
    const horizonUrlField = page
      .getByTestId("networkSelector-dropdown")
      .locator("#network-url");
    await expect(horizonUrlField).toHaveValue(
      "https://horizon-futurenet.stellar.org",
    );
    await expect(horizonUrlField).toBeEnabled();

    // Network Passphrase
    const networkPassphraseField = page
      .getByTestId("networkSelector-dropdown")
      .locator("#network-passphrase");
    await expect(networkPassphraseField).toHaveValue(
      "Test SDF Future Network ; October 2022",
    );
    await expect(networkPassphraseField).toBeDisabled();

    // Submit button
    const submitButton = page.getByTestId("networkSelector-submit-button");
    await expect(submitButton).toHaveText("Switch to Futurenet");
    await expect(submitButton).toBeEnabled();

    // Network not changed until the submit button is clicked
    await expect(page.getByTestId("networkSelector-button")).toHaveText(
      "Testnet",
    );

    // Click button to change the network
    await submitButton.click();
    await expect(page.getByTestId("networkSelector-button")).toHaveText(
      "Futurenet",
    );
  });

  test("Custom network inputs", async ({ page }) => {
    await page.getByTestId("networkSelector-button").click();
    await expect(page.getByTestId("networkSelector-dropdown")).toBeVisible();

    // Selected Custom network
    await page
      .getByTestId("networkSelector-dropdown")
      .getByTestId("networkSelector-option")
      .filter({ has: page.getByText("Custom") })
      .click();

    // RPC URL
    const rpcField = page
      .getByTestId("networkSelector-dropdown")
      .locator("#rpc-url");
    await expect(rpcField).toHaveValue("");
    await expect(rpcField).toBeEnabled();

    // Horizon URL
    const horizonUrlField = page
      .getByTestId("networkSelector-dropdown")
      .locator("#network-url");
    await expect(horizonUrlField).toHaveValue("");
    await expect(horizonUrlField).toBeEnabled();

    // Network Passphrase
    const networkPassphraseField = page
      .getByTestId("networkSelector-dropdown")
      .locator("#network-passphrase");
    await expect(networkPassphraseField).toHaveValue("");
    await expect(networkPassphraseField).toBeEnabled();

    // Submit button is disabled until inputs are filled
    const submitButton = page.getByTestId("networkSelector-submit-button");
    await expect(submitButton).toHaveText("Switch to Custom Network");
    await expect(submitButton).toBeDisabled();

    // Filled inputs and enabled submit button
    await rpcField.fill("https://custom.net");
    await horizonUrlField.fill("https://custom-horizon.net");
    await networkPassphraseField.fill("Custom network passphrase");
    await expect(submitButton).toBeEnabled();
  });

  test("Selects network from search params", async ({ page }) => {
    await page.goto(
      "http://localhost:3000/?$=network$id=futurenet&label=Futurenet&horizonUrl=https:////horizon-futurenet.stellar.org&rpcUrl=https:////rpc-futurenet.stellar.org&passphrase=Test%20SDF%20Future%20Network%20/;%20October%202022;;",
    );
    await expect(page.getByTestId("networkSelector-button")).toHaveText(
      "Futurenet",
    );
  });
});
