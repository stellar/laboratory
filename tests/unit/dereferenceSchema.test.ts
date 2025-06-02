import type { JSONSchema7, JSONSchema7Definition } from "json-schema";

import { dereferenceSchema } from "../../src/helpers/dereferenceSchema";

describe("dereferenceSchema", () => {
  // basic primitive schema

  // tuple schema
  it("dereferences the tuple schema correctly", () => {
    const dereferencedSchema = dereferenceSchema(
      TEST_TUPLE_SCHEMA,
      "add_signer",
    );

    expect(dereferencedSchema).toEqual(TEST_TUPLE_SCHEMA_DEREFERENCED);
  });

  it("dereferences the simple array schema with primitive items correctly", () => {
    const dereferencedSchema = dereferenceSchema(
      TEST_ARRAY_SCHEMA,
      "add_relayers",
    );

    expect(dereferencedSchema).toEqual(TEST_ARRAY_SCHEMA_DEREFERENCED);
  });
});

const BUILT_IN_TYPES_DEFINITIONS: { [key: string]: JSONSchema7Definition } = {
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
};

const TEST_ARRAY_SCHEMA: Partial<JSONSchema7> = {
  $schema: "http://json-schema.org/draft-07/schema#",
  definitions: {
    ...BUILT_IN_TYPES_DEFINITIONS,
    is_relayer: {
      properties: {
        args: {
          additionalProperties: false,
          properties: {
            address: {
              $ref: "#/definitions/Address",
            },
          },
          type: "object",
          required: ["address"],
        },
      },
      additionalProperties: false,
    },
    // {
    //   "function_v0": {
    //     "doc": "",
    //     "name": "add_relayers",
    //     "inputs": [
    //       {
    //         "doc": "",
    //         "name": "addresses",
    //         "type_": {
    //           "vec": {
    //             "element_type": "address"
    //           }
    //         }
    //       }
    //     ],
    //     "outputs": []
    //   }
    // },
    // vec type
    // CCQXWMZVM3KRTXTUPTN53YHL272QGKF32L7XEDNZ2S6OSUFK3NFBGG5M
    add_relayers: {
      properties: {
        args: {
          additionalProperties: false,
          properties: {
            addresses: {
              type: "array",
              items: {
                $ref: "#/definitions/Address",
              },
            },
          },
          type: "object",
          required: ["addresses"],
        },
      },
      additionalProperties: false,
    },
  },
  $ref: "#/definitions/add_relayers",
};

// VEC TYPE
const TEST_ARRAY_SCHEMA_DEREFERENCED = {
  name: "add_relayers",
  description: "",
  properties: {
    addresses: {
      type: "array",
      items: {
        type: "Address",
        description: "Address can be a public key or contract id",
      },
    },
  },
  required: ["addresses"],
  additionalProperties: false,
  type: "object",
};

// TUPLE SCHEMA
const TEST_TUPLE_SCHEMA: Partial<JSONSchema7> = {
  $schema: "http://json-schema.org/draft-07/schema#",
  definitions: {
    // BUILT-IN TYPES
    ...BUILT_IN_TYPES_DEFINITIONS,
    // CUSTOM TYPES
    SignerExpiration: {
      type: "array",
      items: [
        {
          $ref: "#/definitions/U32",
        },
      ],
      minItems: 1,
      maxItems: 1,
    },
    // {
    //   "udt_struct_v0": {
    //     "doc": "",
    //     "lib": "",
    //     "name": "SignerLimits",
    //     "fields": [
    //       {
    //         "doc": "",
    //         "name": "0",
    //         "type_": {
    //           "option": {
    //             "value_type": {
    //               "map": { // MAP
    //                 "key_type": "address",
    //                 "value_type": {
    //                   "option": {
    //                     "value_type": {
    //                       "vec": { // creates an array
    //                         "element_type": {
    //                           "udt": {
    //                             "name": "SignerKey"
    //                           }
    //                         }
    //                       }
    //                     }
    //                   }
    //                 }
    //               }
    //             }
    //           }
    //         }
    //       }
    //     ]
    //   }
    // },
    SignerLimits: {
      type: "array",
      items: [
        {
          type: "array",
          items: {
            type: "array",
            items: [
              {
                $ref: "#/definitions/Address",
              },
              {
                type: "array",
                items: {
                  $ref: "#/definitions/SignerKey",
                },
              },
            ],
            minItems: 2,
            maxItems: 2,
          },
        },
      ],
      minItems: 1,
      maxItems: 1,
    },
    SignerStorage: {
      oneOf: [
        {
          type: "object",
          title: "Persistent",
          properties: {
            tag: "Persistent",
          },
          additionalProperties: false,
          required: ["tag"],
        },
        {
          type: "object",
          title: "Temporary",
          properties: {
            tag: "Temporary",
          },
          additionalProperties: false,
          required: ["tag"],
        },
      ],
    },
    Signer: {
      oneOf: [
        {
          type: "object",
          title: "Policy",
          properties: {
            tag: "Policy",
            values: {
              type: "array",
              items: [
                {
                  $ref: "#/definitions/Address",
                },
                {
                  $ref: "#/definitions/SignerExpiration",
                },
                {
                  $ref: "#/definitions/SignerLimits",
                },
                {
                  $ref: "#/definitions/SignerStorage",
                },
              ],
            },
          },
          required: ["tag", "values"],
          additionalProperties: false,
        },
        {
          type: "object",
          title: "Ed25519",
          properties: {
            tag: "Ed25519",
            values: {
              type: "array",
              items: [
                {
                  $ref: "#/definitions/DataUrl",
                  maxLength: 32,
                },
                {
                  $ref: "#/definitions/SignerExpiration",
                },
                {
                  $ref: "#/definitions/SignerLimits",
                },
                {
                  $ref: "#/definitions/SignerStorage",
                },
              ],
            },
          },
          required: ["tag", "values"],
          additionalProperties: false,
        },
        {
          type: "object",
          title: "Secp256r1",
          properties: {
            tag: "Secp256r1",
            values: {
              type: "array",
              items: [
                {
                  $ref: "#/definitions/DataUrl",
                },
                {
                  $ref: "#/definitions/DataUrl",
                  maxLength: 65,
                },
                {
                  $ref: "#/definitions/SignerExpiration",
                },
                {
                  $ref: "#/definitions/SignerLimits",
                },
                {
                  $ref: "#/definitions/SignerStorage",
                },
              ],
            },
          },
          required: ["tag", "values"],
          additionalProperties: false,
        },
      ],
    },
    // {
    //   "udt_union_v0": {
    //     "doc": "",
    //     "lib": "",
    //     "name": "aZ",
    //     "cases": [
    //       {
    //         "tuple_v0": {
    //           "doc": "",
    //           "name": "Policy",
    //           "type_": [
    //             "address"
    //           ]
    //         }
    //       },
    //       {
    //         "tuple_v0": {
    //           "doc": "",
    //           "name": "Ed25519",
    //           "type_": [
    //             {
    //               "bytes_n": {
    //                 "n": 32
    //               }
    //             }
    //           ]
    //         }
    //       },
    //       {
    //         "tuple_v0": {
    //           "doc": "",
    //           "name": "Secp256r1",
    //           "type_": [
    //             "bytes"
    //           ]
    //         }
    //       }
    //     ]
    //   }
    // },
    SignerKey: {
      oneOf: [
        {
          type: "object",
          title: "Policy",
          properties: {
            tag: "Policy",
            values: {
              type: "array",
              items: [
                {
                  $ref: "#/definitions/Address",
                },
              ],
            },
          },
          required: ["tag", "values"],
          additionalProperties: false,
        },
        {
          type: "object",
          title: "Ed25519",
          properties: {
            tag: "Ed25519",
            values: {
              type: "array",
              items: [
                {
                  $ref: "#/definitions/DataUrl",
                  maxLength: 32,
                },
              ],
            },
          },
          required: ["tag", "values"],
          additionalProperties: false,
        },
        {
          type: "object",
          title: "Secp256r1",
          properties: {
            tag: "Secp256r1",
            values: {
              type: "array",
              items: [
                {
                  $ref: "#/definitions/DataUrl",
                },
              ],
            },
          },
          required: ["tag", "values"],
          additionalProperties: false,
        },
      ],
    },
    Secp256r1Signature: {
      description: "",
      properties: {
        authenticator_data: {
          $ref: "#/definitions/DataUrl",
        },
        client_data_json: {
          $ref: "#/definitions/DataUrl",
        },
        signature: {
          $ref: "#/definitions/DataUrl",
          maxLength: 64,
        },
        additionalProperties: false,
      },
      required: ["authenticator_data", "client_data_json", "signature"],
      type: "object",
    },
    Signature: {
      oneOf: [
        {
          type: "object",
          title: "Policy",
          properties: {
            tag: "Policy",
          },
          additionalProperties: false,
          required: ["tag"],
        },
        {
          type: "object",
          title: "Ed25519",
          properties: {
            tag: "Ed25519",
            values: {
              type: "array",
              items: [
                {
                  $ref: "#/definitions/DataUrl",
                  maxLength: 64,
                },
              ],
            },
          },
          required: ["tag", "values"],
          additionalProperties: false,
        },
        {
          type: "object",
          title: "Secp256r1",
          properties: {
            tag: "Secp256r1",
            values: {
              type: "array",
              items: [
                {
                  $ref: "#/definitions/Secp256r1Signature",
                },
              ],
            },
          },
          required: ["tag", "values"],
          additionalProperties: false,
        },
      ],
    },
    // {
    //   "udt_struct_v0": {
    //     "doc": "",
    //     "lib": "",
    //     "name": "Signatures",
    //     "fields": [
    //       {
    //         "doc": "",
    //         "name": "0",
    //         "type_": {
    //           "map": {
    //             "key_type": {
    //               "udt": {
    //                 "name": "SignerKey"
    //               }
    //             },
    //             "value_type": {
    //               "udt": {
    //                 "name": "Signature"
    //               }
    //             }
    //           }
    //         }
    //       }
    //     ]
    //   }
    // },
    Signatures: {
      type: "array",
      items: [
        {
          type: "array",
          items: {
            type: "array",
            items: [
              {
                $ref: "#/definitions/SignerKey",
              },
              {
                $ref: "#/definitions/Signature",
              },
            ],
            minItems: 2,
            maxItems: 2,
          },
        },
      ],
      minItems: 1,
      maxItems: 1,
    },
    add_signer: {
      properties: {
        args: {
          additionalProperties: false,
          properties: {
            signer: {
              $ref: "#/definitions/Signer",
            },
          },
          type: "object",
          required: ["signer"],
        },
      },
      additionalProperties: false,
    },
    remove_signer: {
      properties: {
        args: {
          additionalProperties: false,
          properties: {
            signer_key: {
              $ref: "#/definitions/aZ",
            },
          },
          type: "object",
          required: ["signer_key"],
        },
      },
      additionalProperties: false,
    },
    // created to test map
    update_signer_expirations: {
      properties: {
        args: {
          additionalProperties: false,
          properties: {
            expirations: {
              type: "array",
              items: {
                type: "array",
                items: [
                  {
                    $ref: "#/definitions/SignerKey",
                  },
                  {
                    $ref: "#/definitions/SignerExpiration",
                  },
                ],
                minItems: 2,
                maxItems: 2,
              },
            },
          },
          type: "object",
          required: ["expirations"],
        },
      },
      additionalProperties: false,
    },
    __constructor: {
      properties: {
        args: {
          additionalProperties: false,
          properties: {
            signer: {
              $ref: "#/definitions/Signer",
            },
          },
          type: "object",
          required: ["signer"],
        },
      },
      additionalProperties: false,
    },
    __check_auth: {
      properties: {
        args: {
          additionalProperties: false,
          properties: {
            signature_payload: {
              $ref: "#/definitions/DataUrl",
              maxLength: 32,
            },
            signatures: {
              $ref: "#/definitions/Signatures",
            },
            // auth_contexts: {
            //   type: "array",
            //   items: {
            //     $ref: "#/definitions/Context",
            //   },
            // },
          },
          type: "object",
          required: ["signature_payload", "signatures", "auth_contexts"],
        },
      },
      additionalProperties: false,
    },
  },
  $ref: "#/definitions/add_signer",
};

const TEST_TUPLE_SCHEMA_DEREFERENCED = {
  name: "add_signer",
  description: "",
  properties: {
    signer: {
      oneOf: [
        {
          type: "object",
          title: "Policy",
          properties: {
            tag: "Policy",
            values: {
              type: "array",
              items: [
                {
                  type: "Address",
                  description: "Address can be a public key or contract id",
                },
                {
                  type: "array",
                  items: [
                    {
                      type: "U32",
                      description: "",
                    },
                  ],
                  minItems: 1,
                  maxItems: 1,
                },
                {
                  type: "array",
                  items: [
                    {
                      type: "array",
                      items: {
                        type: "array",
                        items: [
                          {
                            type: "Address",
                            description:
                              "Address can be a public key or contract id",
                          },
                          {
                            type: "array",
                            items: {
                              oneOf: [
                                {
                                  type: "object",
                                  title: "Policy",
                                  properties: {
                                    tag: "Policy",
                                    values: {
                                      type: "array",
                                      items: [
                                        {
                                          type: "Address",
                                          description:
                                            "Address can be a public key or contract id",
                                        },
                                      ],
                                    },
                                  },
                                  required: ["tag", "values"],
                                  additionalProperties: false,
                                },
                                {
                                  type: "object",
                                  title: "Ed25519",
                                  properties: {
                                    tag: "Ed25519",
                                    values: {
                                      type: "array",
                                      items: [
                                        {
                                          type: "DataUrl",
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
                                  title: "Secp256r1",
                                  properties: {
                                    tag: "Secp256r1",
                                    values: {
                                      type: "array",
                                      items: [
                                        {
                                          type: "DataUrl",
                                          description: "",
                                        },
                                      ],
                                    },
                                  },
                                  required: ["tag", "values"],
                                  additionalProperties: false,
                                },
                              ],
                            },
                          },
                        ],
                        minItems: 2,
                        maxItems: 2,
                      },
                    },
                  ],
                  minItems: 1,
                  maxItems: 1,
                },
                {
                  oneOf: [
                    {
                      type: "object",
                      title: "Persistent",
                      properties: {
                        tag: "Persistent",
                      },
                      additionalProperties: false,
                      required: ["tag"],
                    },
                    {
                      type: "object",
                      title: "Temporary",
                      properties: {
                        tag: "Temporary",
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
          title: "Ed25519",
          properties: {
            tag: "Ed25519",
            values: {
              type: "array",
              items: [
                {
                  type: "DataUrl",
                  description: "",
                },
                {
                  type: "array",
                  items: [
                    {
                      type: "U32",
                      description: "",
                    },
                  ],
                  minItems: 1,
                  maxItems: 1,
                },
                {
                  type: "array",
                  items: [
                    {
                      type: "array",
                      items: {
                        type: "array",
                        items: [
                          {
                            type: "Address",
                            description:
                              "Address can be a public key or contract id",
                          },
                          {
                            type: "array",
                            items: {
                              oneOf: [
                                {
                                  type: "object",
                                  title: "Policy",
                                  properties: {
                                    tag: "Policy",
                                    values: {
                                      type: "array",
                                      items: [
                                        {
                                          type: "Address",
                                          description:
                                            "Address can be a public key or contract id",
                                        },
                                      ],
                                    },
                                  },
                                  required: ["tag", "values"],
                                  additionalProperties: false,
                                },
                                {
                                  type: "object",
                                  title: "Ed25519",
                                  properties: {
                                    tag: "Ed25519",
                                    values: {
                                      type: "array",
                                      items: [
                                        {
                                          type: "DataUrl",
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
                                  title: "Secp256r1",
                                  properties: {
                                    tag: "Secp256r1",
                                    values: {
                                      type: "array",
                                      items: [
                                        {
                                          type: "DataUrl",
                                          description: "",
                                        },
                                      ],
                                    },
                                  },
                                  required: ["tag", "values"],
                                  additionalProperties: false,
                                },
                              ],
                            },
                          },
                        ],
                        minItems: 2,
                        maxItems: 2,
                      },
                    },
                  ],
                  minItems: 1,
                  maxItems: 1,
                },
                {
                  oneOf: [
                    {
                      type: "object",
                      title: "Persistent",
                      properties: {
                        tag: "Persistent",
                      },
                      additionalProperties: false,
                      required: ["tag"],
                    },
                    {
                      type: "object",
                      title: "Temporary",
                      properties: {
                        tag: "Temporary",
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
          title: "Secp256r1",
          properties: {
            tag: "Secp256r1",
            values: {
              type: "array",
              items: [
                {
                  type: "DataUrl",
                  description: "",
                },
                {
                  type: "DataUrl",
                  description: "",
                },
                {
                  type: "array",
                  items: [
                    {
                      type: "U32",
                      description: "",
                    },
                  ],
                  minItems: 1,
                  maxItems: 1,
                },
                {
                  type: "array",
                  items: [
                    {
                      type: "array",
                      items: {
                        type: "array",
                        items: [
                          {
                            type: "Address",
                            description:
                              "Address can be a public key or contract id",
                          },
                          {
                            type: "array",
                            items: {
                              oneOf: [
                                {
                                  type: "object",
                                  title: "Policy",
                                  properties: {
                                    tag: "Policy",
                                    values: {
                                      type: "array",
                                      items: [
                                        {
                                          type: "Address",
                                          description:
                                            "Address can be a public key or contract id",
                                        },
                                      ],
                                    },
                                  },
                                  required: ["tag", "values"],
                                  additionalProperties: false,
                                },
                                {
                                  type: "object",
                                  title: "Ed25519",
                                  properties: {
                                    tag: "Ed25519",
                                    values: {
                                      type: "array",
                                      items: [
                                        {
                                          type: "DataUrl",
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
                                  title: "Secp256r1",
                                  properties: {
                                    tag: "Secp256r1",
                                    values: {
                                      type: "array",
                                      items: [
                                        {
                                          type: "DataUrl",
                                          description: "",
                                        },
                                      ],
                                    },
                                  },
                                  required: ["tag", "values"],
                                  additionalProperties: false,
                                },
                              ],
                            },
                          },
                        ],
                        minItems: 2,
                        maxItems: 2,
                      },
                    },
                  ],
                  minItems: 1,
                  maxItems: 1,
                },
                {
                  oneOf: [
                    {
                      type: "object",
                      title: "Persistent",
                      properties: {
                        tag: "Persistent",
                      },
                      additionalProperties: false,
                      required: ["tag"],
                    },
                    {
                      type: "object",
                      title: "Temporary",
                      properties: {
                        tag: "Temporary",
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
      ],
    },
  },
  required: ["signer"],
  additionalProperties: false,
  type: "object",
};

// json schema from sdk covers:
// https://github.com/stellar/js-stellar-sdk/blob/master/src/contract/spec.ts
// see jsonSchema function

// CCQXWMZVM3KRTXTUPTN53YHL272QGKF32L7XEDNZ2S6OSUFK3NFBGG5M
// - “init” carries primitive (address, u32)
// - “upgrade” carries bytes_n

//- "add_relayers"
// it’s also a good one for array render naming
// covers vec[]

// - “relay”
// 	- “symbol_rates”: “vec” with the type of tuple
// {
//   "function_v0": {
//     "doc": "",
//     "name": "relay",
//     "inputs": [
//       {
//         "doc": "",
//         "name": "from",
//         "type_": "address"
//       },
//       {
//         "doc": "",
//         "name": "symbol_rates",
//         "type_": {
//           "vec": {
//             "element_type": {
//               "tuple": {
//                 "value_types": [ // min and max length are the length of the array
//                   "symbol",
//                   "u64"
//                 ]
//               }
//             }
//           }
//         }
//       },
//       {
//         "doc": "",
//         "name": "resolve_time",
//         "type_": "u64"
//       },
//       {
//         "doc": "",
//         "name": "request_id",
//         "type_": "u64"
//       }
//     ],
//     "outputs": []
//   }
// },

// case xdr.ScSpecEntryKind.scSpecEntryUdtEnumV0
// oneOf with enum and type: number

// unionToJsonSchema

// Enum Case

// Void Case

// CBBBUV6XRCPRL4C4K7DQJSU2UL37B3XJYORXDCXLOKMZUQFH4COCNANI
// - Great UDT case
