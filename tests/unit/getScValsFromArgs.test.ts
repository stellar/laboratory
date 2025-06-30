import { describe, expect, it } from "@jest/globals";
import { xdr, ScInt } from "@stellar/stellar-sdk";

import { getScValsFromArgs } from "../../src/helpers/sorobanUtils";

describe("convert js arguments to smart contract values using getScValsFromArgs", () => {
  // Primitive Types
  it("resolves primitive value: i32 (negative)", () => {
    const args = {
      i32: {
        value: "-100",
        type: "i32",
      },
    };

    const scVals: xdr.ScVal[] = [];
    const scValsResult = getScValsFromArgs(args, scVals);
    const expectedResult: xdr.ScVal[] = [
      xdr.ScVal.scvI32(parseInt(args.i32.value)),
    ];
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
    const expectedResult: xdr.ScVal[] = [
      xdr.ScVal.scvI32(parseInt(args.i32.value)),
    ];
    expect(expectedResult).toEqual(scValsResult);
  });

  it("resolves primitive value: u32", () => {
    const args = {
      u32: {
        value: "4294967295",
        type: "u32",
      },
    };

    const scVals: xdr.ScVal[] = [];
    const scValsResult = getScValsFromArgs(args, scVals);
    const expectedResult: xdr.ScVal[] = [
      xdr.ScVal.scvU32(parseInt(args.u32.value)),
    ];
    expect(expectedResult).toEqual(scValsResult);
  });

  it("resolves primitive value: i64 (negative)", () => {
    const args = {
      i64: {
        value: "-9223372",
        type: "i64",
      },
    };

    const scVals: xdr.ScVal[] = [];
    const scValsResult = getScValsFromArgs(args, scVals);
    const expectedResult: xdr.ScVal[] = [
      xdr.ScVal.scvI64(new xdr.Int64(args.i64.value)),
    ];
    expect(expectedResult).toEqual(scValsResult);
  });

  it("resolves primitive value: i64 (positive)", () => {
    const args = {
      i64: {
        value: "9223372036854",
        type: "i64",
      },
    };

    const scVals: xdr.ScVal[] = [];
    const scValsResult = getScValsFromArgs(args, scVals);
    const expectedResult: xdr.ScVal[] = [
      xdr.ScVal.scvI64(new xdr.Int64(args.i64.value)),
    ];

    expect(expectedResult).toEqual(scValsResult);
  });

  it("resolves primitive value: u64", () => {
    const args = {
      u64: {
        value: "18446744073709551615",
        type: "u64",
      },
    };

    const scVals: xdr.ScVal[] = [];
    const scValsResult = getScValsFromArgs(args, scVals);
    const expectedResult: xdr.ScVal[] = [
      xdr.ScVal.scvU64(new xdr.Uint64(args.u64.value)),
    ];

    expect(expectedResult).toEqual(scValsResult);
  });

  it("resolves primitive value: i128 (negative)", () => {
    const args = {
      i128: {
        value: "-98765432109876",
        type: "i128",
      },
    };

    const scVals: xdr.ScVal[] = [];
    const scValsResult = getScValsFromArgs(args, scVals);
    const expectedResult: xdr.ScVal[] = [
      new ScInt(args.i128.value, { type: "i128" }).toScVal(),
    ];
    expect(expectedResult).toEqual(scValsResult);
  });

  it("resolves primitive value: i128 (positive)", () => {
    const args = {
      i128: {
        value: "12345678901234567890",
        type: "i128",
      },
    };

    const scVals: xdr.ScVal[] = [];
    const scValsResult = getScValsFromArgs(args, scVals);
    const expectedResult: xdr.ScVal[] = [
      new ScInt(args.i128.value, { type: "i128" }).toScVal(),
    ];

    expect(expectedResult).toEqual(scValsResult);
  });

  it("resolves primitive value: u128", () => {
    const args = {
      u128: {
        value: "12345678901234567890",
        type: "u128",
      },
    };

    const scVals: xdr.ScVal[] = [];
    const scValsResult = getScValsFromArgs(args, scVals);
    const expectedResult: xdr.ScVal[] = [
      new ScInt(args.u128.value, { type: "u128" }).toScVal(),
    ];

    expect(expectedResult).toEqual(scValsResult);
  });

  it("resolves primitive value: i256 (negative)", () => {
    const args = {
      i256: {
        value: "-98765432109876",
        type: "i256",
      },
    };

    const scVals: xdr.ScVal[] = [];
    const scValsResult = getScValsFromArgs(args, scVals);
    const expectedResult: xdr.ScVal[] = [
      new ScInt(args.i256.value, { type: "i256" }).toScVal(),
    ];
    expect(expectedResult).toEqual(scValsResult);
  });

  it("resolves primitive value: i256 (positive)", () => {
    const args = {
      i256: {
        value: "12345678901234567890",
        type: "i256",
      },
    };

    const scVals: xdr.ScVal[] = [];
    const scValsResult = getScValsFromArgs(args, scVals);
    const expectedResult: xdr.ScVal[] = [
      new ScInt(args.i256.value, { type: "i256" }).toScVal(),
    ];

    expect(expectedResult).toEqual(scValsResult);
  });

  it("resolves primitive value: u256", () => {
    const args = {
      u256: {
        value: "12345678901234567890",
        type: "u256",
      },
    };

    const scVals: xdr.ScVal[] = [];
    const scValsResult = getScValsFromArgs(args, scVals);
    const expectedResult: xdr.ScVal[] = [
      new ScInt(args.u256.value, { type: "u256" }).toScVal(),
    ];

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
    // const expectedResult: xdr.ScVal[] = [];
    const expectedVal = true;
    const expectedResult: xdr.ScVal[] = [xdr.ScVal.scvBool(expectedVal)];

    expect(expectedResult).toEqual(scValsResult);
  });

  // Symbols

  it("resolves primitive value: symbol", () => {
    const args = {
      hello: {
        value: "hello",
        type: "symbol",
      },
    };

    const scVals: xdr.ScVal[] = [];
    const scValsResult = getScValsFromArgs(args, scVals);
    const expectedResult: xdr.ScVal[] = [xdr.ScVal.scvSymbol(args.hello.value)];

    expect(expectedResult).toEqual(scValsResult);
  });

  it("resolves bytes (hex)", () => {
    const args = {
      bytes: {
        value:
          "099761ef07dac89f53a1ef0e3a426ef01d2951e34c7a03f1c35c56b8c4e14ae3",
        type: "bytes",
      },
    };

    const scVals: xdr.ScVal[] = [];
    const scValsResult = getScValsFromArgs(args, scVals);
    const expectedResult: xdr.ScVal[] = [
      xdr.ScVal.scvBytes(Buffer.from(args.bytes.value, "hex")),
    ];

    expect(expectedResult).toEqual(scValsResult);
  });

  it("resolves bytes (base64)", () => {
    const args = {
      bytes: {
        value: "CXbR7wfbSJ9Toe8OOkJv8B0pUeNMegP8PFxWuMTuFK4=",
        type: "bytes",
      },
    };

    const scVals: xdr.ScVal[] = [];
    const scValsResult = getScValsFromArgs(args, scVals);
    const expectedResult: xdr.ScVal[] = [
      xdr.ScVal.scvBytes(Buffer.from(args.bytes.value, "base64")),
    ];

    expect(expectedResult).toEqual(scValsResult);
  });
});
