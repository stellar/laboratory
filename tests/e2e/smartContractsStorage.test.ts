import { test, expect } from "@playwright/test";
import { STELLAR_EXPERT_API } from "@/constants/settings";
import {
  MOCK_CONTRACT_ID,
  MOCK_CONTRACT_INFO_CONTRACT_TYPE_SUCCESS,
  MOCK_CONTRACT_INFO_RESPONSE_SUCCESS,
} from "./mock/smartContracts";
import { mockRpcRequest } from "./mock/helpers";

test.describe("Smart Contracts: Contract Storage", () => {
  test.beforeEach(async ({ page }) => {
    // Mock the RPC call for getting the contract type
    await mockRpcRequest({
      page,
      rpcMethod: "getLedgerEntries",
      bodyJsonResponse: MOCK_CONTRACT_INFO_CONTRACT_TYPE_SUCCESS,
    });

    // Mock the Contract Info API call
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

    // Mock the Contract Storage API call
    await page.route(
      `${STELLAR_EXPERT_API}/testnet/contract-data/${MOCK_CONTRACT_ID}?order=desc&limit=200`,
      async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(MOCK_RESPONSE_SUCCESS),
        });
      },
    );

    await page.goto("http://localhost:3000/smart-contracts/contract-explorer");
    await expect(page.locator("h1")).toHaveText("Contract Explorer");

    // Load Contract Info
    await page.getByLabel("Contract ID").fill(MOCK_CONTRACT_ID);
    await page.getByRole("button", { name: "Load contract" }).click();

    // Go to Contract Storage tab
    await page
      .getByTestId("contract-contract-storage")
      .getByText("Contract Storage")
      .click();
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
      '["Balance",GA2Q…D5Y4]',
    );
    await expect(firstRow.locator("td").nth(1)).toContainText("25648162");
    await expect(firstRow.locator("td").nth(2)).toContainText("Persistent");
    await expect(firstRow.locator("td").nth(3)).toContainText("55,968,506");
    await expect(firstRow.locator("td").nth(4)).toContainText(
      "10/11/2024, 15:17:24 UTC",
    );

    const secondRow = table.locator("tr").nth(2);
    await expect(secondRow.locator("td").nth(0)).toContainText(
      "ledger_key_contract_instance",
    );
    await expect(secondRow.locator("td").nth(1)).toContainText(
      '{executable:8abc28913035c07411ed5d134e6bfeab4723d97ddd4d1a22a0605d35c94d1a36,storage:["METADATA":{"decimal":7,"name":"Comet Pool Token","symbol":"CPAL"},"Controller":GABQ…Q246,"SwapFee":"30000"]}',
    );
    await expect(secondRow.locator("td").nth(2)).toContainText("Instance");
    await expect(secondRow.locator("td").nth(3)).toContainText("55,739,737");
    await expect(secondRow.locator("td").nth(4)).toContainText(
      "05/02/2024, 21:00:31 UTC",
    );

    // Sort by TTL
    await colTTL.click();
    await expect(firstRow.locator("td").nth(0)).toContainText(
      '["Balance",CB3H…HGUC]',
    );

    // Sort by Updated
    await colUpdated.click();
    await expect(firstRow.locator("td").nth(0)).toContainText(
      "ledger_key_contract_instance",
    );
  });

  test("Filters", async ({ page }) => {
    const keyFilterCol = page.locator("[data-filter]").nth(0);
    const keyFiltersDropdown = page.getByTestId("data-table-filters-key");
    const filterBadges = page.getByTestId("data-table-filter-badge");

    const table = page.getByTestId("contract-storage-table");
    const firstRow = table.locator("tr").nth(1);
    const resultsText = page.getByTestId("data-table-filter-results-text");

    // Initial state
    await expect(keyFiltersDropdown).toBeHidden();
    await keyFilterCol.click();
    await expect(keyFiltersDropdown).toBeVisible();
    await expect(firstRow.locator("td").nth(0)).toContainText(
      '["Balance",GA2Q…D5Y4]',
    );
    await expect(resultsText).toBeHidden();

    // Filter buttons
    const keyFilterClearBtn = keyFiltersDropdown.getByRole("button", {
      name: "Clear filter",
      exact: true,
    });
    const keyFilterApplyBtn = keyFiltersDropdown.getByRole("button", {
      name: "Apply",
      exact: true,
    });

    await expect(keyFilterClearBtn).toBeDisabled();
    await expect(keyFilterApplyBtn).toBeDisabled();

    // Select filter and apply
    await keyFiltersDropdown.getByText("Contracts", { exact: true }).click();
    await expect(keyFilterApplyBtn).toBeEnabled();
    await keyFilterApplyBtn.click();
    await expect(keyFiltersDropdown).toBeHidden();

    // Badge
    await expect(filterBadges.nth(0)).toHaveText("Contracts");

    // Table data
    await expect(firstRow.locator("td").nth(0)).toContainText(
      '["Contracts",CDJ6…632B]',
    );
    await expect(resultsText).toHaveText("1 filtered result");

    // Clear filters
    await keyFilterCol.click();
    await expect(keyFilterClearBtn).toBeEnabled();
    await keyFilterClearBtn.click();
    await expect(resultsText).toBeHidden();
    await expect(filterBadges.nth(0)).toBeHidden();
  });

  test("Export CSV buttons", async ({ page }) => {
    await expect(page.getByText("Export in XDR")).toBeVisible();
    await expect(page.getByText("Export in JSON")).toBeVisible();
  });
});

// =============================================================================
// Mock data
// =============================================================================
const MOCK_RESPONSE_SUCCESS = {
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
