import { parseNeevaiReferral, stripUtmParams } from "@/helpers/neevaiReferral";
import { getStoreQueryState } from "@/helpers/storeQueryState";

const STORE = "$=network$id=testnet&label=Testnet;;";

describe("parseNeevaiReferral", () => {
  it("returns allowlisted UTM values for neevai links", () => {
    expect(
      parseNeevaiReferral(
        "?utm_source=neevai&utm_medium=chat&utm_campaign=ask%20stellar&utm_foo=x",
      ),
    ).toEqual({ utm_medium: "chat", utm_campaign: "ask stellar" });
  });

  it("returns an empty object for utm_source=neevai alone", () => {
    expect(parseNeevaiReferral("?utm_source=neevai")).toEqual({});
  });

  it("returns null for other sources or no UTM", () => {
    expect(parseNeevaiReferral("?utm_source=twitter")).toBeNull();
    expect(parseNeevaiReferral(`?${STORE}`)).toBeNull();
    expect(parseNeevaiReferral("")).toBeNull();
  });

  it("caps values at 100 characters", () => {
    const referral = parseNeevaiReferral(
      `?utm_source=neevai&utm_content=${"a".repeat(500)}`,
    );

    expect(referral?.utm_content).toHaveLength(100);
  });

  it("reads UTM before or after the store segment", () => {
    expect(
      parseNeevaiReferral(`?utm_source=neevai&utm_medium=chat&${STORE}`),
    ).toEqual({ utm_medium: "chat" });
    expect(
      parseNeevaiReferral(`?${STORE}&utm_source=neevai&utm_medium=chat`),
    ).toEqual({ utm_medium: "chat" });
  });

  it("ignores UTM-looking text inside the store segment", () => {
    expect(parseNeevaiReferral("?$=xdr$blob=utm_source=neevai;;")).toBeNull();
  });
});

describe("stripUtmParams", () => {
  it("removes UTM before the store segment", () => {
    expect(stripUtmParams(`?utm_source=neevai&utm_medium=chat&${STORE}`)).toBe(
      `?${STORE}`,
    );
  });

  it("removes UTM after the store segment", () => {
    expect(stripUtmParams(`?${STORE}&utm_source=neevai`)).toBe(`?${STORE}`);
  });

  it("returns an empty string when only UTM is left", () => {
    expect(stripUtmParams("?utm_source=neevai&utm_medium=chat")).toBe("");
  });

  it("keeps non-UTM params", () => {
    expect(stripUtmParams("?foo=bar&utm_source=neevai")).toBe("?foo=bar");
  });

  it("leaves a query string without UTM unchanged", () => {
    expect(stripUtmParams(`?${STORE}`)).toBe(`?${STORE}`);
  });

  it("keeps the store segment byte-identical, including & and =", () => {
    const stripped = stripUtmParams(`?utm_source=neevai&${STORE}`);

    expect(stripped).toBe(`?${STORE}`);
    expect(stripped).not.toContain("%24");
  });
});

describe("getStoreQueryState", () => {
  const expected = { network: { id: "testnet", label: "Testnet" } };

  it("reads the store state when it comes first", () => {
    expect(getStoreQueryState(`?${STORE}`)).toEqual(expected);
  });

  it("reads the store state after other params", () => {
    expect(getStoreQueryState(`?utm_source=neevai&${STORE}`)).toEqual(expected);
  });

  it("reads the store state with trailing params", () => {
    expect(getStoreQueryState(`?${STORE}&utm_source=neevai`)).toEqual(expected);
  });

  it("returns an empty object without store state", () => {
    expect(getStoreQueryState("")).toEqual({});
    expect(getStoreQueryState("?utm_source=neevai")).toEqual({});
  });
});
