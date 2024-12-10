import { test, expect } from "@playwright/test";

test.describe("API Explorer page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/endpoints");
  });

  test("Loads", async ({ page }) => {
    await expect(page.locator("h1")).toHaveText("API Explorer");
  });

  test("Renders info cards", async ({ page }) => {
    await expect(page.locator("h2")).toHaveText([
      "Stellar RPC Methods",
      "Horizon Endpoints",
    ]);
  });

  test.describe("Sidebar", () => {
    test("Renders Horizon endpoints", async ({ page }) => {
      const sidebar = page.getByTestId("endpoints-sidebar-section");

      await expect(
        sidebar.getByTestId("endpoints-sidebar-subtitle").nth(0),
      ).toContainText("RPC Methods");

      await expect(
        sidebar.getByTestId("endpoints-sidebar-subtitle").nth(1),
      ).toContainText("Horizon Endpoints");

      const linkToggles = sidebar.getByTestId("endpoints-sidebar-linkToggle");

      await expect(linkToggles).toHaveCount(17);

      await expect(linkToggles).toContainText([
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
      const sidebar = page.getByTestId("endpoints-sidebar-section");

      const accountsLink = sidebar
        .getByTestId("endpoints-sidebar-linkToggle")
        .filter({ hasText: "Accounts" });

      const parent = sidebar.getByTestId(
        "endpoints-sidebar/endpoints/accounts",
      );
      await expect(parent).toBeVisible();

      const linksContainer = parent.getByTestId(
        "endpoints-sidebar-linksContainer",
      );

      await expect(linksContainer).toBeHidden();
      await accountsLink.click();
      await expect(linksContainer).toBeVisible();

      await expect(
        linksContainer.getByTestId("endpoints-sidebar-link"),
      ).toContainText(["All Accounts", "Single Account"]);

      await expect(
        linksContainer
          .getByTestId("endpoints-sidebar-link")
          .filter({ hasText: "All Accounts" }),
      ).toHaveAttribute("href", "/endpoints/accounts");
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
        "https://horizon-testnet.stellar.org/accounts/",
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
        "https://horizon-testnet.stellar.org/accounts/?sponsor=GBV6DGKNXELF3TYU4V3NRCF57Q3477KLUBBINVG5GGR3LJYVQPKPDX4C",
      );

      await page.getByLabel("Limit(optional)").fill("2");

      await expect(page.getByTestId("endpoints-url")).toHaveValue(
        "https://horizon-testnet.stellar.org/accounts/?sponsor=GBV6DGKNXELF3TYU4V3NRCF57Q3477KLUBBINVG5GGR3LJYVQPKPDX4C&limit=2",
      );
    });
  });

  test.describe("Effects for Account", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("http://localhost:3000/endpoints/effects/account");
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

  test("getLedgerEntries", async ({ page }) => {
    page.goto("http://localhost:3000/endpoints/rpc/get-ledger-entries");

    // XDR
    const ledgerKeyXdrInput = page.getByLabel("Ledger Key XDR");

    await expect(ledgerKeyXdrInput).toBeEnabled();
    await ledgerKeyXdrInput.fill(
      "AAAAAQAAAAAZCaG2HvD37MucM8Z4qhClE0XQWhEakEgovVIZfS+4JgAAAAFVU0RDAAAAAEI+fQXy7K+/7BkrIVo/G+lq7bjY5wJUq+NBPgIH3lay",
    );

    // Manual inputs
    const ledgerKeySelect = page.getByLabel("Ledger Key", { exact: true });
    const accountIdInput = page.getByLabel("Account ID", { exact: true });
    const assetCodeInput = page.getByLabel("Asset Code", { exact: true });
    const assetIssuerInput = page.getByLabel("Issuer Account ID", {
      exact: true,
    });

    await expect(ledgerKeySelect).toBeDisabled();
    await expect(accountIdInput).toBeDisabled();
    await expect(assetCodeInput).toBeDisabled();
    await expect(assetIssuerInput).toBeDisabled();

    await expect(ledgerKeySelect).toHaveValue("trustline");
    await expect(accountIdInput).toHaveValue(
      "GAMQTINWD3YPP3GLTQZ4M6FKCCSRGROQLIIRVECIFC6VEGL5F64CND22",
    );
    await expect(assetCodeInput).toHaveValue("USDC");
    await expect(assetIssuerInput).toHaveValue(
      "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5",
    );

    const assetPicker = page.getByTestId("asset-picker");
    // All asset options are disabled
    await expect(assetPicker.locator("[data-disabled='true']")).toHaveCount(4);
    // Alphanum4 checked
    await expect(assetPicker.locator("#credit_alphanum4-asset")).toBeChecked();

    // Switch inputs
    await page.getByText("Switch input").click();

    await expect(ledgerKeyXdrInput).toBeDisabled();

    await expect(ledgerKeySelect).toBeEnabled();
    await expect(accountIdInput).toBeEnabled();
    await expect(assetCodeInput).toBeEnabled();
    await expect(assetIssuerInput).toBeEnabled();
    await expect(assetPicker.locator("[data-disabled='true']")).toHaveCount(0);
  });
});
