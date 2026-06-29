import { renderAssetString } from "../../../src/helpers/callStackTrace/renderAssetString";
import { shortenStellarAddress } from "../../../src/helpers/shortenStellarAddress";

const G_KEY = "GA2Q3TSCKD6GBT5SL4XLAPT4TUXJ5GP7HLIM4OHBWT33GFD2UC7SRNEZ";

describe("renderAssetString", () => {
  it("shortens the issuer of a valid asset string", () => {
    expect(renderAssetString(`USDC:${G_KEY}`)).toBe(
      `USDC:${shortenStellarAddress(G_KEY)}`,
    );
  });

  it("returns a non-asset string unchanged", () => {
    expect(renderAssetString("hello world")).toBe("hello world");
  });

  it("returns a colon-containing non-asset string unchanged", () => {
    expect(renderAssetString("USDC:not-a-valid-issuer")).toBe(
      "USDC:not-a-valid-issuer",
    );
  });
});
