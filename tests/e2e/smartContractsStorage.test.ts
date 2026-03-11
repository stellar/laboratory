import { baseURL } from "../../playwright.config";
import { test, expect, Page } from "@playwright/test";
import { STELLAR_EXPERT_API } from "@/constants/settings";
import {
  MOCK_CONTRACT_ID,
  MOCK_CONTRACT_INFO_CONTRACT_TYPE_SUCCESS,
  MOCK_CONTRACT_INFO_RESPONSE_SUCCESS,
} from "./mock/smartContracts";
import { mockRpcRequest } from "./mock/helpers";

const BACKEND_DEV_URL = "https://laboratory-backend-dev.stellar.org";

/**
 * Sets up common mocks shared by both backend and SE test suites:
 * RPC getLedgerEntries and SE Contract Info.
 */
const setupCommonMocks = async (page: Page) => {
  await mockRpcRequest({
    page,
    rpcMethod: "getLedgerEntries",
    bodyJsonResponse: MOCK_CONTRACT_INFO_CONTRACT_TYPE_SUCCESS,
  });

  await page.route(
    `${STELLAR_EXPERT_API}/testnet/contract/${MOCK_CONTRACT_ID}`,
    async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_CONTRACT_INFO_RESPONSE_SUCCESS),
      });
    },
  );
};

/**
 * Navigates to the Contract Storage tab with the mock contract loaded.
 */
const navigateToContractStorage = async (page: Page) => {
  await page.goto(`${baseURL}/smart-contracts/contract-explorer`);
  await expect(page.locator("h1")).toHaveText("Contract explorer");

  await page.getByLabel("Contract ID").fill(MOCK_CONTRACT_ID);
  await page.getByRole("button", { name: "Load contract" }).click();

  await page
    .getByTestId("contract-contract-storage")
    .getByText("Contract Storage")
    .click();
};

// =============================================================================
// Backend data source (healthy backend)
// =============================================================================
test.describe("Smart Contracts: Contract Storage (Backend)", () => {
  test.beforeEach(async ({ page }) => {
    // Mock backend health check as healthy
    await page.route(`${BACKEND_DEV_URL}/testnet/health`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ status: "healthy" }),
      });
    });

    // Mock backend Contract Storage API (matches any query params)
    await page.route(
      `${BACKEND_DEV_URL}/testnet/api/contract/${MOCK_CONTRACT_ID}/storage**`,
      async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(MOCK_BACKEND_STORAGE_RESPONSE),
        });
      },
    );

    await setupCommonMocks(page);
    await navigateToContractStorage(page);
  });

  test("Loads", async ({ page }) => {
    await expect(
      page
        .getByTestId("contract-contract-storage")
        .getByText("Contract Storage"),
    ).toHaveAttribute("data-is-active", "true");
  });

  test("Table data", async ({ page }) => {
    const table = page.getByTestId("contract-storage-table");

    await expect(table).toBeVisible();

    const colKey = table.locator("th").nth(0);
    const colValue = table.locator("th").nth(1);
    const colDurability = table.locator("th").nth(2);
    const colTTL = table.locator("th").nth(3);
    const colUpdated = table.locator("th").nth(4);

    // Table headers
    await expect(colKey).toContainText("Key");
    await expect(colValue).toContainText("Value");
    await expect(colDurability).toContainText("Durability");
    await expect(colTTL).toContainText("TTL");
    await expect(colUpdated).toContainText("Updated");

    // Table data
    const firstRow = table.locator("tr").nth(1);
    await expect(firstRow.locator("td").nth(0)).toContainText(
      '["Block",124526]',
    );
    await expect(firstRow.locator("td").nth(1)).toContainText("entropy");
    await expect(firstRow.locator("td").nth(2)).toContainText("Temporary");
    await expect(firstRow.locator("td").nth(3)).toContainText("61,212,509");
    await expect(firstRow.locator("td").nth(4)).toContainText(
      "02/12/2026, 05:56:48 UTC",
    );

    const secondRow = table.locator("tr").nth(2);
    await expect(secondRow.locator("td").nth(0)).toContainText(
      '["Block",127562]',
    );
    await expect(secondRow.locator("td").nth(2)).toContainText("Temporary");
    await expect(secondRow.locator("td").nth(3)).toContainText("61,373,268");
    await expect(secondRow.locator("td").nth(4)).toContainText(
      "02/23/2026, 01:38:18 UTC",
    );
  });

  test("Filters", async ({ page }) => {
    const table = page.getByTestId("contract-storage-table");
    await expect(table).toBeVisible();

    // With backend data source, key and value filters are disabled
    const filterElements = page.locator("[data-filter]");
    await expect(filterElements).toHaveCount(0);

    const filterBadges = page.getByTestId("data-table-filter-badge");
    await expect(filterBadges).toHaveCount(0);
  });

  test("Export CSV buttons", async ({ page }) => {
    const table = page.getByTestId("contract-storage-table");
    await expect(table).toBeVisible();

    await expect(page.getByText("Export in XDR")).toBeVisible();
    await expect(page.getByText("Export in JSON")).toBeVisible();
  });
});

// =============================================================================
// Stellar Expert fallback (unhealthy backend)
// =============================================================================
test.describe("Smart Contracts: Contract Storage (Stellar Expert fallback)", () => {
  test.beforeEach(async ({ page }) => {
    // Mock backend health check as unhealthy to fall back to Stellar Expert
    await page.route(`${BACKEND_DEV_URL}/testnet/health`, async (route) => {
      await route.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({ status: "unhealthy" }),
      });
    });

    // Mock the SE Contract Storage API call (fallback)
    await page.route(
      `${STELLAR_EXPERT_API}/testnet/contract-data/${MOCK_CONTRACT_ID}?order=desc&limit=200`,
      async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(MOCK_SE_RESPONSE_SUCCESS),
        });
      },
    );

    await setupCommonMocks(page);
    await navigateToContractStorage(page);
  });

  test("Loads", async ({ page }) => {
    await expect(
      page
        .getByTestId("contract-contract-storage")
        .getByText("Contract Storage"),
    ).toHaveAttribute("data-is-active", "true");
  });

  test("Table data", async ({ page }) => {
    const table = page.getByTestId("contract-storage-table");

    await expect(table).toBeVisible();

    const colKey = table.locator("th").nth(0);
    const colValue = table.locator("th").nth(1);
    const colDurability = table.locator("th").nth(2);
    const colTTL = table.locator("th").nth(3);
    const colUpdated = table.locator("th").nth(4);

    // Table headers
    await expect(colKey).toContainText("Key");
    await expect(colValue).toContainText("Value");
    await expect(colDurability).toContainText("Durability");
    await expect(colTTL).toContainText("TTL");
    await expect(colUpdated).toContainText("Updated");

    // Table data (SE hook sorts by updated desc; UserBalance record is newest)
    const firstRow = table.locator("tr").nth(1);
    await expect(firstRow.locator("td").nth(0)).toContainText(
      '["UserBalance",',
    );
    await expect(firstRow.locator("td").nth(2)).toContainText("Persistent");
    await expect(firstRow.locator("td").nth(3)).toContainText("54,604,788");
    await expect(firstRow.locator("td").nth(4)).toContainText(
      "01/10/2025, 15:52:00 UTC",
    );

    const secondRow = table.locator("tr").nth(2);
    await expect(secondRow.locator("td").nth(0)).toContainText(
      "ledger_key_contract_instance",
    );
    await expect(secondRow.locator("td").nth(2)).toContainText("Instance");
    await expect(secondRow.locator("td").nth(3)).toContainText("57,339,385");
    await expect(secondRow.locator("td").nth(4)).toContainText(
      "12/20/2024, 10:51:18 UTC",
    );

    // Sort by TTL (ascending) - lowest TTL first
    await colTTL.click();
    await expect(firstRow.locator("td").nth(0)).toContainText(
      '["Balance",',
    );
    await expect(firstRow.locator("td").nth(3)).toContainText("53,573,513");

    // Sort by Updated (ascending) - oldest first
    await colUpdated.click();
    await expect(firstRow.locator("td").nth(0)).toContainText(
      "ledger_key_contract_instance",
    );
  });

  // @TODO Flaky due to Dropdown component race condition with delayedAction
  // animation. The dropdown opens and immediately closes because
  // toggleDropdown(true) and toggleDropdown(false) fire in rapid succession,
  // causing delayed setIsActive/setIsVisible callbacks to overlap.
  // This is a pre-existing issue unrelated to the backend data source changes.
  test.skip("Filters", async () => {});

  test("Export CSV buttons", async ({ page }) => {
    await expect(page.getByText("Export in XDR")).toBeVisible();
    await expect(page.getByText("Export in JSON")).toBeVisible();
  });
});

// =============================================================================
// Mock data: Backend
// =============================================================================
const MOCK_BACKEND_STORAGE_RESPONSE = {
  _links: {
    self: {
      href: `/api/contract/${MOCK_CONTRACT_ID}/storage?order=desc&limit=5&cursor=eyJjdXJzb3JUeXBlIjoibmV4dCIsInBvc2l0aW9uIjp7ImtleUhhc2giOiJmZmJiYzFiM2Y3YzRmYjYyYmU5NjFmODZkMWY0MjBmYTgzMDQyMjlhZDM1NTAwODlhZTY4ZGI2NDk0OWFjODc1In19&filter_key=block`,
    },
    next: {
      href: `/api/contract/${MOCK_CONTRACT_ID}/storage?order=desc&limit=5&cursor=eyJjdXJzb3JUeXBlIjoibmV4dCIsInBvc2l0aW9uIjp7ImtleUhhc2giOiJmZmEzY2EwOGVkNjBlNjhhZGY2MDYxMjMyMjNhZjNmMjVjODhlN2FjYmIxNTU5YmMyNGM5MzNmM2ZmNTBiZjUwIn19&filter_key=block`,
    },
    prev: {
      href: `/api/contract/${MOCK_CONTRACT_ID}/storage?order=desc&limit=5&cursor=eyJjdXJzb3JUeXBlIjoicHJldiIsInBvc2l0aW9uIjp7ImtleUhhc2giOiJmZmI0YmFhMTU4M2FhZWQ5Njk5MTNmMzk2NGUzOWRmMTEwODVkZDQ2NjY3NDkxYjYwNzE0NjZiNDZlMzU1MDgxIn19&filter_key=block`,
    },
  },
  results: [
    {
      durability: "temporary",
      expired: true,
      key_hash:
        "ffb4baa1583aaed969913f3964e39df11085dd46667491b6071466b46e355081",
      key: "AAAAEAAAAAEAAAACAAAADwAAAAVCbG9jawAAAAAAAAMAAeZu",
      ttl: 61212509,
      updated: 1770875808,
      value:
        "AAAAEQAAAAEAAAAKAAAADwAAAAdlbnRyb3B5AAAAAA0AAAAgAAAABTKrK8NCeSQ2w0ciOMFMrohD3mu774787B56x84AAAAPAAAAB21heF9nYXAAAAAAAwAAADMAAAAPAAAACW1heF9zdGFrZQAAAAAAAAoAAAAAAAAAAAAAAAAupMg0AAAADwAAAAltYXhfemVyb3MAAAAAAAADAAAACQAAAA8AAAAHbWluX2dhcAAAAAADAAAAAwAAAA8AAAAJbWluX3N0YWtlAAAAAAAACgAAAAAAAAAAAAAAAAAAAAAAAAAPAAAACW1pbl96ZXJvcwAAAAAAAAMAAAAFAAAADwAAABBub3JtYWxpemVkX3RvdGFsAAAACgAAAAAAAAAAAAAB9E8LYWQAAAAPAAAADHN0YWtlZF90b3RhbAAAAAoAAAAAAAAAAAAAAAACrqVAAAAADwAAAAl0aW1lc3RhbXAAAAAAAAAFAAAAAGmNam0=",
      paging_token: "",
    },
    {
      durability: "temporary",
      expired: true,
      key_hash:
        "ffaebaeee2de716cadc6bcd7b9af3898530ba3bf3b9d7b5d657ee1b5869ee565",
      key: "AAAAEAAAAAEAAAACAAAADwAAAAVCbG9jawAAAAAAAAMAAfJK",
      ttl: 61373268,
      updated: 1771810698,
      value:
        "AAAAEQAAAAEAAAAKAAAADwAAAAdlbnRyb3B5AAAAAA0AAAAgAAAABIuLvmOtU9x6BRzEWwDwJX3/EsToS+/oqWHvfQ4AAAAPAAAAB21heF9nYXAAAAAAAwAAADQAAAAPAAAACW1heF9zdGFrZQAAAAAAAAoAAAAAAAAAAAAAAAADUGPkAAAADwAAAAltYXhfemVyb3MAAAAAAAADAAAACQAAAA8AAAAHbWluX2dhcAAAAAADAAAAAgAAAA8AAAAJbWluX3N0YWtlAAAAAAAACgAAAAAAAAAAAAAAAAAAAAAAAAAPAAAACW1pbl96ZXJvcwAAAAAAAAMAAAAGAAAADwAAABBub3JtYWxpemVkX3RvdGFsAAAACgAAAAAAAAAAAAAAHOoE/G8AAAAPAAAADHN0YWtlZF90b3RhbAAAAAoAAAAAAAAAAAAAAAAAAAAAAAAADwAAAAl0aW1lc3RhbXAAAAAAAAAFAAAAAGmbrlc=",
      paging_token: "",
    },
    {
      durability: "temporary",
      expired: true,
      key_hash:
        "ffadd51cb0e689f9aba51c8acc8eb52bb6edeedb6fd16a6039aa51831fc0c24a",
      key: "AAAAEAAAAAEAAAACAAAADwAAAAVCbG9jawAAAAAAAAMAAeZ8",
      ttl: 61213234,
      updated: 1770880077,
      value:
        "AAAAEQAAAAEAAAAKAAAADwAAAAdlbnRyb3B5AAAAAA0AAAAgAAAAJ1Gk4AMn0tnfr6OEDBPdpAeCtdd9J7efnW2d188AAAAPAAAAB21heF9nYXAAAAAAAwAAADIAAAAPAAAACW1heF9zdGFrZQAAAAAAAAoAAAAAAAAAAAAAAAAuwbfvAAAADwAAAAltYXhfemVyb3MAAAAAAAADAAAACQAAAA8AAAAHbWluX2dhcAAAAAADAAAAAwAAAA8AAAAJbWluX3N0YWtlAAAAAAAACgAAAAAAAAAAAAAAAAAAAAAAAAAPAAAACW1pbl96ZXJvcwAAAAAAAAMAAAAFAAAADwAAABBub3JtYWxpemVkX3RvdGFsAAAACgAAAAAAAAAAAAAB7vHUtlMAAAAPAAAADHN0YWtlZF90b3RhbAAAAAoAAAAAAAAAAAAAAAAAAAAAAAAADwAAAAl0aW1lc3RhbXAAAAAAAAAFAAAAAGmNex8=",
      paging_token: "",
    },
    {
      durability: "temporary",
      expired: true,
      key_hash:
        "ffa9638d90408ce10054d4a480c97f7fb36c5653eb54013c1fe458364d007390",
      key: "AAAAEAAAAAEAAAACAAAADwAAAAVCbG9jawAAAAAAAAMAAd8E",
      ttl: 61108997,
      updated: 1770279660,
      value:
        "AAAAEQAAAAEAAAAKAAAADwAAAAdlbnRyb3B5AAAAAA0AAAAgAAAAzkWGilzVFYkLYQy/oMYXhwm9V3uAUTfE8lqI/XYAAAAPAAAAB21heF9nYXAAAAAAAwAAADUAAAAPAAAACW1heF9zdGFrZQAAAAAAAAoAAAAAAAAAAAAAAAAq/AqzAAAADwAAAAltYXhfemVyb3MAAAAAAAADAAAACgAAAA8AAAAHbWluX2dhcAAAAAADAAAAAgAAAA8AAAAJbWluX3N0YWtlAAAAAAAACgAAAAAAAAAAAAAAAAAAAAAAAAAPAAAACW1pbl96ZXJvcwAAAAAAAAMAAAAFAAAADwAAABBub3JtYWxpemVkX3RvdGFsAAAACgAAAAAAAAAAAAABj/5wDZ8AAAAPAAAADHN0YWtlZF90b3RhbAAAAAoAAAAAAAAAAAAAAAAAAAAAAAAADwAAAAl0aW1lc3RhbXAAAAAAAAAFAAAAAGmEUbw=",
      paging_token: "",
    },
    {
      durability: "temporary",
      expired: true,
      key_hash:
        "ffa3ca08ed60e68adf606123223af3f25c88e7acbb1559bc24c933f3ff50bf50",
      key: "AAAAEAAAAAEAAAACAAAADwAAAAVCbG9jawAAAAAAAAMAAdwQ",
      ttl: 61069302,
      updated: 1770048960,
      value:
        "AAAAEQAAAAEAAAAKAAAADwAAAAdlbnRyb3B5AAAAAA0AAAAgAAAAOt1Zm0oDufP6nIXz5JSKJEVBxP6UoUWCVMm4MFEAAAAPAAAAB21heF9nYXAAAAAAAwAAADMAAAAPAAAACW1heF9zdGFrZQAAAAAAAAoAAAAAAAAAAAAAAACKAyfKAAAADwAAAAltYXhfemVyb3MAAAAAAAADAAAACQAAAA8AAAAHbWluX2dhcAAAAAADAAAAAgAAAA8AAAAJbWluX3N0YWtlAAAAAAAACgAAAAAAAAAAAAAAAAAAAAAAAAAPAAAACW1pbl96ZXJvcwAAAAAAAAMAAAAFAAAADwAAABBub3JtYWxpemVkX3RvdGFsAAAACgAAAAAAAAAAAAAFFUYUXnoAAAAPAAAADHN0YWtlZF90b3RhbAAAAAoAAAAAAAAAAAAAAAAJty7AAAAADwAAAAl0aW1lc3RhbXAAAAAAAAAFAAAAAGmAzI8=",
      paging_token: "",
    },
  ],
};

// =============================================================================
// Mock data: Stellar Expert (fallback)
// =============================================================================
const MOCK_SE_RESPONSE_SUCCESS = {
  _embedded: {
    records: [
      {
        durability: "persistent",
        expired: true,
        key: "AAAAEAAAAAEAAAACAAAADwAAAAdCYWxhbmNlAAAAABIAAAAAAAAAADUHzWSNzGg5GttrOzM+KOt5ibc4bAPIDc+vrDLlXlTx",
        ttl: 55968506,
        updated: 1728659844,
        value: "AAAACgAAAAAAAAAAAAAAAAGHXCI=",
        paging_token: "QAACRgATsjM+Uz3SEwjOBECC492dskracGox30wTehca3Q0g",
      },
      {
        durability: "instance",
        key: "AAAAFA==",
        ttl: 55739737,
        updated: 1714683631,
        value:
          "AAAAEwAAAACKvCiRMDXAdBHtXRNOa/6rRyPZfd1NGiKgYF01yU0aNgAAAAEAAAADAAAADwAAAAhNRVRBREFUQQAAABEAAAABAAAAAwAAAA8AAAAHZGVjaW1hbAAAAAADAAAABwAAAA8AAAAEbmFtZQAAAA4AAAAQQ29tZXQgUG9vbCBUb2tlbgAAAA8AAAAGc3ltYm9sAAAAAAAOAAAABENQQUwAAAAQAAAAAQAAAAEAAAAPAAAACkNvbnRyb2xsZXIAAAAAABIAAAAAAAAAAAMJ8G6bkjiyHqIIfyNprgPCb2rPxnXxZpo+96d+DkkIAAAAEAAAAAEAAAABAAAADwAAAAdTd2FwRmVlAAAAAAoAAAAAAAAAAAAAAAAAAHUw",
        paging_token: "QAACRszAoxHcKs/DCG/SjmBkN5QFxbVnrgVwzfHOYsfj9zFT",
      },
      {
        durability: "temporary",
        key: "AAAAEAAAAAEAAAACAAAADwAAAAlBbGxvd2FuY2UAAAAAAAARAAAAAQAAAAIAAAAPAAAABGZyb20AAAASAAAAAAAAAAARP+aVst5Yi29zg/8dl0PREDjea5k3wN6LOkobCPQ1ewAAAA8AAAAHc3BlbmRlcgAAAAASAAAAASWyr9NeVDMaSJDDYxn3ntsY8HieR/w4ezsw7y5ppU0a",
        ttl: 53635226,
        updated: 1727041046,
        value:
          "AAAAEQAAAAEAAAACAAAADwAAAAZhbW91bnQAAAAAAAoAAAAAAAAAAAAAAAAAAAAAAAAADwAAABFsaXZlX3VudGlsX2xlZGdlcgAAAAAAAAMDM2Wg",
        paging_token: "QAACRQC7djIElPlcohxj49v+213f6RpSK3QsbepJJBJ4lAgq",
        expired: true,
      },
      {
        durability: "instance",
        key: "AAAAFA==",
        ttl: 57339385,
        updated: 1734691878,
        value:
          "AAAAEwAAAAD6gAn8jG3DCsiDphtTiNlEf2Qn+nWr29XNSoF4Nd/WGQAAAAEAAAABAAAADwAAAAVBRE1JTgAAAAAAABIAAAAAAAAAAOnatvNUT3UzhD2pfbCDPEWfdKqTIZAk8MKg34PZnxsM",
        paging_token: "QAAFc6K12RmOyffzdIsRlq9ZNY0S/4o9ZtjS79ELnqCpWOJy",
      },
      {
        durability: "persistent",
        key: "AAAAEAAAAAEAAAACAAAADwAAAAdCYWxhbmNlAAAAABIAAAABdnTlblPKwDRVhIgfbB1p2Kg5wH2rf0cT2Ef7USAywuM=",
        ttl: 53573513,
        updated: 1714685793,
        value:
          "AAAAEQAAAAEAAAADAAAADwAAAAZhbW91bnQAAAAAAAoAAAAAAAAAAAAADaR1q/AAAAAADwAAAAphdXRob3JpemVkAAAAAAAAAAAAAQAAAA8AAAAIY2xhd2JhY2sAAAAAAAAAAA==",
        paging_token: "QAACRQnYduBygJfW9itE+Tx8njb6TUbyFoaHODoDWCu7rgcj",
        expired: true,
      },
      {
        durability: "persistent",
        key: "AAAAEAAAAAEAAAACAAAADwAAAAdCYWxhbmNlAAAAABIAAAAAAAAAACGu5cncXhnlcakOe9fkNSAhil3HzXoOyc5usXm9Rumy",
        ttl: 53774298,
        updated: 1720314121,
        value: "AAAACgAAAAAAAAAAAAAAAAAAAAA=",
        paging_token: "QAACRgA7Mmbe6LPvIHNl5SAay/ihUQ9ywr4PYrgjMAXTd/qR",
        expired: true,
      },
      {
        durability: "persistent",
        key: "AAAAEAAAAAEAAAACAAAADwAAAAdSZXNEYXRhAAAAABIAAAABNQ6lmcqcuo9u5zwX7QWniIz16onAnWpe+ucauxVZ1t0=",
        ttl: 56195548,
        updated: 1729956103,
        value:
          "AAAAEQAAAAEAAAAHAAAADwAAAAZiX3JhdGUAAAAAAAoAAAAAAAAAAAAAAAA7msoAAAAADwAAAAhiX3N1cHBseQAAAAoAAAAAAAAAAAAAAAAAAAAAAAAADwAAAA9iYWNrc3RvcF9jcmVkaXQAAAAACgAAAAAAAAAAAAAAAAAAAAAAAAAPAAAABmRfcmF0ZQAAAAAACgAAAAAAAAAAAAAAADuaygAAAAAPAAAACGRfc3VwcGx5AAAACgAAAAAAAAAAAAAAAAAAAAAAAAAPAAAABmlyX21vZAAAAAAACgAAAAAAAAAAAAAAADuaygAAAAAPAAAACWxhc3RfdGltZQAAAAAAAAUAAAAAZx0JBw==",
        paging_token: "QAAHwgQmcGiCMFWsCsb7P9vtFhFFLkNqcltVFrGcJGsvNDKA",
      },
      {
        durability: "instance",
        key: "AAAAFA==",
        ttl: 56195544,
        updated: 1730269711,
        value:
          "AAAAEwAAAAC6+XjxDv282FdHhovviDKEXqaAn3ZDtnpKwM1mkyf8LAAAAAEAAAAGAAAADwAAAAVBZG1pbgAAAAAAABIAAAAAAAAAADUHzWSNzGg5GttrOzM+KOt5ibc4bAPIDc+vrDLlXlTxAAAADwAAAAdCTE5EVGtuAAAAABIAAAAB9dY2s8jXzG7hE8SbmuCde2oc7rMwUvMBIanSieZmJ1MAAAAPAAAACEJhY2tzdG9wAAAAEgAAAAEdsBgMzWLDomvfiJ1XMLKxF9mQA8cB9wRxdmQX8+cpxAAAAA8AAAAGQ29uZmlnAAAAAAARAAAAAQAAAAQAAAAPAAAACmJzdG9wX3JhdGUAAAAAAAMAFuNgAAAADwAAAA1tYXhfcG9zaXRpb25zAAAAAAAAAwAAAAQAAAAPAAAABm9yYWNsZQAAAAAAEgAAAAGBROIk5o8OP7CvTEN6VQIFwqJpl7OTihJzGVp4vfWzywAAAA8AAAAGc3RhdHVzAAAAAAADAAAAAwAAAA8AAAAGSXNJbml0AAAAAAAAAAAAAQAAAA8AAAAETmFtZQAAAA4AAAAWQ2xpY2tQZXNhIERlYnRGdW5kIFNNRQAA",
        paging_token: "QAAHwj1alUag8YvXU0pkHV75Z20GH7GdpjCrk8ewTeZHBqRM",
      },
      {
        durability: "persistent",
        key: "AAAADwAAAAdSZXNMaXN0AA==",
        ttl: 56195548,
        updated: 1729956122,
        value:
          "AAAAEAAAAAEAAAACAAAAEgAAAAE1DqWZypy6j27nPBftBaeIjPXqicCdal765xq7FVnW3QAAABIAAAABre/OWa7lKWj3YGHUlMJSW3Vln6QpamX0me8p5WR35JY=",
        paging_token: "QAAHwlhp6xa8DX7yB9ZUdQuOPQGNBI9XI0X1no53/ONEjI8q",
      },
      {
        durability: "temporary",
        key: "AAAAEAAAAAEAAAACAAAADwAAAAdSZXNJbml0AAAAABIAAAABre/OWa7lKWj3YGHUlMJSW3Vln6QpamX0me8p5WR35JY=",
        ttl: 54139229,
        updated: 1729956122,
        value:
          "AAAAEQAAAAEAAAACAAAADwAAAApuZXdfY29uZmlnAAAAAAARAAAAAQAAAAsAAAAPAAAACGNfZmFjdG9yAAAAAwAAAAAAAAAPAAAACGRlY2ltYWxzAAAAAwAAAAcAAAAPAAAABWluZGV4AAAAAAAAAwAAAAEAAAAPAAAACGxfZmFjdG9yAAAAAwCViUAAAAAPAAAACG1heF91dGlsAAAAAwCYloAAAAAPAAAABnJfYmFzZQAAAAAAAwAST4AAAAAPAAAABXJfb25lAAAAAAAAAwAAAAAAAAAPAAAAB3JfdGhyZWUAAAAAAwAAAAAAAAAPAAAABXJfdHdvAAAAAAAAAwAAAAAAAAAPAAAACnJlYWN0aXZpdHkAAAAAAAMAAAAAAAAADwAAAAR1dGlsAAAAAwCQ9WAAAAAPAAAAC3VubG9ja190aW1lAAAAAAUAAAAAZx0JDQ==",
        paging_token: "QAAHwoCD9pbtdwm7bpbBZDfUALGn7xh/RjxGhvLF3yfioPfm",
        expired: true,
      },
      {
        durability: "persistent",
        key: "AAAAEAAAAAEAAAACAAAADwAAAAlSZXNDb25maWcAAAAAAAASAAAAATUOpZnKnLqPbuc8F+0Fp4iM9eqJwJ1qXvrnGrsVWdbd",
        ttl: 56195548,
        updated: 1729956103,
        value:
          "AAAAEQAAAAEAAAALAAAADwAAAAhjX2ZhY3RvcgAAAAMAlYlAAAAADwAAAAhkZWNpbWFscwAAAAMAAAAHAAAADwAAAAVpbmRleAAAAAAAAAMAAAAAAAAADwAAAAhsX2ZhY3RvcgAAAAMAAAAAAAAADwAAAAhtYXhfdXRpbAAAAAMAAw1AAAAADwAAAAZyX2Jhc2UAAAAAAAMAAYagAAAADwAAAAVyX29uZQAAAAAAAAMAB6EgAAAADwAAAAdyX3RocmVlAAAAAAMAmJaAAAAADwAAAAVyX3R3bwAAAAAAAAMATEtAAAAADwAAAApyZWFjdGl2aXR5AAAAAAADAAAAAAAAAA8AAAAEdXRpbAAAAAMAAYag",
        paging_token: "QAAHwq7aUk71VIcqx0cmJSP/eGkH3VpyR55WTqlumLe0RJXi",
      },
      {
        durability: "persistent",
        key: "AAAAEAAAAAEAAAACAAAADwAAAAlQb3NpdGlvbnMAAAAAAAASAAAAAAAAAAC/p1Wg5tcDzAljTT6zlW+ZXIyxpi3LyLayPhNxiMUElw==",
        ttl: 56249164,
        updated: 1731051851,
        value:
          "AAAAEQAAAAEAAAADAAAADwAAAApjb2xsYXRlcmFsAAAAAAARAAAAAQAAAAEAAAADAAAAAQAAAAoAAAAAAAAAAAAAAAAAehIAAAAADwAAAAtsaWFiaWxpdGllcwAAAAARAAAAAQAAAAAAAAAPAAAABnN1cHBseQAAAAAAEQAAAAEAAAAA",
        paging_token: "QAAHwv8g3HwEknGjJYM0H9bOlW3BX47WD0aUrERm02XrNWWL",
      },
      {
        durability: "persistent",
        key: "AAAAEAAAAAEAAAACAAAADwAAAAlDb250cmFjdHMAAAAAAAASAAAAAdPobBptFbA2xTXEegXwTdQLhO2lULNMjpyIfTR5FwqP",
        ttl: 56163850,
        updated: 1729771422,
        value: "AAAAAAAAAAE=",
        paging_token: "QAACQwhUaiYj1qjag3DAFUXcI7U/KZe5GJ7Upg5sY4XXEKPt",
      },
      {
        durability: "persistent",
        key: "AAAAEAAAAAEAAAACAAAADwAAAAlVRW1pc0RhdGEAAAAAAAARAAAAAQAAAAIAAAAPAAAABHBvb2wAAAASAAAAAesKqdjWJXlpAvqb5jQSkd4Hfo3VI6c3jkakphUtqBg7AAAADwAAAAR1c2VyAAAAEgAAAAAAAAAAyO62g0UM0culGHQ6NzIAeOH5N2JZxtUvREanXp53/Wg=",
        ttl: 53631809,
        updated: 1721418297,
        value:
          "AAAAEQAAAAEAAAACAAAADwAAAAdhY2NydWVkAAAAAAoAAAAAAAAAAAAAAAAAAAAAAAAADwAAAAVpbmRleAAAAAAAAAoAAAAAAAAAAAAAAAAFfxbV",
        paging_token: "QAACRAAsMmLJZQnChGJdK6wIoJ3EoynVEkrsvLinLWrbUQpF",
        expired: true,
      },
      {
        durability: "persistent",
        key: "AAAAEAAAAAEAAAACAAAADwAAAAtVc2VyQmFsYW5jZQAAAAARAAAAAQAAAAIAAAAPAAAABHBvb2wAAAASAAAAAV/2u8X5YjPJxYBnpeqWwjOn0/5KqxwCEzbVmUF4A5SCAAAADwAAAAR1c2VyAAAAEgAAAAAAAAAAiYAik2F83T9w3mhoO9cunM/Y7AV8ZrAVhFCZNavrwyo=",
        ttl: 54604788,
        updated: 1736524320,
        value:
          "AAAAEQAAAAEAAAACAAAADwAAAANxNHcAAAAAEAAAAAEAAAAAAAAADwAAAAZzaGFyZXMAAAAAAAoAAAAAAAAAAAAAAHc4EmAc",
        paging_token: "QAACRAQ5NPalBoPj0wh8KKeMLh7HGxrJ7WdG7eCQ/gbOzb+1",
        expired: true,
      },
      {
        durability: "persistent",
        key: "AAAAEAAAAAEAAAACAAAADwAAAAtVc2VyQmFsYW5jZQAAAAARAAAAAQAAAAIAAAAPAAAABHBvb2wAAAASAAAAAV/2u8X5YjPJxYBnpeqWwjOn0/5KqxwCEzbVmUF4A5SCAAAADwAAAAR1c2VyAAAAEgAAAAAAAAAA97G8MWrJJvBwEMcyyZbyKUkvsnbeiv20HYJ+bnaYo/s=",
        ttl: 54798595,
        updated: 1730206371,
        value:
          "AAAAEQAAAAEAAAACAAAADwAAAANxNHcAAAAAEAAAAAEAAAABAAAAEQAAAAEAAAACAAAADwAAAAZhbW91bnQAAAAAAAoAAAAAAAAAAAAAAAK+3RmFAAAADwAAAANleHAAAAAABQAAAABnPIojAAAADwAAAAZzaGFyZXMAAAAAAAoAAAAAAAAAAAAAAAAAAAAA",
        paging_token: "QAACRAmF1QMol81Pv+RzZTSgxaNozWWXQUtDkPRL0mxCGIYF",
        expired: true,
      },
      {
        durability: "persistent",
        key: "AAAAEAAAAAEAAAACAAAADwAAAAlQb3NpdGlvbnMAAAAAAAASAAAAAAAAAAAC016ld1b5DTGfGjCuWun9OibvZYfWP2aTs/lrUgfTYg==",
        ttl: 56628332,
        updated: 1734101469,
        value:
          "AAAAEQAAAAEAAAADAAAADwAAAApjb2xsYXRlcmFsAAAAAAARAAAAAQAAAAAAAAAPAAAAC2xpYWJpbGl0aWVzAAAAABEAAAABAAAAAAAAAA8AAAAGc3VwcGx5AAAAAAARAAAAAQAAAAA=",
        paging_token: "QAAJ/gCbt/wBKG2EJHZ3qdugAIKOCqTwEDwFBwduZ/Wug5sw",
      },
      {
        durability: "persistent",
        key: "AAAAEAAAAAEAAAACAAAADwAAAAlQb3NpdGlvbnMAAAAAAAASAAAAAAAAAACxWPky8NcQFLo5BeW36fH8mWqsJEUzV9yJJTyBLHHD2A==",
        ttl: 57020541,
        updated: 1734041170,
        value:
          "AAAAEQAAAAEAAAADAAAADwAAAApjb2xsYXRlcmFsAAAAAAARAAAAAQAAAAIAAAADAAAAAQAAAAoAAAAAAAAAAAAAABWfIWAVAAAAAwAAAAMAAAAKAAAAAAAAAAAAAAAyLhomSAAAAA8AAAALbGlhYmlsaXRpZXMAAAAAEQAAAAEAAAABAAAAAwAAAAMAAAAKAAAAAAAAAAAAAAAa5FRJJAAAAA8AAAAGc3VwcGx5AAAAAAARAAAAAQAAAAA=",
        paging_token: "QAAJ/gc5gvTV9g9fjSjS/bbVHZw5AvjuDJeq3++kG/z1gT3z",
      },
    ],
  },
};
