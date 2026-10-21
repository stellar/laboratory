import { baseURL } from "../../playwright.config";
import { expect, Page, test } from "@playwright/test";

/**
 * Smart contract list: tab-row search, asset class filter, page reset on
 * search, and the Recent tab (StellarExpert list API, mocked).
 */

const CONTRACT_LIST_URL = `${baseURL}/smart-contracts/contract-list`;
const SE_CONTRACT_LIST_URL = "https://api.stellar.expert/explorer/*/contract?*";

const switchToMainnet = async (page: Page) => {
  await page.getByTestId("networkSelector-button").click();
  await expect(page.getByTestId("networkSelector-dropdown")).toBeVisible();

  await page
    .getByTestId("networkSelector-dropdown")
    .getByTestId("networkSelector-option")
    .filter({ has: page.getByText("Mainnet") })
    .click();

  await page.getByTestId("networkSelector-submit-button").click();

  await expect(page.getByTestId("networkSelector-button")).toHaveText(
    "Mainnet",
  );
};

const search = (page: Page) => page.locator("#contract-list-search");
const tableRows = (page: Page, tableId: string) =>
  page.getByTestId(`${tableId}-table`).locator("tbody tr");
const nextPage = (page: Page) =>
  page.getByRole("button", { name: "Next page" });
const prevPage = (page: Page) =>
  page.getByRole("button", { name: "Previous page" });

test.describe("Smart contract list (mainnet)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(CONTRACT_LIST_URL);
    await switchToMainnet(page);
  });

  test("Loads with DeFi, Known assets, and Recent tabs", async ({ page }) => {
    await expect(page.locator("h1")).toHaveText("Smart contract list");
    await expect(page.getByTestId("defi")).toBeVisible();
    await expect(page.getByTestId("known-assets")).toBeVisible();
    await expect(page.getByTestId("recent")).toBeVisible();
    await expect(search(page)).toBeVisible();
  });

  test("DeFi: search filters by name", async ({ page }) => {
    const rows = tableRows(page, "popular-contracts-list");

    await expect(rows).toHaveCount(20);

    await search(page).fill("blend");

    await expect(rows).toHaveCount(5);
    await expect(rows.first()).toContainText("Blend");

    await search(page).fill("zzzz");

    await expect(
      page.getByText("No contracts match your search"),
    ).toBeVisible();
    await expect(page.getByTestId("popular-contracts-list-table")).toBeHidden();
  });

  test("DeFi: searching from page 2 shows results from page 1", async ({
    page,
  }) => {
    const rows = tableRows(page, "popular-contracts-list");

    await nextPage(page).click();
    await expect(rows).toHaveCount(7);
    await expect(prevPage(page)).toBeEnabled();

    await search(page).fill("blend");

    await expect(rows).toHaveCount(5);
    await expect(rows.first()).toContainText("Blend");
    // One page of results: no pagination controls
    await expect(nextPage(page)).toBeHidden();
  });

  test("Known assets: search matches asset code and entity", async ({
    page,
  }) => {
    await page.getByTestId("known-assets").click();

    const rows = tableRows(page, "known-assets-list");

    await expect(rows).toHaveCount(20);

    // Asset code
    await search(page).fill("xlm");
    await expect(rows.first()).toContainText("XLM");

    // Entity
    await search(page).fill("circle");
    await expect(rows.first()).toContainText("Circle");

    await search(page).fill("zzzz");
    await expect(page.getByText("No assets match your search")).toBeVisible();
  });

  test("Known assets: searching from a later page resets to page 1", async ({
    page,
  }) => {
    await page.getByTestId("known-assets").click();

    const rows = tableRows(page, "known-assets-list");

    await nextPage(page).click();
    await nextPage(page).click();
    await expect(prevPage(page)).toBeEnabled();

    await search(page).fill("xlm");

    await expect(rows.first()).toContainText("XLM");
    await expect(rows).not.toHaveCount(0);
  });

  test("Known assets: asset class filter in the table header", async ({
    page,
  }) => {
    await page.getByTestId("known-assets").click();

    const rows = tableRows(page, "known-assets-list");

    await page.locator("[data-asset-class-trigger]").click();
    await page
      .getByTestId("known-assets-class-dropdown")
      .getByRole("button", { name: "Stablecoins" })
      .click();

    // Header shows the selected class; every visible row is in it
    await expect(
      page.getByText("Stablecoins", { exact: true }).first(),
    ).toBeVisible();
    await expect(rows.first()).toContainText("Stablecoins");
    await expect(rows.filter({ hasNotText: "Stablecoins" })).toHaveCount(0);

    // Search applies on top of the filter
    await search(page).fill("circle");
    await expect(rows.first()).toContainText("Circle");
    await expect(rows.filter({ hasNotText: "Circle" })).toHaveCount(0);
  });
});

test.describe("Smart contract list: Recent tab", () => {
  test.beforeEach(async ({ page }) => {
    await page.route(SE_CONTRACT_LIST_URL, async (route) => {
      const url = new URL(route.request().url());
      const cursor = url.searchParams.get("cursor");

      // A search is a cursor jump to the prefix: the mock answers those with
      // the matching pages, and real page cursors with page 2
      let body = MOCK_RECENT_PAGE_1;

      if (cursor === MOCK_SEARCH_NEXT_CURSOR) {
        body = MOCK_SEARCH_PAGE_2;
      } else if (cursor?.startsWith("CBBBB")) {
        body = MOCK_SEARCH_PAGE_1;
      } else if (cursor?.startsWith("CZZZZ")) {
        body = MOCK_SEARCH_EMPTY;
      } else if (cursor) {
        body = MOCK_RECENT_PAGE_2;
      }

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(body),
      });
    });

    await page.goto(CONTRACT_LIST_URL);
  });

  test("Testnet shows the Recent tab with search", async ({ page }) => {
    await expect(page.getByTestId("recent")).toBeVisible();
    await expect(page.getByTestId("defi")).toBeHidden();
    await expect(search(page)).toBeVisible();
    await expect(search(page)).toHaveAttribute(
      "placeholder",
      "Search contract ID",
    );
  });

  test("Lists recent contracts and pages with the API cursor", async ({
    page,
  }) => {
    const rows = tableRows(page, "recent-contracts-list");

    await expect(rows).toHaveCount(20);
    await expect(rows.first()).toContainText(
      MOCK_RECENT_PAGE_1._embedded.records[0].contract,
    );
    await expect(prevPage(page)).toBeDisabled();
    await expect(nextPage(page)).toBeEnabled();

    await nextPage(page).click();

    // Short last page: Next is disabled instead of leading to an empty page
    await expect(rows).toHaveCount(3);
    await expect(prevPage(page)).toBeEnabled();
    await expect(nextPage(page)).toBeDisabled();

    // Previous goes back to exactly the first page
    await prevPage(page).click();

    await expect(rows).toHaveCount(20);
    await expect(rows.first()).toContainText(
      MOCK_RECENT_PAGE_1._embedded.records[0].contract,
    );
    await expect(prevPage(page)).toBeDisabled();
    await expect(nextPage(page)).toBeEnabled();
  });

  test("A single short page shows no pagination", async ({ page }) => {
    await page.route(SE_CONTRACT_LIST_URL, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_RECENT_SINGLE_PAGE),
      });
    });
    await page.reload();

    const rows = tableRows(page, "recent-contracts-list");

    await expect(rows).toHaveCount(3);
    await expect(nextPage(page)).toBeHidden();
    await expect(prevPage(page)).toBeHidden();
  });

  test("Search finds contracts by ID prefix across pages", async ({ page }) => {
    const rows = tableRows(page, "recent-contracts-list");

    await expect(rows).toHaveCount(20);

    // The list is ordered by contract ID, so a prefix search asks the API for
    // the IDs starting at that prefix and pages on through the matches
    await search(page).fill("cbbbb");

    await expect(rows).toHaveCount(20);
    await expect(rows.first()).toContainText("CBBBB");
    await expect(nextPage(page)).toBeEnabled();

    await nextPage(page).click();

    // Second page of matches runs past the prefix: only the matches show and
    // Next is disabled
    await expect(rows).toHaveCount(3);
    await expect(rows.filter({ hasNotText: "CBBBB" })).toHaveCount(0);
    await expect(prevPage(page)).toBeEnabled();
    await expect(nextPage(page)).toBeDisabled();

    // Previous from the end goes back to the full first page of matches
    await prevPage(page).click();

    await expect(rows).toHaveCount(20);
    await expect(rows.first()).toContainText(
      MOCK_SEARCH_PAGE_1._embedded.records[0].contract,
    );
    await expect(prevPage(page)).toBeDisabled();
    await expect(nextPage(page)).toBeEnabled();

    // A new query starts over from its own first page
    await search(page).fill("CZZZZ");

    await expect(
      page.getByText("No contracts match your search"),
    ).toBeVisible();
    await expect(rows).toHaveCount(0);
    await expect(nextPage(page)).toBeHidden();

    // Not a possible contract ID: no lookup, just the message
    await search(page).fill("hello!");

    await expect(
      page.getByText("No contracts match your search"),
    ).toBeVisible();

    // Clearing the search brings the list and its paging back
    await search(page).fill("");

    await expect(rows).toHaveCount(20);
    await expect(rows.first()).toContainText("CAAAA");
    await expect(nextPage(page)).toBeVisible();
  });

  test("A full contract ID jumps straight to Contract explorer", async ({
    page,
  }) => {
    // Navigates to another page, which compiles on first load in dev
    test.slow();

    await search(page).fill(SAMPLE_CONTRACT_ID.toLowerCase());

    await expect(page.getByText(SAMPLE_CONTRACT_ID)).toBeVisible();

    await page
      .getByRole("button", { name: "Open in Contract explorer" })
      .click();

    // The contract ID is stored before navigating; the explorer page itself
    // may take a while to compile in dev
    await expect(page).toHaveURL(/explorer\$contractId=/);
    await expect(page).toHaveURL(/smart-contracts\/contract-explorer/, {
      timeout: 60000,
    });
    await expect(page.locator("#contract-id")).toHaveValue(SAMPLE_CONTRACT_ID);
  });
});

// =============================================================================
// Mock data
// =============================================================================
const SAMPLE_CONTRACT_ID =
  "CCQXWMZVM3KRTXTUPTN53YHL272QGKF32L7XEDNZ2S6OSUFK3NFBGG5M";

const mockRecord = (index: number, prefix: string) => {
  // Contract IDs are 56 chars: "C" + 55 base32 chars. Build a distinct, valid
  // looking ID per record so search and keys are stable.
  const body = `${prefix}${String(index).padStart(2, "0")}`.padEnd(55, "X");

  return {
    account: `GA${body.slice(0, 54)}`,
    contract: `C${body}`,
    created: 1700000000 - index * 3600,
    creator: `GA${body.slice(0, 54)}`,
    paging_token: String(100 - index),
    payments: 0,
  };
};

const MOCK_RECENT_PAGE_1 = {
  _links: {
    self: { href: "/explorer/testnet/contract?limit=20&order=desc" },
    prev: { href: "/explorer/testnet/contract?limit=20&order=asc&cursor=100" },
    next: { href: "/explorer/testnet/contract?limit=20&order=desc&cursor=81" },
  },
  _embedded: {
    records: [
      mockRecord(0, "AAAA"),
      ...Array.from({ length: 19 }, (_, i) => mockRecord(i + 1, "BBBB")),
    ],
  },
};

// First page with fewer records than the page size: nothing to paginate
const MOCK_RECENT_SINGLE_PAGE = {
  _links: {
    self: { href: "/explorer/testnet/contract?limit=20&order=desc" },
    prev: { href: "/explorer/testnet/contract?limit=20&order=asc&cursor=100" },
    next: { href: "/explorer/testnet/contract?limit=20&order=desc&cursor=97" },
  },
  _embedded: {
    records: Array.from({ length: 3 }, (_, i) => mockRecord(i, "DDDD")),
  },
};

// Prefix search for "CBBBB": a full page of matches, then a page that runs
// past the prefix into "CCCC..." IDs
const MOCK_SEARCH_NEXT_CURSOR = mockRecord(39, "BBBB").contract;

const MOCK_SEARCH_PAGE_1 = {
  _links: {
    self: {
      href: "/explorer/testnet/contract?limit=20&order=desc&cursor=CBBBB",
    },
    prev: { href: "/explorer/testnet/contract?limit=20&order=asc&cursor=x" },
    next: {
      href: `/explorer/testnet/contract?limit=20&order=desc&cursor=${MOCK_SEARCH_NEXT_CURSOR}`,
    },
  },
  _embedded: {
    records: Array.from({ length: 20 }, (_, i) => mockRecord(i + 20, "BBBB")),
  },
};

const MOCK_SEARCH_PAGE_2 = {
  _links: {
    self: {
      href: `/explorer/testnet/contract?limit=20&order=desc&cursor=${MOCK_SEARCH_NEXT_CURSOR}`,
    },
    prev: { href: "/explorer/testnet/contract?limit=20&order=asc&cursor=x" },
    next: { href: "/explorer/testnet/contract?limit=20&order=desc&cursor=y" },
  },
  _embedded: {
    records: [
      ...Array.from({ length: 3 }, (_, i) => mockRecord(i + 40, "BBBB")),
      ...Array.from({ length: 17 }, (_, i) => mockRecord(i + 43, "CCCC")),
    ],
  },
};

// Prefix with nothing under it: the API returns whatever comes after it
const MOCK_SEARCH_EMPTY = {
  _links: {
    self: { href: "/explorer/testnet/contract?limit=20&order=desc&cursor=z" },
    prev: { href: "/explorer/testnet/contract?limit=20&order=asc&cursor=x" },
    next: { href: "/explorer/testnet/contract?limit=20&order=desc&cursor=y" },
  },
  _embedded: {
    records: Array.from({ length: 20 }, (_, i) => mockRecord(i + 60, "DDDD")),
  },
};

const MOCK_RECENT_PAGE_2 = {
  _links: {
    self: { href: "/explorer/testnet/contract?limit=20&order=desc&cursor=81" },
    prev: { href: "/explorer/testnet/contract?limit=20&order=asc&cursor=80" },
    // The API still returns a next link on the last page
    next: { href: "/explorer/testnet/contract?limit=20&order=desc&cursor=78" },
  },
  _embedded: {
    records: Array.from({ length: 3 }, (_, i) => mockRecord(i + 20, "CCCC")),
  },
};
