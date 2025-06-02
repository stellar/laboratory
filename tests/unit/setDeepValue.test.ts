import { jsonSchema } from "../../src/helpers/jsonSchema";

describe("jsonSchema.setDeepValue", () => {
  it("sets nested value in array correctly", () => {
    const input = {
      addresses: [],
    };
    const updated = jsonSchema.setDeepValue(input, "addresses.0", {
      value: "GBPIMUEJFYS7RT23QO2ACH2JMKGXLXZI4E5ACBSQMF32RKZ5H3SVNL5F",
      type: "address",
    });

    expect(updated).toEqual({
      addresses: [
        {
          value: "GBPIMUEJFYS7RT23QO2ACH2JMKGXLXZI4E5ACBSQMF32RKZ5H3SVNL5F",
          type: "address",
        },
      ],
    });
  });

  it("should handle continuous updates to the same path", () => {
    const input = {
      values: [
        { value: "initial", type: "string" },
        { value: "second", type: "string" },
      ],
    };

    // First update
    const updated1 = jsonSchema.setDeepValue(input, "values.0", {
      value: "first update",
      type: "string",
    });

    // Second update to same path
    const updated2 = jsonSchema.setDeepValue(updated1, "values.0", {
      value: "second update",
      type: "string",
    });

    // Third update to same path
    const updated3 = jsonSchema.setDeepValue(updated2, "values.1", {
      value: "final update",
      type: "string",
    });

    expect(updated3).toEqual({
      values: [
        { value: "second update", type: "string" },
        { value: "final update", type: "string" },
      ],
    });

    // Verify intermediate states
    expect(updated1).toEqual({
      values: [
        { value: "first update", type: "string" },
        { value: "second", type: "string" },
      ],
    });

    expect(updated2).toEqual({
      values: [
        { value: "second update", type: "string" },
        { value: "second", type: "string" },
      ],
    });
  });

  it("should handle continuous updates to nested array paths", () => {
    const input = {
      tag: "Policy",
      values: [],
    };

    // First update
    const updated1 = jsonSchema.setDeepValue(input, "values.1.0", {
      value: "2",
      type: "u32",
    });

    // Second update
    const updated2 = jsonSchema.setDeepValue(updated1, "values.0", {
      value: "GBOTV3EYB4BO26MK3PFXNDWKI54XGXMLMK52F7TYLNOOQLL2GCJGBUQQ",
      type: "address",
    });

    expect(updated1).toEqual({
      tag: "Policy",
      values: [undefined, [{ value: "2", type: "u32" }]],
    });

    expect(updated2).toEqual({
      tag: "Policy",
      values: [
        {
          value: "GBOTV3EYB4BO26MK3PFXNDWKI54XGXMLMK52F7TYLNOOQLL2GCJGBUQQ",
          type: "address",
        },
        [{ value: "2", type: "u32" }],
      ],
    });
  });
});
