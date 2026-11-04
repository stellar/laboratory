import { Asset, Networks } from "@stellar/stellar-sdk";
import { getSacTransferAsset } from "@/helpers/getSacTransferAsset";

const USDC_ISSUER = "GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN";
const USDC = new Asset("USDC", USDC_ISSUER);

const NATIVE_SAC_PUBNET = Asset.native().contractId(Networks.PUBLIC);
const USDC_SAC_PUBNET = USDC.contractId(Networks.PUBLIC);
const OTHER_CONTRACT =
  "CA6PUJLBYKZKUEKLZJMKBZLEKP2OTHANDEOWSFF44FTSYLKQPIICCJBE";

const NO_ASSET = { assetCode: "", assetIssuer: "" };

describe("getSacTransferAsset", () => {
  it("returns XLM when the emitter is the native SAC", () => {
    expect(
      getSacTransferAsset({
        contractId: NATIVE_SAC_PUBNET,
        assetTopic: "native",
        networkPassphrase: Networks.PUBLIC,
      }),
    ).toEqual({ assetCode: "XLM", assetIssuer: "native" });
  });

  it("returns CODE:ISSUER when the emitter is that asset's SAC", () => {
    expect(
      getSacTransferAsset({
        contractId: USDC_SAC_PUBNET,
        assetTopic: `USDC:${USDC_ISSUER}`,
        networkPassphrase: Networks.PUBLIC,
      }),
    ).toEqual({ assetCode: "USDC", assetIssuer: USDC_ISSUER });
  });

  it("returns no asset for 'native' from a non-SAC contract", () => {
    expect(
      getSacTransferAsset({
        contractId: OTHER_CONTRACT,
        assetTopic: "native",
        networkPassphrase: Networks.PUBLIC,
      }),
    ).toEqual(NO_ASSET);
  });

  it("returns no asset for CODE:ISSUER from a non-SAC contract", () => {
    expect(
      getSacTransferAsset({
        contractId: OTHER_CONTRACT,
        assetTopic: `USDC:${USDC_ISSUER}`,
        networkPassphrase: Networks.PUBLIC,
      }),
    ).toEqual(NO_ASSET);
  });

  it("returns no asset when one SAC claims another asset", () => {
    expect(
      getSacTransferAsset({
        contractId: USDC_SAC_PUBNET,
        assetTopic: "native",
        networkPassphrase: Networks.PUBLIC,
      }),
    ).toEqual(NO_ASSET);
  });

  it("returns no asset when the SAC is from another network", () => {
    expect(
      getSacTransferAsset({
        contractId: NATIVE_SAC_PUBNET,
        assetTopic: "native",
        networkPassphrase: Networks.TESTNET,
      }),
    ).toEqual(NO_ASSET);
  });

  it.each([
    ["missing topic", { assetTopic: undefined }],
    ["missing contract ID", { contractId: undefined }],
    ["missing passphrase", { networkPassphrase: undefined }],
    ["malformed topic", { assetTopic: "USDC" }],
    ["invalid issuer", { assetTopic: "USDC:GNOTANACCOUNT" }],
    ["too many parts", { assetTopic: `USDC:${USDC_ISSUER}:extra` }],
  ])("returns no asset for %s", (_, override) => {
    expect(
      getSacTransferAsset({
        contractId: USDC_SAC_PUBNET,
        assetTopic: `USDC:${USDC_ISSUER}`,
        networkPassphrase: Networks.PUBLIC,
        ...override,
      }),
    ).toEqual(NO_ASSET);
  });
});
