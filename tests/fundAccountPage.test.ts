import { test, expect } from "@playwright/test";

test.describe("[futurenet/testnet] Fund Account Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/account/fund");
  });

  test("Shows testnet network in the title by default", async ({ page }) => {
    await expect(page.getByTestId("networkSelector-button")).toHaveText(
      "Testnet",
    );
    await expect(page.locator("h1")).toHaveText(
      "Friendbot: fund a testnet network account",
    );
  });

  test("Shows futurenet network in the title if I change my network to futurenet", async ({
    page,
  }) => {
    // Click network selector dropdown button
    await page.getByTestId("networkSelector-button").click();
    await expect(page.getByTestId("networkSelector-dropdown")).toBeVisible();

    // Select Futurenet in the dropdown list
    await page
      .getByTestId("networkSelector-dropdown")
      .getByTestId("networkSelector-option")
      .filter({ has: page.getByText("Futurenet") })
      .click();

    // Network Submit button
    const submitButton = page.getByTestId("networkSelector-submit-button");

    // Select 'Futurenet' in the network dropdown list
    await expect(submitButton).toHaveText("Switch to Futurenet");
    await expect(submitButton).toBeEnabled();

    // Click 'Switch to Futurenet' button
    await submitButton.click();

    await expect(page.getByTestId("networkSelector-button")).toHaveText(
      "Futurenet",
    );
    await expect(page.locator("h1")).toHaveText(
      "Friendbot: fund a futurenet network account",
    );
  });

  test("By default, 'Public Key' input field is empty and buttons are disabled", async ({
    page,
  }) => {
    await expect(page.locator("#generate-keypair-publickey")).toHaveValue("");

    const getLumenButton = page
      .getByTestId("fundAccount-buttons")
      .getByText("Get lumens");
    const fillInButton = page
      .getByTestId("fundAccount-buttons")
      .getByText("Fill in with generated key");

    await expect(getLumenButton).toBeDisabled();
    await expect(fillInButton).toBeDisabled();
  });

  test("Gets an error with an invalid public key in 'Public Key' field", async ({
    page,
  }) => {
    const publicKeyInput = page.locator("#generate-keypair-publickey");

    // Type in an invalid string in 'Public Key' input field
    await publicKeyInput.fill("XLKDSFJLSKDJF");

    await expect(publicKeyInput).toHaveAttribute("aria-invalid", "true");
    await expect(
      page.getByTestId("fundAccount-buttons").getByText("Get lumens"),
    ).toBeDisabled();
  });

  test("Successfully funds an account when clicking 'Get lumens' with a valid public key", async ({
    page,
  }) => {
    // Get a new public key
    const publicKey =
      "GDVOT2ALMUF3G54RBHNJUEV6LOAZCQQCARHEVNUPKGMVPWFC4PFN33QR";
    const publicKeyInput = page.locator("#generate-keypair-publickey");
    const getLumenButton = page
      .getByTestId("fundAccount-buttons")
      .getByText("Get lumens");

    // Type in an invalid string in 'Public Key' input field
    await publicKeyInput.fill(publicKey);

    await expect(publicKeyInput).toHaveAttribute("aria-invalid", "false");
    await expect(getLumenButton).toBeEnabled();

    // Mock the friendbot api call
    await page.route(
      "*/**/friendbot?addr=GDVOT2ALMUF3G54RBHNJUEV6LOAZCQQCARHEVNUPKGMVPWFC4PFN33QR",
      async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({}),
        });
      },
    );

    // Ensure the listener is set up before the action that triggers the request
    const responsePromise = page.waitForResponse(
      (response) =>
        response.url().includes("?addr=") && response.status() === 200,
    );

    await getLumenButton.click();

    // Wait for the mocked response
    await responsePromise;

    // Success <Alert/> is visible
    const alertBox = page.getByText(/Successfully funded/);
    console.log("alertBox: ", alertBox);
    await expect(alertBox).toBeVisible();
  });

  test("Gets an error when submitting 'Get lumens' with a public key that's already been funded", async ({
    page,
  }) => {
    const publicKeyInput = page.locator("#generate-keypair-publickey");
    const getLumenButton = page
      .getByTestId("fundAccount-buttons")
      .getByText("Get lumens");

    // Type in an invalid string in 'Public Key' input field
    await publicKeyInput.fill(
      "GBX6W44ISK6XTBDDJ5ND6KTJHLYEYHMR4SDG635NRARYVJ3G2YXGDT6Y",
    );

    await expect(publicKeyInput).toHaveAttribute("aria-invalid", "false");
    await expect(getLumenButton).toBeEnabled();

    // Mock the friendbot api call
    await page.route(
      "*/**/?addr=GDVOT2ALMUF3G54RBHNJUEV6LOAZCQQCARHEVNUPKGMVPWFC4PFN33QR",
      async (route) => {
        await route.fulfill({
          status: 400,
          contentType: "application/json",
          body: JSON.stringify({}),
        });
      },
    );

    // Ensure the listener is set up before the action that triggers the request
    const responsePromise = page.waitForResponse(
      (response) =>
        response.url().includes("?addr=") && response.status() === 400,
    );

    await getLumenButton.click();

    await responsePromise;

    const alertBox = page.getByText(/Unable to fund/);
    await expect(alertBox).toBeVisible();
  });

  // @TODO when we work on the button disabled for funding account from mainnet
  //   test("if I switch to 'mainnet' network, I should see 'Not Found' page and no 'Fund account' sidebar", async ({
  //     page,
  //   }) => {
  //     // Click network selector dropdown button
  //     await page.getByTestId("networkSelector-button").click();
  //     await expect(page.getByTestId("networkSelector-dropdown")).toBeVisible();

  //     // Select Mainnet in the dropdown list
  //     await page
  //       .getByTestId("networkSelector-dropdown")
  //       .getByTestId("networkSelector-option")
  //       .filter({ has: page.getByText("Mainnet") })
  //       .click();

  //     // Network Submit button
  //     const submitButton = page.getByTestId("networkSelector-submit-button");

  //     // Select 'Mainnet' in the network dropdown list
  //     await expect(submitButton).toHaveText("Switch to Mainnet");
  //     await expect(submitButton).toBeEnabled();

  //     // Click 'Switch to Mainnet' button
  //     await submitButton.click();

  //     await expect(page.getByTestId("networkSelector-button")).toHaveText(
  //       "Mainnet",
  //     );
});

test.describe("[mainnet] Fund Account Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/account");

    // Switch to mainnet network
    await page.getByTestId("networkSelector-button").click();
    await expect(page.getByTestId("networkSelector-dropdown")).toBeVisible();

    // Select Mainnet in the dropdown list
    await page
      .getByTestId("networkSelector-dropdown")
      .getByTestId("networkSelector-option")
      .filter({ has: page.getByText("Mainnet") })
      .click();

    // Network Submit button
    const submitButton = page.getByTestId("networkSelector-submit-button");

    // Click 'Switch to Mainnet' button
    await submitButton.click();

    await expect(page.getByTestId("networkSelector-button")).toHaveText(
      "Mainnet",
    );
  });

  test("I should see 'Not Found' on /account/fund", async ({ page }) => {
    await page.goto("http://localhost:3000/account/fund");

    await expect(page.locator("h2")).toHaveText("Not Found");
  });
});
