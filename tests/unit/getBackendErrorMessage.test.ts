import { getBackendErrorMessage } from "../../src/query/external/useBackendNetworkLimits";

const mockResponse = (status: number, body: string) =>
  ({
    status,
    json: async () => JSON.parse(body),
  }) as Response;

describe("getBackendErrorMessage()", () => {
  it("returns the `error` field", async () => {
    expect(
      await getBackendErrorMessage(
        mockResponse(400, JSON.stringify({ error: "Not on the allowlist" })),
      ),
    ).toBe("Not on the allowlist");
  });

  it("joins validation issue messages", async () => {
    expect(
      await getBackendErrorMessage(
        mockResponse(
          400,
          JSON.stringify({
            message: "Invalid query parameters",
            issues: [
              { message: "rpc_url must be a valid https URL" },
              { message: "network must be one of: mainnet, testnet" },
            ],
          }),
        ),
      ),
    ).toBe(
      "rpc_url must be a valid https URL. network must be one of: mainnet, testnet",
    );
  });

  it("falls back to the status code when the body is not JSON", async () => {
    expect(await getBackendErrorMessage(mockResponse(502, "<html>"))).toBe(
      "Fetching network limits failed: 502",
    );
  });
});
