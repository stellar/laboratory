export const TX_RESPONSE_SOROBAN_FEE_BUMP = {
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

export const TX_RESPONSE_SOROBAN = {
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
