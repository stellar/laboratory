import { test, expect } from "@playwright/test";

test.describe("API Explorer page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/endpoints");
  });

  test("Loads", async ({ page }) => {
    await expect(page.locator("h1")).toHaveText("API Explorer");
  });

  test.describe("Introduction", () => {
    test("Renders About RPC Methods section", async ({ page }) => {
      const section = page.locator(".Lab__home__content").nth(1);
      await expect(section.locator("h2")).toHaveText("About RPC Methods");

      const cards = section.locator(".Endpoints__introCard h3");
      await expect(cards).toHaveCount(3);
      await expect(cards).toContainText([
        "RPC Query Methods",
        "Simulation & Fees",
        "Transaction Execution",
      ]);
    });

    test("Renders Save & Sharing section", async ({ page }) => {
      const section = page.locator(".Lab__home__content").nth(2);
      await expect(section.locator("h2")).toHaveText("Save & Sharing");
    });

    test("Renders About Horizon Endpoints section", async ({ page }) => {
      const section = page.locator(".Lab__home__content").nth(3);
      const card = section.locator(".Endpoints__introCard h3");

      await expect(card).toHaveText("Horizon");
    });
  });

  test.describe("Sidebar", () => {
    test("Renders Horizon endpoints", async ({ page }) => {
      const sidebar = page.getByTestId("sidebar-links");

      await expect(
        sidebar.getByTestId("endpoints-sidebar-linkToggle").nth(5),
      ).toContainText("RPC Methods");

      const horizonToggle = sidebar
        .getByTestId("endpoints-sidebar-linkToggle")
        .nth(6);

      await expect(horizonToggle).toContainText("Horizon Endpoints");
      await horizonToggle.click();

      const horizonLinks = sidebar.getByTestId(
        /^endpoints-sidebar\/endpoints\/horizon\/.*$/,
      );

      await expect(horizonLinks).toHaveCount(15);

      await expect(horizonLinks).toContainText([
        "Accounts",
        "Assets",
        "Claimable Balances",
        "Effects",
        "Fee Stats",
        "Ledgers",
        "Liquidity Pools",
        "Offers",
        "Operations",
        "Order Book",
        "Paths",
        "Payments",
        "Trade Aggregations",
        "Trades",
        "Transactions",
      ]);
    });

    test("Dropdown shows correct links on page load", async ({ page }) => {
      await page.goto(
        "http://localhost:3000/endpoints/horizon/accounts/single",
      );
      const sidebar = page.getByTestId("sidebar-links");

      const horizonToggle = sidebar
        .getByTestId("endpoints-sidebar-linkToggle")
        .nth(6);

      await expect(horizonToggle).toHaveAttribute(
        "data-is-active-parent",
        "true",
      );

      const accountsLink = sidebar
        .getByTestId("endpoints-sidebar/endpoints/horizon/accounts")
        .getByTestId("endpoints-sidebar-linkToggle");

      await expect(accountsLink).toHaveAttribute(
        "data-is-active-parent",
        "true",
      );

      const singleAccountLink = sidebar
        .getByTestId("endpoints-sidebar-link")
        .filter({ hasText: "Single Account" });

      await expect(singleAccountLink).toHaveAttribute("data-is-active", "true");
      await expect(singleAccountLink).toBeInViewport();
    });
  });

  test.describe("All Accounts", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("http://localhost:3000/endpoints/accounts");
    });

    test("Page loads with correct title and view docs link", async ({
      page,
    }) => {
      await expect(page.locator("h1")).toHaveText("All Accounts");

      const docsLink = page.getByTestId("endpoints-docsLink");

      await expect(docsLink).toContainText("View Docs");
      await expect(docsLink).toHaveAttribute(
        "href",
        "https://developers.stellar.org/network/horizon/resources/list-all-accounts",
      );
    });

    test("URL and buttons have correct defaults", async ({ page }) => {
      await expect(page.getByTestId("endpoints-url")).toHaveValue(
        "https://horizon-testnet.stellar.org/accounts",
      );
      await expect(page.getByTestId("endpoints-url-method")).toContainText(
        "GET",
      );
      await expect(page.getByTestId("endpoints-submitBtn")).toBeEnabled();
    });

    test("URL updates when inputs change", async ({ page }) => {
      await page
        .getByLabel("Sponsor(optional)")
        .fill("GBV6DGKNXELF3TYU4V3NRCF57Q3477KLUBBINVG5GGR3LJYVQPKPDX4C");

      await expect(page.getByTestId("endpoints-url")).toHaveValue(
        "https://horizon-testnet.stellar.org/accounts?sponsor=GBV6DGKNXELF3TYU4V3NRCF57Q3477KLUBBINVG5GGR3LJYVQPKPDX4C",
      );

      await page.getByLabel("Limit(optional)").fill("2");

      await expect(page.getByTestId("endpoints-url")).toHaveValue(
        "https://horizon-testnet.stellar.org/accounts?sponsor=GBV6DGKNXELF3TYU4V3NRCF57Q3477KLUBBINVG5GGR3LJYVQPKPDX4C&limit=2",
      );
    });
  });

  test.describe("Effects for Account", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(
        "http://localhost:3000/endpoints/horizon/effects/account",
      );
    });

    test("Page loads with correct title and view docs link", async ({
      page,
    }) => {
      await expect(page.locator("h1")).toHaveText("Effects for Account");

      const docsLink = page.getByTestId("endpoints-docsLink");

      await expect(docsLink).toContainText("View Docs");
      await expect(docsLink).toHaveAttribute(
        "href",
        "https://developers.stellar.org/network/horizon/resources/get-effects-by-account-id",
      );
    });

    test("URL and buttons have correct defaults", async ({ page }) => {
      await expect(page.getByTestId("endpoints-url")).toHaveValue(
        "https://horizon-testnet.stellar.org/accounts//effects",
      );
      await expect(page.getByTestId("endpoints-url-method")).toContainText(
        "GET",
      );
      await expect(page.getByTestId("endpoints-submitBtn")).toBeDisabled();
    });

    test("Filling required field enables submit button", async ({ page }) => {
      const accountInput = page.getByLabel("Account ID");
      await accountInput.fill(
        "GAXELIT3WH4ALN66AYQAZILPSSZVIQV67R62FACYC6DHNZCLCN45CA2A",
      );

      await expect(accountInput).toHaveAttribute("aria-invalid", "false");
      await expect(page.getByTestId("endpoints-url")).toHaveValue(
        "https://horizon-testnet.stellar.org/accounts/GAXELIT3WH4ALN66AYQAZILPSSZVIQV67R62FACYC6DHNZCLCN45CA2A/effects",
      );
      await expect(page.getByTestId("endpoints-submitBtn")).toBeEnabled();
    });

    test("Input with error disables submit button", async ({ page }) => {
      const accountInput = page.getByLabel("Account ID");
      await accountInput.fill("abc");

      await expect(accountInput).toHaveAttribute("aria-invalid", "true");
      await expect(page.getByTestId("endpoints-pageContent")).toContainText(
        "Public key is invalid.",
      );
      await expect(page.getByTestId("endpoints-submitBtn")).toBeDisabled();
    });
  });

  test.describe("[RPC Methods] getLedgerEntries", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("http://localhost:3000/endpoints/rpc/get-ledger-entries");
      await page.waitForSelector("h1", { timeout: 5000 });
      await expect(page.locator("h1")).toHaveText("getLedgerEntries");
    });

    test("'Liquidity Pool ID' in 'Select Ledger Key' Tab", async ({ page }) => {
      const ledgerKeyTab = page.getByTestId("ledgerKey");
      await expect(ledgerKeyTab).toHaveAttribute("data-is-active", "true");

      const selectDropdown = page.getByLabel("Ledger Key Type");

      await selectDropdown.click();
      const options = await selectDropdown.locator("option").allTextContents();
      expect(options).toEqual([
        "Select a key",
        "Account",
        "Trustline",
        "Offer",
        "Data",
        "Claimable Balance",
        "Liquidity Pool",
        "Contract Data",
        "Contract Code",
        "Config Setting",
        "TTL",
      ]);

      await selectDropdown.selectOption("liquidity_pool");
      await expect(selectDropdown).toHaveValue("liquidity_pool");

      const ledgerKeyXdrView = page.getByLabel("Ledger Key XDR");

      await expect(ledgerKeyXdrView).toBeVisible();
      await expect(ledgerKeyXdrView).toBeDisabled();

      const liquidityPoolInput = page.getByLabel("Liquidity Pool ID");
      await liquidityPoolInput.fill(
        "LBTSMDCMDAD3EYX7QUNQUP7BIEMUSNV3AIK3F53UI7Y56EMZR2V3SREB",
      );
      await expect(ledgerKeyXdrView).toHaveValue(
        "AAAABWcmDEwYB7Ji/4UbCj/hQRlJNrsCFbL3dEfx3xGZjqu5",
      );
    });

    test("'Contract Data' in 'Use Ledger XDR' Tab", async ({ page }) => {
      const ledgerXdrTab = page.getByTestId("xdr");
      await ledgerXdrTab.click();
      await expect(ledgerXdrTab).toHaveAttribute("data-is-active", "true");

      const ledgerKeyXdrView = page.getByLabel("Ledger Key XDR");
      await ledgerKeyXdrView.fill(
        "AAAABgAAAAFO2E1JH/0O9mhqJ7e9+wqWhSIEu+cN6NSlPo2I4R9SQQAAABAAAAABAAAAAgAAAA8AAAAHQmFsYW5jZQAAAAASAAAAAcZvjW60jxxDR7GyTPKTj9b5qKU7dwoKWSXdZzwRY5t/AAAAAQ==",
      );

      const contractInput = page.getByLabel("Contract");
      await expect(contractInput).toBeDisabled();
      await expect(contractInput).toHaveValue(
        "CBHNQTKJD76Q55TINIT3PPP3BKLIKIQEXPTQ32GUUU7I3CHBD5JECZLW",
      );
      const keyInput = page.getByLabel("Key (ScVal)");
      const stringifiedScVal = JSON.stringify(
        {
          vec: [
            {
              symbol: "Balance",
            },
            {
              address:
                "CDDG7DLOWSHRYQ2HWGZEZ4UTR7LPTKFFHN3QUCSZEXOWOPARMONX6T65",
            },
          ],
        },
        null,
        2,
      );
      await expect(keyInput).toBeDisabled();
      await expect(keyInput).toHaveValue(stringifiedScVal);

      const durabilityInput = page.locator("#persistent-durability-type");
      await expect(durabilityInput).toBeChecked();
    });
  });
});
