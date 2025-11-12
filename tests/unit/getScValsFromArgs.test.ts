// Jest globals (describe, expect, it) are available globally
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

  // Multiple complex arguments (struct, map, etc.)
  it("resolves multiple struct arguments", () => {
    const args = {
      struct1: {
        a: {
          value: "10",
          type: "u32",
        },
        b: {
          value: "false",
          type: "bool",
        },
      },
      struct2: {
        c: {
          value: "20",
          type: "u32",
        },
        d: {
          value: "true",
          type: "bool",
        },
      },
    };

    const scVals: xdr.ScVal[] = [];
    const scValsResult = getScValsFromArgs(args, scVals);
    const expectedResult: xdr.ScVal[] = [
      // First argument: struct1
      xdr.ScVal.scvMap([
        new xdr.ScMapEntry({
          key: xdr.ScVal.scvSymbol("a"),
          val: xdr.ScVal.scvU32(10),
        }),
        new xdr.ScMapEntry({
          key: xdr.ScVal.scvSymbol("b"),
          val: xdr.ScVal.scvBool(false),
        }),
      ]),
      // Second argument: struct2
      xdr.ScVal.scvMap([
        new xdr.ScMapEntry({
          key: xdr.ScVal.scvSymbol("c"),
          val: xdr.ScVal.scvU32(20),
        }),
        new xdr.ScMapEntry({
          key: xdr.ScVal.scvSymbol("d"),
          val: xdr.ScVal.scvBool(true),
        }),
      ]),
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

  // Mixed primitive and enum arguments: address: address, status: CustomStatus
  it("resolves mixed primitive and enum arguments", () => {
    const args = {
      address: {
        value: "GBPIMUEJFYS7RT23QO2ACH2JMKGXLXZI4E5ACBSQMF32RKZ5H3SVNL5F",
        type: "address",
      },
      status: {
        tag: "Active",
      },
    };

    const scVals: xdr.ScVal[] = [];
    const scValsResult = getScValsFromArgs(args, scVals);

    const expectedResult: xdr.ScVal[] = [
      // First argument: address
      new Address(args.address.value).toScVal(),
      // Second argument: CustomStatus enum (unit variant)
      xdr.ScVal.scvVec([xdr.ScVal.scvSymbol("Active")]),
    ];
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

  // Resolves Struct with Complex Fields
  it("resolves a struct with complex fields", () => {
    const args = {
      config: {
        admin: {
          value: "GBQXC7ZQHOUAM5JBU5YEC7VE2AT3GUQKK5ACH47HM77CDC7QBU5VZEEV",
          type: "address",
        },
        assets: [
          {
            tag: "Stellar",
            values: [
              {
                value:
                  "CAQCFVLOBK5GIULPNZRGATJJMIZL5BSP7X5YJVMGCPTUEPFM4AVSRCJU",
                type: "address",
              },
            ],
          },
        ],
        base_asset: {
          tag: "Stellar",
          values: [
            {
              value: "CAQCFVLOBK5GIULPNZRGATJJMIZL5BSP7X5YJVMGCPTUEPFM4AVSRCJU",
              type: "address",
            },
          ],
        },
        cache_size: {
          value: "100",
          type: "u32",
        },
        decimals: {
          value: "200",
          type: "u32",
        },
        fee_config: {
          tag: "Some",
          values: [
            [
              {
                value:
                  "GBQXC7ZQHOUAM5JBU5YEC7VE2AT3GUQKK5ACH47HM77CDC7QBU5VZEEV",
                type: "address",
              },
              {
                value: "10",
                type: "i128",
              },
            ],
          ],
        },
        history_retention_period: {
          value: "100",
          type: "u64",
        },
        resolution: {
          value: "100",
          type: "u32",
        },
      },
    };

    const scVals: xdr.ScVal[] = [];
    const scValsResult = getScValsFromArgs(args, scVals);

    const expectedResult: xdr.ScVal[] = [
      xdr.ScVal.scvMap([
        new xdr.ScMapEntry({
          key: xdr.ScVal.scvSymbol("admin"),
          val: new Address("GBQXC7ZQHOUAM5JBU5YEC7VE2AT3GUQKK5ACH47HM77CDC7QBU5VZEEV").toScVal(),
        }),
        new xdr.ScMapEntry({
          key: xdr.ScVal.scvSymbol("assets"),
          val: xdr.ScVal.scvVec([
            xdr.ScVal.scvVec([
              xdr.ScVal.scvSymbol("Stellar"),
              new Address("CAQCFVLOBK5GIULPNZRGATJJMIZL5BSP7X5YJVMGCPTUEPFM4AVSRCJU").toScVal(),
            ]),
          ]),
        }),
        new xdr.ScMapEntry({
          key: xdr.ScVal.scvSymbol("base_asset"),
          val: xdr.ScVal.scvVec([
            xdr.ScVal.scvSymbol("Stellar"),
            new Address("CAQCFVLOBK5GIULPNZRGATJJMIZL5BSP7X5YJVMGCPTUEPFM4AVSRCJU").toScVal(),
          ]),
        }),
        new xdr.ScMapEntry({
          key: xdr.ScVal.scvSymbol("cache_size"),
          val: xdr.ScVal.scvU32(100),
        }),
        new xdr.ScMapEntry({
          key: xdr.ScVal.scvSymbol("decimals"),
          val: xdr.ScVal.scvU32(200),
        }),
        new xdr.ScMapEntry({
          key: xdr.ScVal.scvSymbol("fee_config"),
          val: xdr.ScVal.scvVec([
            xdr.ScVal.scvSymbol("Some"),
            xdr.ScVal.scvVec([
              new Address("GBQXC7ZQHOUAM5JBU5YEC7VE2AT3GUQKK5ACH47HM77CDC7QBU5VZEEV").toScVal(),
              new ScInt("10", { type: "i128" }).toScVal(),
            ]),
          ]),
        }),
        new xdr.ScMapEntry({
          key: xdr.ScVal.scvSymbol("history_retention_period"),
          val: xdr.ScVal.scvU64(new xdr.Uint64("100")),
        }),
        new xdr.ScMapEntry({
          key: xdr.ScVal.scvSymbol("resolution"),
          val: xdr.ScVal.scvU32(100),
        }),
      ]),
    ];

    expect(expectedResult).toEqual(scValsResult);
  });
});
