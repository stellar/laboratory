import { describe, expect, it } from "@jest/globals";
import { xdr, nativeToScVal } from "@stellar/stellar-sdk";

import { getScValsFromArgs } from "../../src/helpers/sorobanUtils";

describe("convert js arguments to smart contract values using getScValsFromArgs", () => {
  it("resolves primitive value: symbol", () => {
    const args = {
      hello: {
        value: "hello",
        type: "symbol",
      },
    };

    const scVals: xdr.ScVal[] = [];
    const scValsResult = getScValsFromArgs(args, scVals);
    const expectedResult: xdr.ScVal[] = [];
    expectedResult.push(
      nativeToScVal(args.hello.value, { type: args.hello.type }),
    );

    expect(expectedResult).toEqual(scValsResult);
  });

  it("resolves primitive value: i32 (negative)", () => {
    const args = {
      i32: {
        value: "-100",
        type: "i32",
      },
    };

    const scVals: xdr.ScVal[] = [];
    const scValsResult = getScValsFromArgs(args, scVals);
    const expectedResult: xdr.ScVal[] = [];
    expectedResult.push(xdr.ScVal.scvI32(parseInt(args.i32.value)));

    expect(expectedResult).toEqual(scValsResult);
  });

  it("resolves primitive value: i32 (positive)", () => {
    const args = {
      i32: {
        value: "2147483647",
        type: "i32",
      },
    };

    const scVals: xdr.ScVal[] = [];
    const scValsResult = getScValsFromArgs(args, scVals);
    const expectedResult: xdr.ScVal[] = [];
    expectedResult.push(xdr.ScVal.scvI32(parseInt(args.i32.value)));

    expect(expectedResult).toEqual(scValsResult);
  });

  it("resolves primitive value: boolean", () => {
    const args = {
      boolean: {
        value: "true",
        type: "bool",
      },
    };

    const scVals: xdr.ScVal[] = [];
    const scValsResult = getScValsFromArgs(args, scVals);
    const expectedResult: xdr.ScVal[] = [];
    const expectedVal = true;
    expectedResult.push(xdr.ScVal.scvBool(expectedVal));

    expect(expectedResult).toEqual(scValsResult);
  });

  it("resolves primitive value: bytes", () => {
    const args = {
      bytes: {
        value:
          "099761ef07dac89f53a1ef0e3a426ef01d2951e34c7a03f1c35c56b8c4e14ae3",
        type: "bytes",
      },
    };

    const scVals: xdr.ScVal[] = [];
    const scValsResult = getScValsFromArgs(args, scVals);
    const expectedResult: xdr.ScVal[] = [];
    const expectedVal = new Uint8Array(
      Buffer.from(
        "099761ef07dac89f53a1ef0e3a426ef01d2951e34c7a03f1c35c56b8c4e14ae3",
        "base64",
      ),
    );
    expectedResult.push(nativeToScVal(expectedVal));

    expect(expectedResult).toEqual(scValsResult);
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
