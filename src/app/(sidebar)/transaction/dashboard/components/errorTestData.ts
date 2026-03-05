export const TEST1 = [
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "d7fe44bd0af11d602b1091f2f4a1f4df212d444d0321ea32adb3cc1cbbab0a04",
            },
            {
              symbol: "work",
            },
          ],
          data: {
            vec: [
              {
                address:
                  "CB5OURIBT62ST4BQ62BG6PIQIWFHV6LTQ7VLS37J6DYMDRUSWVSGZGHY",
              },
              {
                bytes:
                  "0000000e73390573202c3283eaccc102c7a279c0e9c8dcff5086edeafd9d7e7d",
              },
              {
                u64: "28269990",
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "error",
            },
            {
              error: {
                contract: 7,
              },
            },
          ],
          data: {
            vec: [
              {
                string: "failing with contract error",
              },
              {
                u32: 7,
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "error",
            },
            {
              error: {
                contract: 7,
              },
            },
          ],
          data: {
            string:
              "escalating error to VM trap from failed host function call: fail_with_error",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "log",
            },
          ],
          data: {
            vec: [
              {
                string: "VM call trapped with HostError",
              },
              {
                symbol: "work",
              },
              {
                error: {
                  contract: 7,
                },
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "host_fn_failed",
            },
            {
              error: {
                contract: 7,
              },
            },
          ],
          data: "void",
        },
      },
    },
  },
];

export const TEST2 = [
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "d7fe44bd0af11d602b1091f2f4a1f4df212d444d0321ea32adb3cc1cbbab0a04",
            },
            {
              symbol: "plant",
            },
          ],
          data: {
            vec: [
              {
                address:
                  "CC5QB2IOWFW2BZZEJY2JFCH3SSGYRYEX62G66WK6RTQQLMC7BSRSLJSD",
              },
              {
                i128: "0",
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "bb00e90eb16da0e7244e349288fb948d88e097f68def595e8ce105b05f0ca325",
            },
            {
              symbol: "__check_auth",
            },
          ],
          data: {
            vec: [
              {
                bytes:
                  "2a06b2bdef8a31f43dd5da319341f386b6cc8120e18d303e9ce6035d03d3cf02",
              },
              {
                vec: [
                  {
                    map: [
                      {
                        key: {
                          vec: [
                            {
                              symbol: "Ed25519",
                            },
                            {
                              bytes:
                                "2b46faa06b6ee7db8bef96c77213c95b17be77220bd54603137dbecfdb88f83f",
                            },
                          ],
                        },
                        val: {
                          vec: [
                            {
                              symbol: "Ed25519",
                            },
                            {
                              bytes:
                                "1b5554a7793a86fdbd7e690383a5b2d7526bbed446462cfe1c69938202c9b331754bc028e3bc832639339c1e3f69696ea5144f127b3d4344910f7270edcc7304",
                            },
                          ],
                        },
                      },
                    ],
                  },
                ],
              },
              {
                vec: [
                  {
                    vec: [
                      {
                        symbol: "Contract",
                      },
                      {
                        map: [
                          {
                            key: {
                              symbol: "args",
                            },
                            val: {
                              vec: [
                                {
                                  address:
                                    "CC5QB2IOWFW2BZZEJY2JFCH3SSGYRYEX62G66WK6RTQQLMC7BSRSLJSD",
                                },
                                {
                                  i128: "0",
                                },
                              ],
                            },
                          },
                          {
                            key: {
                              symbol: "contract",
                            },
                            val: {
                              address:
                                "CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA",
                            },
                          },
                          {
                            key: {
                              symbol: "fn_name",
                            },
                            val: {
                              symbol: "plant",
                            },
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CC5QB2IOWFW2BZZEJY2JFCH3SSGYRYEX62G66WK6RTQQLMC7BSRSLJSD",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "__check_auth",
            },
          ],
          data: "void",
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "error",
            },
            {
              error: {
                contract: 8,
              },
            },
          ],
          data: {
            vec: [
              {
                string: "failing with contract error",
              },
              {
                u32: 8,
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "error",
            },
            {
              error: {
                contract: 8,
              },
            },
          ],
          data: {
            string:
              "escalating error to VM trap from failed host function call: fail_with_error",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "log",
            },
          ],
          data: {
            vec: [
              {
                string: "VM call trapped with HostError",
              },
              {
                symbol: "plant",
              },
              {
                error: {
                  contract: 8,
                },
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "host_fn_failed",
            },
            {
              error: {
                contract: 8,
              },
            },
          ],
          data: "void",
        },
      },
    },
  },
];

export const TEST3 = [
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "d7fe44bd0af11d602b1091f2f4a1f4df212d444d0321ea32adb3cc1cbbab0a04",
            },
            {
              symbol: "plant",
            },
          ],
          data: {
            vec: [
              {
                address:
                  "CCAOKMZA52AB3RMNJHVDL46M2RXOP6UGUTH6S7CCMUVV3MHDIXATSTSU",
              },
              {
                i128: "0",
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "80e53320ee801dc58d49ea35f3ccd46ee7fa86a4cfe97c42652b5db0e345c139",
            },
            {
              symbol: "__check_auth",
            },
          ],
          data: {
            vec: [
              {
                bytes:
                  "b492d7644f77b2bb44fdba0c2830f4318c4236129cd0e0449f1984bb145bbc5c",
              },
              {
                vec: [
                  {
                    map: [
                      {
                        key: {
                          vec: [
                            {
                              symbol: "Ed25519",
                            },
                            {
                              bytes:
                                "c1b28e24e3fd28a946e31a0a5fc4118d877b560d64b8e1ba2412d2879d66d2ce",
                            },
                          ],
                        },
                        val: {
                          vec: [
                            {
                              symbol: "Ed25519",
                            },
                            {
                              bytes:
                                "3ffb82be194f278d7a092c90db8fc86a669700ec1e040c2e1bde1eb16457137f99b2133dc22ec11af6656fd3853aea4aea045a0761356d81a5d6dd96a1550b07",
                            },
                          ],
                        },
                      },
                    ],
                  },
                ],
              },
              {
                vec: [
                  {
                    vec: [
                      {
                        symbol: "Contract",
                      },
                      {
                        map: [
                          {
                            key: {
                              symbol: "args",
                            },
                            val: {
                              vec: [
                                {
                                  address:
                                    "CCAOKMZA52AB3RMNJHVDL46M2RXOP6UGUTH6S7CCMUVV3MHDIXATSTSU",
                                },
                                {
                                  i128: "0",
                                },
                              ],
                            },
                          },
                          {
                            key: {
                              symbol: "contract",
                            },
                            val: {
                              address:
                                "CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA",
                            },
                          },
                          {
                            key: {
                              symbol: "fn_name",
                            },
                            val: {
                              symbol: "plant",
                            },
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CCAOKMZA52AB3RMNJHVDL46M2RXOP6UGUTH6S7CCMUVV3MHDIXATSTSU",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_return",
            },
            {
              symbol: "__check_auth",
            },
          ],
          data: "void",
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "error",
            },
            {
              error: {
                auth: "invalid_input",
              },
            },
          ],
          data: {
            vec: [
              {
                string: "signature has expired",
              },
              {
                address:
                  "CCAOKMZA52AB3RMNJHVDL46M2RXOP6UGUTH6S7CCMUVV3MHDIXATSTSU",
              },
              {
                u32: 61189075,
              },
              {
                u32: 61189074,
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "error",
            },
            {
              error: {
                auth: "invalid_input",
              },
            },
          ],
          data: {
            string:
              "escalating error to VM trap from failed host function call: require_auth",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "log",
            },
          ],
          data: {
            vec: [
              {
                string: "VM call trapped with HostError",
              },
              {
                symbol: "plant",
              },
              {
                error: {
                  auth: "invalid_input",
                },
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "host_fn_failed",
            },
            {
              error: {
                auth: "invalid_input",
              },
            },
          ],
          data: "void",
        },
      },
    },
  },
];

export const TEST4 = [
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "fn_call",
            },
            {
              bytes:
                "d7fe44bd0af11d602b1091f2f4a1f4df212d444d0321ea32adb3cc1cbbab0a04",
            },
            {
              symbol: "work",
            },
          ],
          data: {
            vec: [
              {
                address:
                  "GCGCVBO332DLYU3HS7LCAN2TPCS5YL72CO34IMKZHTRACEKGSN7N62BJ",
              },
              {
                bytes:
                  "000000b5ad8b0a31c00bbccab9c0b8f8e46e68af19d04260ecae11bd0d777b02",
              },
              {
                u64: "1298007",
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "error",
            },
            {
              error: {
                storage: "exceeded_limit",
              },
            },
          ],
          data: {
            vec: [
              {
                string:
                  "trying to access contract data key outside of the footprint",
              },
              {
                address:
                  "CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA",
              },
              {
                vec: [
                  {
                    symbol: "Block",
                  },
                  {
                    u32: 124408,
                  },
                ],
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "error",
            },
            {
              error: {
                storage: "exceeded_limit",
              },
            },
          ],
          data: {
            string:
              "escalating error to VM trap from failed host function call: has_contract_data",
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: "CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA",
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "log",
            },
          ],
          data: {
            vec: [
              {
                string: "VM call trapped with HostError",
              },
              {
                symbol: "work",
              },
              {
                error: {
                  storage: "exceeded_limit",
                },
              },
            ],
          },
        },
      },
    },
  },
  {
    in_successful_contract_call: false,
    event: {
      ext: "v0",
      contract_id: null,
      type_: "diagnostic",
      body: {
        v0: {
          topics: [
            {
              symbol: "host_fn_failed",
            },
            {
              error: {
                storage: "exceeded_limit",
              },
            },
          ],
          data: "void",
        },
      },
    },
  },
];
