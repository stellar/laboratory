import { SAVED_ACCOUNT_1 } from "./localStorage";

// 'other_custom_types' that includes all types from soroban examples
// CBHQGTSBJWA54K67RSG3JPXSZY5IXIZ4FSLJM4PQ33FA3FYCU5YZV7MZ
export const MOCK_CONTRACT_JSON_SCHEMA = {
  $schema: "http://json-schema.org/draft-07/schema#",
  definitions: {
    U32: {
      type: "integer",
      minimum: 0,
      maximum: 4294967295,
    },
    I32: {
      type: "integer",
      minimum: -2147483648,
      maximum: 2147483647,
    },
    U64: {
      type: "string",
      pattern: "^([1-9][0-9]*|0)$",
      minLength: 1,
      maxLength: 20,
    },
    I64: {
      type: "string",
      pattern: "^(-?[1-9][0-9]*|0)$",
      minLength: 1,
      maxLength: 21,
    },
    U128: {
      type: "string",
      pattern: "^([1-9][0-9]*|0)$",
      minLength: 1,
      maxLength: 39,
    },
    I128: {
      type: "string",
      pattern: "^(-?[1-9][0-9]*|0)$",
      minLength: 1,
      maxLength: 40,
    },
    U256: {
      type: "string",
      pattern: "^([1-9][0-9]*|0)$",
      minLength: 1,
      maxLength: 78,
    },
    I256: {
      type: "string",
      pattern: "^(-?[1-9][0-9]*|0)$",
      minLength: 1,
      maxLength: 79,
    },
    Address: {
      type: "string",
      format: "address",
      description: "Address can be a public key or contract id",
    },
    ScString: {
      type: "string",
      description: "ScString is a string",
    },
    ScSymbol: {
      type: "string",
      description: "ScString is a string",
    },
    DataUrl: {
      type: "string",
      pattern:
        "^(?:[A-Za-z0-9+\\/]{4})*(?:[A-Za-z0-9+\\/]{2}==|[A-Za-z0-9+\\/]{3}=)?$",
    },
    Test: {
      description: "This is from the rust doc above the struct Test",
      properties: {
        a: {
          $ref: "#/definitions/U32",
        },
        b: {
          type: "boolean",
        },
        c: {
          $ref: "#/definitions/ScSymbol",
        },
        additionalProperties: false,
      },
      required: ["a", "b", "c"],
      type: "object",
    },
    SimpleEnum: {
      oneOf: [
        {
          type: "object",
          title: "First",
          properties: {
            tag: "First",
          },
          additionalProperties: false,
          required: ["tag"],
        },
        {
          type: "object",
          title: "Second",
          properties: {
            tag: "Second",
          },
          additionalProperties: false,
          required: ["tag"],
        },
        {
          type: "object",
          title: "Third",
          properties: {
            tag: "Third",
          },
          additionalProperties: false,
          required: ["tag"],
        },
      ],
    },
    RoyalCard: {
      oneOf: [
        {
          description: "",
          title: "Jack",
          enum: [11],
          type: "number",
        },
        {
          description: "",
          title: "Queen",
          enum: [12],
          type: "number",
        },
        {
          description: "",
          title: "King",
          enum: [13],
          type: "number",
        },
      ],
    },
    TupleStruct: {
      type: "array",
      items: [
        {
          $ref: "#/definitions/Test",
        },
        {
          $ref: "#/definitions/SimpleEnum",
        },
      ],
      minItems: 2,
      maxItems: 2,
    },
    ComplexEnum: {
      oneOf: [
        {
          type: "object",
          title: "Struct",
          properties: {
            tag: "Struct",
            values: {
              type: "array",
              items: [
                {
                  $ref: "#/definitions/Test",
                },
              ],
            },
          },
          required: ["tag", "values"],
          additionalProperties: false,
        },
        {
          type: "object",
          title: "Tuple",
          properties: {
            tag: "Tuple",
            values: {
              type: "array",
              items: [
                {
                  $ref: "#/definitions/TupleStruct",
                },
              ],
            },
          },
          required: ["tag", "values"],
          additionalProperties: false,
        },
        {
          type: "object",
          title: "Enum",
          properties: {
            tag: "Enum",
            values: {
              type: "array",
              items: [
                {
                  $ref: "#/definitions/SimpleEnum",
                },
              ],
            },
          },
          required: ["tag", "values"],
          additionalProperties: false,
        },
        {
          type: "object",
          title: "Asset",
          properties: {
            tag: "Asset",
            values: {
              type: "array",
              items: [
                {
                  $ref: "#/definitions/Address",
                },
                {
                  $ref: "#/definitions/I128",
                },
              ],
            },
          },
          required: ["tag", "values"],
          additionalProperties: false,
        },
        {
          type: "object",
          title: "Void",
          properties: {
            tag: "Void",
          },
          additionalProperties: false,
          required: ["tag"],
        },
      ],
    },
    hello: {
      properties: {
        args: {
          additionalProperties: false,
          properties: {
            hello: {
              $ref: "#/definitions/ScSymbol",
            },
          },
          type: "object",
          required: ["hello"],
        },
      },
      additionalProperties: false,
    },
    auth: {
      properties: {
        args: {
          additionalProperties: false,
          properties: {
            addr: {
              $ref: "#/definitions/Address",
            },
            world: {
              $ref: "#/definitions/ScSymbol",
            },
          },
          type: "object",
          required: ["addr", "world"],
        },
      },
      additionalProperties: false,
    },
    get_count: {
      properties: {
        args: {
          additionalProperties: false,
          properties: {},
          type: "object",
        },
      },
      additionalProperties: false,
    },
    inc: {
      properties: {
        args: {
          additionalProperties: false,
          properties: {},
          type: "object",
        },
      },
      additionalProperties: false,
    },
    woid: {
      properties: {
        args: {
          additionalProperties: false,
          properties: {},
          type: "object",
        },
      },
      additionalProperties: false,
    },
    val: {
      properties: {
        args: {
          additionalProperties: false,
          properties: {},
          type: "object",
        },
      },
      additionalProperties: false,
    },
    u32_fail_on_even: {
      properties: {
        args: {
          additionalProperties: false,
          properties: {
            u32_: {
              $ref: "#/definitions/U32",
            },
          },
          type: "object",
          required: ["u32_"],
        },
      },
      additionalProperties: false,
    },
    u32_: {
      properties: {
        args: {
          additionalProperties: false,
          properties: {
            u32_: {
              $ref: "#/definitions/U32",
            },
          },
          type: "object",
          required: ["u32_"],
        },
      },
      additionalProperties: false,
    },
    i32_: {
      properties: {
        args: {
          additionalProperties: false,
          properties: {
            i32_: {
              $ref: "#/definitions/I32",
            },
          },
          type: "object",
          required: ["i32_"],
        },
      },
      additionalProperties: false,
    },
    i64_: {
      properties: {
        args: {
          additionalProperties: false,
          properties: {
            i64_: {
              $ref: "#/definitions/I64",
            },
          },
          type: "object",
          required: ["i64_"],
        },
      },
      additionalProperties: false,
    },
    struct_hel: {
      properties: {
        args: {
          additionalProperties: false,
          properties: {
            struct: {
              $ref: "#/definitions/Test",
            },
          },
          type: "object",
          required: ["struct"],
        },
      },
      description: "Example contract method which takes a struct",
      additionalProperties: false,
    },
    struct: {
      properties: {
        args: {
          additionalProperties: false,
          properties: {
            struct: {
              $ref: "#/definitions/Test",
            },
          },
          type: "object",
          required: ["struct"],
        },
      },
      additionalProperties: false,
    },
    simple: {
      properties: {
        args: {
          additionalProperties: false,
          properties: {
            simple: {
              $ref: "#/definitions/SimpleEnum",
            },
          },
          type: "object",
          required: ["simple"],
        },
      },
      additionalProperties: false,
    },
    complex: {
      properties: {
        args: {
          additionalProperties: false,
          properties: {
            complex: {
              $ref: "#/definitions/ComplexEnum",
            },
          },
          type: "object",
          required: ["complex"],
        },
      },
      additionalProperties: false,
    },
    addresse: {
      properties: {
        args: {
          additionalProperties: false,
          properties: {
            addresse: {
              $ref: "#/definitions/Address",
            },
          },
          type: "object",
          required: ["addresse"],
        },
      },
      additionalProperties: false,
    },
    bytes: {
      properties: {
        args: {
          additionalProperties: false,
          properties: {
            bytes: {
              $ref: "#/definitions/DataUrl",
            },
          },
          type: "object",
          required: ["bytes"],
        },
      },
      additionalProperties: false,
    },
    bytes_n: {
      properties: {
        args: {
          additionalProperties: false,
          properties: {
            bytes_n: {
              $ref: "#/definitions/DataUrl",
              maxLength: 9,
            },
          },
          type: "object",
          required: ["bytes_n"],
        },
      },
      additionalProperties: false,
    },
    card: {
      properties: {
        args: {
          additionalProperties: false,
          properties: {
            card: {
              $ref: "#/definitions/RoyalCard",
            },
          },
          type: "object",
          required: ["card"],
        },
      },
      additionalProperties: false,
    },
    boolean: {
      properties: {
        args: {
          additionalProperties: false,
          properties: {
            boolean: {
              type: "boolean",
            },
          },
          type: "object",
          required: ["boolean"],
        },
      },
      additionalProperties: false,
    },
    not: {
      properties: {
        args: {
          additionalProperties: false,
          properties: {
            boolean: {
              type: "boolean",
            },
          },
          type: "object",
          required: ["boolean"],
        },
      },
      description: "Negates a boolean value",
      additionalProperties: false,
    },
    i128: {
      properties: {
        args: {
          additionalProperties: false,
          properties: {
            i128: {
              $ref: "#/definitions/I128",
            },
          },
          type: "object",
          required: ["i128"],
        },
      },
      additionalProperties: false,
    },
    u128: {
      properties: {
        args: {
          additionalProperties: false,
          properties: {
            u128: {
              $ref: "#/definitions/U128",
            },
          },
          type: "object",
          required: ["u128"],
        },
      },
      additionalProperties: false,
    },
    multi_args: {
      properties: {
        args: {
          additionalProperties: false,
          properties: {
            a: {
              $ref: "#/definitions/U32",
            },
            b: {
              type: "boolean",
            },
          },
          type: "object",
          required: ["a", "b"],
        },
      },
      additionalProperties: false,
    },
    map: {
      properties: {
        args: {
          additionalProperties: false,
          properties: {
            map: {
              type: "array",
              items: {
                type: "array",
                items: [
                  {
                    $ref: "#/definitions/U32",
                  },
                  {
                    type: "boolean",
                  },
                ],
                minItems: 2,
                maxItems: 2,
              },
            },
          },
          type: "object",
          required: ["map"],
        },
      },
      additionalProperties: false,
    },
    vec: {
      properties: {
        args: {
          additionalProperties: false,
          properties: {
            vec: {
              type: "array",
              items: {
                $ref: "#/definitions/U32",
              },
            },
          },
          type: "object",
          required: ["vec"],
        },
      },
      additionalProperties: false,
    },
    tuple: {
      properties: {
        args: {
          additionalProperties: false,
          properties: {
            tuple: {
              type: "array",
              items: [
                {
                  $ref: "#/definitions/ScSymbol",
                },
                {
                  $ref: "#/definitions/U32",
                },
              ],
              minItems: 2,
              maxItems: 2,
            },
          },
          type: "object",
          required: ["tuple"],
        },
      },
      additionalProperties: false,
    },
    option: {
      properties: {
        args: {
          additionalProperties: false,
          properties: {
            option: {
              $ref: "#/definitions/U32",
            },
          },
          type: "object",
        },
      },
      description: "Example of an optional argument",
      additionalProperties: false,
    },
    u256: {
      properties: {
        args: {
          additionalProperties: false,
          properties: {
            u256: {
              $ref: "#/definitions/U256",
            },
          },
          type: "object",
          required: ["u256"],
        },
      },
      additionalProperties: false,
    },
    i256: {
      properties: {
        args: {
          additionalProperties: false,
          properties: {
            i256: {
              $ref: "#/definitions/I256",
            },
          },
          type: "object",
          required: ["i256"],
        },
      },
      additionalProperties: false,
    },
    string: {
      properties: {
        args: {
          additionalProperties: false,
          properties: {
            string: {
              $ref: "#/definitions/ScString",
            },
          },
          type: "object",
          required: ["string"],
        },
      },
      additionalProperties: false,
    },
    tuple_struct: {
      properties: {
        args: {
          additionalProperties: false,
          properties: {
            tuple_struct: {
              $ref: "#/definitions/TupleStruct",
            },
          },
          type: "object",
          required: ["tuple_struct"],
        },
      },
      additionalProperties: false,
    },
  },
};

export const MOCK_CONTRACT_XDR = [
  "AAAAAQAAAC9UaGlzIGlzIGZyb20gdGhlIHJ1c3QgZG9jIGFib3ZlIHRoZSBzdHJ1Y3QgVGVzdAAAAAAAAAAABFRlc3QAAAADAAAAAAAAAAFhAAAAAAAABAAAAAAAAAABYgAAAAAAAAEAAAAAAAAAAWMAAAAAAAAR",
  "AAAAAgAAAAAAAAAAAAAAClNpbXBsZUVudW0AAAAAAAMAAAAAAAAAAAAAAAVGaXJzdAAAAAAAAAAAAAAAAAAABlNlY29uZAAAAAAAAAAAAAAAAAAFVGhpcmQAAAA=",
  "AAAAAwAAAAAAAAAAAAAACVJveWFsQ2FyZAAAAAAAAAMAAAAAAAAABEphY2sAAAALAAAAAAAAAAVRdWVlbgAAAAAAAAwAAAAAAAAABEtpbmcAAAAN",
  "AAAAAQAAAAAAAAAAAAAAC1R1cGxlU3RydWN0AAAAAAIAAAAAAAAAATAAAAAAAAfQAAAABFRlc3QAAAAAAAAAATEAAAAAAAfQAAAAClNpbXBsZUVudW0AAA==",
  "AAAAAgAAAAAAAAAAAAAAC0NvbXBsZXhFbnVtAAAAAAUAAAABAAAAAAAAAAZTdHJ1Y3QAAAAAAAEAAAfQAAAABFRlc3QAAAABAAAAAAAAAAVUdXBsZQAAAAAAAAEAAAfQAAAAC1R1cGxlU3RydWN0AAAAAAEAAAAAAAAABEVudW0AAAABAAAH0AAAAApTaW1wbGVFbnVtAAAAAAABAAAAAAAAAAVBc3NldAAAAAAAAAIAAAATAAAACwAAAAAAAAAAAAAABFZvaWQ=",
  "AAAABAAAAAAAAAAAAAAABUVycm9yAAAAAAAAAQAAABxQbGVhc2UgcHJvdmlkZSBhbiBvZGQgbnVtYmVyAAAAD051bWJlck11c3RCZU9kZAAAAAAB",
  "AAAAAAAAAAAAAAAFaGVsbG8AAAAAAAABAAAAAAAAAAVoZWxsbwAAAAAAABEAAAABAAAAEQ==",
  "AAAAAAAAAAAAAAAEYXV0aAAAAAIAAAAAAAAABGFkZHIAAAATAAAAAAAAAAV3b3JsZAAAAAAAABEAAAABAAAAEw==",
  "AAAAAAAAAAAAAAAJZ2V0X2NvdW50AAAAAAAAAAAAAAEAAAAE",
  "AAAAAAAAAAAAAAADaW5jAAAAAAAAAAABAAAABA==",
  "AAAAAAAAAAAAAAAEd29pZAAAAAAAAAAA",
  "AAAAAAAAAAAAAAADdmFsAAAAAAAAAAABAAAAAA==",
  "AAAAAAAAAAAAAAAQdTMyX2ZhaWxfb25fZXZlbgAAAAEAAAAAAAAABHUzMl8AAAAEAAAAAQAAA+kAAAAEAAAAAw==",
  "AAAAAAAAAAAAAAAEdTMyXwAAAAEAAAAAAAAABHUzMl8AAAAEAAAAAQAAAAQ=",
  "AAAAAAAAAAAAAAAEaTMyXwAAAAEAAAAAAAAABGkzMl8AAAAFAAAAAQAAAAU=",
  "AAAAAAAAAAAAAAAEaTY0XwAAAAEAAAAAAAAABGk2NF8AAAAHAAAAAQAAAAc=",
  "AAAAAAAAACxFeGFtcGxlIGNvbnRyYWN0IG1ldGhvZCB3aGljaCB0YWtlcyBhIHN0cnVjdAAAAApzdHJ1a3RfaGVsAAAAAAABAAAAAAAAAAZzdHJ1a3QAAAAAB9AAAAAEVGVzdAAAAAEAAAPqAAAAEQ==",
  "AAAAAAAAAAAAAAAGc3RydWt0AAAAAAABAAAAAAAAAAZzdHJ1a3QAAAAAB9AAAAAEVGVzdAAAAAEAAAfQAAAABFRlc3Q=",
  "AAAAAAAAAAAAAAAGc2ltcGxlAAAAAAABAAAAAAAAAAZzaW1wbGUAAAAAB9AAAAAKU2ltcGxlRW51bQAAAAAAAQAAB9AAAAAKU2ltcGxlRW51bQAA",
  "AAAAAAAAAAAAAAAHY29tcGxleAAAAAABAAAAAAAAAAdjb21wbGV4AAAAB9AAAAALQ29tcGxleEVudW0AAAAAAQAAB9AAAAALQ29tcGxleEVudW0A",
  "AAAAAAAAAAAAAAAIYWRkcmVzc2UAAAABAAAAAAAAAAhhZGRyZXNzZQAAABMAAAABAAAAEw==",
  "AAAAAAAAAAAAAAAFYnl0ZXMAAAAAAAABAAAAAAAAAAVieXRlcwAAAAAAAA4AAAABAAAADg==",
  "AAAAAAAAAAAAAAAHYnl0ZXNfbgAAAAABAAAAAAAAAAdieXRlc19uAAAAA+4AAAAJAAAAAQAAA+4AAAAJ",
  "AAAAAAAAAAAAAAAEY2FyZAAAAAEAAAAAAAAABGNhcmQAAAfQAAAACVJveWFsQ2FyZAAAAAAAAAEAAAfQAAAACVJveWFsQ2FyZAAAAA==",
  "AAAAAAAAAAAAAAAHYm9vbGVhbgAAAAABAAAAAAAAAAdib29sZWFuAAAAAAEAAAABAAAAAQ==",
  "AAAAAAAAABdOZWdhdGVzIGEgYm9vbGVhbiB2YWx1ZQAAAAADbm90AAAAAAEAAAAAAAAAB2Jvb2xlYW4AAAAAAQAAAAEAAAAB",
  "AAAAAAAAAAAAAAAEaTEyOAAAAAEAAAAAAAAABGkxMjgAAAALAAAAAQAAAAs=",
  "AAAAAAAAAAAAAAAEdTEyOAAAAAEAAAAAAAAABHUxMjgAAAAKAAAAAQAAAAo=",
  "AAAAAAAAAAAAAAAKbXVsdGlfYXJncwAAAAAAAgAAAAAAAAABYQAAAAAAAAQAAAAAAAAAAWIAAAAAAAABAAAAAQAAAAQ=",
  "AAAAAAAAAAAAAAADbWFwAAAAAAEAAAAAAAAAA21hcAAAAAPsAAAABAAAAAEAAAABAAAD7AAAAAQAAAAB",
  "AAAAAAAAAAAAAAADdmVjAAAAAAEAAAAAAAAAA3ZlYwAAAAPqAAAABAAAAAEAAAPqAAAABA==",
  "AAAAAAAAAAAAAAAFdHVwbGUAAAAAAAABAAAAAAAAAAV0dXBsZQAAAAAAA+0AAAACAAAAEQAAAAQAAAABAAAD7QAAAAIAAAARAAAABA==",
  "AAAAAAAAAB9FeGFtcGxlIG9mIGFuIG9wdGlvbmFsIGFyZ3VtZW50AAAAAAZvcHRpb24AAAAAAAEAAAAAAAAABm9wdGlvbgAAAAAD6AAAAAQAAAABAAAD6AAAAAQ=",
  "AAAAAAAAAAAAAAAEdTI1NgAAAAEAAAAAAAAABHUyNTYAAAAMAAAAAQAAAAw=",
  "AAAAAAAAAAAAAAAEaTI1NgAAAAEAAAAAAAAABGkyNTYAAAANAAAAAQAAAA0=",
  "AAAAAAAAAAAAAAAGc3RyaW5nAAAAAAABAAAAAAAAAAZzdHJpbmcAAAAAABAAAAABAAAAEA==",
  "AAAAAAAAAAAAAAAMdHVwbGVfc3RydWt0AAAAAQAAAAAAAAAMdHVwbGVfc3RydWt0AAAH0AAAAAtUdXBsZVN0cnVjdAAAAAABAAAH0AAAAAtUdXBsZVN0cnVjdAA=",
];

export const MOCK_CONTRACT_DEREFERENCED_JSON_SCHEMA = {
  symbol: {
    name: "hello",
    description: "",
    properties: {
      hello: {
        type: "ScSymbol",
        description: "ScString is a string",
      },
    },
    required: ["hello"],
    additionalProperties: false,
    type: "object",
  },
  call_function: {
    name: "get_count",
    description: "",
    properties: {},
    required: [],
    additionalProperties: false,
    type: "object",
  },
  // test negative numbers
  u32: {
    name: "u32_",
    description: "",
    properties: {
      u32_: {
        type: "U32",
        description: "",
      },
    },
    required: ["u32_"],
    additionalProperties: false,
    type: "object",
  },
  i32: {
    name: "i32_",
    description: "",
    properties: {
      i32_: {
        type: "I32",
        description: "",
      },
    },
    required: ["i32_"],
    additionalProperties: false,
    type: "object",
  },
  // struct with a description
  struct_with_description: {
    name: "struct_hel",
    description: "Example contract method which takes a struct",
    properties: {
      struct: {
        description: "This is from the rust doc above the struct Test",
        properties: {
          a: {
            type: "U32",
            description: "",
          },
          b: {
            type: "Bool",
          },
          c: {
            type: "ScSymbol",
            description: "ScString is a string",
          },
          additionalProperties: false,
        },
        required: ["a", "b", "c"],
        type: "object",
      },
    },
    required: ["struct"],
    additionalProperties: false,
    type: "object",
  },
  struct: {
    name: "struct",
    description: "",
    properties: {
      struct: {
        description: "This is from the rust doc above the struct Test",
        properties: {
          a: {
            type: "U32",
            description: "",
          },
          b: {
            type: "Bool",
          },
          c: {
            type: "ScSymbol",
            description: "ScString is a string",
          },
          additionalProperties: false,
        },
        required: ["a", "b", "c"],
        type: "object",
      },
    },
    required: ["struct"],
    additionalProperties: false,
    type: "object",
  },
  simple_enum: {
    name: "simple",
    description: "",
    properties: {
      simple: {
        oneOf: [
          {
            type: "object",
            title: "First",
            properties: {
              tag: "First",
            },
            additionalProperties: false,
            required: ["tag"],
          },
          {
            type: "object",
            title: "Second",
            properties: {
              tag: "Second",
            },
            additionalProperties: false,
            required: ["tag"],
          },
          {
            type: "object",
            title: "Third",
            properties: {
              tag: "Third",
            },
            additionalProperties: false,
            required: ["tag"],
          },
        ],
      },
    },
    required: ["simple"],
    additionalProperties: false,
    type: "object",
  },
  complex_enum: {
    name: "complex",
    description: "",
    properties: {
      complex: {
        oneOf: [
          {
            type: "object",
            title: "Struct",
            properties: {
              tag: "Struct",
              values: {
                type: "array",
                items: [
                  {
                    description:
                      "This is from the rust doc above the struct Test",
                    properties: {
                      a: {
                        type: "U32",
                        description: "",
                      },
                      b: {
                        type: "Bool",
                      },
                      c: {
                        type: "ScSymbol",
                        description: "ScString is a string",
                      },
                      additionalProperties: false,
                    },
                    required: ["a", "b", "c"],
                    type: "object",
                  },
                ],
              },
            },
            required: ["tag", "values"],
            additionalProperties: false,
          },
          {
            type: "object",
            title: "Tuple",
            properties: {
              tag: "Tuple",
              values: {
                type: "array",
                items: [
                  {
                    type: "array",
                    items: [
                      {
                        description:
                          "This is from the rust doc above the struct Test",
                        properties: {
                          a: {
                            type: "U32",
                            description: "",
                          },
                          b: {
                            type: "Bool",
                          },
                          c: {
                            type: "ScSymbol",
                            description: "ScString is a string",
                          },
                          additionalProperties: false,
                        },
                        required: ["a", "b", "c"],
                        type: "object",
                      },
                      {
                        oneOf: [
                          {
                            type: "object",
                            title: "First",
                            properties: {
                              tag: "First",
                            },
                            additionalProperties: false,
                            required: ["tag"],
                          },
                          {
                            type: "object",
                            title: "Second",
                            properties: {
                              tag: "Second",
                            },
                            additionalProperties: false,
                            required: ["tag"],
                          },
                          {
                            type: "object",
                            title: "Third",
                            properties: {
                              tag: "Third",
                            },
                            additionalProperties: false,
                            required: ["tag"],
                          },
                        ],
                      },
                    ],
                    minItems: 2,
                    maxItems: 2,
                  },
                ],
              },
            },
            required: ["tag", "values"],
            additionalProperties: false,
          },
          {
            type: "object",
            title: "Enum",
            properties: {
              tag: "Enum",
              values: {
                type: "array",
                items: [
                  {
                    oneOf: [
                      {
                        type: "object",
                        title: "First",
                        properties: {
                          tag: "First",
                        },
                        additionalProperties: false,
                        required: ["tag"],
                      },
                      {
                        type: "object",
                        title: "Second",
                        properties: {
                          tag: "Second",
                        },
                        additionalProperties: false,
                        required: ["tag"],
                      },
                      {
                        type: "object",
                        title: "Third",
                        properties: {
                          tag: "Third",
                        },
                        additionalProperties: false,
                        required: ["tag"],
                      },
                    ],
                  },
                ],
              },
            },
            required: ["tag", "values"],
            additionalProperties: false,
          },
          {
            type: "object",
            title: "Asset",
            properties: {
              tag: "Asset",
              values: {
                type: "array",
                items: [
                  {
                    type: "Address",
                    description: "Address can be a public key or contract id",
                  },
                  {
                    type: "I128",
                    description: "",
                  },
                ],
              },
            },
            required: ["tag", "values"],
            additionalProperties: false,
          },
          {
            type: "object",
            title: "Void",
            properties: {
              tag: "Void",
            },
            additionalProperties: false,
            required: ["tag"],
          },
        ],
      },
    },
    required: ["complex"],
    additionalProperties: false,
    type: "object",
  },
  enum_with_integer: {
    name: "card",
    description: "",
    properties: {
      card: {
        oneOf: [null, null, null],
      },
    },
    required: ["card"],
    additionalProperties: false,
    type: "object",
  },
  address: {
    name: "addresse",
    description: "",
    properties: {
      addresse: {
        type: "Address",
        description: "Address can be a public key or contract id",
      },
    },
    required: ["addresse"],
    additionalProperties: false,
    type: "object",
  },
  bytes: {
    name: "bytes",
    description: "",
    properties: {
      bytes: {
        type: "DataUrl",
        description: "",
      },
    },
    required: ["bytes"],
    additionalProperties: false,
    type: "object",
  },
  boolean: {
    name: "boolean",
    description: "",
    properties: {
      boolean: {
        type: "Bool",
      },
    },
    required: ["boolean"],
    additionalProperties: false,
    type: "object",
  },
  multi_args: {
    name: "multi_args",
    description: "",
    properties: {
      a: {
        type: "U32",
        description: "",
      },
      b: {
        type: "Bool",
      },
    },
    required: ["a", "b"],
    additionalProperties: false,
    type: "object",
  },
  map: {
    name: "map",
    description: "",
    properties: {
      map: {
        type: "array",
        items: {
          type: "array",
          items: [
            {
              type: "U32",
              description: "",
            },
            {
              type: "Bool",
            },
          ],
          minItems: 2,
          maxItems: 2,
        },
      },
    },
    required: ["map"],
    additionalProperties: false,
    type: "object",
  },
  vec: {
    name: "vec",
    description: "",
    properties: {
      vec: {
        type: "array",
        items: {
          type: "U32",
          description: "",
        },
      },
    },
    required: ["vec"],
    additionalProperties: false,
    type: "object",
  },
  string: {
    name: "string",
    description: "",
    properties: {
      string: {
        type: "ScString",
        description: "ScString is a string",
      },
    },
    required: ["string"],
    additionalProperties: false,
    type: "object",
  },
  tuple: {
    name: "tuple",
    description: "",
    properties: {
      tuple: {
        type: "array",
        items: [
          {
            type: "ScSymbol",
            description: "ScString is a string",
          },
          {
            type: "U32",
            description: "",
          },
        ],
        minItems: 2,
        maxItems: 2,
      },
    },
    required: ["tuple"],
    additionalProperties: false,
    type: "object",
  },
  tuple_struct: {
    name: "tuple_struct",
    description: "",
    properties: {
      tuple_struct: {
        type: "array",
        items: [
          {
            description: "This is from the rust doc above the struct Test",
            properties: {
              a: {
                type: "U32",
                description: "",
              },
              b: {
                type: "Bool",
              },
              c: {
                type: "ScSymbol",
                description: "ScString is a string",
              },
              additionalProperties: false,
            },
            required: ["a", "b", "c"],
            type: "object",
          },
          {
            oneOf: [
              {
                type: "object",
                title: "First",
                properties: {
                  tag: "First",
                },
                additionalProperties: false,
                required: ["tag"],
              },
              {
                type: "object",
                title: "Second",
                properties: {
                  tag: "Second",
                },
                additionalProperties: false,
                required: ["tag"],
              },
              {
                type: "object",
                title: "Third",
                properties: {
                  tag: "Third",
                },
                additionalProperties: false,
                required: ["tag"],
              },
            ],
          },
        ],
        minItems: 2,
        maxItems: 2,
      },
    },
    required: ["tuple_struct"],
    additionalProperties: false,
    type: "object",
  },
};

export const MOCK_CONTRACT_ID =
  "CBHQGTSBJWA54K67RSG3JPXSZY5IXIZ4FSLJM4PQ33FA3FYCU5YZV7MZ";

export const MOCK_CONTRACT_INFO_RESPONSE_SUCCESS = {
  contract: MOCK_CONTRACT_ID,
  account: MOCK_CONTRACT_ID,
  created: 1731402776,
  creator: SAVED_ACCOUNT_1,
  payments: 300,
  trades: 0,
  wasm: "df88820e231ad8f3027871e5dd3cf45491d7b7735e785731466bfc2946008608",
  storage_entries: 10,
  validation: {
    status: "verified",
    repository: "https://github.com/test-org/test-repo",
    commit: "391f37e39a849ddf7543a5d7f1488e055811cb68",
    ts: 1731402776,
  },
};

export const MOCK_CONTRACT_FUNC_SUCCESS = [
  {
    _attributes: {
      doc: {
        type: "Buffer",
        data: [],
      },
      name: {
        type: "Buffer",
        data: [104, 101, 108, 108, 111],
      },
      inputs: [
        {
          _attributes: {
            doc: {
              type: "Buffer",
              data: [],
            },
            name: {
              type: "Buffer",
              data: [104, 101, 108, 108, 111],
            },
            type: {
              _switch: {
                name: "scSpecTypeSymbol",
                value: 17,
              },
            },
          },
        },
      ],
      outputs: [
        {
          _switch: {
            name: "scSpecTypeSymbol",
            value: 17,
          },
        },
      ],
    },
  },
  {
    _attributes: {
      doc: {
        type: "Buffer",
        data: [],
      },
      name: {
        type: "Buffer",
        data: [97, 117, 116, 104],
      },
      inputs: [
        {
          _attributes: {
            doc: {
              type: "Buffer",
              data: [],
            },
            name: {
              type: "Buffer",
              data: [97, 100, 100, 114],
            },
            type: {
              _switch: {
                name: "scSpecTypeAddress",
                value: 19,
              },
            },
          },
        },
        {
          _attributes: {
            doc: {
              type: "Buffer",
              data: [],
            },
            name: {
              type: "Buffer",
              data: [119, 111, 114, 108, 100],
            },
            type: {
              _switch: {
                name: "scSpecTypeSymbol",
                value: 17,
              },
            },
          },
        },
      ],
      outputs: [
        {
          _switch: {
            name: "scSpecTypeAddress",
            value: 19,
          },
        },
      ],
    },
  },
  {
    _attributes: {
      doc: {
        type: "Buffer",
        data: [],
      },
      name: {
        type: "Buffer",
        data: [103, 101, 116, 95, 99, 111, 117, 110, 116],
      },
      inputs: [],
      outputs: [
        {
          _switch: {
            name: "scSpecTypeU32",
            value: 4,
          },
        },
      ],
    },
  },
  {
    _attributes: {
      doc: {
        type: "Buffer",
        data: [],
      },
      name: {
        type: "Buffer",
        data: [105, 110, 99],
      },
      inputs: [],
      outputs: [
        {
          _switch: {
            name: "scSpecTypeU32",
            value: 4,
          },
        },
      ],
    },
  },
  {
    _attributes: {
      doc: {
        type: "Buffer",
        data: [],
      },
      name: {
        type: "Buffer",
        data: [119, 111, 105, 100],
      },
      inputs: [],
      outputs: [],
    },
  },
  {
    _attributes: {
      doc: {
        type: "Buffer",
        data: [],
      },
      name: {
        type: "Buffer",
        data: [118, 97, 108],
      },
      inputs: [],
      outputs: [
        {
          _switch: {
            name: "scSpecTypeVal",
            value: 0,
          },
        },
      ],
    },
  },
  {
    _attributes: {
      doc: {
        type: "Buffer",
        data: [],
      },
      name: {
        type: "Buffer",
        data: [
          117, 51, 50, 95, 102, 97, 105, 108, 95, 111, 110, 95, 101, 118, 101,
          110,
        ],
      },
      inputs: [
        {
          _attributes: {
            doc: {
              type: "Buffer",
              data: [],
            },
            name: {
              type: "Buffer",
              data: [117, 51, 50, 95],
            },
            type: {
              _switch: {
                name: "scSpecTypeU32",
                value: 4,
              },
            },
          },
        },
      ],
      outputs: [
        {
          _switch: {
            name: "scSpecTypeResult",
            value: 1001,
          },
          _arm: "result",
          _value: {
            _attributes: {
              okType: {
                _switch: {
                  name: "scSpecTypeU32",
                  value: 4,
                },
              },
              errorType: {
                _switch: {
                  name: "scSpecTypeError",
                  value: 3,
                },
              },
            },
          },
        },
      ],
    },
  },
  {
    _attributes: {
      doc: {
        type: "Buffer",
        data: [],
      },
      name: {
        type: "Buffer",
        data: [117, 51, 50, 95],
      },
      inputs: [
        {
          _attributes: {
            doc: {
              type: "Buffer",
              data: [],
            },
            name: {
              type: "Buffer",
              data: [117, 51, 50, 95],
            },
            type: {
              _switch: {
                name: "scSpecTypeU32",
                value: 4,
              },
            },
          },
        },
      ],
      outputs: [
        {
          _switch: {
            name: "scSpecTypeU32",
            value: 4,
          },
        },
      ],
    },
  },
  {
    _attributes: {
      doc: {
        type: "Buffer",
        data: [],
      },
      name: {
        type: "Buffer",
        data: [105, 51, 50, 95],
      },
      inputs: [
        {
          _attributes: {
            doc: {
              type: "Buffer",
              data: [],
            },
            name: {
              type: "Buffer",
              data: [105, 51, 50, 95],
            },
            type: {
              _switch: {
                name: "scSpecTypeI32",
                value: 5,
              },
            },
          },
        },
      ],
      outputs: [
        {
          _switch: {
            name: "scSpecTypeI32",
            value: 5,
          },
        },
      ],
    },
  },
  {
    _attributes: {
      doc: {
        type: "Buffer",
        data: [],
      },
      name: {
        type: "Buffer",
        data: [105, 54, 52, 95],
      },
      inputs: [
        {
          _attributes: {
            doc: {
              type: "Buffer",
              data: [],
            },
            name: {
              type: "Buffer",
              data: [105, 54, 52, 95],
            },
            type: {
              _switch: {
                name: "scSpecTypeI64",
                value: 7,
              },
            },
          },
        },
      ],
      outputs: [
        {
          _switch: {
            name: "scSpecTypeI64",
            value: 7,
          },
        },
      ],
    },
  },
  {
    _attributes: {
      doc: {
        type: "Buffer",
        data: [
          69, 120, 97, 109, 112, 108, 101, 32, 99, 111, 110, 116, 114, 97, 99,
          116, 32, 109, 101, 116, 104, 111, 100, 32, 119, 104, 105, 99, 104, 32,
          116, 97, 107, 101, 115, 32, 97, 32, 115, 116, 114, 117, 99, 116,
        ],
      },
      name: {
        type: "Buffer",
        data: [115, 116, 114, 117, 107, 116, 95, 104, 101, 108],
      },
      inputs: [
        {
          _attributes: {
            doc: {
              type: "Buffer",
              data: [],
            },
            name: {
              type: "Buffer",
              data: [115, 116, 114, 117, 107, 116],
            },
            type: {
              _switch: {
                name: "scSpecTypeUdt",
                value: 2000,
              },
              _arm: "udt",
              _value: {
                _attributes: {
                  name: {
                    type: "Buffer",
                    data: [84, 101, 115, 116],
                  },
                },
              },
            },
          },
        },
      ],
      outputs: [
        {
          _switch: {
            name: "scSpecTypeVec",
            value: 1002,
          },
          _arm: "vec",
          _value: {
            _attributes: {
              elementType: {
                _switch: {
                  name: "scSpecTypeSymbol",
                  value: 17,
                },
              },
            },
          },
        },
      ],
    },
  },
  {
    _attributes: {
      doc: {
        type: "Buffer",
        data: [],
      },
      name: {
        type: "Buffer",
        data: [115, 116, 114, 117, 107, 116],
      },
      inputs: [
        {
          _attributes: {
            doc: {
              type: "Buffer",
              data: [],
            },
            name: {
              type: "Buffer",
              data: [115, 116, 114, 117, 107, 116],
            },
            type: {
              _switch: {
                name: "scSpecTypeUdt",
                value: 2000,
              },
              _arm: "udt",
              _value: {
                _attributes: {
                  name: {
                    type: "Buffer",
                    data: [84, 101, 115, 116],
                  },
                },
              },
            },
          },
        },
      ],
      outputs: [
        {
          _switch: {
            name: "scSpecTypeUdt",
            value: 2000,
          },
          _arm: "udt",
          _value: {
            _attributes: {
              name: {
                type: "Buffer",
                data: [84, 101, 115, 116],
              },
            },
          },
        },
      ],
    },
  },
  {
    _attributes: {
      doc: {
        type: "Buffer",
        data: [],
      },
      name: {
        type: "Buffer",
        data: [115, 105, 109, 112, 108, 101],
      },
      inputs: [
        {
          _attributes: {
            doc: {
              type: "Buffer",
              data: [],
            },
            name: {
              type: "Buffer",
              data: [115, 105, 109, 112, 108, 101],
            },
            type: {
              _switch: {
                name: "scSpecTypeUdt",
                value: 2000,
              },
              _arm: "udt",
              _value: {
                _attributes: {
                  name: {
                    type: "Buffer",
                    data: [83, 105, 109, 112, 108, 101, 69, 110, 117, 109],
                  },
                },
              },
            },
          },
        },
      ],
      outputs: [
        {
          _switch: {
            name: "scSpecTypeUdt",
            value: 2000,
          },
          _arm: "udt",
          _value: {
            _attributes: {
              name: {
                type: "Buffer",
                data: [83, 105, 109, 112, 108, 101, 69, 110, 117, 109],
              },
            },
          },
        },
      ],
    },
  },
  {
    _attributes: {
      doc: {
        type: "Buffer",
        data: [],
      },
      name: {
        type: "Buffer",
        data: [99, 111, 109, 112, 108, 101, 120],
      },
      inputs: [
        {
          _attributes: {
            doc: {
              type: "Buffer",
              data: [],
            },
            name: {
              type: "Buffer",
              data: [99, 111, 109, 112, 108, 101, 120],
            },
            type: {
              _switch: {
                name: "scSpecTypeUdt",
                value: 2000,
              },
              _arm: "udt",
              _value: {
                _attributes: {
                  name: {
                    type: "Buffer",
                    data: [67, 111, 109, 112, 108, 101, 120, 69, 110, 117, 109],
                  },
                },
              },
            },
          },
        },
      ],
      outputs: [
        {
          _switch: {
            name: "scSpecTypeUdt",
            value: 2000,
          },
          _arm: "udt",
          _value: {
            _attributes: {
              name: {
                type: "Buffer",
                data: [67, 111, 109, 112, 108, 101, 120, 69, 110, 117, 109],
              },
            },
          },
        },
      ],
    },
  },
  {
    _attributes: {
      doc: {
        type: "Buffer",
        data: [],
      },
      name: {
        type: "Buffer",
        data: [97, 100, 100, 114, 101, 115, 115, 101],
      },
      inputs: [
        {
          _attributes: {
            doc: {
              type: "Buffer",
              data: [],
            },
            name: {
              type: "Buffer",
              data: [97, 100, 100, 114, 101, 115, 115, 101],
            },
            type: {
              _switch: {
                name: "scSpecTypeAddress",
                value: 19,
              },
            },
          },
        },
      ],
      outputs: [
        {
          _switch: {
            name: "scSpecTypeAddress",
            value: 19,
          },
        },
      ],
    },
  },
  {
    _attributes: {
      doc: {
        type: "Buffer",
        data: [],
      },
      name: {
        type: "Buffer",
        data: [98, 121, 116, 101, 115],
      },
      inputs: [
        {
          _attributes: {
            doc: {
              type: "Buffer",
              data: [],
            },
            name: {
              type: "Buffer",
              data: [98, 121, 116, 101, 115],
            },
            type: {
              _switch: {
                name: "scSpecTypeBytes",
                value: 14,
              },
            },
          },
        },
      ],
      outputs: [
        {
          _switch: {
            name: "scSpecTypeBytes",
            value: 14,
          },
        },
      ],
    },
  },
  {
    _attributes: {
      doc: {
        type: "Buffer",
        data: [],
      },
      name: {
        type: "Buffer",
        data: [98, 121, 116, 101, 115, 95, 110],
      },
      inputs: [
        {
          _attributes: {
            doc: {
              type: "Buffer",
              data: [],
            },
            name: {
              type: "Buffer",
              data: [98, 121, 116, 101, 115, 95, 110],
            },
            type: {
              _switch: {
                name: "scSpecTypeBytesN",
                value: 1006,
              },
              _arm: "bytesN",
              _value: {
                _attributes: {
                  n: 9,
                },
              },
            },
          },
        },
      ],
      outputs: [
        {
          _switch: {
            name: "scSpecTypeBytesN",
            value: 1006,
          },
          _arm: "bytesN",
          _value: {
            _attributes: {
              n: 9,
            },
          },
        },
      ],
    },
  },
  {
    _attributes: {
      doc: {
        type: "Buffer",
        data: [],
      },
      name: {
        type: "Buffer",
        data: [99, 97, 114, 100],
      },
      inputs: [
        {
          _attributes: {
            doc: {
              type: "Buffer",
              data: [],
            },
            name: {
              type: "Buffer",
              data: [99, 97, 114, 100],
            },
            type: {
              _switch: {
                name: "scSpecTypeUdt",
                value: 2000,
              },
              _arm: "udt",
              _value: {
                _attributes: {
                  name: {
                    type: "Buffer",
                    data: [82, 111, 121, 97, 108, 67, 97, 114, 100],
                  },
                },
              },
            },
          },
        },
      ],
      outputs: [
        {
          _switch: {
            name: "scSpecTypeUdt",
            value: 2000,
          },
          _arm: "udt",
          _value: {
            _attributes: {
              name: {
                type: "Buffer",
                data: [82, 111, 121, 97, 108, 67, 97, 114, 100],
              },
            },
          },
        },
      ],
    },
  },
  {
    _attributes: {
      doc: {
        type: "Buffer",
        data: [],
      },
      name: {
        type: "Buffer",
        data: [98, 111, 111, 108, 101, 97, 110],
      },
      inputs: [
        {
          _attributes: {
            doc: {
              type: "Buffer",
              data: [],
            },
            name: {
              type: "Buffer",
              data: [98, 111, 111, 108, 101, 97, 110],
            },
            type: {
              _switch: {
                name: "scSpecTypeBool",
                value: 1,
              },
            },
          },
        },
      ],
      outputs: [
        {
          _switch: {
            name: "scSpecTypeBool",
            value: 1,
          },
        },
      ],
    },
  },
  {
    _attributes: {
      doc: {
        type: "Buffer",
        data: [
          78, 101, 103, 97, 116, 101, 115, 32, 97, 32, 98, 111, 111, 108, 101,
          97, 110, 32, 118, 97, 108, 117, 101,
        ],
      },
      name: {
        type: "Buffer",
        data: [110, 111, 116],
      },
      inputs: [
        {
          _attributes: {
            doc: {
              type: "Buffer",
              data: [],
            },
            name: {
              type: "Buffer",
              data: [98, 111, 111, 108, 101, 97, 110],
            },
            type: {
              _switch: {
                name: "scSpecTypeBool",
                value: 1,
              },
            },
          },
        },
      ],
      outputs: [
        {
          _switch: {
            name: "scSpecTypeBool",
            value: 1,
          },
        },
      ],
    },
  },
  {
    _attributes: {
      doc: {
        type: "Buffer",
        data: [],
      },
      name: {
        type: "Buffer",
        data: [105, 49, 50, 56],
      },
      inputs: [
        {
          _attributes: {
            doc: {
              type: "Buffer",
              data: [],
            },
            name: {
              type: "Buffer",
              data: [105, 49, 50, 56],
            },
            type: {
              _switch: {
                name: "scSpecTypeI128",
                value: 11,
              },
            },
          },
        },
      ],
      outputs: [
        {
          _switch: {
            name: "scSpecTypeI128",
            value: 11,
          },
        },
      ],
    },
  },
  {
    _attributes: {
      doc: {
        type: "Buffer",
        data: [],
      },
      name: {
        type: "Buffer",
        data: [117, 49, 50, 56],
      },
      inputs: [
        {
          _attributes: {
            doc: {
              type: "Buffer",
              data: [],
            },
            name: {
              type: "Buffer",
              data: [117, 49, 50, 56],
            },
            type: {
              _switch: {
                name: "scSpecTypeU128",
                value: 10,
              },
            },
          },
        },
      ],
      outputs: [
        {
          _switch: {
            name: "scSpecTypeU128",
            value: 10,
          },
        },
      ],
    },
  },
  {
    _attributes: {
      doc: {
        type: "Buffer",
        data: [],
      },
      name: {
        type: "Buffer",
        data: [109, 117, 108, 116, 105, 95, 97, 114, 103, 115],
      },
      inputs: [
        {
          _attributes: {
            doc: {
              type: "Buffer",
              data: [],
            },
            name: {
              type: "Buffer",
              data: [97],
            },
            type: {
              _switch: {
                name: "scSpecTypeU32",
                value: 4,
              },
            },
          },
        },
        {
          _attributes: {
            doc: {
              type: "Buffer",
              data: [],
            },
            name: {
              type: "Buffer",
              data: [98],
            },
            type: {
              _switch: {
                name: "scSpecTypeBool",
                value: 1,
              },
            },
          },
        },
      ],
      outputs: [
        {
          _switch: {
            name: "scSpecTypeU32",
            value: 4,
          },
        },
      ],
    },
  },
  {
    _attributes: {
      doc: {
        type: "Buffer",
        data: [],
      },
      name: {
        type: "Buffer",
        data: [109, 97, 112],
      },
      inputs: [
        {
          _attributes: {
            doc: {
              type: "Buffer",
              data: [],
            },
            name: {
              type: "Buffer",
              data: [109, 97, 112],
            },
            type: {
              _switch: {
                name: "scSpecTypeMap",
                value: 1004,
              },
              _arm: "map",
              _value: {
                _attributes: {
                  keyType: {
                    _switch: {
                      name: "scSpecTypeU32",
                      value: 4,
                    },
                  },
                  valueType: {
                    _switch: {
                      name: "scSpecTypeBool",
                      value: 1,
                    },
                  },
                },
              },
            },
          },
        },
      ],
      outputs: [
        {
          _switch: {
            name: "scSpecTypeMap",
            value: 1004,
          },
          _arm: "map",
          _value: {
            _attributes: {
              keyType: {
                _switch: {
                  name: "scSpecTypeU32",
                  value: 4,
                },
              },
              valueType: {
                _switch: {
                  name: "scSpecTypeBool",
                  value: 1,
                },
              },
            },
          },
        },
      ],
    },
  },
  {
    _attributes: {
      doc: {
        type: "Buffer",
        data: [],
      },
      name: {
        type: "Buffer",
        data: [118, 101, 99],
      },
      inputs: [
        {
          _attributes: {
            doc: {
              type: "Buffer",
              data: [],
            },
            name: {
              type: "Buffer",
              data: [118, 101, 99],
            },
            type: {
              _switch: {
                name: "scSpecTypeVec",
                value: 1002,
              },
              _arm: "vec",
              _value: {
                _attributes: {
                  elementType: {
                    _switch: {
                      name: "scSpecTypeU32",
                      value: 4,
                    },
                  },
                },
              },
            },
          },
        },
      ],
      outputs: [
        {
          _switch: {
            name: "scSpecTypeVec",
            value: 1002,
          },
          _arm: "vec",
          _value: {
            _attributes: {
              elementType: {
                _switch: {
                  name: "scSpecTypeU32",
                  value: 4,
                },
              },
            },
          },
        },
      ],
    },
  },
  {
    _attributes: {
      doc: {
        type: "Buffer",
        data: [],
      },
      name: {
        type: "Buffer",
        data: [116, 117, 112, 108, 101],
      },
      inputs: [
        {
          _attributes: {
            doc: {
              type: "Buffer",
              data: [],
            },
            name: {
              type: "Buffer",
              data: [116, 117, 112, 108, 101],
            },
            type: {
              _switch: {
                name: "scSpecTypeTuple",
                value: 1005,
              },
              _arm: "tuple",
              _value: {
                _attributes: {
                  valueTypes: [
                    {
                      _switch: {
                        name: "scSpecTypeSymbol",
                        value: 17,
                      },
                    },
                    {
                      _switch: {
                        name: "scSpecTypeU32",
                        value: 4,
                      },
                    },
                  ],
                },
              },
            },
          },
        },
      ],
      outputs: [
        {
          _switch: {
            name: "scSpecTypeTuple",
            value: 1005,
          },
          _arm: "tuple",
          _value: {
            _attributes: {
              valueTypes: [
                {
                  _switch: {
                    name: "scSpecTypeSymbol",
                    value: 17,
                  },
                },
                {
                  _switch: {
                    name: "scSpecTypeU32",
                    value: 4,
                  },
                },
              ],
            },
          },
        },
      ],
    },
  },
  {
    _attributes: {
      doc: {
        type: "Buffer",
        data: [
          69, 120, 97, 109, 112, 108, 101, 32, 111, 102, 32, 97, 110, 32, 111,
          112, 116, 105, 111, 110, 97, 108, 32, 97, 114, 103, 117, 109, 101,
          110, 116,
        ],
      },
      name: {
        type: "Buffer",
        data: [111, 112, 116, 105, 111, 110],
      },
      inputs: [
        {
          _attributes: {
            doc: {
              type: "Buffer",
              data: [],
            },
            name: {
              type: "Buffer",
              data: [111, 112, 116, 105, 111, 110],
            },
            type: {
              _switch: {
                name: "scSpecTypeOption",
                value: 1000,
              },
              _arm: "option",
              _value: {
                _attributes: {
                  valueType: {
                    _switch: {
                      name: "scSpecTypeU32",
                      value: 4,
                    },
                  },
                },
              },
            },
          },
        },
      ],
      outputs: [
        {
          _switch: {
            name: "scSpecTypeOption",
            value: 1000,
          },
          _arm: "option",
          _value: {
            _attributes: {
              valueType: {
                _switch: {
                  name: "scSpecTypeU32",
                  value: 4,
                },
              },
            },
          },
        },
      ],
    },
  },
  {
    _attributes: {
      doc: {
        type: "Buffer",
        data: [],
      },
      name: {
        type: "Buffer",
        data: [117, 50, 53, 54],
      },
      inputs: [
        {
          _attributes: {
            doc: {
              type: "Buffer",
              data: [],
            },
            name: {
              type: "Buffer",
              data: [117, 50, 53, 54],
            },
            type: {
              _switch: {
                name: "scSpecTypeU256",
                value: 12,
              },
            },
          },
        },
      ],
      outputs: [
        {
          _switch: {
            name: "scSpecTypeU256",
            value: 12,
          },
        },
      ],
    },
  },
  {
    _attributes: {
      doc: {
        type: "Buffer",
        data: [],
      },
      name: {
        type: "Buffer",
        data: [105, 50, 53, 54],
      },
      inputs: [
        {
          _attributes: {
            doc: {
              type: "Buffer",
              data: [],
            },
            name: {
              type: "Buffer",
              data: [105, 50, 53, 54],
            },
            type: {
              _switch: {
                name: "scSpecTypeI256",
                value: 13,
              },
            },
          },
        },
      ],
      outputs: [
        {
          _switch: {
            name: "scSpecTypeI256",
            value: 13,
          },
        },
      ],
    },
  },
  {
    _attributes: {
      doc: {
        type: "Buffer",
        data: [],
      },
      name: {
        type: "Buffer",
        data: [115, 116, 114, 105, 110, 103],
      },
      inputs: [
        {
          _attributes: {
            doc: {
              type: "Buffer",
              data: [],
            },
            name: {
              type: "Buffer",
              data: [115, 116, 114, 105, 110, 103],
            },
            type: {
              _switch: {
                name: "scSpecTypeString",
                value: 16,
              },
            },
          },
        },
      ],
      outputs: [
        {
          _switch: {
            name: "scSpecTypeString",
            value: 16,
          },
        },
      ],
    },
  },
  {
    _attributes: {
      doc: {
        type: "Buffer",
        data: [],
      },
      name: {
        type: "Buffer",
        data: [116, 117, 112, 108, 101, 95, 115, 116, 114, 117, 107, 116],
      },
      inputs: [
        {
          _attributes: {
            doc: {
              type: "Buffer",
              data: [],
            },
            name: {
              type: "Buffer",
              data: [116, 117, 112, 108, 101, 95, 115, 116, 114, 117, 107, 116],
            },
            type: {
              _switch: {
                name: "scSpecTypeUdt",
                value: 2000,
              },
              _arm: "udt",
              _value: {
                _attributes: {
                  name: {
                    type: "Buffer",
                    data: [84, 117, 112, 108, 101, 83, 116, 114, 117, 99, 116],
                  },
                },
              },
            },
          },
        },
      ],
      outputs: [
        {
          _switch: {
            name: "scSpecTypeUdt",
            value: 2000,
          },
          _arm: "udt",
          _value: {
            _attributes: {
              name: {
                type: "Buffer",
                data: [84, 117, 112, 108, 101, 83, 116, 114, 117, 99, 116],
              },
            },
          },
        },
      ],
    },
  },
];

export const MOCK_CONTRACT_SPEC_XDR_AI =
  "AAAAAgAAAAAAAAACaGVsbG8AAAAAAAABAAAAAQAAAAAAAAAAAAAAAQAAAAdzdHJpbmc=";

export const MOCK_WASM_CONTRACT_DATA_AI = {
  contractspecv0: {
    xdr: MOCK_CONTRACT_SPEC_XDR_AI,
  },
};

// Mock contract functions that would be parsed from XDR
export const MOCK_CONTRACT_FUNCTIONS_AI = [
  {
    name: "hello",
    inputs: [],
    outputs: [{ type: "string" }],
    docs: "Returns a greeting message",
  },
  {
    name: "increment",
    inputs: [
      {
        name: "value",
        type: "i32",
        docs: "The number to increment",
      },
    ],
    outputs: [{ type: "i32" }],
    docs: "Increments the given value by 1",
  },
  {
    name: "set_admin",
    inputs: [
      {
        name: "admin",
        type: "Address",
        docs: "The new admin address",
      },
    ],
    outputs: [],
    docs: "Sets the contract admin",
  },
  {
    name: "get_balance",
    inputs: [
      {
        name: "account",
        type: "Address",
        docs: "Account to check balance for",
      },
    ],
    outputs: [{ type: "i128" }],
    docs: "Gets account balance",
  },
];
