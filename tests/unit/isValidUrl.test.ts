import { isValidUrl } from "../../src/helpers/isValidUrl";

describe("isValidUrl", () => {
  it("should return false for invalid URLs", () => {
    expect(isValidUrl("not a url")).toBe(false);
  });

  it("should allow https URLs", () => {
    expect(isValidUrl("https://stellar.org")).toBe(true);
  });

  it("should disallow non-local http URLs", () => {
    expect(isValidUrl("http://stellar.org")).toBe(false);
  });

  it("should allow http URLs on localhost / loopback addresses", () => {
    expect(isValidUrl("http://localhost:3000")).toBe(true);
    expect(isValidUrl("http://127.0.0.1:8000")).toBe(true);
    expect(isValidUrl("http://[::1]:8000")).toBe(true);
  });

  it("should disallow http URLs on non-localhost addresses", () => {
    expect(isValidUrl("http://example.com")).toBe(false);
    expect(isValidUrl("http://192.168.1.1")).toBe(false);
  });

  it("should disallow other protocols", () => {
    expect(isValidUrl("ftp://stellar.org")).toBe(false);
    expect(isValidUrl("javascript:alert(1)")).toBe(false);
  });

  it("should disallow known web wallet signer domains", () => {
    expect(isValidUrl("https://albedo.link/tx")).toBe(false);
    expect(isValidUrl("https://albedo.link.")).toBe(false);
    expect(isValidUrl("https://mycactus.com")).toBe(false);
    expect(isValidUrl("https://www.mycactus.com")).toBe(false);
    expect(isValidUrl("https://xbull.app")).toBe(false);
    expect(isValidUrl("https://wallet.xbull.app")).toBe(false);
    expect(isValidUrl("https://freighter.app")).toBe(false);
    expect(isValidUrl("https://lobstr.co")).toBe(false);
    expect(isValidUrl("https://rabet.io")).toBe(false);
    expect(isValidUrl("https://hanawallet.io")).toBe(false);
    expect(isValidUrl("https://ledger.com")).toBe(false);
    expect(isValidUrl("https://www.ledger.com")).toBe(false);
    expect(isValidUrl("https://hot-labs.org")).toBe(false);
  });

  it("should disallow wallet signer domains with a trailing dot (FQDN bypass)", () => {
    expect(isValidUrl("https://albedo.link./tx")).toBe(false);
    expect(isValidUrl("https://wallet.xbull.app.")).toBe(false);
    expect(isValidUrl("https://albedo.link/?xdr=AAAA")).toBe(false);
    expect(isValidUrl("https://albedo.link./?xdr=AAAA")).toBe(false);
    expect(isValidUrl("https://ALBEDO.LINK./?xdr=AAAA")).toBe(false);
    expect(isValidUrl("https://albedo.link.:443/?xdr=AAAA")).toBe(false);
    expect(isValidUrl("https://wallet.xbull.app./")).toBe(false);
  });

  it("should allow domains that merely contain a wallet domain as a substring", () => {
    expect(isValidUrl("https://notalbedo.link")).toBe(true);
    expect(isValidUrl("https://albedo.link.evil.com")).toBe(true);
  });

  it("should disallow subdomains of known wallet signer domains", () => {
    expect(isValidUrl("https://app.freighter.app")).toBe(false);
    expect(isValidUrl("https://wallet.xbull.app")).toBe(false);
    expect(isValidUrl("https://www.mycactus.com")).toBe(false);
    expect(isValidUrl("https://www.ledger.com")).toBe(false);
    expect(isValidUrl("https://evil.sub.albedo.link")).toBe(false);
  });
});
