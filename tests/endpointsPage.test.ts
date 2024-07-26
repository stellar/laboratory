import { test, expect } from "@playwright/test";

test.describe("Endpoints page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/endpoints");
  });

  test("Loads", async ({ page }) => {
    await expect(page.locator("h1")).toHaveText("Endpoints");
  });

  test("Renders info cards", async ({ page }) => {
    await expect(page.locator("h2")).toHaveText([
      "Stellar RPC Endpoints",
      "Horizon Endpoints",
    ]);
  });

  test.describe("Sidebar", () => {
    test("Renders Horizon endpoints", async ({ page }) => {
      const sidebar = page.getByTestId("endpoints-sidebar-section");

      await expect(
        sidebar.getByTestId("endpoints-sidebar-subtitle").nth(0),
      ).toContainText("RPC Endpoints");

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

    test("Expands dropdown on click with correct links", async ({ page }) => {
      const sidebar = page.getByTestId("endpoints-sidebar-section");
      const horizonDropdown = sidebar
        .getByTestId("endpoints-sidebar-linkToggle")
        .filter({ hasText: "Horizon Endpoints" });

      await horizonDropdown.click();

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

      await expect(docsLink).toContainText("View accounts documentation");
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

      await expect(docsLink).toContainText(
        "View effects for account documentation",
      );
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
});
