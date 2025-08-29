import { Page } from "@playwright/test";
import { SAVED_ACCOUNT_1 } from "./localStorage";

export const MOCK_CONTRACT_ID =
  "CAQP53Z2GMZ6WVOKJWXMCVDLZYJ7GYVMWPAMWACPLEZRF2UEZW3B636S";
export const MOCK_CONTRACT_INFO_RESPONSE_SUCCESS = {
  contract: MOCK_CONTRACT_ID,
  account: MOCK_CONTRACT_ID,
  created: 1731402776,
  creator: SAVED_ACCOUNT_1,
  payments: 300,
  trades: 0,
  wasm: "df88820e231ad8f3027871e5dd3cf45491d7b7735e785731466bfc2946008608",
  storage_entries: 10,
  validation: {
    status: "verified",
    repository: "https://github.com/test-org/test-repo",
    commit: "391f37e39a849ddf7543a5d7f1488e055811cb68",
    ts: 1731402776,
  },
};
export const MOCK_CONTRACT_INFO_CONTRACT_TYPE_SUCCESS = {
  jsonrpc: "2.0",
  id: 1,
  result: {
    entries: [
      {
        key: "AAAABgAAAAFNF3bsfk81mNAeWgYbRwNmWHwUfY/TjKFsDjCOwpVi0AAAABQAAAAB",
        xdr: "AAAABgAAAAAAAAABTRd27H5PNZjQHloGG0cDZlh8FH2P04yhbA4wjsKVYtAAAAAUAAAAAQAAABMAAAAAoNuIttpvg78cLI+vzI+pz50qvH+FB9gx0IaqLGrV/BsAAAABAAAAAwAAAA8AAAAITUVUQURBVEEAAAARAAAAAQAAAAMAAAAPAAAACGRlY2ltYWxzAAAAAwAAAAcAAAAPAAAABG5hbWUAAAAOAAAAClRlc3QgVG9rZW4AAAAAAA8AAAAGc3ltYm9sAAAAAAAOAAAAAlRUAAAAAAAQAAAAAQAAAAEAAAAPAAAABU93bmVyAAAAAAAAEgAAAAAAAAAA61JcZT1z2tHkfuOqHc+kAPOXo4xTCfiOCyOIsjoLxpMAAAAQAAAAAQAAAAEAAAAPAAAAC1RvdGFsU3VwcGx5AAAAAAoAAAAAAAAAAAAAAAC1WmRA",
        lastModifiedLedgerSeq: 245559,
        liveUntilLedgerSeq: 366382,
        extXdr: "AAAAAA==",
      },
    ],
    latestLedger: 245589,
  },
};
export const MOCK_CONTRACT_INFO_CONTRACT_TYPE_FAILURE = {
  jsonrpc: "2.0",
  id: 1,
  result: {
    entries: [],
    latestLedger: 245589,
  },
};

export const mockContractTypeFn = async (page: Page) => {
  await page.route("https://soroban-testnet.stellar.org", async (route) => {
    const request = route.request();
    const postData = request.postDataJSON();

    if (postData?.method === "getLedgerEntries") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_CONTRACT_INFO_CONTRACT_TYPE_SUCCESS),
      });
    } else {
      await route.continue();
    }
  });
};
