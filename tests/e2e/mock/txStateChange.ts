// KALE: CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA
export const TX_ST_CHANGE_KALE_PLANT = {
  jsonrpc: "2.0",
  id: 1,
  result: {
    latestLedger: 57909392,
    latestLedgerCloseTime: "1751984345",
    oldestLedger: 57788433,
    oldestLedgerCloseTime: "1751298231",
    status: "SUCCESS",
    txHash: "240a89f6a1cb904c87af1d9ea14dab31cacafb69cd2681e751c21493d2abe390",
    applicationOrder: 234,
    feeBump: true,
    envelopeJson: {
      tx_fee_bump: {
        tx: {
          fee_source:
            "GBGWQFSJSOMJ2BTOH5RLZUTZPV544YR2DF5CGYL7WDZ2Y6OSRHR6TUBE",
          fee: 298012,
          inner_tx: {
            tx: {
              tx: {
                source_account:
                  "GDBOBJ5B5HKVSHSD4W6F3SMSEO3QG43AN3642F2NN7SPFSOIZJ7M7VRS",
                fee: 297810,
                seq_num: 248178152554106800,
                cond: {
                  time: {
                    min_time: 0,
                    max_time: 1751983850,
                  },
                },
                memo: "none",
                operations: [
                  {
                    source_account: null,
                    body: {
                      invoke_host_function: {
                        host_function: {
                          invoke_contract: {
                            contract_address:
                              "CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA",
                            function_name: "plant",
                            args: [
                              {
                                address:
                                  "GDBOBJ5B5HKVSHSD4W6F3SMSEO3QG43AN3642F2NN7SPFSOIZJ7M7VRS",
                              },
                              {
                                i128: {
                                  hi: 0,
                                  lo: 100000000,
                                },
                              },
                            ],
                          },
                        },
                        auth: [
                          {
                            credentials: "source_account",
                            root_invocation: {
                              function: {
                                contract_fn: {
                                  contract_address:
                                    "CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA",
                                  function_name: "plant",
                                  args: [
                                    {
                                      address:
                                        "GDBOBJ5B5HKVSHSD4W6F3SMSEO3QG43AN3642F2NN7SPFSOIZJ7M7VRS",
                                    },
                                    {
                                      i128: {
                                        hi: 0,
                                        lo: 100000000,
                                      },
                                    },
                                  ],
                                },
                              },
                              sub_invocations: [
                                {
                                  function: {
                                    contract_fn: {
                                      contract_address:
                                        "CB23WRDQWGSP6YPMY4UV5C4OW5CBTXKYN3XEATG7KJEZCXMJBYEHOUOV",
                                      function_name: "burn",
                                      args: [
                                        {
                                          address:
                                            "GDBOBJ5B5HKVSHSD4W6F3SMSEO3QG43AN3642F2NN7SPFSOIZJ7M7VRS",
                                        },
                                        {
                                          i128: {
                                            hi: 0,
                                            lo: 100000000,
                                          },
                                        },
                                      ],
                                    },
                                  },
                                  sub_invocations: [],
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                  },
                ],
                ext: {
                  v1: {
                    ext: "v0",
                    resources: {
                      footprint: {
                        read_only: [
                          {
                            contract_data: {
                              contract:
                                "CB23WRDQWGSP6YPMY4UV5C4OW5CBTXKYN3XEATG7KJEZCXMJBYEHOUOV",
                              key: "ledger_key_contract_instance",
                              durability: "persistent",
                            },
                          },
                          {
                            contract_data: {
                              contract:
                                "CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA",
                              key: {
                                vec: [
                                  {
                                    symbol: "Block",
                                  },
                                  {
                                    u32: 64767,
                                  },
                                ],
                              },
                              durability: "temporary",
                            },
                          },
                          {
                            contract_code: {
                              hash: "db2c14290d4964e3805f2527dd132939ba5fb3fccac56b30bfab8fd091011627",
                            },
                          },
                        ],
                        read_write: [
                          {
                            trustline: {
                              account_id:
                                "GDBOBJ5B5HKVSHSD4W6F3SMSEO3QG43AN3642F2NN7SPFSOIZJ7M7VRS",
                              asset: {
                                credit_alphanum4: {
                                  asset_code: "KALE",
                                  issuer:
                                    "GBDVX4VELCDSQ54KQJYTNHXAHFLBCA77ZY2USQBM4CSHTTV7DME7KALE",
                                },
                              },
                            },
                          },
                          {
                            contract_data: {
                              contract:
                                "CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA",
                              key: {
                                vec: [
                                  {
                                    symbol: "Block",
                                  },
                                  {
                                    u32: 64768,
                                  },
                                ],
                              },
                              durability: "temporary",
                            },
                          },
                          {
                            contract_data: {
                              contract:
                                "CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA",
                              key: {
                                vec: [
                                  {
                                    symbol: "Pail",
                                  },
                                  {
                                    address:
                                      "GDBOBJ5B5HKVSHSD4W6F3SMSEO3QG43AN3642F2NN7SPFSOIZJ7M7VRS",
                                  },
                                  {
                                    u32: 64768,
                                  },
                                ],
                              },
                              durability: "temporary",
                            },
                          },
                          {
                            contract_data: {
                              contract:
                                "CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA",
                              key: "ledger_key_contract_instance",
                              durability: "persistent",
                            },
                          },
                        ],
                      },
                      instructions: 4547910,
                      read_bytes: 21412,
                      write_bytes: 1588,
                    },
                    resource_fee: 297810,
                  },
                },
              },
              signatures: [
                {
                  hint: "c8ca7ecf",
                  signature:
                    "5ec807e407033f58e68885ff46869ed4a70effba3f2c4a3126b851052cfd0b073580c59c6803c1b29aa3f93cfd4638301c3cf5701ee6a3ef8bf1e3a87ce2050a",
                },
              ],
            },
          },
          ext: "v0",
        },
        signatures: [
          {
            hint: "d289e3e9",
            signature:
              "28c4e66e0941c76ab3b01d5a23dd6f4ba669c7ae0a68a1b1dbdf79c1230a40dcf228a868ce1f56b5663758c554ac28890589a73d1b4a9d62796bcd1a993b9e0b",
          },
        ],
      },
    },
    resultJson: {
      fee_charged: 226598,
      result: {
        tx_fee_bump_inner_success: {
          transaction_hash:
            "1b0c439c8f3b8e6f09503f4bd7ccf851cb0e0b5fc876f466b3b8cf160dd8e79f",
          result: {
            fee_charged: 226396,
            result: {
              tx_success: [
                {
                  op_inner: {
                    invoke_host_function: {
                      success:
                        "24eb235c14ebb359d5ecc5d99949bc02ec34f087ac08fc9dfe21512f6cbf2ae6",
                    },
                  },
                },
              ],
            },
            ext: "v0",
          },
        },
      },
      ext: "v0",
    },
    resultMetaJson: {
      v3: {
        ext: "v0",
        tx_changes_before: [
          {
            state: {
              last_modified_ledger_seq: 57909300,
              data: {
                account: {
                  account_id:
                    "GBGWQFSJSOMJ2BTOH5RLZUTZPV544YR2DF5CGYL7WDZ2Y6OSRHR6TUBE",
                  balance: 2538750042726,
                  seq_num: 230650163385860100,
                  num_sub_entries: 0,
                  inflation_dest: null,
                  flags: 0,
                  home_domain: "",
                  thresholds: "01000000",
                  signers: [],
                  ext: {
                    v1: {
                      liabilities: {
                        buying: 0,
                        selling: 0,
                      },
                      ext: {
                        v2: {
                          num_sponsored: 0,
                          num_sponsoring: 0,
                          signer_sponsoring_i_ds: [],
                          ext: {
                            v3: {
                              ext: "v0",
                              seq_ledger: 56088316,
                              seq_time: 1741615515,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              ext: "v0",
            },
          },
          {
            updated: {
              last_modified_ledger_seq: 57909300,
              data: {
                account: {
                  account_id:
                    "GBGWQFSJSOMJ2BTOH5RLZUTZPV544YR2DF5CGYL7WDZ2Y6OSRHR6TUBE",
                  balance: 2538750042726,
                  seq_num: 230650163385860100,
                  num_sub_entries: 0,
                  inflation_dest: null,
                  flags: 0,
                  home_domain: "",
                  thresholds: "01000000",
                  signers: [],
                  ext: {
                    v1: {
                      liabilities: {
                        buying: 0,
                        selling: 0,
                      },
                      ext: {
                        v2: {
                          num_sponsored: 0,
                          num_sponsoring: 0,
                          signer_sponsoring_i_ds: [],
                          ext: {
                            v3: {
                              ext: "v0",
                              seq_ledger: 56088316,
                              seq_time: 1741615515,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              ext: "v0",
            },
          },
          {
            state: {
              last_modified_ledger_seq: 57909266,
              data: {
                account: {
                  account_id:
                    "GDBOBJ5B5HKVSHSD4W6F3SMSEO3QG43AN3642F2NN7SPFSOIZJ7M7VRS",
                  balance: 19999902,
                  seq_num: 248178152554106800,
                  num_sub_entries: 1,
                  inflation_dest: null,
                  flags: 0,
                  home_domain: "",
                  thresholds: "01000000",
                  signers: [],
                  ext: {
                    v1: {
                      liabilities: {
                        buying: 0,
                        selling: 0,
                      },
                      ext: {
                        v2: {
                          num_sponsored: 0,
                          num_sponsoring: 0,
                          signer_sponsoring_i_ds: [],
                          ext: {
                            v3: {
                              ext: "v0",
                              seq_ledger: 57909266,
                              seq_time: 1751983629,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              ext: "v0",
            },
          },
          {
            updated: {
              last_modified_ledger_seq: 57909300,
              data: {
                account: {
                  account_id:
                    "GDBOBJ5B5HKVSHSD4W6F3SMSEO3QG43AN3642F2NN7SPFSOIZJ7M7VRS",
                  balance: 19999902,
                  seq_num: 248178152554106800,
                  num_sub_entries: 1,
                  inflation_dest: null,
                  flags: 0,
                  home_domain: "",
                  thresholds: "01000000",
                  signers: [],
                  ext: {
                    v1: {
                      liabilities: {
                        buying: 0,
                        selling: 0,
                      },
                      ext: {
                        v2: {
                          num_sponsored: 0,
                          num_sponsoring: 0,
                          signer_sponsoring_i_ds: [],
                          ext: {
                            v3: {
                              ext: "v0",
                              seq_ledger: 57909300,
                              seq_time: 1751983823,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              ext: "v0",
            },
          },
        ],
        operations: [
          {
            changes: [
              {
                created: {
                  last_modified_ledger_seq: 57909300,
                  data: {
                    ttl: {
                      key_hash:
                        "426de290cd0c4be51d9caf0e89be0d912f3b6a3ffcd46f2b1382fbd8257a6c8b",
                      live_until_ledger_seq: 57926579,
                    },
                  },
                  ext: "v0",
                },
              },
              {
                created: {
                  last_modified_ledger_seq: 57909300,
                  data: {
                    ttl: {
                      key_hash:
                        "5c29518ad4d32e52cebd21d30b42e36f04edf26b65092e1a22575e405a1dcdf6",
                      live_until_ledger_seq: 57926579,
                    },
                  },
                  ext: "v0",
                },
              },
              {
                state: {
                  last_modified_ledger_seq: 57909300,
                  data: {
                    contract_data: {
                      ext: "v0",
                      contract:
                        "CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA",
                      key: "ledger_key_contract_instance",
                      durability: "persistent",
                      val: {
                        contract_instance: {
                          executable: {
                            wasm: "db2c14290d4964e3805f2527dd132939ba5fb3fccac56b30bfab8fd091011627",
                          },
                          storage: [
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "FarmBlock",
                                  },
                                ],
                              },
                              val: {
                                map: [
                                  {
                                    key: {
                                      symbol: "entropy",
                                    },
                                    val: {
                                      bytes:
                                        "000000ad183d0d4a773f9f5de0e507c358ddca157bcae54a4df6d4dd3bd76b66",
                                    },
                                  },
                                  {
                                    key: {
                                      symbol: "max_gap",
                                    },
                                    val: {
                                      u32: 52,
                                    },
                                  },
                                  {
                                    key: {
                                      symbol: "max_stake",
                                    },
                                    val: {
                                      i128: {
                                        hi: 0,
                                        lo: 1000000000,
                                      },
                                    },
                                  },
                                  {
                                    key: {
                                      symbol: "max_zeros",
                                    },
                                    val: {
                                      u32: 9,
                                    },
                                  },
                                  {
                                    key: {
                                      symbol: "min_gap",
                                    },
                                    val: {
                                      u32: 1,
                                    },
                                  },
                                  {
                                    key: {
                                      symbol: "min_stake",
                                    },
                                    val: {
                                      i128: {
                                        hi: 0,
                                        lo: 0,
                                      },
                                    },
                                  },
                                  {
                                    key: {
                                      symbol: "min_zeros",
                                    },
                                    val: {
                                      u32: 5,
                                    },
                                  },
                                  {
                                    key: {
                                      symbol: "normalized_total",
                                    },
                                    val: {
                                      i128: {
                                        hi: 0,
                                        lo: 0,
                                      },
                                    },
                                  },
                                  {
                                    key: {
                                      symbol: "staked_total",
                                    },
                                    val: {
                                      i128: {
                                        hi: 0,
                                        lo: 0,
                                      },
                                    },
                                  },
                                  {
                                    key: {
                                      symbol: "timestamp",
                                    },
                                    val: {
                                      u64: 1751983501,
                                    },
                                  },
                                ],
                              },
                            },
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "FarmEntropy",
                                  },
                                ],
                              },
                              val: {
                                bytes:
                                  "00000008aae979415c155306b5d139fcf4ce42d0efdd5550e2ea9ccc6a389139",
                              },
                            },
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "FarmIndex",
                                  },
                                ],
                              },
                              val: {
                                u32: 64767,
                              },
                            },
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "HomesteadAsset",
                                  },
                                ],
                              },
                              val: {
                                address:
                                  "CB23WRDQWGSP6YPMY4UV5C4OW5CBTXKYN3XEATG7KJEZCXMJBYEHOUOV",
                              },
                            },
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "Homesteader",
                                  },
                                ],
                              },
                              val: {
                                address:
                                  "GBDVX4VELCDSQ54KQJYTNHXAHFLBCA77ZY2USQBM4CSHTTV7DME7KALE",
                              },
                            },
                          ],
                        },
                      },
                    },
                  },
                  ext: "v0",
                },
              },
              {
                updated: {
                  last_modified_ledger_seq: 57909300,
                  data: {
                    contract_data: {
                      ext: "v0",
                      contract:
                        "CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA",
                      key: "ledger_key_contract_instance",
                      durability: "persistent",
                      val: {
                        contract_instance: {
                          executable: {
                            wasm: "db2c14290d4964e3805f2527dd132939ba5fb3fccac56b30bfab8fd091011627",
                          },
                          storage: [
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "FarmBlock",
                                  },
                                ],
                              },
                              val: {
                                map: [
                                  {
                                    key: {
                                      symbol: "entropy",
                                    },
                                    val: {
                                      bytes:
                                        "0000000000000000000000000000000000000000000000000000000000000000",
                                    },
                                  },
                                  {
                                    key: {
                                      symbol: "max_gap",
                                    },
                                    val: {
                                      u32: 0,
                                    },
                                  },
                                  {
                                    key: {
                                      symbol: "max_stake",
                                    },
                                    val: {
                                      i128: {
                                        hi: 0,
                                        lo: 100000000,
                                      },
                                    },
                                  },
                                  {
                                    key: {
                                      symbol: "max_zeros",
                                    },
                                    val: {
                                      u32: 0,
                                    },
                                  },
                                  {
                                    key: {
                                      symbol: "min_gap",
                                    },
                                    val: {
                                      u32: 4294967295,
                                    },
                                  },
                                  {
                                    key: {
                                      symbol: "min_stake",
                                    },
                                    val: {
                                      i128: {
                                        hi: 0,
                                        lo: 100000000,
                                      },
                                    },
                                  },
                                  {
                                    key: {
                                      symbol: "min_zeros",
                                    },
                                    val: {
                                      u32: 4294967295,
                                    },
                                  },
                                  {
                                    key: {
                                      symbol: "normalized_total",
                                    },
                                    val: {
                                      i128: {
                                        hi: 0,
                                        lo: 0,
                                      },
                                    },
                                  },
                                  {
                                    key: {
                                      symbol: "staked_total",
                                    },
                                    val: {
                                      i128: {
                                        hi: 0,
                                        lo: 0,
                                      },
                                    },
                                  },
                                  {
                                    key: {
                                      symbol: "timestamp",
                                    },
                                    val: {
                                      u64: 1751983823,
                                    },
                                  },
                                ],
                              },
                            },
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "FarmEntropy",
                                  },
                                ],
                              },
                              val: {
                                bytes:
                                  "00000008aae979415c155306b5d139fcf4ce42d0efdd5550e2ea9ccc6a389139",
                              },
                            },
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "FarmIndex",
                                  },
                                ],
                              },
                              val: {
                                u32: 64768,
                              },
                            },
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "HomesteadAsset",
                                  },
                                ],
                              },
                              val: {
                                address:
                                  "CB23WRDQWGSP6YPMY4UV5C4OW5CBTXKYN3XEATG7KJEZCXMJBYEHOUOV",
                              },
                            },
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "Homesteader",
                                  },
                                ],
                              },
                              val: {
                                address:
                                  "GBDVX4VELCDSQ54KQJYTNHXAHFLBCA77ZY2USQBM4CSHTTV7DME7KALE",
                              },
                            },
                          ],
                        },
                      },
                    },
                  },
                  ext: "v0",
                },
              },
              {
                created: {
                  last_modified_ledger_seq: 57909300,
                  data: {
                    contract_data: {
                      ext: "v0",
                      contract:
                        "CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA",
                      key: {
                        vec: [
                          {
                            symbol: "Block",
                          },
                          {
                            u32: 64768,
                          },
                        ],
                      },
                      durability: "temporary",
                      val: {
                        map: [
                          {
                            key: {
                              symbol: "entropy",
                            },
                            val: {
                              bytes:
                                "000000ad183d0d4a773f9f5de0e507c358ddca157bcae54a4df6d4dd3bd76b66",
                            },
                          },
                          {
                            key: {
                              symbol: "max_gap",
                            },
                            val: {
                              u32: 52,
                            },
                          },
                          {
                            key: {
                              symbol: "max_stake",
                            },
                            val: {
                              i128: {
                                hi: 0,
                                lo: 1000000000,
                              },
                            },
                          },
                          {
                            key: {
                              symbol: "max_zeros",
                            },
                            val: {
                              u32: 9,
                            },
                          },
                          {
                            key: {
                              symbol: "min_gap",
                            },
                            val: {
                              u32: 1,
                            },
                          },
                          {
                            key: {
                              symbol: "min_stake",
                            },
                            val: {
                              i128: {
                                hi: 0,
                                lo: 0,
                              },
                            },
                          },
                          {
                            key: {
                              symbol: "min_zeros",
                            },
                            val: {
                              u32: 5,
                            },
                          },
                          {
                            key: {
                              symbol: "normalized_total",
                            },
                            val: {
                              i128: {
                                hi: 0,
                                lo: 0,
                              },
                            },
                          },
                          {
                            key: {
                              symbol: "staked_total",
                            },
                            val: {
                              i128: {
                                hi: 0,
                                lo: 100000000,
                              },
                            },
                          },
                          {
                            key: {
                              symbol: "timestamp",
                            },
                            val: {
                              u64: 1751983823,
                            },
                          },
                        ],
                      },
                    },
                  },
                  ext: "v0",
                },
              },
              {
                created: {
                  last_modified_ledger_seq: 57909300,
                  data: {
                    contract_data: {
                      ext: "v0",
                      contract:
                        "CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA",
                      key: {
                        vec: [
                          {
                            symbol: "Pail",
                          },
                          {
                            address:
                              "GDBOBJ5B5HKVSHSD4W6F3SMSEO3QG43AN3642F2NN7SPFSOIZJ7M7VRS",
                          },
                          {
                            u32: 64768,
                          },
                        ],
                      },
                      durability: "temporary",
                      val: {
                        map: [
                          {
                            key: {
                              symbol: "gap",
                            },
                            val: "void",
                          },
                          {
                            key: {
                              symbol: "sequence",
                            },
                            val: {
                              u32: 57909300,
                            },
                          },
                          {
                            key: {
                              symbol: "stake",
                            },
                            val: {
                              i128: {
                                hi: 0,
                                lo: 100000000,
                              },
                            },
                          },
                          {
                            key: {
                              symbol: "zeros",
                            },
                            val: "void",
                          },
                        ],
                      },
                    },
                  },
                  ext: "v0",
                },
              },
              {
                state: {
                  last_modified_ledger_seq: 57909254,
                  data: {
                    trustline: {
                      account_id:
                        "GDBOBJ5B5HKVSHSD4W6F3SMSEO3QG43AN3642F2NN7SPFSOIZJ7M7VRS",
                      asset: {
                        credit_alphanum4: {
                          asset_code: "KALE",
                          issuer:
                            "GBDVX4VELCDSQ54KQJYTNHXAHFLBCA77ZY2USQBM4CSHTTV7DME7KALE",
                        },
                      },
                      balance: 2347110603,
                      limit: 9223372036854776000,
                      flags: 1,
                      ext: "v0",
                    },
                  },
                  ext: "v0",
                },
              },
              {
                updated: {
                  last_modified_ledger_seq: 57909300,
                  data: {
                    trustline: {
                      account_id:
                        "GDBOBJ5B5HKVSHSD4W6F3SMSEO3QG43AN3642F2NN7SPFSOIZJ7M7VRS",
                      asset: {
                        credit_alphanum4: {
                          asset_code: "KALE",
                          issuer:
                            "GBDVX4VELCDSQ54KQJYTNHXAHFLBCA77ZY2USQBM4CSHTTV7DME7KALE",
                        },
                      },
                      balance: 2247110603,
                      limit: 9223372036854776000,
                      flags: 1,
                      ext: "v0",
                    },
                  },
                  ext: "v0",
                },
              },
            ],
          },
        ],
        tx_changes_after: [
          {
            state: {
              last_modified_ledger_seq: 57909300,
              data: {
                account: {
                  account_id:
                    "GBGWQFSJSOMJ2BTOH5RLZUTZPV544YR2DF5CGYL7WDZ2Y6OSRHR6TUBE",
                  balance: 2538750042726,
                  seq_num: 230650163385860100,
                  num_sub_entries: 0,
                  inflation_dest: null,
                  flags: 0,
                  home_domain: "",
                  thresholds: "01000000",
                  signers: [],
                  ext: {
                    v1: {
                      liabilities: {
                        buying: 0,
                        selling: 0,
                      },
                      ext: {
                        v2: {
                          num_sponsored: 0,
                          num_sponsoring: 0,
                          signer_sponsoring_i_ds: [],
                          ext: {
                            v3: {
                              ext: "v0",
                              seq_ledger: 56088316,
                              seq_time: 1741615515,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              ext: "v0",
            },
          },
          {
            updated: {
              last_modified_ledger_seq: 57909300,
              data: {
                account: {
                  account_id:
                    "GBGWQFSJSOMJ2BTOH5RLZUTZPV544YR2DF5CGYL7WDZ2Y6OSRHR6TUBE",
                  balance: 2538750114140,
                  seq_num: 230650163385860100,
                  num_sub_entries: 0,
                  inflation_dest: null,
                  flags: 0,
                  home_domain: "",
                  thresholds: "01000000",
                  signers: [],
                  ext: {
                    v1: {
                      liabilities: {
                        buying: 0,
                        selling: 0,
                      },
                      ext: {
                        v2: {
                          num_sponsored: 0,
                          num_sponsoring: 0,
                          signer_sponsoring_i_ds: [],
                          ext: {
                            v3: {
                              ext: "v0",
                              seq_ledger: 56088316,
                              seq_time: 1741615515,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              ext: "v0",
            },
          },
        ],
        soroban_meta: {
          ext: {
            v1: {
              ext: "v0",
              total_non_refundable_resource_fee_charged: 172758,
              total_refundable_resource_fee_charged: 53638,
              rent_fee_charged: 51645,
            },
          },
          events: [
            {
              ext: "v0",
              contract_id:
                "75bb4470b1a4ff61ecc7295e8b8eb74419dd586eee404cdf5249915d890e0877",
              type_: "contract",
              body: {
                v0: {
                  topics: [
                    {
                      symbol: "burn",
                    },
                    {
                      address:
                        "GDBOBJ5B5HKVSHSD4W6F3SMSEO3QG43AN3642F2NN7SPFSOIZJ7M7VRS",
                    },
                    {
                      string:
                        "KALE:GBDVX4VELCDSQ54KQJYTNHXAHFLBCA77ZY2USQBM4CSHTTV7DME7KALE",
                    },
                  ],
                  data: {
                    i128: {
                      hi: 0,
                      lo: 100000000,
                    },
                  },
                },
              },
            },
          ],
          return_value: "void",
          diagnostic_events: [
            {
              in_successful_contract_call: true,
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
                            "GDBOBJ5B5HKVSHSD4W6F3SMSEO3QG43AN3642F2NN7SPFSOIZJ7M7VRS",
                        },
                        {
                          i128: {
                            hi: 0,
                            lo: 100000000,
                          },
                        },
                      ],
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "d7fe44bd0af11d602b1091f2f4a1f4df212d444d0321ea32adb3cc1cbbab0a04",
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "fn_call",
                      },
                      {
                        bytes:
                          "75bb4470b1a4ff61ecc7295e8b8eb74419dd586eee404cdf5249915d890e0877",
                      },
                      {
                        symbol: "burn",
                      },
                    ],
                    data: {
                      vec: [
                        {
                          address:
                            "GDBOBJ5B5HKVSHSD4W6F3SMSEO3QG43AN3642F2NN7SPFSOIZJ7M7VRS",
                        },
                        {
                          i128: {
                            hi: 0,
                            lo: 100000000,
                          },
                        },
                      ],
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "75bb4470b1a4ff61ecc7295e8b8eb74419dd586eee404cdf5249915d890e0877",
                type_: "contract",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "burn",
                      },
                      {
                        address:
                          "GDBOBJ5B5HKVSHSD4W6F3SMSEO3QG43AN3642F2NN7SPFSOIZJ7M7VRS",
                      },
                      {
                        string:
                          "KALE:GBDVX4VELCDSQ54KQJYTNHXAHFLBCA77ZY2USQBM4CSHTTV7DME7KALE",
                      },
                    ],
                    data: {
                      i128: {
                        hi: 0,
                        lo: 100000000,
                      },
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "75bb4470b1a4ff61ecc7295e8b8eb74419dd586eee404cdf5249915d890e0877",
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "fn_return",
                      },
                      {
                        symbol: "burn",
                      },
                    ],
                    data: "void",
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "d7fe44bd0af11d602b1091f2f4a1f4df212d444d0321ea32adb3cc1cbbab0a04",
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "fn_return",
                      },
                      {
                        symbol: "plant",
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
                contract_id: null,
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "read_entry",
                      },
                    ],
                    data: {
                      u64: 7,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "write_entry",
                      },
                    ],
                    data: {
                      u64: 4,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "ledger_read_byte",
                      },
                    ],
                    data: {
                      u64: 21412,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "ledger_write_byte",
                      },
                    ],
                    data: {
                      u64: 1588,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "read_key_byte",
                      },
                    ],
                    data: {
                      u64: 496,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "write_key_byte",
                      },
                    ],
                    data: {
                      u64: 0,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "read_data_byte",
                      },
                    ],
                    data: {
                      u64: 1820,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "write_data_byte",
                      },
                    ],
                    data: {
                      u64: 1588,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "read_code_byte",
                      },
                    ],
                    data: {
                      u64: 19592,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "write_code_byte",
                      },
                    ],
                    data: {
                      u64: 0,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "emit_event",
                      },
                    ],
                    data: {
                      u64: 1,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "emit_event_byte",
                      },
                    ],
                    data: {
                      u64: 200,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "cpu_insn",
                      },
                    ],
                    data: {
                      u64: 4324801,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "mem_byte",
                      },
                    ],
                    data: {
                      u64: 2083990,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "invoke_time_nsecs",
                      },
                    ],
                    data: {
                      u64: 792526,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "max_rw_key_byte",
                      },
                    ],
                    data: {
                      u64: 120,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "max_rw_data_byte",
                      },
                    ],
                    data: {
                      u64: 772,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "max_rw_code_byte",
                      },
                    ],
                    data: {
                      u64: 19592,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "max_emit_event_byte",
                      },
                    ],
                    data: {
                      u64: 200,
                    },
                  },
                },
              },
            },
          ],
        },
      },
    },
    diagnosticEventsJson: [
      {
        in_successful_contract_call: true,
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
                      "GDBOBJ5B5HKVSHSD4W6F3SMSEO3QG43AN3642F2NN7SPFSOIZJ7M7VRS",
                  },
                  {
                    i128: {
                      hi: 0,
                      lo: 100000000,
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "d7fe44bd0af11d602b1091f2f4a1f4df212d444d0321ea32adb3cc1cbbab0a04",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_call",
                },
                {
                  bytes:
                    "75bb4470b1a4ff61ecc7295e8b8eb74419dd586eee404cdf5249915d890e0877",
                },
                {
                  symbol: "burn",
                },
              ],
              data: {
                vec: [
                  {
                    address:
                      "GDBOBJ5B5HKVSHSD4W6F3SMSEO3QG43AN3642F2NN7SPFSOIZJ7M7VRS",
                  },
                  {
                    i128: {
                      hi: 0,
                      lo: 100000000,
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "75bb4470b1a4ff61ecc7295e8b8eb74419dd586eee404cdf5249915d890e0877",
          type_: "contract",
          body: {
            v0: {
              topics: [
                {
                  symbol: "burn",
                },
                {
                  address:
                    "GDBOBJ5B5HKVSHSD4W6F3SMSEO3QG43AN3642F2NN7SPFSOIZJ7M7VRS",
                },
                {
                  string:
                    "KALE:GBDVX4VELCDSQ54KQJYTNHXAHFLBCA77ZY2USQBM4CSHTTV7DME7KALE",
                },
              ],
              data: {
                i128: {
                  hi: 0,
                  lo: 100000000,
                },
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "75bb4470b1a4ff61ecc7295e8b8eb74419dd586eee404cdf5249915d890e0877",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_return",
                },
                {
                  symbol: "burn",
                },
              ],
              data: "void",
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "d7fe44bd0af11d602b1091f2f4a1f4df212d444d0321ea32adb3cc1cbbab0a04",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_return",
                },
                {
                  symbol: "plant",
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
          contract_id: null,
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "core_metrics",
                },
                {
                  symbol: "read_entry",
                },
              ],
              data: {
                u64: 7,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "write_entry",
                },
              ],
              data: {
                u64: 4,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "ledger_read_byte",
                },
              ],
              data: {
                u64: 21412,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "ledger_write_byte",
                },
              ],
              data: {
                u64: 1588,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "read_key_byte",
                },
              ],
              data: {
                u64: 496,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "write_key_byte",
                },
              ],
              data: {
                u64: 0,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "read_data_byte",
                },
              ],
              data: {
                u64: 1820,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "write_data_byte",
                },
              ],
              data: {
                u64: 1588,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "read_code_byte",
                },
              ],
              data: {
                u64: 19592,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "write_code_byte",
                },
              ],
              data: {
                u64: 0,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "emit_event",
                },
              ],
              data: {
                u64: 1,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "emit_event_byte",
                },
              ],
              data: {
                u64: 200,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "cpu_insn",
                },
              ],
              data: {
                u64: 4324801,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "mem_byte",
                },
              ],
              data: {
                u64: 2083990,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "invoke_time_nsecs",
                },
              ],
              data: {
                u64: 792526,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "max_rw_key_byte",
                },
              ],
              data: {
                u64: 120,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "max_rw_data_byte",
                },
              ],
              data: {
                u64: 772,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "max_rw_code_byte",
                },
              ],
              data: {
                u64: 19592,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "max_emit_event_byte",
                },
              ],
              data: {
                u64: 200,
              },
            },
          },
        },
      },
    ],
    ledger: 57909300,
    createdAt: "1751983823",
  },
};
export const TX_ST_CHANGE_KALE_WORK = {
  jsonrpc: "2.0",
  id: 1,
  result: {
    latestLedger: 57909333,
    latestLedgerCloseTime: "1751984010",
    oldestLedger: 57788374,
    oldestLedgerCloseTime: "1751297889",
    status: "SUCCESS",
    txHash: "f2588ae4ccb50160f645d3eca3defbc2c52e8caf476c0fced75e4adcb4ca2b09",
    applicationOrder: 311,
    feeBump: true,
    envelopeJson: {
      tx_fee_bump: {
        tx: {
          fee_source:
            "GBGWQFSJSOMJ2BTOH5RLZUTZPV544YR2DF5CGYL7WDZ2Y6OSRHR6TUBE",
          fee: 192194,
          inner_tx: {
            tx: {
              tx: {
                source_account:
                  "GDBOBJ5B5HKVSHSD4W6F3SMSEO3QG43AN3642F2NN7SPFSOIZJ7M7VRS",
                fee: 191992,
                seq_num: 248178152554106800,
                cond: {
                  time: {
                    min_time: 0,
                    max_time: 1751983908,
                  },
                },
                memo: "none",
                operations: [
                  {
                    source_account: null,
                    body: {
                      invoke_host_function: {
                        host_function: {
                          invoke_contract: {
                            contract_address:
                              "CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA",
                            function_name: "work",
                            args: [
                              {
                                address:
                                  "GDBOBJ5B5HKVSHSD4W6F3SMSEO3QG43AN3642F2NN7SPFSOIZJ7M7VRS",
                              },
                              {
                                bytes:
                                  "000000983d053aa8f23c86c780bc41d438c44149ce5fcd1fc9d80a1ff905e13f",
                              },
                              {
                                u64: 19361149,
                              },
                            ],
                          },
                        },
                        auth: [],
                      },
                    },
                  },
                ],
                ext: {
                  v1: {
                    ext: "v0",
                    resources: {
                      footprint: {
                        read_only: [
                          {
                            contract_code: {
                              hash: "db2c14290d4964e3805f2527dd132939ba5fb3fccac56b30bfab8fd091011627",
                            },
                          },
                        ],
                        read_write: [
                          {
                            contract_data: {
                              contract:
                                "CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA",
                              key: {
                                vec: [
                                  {
                                    symbol: "Block",
                                  },
                                  {
                                    u32: 64768,
                                  },
                                ],
                              },
                              durability: "temporary",
                            },
                          },
                          {
                            contract_data: {
                              contract:
                                "CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA",
                              key: {
                                vec: [
                                  {
                                    symbol: "Pail",
                                  },
                                  {
                                    address:
                                      "GDBOBJ5B5HKVSHSD4W6F3SMSEO3QG43AN3642F2NN7SPFSOIZJ7M7VRS",
                                  },
                                  {
                                    u32: 64768,
                                  },
                                ],
                              },
                              durability: "temporary",
                            },
                          },
                          {
                            contract_data: {
                              contract:
                                "CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA",
                              key: "ledger_key_contract_instance",
                              durability: "persistent",
                            },
                          },
                        ],
                      },
                      instructions: 4412916,
                      read_bytes: 21064,
                      write_bytes: 1480,
                    },
                    resource_fee: 191992,
                  },
                },
              },
              signatures: [
                {
                  hint: "c8ca7ecf",
                  signature:
                    "d6c607c614ec4c85a13146948331ca988a3ce3f74525ce7d8da1bf2145fedba3c399d78f9bf053b55852ed060a6dea75a9b8267c24ec0483a1785a88c640ab05",
                },
              ],
            },
          },
          ext: "v0",
        },
        signatures: [
          {
            hint: "d289e3e9",
            signature:
              "687b84bf4b0f816eb82758e45ce69eee6605568504fc007fb3b4b5d0239dea9d10d6901d37ba3bf18bff139d89d2dba43f5d3b904eb989a937e08fb6a9826000",
          },
        ],
      },
    },
    resultJson: {
      fee_charged: 135009,
      result: {
        tx_fee_bump_inner_success: {
          transaction_hash:
            "749c87e55003ca7b7fdab024f0db9dd26d4780ac0723914f2401ec9b072eacb9",
          result: {
            fee_charged: 134809,
            result: {
              tx_success: [
                {
                  op_inner: {
                    invoke_host_function: {
                      success:
                        "c89a843be2f704608d3b4680397a6a5cf30bb4e2809890e69accba4a803e6b8a",
                    },
                  },
                },
              ],
            },
            ext: "v0",
          },
        },
      },
      ext: "v0",
    },
    resultMetaJson: {
      v3: {
        ext: "v0",
        tx_changes_before: [
          {
            state: {
              last_modified_ledger_seq: 57909311,
              data: {
                account: {
                  account_id:
                    "GBGWQFSJSOMJ2BTOH5RLZUTZPV544YR2DF5CGYL7WDZ2Y6OSRHR6TUBE",
                  balance: 2538664062548,
                  seq_num: 230650163385860100,
                  num_sub_entries: 0,
                  inflation_dest: null,
                  flags: 0,
                  home_domain: "",
                  thresholds: "01000000",
                  signers: [],
                  ext: {
                    v1: {
                      liabilities: {
                        buying: 0,
                        selling: 0,
                      },
                      ext: {
                        v2: {
                          num_sponsored: 0,
                          num_sponsoring: 0,
                          signer_sponsoring_i_ds: [],
                          ext: {
                            v3: {
                              ext: "v0",
                              seq_ledger: 56088316,
                              seq_time: 1741615515,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              ext: "v0",
            },
          },
          {
            updated: {
              last_modified_ledger_seq: 57909311,
              data: {
                account: {
                  account_id:
                    "GBGWQFSJSOMJ2BTOH5RLZUTZPV544YR2DF5CGYL7WDZ2Y6OSRHR6TUBE",
                  balance: 2538664062548,
                  seq_num: 230650163385860100,
                  num_sub_entries: 0,
                  inflation_dest: null,
                  flags: 0,
                  home_domain: "",
                  thresholds: "01000000",
                  signers: [],
                  ext: {
                    v1: {
                      liabilities: {
                        buying: 0,
                        selling: 0,
                      },
                      ext: {
                        v2: {
                          num_sponsored: 0,
                          num_sponsoring: 0,
                          signer_sponsoring_i_ds: [],
                          ext: {
                            v3: {
                              ext: "v0",
                              seq_ledger: 56088316,
                              seq_time: 1741615515,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              ext: "v0",
            },
          },
          {
            state: {
              last_modified_ledger_seq: 57909300,
              data: {
                account: {
                  account_id:
                    "GDBOBJ5B5HKVSHSD4W6F3SMSEO3QG43AN3642F2NN7SPFSOIZJ7M7VRS",
                  balance: 19999902,
                  seq_num: 248178152554106800,
                  num_sub_entries: 1,
                  inflation_dest: null,
                  flags: 0,
                  home_domain: "",
                  thresholds: "01000000",
                  signers: [],
                  ext: {
                    v1: {
                      liabilities: {
                        buying: 0,
                        selling: 0,
                      },
                      ext: {
                        v2: {
                          num_sponsored: 0,
                          num_sponsoring: 0,
                          signer_sponsoring_i_ds: [],
                          ext: {
                            v3: {
                              ext: "v0",
                              seq_ledger: 57909300,
                              seq_time: 1751983823,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              ext: "v0",
            },
          },
          {
            updated: {
              last_modified_ledger_seq: 57909311,
              data: {
                account: {
                  account_id:
                    "GDBOBJ5B5HKVSHSD4W6F3SMSEO3QG43AN3642F2NN7SPFSOIZJ7M7VRS",
                  balance: 19999902,
                  seq_num: 248178152554106800,
                  num_sub_entries: 1,
                  inflation_dest: null,
                  flags: 0,
                  home_domain: "",
                  thresholds: "01000000",
                  signers: [],
                  ext: {
                    v1: {
                      liabilities: {
                        buying: 0,
                        selling: 0,
                      },
                      ext: {
                        v2: {
                          num_sponsored: 0,
                          num_sponsoring: 0,
                          signer_sponsoring_i_ds: [],
                          ext: {
                            v3: {
                              ext: "v0",
                              seq_ledger: 57909311,
                              seq_time: 1751983886,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              ext: "v0",
            },
          },
        ],
        operations: [
          {
            changes: [
              {
                state: {
                  last_modified_ledger_seq: 57909300,
                  data: {
                    contract_data: {
                      ext: "v0",
                      contract:
                        "CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA",
                      key: {
                        vec: [
                          {
                            symbol: "Pail",
                          },
                          {
                            address:
                              "GDBOBJ5B5HKVSHSD4W6F3SMSEO3QG43AN3642F2NN7SPFSOIZJ7M7VRS",
                          },
                          {
                            u32: 64768,
                          },
                        ],
                      },
                      durability: "temporary",
                      val: {
                        map: [
                          {
                            key: {
                              symbol: "gap",
                            },
                            val: "void",
                          },
                          {
                            key: {
                              symbol: "sequence",
                            },
                            val: {
                              u32: 57909300,
                            },
                          },
                          {
                            key: {
                              symbol: "stake",
                            },
                            val: {
                              i128: {
                                hi: 0,
                                lo: 100000000,
                              },
                            },
                          },
                          {
                            key: {
                              symbol: "zeros",
                            },
                            val: "void",
                          },
                        ],
                      },
                    },
                  },
                  ext: "v0",
                },
              },
              {
                updated: {
                  last_modified_ledger_seq: 57909311,
                  data: {
                    contract_data: {
                      ext: "v0",
                      contract:
                        "CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA",
                      key: {
                        vec: [
                          {
                            symbol: "Pail",
                          },
                          {
                            address:
                              "GDBOBJ5B5HKVSHSD4W6F3SMSEO3QG43AN3642F2NN7SPFSOIZJ7M7VRS",
                          },
                          {
                            u32: 64768,
                          },
                        ],
                      },
                      durability: "temporary",
                      val: {
                        map: [
                          {
                            key: {
                              symbol: "gap",
                            },
                            val: {
                              u32: 11,
                            },
                          },
                          {
                            key: {
                              symbol: "sequence",
                            },
                            val: {
                              u32: 57909300,
                            },
                          },
                          {
                            key: {
                              symbol: "stake",
                            },
                            val: {
                              i128: {
                                hi: 0,
                                lo: 100000000,
                              },
                            },
                          },
                          {
                            key: {
                              symbol: "zeros",
                            },
                            val: {
                              u32: 6,
                            },
                          },
                        ],
                      },
                    },
                  },
                  ext: "v0",
                },
              },
              {
                state: {
                  last_modified_ledger_seq: 57909311,
                  data: {
                    contract_data: {
                      ext: "v0",
                      contract:
                        "CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA",
                      key: "ledger_key_contract_instance",
                      durability: "persistent",
                      val: {
                        contract_instance: {
                          executable: {
                            wasm: "db2c14290d4964e3805f2527dd132939ba5fb3fccac56b30bfab8fd091011627",
                          },
                          storage: [
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "FarmBlock",
                                  },
                                ],
                              },
                              val: {
                                map: [
                                  {
                                    key: {
                                      symbol: "entropy",
                                    },
                                    val: {
                                      bytes:
                                        "0000009c6c5c664e23b0fad96162daa57816721c02664b300b4e463939d6a4ea",
                                    },
                                  },
                                  {
                                    key: {
                                      symbol: "max_gap",
                                    },
                                    val: {
                                      u32: 5,
                                    },
                                  },
                                  {
                                    key: {
                                      symbol: "max_stake",
                                    },
                                    val: {
                                      i128: {
                                        hi: 0,
                                        lo: 1000000000,
                                      },
                                    },
                                  },
                                  {
                                    key: {
                                      symbol: "max_zeros",
                                    },
                                    val: {
                                      u32: 6,
                                    },
                                  },
                                  {
                                    key: {
                                      symbol: "min_gap",
                                    },
                                    val: {
                                      u32: 5,
                                    },
                                  },
                                  {
                                    key: {
                                      symbol: "min_stake",
                                    },
                                    val: {
                                      i128: {
                                        hi: 0,
                                        lo: 0,
                                      },
                                    },
                                  },
                                  {
                                    key: {
                                      symbol: "min_zeros",
                                    },
                                    val: {
                                      u32: 6,
                                    },
                                  },
                                  {
                                    key: {
                                      symbol: "normalized_total",
                                    },
                                    val: {
                                      i128: {
                                        hi: 0,
                                        lo: 0,
                                      },
                                    },
                                  },
                                  {
                                    key: {
                                      symbol: "staked_total",
                                    },
                                    val: {
                                      i128: {
                                        hi: 0,
                                        lo: 0,
                                      },
                                    },
                                  },
                                  {
                                    key: {
                                      symbol: "timestamp",
                                    },
                                    val: {
                                      u64: 1751983823,
                                    },
                                  },
                                ],
                              },
                            },
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "FarmEntropy",
                                  },
                                ],
                              },
                              val: {
                                bytes:
                                  "00000008aae979415c155306b5d139fcf4ce42d0efdd5550e2ea9ccc6a389139",
                              },
                            },
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "FarmIndex",
                                  },
                                ],
                              },
                              val: {
                                u32: 64768,
                              },
                            },
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "HomesteadAsset",
                                  },
                                ],
                              },
                              val: {
                                address:
                                  "CB23WRDQWGSP6YPMY4UV5C4OW5CBTXKYN3XEATG7KJEZCXMJBYEHOUOV",
                              },
                            },
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "Homesteader",
                                  },
                                ],
                              },
                              val: {
                                address:
                                  "GBDVX4VELCDSQ54KQJYTNHXAHFLBCA77ZY2USQBM4CSHTTV7DME7KALE",
                              },
                            },
                          ],
                        },
                      },
                    },
                  },
                  ext: "v0",
                },
              },
              {
                updated: {
                  last_modified_ledger_seq: 57909311,
                  data: {
                    contract_data: {
                      ext: "v0",
                      contract:
                        "CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA",
                      key: "ledger_key_contract_instance",
                      durability: "persistent",
                      val: {
                        contract_instance: {
                          executable: {
                            wasm: "db2c14290d4964e3805f2527dd132939ba5fb3fccac56b30bfab8fd091011627",
                          },
                          storage: [
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "FarmBlock",
                                  },
                                ],
                              },
                              val: {
                                map: [
                                  {
                                    key: {
                                      symbol: "entropy",
                                    },
                                    val: {
                                      bytes:
                                        "000000983d053aa8f23c86c780bc41d438c44149ce5fcd1fc9d80a1ff905e13f",
                                    },
                                  },
                                  {
                                    key: {
                                      symbol: "max_gap",
                                    },
                                    val: {
                                      u32: 11,
                                    },
                                  },
                                  {
                                    key: {
                                      symbol: "max_stake",
                                    },
                                    val: {
                                      i128: {
                                        hi: 0,
                                        lo: 1000000000,
                                      },
                                    },
                                  },
                                  {
                                    key: {
                                      symbol: "max_zeros",
                                    },
                                    val: {
                                      u32: 6,
                                    },
                                  },
                                  {
                                    key: {
                                      symbol: "min_gap",
                                    },
                                    val: {
                                      u32: 5,
                                    },
                                  },
                                  {
                                    key: {
                                      symbol: "min_stake",
                                    },
                                    val: {
                                      i128: {
                                        hi: 0,
                                        lo: 0,
                                      },
                                    },
                                  },
                                  {
                                    key: {
                                      symbol: "min_zeros",
                                    },
                                    val: {
                                      u32: 6,
                                    },
                                  },
                                  {
                                    key: {
                                      symbol: "normalized_total",
                                    },
                                    val: {
                                      i128: {
                                        hi: 0,
                                        lo: 0,
                                      },
                                    },
                                  },
                                  {
                                    key: {
                                      symbol: "staked_total",
                                    },
                                    val: {
                                      i128: {
                                        hi: 0,
                                        lo: 0,
                                      },
                                    },
                                  },
                                  {
                                    key: {
                                      symbol: "timestamp",
                                    },
                                    val: {
                                      u64: 1751983823,
                                    },
                                  },
                                ],
                              },
                            },
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "FarmEntropy",
                                  },
                                ],
                              },
                              val: {
                                bytes:
                                  "00000008aae979415c155306b5d139fcf4ce42d0efdd5550e2ea9ccc6a389139",
                              },
                            },
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "FarmIndex",
                                  },
                                ],
                              },
                              val: {
                                u32: 64768,
                              },
                            },
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "HomesteadAsset",
                                  },
                                ],
                              },
                              val: {
                                address:
                                  "CB23WRDQWGSP6YPMY4UV5C4OW5CBTXKYN3XEATG7KJEZCXMJBYEHOUOV",
                              },
                            },
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "Homesteader",
                                  },
                                ],
                              },
                              val: {
                                address:
                                  "GBDVX4VELCDSQ54KQJYTNHXAHFLBCA77ZY2USQBM4CSHTTV7DME7KALE",
                              },
                            },
                          ],
                        },
                      },
                    },
                  },
                  ext: "v0",
                },
              },
              {
                state: {
                  last_modified_ledger_seq: 57909311,
                  data: {
                    contract_data: {
                      ext: "v0",
                      contract:
                        "CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA",
                      key: {
                        vec: [
                          {
                            symbol: "Block",
                          },
                          {
                            u32: 64768,
                          },
                        ],
                      },
                      durability: "temporary",
                      val: {
                        map: [
                          {
                            key: {
                              symbol: "entropy",
                            },
                            val: {
                              bytes:
                                "000000ad183d0d4a773f9f5de0e507c358ddca157bcae54a4df6d4dd3bd76b66",
                            },
                          },
                          {
                            key: {
                              symbol: "max_gap",
                            },
                            val: {
                              u32: 52,
                            },
                          },
                          {
                            key: {
                              symbol: "max_stake",
                            },
                            val: {
                              i128: {
                                hi: 0,
                                lo: 1000000000,
                              },
                            },
                          },
                          {
                            key: {
                              symbol: "max_zeros",
                            },
                            val: {
                              u32: 9,
                            },
                          },
                          {
                            key: {
                              symbol: "min_gap",
                            },
                            val: {
                              u32: 1,
                            },
                          },
                          {
                            key: {
                              symbol: "min_stake",
                            },
                            val: {
                              i128: {
                                hi: 0,
                                lo: 0,
                              },
                            },
                          },
                          {
                            key: {
                              symbol: "min_zeros",
                            },
                            val: {
                              u32: 5,
                            },
                          },
                          {
                            key: {
                              symbol: "normalized_total",
                            },
                            val: {
                              i128: {
                                hi: 0,
                                lo: 428431372,
                              },
                            },
                          },
                          {
                            key: {
                              symbol: "staked_total",
                            },
                            val: {
                              i128: {
                                hi: 0,
                                lo: 31108000000,
                              },
                            },
                          },
                          {
                            key: {
                              symbol: "timestamp",
                            },
                            val: {
                              u64: 1751983823,
                            },
                          },
                        ],
                      },
                    },
                  },
                  ext: "v0",
                },
              },
              {
                updated: {
                  last_modified_ledger_seq: 57909311,
                  data: {
                    contract_data: {
                      ext: "v0",
                      contract:
                        "CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA",
                      key: {
                        vec: [
                          {
                            symbol: "Block",
                          },
                          {
                            u32: 64768,
                          },
                        ],
                      },
                      durability: "temporary",
                      val: {
                        map: [
                          {
                            key: {
                              symbol: "entropy",
                            },
                            val: {
                              bytes:
                                "000000ad183d0d4a773f9f5de0e507c358ddca157bcae54a4df6d4dd3bd76b66",
                            },
                          },
                          {
                            key: {
                              symbol: "max_gap",
                            },
                            val: {
                              u32: 52,
                            },
                          },
                          {
                            key: {
                              symbol: "max_stake",
                            },
                            val: {
                              i128: {
                                hi: 0,
                                lo: 1000000000,
                              },
                            },
                          },
                          {
                            key: {
                              symbol: "max_zeros",
                            },
                            val: {
                              u32: 9,
                            },
                          },
                          {
                            key: {
                              symbol: "min_gap",
                            },
                            val: {
                              u32: 1,
                            },
                          },
                          {
                            key: {
                              symbol: "min_stake",
                            },
                            val: {
                              i128: {
                                hi: 0,
                                lo: 0,
                              },
                            },
                          },
                          {
                            key: {
                              symbol: "min_zeros",
                            },
                            val: {
                              u32: 5,
                            },
                          },
                          {
                            key: {
                              symbol: "normalized_total",
                            },
                            val: {
                              i128: {
                                hi: 0,
                                lo: 974509803,
                              },
                            },
                          },
                          {
                            key: {
                              symbol: "staked_total",
                            },
                            val: {
                              i128: {
                                hi: 0,
                                lo: 31008000000,
                              },
                            },
                          },
                          {
                            key: {
                              symbol: "timestamp",
                            },
                            val: {
                              u64: 1751983823,
                            },
                          },
                        ],
                      },
                    },
                  },
                  ext: "v0",
                },
              },
            ],
          },
        ],
        tx_changes_after: [
          {
            state: {
              last_modified_ledger_seq: 57909311,
              data: {
                account: {
                  account_id:
                    "GBGWQFSJSOMJ2BTOH5RLZUTZPV544YR2DF5CGYL7WDZ2Y6OSRHR6TUBE",
                  balance: 2538664062548,
                  seq_num: 230650163385860100,
                  num_sub_entries: 0,
                  inflation_dest: null,
                  flags: 0,
                  home_domain: "",
                  thresholds: "01000000",
                  signers: [],
                  ext: {
                    v1: {
                      liabilities: {
                        buying: 0,
                        selling: 0,
                      },
                      ext: {
                        v2: {
                          num_sponsored: 0,
                          num_sponsoring: 0,
                          signer_sponsoring_i_ds: [],
                          ext: {
                            v3: {
                              ext: "v0",
                              seq_ledger: 56088316,
                              seq_time: 1741615515,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              ext: "v0",
            },
          },
          {
            updated: {
              last_modified_ledger_seq: 57909311,
              data: {
                account: {
                  account_id:
                    "GBGWQFSJSOMJ2BTOH5RLZUTZPV544YR2DF5CGYL7WDZ2Y6OSRHR6TUBE",
                  balance: 2538664119731,
                  seq_num: 230650163385860100,
                  num_sub_entries: 0,
                  inflation_dest: null,
                  flags: 0,
                  home_domain: "",
                  thresholds: "01000000",
                  signers: [],
                  ext: {
                    v1: {
                      liabilities: {
                        buying: 0,
                        selling: 0,
                      },
                      ext: {
                        v2: {
                          num_sponsored: 0,
                          num_sponsoring: 0,
                          signer_sponsoring_i_ds: [],
                          ext: {
                            v3: {
                              ext: "v0",
                              seq_ledger: 56088316,
                              seq_time: 1741615515,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              ext: "v0",
            },
          },
        ],
        soroban_meta: {
          ext: {
            v1: {
              ext: "v0",
              total_non_refundable_resource_fee_charged: 134380,
              total_refundable_resource_fee_charged: 429,
              rent_fee_charged: 350,
            },
          },
          events: [],
          return_value: {
            u32: 11,
          },
          diagnostic_events: [
            {
              in_successful_contract_call: true,
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
                            "GDBOBJ5B5HKVSHSD4W6F3SMSEO3QG43AN3642F2NN7SPFSOIZJ7M7VRS",
                        },
                        {
                          bytes:
                            "000000983d053aa8f23c86c780bc41d438c44149ce5fcd1fc9d80a1ff905e13f",
                        },
                        {
                          u64: 19361149,
                        },
                      ],
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "d7fe44bd0af11d602b1091f2f4a1f4df212d444d0321ea32adb3cc1cbbab0a04",
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "fn_return",
                      },
                      {
                        symbol: "work",
                      },
                    ],
                    data: {
                      u32: 11,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "read_entry",
                      },
                    ],
                    data: {
                      u64: 4,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "write_entry",
                      },
                    ],
                    data: {
                      u64: 3,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "ledger_read_byte",
                      },
                    ],
                    data: {
                      u64: 21064,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "ledger_write_byte",
                      },
                    ],
                    data: {
                      u64: 1480,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "read_key_byte",
                      },
                    ],
                    data: {
                      u64: 284,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "write_key_byte",
                      },
                    ],
                    data: {
                      u64: 0,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "read_data_byte",
                      },
                    ],
                    data: {
                      u64: 1472,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "write_data_byte",
                      },
                    ],
                    data: {
                      u64: 1480,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "read_code_byte",
                      },
                    ],
                    data: {
                      u64: 19592,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "write_code_byte",
                      },
                    ],
                    data: {
                      u64: 0,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "emit_event",
                      },
                    ],
                    data: {
                      u64: 0,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "emit_event_byte",
                      },
                    ],
                    data: {
                      u64: 0,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "cpu_insn",
                      },
                    ],
                    data: {
                      u64: 4209916,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "mem_byte",
                      },
                    ],
                    data: {
                      u64: 2044276,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "invoke_time_nsecs",
                      },
                    ],
                    data: {
                      u64: 568227,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "max_rw_key_byte",
                      },
                    ],
                    data: {
                      u64: 120,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "max_rw_data_byte",
                      },
                    ],
                    data: {
                      u64: 772,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "max_rw_code_byte",
                      },
                    ],
                    data: {
                      u64: 19592,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "max_emit_event_byte",
                      },
                    ],
                    data: {
                      u64: 0,
                    },
                  },
                },
              },
            },
          ],
        },
      },
    },
    diagnosticEventsJson: [
      {
        in_successful_contract_call: true,
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
                      "GDBOBJ5B5HKVSHSD4W6F3SMSEO3QG43AN3642F2NN7SPFSOIZJ7M7VRS",
                  },
                  {
                    bytes:
                      "000000983d053aa8f23c86c780bc41d438c44149ce5fcd1fc9d80a1ff905e13f",
                  },
                  {
                    u64: 19361149,
                  },
                ],
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "d7fe44bd0af11d602b1091f2f4a1f4df212d444d0321ea32adb3cc1cbbab0a04",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_return",
                },
                {
                  symbol: "work",
                },
              ],
              data: {
                u32: 11,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "read_entry",
                },
              ],
              data: {
                u64: 4,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "write_entry",
                },
              ],
              data: {
                u64: 3,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "ledger_read_byte",
                },
              ],
              data: {
                u64: 21064,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "ledger_write_byte",
                },
              ],
              data: {
                u64: 1480,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "read_key_byte",
                },
              ],
              data: {
                u64: 284,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "write_key_byte",
                },
              ],
              data: {
                u64: 0,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "read_data_byte",
                },
              ],
              data: {
                u64: 1472,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "write_data_byte",
                },
              ],
              data: {
                u64: 1480,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "read_code_byte",
                },
              ],
              data: {
                u64: 19592,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "write_code_byte",
                },
              ],
              data: {
                u64: 0,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "emit_event",
                },
              ],
              data: {
                u64: 0,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "emit_event_byte",
                },
              ],
              data: {
                u64: 0,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "cpu_insn",
                },
              ],
              data: {
                u64: 4209916,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "mem_byte",
                },
              ],
              data: {
                u64: 2044276,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "invoke_time_nsecs",
                },
              ],
              data: {
                u64: 568227,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "max_rw_key_byte",
                },
              ],
              data: {
                u64: 120,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "max_rw_data_byte",
                },
              ],
              data: {
                u64: 772,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "max_rw_code_byte",
                },
              ],
              data: {
                u64: 19592,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "max_emit_event_byte",
                },
              ],
              data: {
                u64: 0,
              },
            },
          },
        },
      },
    ],
    ledger: 57909311,
    createdAt: "1751983886",
  },
};
export const TX_ST_CHANGE_KALE_HARVEST = {
  jsonrpc: "2.0",
  id: 1,
  result: {
    latestLedger: 57957751,
    latestLedgerCloseTime: "1752263067",
    oldestLedger: 57836792,
    oldestLedgerCloseTime: "1751571803",
    status: "SUCCESS",
    txHash: "c12e4ca494e1bc9ba4500ae7e54cfb39d1d163aa5840f68ccf92baf0e43019df",
    applicationOrder: 616,
    feeBump: true,
    envelopeJson: {
      tx_fee_bump: {
        tx: {
          fee_source:
            "GBGWQFSJSOMJ2BTOH5RLZUTZPV544YR2DF5CGYL7WDZ2Y6OSRHR6TUBE",
          fee: 276478,
          inner_tx: {
            tx: {
              tx: {
                source_account:
                  "GCTODMVL77MVTKTK2LML3ODPRJY5WJVM4L7JTPMYRIRUFM7QSHSVSF6N",
                fee: 276276,
                seq_num: 241450953868353150,
                cond: {
                  time: {
                    min_time: 0,
                    max_time: 1752262912,
                  },
                },
                memo: "none",
                operations: [
                  {
                    source_account: null,
                    body: {
                      invoke_host_function: {
                        host_function: {
                          invoke_contract: {
                            contract_address:
                              "CBGSBKYMYO6OMGHQXXNOBRGVUDFUDVC2XLC3SXON5R2SNXILR7XCKKY3",
                            function_name: "harvest",
                            args: [
                              {
                                address:
                                  "GB4RM3D7DVPJDWT2OEYPRCIHF6MP6C46YHVJ5NMVLFB725OH7ZE4N6CP",
                              },
                              {
                                vec: [
                                  {
                                    u32: 65643,
                                  },
                                  {
                                    u32: 65644,
                                  },
                                  {
                                    u32: 65645,
                                  },
                                ],
                              },
                            ],
                          },
                        },
                        auth: [],
                      },
                    },
                  },
                ],
                ext: {
                  v1: {
                    ext: "v0",
                    resources: {
                      footprint: {
                        read_only: [
                          {
                            contract_data: {
                              contract:
                                "CBGSBKYMYO6OMGHQXXNOBRGVUDFUDVC2XLC3SXON5R2SNXILR7XCKKY3",
                              key: "ledger_key_contract_instance",
                              durability: "persistent",
                            },
                          },
                          {
                            contract_data: {
                              contract:
                                "CB23WRDQWGSP6YPMY4UV5C4OW5CBTXKYN3XEATG7KJEZCXMJBYEHOUOV",
                              key: "ledger_key_contract_instance",
                              durability: "persistent",
                            },
                          },
                          {
                            contract_data: {
                              contract:
                                "CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA",
                              key: {
                                vec: [
                                  {
                                    symbol: "Block",
                                  },
                                  {
                                    u32: 65643,
                                  },
                                ],
                              },
                              durability: "temporary",
                            },
                          },
                          {
                            contract_data: {
                              contract:
                                "CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA",
                              key: {
                                vec: [
                                  {
                                    symbol: "Block",
                                  },
                                  {
                                    u32: 65644,
                                  },
                                ],
                              },
                              durability: "temporary",
                            },
                          },
                          {
                            contract_data: {
                              contract:
                                "CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA",
                              key: {
                                vec: [
                                  {
                                    symbol: "Block",
                                  },
                                  {
                                    u32: 65645,
                                  },
                                ],
                              },
                              durability: "temporary",
                            },
                          },
                          {
                            contract_data: {
                              contract:
                                "CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA",
                              key: "ledger_key_contract_instance",
                              durability: "persistent",
                            },
                          },
                          {
                            contract_code: {
                              hash: "70fe44694c9fe6b0abc69a6da4858fc2aaba04fa10492a466a1d426d04ca8560",
                            },
                          },
                          {
                            contract_code: {
                              hash: "db2c14290d4964e3805f2527dd132939ba5fb3fccac56b30bfab8fd091011627",
                            },
                          },
                        ],
                        read_write: [
                          {
                            trustline: {
                              account_id:
                                "GB4RM3D7DVPJDWT2OEYPRCIHF6MP6C46YHVJ5NMVLFB725OH7ZE4N6CP",
                              asset: {
                                credit_alphanum4: {
                                  asset_code: "KALE",
                                  issuer:
                                    "GBDVX4VELCDSQ54KQJYTNHXAHFLBCA77ZY2USQBM4CSHTTV7DME7KALE",
                                },
                              },
                            },
                          },
                          {
                            contract_data: {
                              contract:
                                "CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA",
                              key: {
                                vec: [
                                  {
                                    symbol: "Pail",
                                  },
                                  {
                                    address:
                                      "GB4RM3D7DVPJDWT2OEYPRCIHF6MP6C46YHVJ5NMVLFB725OH7ZE4N6CP",
                                  },
                                  {
                                    u32: 65643,
                                  },
                                ],
                              },
                              durability: "temporary",
                            },
                          },
                          {
                            contract_data: {
                              contract:
                                "CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA",
                              key: {
                                vec: [
                                  {
                                    symbol: "Pail",
                                  },
                                  {
                                    address:
                                      "GB4RM3D7DVPJDWT2OEYPRCIHF6MP6C46YHVJ5NMVLFB725OH7ZE4N6CP",
                                  },
                                  {
                                    u32: 65644,
                                  },
                                ],
                              },
                              durability: "temporary",
                            },
                          },
                          {
                            contract_data: {
                              contract:
                                "CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA",
                              key: {
                                vec: [
                                  {
                                    symbol: "Pail",
                                  },
                                  {
                                    address:
                                      "GB4RM3D7DVPJDWT2OEYPRCIHF6MP6C46YHVJ5NMVLFB725OH7ZE4N6CP",
                                  },
                                  {
                                    u32: 65645,
                                  },
                                ],
                              },
                              durability: "temporary",
                            },
                          },
                        ],
                      },
                      instructions: 7083385,
                      read_bytes: 25052,
                      write_bytes: 116,
                    },
                    resource_fee: 276276,
                  },
                },
              },
              signatures: [
                {
                  hint: "f091e559",
                  signature:
                    "aa82517eea834404128dbd498e524831ea31e14744b7452509602a9775a3ba8262b91b9b3ce4d9bd8466ce95e13c8e2028c9d53b678b0279f98cc73d7cbac101",
                },
              ],
            },
          },
          ext: "v0",
        },
        signatures: [
          {
            hint: "d289e3e9",
            signature:
              "16f15de1c657e0bfab7e259828345ceb0a939a742ba9fa5bd64a9b7c547e8bf602ae3f7c49a51afcc600cd1e608980d8b53484d08687a2851b36ef8670e2a705",
          },
        ],
      },
    },
    resultJson: {
      fee_charged: 211947,
      result: {
        tx_fee_bump_inner_success: {
          transaction_hash:
            "6149735578870f0ea5dd4bc57fab394d7afa589b9c890a1ddd036ec3b69a3a44",
          result: {
            fee_charged: 211747,
            result: {
              tx_success: [
                {
                  op_inner: {
                    invoke_host_function: {
                      success:
                        "a42b913d83d9b3731f7d4b74b5c9ee5183d9141417f9e26fe8707e8b1e32a58e",
                    },
                  },
                },
              ],
            },
            ext: "v0",
          },
        },
      },
      ext: "v0",
    },
    resultMetaJson: {
      v3: {
        ext: "v0",
        tx_changes_before: [
          {
            state: {
              last_modified_ledger_seq: 57957721,
              data: {
                account: {
                  account_id:
                    "GBGWQFSJSOMJ2BTOH5RLZUTZPV544YR2DF5CGYL7WDZ2Y6OSRHR6TUBE",
                  balance: 2179519825503,
                  seq_num: 230650163385860100,
                  num_sub_entries: 0,
                  inflation_dest: null,
                  flags: 0,
                  home_domain: "",
                  thresholds: "01000000",
                  signers: [],
                  ext: {
                    v1: {
                      liabilities: {
                        buying: 0,
                        selling: 0,
                      },
                      ext: {
                        v2: {
                          num_sponsored: 0,
                          num_sponsoring: 0,
                          signer_sponsoring_i_ds: [],
                          ext: {
                            v3: {
                              ext: "v0",
                              seq_ledger: 56088316,
                              seq_time: 1741615515,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              ext: "v0",
            },
          },
          {
            updated: {
              last_modified_ledger_seq: 57957721,
              data: {
                account: {
                  account_id:
                    "GBGWQFSJSOMJ2BTOH5RLZUTZPV544YR2DF5CGYL7WDZ2Y6OSRHR6TUBE",
                  balance: 2179519825503,
                  seq_num: 230650163385860100,
                  num_sub_entries: 0,
                  inflation_dest: null,
                  flags: 0,
                  home_domain: "",
                  thresholds: "01000000",
                  signers: [],
                  ext: {
                    v1: {
                      liabilities: {
                        buying: 0,
                        selling: 0,
                      },
                      ext: {
                        v2: {
                          num_sponsored: 0,
                          num_sponsoring: 0,
                          signer_sponsoring_i_ds: [],
                          ext: {
                            v3: {
                              ext: "v0",
                              seq_ledger: 56088316,
                              seq_time: 1741615515,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              ext: "v0",
            },
          },
          {
            state: {
              last_modified_ledger_seq: 57957718,
              data: {
                account: {
                  account_id:
                    "GCTODMVL77MVTKTK2LML3ODPRJY5WJVM4L7JTPMYRIRUFM7QSHSVSF6N",
                  balance: 28541771,
                  seq_num: 241450953868353150,
                  num_sub_entries: 2,
                  inflation_dest: null,
                  flags: 0,
                  home_domain: "",
                  thresholds: "01000000",
                  signers: [],
                  ext: {
                    v1: {
                      liabilities: {
                        buying: 0,
                        selling: 0,
                      },
                      ext: {
                        v2: {
                          num_sponsored: 0,
                          num_sponsoring: 0,
                          signer_sponsoring_i_ds: [],
                          ext: {
                            v3: {
                              ext: "v0",
                              seq_ledger: 57957718,
                              seq_time: 1752262876,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              ext: "v0",
            },
          },
          {
            updated: {
              last_modified_ledger_seq: 57957721,
              data: {
                account: {
                  account_id:
                    "GCTODMVL77MVTKTK2LML3ODPRJY5WJVM4L7JTPMYRIRUFM7QSHSVSF6N",
                  balance: 28541771,
                  seq_num: 241450953868353150,
                  num_sub_entries: 2,
                  inflation_dest: null,
                  flags: 0,
                  home_domain: "",
                  thresholds: "01000000",
                  signers: [],
                  ext: {
                    v1: {
                      liabilities: {
                        buying: 0,
                        selling: 0,
                      },
                      ext: {
                        v2: {
                          num_sponsored: 0,
                          num_sponsoring: 0,
                          signer_sponsoring_i_ds: [],
                          ext: {
                            v3: {
                              ext: "v0",
                              seq_ledger: 57957721,
                              seq_time: 1752262892,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              ext: "v0",
            },
          },
        ],
        operations: [
          {
            changes: [
              {
                state: {
                  last_modified_ledger_seq: 57957657,
                  data: {
                    ttl: {
                      key_hash:
                        "c7e8f7fbb84e38c400a707a16418ac8381687e5bcef650eb63ff214a6c2e2e82",
                      live_until_ledger_seq: 57974936,
                    },
                  },
                  ext: "v0",
                },
              },
              {
                removed: {
                  ttl: {
                    key_hash:
                      "c7e8f7fbb84e38c400a707a16418ac8381687e5bcef650eb63ff214a6c2e2e82",
                  },
                },
              },
              {
                state: {
                  last_modified_ledger_seq: 57957671,
                  data: {
                    contract_data: {
                      ext: "v0",
                      contract:
                        "CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA",
                      key: {
                        vec: [
                          {
                            symbol: "Pail",
                          },
                          {
                            address:
                              "GB4RM3D7DVPJDWT2OEYPRCIHF6MP6C46YHVJ5NMVLFB725OH7ZE4N6CP",
                          },
                          {
                            u32: 65645,
                          },
                        ],
                      },
                      durability: "temporary",
                      val: {
                        map: [
                          {
                            key: {
                              symbol: "gap",
                            },
                            val: {
                              u32: 14,
                            },
                          },
                          {
                            key: {
                              symbol: "sequence",
                            },
                            val: {
                              u32: 57957657,
                            },
                          },
                          {
                            key: {
                              symbol: "stake",
                            },
                            val: {
                              i128: {
                                hi: 0,
                                lo: 1000000000,
                              },
                            },
                          },
                          {
                            key: {
                              symbol: "zeros",
                            },
                            val: {
                              u32: 6,
                            },
                          },
                        ],
                      },
                    },
                  },
                  ext: "v0",
                },
              },
              {
                removed: {
                  contract_data: {
                    contract:
                      "CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA",
                    key: {
                      vec: [
                        {
                          symbol: "Pail",
                        },
                        {
                          address:
                            "GB4RM3D7DVPJDWT2OEYPRCIHF6MP6C46YHVJ5NMVLFB725OH7ZE4N6CP",
                        },
                        {
                          u32: 65645,
                        },
                      ],
                    },
                    durability: "temporary",
                  },
                },
              },
              {
                state: {
                  last_modified_ledger_seq: 57957561,
                  data: {
                    contract_data: {
                      ext: "v0",
                      contract:
                        "CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA",
                      key: {
                        vec: [
                          {
                            symbol: "Pail",
                          },
                          {
                            address:
                              "GB4RM3D7DVPJDWT2OEYPRCIHF6MP6C46YHVJ5NMVLFB725OH7ZE4N6CP",
                          },
                          {
                            u32: 65643,
                          },
                        ],
                      },
                      durability: "temporary",
                      val: {
                        map: [
                          {
                            key: {
                              symbol: "gap",
                            },
                            val: {
                              u32: 17,
                            },
                          },
                          {
                            key: {
                              symbol: "sequence",
                            },
                            val: {
                              u32: 57957544,
                            },
                          },
                          {
                            key: {
                              symbol: "stake",
                            },
                            val: {
                              i128: {
                                hi: 0,
                                lo: 1000000000,
                              },
                            },
                          },
                          {
                            key: {
                              symbol: "zeros",
                            },
                            val: {
                              u32: 6,
                            },
                          },
                        ],
                      },
                    },
                  },
                  ext: "v0",
                },
              },
              {
                removed: {
                  contract_data: {
                    contract:
                      "CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA",
                    key: {
                      vec: [
                        {
                          symbol: "Pail",
                        },
                        {
                          address:
                            "GB4RM3D7DVPJDWT2OEYPRCIHF6MP6C46YHVJ5NMVLFB725OH7ZE4N6CP",
                        },
                        {
                          u32: 65643,
                        },
                      ],
                    },
                    durability: "temporary",
                  },
                },
              },
              {
                state: {
                  last_modified_ledger_seq: 57957708,
                  data: {
                    trustline: {
                      account_id:
                        "GB4RM3D7DVPJDWT2OEYPRCIHF6MP6C46YHVJ5NMVLFB725OH7ZE4N6CP",
                      asset: {
                        credit_alphanum4: {
                          asset_code: "KALE",
                          issuer:
                            "GBDVX4VELCDSQ54KQJYTNHXAHFLBCA77ZY2USQBM4CSHTTV7DME7KALE",
                        },
                      },
                      balance: 9765190860,
                      limit: 9223372036854776000,
                      flags: 1,
                      ext: "v0",
                    },
                  },
                  ext: "v0",
                },
              },
              {
                updated: {
                  last_modified_ledger_seq: 57957721,
                  data: {
                    trustline: {
                      account_id:
                        "GB4RM3D7DVPJDWT2OEYPRCIHF6MP6C46YHVJ5NMVLFB725OH7ZE4N6CP",
                      asset: {
                        credit_alphanum4: {
                          asset_code: "KALE",
                          issuer:
                            "GBDVX4VELCDSQ54KQJYTNHXAHFLBCA77ZY2USQBM4CSHTTV7DME7KALE",
                        },
                      },
                      balance: 12866050080,
                      limit: 9223372036854776000,
                      flags: 1,
                      ext: "v0",
                    },
                  },
                  ext: "v0",
                },
              },
              {
                state: {
                  last_modified_ledger_seq: 57957604,
                  data: {
                    ttl: {
                      key_hash:
                        "a349f1b343e6a3f95b7fa2c06ed806f9b0a0491524aef499bae1280c358b688a",
                      live_until_ledger_seq: 57974883,
                    },
                  },
                  ext: "v0",
                },
              },
              {
                removed: {
                  ttl: {
                    key_hash:
                      "a349f1b343e6a3f95b7fa2c06ed806f9b0a0491524aef499bae1280c358b688a",
                  },
                },
              },
              {
                state: {
                  last_modified_ledger_seq: 57957623,
                  data: {
                    contract_data: {
                      ext: "v0",
                      contract:
                        "CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA",
                      key: {
                        vec: [
                          {
                            symbol: "Pail",
                          },
                          {
                            address:
                              "GB4RM3D7DVPJDWT2OEYPRCIHF6MP6C46YHVJ5NMVLFB725OH7ZE4N6CP",
                          },
                          {
                            u32: 65644,
                          },
                        ],
                      },
                      durability: "temporary",
                      val: {
                        map: [
                          {
                            key: {
                              symbol: "gap",
                            },
                            val: {
                              u32: 19,
                            },
                          },
                          {
                            key: {
                              symbol: "sequence",
                            },
                            val: {
                              u32: 57957604,
                            },
                          },
                          {
                            key: {
                              symbol: "stake",
                            },
                            val: {
                              i128: {
                                hi: 0,
                                lo: 1000000000,
                              },
                            },
                          },
                          {
                            key: {
                              symbol: "zeros",
                            },
                            val: {
                              u32: 6,
                            },
                          },
                        ],
                      },
                    },
                  },
                  ext: "v0",
                },
              },
              {
                removed: {
                  contract_data: {
                    contract:
                      "CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA",
                    key: {
                      vec: [
                        {
                          symbol: "Pail",
                        },
                        {
                          address:
                            "GB4RM3D7DVPJDWT2OEYPRCIHF6MP6C46YHVJ5NMVLFB725OH7ZE4N6CP",
                        },
                        {
                          u32: 65644,
                        },
                      ],
                    },
                    durability: "temporary",
                  },
                },
              },
              {
                state: {
                  last_modified_ledger_seq: 57957544,
                  data: {
                    ttl: {
                      key_hash:
                        "2eba3b59461d127a61f925750a39170921718ef322014f826ba607b606c23b37",
                      live_until_ledger_seq: 57974823,
                    },
                  },
                  ext: "v0",
                },
              },
              {
                removed: {
                  ttl: {
                    key_hash:
                      "2eba3b59461d127a61f925750a39170921718ef322014f826ba607b606c23b37",
                  },
                },
              },
            ],
          },
        ],
        tx_changes_after: [
          {
            state: {
              last_modified_ledger_seq: 57957721,
              data: {
                account: {
                  account_id:
                    "GBGWQFSJSOMJ2BTOH5RLZUTZPV544YR2DF5CGYL7WDZ2Y6OSRHR6TUBE",
                  balance: 2179519825503,
                  seq_num: 230650163385860100,
                  num_sub_entries: 0,
                  inflation_dest: null,
                  flags: 0,
                  home_domain: "",
                  thresholds: "01000000",
                  signers: [],
                  ext: {
                    v1: {
                      liabilities: {
                        buying: 0,
                        selling: 0,
                      },
                      ext: {
                        v2: {
                          num_sponsored: 0,
                          num_sponsoring: 0,
                          signer_sponsoring_i_ds: [],
                          ext: {
                            v3: {
                              ext: "v0",
                              seq_ledger: 56088316,
                              seq_time: 1741615515,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              ext: "v0",
            },
          },
          {
            updated: {
              last_modified_ledger_seq: 57957721,
              data: {
                account: {
                  account_id:
                    "GBGWQFSJSOMJ2BTOH5RLZUTZPV544YR2DF5CGYL7WDZ2Y6OSRHR6TUBE",
                  balance: 2179519890032,
                  seq_num: 230650163385860100,
                  num_sub_entries: 0,
                  inflation_dest: null,
                  flags: 0,
                  home_domain: "",
                  thresholds: "01000000",
                  signers: [],
                  ext: {
                    v1: {
                      liabilities: {
                        buying: 0,
                        selling: 0,
                      },
                      ext: {
                        v2: {
                          num_sponsored: 0,
                          num_sponsoring: 0,
                          signer_sponsoring_i_ds: [],
                          ext: {
                            v3: {
                              ext: "v0",
                              seq_ledger: 56088316,
                              seq_time: 1741615515,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              ext: "v0",
            },
          },
        ],
        soroban_meta: {
          ext: {
            v1: {
              ext: "v0",
              total_non_refundable_resource_fee_charged: 204012,
              total_refundable_resource_fee_charged: 7735,
              rent_fee_charged: 0,
            },
          },
          events: [
            {
              ext: "v0",
              contract_id:
                "75bb4470b1a4ff61ecc7295e8b8eb74419dd586eee404cdf5249915d890e0877",
              type_: "contract",
              body: {
                v0: {
                  topics: [
                    {
                      symbol: "mint",
                    },
                    {
                      address:
                        "CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA",
                    },
                    {
                      address:
                        "GB4RM3D7DVPJDWT2OEYPRCIHF6MP6C46YHVJ5NMVLFB725OH7ZE4N6CP",
                    },
                    {
                      string:
                        "KALE:GBDVX4VELCDSQ54KQJYTNHXAHFLBCA77ZY2USQBM4CSHTTV7DME7KALE",
                    },
                  ],
                  data: {
                    i128: {
                      hi: 0,
                      lo: 1033023389,
                    },
                  },
                },
              },
            },
            {
              ext: "v0",
              contract_id:
                "75bb4470b1a4ff61ecc7295e8b8eb74419dd586eee404cdf5249915d890e0877",
              type_: "contract",
              body: {
                v0: {
                  topics: [
                    {
                      symbol: "mint",
                    },
                    {
                      address:
                        "CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA",
                    },
                    {
                      address:
                        "GB4RM3D7DVPJDWT2OEYPRCIHF6MP6C46YHVJ5NMVLFB725OH7ZE4N6CP",
                    },
                    {
                      string:
                        "KALE:GBDVX4VELCDSQ54KQJYTNHXAHFLBCA77ZY2USQBM4CSHTTV7DME7KALE",
                    },
                  ],
                  data: {
                    i128: {
                      hi: 0,
                      lo: 1034867305,
                    },
                  },
                },
              },
            },
            {
              ext: "v0",
              contract_id:
                "75bb4470b1a4ff61ecc7295e8b8eb74419dd586eee404cdf5249915d890e0877",
              type_: "contract",
              body: {
                v0: {
                  topics: [
                    {
                      symbol: "mint",
                    },
                    {
                      address:
                        "CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA",
                    },
                    {
                      address:
                        "GB4RM3D7DVPJDWT2OEYPRCIHF6MP6C46YHVJ5NMVLFB725OH7ZE4N6CP",
                    },
                    {
                      string:
                        "KALE:GBDVX4VELCDSQ54KQJYTNHXAHFLBCA77ZY2USQBM4CSHTTV7DME7KALE",
                    },
                  ],
                  data: {
                    i128: {
                      hi: 0,
                      lo: 1032968526,
                    },
                  },
                },
              },
            },
          ],
          return_value: {
            vec: [
              {
                i128: {
                  hi: 0,
                  lo: 33023389,
                },
              },
              {
                i128: {
                  hi: 0,
                  lo: 34867305,
                },
              },
              {
                i128: {
                  hi: 0,
                  lo: 32968526,
                },
              },
            ],
          },
          diagnostic_events: [
            {
              in_successful_contract_call: true,
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
                          "4d20ab0cc3bce618f0bddae0c4d5a0cb41d45abac5b95dcdec7526dd0b8fee25",
                      },
                      {
                        symbol: "harvest",
                      },
                    ],
                    data: {
                      vec: [
                        {
                          address:
                            "GB4RM3D7DVPJDWT2OEYPRCIHF6MP6C46YHVJ5NMVLFB725OH7ZE4N6CP",
                        },
                        {
                          vec: [
                            {
                              u32: 65643,
                            },
                            {
                              u32: 65644,
                            },
                            {
                              u32: 65645,
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
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "4d20ab0cc3bce618f0bddae0c4d5a0cb41d45abac5b95dcdec7526dd0b8fee25",
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
                        symbol: "harvest",
                      },
                    ],
                    data: {
                      vec: [
                        {
                          address:
                            "GB4RM3D7DVPJDWT2OEYPRCIHF6MP6C46YHVJ5NMVLFB725OH7ZE4N6CP",
                        },
                        {
                          u32: 65643,
                        },
                      ],
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "d7fe44bd0af11d602b1091f2f4a1f4df212d444d0321ea32adb3cc1cbbab0a04",
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "fn_call",
                      },
                      {
                        bytes:
                          "75bb4470b1a4ff61ecc7295e8b8eb74419dd586eee404cdf5249915d890e0877",
                      },
                      {
                        symbol: "mint",
                      },
                    ],
                    data: {
                      vec: [
                        {
                          address:
                            "GB4RM3D7DVPJDWT2OEYPRCIHF6MP6C46YHVJ5NMVLFB725OH7ZE4N6CP",
                        },
                        {
                          i128: {
                            hi: 0,
                            lo: 1033023389,
                          },
                        },
                      ],
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "75bb4470b1a4ff61ecc7295e8b8eb74419dd586eee404cdf5249915d890e0877",
                type_: "contract",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "mint",
                      },
                      {
                        address:
                          "CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA",
                      },
                      {
                        address:
                          "GB4RM3D7DVPJDWT2OEYPRCIHF6MP6C46YHVJ5NMVLFB725OH7ZE4N6CP",
                      },
                      {
                        string:
                          "KALE:GBDVX4VELCDSQ54KQJYTNHXAHFLBCA77ZY2USQBM4CSHTTV7DME7KALE",
                      },
                    ],
                    data: {
                      i128: {
                        hi: 0,
                        lo: 1033023389,
                      },
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "75bb4470b1a4ff61ecc7295e8b8eb74419dd586eee404cdf5249915d890e0877",
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "fn_return",
                      },
                      {
                        symbol: "mint",
                      },
                    ],
                    data: "void",
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "d7fe44bd0af11d602b1091f2f4a1f4df212d444d0321ea32adb3cc1cbbab0a04",
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "fn_return",
                      },
                      {
                        symbol: "harvest",
                      },
                    ],
                    data: {
                      i128: {
                        hi: 0,
                        lo: 33023389,
                      },
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "4d20ab0cc3bce618f0bddae0c4d5a0cb41d45abac5b95dcdec7526dd0b8fee25",
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
                        symbol: "harvest",
                      },
                    ],
                    data: {
                      vec: [
                        {
                          address:
                            "GB4RM3D7DVPJDWT2OEYPRCIHF6MP6C46YHVJ5NMVLFB725OH7ZE4N6CP",
                        },
                        {
                          u32: 65644,
                        },
                      ],
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "d7fe44bd0af11d602b1091f2f4a1f4df212d444d0321ea32adb3cc1cbbab0a04",
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "fn_call",
                      },
                      {
                        bytes:
                          "75bb4470b1a4ff61ecc7295e8b8eb74419dd586eee404cdf5249915d890e0877",
                      },
                      {
                        symbol: "mint",
                      },
                    ],
                    data: {
                      vec: [
                        {
                          address:
                            "GB4RM3D7DVPJDWT2OEYPRCIHF6MP6C46YHVJ5NMVLFB725OH7ZE4N6CP",
                        },
                        {
                          i128: {
                            hi: 0,
                            lo: 1034867305,
                          },
                        },
                      ],
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "75bb4470b1a4ff61ecc7295e8b8eb74419dd586eee404cdf5249915d890e0877",
                type_: "contract",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "mint",
                      },
                      {
                        address:
                          "CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA",
                      },
                      {
                        address:
                          "GB4RM3D7DVPJDWT2OEYPRCIHF6MP6C46YHVJ5NMVLFB725OH7ZE4N6CP",
                      },
                      {
                        string:
                          "KALE:GBDVX4VELCDSQ54KQJYTNHXAHFLBCA77ZY2USQBM4CSHTTV7DME7KALE",
                      },
                    ],
                    data: {
                      i128: {
                        hi: 0,
                        lo: 1034867305,
                      },
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "75bb4470b1a4ff61ecc7295e8b8eb74419dd586eee404cdf5249915d890e0877",
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "fn_return",
                      },
                      {
                        symbol: "mint",
                      },
                    ],
                    data: "void",
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "d7fe44bd0af11d602b1091f2f4a1f4df212d444d0321ea32adb3cc1cbbab0a04",
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "fn_return",
                      },
                      {
                        symbol: "harvest",
                      },
                    ],
                    data: {
                      i128: {
                        hi: 0,
                        lo: 34867305,
                      },
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "4d20ab0cc3bce618f0bddae0c4d5a0cb41d45abac5b95dcdec7526dd0b8fee25",
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
                        symbol: "harvest",
                      },
                    ],
                    data: {
                      vec: [
                        {
                          address:
                            "GB4RM3D7DVPJDWT2OEYPRCIHF6MP6C46YHVJ5NMVLFB725OH7ZE4N6CP",
                        },
                        {
                          u32: 65645,
                        },
                      ],
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "d7fe44bd0af11d602b1091f2f4a1f4df212d444d0321ea32adb3cc1cbbab0a04",
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "fn_call",
                      },
                      {
                        bytes:
                          "75bb4470b1a4ff61ecc7295e8b8eb74419dd586eee404cdf5249915d890e0877",
                      },
                      {
                        symbol: "mint",
                      },
                    ],
                    data: {
                      vec: [
                        {
                          address:
                            "GB4RM3D7DVPJDWT2OEYPRCIHF6MP6C46YHVJ5NMVLFB725OH7ZE4N6CP",
                        },
                        {
                          i128: {
                            hi: 0,
                            lo: 1032968526,
                          },
                        },
                      ],
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "75bb4470b1a4ff61ecc7295e8b8eb74419dd586eee404cdf5249915d890e0877",
                type_: "contract",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "mint",
                      },
                      {
                        address:
                          "CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA",
                      },
                      {
                        address:
                          "GB4RM3D7DVPJDWT2OEYPRCIHF6MP6C46YHVJ5NMVLFB725OH7ZE4N6CP",
                      },
                      {
                        string:
                          "KALE:GBDVX4VELCDSQ54KQJYTNHXAHFLBCA77ZY2USQBM4CSHTTV7DME7KALE",
                      },
                    ],
                    data: {
                      i128: {
                        hi: 0,
                        lo: 1032968526,
                      },
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "75bb4470b1a4ff61ecc7295e8b8eb74419dd586eee404cdf5249915d890e0877",
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "fn_return",
                      },
                      {
                        symbol: "mint",
                      },
                    ],
                    data: "void",
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "d7fe44bd0af11d602b1091f2f4a1f4df212d444d0321ea32adb3cc1cbbab0a04",
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "fn_return",
                      },
                      {
                        symbol: "harvest",
                      },
                    ],
                    data: {
                      i128: {
                        hi: 0,
                        lo: 32968526,
                      },
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "4d20ab0cc3bce618f0bddae0c4d5a0cb41d45abac5b95dcdec7526dd0b8fee25",
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "fn_return",
                      },
                      {
                        symbol: "harvest",
                      },
                    ],
                    data: {
                      vec: [
                        {
                          i128: {
                            hi: 0,
                            lo: 33023389,
                          },
                        },
                        {
                          i128: {
                            hi: 0,
                            lo: 34867305,
                          },
                        },
                        {
                          i128: {
                            hi: 0,
                            lo: 32968526,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "read_entry",
                      },
                    ],
                    data: {
                      u64: 12,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "write_entry",
                      },
                    ],
                    data: {
                      u64: 1,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "ledger_read_byte",
                      },
                    ],
                    data: {
                      u64: 25052,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "ledger_write_byte",
                      },
                    ],
                    data: {
                      u64: 116,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "read_key_byte",
                      },
                    ],
                    data: {
                      u64: 900,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "write_key_byte",
                      },
                    ],
                    data: {
                      u64: 0,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "read_data_byte",
                      },
                    ],
                    data: {
                      u64: 3644,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "write_data_byte",
                      },
                    ],
                    data: {
                      u64: 116,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "read_code_byte",
                      },
                    ],
                    data: {
                      u64: 21408,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "write_code_byte",
                      },
                    ],
                    data: {
                      u64: 0,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "emit_event",
                      },
                    ],
                    data: {
                      u64: 3,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "emit_event_byte",
                      },
                    ],
                    data: {
                      u64: 720,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "cpu_insn",
                      },
                    ],
                    data: {
                      u64: 6656214,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "mem_byte",
                      },
                    ],
                    data: {
                      u64: 5857480,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "invoke_time_nsecs",
                      },
                    ],
                    data: {
                      u64: 697605,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "max_rw_key_byte",
                      },
                    ],
                    data: {
                      u64: 120,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "max_rw_data_byte",
                      },
                    ],
                    data: {
                      u64: 772,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "max_rw_code_byte",
                      },
                    ],
                    data: {
                      u64: 19592,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "max_emit_event_byte",
                      },
                    ],
                    data: {
                      u64: 240,
                    },
                  },
                },
              },
            },
          ],
        },
      },
    },
    diagnosticEventsJson: [
      {
        in_successful_contract_call: true,
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
                    "4d20ab0cc3bce618f0bddae0c4d5a0cb41d45abac5b95dcdec7526dd0b8fee25",
                },
                {
                  symbol: "harvest",
                },
              ],
              data: {
                vec: [
                  {
                    address:
                      "GB4RM3D7DVPJDWT2OEYPRCIHF6MP6C46YHVJ5NMVLFB725OH7ZE4N6CP",
                  },
                  {
                    vec: [
                      {
                        u32: 65643,
                      },
                      {
                        u32: 65644,
                      },
                      {
                        u32: 65645,
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
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "4d20ab0cc3bce618f0bddae0c4d5a0cb41d45abac5b95dcdec7526dd0b8fee25",
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
                  symbol: "harvest",
                },
              ],
              data: {
                vec: [
                  {
                    address:
                      "GB4RM3D7DVPJDWT2OEYPRCIHF6MP6C46YHVJ5NMVLFB725OH7ZE4N6CP",
                  },
                  {
                    u32: 65643,
                  },
                ],
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "d7fe44bd0af11d602b1091f2f4a1f4df212d444d0321ea32adb3cc1cbbab0a04",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_call",
                },
                {
                  bytes:
                    "75bb4470b1a4ff61ecc7295e8b8eb74419dd586eee404cdf5249915d890e0877",
                },
                {
                  symbol: "mint",
                },
              ],
              data: {
                vec: [
                  {
                    address:
                      "GB4RM3D7DVPJDWT2OEYPRCIHF6MP6C46YHVJ5NMVLFB725OH7ZE4N6CP",
                  },
                  {
                    i128: {
                      hi: 0,
                      lo: 1033023389,
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "75bb4470b1a4ff61ecc7295e8b8eb74419dd586eee404cdf5249915d890e0877",
          type_: "contract",
          body: {
            v0: {
              topics: [
                {
                  symbol: "mint",
                },
                {
                  address:
                    "CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA",
                },
                {
                  address:
                    "GB4RM3D7DVPJDWT2OEYPRCIHF6MP6C46YHVJ5NMVLFB725OH7ZE4N6CP",
                },
                {
                  string:
                    "KALE:GBDVX4VELCDSQ54KQJYTNHXAHFLBCA77ZY2USQBM4CSHTTV7DME7KALE",
                },
              ],
              data: {
                i128: {
                  hi: 0,
                  lo: 1033023389,
                },
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "75bb4470b1a4ff61ecc7295e8b8eb74419dd586eee404cdf5249915d890e0877",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_return",
                },
                {
                  symbol: "mint",
                },
              ],
              data: "void",
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "d7fe44bd0af11d602b1091f2f4a1f4df212d444d0321ea32adb3cc1cbbab0a04",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_return",
                },
                {
                  symbol: "harvest",
                },
              ],
              data: {
                i128: {
                  hi: 0,
                  lo: 33023389,
                },
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "4d20ab0cc3bce618f0bddae0c4d5a0cb41d45abac5b95dcdec7526dd0b8fee25",
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
                  symbol: "harvest",
                },
              ],
              data: {
                vec: [
                  {
                    address:
                      "GB4RM3D7DVPJDWT2OEYPRCIHF6MP6C46YHVJ5NMVLFB725OH7ZE4N6CP",
                  },
                  {
                    u32: 65644,
                  },
                ],
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "d7fe44bd0af11d602b1091f2f4a1f4df212d444d0321ea32adb3cc1cbbab0a04",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_call",
                },
                {
                  bytes:
                    "75bb4470b1a4ff61ecc7295e8b8eb74419dd586eee404cdf5249915d890e0877",
                },
                {
                  symbol: "mint",
                },
              ],
              data: {
                vec: [
                  {
                    address:
                      "GB4RM3D7DVPJDWT2OEYPRCIHF6MP6C46YHVJ5NMVLFB725OH7ZE4N6CP",
                  },
                  {
                    i128: {
                      hi: 0,
                      lo: 1034867305,
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "75bb4470b1a4ff61ecc7295e8b8eb74419dd586eee404cdf5249915d890e0877",
          type_: "contract",
          body: {
            v0: {
              topics: [
                {
                  symbol: "mint",
                },
                {
                  address:
                    "CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA",
                },
                {
                  address:
                    "GB4RM3D7DVPJDWT2OEYPRCIHF6MP6C46YHVJ5NMVLFB725OH7ZE4N6CP",
                },
                {
                  string:
                    "KALE:GBDVX4VELCDSQ54KQJYTNHXAHFLBCA77ZY2USQBM4CSHTTV7DME7KALE",
                },
              ],
              data: {
                i128: {
                  hi: 0,
                  lo: 1034867305,
                },
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "75bb4470b1a4ff61ecc7295e8b8eb74419dd586eee404cdf5249915d890e0877",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_return",
                },
                {
                  symbol: "mint",
                },
              ],
              data: "void",
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "d7fe44bd0af11d602b1091f2f4a1f4df212d444d0321ea32adb3cc1cbbab0a04",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_return",
                },
                {
                  symbol: "harvest",
                },
              ],
              data: {
                i128: {
                  hi: 0,
                  lo: 34867305,
                },
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "4d20ab0cc3bce618f0bddae0c4d5a0cb41d45abac5b95dcdec7526dd0b8fee25",
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
                  symbol: "harvest",
                },
              ],
              data: {
                vec: [
                  {
                    address:
                      "GB4RM3D7DVPJDWT2OEYPRCIHF6MP6C46YHVJ5NMVLFB725OH7ZE4N6CP",
                  },
                  {
                    u32: 65645,
                  },
                ],
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "d7fe44bd0af11d602b1091f2f4a1f4df212d444d0321ea32adb3cc1cbbab0a04",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_call",
                },
                {
                  bytes:
                    "75bb4470b1a4ff61ecc7295e8b8eb74419dd586eee404cdf5249915d890e0877",
                },
                {
                  symbol: "mint",
                },
              ],
              data: {
                vec: [
                  {
                    address:
                      "GB4RM3D7DVPJDWT2OEYPRCIHF6MP6C46YHVJ5NMVLFB725OH7ZE4N6CP",
                  },
                  {
                    i128: {
                      hi: 0,
                      lo: 1032968526,
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "75bb4470b1a4ff61ecc7295e8b8eb74419dd586eee404cdf5249915d890e0877",
          type_: "contract",
          body: {
            v0: {
              topics: [
                {
                  symbol: "mint",
                },
                {
                  address:
                    "CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA",
                },
                {
                  address:
                    "GB4RM3D7DVPJDWT2OEYPRCIHF6MP6C46YHVJ5NMVLFB725OH7ZE4N6CP",
                },
                {
                  string:
                    "KALE:GBDVX4VELCDSQ54KQJYTNHXAHFLBCA77ZY2USQBM4CSHTTV7DME7KALE",
                },
              ],
              data: {
                i128: {
                  hi: 0,
                  lo: 1032968526,
                },
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "75bb4470b1a4ff61ecc7295e8b8eb74419dd586eee404cdf5249915d890e0877",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_return",
                },
                {
                  symbol: "mint",
                },
              ],
              data: "void",
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "d7fe44bd0af11d602b1091f2f4a1f4df212d444d0321ea32adb3cc1cbbab0a04",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_return",
                },
                {
                  symbol: "harvest",
                },
              ],
              data: {
                i128: {
                  hi: 0,
                  lo: 32968526,
                },
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "4d20ab0cc3bce618f0bddae0c4d5a0cb41d45abac5b95dcdec7526dd0b8fee25",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_return",
                },
                {
                  symbol: "harvest",
                },
              ],
              data: {
                vec: [
                  {
                    i128: {
                      hi: 0,
                      lo: 33023389,
                    },
                  },
                  {
                    i128: {
                      hi: 0,
                      lo: 34867305,
                    },
                  },
                  {
                    i128: {
                      hi: 0,
                      lo: 32968526,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "read_entry",
                },
              ],
              data: {
                u64: 12,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "write_entry",
                },
              ],
              data: {
                u64: 1,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "ledger_read_byte",
                },
              ],
              data: {
                u64: 25052,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "ledger_write_byte",
                },
              ],
              data: {
                u64: 116,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "read_key_byte",
                },
              ],
              data: {
                u64: 900,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "write_key_byte",
                },
              ],
              data: {
                u64: 0,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "read_data_byte",
                },
              ],
              data: {
                u64: 3644,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "write_data_byte",
                },
              ],
              data: {
                u64: 116,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "read_code_byte",
                },
              ],
              data: {
                u64: 21408,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "write_code_byte",
                },
              ],
              data: {
                u64: 0,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "emit_event",
                },
              ],
              data: {
                u64: 3,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "emit_event_byte",
                },
              ],
              data: {
                u64: 720,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "cpu_insn",
                },
              ],
              data: {
                u64: 6656214,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "mem_byte",
                },
              ],
              data: {
                u64: 5857480,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "invoke_time_nsecs",
                },
              ],
              data: {
                u64: 697605,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "max_rw_key_byte",
                },
              ],
              data: {
                u64: 120,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "max_rw_data_byte",
                },
              ],
              data: {
                u64: 772,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "max_rw_code_byte",
                },
              ],
              data: {
                u64: 19592,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "max_emit_event_byte",
                },
              ],
              data: {
                u64: 240,
              },
            },
          },
        },
      },
    ],
    ledger: 57957721,
    createdAt: "1752262892",
  },
};

// Soroban Domains: CATRNPHYKNXAPNLHEYH55REB6YSAJLGCPA4YM6L3WUKSZOPI77M2UMKI
export const TX_ST_CHANGE_DOMAIN_SET = {
  jsonrpc: "2.0",
  id: 1,
  result: {
    latestLedger: 57819918,
    latestLedgerCloseTime: "1751476235",
    oldestLedger: 57698959,
    oldestLedgerCloseTime: "1750791544",
    status: "SUCCESS",
    txHash: "2ddb68eb58bfac410a6bcbafa4e409321bd147cc05a0e4e820b69639df2abf49",
    applicationOrder: 201,
    feeBump: false,
    envelopeJson: {
      tx: {
        tx: {
          source_account:
            "GA2Q3TSCKD6GBT5SL4XLAPT4TUXJ5GP7HLIM4OHBWT33GFD2UC7SRNEZ",
          fee: 15499079,
          seq_num: 245643245676134560,
          cond: {
            time: {
              min_time: 0,
              max_time: 1750884357,
            },
          },
          memo: "none",
          operations: [
            {
              source_account: null,
              body: {
                invoke_host_function: {
                  host_function: {
                    invoke_contract: {
                      contract_address:
                        "CATRNPHYKNXAPNLHEYH55REB6YSAJLGCPA4YM6L3WUKSZOPI77M2UMKI",
                      function_name: "set_record",
                      args: [
                        {
                          bytes: "63726f62756c6c",
                        },
                        {
                          bytes: "786c6d",
                        },
                        {
                          address:
                            "GA2Q3TSCKD6GBT5SL4XLAPT4TUXJ5GP7HLIM4OHBWT33GFD2UC7SRNEZ",
                        },
                        {
                          address:
                            "GA2Q3TSCKD6GBT5SL4XLAPT4TUXJ5GP7HLIM4OHBWT33GFD2UC7SRNEZ",
                        },
                        {
                          u64: 31536000,
                        },
                      ],
                    },
                  },
                  auth: [
                    {
                      credentials: "source_account",
                      root_invocation: {
                        function: {
                          contract_fn: {
                            contract_address:
                              "CATRNPHYKNXAPNLHEYH55REB6YSAJLGCPA4YM6L3WUKSZOPI77M2UMKI",
                            function_name: "set_record",
                            args: [
                              {
                                bytes: "63726f62756c6c",
                              },
                              {
                                bytes: "786c6d",
                              },
                              {
                                address:
                                  "GA2Q3TSCKD6GBT5SL4XLAPT4TUXJ5GP7HLIM4OHBWT33GFD2UC7SRNEZ",
                              },
                              {
                                address:
                                  "GA2Q3TSCKD6GBT5SL4XLAPT4TUXJ5GP7HLIM4OHBWT33GFD2UC7SRNEZ",
                              },
                              {
                                u64: 31536000,
                              },
                            ],
                          },
                        },
                        sub_invocations: [
                          {
                            function: {
                              contract_fn: {
                                contract_address:
                                  "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                                function_name: "transfer",
                                args: [
                                  {
                                    address:
                                      "GA2Q3TSCKD6GBT5SL4XLAPT4TUXJ5GP7HLIM4OHBWT33GFD2UC7SRNEZ",
                                  },
                                  {
                                    address:
                                      "CATRNPHYKNXAPNLHEYH55REB6YSAJLGCPA4YM6L3WUKSZOPI77M2UMKI",
                                  },
                                  {
                                    i128: {
                                      hi: 0,
                                      lo: 823315979,
                                    },
                                  },
                                ],
                              },
                            },
                            sub_invocations: [],
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            },
          ],
          ext: {
            v1: {
              ext: "v0",
              resources: {
                footprint: {
                  read_only: [
                    {
                      contract_data: {
                        contract:
                          "CAFJZQWSED6YAWZU3GWRTOCNPPCGBN32L7QV43XX5LZLFTK6JLN34DLN",
                        key: {
                          u128: {
                            hi: 1750884000000,
                            lo: 13,
                          },
                        },
                        durability: "temporary",
                      },
                    },
                    {
                      contract_data: {
                        contract:
                          "CAFJZQWSED6YAWZU3GWRTOCNPPCGBN32L7QV43XX5LZLFTK6JLN34DLN",
                        key: "ledger_key_contract_instance",
                        durability: "persistent",
                      },
                    },
                    {
                      contract_data: {
                        contract:
                          "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                        key: "ledger_key_contract_instance",
                        durability: "persistent",
                      },
                    },
                    {
                      contract_data: {
                        contract:
                          "CATRNPHYKNXAPNLHEYH55REB6YSAJLGCPA4YM6L3WUKSZOPI77M2UMKI",
                        key: "ledger_key_contract_instance",
                        durability: "persistent",
                      },
                    },
                    {
                      contract_code: {
                        hash: "445fc62539a1046baa501784d3e8fedd81e30d0671196bdc24dbf85124e4de22",
                      },
                    },
                    {
                      contract_code: {
                        hash: "df88820e231ad8f3027871e5dd3cf45491d7b7735e785731466bfc2946008608",
                      },
                    },
                  ],
                  read_write: [
                    {
                      account: {
                        account_id:
                          "GA2Q3TSCKD6GBT5SL4XLAPT4TUXJ5GP7HLIM4OHBWT33GFD2UC7SRNEZ",
                      },
                    },
                    {
                      contract_data: {
                        contract:
                          "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                        key: {
                          vec: [
                            {
                              symbol: "Balance",
                            },
                            {
                              address:
                                "CATRNPHYKNXAPNLHEYH55REB6YSAJLGCPA4YM6L3WUKSZOPI77M2UMKI",
                            },
                          ],
                        },
                        durability: "persistent",
                      },
                    },
                    {
                      contract_data: {
                        contract:
                          "CATRNPHYKNXAPNLHEYH55REB6YSAJLGCPA4YM6L3WUKSZOPI77M2UMKI",
                        key: {
                          vec: [
                            {
                              symbol: "Record",
                            },
                            {
                              bytes:
                                "3e24177e1563b9414c3ee108f2a92f44bbadf1ef5e35c900bed94d74445268ac",
                            },
                          ],
                        },
                        durability: "persistent",
                      },
                    },
                  ],
                },
                instructions: 15077814,
                read_bytes: 45628,
                write_bytes: 848,
              },
              resource_fee: 5499079,
            },
          },
        },
        signatures: [
          {
            hint: "7aa0bf28",
            signature:
              "dfdc5043299fbb4a6b8c4bc746e1aa3bd855f504b7383af5e0af4f90dee2aa80ffb6be507f7263612d6e556f4e9a9d71ac39e84f17abd3918cb5ccf60fc98608",
          },
        ],
      },
    },
    resultJson: {
      fee_charged: 4763796,
      result: {
        tx_success: [
          {
            op_inner: {
              invoke_host_function: {
                success:
                  "7712ece07f8519c7eb32083d44adf0d5376fd15614b63bc3439d245569965bfc",
              },
            },
          },
        ],
      },
      ext: "v0",
    },
    resultMetaJson: {
      v3: {
        ext: "v0",
        tx_changes_before: [
          {
            state: {
              last_modified_ledger_seq: 57715298,
              data: {
                account: {
                  account_id:
                    "GA2Q3TSCKD6GBT5SL4XLAPT4TUXJ5GP7HLIM4OHBWT33GFD2UC7SRNEZ",
                  balance: 970527269,
                  seq_num: 245643245676134560,
                  num_sub_entries: 15,
                  inflation_dest:
                    "GDCHDRSDOBRMSUDKRE2C4U4KDLNEATJPIHHR2ORFL5BSD56G4DQXL4VW",
                  flags: 0,
                  home_domain: "lobstr.co",
                  thresholds: "01000000",
                  signers: [],
                  ext: {
                    v1: {
                      liabilities: {
                        buying: 0,
                        selling: 0,
                      },
                      ext: {
                        v2: {
                          num_sponsored: 0,
                          num_sponsoring: 0,
                          signer_sponsoring_i_ds: [],
                          ext: {
                            v3: {
                              ext: "v0",
                              seq_ledger: 57673472,
                              seq_time: 1750646070,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              ext: "v0",
            },
          },
          {
            updated: {
              last_modified_ledger_seq: 57715298,
              data: {
                account: {
                  account_id:
                    "GA2Q3TSCKD6GBT5SL4XLAPT4TUXJ5GP7HLIM4OHBWT33GFD2UC7SRNEZ",
                  balance: 970527269,
                  seq_num: 245643245676134560,
                  num_sub_entries: 15,
                  inflation_dest:
                    "GDCHDRSDOBRMSUDKRE2C4U4KDLNEATJPIHHR2ORFL5BSD56G4DQXL4VW",
                  flags: 0,
                  home_domain: "lobstr.co",
                  thresholds: "01000000",
                  signers: [],
                  ext: {
                    v1: {
                      liabilities: {
                        buying: 0,
                        selling: 0,
                      },
                      ext: {
                        v2: {
                          num_sponsored: 0,
                          num_sponsoring: 0,
                          signer_sponsoring_i_ds: [],
                          ext: {
                            v3: {
                              ext: "v0",
                              seq_ledger: 57715298,
                              seq_time: 1750884323,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              ext: "v0",
            },
          },
        ],
        operations: [
          {
            changes: [
              {
                created: {
                  last_modified_ledger_seq: 57715298,
                  data: {
                    ttl: {
                      key_hash:
                        "6242f9804314979bbab82b57eaa12d2a35fca335edef47f8383008a775d5244f",
                      live_until_ledger_seq: 59788897,
                    },
                  },
                  ext: "v0",
                },
              },
              {
                created: {
                  last_modified_ledger_seq: 57715298,
                  data: {
                    contract_data: {
                      ext: "v0",
                      contract:
                        "CATRNPHYKNXAPNLHEYH55REB6YSAJLGCPA4YM6L3WUKSZOPI77M2UMKI",
                      key: {
                        vec: [
                          {
                            symbol: "Record",
                          },
                          {
                            bytes:
                              "3e24177e1563b9414c3ee108f2a92f44bbadf1ef5e35c900bed94d74445268ac",
                          },
                        ],
                      },
                      durability: "persistent",
                      val: {
                        vec: [
                          {
                            symbol: "Domain",
                          },
                          {
                            map: [
                              {
                                key: {
                                  symbol: "address",
                                },
                                val: {
                                  address:
                                    "GA2Q3TSCKD6GBT5SL4XLAPT4TUXJ5GP7HLIM4OHBWT33GFD2UC7SRNEZ",
                                },
                              },
                              {
                                key: {
                                  symbol: "collateral",
                                },
                                val: {
                                  u128: {
                                    hi: 0,
                                    lo: 823315979,
                                  },
                                },
                              },
                              {
                                key: {
                                  symbol: "exp_date",
                                },
                                val: {
                                  u64: 1782420323,
                                },
                              },
                              {
                                key: {
                                  symbol: "node",
                                },
                                val: {
                                  bytes:
                                    "3e24177e1563b9414c3ee108f2a92f44bbadf1ef5e35c900bed94d74445268ac",
                                },
                              },
                              {
                                key: {
                                  symbol: "owner",
                                },
                                val: {
                                  address:
                                    "GA2Q3TSCKD6GBT5SL4XLAPT4TUXJ5GP7HLIM4OHBWT33GFD2UC7SRNEZ",
                                },
                              },
                              {
                                key: {
                                  symbol: "snapshot",
                                },
                                val: {
                                  u64: 1750884323,
                                },
                              },
                            ],
                          },
                        ],
                      },
                    },
                  },
                  ext: "v0",
                },
              },
              {
                state: {
                  last_modified_ledger_seq: 57684111,
                  data: {
                    ttl: {
                      key_hash:
                        "2a99daca3b3a386d0dfde14eae38327c3c34a00e0f97e5ac016831d45a841726",
                      live_until_ledger_seq: 58202511,
                    },
                  },
                  ext: "v0",
                },
              },
              {
                updated: {
                  last_modified_ledger_seq: 57715298,
                  data: {
                    ttl: {
                      key_hash:
                        "2a99daca3b3a386d0dfde14eae38327c3c34a00e0f97e5ac016831d45a841726",
                      live_until_ledger_seq: 58233698,
                    },
                  },
                  ext: "v0",
                },
              },
              {
                state: {
                  last_modified_ledger_seq: 57693979,
                  data: {
                    contract_data: {
                      ext: "v0",
                      contract:
                        "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                      key: {
                        vec: [
                          {
                            symbol: "Balance",
                          },
                          {
                            address:
                              "CATRNPHYKNXAPNLHEYH55REB6YSAJLGCPA4YM6L3WUKSZOPI77M2UMKI",
                          },
                        ],
                      },
                      durability: "persistent",
                      val: {
                        map: [
                          {
                            key: {
                              symbol: "amount",
                            },
                            val: {
                              i128: {
                                hi: 0,
                                lo: 7414922489773,
                              },
                            },
                          },
                          {
                            key: {
                              symbol: "authorized",
                            },
                            val: {
                              bool: true,
                            },
                          },
                          {
                            key: {
                              symbol: "clawback",
                            },
                            val: {
                              bool: false,
                            },
                          },
                        ],
                      },
                    },
                  },
                  ext: "v0",
                },
              },
              {
                updated: {
                  last_modified_ledger_seq: 57715298,
                  data: {
                    contract_data: {
                      ext: "v0",
                      contract:
                        "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                      key: {
                        vec: [
                          {
                            symbol: "Balance",
                          },
                          {
                            address:
                              "CATRNPHYKNXAPNLHEYH55REB6YSAJLGCPA4YM6L3WUKSZOPI77M2UMKI",
                          },
                        ],
                      },
                      durability: "persistent",
                      val: {
                        map: [
                          {
                            key: {
                              symbol: "amount",
                            },
                            val: {
                              i128: {
                                hi: 0,
                                lo: 7415745805752,
                              },
                            },
                          },
                          {
                            key: {
                              symbol: "authorized",
                            },
                            val: {
                              bool: true,
                            },
                          },
                          {
                            key: {
                              symbol: "clawback",
                            },
                            val: {
                              bool: false,
                            },
                          },
                        ],
                      },
                    },
                  },
                  ext: "v0",
                },
              },
              {
                state: {
                  last_modified_ledger_seq: 57715298,
                  data: {
                    account: {
                      account_id:
                        "GA2Q3TSCKD6GBT5SL4XLAPT4TUXJ5GP7HLIM4OHBWT33GFD2UC7SRNEZ",
                      balance: 970527269,
                      seq_num: 245643245676134560,
                      num_sub_entries: 15,
                      inflation_dest:
                        "GDCHDRSDOBRMSUDKRE2C4U4KDLNEATJPIHHR2ORFL5BSD56G4DQXL4VW",
                      flags: 0,
                      home_domain: "lobstr.co",
                      thresholds: "01000000",
                      signers: [],
                      ext: {
                        v1: {
                          liabilities: {
                            buying: 0,
                            selling: 0,
                          },
                          ext: {
                            v2: {
                              num_sponsored: 0,
                              num_sponsoring: 0,
                              signer_sponsoring_i_ds: [],
                              ext: {
                                v3: {
                                  ext: "v0",
                                  seq_ledger: 57715298,
                                  seq_time: 1750884323,
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                  ext: "v0",
                },
              },
              {
                updated: {
                  last_modified_ledger_seq: 57715298,
                  data: {
                    account: {
                      account_id:
                        "GA2Q3TSCKD6GBT5SL4XLAPT4TUXJ5GP7HLIM4OHBWT33GFD2UC7SRNEZ",
                      balance: 147211290,
                      seq_num: 245643245676134560,
                      num_sub_entries: 15,
                      inflation_dest:
                        "GDCHDRSDOBRMSUDKRE2C4U4KDLNEATJPIHHR2ORFL5BSD56G4DQXL4VW",
                      flags: 0,
                      home_domain: "lobstr.co",
                      thresholds: "01000000",
                      signers: [],
                      ext: {
                        v1: {
                          liabilities: {
                            buying: 0,
                            selling: 0,
                          },
                          ext: {
                            v2: {
                              num_sponsored: 0,
                              num_sponsoring: 0,
                              signer_sponsoring_i_ds: [],
                              ext: {
                                v3: {
                                  ext: "v0",
                                  seq_ledger: 57715298,
                                  seq_time: 1750884323,
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                  ext: "v0",
                },
              },
            ],
          },
        ],
        tx_changes_after: [
          {
            state: {
              last_modified_ledger_seq: 57715298,
              data: {
                account: {
                  account_id:
                    "GA2Q3TSCKD6GBT5SL4XLAPT4TUXJ5GP7HLIM4OHBWT33GFD2UC7SRNEZ",
                  balance: 147211290,
                  seq_num: 245643245676134560,
                  num_sub_entries: 15,
                  inflation_dest:
                    "GDCHDRSDOBRMSUDKRE2C4U4KDLNEATJPIHHR2ORFL5BSD56G4DQXL4VW",
                  flags: 0,
                  home_domain: "lobstr.co",
                  thresholds: "01000000",
                  signers: [],
                  ext: {
                    v1: {
                      liabilities: {
                        buying: 0,
                        selling: 0,
                      },
                      ext: {
                        v2: {
                          num_sponsored: 0,
                          num_sponsoring: 0,
                          signer_sponsoring_i_ds: [],
                          ext: {
                            v3: {
                              ext: "v0",
                              seq_ledger: 57715298,
                              seq_time: 1750884323,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              ext: "v0",
            },
          },
          {
            updated: {
              last_modified_ledger_seq: 57715298,
              data: {
                account: {
                  account_id:
                    "GA2Q3TSCKD6GBT5SL4XLAPT4TUXJ5GP7HLIM4OHBWT33GFD2UC7SRNEZ",
                  balance: 147946950,
                  seq_num: 245643245676134560,
                  num_sub_entries: 15,
                  inflation_dest:
                    "GDCHDRSDOBRMSUDKRE2C4U4KDLNEATJPIHHR2ORFL5BSD56G4DQXL4VW",
                  flags: 0,
                  home_domain: "lobstr.co",
                  thresholds: "01000000",
                  signers: [],
                  ext: {
                    v1: {
                      liabilities: {
                        buying: 0,
                        selling: 0,
                      },
                      ext: {
                        v2: {
                          num_sponsored: 0,
                          num_sponsoring: 0,
                          signer_sponsoring_i_ds: [],
                          ext: {
                            v3: {
                              ext: "v0",
                              seq_ledger: 57715298,
                              seq_time: 1750884323,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              ext: "v0",
            },
          },
        ],
        soroban_meta: {
          ext: {
            v1: {
              ext: "v0",
              total_non_refundable_resource_fee_charged: 239778,
              total_refundable_resource_fee_charged: 4523641,
              rent_fee_charged: 4521766,
            },
          },
          events: [
            {
              ext: "v0",
              contract_id:
                "25b4fcd859aec2fa6348438c489b3c3c10c98b6d21be4fd3cb30cb68953ef977",
              type_: "contract",
              body: {
                v0: {
                  topics: [
                    {
                      symbol: "transfer",
                    },
                    {
                      address:
                        "GA2Q3TSCKD6GBT5SL4XLAPT4TUXJ5GP7HLIM4OHBWT33GFD2UC7SRNEZ",
                    },
                    {
                      address:
                        "CATRNPHYKNXAPNLHEYH55REB6YSAJLGCPA4YM6L3WUKSZOPI77M2UMKI",
                    },
                    {
                      string: "native",
                    },
                  ],
                  data: {
                    i128: {
                      hi: 0,
                      lo: 823315979,
                    },
                  },
                },
              },
            },
          ],
          return_value: "void",
          diagnostic_events: [
            {
              in_successful_contract_call: true,
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
                          "2716bcf8536e07b567260fdec481f62404acc2783986797bb5152cb9e8ffd9aa",
                      },
                      {
                        symbol: "set_record",
                      },
                    ],
                    data: {
                      vec: [
                        {
                          bytes: "63726f62756c6c",
                        },
                        {
                          bytes: "786c6d",
                        },
                        {
                          address:
                            "GA2Q3TSCKD6GBT5SL4XLAPT4TUXJ5GP7HLIM4OHBWT33GFD2UC7SRNEZ",
                        },
                        {
                          address:
                            "GA2Q3TSCKD6GBT5SL4XLAPT4TUXJ5GP7HLIM4OHBWT33GFD2UC7SRNEZ",
                        },
                        {
                          u64: 31536000,
                        },
                      ],
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "2716bcf8536e07b567260fdec481f62404acc2783986797bb5152cb9e8ffd9aa",
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "fn_call",
                      },
                      {
                        bytes:
                          "0a9cc2d220fd805b34d9ad19b84d7bc460b77a5fe15e6ef7eaf2b2cd5e4adbbe",
                      },
                      {
                        symbol: "decimals",
                      },
                    ],
                    data: "void",
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "0a9cc2d220fd805b34d9ad19b84d7bc460b77a5fe15e6ef7eaf2b2cd5e4adbbe",
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "fn_return",
                      },
                      {
                        symbol: "decimals",
                      },
                    ],
                    data: {
                      u32: 14,
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "2716bcf8536e07b567260fdec481f62404acc2783986797bb5152cb9e8ffd9aa",
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "fn_call",
                      },
                      {
                        bytes:
                          "0a9cc2d220fd805b34d9ad19b84d7bc460b77a5fe15e6ef7eaf2b2cd5e4adbbe",
                      },
                      {
                        symbol: "lastprice",
                      },
                    ],
                    data: {
                      vec: [
                        {
                          symbol: "Other",
                        },
                        {
                          symbol: "XLM",
                        },
                      ],
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "0a9cc2d220fd805b34d9ad19b84d7bc460b77a5fe15e6ef7eaf2b2cd5e4adbbe",
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "fn_return",
                      },
                      {
                        symbol: "lastprice",
                      },
                    ],
                    data: {
                      map: [
                        {
                          key: {
                            symbol: "price",
                          },
                          val: {
                            i128: {
                              hi: 0,
                              lo: 24292013603121,
                            },
                          },
                        },
                        {
                          key: {
                            symbol: "timestamp",
                          },
                          val: {
                            u64: 1750884000,
                          },
                        },
                      ],
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "2716bcf8536e07b567260fdec481f62404acc2783986797bb5152cb9e8ffd9aa",
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "fn_call",
                      },
                      {
                        bytes:
                          "25b4fcd859aec2fa6348438c489b3c3c10c98b6d21be4fd3cb30cb68953ef977",
                      },
                      {
                        symbol: "transfer",
                      },
                    ],
                    data: {
                      vec: [
                        {
                          address:
                            "GA2Q3TSCKD6GBT5SL4XLAPT4TUXJ5GP7HLIM4OHBWT33GFD2UC7SRNEZ",
                        },
                        {
                          address:
                            "CATRNPHYKNXAPNLHEYH55REB6YSAJLGCPA4YM6L3WUKSZOPI77M2UMKI",
                        },
                        {
                          i128: {
                            hi: 0,
                            lo: 823315979,
                          },
                        },
                      ],
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "25b4fcd859aec2fa6348438c489b3c3c10c98b6d21be4fd3cb30cb68953ef977",
                type_: "contract",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "transfer",
                      },
                      {
                        address:
                          "GA2Q3TSCKD6GBT5SL4XLAPT4TUXJ5GP7HLIM4OHBWT33GFD2UC7SRNEZ",
                      },
                      {
                        address:
                          "CATRNPHYKNXAPNLHEYH55REB6YSAJLGCPA4YM6L3WUKSZOPI77M2UMKI",
                      },
                      {
                        string: "native",
                      },
                    ],
                    data: {
                      i128: {
                        hi: 0,
                        lo: 823315979,
                      },
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "25b4fcd859aec2fa6348438c489b3c3c10c98b6d21be4fd3cb30cb68953ef977",
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "fn_return",
                      },
                      {
                        symbol: "transfer",
                      },
                    ],
                    data: "void",
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "2716bcf8536e07b567260fdec481f62404acc2783986797bb5152cb9e8ffd9aa",
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "fn_return",
                      },
                      {
                        symbol: "set_record",
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
                contract_id: null,
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "read_entry",
                      },
                    ],
                    data: {
                      u64: 9,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "write_entry",
                      },
                    ],
                    data: {
                      u64: 3,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "ledger_read_byte",
                      },
                    ],
                    data: {
                      u64: 45628,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "ledger_write_byte",
                      },
                    ],
                    data: {
                      u64: 848,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "read_key_byte",
                      },
                    ],
                    data: {
                      u64: 544,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "write_key_byte",
                      },
                    ],
                    data: {
                      u64: 0,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "read_data_byte",
                      },
                    ],
                    data: {
                      u64: 2684,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "write_data_byte",
                      },
                    ],
                    data: {
                      u64: 848,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "read_code_byte",
                      },
                    ],
                    data: {
                      u64: 42944,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "write_code_byte",
                      },
                    ],
                    data: {
                      u64: 0,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "emit_event",
                      },
                    ],
                    data: {
                      u64: 1,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "emit_event_byte",
                      },
                    ],
                    data: {
                      u64: 188,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "cpu_insn",
                      },
                    ],
                    data: {
                      u64: 14354361,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "mem_byte",
                      },
                    ],
                    data: {
                      u64: 6048440,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "invoke_time_nsecs",
                      },
                    ],
                    data: {
                      u64: 774639,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "max_rw_key_byte",
                      },
                    ],
                    data: {
                      u64: 112,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "max_rw_data_byte",
                      },
                    ],
                    data: {
                      u64: 1340,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "max_rw_code_byte",
                      },
                    ],
                    data: {
                      u64: 22628,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "max_emit_event_byte",
                      },
                    ],
                    data: {
                      u64: 188,
                    },
                  },
                },
              },
            },
          ],
        },
      },
    },
    diagnosticEventsJson: [
      {
        in_successful_contract_call: true,
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
                    "2716bcf8536e07b567260fdec481f62404acc2783986797bb5152cb9e8ffd9aa",
                },
                {
                  symbol: "set_record",
                },
              ],
              data: {
                vec: [
                  {
                    bytes: "63726f62756c6c",
                  },
                  {
                    bytes: "786c6d",
                  },
                  {
                    address:
                      "GA2Q3TSCKD6GBT5SL4XLAPT4TUXJ5GP7HLIM4OHBWT33GFD2UC7SRNEZ",
                  },
                  {
                    address:
                      "GA2Q3TSCKD6GBT5SL4XLAPT4TUXJ5GP7HLIM4OHBWT33GFD2UC7SRNEZ",
                  },
                  {
                    u64: 31536000,
                  },
                ],
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "2716bcf8536e07b567260fdec481f62404acc2783986797bb5152cb9e8ffd9aa",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_call",
                },
                {
                  bytes:
                    "0a9cc2d220fd805b34d9ad19b84d7bc460b77a5fe15e6ef7eaf2b2cd5e4adbbe",
                },
                {
                  symbol: "decimals",
                },
              ],
              data: "void",
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "0a9cc2d220fd805b34d9ad19b84d7bc460b77a5fe15e6ef7eaf2b2cd5e4adbbe",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_return",
                },
                {
                  symbol: "decimals",
                },
              ],
              data: {
                u32: 14,
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "2716bcf8536e07b567260fdec481f62404acc2783986797bb5152cb9e8ffd9aa",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_call",
                },
                {
                  bytes:
                    "0a9cc2d220fd805b34d9ad19b84d7bc460b77a5fe15e6ef7eaf2b2cd5e4adbbe",
                },
                {
                  symbol: "lastprice",
                },
              ],
              data: {
                vec: [
                  {
                    symbol: "Other",
                  },
                  {
                    symbol: "XLM",
                  },
                ],
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "0a9cc2d220fd805b34d9ad19b84d7bc460b77a5fe15e6ef7eaf2b2cd5e4adbbe",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_return",
                },
                {
                  symbol: "lastprice",
                },
              ],
              data: {
                map: [
                  {
                    key: {
                      symbol: "price",
                    },
                    val: {
                      i128: {
                        hi: 0,
                        lo: 24292013603121,
                      },
                    },
                  },
                  {
                    key: {
                      symbol: "timestamp",
                    },
                    val: {
                      u64: 1750884000,
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "2716bcf8536e07b567260fdec481f62404acc2783986797bb5152cb9e8ffd9aa",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_call",
                },
                {
                  bytes:
                    "25b4fcd859aec2fa6348438c489b3c3c10c98b6d21be4fd3cb30cb68953ef977",
                },
                {
                  symbol: "transfer",
                },
              ],
              data: {
                vec: [
                  {
                    address:
                      "GA2Q3TSCKD6GBT5SL4XLAPT4TUXJ5GP7HLIM4OHBWT33GFD2UC7SRNEZ",
                  },
                  {
                    address:
                      "CATRNPHYKNXAPNLHEYH55REB6YSAJLGCPA4YM6L3WUKSZOPI77M2UMKI",
                  },
                  {
                    i128: {
                      hi: 0,
                      lo: 823315979,
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "25b4fcd859aec2fa6348438c489b3c3c10c98b6d21be4fd3cb30cb68953ef977",
          type_: "contract",
          body: {
            v0: {
              topics: [
                {
                  symbol: "transfer",
                },
                {
                  address:
                    "GA2Q3TSCKD6GBT5SL4XLAPT4TUXJ5GP7HLIM4OHBWT33GFD2UC7SRNEZ",
                },
                {
                  address:
                    "CATRNPHYKNXAPNLHEYH55REB6YSAJLGCPA4YM6L3WUKSZOPI77M2UMKI",
                },
                {
                  string: "native",
                },
              ],
              data: {
                i128: {
                  hi: 0,
                  lo: 823315979,
                },
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "25b4fcd859aec2fa6348438c489b3c3c10c98b6d21be4fd3cb30cb68953ef977",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_return",
                },
                {
                  symbol: "transfer",
                },
              ],
              data: "void",
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "2716bcf8536e07b567260fdec481f62404acc2783986797bb5152cb9e8ffd9aa",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_return",
                },
                {
                  symbol: "set_record",
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
          contract_id: null,
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "core_metrics",
                },
                {
                  symbol: "read_entry",
                },
              ],
              data: {
                u64: 9,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "write_entry",
                },
              ],
              data: {
                u64: 3,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "ledger_read_byte",
                },
              ],
              data: {
                u64: 45628,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "ledger_write_byte",
                },
              ],
              data: {
                u64: 848,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "read_key_byte",
                },
              ],
              data: {
                u64: 544,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "write_key_byte",
                },
              ],
              data: {
                u64: 0,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "read_data_byte",
                },
              ],
              data: {
                u64: 2684,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "write_data_byte",
                },
              ],
              data: {
                u64: 848,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "read_code_byte",
                },
              ],
              data: {
                u64: 42944,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "write_code_byte",
                },
              ],
              data: {
                u64: 0,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "emit_event",
                },
              ],
              data: {
                u64: 1,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "emit_event_byte",
                },
              ],
              data: {
                u64: 188,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "cpu_insn",
                },
              ],
              data: {
                u64: 14354361,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "mem_byte",
                },
              ],
              data: {
                u64: 6048440,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "invoke_time_nsecs",
                },
              ],
              data: {
                u64: 774639,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "max_rw_key_byte",
                },
              ],
              data: {
                u64: 112,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "max_rw_data_byte",
                },
              ],
              data: {
                u64: 1340,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "max_rw_code_byte",
                },
              ],
              data: {
                u64: 22628,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "max_emit_event_byte",
                },
              ],
              data: {
                u64: 188,
              },
            },
          },
        },
      },
    ],
    ledger: 57715298,
    createdAt: "1750884323",
  },
};
export const TX_ST_CHANGE_DOMAIN_BURN = {
  jsonrpc: "2.0",
  id: 1,
  result: {
    latestLedger: 57909242,
    latestLedgerCloseTime: "1751983490",
    oldestLedger: 57788283,
    oldestLedgerCloseTime: "1751297368",
    status: "SUCCESS",
    txHash: "cd216e1d2cf2a44b21eb551c732ace6f1e6babae268a90d42ef9fb2049d81f19",
    applicationOrder: 113,
    feeBump: false,
    envelopeJson: {
      tx: {
        tx: {
          source_account:
            "GA2Q3TSCKD6GBT5SL4XLAPT4TUXJ5GP7HLIM4OHBWT33GFD2UC7SRNEZ",
          fee: 10455919,
          seq_num: 245643245676134560,
          cond: {
            time: {
              min_time: 0,
              max_time: 1751946542,
            },
          },
          memo: "none",
          operations: [
            {
              source_account: null,
              body: {
                invoke_host_function: {
                  host_function: {
                    invoke_contract: {
                      contract_address:
                        "CATRNPHYKNXAPNLHEYH55REB6YSAJLGCPA4YM6L3WUKSZOPI77M2UMKI",
                      function_name: "burn_record",
                      args: [
                        {
                          vec: [
                            {
                              symbol: "Record",
                            },
                            {
                              bytes:
                                "9623e5bc5408adf11555c91ce7da865c78439638c8fd4bcbc38f7d3110d3ca37",
                            },
                          ],
                        },
                      ],
                    },
                  },
                  auth: [
                    {
                      credentials: "source_account",
                      root_invocation: {
                        function: {
                          contract_fn: {
                            contract_address:
                              "CATRNPHYKNXAPNLHEYH55REB6YSAJLGCPA4YM6L3WUKSZOPI77M2UMKI",
                            function_name: "burn_record",
                            args: [
                              {
                                vec: [
                                  {
                                    symbol: "Record",
                                  },
                                  {
                                    bytes:
                                      "9623e5bc5408adf11555c91ce7da865c78439638c8fd4bcbc38f7d3110d3ca37",
                                  },
                                ],
                              },
                            ],
                          },
                        },
                        sub_invocations: [],
                      },
                    },
                  ],
                },
              },
            },
          ],
          ext: {
            v1: {
              ext: "v0",
              resources: {
                footprint: {
                  read_only: [
                    {
                      contract_data: {
                        contract:
                          "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                        key: "ledger_key_contract_instance",
                        durability: "persistent",
                      },
                    },
                    {
                      contract_data: {
                        contract:
                          "CATRNPHYKNXAPNLHEYH55REB6YSAJLGCPA4YM6L3WUKSZOPI77M2UMKI",
                        key: "ledger_key_contract_instance",
                        durability: "persistent",
                      },
                    },
                    {
                      contract_code: {
                        hash: "445fc62539a1046baa501784d3e8fedd81e30d0671196bdc24dbf85124e4de22",
                      },
                    },
                  ],
                  read_write: [
                    {
                      account: {
                        account_id:
                          "GA2Q3TSCKD6GBT5SL4XLAPT4TUXJ5GP7HLIM4OHBWT33GFD2UC7SRNEZ",
                      },
                    },
                    {
                      contract_data: {
                        contract:
                          "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                        key: {
                          vec: [
                            {
                              symbol: "Balance",
                            },
                            {
                              address:
                                "CATRNPHYKNXAPNLHEYH55REB6YSAJLGCPA4YM6L3WUKSZOPI77M2UMKI",
                            },
                          ],
                        },
                        durability: "persistent",
                      },
                    },
                    {
                      contract_data: {
                        contract:
                          "CATRNPHYKNXAPNLHEYH55REB6YSAJLGCPA4YM6L3WUKSZOPI77M2UMKI",
                        key: {
                          vec: [
                            {
                              symbol: "Record",
                            },
                            {
                              bytes:
                                "9623e5bc5408adf11555c91ce7da865c78439638c8fd4bcbc38f7d3110d3ca37",
                            },
                          ],
                        },
                        durability: "persistent",
                      },
                    },
                  ],
                },
                instructions: 4212973,
                read_bytes: 21996,
                write_bytes: 416,
              },
              resource_fee: 455919,
            },
          },
        },
        signatures: [
          {
            hint: "7aa0bf28",
            signature:
              "d7c0098132f1e6da823d0dff08fdf1b19e5ccc199faa51c9ccfbbca758bf8cce4ed70d18595e9f0b8d5412cd3c9996520839728534d30d04e7fda50b605f760f",
          },
        ],
      },
    },
    resultJson: {
      fee_charged: 365234,
      result: {
        tx_success: [
          {
            op_inner: {
              invoke_host_function: {
                success:
                  "1181478ecbb8a47035d8676a00f9e2535e43aab6b467a62040b4d6ebe3c677cf",
              },
            },
          },
        ],
      },
      ext: "v0",
    },
    resultMetaJson: {
      v3: {
        ext: "v0",
        tx_changes_before: [
          {
            state: {
              last_modified_ledger_seq: 57902734,
              data: {
                account: {
                  account_id:
                    "GA2Q3TSCKD6GBT5SL4XLAPT4TUXJ5GP7HLIM4OHBWT33GFD2UC7SRNEZ",
                  balance: 223962381,
                  seq_num: 245643245676134560,
                  num_sub_entries: 14,
                  inflation_dest:
                    "GDCHDRSDOBRMSUDKRE2C4U4KDLNEATJPIHHR2ORFL5BSD56G4DQXL4VW",
                  flags: 0,
                  home_domain: "lobstr.co",
                  thresholds: "01000000",
                  signers: [],
                  ext: {
                    v1: {
                      liabilities: {
                        buying: 0,
                        selling: 0,
                      },
                      ext: {
                        v2: {
                          num_sponsored: 0,
                          num_sponsoring: 0,
                          signer_sponsoring_i_ds: [],
                          ext: {
                            v3: {
                              ext: "v0",
                              seq_ledger: 57902550,
                              seq_time: 1751945474,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              ext: "v0",
            },
          },
          {
            updated: {
              last_modified_ledger_seq: 57902734,
              data: {
                account: {
                  account_id:
                    "GA2Q3TSCKD6GBT5SL4XLAPT4TUXJ5GP7HLIM4OHBWT33GFD2UC7SRNEZ",
                  balance: 223962381,
                  seq_num: 245643245676134560,
                  num_sub_entries: 14,
                  inflation_dest:
                    "GDCHDRSDOBRMSUDKRE2C4U4KDLNEATJPIHHR2ORFL5BSD56G4DQXL4VW",
                  flags: 0,
                  home_domain: "lobstr.co",
                  thresholds: "01000000",
                  signers: [],
                  ext: {
                    v1: {
                      liabilities: {
                        buying: 0,
                        selling: 0,
                      },
                      ext: {
                        v2: {
                          num_sponsored: 0,
                          num_sponsoring: 0,
                          signer_sponsoring_i_ds: [],
                          ext: {
                            v3: {
                              ext: "v0",
                              seq_ledger: 57902734,
                              seq_time: 1751946516,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              ext: "v0",
            },
          },
        ],
        operations: [
          {
            changes: [
              {
                state: {
                  last_modified_ledger_seq: 57220356,
                  data: {
                    contract_data: {
                      ext: "v0",
                      contract:
                        "CATRNPHYKNXAPNLHEYH55REB6YSAJLGCPA4YM6L3WUKSZOPI77M2UMKI",
                      key: {
                        vec: [
                          {
                            symbol: "Record",
                          },
                          {
                            bytes:
                              "9623e5bc5408adf11555c91ce7da865c78439638c8fd4bcbc38f7d3110d3ca37",
                          },
                        ],
                      },
                      durability: "persistent",
                      val: {
                        vec: [
                          {
                            symbol: "Domain",
                          },
                          {
                            map: [
                              {
                                key: {
                                  symbol: "address",
                                },
                                val: {
                                  address:
                                    "GA2Q3TSCKD6GBT5SL4XLAPT4TUXJ5GP7HLIM4OHBWT33GFD2UC7SRNEZ",
                                },
                              },
                              {
                                key: {
                                  symbol: "collateral",
                                },
                                val: {
                                  u128: {
                                    hi: 0,
                                    lo: 689297688,
                                  },
                                },
                              },
                              {
                                key: {
                                  symbol: "exp_date",
                                },
                                val: {
                                  u64: 1779624173,
                                },
                              },
                              {
                                key: {
                                  symbol: "node",
                                },
                                val: {
                                  bytes:
                                    "9623e5bc5408adf11555c91ce7da865c78439638c8fd4bcbc38f7d3110d3ca37",
                                },
                              },
                              {
                                key: {
                                  symbol: "owner",
                                },
                                val: {
                                  address:
                                    "GA2Q3TSCKD6GBT5SL4XLAPT4TUXJ5GP7HLIM4OHBWT33GFD2UC7SRNEZ",
                                },
                              },
                              {
                                key: {
                                  symbol: "snapshot",
                                },
                                val: {
                                  u64: 1748088173,
                                },
                              },
                            ],
                          },
                        ],
                      },
                    },
                  },
                  ext: "v0",
                },
              },
              {
                removed: {
                  contract_data: {
                    contract:
                      "CATRNPHYKNXAPNLHEYH55REB6YSAJLGCPA4YM6L3WUKSZOPI77M2UMKI",
                    key: {
                      vec: [
                        {
                          symbol: "Record",
                        },
                        {
                          bytes:
                            "9623e5bc5408adf11555c91ce7da865c78439638c8fd4bcbc38f7d3110d3ca37",
                        },
                      ],
                    },
                    durability: "persistent",
                  },
                },
              },
              {
                state: {
                  last_modified_ledger_seq: 57715298,
                  data: {
                    ttl: {
                      key_hash:
                        "2a99daca3b3a386d0dfde14eae38327c3c34a00e0f97e5ac016831d45a841726",
                      live_until_ledger_seq: 58233698,
                    },
                  },
                  ext: "v0",
                },
              },
              {
                updated: {
                  last_modified_ledger_seq: 57902734,
                  data: {
                    ttl: {
                      key_hash:
                        "2a99daca3b3a386d0dfde14eae38327c3c34a00e0f97e5ac016831d45a841726",
                      live_until_ledger_seq: 58421134,
                    },
                  },
                  ext: "v0",
                },
              },
              {
                state: {
                  last_modified_ledger_seq: 57220356,
                  data: {
                    ttl: {
                      key_hash:
                        "ef6ae2d807b64b6c28777645f0806b62e6b3f338e9f5c67ebce5749f125ad261",
                      live_until_ledger_seq: 59293955,
                    },
                  },
                  ext: "v0",
                },
              },
              {
                removed: {
                  ttl: {
                    key_hash:
                      "ef6ae2d807b64b6c28777645f0806b62e6b3f338e9f5c67ebce5749f125ad261",
                  },
                },
              },
              {
                state: {
                  last_modified_ledger_seq: 57715298,
                  data: {
                    contract_data: {
                      ext: "v0",
                      contract:
                        "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                      key: {
                        vec: [
                          {
                            symbol: "Balance",
                          },
                          {
                            address:
                              "CATRNPHYKNXAPNLHEYH55REB6YSAJLGCPA4YM6L3WUKSZOPI77M2UMKI",
                          },
                        ],
                      },
                      durability: "persistent",
                      val: {
                        map: [
                          {
                            key: {
                              symbol: "amount",
                            },
                            val: {
                              i128: {
                                hi: 0,
                                lo: 7415745805752,
                              },
                            },
                          },
                          {
                            key: {
                              symbol: "authorized",
                            },
                            val: {
                              bool: true,
                            },
                          },
                          {
                            key: {
                              symbol: "clawback",
                            },
                            val: {
                              bool: false,
                            },
                          },
                        ],
                      },
                    },
                  },
                  ext: "v0",
                },
              },
              {
                updated: {
                  last_modified_ledger_seq: 57902734,
                  data: {
                    contract_data: {
                      ext: "v0",
                      contract:
                        "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                      key: {
                        vec: [
                          {
                            symbol: "Balance",
                          },
                          {
                            address:
                              "CATRNPHYKNXAPNLHEYH55REB6YSAJLGCPA4YM6L3WUKSZOPI77M2UMKI",
                          },
                        ],
                      },
                      durability: "persistent",
                      val: {
                        map: [
                          {
                            key: {
                              symbol: "amount",
                            },
                            val: {
                              i128: {
                                hi: 0,
                                lo: 7415056508064,
                              },
                            },
                          },
                          {
                            key: {
                              symbol: "authorized",
                            },
                            val: {
                              bool: true,
                            },
                          },
                          {
                            key: {
                              symbol: "clawback",
                            },
                            val: {
                              bool: false,
                            },
                          },
                        ],
                      },
                    },
                  },
                  ext: "v0",
                },
              },
              {
                state: {
                  last_modified_ledger_seq: 57902734,
                  data: {
                    account: {
                      account_id:
                        "GA2Q3TSCKD6GBT5SL4XLAPT4TUXJ5GP7HLIM4OHBWT33GFD2UC7SRNEZ",
                      balance: 223962381,
                      seq_num: 245643245676134560,
                      num_sub_entries: 14,
                      inflation_dest:
                        "GDCHDRSDOBRMSUDKRE2C4U4KDLNEATJPIHHR2ORFL5BSD56G4DQXL4VW",
                      flags: 0,
                      home_domain: "lobstr.co",
                      thresholds: "01000000",
                      signers: [],
                      ext: {
                        v1: {
                          liabilities: {
                            buying: 0,
                            selling: 0,
                          },
                          ext: {
                            v2: {
                              num_sponsored: 0,
                              num_sponsoring: 0,
                              signer_sponsoring_i_ds: [],
                              ext: {
                                v3: {
                                  ext: "v0",
                                  seq_ledger: 57902734,
                                  seq_time: 1751946516,
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                  ext: "v0",
                },
              },
              {
                updated: {
                  last_modified_ledger_seq: 57902734,
                  data: {
                    account: {
                      account_id:
                        "GA2Q3TSCKD6GBT5SL4XLAPT4TUXJ5GP7HLIM4OHBWT33GFD2UC7SRNEZ",
                      balance: 913260069,
                      seq_num: 245643245676134560,
                      num_sub_entries: 14,
                      inflation_dest:
                        "GDCHDRSDOBRMSUDKRE2C4U4KDLNEATJPIHHR2ORFL5BSD56G4DQXL4VW",
                      flags: 0,
                      home_domain: "lobstr.co",
                      thresholds: "01000000",
                      signers: [],
                      ext: {
                        v1: {
                          liabilities: {
                            buying: 0,
                            selling: 0,
                          },
                          ext: {
                            v2: {
                              num_sponsored: 0,
                              num_sponsoring: 0,
                              signer_sponsoring_i_ds: [],
                              ext: {
                                v3: {
                                  ext: "v0",
                                  seq_ledger: 57902734,
                                  seq_time: 1751946516,
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                  ext: "v0",
                },
              },
            ],
          },
        ],
        tx_changes_after: [
          {
            state: {
              last_modified_ledger_seq: 57902734,
              data: {
                account: {
                  account_id:
                    "GA2Q3TSCKD6GBT5SL4XLAPT4TUXJ5GP7HLIM4OHBWT33GFD2UC7SRNEZ",
                  balance: 913260069,
                  seq_num: 245643245676134560,
                  num_sub_entries: 14,
                  inflation_dest:
                    "GDCHDRSDOBRMSUDKRE2C4U4KDLNEATJPIHHR2ORFL5BSD56G4DQXL4VW",
                  flags: 0,
                  home_domain: "lobstr.co",
                  thresholds: "01000000",
                  signers: [],
                  ext: {
                    v1: {
                      liabilities: {
                        buying: 0,
                        selling: 0,
                      },
                      ext: {
                        v2: {
                          num_sponsored: 0,
                          num_sponsoring: 0,
                          signer_sponsoring_i_ds: [],
                          ext: {
                            v3: {
                              ext: "v0",
                              seq_ledger: 57902734,
                              seq_time: 1751946516,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              ext: "v0",
            },
          },
          {
            updated: {
              last_modified_ledger_seq: 57902734,
              data: {
                account: {
                  account_id:
                    "GA2Q3TSCKD6GBT5SL4XLAPT4TUXJ5GP7HLIM4OHBWT33GFD2UC7SRNEZ",
                  balance: 913350854,
                  seq_num: 245643245676134560,
                  num_sub_entries: 14,
                  inflation_dest:
                    "GDCHDRSDOBRMSUDKRE2C4U4KDLNEATJPIHHR2ORFL5BSD56G4DQXL4VW",
                  flags: 0,
                  home_domain: "lobstr.co",
                  thresholds: "01000000",
                  signers: [],
                  ext: {
                    v1: {
                      liabilities: {
                        buying: 0,
                        selling: 0,
                      },
                      ext: {
                        v2: {
                          num_sponsored: 0,
                          num_sponsoring: 0,
                          signer_sponsoring_i_ds: [],
                          ext: {
                            v3: {
                              ext: "v0",
                              seq_ledger: 57902734,
                              seq_time: 1751946516,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              ext: "v0",
            },
          },
        ],
        soroban_meta: {
          ext: {
            v1: {
              ext: "v0",
              total_non_refundable_resource_fee_charged: 140644,
              total_refundable_resource_fee_charged: 224490,
              rent_fee_charged: 222615,
            },
          },
          events: [
            {
              ext: "v0",
              contract_id:
                "25b4fcd859aec2fa6348438c489b3c3c10c98b6d21be4fd3cb30cb68953ef977",
              type_: "contract",
              body: {
                v0: {
                  topics: [
                    {
                      symbol: "transfer",
                    },
                    {
                      address:
                        "CATRNPHYKNXAPNLHEYH55REB6YSAJLGCPA4YM6L3WUKSZOPI77M2UMKI",
                    },
                    {
                      address:
                        "GA2Q3TSCKD6GBT5SL4XLAPT4TUXJ5GP7HLIM4OHBWT33GFD2UC7SRNEZ",
                    },
                    {
                      string: "native",
                    },
                  ],
                  data: {
                    i128: {
                      hi: 0,
                      lo: 689297688,
                    },
                  },
                },
              },
            },
          ],
          return_value: "void",
          diagnostic_events: [
            {
              in_successful_contract_call: true,
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
                          "2716bcf8536e07b567260fdec481f62404acc2783986797bb5152cb9e8ffd9aa",
                      },
                      {
                        symbol: "burn_record",
                      },
                    ],
                    data: {
                      vec: [
                        {
                          symbol: "Record",
                        },
                        {
                          bytes:
                            "9623e5bc5408adf11555c91ce7da865c78439638c8fd4bcbc38f7d3110d3ca37",
                        },
                      ],
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "2716bcf8536e07b567260fdec481f62404acc2783986797bb5152cb9e8ffd9aa",
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "fn_call",
                      },
                      {
                        bytes:
                          "25b4fcd859aec2fa6348438c489b3c3c10c98b6d21be4fd3cb30cb68953ef977",
                      },
                      {
                        symbol: "transfer",
                      },
                    ],
                    data: {
                      vec: [
                        {
                          address:
                            "CATRNPHYKNXAPNLHEYH55REB6YSAJLGCPA4YM6L3WUKSZOPI77M2UMKI",
                        },
                        {
                          address:
                            "GA2Q3TSCKD6GBT5SL4XLAPT4TUXJ5GP7HLIM4OHBWT33GFD2UC7SRNEZ",
                        },
                        {
                          i128: {
                            hi: 0,
                            lo: 689297688,
                          },
                        },
                      ],
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "25b4fcd859aec2fa6348438c489b3c3c10c98b6d21be4fd3cb30cb68953ef977",
                type_: "contract",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "transfer",
                      },
                      {
                        address:
                          "CATRNPHYKNXAPNLHEYH55REB6YSAJLGCPA4YM6L3WUKSZOPI77M2UMKI",
                      },
                      {
                        address:
                          "GA2Q3TSCKD6GBT5SL4XLAPT4TUXJ5GP7HLIM4OHBWT33GFD2UC7SRNEZ",
                      },
                      {
                        string: "native",
                      },
                    ],
                    data: {
                      i128: {
                        hi: 0,
                        lo: 689297688,
                      },
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "25b4fcd859aec2fa6348438c489b3c3c10c98b6d21be4fd3cb30cb68953ef977",
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "fn_return",
                      },
                      {
                        symbol: "transfer",
                      },
                    ],
                    data: "void",
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "2716bcf8536e07b567260fdec481f62404acc2783986797bb5152cb9e8ffd9aa",
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "fn_return",
                      },
                      {
                        symbol: "burn_record",
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
                contract_id: null,
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "read_entry",
                      },
                    ],
                    data: {
                      u64: 6,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "write_entry",
                      },
                    ],
                    data: {
                      u64: 2,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "ledger_read_byte",
                      },
                    ],
                    data: {
                      u64: 21996,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "ledger_write_byte",
                      },
                    ],
                    data: {
                      u64: 416,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "read_key_byte",
                      },
                    ],
                    data: {
                      u64: 396,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "write_key_byte",
                      },
                    ],
                    data: {
                      u64: 0,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "read_data_byte",
                      },
                    ],
                    data: {
                      u64: 1680,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "write_data_byte",
                      },
                    ],
                    data: {
                      u64: 416,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "read_code_byte",
                      },
                    ],
                    data: {
                      u64: 20316,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "write_code_byte",
                      },
                    ],
                    data: {
                      u64: 0,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "emit_event",
                      },
                    ],
                    data: {
                      u64: 1,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "emit_event_byte",
                      },
                    ],
                    data: {
                      u64: 188,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "cpu_insn",
                      },
                    ],
                    data: {
                      u64: 4008344,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "mem_byte",
                      },
                    ],
                    data: {
                      u64: 1981321,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "invoke_time_nsecs",
                      },
                    ],
                    data: {
                      u64: 619107,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "max_rw_key_byte",
                      },
                    ],
                    data: {
                      u64: 112,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "max_rw_data_byte",
                      },
                    ],
                    data: {
                      u64: 584,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "max_rw_code_byte",
                      },
                    ],
                    data: {
                      u64: 20316,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "max_emit_event_byte",
                      },
                    ],
                    data: {
                      u64: 188,
                    },
                  },
                },
              },
            },
          ],
        },
      },
    },
    diagnosticEventsJson: [
      {
        in_successful_contract_call: true,
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
                    "2716bcf8536e07b567260fdec481f62404acc2783986797bb5152cb9e8ffd9aa",
                },
                {
                  symbol: "burn_record",
                },
              ],
              data: {
                vec: [
                  {
                    symbol: "Record",
                  },
                  {
                    bytes:
                      "9623e5bc5408adf11555c91ce7da865c78439638c8fd4bcbc38f7d3110d3ca37",
                  },
                ],
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "2716bcf8536e07b567260fdec481f62404acc2783986797bb5152cb9e8ffd9aa",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_call",
                },
                {
                  bytes:
                    "25b4fcd859aec2fa6348438c489b3c3c10c98b6d21be4fd3cb30cb68953ef977",
                },
                {
                  symbol: "transfer",
                },
              ],
              data: {
                vec: [
                  {
                    address:
                      "CATRNPHYKNXAPNLHEYH55REB6YSAJLGCPA4YM6L3WUKSZOPI77M2UMKI",
                  },
                  {
                    address:
                      "GA2Q3TSCKD6GBT5SL4XLAPT4TUXJ5GP7HLIM4OHBWT33GFD2UC7SRNEZ",
                  },
                  {
                    i128: {
                      hi: 0,
                      lo: 689297688,
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "25b4fcd859aec2fa6348438c489b3c3c10c98b6d21be4fd3cb30cb68953ef977",
          type_: "contract",
          body: {
            v0: {
              topics: [
                {
                  symbol: "transfer",
                },
                {
                  address:
                    "CATRNPHYKNXAPNLHEYH55REB6YSAJLGCPA4YM6L3WUKSZOPI77M2UMKI",
                },
                {
                  address:
                    "GA2Q3TSCKD6GBT5SL4XLAPT4TUXJ5GP7HLIM4OHBWT33GFD2UC7SRNEZ",
                },
                {
                  string: "native",
                },
              ],
              data: {
                i128: {
                  hi: 0,
                  lo: 689297688,
                },
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "25b4fcd859aec2fa6348438c489b3c3c10c98b6d21be4fd3cb30cb68953ef977",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_return",
                },
                {
                  symbol: "transfer",
                },
              ],
              data: "void",
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "2716bcf8536e07b567260fdec481f62404acc2783986797bb5152cb9e8ffd9aa",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_return",
                },
                {
                  symbol: "burn_record",
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
          contract_id: null,
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "core_metrics",
                },
                {
                  symbol: "read_entry",
                },
              ],
              data: {
                u64: 6,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "write_entry",
                },
              ],
              data: {
                u64: 2,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "ledger_read_byte",
                },
              ],
              data: {
                u64: 21996,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "ledger_write_byte",
                },
              ],
              data: {
                u64: 416,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "read_key_byte",
                },
              ],
              data: {
                u64: 396,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "write_key_byte",
                },
              ],
              data: {
                u64: 0,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "read_data_byte",
                },
              ],
              data: {
                u64: 1680,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "write_data_byte",
                },
              ],
              data: {
                u64: 416,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "read_code_byte",
                },
              ],
              data: {
                u64: 20316,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "write_code_byte",
                },
              ],
              data: {
                u64: 0,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "emit_event",
                },
              ],
              data: {
                u64: 1,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "emit_event_byte",
                },
              ],
              data: {
                u64: 188,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "cpu_insn",
                },
              ],
              data: {
                u64: 4008344,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "mem_byte",
                },
              ],
              data: {
                u64: 1981321,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "invoke_time_nsecs",
                },
              ],
              data: {
                u64: 619107,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "max_rw_key_byte",
                },
              ],
              data: {
                u64: 112,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "max_rw_data_byte",
                },
              ],
              data: {
                u64: 584,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "max_rw_code_byte",
                },
              ],
              data: {
                u64: 20316,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "max_emit_event_byte",
                },
              ],
              data: {
                u64: 188,
              },
            },
          },
        },
      },
    ],
    ledger: 57902734,
    createdAt: "1751946516",
  },
};

// Soroswap: CAG5LRYQ5JVEUI5TEID72EYOVX44TTUJT5BQR2J6J77FH65PCCFAJDDH
export const TX_ST_CHANGE_SOROSWAP_ADD_LIQUIDITY = {
  jsonrpc: "2.0",
  id: 1,
  result: {
    latestLedger: 57819677,
    latestLedgerCloseTime: "1751474851",
    oldestLedger: 57698718,
    oldestLedgerCloseTime: "1750790179",
    status: "SUCCESS",
    txHash: "5f750809d730c22a90b4dd7b2ad81e917929c5645602558053eab4d4e5e3efb5",
    applicationOrder: 392,
    feeBump: false,
    envelopeJson: {
      tx: {
        tx: {
          source_account:
            "GCDSVTMSWEDLNVDDEDR3WLIKZ6NFHTKZXXAYQ4WLEFA7U2KWE3WQAB76",
          fee: 610462,
          seq_num: 164999913229284540,
          cond: {
            time: {
              min_time: 0,
              max_time: 1751301594,
            },
          },
          memo: {
            text: "StellarStak.ing",
          },
          operations: [
            {
              source_account: null,
              body: {
                invoke_host_function: {
                  host_function: {
                    invoke_contract: {
                      contract_address:
                        "CAG5LRYQ5JVEUI5TEID72EYOVX44TTUJT5BQR2J6J77FH65PCCFAJDDH",
                      function_name: "add_liquidity",
                      args: [
                        {
                          address:
                            "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                        },
                        {
                          address:
                            "CCN2LGXV7U3LLRQNAXGPQ7XK2JT2PGMUFOLDZTSLFCKNUXE3QVYEC3PF",
                        },
                        {
                          i128: {
                            hi: 0,
                            lo: 166029636,
                          },
                        },
                        {
                          i128: {
                            hi: 0,
                            lo: 109618491846,
                          },
                        },
                        {
                          i128: {
                            hi: 0,
                            lo: 162709043,
                          },
                        },
                        {
                          i128: {
                            hi: 0,
                            lo: 107426122009,
                          },
                        },
                        {
                          address:
                            "GCDSVTMSWEDLNVDDEDR3WLIKZ6NFHTKZXXAYQ4WLEFA7U2KWE3WQAB76",
                        },
                        {
                          u64: 1751302014,
                        },
                      ],
                    },
                  },
                  auth: [
                    {
                      credentials: "source_account",
                      root_invocation: {
                        function: {
                          contract_fn: {
                            contract_address:
                              "CAG5LRYQ5JVEUI5TEID72EYOVX44TTUJT5BQR2J6J77FH65PCCFAJDDH",
                            function_name: "add_liquidity",
                            args: [
                              {
                                address:
                                  "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                              },
                              {
                                address:
                                  "CCN2LGXV7U3LLRQNAXGPQ7XK2JT2PGMUFOLDZTSLFCKNUXE3QVYEC3PF",
                              },
                              {
                                i128: {
                                  hi: 0,
                                  lo: 166029636,
                                },
                              },
                              {
                                i128: {
                                  hi: 0,
                                  lo: 109618491846,
                                },
                              },
                              {
                                i128: {
                                  hi: 0,
                                  lo: 162709043,
                                },
                              },
                              {
                                i128: {
                                  hi: 0,
                                  lo: 107426122009,
                                },
                              },
                              {
                                address:
                                  "GCDSVTMSWEDLNVDDEDR3WLIKZ6NFHTKZXXAYQ4WLEFA7U2KWE3WQAB76",
                              },
                              {
                                u64: 1751302014,
                              },
                            ],
                          },
                        },
                        sub_invocations: [
                          {
                            function: {
                              contract_fn: {
                                contract_address:
                                  "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                                function_name: "transfer",
                                args: [
                                  {
                                    address:
                                      "GCDSVTMSWEDLNVDDEDR3WLIKZ6NFHTKZXXAYQ4WLEFA7U2KWE3WQAB76",
                                  },
                                  {
                                    address:
                                      "CAHSKDP66SYCGYQZ3NULGZMEUSN5Z67UFBYADJVCNXVKV3E7PKYR5PQ4",
                                  },
                                  {
                                    i128: {
                                      hi: 0,
                                      lo: 166029636,
                                    },
                                  },
                                ],
                              },
                            },
                            sub_invocations: [],
                          },
                          {
                            function: {
                              contract_fn: {
                                contract_address:
                                  "CCN2LGXV7U3LLRQNAXGPQ7XK2JT2PGMUFOLDZTSLFCKNUXE3QVYEC3PF",
                                function_name: "transfer",
                                args: [
                                  {
                                    address:
                                      "GCDSVTMSWEDLNVDDEDR3WLIKZ6NFHTKZXXAYQ4WLEFA7U2KWE3WQAB76",
                                  },
                                  {
                                    address:
                                      "CAHSKDP66SYCGYQZ3NULGZMEUSN5Z67UFBYADJVCNXVKV3E7PKYR5PQ4",
                                  },
                                  {
                                    i128: {
                                      hi: 0,
                                      lo: 109618491767,
                                    },
                                  },
                                ],
                              },
                            },
                            sub_invocations: [],
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            },
          ],
          ext: {
            v1: {
              ext: "v0",
              resources: {
                footprint: {
                  read_only: [
                    {
                      contract_data: {
                        contract:
                          "CAG5LRYQ5JVEUI5TEID72EYOVX44TTUJT5BQR2J6J77FH65PCCFAJDDH",
                        key: "ledger_key_contract_instance",
                        durability: "persistent",
                      },
                    },
                    {
                      contract_data: {
                        contract:
                          "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                        key: "ledger_key_contract_instance",
                        durability: "persistent",
                      },
                    },
                    {
                      contract_data: {
                        contract:
                          "CA4HEQTL2WPEUYKYKCDOHCDNIV4QHNJ7EL4J4NQ6VADP7SYHVRYZ7AW2",
                        key: {
                          vec: [
                            {
                              symbol: "PairAddressesByTokens",
                            },
                            {
                              vec: [
                                {
                                  address:
                                    "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                                },
                                {
                                  address:
                                    "CCN2LGXV7U3LLRQNAXGPQ7XK2JT2PGMUFOLDZTSLFCKNUXE3QVYEC3PF",
                                },
                              ],
                            },
                          ],
                        },
                        durability: "persistent",
                      },
                    },
                    {
                      contract_data: {
                        contract:
                          "CA4HEQTL2WPEUYKYKCDOHCDNIV4QHNJ7EL4J4NQ6VADP7SYHVRYZ7AW2",
                        key: "ledger_key_contract_instance",
                        durability: "persistent",
                      },
                    },
                    {
                      contract_data: {
                        contract:
                          "CCN2LGXV7U3LLRQNAXGPQ7XK2JT2PGMUFOLDZTSLFCKNUXE3QVYEC3PF",
                        key: "ledger_key_contract_instance",
                        durability: "persistent",
                      },
                    },
                    {
                      contract_code: {
                        hash: "18051456816b66f12e773a56f77c5794fac1b1fb7ab6e22d4fad5a412770f73e",
                      },
                    },
                    {
                      contract_code: {
                        hash: "4c3db3ebd2d6a2ab23de1f622eaabb39501539b4611b68622ec4e47f76c4ba07",
                      },
                    },
                    {
                      contract_code: {
                        hash: "5db738b05d9148128a240b0e2c1cb935c2805192bf98a579421aacda364c8dae",
                      },
                    },
                  ],
                  read_write: [
                    {
                      account: {
                        account_id:
                          "GCDSVTMSWEDLNVDDEDR3WLIKZ6NFHTKZXXAYQ4WLEFA7U2KWE3WQAB76",
                      },
                    },
                    {
                      trustline: {
                        account_id:
                          "GCDSVTMSWEDLNVDDEDR3WLIKZ6NFHTKZXXAYQ4WLEFA7U2KWE3WQAB76",
                        asset: {
                          credit_alphanum4: {
                            asset_code: "STK",
                            issuer:
                              "GB6W5SDKRQC6VGZJ2LQOHUM5BAZRKFTAOOBBI6EZQI65WIO3K7AQZSTK",
                          },
                        },
                      },
                    },
                    {
                      contract_data: {
                        contract:
                          "CAHSKDP66SYCGYQZ3NULGZMEUSN5Z67UFBYADJVCNXVKV3E7PKYR5PQ4",
                        key: {
                          vec: [
                            {
                              symbol: "Balance",
                            },
                            {
                              address:
                                "GCDSVTMSWEDLNVDDEDR3WLIKZ6NFHTKZXXAYQ4WLEFA7U2KWE3WQAB76",
                            },
                          ],
                        },
                        durability: "persistent",
                      },
                    },
                    {
                      contract_data: {
                        contract:
                          "CAHSKDP66SYCGYQZ3NULGZMEUSN5Z67UFBYADJVCNXVKV3E7PKYR5PQ4",
                        key: "ledger_key_contract_instance",
                        durability: "persistent",
                      },
                    },
                    {
                      contract_data: {
                        contract:
                          "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                        key: {
                          vec: [
                            {
                              symbol: "Balance",
                            },
                            {
                              address:
                                "CAHSKDP66SYCGYQZ3NULGZMEUSN5Z67UFBYADJVCNXVKV3E7PKYR5PQ4",
                            },
                          ],
                        },
                        durability: "persistent",
                      },
                    },
                    {
                      contract_data: {
                        contract:
                          "CCN2LGXV7U3LLRQNAXGPQ7XK2JT2PGMUFOLDZTSLFCKNUXE3QVYEC3PF",
                        key: {
                          vec: [
                            {
                              symbol: "Balance",
                            },
                            {
                              address:
                                "CAHSKDP66SYCGYQZ3NULGZMEUSN5Z67UFBYADJVCNXVKV3E7PKYR5PQ4",
                            },
                          ],
                        },
                        durability: "persistent",
                      },
                    },
                  ],
                },
                instructions: 14534266,
                read_bytes: 85937,
                write_bytes: 1656,
              },
              resource_fee: 600462,
            },
          },
        },
        signatures: [
          {
            hint: "5626ed00",
            signature:
              "d9883a40a13ce1c88110beaf6ac87f77ac20a105a32976be4f2c21de85094803bd150d945ee049aebb4acbc2492e231f8903c541969a8757ff0e834a4c5b7f06",
          },
        ],
      },
    },
    resultJson: {
      fee_charged: 462990,
      result: {
        tx_success: [
          {
            op_inner: {
              invoke_host_function: {
                success:
                  "c27d760628007e57580ece041600333c423985b4fcd4108d932868c2310e6320",
              },
            },
          },
        ],
      },
      ext: "v0",
    },
    resultMetaJson: {
      v3: {
        ext: "v0",
        tx_changes_before: [
          {
            state: {
              last_modified_ledger_seq: 57788998,
              data: {
                account: {
                  account_id:
                    "GCDSVTMSWEDLNVDDEDR3WLIKZ6NFHTKZXXAYQ4WLEFA7U2KWE3WQAB76",
                  balance: 2068089507,
                  seq_num: 164999913229284540,
                  num_sub_entries: 104,
                  inflation_dest:
                    "GDCHDRSDOBRMSUDKRE2C4U4KDLNEATJPIHHR2ORFL5BSD56G4DQXL4VW",
                  flags: 0,
                  home_domain: "lobstr.co",
                  thresholds: "01000000",
                  signers: [],
                  ext: {
                    v1: {
                      liabilities: {
                        buying: 0,
                        selling: 0,
                      },
                      ext: {
                        v2: {
                          num_sponsored: 0,
                          num_sponsoring: 242,
                          signer_sponsoring_i_ds: [],
                          ext: {
                            v3: {
                              ext: "v0",
                              seq_ledger: 57788987,
                              seq_time: 1751301359,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              ext: "v0",
            },
          },
          {
            updated: {
              last_modified_ledger_seq: 57788998,
              data: {
                account: {
                  account_id:
                    "GCDSVTMSWEDLNVDDEDR3WLIKZ6NFHTKZXXAYQ4WLEFA7U2KWE3WQAB76",
                  balance: 2068089507,
                  seq_num: 164999913229284540,
                  num_sub_entries: 104,
                  inflation_dest:
                    "GDCHDRSDOBRMSUDKRE2C4U4KDLNEATJPIHHR2ORFL5BSD56G4DQXL4VW",
                  flags: 0,
                  home_domain: "lobstr.co",
                  thresholds: "01000000",
                  signers: [],
                  ext: {
                    v1: {
                      liabilities: {
                        buying: 0,
                        selling: 0,
                      },
                      ext: {
                        v2: {
                          num_sponsored: 0,
                          num_sponsoring: 242,
                          signer_sponsoring_i_ds: [],
                          ext: {
                            v3: {
                              ext: "v0",
                              seq_ledger: 57788998,
                              seq_time: 1751301423,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              ext: "v0",
            },
          },
        ],
        operations: [
          {
            changes: [
              {
                state: {
                  last_modified_ledger_seq: 57788987,
                  data: {
                    trustline: {
                      account_id:
                        "GCDSVTMSWEDLNVDDEDR3WLIKZ6NFHTKZXXAYQ4WLEFA7U2KWE3WQAB76",
                      asset: {
                        credit_alphanum4: {
                          asset_code: "STK",
                          issuer:
                            "GB6W5SDKRQC6VGZJ2LQOHUM5BAZRKFTAOOBBI6EZQI65WIO3K7AQZSTK",
                        },
                      },
                      balance: 109618491846,
                      limit: 9223372036854776000,
                      flags: 1,
                      ext: {
                        v1: {
                          liabilities: {
                            buying: 0,
                            selling: 0,
                          },
                          ext: {
                            v2: {
                              liquidity_pool_use_count: 0,
                              ext: "v0",
                            },
                          },
                        },
                      },
                    },
                  },
                  ext: "v0",
                },
              },
              {
                updated: {
                  last_modified_ledger_seq: 57788998,
                  data: {
                    trustline: {
                      account_id:
                        "GCDSVTMSWEDLNVDDEDR3WLIKZ6NFHTKZXXAYQ4WLEFA7U2KWE3WQAB76",
                      asset: {
                        credit_alphanum4: {
                          asset_code: "STK",
                          issuer:
                            "GB6W5SDKRQC6VGZJ2LQOHUM5BAZRKFTAOOBBI6EZQI65WIO3K7AQZSTK",
                        },
                      },
                      balance: 79,
                      limit: 9223372036854776000,
                      flags: 1,
                      ext: {
                        v1: {
                          liabilities: {
                            buying: 0,
                            selling: 0,
                          },
                          ext: {
                            v2: {
                              liquidity_pool_use_count: 0,
                              ext: "v0",
                            },
                          },
                        },
                      },
                    },
                  },
                  ext: "v0",
                },
              },
              {
                state: {
                  last_modified_ledger_seq: 57787744,
                  data: {
                    contract_data: {
                      ext: "v0",
                      contract:
                        "CAHSKDP66SYCGYQZ3NULGZMEUSN5Z67UFBYADJVCNXVKV3E7PKYR5PQ4",
                      key: "ledger_key_contract_instance",
                      durability: "persistent",
                      val: {
                        contract_instance: {
                          executable: {
                            wasm: "18051456816b66f12e773a56f77c5794fac1b1fb7ab6e22d4fad5a412770f73e",
                          },
                          storage: [
                            {
                              key: {
                                u32: 0,
                              },
                              val: {
                                address:
                                  "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                              },
                            },
                            {
                              key: {
                                u32: 1,
                              },
                              val: {
                                address:
                                  "CCN2LGXV7U3LLRQNAXGPQ7XK2JT2PGMUFOLDZTSLFCKNUXE3QVYEC3PF",
                              },
                            },
                            {
                              key: {
                                u32: 2,
                              },
                              val: {
                                i128: {
                                  hi: 0,
                                  lo: 16538793207,
                                },
                              },
                            },
                            {
                              key: {
                                u32: 3,
                              },
                              val: {
                                i128: {
                                  hi: 0,
                                  lo: 10919481670163,
                                },
                              },
                            },
                            {
                              key: {
                                u32: 4,
                              },
                              val: {
                                address:
                                  "CA4HEQTL2WPEUYKYKCDOHCDNIV4QHNJ7EL4J4NQ6VADP7SYHVRYZ7AW2",
                              },
                            },
                            {
                              key: {
                                symbol: "METADATA",
                              },
                              val: {
                                map: [
                                  {
                                    key: {
                                      symbol: "decimal",
                                    },
                                    val: {
                                      u32: 7,
                                    },
                                  },
                                  {
                                    key: {
                                      symbol: "name",
                                    },
                                    val: {
                                      string: "native-STK Soroswap LP Token",
                                    },
                                  },
                                  {
                                    key: {
                                      symbol: "symbol",
                                    },
                                    val: {
                                      string: "native-STK-SOROSWAP-LP",
                                    },
                                  },
                                ],
                              },
                            },
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "TotalSupply",
                                  },
                                ],
                              },
                              val: {
                                i128: {
                                  hi: 0,
                                  lo: 418085158553,
                                },
                              },
                            },
                          ],
                        },
                      },
                    },
                  },
                  ext: "v0",
                },
              },
              {
                updated: {
                  last_modified_ledger_seq: 57788998,
                  data: {
                    contract_data: {
                      ext: "v0",
                      contract:
                        "CAHSKDP66SYCGYQZ3NULGZMEUSN5Z67UFBYADJVCNXVKV3E7PKYR5PQ4",
                      key: "ledger_key_contract_instance",
                      durability: "persistent",
                      val: {
                        contract_instance: {
                          executable: {
                            wasm: "18051456816b66f12e773a56f77c5794fac1b1fb7ab6e22d4fad5a412770f73e",
                          },
                          storage: [
                            {
                              key: {
                                u32: 0,
                              },
                              val: {
                                address:
                                  "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                              },
                            },
                            {
                              key: {
                                u32: 1,
                              },
                              val: {
                                address:
                                  "CCN2LGXV7U3LLRQNAXGPQ7XK2JT2PGMUFOLDZTSLFCKNUXE3QVYEC3PF",
                              },
                            },
                            {
                              key: {
                                u32: 2,
                              },
                              val: {
                                i128: {
                                  hi: 0,
                                  lo: 16704822843,
                                },
                              },
                            },
                            {
                              key: {
                                u32: 3,
                              },
                              val: {
                                i128: {
                                  hi: 0,
                                  lo: 11029100161930,
                                },
                              },
                            },
                            {
                              key: {
                                u32: 4,
                              },
                              val: {
                                address:
                                  "CA4HEQTL2WPEUYKYKCDOHCDNIV4QHNJ7EL4J4NQ6VADP7SYHVRYZ7AW2",
                              },
                            },
                            {
                              key: {
                                symbol: "METADATA",
                              },
                              val: {
                                map: [
                                  {
                                    key: {
                                      symbol: "decimal",
                                    },
                                    val: {
                                      u32: 7,
                                    },
                                  },
                                  {
                                    key: {
                                      symbol: "name",
                                    },
                                    val: {
                                      string: "native-STK Soroswap LP Token",
                                    },
                                  },
                                  {
                                    key: {
                                      symbol: "symbol",
                                    },
                                    val: {
                                      string: "native-STK-SOROSWAP-LP",
                                    },
                                  },
                                ],
                              },
                            },
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "TotalSupply",
                                  },
                                ],
                              },
                              val: {
                                i128: {
                                  hi: 0,
                                  lo: 422282231811,
                                },
                              },
                            },
                          ],
                        },
                      },
                    },
                  },
                  ext: "v0",
                },
              },
              {
                state: {
                  last_modified_ledger_seq: 57776908,
                  data: {
                    contract_data: {
                      ext: "v0",
                      contract:
                        "CAHSKDP66SYCGYQZ3NULGZMEUSN5Z67UFBYADJVCNXVKV3E7PKYR5PQ4",
                      key: {
                        vec: [
                          {
                            symbol: "Balance",
                          },
                          {
                            address:
                              "GCDSVTMSWEDLNVDDEDR3WLIKZ6NFHTKZXXAYQ4WLEFA7U2KWE3WQAB76",
                          },
                        ],
                      },
                      durability: "persistent",
                      val: {
                        i128: {
                          hi: 0,
                          lo: 2885652,
                        },
                      },
                    },
                  },
                  ext: "v0",
                },
              },
              {
                updated: {
                  last_modified_ledger_seq: 57788998,
                  data: {
                    contract_data: {
                      ext: "v0",
                      contract:
                        "CAHSKDP66SYCGYQZ3NULGZMEUSN5Z67UFBYADJVCNXVKV3E7PKYR5PQ4",
                      key: {
                        vec: [
                          {
                            symbol: "Balance",
                          },
                          {
                            address:
                              "GCDSVTMSWEDLNVDDEDR3WLIKZ6NFHTKZXXAYQ4WLEFA7U2KWE3WQAB76",
                          },
                        ],
                      },
                      durability: "persistent",
                      val: {
                        i128: {
                          hi: 0,
                          lo: 4199958910,
                        },
                      },
                    },
                  },
                  ext: "v0",
                },
              },
              {
                state: {
                  last_modified_ledger_seq: 57770648,
                  data: {
                    ttl: {
                      key_hash:
                        "04d04b0d196d5aa4a95d0d33980e5d69a713c0f92490532b621058c1e8285d0d",
                      live_until_ledger_seq: 57891608,
                    },
                  },
                  ext: "v0",
                },
              },
              {
                updated: {
                  last_modified_ledger_seq: 57788998,
                  data: {
                    ttl: {
                      key_hash:
                        "04d04b0d196d5aa4a95d0d33980e5d69a713c0f92490532b621058c1e8285d0d",
                      live_until_ledger_seq: 57909958,
                    },
                  },
                  ext: "v0",
                },
              },
              {
                state: {
                  last_modified_ledger_seq: 57787744,
                  data: {
                    contract_data: {
                      ext: "v0",
                      contract:
                        "CCN2LGXV7U3LLRQNAXGPQ7XK2JT2PGMUFOLDZTSLFCKNUXE3QVYEC3PF",
                      key: {
                        vec: [
                          {
                            symbol: "Balance",
                          },
                          {
                            address:
                              "CAHSKDP66SYCGYQZ3NULGZMEUSN5Z67UFBYADJVCNXVKV3E7PKYR5PQ4",
                          },
                        ],
                      },
                      durability: "persistent",
                      val: {
                        map: [
                          {
                            key: {
                              symbol: "amount",
                            },
                            val: {
                              i128: {
                                hi: 0,
                                lo: 10919481670163,
                              },
                            },
                          },
                          {
                            key: {
                              symbol: "authorized",
                            },
                            val: {
                              bool: true,
                            },
                          },
                          {
                            key: {
                              symbol: "clawback",
                            },
                            val: {
                              bool: false,
                            },
                          },
                        ],
                      },
                    },
                  },
                  ext: "v0",
                },
              },
              {
                updated: {
                  last_modified_ledger_seq: 57788998,
                  data: {
                    contract_data: {
                      ext: "v0",
                      contract:
                        "CCN2LGXV7U3LLRQNAXGPQ7XK2JT2PGMUFOLDZTSLFCKNUXE3QVYEC3PF",
                      key: {
                        vec: [
                          {
                            symbol: "Balance",
                          },
                          {
                            address:
                              "CAHSKDP66SYCGYQZ3NULGZMEUSN5Z67UFBYADJVCNXVKV3E7PKYR5PQ4",
                          },
                        ],
                      },
                      durability: "persistent",
                      val: {
                        map: [
                          {
                            key: {
                              symbol: "amount",
                            },
                            val: {
                              i128: {
                                hi: 0,
                                lo: 11029100161930,
                              },
                            },
                          },
                          {
                            key: {
                              symbol: "authorized",
                            },
                            val: {
                              bool: true,
                            },
                          },
                          {
                            key: {
                              symbol: "clawback",
                            },
                            val: {
                              bool: false,
                            },
                          },
                        ],
                      },
                    },
                  },
                  ext: "v0",
                },
              },
              {
                state: {
                  last_modified_ledger_seq: 57787744,
                  data: {
                    contract_data: {
                      ext: "v0",
                      contract:
                        "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                      key: {
                        vec: [
                          {
                            symbol: "Balance",
                          },
                          {
                            address:
                              "CAHSKDP66SYCGYQZ3NULGZMEUSN5Z67UFBYADJVCNXVKV3E7PKYR5PQ4",
                          },
                        ],
                      },
                      durability: "persistent",
                      val: {
                        map: [
                          {
                            key: {
                              symbol: "amount",
                            },
                            val: {
                              i128: {
                                hi: 0,
                                lo: 16538793207,
                              },
                            },
                          },
                          {
                            key: {
                              symbol: "authorized",
                            },
                            val: {
                              bool: true,
                            },
                          },
                          {
                            key: {
                              symbol: "clawback",
                            },
                            val: {
                              bool: false,
                            },
                          },
                        ],
                      },
                    },
                  },
                  ext: "v0",
                },
              },
              {
                updated: {
                  last_modified_ledger_seq: 57788998,
                  data: {
                    contract_data: {
                      ext: "v0",
                      contract:
                        "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                      key: {
                        vec: [
                          {
                            symbol: "Balance",
                          },
                          {
                            address:
                              "CAHSKDP66SYCGYQZ3NULGZMEUSN5Z67UFBYADJVCNXVKV3E7PKYR5PQ4",
                          },
                        ],
                      },
                      durability: "persistent",
                      val: {
                        map: [
                          {
                            key: {
                              symbol: "amount",
                            },
                            val: {
                              i128: {
                                hi: 0,
                                lo: 16704822843,
                              },
                            },
                          },
                          {
                            key: {
                              symbol: "authorized",
                            },
                            val: {
                              bool: true,
                            },
                          },
                          {
                            key: {
                              symbol: "clawback",
                            },
                            val: {
                              bool: false,
                            },
                          },
                        ],
                      },
                    },
                  },
                  ext: "v0",
                },
              },
              {
                state: {
                  last_modified_ledger_seq: 57788998,
                  data: {
                    account: {
                      account_id:
                        "GCDSVTMSWEDLNVDDEDR3WLIKZ6NFHTKZXXAYQ4WLEFA7U2KWE3WQAB76",
                      balance: 2068089507,
                      seq_num: 164999913229284540,
                      num_sub_entries: 104,
                      inflation_dest:
                        "GDCHDRSDOBRMSUDKRE2C4U4KDLNEATJPIHHR2ORFL5BSD56G4DQXL4VW",
                      flags: 0,
                      home_domain: "lobstr.co",
                      thresholds: "01000000",
                      signers: [],
                      ext: {
                        v1: {
                          liabilities: {
                            buying: 0,
                            selling: 0,
                          },
                          ext: {
                            v2: {
                              num_sponsored: 0,
                              num_sponsoring: 242,
                              signer_sponsoring_i_ds: [],
                              ext: {
                                v3: {
                                  ext: "v0",
                                  seq_ledger: 57788998,
                                  seq_time: 1751301423,
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                  ext: "v0",
                },
              },
              {
                updated: {
                  last_modified_ledger_seq: 57788998,
                  data: {
                    account: {
                      account_id:
                        "GCDSVTMSWEDLNVDDEDR3WLIKZ6NFHTKZXXAYQ4WLEFA7U2KWE3WQAB76",
                      balance: 1902059871,
                      seq_num: 164999913229284540,
                      num_sub_entries: 104,
                      inflation_dest:
                        "GDCHDRSDOBRMSUDKRE2C4U4KDLNEATJPIHHR2ORFL5BSD56G4DQXL4VW",
                      flags: 0,
                      home_domain: "lobstr.co",
                      thresholds: "01000000",
                      signers: [],
                      ext: {
                        v1: {
                          liabilities: {
                            buying: 0,
                            selling: 0,
                          },
                          ext: {
                            v2: {
                              num_sponsored: 0,
                              num_sponsoring: 242,
                              signer_sponsoring_i_ds: [],
                              ext: {
                                v3: {
                                  ext: "v0",
                                  seq_ledger: 57788998,
                                  seq_time: 1751301423,
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                  ext: "v0",
                },
              },
            ],
          },
        ],
        tx_changes_after: [
          {
            state: {
              last_modified_ledger_seq: 57788998,
              data: {
                account: {
                  account_id:
                    "GCDSVTMSWEDLNVDDEDR3WLIKZ6NFHTKZXXAYQ4WLEFA7U2KWE3WQAB76",
                  balance: 1902059871,
                  seq_num: 164999913229284540,
                  num_sub_entries: 104,
                  inflation_dest:
                    "GDCHDRSDOBRMSUDKRE2C4U4KDLNEATJPIHHR2ORFL5BSD56G4DQXL4VW",
                  flags: 0,
                  home_domain: "lobstr.co",
                  thresholds: "01000000",
                  signers: [],
                  ext: {
                    v1: {
                      liabilities: {
                        buying: 0,
                        selling: 0,
                      },
                      ext: {
                        v2: {
                          num_sponsored: 0,
                          num_sponsoring: 242,
                          signer_sponsoring_i_ds: [],
                          ext: {
                            v3: {
                              ext: "v0",
                              seq_ledger: 57788998,
                              seq_time: 1751301423,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              ext: "v0",
            },
          },
          {
            updated: {
              last_modified_ledger_seq: 57788998,
              data: {
                account: {
                  account_id:
                    "GCDSVTMSWEDLNVDDEDR3WLIKZ6NFHTKZXXAYQ4WLEFA7U2KWE3WQAB76",
                  balance: 1902197631,
                  seq_num: 164999913229284540,
                  num_sub_entries: 104,
                  inflation_dest:
                    "GDCHDRSDOBRMSUDKRE2C4U4KDLNEATJPIHHR2ORFL5BSD56G4DQXL4VW",
                  flags: 0,
                  home_domain: "lobstr.co",
                  thresholds: "01000000",
                  signers: [],
                  ext: {
                    v1: {
                      liabilities: {
                        buying: 0,
                        selling: 0,
                      },
                      ext: {
                        v2: {
                          num_sponsored: 0,
                          num_sponsoring: 242,
                          signer_sponsoring_i_ds: [],
                          ext: {
                            v3: {
                              ext: "v0",
                              seq_ledger: 57788998,
                              seq_time: 1751301423,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              ext: "v0",
            },
          },
        ],
        soroban_meta: {
          ext: {
            v1: {
              ext: "v0",
              total_non_refundable_resource_fee_charged: 392770,
              total_refundable_resource_fee_charged: 69932,
              rent_fee_charged: 53916,
            },
          },
          events: [
            {
              ext: "v0",
              contract_id:
                "25b4fcd859aec2fa6348438c489b3c3c10c98b6d21be4fd3cb30cb68953ef977",
              type_: "contract",
              body: {
                v0: {
                  topics: [
                    {
                      symbol: "transfer",
                    },
                    {
                      address:
                        "GCDSVTMSWEDLNVDDEDR3WLIKZ6NFHTKZXXAYQ4WLEFA7U2KWE3WQAB76",
                    },
                    {
                      address:
                        "CAHSKDP66SYCGYQZ3NULGZMEUSN5Z67UFBYADJVCNXVKV3E7PKYR5PQ4",
                    },
                    {
                      string: "native",
                    },
                  ],
                  data: {
                    i128: {
                      hi: 0,
                      lo: 166029636,
                    },
                  },
                },
              },
            },
            {
              ext: "v0",
              contract_id:
                "9ba59af5fd36b5c60d05ccf87eead267a799942b963cce4b2894da5c9b857041",
              type_: "contract",
              body: {
                v0: {
                  topics: [
                    {
                      symbol: "transfer",
                    },
                    {
                      address:
                        "GCDSVTMSWEDLNVDDEDR3WLIKZ6NFHTKZXXAYQ4WLEFA7U2KWE3WQAB76",
                    },
                    {
                      address:
                        "CAHSKDP66SYCGYQZ3NULGZMEUSN5Z67UFBYADJVCNXVKV3E7PKYR5PQ4",
                    },
                    {
                      string:
                        "STK:GB6W5SDKRQC6VGZJ2LQOHUM5BAZRKFTAOOBBI6EZQI65WIO3K7AQZSTK",
                    },
                  ],
                  data: {
                    i128: {
                      hi: 0,
                      lo: 109618491767,
                    },
                  },
                },
              },
            },
            {
              ext: "v0",
              contract_id:
                "0f250dfef4b0236219db68b36584a49bdcfbf4287001a6a26deaaaec9f7ab11e",
              type_: "contract",
              body: {
                v0: {
                  topics: [
                    {
                      symbol: "mint",
                    },
                    {
                      address:
                        "CAHSKDP66SYCGYQZ3NULGZMEUSN5Z67UFBYADJVCNXVKV3E7PKYR5PQ4",
                    },
                    {
                      address:
                        "GCDSVTMSWEDLNVDDEDR3WLIKZ6NFHTKZXXAYQ4WLEFA7U2KWE3WQAB76",
                    },
                  ],
                  data: {
                    i128: {
                      hi: 0,
                      lo: 4197073258,
                    },
                  },
                },
              },
            },
            {
              ext: "v0",
              contract_id:
                "0f250dfef4b0236219db68b36584a49bdcfbf4287001a6a26deaaaec9f7ab11e",
              type_: "contract",
              body: {
                v0: {
                  topics: [
                    {
                      string: "SoroswapPair",
                    },
                    {
                      symbol: "sync",
                    },
                  ],
                  data: {
                    map: [
                      {
                        key: {
                          symbol: "new_reserve_0",
                        },
                        val: {
                          i128: {
                            hi: 0,
                            lo: 16704822843,
                          },
                        },
                      },
                      {
                        key: {
                          symbol: "new_reserve_1",
                        },
                        val: {
                          i128: {
                            hi: 0,
                            lo: 11029100161930,
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
            {
              ext: "v0",
              contract_id:
                "0f250dfef4b0236219db68b36584a49bdcfbf4287001a6a26deaaaec9f7ab11e",
              type_: "contract",
              body: {
                v0: {
                  topics: [
                    {
                      string: "SoroswapPair",
                    },
                    {
                      symbol: "deposit",
                    },
                  ],
                  data: {
                    map: [
                      {
                        key: {
                          symbol: "amount_0",
                        },
                        val: {
                          i128: {
                            hi: 0,
                            lo: 166029636,
                          },
                        },
                      },
                      {
                        key: {
                          symbol: "amount_1",
                        },
                        val: {
                          i128: {
                            hi: 0,
                            lo: 109618491767,
                          },
                        },
                      },
                      {
                        key: {
                          symbol: "liquidity",
                        },
                        val: {
                          i128: {
                            hi: 0,
                            lo: 4197073258,
                          },
                        },
                      },
                      {
                        key: {
                          symbol: "new_reserve_0",
                        },
                        val: {
                          i128: {
                            hi: 0,
                            lo: 16704822843,
                          },
                        },
                      },
                      {
                        key: {
                          symbol: "new_reserve_1",
                        },
                        val: {
                          i128: {
                            hi: 0,
                            lo: 11029100161930,
                          },
                        },
                      },
                      {
                        key: {
                          symbol: "to",
                        },
                        val: {
                          address:
                            "GCDSVTMSWEDLNVDDEDR3WLIKZ6NFHTKZXXAYQ4WLEFA7U2KWE3WQAB76",
                        },
                      },
                    ],
                  },
                },
              },
            },
            {
              ext: "v0",
              contract_id:
                "0dd5c710ea6a4a23b32207fd130eadf9c9ce899f4308e93e4ffe53fbaf108a04",
              type_: "contract",
              body: {
                v0: {
                  topics: [
                    {
                      string: "SoroswapRouter",
                    },
                    {
                      symbol: "add",
                    },
                  ],
                  data: {
                    map: [
                      {
                        key: {
                          symbol: "amount_a",
                        },
                        val: {
                          i128: {
                            hi: 0,
                            lo: 166029636,
                          },
                        },
                      },
                      {
                        key: {
                          symbol: "amount_b",
                        },
                        val: {
                          i128: {
                            hi: 0,
                            lo: 109618491767,
                          },
                        },
                      },
                      {
                        key: {
                          symbol: "liquidity",
                        },
                        val: {
                          i128: {
                            hi: 0,
                            lo: 4197073258,
                          },
                        },
                      },
                      {
                        key: {
                          symbol: "pair",
                        },
                        val: {
                          address:
                            "CAHSKDP66SYCGYQZ3NULGZMEUSN5Z67UFBYADJVCNXVKV3E7PKYR5PQ4",
                        },
                      },
                      {
                        key: {
                          symbol: "to",
                        },
                        val: {
                          address:
                            "GCDSVTMSWEDLNVDDEDR3WLIKZ6NFHTKZXXAYQ4WLEFA7U2KWE3WQAB76",
                        },
                      },
                      {
                        key: {
                          symbol: "token_a",
                        },
                        val: {
                          address:
                            "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                        },
                      },
                      {
                        key: {
                          symbol: "token_b",
                        },
                        val: {
                          address:
                            "CCN2LGXV7U3LLRQNAXGPQ7XK2JT2PGMUFOLDZTSLFCKNUXE3QVYEC3PF",
                        },
                      },
                    ],
                  },
                },
              },
            },
          ],
          return_value: {
            vec: [
              {
                i128: {
                  hi: 0,
                  lo: 166029636,
                },
              },
              {
                i128: {
                  hi: 0,
                  lo: 109618491767,
                },
              },
              {
                i128: {
                  hi: 0,
                  lo: 4197073258,
                },
              },
            ],
          },
          diagnostic_events: [
            {
              in_successful_contract_call: true,
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
                          "0dd5c710ea6a4a23b32207fd130eadf9c9ce899f4308e93e4ffe53fbaf108a04",
                      },
                      {
                        symbol: "add_liquidity",
                      },
                    ],
                    data: {
                      vec: [
                        {
                          address:
                            "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                        },
                        {
                          address:
                            "CCN2LGXV7U3LLRQNAXGPQ7XK2JT2PGMUFOLDZTSLFCKNUXE3QVYEC3PF",
                        },
                        {
                          i128: {
                            hi: 0,
                            lo: 166029636,
                          },
                        },
                        {
                          i128: {
                            hi: 0,
                            lo: 109618491846,
                          },
                        },
                        {
                          i128: {
                            hi: 0,
                            lo: 162709043,
                          },
                        },
                        {
                          i128: {
                            hi: 0,
                            lo: 107426122009,
                          },
                        },
                        {
                          address:
                            "GCDSVTMSWEDLNVDDEDR3WLIKZ6NFHTKZXXAYQ4WLEFA7U2KWE3WQAB76",
                        },
                        {
                          u64: 1751302014,
                        },
                      ],
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "0dd5c710ea6a4a23b32207fd130eadf9c9ce899f4308e93e4ffe53fbaf108a04",
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "fn_call",
                      },
                      {
                        bytes:
                          "3872426bd59e4a61585086e3886d457903b53f22f89e361ea806ffcb07ac719f",
                      },
                      {
                        symbol: "pair_exists",
                      },
                    ],
                    data: {
                      vec: [
                        {
                          address:
                            "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                        },
                        {
                          address:
                            "CCN2LGXV7U3LLRQNAXGPQ7XK2JT2PGMUFOLDZTSLFCKNUXE3QVYEC3PF",
                        },
                      ],
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "3872426bd59e4a61585086e3886d457903b53f22f89e361ea806ffcb07ac719f",
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "fn_return",
                      },
                      {
                        symbol: "pair_exists",
                      },
                    ],
                    data: {
                      bool: true,
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "0dd5c710ea6a4a23b32207fd130eadf9c9ce899f4308e93e4ffe53fbaf108a04",
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "fn_call",
                      },
                      {
                        bytes:
                          "0f250dfef4b0236219db68b36584a49bdcfbf4287001a6a26deaaaec9f7ab11e",
                      },
                      {
                        symbol: "get_reserves",
                      },
                    ],
                    data: "void",
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "0f250dfef4b0236219db68b36584a49bdcfbf4287001a6a26deaaaec9f7ab11e",
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "fn_return",
                      },
                      {
                        symbol: "get_reserves",
                      },
                    ],
                    data: {
                      vec: [
                        {
                          i128: {
                            hi: 0,
                            lo: 16538793207,
                          },
                        },
                        {
                          i128: {
                            hi: 0,
                            lo: 10919481670163,
                          },
                        },
                      ],
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "0dd5c710ea6a4a23b32207fd130eadf9c9ce899f4308e93e4ffe53fbaf108a04",
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "fn_call",
                      },
                      {
                        bytes:
                          "25b4fcd859aec2fa6348438c489b3c3c10c98b6d21be4fd3cb30cb68953ef977",
                      },
                      {
                        symbol: "transfer",
                      },
                    ],
                    data: {
                      vec: [
                        {
                          address:
                            "GCDSVTMSWEDLNVDDEDR3WLIKZ6NFHTKZXXAYQ4WLEFA7U2KWE3WQAB76",
                        },
                        {
                          address:
                            "CAHSKDP66SYCGYQZ3NULGZMEUSN5Z67UFBYADJVCNXVKV3E7PKYR5PQ4",
                        },
                        {
                          i128: {
                            hi: 0,
                            lo: 166029636,
                          },
                        },
                      ],
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "25b4fcd859aec2fa6348438c489b3c3c10c98b6d21be4fd3cb30cb68953ef977",
                type_: "contract",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "transfer",
                      },
                      {
                        address:
                          "GCDSVTMSWEDLNVDDEDR3WLIKZ6NFHTKZXXAYQ4WLEFA7U2KWE3WQAB76",
                      },
                      {
                        address:
                          "CAHSKDP66SYCGYQZ3NULGZMEUSN5Z67UFBYADJVCNXVKV3E7PKYR5PQ4",
                      },
                      {
                        string: "native",
                      },
                    ],
                    data: {
                      i128: {
                        hi: 0,
                        lo: 166029636,
                      },
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "25b4fcd859aec2fa6348438c489b3c3c10c98b6d21be4fd3cb30cb68953ef977",
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "fn_return",
                      },
                      {
                        symbol: "transfer",
                      },
                    ],
                    data: "void",
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "0dd5c710ea6a4a23b32207fd130eadf9c9ce899f4308e93e4ffe53fbaf108a04",
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "fn_call",
                      },
                      {
                        bytes:
                          "9ba59af5fd36b5c60d05ccf87eead267a799942b963cce4b2894da5c9b857041",
                      },
                      {
                        symbol: "transfer",
                      },
                    ],
                    data: {
                      vec: [
                        {
                          address:
                            "GCDSVTMSWEDLNVDDEDR3WLIKZ6NFHTKZXXAYQ4WLEFA7U2KWE3WQAB76",
                        },
                        {
                          address:
                            "CAHSKDP66SYCGYQZ3NULGZMEUSN5Z67UFBYADJVCNXVKV3E7PKYR5PQ4",
                        },
                        {
                          i128: {
                            hi: 0,
                            lo: 109618491767,
                          },
                        },
                      ],
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "9ba59af5fd36b5c60d05ccf87eead267a799942b963cce4b2894da5c9b857041",
                type_: "contract",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "transfer",
                      },
                      {
                        address:
                          "GCDSVTMSWEDLNVDDEDR3WLIKZ6NFHTKZXXAYQ4WLEFA7U2KWE3WQAB76",
                      },
                      {
                        address:
                          "CAHSKDP66SYCGYQZ3NULGZMEUSN5Z67UFBYADJVCNXVKV3E7PKYR5PQ4",
                      },
                      {
                        string:
                          "STK:GB6W5SDKRQC6VGZJ2LQOHUM5BAZRKFTAOOBBI6EZQI65WIO3K7AQZSTK",
                      },
                    ],
                    data: {
                      i128: {
                        hi: 0,
                        lo: 109618491767,
                      },
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "9ba59af5fd36b5c60d05ccf87eead267a799942b963cce4b2894da5c9b857041",
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "fn_return",
                      },
                      {
                        symbol: "transfer",
                      },
                    ],
                    data: "void",
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "0dd5c710ea6a4a23b32207fd130eadf9c9ce899f4308e93e4ffe53fbaf108a04",
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "fn_call",
                      },
                      {
                        bytes:
                          "0f250dfef4b0236219db68b36584a49bdcfbf4287001a6a26deaaaec9f7ab11e",
                      },
                      {
                        symbol: "deposit",
                      },
                    ],
                    data: {
                      address:
                        "GCDSVTMSWEDLNVDDEDR3WLIKZ6NFHTKZXXAYQ4WLEFA7U2KWE3WQAB76",
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "0f250dfef4b0236219db68b36584a49bdcfbf4287001a6a26deaaaec9f7ab11e",
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "fn_call",
                      },
                      {
                        bytes:
                          "25b4fcd859aec2fa6348438c489b3c3c10c98b6d21be4fd3cb30cb68953ef977",
                      },
                      {
                        symbol: "balance",
                      },
                    ],
                    data: {
                      address:
                        "CAHSKDP66SYCGYQZ3NULGZMEUSN5Z67UFBYADJVCNXVKV3E7PKYR5PQ4",
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "25b4fcd859aec2fa6348438c489b3c3c10c98b6d21be4fd3cb30cb68953ef977",
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "fn_return",
                      },
                      {
                        symbol: "balance",
                      },
                    ],
                    data: {
                      i128: {
                        hi: 0,
                        lo: 16704822843,
                      },
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "0f250dfef4b0236219db68b36584a49bdcfbf4287001a6a26deaaaec9f7ab11e",
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "fn_call",
                      },
                      {
                        bytes:
                          "9ba59af5fd36b5c60d05ccf87eead267a799942b963cce4b2894da5c9b857041",
                      },
                      {
                        symbol: "balance",
                      },
                    ],
                    data: {
                      address:
                        "CAHSKDP66SYCGYQZ3NULGZMEUSN5Z67UFBYADJVCNXVKV3E7PKYR5PQ4",
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "9ba59af5fd36b5c60d05ccf87eead267a799942b963cce4b2894da5c9b857041",
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "fn_return",
                      },
                      {
                        symbol: "balance",
                      },
                    ],
                    data: {
                      i128: {
                        hi: 0,
                        lo: 11029100161930,
                      },
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "0f250dfef4b0236219db68b36584a49bdcfbf4287001a6a26deaaaec9f7ab11e",
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "fn_call",
                      },
                      {
                        bytes:
                          "3872426bd59e4a61585086e3886d457903b53f22f89e361ea806ffcb07ac719f",
                      },
                      {
                        symbol: "fees_enabled",
                      },
                    ],
                    data: "void",
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "3872426bd59e4a61585086e3886d457903b53f22f89e361ea806ffcb07ac719f",
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "fn_return",
                      },
                      {
                        symbol: "fees_enabled",
                      },
                    ],
                    data: {
                      bool: false,
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "0f250dfef4b0236219db68b36584a49bdcfbf4287001a6a26deaaaec9f7ab11e",
                type_: "contract",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "mint",
                      },
                      {
                        address:
                          "CAHSKDP66SYCGYQZ3NULGZMEUSN5Z67UFBYADJVCNXVKV3E7PKYR5PQ4",
                      },
                      {
                        address:
                          "GCDSVTMSWEDLNVDDEDR3WLIKZ6NFHTKZXXAYQ4WLEFA7U2KWE3WQAB76",
                      },
                    ],
                    data: {
                      i128: {
                        hi: 0,
                        lo: 4197073258,
                      },
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "0f250dfef4b0236219db68b36584a49bdcfbf4287001a6a26deaaaec9f7ab11e",
                type_: "contract",
                body: {
                  v0: {
                    topics: [
                      {
                        string: "SoroswapPair",
                      },
                      {
                        symbol: "sync",
                      },
                    ],
                    data: {
                      map: [
                        {
                          key: {
                            symbol: "new_reserve_0",
                          },
                          val: {
                            i128: {
                              hi: 0,
                              lo: 16704822843,
                            },
                          },
                        },
                        {
                          key: {
                            symbol: "new_reserve_1",
                          },
                          val: {
                            i128: {
                              hi: 0,
                              lo: 11029100161930,
                            },
                          },
                        },
                      ],
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "0f250dfef4b0236219db68b36584a49bdcfbf4287001a6a26deaaaec9f7ab11e",
                type_: "contract",
                body: {
                  v0: {
                    topics: [
                      {
                        string: "SoroswapPair",
                      },
                      {
                        symbol: "deposit",
                      },
                    ],
                    data: {
                      map: [
                        {
                          key: {
                            symbol: "amount_0",
                          },
                          val: {
                            i128: {
                              hi: 0,
                              lo: 166029636,
                            },
                          },
                        },
                        {
                          key: {
                            symbol: "amount_1",
                          },
                          val: {
                            i128: {
                              hi: 0,
                              lo: 109618491767,
                            },
                          },
                        },
                        {
                          key: {
                            symbol: "liquidity",
                          },
                          val: {
                            i128: {
                              hi: 0,
                              lo: 4197073258,
                            },
                          },
                        },
                        {
                          key: {
                            symbol: "new_reserve_0",
                          },
                          val: {
                            i128: {
                              hi: 0,
                              lo: 16704822843,
                            },
                          },
                        },
                        {
                          key: {
                            symbol: "new_reserve_1",
                          },
                          val: {
                            i128: {
                              hi: 0,
                              lo: 11029100161930,
                            },
                          },
                        },
                        {
                          key: {
                            symbol: "to",
                          },
                          val: {
                            address:
                              "GCDSVTMSWEDLNVDDEDR3WLIKZ6NFHTKZXXAYQ4WLEFA7U2KWE3WQAB76",
                          },
                        },
                      ],
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "0f250dfef4b0236219db68b36584a49bdcfbf4287001a6a26deaaaec9f7ab11e",
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "fn_return",
                      },
                      {
                        symbol: "deposit",
                      },
                    ],
                    data: {
                      i128: {
                        hi: 0,
                        lo: 4197073258,
                      },
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "0dd5c710ea6a4a23b32207fd130eadf9c9ce899f4308e93e4ffe53fbaf108a04",
                type_: "contract",
                body: {
                  v0: {
                    topics: [
                      {
                        string: "SoroswapRouter",
                      },
                      {
                        symbol: "add",
                      },
                    ],
                    data: {
                      map: [
                        {
                          key: {
                            symbol: "amount_a",
                          },
                          val: {
                            i128: {
                              hi: 0,
                              lo: 166029636,
                            },
                          },
                        },
                        {
                          key: {
                            symbol: "amount_b",
                          },
                          val: {
                            i128: {
                              hi: 0,
                              lo: 109618491767,
                            },
                          },
                        },
                        {
                          key: {
                            symbol: "liquidity",
                          },
                          val: {
                            i128: {
                              hi: 0,
                              lo: 4197073258,
                            },
                          },
                        },
                        {
                          key: {
                            symbol: "pair",
                          },
                          val: {
                            address:
                              "CAHSKDP66SYCGYQZ3NULGZMEUSN5Z67UFBYADJVCNXVKV3E7PKYR5PQ4",
                          },
                        },
                        {
                          key: {
                            symbol: "to",
                          },
                          val: {
                            address:
                              "GCDSVTMSWEDLNVDDEDR3WLIKZ6NFHTKZXXAYQ4WLEFA7U2KWE3WQAB76",
                          },
                        },
                        {
                          key: {
                            symbol: "token_a",
                          },
                          val: {
                            address:
                              "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                          },
                        },
                        {
                          key: {
                            symbol: "token_b",
                          },
                          val: {
                            address:
                              "CCN2LGXV7U3LLRQNAXGPQ7XK2JT2PGMUFOLDZTSLFCKNUXE3QVYEC3PF",
                          },
                        },
                      ],
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "0dd5c710ea6a4a23b32207fd130eadf9c9ce899f4308e93e4ffe53fbaf108a04",
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "fn_return",
                      },
                      {
                        symbol: "add_liquidity",
                      },
                    ],
                    data: {
                      vec: [
                        {
                          i128: {
                            hi: 0,
                            lo: 166029636,
                          },
                        },
                        {
                          i128: {
                            hi: 0,
                            lo: 109618491767,
                          },
                        },
                        {
                          i128: {
                            hi: 0,
                            lo: 4197073258,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "read_entry",
                      },
                    ],
                    data: {
                      u64: 14,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "write_entry",
                      },
                    ],
                    data: {
                      u64: 6,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "ledger_read_byte",
                      },
                    ],
                    data: {
                      u64: 74728,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "ledger_write_byte",
                      },
                    ],
                    data: {
                      u64: 1440,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "read_key_byte",
                      },
                    ],
                    data: {
                      u64: 992,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "write_key_byte",
                      },
                    ],
                    data: {
                      u64: 0,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "read_data_byte",
                      },
                    ],
                    data: {
                      u64: 2864,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "write_data_byte",
                      },
                    ],
                    data: {
                      u64: 1440,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "read_code_byte",
                      },
                    ],
                    data: {
                      u64: 71864,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "write_code_byte",
                      },
                    ],
                    data: {
                      u64: 0,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "emit_event",
                      },
                    ],
                    data: {
                      u64: 6,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "emit_event_byte",
                      },
                    ],
                    data: {
                      u64: 1568,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "cpu_insn",
                      },
                    ],
                    data: {
                      u64: 12000880,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "mem_byte",
                      },
                    ],
                    data: {
                      u64: 8135088,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "invoke_time_nsecs",
                      },
                    ],
                    data: {
                      u64: 1504484,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "max_rw_key_byte",
                      },
                    ],
                    data: {
                      u64: 180,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "max_rw_data_byte",
                      },
                    ],
                    data: {
                      u64: 508,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "max_rw_code_byte",
                      },
                    ],
                    data: {
                      u64: 34356,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "max_emit_event_byte",
                      },
                    ],
                    data: {
                      u64: 432,
                    },
                  },
                },
              },
            },
          ],
        },
      },
    },
    diagnosticEventsJson: [
      {
        in_successful_contract_call: true,
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
                    "0dd5c710ea6a4a23b32207fd130eadf9c9ce899f4308e93e4ffe53fbaf108a04",
                },
                {
                  symbol: "add_liquidity",
                },
              ],
              data: {
                vec: [
                  {
                    address:
                      "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                  },
                  {
                    address:
                      "CCN2LGXV7U3LLRQNAXGPQ7XK2JT2PGMUFOLDZTSLFCKNUXE3QVYEC3PF",
                  },
                  {
                    i128: {
                      hi: 0,
                      lo: 166029636,
                    },
                  },
                  {
                    i128: {
                      hi: 0,
                      lo: 109618491846,
                    },
                  },
                  {
                    i128: {
                      hi: 0,
                      lo: 162709043,
                    },
                  },
                  {
                    i128: {
                      hi: 0,
                      lo: 107426122009,
                    },
                  },
                  {
                    address:
                      "GCDSVTMSWEDLNVDDEDR3WLIKZ6NFHTKZXXAYQ4WLEFA7U2KWE3WQAB76",
                  },
                  {
                    u64: 1751302014,
                  },
                ],
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "0dd5c710ea6a4a23b32207fd130eadf9c9ce899f4308e93e4ffe53fbaf108a04",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_call",
                },
                {
                  bytes:
                    "3872426bd59e4a61585086e3886d457903b53f22f89e361ea806ffcb07ac719f",
                },
                {
                  symbol: "pair_exists",
                },
              ],
              data: {
                vec: [
                  {
                    address:
                      "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                  },
                  {
                    address:
                      "CCN2LGXV7U3LLRQNAXGPQ7XK2JT2PGMUFOLDZTSLFCKNUXE3QVYEC3PF",
                  },
                ],
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "3872426bd59e4a61585086e3886d457903b53f22f89e361ea806ffcb07ac719f",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_return",
                },
                {
                  symbol: "pair_exists",
                },
              ],
              data: {
                bool: true,
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "0dd5c710ea6a4a23b32207fd130eadf9c9ce899f4308e93e4ffe53fbaf108a04",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_call",
                },
                {
                  bytes:
                    "0f250dfef4b0236219db68b36584a49bdcfbf4287001a6a26deaaaec9f7ab11e",
                },
                {
                  symbol: "get_reserves",
                },
              ],
              data: "void",
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "0f250dfef4b0236219db68b36584a49bdcfbf4287001a6a26deaaaec9f7ab11e",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_return",
                },
                {
                  symbol: "get_reserves",
                },
              ],
              data: {
                vec: [
                  {
                    i128: {
                      hi: 0,
                      lo: 16538793207,
                    },
                  },
                  {
                    i128: {
                      hi: 0,
                      lo: 10919481670163,
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "0dd5c710ea6a4a23b32207fd130eadf9c9ce899f4308e93e4ffe53fbaf108a04",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_call",
                },
                {
                  bytes:
                    "25b4fcd859aec2fa6348438c489b3c3c10c98b6d21be4fd3cb30cb68953ef977",
                },
                {
                  symbol: "transfer",
                },
              ],
              data: {
                vec: [
                  {
                    address:
                      "GCDSVTMSWEDLNVDDEDR3WLIKZ6NFHTKZXXAYQ4WLEFA7U2KWE3WQAB76",
                  },
                  {
                    address:
                      "CAHSKDP66SYCGYQZ3NULGZMEUSN5Z67UFBYADJVCNXVKV3E7PKYR5PQ4",
                  },
                  {
                    i128: {
                      hi: 0,
                      lo: 166029636,
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "25b4fcd859aec2fa6348438c489b3c3c10c98b6d21be4fd3cb30cb68953ef977",
          type_: "contract",
          body: {
            v0: {
              topics: [
                {
                  symbol: "transfer",
                },
                {
                  address:
                    "GCDSVTMSWEDLNVDDEDR3WLIKZ6NFHTKZXXAYQ4WLEFA7U2KWE3WQAB76",
                },
                {
                  address:
                    "CAHSKDP66SYCGYQZ3NULGZMEUSN5Z67UFBYADJVCNXVKV3E7PKYR5PQ4",
                },
                {
                  string: "native",
                },
              ],
              data: {
                i128: {
                  hi: 0,
                  lo: 166029636,
                },
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "25b4fcd859aec2fa6348438c489b3c3c10c98b6d21be4fd3cb30cb68953ef977",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_return",
                },
                {
                  symbol: "transfer",
                },
              ],
              data: "void",
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "0dd5c710ea6a4a23b32207fd130eadf9c9ce899f4308e93e4ffe53fbaf108a04",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_call",
                },
                {
                  bytes:
                    "9ba59af5fd36b5c60d05ccf87eead267a799942b963cce4b2894da5c9b857041",
                },
                {
                  symbol: "transfer",
                },
              ],
              data: {
                vec: [
                  {
                    address:
                      "GCDSVTMSWEDLNVDDEDR3WLIKZ6NFHTKZXXAYQ4WLEFA7U2KWE3WQAB76",
                  },
                  {
                    address:
                      "CAHSKDP66SYCGYQZ3NULGZMEUSN5Z67UFBYADJVCNXVKV3E7PKYR5PQ4",
                  },
                  {
                    i128: {
                      hi: 0,
                      lo: 109618491767,
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "9ba59af5fd36b5c60d05ccf87eead267a799942b963cce4b2894da5c9b857041",
          type_: "contract",
          body: {
            v0: {
              topics: [
                {
                  symbol: "transfer",
                },
                {
                  address:
                    "GCDSVTMSWEDLNVDDEDR3WLIKZ6NFHTKZXXAYQ4WLEFA7U2KWE3WQAB76",
                },
                {
                  address:
                    "CAHSKDP66SYCGYQZ3NULGZMEUSN5Z67UFBYADJVCNXVKV3E7PKYR5PQ4",
                },
                {
                  string:
                    "STK:GB6W5SDKRQC6VGZJ2LQOHUM5BAZRKFTAOOBBI6EZQI65WIO3K7AQZSTK",
                },
              ],
              data: {
                i128: {
                  hi: 0,
                  lo: 109618491767,
                },
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "9ba59af5fd36b5c60d05ccf87eead267a799942b963cce4b2894da5c9b857041",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_return",
                },
                {
                  symbol: "transfer",
                },
              ],
              data: "void",
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "0dd5c710ea6a4a23b32207fd130eadf9c9ce899f4308e93e4ffe53fbaf108a04",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_call",
                },
                {
                  bytes:
                    "0f250dfef4b0236219db68b36584a49bdcfbf4287001a6a26deaaaec9f7ab11e",
                },
                {
                  symbol: "deposit",
                },
              ],
              data: {
                address:
                  "GCDSVTMSWEDLNVDDEDR3WLIKZ6NFHTKZXXAYQ4WLEFA7U2KWE3WQAB76",
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "0f250dfef4b0236219db68b36584a49bdcfbf4287001a6a26deaaaec9f7ab11e",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_call",
                },
                {
                  bytes:
                    "25b4fcd859aec2fa6348438c489b3c3c10c98b6d21be4fd3cb30cb68953ef977",
                },
                {
                  symbol: "balance",
                },
              ],
              data: {
                address:
                  "CAHSKDP66SYCGYQZ3NULGZMEUSN5Z67UFBYADJVCNXVKV3E7PKYR5PQ4",
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "25b4fcd859aec2fa6348438c489b3c3c10c98b6d21be4fd3cb30cb68953ef977",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_return",
                },
                {
                  symbol: "balance",
                },
              ],
              data: {
                i128: {
                  hi: 0,
                  lo: 16704822843,
                },
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "0f250dfef4b0236219db68b36584a49bdcfbf4287001a6a26deaaaec9f7ab11e",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_call",
                },
                {
                  bytes:
                    "9ba59af5fd36b5c60d05ccf87eead267a799942b963cce4b2894da5c9b857041",
                },
                {
                  symbol: "balance",
                },
              ],
              data: {
                address:
                  "CAHSKDP66SYCGYQZ3NULGZMEUSN5Z67UFBYADJVCNXVKV3E7PKYR5PQ4",
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "9ba59af5fd36b5c60d05ccf87eead267a799942b963cce4b2894da5c9b857041",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_return",
                },
                {
                  symbol: "balance",
                },
              ],
              data: {
                i128: {
                  hi: 0,
                  lo: 11029100161930,
                },
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "0f250dfef4b0236219db68b36584a49bdcfbf4287001a6a26deaaaec9f7ab11e",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_call",
                },
                {
                  bytes:
                    "3872426bd59e4a61585086e3886d457903b53f22f89e361ea806ffcb07ac719f",
                },
                {
                  symbol: "fees_enabled",
                },
              ],
              data: "void",
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "3872426bd59e4a61585086e3886d457903b53f22f89e361ea806ffcb07ac719f",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_return",
                },
                {
                  symbol: "fees_enabled",
                },
              ],
              data: {
                bool: false,
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "0f250dfef4b0236219db68b36584a49bdcfbf4287001a6a26deaaaec9f7ab11e",
          type_: "contract",
          body: {
            v0: {
              topics: [
                {
                  symbol: "mint",
                },
                {
                  address:
                    "CAHSKDP66SYCGYQZ3NULGZMEUSN5Z67UFBYADJVCNXVKV3E7PKYR5PQ4",
                },
                {
                  address:
                    "GCDSVTMSWEDLNVDDEDR3WLIKZ6NFHTKZXXAYQ4WLEFA7U2KWE3WQAB76",
                },
              ],
              data: {
                i128: {
                  hi: 0,
                  lo: 4197073258,
                },
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "0f250dfef4b0236219db68b36584a49bdcfbf4287001a6a26deaaaec9f7ab11e",
          type_: "contract",
          body: {
            v0: {
              topics: [
                {
                  string: "SoroswapPair",
                },
                {
                  symbol: "sync",
                },
              ],
              data: {
                map: [
                  {
                    key: {
                      symbol: "new_reserve_0",
                    },
                    val: {
                      i128: {
                        hi: 0,
                        lo: 16704822843,
                      },
                    },
                  },
                  {
                    key: {
                      symbol: "new_reserve_1",
                    },
                    val: {
                      i128: {
                        hi: 0,
                        lo: 11029100161930,
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "0f250dfef4b0236219db68b36584a49bdcfbf4287001a6a26deaaaec9f7ab11e",
          type_: "contract",
          body: {
            v0: {
              topics: [
                {
                  string: "SoroswapPair",
                },
                {
                  symbol: "deposit",
                },
              ],
              data: {
                map: [
                  {
                    key: {
                      symbol: "amount_0",
                    },
                    val: {
                      i128: {
                        hi: 0,
                        lo: 166029636,
                      },
                    },
                  },
                  {
                    key: {
                      symbol: "amount_1",
                    },
                    val: {
                      i128: {
                        hi: 0,
                        lo: 109618491767,
                      },
                    },
                  },
                  {
                    key: {
                      symbol: "liquidity",
                    },
                    val: {
                      i128: {
                        hi: 0,
                        lo: 4197073258,
                      },
                    },
                  },
                  {
                    key: {
                      symbol: "new_reserve_0",
                    },
                    val: {
                      i128: {
                        hi: 0,
                        lo: 16704822843,
                      },
                    },
                  },
                  {
                    key: {
                      symbol: "new_reserve_1",
                    },
                    val: {
                      i128: {
                        hi: 0,
                        lo: 11029100161930,
                      },
                    },
                  },
                  {
                    key: {
                      symbol: "to",
                    },
                    val: {
                      address:
                        "GCDSVTMSWEDLNVDDEDR3WLIKZ6NFHTKZXXAYQ4WLEFA7U2KWE3WQAB76",
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "0f250dfef4b0236219db68b36584a49bdcfbf4287001a6a26deaaaec9f7ab11e",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_return",
                },
                {
                  symbol: "deposit",
                },
              ],
              data: {
                i128: {
                  hi: 0,
                  lo: 4197073258,
                },
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "0dd5c710ea6a4a23b32207fd130eadf9c9ce899f4308e93e4ffe53fbaf108a04",
          type_: "contract",
          body: {
            v0: {
              topics: [
                {
                  string: "SoroswapRouter",
                },
                {
                  symbol: "add",
                },
              ],
              data: {
                map: [
                  {
                    key: {
                      symbol: "amount_a",
                    },
                    val: {
                      i128: {
                        hi: 0,
                        lo: 166029636,
                      },
                    },
                  },
                  {
                    key: {
                      symbol: "amount_b",
                    },
                    val: {
                      i128: {
                        hi: 0,
                        lo: 109618491767,
                      },
                    },
                  },
                  {
                    key: {
                      symbol: "liquidity",
                    },
                    val: {
                      i128: {
                        hi: 0,
                        lo: 4197073258,
                      },
                    },
                  },
                  {
                    key: {
                      symbol: "pair",
                    },
                    val: {
                      address:
                        "CAHSKDP66SYCGYQZ3NULGZMEUSN5Z67UFBYADJVCNXVKV3E7PKYR5PQ4",
                    },
                  },
                  {
                    key: {
                      symbol: "to",
                    },
                    val: {
                      address:
                        "GCDSVTMSWEDLNVDDEDR3WLIKZ6NFHTKZXXAYQ4WLEFA7U2KWE3WQAB76",
                    },
                  },
                  {
                    key: {
                      symbol: "token_a",
                    },
                    val: {
                      address:
                        "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                    },
                  },
                  {
                    key: {
                      symbol: "token_b",
                    },
                    val: {
                      address:
                        "CCN2LGXV7U3LLRQNAXGPQ7XK2JT2PGMUFOLDZTSLFCKNUXE3QVYEC3PF",
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "0dd5c710ea6a4a23b32207fd130eadf9c9ce899f4308e93e4ffe53fbaf108a04",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_return",
                },
                {
                  symbol: "add_liquidity",
                },
              ],
              data: {
                vec: [
                  {
                    i128: {
                      hi: 0,
                      lo: 166029636,
                    },
                  },
                  {
                    i128: {
                      hi: 0,
                      lo: 109618491767,
                    },
                  },
                  {
                    i128: {
                      hi: 0,
                      lo: 4197073258,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "read_entry",
                },
              ],
              data: {
                u64: 14,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "write_entry",
                },
              ],
              data: {
                u64: 6,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "ledger_read_byte",
                },
              ],
              data: {
                u64: 74728,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "ledger_write_byte",
                },
              ],
              data: {
                u64: 1440,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "read_key_byte",
                },
              ],
              data: {
                u64: 992,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "write_key_byte",
                },
              ],
              data: {
                u64: 0,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "read_data_byte",
                },
              ],
              data: {
                u64: 2864,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "write_data_byte",
                },
              ],
              data: {
                u64: 1440,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "read_code_byte",
                },
              ],
              data: {
                u64: 71864,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "write_code_byte",
                },
              ],
              data: {
                u64: 0,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "emit_event",
                },
              ],
              data: {
                u64: 6,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "emit_event_byte",
                },
              ],
              data: {
                u64: 1568,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "cpu_insn",
                },
              ],
              data: {
                u64: 12000880,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "mem_byte",
                },
              ],
              data: {
                u64: 8135088,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "invoke_time_nsecs",
                },
              ],
              data: {
                u64: 1504484,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "max_rw_key_byte",
                },
              ],
              data: {
                u64: 180,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "max_rw_data_byte",
                },
              ],
              data: {
                u64: 508,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "max_rw_code_byte",
                },
              ],
              data: {
                u64: 34356,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "max_emit_event_byte",
                },
              ],
              data: {
                u64: 432,
              },
            },
          },
        },
      },
    ],
    ledger: 57788998,
    createdAt: "1751301423",
  },
};
export const TX_ST_CHANGE_SOROSWAP_REMOVE_LIQUIDITY = {
  jsonrpc: "2.0",
  id: 1,
  result: {
    latestLedger: 57819687,
    latestLedgerCloseTime: "1751474907",
    oldestLedger: 57698728,
    oldestLedgerCloseTime: "1750790235",
    status: "SUCCESS",
    txHash: "67434f361a86f21adbdbb4d42841b772b901a0c4581eb744bb5b5bde6d92e267",
    applicationOrder: 181,
    feeBump: false,
    envelopeJson: {
      tx: {
        tx: {
          source_account:
            "GACKMEZIHGXX6FKCPUXY7ZMKBSRZLWFCYN3CKEMGS5P3WUG7YZRYI3WW",
          fee: 486820,
          seq_num: 226445068280529150,
          cond: {
            time: {
              min_time: 0,
              max_time: 0,
            },
          },
          memo: "none",
          operations: [
            {
              source_account: null,
              body: {
                invoke_host_function: {
                  host_function: {
                    invoke_contract: {
                      contract_address:
                        "CAG5LRYQ5JVEUI5TEID72EYOVX44TTUJT5BQR2J6J77FH65PCCFAJDDH",
                      function_name: "remove_liquidity",
                      args: [
                        {
                          address:
                            "CB226ZOEYXTBPD3QEGABTJYSKZVBP2PASEISLG3SBMTN5CE4QZUVZ3CE",
                        },
                        {
                          address:
                            "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
                        },
                        {
                          i128: {
                            hi: 0,
                            lo: 25295525632,
                          },
                        },
                        {
                          i128: {
                            hi: 0,
                            lo: 24976433359,
                          },
                        },
                        {
                          i128: {
                            hi: 0,
                            lo: 25121000298,
                          },
                        },
                        {
                          address:
                            "GACKMEZIHGXX6FKCPUXY7ZMKBSRZLWFCYN3CKEMGS5P3WUG7YZRYI3WW",
                        },
                        {
                          u64: 14067725096655520000,
                        },
                      ],
                    },
                  },
                  auth: [
                    {
                      credentials: "source_account",
                      root_invocation: {
                        function: {
                          contract_fn: {
                            contract_address:
                              "CAG5LRYQ5JVEUI5TEID72EYOVX44TTUJT5BQR2J6J77FH65PCCFAJDDH",
                            function_name: "remove_liquidity",
                            args: [
                              {
                                address:
                                  "CB226ZOEYXTBPD3QEGABTJYSKZVBP2PASEISLG3SBMTN5CE4QZUVZ3CE",
                              },
                              {
                                address:
                                  "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
                              },
                              {
                                i128: {
                                  hi: 0,
                                  lo: 25295525632,
                                },
                              },
                              {
                                i128: {
                                  hi: 0,
                                  lo: 24976433359,
                                },
                              },
                              {
                                i128: {
                                  hi: 0,
                                  lo: 25121000298,
                                },
                              },
                              {
                                address:
                                  "GACKMEZIHGXX6FKCPUXY7ZMKBSRZLWFCYN3CKEMGS5P3WUG7YZRYI3WW",
                              },
                              {
                                u64: 14067725096655520000,
                              },
                            ],
                          },
                        },
                        sub_invocations: [
                          {
                            function: {
                              contract_fn: {
                                contract_address:
                                  "CCYPLDHUEYWJEOIZJTXUH56NLIQLKYGR5H2BEFQMBYG5IC3G52QF4WVD",
                                function_name: "transfer",
                                args: [
                                  {
                                    address:
                                      "GACKMEZIHGXX6FKCPUXY7ZMKBSRZLWFCYN3CKEMGS5P3WUG7YZRYI3WW",
                                  },
                                  {
                                    address:
                                      "CCYPLDHUEYWJEOIZJTXUH56NLIQLKYGR5H2BEFQMBYG5IC3G52QF4WVD",
                                  },
                                  {
                                    i128: {
                                      hi: 0,
                                      lo: 25295525632,
                                    },
                                  },
                                ],
                              },
                            },
                            sub_invocations: [],
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            },
          ],
          ext: {
            v1: {
              ext: "v0",
              resources: {
                footprint: {
                  read_only: [
                    {
                      contract_data: {
                        contract:
                          "CAG5LRYQ5JVEUI5TEID72EYOVX44TTUJT5BQR2J6J77FH65PCCFAJDDH",
                        key: "ledger_key_contract_instance",
                        durability: "persistent",
                      },
                    },
                    {
                      contract_data: {
                        contract:
                          "CA4HEQTL2WPEUYKYKCDOHCDNIV4QHNJ7EL4J4NQ6VADP7SYHVRYZ7AW2",
                        key: {
                          vec: [
                            {
                              symbol: "PairAddressesByTokens",
                            },
                            {
                              vec: [
                                {
                                  address:
                                    "CB226ZOEYXTBPD3QEGABTJYSKZVBP2PASEISLG3SBMTN5CE4QZUVZ3CE",
                                },
                                {
                                  address:
                                    "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
                                },
                              ],
                            },
                          ],
                        },
                        durability: "persistent",
                      },
                    },
                    {
                      contract_data: {
                        contract:
                          "CA4HEQTL2WPEUYKYKCDOHCDNIV4QHNJ7EL4J4NQ6VADP7SYHVRYZ7AW2",
                        key: "ledger_key_contract_instance",
                        durability: "persistent",
                      },
                    },
                    {
                      contract_data: {
                        contract:
                          "CB226ZOEYXTBPD3QEGABTJYSKZVBP2PASEISLG3SBMTN5CE4QZUVZ3CE",
                        key: "ledger_key_contract_instance",
                        durability: "persistent",
                      },
                    },
                    {
                      contract_data: {
                        contract:
                          "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
                        key: "ledger_key_contract_instance",
                        durability: "persistent",
                      },
                    },
                    {
                      contract_code: {
                        hash: "18051456816b66f12e773a56f77c5794fac1b1fb7ab6e22d4fad5a412770f73e",
                      },
                    },
                    {
                      contract_code: {
                        hash: "4c3db3ebd2d6a2ab23de1f622eaabb39501539b4611b68622ec4e47f76c4ba07",
                      },
                    },
                    {
                      contract_code: {
                        hash: "5db738b05d9148128a240b0e2c1cb935c2805192bf98a579421aacda364c8dae",
                      },
                    },
                  ],
                  read_write: [
                    {
                      trustline: {
                        account_id:
                          "GACKMEZIHGXX6FKCPUXY7ZMKBSRZLWFCYN3CKEMGS5P3WUG7YZRYI3WW",
                        asset: {
                          credit_alphanum4: {
                            asset_code: "USDC",
                            issuer:
                              "GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN",
                          },
                        },
                      },
                    },
                    {
                      trustline: {
                        account_id:
                          "GACKMEZIHGXX6FKCPUXY7ZMKBSRZLWFCYN3CKEMGS5P3WUG7YZRYI3WW",
                        asset: {
                          credit_alphanum12: {
                            asset_code: "USDGLO",
                            issuer:
                              "GBBS25EGYQPGEZCGCFBKG4OAGFXU6DSOQBGTHELLJT3HZXZJ34HWS6XV",
                          },
                        },
                      },
                    },
                    {
                      contract_data: {
                        contract:
                          "CB226ZOEYXTBPD3QEGABTJYSKZVBP2PASEISLG3SBMTN5CE4QZUVZ3CE",
                        key: {
                          vec: [
                            {
                              symbol: "Balance",
                            },
                            {
                              address:
                                "CCYPLDHUEYWJEOIZJTXUH56NLIQLKYGR5H2BEFQMBYG5IC3G52QF4WVD",
                            },
                          ],
                        },
                        durability: "persistent",
                      },
                    },
                    {
                      contract_data: {
                        contract:
                          "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
                        key: {
                          vec: [
                            {
                              symbol: "Balance",
                            },
                            {
                              address:
                                "CCYPLDHUEYWJEOIZJTXUH56NLIQLKYGR5H2BEFQMBYG5IC3G52QF4WVD",
                            },
                          ],
                        },
                        durability: "persistent",
                      },
                    },
                    {
                      contract_data: {
                        contract:
                          "CCYPLDHUEYWJEOIZJTXUH56NLIQLKYGR5H2BEFQMBYG5IC3G52QF4WVD",
                        key: {
                          vec: [
                            {
                              symbol: "Balance",
                            },
                            {
                              address:
                                "GACKMEZIHGXX6FKCPUXY7ZMKBSRZLWFCYN3CKEMGS5P3WUG7YZRYI3WW",
                            },
                          ],
                        },
                        durability: "persistent",
                      },
                    },
                    {
                      contract_data: {
                        contract:
                          "CCYPLDHUEYWJEOIZJTXUH56NLIQLKYGR5H2BEFQMBYG5IC3G52QF4WVD",
                        key: {
                          vec: [
                            {
                              symbol: "Balance",
                            },
                            {
                              address:
                                "CCYPLDHUEYWJEOIZJTXUH56NLIQLKYGR5H2BEFQMBYG5IC3G52QF4WVD",
                            },
                          ],
                        },
                        durability: "persistent",
                      },
                    },
                    {
                      contract_data: {
                        contract:
                          "CCYPLDHUEYWJEOIZJTXUH56NLIQLKYGR5H2BEFQMBYG5IC3G52QF4WVD",
                        key: "ledger_key_contract_instance",
                        durability: "persistent",
                      },
                    },
                  ],
                },
                instructions: 12979113,
                read_bytes: 75024,
                write_bytes: 1492,
              },
              resource_fee: 485820,
            },
          },
        },
        signatures: [
          {
            hint: "dfc66384",
            signature:
              "f49275877462ac518d5d79b00944b6dd34b92c74eaa76fefa129b23cdda25c9b62dd87f1dc162c265b669e5591622ce8a02008c68a6a3a1d07193ebc6068a60f",
          },
        ],
      },
    },
    resultJson: {
      fee_charged: 401147,
      result: {
        tx_success: [
          {
            op_inner: {
              invoke_host_function: {
                success:
                  "9b5f1ffb94ed5a75706cfebaea5239b6e88a610a8ee8c1dc092d99f9c29469e9",
              },
            },
          },
        ],
      },
      ext: "v0",
    },
    resultMetaJson: {
      v3: {
        ext: "v0",
        tx_changes_before: [
          {
            state: {
              last_modified_ledger_seq: 57792874,
              data: {
                account: {
                  account_id:
                    "GACKMEZIHGXX6FKCPUXY7ZMKBSRZLWFCYN3CKEMGS5P3WUG7YZRYI3WW",
                  balance: 9362610171,
                  seq_num: 226445068280529150,
                  num_sub_entries: 8,
                  inflation_dest: null,
                  flags: 0,
                  home_domain: "",
                  thresholds: "01000000",
                  signers: [],
                  ext: {
                    v1: {
                      liabilities: {
                        buying: 0,
                        selling: 0,
                      },
                      ext: {
                        v2: {
                          num_sponsored: 0,
                          num_sponsoring: 0,
                          signer_sponsoring_i_ds: [],
                          ext: {
                            v3: {
                              ext: "v0",
                              seq_ledger: 57792819,
                              seq_time: 1751323189,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              ext: "v0",
            },
          },
          {
            updated: {
              last_modified_ledger_seq: 57792874,
              data: {
                account: {
                  account_id:
                    "GACKMEZIHGXX6FKCPUXY7ZMKBSRZLWFCYN3CKEMGS5P3WUG7YZRYI3WW",
                  balance: 9362610171,
                  seq_num: 226445068280529150,
                  num_sub_entries: 8,
                  inflation_dest: null,
                  flags: 0,
                  home_domain: "",
                  thresholds: "01000000",
                  signers: [],
                  ext: {
                    v1: {
                      liabilities: {
                        buying: 0,
                        selling: 0,
                      },
                      ext: {
                        v2: {
                          num_sponsored: 0,
                          num_sponsoring: 0,
                          signer_sponsoring_i_ds: [],
                          ext: {
                            v3: {
                              ext: "v0",
                              seq_ledger: 57792874,
                              seq_time: 1751323502,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              ext: "v0",
            },
          },
        ],
        operations: [
          {
            changes: [
              {
                state: {
                  last_modified_ledger_seq: 57792703,
                  data: {
                    contract_data: {
                      ext: "v0",
                      contract:
                        "CCYPLDHUEYWJEOIZJTXUH56NLIQLKYGR5H2BEFQMBYG5IC3G52QF4WVD",
                      key: "ledger_key_contract_instance",
                      durability: "persistent",
                      val: {
                        contract_instance: {
                          executable: {
                            wasm: "18051456816b66f12e773a56f77c5794fac1b1fb7ab6e22d4fad5a412770f73e",
                          },
                          storage: [
                            {
                              key: {
                                u32: 0,
                              },
                              val: {
                                address:
                                  "CB226ZOEYXTBPD3QEGABTJYSKZVBP2PASEISLG3SBMTN5CE4QZUVZ3CE",
                              },
                            },
                            {
                              key: {
                                u32: 1,
                              },
                              val: {
                                address:
                                  "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
                              },
                            },
                            {
                              key: {
                                u32: 2,
                              },
                              val: {
                                i128: {
                                  hi: 0,
                                  lo: 50457442126,
                                },
                              },
                            },
                            {
                              key: {
                                u32: 3,
                              },
                              val: {
                                i128: {
                                  hi: 0,
                                  lo: 50749496554,
                                },
                              },
                            },
                            {
                              key: {
                                u32: 4,
                              },
                              val: {
                                address:
                                  "CA4HEQTL2WPEUYKYKCDOHCDNIV4QHNJ7EL4J4NQ6VADP7SYHVRYZ7AW2",
                              },
                            },
                            {
                              key: {
                                symbol: "METADATA",
                              },
                              val: {
                                map: [
                                  {
                                    key: {
                                      symbol: "decimal",
                                    },
                                    val: {
                                      u32: 7,
                                    },
                                  },
                                  {
                                    key: {
                                      symbol: "name",
                                    },
                                    val: {
                                      string: "USDGLO-USDC Soroswap LP Token",
                                    },
                                  },
                                  {
                                    key: {
                                      symbol: "symbol",
                                    },
                                    val: {
                                      string: "USDGLO-USDC-SOROSWAP-LP",
                                    },
                                  },
                                ],
                              },
                            },
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "TotalSupply",
                                  },
                                ],
                              },
                              val: {
                                i128: {
                                  hi: 0,
                                  lo: 50591052264,
                                },
                              },
                            },
                          ],
                        },
                      },
                    },
                  },
                  ext: "v0",
                },
              },
              {
                updated: {
                  last_modified_ledger_seq: 57792874,
                  data: {
                    contract_data: {
                      ext: "v0",
                      contract:
                        "CCYPLDHUEYWJEOIZJTXUH56NLIQLKYGR5H2BEFQMBYG5IC3G52QF4WVD",
                      key: "ledger_key_contract_instance",
                      durability: "persistent",
                      val: {
                        contract_instance: {
                          executable: {
                            wasm: "18051456816b66f12e773a56f77c5794fac1b1fb7ab6e22d4fad5a412770f73e",
                          },
                          storage: [
                            {
                              key: {
                                u32: 0,
                              },
                              val: {
                                address:
                                  "CB226ZOEYXTBPD3QEGABTJYSKZVBP2PASEISLG3SBMTN5CE4QZUVZ3CE",
                              },
                            },
                            {
                              key: {
                                u32: 1,
                              },
                              val: {
                                address:
                                  "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
                              },
                            },
                            {
                              key: {
                                u32: 2,
                              },
                              val: {
                                i128: {
                                  hi: 0,
                                  lo: 25228721562,
                                },
                              },
                            },
                            {
                              key: {
                                u32: 3,
                              },
                              val: {
                                i128: {
                                  hi: 0,
                                  lo: 25374748779,
                                },
                              },
                            },
                            {
                              key: {
                                u32: 4,
                              },
                              val: {
                                address:
                                  "CA4HEQTL2WPEUYKYKCDOHCDNIV4QHNJ7EL4J4NQ6VADP7SYHVRYZ7AW2",
                              },
                            },
                            {
                              key: {
                                symbol: "METADATA",
                              },
                              val: {
                                map: [
                                  {
                                    key: {
                                      symbol: "decimal",
                                    },
                                    val: {
                                      u32: 7,
                                    },
                                  },
                                  {
                                    key: {
                                      symbol: "name",
                                    },
                                    val: {
                                      string: "USDGLO-USDC Soroswap LP Token",
                                    },
                                  },
                                  {
                                    key: {
                                      symbol: "symbol",
                                    },
                                    val: {
                                      string: "USDGLO-USDC-SOROSWAP-LP",
                                    },
                                  },
                                ],
                              },
                            },
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "TotalSupply",
                                  },
                                ],
                              },
                              val: {
                                i128: {
                                  hi: 0,
                                  lo: 25295526632,
                                },
                              },
                            },
                          ],
                        },
                      },
                    },
                  },
                  ext: "v0",
                },
              },
              {
                state: {
                  last_modified_ledger_seq: 57792703,
                  data: {
                    contract_data: {
                      ext: "v0",
                      contract:
                        "CCYPLDHUEYWJEOIZJTXUH56NLIQLKYGR5H2BEFQMBYG5IC3G52QF4WVD",
                      key: {
                        vec: [
                          {
                            symbol: "Balance",
                          },
                          {
                            address:
                              "CCYPLDHUEYWJEOIZJTXUH56NLIQLKYGR5H2BEFQMBYG5IC3G52QF4WVD",
                          },
                        ],
                      },
                      durability: "persistent",
                      val: {
                        i128: {
                          hi: 0,
                          lo: 1000,
                        },
                      },
                    },
                  },
                  ext: "v0",
                },
              },
              {
                updated: {
                  last_modified_ledger_seq: 57792874,
                  data: {
                    contract_data: {
                      ext: "v0",
                      contract:
                        "CCYPLDHUEYWJEOIZJTXUH56NLIQLKYGR5H2BEFQMBYG5IC3G52QF4WVD",
                      key: {
                        vec: [
                          {
                            symbol: "Balance",
                          },
                          {
                            address:
                              "CCYPLDHUEYWJEOIZJTXUH56NLIQLKYGR5H2BEFQMBYG5IC3G52QF4WVD",
                          },
                        ],
                      },
                      durability: "persistent",
                      val: {
                        i128: {
                          hi: 0,
                          lo: 1000,
                        },
                      },
                    },
                  },
                  ext: "v0",
                },
              },
              {
                state: {
                  last_modified_ledger_seq: 57792703,
                  data: {
                    contract_data: {
                      ext: "v0",
                      contract:
                        "CCYPLDHUEYWJEOIZJTXUH56NLIQLKYGR5H2BEFQMBYG5IC3G52QF4WVD",
                      key: {
                        vec: [
                          {
                            symbol: "Balance",
                          },
                          {
                            address:
                              "GACKMEZIHGXX6FKCPUXY7ZMKBSRZLWFCYN3CKEMGS5P3WUG7YZRYI3WW",
                          },
                        ],
                      },
                      durability: "persistent",
                      val: {
                        i128: {
                          hi: 0,
                          lo: 50591051264,
                        },
                      },
                    },
                  },
                  ext: "v0",
                },
              },
              {
                updated: {
                  last_modified_ledger_seq: 57792874,
                  data: {
                    contract_data: {
                      ext: "v0",
                      contract:
                        "CCYPLDHUEYWJEOIZJTXUH56NLIQLKYGR5H2BEFQMBYG5IC3G52QF4WVD",
                      key: {
                        vec: [
                          {
                            symbol: "Balance",
                          },
                          {
                            address:
                              "GACKMEZIHGXX6FKCPUXY7ZMKBSRZLWFCYN3CKEMGS5P3WUG7YZRYI3WW",
                          },
                        ],
                      },
                      durability: "persistent",
                      val: {
                        i128: {
                          hi: 0,
                          lo: 25295525632,
                        },
                      },
                    },
                  },
                  ext: "v0",
                },
              },
              {
                state: {
                  last_modified_ledger_seq: 57792703,
                  data: {
                    contract_data: {
                      ext: "v0",
                      contract:
                        "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
                      key: {
                        vec: [
                          {
                            symbol: "Balance",
                          },
                          {
                            address:
                              "CCYPLDHUEYWJEOIZJTXUH56NLIQLKYGR5H2BEFQMBYG5IC3G52QF4WVD",
                          },
                        ],
                      },
                      durability: "persistent",
                      val: {
                        map: [
                          {
                            key: {
                              symbol: "amount",
                            },
                            val: {
                              i128: {
                                hi: 0,
                                lo: 50749496554,
                              },
                            },
                          },
                          {
                            key: {
                              symbol: "authorized",
                            },
                            val: {
                              bool: true,
                            },
                          },
                          {
                            key: {
                              symbol: "clawback",
                            },
                            val: {
                              bool: false,
                            },
                          },
                        ],
                      },
                    },
                  },
                  ext: "v0",
                },
              },
              {
                updated: {
                  last_modified_ledger_seq: 57792874,
                  data: {
                    contract_data: {
                      ext: "v0",
                      contract:
                        "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
                      key: {
                        vec: [
                          {
                            symbol: "Balance",
                          },
                          {
                            address:
                              "CCYPLDHUEYWJEOIZJTXUH56NLIQLKYGR5H2BEFQMBYG5IC3G52QF4WVD",
                          },
                        ],
                      },
                      durability: "persistent",
                      val: {
                        map: [
                          {
                            key: {
                              symbol: "amount",
                            },
                            val: {
                              i128: {
                                hi: 0,
                                lo: 25374748779,
                              },
                            },
                          },
                          {
                            key: {
                              symbol: "authorized",
                            },
                            val: {
                              bool: true,
                            },
                          },
                          {
                            key: {
                              symbol: "clawback",
                            },
                            val: {
                              bool: false,
                            },
                          },
                        ],
                      },
                    },
                  },
                  ext: "v0",
                },
              },
              {
                state: {
                  last_modified_ledger_seq: 57792703,
                  data: {
                    contract_data: {
                      ext: "v0",
                      contract:
                        "CB226ZOEYXTBPD3QEGABTJYSKZVBP2PASEISLG3SBMTN5CE4QZUVZ3CE",
                      key: {
                        vec: [
                          {
                            symbol: "Balance",
                          },
                          {
                            address:
                              "CCYPLDHUEYWJEOIZJTXUH56NLIQLKYGR5H2BEFQMBYG5IC3G52QF4WVD",
                          },
                        ],
                      },
                      durability: "persistent",
                      val: {
                        map: [
                          {
                            key: {
                              symbol: "amount",
                            },
                            val: {
                              i128: {
                                hi: 0,
                                lo: 50457442126,
                              },
                            },
                          },
                          {
                            key: {
                              symbol: "authorized",
                            },
                            val: {
                              bool: true,
                            },
                          },
                          {
                            key: {
                              symbol: "clawback",
                            },
                            val: {
                              bool: true,
                            },
                          },
                        ],
                      },
                    },
                  },
                  ext: "v0",
                },
              },
              {
                updated: {
                  last_modified_ledger_seq: 57792874,
                  data: {
                    contract_data: {
                      ext: "v0",
                      contract:
                        "CB226ZOEYXTBPD3QEGABTJYSKZVBP2PASEISLG3SBMTN5CE4QZUVZ3CE",
                      key: {
                        vec: [
                          {
                            symbol: "Balance",
                          },
                          {
                            address:
                              "CCYPLDHUEYWJEOIZJTXUH56NLIQLKYGR5H2BEFQMBYG5IC3G52QF4WVD",
                          },
                        ],
                      },
                      durability: "persistent",
                      val: {
                        map: [
                          {
                            key: {
                              symbol: "amount",
                            },
                            val: {
                              i128: {
                                hi: 0,
                                lo: 25228721562,
                              },
                            },
                          },
                          {
                            key: {
                              symbol: "authorized",
                            },
                            val: {
                              bool: true,
                            },
                          },
                          {
                            key: {
                              symbol: "clawback",
                            },
                            val: {
                              bool: true,
                            },
                          },
                        ],
                      },
                    },
                  },
                  ext: "v0",
                },
              },
              {
                state: {
                  last_modified_ledger_seq: 57792769,
                  data: {
                    trustline: {
                      account_id:
                        "GACKMEZIHGXX6FKCPUXY7ZMKBSRZLWFCYN3CKEMGS5P3WUG7YZRYI3WW",
                      asset: {
                        credit_alphanum12: {
                          asset_code: "USDGLO",
                          issuer:
                            "GBBS25EGYQPGEZCGCFBKG4OAGFXU6DSOQBGTHELLJT3HZXZJ34HWS6XV",
                        },
                      },
                      balance: 457441128,
                      limit: 9223372036854776000,
                      flags: 5,
                      ext: "v0",
                    },
                  },
                  ext: "v0",
                },
              },
              {
                updated: {
                  last_modified_ledger_seq: 57792874,
                  data: {
                    trustline: {
                      account_id:
                        "GACKMEZIHGXX6FKCPUXY7ZMKBSRZLWFCYN3CKEMGS5P3WUG7YZRYI3WW",
                      asset: {
                        credit_alphanum12: {
                          asset_code: "USDGLO",
                          issuer:
                            "GBBS25EGYQPGEZCGCFBKG4OAGFXU6DSOQBGTHELLJT3HZXZJ34HWS6XV",
                        },
                      },
                      balance: 25686161692,
                      limit: 9223372036854776000,
                      flags: 5,
                      ext: "v0",
                    },
                  },
                  ext: "v0",
                },
              },
              {
                state: {
                  last_modified_ledger_seq: 57792807,
                  data: {
                    trustline: {
                      account_id:
                        "GACKMEZIHGXX6FKCPUXY7ZMKBSRZLWFCYN3CKEMGS5P3WUG7YZRYI3WW",
                      asset: {
                        credit_alphanum4: {
                          asset_code: "USDC",
                          issuer:
                            "GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN",
                        },
                      },
                      balance: 32807249711,
                      limit: 9223372036854776000,
                      flags: 1,
                      ext: "v0",
                    },
                  },
                  ext: "v0",
                },
              },
              {
                updated: {
                  last_modified_ledger_seq: 57792874,
                  data: {
                    trustline: {
                      account_id:
                        "GACKMEZIHGXX6FKCPUXY7ZMKBSRZLWFCYN3CKEMGS5P3WUG7YZRYI3WW",
                      asset: {
                        credit_alphanum4: {
                          asset_code: "USDC",
                          issuer:
                            "GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN",
                        },
                      },
                      balance: 58181997486,
                      limit: 9223372036854776000,
                      flags: 1,
                      ext: "v0",
                    },
                  },
                  ext: "v0",
                },
              },
            ],
          },
        ],
        tx_changes_after: [
          {
            state: {
              last_modified_ledger_seq: 57792874,
              data: {
                account: {
                  account_id:
                    "GACKMEZIHGXX6FKCPUXY7ZMKBSRZLWFCYN3CKEMGS5P3WUG7YZRYI3WW",
                  balance: 9362610171,
                  seq_num: 226445068280529150,
                  num_sub_entries: 8,
                  inflation_dest: null,
                  flags: 0,
                  home_domain: "",
                  thresholds: "01000000",
                  signers: [],
                  ext: {
                    v1: {
                      liabilities: {
                        buying: 0,
                        selling: 0,
                      },
                      ext: {
                        v2: {
                          num_sponsored: 0,
                          num_sponsoring: 0,
                          signer_sponsoring_i_ds: [],
                          ext: {
                            v3: {
                              ext: "v0",
                              seq_ledger: 57792874,
                              seq_time: 1751323502,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              ext: "v0",
            },
          },
          {
            updated: {
              last_modified_ledger_seq: 57792874,
              data: {
                account: {
                  account_id:
                    "GACKMEZIHGXX6FKCPUXY7ZMKBSRZLWFCYN3CKEMGS5P3WUG7YZRYI3WW",
                  balance: 9362694944,
                  seq_num: 226445068280529150,
                  num_sub_entries: 8,
                  inflation_dest: null,
                  flags: 0,
                  home_domain: "",
                  thresholds: "01000000",
                  signers: [],
                  ext: {
                    v1: {
                      liabilities: {
                        buying: 0,
                        selling: 0,
                      },
                      ext: {
                        v2: {
                          num_sponsored: 0,
                          num_sponsoring: 0,
                          signer_sponsoring_i_ds: [],
                          ext: {
                            v3: {
                              ext: "v0",
                              seq_ledger: 57792874,
                              seq_time: 1751323502,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              ext: "v0",
            },
          },
        ],
        soroban_meta: {
          ext: {
            v1: {
              ext: "v0",
              total_non_refundable_resource_fee_charged: 383351,
              total_refundable_resource_fee_charged: 17696,
              rent_fee_charged: 0,
            },
          },
          events: [
            {
              ext: "v0",
              contract_id:
                "b0f58cf4262c9239194cef43f7cd5a20b560d1e9f412160c0e0dd40b66eea05e",
              type_: "contract",
              body: {
                v0: {
                  topics: [
                    {
                      symbol: "transfer",
                    },
                    {
                      address:
                        "GACKMEZIHGXX6FKCPUXY7ZMKBSRZLWFCYN3CKEMGS5P3WUG7YZRYI3WW",
                    },
                    {
                      address:
                        "CCYPLDHUEYWJEOIZJTXUH56NLIQLKYGR5H2BEFQMBYG5IC3G52QF4WVD",
                    },
                  ],
                  data: {
                    i128: {
                      hi: 0,
                      lo: 25295525632,
                    },
                  },
                },
              },
            },
            {
              ext: "v0",
              contract_id:
                "b0f58cf4262c9239194cef43f7cd5a20b560d1e9f412160c0e0dd40b66eea05e",
              type_: "contract",
              body: {
                v0: {
                  topics: [
                    {
                      symbol: "burn",
                    },
                    {
                      address:
                        "CCYPLDHUEYWJEOIZJTXUH56NLIQLKYGR5H2BEFQMBYG5IC3G52QF4WVD",
                    },
                  ],
                  data: {
                    i128: {
                      hi: 0,
                      lo: 25295525632,
                    },
                  },
                },
              },
            },
            {
              ext: "v0",
              contract_id:
                "75af65c4c5e6178f70218019a712566a17e9e09111259b720b26de889c86695c",
              type_: "contract",
              body: {
                v0: {
                  topics: [
                    {
                      symbol: "transfer",
                    },
                    {
                      address:
                        "CCYPLDHUEYWJEOIZJTXUH56NLIQLKYGR5H2BEFQMBYG5IC3G52QF4WVD",
                    },
                    {
                      address:
                        "GACKMEZIHGXX6FKCPUXY7ZMKBSRZLWFCYN3CKEMGS5P3WUG7YZRYI3WW",
                    },
                    {
                      string:
                        "USDGLO:GBBS25EGYQPGEZCGCFBKG4OAGFXU6DSOQBGTHELLJT3HZXZJ34HWS6XV",
                    },
                  ],
                  data: {
                    i128: {
                      hi: 0,
                      lo: 25228720564,
                    },
                  },
                },
              },
            },
            {
              ext: "v0",
              contract_id:
                "adefce59aee52968f76061d494c2525b75659fa4296a65f499ef29e56477e496",
              type_: "contract",
              body: {
                v0: {
                  topics: [
                    {
                      symbol: "transfer",
                    },
                    {
                      address:
                        "CCYPLDHUEYWJEOIZJTXUH56NLIQLKYGR5H2BEFQMBYG5IC3G52QF4WVD",
                    },
                    {
                      address:
                        "GACKMEZIHGXX6FKCPUXY7ZMKBSRZLWFCYN3CKEMGS5P3WUG7YZRYI3WW",
                    },
                    {
                      string:
                        "USDC:GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN",
                    },
                  ],
                  data: {
                    i128: {
                      hi: 0,
                      lo: 25374747775,
                    },
                  },
                },
              },
            },
            {
              ext: "v0",
              contract_id:
                "b0f58cf4262c9239194cef43f7cd5a20b560d1e9f412160c0e0dd40b66eea05e",
              type_: "contract",
              body: {
                v0: {
                  topics: [
                    {
                      string: "SoroswapPair",
                    },
                    {
                      symbol: "sync",
                    },
                  ],
                  data: {
                    map: [
                      {
                        key: {
                          symbol: "new_reserve_0",
                        },
                        val: {
                          i128: {
                            hi: 0,
                            lo: 25228721562,
                          },
                        },
                      },
                      {
                        key: {
                          symbol: "new_reserve_1",
                        },
                        val: {
                          i128: {
                            hi: 0,
                            lo: 25374748779,
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
            {
              ext: "v0",
              contract_id:
                "b0f58cf4262c9239194cef43f7cd5a20b560d1e9f412160c0e0dd40b66eea05e",
              type_: "contract",
              body: {
                v0: {
                  topics: [
                    {
                      string: "SoroswapPair",
                    },
                    {
                      symbol: "withdraw",
                    },
                  ],
                  data: {
                    map: [
                      {
                        key: {
                          symbol: "amount_0",
                        },
                        val: {
                          i128: {
                            hi: 0,
                            lo: 25228720564,
                          },
                        },
                      },
                      {
                        key: {
                          symbol: "amount_1",
                        },
                        val: {
                          i128: {
                            hi: 0,
                            lo: 25374747775,
                          },
                        },
                      },
                      {
                        key: {
                          symbol: "liquidity",
                        },
                        val: {
                          i128: {
                            hi: 0,
                            lo: 25295525632,
                          },
                        },
                      },
                      {
                        key: {
                          symbol: "new_reserve_0",
                        },
                        val: {
                          i128: {
                            hi: 0,
                            lo: 25228721562,
                          },
                        },
                      },
                      {
                        key: {
                          symbol: "new_reserve_1",
                        },
                        val: {
                          i128: {
                            hi: 0,
                            lo: 25374748779,
                          },
                        },
                      },
                      {
                        key: {
                          symbol: "to",
                        },
                        val: {
                          address:
                            "GACKMEZIHGXX6FKCPUXY7ZMKBSRZLWFCYN3CKEMGS5P3WUG7YZRYI3WW",
                        },
                      },
                    ],
                  },
                },
              },
            },
            {
              ext: "v0",
              contract_id:
                "0dd5c710ea6a4a23b32207fd130eadf9c9ce899f4308e93e4ffe53fbaf108a04",
              type_: "contract",
              body: {
                v0: {
                  topics: [
                    {
                      string: "SoroswapRouter",
                    },
                    {
                      symbol: "remove",
                    },
                  ],
                  data: {
                    map: [
                      {
                        key: {
                          symbol: "amount_a",
                        },
                        val: {
                          i128: {
                            hi: 0,
                            lo: 25228720564,
                          },
                        },
                      },
                      {
                        key: {
                          symbol: "amount_b",
                        },
                        val: {
                          i128: {
                            hi: 0,
                            lo: 25374747775,
                          },
                        },
                      },
                      {
                        key: {
                          symbol: "liquidity",
                        },
                        val: {
                          i128: {
                            hi: 0,
                            lo: 25295525632,
                          },
                        },
                      },
                      {
                        key: {
                          symbol: "pair",
                        },
                        val: {
                          address:
                            "CCYPLDHUEYWJEOIZJTXUH56NLIQLKYGR5H2BEFQMBYG5IC3G52QF4WVD",
                        },
                      },
                      {
                        key: {
                          symbol: "to",
                        },
                        val: {
                          address:
                            "GACKMEZIHGXX6FKCPUXY7ZMKBSRZLWFCYN3CKEMGS5P3WUG7YZRYI3WW",
                        },
                      },
                      {
                        key: {
                          symbol: "token_a",
                        },
                        val: {
                          address:
                            "CB226ZOEYXTBPD3QEGABTJYSKZVBP2PASEISLG3SBMTN5CE4QZUVZ3CE",
                        },
                      },
                      {
                        key: {
                          symbol: "token_b",
                        },
                        val: {
                          address:
                            "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
                        },
                      },
                    ],
                  },
                },
              },
            },
          ],
          return_value: {
            vec: [
              {
                i128: {
                  hi: 0,
                  lo: 25228720564,
                },
              },
              {
                i128: {
                  hi: 0,
                  lo: 25374747775,
                },
              },
            ],
          },
          diagnostic_events: [
            {
              in_successful_contract_call: true,
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
                          "0dd5c710ea6a4a23b32207fd130eadf9c9ce899f4308e93e4ffe53fbaf108a04",
                      },
                      {
                        symbol: "remove_liquidity",
                      },
                    ],
                    data: {
                      vec: [
                        {
                          address:
                            "CB226ZOEYXTBPD3QEGABTJYSKZVBP2PASEISLG3SBMTN5CE4QZUVZ3CE",
                        },
                        {
                          address:
                            "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
                        },
                        {
                          i128: {
                            hi: 0,
                            lo: 25295525632,
                          },
                        },
                        {
                          i128: {
                            hi: 0,
                            lo: 24976433359,
                          },
                        },
                        {
                          i128: {
                            hi: 0,
                            lo: 25121000298,
                          },
                        },
                        {
                          address:
                            "GACKMEZIHGXX6FKCPUXY7ZMKBSRZLWFCYN3CKEMGS5P3WUG7YZRYI3WW",
                        },
                        {
                          u64: 14067725096655520000,
                        },
                      ],
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "0dd5c710ea6a4a23b32207fd130eadf9c9ce899f4308e93e4ffe53fbaf108a04",
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "fn_call",
                      },
                      {
                        bytes:
                          "3872426bd59e4a61585086e3886d457903b53f22f89e361ea806ffcb07ac719f",
                      },
                      {
                        symbol: "pair_exists",
                      },
                    ],
                    data: {
                      vec: [
                        {
                          address:
                            "CB226ZOEYXTBPD3QEGABTJYSKZVBP2PASEISLG3SBMTN5CE4QZUVZ3CE",
                        },
                        {
                          address:
                            "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
                        },
                      ],
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "3872426bd59e4a61585086e3886d457903b53f22f89e361ea806ffcb07ac719f",
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "fn_return",
                      },
                      {
                        symbol: "pair_exists",
                      },
                    ],
                    data: {
                      bool: true,
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "0dd5c710ea6a4a23b32207fd130eadf9c9ce899f4308e93e4ffe53fbaf108a04",
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "fn_call",
                      },
                      {
                        bytes:
                          "b0f58cf4262c9239194cef43f7cd5a20b560d1e9f412160c0e0dd40b66eea05e",
                      },
                      {
                        symbol: "transfer",
                      },
                    ],
                    data: {
                      vec: [
                        {
                          address:
                            "GACKMEZIHGXX6FKCPUXY7ZMKBSRZLWFCYN3CKEMGS5P3WUG7YZRYI3WW",
                        },
                        {
                          address:
                            "CCYPLDHUEYWJEOIZJTXUH56NLIQLKYGR5H2BEFQMBYG5IC3G52QF4WVD",
                        },
                        {
                          i128: {
                            hi: 0,
                            lo: 25295525632,
                          },
                        },
                      ],
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "b0f58cf4262c9239194cef43f7cd5a20b560d1e9f412160c0e0dd40b66eea05e",
                type_: "contract",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "transfer",
                      },
                      {
                        address:
                          "GACKMEZIHGXX6FKCPUXY7ZMKBSRZLWFCYN3CKEMGS5P3WUG7YZRYI3WW",
                      },
                      {
                        address:
                          "CCYPLDHUEYWJEOIZJTXUH56NLIQLKYGR5H2BEFQMBYG5IC3G52QF4WVD",
                      },
                    ],
                    data: {
                      i128: {
                        hi: 0,
                        lo: 25295525632,
                      },
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "b0f58cf4262c9239194cef43f7cd5a20b560d1e9f412160c0e0dd40b66eea05e",
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "fn_return",
                      },
                      {
                        symbol: "transfer",
                      },
                    ],
                    data: "void",
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "0dd5c710ea6a4a23b32207fd130eadf9c9ce899f4308e93e4ffe53fbaf108a04",
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "fn_call",
                      },
                      {
                        bytes:
                          "b0f58cf4262c9239194cef43f7cd5a20b560d1e9f412160c0e0dd40b66eea05e",
                      },
                      {
                        symbol: "withdraw",
                      },
                    ],
                    data: {
                      address:
                        "GACKMEZIHGXX6FKCPUXY7ZMKBSRZLWFCYN3CKEMGS5P3WUG7YZRYI3WW",
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "b0f58cf4262c9239194cef43f7cd5a20b560d1e9f412160c0e0dd40b66eea05e",
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "fn_call",
                      },
                      {
                        bytes:
                          "75af65c4c5e6178f70218019a712566a17e9e09111259b720b26de889c86695c",
                      },
                      {
                        symbol: "balance",
                      },
                    ],
                    data: {
                      address:
                        "CCYPLDHUEYWJEOIZJTXUH56NLIQLKYGR5H2BEFQMBYG5IC3G52QF4WVD",
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "75af65c4c5e6178f70218019a712566a17e9e09111259b720b26de889c86695c",
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "fn_return",
                      },
                      {
                        symbol: "balance",
                      },
                    ],
                    data: {
                      i128: {
                        hi: 0,
                        lo: 50457442126,
                      },
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "b0f58cf4262c9239194cef43f7cd5a20b560d1e9f412160c0e0dd40b66eea05e",
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "fn_call",
                      },
                      {
                        bytes:
                          "adefce59aee52968f76061d494c2525b75659fa4296a65f499ef29e56477e496",
                      },
                      {
                        symbol: "balance",
                      },
                    ],
                    data: {
                      address:
                        "CCYPLDHUEYWJEOIZJTXUH56NLIQLKYGR5H2BEFQMBYG5IC3G52QF4WVD",
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "adefce59aee52968f76061d494c2525b75659fa4296a65f499ef29e56477e496",
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "fn_return",
                      },
                      {
                        symbol: "balance",
                      },
                    ],
                    data: {
                      i128: {
                        hi: 0,
                        lo: 50749496554,
                      },
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "b0f58cf4262c9239194cef43f7cd5a20b560d1e9f412160c0e0dd40b66eea05e",
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "fn_call",
                      },
                      {
                        bytes:
                          "3872426bd59e4a61585086e3886d457903b53f22f89e361ea806ffcb07ac719f",
                      },
                      {
                        symbol: "fees_enabled",
                      },
                    ],
                    data: "void",
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "3872426bd59e4a61585086e3886d457903b53f22f89e361ea806ffcb07ac719f",
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "fn_return",
                      },
                      {
                        symbol: "fees_enabled",
                      },
                    ],
                    data: {
                      bool: false,
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "b0f58cf4262c9239194cef43f7cd5a20b560d1e9f412160c0e0dd40b66eea05e",
                type_: "contract",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "burn",
                      },
                      {
                        address:
                          "CCYPLDHUEYWJEOIZJTXUH56NLIQLKYGR5H2BEFQMBYG5IC3G52QF4WVD",
                      },
                    ],
                    data: {
                      i128: {
                        hi: 0,
                        lo: 25295525632,
                      },
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "b0f58cf4262c9239194cef43f7cd5a20b560d1e9f412160c0e0dd40b66eea05e",
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "fn_call",
                      },
                      {
                        bytes:
                          "75af65c4c5e6178f70218019a712566a17e9e09111259b720b26de889c86695c",
                      },
                      {
                        symbol: "transfer",
                      },
                    ],
                    data: {
                      vec: [
                        {
                          address:
                            "CCYPLDHUEYWJEOIZJTXUH56NLIQLKYGR5H2BEFQMBYG5IC3G52QF4WVD",
                        },
                        {
                          address:
                            "GACKMEZIHGXX6FKCPUXY7ZMKBSRZLWFCYN3CKEMGS5P3WUG7YZRYI3WW",
                        },
                        {
                          i128: {
                            hi: 0,
                            lo: 25228720564,
                          },
                        },
                      ],
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "75af65c4c5e6178f70218019a712566a17e9e09111259b720b26de889c86695c",
                type_: "contract",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "transfer",
                      },
                      {
                        address:
                          "CCYPLDHUEYWJEOIZJTXUH56NLIQLKYGR5H2BEFQMBYG5IC3G52QF4WVD",
                      },
                      {
                        address:
                          "GACKMEZIHGXX6FKCPUXY7ZMKBSRZLWFCYN3CKEMGS5P3WUG7YZRYI3WW",
                      },
                      {
                        string:
                          "USDGLO:GBBS25EGYQPGEZCGCFBKG4OAGFXU6DSOQBGTHELLJT3HZXZJ34HWS6XV",
                      },
                    ],
                    data: {
                      i128: {
                        hi: 0,
                        lo: 25228720564,
                      },
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "75af65c4c5e6178f70218019a712566a17e9e09111259b720b26de889c86695c",
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "fn_return",
                      },
                      {
                        symbol: "transfer",
                      },
                    ],
                    data: "void",
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "b0f58cf4262c9239194cef43f7cd5a20b560d1e9f412160c0e0dd40b66eea05e",
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "fn_call",
                      },
                      {
                        bytes:
                          "adefce59aee52968f76061d494c2525b75659fa4296a65f499ef29e56477e496",
                      },
                      {
                        symbol: "transfer",
                      },
                    ],
                    data: {
                      vec: [
                        {
                          address:
                            "CCYPLDHUEYWJEOIZJTXUH56NLIQLKYGR5H2BEFQMBYG5IC3G52QF4WVD",
                        },
                        {
                          address:
                            "GACKMEZIHGXX6FKCPUXY7ZMKBSRZLWFCYN3CKEMGS5P3WUG7YZRYI3WW",
                        },
                        {
                          i128: {
                            hi: 0,
                            lo: 25374747775,
                          },
                        },
                      ],
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "adefce59aee52968f76061d494c2525b75659fa4296a65f499ef29e56477e496",
                type_: "contract",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "transfer",
                      },
                      {
                        address:
                          "CCYPLDHUEYWJEOIZJTXUH56NLIQLKYGR5H2BEFQMBYG5IC3G52QF4WVD",
                      },
                      {
                        address:
                          "GACKMEZIHGXX6FKCPUXY7ZMKBSRZLWFCYN3CKEMGS5P3WUG7YZRYI3WW",
                      },
                      {
                        string:
                          "USDC:GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN",
                      },
                    ],
                    data: {
                      i128: {
                        hi: 0,
                        lo: 25374747775,
                      },
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "adefce59aee52968f76061d494c2525b75659fa4296a65f499ef29e56477e496",
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "fn_return",
                      },
                      {
                        symbol: "transfer",
                      },
                    ],
                    data: "void",
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "b0f58cf4262c9239194cef43f7cd5a20b560d1e9f412160c0e0dd40b66eea05e",
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "fn_call",
                      },
                      {
                        bytes:
                          "75af65c4c5e6178f70218019a712566a17e9e09111259b720b26de889c86695c",
                      },
                      {
                        symbol: "balance",
                      },
                    ],
                    data: {
                      address:
                        "CCYPLDHUEYWJEOIZJTXUH56NLIQLKYGR5H2BEFQMBYG5IC3G52QF4WVD",
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "75af65c4c5e6178f70218019a712566a17e9e09111259b720b26de889c86695c",
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "fn_return",
                      },
                      {
                        symbol: "balance",
                      },
                    ],
                    data: {
                      i128: {
                        hi: 0,
                        lo: 25228721562,
                      },
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "b0f58cf4262c9239194cef43f7cd5a20b560d1e9f412160c0e0dd40b66eea05e",
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "fn_call",
                      },
                      {
                        bytes:
                          "adefce59aee52968f76061d494c2525b75659fa4296a65f499ef29e56477e496",
                      },
                      {
                        symbol: "balance",
                      },
                    ],
                    data: {
                      address:
                        "CCYPLDHUEYWJEOIZJTXUH56NLIQLKYGR5H2BEFQMBYG5IC3G52QF4WVD",
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "adefce59aee52968f76061d494c2525b75659fa4296a65f499ef29e56477e496",
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "fn_return",
                      },
                      {
                        symbol: "balance",
                      },
                    ],
                    data: {
                      i128: {
                        hi: 0,
                        lo: 25374748779,
                      },
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "b0f58cf4262c9239194cef43f7cd5a20b560d1e9f412160c0e0dd40b66eea05e",
                type_: "contract",
                body: {
                  v0: {
                    topics: [
                      {
                        string: "SoroswapPair",
                      },
                      {
                        symbol: "sync",
                      },
                    ],
                    data: {
                      map: [
                        {
                          key: {
                            symbol: "new_reserve_0",
                          },
                          val: {
                            i128: {
                              hi: 0,
                              lo: 25228721562,
                            },
                          },
                        },
                        {
                          key: {
                            symbol: "new_reserve_1",
                          },
                          val: {
                            i128: {
                              hi: 0,
                              lo: 25374748779,
                            },
                          },
                        },
                      ],
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "b0f58cf4262c9239194cef43f7cd5a20b560d1e9f412160c0e0dd40b66eea05e",
                type_: "contract",
                body: {
                  v0: {
                    topics: [
                      {
                        string: "SoroswapPair",
                      },
                      {
                        symbol: "withdraw",
                      },
                    ],
                    data: {
                      map: [
                        {
                          key: {
                            symbol: "amount_0",
                          },
                          val: {
                            i128: {
                              hi: 0,
                              lo: 25228720564,
                            },
                          },
                        },
                        {
                          key: {
                            symbol: "amount_1",
                          },
                          val: {
                            i128: {
                              hi: 0,
                              lo: 25374747775,
                            },
                          },
                        },
                        {
                          key: {
                            symbol: "liquidity",
                          },
                          val: {
                            i128: {
                              hi: 0,
                              lo: 25295525632,
                            },
                          },
                        },
                        {
                          key: {
                            symbol: "new_reserve_0",
                          },
                          val: {
                            i128: {
                              hi: 0,
                              lo: 25228721562,
                            },
                          },
                        },
                        {
                          key: {
                            symbol: "new_reserve_1",
                          },
                          val: {
                            i128: {
                              hi: 0,
                              lo: 25374748779,
                            },
                          },
                        },
                        {
                          key: {
                            symbol: "to",
                          },
                          val: {
                            address:
                              "GACKMEZIHGXX6FKCPUXY7ZMKBSRZLWFCYN3CKEMGS5P3WUG7YZRYI3WW",
                          },
                        },
                      ],
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "b0f58cf4262c9239194cef43f7cd5a20b560d1e9f412160c0e0dd40b66eea05e",
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "fn_return",
                      },
                      {
                        symbol: "withdraw",
                      },
                    ],
                    data: {
                      vec: [
                        {
                          i128: {
                            hi: 0,
                            lo: 25228720564,
                          },
                        },
                        {
                          i128: {
                            hi: 0,
                            lo: 25374747775,
                          },
                        },
                      ],
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "0dd5c710ea6a4a23b32207fd130eadf9c9ce899f4308e93e4ffe53fbaf108a04",
                type_: "contract",
                body: {
                  v0: {
                    topics: [
                      {
                        string: "SoroswapRouter",
                      },
                      {
                        symbol: "remove",
                      },
                    ],
                    data: {
                      map: [
                        {
                          key: {
                            symbol: "amount_a",
                          },
                          val: {
                            i128: {
                              hi: 0,
                              lo: 25228720564,
                            },
                          },
                        },
                        {
                          key: {
                            symbol: "amount_b",
                          },
                          val: {
                            i128: {
                              hi: 0,
                              lo: 25374747775,
                            },
                          },
                        },
                        {
                          key: {
                            symbol: "liquidity",
                          },
                          val: {
                            i128: {
                              hi: 0,
                              lo: 25295525632,
                            },
                          },
                        },
                        {
                          key: {
                            symbol: "pair",
                          },
                          val: {
                            address:
                              "CCYPLDHUEYWJEOIZJTXUH56NLIQLKYGR5H2BEFQMBYG5IC3G52QF4WVD",
                          },
                        },
                        {
                          key: {
                            symbol: "to",
                          },
                          val: {
                            address:
                              "GACKMEZIHGXX6FKCPUXY7ZMKBSRZLWFCYN3CKEMGS5P3WUG7YZRYI3WW",
                          },
                        },
                        {
                          key: {
                            symbol: "token_a",
                          },
                          val: {
                            address:
                              "CB226ZOEYXTBPD3QEGABTJYSKZVBP2PASEISLG3SBMTN5CE4QZUVZ3CE",
                          },
                        },
                        {
                          key: {
                            symbol: "token_b",
                          },
                          val: {
                            address:
                              "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
                          },
                        },
                      ],
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "0dd5c710ea6a4a23b32207fd130eadf9c9ce899f4308e93e4ffe53fbaf108a04",
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "fn_return",
                      },
                      {
                        symbol: "remove_liquidity",
                      },
                    ],
                    data: {
                      vec: [
                        {
                          i128: {
                            hi: 0,
                            lo: 25228720564,
                          },
                        },
                        {
                          i128: {
                            hi: 0,
                            lo: 25374747775,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "read_entry",
                      },
                    ],
                    data: {
                      u64: 15,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "write_entry",
                      },
                    ],
                    data: {
                      u64: 7,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "ledger_read_byte",
                      },
                    ],
                    data: {
                      u64: 75024,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "ledger_write_byte",
                      },
                    ],
                    data: {
                      u64: 1492,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "read_key_byte",
                      },
                    ],
                    data: {
                      u64: 1156,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "write_key_byte",
                      },
                    ],
                    data: {
                      u64: 0,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "read_data_byte",
                      },
                    ],
                    data: {
                      u64: 3160,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "write_data_byte",
                      },
                    ],
                    data: {
                      u64: 1492,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "read_code_byte",
                      },
                    ],
                    data: {
                      u64: 71864,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "write_code_byte",
                      },
                    ],
                    data: {
                      u64: 0,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "emit_event",
                      },
                    ],
                    data: {
                      u64: 7,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "emit_event_byte",
                      },
                    ],
                    data: {
                      u64: 1760,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "cpu_insn",
                      },
                    ],
                    data: {
                      u64: 12274247,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "mem_byte",
                      },
                    ],
                    data: {
                      u64: 8178239,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "invoke_time_nsecs",
                      },
                    ],
                    data: {
                      u64: 1163808,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "max_rw_key_byte",
                      },
                    ],
                    data: {
                      u64: 180,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "max_rw_data_byte",
                      },
                    ],
                    data: {
                      u64: 512,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "max_rw_code_byte",
                      },
                    ],
                    data: {
                      u64: 34356,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "max_emit_event_byte",
                      },
                    ],
                    data: {
                      u64: 436,
                    },
                  },
                },
              },
            },
          ],
        },
      },
    },
    diagnosticEventsJson: [
      {
        in_successful_contract_call: true,
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
                    "0dd5c710ea6a4a23b32207fd130eadf9c9ce899f4308e93e4ffe53fbaf108a04",
                },
                {
                  symbol: "remove_liquidity",
                },
              ],
              data: {
                vec: [
                  {
                    address:
                      "CB226ZOEYXTBPD3QEGABTJYSKZVBP2PASEISLG3SBMTN5CE4QZUVZ3CE",
                  },
                  {
                    address:
                      "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
                  },
                  {
                    i128: {
                      hi: 0,
                      lo: 25295525632,
                    },
                  },
                  {
                    i128: {
                      hi: 0,
                      lo: 24976433359,
                    },
                  },
                  {
                    i128: {
                      hi: 0,
                      lo: 25121000298,
                    },
                  },
                  {
                    address:
                      "GACKMEZIHGXX6FKCPUXY7ZMKBSRZLWFCYN3CKEMGS5P3WUG7YZRYI3WW",
                  },
                  {
                    u64: 14067725096655520000,
                  },
                ],
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "0dd5c710ea6a4a23b32207fd130eadf9c9ce899f4308e93e4ffe53fbaf108a04",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_call",
                },
                {
                  bytes:
                    "3872426bd59e4a61585086e3886d457903b53f22f89e361ea806ffcb07ac719f",
                },
                {
                  symbol: "pair_exists",
                },
              ],
              data: {
                vec: [
                  {
                    address:
                      "CB226ZOEYXTBPD3QEGABTJYSKZVBP2PASEISLG3SBMTN5CE4QZUVZ3CE",
                  },
                  {
                    address:
                      "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
                  },
                ],
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "3872426bd59e4a61585086e3886d457903b53f22f89e361ea806ffcb07ac719f",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_return",
                },
                {
                  symbol: "pair_exists",
                },
              ],
              data: {
                bool: true,
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "0dd5c710ea6a4a23b32207fd130eadf9c9ce899f4308e93e4ffe53fbaf108a04",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_call",
                },
                {
                  bytes:
                    "b0f58cf4262c9239194cef43f7cd5a20b560d1e9f412160c0e0dd40b66eea05e",
                },
                {
                  symbol: "transfer",
                },
              ],
              data: {
                vec: [
                  {
                    address:
                      "GACKMEZIHGXX6FKCPUXY7ZMKBSRZLWFCYN3CKEMGS5P3WUG7YZRYI3WW",
                  },
                  {
                    address:
                      "CCYPLDHUEYWJEOIZJTXUH56NLIQLKYGR5H2BEFQMBYG5IC3G52QF4WVD",
                  },
                  {
                    i128: {
                      hi: 0,
                      lo: 25295525632,
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "b0f58cf4262c9239194cef43f7cd5a20b560d1e9f412160c0e0dd40b66eea05e",
          type_: "contract",
          body: {
            v0: {
              topics: [
                {
                  symbol: "transfer",
                },
                {
                  address:
                    "GACKMEZIHGXX6FKCPUXY7ZMKBSRZLWFCYN3CKEMGS5P3WUG7YZRYI3WW",
                },
                {
                  address:
                    "CCYPLDHUEYWJEOIZJTXUH56NLIQLKYGR5H2BEFQMBYG5IC3G52QF4WVD",
                },
              ],
              data: {
                i128: {
                  hi: 0,
                  lo: 25295525632,
                },
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "b0f58cf4262c9239194cef43f7cd5a20b560d1e9f412160c0e0dd40b66eea05e",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_return",
                },
                {
                  symbol: "transfer",
                },
              ],
              data: "void",
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "0dd5c710ea6a4a23b32207fd130eadf9c9ce899f4308e93e4ffe53fbaf108a04",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_call",
                },
                {
                  bytes:
                    "b0f58cf4262c9239194cef43f7cd5a20b560d1e9f412160c0e0dd40b66eea05e",
                },
                {
                  symbol: "withdraw",
                },
              ],
              data: {
                address:
                  "GACKMEZIHGXX6FKCPUXY7ZMKBSRZLWFCYN3CKEMGS5P3WUG7YZRYI3WW",
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "b0f58cf4262c9239194cef43f7cd5a20b560d1e9f412160c0e0dd40b66eea05e",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_call",
                },
                {
                  bytes:
                    "75af65c4c5e6178f70218019a712566a17e9e09111259b720b26de889c86695c",
                },
                {
                  symbol: "balance",
                },
              ],
              data: {
                address:
                  "CCYPLDHUEYWJEOIZJTXUH56NLIQLKYGR5H2BEFQMBYG5IC3G52QF4WVD",
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "75af65c4c5e6178f70218019a712566a17e9e09111259b720b26de889c86695c",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_return",
                },
                {
                  symbol: "balance",
                },
              ],
              data: {
                i128: {
                  hi: 0,
                  lo: 50457442126,
                },
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "b0f58cf4262c9239194cef43f7cd5a20b560d1e9f412160c0e0dd40b66eea05e",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_call",
                },
                {
                  bytes:
                    "adefce59aee52968f76061d494c2525b75659fa4296a65f499ef29e56477e496",
                },
                {
                  symbol: "balance",
                },
              ],
              data: {
                address:
                  "CCYPLDHUEYWJEOIZJTXUH56NLIQLKYGR5H2BEFQMBYG5IC3G52QF4WVD",
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "adefce59aee52968f76061d494c2525b75659fa4296a65f499ef29e56477e496",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_return",
                },
                {
                  symbol: "balance",
                },
              ],
              data: {
                i128: {
                  hi: 0,
                  lo: 50749496554,
                },
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "b0f58cf4262c9239194cef43f7cd5a20b560d1e9f412160c0e0dd40b66eea05e",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_call",
                },
                {
                  bytes:
                    "3872426bd59e4a61585086e3886d457903b53f22f89e361ea806ffcb07ac719f",
                },
                {
                  symbol: "fees_enabled",
                },
              ],
              data: "void",
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "3872426bd59e4a61585086e3886d457903b53f22f89e361ea806ffcb07ac719f",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_return",
                },
                {
                  symbol: "fees_enabled",
                },
              ],
              data: {
                bool: false,
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "b0f58cf4262c9239194cef43f7cd5a20b560d1e9f412160c0e0dd40b66eea05e",
          type_: "contract",
          body: {
            v0: {
              topics: [
                {
                  symbol: "burn",
                },
                {
                  address:
                    "CCYPLDHUEYWJEOIZJTXUH56NLIQLKYGR5H2BEFQMBYG5IC3G52QF4WVD",
                },
              ],
              data: {
                i128: {
                  hi: 0,
                  lo: 25295525632,
                },
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "b0f58cf4262c9239194cef43f7cd5a20b560d1e9f412160c0e0dd40b66eea05e",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_call",
                },
                {
                  bytes:
                    "75af65c4c5e6178f70218019a712566a17e9e09111259b720b26de889c86695c",
                },
                {
                  symbol: "transfer",
                },
              ],
              data: {
                vec: [
                  {
                    address:
                      "CCYPLDHUEYWJEOIZJTXUH56NLIQLKYGR5H2BEFQMBYG5IC3G52QF4WVD",
                  },
                  {
                    address:
                      "GACKMEZIHGXX6FKCPUXY7ZMKBSRZLWFCYN3CKEMGS5P3WUG7YZRYI3WW",
                  },
                  {
                    i128: {
                      hi: 0,
                      lo: 25228720564,
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "75af65c4c5e6178f70218019a712566a17e9e09111259b720b26de889c86695c",
          type_: "contract",
          body: {
            v0: {
              topics: [
                {
                  symbol: "transfer",
                },
                {
                  address:
                    "CCYPLDHUEYWJEOIZJTXUH56NLIQLKYGR5H2BEFQMBYG5IC3G52QF4WVD",
                },
                {
                  address:
                    "GACKMEZIHGXX6FKCPUXY7ZMKBSRZLWFCYN3CKEMGS5P3WUG7YZRYI3WW",
                },
                {
                  string:
                    "USDGLO:GBBS25EGYQPGEZCGCFBKG4OAGFXU6DSOQBGTHELLJT3HZXZJ34HWS6XV",
                },
              ],
              data: {
                i128: {
                  hi: 0,
                  lo: 25228720564,
                },
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "75af65c4c5e6178f70218019a712566a17e9e09111259b720b26de889c86695c",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_return",
                },
                {
                  symbol: "transfer",
                },
              ],
              data: "void",
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "b0f58cf4262c9239194cef43f7cd5a20b560d1e9f412160c0e0dd40b66eea05e",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_call",
                },
                {
                  bytes:
                    "adefce59aee52968f76061d494c2525b75659fa4296a65f499ef29e56477e496",
                },
                {
                  symbol: "transfer",
                },
              ],
              data: {
                vec: [
                  {
                    address:
                      "CCYPLDHUEYWJEOIZJTXUH56NLIQLKYGR5H2BEFQMBYG5IC3G52QF4WVD",
                  },
                  {
                    address:
                      "GACKMEZIHGXX6FKCPUXY7ZMKBSRZLWFCYN3CKEMGS5P3WUG7YZRYI3WW",
                  },
                  {
                    i128: {
                      hi: 0,
                      lo: 25374747775,
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "adefce59aee52968f76061d494c2525b75659fa4296a65f499ef29e56477e496",
          type_: "contract",
          body: {
            v0: {
              topics: [
                {
                  symbol: "transfer",
                },
                {
                  address:
                    "CCYPLDHUEYWJEOIZJTXUH56NLIQLKYGR5H2BEFQMBYG5IC3G52QF4WVD",
                },
                {
                  address:
                    "GACKMEZIHGXX6FKCPUXY7ZMKBSRZLWFCYN3CKEMGS5P3WUG7YZRYI3WW",
                },
                {
                  string:
                    "USDC:GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN",
                },
              ],
              data: {
                i128: {
                  hi: 0,
                  lo: 25374747775,
                },
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "adefce59aee52968f76061d494c2525b75659fa4296a65f499ef29e56477e496",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_return",
                },
                {
                  symbol: "transfer",
                },
              ],
              data: "void",
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "b0f58cf4262c9239194cef43f7cd5a20b560d1e9f412160c0e0dd40b66eea05e",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_call",
                },
                {
                  bytes:
                    "75af65c4c5e6178f70218019a712566a17e9e09111259b720b26de889c86695c",
                },
                {
                  symbol: "balance",
                },
              ],
              data: {
                address:
                  "CCYPLDHUEYWJEOIZJTXUH56NLIQLKYGR5H2BEFQMBYG5IC3G52QF4WVD",
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "75af65c4c5e6178f70218019a712566a17e9e09111259b720b26de889c86695c",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_return",
                },
                {
                  symbol: "balance",
                },
              ],
              data: {
                i128: {
                  hi: 0,
                  lo: 25228721562,
                },
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "b0f58cf4262c9239194cef43f7cd5a20b560d1e9f412160c0e0dd40b66eea05e",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_call",
                },
                {
                  bytes:
                    "adefce59aee52968f76061d494c2525b75659fa4296a65f499ef29e56477e496",
                },
                {
                  symbol: "balance",
                },
              ],
              data: {
                address:
                  "CCYPLDHUEYWJEOIZJTXUH56NLIQLKYGR5H2BEFQMBYG5IC3G52QF4WVD",
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "adefce59aee52968f76061d494c2525b75659fa4296a65f499ef29e56477e496",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_return",
                },
                {
                  symbol: "balance",
                },
              ],
              data: {
                i128: {
                  hi: 0,
                  lo: 25374748779,
                },
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "b0f58cf4262c9239194cef43f7cd5a20b560d1e9f412160c0e0dd40b66eea05e",
          type_: "contract",
          body: {
            v0: {
              topics: [
                {
                  string: "SoroswapPair",
                },
                {
                  symbol: "sync",
                },
              ],
              data: {
                map: [
                  {
                    key: {
                      symbol: "new_reserve_0",
                    },
                    val: {
                      i128: {
                        hi: 0,
                        lo: 25228721562,
                      },
                    },
                  },
                  {
                    key: {
                      symbol: "new_reserve_1",
                    },
                    val: {
                      i128: {
                        hi: 0,
                        lo: 25374748779,
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "b0f58cf4262c9239194cef43f7cd5a20b560d1e9f412160c0e0dd40b66eea05e",
          type_: "contract",
          body: {
            v0: {
              topics: [
                {
                  string: "SoroswapPair",
                },
                {
                  symbol: "withdraw",
                },
              ],
              data: {
                map: [
                  {
                    key: {
                      symbol: "amount_0",
                    },
                    val: {
                      i128: {
                        hi: 0,
                        lo: 25228720564,
                      },
                    },
                  },
                  {
                    key: {
                      symbol: "amount_1",
                    },
                    val: {
                      i128: {
                        hi: 0,
                        lo: 25374747775,
                      },
                    },
                  },
                  {
                    key: {
                      symbol: "liquidity",
                    },
                    val: {
                      i128: {
                        hi: 0,
                        lo: 25295525632,
                      },
                    },
                  },
                  {
                    key: {
                      symbol: "new_reserve_0",
                    },
                    val: {
                      i128: {
                        hi: 0,
                        lo: 25228721562,
                      },
                    },
                  },
                  {
                    key: {
                      symbol: "new_reserve_1",
                    },
                    val: {
                      i128: {
                        hi: 0,
                        lo: 25374748779,
                      },
                    },
                  },
                  {
                    key: {
                      symbol: "to",
                    },
                    val: {
                      address:
                        "GACKMEZIHGXX6FKCPUXY7ZMKBSRZLWFCYN3CKEMGS5P3WUG7YZRYI3WW",
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "b0f58cf4262c9239194cef43f7cd5a20b560d1e9f412160c0e0dd40b66eea05e",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_return",
                },
                {
                  symbol: "withdraw",
                },
              ],
              data: {
                vec: [
                  {
                    i128: {
                      hi: 0,
                      lo: 25228720564,
                    },
                  },
                  {
                    i128: {
                      hi: 0,
                      lo: 25374747775,
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "0dd5c710ea6a4a23b32207fd130eadf9c9ce899f4308e93e4ffe53fbaf108a04",
          type_: "contract",
          body: {
            v0: {
              topics: [
                {
                  string: "SoroswapRouter",
                },
                {
                  symbol: "remove",
                },
              ],
              data: {
                map: [
                  {
                    key: {
                      symbol: "amount_a",
                    },
                    val: {
                      i128: {
                        hi: 0,
                        lo: 25228720564,
                      },
                    },
                  },
                  {
                    key: {
                      symbol: "amount_b",
                    },
                    val: {
                      i128: {
                        hi: 0,
                        lo: 25374747775,
                      },
                    },
                  },
                  {
                    key: {
                      symbol: "liquidity",
                    },
                    val: {
                      i128: {
                        hi: 0,
                        lo: 25295525632,
                      },
                    },
                  },
                  {
                    key: {
                      symbol: "pair",
                    },
                    val: {
                      address:
                        "CCYPLDHUEYWJEOIZJTXUH56NLIQLKYGR5H2BEFQMBYG5IC3G52QF4WVD",
                    },
                  },
                  {
                    key: {
                      symbol: "to",
                    },
                    val: {
                      address:
                        "GACKMEZIHGXX6FKCPUXY7ZMKBSRZLWFCYN3CKEMGS5P3WUG7YZRYI3WW",
                    },
                  },
                  {
                    key: {
                      symbol: "token_a",
                    },
                    val: {
                      address:
                        "CB226ZOEYXTBPD3QEGABTJYSKZVBP2PASEISLG3SBMTN5CE4QZUVZ3CE",
                    },
                  },
                  {
                    key: {
                      symbol: "token_b",
                    },
                    val: {
                      address:
                        "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "0dd5c710ea6a4a23b32207fd130eadf9c9ce899f4308e93e4ffe53fbaf108a04",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_return",
                },
                {
                  symbol: "remove_liquidity",
                },
              ],
              data: {
                vec: [
                  {
                    i128: {
                      hi: 0,
                      lo: 25228720564,
                    },
                  },
                  {
                    i128: {
                      hi: 0,
                      lo: 25374747775,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "read_entry",
                },
              ],
              data: {
                u64: 15,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "write_entry",
                },
              ],
              data: {
                u64: 7,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "ledger_read_byte",
                },
              ],
              data: {
                u64: 75024,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "ledger_write_byte",
                },
              ],
              data: {
                u64: 1492,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "read_key_byte",
                },
              ],
              data: {
                u64: 1156,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "write_key_byte",
                },
              ],
              data: {
                u64: 0,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "read_data_byte",
                },
              ],
              data: {
                u64: 3160,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "write_data_byte",
                },
              ],
              data: {
                u64: 1492,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "read_code_byte",
                },
              ],
              data: {
                u64: 71864,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "write_code_byte",
                },
              ],
              data: {
                u64: 0,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "emit_event",
                },
              ],
              data: {
                u64: 7,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "emit_event_byte",
                },
              ],
              data: {
                u64: 1760,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "cpu_insn",
                },
              ],
              data: {
                u64: 12274247,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "mem_byte",
                },
              ],
              data: {
                u64: 8178239,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "invoke_time_nsecs",
                },
              ],
              data: {
                u64: 1163808,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "max_rw_key_byte",
                },
              ],
              data: {
                u64: 180,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "max_rw_data_byte",
                },
              ],
              data: {
                u64: 512,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "max_rw_code_byte",
                },
              ],
              data: {
                u64: 34356,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "max_emit_event_byte",
                },
              ],
              data: {
                u64: 436,
              },
            },
          },
        },
      },
    ],
    ledger: 57792874,
    createdAt: "1751323502",
  },
};
export const TX_ST_CHANGE_SOROSWAP_SWAP_EXACT_TOKENS = {
  jsonrpc: "2.0",
  id: 1,
  result: {
    latestLedger: 58002027,
    latestLedgerCloseTime: "1752519884",
    oldestLedger: 57881068,
    oldestLedgerCloseTime: "1751822856",
    status: "SUCCESS",
    txHash: "71a0e26ebe2e149c9fb02119a2cd02ba289c0b7659ff35aa25594b74fb5ff0ae",
    applicationOrder: 304,
    feeBump: false,
    envelopeJson: {
      tx: {
        tx: {
          source_account:
            "GAFJTCALF6Z4F5VUDWHYLHPKFWMCXQ43FD242PXHDKJLOMQZMX3WWOYV",
          fee: 1378554,
          seq_num: 3000000000000052700,
          cond: {
            time: {
              min_time: 0,
              max_time: 1752538218,
            },
          },
          memo: "none",
          operations: [
            {
              source_account:
                "GB3JCHJUP6HHZJLN5LKQDRFP2HWSLNXYE2TGWDGBTNXIW6MLVRQXNDBC",
              body: {
                invoke_host_function: {
                  host_function: {
                    invoke_contract: {
                      contract_address:
                        "CAG5LRYQ5JVEUI5TEID72EYOVX44TTUJT5BQR2J6J77FH65PCCFAJDDH",
                      function_name: "swap_exact_tokens_for_tokens",
                      args: [
                        {
                          i128: {
                            hi: 0,
                            lo: 540000000,
                          },
                        },
                        {
                          i128: {
                            hi: 0,
                            lo: 243247098,
                          },
                        },
                        {
                          vec: [
                            {
                              address:
                                "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                            },
                            {
                              address:
                                "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
                            },
                          ],
                        },
                        {
                          address:
                            "GB3JCHJUP6HHZJLN5LKQDRFP2HWSLNXYE2TGWDGBTNXIW6MLVRQXNDBC",
                        },
                        {
                          u64: 1752521818363,
                        },
                      ],
                    },
                  },
                  auth: [
                    {
                      credentials: "source_account",
                      root_invocation: {
                        function: {
                          contract_fn: {
                            contract_address:
                              "CAG5LRYQ5JVEUI5TEID72EYOVX44TTUJT5BQR2J6J77FH65PCCFAJDDH",
                            function_name: "swap_exact_tokens_for_tokens",
                            args: [
                              {
                                i128: {
                                  hi: 0,
                                  lo: 540000000,
                                },
                              },
                              {
                                i128: {
                                  hi: 0,
                                  lo: 243247098,
                                },
                              },
                              {
                                vec: [
                                  {
                                    address:
                                      "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                                  },
                                  {
                                    address:
                                      "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
                                  },
                                ],
                              },
                              {
                                address:
                                  "GB3JCHJUP6HHZJLN5LKQDRFP2HWSLNXYE2TGWDGBTNXIW6MLVRQXNDBC",
                              },
                              {
                                u64: 1752521818363,
                              },
                            ],
                          },
                        },
                        sub_invocations: [
                          {
                            function: {
                              contract_fn: {
                                contract_address:
                                  "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                                function_name: "transfer",
                                args: [
                                  {
                                    address:
                                      "GB3JCHJUP6HHZJLN5LKQDRFP2HWSLNXYE2TGWDGBTNXIW6MLVRQXNDBC",
                                  },
                                  {
                                    address:
                                      "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
                                  },
                                  {
                                    i128: {
                                      hi: 0,
                                      lo: 540000000,
                                    },
                                  },
                                ],
                              },
                            },
                            sub_invocations: [],
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            },
          ],
          ext: {
            v1: {
              ext: "v0",
              resources: {
                footprint: {
                  read_only: [
                    {
                      contract_data: {
                        contract:
                          "CAG5LRYQ5JVEUI5TEID72EYOVX44TTUJT5BQR2J6J77FH65PCCFAJDDH",
                        key: "ledger_key_contract_instance",
                        durability: "persistent",
                      },
                    },
                    {
                      contract_data: {
                        contract:
                          "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                        key: "ledger_key_contract_instance",
                        durability: "persistent",
                      },
                    },
                    {
                      contract_data: {
                        contract:
                          "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
                        key: "ledger_key_contract_instance",
                        durability: "persistent",
                      },
                    },
                    {
                      contract_code: {
                        hash: "18051456816b66f12e773a56f77c5794fac1b1fb7ab6e22d4fad5a412770f73e",
                      },
                    },
                    {
                      contract_code: {
                        hash: "4c3db3ebd2d6a2ab23de1f622eaabb39501539b4611b68622ec4e47f76c4ba07",
                      },
                    },
                  ],
                  read_write: [
                    {
                      account: {
                        account_id:
                          "GB3JCHJUP6HHZJLN5LKQDRFP2HWSLNXYE2TGWDGBTNXIW6MLVRQXNDBC",
                      },
                    },
                    {
                      trustline: {
                        account_id:
                          "GB3JCHJUP6HHZJLN5LKQDRFP2HWSLNXYE2TGWDGBTNXIW6MLVRQXNDBC",
                        asset: {
                          credit_alphanum4: {
                            asset_code: "USDC",
                            issuer:
                              "GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN",
                          },
                        },
                      },
                    },
                    {
                      contract_data: {
                        contract:
                          "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
                        key: "ledger_key_contract_instance",
                        durability: "persistent",
                      },
                    },
                    {
                      contract_data: {
                        contract:
                          "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                        key: {
                          vec: [
                            {
                              symbol: "Balance",
                            },
                            {
                              address:
                                "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
                            },
                          ],
                        },
                        durability: "persistent",
                      },
                    },
                    {
                      contract_data: {
                        contract:
                          "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
                        key: {
                          vec: [
                            {
                              symbol: "Balance",
                            },
                            {
                              address:
                                "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
                            },
                          ],
                        },
                        durability: "persistent",
                      },
                    },
                  ],
                },
                instructions: 10292144,
                read_bytes: 64016,
                write_bytes: 1248,
              },
              resource_fee: 378554,
            },
          },
        },
        signatures: [
          {
            hint: "1965f76b",
            signature:
              "ced38fe3fceac633b02f972a54da9df982d32bf93596b8bd64d59818385762f816a8b8c0aa1f6cd061f823e8e32e250380255d1884dd9f6ff415a91736bcce07",
          },
          {
            hint: "8bac6176",
            signature:
              "cef1b3f038b987f36a588c7e6f2522d182895d3ab4bd35d0a0355d8cd493d6c8c4c5bcdcf8a69b940572240d542a90fa508ada377e2e7e894d1f7b9ad621ba0c",
          },
        ],
      },
    },
    resultJson: {
      fee_charged: 309004,
      result: {
        tx_success: [
          {
            op_inner: {
              invoke_host_function: {
                success:
                  "f50d30b6cca74b2ac99e610dd965b5512c1530072fde1a92d3ad207fe4eff6e7",
              },
            },
          },
        ],
      },
      ext: "v0",
    },
    resultMetaJson: {
      v3: {
        ext: "v0",
        tx_changes_before: [
          {
            state: {
              last_modified_ledger_seq: 58001736,
              data: {
                account: {
                  account_id:
                    "GAFJTCALF6Z4F5VUDWHYLHPKFWMCXQ43FD242PXHDKJLOMQZMX3WWOYV",
                  balance: 29621245,
                  seq_num: 3000000000000052700,
                  num_sub_entries: 0,
                  inflation_dest: null,
                  flags: 0,
                  home_domain: "",
                  thresholds: "01000000",
                  signers: [],
                  ext: {
                    v1: {
                      liabilities: {
                        buying: 0,
                        selling: 0,
                      },
                      ext: {
                        v2: {
                          num_sponsored: 0,
                          num_sponsoring: 0,
                          signer_sponsoring_i_ds: [],
                          ext: {
                            v3: {
                              ext: "v0",
                              seq_ledger: 58000538,
                              seq_time: 1752511343,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              ext: "v0",
            },
          },
          {
            updated: {
              last_modified_ledger_seq: 58001736,
              data: {
                account: {
                  account_id:
                    "GAFJTCALF6Z4F5VUDWHYLHPKFWMCXQ43FD242PXHDKJLOMQZMX3WWOYV",
                  balance: 29621245,
                  seq_num: 3000000000000052700,
                  num_sub_entries: 0,
                  inflation_dest: null,
                  flags: 0,
                  home_domain: "",
                  thresholds: "01000000",
                  signers: [],
                  ext: {
                    v1: {
                      liabilities: {
                        buying: 0,
                        selling: 0,
                      },
                      ext: {
                        v2: {
                          num_sponsored: 0,
                          num_sponsoring: 0,
                          signer_sponsoring_i_ds: [],
                          ext: {
                            v3: {
                              ext: "v0",
                              seq_ledger: 58001736,
                              seq_time: 1752518224,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              ext: "v0",
            },
          },
        ],
        operations: [
          {
            changes: [
              {
                state: {
                  last_modified_ledger_seq: 58001735,
                  data: {
                    contract_data: {
                      ext: "v0",
                      contract:
                        "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
                      key: {
                        vec: [
                          {
                            symbol: "Balance",
                          },
                          {
                            address:
                              "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
                          },
                        ],
                      },
                      durability: "persistent",
                      val: {
                        map: [
                          {
                            key: {
                              symbol: "amount",
                            },
                            val: {
                              i128: {
                                hi: 0,
                                lo: 1426127224549,
                              },
                            },
                          },
                          {
                            key: {
                              symbol: "authorized",
                            },
                            val: {
                              bool: true,
                            },
                          },
                          {
                            key: {
                              symbol: "clawback",
                            },
                            val: {
                              bool: false,
                            },
                          },
                        ],
                      },
                    },
                  },
                  ext: "v0",
                },
              },
              {
                updated: {
                  last_modified_ledger_seq: 58001736,
                  data: {
                    contract_data: {
                      ext: "v0",
                      contract:
                        "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
                      key: {
                        vec: [
                          {
                            symbol: "Balance",
                          },
                          {
                            address:
                              "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
                          },
                        ],
                      },
                      durability: "persistent",
                      val: {
                        map: [
                          {
                            key: {
                              symbol: "amount",
                            },
                            val: {
                              i128: {
                                hi: 0,
                                lo: 1425880638588,
                              },
                            },
                          },
                          {
                            key: {
                              symbol: "authorized",
                            },
                            val: {
                              bool: true,
                            },
                          },
                          {
                            key: {
                              symbol: "clawback",
                            },
                            val: {
                              bool: false,
                            },
                          },
                        ],
                      },
                    },
                  },
                  ext: "v0",
                },
              },
              {
                state: {
                  last_modified_ledger_seq: 58001735,
                  data: {
                    contract_data: {
                      ext: "v0",
                      contract:
                        "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
                      key: "ledger_key_contract_instance",
                      durability: "persistent",
                      val: {
                        contract_instance: {
                          executable: {
                            wasm: "18051456816b66f12e773a56f77c5794fac1b1fb7ab6e22d4fad5a412770f73e",
                          },
                          storage: [
                            {
                              key: {
                                u32: 0,
                              },
                              val: {
                                address:
                                  "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                              },
                            },
                            {
                              key: {
                                u32: 1,
                              },
                              val: {
                                address:
                                  "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
                              },
                            },
                            {
                              key: {
                                u32: 2,
                              },
                              val: {
                                i128: {
                                  hi: 0,
                                  lo: 3113176485885,
                                },
                              },
                            },
                            {
                              key: {
                                u32: 3,
                              },
                              val: {
                                i128: {
                                  hi: 0,
                                  lo: 1426127224549,
                                },
                              },
                            },
                            {
                              key: {
                                u32: 4,
                              },
                              val: {
                                address:
                                  "CA4HEQTL2WPEUYKYKCDOHCDNIV4QHNJ7EL4J4NQ6VADP7SYHVRYZ7AW2",
                              },
                            },
                            {
                              key: {
                                symbol: "METADATA",
                              },
                              val: {
                                map: [
                                  {
                                    key: {
                                      symbol: "decimal",
                                    },
                                    val: {
                                      u32: 7,
                                    },
                                  },
                                  {
                                    key: {
                                      symbol: "name",
                                    },
                                    val: {
                                      string: "native-USDC Soroswap LP Token",
                                    },
                                  },
                                  {
                                    key: {
                                      symbol: "symbol",
                                    },
                                    val: {
                                      string: "native-USDC-SOROSWAP-LP",
                                    },
                                  },
                                ],
                              },
                            },
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "TotalSupply",
                                  },
                                ],
                              },
                              val: {
                                i128: {
                                  hi: 0,
                                  lo: 1953573659583,
                                },
                              },
                            },
                          ],
                        },
                      },
                    },
                  },
                  ext: "v0",
                },
              },
              {
                updated: {
                  last_modified_ledger_seq: 58001736,
                  data: {
                    contract_data: {
                      ext: "v0",
                      contract:
                        "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
                      key: "ledger_key_contract_instance",
                      durability: "persistent",
                      val: {
                        contract_instance: {
                          executable: {
                            wasm: "18051456816b66f12e773a56f77c5794fac1b1fb7ab6e22d4fad5a412770f73e",
                          },
                          storage: [
                            {
                              key: {
                                u32: 0,
                              },
                              val: {
                                address:
                                  "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                              },
                            },
                            {
                              key: {
                                u32: 1,
                              },
                              val: {
                                address:
                                  "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
                              },
                            },
                            {
                              key: {
                                u32: 2,
                              },
                              val: {
                                i128: {
                                  hi: 0,
                                  lo: 3113716485885,
                                },
                              },
                            },
                            {
                              key: {
                                u32: 3,
                              },
                              val: {
                                i128: {
                                  hi: 0,
                                  lo: 1425880638588,
                                },
                              },
                            },
                            {
                              key: {
                                u32: 4,
                              },
                              val: {
                                address:
                                  "CA4HEQTL2WPEUYKYKCDOHCDNIV4QHNJ7EL4J4NQ6VADP7SYHVRYZ7AW2",
                              },
                            },
                            {
                              key: {
                                symbol: "METADATA",
                              },
                              val: {
                                map: [
                                  {
                                    key: {
                                      symbol: "decimal",
                                    },
                                    val: {
                                      u32: 7,
                                    },
                                  },
                                  {
                                    key: {
                                      symbol: "name",
                                    },
                                    val: {
                                      string: "native-USDC Soroswap LP Token",
                                    },
                                  },
                                  {
                                    key: {
                                      symbol: "symbol",
                                    },
                                    val: {
                                      string: "native-USDC-SOROSWAP-LP",
                                    },
                                  },
                                ],
                              },
                            },
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "TotalSupply",
                                  },
                                ],
                              },
                              val: {
                                i128: {
                                  hi: 0,
                                  lo: 1953573659583,
                                },
                              },
                            },
                          ],
                        },
                      },
                    },
                  },
                  ext: "v0",
                },
              },
              {
                state: {
                  last_modified_ledger_seq: 58001733,
                  data: {
                    trustline: {
                      account_id:
                        "GB3JCHJUP6HHZJLN5LKQDRFP2HWSLNXYE2TGWDGBTNXIW6MLVRQXNDBC",
                      asset: {
                        credit_alphanum4: {
                          asset_code: "USDC",
                          issuer:
                            "GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN",
                        },
                      },
                      balance: 56033185457,
                      limit: 9223372036854776000,
                      flags: 1,
                      ext: {
                        v1: {
                          liabilities: {
                            buying: 0,
                            selling: 0,
                          },
                          ext: {
                            v2: {
                              liquidity_pool_use_count: 0,
                              ext: "v0",
                            },
                          },
                        },
                      },
                    },
                  },
                  ext: "v0",
                },
              },
              {
                updated: {
                  last_modified_ledger_seq: 58001736,
                  data: {
                    trustline: {
                      account_id:
                        "GB3JCHJUP6HHZJLN5LKQDRFP2HWSLNXYE2TGWDGBTNXIW6MLVRQXNDBC",
                      asset: {
                        credit_alphanum4: {
                          asset_code: "USDC",
                          issuer:
                            "GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN",
                        },
                      },
                      balance: 56279771418,
                      limit: 9223372036854776000,
                      flags: 1,
                      ext: {
                        v1: {
                          liabilities: {
                            buying: 0,
                            selling: 0,
                          },
                          ext: {
                            v2: {
                              liquidity_pool_use_count: 0,
                              ext: "v0",
                            },
                          },
                        },
                      },
                    },
                  },
                  ext: "v0",
                },
              },
              {
                state: {
                  last_modified_ledger_seq: 58001735,
                  data: {
                    contract_data: {
                      ext: "v0",
                      contract:
                        "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                      key: {
                        vec: [
                          {
                            symbol: "Balance",
                          },
                          {
                            address:
                              "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
                          },
                        ],
                      },
                      durability: "persistent",
                      val: {
                        map: [
                          {
                            key: {
                              symbol: "amount",
                            },
                            val: {
                              i128: {
                                hi: 0,
                                lo: 3113176485885,
                              },
                            },
                          },
                          {
                            key: {
                              symbol: "authorized",
                            },
                            val: {
                              bool: true,
                            },
                          },
                          {
                            key: {
                              symbol: "clawback",
                            },
                            val: {
                              bool: false,
                            },
                          },
                        ],
                      },
                    },
                  },
                  ext: "v0",
                },
              },
              {
                updated: {
                  last_modified_ledger_seq: 58001736,
                  data: {
                    contract_data: {
                      ext: "v0",
                      contract:
                        "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                      key: {
                        vec: [
                          {
                            symbol: "Balance",
                          },
                          {
                            address:
                              "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
                          },
                        ],
                      },
                      durability: "persistent",
                      val: {
                        map: [
                          {
                            key: {
                              symbol: "amount",
                            },
                            val: {
                              i128: {
                                hi: 0,
                                lo: 3113716485885,
                              },
                            },
                          },
                          {
                            key: {
                              symbol: "authorized",
                            },
                            val: {
                              bool: true,
                            },
                          },
                          {
                            key: {
                              symbol: "clawback",
                            },
                            val: {
                              bool: false,
                            },
                          },
                        ],
                      },
                    },
                  },
                  ext: "v0",
                },
              },
              {
                state: {
                  last_modified_ledger_seq: 58001736,
                  data: {
                    account: {
                      account_id:
                        "GB3JCHJUP6HHZJLN5LKQDRFP2HWSLNXYE2TGWDGBTNXIW6MLVRQXNDBC",
                      balance: 4871254021,
                      seq_num: 168043829566406850,
                      num_sub_entries: 70,
                      inflation_dest: null,
                      flags: 0,
                      home_domain: "",
                      thresholds: "01000000",
                      signers: [],
                      ext: {
                        v1: {
                          liabilities: {
                            buying: 0,
                            selling: 0,
                          },
                          ext: {
                            v2: {
                              num_sponsored: 0,
                              num_sponsoring: 2,
                              signer_sponsoring_i_ds: [],
                              ext: {
                                v3: {
                                  ext: "v0",
                                  seq_ledger: 58001582,
                                  seq_time: 1752517343,
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                  ext: "v0",
                },
              },
              {
                updated: {
                  last_modified_ledger_seq: 58001736,
                  data: {
                    account: {
                      account_id:
                        "GB3JCHJUP6HHZJLN5LKQDRFP2HWSLNXYE2TGWDGBTNXIW6MLVRQXNDBC",
                      balance: 4331254021,
                      seq_num: 168043829566406850,
                      num_sub_entries: 70,
                      inflation_dest: null,
                      flags: 0,
                      home_domain: "",
                      thresholds: "01000000",
                      signers: [],
                      ext: {
                        v1: {
                          liabilities: {
                            buying: 0,
                            selling: 0,
                          },
                          ext: {
                            v2: {
                              num_sponsored: 0,
                              num_sponsoring: 2,
                              signer_sponsoring_i_ds: [],
                              ext: {
                                v3: {
                                  ext: "v0",
                                  seq_ledger: 58001582,
                                  seq_time: 1752517343,
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                  ext: "v0",
                },
              },
            ],
          },
        ],
        tx_changes_after: [
          {
            state: {
              last_modified_ledger_seq: 58001736,
              data: {
                account: {
                  account_id:
                    "GAFJTCALF6Z4F5VUDWHYLHPKFWMCXQ43FD242PXHDKJLOMQZMX3WWOYV",
                  balance: 29621245,
                  seq_num: 3000000000000052700,
                  num_sub_entries: 0,
                  inflation_dest: null,
                  flags: 0,
                  home_domain: "",
                  thresholds: "01000000",
                  signers: [],
                  ext: {
                    v1: {
                      liabilities: {
                        buying: 0,
                        selling: 0,
                      },
                      ext: {
                        v2: {
                          num_sponsored: 0,
                          num_sponsoring: 0,
                          signer_sponsoring_i_ds: [],
                          ext: {
                            v3: {
                              ext: "v0",
                              seq_ledger: 58001736,
                              seq_time: 1752518224,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              ext: "v0",
            },
          },
          {
            updated: {
              last_modified_ledger_seq: 58001736,
              data: {
                account: {
                  account_id:
                    "GAFJTCALF6Z4F5VUDWHYLHPKFWMCXQ43FD242PXHDKJLOMQZMX3WWOYV",
                  balance: 29690896,
                  seq_num: 3000000000000052700,
                  num_sub_entries: 0,
                  inflation_dest: null,
                  flags: 0,
                  home_domain: "",
                  thresholds: "01000000",
                  signers: [],
                  ext: {
                    v1: {
                      liabilities: {
                        buying: 0,
                        selling: 0,
                      },
                      ext: {
                        v2: {
                          num_sponsored: 0,
                          num_sponsoring: 0,
                          signer_sponsoring_i_ds: [],
                          ext: {
                            v3: {
                              ext: "v0",
                              seq_ledger: 58001736,
                              seq_time: 1752518224,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              ext: "v0",
            },
          },
        ],
        soroban_meta: {
          ext: {
            v1: {
              ext: "v0",
              total_non_refundable_resource_fee_charged: 296129,
              total_refundable_resource_fee_charged: 12774,
              rent_fee_charged: 0,
            },
          },
          events: [
            {
              ext: "v0",
              contract_id:
                "25b4fcd859aec2fa6348438c489b3c3c10c98b6d21be4fd3cb30cb68953ef977",
              type_: "contract",
              body: {
                v0: {
                  topics: [
                    {
                      symbol: "transfer",
                    },
                    {
                      address:
                        "GB3JCHJUP6HHZJLN5LKQDRFP2HWSLNXYE2TGWDGBTNXIW6MLVRQXNDBC",
                    },
                    {
                      address:
                        "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
                    },
                    {
                      string: "native",
                    },
                  ],
                  data: {
                    i128: {
                      hi: 0,
                      lo: 540000000,
                    },
                  },
                },
              },
            },
            {
              ext: "v0",
              contract_id:
                "adefce59aee52968f76061d494c2525b75659fa4296a65f499ef29e56477e496",
              type_: "contract",
              body: {
                v0: {
                  topics: [
                    {
                      symbol: "transfer",
                    },
                    {
                      address:
                        "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
                    },
                    {
                      address:
                        "GB3JCHJUP6HHZJLN5LKQDRFP2HWSLNXYE2TGWDGBTNXIW6MLVRQXNDBC",
                    },
                    {
                      string:
                        "USDC:GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN",
                    },
                  ],
                  data: {
                    i128: {
                      hi: 0,
                      lo: 246585961,
                    },
                  },
                },
              },
            },
            {
              ext: "v0",
              contract_id:
                "19f1e3bb37b77070098cb5ccfaa5c00b2917fe16e39e7424ee29b2c25dd77ae7",
              type_: "contract",
              body: {
                v0: {
                  topics: [
                    {
                      string: "SoroswapPair",
                    },
                    {
                      symbol: "sync",
                    },
                  ],
                  data: {
                    map: [
                      {
                        key: {
                          symbol: "new_reserve_0",
                        },
                        val: {
                          i128: {
                            hi: 0,
                            lo: 3113716485885,
                          },
                        },
                      },
                      {
                        key: {
                          symbol: "new_reserve_1",
                        },
                        val: {
                          i128: {
                            hi: 0,
                            lo: 1425880638588,
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
            {
              ext: "v0",
              contract_id:
                "19f1e3bb37b77070098cb5ccfaa5c00b2917fe16e39e7424ee29b2c25dd77ae7",
              type_: "contract",
              body: {
                v0: {
                  topics: [
                    {
                      string: "SoroswapPair",
                    },
                    {
                      symbol: "swap",
                    },
                  ],
                  data: {
                    map: [
                      {
                        key: {
                          symbol: "amount_0_in",
                        },
                        val: {
                          i128: {
                            hi: 0,
                            lo: 540000000,
                          },
                        },
                      },
                      {
                        key: {
                          symbol: "amount_0_out",
                        },
                        val: {
                          i128: {
                            hi: 0,
                            lo: 0,
                          },
                        },
                      },
                      {
                        key: {
                          symbol: "amount_1_in",
                        },
                        val: {
                          i128: {
                            hi: 0,
                            lo: 0,
                          },
                        },
                      },
                      {
                        key: {
                          symbol: "amount_1_out",
                        },
                        val: {
                          i128: {
                            hi: 0,
                            lo: 246585961,
                          },
                        },
                      },
                      {
                        key: {
                          symbol: "to",
                        },
                        val: {
                          address:
                            "GB3JCHJUP6HHZJLN5LKQDRFP2HWSLNXYE2TGWDGBTNXIW6MLVRQXNDBC",
                        },
                      },
                    ],
                  },
                },
              },
            },
            {
              ext: "v0",
              contract_id:
                "0dd5c710ea6a4a23b32207fd130eadf9c9ce899f4308e93e4ffe53fbaf108a04",
              type_: "contract",
              body: {
                v0: {
                  topics: [
                    {
                      string: "SoroswapRouter",
                    },
                    {
                      symbol: "swap",
                    },
                  ],
                  data: {
                    map: [
                      {
                        key: {
                          symbol: "amounts",
                        },
                        val: {
                          vec: [
                            {
                              i128: {
                                hi: 0,
                                lo: 540000000,
                              },
                            },
                            {
                              i128: {
                                hi: 0,
                                lo: 246585961,
                              },
                            },
                          ],
                        },
                      },
                      {
                        key: {
                          symbol: "path",
                        },
                        val: {
                          vec: [
                            {
                              address:
                                "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                            },
                            {
                              address:
                                "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
                            },
                          ],
                        },
                      },
                      {
                        key: {
                          symbol: "to",
                        },
                        val: {
                          address:
                            "GB3JCHJUP6HHZJLN5LKQDRFP2HWSLNXYE2TGWDGBTNXIW6MLVRQXNDBC",
                        },
                      },
                    ],
                  },
                },
              },
            },
          ],
          return_value: {
            vec: [
              {
                i128: {
                  hi: 0,
                  lo: 540000000,
                },
              },
              {
                i128: {
                  hi: 0,
                  lo: 246585961,
                },
              },
            ],
          },
          diagnostic_events: [
            {
              in_successful_contract_call: true,
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
                          "0dd5c710ea6a4a23b32207fd130eadf9c9ce899f4308e93e4ffe53fbaf108a04",
                      },
                      {
                        symbol: "swap_exact_tokens_for_tokens",
                      },
                    ],
                    data: {
                      vec: [
                        {
                          i128: {
                            hi: 0,
                            lo: 540000000,
                          },
                        },
                        {
                          i128: {
                            hi: 0,
                            lo: 243247098,
                          },
                        },
                        {
                          vec: [
                            {
                              address:
                                "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                            },
                            {
                              address:
                                "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
                            },
                          ],
                        },
                        {
                          address:
                            "GB3JCHJUP6HHZJLN5LKQDRFP2HWSLNXYE2TGWDGBTNXIW6MLVRQXNDBC",
                        },
                        {
                          u64: 1752521818363,
                        },
                      ],
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "0dd5c710ea6a4a23b32207fd130eadf9c9ce899f4308e93e4ffe53fbaf108a04",
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "fn_call",
                      },
                      {
                        bytes:
                          "19f1e3bb37b77070098cb5ccfaa5c00b2917fe16e39e7424ee29b2c25dd77ae7",
                      },
                      {
                        symbol: "get_reserves",
                      },
                    ],
                    data: "void",
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "19f1e3bb37b77070098cb5ccfaa5c00b2917fe16e39e7424ee29b2c25dd77ae7",
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "fn_return",
                      },
                      {
                        symbol: "get_reserves",
                      },
                    ],
                    data: {
                      vec: [
                        {
                          i128: {
                            hi: 0,
                            lo: 3113176485885,
                          },
                        },
                        {
                          i128: {
                            hi: 0,
                            lo: 1426127224549,
                          },
                        },
                      ],
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "0dd5c710ea6a4a23b32207fd130eadf9c9ce899f4308e93e4ffe53fbaf108a04",
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "fn_call",
                      },
                      {
                        bytes:
                          "25b4fcd859aec2fa6348438c489b3c3c10c98b6d21be4fd3cb30cb68953ef977",
                      },
                      {
                        symbol: "transfer",
                      },
                    ],
                    data: {
                      vec: [
                        {
                          address:
                            "GB3JCHJUP6HHZJLN5LKQDRFP2HWSLNXYE2TGWDGBTNXIW6MLVRQXNDBC",
                        },
                        {
                          address:
                            "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
                        },
                        {
                          i128: {
                            hi: 0,
                            lo: 540000000,
                          },
                        },
                      ],
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "25b4fcd859aec2fa6348438c489b3c3c10c98b6d21be4fd3cb30cb68953ef977",
                type_: "contract",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "transfer",
                      },
                      {
                        address:
                          "GB3JCHJUP6HHZJLN5LKQDRFP2HWSLNXYE2TGWDGBTNXIW6MLVRQXNDBC",
                      },
                      {
                        address:
                          "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
                      },
                      {
                        string: "native",
                      },
                    ],
                    data: {
                      i128: {
                        hi: 0,
                        lo: 540000000,
                      },
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "25b4fcd859aec2fa6348438c489b3c3c10c98b6d21be4fd3cb30cb68953ef977",
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "fn_return",
                      },
                      {
                        symbol: "transfer",
                      },
                    ],
                    data: "void",
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "0dd5c710ea6a4a23b32207fd130eadf9c9ce899f4308e93e4ffe53fbaf108a04",
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "fn_call",
                      },
                      {
                        bytes:
                          "19f1e3bb37b77070098cb5ccfaa5c00b2917fe16e39e7424ee29b2c25dd77ae7",
                      },
                      {
                        symbol: "swap",
                      },
                    ],
                    data: {
                      vec: [
                        {
                          i128: {
                            hi: 0,
                            lo: 0,
                          },
                        },
                        {
                          i128: {
                            hi: 0,
                            lo: 246585961,
                          },
                        },
                        {
                          address:
                            "GB3JCHJUP6HHZJLN5LKQDRFP2HWSLNXYE2TGWDGBTNXIW6MLVRQXNDBC",
                        },
                      ],
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "19f1e3bb37b77070098cb5ccfaa5c00b2917fe16e39e7424ee29b2c25dd77ae7",
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "fn_call",
                      },
                      {
                        bytes:
                          "adefce59aee52968f76061d494c2525b75659fa4296a65f499ef29e56477e496",
                      },
                      {
                        symbol: "transfer",
                      },
                    ],
                    data: {
                      vec: [
                        {
                          address:
                            "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
                        },
                        {
                          address:
                            "GB3JCHJUP6HHZJLN5LKQDRFP2HWSLNXYE2TGWDGBTNXIW6MLVRQXNDBC",
                        },
                        {
                          i128: {
                            hi: 0,
                            lo: 246585961,
                          },
                        },
                      ],
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "adefce59aee52968f76061d494c2525b75659fa4296a65f499ef29e56477e496",
                type_: "contract",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "transfer",
                      },
                      {
                        address:
                          "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
                      },
                      {
                        address:
                          "GB3JCHJUP6HHZJLN5LKQDRFP2HWSLNXYE2TGWDGBTNXIW6MLVRQXNDBC",
                      },
                      {
                        string:
                          "USDC:GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN",
                      },
                    ],
                    data: {
                      i128: {
                        hi: 0,
                        lo: 246585961,
                      },
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "adefce59aee52968f76061d494c2525b75659fa4296a65f499ef29e56477e496",
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "fn_return",
                      },
                      {
                        symbol: "transfer",
                      },
                    ],
                    data: "void",
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "19f1e3bb37b77070098cb5ccfaa5c00b2917fe16e39e7424ee29b2c25dd77ae7",
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "fn_call",
                      },
                      {
                        bytes:
                          "25b4fcd859aec2fa6348438c489b3c3c10c98b6d21be4fd3cb30cb68953ef977",
                      },
                      {
                        symbol: "balance",
                      },
                    ],
                    data: {
                      address:
                        "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "25b4fcd859aec2fa6348438c489b3c3c10c98b6d21be4fd3cb30cb68953ef977",
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "fn_return",
                      },
                      {
                        symbol: "balance",
                      },
                    ],
                    data: {
                      i128: {
                        hi: 0,
                        lo: 3113716485885,
                      },
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "19f1e3bb37b77070098cb5ccfaa5c00b2917fe16e39e7424ee29b2c25dd77ae7",
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "fn_call",
                      },
                      {
                        bytes:
                          "adefce59aee52968f76061d494c2525b75659fa4296a65f499ef29e56477e496",
                      },
                      {
                        symbol: "balance",
                      },
                    ],
                    data: {
                      address:
                        "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "adefce59aee52968f76061d494c2525b75659fa4296a65f499ef29e56477e496",
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "fn_return",
                      },
                      {
                        symbol: "balance",
                      },
                    ],
                    data: {
                      i128: {
                        hi: 0,
                        lo: 1425880638588,
                      },
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "19f1e3bb37b77070098cb5ccfaa5c00b2917fe16e39e7424ee29b2c25dd77ae7",
                type_: "contract",
                body: {
                  v0: {
                    topics: [
                      {
                        string: "SoroswapPair",
                      },
                      {
                        symbol: "sync",
                      },
                    ],
                    data: {
                      map: [
                        {
                          key: {
                            symbol: "new_reserve_0",
                          },
                          val: {
                            i128: {
                              hi: 0,
                              lo: 3113716485885,
                            },
                          },
                        },
                        {
                          key: {
                            symbol: "new_reserve_1",
                          },
                          val: {
                            i128: {
                              hi: 0,
                              lo: 1425880638588,
                            },
                          },
                        },
                      ],
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "19f1e3bb37b77070098cb5ccfaa5c00b2917fe16e39e7424ee29b2c25dd77ae7",
                type_: "contract",
                body: {
                  v0: {
                    topics: [
                      {
                        string: "SoroswapPair",
                      },
                      {
                        symbol: "swap",
                      },
                    ],
                    data: {
                      map: [
                        {
                          key: {
                            symbol: "amount_0_in",
                          },
                          val: {
                            i128: {
                              hi: 0,
                              lo: 540000000,
                            },
                          },
                        },
                        {
                          key: {
                            symbol: "amount_0_out",
                          },
                          val: {
                            i128: {
                              hi: 0,
                              lo: 0,
                            },
                          },
                        },
                        {
                          key: {
                            symbol: "amount_1_in",
                          },
                          val: {
                            i128: {
                              hi: 0,
                              lo: 0,
                            },
                          },
                        },
                        {
                          key: {
                            symbol: "amount_1_out",
                          },
                          val: {
                            i128: {
                              hi: 0,
                              lo: 246585961,
                            },
                          },
                        },
                        {
                          key: {
                            symbol: "to",
                          },
                          val: {
                            address:
                              "GB3JCHJUP6HHZJLN5LKQDRFP2HWSLNXYE2TGWDGBTNXIW6MLVRQXNDBC",
                          },
                        },
                      ],
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "19f1e3bb37b77070098cb5ccfaa5c00b2917fe16e39e7424ee29b2c25dd77ae7",
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "fn_return",
                      },
                      {
                        symbol: "swap",
                      },
                    ],
                    data: "void",
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "0dd5c710ea6a4a23b32207fd130eadf9c9ce899f4308e93e4ffe53fbaf108a04",
                type_: "contract",
                body: {
                  v0: {
                    topics: [
                      {
                        string: "SoroswapRouter",
                      },
                      {
                        symbol: "swap",
                      },
                    ],
                    data: {
                      map: [
                        {
                          key: {
                            symbol: "amounts",
                          },
                          val: {
                            vec: [
                              {
                                i128: {
                                  hi: 0,
                                  lo: 540000000,
                                },
                              },
                              {
                                i128: {
                                  hi: 0,
                                  lo: 246585961,
                                },
                              },
                            ],
                          },
                        },
                        {
                          key: {
                            symbol: "path",
                          },
                          val: {
                            vec: [
                              {
                                address:
                                  "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                              },
                              {
                                address:
                                  "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
                              },
                            ],
                          },
                        },
                        {
                          key: {
                            symbol: "to",
                          },
                          val: {
                            address:
                              "GB3JCHJUP6HHZJLN5LKQDRFP2HWSLNXYE2TGWDGBTNXIW6MLVRQXNDBC",
                          },
                        },
                      ],
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "0dd5c710ea6a4a23b32207fd130eadf9c9ce899f4308e93e4ffe53fbaf108a04",
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "fn_return",
                      },
                      {
                        symbol: "swap_exact_tokens_for_tokens",
                      },
                    ],
                    data: {
                      vec: [
                        {
                          i128: {
                            hi: 0,
                            lo: 540000000,
                          },
                        },
                        {
                          i128: {
                            hi: 0,
                            lo: 246585961,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "read_entry",
                      },
                    ],
                    data: {
                      u64: 10,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "write_entry",
                      },
                    ],
                    data: {
                      u64: 5,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "ledger_read_byte",
                      },
                    ],
                    data: {
                      u64: 64016,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "ledger_write_byte",
                      },
                    ],
                    data: {
                      u64: 1248,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "read_key_byte",
                      },
                    ],
                    data: {
                      u64: 612,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "write_key_byte",
                      },
                    ],
                    data: {
                      u64: 0,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "read_data_byte",
                      },
                    ],
                    data: {
                      u64: 2148,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "write_data_byte",
                      },
                    ],
                    data: {
                      u64: 1248,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "read_code_byte",
                      },
                    ],
                    data: {
                      u64: 61868,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "write_code_byte",
                      },
                    ],
                    data: {
                      u64: 0,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "emit_event",
                      },
                    ],
                    data: {
                      u64: 5,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "emit_event_byte",
                      },
                    ],
                    data: {
                      u64: 1256,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "cpu_insn",
                      },
                    ],
                    data: {
                      u64: 9778732,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "mem_byte",
                      },
                    ],
                    data: {
                      u64: 5416447,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "invoke_time_nsecs",
                      },
                    ],
                    data: {
                      u64: 897739,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "max_rw_key_byte",
                      },
                    ],
                    data: {
                      u64: 112,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "max_rw_data_byte",
                      },
                    ],
                    data: {
                      u64: 512,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "max_rw_code_byte",
                      },
                    ],
                    data: {
                      u64: 34356,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "max_emit_event_byte",
                      },
                    ],
                    data: {
                      u64: 328,
                    },
                  },
                },
              },
            },
          ],
        },
      },
    },
    diagnosticEventsJson: [
      {
        in_successful_contract_call: true,
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
                    "0dd5c710ea6a4a23b32207fd130eadf9c9ce899f4308e93e4ffe53fbaf108a04",
                },
                {
                  symbol: "swap_exact_tokens_for_tokens",
                },
              ],
              data: {
                vec: [
                  {
                    i128: {
                      hi: 0,
                      lo: 540000000,
                    },
                  },
                  {
                    i128: {
                      hi: 0,
                      lo: 243247098,
                    },
                  },
                  {
                    vec: [
                      {
                        address:
                          "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                      },
                      {
                        address:
                          "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
                      },
                    ],
                  },
                  {
                    address:
                      "GB3JCHJUP6HHZJLN5LKQDRFP2HWSLNXYE2TGWDGBTNXIW6MLVRQXNDBC",
                  },
                  {
                    u64: 1752521818363,
                  },
                ],
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "0dd5c710ea6a4a23b32207fd130eadf9c9ce899f4308e93e4ffe53fbaf108a04",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_call",
                },
                {
                  bytes:
                    "19f1e3bb37b77070098cb5ccfaa5c00b2917fe16e39e7424ee29b2c25dd77ae7",
                },
                {
                  symbol: "get_reserves",
                },
              ],
              data: "void",
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "19f1e3bb37b77070098cb5ccfaa5c00b2917fe16e39e7424ee29b2c25dd77ae7",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_return",
                },
                {
                  symbol: "get_reserves",
                },
              ],
              data: {
                vec: [
                  {
                    i128: {
                      hi: 0,
                      lo: 3113176485885,
                    },
                  },
                  {
                    i128: {
                      hi: 0,
                      lo: 1426127224549,
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "0dd5c710ea6a4a23b32207fd130eadf9c9ce899f4308e93e4ffe53fbaf108a04",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_call",
                },
                {
                  bytes:
                    "25b4fcd859aec2fa6348438c489b3c3c10c98b6d21be4fd3cb30cb68953ef977",
                },
                {
                  symbol: "transfer",
                },
              ],
              data: {
                vec: [
                  {
                    address:
                      "GB3JCHJUP6HHZJLN5LKQDRFP2HWSLNXYE2TGWDGBTNXIW6MLVRQXNDBC",
                  },
                  {
                    address:
                      "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
                  },
                  {
                    i128: {
                      hi: 0,
                      lo: 540000000,
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "25b4fcd859aec2fa6348438c489b3c3c10c98b6d21be4fd3cb30cb68953ef977",
          type_: "contract",
          body: {
            v0: {
              topics: [
                {
                  symbol: "transfer",
                },
                {
                  address:
                    "GB3JCHJUP6HHZJLN5LKQDRFP2HWSLNXYE2TGWDGBTNXIW6MLVRQXNDBC",
                },
                {
                  address:
                    "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
                },
                {
                  string: "native",
                },
              ],
              data: {
                i128: {
                  hi: 0,
                  lo: 540000000,
                },
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "25b4fcd859aec2fa6348438c489b3c3c10c98b6d21be4fd3cb30cb68953ef977",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_return",
                },
                {
                  symbol: "transfer",
                },
              ],
              data: "void",
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "0dd5c710ea6a4a23b32207fd130eadf9c9ce899f4308e93e4ffe53fbaf108a04",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_call",
                },
                {
                  bytes:
                    "19f1e3bb37b77070098cb5ccfaa5c00b2917fe16e39e7424ee29b2c25dd77ae7",
                },
                {
                  symbol: "swap",
                },
              ],
              data: {
                vec: [
                  {
                    i128: {
                      hi: 0,
                      lo: 0,
                    },
                  },
                  {
                    i128: {
                      hi: 0,
                      lo: 246585961,
                    },
                  },
                  {
                    address:
                      "GB3JCHJUP6HHZJLN5LKQDRFP2HWSLNXYE2TGWDGBTNXIW6MLVRQXNDBC",
                  },
                ],
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "19f1e3bb37b77070098cb5ccfaa5c00b2917fe16e39e7424ee29b2c25dd77ae7",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_call",
                },
                {
                  bytes:
                    "adefce59aee52968f76061d494c2525b75659fa4296a65f499ef29e56477e496",
                },
                {
                  symbol: "transfer",
                },
              ],
              data: {
                vec: [
                  {
                    address:
                      "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
                  },
                  {
                    address:
                      "GB3JCHJUP6HHZJLN5LKQDRFP2HWSLNXYE2TGWDGBTNXIW6MLVRQXNDBC",
                  },
                  {
                    i128: {
                      hi: 0,
                      lo: 246585961,
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "adefce59aee52968f76061d494c2525b75659fa4296a65f499ef29e56477e496",
          type_: "contract",
          body: {
            v0: {
              topics: [
                {
                  symbol: "transfer",
                },
                {
                  address:
                    "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
                },
                {
                  address:
                    "GB3JCHJUP6HHZJLN5LKQDRFP2HWSLNXYE2TGWDGBTNXIW6MLVRQXNDBC",
                },
                {
                  string:
                    "USDC:GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN",
                },
              ],
              data: {
                i128: {
                  hi: 0,
                  lo: 246585961,
                },
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "adefce59aee52968f76061d494c2525b75659fa4296a65f499ef29e56477e496",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_return",
                },
                {
                  symbol: "transfer",
                },
              ],
              data: "void",
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "19f1e3bb37b77070098cb5ccfaa5c00b2917fe16e39e7424ee29b2c25dd77ae7",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_call",
                },
                {
                  bytes:
                    "25b4fcd859aec2fa6348438c489b3c3c10c98b6d21be4fd3cb30cb68953ef977",
                },
                {
                  symbol: "balance",
                },
              ],
              data: {
                address:
                  "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "25b4fcd859aec2fa6348438c489b3c3c10c98b6d21be4fd3cb30cb68953ef977",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_return",
                },
                {
                  symbol: "balance",
                },
              ],
              data: {
                i128: {
                  hi: 0,
                  lo: 3113716485885,
                },
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "19f1e3bb37b77070098cb5ccfaa5c00b2917fe16e39e7424ee29b2c25dd77ae7",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_call",
                },
                {
                  bytes:
                    "adefce59aee52968f76061d494c2525b75659fa4296a65f499ef29e56477e496",
                },
                {
                  symbol: "balance",
                },
              ],
              data: {
                address:
                  "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "adefce59aee52968f76061d494c2525b75659fa4296a65f499ef29e56477e496",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_return",
                },
                {
                  symbol: "balance",
                },
              ],
              data: {
                i128: {
                  hi: 0,
                  lo: 1425880638588,
                },
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "19f1e3bb37b77070098cb5ccfaa5c00b2917fe16e39e7424ee29b2c25dd77ae7",
          type_: "contract",
          body: {
            v0: {
              topics: [
                {
                  string: "SoroswapPair",
                },
                {
                  symbol: "sync",
                },
              ],
              data: {
                map: [
                  {
                    key: {
                      symbol: "new_reserve_0",
                    },
                    val: {
                      i128: {
                        hi: 0,
                        lo: 3113716485885,
                      },
                    },
                  },
                  {
                    key: {
                      symbol: "new_reserve_1",
                    },
                    val: {
                      i128: {
                        hi: 0,
                        lo: 1425880638588,
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "19f1e3bb37b77070098cb5ccfaa5c00b2917fe16e39e7424ee29b2c25dd77ae7",
          type_: "contract",
          body: {
            v0: {
              topics: [
                {
                  string: "SoroswapPair",
                },
                {
                  symbol: "swap",
                },
              ],
              data: {
                map: [
                  {
                    key: {
                      symbol: "amount_0_in",
                    },
                    val: {
                      i128: {
                        hi: 0,
                        lo: 540000000,
                      },
                    },
                  },
                  {
                    key: {
                      symbol: "amount_0_out",
                    },
                    val: {
                      i128: {
                        hi: 0,
                        lo: 0,
                      },
                    },
                  },
                  {
                    key: {
                      symbol: "amount_1_in",
                    },
                    val: {
                      i128: {
                        hi: 0,
                        lo: 0,
                      },
                    },
                  },
                  {
                    key: {
                      symbol: "amount_1_out",
                    },
                    val: {
                      i128: {
                        hi: 0,
                        lo: 246585961,
                      },
                    },
                  },
                  {
                    key: {
                      symbol: "to",
                    },
                    val: {
                      address:
                        "GB3JCHJUP6HHZJLN5LKQDRFP2HWSLNXYE2TGWDGBTNXIW6MLVRQXNDBC",
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "19f1e3bb37b77070098cb5ccfaa5c00b2917fe16e39e7424ee29b2c25dd77ae7",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_return",
                },
                {
                  symbol: "swap",
                },
              ],
              data: "void",
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "0dd5c710ea6a4a23b32207fd130eadf9c9ce899f4308e93e4ffe53fbaf108a04",
          type_: "contract",
          body: {
            v0: {
              topics: [
                {
                  string: "SoroswapRouter",
                },
                {
                  symbol: "swap",
                },
              ],
              data: {
                map: [
                  {
                    key: {
                      symbol: "amounts",
                    },
                    val: {
                      vec: [
                        {
                          i128: {
                            hi: 0,
                            lo: 540000000,
                          },
                        },
                        {
                          i128: {
                            hi: 0,
                            lo: 246585961,
                          },
                        },
                      ],
                    },
                  },
                  {
                    key: {
                      symbol: "path",
                    },
                    val: {
                      vec: [
                        {
                          address:
                            "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                        },
                        {
                          address:
                            "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
                        },
                      ],
                    },
                  },
                  {
                    key: {
                      symbol: "to",
                    },
                    val: {
                      address:
                        "GB3JCHJUP6HHZJLN5LKQDRFP2HWSLNXYE2TGWDGBTNXIW6MLVRQXNDBC",
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "0dd5c710ea6a4a23b32207fd130eadf9c9ce899f4308e93e4ffe53fbaf108a04",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_return",
                },
                {
                  symbol: "swap_exact_tokens_for_tokens",
                },
              ],
              data: {
                vec: [
                  {
                    i128: {
                      hi: 0,
                      lo: 540000000,
                    },
                  },
                  {
                    i128: {
                      hi: 0,
                      lo: 246585961,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "read_entry",
                },
              ],
              data: {
                u64: 10,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "write_entry",
                },
              ],
              data: {
                u64: 5,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "ledger_read_byte",
                },
              ],
              data: {
                u64: 64016,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "ledger_write_byte",
                },
              ],
              data: {
                u64: 1248,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "read_key_byte",
                },
              ],
              data: {
                u64: 612,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "write_key_byte",
                },
              ],
              data: {
                u64: 0,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "read_data_byte",
                },
              ],
              data: {
                u64: 2148,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "write_data_byte",
                },
              ],
              data: {
                u64: 1248,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "read_code_byte",
                },
              ],
              data: {
                u64: 61868,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "write_code_byte",
                },
              ],
              data: {
                u64: 0,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "emit_event",
                },
              ],
              data: {
                u64: 5,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "emit_event_byte",
                },
              ],
              data: {
                u64: 1256,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "cpu_insn",
                },
              ],
              data: {
                u64: 9778732,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "mem_byte",
                },
              ],
              data: {
                u64: 5416447,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "invoke_time_nsecs",
                },
              ],
              data: {
                u64: 897739,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "max_rw_key_byte",
                },
              ],
              data: {
                u64: 112,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "max_rw_data_byte",
                },
              ],
              data: {
                u64: 512,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "max_rw_code_byte",
                },
              ],
              data: {
                u64: 34356,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "max_emit_event_byte",
                },
              ],
              data: {
                u64: 328,
              },
            },
          },
        },
      },
    ],
    ledger: 58001736,
    createdAt: "1752518224",
  },
};

export const TX_ST_CHANGE_BLEND_USDC_XLM_V2_SUBMIT = {
  jsonrpc: "2.0",
  id: 1,
  result: {
    latestLedger: 58002144,
    latestLedgerCloseTime: "1752520553",
    oldestLedger: 57881185,
    oldestLedgerCloseTime: "1751823522",
    status: "SUCCESS",
    txHash: "79e27e028475dc0eb1c32e7719f896c5e495a480f11ec1b6281c84c491e02f84",
    applicationOrder: 206,
    feeBump: true,
    envelopeJson: {
      tx_fee_bump: {
        tx: {
          fee_source:
            "GDJLH2F7DBI6GC22J7YUTPAEFRSWKG5MN5RSE2GOOYUTO4BH66LHENRW",
          fee: 8654884,
          inner_tx: {
            tx: {
              tx: {
                source_account:
                  "GAFYFGKPF3FBJUACRGF56EF5JQXGKNE2JUVKX2FQWPT2MRULI56JQZYV",
                fee: 4227542,
                seq_num: 234140000407519330,
                cond: "none",
                memo: "none",
                operations: [
                  {
                    source_account: null,
                    body: {
                      invoke_host_function: {
                        host_function: {
                          invoke_contract: {
                            contract_address:
                              "CAJJZSGMMM3PD7N33TAPHGBUGTB43OC73HVIK2L2G6BNGGGYOSSYBXBD",
                            function_name: "submit",
                            args: [
                              {
                                address:
                                  "GAFYFGKPF3FBJUACRGF56EF5JQXGKNE2JUVKX2FQWPT2MRULI56JQZYV",
                              },
                              {
                                address:
                                  "GAFYFGKPF3FBJUACRGF56EF5JQXGKNE2JUVKX2FQWPT2MRULI56JQZYV",
                              },
                              {
                                address:
                                  "GAFYFGKPF3FBJUACRGF56EF5JQXGKNE2JUVKX2FQWPT2MRULI56JQZYV",
                              },
                              {
                                vec: [
                                  {
                                    map: [
                                      {
                                        key: {
                                          symbol: "address",
                                        },
                                        val: {
                                          address:
                                            "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
                                        },
                                      },
                                      {
                                        key: {
                                          symbol: "amount",
                                        },
                                        val: {
                                          i128: {
                                            hi: 0,
                                            lo: 4532864,
                                          },
                                        },
                                      },
                                      {
                                        key: {
                                          symbol: "request_type",
                                        },
                                        val: {
                                          u32: 2,
                                        },
                                      },
                                    ],
                                  },
                                ],
                              },
                            ],
                          },
                        },
                        auth: [
                          {
                            credentials: "source_account",
                            root_invocation: {
                              function: {
                                contract_fn: {
                                  contract_address:
                                    "CAJJZSGMMM3PD7N33TAPHGBUGTB43OC73HVIK2L2G6BNGGGYOSSYBXBD",
                                  function_name: "submit",
                                  args: [
                                    {
                                      address:
                                        "GAFYFGKPF3FBJUACRGF56EF5JQXGKNE2JUVKX2FQWPT2MRULI56JQZYV",
                                    },
                                    {
                                      address:
                                        "GAFYFGKPF3FBJUACRGF56EF5JQXGKNE2JUVKX2FQWPT2MRULI56JQZYV",
                                    },
                                    {
                                      address:
                                        "GAFYFGKPF3FBJUACRGF56EF5JQXGKNE2JUVKX2FQWPT2MRULI56JQZYV",
                                    },
                                    {
                                      vec: [
                                        {
                                          map: [
                                            {
                                              key: {
                                                symbol: "address",
                                              },
                                              val: {
                                                address:
                                                  "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
                                              },
                                            },
                                            {
                                              key: {
                                                symbol: "amount",
                                              },
                                              val: {
                                                i128: {
                                                  hi: 0,
                                                  lo: 4532864,
                                                },
                                              },
                                            },
                                            {
                                              key: {
                                                symbol: "request_type",
                                              },
                                              val: {
                                                u32: 2,
                                              },
                                            },
                                          ],
                                        },
                                      ],
                                    },
                                  ],
                                },
                              },
                              sub_invocations: [
                                {
                                  function: {
                                    contract_fn: {
                                      contract_address:
                                        "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
                                      function_name: "transfer",
                                      args: [
                                        {
                                          address:
                                            "GAFYFGKPF3FBJUACRGF56EF5JQXGKNE2JUVKX2FQWPT2MRULI56JQZYV",
                                        },
                                        {
                                          address:
                                            "CAJJZSGMMM3PD7N33TAPHGBUGTB43OC73HVIK2L2G6BNGGGYOSSYBXBD",
                                        },
                                        {
                                          i128: {
                                            hi: 0,
                                            lo: 4532864,
                                          },
                                        },
                                      ],
                                    },
                                  },
                                  sub_invocations: [],
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                  },
                ],
                ext: {
                  v1: {
                    ext: "v0",
                    resources: {
                      footprint: {
                        read_only: [
                          {
                            contract_data: {
                              contract:
                                "CAJJZSGMMM3PD7N33TAPHGBUGTB43OC73HVIK2L2G6BNGGGYOSSYBXBD",
                              key: {
                                vec: [
                                  {
                                    symbol: "Auction",
                                  },
                                  {
                                    map: [
                                      {
                                        key: {
                                          symbol: "auct_type",
                                        },
                                        val: {
                                          u32: 0,
                                        },
                                      },
                                      {
                                        key: {
                                          symbol: "user",
                                        },
                                        val: {
                                          address:
                                            "GAFYFGKPF3FBJUACRGF56EF5JQXGKNE2JUVKX2FQWPT2MRULI56JQZYV",
                                        },
                                      },
                                    ],
                                  },
                                ],
                              },
                              durability: "temporary",
                            },
                          },
                          {
                            contract_data: {
                              contract:
                                "CAJJZSGMMM3PD7N33TAPHGBUGTB43OC73HVIK2L2G6BNGGGYOSSYBXBD",
                              key: {
                                vec: [
                                  {
                                    symbol: "EmisData",
                                  },
                                  {
                                    u32: 3,
                                  },
                                ],
                              },
                              durability: "persistent",
                            },
                          },
                          {
                            contract_data: {
                              contract:
                                "CAJJZSGMMM3PD7N33TAPHGBUGTB43OC73HVIK2L2G6BNGGGYOSSYBXBD",
                              key: {
                                vec: [
                                  {
                                    symbol: "ResConfig",
                                  },
                                  {
                                    address:
                                      "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
                                  },
                                ],
                              },
                              durability: "persistent",
                            },
                          },
                          {
                            contract_data: {
                              contract:
                                "CAJJZSGMMM3PD7N33TAPHGBUGTB43OC73HVIK2L2G6BNGGGYOSSYBXBD",
                              key: "ledger_key_contract_instance",
                              durability: "persistent",
                            },
                          },
                          {
                            contract_data: {
                              contract:
                                "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
                              key: "ledger_key_contract_instance",
                              durability: "persistent",
                            },
                          },
                          {
                            contract_code: {
                              hash: "a41fc53d6753b6c04eb15b021c55052366a4c8e0e21bc72700f461264ec1350e",
                            },
                          },
                        ],
                        read_write: [
                          {
                            trustline: {
                              account_id:
                                "GAFYFGKPF3FBJUACRGF56EF5JQXGKNE2JUVKX2FQWPT2MRULI56JQZYV",
                              asset: {
                                credit_alphanum4: {
                                  asset_code: "USDC",
                                  issuer:
                                    "GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN",
                                },
                              },
                            },
                          },
                          {
                            contract_data: {
                              contract:
                                "CAJJZSGMMM3PD7N33TAPHGBUGTB43OC73HVIK2L2G6BNGGGYOSSYBXBD",
                              key: {
                                vec: [
                                  {
                                    symbol: "Positions",
                                  },
                                  {
                                    address:
                                      "GAFYFGKPF3FBJUACRGF56EF5JQXGKNE2JUVKX2FQWPT2MRULI56JQZYV",
                                  },
                                ],
                              },
                              durability: "persistent",
                            },
                          },
                          {
                            contract_data: {
                              contract:
                                "CAJJZSGMMM3PD7N33TAPHGBUGTB43OC73HVIK2L2G6BNGGGYOSSYBXBD",
                              key: {
                                vec: [
                                  {
                                    symbol: "ResData",
                                  },
                                  {
                                    address:
                                      "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
                                  },
                                ],
                              },
                              durability: "persistent",
                            },
                          },
                          {
                            contract_data: {
                              contract:
                                "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
                              key: {
                                vec: [
                                  {
                                    symbol: "Balance",
                                  },
                                  {
                                    address:
                                      "CAJJZSGMMM3PD7N33TAPHGBUGTB43OC73HVIK2L2G6BNGGGYOSSYBXBD",
                                  },
                                ],
                              },
                              durability: "persistent",
                            },
                          },
                        ],
                      },
                      instructions: 10311189,
                      read_bytes: 59668,
                      write_bytes: 1040,
                    },
                    resource_fee: 4227442,
                  },
                },
              },
              signatures: [
                {
                  hint: "11339271",
                  signature:
                    "974e9e70db8ddd01ea1055d80998c0dd056f0d33e12916429754a497f9403ea6e64c00698efc1303c4754528d3bd01e3e02fef59f735cc96374f57026b4a840c",
                },
              ],
            },
          },
          ext: "v0",
        },
        signatures: [
          {
            hint: "27f79672",
            signature:
              "1ea2ee4230bbe4fc9fb4277e2b8a7cdfbc24d89ebbc4a6707174140f81257fc04382997e50f583c9ab9637772756779b471b459a25e3f56afb444f23279c3309",
          },
        ],
      },
    },
    resultJson: {
      fee_charged: 3045008,
      result: {
        tx_fee_bump_inner_success: {
          transaction_hash:
            "559845f25ef7c85e982b6189e6ed4cae4d9436997e3be5c1747cb2f3893b82e4",
          result: {
            fee_charged: 3044908,
            result: {
              tx_success: [
                {
                  op_inner: {
                    invoke_host_function: {
                      success:
                        "0134d04fcd94d5ce9d3cf82b85031b4d9c6a561c8d1cbf39558fb34a4d8f3b03",
                    },
                  },
                },
              ],
            },
            ext: "v0",
          },
        },
      },
      ext: "v0",
    },
    resultMetaJson: {
      v3: {
        ext: "v0",
        tx_changes_before: [
          {
            state: {
              last_modified_ledger_seq: 58001151,
              data: {
                account: {
                  account_id:
                    "GDJLH2F7DBI6GC22J7YUTPAEFRSWKG5MN5RSE2GOOYUTO4BH66LHENRW",
                  balance: 26571625186,
                  seq_num: 181263292226863140,
                  num_sub_entries: 4,
                  inflation_dest: null,
                  flags: 0,
                  home_domain: "",
                  thresholds: "01000000",
                  signers: [],
                  ext: {
                    v1: {
                      liabilities: {
                        buying: 0,
                        selling: 0,
                      },
                      ext: {
                        v2: {
                          num_sponsored: 0,
                          num_sponsoring: 2,
                          signer_sponsoring_i_ds: [],
                          ext: {
                            v3: {
                              ext: "v0",
                              seq_ledger: 56604244,
                              seq_time: 1744587782,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              ext: "v0",
            },
          },
          {
            updated: {
              last_modified_ledger_seq: 58001151,
              data: {
                account: {
                  account_id:
                    "GDJLH2F7DBI6GC22J7YUTPAEFRSWKG5MN5RSE2GOOYUTO4BH66LHENRW",
                  balance: 26571625186,
                  seq_num: 181263292226863140,
                  num_sub_entries: 4,
                  inflation_dest: null,
                  flags: 0,
                  home_domain: "",
                  thresholds: "01000000",
                  signers: [],
                  ext: {
                    v1: {
                      liabilities: {
                        buying: 0,
                        selling: 0,
                      },
                      ext: {
                        v2: {
                          num_sponsored: 0,
                          num_sponsoring: 2,
                          signer_sponsoring_i_ds: [],
                          ext: {
                            v3: {
                              ext: "v0",
                              seq_ledger: 56604244,
                              seq_time: 1744587782,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              ext: "v0",
            },
          },
          {
            state: {
              last_modified_ledger_seq: 58001148,
              data: {
                account: {
                  account_id:
                    "GAFYFGKPF3FBJUACRGF56EF5JQXGKNE2JUVKX2FQWPT2MRULI56JQZYV",
                  balance: 21,
                  seq_num: 234140000407519330,
                  num_sub_entries: 4,
                  inflation_dest: null,
                  flags: 0,
                  home_domain: "",
                  thresholds: "00141414",
                  signers: [
                    {
                      key: "GCO6RBY3BSJ77Y77TUXV2O5AV5E5WHAKRVMFDBHHX4H4KSKPVMICFKT4",
                      weight: 10,
                    },
                    {
                      key: "GCWQ6ZTVT3IWCUPO3TMHK5JMTRXP52VWROAEFBFRVKNDMHQRGOJHCMYH",
                      weight: 20,
                    },
                    {
                      key: "GDRWVPEIZK3YDKSLFPY4I4S2FOFZ6SJIRTUHTFN4NZGZTZGOIBRD4CT7",
                      weight: 10,
                    },
                  ],
                  ext: {
                    v1: {
                      liabilities: {
                        buying: 0,
                        selling: 0,
                      },
                      ext: {
                        v2: {
                          num_sponsored: 6,
                          num_sponsoring: 0,
                          signer_sponsoring_i_ds: [
                            "GBKAZKU33LRJX47UGDX2YGA7UIJ5BWSVAFQJLBAUYIMOS5KBPVXKGO4X",
                            "GA4LM6LLOUTUEASMKVKRNBRFIWIZLHS6NWY7NBDFY45QP2IQGZDAJKIP",
                            "GBKAZKU33LRJX47UGDX2YGA7UIJ5BWSVAFQJLBAUYIMOS5KBPVXKGO4X",
                          ],
                          ext: {
                            v3: {
                              ext: "v0",
                              seq_ledger: 58001148,
                              seq_time: 1752514858,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              ext: {
                v1: {
                  sponsoring_id:
                    "GBKAZKU33LRJX47UGDX2YGA7UIJ5BWSVAFQJLBAUYIMOS5KBPVXKGO4X",
                  ext: "v0",
                },
              },
            },
          },
          {
            updated: {
              last_modified_ledger_seq: 58001151,
              data: {
                account: {
                  account_id:
                    "GAFYFGKPF3FBJUACRGF56EF5JQXGKNE2JUVKX2FQWPT2MRULI56JQZYV",
                  balance: 21,
                  seq_num: 234140000407519330,
                  num_sub_entries: 4,
                  inflation_dest: null,
                  flags: 0,
                  home_domain: "",
                  thresholds: "00141414",
                  signers: [
                    {
                      key: "GCO6RBY3BSJ77Y77TUXV2O5AV5E5WHAKRVMFDBHHX4H4KSKPVMICFKT4",
                      weight: 10,
                    },
                    {
                      key: "GCWQ6ZTVT3IWCUPO3TMHK5JMTRXP52VWROAEFBFRVKNDMHQRGOJHCMYH",
                      weight: 20,
                    },
                    {
                      key: "GDRWVPEIZK3YDKSLFPY4I4S2FOFZ6SJIRTUHTFN4NZGZTZGOIBRD4CT7",
                      weight: 10,
                    },
                  ],
                  ext: {
                    v1: {
                      liabilities: {
                        buying: 0,
                        selling: 0,
                      },
                      ext: {
                        v2: {
                          num_sponsored: 6,
                          num_sponsoring: 0,
                          signer_sponsoring_i_ds: [
                            "GBKAZKU33LRJX47UGDX2YGA7UIJ5BWSVAFQJLBAUYIMOS5KBPVXKGO4X",
                            "GA4LM6LLOUTUEASMKVKRNBRFIWIZLHS6NWY7NBDFY45QP2IQGZDAJKIP",
                            "GBKAZKU33LRJX47UGDX2YGA7UIJ5BWSVAFQJLBAUYIMOS5KBPVXKGO4X",
                          ],
                          ext: {
                            v3: {
                              ext: "v0",
                              seq_ledger: 58001151,
                              seq_time: 1752514875,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              ext: {
                v1: {
                  sponsoring_id:
                    "GBKAZKU33LRJX47UGDX2YGA7UIJ5BWSVAFQJLBAUYIMOS5KBPVXKGO4X",
                  ext: "v0",
                },
              },
            },
          },
        ],
        operations: [
          {
            changes: [
              {
                state: {
                  last_modified_ledger_seq: 58001147,
                  data: {
                    contract_data: {
                      ext: "v0",
                      contract:
                        "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
                      key: {
                        vec: [
                          {
                            symbol: "Balance",
                          },
                          {
                            address:
                              "CAJJZSGMMM3PD7N33TAPHGBUGTB43OC73HVIK2L2G6BNGGGYOSSYBXBD",
                          },
                        ],
                      },
                      durability: "persistent",
                      val: {
                        map: [
                          {
                            key: {
                              symbol: "amount",
                            },
                            val: {
                              i128: {
                                hi: 0,
                                lo: 5920897566858,
                              },
                            },
                          },
                          {
                            key: {
                              symbol: "authorized",
                            },
                            val: {
                              bool: true,
                            },
                          },
                          {
                            key: {
                              symbol: "clawback",
                            },
                            val: {
                              bool: false,
                            },
                          },
                        ],
                      },
                    },
                  },
                  ext: "v0",
                },
              },
              {
                updated: {
                  last_modified_ledger_seq: 58001151,
                  data: {
                    contract_data: {
                      ext: "v0",
                      contract:
                        "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
                      key: {
                        vec: [
                          {
                            symbol: "Balance",
                          },
                          {
                            address:
                              "CAJJZSGMMM3PD7N33TAPHGBUGTB43OC73HVIK2L2G6BNGGGYOSSYBXBD",
                          },
                        ],
                      },
                      durability: "persistent",
                      val: {
                        map: [
                          {
                            key: {
                              symbol: "amount",
                            },
                            val: {
                              i128: {
                                hi: 0,
                                lo: 5920902099722,
                              },
                            },
                          },
                          {
                            key: {
                              symbol: "authorized",
                            },
                            val: {
                              bool: true,
                            },
                          },
                          {
                            key: {
                              symbol: "clawback",
                            },
                            val: {
                              bool: false,
                            },
                          },
                        ],
                      },
                    },
                  },
                  ext: "v0",
                },
              },
              {
                state: {
                  last_modified_ledger_seq: 58001147,
                  data: {
                    contract_data: {
                      ext: "v0",
                      contract:
                        "CAJJZSGMMM3PD7N33TAPHGBUGTB43OC73HVIK2L2G6BNGGGYOSSYBXBD",
                      key: {
                        vec: [
                          {
                            symbol: "ResData",
                          },
                          {
                            address:
                              "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
                          },
                        ],
                      },
                      durability: "persistent",
                      val: {
                        map: [
                          {
                            key: {
                              symbol: "b_rate",
                            },
                            val: {
                              i128: {
                                hi: 0,
                                lo: 1013025868788,
                              },
                            },
                          },
                          {
                            key: {
                              symbol: "b_supply",
                            },
                            val: {
                              i128: {
                                hi: 0,
                                lo: 38433610767542,
                              },
                            },
                          },
                          {
                            key: {
                              symbol: "backstop_credit",
                            },
                            val: {
                              i128: {
                                hi: 0,
                                lo: 459469224,
                              },
                            },
                          },
                          {
                            key: {
                              symbol: "d_rate",
                            },
                            val: {
                              i128: {
                                hi: 0,
                                lo: 1019661123828,
                              },
                            },
                          },
                          {
                            key: {
                              symbol: "d_supply",
                            },
                            val: {
                              i128: {
                                hi: 0,
                                lo: 32377231398361,
                              },
                            },
                          },
                          {
                            key: {
                              symbol: "ir_mod",
                            },
                            val: {
                              i128: {
                                hi: 0,
                                lo: 10859313,
                              },
                            },
                          },
                          {
                            key: {
                              symbol: "last_time",
                            },
                            val: {
                              u64: 1752514852,
                            },
                          },
                        ],
                      },
                    },
                  },
                  ext: "v0",
                },
              },
              {
                updated: {
                  last_modified_ledger_seq: 58001151,
                  data: {
                    contract_data: {
                      ext: "v0",
                      contract:
                        "CAJJZSGMMM3PD7N33TAPHGBUGTB43OC73HVIK2L2G6BNGGGYOSSYBXBD",
                      key: {
                        vec: [
                          {
                            symbol: "ResData",
                          },
                          {
                            address:
                              "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
                          },
                        ],
                      },
                      durability: "persistent",
                      val: {
                        map: [
                          {
                            key: {
                              symbol: "b_rate",
                            },
                            val: {
                              i128: {
                                hi: 0,
                                lo: 1013025927758,
                              },
                            },
                          },
                          {
                            key: {
                              symbol: "b_supply",
                            },
                            val: {
                              i128: {
                                hi: 0,
                                lo: 38433615242120,
                              },
                            },
                          },
                          {
                            key: {
                              symbol: "backstop_credit",
                            },
                            val: {
                              i128: {
                                hi: 0,
                                lo: 460035832,
                              },
                            },
                          },
                          {
                            key: {
                              symbol: "d_rate",
                            },
                            val: {
                              i128: {
                                hi: 0,
                                lo: 1019661211329,
                              },
                            },
                          },
                          {
                            key: {
                              symbol: "d_supply",
                            },
                            val: {
                              i128: {
                                hi: 0,
                                lo: 32377231398361,
                              },
                            },
                          },
                          {
                            key: {
                              symbol: "ir_mod",
                            },
                            val: {
                              i128: {
                                hi: 0,
                                lo: 10859335,
                              },
                            },
                          },
                          {
                            key: {
                              symbol: "last_time",
                            },
                            val: {
                              u64: 1752514875,
                            },
                          },
                        ],
                      },
                    },
                  },
                  ext: "v0",
                },
              },
              {
                created: {
                  last_modified_ledger_seq: 58001151,
                  data: {
                    ttl: {
                      key_hash:
                        "34b307cd1a85760f1a9e67c1988f7427f03562757f6270dfdaf669dbf2e829ca",
                      live_until_ledger_seq: 60074750,
                    },
                  },
                  ext: "v0",
                },
              },
              {
                created: {
                  last_modified_ledger_seq: 58001151,
                  data: {
                    contract_data: {
                      ext: "v0",
                      contract:
                        "CAJJZSGMMM3PD7N33TAPHGBUGTB43OC73HVIK2L2G6BNGGGYOSSYBXBD",
                      key: {
                        vec: [
                          {
                            symbol: "Positions",
                          },
                          {
                            address:
                              "GAFYFGKPF3FBJUACRGF56EF5JQXGKNE2JUVKX2FQWPT2MRULI56JQZYV",
                          },
                        ],
                      },
                      durability: "persistent",
                      val: {
                        map: [
                          {
                            key: {
                              symbol: "collateral",
                            },
                            val: {
                              map: [
                                {
                                  key: {
                                    u32: 1,
                                  },
                                  val: {
                                    i128: {
                                      hi: 0,
                                      lo: 4474578,
                                    },
                                  },
                                },
                              ],
                            },
                          },
                          {
                            key: {
                              symbol: "liabilities",
                            },
                            val: {
                              map: [],
                            },
                          },
                          {
                            key: {
                              symbol: "supply",
                            },
                            val: {
                              map: [],
                            },
                          },
                        ],
                      },
                    },
                  },
                  ext: "v0",
                },
              },
              {
                state: {
                  last_modified_ledger_seq: 58001148,
                  data: {
                    trustline: {
                      account_id:
                        "GAFYFGKPF3FBJUACRGF56EF5JQXGKNE2JUVKX2FQWPT2MRULI56JQZYV",
                      asset: {
                        credit_alphanum4: {
                          asset_code: "USDC",
                          issuer:
                            "GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN",
                        },
                      },
                      balance: 506624406,
                      limit: 9223372036854776000,
                      flags: 1,
                      ext: "v0",
                    },
                  },
                  ext: {
                    v1: {
                      sponsoring_id:
                        "GBKAZKU33LRJX47UGDX2YGA7UIJ5BWSVAFQJLBAUYIMOS5KBPVXKGO4X",
                      ext: "v0",
                    },
                  },
                },
              },
              {
                updated: {
                  last_modified_ledger_seq: 58001151,
                  data: {
                    trustline: {
                      account_id:
                        "GAFYFGKPF3FBJUACRGF56EF5JQXGKNE2JUVKX2FQWPT2MRULI56JQZYV",
                      asset: {
                        credit_alphanum4: {
                          asset_code: "USDC",
                          issuer:
                            "GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN",
                        },
                      },
                      balance: 502091542,
                      limit: 9223372036854776000,
                      flags: 1,
                      ext: "v0",
                    },
                  },
                  ext: {
                    v1: {
                      sponsoring_id:
                        "GBKAZKU33LRJX47UGDX2YGA7UIJ5BWSVAFQJLBAUYIMOS5KBPVXKGO4X",
                      ext: "v0",
                    },
                  },
                },
              },
            ],
          },
        ],
        tx_changes_after: [
          {
            state: {
              last_modified_ledger_seq: 58001151,
              data: {
                account: {
                  account_id:
                    "GDJLH2F7DBI6GC22J7YUTPAEFRSWKG5MN5RSE2GOOYUTO4BH66LHENRW",
                  balance: 26571625186,
                  seq_num: 181263292226863140,
                  num_sub_entries: 4,
                  inflation_dest: null,
                  flags: 0,
                  home_domain: "",
                  thresholds: "01000000",
                  signers: [],
                  ext: {
                    v1: {
                      liabilities: {
                        buying: 0,
                        selling: 0,
                      },
                      ext: {
                        v2: {
                          num_sponsored: 0,
                          num_sponsoring: 2,
                          signer_sponsoring_i_ds: [],
                          ext: {
                            v3: {
                              ext: "v0",
                              seq_ledger: 56604244,
                              seq_time: 1744587782,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              ext: "v0",
            },
          },
          {
            updated: {
              last_modified_ledger_seq: 58001151,
              data: {
                account: {
                  account_id:
                    "GDJLH2F7DBI6GC22J7YUTPAEFRSWKG5MN5RSE2GOOYUTO4BH66LHENRW",
                  balance: 26572807820,
                  seq_num: 181263292226863140,
                  num_sub_entries: 4,
                  inflation_dest: null,
                  flags: 0,
                  home_domain: "",
                  thresholds: "01000000",
                  signers: [],
                  ext: {
                    v1: {
                      liabilities: {
                        buying: 0,
                        selling: 0,
                      },
                      ext: {
                        v2: {
                          num_sponsored: 0,
                          num_sponsoring: 2,
                          signer_sponsoring_i_ds: [],
                          ext: {
                            v3: {
                              ext: "v0",
                              seq_ledger: 56604244,
                              seq_time: 1744587782,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              ext: "v0",
            },
          },
        ],
        soroban_meta: {
          ext: {
            v1: {
              ext: "v0",
              total_non_refundable_resource_fee_charged: 282052,
              total_refundable_resource_fee_charged: 2762756,
              rent_fee_charged: 2756974,
            },
          },
          events: [
            {
              ext: "v0",
              contract_id:
                "129cc8cc6336f1fdbbdcc0f3983434c3cdb85fd9ea85697a3782d318d874a580",
              type_: "contract",
              body: {
                v0: {
                  topics: [
                    {
                      symbol: "supply_collateral",
                    },
                    {
                      address:
                        "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
                    },
                    {
                      address:
                        "GAFYFGKPF3FBJUACRGF56EF5JQXGKNE2JUVKX2FQWPT2MRULI56JQZYV",
                    },
                  ],
                  data: {
                    vec: [
                      {
                        i128: {
                          hi: 0,
                          lo: 4532864,
                        },
                      },
                      {
                        i128: {
                          hi: 0,
                          lo: 4474578,
                        },
                      },
                    ],
                  },
                },
              },
            },
            {
              ext: "v0",
              contract_id:
                "adefce59aee52968f76061d494c2525b75659fa4296a65f499ef29e56477e496",
              type_: "contract",
              body: {
                v0: {
                  topics: [
                    {
                      symbol: "transfer",
                    },
                    {
                      address:
                        "GAFYFGKPF3FBJUACRGF56EF5JQXGKNE2JUVKX2FQWPT2MRULI56JQZYV",
                    },
                    {
                      address:
                        "CAJJZSGMMM3PD7N33TAPHGBUGTB43OC73HVIK2L2G6BNGGGYOSSYBXBD",
                    },
                    {
                      string:
                        "USDC:GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN",
                    },
                  ],
                  data: {
                    i128: {
                      hi: 0,
                      lo: 4532864,
                    },
                  },
                },
              },
            },
          ],
          return_value: {
            map: [
              {
                key: {
                  symbol: "collateral",
                },
                val: {
                  map: [
                    {
                      key: {
                        u32: 1,
                      },
                      val: {
                        i128: {
                          hi: 0,
                          lo: 4474578,
                        },
                      },
                    },
                  ],
                },
              },
              {
                key: {
                  symbol: "liabilities",
                },
                val: {
                  map: [],
                },
              },
              {
                key: {
                  symbol: "supply",
                },
                val: {
                  map: [],
                },
              },
            ],
          },
          diagnostic_events: [
            {
              in_successful_contract_call: true,
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
                          "129cc8cc6336f1fdbbdcc0f3983434c3cdb85fd9ea85697a3782d318d874a580",
                      },
                      {
                        symbol: "submit",
                      },
                    ],
                    data: {
                      vec: [
                        {
                          address:
                            "GAFYFGKPF3FBJUACRGF56EF5JQXGKNE2JUVKX2FQWPT2MRULI56JQZYV",
                        },
                        {
                          address:
                            "GAFYFGKPF3FBJUACRGF56EF5JQXGKNE2JUVKX2FQWPT2MRULI56JQZYV",
                        },
                        {
                          address:
                            "GAFYFGKPF3FBJUACRGF56EF5JQXGKNE2JUVKX2FQWPT2MRULI56JQZYV",
                        },
                        {
                          vec: [
                            {
                              map: [
                                {
                                  key: {
                                    symbol: "address",
                                  },
                                  val: {
                                    address:
                                      "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
                                  },
                                },
                                {
                                  key: {
                                    symbol: "amount",
                                  },
                                  val: {
                                    i128: {
                                      hi: 0,
                                      lo: 4532864,
                                    },
                                  },
                                },
                                {
                                  key: {
                                    symbol: "request_type",
                                  },
                                  val: {
                                    u32: 2,
                                  },
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
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "129cc8cc6336f1fdbbdcc0f3983434c3cdb85fd9ea85697a3782d318d874a580",
                type_: "contract",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "supply_collateral",
                      },
                      {
                        address:
                          "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
                      },
                      {
                        address:
                          "GAFYFGKPF3FBJUACRGF56EF5JQXGKNE2JUVKX2FQWPT2MRULI56JQZYV",
                      },
                    ],
                    data: {
                      vec: [
                        {
                          i128: {
                            hi: 0,
                            lo: 4532864,
                          },
                        },
                        {
                          i128: {
                            hi: 0,
                            lo: 4474578,
                          },
                        },
                      ],
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "129cc8cc6336f1fdbbdcc0f3983434c3cdb85fd9ea85697a3782d318d874a580",
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "fn_call",
                      },
                      {
                        bytes:
                          "adefce59aee52968f76061d494c2525b75659fa4296a65f499ef29e56477e496",
                      },
                      {
                        symbol: "transfer",
                      },
                    ],
                    data: {
                      vec: [
                        {
                          address:
                            "GAFYFGKPF3FBJUACRGF56EF5JQXGKNE2JUVKX2FQWPT2MRULI56JQZYV",
                        },
                        {
                          address:
                            "CAJJZSGMMM3PD7N33TAPHGBUGTB43OC73HVIK2L2G6BNGGGYOSSYBXBD",
                        },
                        {
                          i128: {
                            hi: 0,
                            lo: 4532864,
                          },
                        },
                      ],
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "adefce59aee52968f76061d494c2525b75659fa4296a65f499ef29e56477e496",
                type_: "contract",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "transfer",
                      },
                      {
                        address:
                          "GAFYFGKPF3FBJUACRGF56EF5JQXGKNE2JUVKX2FQWPT2MRULI56JQZYV",
                      },
                      {
                        address:
                          "CAJJZSGMMM3PD7N33TAPHGBUGTB43OC73HVIK2L2G6BNGGGYOSSYBXBD",
                      },
                      {
                        string:
                          "USDC:GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN",
                      },
                    ],
                    data: {
                      i128: {
                        hi: 0,
                        lo: 4532864,
                      },
                    },
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "adefce59aee52968f76061d494c2525b75659fa4296a65f499ef29e56477e496",
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "fn_return",
                      },
                      {
                        symbol: "transfer",
                      },
                    ],
                    data: "void",
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "129cc8cc6336f1fdbbdcc0f3983434c3cdb85fd9ea85697a3782d318d874a580",
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "fn_return",
                      },
                      {
                        symbol: "submit",
                      },
                    ],
                    data: {
                      map: [
                        {
                          key: {
                            symbol: "collateral",
                          },
                          val: {
                            map: [
                              {
                                key: {
                                  u32: 1,
                                },
                                val: {
                                  i128: {
                                    hi: 0,
                                    lo: 4474578,
                                  },
                                },
                              },
                            ],
                          },
                        },
                        {
                          key: {
                            symbol: "liabilities",
                          },
                          val: {
                            map: [],
                          },
                        },
                        {
                          key: {
                            symbol: "supply",
                          },
                          val: {
                            map: [],
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "read_entry",
                      },
                    ],
                    data: {
                      u64: 10,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "write_entry",
                      },
                    ],
                    data: {
                      u64: 4,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "ledger_read_byte",
                      },
                    ],
                    data: {
                      u64: 59668,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "ledger_write_byte",
                      },
                    ],
                    data: {
                      u64: 1040,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "read_key_byte",
                      },
                    ],
                    data: {
                      u64: 924,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "write_key_byte",
                      },
                    ],
                    data: {
                      u64: 0,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "read_data_byte",
                      },
                    ],
                    data: {
                      u64: 2240,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "write_data_byte",
                      },
                    ],
                    data: {
                      u64: 1040,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "read_code_byte",
                      },
                    ],
                    data: {
                      u64: 57428,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "write_code_byte",
                      },
                    ],
                    data: {
                      u64: 0,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "emit_event",
                      },
                    ],
                    data: {
                      u64: 2,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "emit_event_byte",
                      },
                    ],
                    data: {
                      u64: 460,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "cpu_insn",
                      },
                    ],
                    data: {
                      u64: 9851780,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "mem_byte",
                      },
                    ],
                    data: {
                      u64: 3161202,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "invoke_time_nsecs",
                      },
                    ],
                    data: {
                      u64: 916174,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "max_rw_key_byte",
                      },
                    ],
                    data: {
                      u64: 168,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "max_rw_data_byte",
                      },
                    ],
                    data: {
                      u64: 520,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "max_rw_code_byte",
                      },
                    ],
                    data: {
                      u64: 57428,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "max_emit_event_byte",
                      },
                    ],
                    data: {
                      u64: 244,
                    },
                  },
                },
              },
            },
          ],
        },
      },
    },
    diagnosticEventsJson: [
      {
        in_successful_contract_call: true,
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
                    "129cc8cc6336f1fdbbdcc0f3983434c3cdb85fd9ea85697a3782d318d874a580",
                },
                {
                  symbol: "submit",
                },
              ],
              data: {
                vec: [
                  {
                    address:
                      "GAFYFGKPF3FBJUACRGF56EF5JQXGKNE2JUVKX2FQWPT2MRULI56JQZYV",
                  },
                  {
                    address:
                      "GAFYFGKPF3FBJUACRGF56EF5JQXGKNE2JUVKX2FQWPT2MRULI56JQZYV",
                  },
                  {
                    address:
                      "GAFYFGKPF3FBJUACRGF56EF5JQXGKNE2JUVKX2FQWPT2MRULI56JQZYV",
                  },
                  {
                    vec: [
                      {
                        map: [
                          {
                            key: {
                              symbol: "address",
                            },
                            val: {
                              address:
                                "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
                            },
                          },
                          {
                            key: {
                              symbol: "amount",
                            },
                            val: {
                              i128: {
                                hi: 0,
                                lo: 4532864,
                              },
                            },
                          },
                          {
                            key: {
                              symbol: "request_type",
                            },
                            val: {
                              u32: 2,
                            },
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
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "129cc8cc6336f1fdbbdcc0f3983434c3cdb85fd9ea85697a3782d318d874a580",
          type_: "contract",
          body: {
            v0: {
              topics: [
                {
                  symbol: "supply_collateral",
                },
                {
                  address:
                    "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
                },
                {
                  address:
                    "GAFYFGKPF3FBJUACRGF56EF5JQXGKNE2JUVKX2FQWPT2MRULI56JQZYV",
                },
              ],
              data: {
                vec: [
                  {
                    i128: {
                      hi: 0,
                      lo: 4532864,
                    },
                  },
                  {
                    i128: {
                      hi: 0,
                      lo: 4474578,
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "129cc8cc6336f1fdbbdcc0f3983434c3cdb85fd9ea85697a3782d318d874a580",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_call",
                },
                {
                  bytes:
                    "adefce59aee52968f76061d494c2525b75659fa4296a65f499ef29e56477e496",
                },
                {
                  symbol: "transfer",
                },
              ],
              data: {
                vec: [
                  {
                    address:
                      "GAFYFGKPF3FBJUACRGF56EF5JQXGKNE2JUVKX2FQWPT2MRULI56JQZYV",
                  },
                  {
                    address:
                      "CAJJZSGMMM3PD7N33TAPHGBUGTB43OC73HVIK2L2G6BNGGGYOSSYBXBD",
                  },
                  {
                    i128: {
                      hi: 0,
                      lo: 4532864,
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "adefce59aee52968f76061d494c2525b75659fa4296a65f499ef29e56477e496",
          type_: "contract",
          body: {
            v0: {
              topics: [
                {
                  symbol: "transfer",
                },
                {
                  address:
                    "GAFYFGKPF3FBJUACRGF56EF5JQXGKNE2JUVKX2FQWPT2MRULI56JQZYV",
                },
                {
                  address:
                    "CAJJZSGMMM3PD7N33TAPHGBUGTB43OC73HVIK2L2G6BNGGGYOSSYBXBD",
                },
                {
                  string:
                    "USDC:GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN",
                },
              ],
              data: {
                i128: {
                  hi: 0,
                  lo: 4532864,
                },
              },
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "adefce59aee52968f76061d494c2525b75659fa4296a65f499ef29e56477e496",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_return",
                },
                {
                  symbol: "transfer",
                },
              ],
              data: "void",
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "129cc8cc6336f1fdbbdcc0f3983434c3cdb85fd9ea85697a3782d318d874a580",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_return",
                },
                {
                  symbol: "submit",
                },
              ],
              data: {
                map: [
                  {
                    key: {
                      symbol: "collateral",
                    },
                    val: {
                      map: [
                        {
                          key: {
                            u32: 1,
                          },
                          val: {
                            i128: {
                              hi: 0,
                              lo: 4474578,
                            },
                          },
                        },
                      ],
                    },
                  },
                  {
                    key: {
                      symbol: "liabilities",
                    },
                    val: {
                      map: [],
                    },
                  },
                  {
                    key: {
                      symbol: "supply",
                    },
                    val: {
                      map: [],
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "read_entry",
                },
              ],
              data: {
                u64: 10,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "write_entry",
                },
              ],
              data: {
                u64: 4,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "ledger_read_byte",
                },
              ],
              data: {
                u64: 59668,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "ledger_write_byte",
                },
              ],
              data: {
                u64: 1040,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "read_key_byte",
                },
              ],
              data: {
                u64: 924,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "write_key_byte",
                },
              ],
              data: {
                u64: 0,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "read_data_byte",
                },
              ],
              data: {
                u64: 2240,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "write_data_byte",
                },
              ],
              data: {
                u64: 1040,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "read_code_byte",
                },
              ],
              data: {
                u64: 57428,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "write_code_byte",
                },
              ],
              data: {
                u64: 0,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "emit_event",
                },
              ],
              data: {
                u64: 2,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "emit_event_byte",
                },
              ],
              data: {
                u64: 460,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "cpu_insn",
                },
              ],
              data: {
                u64: 9851780,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "mem_byte",
                },
              ],
              data: {
                u64: 3161202,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "invoke_time_nsecs",
                },
              ],
              data: {
                u64: 916174,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "max_rw_key_byte",
                },
              ],
              data: {
                u64: 168,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "max_rw_data_byte",
                },
              ],
              data: {
                u64: 520,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "max_rw_code_byte",
                },
              ],
              data: {
                u64: 57428,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "max_emit_event_byte",
                },
              ],
              data: {
                u64: 244,
              },
            },
          },
        },
      },
    ],
    ledger: 58001151,
    createdAt: "1752514875",
  },
};

export const TX_ST_CHANGE_NO_STATE_CHANGE = {
  jsonrpc: "2.0",
  id: 1,
  result: {
    latestLedger: 448997,
    latestLedgerCloseTime: "1752514427",
    oldestLedger: 328038,
    oldestLedgerCloseTime: "1751909117",
    status: "SUCCESS",
    txHash: "38653233a377be8640f478bbb46516ae439301216dae1a698de28ed19d4b686e",
    applicationOrder: 1,
    feeBump: false,
    envelopeJson: {
      tx: {
        tx: {
          source_account:
            "GAJZB4Z5NXKKZAE2GEZL66NDDZSUVX26CAOWO4BP6ROZPPP4RAA44BLY",
          fee: 213097,
          seq_num: 1824411913027642,
          cond: {
            time: {
              min_time: 0,
              max_time: 1752432696,
            },
          },
          memo: "none",
          operations: [
            {
              source_account: null,
              body: {
                invoke_host_function: {
                  host_function: {
                    invoke_contract: {
                      contract_address:
                        "CDIFETSFPPPRIGUSC3UUP4O4JTWGWDTHNVPKETAKE7DIM32W4CMDVAGA",
                      function_name: "owner",
                      args: [],
                    },
                  },
                  auth: [],
                },
              },
            },
          ],
          ext: {
            v1: {
              ext: "v0",
              resources: {
                footprint: {
                  read_only: [
                    {
                      contract_data: {
                        contract:
                          "CDIFETSFPPPRIGUSC3UUP4O4JTWGWDTHNVPKETAKE7DIM32W4CMDVAGA",
                        key: "ledger_key_contract_instance",
                        durability: "persistent",
                      },
                    },
                    {
                      contract_code: {
                        hash: "4e754c181a2baa8ee104aa13728ac3632c127724ba9b66f5c6262624ae0a2060",
                      },
                    },
                  ],
                  read_write: [],
                },
                instructions: 10791644,
                read_bytes: 71036,
                write_bytes: 0,
              },
              resource_fee: 212997,
            },
          },
        },
        signatures: [
          {
            hint: "fc8801ce",
            signature:
              "088ea04dd349dbd55440db801677fcfe06e19901c6f6246be2186c6bda0504336939a818497bc7f5e5cc1e61d6da0e1755631fc67a465ec735c570a1676f2808",
          },
        ],
      },
    },
    resultJson: {
      fee_charged: 174664,
      result: {
        tx_success: [
          {
            op_inner: {
              invoke_host_function: {
                success:
                  "6b270534fd5682aa9823a0442e5f66375d1c31dca8e57c60e836ce3c0a971ed8",
              },
            },
          },
        ],
      },
      ext: "v0",
    },
    resultMetaJson: {
      v3: {
        ext: "v0",
        tx_changes_before: [
          {
            state: {
              last_modified_ledger_seq: 432660,
              data: {
                account: {
                  account_id:
                    "GAJZB4Z5NXKKZAE2GEZL66NDDZSUVX26CAOWO4BP6ROZPPP4RAA44BLY",
                  balance: 99058157317,
                  seq_num: 1824411913027641,
                  num_sub_entries: 0,
                  inflation_dest: null,
                  flags: 0,
                  home_domain: "",
                  thresholds: "01000000",
                  signers: [],
                  ext: {
                    v1: {
                      liabilities: {
                        buying: 0,
                        selling: 0,
                      },
                      ext: {
                        v2: {
                          num_sponsored: 0,
                          num_sponsoring: 0,
                          signer_sponsoring_i_ds: [],
                          ext: {
                            v3: {
                              ext: "v0",
                              seq_ledger: 432574,
                              seq_time: 1752432240,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              ext: "v0",
            },
          },
          {
            updated: {
              last_modified_ledger_seq: 432660,
              data: {
                account: {
                  account_id:
                    "GAJZB4Z5NXKKZAE2GEZL66NDDZSUVX26CAOWO4BP6ROZPPP4RAA44BLY",
                  balance: 99058157317,
                  seq_num: 1824411913027642,
                  num_sub_entries: 0,
                  inflation_dest: null,
                  flags: 0,
                  home_domain: "",
                  thresholds: "01000000",
                  signers: [],
                  ext: {
                    v1: {
                      liabilities: {
                        buying: 0,
                        selling: 0,
                      },
                      ext: {
                        v2: {
                          num_sponsored: 0,
                          num_sponsoring: 0,
                          signer_sponsoring_i_ds: [],
                          ext: {
                            v3: {
                              ext: "v0",
                              seq_ledger: 432660,
                              seq_time: 1752432671,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              ext: "v0",
            },
          },
        ],
        operations: [
          {
            changes: [],
          },
        ],
        tx_changes_after: [
          {
            state: {
              last_modified_ledger_seq: 432660,
              data: {
                account: {
                  account_id:
                    "GAJZB4Z5NXKKZAE2GEZL66NDDZSUVX26CAOWO4BP6ROZPPP4RAA44BLY",
                  balance: 99058157317,
                  seq_num: 1824411913027642,
                  num_sub_entries: 0,
                  inflation_dest: null,
                  flags: 0,
                  home_domain: "",
                  thresholds: "01000000",
                  signers: [],
                  ext: {
                    v1: {
                      liabilities: {
                        buying: 0,
                        selling: 0,
                      },
                      ext: {
                        v2: {
                          num_sponsored: 0,
                          num_sponsoring: 0,
                          signer_sponsoring_i_ds: [],
                          ext: {
                            v3: {
                              ext: "v0",
                              seq_ledger: 432660,
                              seq_time: 1752432671,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              ext: "v0",
            },
          },
          {
            updated: {
              last_modified_ledger_seq: 432660,
              data: {
                account: {
                  account_id:
                    "GAJZB4Z5NXKKZAE2GEZL66NDDZSUVX26CAOWO4BP6ROZPPP4RAA44BLY",
                  balance: 99058195750,
                  seq_num: 1824411913027642,
                  num_sub_entries: 0,
                  inflation_dest: null,
                  flags: 0,
                  home_domain: "",
                  thresholds: "01000000",
                  signers: [],
                  ext: {
                    v1: {
                      liabilities: {
                        buying: 0,
                        selling: 0,
                      },
                      ext: {
                        v2: {
                          num_sponsored: 0,
                          num_sponsoring: 0,
                          signer_sponsoring_i_ds: [],
                          ext: {
                            v3: {
                              ext: "v0",
                              seq_ledger: 432660,
                              seq_time: 1752432671,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              ext: "v0",
            },
          },
        ],
        soroban_meta: {
          ext: {
            v1: {
              ext: "v0",
              total_non_refundable_resource_fee_charged: 174134,
              total_refundable_resource_fee_charged: 430,
              rent_fee_charged: 0,
            },
          },
          events: [],
          return_value: {
            address: "GAJZB4Z5NXKKZAE2GEZL66NDDZSUVX26CAOWO4BP6ROZPPP4RAA44BLY",
          },
          diagnostic_events: [
            {
              in_successful_contract_call: true,
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
                          "d0524e457bdf141a9216e947f1dc4cec6b0e676d5ea24c0a27c6866f56e0983a",
                      },
                      {
                        symbol: "owner",
                      },
                    ],
                    data: "void",
                  },
                },
              },
            },
            {
              in_successful_contract_call: true,
              event: {
                ext: "v0",
                contract_id:
                  "d0524e457bdf141a9216e947f1dc4cec6b0e676d5ea24c0a27c6866f56e0983a",
                type_: "diagnostic",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "fn_return",
                      },
                      {
                        symbol: "owner",
                      },
                    ],
                    data: {
                      address:
                        "GAJZB4Z5NXKKZAE2GEZL66NDDZSUVX26CAOWO4BP6ROZPPP4RAA44BLY",
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "read_entry",
                      },
                    ],
                    data: {
                      u64: 2,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "write_entry",
                      },
                    ],
                    data: {
                      u64: 0,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "ledger_read_byte",
                      },
                    ],
                    data: {
                      u64: 71036,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "ledger_write_byte",
                      },
                    ],
                    data: {
                      u64: 0,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "read_key_byte",
                      },
                    ],
                    data: {
                      u64: 84,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "write_key_byte",
                      },
                    ],
                    data: {
                      u64: 0,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "read_data_byte",
                      },
                    ],
                    data: {
                      u64: 816,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "write_data_byte",
                      },
                    ],
                    data: {
                      u64: 0,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "read_code_byte",
                      },
                    ],
                    data: {
                      u64: 70220,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "write_code_byte",
                      },
                    ],
                    data: {
                      u64: 0,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "emit_event",
                      },
                    ],
                    data: {
                      u64: 0,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "emit_event_byte",
                      },
                    ],
                    data: {
                      u64: 0,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "cpu_insn",
                      },
                    ],
                    data: {
                      u64: 10339431,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "mem_byte",
                      },
                    ],
                    data: {
                      u64: 3229717,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "invoke_time_nsecs",
                      },
                    ],
                    data: {
                      u64: 1699988,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "max_rw_key_byte",
                      },
                    ],
                    data: {
                      u64: 48,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "max_rw_data_byte",
                      },
                    ],
                    data: {
                      u64: 816,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "max_rw_code_byte",
                      },
                    ],
                    data: {
                      u64: 70220,
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
                        symbol: "core_metrics",
                      },
                      {
                        symbol: "max_emit_event_byte",
                      },
                    ],
                    data: {
                      u64: 0,
                    },
                  },
                },
              },
            },
          ],
        },
      },
    },
    diagnosticEventsJson: [
      {
        in_successful_contract_call: true,
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
                    "d0524e457bdf141a9216e947f1dc4cec6b0e676d5ea24c0a27c6866f56e0983a",
                },
                {
                  symbol: "owner",
                },
              ],
              data: "void",
            },
          },
        },
      },
      {
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "d0524e457bdf141a9216e947f1dc4cec6b0e676d5ea24c0a27c6866f56e0983a",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_return",
                },
                {
                  symbol: "owner",
                },
              ],
              data: {
                address:
                  "GAJZB4Z5NXKKZAE2GEZL66NDDZSUVX26CAOWO4BP6ROZPPP4RAA44BLY",
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "read_entry",
                },
              ],
              data: {
                u64: 2,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "write_entry",
                },
              ],
              data: {
                u64: 0,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "ledger_read_byte",
                },
              ],
              data: {
                u64: 71036,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "ledger_write_byte",
                },
              ],
              data: {
                u64: 0,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "read_key_byte",
                },
              ],
              data: {
                u64: 84,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "write_key_byte",
                },
              ],
              data: {
                u64: 0,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "read_data_byte",
                },
              ],
              data: {
                u64: 816,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "write_data_byte",
                },
              ],
              data: {
                u64: 0,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "read_code_byte",
                },
              ],
              data: {
                u64: 70220,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "write_code_byte",
                },
              ],
              data: {
                u64: 0,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "emit_event",
                },
              ],
              data: {
                u64: 0,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "emit_event_byte",
                },
              ],
              data: {
                u64: 0,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "cpu_insn",
                },
              ],
              data: {
                u64: 10339431,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "mem_byte",
                },
              ],
              data: {
                u64: 3229717,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "invoke_time_nsecs",
                },
              ],
              data: {
                u64: 1699988,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "max_rw_key_byte",
                },
              ],
              data: {
                u64: 48,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "max_rw_data_byte",
                },
              ],
              data: {
                u64: 816,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "max_rw_code_byte",
                },
              ],
              data: {
                u64: 70220,
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "max_emit_event_byte",
                },
              ],
              data: {
                u64: 0,
              },
            },
          },
        },
      },
    ],
    ledger: 432660,
    createdAt: "1752432671",
  },
};
