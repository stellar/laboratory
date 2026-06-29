import { isAsset } from "../../../src/helpers/callStackTrace/isAsset";

const G_KEY = "GA2Q3TSCKD6GBT5SL4XLAPT4TUXJ5GP7HLIM4OHBWT33GFD2UC7SRNEZ";
const C_KEY = "CA4HEQTL2WPEUYKYKCDOHCDNIV4QHNJ7EL4J4NQ6VADP7SYHVRYZ7AW2";
const M_KEY =
  "MC4NTEZTULYHWOCW6YSLZWAEED6ATRVX2BPKTSWZUKQKUJIMG3SLCAAAAAAAAAAAAGIQE";

describe("isAsset", () => {
  it("accepts code:issuer with an ed25519 (G) issuer", () => {
    expect(isAsset(`USDC:${G_KEY}`)).toBe(true);
  });

  it("accepts code:issuer with a contract (C) issuer", () => {
    expect(isAsset(`USDC:${C_KEY}`)).toBe(true);
  });

  it("accepts code:issuer with a muxed (M) issuer", () => {
    expect(isAsset(`USDC:${M_KEY}`)).toBe(true);
  });

  it("accepts a single-character asset code", () => {
    expect(isAsset(`A:${G_KEY}`)).toBe(true);
  });

  it("rejects a string without a colon", () => {
    expect(isAsset(G_KEY)).toBe(false);
  });

  it("rejects a string with more than one colon", () => {
    expect(isAsset(`USDC:${G_KEY}:extra`)).toBe(false);
  });

  it("rejects an empty asset code", () => {
    expect(isAsset(`:${G_KEY}`)).toBe(false);
  });

  it("rejects an asset code longer than 12 characters", () => {
    expect(isAsset(`THIRTEENCHARS:${G_KEY}`)).toBe(false);
  });

  it("rejects an invalid issuer", () => {
    expect(isAsset("USDC:not-a-valid-issuer")).toBe(false);
  });

  it("rejects non-string values", () => {
    expect(isAsset(123)).toBe(false);
    expect(isAsset(null)).toBe(false);
    expect(isAsset(undefined)).toBe(false);
    expect(isAsset({})).toBe(false);
  });
});
