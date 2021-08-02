import { rehydrate, dehydrate } from "../../src/utilities/hydration";

describe("hydration utility", () => {
  describe("rehydrate()", () => {
    it("converts a base64 JSON string into the correct object", () => {
      const rehydrated = rehydrate("eyJmb28iOiJiYXIifQ==");
      expect(rehydrated).to.deep.equal({ foo: "bar" });
    });

    it("converts an invalid base64 JSON into an empty object", () => {
      const rehydrated = rehydrate("AAAAAAA");
      expect(rehydrated).to.deep.equal({});
    });
  });

  describe("dehydrate()", () => {
    it("converts object into correct base64 JSON string", () => {
      const rehydrated = dehydrate({ foo: "bar" });
      expect(rehydrated).to.deep.equal("eyJmb28iOiJiYXIifQ==");
    });
  });
});
