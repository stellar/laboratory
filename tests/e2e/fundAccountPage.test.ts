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
    await expect(page.locator("#fund-public-key-input")).toHaveValue("");

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
    const publicKeyInput = page.locator("#fund-public-key-input");

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
    const publicKeyInput = page.locator("#fund-public-key-input");
    const getLumenButton = page
      .getByTestId("fundAccount-buttons")
      .getByText("Get lumens");

    await publicKeyInput.fill(
      "GB6D5E2HRVBD6QIOXCE6ILMUFQT45LMSZSKRZUCL4ZK6Q6GCNMTJ2E3C",
    );

    await expect(publicKeyInput).toHaveAttribute("aria-invalid", "false");
    await expect(getLumenButton).toBeEnabled();

    // Mock the friendbot api call
    await page.route(
      "*/**/?addr=GB6D5E2HRVBD6QIOXCE6ILMUFQT45LMSZSKRZUCL4ZK6Q6GCNMTJ2E3C",
      async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/hal+json",
        });
      },
    );

    // Ensure the listener is set up before the action that triggers the request
    const responsePromise = page.waitForResponse(
      (response) =>
        response.url().includes("?addr=") && response.status() === 200,
    );

    await getLumenButton.click();

    await responsePromise;

    const alertBox = page.getByText(/Successfully funded/);
    await expect(alertBox).toBeVisible();
  });

  test("Successfully funds a muxed account when clicking 'Get lumens' with a valid muxed address", async ({
    page,
  }) => {
    const publicKeyInput = page.locator("#fund-public-key-input");
    const getLumenButton = page
      .getByTestId("fundAccount-buttons")
      .getByText("Get lumens");

    await publicKeyInput.fill(
      "MBX6W44ISK6XTBDDJ5ND6KTJHLYEYHMR4SDG635NRARYVJ3G2YXGCAAAAAAAAAAAPP4NS",
    );

    await expect(publicKeyInput).toHaveAttribute("aria-invalid", "false");
    await expect(getLumenButton).toBeEnabled();

    // Muxed account notification with the correct base address
    const muxedNotification = page.locator(".Notification__message");
    await expect(muxedNotification).toBeVisible();
    await expect(muxedNotification).toHaveText(
      "The base account GBX6W44ISK6XTBDDJ5ND6KTJHLYEYHMR4SDG635NRARYVJ3G2YXGDT6Y will be funded.",
    );

    // Mock the friendbot api call
    await page.route(
      "*/**/?addr=GBX6W44ISK6XTBDDJ5ND6KTJHLYEYHMR4SDG635NRARYVJ3G2YXGDT6Y",
      async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/hal+json",
        });
      },
    );

    // Ensure the listener is set up before the action that triggers the request
    const responsePromise = page.waitForResponse(
      (response) =>
        response.url().includes("?addr=") && response.status() === 200,
    );

    await getLumenButton.click();

    await responsePromise;

    const alertBox = page.getByText(/Successfully funded/);
    await expect(alertBox).toBeVisible();
  });

  test("Gets an error when submitting 'Get lumens' with a public key that's already been funded", async ({
    page,
  }) => {
    const publicKeyInput = page.locator("#fund-public-key-input");
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
      "*/**/?addr=GBX6W44ISK6XTBDDJ5ND6KTJHLYEYHMR4SDG635NRARYVJ3G2YXGDT6Y",
      async (route) => {
        await route.fulfill({
          status: 400,
          contentType: "application/problem+json",
          body: JSON.stringify({ detail: "createAccountAlreadyExist" }),
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

    const alertBox = page.getByText(/This account is already funded/);
    await expect(alertBox).toBeVisible();
  });

  test("Gets an error with an invalid contract address in 'Public Key or Contract ID' field", async ({
    page,
  }) => {
    const publicKeyInput = page.locator("#fund-public-key-input");

    // Type in an invalid contract address (starts with C but wrong format)
    await publicKeyInput.fill("CINVALIDCONTRACTADDRESS");

    await expect(publicKeyInput).toHaveAttribute("aria-invalid", "true");
    await expect(
      page.getByTestId("fundAccount-buttons").getByText("Get lumens"),
    ).toBeDisabled();
  });

  test("Successfully funds a contract when clicking 'Get lumens' with a valid contract address", async ({
    page,
  }) => {
    const publicKeyInput = page.locator("#fund-public-key-input");
    const getLumenButton = page
      .getByTestId("fundAccount-buttons")
      .getByText("Get lumens");

    // Use a valid contract address (C...)
    await publicKeyInput.fill(
      "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC",
    );

    await expect(publicKeyInput).toHaveAttribute("aria-invalid", "false");
    await expect(getLumenButton).toBeEnabled();

    // Mock the friendbot api call
    await page.route(
      "*/**/?addr=CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC",
      async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/hal+json",
        });
      },
    );

    // Ensure the listener is set up before the action that triggers the request
    const responsePromise = page.waitForResponse(
      (response) =>
        response.url().includes("?addr=") && response.status() === 200,
    );

    await getLumenButton.click();

    await responsePromise;

    const alertBox = page.getByText(/Successfully funded/);
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

  test("I should see 'Switch Network' page on /account/fund", async ({
    page,
  }) => {
    await page.goto("http://localhost:3000/account/fund");

    await expect(page.locator("h1")).toHaveText(
      "Friendbot: fund a Futurenet or Testnet network account",
    );
  });
});
