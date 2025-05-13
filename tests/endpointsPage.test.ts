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
      const sidebar = page.getByTestId("sidebar-links");

      await expect(
        sidebar.getByTestId("endpoints-sidebar-linkToggle").nth(4),
      ).toContainText("RPC Methods");

      const horizonToggle = sidebar
        .getByTestId("endpoints-sidebar-linkToggle")
        .nth(5);

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
        .nth(5);

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

  test.describe("getLedgerEntries", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("http://localhost:3000/endpoints/rpc/get-ledger-entries");
      await expect(page.locator("h1")).toHaveText("getLedgerEntries");
    });

    test("Input switch", async ({ page }) => {
      const ledgerKeyXdrInput = page.getByLabel("Ledger Key XDR", {
        exact: true,
      });
      const ledgerKeySelect = page.getByLabel("Ledger Key", { exact: true });

      await expect(ledgerKeyXdrInput).toBeEnabled();
      await expect(ledgerKeySelect).toBeDisabled();

      // Switch inputs
      await page.getByText("Switch input").click();

      await expect(ledgerKeyXdrInput).toBeDisabled();
      await expect(ledgerKeySelect).toBeEnabled();
    });
  });
});
