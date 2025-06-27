import { describe, expect, it } from "@jest/globals";

import { getScValsFromArgs } from "../../src/helpers/sorobanUtils";

describe("getScValsFromArgs", () => {
  it("should return the correct sc vals", () => {
    const scVals = getScValsFromArgs({
      arg1: "1",
      arg2: "2",
    });

    expect(scVals).toEqual([
      {
        type: "int",
        value: "1",
      },
    ]);
  });
});

// describe("getScValsFromArgs", () => {
//   it("should return the correct sc vals", () => {
//     const scVals = getScValsFromArgs({
//       arg1: "1",
//       arg2: "2",
//     });
//   });
// });
