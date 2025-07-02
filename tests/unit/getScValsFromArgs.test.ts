import { describe, expect, it } from "@jest/globals";
import { xdr, ScInt, Address } from "@stellar/stellar-sdk";

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
  it("resolves symbol", () => {
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

  // Bytes
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

  it("resolves a vec with multiple arguments", () => {
    const args = {
      a: {
        value: "10",
        type: "u32",
      },
      b: {
        value: "false",
        type: "bool",
      },
    };

    const scVals: xdr.ScVal[] = [];
    const scValsResult = getScValsFromArgs(args, scVals);
    const expectedResult: xdr.ScVal[] = [
      xdr.ScVal.scvU32(10),
      xdr.ScVal.scvBool(false),
    ];

    expect(expectedResult).toEqual(scValsResult);
  });

  // Strings
  it("resolves string", () => {
    const args = {
      bytes: {
        value: "hello there!",
        type: "string",
      },
    };

    const scVals: xdr.ScVal[] = [];
    const scValsResult = getScValsFromArgs(args, scVals);
    const expectedResult: xdr.ScVal[] = [xdr.ScVal.scvString("hello there!")];

    expect(expectedResult).toEqual(scValsResult);
  });

  // Vec - a group of values of the same type
  it("resolves vec", () => {
    const args = {
      vec: [
        {
          value: "Hello",
          type: "string",
        },
        {
          value: "Hola",
          type: "string",
        },
        {
          value: "Bonjour",
          type: "string",
        },
      ],
    };

    const scVals: xdr.ScVal[] = [];
    const scValsResult = getScValsFromArgs(args, scVals);
    const expectedResult: xdr.ScVal[] = [
      xdr.ScVal.scvVec(args.vec.map((v) => xdr.ScVal.scvString(v.value))),
    ];

    expect(expectedResult).toEqual(scValsResult);
  });

  // Map
  it("resolves a map", () => {
    const args = {
      map: [
        {
          0: {
            value: "2",
            type: "u32",
          },
          1: {
            value: "false",
            type: "bool",
          },
        },
        {
          0: {
            value: "3",
            type: "u32",
          },
          1: {
            value: "true",
            type: "bool",
          },
        },
      ],
    };

    const scVals: xdr.ScVal[] = [];
    const scValsResult = getScValsFromArgs(args, scVals);
    const expectedResult: xdr.ScVal[] = [
      xdr.ScVal.scvMap(
        args.map.map((v) => {
          return new xdr.ScMapEntry({
            key: xdr.ScVal.scvU32(parseInt(v[0].value)),
            val: xdr.ScVal.scvBool(v[1].value === "true" ? true : false),
          });
        }),
      ),
    ];

    expect(expectedResult).toEqual(scValsResult);
  });

  // Public Key Address
  it("resolves a public key address", () => {
    const args = {
      address: {
        value: "GBPIMUEJFYS7RT23QO2ACH2JMKGXLXZI4E5ACBSQMF32RKZ5H3SVNL5F",
        type: "address",
      },
    };

    const scVals: xdr.ScVal[] = [];
    const scValsResult = getScValsFromArgs(args, scVals);
    const expectedResult: xdr.ScVal[] = [
      new Address(args.address.value).toScVal(),
    ];

    expect(expectedResult).toEqual(scValsResult);
  });

  // Contract Address
  it("resolves a contract address", () => {
    const args = {
      address: {
        value: "CBHQGTSBJWA54K67RSG3JPXSZY5IXIZ4FSLJM4PQ33FA3FYCU5YZV7MZ",
        type: "address",
      },
    };

    const scVals: xdr.ScVal[] = [];
    const scValsResult = getScValsFromArgs(args, scVals);
    const expectedResult: xdr.ScVal[] = [
      new Address(args.address.value).toScVal(),
    ];

    expect(expectedResult).toEqual(scValsResult);
  });

  // Enum Details: https://developers.stellar.org/docs/learn/fundamentals/contract-development/types/custom-types#enum-unit-and-tuple-variants
  // Enum with Unit Variant
  it("resolves a Unit Enum", () => {
    const args = {
      enum: {
        tag: "First",
      },
    };

    const scVals: xdr.ScVal[] = [];
    const scValsResult = getScValsFromArgs(args, scVals);
    const expectedResult: xdr.ScVal[] = [
      xdr.ScVal.scvVec([xdr.ScVal.scvSymbol("First")]),
    ];

    expect(expectedResult).toEqual(scValsResult);
  });

  // Enum with Tuple Variant
  it("resolves a Tuple Enum", () => {
    const args = {
      enum: [
        {
          value: "meow",
          type: "symbol",
        },
        {
          value: "12",
          type: "u32",
        },
      ],
    };

    const scVals: xdr.ScVal[] = [];
    const scValsResult = getScValsFromArgs(args, scVals);

    const expectedResult: xdr.ScVal[] = [
      xdr.ScVal.scvVec([xdr.ScVal.scvSymbol("meow"), xdr.ScVal.scvU32(12)]),
    ];

    expect(expectedResult).toEqual(scValsResult);
  });

  // Enum with Integer Variant
  it("resolves a Integer Enum", () => {
    const args = {
      card: {
        enum: "13",
      },
    };

    const scVals: xdr.ScVal[] = [];
    const scValsResult = getScValsFromArgs(args, scVals);

    const expectedResult: xdr.ScVal[] = [xdr.ScVal.scvU32(13)];
    expect(expectedResult).toEqual(scValsResult);
  });

  // Struct Details: https://developers.stellar.org/docs/learn/fundamentals/contract-development/types/custom-types#structs-with-named-fields
  // Struct - Simple
  it("resolves a struct", () => {
    const args = {
      struct: {
        a: {
          value: "10",
          type: "u32",
        },
        b: {
          value: "false",
          type: "bool",
        },
        c: {
          value: "Soroban",
          type: "symbol",
        },
      },
    };

    const scVals: xdr.ScVal[] = [];
    const scValsResult = getScValsFromArgs(args, scVals);
    const expectedResult: xdr.ScVal[] = [
      xdr.ScVal.scvMap([
        new xdr.ScMapEntry({
          key: xdr.ScVal.scvSymbol("a"),
          val: xdr.ScVal.scvU32(10),
        }),
        new xdr.ScMapEntry({
          key: xdr.ScVal.scvSymbol("b"),
          val: xdr.ScVal.scvBool(false),
        }),
        new xdr.ScMapEntry({
          key: xdr.ScVal.scvSymbol("c"),
          val: xdr.ScVal.scvSymbol("Soroban"),
        }),
      ]),
    ];

    expect(expectedResult).toEqual(scValsResult);
  });

  // Complex Enum with Struct
  it("resolves a complex enum with a struct", () => {
    const args = {
      complex: {
        tag: "Struct",
        values: [
          {
            a: {
              value: "10",
              type: "u32",
            },
            b: {
              value: "true",
              type: "bool",
            },
            c: {
              value: "meow",
              type: "symbol",
            },
          },
        ],
      },
    };

    const scVals: xdr.ScVal[] = [];
    const scValsResult = getScValsFromArgs(args, scVals);
    const vec = [
      xdr.ScVal.scvSymbol(args.complex.tag),
      xdr.ScVal.scvMap([
        new xdr.ScMapEntry({
          key: xdr.ScVal.scvSymbol("a"),
          val: xdr.ScVal.scvU32(10),
        }),
        new xdr.ScMapEntry({
          key: xdr.ScVal.scvSymbol("b"),
          val: xdr.ScVal.scvBool(true),
        }),
        new xdr.ScMapEntry({
          key: xdr.ScVal.scvSymbol("c"),
          val: xdr.ScVal.scvSymbol("meow"),
        }),
      ]),
    ];

    const expectedResult: xdr.ScVal[] = [xdr.ScVal.scvVec(vec)];
    expect(expectedResult).toEqual(scValsResult);
  });

  // Complex Enum with Tuple
  it("resolves a complex enum with a tuple struct", () => {
    const args = {
      complex: {
        tag: "Tuple",
        values: [
          [
            {
              a: {
                value: "10",
                type: "u32",
              },
              b: {
                value: "false",
                type: "bool",
              },
              c: {
                value: "Tuple",
                type: "symbol",
              },
            },
            {
              tag: "First",
            },
          ],
        ],
      },
    };

    const scVals: xdr.ScVal[] = [];
    const scValsResult = getScValsFromArgs(args, scVals);
    const vec = [
      xdr.ScVal.scvSymbol("Tuple"),
      xdr.ScVal.scvVec([
        xdr.ScVal.scvMap([
          new xdr.ScMapEntry({
            key: xdr.ScVal.scvSymbol("a"),
            val: xdr.ScVal.scvU32(10),
          }),
          new xdr.ScMapEntry({
            key: xdr.ScVal.scvSymbol("b"),
            val: xdr.ScVal.scvBool(false),
          }),
          new xdr.ScMapEntry({
            key: xdr.ScVal.scvSymbol("c"),
            val: xdr.ScVal.scvSymbol("Tuple"),
          }),
        ]),
        xdr.ScVal.scvVec([xdr.ScVal.scvSymbol("First")]),
      ]),
    ];

    const expectedResult: xdr.ScVal[] = [xdr.ScVal.scvVec(vec)];
    expect(expectedResult).toEqual(scValsResult);
  });

  // Complex Enum with Enum
  it("resolves a complex enum with an enum", () => {
    const args = {
      complex: {
        tag: "Enum",
        values: [
          {
            tag: "First",
          },
        ],
      },
    };

    const scVals: xdr.ScVal[] = [];
    const scValsResult = getScValsFromArgs(args, scVals);
    const vec = [
      xdr.ScVal.scvSymbol(args.complex.tag),
      xdr.ScVal.scvVec([xdr.ScVal.scvSymbol(args.complex.values[0].tag)]),
    ];

    const expectedResult: xdr.ScVal[] = [xdr.ScVal.scvVec(vec)];
    expect(expectedResult).toEqual(scValsResult);
  });

  // Complex Enum with Address
  it("resolves a complex enum with Address", () => {
    const args = {
      complex: {
        tag: "Asset",
        values: [
          {
            value: "GBPIMUEJFYS7RT23QO2ACH2JMKGXLXZI4E5ACBSQMF32RKZ5H3SVNL5F",
            type: "address",
          },
          {
            value: "10",
            type: "i128",
          },
        ],
      },
    };

    const scVals: xdr.ScVal[] = [];
    const scValsResult = getScValsFromArgs(args, scVals);
    const vec = [
      xdr.ScVal.scvSymbol(args.complex.tag),
      new Address(args.complex.values[0].value).toScVal(),
      new ScInt(args.complex.values[1].value, { type: "i128" }).toScVal(),
    ];

    const expectedResult: xdr.ScVal[] = [xdr.ScVal.scvVec(vec)];
    expect(expectedResult).toEqual(scValsResult);
  });

  // Complex Enum with Void
  it("resolves a complex enum with Void", () => {
    const args = {
      complex: {
        tag: "Void",
      },
    };

    const scVals: xdr.ScVal[] = [];
    const scValsResult = getScValsFromArgs(args, scVals);
    const vec = [xdr.ScVal.scvSymbol(args.complex.tag)];

    const expectedResult: xdr.ScVal[] = [xdr.ScVal.scvVec(vec)];
    expect(expectedResult).toEqual(scValsResult);
  });

  // @TODO Union Case with Tuple
  // CBBBUV6XRCPRL4C4K7DQJSU2UL37B3XJYORXDCXLOKMZUQFH4COCNANI (Signer Example)
  // it("resolves a union case with a tuple", () => {
  //   const args = {
  //     tag: "Policy",
  //     values: [
  //       {
  //         value: "GBPIMUEJFYS7RT23QO2ACH2JMKGXLXZI4E5ACBSQMF32RKZ5H3SVNL5F",
  //         type: "address",
  //       },
  //       [
  //         {
  //           value: "10",
  //           type: "u32",
  //         },
  //       ],
  //       [
  //         [
  //           {
  //             "0": {
  //               value:
  //                 "GB6SJHJIB4NJJOMLAX4OMNR24LXDBOF4SU57UDVAEFJVZGAPXRSXVTVI",
  //               type: "address",
  //             },
  //             "1": [
  //               {
  //                 tag: "Policy",
  //                 values: [
  //                   {
  //                     value:
  //                       "GB6SJHJIB4NJJOMLAX4OMNR24LXDBOF4SU57UDVAEFJVZGAPXRSXVTVI",
  //                     type: "address",
  //                   },
  //                 ],
  //               },
  //             ],
  //           },
  //         ],
  //       ],
  //       {
  //         tag: "Persistent",
  //       },
  //     ],
  //   };
  // });

  // @TODO
  // Enum - Integer
  // it("resolves a Integer Enum", () => {});

  // Not supported:
  // BytesN
});
