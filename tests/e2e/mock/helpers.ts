import { Page } from "@playwright/test";
import { AnyObject } from "@/types/types";

export const mockRpcRequest = async ({
  page,
  rpcMethod,
  bodyJsonResponse,
}: {
  page: Page;
  rpcMethod: string;
  bodyJsonResponse: AnyObject;
}) => {
  await page.route("https://soroban-testnet.stellar.org", async (route) => {
    const request = route.request();
    const postData = request.postDataJSON();

    if (postData?.method === rpcMethod) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(bodyJsonResponse),
      });
    } else {
      await route.continue();
    }
  });
};

export const mockSimulateTx = async ({
  page,
  responseXdr,
}: {
  page: Page;
  responseXdr: string;
}) => {
  await page.route("https://soroban-testnet.stellar.org", async (route) => {
    const request = route.request();
    const postData = request.postDataJSON();

    if (postData?.method === "simulateTransaction") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          result: {
            transactionData: responseXdr,
            minResourceFee: "93373",
            latestLedger: 567838,
          },
        }),
      });
    } else {
      await route.continue();
    }
  });
};
