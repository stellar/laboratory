import { toErrorMapData } from "../../../src/helpers/callStackTrace/toErrorMapData";

describe("toErrorMapData", () => {
  it("returns null for null/undefined input", () => {
    expect(toErrorMapData(null)).toBeNull();
    expect(toErrorMapData(undefined)).toBeNull();
  });

  it("wraps a primitive value as an untyped node", () => {
    expect(toErrorMapData(5)).toEqual({ type: undefined, value: 5 });
    expect(toErrorMapData("boom")).toEqual({ type: undefined, value: "boom" });
  });

  it("converts an array into a vec of untyped nodes", () => {
    expect(toErrorMapData([1, "a"])).toEqual({
      type: "vec",
      value: [
        { type: undefined, value: 1 },
        { type: undefined, value: "a" },
      ],
    });
  });

  it("converts a plain object into a keyed map node", () => {
    expect(toErrorMapData({ contract: 7 })).toEqual({
      type: "map",
      value: [
        {
          key: { type: undefined, value: "contract" },
          val: { type: undefined, value: 7 },
        },
      ],
    });
  });

  it("recurses into nested objects and arrays", () => {
    expect(toErrorMapData({ ctx: { codes: [1, 2] } })).toEqual({
      type: "map",
      value: [
        {
          key: { type: undefined, value: "ctx" },
          val: {
            type: "map",
            value: [
              {
                key: { type: undefined, value: "codes" },
                val: {
                  type: "vec",
                  value: [
                    { type: undefined, value: 1 },
                    { type: undefined, value: 2 },
                  ],
                },
              },
            ],
          },
        },
      ],
    });
  });
});
