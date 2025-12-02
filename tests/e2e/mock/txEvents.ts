export const TX_EVENTS_MOCK_RESPONSE = {
  jsonrpc: "2.0",
  id: 1,
  result: {
    latestLedger: 59816335,
    latestLedgerCloseTime: "1762960737",
    oldestLedger: 59695376,
    oldestLedgerCloseTime: "1762261943",
    status: "SUCCESS",
    txHash: "b01bb450a2e34c95bad30ad4ad99b9682f3653c9449c2adeb267af899d5668d3",
    applicationOrder: 454,
    feeBump: true,
    envelopeJson: {
      tx_fee_bump: {
        tx: {
          fee_source:
            "GBGWQFSJSOMJ2BTOH5RLZUTZPV544YR2DF5CGYL7WDZ2Y6OSRHR6TUBE",
          fee: "146332",
          inner_tx: {
            tx: {
              tx: {
                source_account:
                  "GD7KQAFYY5FINAJ5R5RDF7R4WG4IAH3U4622QR52ZTLELJFSVE6DLHJJ",
                fee: 146130,
                seq_num: "249181826281757475",
                cond: {
                  time: {
                    min_time: "0",
                    max_time: "1762778199",
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
                                  "GCDHLTVARSOHOOZIXPMHP5HXUQOLMONU4B6LAOB42I5MY5MFEFF6HPEZ",
                              },
                              {
                                vec: [
                                  {
                                    u32: 98737,
                                  },
                                  {
                                    u32: 98738,
                                  },
                                  {
                                    u32: 98739,
                                  },
                                  {
                                    u32: 98742,
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
                ext: [],
              },
              signatures: [
                {
                  hint: "b2a93c35",
                  signature:
                    "9ca06f2fccb8ea9eab36e2dc71dd0463b47c1f2dfbcaaad71c3842c674c7b52c628edab94ecc5c712d1ac39831904417601260f12be65231771717148a01aa09",
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
              "3d9409ff38020389481427de42847c4ac274cee92fb4c21627481dc0133b8c0594b60739967d72050582db7f4ea977ca739e86c55784bd708037737ea9d4a505",
          },
        ],
      },
    },
    resultJson: {},
    resultMetaJson: [],
    diagnosticEventsJson: [],
    events: {
      transactionEventsJson: [
        {
          stage: "before_all_txs",
          event: {
            ext: "v0",
            contract_id:
              "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
            type_: "contract",
            body: {
              v0: {
                topics: [
                  {
                    symbol: "fee",
                  },
                  {
                    address:
                      "GDQCVAXKDVCCFKUDHBKH6M555T7NTBNV6KXVCCTB3IAYIPKXW5U3DKTC",
                  },
                ],
                data: {
                  i128: "311222",
                },
              },
            },
          },
        },
        {
          stage: "after_all_txs",
          event: {
            ext: "v0",
            contract_id:
              "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
            type_: "contract",
            body: {
              v0: {
                topics: [
                  {
                    symbol: "fee",
                  },
                  {
                    address:
                      "GDQCVAXKDVCCFKUDHBKH6M555T7NTBNV6KXVCCTB3IAYIPKXW5U3DKTC",
                  },
                ],
                data: {
                  i128: "-146922",
                },
              },
            },
          },
        },
      ],
      contractEventsJson: [
        [
          {
            ext: "v0",
            contract_id:
              "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
            type_: "contract",
            body: {
              v0: {
                topics: [
                  {
                    symbol: "transfer",
                  },
                  {
                    address:
                      "GDQCVAXKDVCCFKUDHBKH6M555T7NTBNV6KXVCCTB3IAYIPKXW5U3DKTC",
                  },
                  {
                    address:
                      "CA6PUJLBYKZKUEKLZJMKBZLEKP2OTHANDEOWSFF44FTSYLKQPIICCJBE",
                  },
                  {
                    string: "native",
                  },
                ],
                data: {
                  i128: "6653360000",
                },
              },
            },
          },
          {
            ext: "v0",
            contract_id:
              "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
            type_: "contract",
            body: {
              v0: {
                topics: [
                  {
                    symbol: "transfer",
                  },
                  {
                    address:
                      "CA6PUJLBYKZKUEKLZJMKBZLEKP2OTHANDEOWSFF44FTSYLKQPIICCJBE",
                  },
                  {
                    address:
                      "GDQCVAXKDVCCFKUDHBKH6M555T7NTBNV6KXVCCTB3IAYIPKXW5U3DKTC",
                  },
                  {
                    string:
                      "USDC:GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN",
                  },
                ],
                data: {
                  i128: "2002589336",
                },
              },
            },
          },
          {
            ext: "v0",
            contract_id:
              "CA6PUJLBYKZKUEKLZJMKBZLEKP2OTHANDEOWSFF44FTSYLKQPIICCJBE",
            type_: "contract",
            body: {
              v0: {
                topics: [
                  {
                    symbol: "trade",
                  },
                  {
                    address:
                      "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                  },
                  {
                    address:
                      "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
                  },
                  {
                    address:
                      "GDQCVAXKDVCCFKUDHBKH6M555T7NTBNV6KXVCCTB3IAYIPKXW5U3DKTC",
                  },
                ],
                data: {
                  vec: [
                    {
                      i128: "6653360000",
                    },
                    {
                      i128: "2002589336",
                    },
                    {
                      i128: "3326680",
                    },
                  ],
                },
              },
            },
          },
          {
            ext: "v0",
            contract_id:
              "CCQWSCDRVVF7UMMZ7JO6CDNE4BFL4A2WNNHQWORJ7T46EJFU32UP7H3Q",
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
                        i128: "1600000000",
                      },
                    },
                    {
                      key: {
                        symbol: "amount_1",
                      },
                      val: {
                        i128: "80000000",
                      },
                    },
                    {
                      key: {
                        symbol: "liquidity",
                      },
                      val: {
                        i128: "357770876",
                      },
                    },
                    {
                      key: {
                        symbol: "new_reserve_0",
                      },
                      val: {
                        i128: "3200000000",
                      },
                    },
                    {
                      key: {
                        symbol: "new_reserve_1",
                      },
                      val: {
                        i128: "160000000",
                      },
                    },
                    {
                      key: {
                        symbol: "to",
                      },
                      val: {
                        address:
                          "GC53JCXZHW3SVNRE4CT6XFP46WX4ACFQU32P4PR3CU43OB7AKKMFXZ6Y",
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
              "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
            type_: "contract",
            body: {
              v0: {
                topics: [
                  {
                    symbol: "swap",
                  },
                  {
                    vec: [
                      {
                        address:
                          "CAAV3AE3VKD2P4TY7LWTQMMJHIJ4WOCZ5ANCIJPC3NRSERKVXNHBU2W7",
                      },
                      {
                        address:
                          "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                      },
                    ],
                  },
                  {
                    address:
                      "CCPGFQUTSEHDIQODRE3GJDNE64A35HZ32L7LPDN7GXOCIYNBJSMS6V6B",
                  },
                ],
                data: {
                  vec: [
                    {
                      address:
                        "CAQODUH4XNX2NTFVACRMO4UR7MA5RLSZA5ZQTHILQYGYYCFQ3LUATIGM",
                    },
                    {
                      address:
                        "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                    },
                    {
                      address:
                        "CAAV3AE3VKD2P4TY7LWTQMMJHIJ4WOCZ5ANCIJPC3NRSERKVXNHBU2W7",
                    },
                    {
                      u128: "8800000000",
                    },
                    {
                      u128: "1032635025",
                    },
                  ],
                },
              },
            },
          },
        ],
      ],
    },
    ledger: 59784559,
    createdAt: "1762778176",
  },
};

export const TX_EVENTS_MOCK_RESPONSE_EMPTY = {
  jsonrpc: "2.0",
  id: 1,
  result: {
    latestLedger: 59816335,
    latestLedgerCloseTime: "1762960737",
    oldestLedger: 59695376,
    oldestLedgerCloseTime: "1762261943",
    status: "SUCCESS",
    txHash: "b01bb450a2e34c95bad30ad4ad99b9682f3653c9449c2adeb267af899d5668d3",
    applicationOrder: 454,
    feeBump: true,
    envelopeJson: {
      tx_fee_bump: {
        tx: {
          fee_source:
            "GBGWQFSJSOMJ2BTOH5RLZUTZPV544YR2DF5CGYL7WDZ2Y6OSRHR6TUBE",
          fee: "146332",
          inner_tx: {
            tx: {
              tx: {
                source_account:
                  "GD7KQAFYY5FINAJ5R5RDF7R4WG4IAH3U4622QR52ZTLELJFSVE6DLHJJ",
                fee: 146130,
                seq_num: "249181826281757475",
                cond: {
                  time: {
                    min_time: "0",
                    max_time: "1762778199",
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
                                  "GCDHLTVARSOHOOZIXPMHP5HXUQOLMONU4B6LAOB42I5MY5MFEFF6HPEZ",
                              },
                              {
                                vec: [
                                  {
                                    u32: 98737,
                                  },
                                  {
                                    u32: 98738,
                                  },
                                  {
                                    u32: 98739,
                                  },
                                  {
                                    u32: 98742,
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
                ext: [],
              },
              signatures: [
                {
                  hint: "b2a93c35",
                  signature:
                    "9ca06f2fccb8ea9eab36e2dc71dd0463b47c1f2dfbcaaad71c3842c674c7b52c628edab94ecc5c712d1ac39831904417601260f12be65231771717148a01aa09",
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
              "3d9409ff38020389481427de42847c4ac274cee92fb4c21627481dc0133b8c0594b60739967d72050582db7f4ea977ca739e86c55784bd708037737ea9d4a505",
          },
        ],
      },
    },
    resultJson: {},
    resultMetaJson: [],
    diagnosticEventsJson: [],
    events: {
      transactionEventsJson: [],
      contractEventsJson: [[]],
    },
    ledger: 59784559,
    createdAt: "1762778176",
  },
};

export const TX_EVENTS_MOCK_RESPONSE_NO_CONTRACT_EVENTS = {
  jsonrpc: "2.0",
  id: 1,
  result: {
    latestLedger: 59816335,
    latestLedgerCloseTime: "1762960737",
    oldestLedger: 59695376,
    oldestLedgerCloseTime: "1762261943",
    status: "SUCCESS",
    txHash: "b01bb450a2e34c95bad30ad4ad99b9682f3653c9449c2adeb267af899d5668d3",
    applicationOrder: 454,
    feeBump: true,
    envelopeJson: {
      tx_fee_bump: {
        tx: {
          fee_source:
            "GBGWQFSJSOMJ2BTOH5RLZUTZPV544YR2DF5CGYL7WDZ2Y6OSRHR6TUBE",
          fee: "146332",
          inner_tx: {
            tx: {
              tx: {
                source_account:
                  "GD7KQAFYY5FINAJ5R5RDF7R4WG4IAH3U4622QR52ZTLELJFSVE6DLHJJ",
                fee: 146130,
                seq_num: "249181826281757475",
                cond: {
                  time: {
                    min_time: "0",
                    max_time: "1762778199",
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
                                  "GCDHLTVARSOHOOZIXPMHP5HXUQOLMONU4B6LAOB42I5MY5MFEFF6HPEZ",
                              },
                              {
                                vec: [
                                  {
                                    u32: 98737,
                                  },
                                  {
                                    u32: 98738,
                                  },
                                  {
                                    u32: 98739,
                                  },
                                  {
                                    u32: 98742,
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
                ext: [],
              },
              signatures: [
                {
                  hint: "b2a93c35",
                  signature:
                    "9ca06f2fccb8ea9eab36e2dc71dd0463b47c1f2dfbcaaad71c3842c674c7b52c628edab94ecc5c712d1ac39831904417601260f12be65231771717148a01aa09",
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
              "3d9409ff38020389481427de42847c4ac274cee92fb4c21627481dc0133b8c0594b60739967d72050582db7f4ea977ca739e86c55784bd708037737ea9d4a505",
          },
        ],
      },
    },
    resultJson: {},
    resultMetaJson: [],
    diagnosticEventsJson: [],
    events: {
      transactionEventsJson: [],
    },
    ledger: 59784559,
    createdAt: "1762778176",
  },
};

export const TX_EVENTS_MOCK_SAC = {
  jsonrpc: "2.0",
  id: 1,
  result: {
    latestLedger: 60121837,
    latestLedgerCloseTime: "1764707334",
    oldestLedger: 60000878,
    oldestLedgerCloseTime: "1764016474",
    status: "SUCCESS",
    txHash: "a85b2c8821c39e53b4cbc500f4a040f0899349d1fb5e25446b29c478730fefbd",
    applicationOrder: 180,
    feeBump: false,
    envelopeJson: {
      tx: {
        tx: {
          source_account:
            "GAWUZ6FJELLX3JQZOQSIYKZOIQWAKZ3ILGGHKLDOCC44VMFC43UGXY2C",
          fee: 365755,
          seq_num: "249370027453579273",
          cond: {
            time: {
              min_time: "0",
              max_time: "1765222678",
            },
          },
          memo: "none",
          operations: [
            {
              source_account:
                "GAWUZ6FJELLX3JQZOQSIYKZOIQWAKZ3ILGGHKLDOCC44VMFC43UGXY2C",
              body: {
                invoke_host_function: {
                  host_function: {
                    invoke_contract: {
                      contract_address:
                        "CCPGFQUTSEHDIQODRE3GJDNE64A35HZ32L7LPDN7GXOCIYNBJSMS6V6B",
                      function_name: "swap_chained",
                      args: [
                        {
                          address:
                            "GAWUZ6FJELLX3JQZOQSIYKZOIQWAKZ3ILGGHKLDOCC44VMFC43UGXY2C",
                        },
                        {
                          vec: [
                            {
                              vec: [
                                {
                                  vec: [
                                    {
                                      address:
                                        "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                                    },
                                    {
                                      address:
                                        "CCKCKCPHYVXQD4NECBFJTFSCU2AMSJGCNG4O6K4JVRE2BLPR7WNDBQIQ",
                                    },
                                  ],
                                },
                                {
                                  bytes:
                                    "9ac7a9cde23ac2ada11105eeaa42e43c2ea8332ca0aa8f41f58d7160274d718e",
                                },
                                {
                                  address:
                                    "CCKCKCPHYVXQD4NECBFJTFSCU2AMSJGCNG4O6K4JVRE2BLPR7WNDBQIQ",
                                },
                              ],
                            },
                          ],
                        },
                        {
                          address:
                            "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                        },
                        {
                          u128: "3556419212",
                        },
                        {
                          u128: "73067668924",
                        },
                        {
                          u32: 250,
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
                              "CCPGFQUTSEHDIQODRE3GJDNE64A35HZ32L7LPDN7GXOCIYNBJSMS6V6B",
                            function_name: "swap_chained",
                            args: [
                              {
                                address:
                                  "GAWUZ6FJELLX3JQZOQSIYKZOIQWAKZ3ILGGHKLDOCC44VMFC43UGXY2C",
                              },
                              {
                                vec: [
                                  {
                                    vec: [
                                      {
                                        vec: [
                                          {
                                            address:
                                              "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                                          },
                                          {
                                            address:
                                              "CCKCKCPHYVXQD4NECBFJTFSCU2AMSJGCNG4O6K4JVRE2BLPR7WNDBQIQ",
                                          },
                                        ],
                                      },
                                      {
                                        bytes:
                                          "9ac7a9cde23ac2ada11105eeaa42e43c2ea8332ca0aa8f41f58d7160274d718e",
                                      },
                                      {
                                        address:
                                          "CCKCKCPHYVXQD4NECBFJTFSCU2AMSJGCNG4O6K4JVRE2BLPR7WNDBQIQ",
                                      },
                                    ],
                                  },
                                ],
                              },
                              {
                                address:
                                  "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                              },
                              {
                                u128: "3556419212",
                              },
                              {
                                u128: "73067668924",
                              },
                              {
                                u32: 250,
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
                                      "GAWUZ6FJELLX3JQZOQSIYKZOIQWAKZ3ILGGHKLDOCC44VMFC43UGXY2C",
                                  },
                                  {
                                    address:
                                      "CCPGFQUTSEHDIQODRE3GJDNE64A35HZ32L7LPDN7GXOCIYNBJSMS6V6B",
                                  },
                                  {
                                    i128: "3556419212",
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
                          "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                        key: "ledger_key_contract_instance",
                        durability: "persistent",
                      },
                    },
                    {
                      contract_data: {
                        contract:
                          "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
                        key: {
                          vec: [
                            {
                              symbol: "TokensSetPools",
                            },
                            {
                              bytes:
                                "c42d5cc330ecec6145996d99c6b1582af82c8481db4a5e648fb8718f279fbb89",
                            },
                          ],
                        },
                        durability: "persistent",
                      },
                    },
                    {
                      contract_data: {
                        contract:
                          "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
                        key: "ledger_key_contract_instance",
                        durability: "persistent",
                      },
                    },
                    {
                      contract_data: {
                        contract:
                          "CCABO2IQYDWRGGQ4DYQ73CV3ZFDBRZTEQNDDJMFT7JZO54CLS4RYJROY",
                        key: "ledger_key_contract_instance",
                        durability: "persistent",
                      },
                    },
                    {
                      contract_data: {
                        contract:
                          "CCKCKCPHYVXQD4NECBFJTFSCU2AMSJGCNG4O6K4JVRE2BLPR7WNDBQIQ",
                        key: "ledger_key_contract_instance",
                        durability: "persistent",
                      },
                    },
                    {
                      contract_data: {
                        contract:
                          "CCPGFQUTSEHDIQODRE3GJDNE64A35HZ32L7LPDN7GXOCIYNBJSMS6V6B",
                        key: "ledger_key_contract_instance",
                        durability: "persistent",
                      },
                    },
                    {
                      contract_code: {
                        hash: "131db85e62b0f7e3683bf4b5a6ae22b801d9acb2effd5cf3d78e9921b77b7c94",
                      },
                    },
                    {
                      contract_code: {
                        hash: "3da9edcabd7491b2245920551bf7cce020c70114e219216b948ae3dd3af2e49c",
                      },
                    },
                    {
                      contract_code: {
                        hash: "8844a760cf16788117b2a5a91d736794b3869c302aee47f8fbbcd0cc1a1096fd",
                      },
                    },
                    {
                      contract_code: {
                        hash: "baabbdd1d1816be62751880621a323168525f839442de5f4c1ce1c1a0ebf42b1",
                      },
                    },
                  ],
                  read_write: [
                    {
                      account: {
                        account_id:
                          "GAWUZ6FJELLX3JQZOQSIYKZOIQWAKZ3ILGGHKLDOCC44VMFC43UGXY2C",
                      },
                    },
                    {
                      trustline: {
                        account_id:
                          "GAWUZ6FJELLX3JQZOQSIYKZOIQWAKZ3ILGGHKLDOCC44VMFC43UGXY2C",
                        asset: {
                          credit_alphanum4: {
                            asset_code: "SHX",
                            issuer:
                              "GDSTRSHXHGJ7ZIVRBXEYE5Q74XUVCUSEKEBR7UCHEUUEK72N7I7KJ6JH",
                          },
                        },
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
                                "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
                            },
                          ],
                        },
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
                                "CCPGFQUTSEHDIQODRE3GJDNE64A35HZ32L7LPDN7GXOCIYNBJSMS6V6B",
                            },
                          ],
                        },
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
                                "CD65EROVLTDU2DWM4ZUJF4NHK4A46DX2UAOGCV7YDFPCSLFYNH57KGIY",
                            },
                          ],
                        },
                        durability: "persistent",
                      },
                    },
                    {
                      contract_data: {
                        contract:
                          "CCABO2IQYDWRGGQ4DYQ73CV3ZFDBRZTEQNDDJMFT7JZO54CLS4RYJROY",
                        key: {
                          vec: [
                            {
                              symbol: "PoolData",
                            },
                            {
                              address:
                                "CD65EROVLTDU2DWM4ZUJF4NHK4A46DX2UAOGCV7YDFPCSLFYNH57KGIY",
                            },
                          ],
                        },
                        durability: "persistent",
                      },
                    },
                    {
                      contract_data: {
                        contract:
                          "CCKCKCPHYVXQD4NECBFJTFSCU2AMSJGCNG4O6K4JVRE2BLPR7WNDBQIQ",
                        key: {
                          vec: [
                            {
                              symbol: "Balance",
                            },
                            {
                              address:
                                "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
                            },
                          ],
                        },
                        durability: "persistent",
                      },
                    },
                    {
                      contract_data: {
                        contract:
                          "CCKCKCPHYVXQD4NECBFJTFSCU2AMSJGCNG4O6K4JVRE2BLPR7WNDBQIQ",
                        key: {
                          vec: [
                            {
                              symbol: "Balance",
                            },
                            {
                              address:
                                "CCPGFQUTSEHDIQODRE3GJDNE64A35HZ32L7LPDN7GXOCIYNBJSMS6V6B",
                            },
                          ],
                        },
                        durability: "persistent",
                      },
                    },
                    {
                      contract_data: {
                        contract:
                          "CCKCKCPHYVXQD4NECBFJTFSCU2AMSJGCNG4O6K4JVRE2BLPR7WNDBQIQ",
                        key: {
                          vec: [
                            {
                              symbol: "Balance",
                            },
                            {
                              address:
                                "CD65EROVLTDU2DWM4ZUJF4NHK4A46DX2UAOGCV7YDFPCSLFYNH57KGIY",
                            },
                          ],
                        },
                        durability: "persistent",
                      },
                    },
                    {
                      contract_data: {
                        contract:
                          "CD65EROVLTDU2DWM4ZUJF4NHK4A46DX2UAOGCV7YDFPCSLFYNH57KGIY",
                        key: "ledger_key_contract_instance",
                        durability: "persistent",
                      },
                    },
                  ],
                },
                instructions: 9891730,
                disk_read_bytes: 308,
                write_bytes: 4264,
              },
              resource_fee: "265755",
            },
          },
        },
        signatures: [
          {
            hint: "a2e6e86b",
            signature:
              "1c060948bdbc88250cfe2c20dccf5ae2b55bb0826a59bc2afbf4274f2f77147b63288ee535d7835ffd719a3c257d136bef3e45804d319e5d364d42dbcf32d803",
          },
        ],
      },
    },
    resultJson: {
      fee_charged: "224829",
      result: {
        tx_success: [
          {
            op_inner: {
              invoke_host_function: {
                success:
                  "d79b35742a5c2c6057632281387f206b565a38689ccbd88b80cf4c4a3423a6b1",
              },
            },
          },
        ],
      },
      ext: "v0",
    },
    resultMetaJson: {
      v4: {
        ext: "v0",
        tx_changes_before: [
          {
            state: {
              last_modified_ledger_seq: 60106192,
              data: {
                account: {
                  account_id:
                    "GAWUZ6FJELLX3JQZOQSIYKZOIQWAKZ3ILGGHKLDOCC44VMFC43UGXY2C",
                  balance: "3591153357",
                  seq_num: "249370027453579272",
                  num_sub_entries: 1,
                  inflation_dest:
                    "GDCHDRSDOBRMSUDKRE2C4U4KDLNEATJPIHHR2ORFL5BSD56G4DQXL4VW",
                  flags: 0,
                  home_domain: "lobstr.co",
                  thresholds: "01000000",
                  signers: [],
                  ext: {
                    v1: {
                      liabilities: {
                        buying: "0",
                        selling: "0",
                      },
                      ext: {
                        v2: {
                          num_sponsored: 0,
                          num_sponsoring: 0,
                          signer_sponsoring_i_ds: [],
                          ext: {
                            v3: {
                              ext: "v0",
                              seq_ledger: 60106103,
                              seq_time: "1764617384",
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
              last_modified_ledger_seq: 60106192,
              data: {
                account: {
                  account_id:
                    "GAWUZ6FJELLX3JQZOQSIYKZOIQWAKZ3ILGGHKLDOCC44VMFC43UGXY2C",
                  balance: "3591153357",
                  seq_num: "249370027453579273",
                  num_sub_entries: 1,
                  inflation_dest:
                    "GDCHDRSDOBRMSUDKRE2C4U4KDLNEATJPIHHR2ORFL5BSD56G4DQXL4VW",
                  flags: 0,
                  home_domain: "lobstr.co",
                  thresholds: "01000000",
                  signers: [],
                  ext: {
                    v1: {
                      liabilities: {
                        buying: "0",
                        selling: "0",
                      },
                      ext: {
                        v2: {
                          num_sponsored: 0,
                          num_sponsoring: 0,
                          signer_sponsoring_i_ds: [],
                          ext: {
                            v3: {
                              ext: "v0",
                              seq_ledger: 60106192,
                              seq_time: "1764617884",
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
            ext: "v0",
            changes: [
              {
                state: {
                  last_modified_ledger_seq: 60106191,
                  data: {
                    contract_data: {
                      ext: "v0",
                      contract:
                        "CCKCKCPHYVXQD4NECBFJTFSCU2AMSJGCNG4O6K4JVRE2BLPR7WNDBQIQ",
                      key: {
                        vec: [
                          {
                            symbol: "Balance",
                          },
                          {
                            address:
                              "CCPGFQUTSEHDIQODRE3GJDNE64A35HZ32L7LPDN7GXOCIYNBJSMS6V6B",
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
                              i128: "1364050412346",
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
                  last_modified_ledger_seq: 60106192,
                  data: {
                    contract_data: {
                      ext: "v0",
                      contract:
                        "CCKCKCPHYVXQD4NECBFJTFSCU2AMSJGCNG4O6K4JVRE2BLPR7WNDBQIQ",
                      key: {
                        vec: [
                          {
                            symbol: "Balance",
                          },
                          {
                            address:
                              "CCPGFQUTSEHDIQODRE3GJDNE64A35HZ32L7LPDN7GXOCIYNBJSMS6V6B",
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
                              i128: "1364243240048",
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
                  last_modified_ledger_seq: 60106191,
                  data: {
                    contract_data: {
                      ext: "v0",
                      contract:
                        "CCKCKCPHYVXQD4NECBFJTFSCU2AMSJGCNG4O6K4JVRE2BLPR7WNDBQIQ",
                      key: {
                        vec: [
                          {
                            symbol: "Balance",
                          },
                          {
                            address:
                              "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
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
                              i128: "0",
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
                  last_modified_ledger_seq: 60106192,
                  data: {
                    contract_data: {
                      ext: "v0",
                      contract:
                        "CCKCKCPHYVXQD4NECBFJTFSCU2AMSJGCNG4O6K4JVRE2BLPR7WNDBQIQ",
                      key: {
                        vec: [
                          {
                            symbol: "Balance",
                          },
                          {
                            address:
                              "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
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
                              i128: "0",
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
                  last_modified_ledger_seq: 60106191,
                  data: {
                    contract_data: {
                      ext: "v0",
                      contract:
                        "CCABO2IQYDWRGGQ4DYQ73CV3ZFDBRZTEQNDDJMFT7JZO54CLS4RYJROY",
                      key: {
                        vec: [
                          {
                            symbol: "PoolData",
                          },
                          {
                            address:
                              "CD65EROVLTDU2DWM4ZUJF4NHK4A46DX2UAOGCV7YDFPCSLFYNH57KGIY",
                          },
                        ],
                      },
                      durability: "persistent",
                      val: {
                        map: [
                          {
                            key: {
                              symbol: "init_args",
                            },
                            val: {
                              vec: [
                                {
                                  u128: "30",
                                },
                              ],
                            },
                          },
                          {
                            key: {
                              symbol: "pool_type",
                            },
                            val: {
                              symbol: "standard",
                            },
                          },
                          {
                            key: {
                              symbol: "reserves",
                            },
                            val: {
                              vec: [
                                {
                                  u128: "12739947781591",
                                },
                                {
                                  u128: "277210587632900",
                                },
                              ],
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
                  last_modified_ledger_seq: 60106192,
                  data: {
                    contract_data: {
                      ext: "v0",
                      contract:
                        "CCABO2IQYDWRGGQ4DYQ73CV3ZFDBRZTEQNDDJMFT7JZO54CLS4RYJROY",
                      key: {
                        vec: [
                          {
                            symbol: "PoolData",
                          },
                          {
                            address:
                              "CD65EROVLTDU2DWM4ZUJF4NHK4A46DX2UAOGCV7YDFPCSLFYNH57KGIY",
                          },
                        ],
                      },
                      durability: "persistent",
                      val: {
                        map: [
                          {
                            key: {
                              symbol: "init_args",
                            },
                            val: {
                              vec: [
                                {
                                  u128: "30",
                                },
                              ],
                            },
                          },
                          {
                            key: {
                              symbol: "pool_type",
                            },
                            val: {
                              symbol: "standard",
                            },
                          },
                          {
                            key: {
                              symbol: "reserves",
                            },
                            val: {
                              vec: [
                                {
                                  u128: "12743498866174",
                                },
                                {
                                  u128: "277133456552172",
                                },
                              ],
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
                  last_modified_ledger_seq: 60106191,
                  data: {
                    contract_data: {
                      ext: "v0",
                      contract:
                        "CD65EROVLTDU2DWM4ZUJF4NHK4A46DX2UAOGCV7YDFPCSLFYNH57KGIY",
                      key: "ledger_key_contract_instance",
                      durability: "persistent",
                      val: {
                        contract_instance: {
                          executable: {
                            wasm: "baabbdd1d1816be62751880621a323168525f839442de5f4c1ce1c1a0ebf42b1",
                          },
                          storage: [
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "Admin",
                                  },
                                ],
                              },
                              val: {
                                address:
                                  "GAV5FBMKD2ZF4X2MGWDNQYUP7KFL7MRM6HZBY7HKQLB4BRHSCCX5J6VS",
                              },
                            },
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "ConfigStorage",
                                  },
                                ],
                              },
                              val: {
                                address:
                                  "CAUJNVN5DWOBCKLV5KPR3KRQBKRI7L2X7VOUAWF5FDISVSQNXCEYITPJ",
                              },
                            },
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "EmPauseAdmins",
                                  },
                                ],
                              },
                              val: {
                                vec: [
                                  {
                                    address:
                                      "GA6MVTGQDCJPP27IAMG6PSDTWOJYTD3NUTLR2W54ADBCBY7OID5YUDSI",
                                  },
                                ],
                              },
                            },
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "EmergencyAdmin",
                                  },
                                ],
                              },
                              val: {
                                address:
                                  "GCGZ6E5RBUKLNB4VZ5RC65C4QMBSBJ3COVRRJCWAMCXJC36LB7YYWEKM",
                              },
                            },
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "FeeFraction",
                                  },
                                ],
                              },
                              val: {
                                u32: 30,
                              },
                            },
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "FutureWASM",
                                  },
                                ],
                              },
                              val: {
                                bytes:
                                  "baabbdd1d1816be62751880621a323168525f839442de5f4c1ce1c1a0ebf42b1",
                              },
                            },
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "OperationsAdmin",
                                  },
                                ],
                              },
                              val: {
                                address:
                                  "GBVQPX2LQ55HLRMLIWBEYVVQL3SZ5RFPRKYLRSLZU4XRIWAXW2KQIMMD",
                              },
                            },
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "Operator",
                                  },
                                ],
                              },
                              val: {
                                address:
                                  "GCXYKA3BM574WC6TWESEDUGUJTNQ5SVCFMHWLQ634H5FTE7FYPV3JH3X",
                              },
                            },
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "PauseAdmin",
                                  },
                                ],
                              },
                              val: {
                                address:
                                  "GA6MA665XVKHTQUZVSMUKUPGT7OREJNCLAZ5ZEH5CXPKYTWFJKZ3YSEK",
                              },
                            },
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "Plane",
                                  },
                                ],
                              },
                              val: {
                                address:
                                  "CCABO2IQYDWRGGQ4DYQ73CV3ZFDBRZTEQNDDJMFT7JZO54CLS4RYJROY",
                              },
                            },
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "PoolRewardConfig",
                                  },
                                ],
                              },
                              val: {
                                map: [
                                  {
                                    key: {
                                      symbol: "expired_at",
                                    },
                                    val: {
                                      u64: "1764648611",
                                    },
                                  },
                                  {
                                    key: {
                                      symbol: "tps",
                                    },
                                    val: {
                                      u128: "27049652",
                                    },
                                  },
                                ],
                              },
                            },
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "PoolRewardData",
                                  },
                                ],
                              },
                              val: {
                                map: [
                                  {
                                    key: {
                                      symbol: "accumulated",
                                    },
                                    val: {
                                      u128: "257796933510618",
                                    },
                                  },
                                  {
                                    key: {
                                      symbol: "block",
                                    },
                                    val: {
                                      u64: "9454",
                                    },
                                  },
                                  {
                                    key: {
                                      symbol: "claimed",
                                    },
                                    val: {
                                      u128: "247808923077988",
                                    },
                                  },
                                  {
                                    key: {
                                      symbol: "last_time",
                                    },
                                    val: {
                                      u64: "1764617220",
                                    },
                                  },
                                ],
                              },
                            },
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "ProtocolFeeA",
                                  },
                                ],
                              },
                              val: {
                                u128: "31718748104",
                              },
                            },
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "ProtocolFeeB",
                                  },
                                ],
                              },
                              val: {
                                u128: "606621734142",
                              },
                            },
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "ProtocolFeeFraction",
                                  },
                                ],
                              },
                              val: {
                                u32: 5000,
                              },
                            },
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "ReserveA",
                                  },
                                ],
                              },
                              val: {
                                u128: "12739947781591",
                              },
                            },
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "ReserveB",
                                  },
                                ],
                              },
                              val: {
                                u128: "277210587632900",
                              },
                            },
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "RewardBoostFeed",
                                  },
                                ],
                              },
                              val: {
                                address:
                                  "CBKCROE56TU2FTT3C5CVN676PYVLTOQUQDHHH57GLWDY5VOKSCZPGOFN",
                              },
                            },
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "RewardBoostToken",
                                  },
                                ],
                              },
                              val: {
                                address:
                                  "CARCKZ66U4AI2545NS4RAF47QVEXG3PRRCDA52H4Q3FDRAGSMP4BRU3W",
                              },
                            },
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "RewardGaugesMap",
                                  },
                                ],
                              },
                              val: {
                                map: [
                                  {
                                    key: {
                                      address:
                                        "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
                                    },
                                    val: {
                                      address:
                                        "CB3WBABEGU3OJ2GLH4FICBYREBXVZKR5NGISUZUDM4SIQZ7O5CGOCX7I",
                                    },
                                  },
                                ],
                              },
                            },
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "RewardToken",
                                  },
                                ],
                              },
                              val: {
                                address:
                                  "CAUIKL3IYGMERDRUN6YSCLWVAKIFG5Q4YJHUKM4S4NJZQIA3BAS6OJPK",
                              },
                            },
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "Router",
                                  },
                                ],
                              },
                              val: {
                                address:
                                  "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
                              },
                            },
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "SystemFeeAdmin",
                                  },
                                ],
                              },
                              val: {
                                address:
                                  "GB57YDVGLL2BAVOXHPXYCZR77J4MLPLMGJKFMTUKMHFI2AEGS4SGGW7N",
                              },
                            },
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "TokenA",
                                  },
                                ],
                              },
                              val: {
                                address:
                                  "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                              },
                            },
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "TokenB",
                                  },
                                ],
                              },
                              val: {
                                address:
                                  "CCKCKCPHYVXQD4NECBFJTFSCU2AMSJGCNG4O6K4JVRE2BLPR7WNDBQIQ",
                              },
                            },
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "TokenFutureWASM",
                                  },
                                ],
                              },
                              val: {
                                bytes:
                                  "43a1cd087115c76dc880b0e07e171298b4f55dfc333c03df1b06266cf229199c",
                              },
                            },
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "TokenShare",
                                  },
                                ],
                              },
                              val: {
                                address:
                                  "CDB6M5RVCMJ5LDUGBEA76GFNGJDQTPZPXDFT4B7NXIUDTADYDVS4RUCA",
                              },
                            },
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "TotalShares",
                                  },
                                ],
                              },
                              val: {
                                u128: "47194481455464",
                              },
                            },
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "UpgradeDeadline",
                                  },
                                ],
                              },
                              val: {
                                u64: "0",
                              },
                            },
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "WorkingSupply",
                                  },
                                ],
                              },
                              val: {
                                u128: "55725005080085",
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
                  last_modified_ledger_seq: 60106192,
                  data: {
                    contract_data: {
                      ext: "v0",
                      contract:
                        "CD65EROVLTDU2DWM4ZUJF4NHK4A46DX2UAOGCV7YDFPCSLFYNH57KGIY",
                      key: "ledger_key_contract_instance",
                      durability: "persistent",
                      val: {
                        contract_instance: {
                          executable: {
                            wasm: "baabbdd1d1816be62751880621a323168525f839442de5f4c1ce1c1a0ebf42b1",
                          },
                          storage: [
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "Admin",
                                  },
                                ],
                              },
                              val: {
                                address:
                                  "GAV5FBMKD2ZF4X2MGWDNQYUP7KFL7MRM6HZBY7HKQLB4BRHSCCX5J6VS",
                              },
                            },
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "ConfigStorage",
                                  },
                                ],
                              },
                              val: {
                                address:
                                  "CAUJNVN5DWOBCKLV5KPR3KRQBKRI7L2X7VOUAWF5FDISVSQNXCEYITPJ",
                              },
                            },
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "EmPauseAdmins",
                                  },
                                ],
                              },
                              val: {
                                vec: [
                                  {
                                    address:
                                      "GA6MVTGQDCJPP27IAMG6PSDTWOJYTD3NUTLR2W54ADBCBY7OID5YUDSI",
                                  },
                                ],
                              },
                            },
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "EmergencyAdmin",
                                  },
                                ],
                              },
                              val: {
                                address:
                                  "GCGZ6E5RBUKLNB4VZ5RC65C4QMBSBJ3COVRRJCWAMCXJC36LB7YYWEKM",
                              },
                            },
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "FeeFraction",
                                  },
                                ],
                              },
                              val: {
                                u32: 30,
                              },
                            },
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "FutureWASM",
                                  },
                                ],
                              },
                              val: {
                                bytes:
                                  "baabbdd1d1816be62751880621a323168525f839442de5f4c1ce1c1a0ebf42b1",
                              },
                            },
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "OperationsAdmin",
                                  },
                                ],
                              },
                              val: {
                                address:
                                  "GBVQPX2LQ55HLRMLIWBEYVVQL3SZ5RFPRKYLRSLZU4XRIWAXW2KQIMMD",
                              },
                            },
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "Operator",
                                  },
                                ],
                              },
                              val: {
                                address:
                                  "GCXYKA3BM574WC6TWESEDUGUJTNQ5SVCFMHWLQ634H5FTE7FYPV3JH3X",
                              },
                            },
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "PauseAdmin",
                                  },
                                ],
                              },
                              val: {
                                address:
                                  "GA6MA665XVKHTQUZVSMUKUPGT7OREJNCLAZ5ZEH5CXPKYTWFJKZ3YSEK",
                              },
                            },
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "Plane",
                                  },
                                ],
                              },
                              val: {
                                address:
                                  "CCABO2IQYDWRGGQ4DYQ73CV3ZFDBRZTEQNDDJMFT7JZO54CLS4RYJROY",
                              },
                            },
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "PoolRewardConfig",
                                  },
                                ],
                              },
                              val: {
                                map: [
                                  {
                                    key: {
                                      symbol: "expired_at",
                                    },
                                    val: {
                                      u64: "1764648611",
                                    },
                                  },
                                  {
                                    key: {
                                      symbol: "tps",
                                    },
                                    val: {
                                      u128: "27049652",
                                    },
                                  },
                                ],
                              },
                            },
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "PoolRewardData",
                                  },
                                ],
                              },
                              val: {
                                map: [
                                  {
                                    key: {
                                      symbol: "accumulated",
                                    },
                                    val: {
                                      u128: "257796933510618",
                                    },
                                  },
                                  {
                                    key: {
                                      symbol: "block",
                                    },
                                    val: {
                                      u64: "9454",
                                    },
                                  },
                                  {
                                    key: {
                                      symbol: "claimed",
                                    },
                                    val: {
                                      u128: "247808923077988",
                                    },
                                  },
                                  {
                                    key: {
                                      symbol: "last_time",
                                    },
                                    val: {
                                      u64: "1764617220",
                                    },
                                  },
                                ],
                              },
                            },
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "ProtocolFeeA",
                                  },
                                ],
                              },
                              val: {
                                u128: "31724082733",
                              },
                            },
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "ProtocolFeeB",
                                  },
                                ],
                              },
                              val: {
                                u128: "606621734142",
                              },
                            },
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "ProtocolFeeFraction",
                                  },
                                ],
                              },
                              val: {
                                u32: 5000,
                              },
                            },
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "ReserveA",
                                  },
                                ],
                              },
                              val: {
                                u128: "12743498866174",
                              },
                            },
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "ReserveB",
                                  },
                                ],
                              },
                              val: {
                                u128: "277133456552172",
                              },
                            },
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "RewardBoostFeed",
                                  },
                                ],
                              },
                              val: {
                                address:
                                  "CBKCROE56TU2FTT3C5CVN676PYVLTOQUQDHHH57GLWDY5VOKSCZPGOFN",
                              },
                            },
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "RewardBoostToken",
                                  },
                                ],
                              },
                              val: {
                                address:
                                  "CARCKZ66U4AI2545NS4RAF47QVEXG3PRRCDA52H4Q3FDRAGSMP4BRU3W",
                              },
                            },
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "RewardGaugesMap",
                                  },
                                ],
                              },
                              val: {
                                map: [
                                  {
                                    key: {
                                      address:
                                        "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
                                    },
                                    val: {
                                      address:
                                        "CB3WBABEGU3OJ2GLH4FICBYREBXVZKR5NGISUZUDM4SIQZ7O5CGOCX7I",
                                    },
                                  },
                                ],
                              },
                            },
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "RewardToken",
                                  },
                                ],
                              },
                              val: {
                                address:
                                  "CAUIKL3IYGMERDRUN6YSCLWVAKIFG5Q4YJHUKM4S4NJZQIA3BAS6OJPK",
                              },
                            },
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "Router",
                                  },
                                ],
                              },
                              val: {
                                address:
                                  "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
                              },
                            },
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "SystemFeeAdmin",
                                  },
                                ],
                              },
                              val: {
                                address:
                                  "GB57YDVGLL2BAVOXHPXYCZR77J4MLPLMGJKFMTUKMHFI2AEGS4SGGW7N",
                              },
                            },
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "TokenA",
                                  },
                                ],
                              },
                              val: {
                                address:
                                  "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                              },
                            },
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "TokenB",
                                  },
                                ],
                              },
                              val: {
                                address:
                                  "CCKCKCPHYVXQD4NECBFJTFSCU2AMSJGCNG4O6K4JVRE2BLPR7WNDBQIQ",
                              },
                            },
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "TokenFutureWASM",
                                  },
                                ],
                              },
                              val: {
                                bytes:
                                  "43a1cd087115c76dc880b0e07e171298b4f55dfc333c03df1b06266cf229199c",
                              },
                            },
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "TokenShare",
                                  },
                                ],
                              },
                              val: {
                                address:
                                  "CDB6M5RVCMJ5LDUGBEA76GFNGJDQTPZPXDFT4B7NXIUDTADYDVS4RUCA",
                              },
                            },
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "TotalShares",
                                  },
                                ],
                              },
                              val: {
                                u128: "47194481455464",
                              },
                            },
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "UpgradeDeadline",
                                  },
                                ],
                              },
                              val: {
                                u64: "0",
                              },
                            },
                            {
                              key: {
                                vec: [
                                  {
                                    symbol: "WorkingSupply",
                                  },
                                ],
                              },
                              val: {
                                u128: "55725005080085",
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
                  last_modified_ledger_seq: 60106191,
                  data: {
                    contract_data: {
                      ext: "v0",
                      contract:
                        "CCKCKCPHYVXQD4NECBFJTFSCU2AMSJGCNG4O6K4JVRE2BLPR7WNDBQIQ",
                      key: {
                        vec: [
                          {
                            symbol: "Balance",
                          },
                          {
                            address:
                              "CD65EROVLTDU2DWM4ZUJF4NHK4A46DX2UAOGCV7YDFPCSLFYNH57KGIY",
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
                              i128: "277817209367042",
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
                  last_modified_ledger_seq: 60106192,
                  data: {
                    contract_data: {
                      ext: "v0",
                      contract:
                        "CCKCKCPHYVXQD4NECBFJTFSCU2AMSJGCNG4O6K4JVRE2BLPR7WNDBQIQ",
                      key: {
                        vec: [
                          {
                            symbol: "Balance",
                          },
                          {
                            address:
                              "CD65EROVLTDU2DWM4ZUJF4NHK4A46DX2UAOGCV7YDFPCSLFYNH57KGIY",
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
                              i128: "277740078286314",
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
                  last_modified_ledger_seq: 60106191,
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
                              "CD65EROVLTDU2DWM4ZUJF4NHK4A46DX2UAOGCV7YDFPCSLFYNH57KGIY",
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
                              i128: "12771666529695",
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
                  last_modified_ledger_seq: 60106192,
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
                              "CD65EROVLTDU2DWM4ZUJF4NHK4A46DX2UAOGCV7YDFPCSLFYNH57KGIY",
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
                              i128: "12775222948907",
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
                  last_modified_ledger_seq: 60106179,
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
                              "CCPGFQUTSEHDIQODRE3GJDNE64A35HZ32L7LPDN7GXOCIYNBJSMS6V6B",
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
                              i128: "77388755437",
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
                  last_modified_ledger_seq: 60106192,
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
                              "CCPGFQUTSEHDIQODRE3GJDNE64A35HZ32L7LPDN7GXOCIYNBJSMS6V6B",
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
                              i128: "77388755437",
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
                  last_modified_ledger_seq: 60106103,
                  data: {
                    trustline: {
                      account_id:
                        "GAWUZ6FJELLX3JQZOQSIYKZOIQWAKZ3ILGGHKLDOCC44VMFC43UGXY2C",
                      asset: {
                        credit_alphanum4: {
                          asset_code: "SHX",
                          issuer:
                            "GDSTRSHXHGJ7ZIVRBXEYE5Q74XUVCUSEKEBR7UCHEUUEK72N7I7KJ6JH",
                        },
                      },
                      balance: "1761168379541",
                      limit: "9223372036854775807",
                      flags: 1,
                      ext: "v0",
                    },
                  },
                  ext: "v0",
                },
              },
              {
                updated: {
                  last_modified_ledger_seq: 60106192,
                  data: {
                    trustline: {
                      account_id:
                        "GAWUZ6FJELLX3JQZOQSIYKZOIQWAKZ3ILGGHKLDOCC44VMFC43UGXY2C",
                      asset: {
                        credit_alphanum4: {
                          asset_code: "SHX",
                          issuer:
                            "GDSTRSHXHGJ7ZIVRBXEYE5Q74XUVCUSEKEBR7UCHEUUEK72N7I7KJ6JH",
                        },
                      },
                      balance: "1838106632567",
                      limit: "9223372036854775807",
                      flags: 1,
                      ext: "v0",
                    },
                  },
                  ext: "v0",
                },
              },
              {
                state: {
                  last_modified_ledger_seq: 60106191,
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
                              "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
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
                              i128: "10002",
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
                  last_modified_ledger_seq: 60106192,
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
                              "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
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
                              i128: "10002",
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
                  last_modified_ledger_seq: 60106192,
                  data: {
                    account: {
                      account_id:
                        "GAWUZ6FJELLX3JQZOQSIYKZOIQWAKZ3ILGGHKLDOCC44VMFC43UGXY2C",
                      balance: "3591153357",
                      seq_num: "249370027453579273",
                      num_sub_entries: 1,
                      inflation_dest:
                        "GDCHDRSDOBRMSUDKRE2C4U4KDLNEATJPIHHR2ORFL5BSD56G4DQXL4VW",
                      flags: 0,
                      home_domain: "lobstr.co",
                      thresholds: "01000000",
                      signers: [],
                      ext: {
                        v1: {
                          liabilities: {
                            buying: "0",
                            selling: "0",
                          },
                          ext: {
                            v2: {
                              num_sponsored: 0,
                              num_sponsoring: 0,
                              signer_sponsoring_i_ds: [],
                              ext: {
                                v3: {
                                  ext: "v0",
                                  seq_ledger: 60106192,
                                  seq_time: "1764617884",
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
                  last_modified_ledger_seq: 60106192,
                  data: {
                    account: {
                      account_id:
                        "GAWUZ6FJELLX3JQZOQSIYKZOIQWAKZ3ILGGHKLDOCC44VMFC43UGXY2C",
                      balance: "34734145",
                      seq_num: "249370027453579273",
                      num_sub_entries: 1,
                      inflation_dest:
                        "GDCHDRSDOBRMSUDKRE2C4U4KDLNEATJPIHHR2ORFL5BSD56G4DQXL4VW",
                      flags: 0,
                      home_domain: "lobstr.co",
                      thresholds: "01000000",
                      signers: [],
                      ext: {
                        v1: {
                          liabilities: {
                            buying: "0",
                            selling: "0",
                          },
                          ext: {
                            v2: {
                              num_sponsored: 0,
                              num_sponsoring: 0,
                              signer_sponsoring_i_ds: [],
                              ext: {
                                v3: {
                                  ext: "v0",
                                  seq_ledger: 60106192,
                                  seq_time: "1764617884",
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
            events: [
              {
                ext: "v0",
                contract_id:
                  "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                type_: "contract",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "transfer",
                      },
                      {
                        address:
                          "GAWUZ6FJELLX3JQZOQSIYKZOIQWAKZ3ILGGHKLDOCC44VMFC43UGXY2C",
                      },
                      {
                        address:
                          "CCPGFQUTSEHDIQODRE3GJDNE64A35HZ32L7LPDN7GXOCIYNBJSMS6V6B",
                      },
                      {
                        string: "native",
                      },
                    ],
                    data: {
                      i128: "3556419212",
                    },
                  },
                },
              },
              {
                ext: "v0",
                contract_id:
                  "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                type_: "contract",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "transfer",
                      },
                      {
                        address:
                          "CCPGFQUTSEHDIQODRE3GJDNE64A35HZ32L7LPDN7GXOCIYNBJSMS6V6B",
                      },
                      {
                        address:
                          "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
                      },
                      {
                        string: "native",
                      },
                    ],
                    data: {
                      i128: "3556419212",
                    },
                  },
                },
              },
              {
                ext: "v0",
                contract_id:
                  "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                type_: "contract",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "transfer",
                      },
                      {
                        address:
                          "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
                      },
                      {
                        address:
                          "CD65EROVLTDU2DWM4ZUJF4NHK4A46DX2UAOGCV7YDFPCSLFYNH57KGIY",
                      },
                      {
                        string: "native",
                      },
                    ],
                    data: {
                      i128: "3556419212",
                    },
                  },
                },
              },
              {
                ext: "v0",
                contract_id:
                  "CCKCKCPHYVXQD4NECBFJTFSCU2AMSJGCNG4O6K4JVRE2BLPR7WNDBQIQ",
                type_: "contract",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "transfer",
                      },
                      {
                        address:
                          "CD65EROVLTDU2DWM4ZUJF4NHK4A46DX2UAOGCV7YDFPCSLFYNH57KGIY",
                      },
                      {
                        address:
                          "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
                      },
                      {
                        string:
                          "SHX:GDSTRSHXHGJ7ZIVRBXEYE5Q74XUVCUSEKEBR7UCHEUUEK72N7I7KJ6JH",
                      },
                    ],
                    data: {
                      i128: "77131080728",
                    },
                  },
                },
              },
              {
                ext: "v0",
                contract_id:
                  "CD65EROVLTDU2DWM4ZUJF4NHK4A46DX2UAOGCV7YDFPCSLFYNH57KGIY",
                type_: "contract",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "trade",
                      },
                      {
                        address:
                          "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                      },
                      {
                        address:
                          "CCKCKCPHYVXQD4NECBFJTFSCU2AMSJGCNG4O6K4JVRE2BLPR7WNDBQIQ",
                      },
                      {
                        address:
                          "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
                      },
                    ],
                    data: {
                      vec: [
                        {
                          i128: "3556419212",
                        },
                        {
                          i128: "77131080728",
                        },
                        {
                          i128: "5334629",
                        },
                      ],
                    },
                  },
                },
              },
              {
                ext: "v0",
                contract_id:
                  "CD65EROVLTDU2DWM4ZUJF4NHK4A46DX2UAOGCV7YDFPCSLFYNH57KGIY",
                type_: "contract",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "update_reserves",
                      },
                    ],
                    data: {
                      vec: [
                        {
                          i128: "12743498866174",
                        },
                        {
                          i128: "277133456552172",
                        },
                      ],
                    },
                  },
                },
              },
              {
                ext: "v0",
                contract_id:
                  "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
                type_: "contract",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "swap",
                      },
                      {
                        vec: [
                          {
                            address:
                              "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                          },
                          {
                            address:
                              "CCKCKCPHYVXQD4NECBFJTFSCU2AMSJGCNG4O6K4JVRE2BLPR7WNDBQIQ",
                          },
                        ],
                      },
                      {
                        address:
                          "CCPGFQUTSEHDIQODRE3GJDNE64A35HZ32L7LPDN7GXOCIYNBJSMS6V6B",
                      },
                    ],
                    data: {
                      vec: [
                        {
                          address:
                            "CD65EROVLTDU2DWM4ZUJF4NHK4A46DX2UAOGCV7YDFPCSLFYNH57KGIY",
                        },
                        {
                          address:
                            "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                        },
                        {
                          address:
                            "CCKCKCPHYVXQD4NECBFJTFSCU2AMSJGCNG4O6K4JVRE2BLPR7WNDBQIQ",
                        },
                        {
                          u128: "3556419212",
                        },
                        {
                          u128: "77131080728",
                        },
                      ],
                    },
                  },
                },
              },
              {
                ext: "v0",
                contract_id:
                  "CCKCKCPHYVXQD4NECBFJTFSCU2AMSJGCNG4O6K4JVRE2BLPR7WNDBQIQ",
                type_: "contract",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "transfer",
                      },
                      {
                        address:
                          "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
                      },
                      {
                        address:
                          "CCPGFQUTSEHDIQODRE3GJDNE64A35HZ32L7LPDN7GXOCIYNBJSMS6V6B",
                      },
                      {
                        string:
                          "SHX:GDSTRSHXHGJ7ZIVRBXEYE5Q74XUVCUSEKEBR7UCHEUUEK72N7I7KJ6JH",
                      },
                    ],
                    data: {
                      i128: "77131080728",
                    },
                  },
                },
              },
              {
                ext: "v0",
                contract_id:
                  "CCKCKCPHYVXQD4NECBFJTFSCU2AMSJGCNG4O6K4JVRE2BLPR7WNDBQIQ",
                type_: "contract",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "transfer",
                      },
                      {
                        address:
                          "CCPGFQUTSEHDIQODRE3GJDNE64A35HZ32L7LPDN7GXOCIYNBJSMS6V6B",
                      },
                      {
                        address:
                          "GAWUZ6FJELLX3JQZOQSIYKZOIQWAKZ3ILGGHKLDOCC44VMFC43UGXY2C",
                      },
                      {
                        string:
                          "SHX:GDSTRSHXHGJ7ZIVRBXEYE5Q74XUVCUSEKEBR7UCHEUUEK72N7I7KJ6JH",
                      },
                    ],
                    data: {
                      i128: "76938253026",
                    },
                  },
                },
              },
              {
                ext: "v0",
                contract_id:
                  "CCPGFQUTSEHDIQODRE3GJDNE64A35HZ32L7LPDN7GXOCIYNBJSMS6V6B",
                type_: "contract",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "charge_provider_fee",
                      },
                    ],
                    data: {
                      vec: [
                        {
                          address:
                            "CCKCKCPHYVXQD4NECBFJTFSCU2AMSJGCNG4O6K4JVRE2BLPR7WNDBQIQ",
                        },
                        {
                          u128: "192827702",
                        },
                      ],
                    },
                  },
                },
              },
            ],
          },
        ],
        tx_changes_after: [],
        soroban_meta: {
          ext: {
            v1: {
              ext: "v0",
              total_non_refundable_resource_fee_charged: "203283",
              total_refundable_resource_fee_charged: "21446",
              rent_fee_charged: "0",
            },
          },
          return_value: {
            u128: "76938253026",
          },
        },
        events: [
          {
            stage: "before_all_txs",
            event: {
              ext: "v0",
              contract_id:
                "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
              type_: "contract",
              body: {
                v0: {
                  topics: [
                    {
                      symbol: "fee",
                    },
                    {
                      address:
                        "GAWUZ6FJELLX3JQZOQSIYKZOIQWAKZ3ILGGHKLDOCC44VMFC43UGXY2C",
                    },
                  ],
                  data: {
                    i128: "265855",
                  },
                },
              },
            },
          },
          {
            stage: "after_all_txs",
            event: {
              ext: "v0",
              contract_id:
                "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
              type_: "contract",
              body: {
                v0: {
                  topics: [
                    {
                      symbol: "fee",
                    },
                    {
                      address:
                        "GAWUZ6FJELLX3JQZOQSIYKZOIQWAKZ3ILGGHKLDOCC44VMFC43UGXY2C",
                    },
                  ],
                  data: {
                    i128: "-41026",
                  },
                },
              },
            },
          },
        ],
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
                        "9e62c293910e3441c38936648da4f701be9f3bd2feb78dbf35dc2461a14c992f",
                    },
                    {
                      symbol: "swap_chained",
                    },
                  ],
                  data: {
                    vec: [
                      {
                        address:
                          "GAWUZ6FJELLX3JQZOQSIYKZOIQWAKZ3ILGGHKLDOCC44VMFC43UGXY2C",
                      },
                      {
                        vec: [
                          {
                            vec: [
                              {
                                vec: [
                                  {
                                    address:
                                      "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                                  },
                                  {
                                    address:
                                      "CCKCKCPHYVXQD4NECBFJTFSCU2AMSJGCNG4O6K4JVRE2BLPR7WNDBQIQ",
                                  },
                                ],
                              },
                              {
                                bytes:
                                  "9ac7a9cde23ac2ada11105eeaa42e43c2ea8332ca0aa8f41f58d7160274d718e",
                              },
                              {
                                address:
                                  "CCKCKCPHYVXQD4NECBFJTFSCU2AMSJGCNG4O6K4JVRE2BLPR7WNDBQIQ",
                              },
                            ],
                          },
                        ],
                      },
                      {
                        address:
                          "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                      },
                      {
                        u128: "3556419212",
                      },
                      {
                        u128: "73067668924",
                      },
                      {
                        u32: 250,
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
                "CCPGFQUTSEHDIQODRE3GJDNE64A35HZ32L7LPDN7GXOCIYNBJSMS6V6B",
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
                          "GAWUZ6FJELLX3JQZOQSIYKZOIQWAKZ3ILGGHKLDOCC44VMFC43UGXY2C",
                      },
                      {
                        address:
                          "CCPGFQUTSEHDIQODRE3GJDNE64A35HZ32L7LPDN7GXOCIYNBJSMS6V6B",
                      },
                      {
                        i128: "3556419212",
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
                "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
              type_: "contract",
              body: {
                v0: {
                  topics: [
                    {
                      symbol: "transfer",
                    },
                    {
                      address:
                        "GAWUZ6FJELLX3JQZOQSIYKZOIQWAKZ3ILGGHKLDOCC44VMFC43UGXY2C",
                    },
                    {
                      address:
                        "CCPGFQUTSEHDIQODRE3GJDNE64A35HZ32L7LPDN7GXOCIYNBJSMS6V6B",
                    },
                    {
                      string: "native",
                    },
                  ],
                  data: {
                    i128: "3556419212",
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
                "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
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
                "CCPGFQUTSEHDIQODRE3GJDNE64A35HZ32L7LPDN7GXOCIYNBJSMS6V6B",
              type_: "diagnostic",
              body: {
                v0: {
                  topics: [
                    {
                      symbol: "fn_call",
                    },
                    {
                      bytes:
                        "6033b4250e704e314fb064973d185db922cae0bd272ba5bff19aac570f12ac2f",
                    },
                    {
                      symbol: "swap_chained",
                    },
                  ],
                  data: {
                    vec: [
                      {
                        address:
                          "CCPGFQUTSEHDIQODRE3GJDNE64A35HZ32L7LPDN7GXOCIYNBJSMS6V6B",
                      },
                      {
                        vec: [
                          {
                            vec: [
                              {
                                vec: [
                                  {
                                    address:
                                      "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                                  },
                                  {
                                    address:
                                      "CCKCKCPHYVXQD4NECBFJTFSCU2AMSJGCNG4O6K4JVRE2BLPR7WNDBQIQ",
                                  },
                                ],
                              },
                              {
                                bytes:
                                  "9ac7a9cde23ac2ada11105eeaa42e43c2ea8332ca0aa8f41f58d7160274d718e",
                              },
                              {
                                address:
                                  "CCKCKCPHYVXQD4NECBFJTFSCU2AMSJGCNG4O6K4JVRE2BLPR7WNDBQIQ",
                              },
                            ],
                          },
                        ],
                      },
                      {
                        address:
                          "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                      },
                      {
                        u128: "3556419212",
                      },
                      {
                        u128: "73067668924",
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
                "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
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
                          "CCPGFQUTSEHDIQODRE3GJDNE64A35HZ32L7LPDN7GXOCIYNBJSMS6V6B",
                      },
                      {
                        address:
                          "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
                      },
                      {
                        i128: "3556419212",
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
                "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
              type_: "contract",
              body: {
                v0: {
                  topics: [
                    {
                      symbol: "transfer",
                    },
                    {
                      address:
                        "CCPGFQUTSEHDIQODRE3GJDNE64A35HZ32L7LPDN7GXOCIYNBJSMS6V6B",
                    },
                    {
                      address:
                        "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
                    },
                    {
                      string: "native",
                    },
                  ],
                  data: {
                    i128: "3556419212",
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
                "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
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
                "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
              type_: "diagnostic",
              body: {
                v0: {
                  topics: [
                    {
                      symbol: "fn_call",
                    },
                    {
                      bytes:
                        "fdd245d55cc74d0ecce66892f1a75701cf0efaa01c6157f8195e292cb869fbf5",
                    },
                    {
                      symbol: "swap",
                    },
                  ],
                  data: {
                    vec: [
                      {
                        address:
                          "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
                      },
                      {
                        u32: 0,
                      },
                      {
                        u32: 1,
                      },
                      {
                        u128: "3556419212",
                      },
                      {
                        u128: "73067668924",
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
                "CD65EROVLTDU2DWM4ZUJF4NHK4A46DX2UAOGCV7YDFPCSLFYNH57KGIY",
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
                          "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
                      },
                      {
                        address:
                          "CD65EROVLTDU2DWM4ZUJF4NHK4A46DX2UAOGCV7YDFPCSLFYNH57KGIY",
                      },
                      {
                        i128: "3556419212",
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
                "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
              type_: "contract",
              body: {
                v0: {
                  topics: [
                    {
                      symbol: "transfer",
                    },
                    {
                      address:
                        "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
                    },
                    {
                      address:
                        "CD65EROVLTDU2DWM4ZUJF4NHK4A46DX2UAOGCV7YDFPCSLFYNH57KGIY",
                    },
                    {
                      string: "native",
                    },
                  ],
                  data: {
                    i128: "3556419212",
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
                "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
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
                "CD65EROVLTDU2DWM4ZUJF4NHK4A46DX2UAOGCV7YDFPCSLFYNH57KGIY",
              type_: "diagnostic",
              body: {
                v0: {
                  topics: [
                    {
                      symbol: "fn_call",
                    },
                    {
                      bytes:
                        "942509e7c56f01f1a4104a999642a680c924c269b8ef2b89ac49a0adf1fd9a30",
                    },
                    {
                      symbol: "transfer",
                    },
                  ],
                  data: {
                    vec: [
                      {
                        address:
                          "CD65EROVLTDU2DWM4ZUJF4NHK4A46DX2UAOGCV7YDFPCSLFYNH57KGIY",
                      },
                      {
                        address:
                          "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
                      },
                      {
                        i128: "77131080728",
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
                "CCKCKCPHYVXQD4NECBFJTFSCU2AMSJGCNG4O6K4JVRE2BLPR7WNDBQIQ",
              type_: "contract",
              body: {
                v0: {
                  topics: [
                    {
                      symbol: "transfer",
                    },
                    {
                      address:
                        "CD65EROVLTDU2DWM4ZUJF4NHK4A46DX2UAOGCV7YDFPCSLFYNH57KGIY",
                    },
                    {
                      address:
                        "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
                    },
                    {
                      string:
                        "SHX:GDSTRSHXHGJ7ZIVRBXEYE5Q74XUVCUSEKEBR7UCHEUUEK72N7I7KJ6JH",
                    },
                  ],
                  data: {
                    i128: "77131080728",
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
                "CCKCKCPHYVXQD4NECBFJTFSCU2AMSJGCNG4O6K4JVRE2BLPR7WNDBQIQ",
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
                "CD65EROVLTDU2DWM4ZUJF4NHK4A46DX2UAOGCV7YDFPCSLFYNH57KGIY",
              type_: "diagnostic",
              body: {
                v0: {
                  topics: [
                    {
                      symbol: "fn_call",
                    },
                    {
                      bytes:
                        "80176910c0ed131a1c1e21fd8abbc94618e664834634b0b3fa72eef04b972384",
                    },
                    {
                      symbol: "update",
                    },
                  ],
                  data: {
                    vec: [
                      {
                        address:
                          "CD65EROVLTDU2DWM4ZUJF4NHK4A46DX2UAOGCV7YDFPCSLFYNH57KGIY",
                      },
                      {
                        symbol: "standard",
                      },
                      {
                        vec: [
                          {
                            u128: "30",
                          },
                        ],
                      },
                      {
                        vec: [
                          {
                            u128: "12743498866174",
                          },
                          {
                            u128: "277133456552172",
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
                "CCABO2IQYDWRGGQ4DYQ73CV3ZFDBRZTEQNDDJMFT7JZO54CLS4RYJROY",
              type_: "diagnostic",
              body: {
                v0: {
                  topics: [
                    {
                      symbol: "fn_return",
                    },
                    {
                      symbol: "update",
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
                "CD65EROVLTDU2DWM4ZUJF4NHK4A46DX2UAOGCV7YDFPCSLFYNH57KGIY",
              type_: "contract",
              body: {
                v0: {
                  topics: [
                    {
                      symbol: "trade",
                    },
                    {
                      address:
                        "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                    },
                    {
                      address:
                        "CCKCKCPHYVXQD4NECBFJTFSCU2AMSJGCNG4O6K4JVRE2BLPR7WNDBQIQ",
                    },
                    {
                      address:
                        "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
                    },
                  ],
                  data: {
                    vec: [
                      {
                        i128: "3556419212",
                      },
                      {
                        i128: "77131080728",
                      },
                      {
                        i128: "5334629",
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
                "CD65EROVLTDU2DWM4ZUJF4NHK4A46DX2UAOGCV7YDFPCSLFYNH57KGIY",
              type_: "contract",
              body: {
                v0: {
                  topics: [
                    {
                      symbol: "update_reserves",
                    },
                  ],
                  data: {
                    vec: [
                      {
                        i128: "12743498866174",
                      },
                      {
                        i128: "277133456552172",
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
                "CD65EROVLTDU2DWM4ZUJF4NHK4A46DX2UAOGCV7YDFPCSLFYNH57KGIY",
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
                  data: {
                    u128: "77131080728",
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
                "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
              type_: "contract",
              body: {
                v0: {
                  topics: [
                    {
                      symbol: "swap",
                    },
                    {
                      vec: [
                        {
                          address:
                            "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                        },
                        {
                          address:
                            "CCKCKCPHYVXQD4NECBFJTFSCU2AMSJGCNG4O6K4JVRE2BLPR7WNDBQIQ",
                        },
                      ],
                    },
                    {
                      address:
                        "CCPGFQUTSEHDIQODRE3GJDNE64A35HZ32L7LPDN7GXOCIYNBJSMS6V6B",
                    },
                  ],
                  data: {
                    vec: [
                      {
                        address:
                          "CD65EROVLTDU2DWM4ZUJF4NHK4A46DX2UAOGCV7YDFPCSLFYNH57KGIY",
                      },
                      {
                        address:
                          "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                      },
                      {
                        address:
                          "CCKCKCPHYVXQD4NECBFJTFSCU2AMSJGCNG4O6K4JVRE2BLPR7WNDBQIQ",
                      },
                      {
                        u128: "3556419212",
                      },
                      {
                        u128: "77131080728",
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
                "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
              type_: "diagnostic",
              body: {
                v0: {
                  topics: [
                    {
                      symbol: "fn_call",
                    },
                    {
                      bytes:
                        "942509e7c56f01f1a4104a999642a680c924c269b8ef2b89ac49a0adf1fd9a30",
                    },
                    {
                      symbol: "transfer",
                    },
                  ],
                  data: {
                    vec: [
                      {
                        address:
                          "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
                      },
                      {
                        address:
                          "CCPGFQUTSEHDIQODRE3GJDNE64A35HZ32L7LPDN7GXOCIYNBJSMS6V6B",
                      },
                      {
                        i128: "77131080728",
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
                "CCKCKCPHYVXQD4NECBFJTFSCU2AMSJGCNG4O6K4JVRE2BLPR7WNDBQIQ",
              type_: "contract",
              body: {
                v0: {
                  topics: [
                    {
                      symbol: "transfer",
                    },
                    {
                      address:
                        "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
                    },
                    {
                      address:
                        "CCPGFQUTSEHDIQODRE3GJDNE64A35HZ32L7LPDN7GXOCIYNBJSMS6V6B",
                    },
                    {
                      string:
                        "SHX:GDSTRSHXHGJ7ZIVRBXEYE5Q74XUVCUSEKEBR7UCHEUUEK72N7I7KJ6JH",
                    },
                  ],
                  data: {
                    i128: "77131080728",
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
                "CCKCKCPHYVXQD4NECBFJTFSCU2AMSJGCNG4O6K4JVRE2BLPR7WNDBQIQ",
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
                "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
              type_: "diagnostic",
              body: {
                v0: {
                  topics: [
                    {
                      symbol: "fn_return",
                    },
                    {
                      symbol: "swap_chained",
                    },
                  ],
                  data: {
                    u128: "77131080728",
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
                "CCPGFQUTSEHDIQODRE3GJDNE64A35HZ32L7LPDN7GXOCIYNBJSMS6V6B",
              type_: "diagnostic",
              body: {
                v0: {
                  topics: [
                    {
                      symbol: "fn_call",
                    },
                    {
                      bytes:
                        "942509e7c56f01f1a4104a999642a680c924c269b8ef2b89ac49a0adf1fd9a30",
                    },
                    {
                      symbol: "transfer",
                    },
                  ],
                  data: {
                    vec: [
                      {
                        address:
                          "CCPGFQUTSEHDIQODRE3GJDNE64A35HZ32L7LPDN7GXOCIYNBJSMS6V6B",
                      },
                      {
                        address:
                          "GAWUZ6FJELLX3JQZOQSIYKZOIQWAKZ3ILGGHKLDOCC44VMFC43UGXY2C",
                      },
                      {
                        i128: "76938253026",
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
                "CCKCKCPHYVXQD4NECBFJTFSCU2AMSJGCNG4O6K4JVRE2BLPR7WNDBQIQ",
              type_: "contract",
              body: {
                v0: {
                  topics: [
                    {
                      symbol: "transfer",
                    },
                    {
                      address:
                        "CCPGFQUTSEHDIQODRE3GJDNE64A35HZ32L7LPDN7GXOCIYNBJSMS6V6B",
                    },
                    {
                      address:
                        "GAWUZ6FJELLX3JQZOQSIYKZOIQWAKZ3ILGGHKLDOCC44VMFC43UGXY2C",
                    },
                    {
                      string:
                        "SHX:GDSTRSHXHGJ7ZIVRBXEYE5Q74XUVCUSEKEBR7UCHEUUEK72N7I7KJ6JH",
                    },
                  ],
                  data: {
                    i128: "76938253026",
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
                "CCKCKCPHYVXQD4NECBFJTFSCU2AMSJGCNG4O6K4JVRE2BLPR7WNDBQIQ",
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
                "CCPGFQUTSEHDIQODRE3GJDNE64A35HZ32L7LPDN7GXOCIYNBJSMS6V6B",
              type_: "contract",
              body: {
                v0: {
                  topics: [
                    {
                      symbol: "charge_provider_fee",
                    },
                  ],
                  data: {
                    vec: [
                      {
                        address:
                          "CCKCKCPHYVXQD4NECBFJTFSCU2AMSJGCNG4O6K4JVRE2BLPR7WNDBQIQ",
                      },
                      {
                        u128: "192827702",
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
                "CCPGFQUTSEHDIQODRE3GJDNE64A35HZ32L7LPDN7GXOCIYNBJSMS6V6B",
              type_: "diagnostic",
              body: {
                v0: {
                  topics: [
                    {
                      symbol: "fn_return",
                    },
                    {
                      symbol: "swap_chained",
                    },
                  ],
                  data: {
                    u128: "76938253026",
                  },
                },
              },
            },
          },
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
                      symbol: "core_metrics",
                    },
                    {
                      symbol: "read_entry",
                    },
                  ],
                  data: {
                    u64: "20",
                  },
                },
              },
            },
          },
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
                      symbol: "core_metrics",
                    },
                    {
                      symbol: "write_entry",
                    },
                  ],
                  data: {
                    u64: "10",
                  },
                },
              },
            },
          },
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
                      symbol: "core_metrics",
                    },
                    {
                      symbol: "ledger_read_byte",
                    },
                  ],
                  data: {
                    u64: "308",
                  },
                },
              },
            },
          },
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
                      symbol: "core_metrics",
                    },
                    {
                      symbol: "ledger_write_byte",
                    },
                  ],
                  data: {
                    u64: "4264",
                  },
                },
              },
            },
          },
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
                      symbol: "core_metrics",
                    },
                    {
                      symbol: "read_key_byte",
                    },
                  ],
                  data: {
                    u64: "124",
                  },
                },
              },
            },
          },
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
                      symbol: "core_metrics",
                    },
                    {
                      symbol: "write_key_byte",
                    },
                  ],
                  data: {
                    u64: "0",
                  },
                },
              },
            },
          },
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
                      symbol: "core_metrics",
                    },
                    {
                      symbol: "read_data_byte",
                    },
                  ],
                  data: {
                    u64: "308",
                  },
                },
              },
            },
          },
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
                      symbol: "core_metrics",
                    },
                    {
                      symbol: "write_data_byte",
                    },
                  ],
                  data: {
                    u64: "4264",
                  },
                },
              },
            },
          },
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
                      symbol: "core_metrics",
                    },
                    {
                      symbol: "read_code_byte",
                    },
                  ],
                  data: {
                    u64: "0",
                  },
                },
              },
            },
          },
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
                      symbol: "core_metrics",
                    },
                    {
                      symbol: "write_code_byte",
                    },
                  ],
                  data: {
                    u64: "0",
                  },
                },
              },
            },
          },
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
                      symbol: "core_metrics",
                    },
                    {
                      symbol: "emit_event",
                    },
                  ],
                  data: {
                    u64: "10",
                  },
                },
              },
            },
          },
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
                      symbol: "core_metrics",
                    },
                    {
                      symbol: "emit_event_byte",
                    },
                  ],
                  data: {
                    u64: "2196",
                  },
                },
              },
            },
          },
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
                      symbol: "core_metrics",
                    },
                    {
                      symbol: "cpu_insn",
                    },
                  ],
                  data: {
                    u64: "9097173",
                  },
                },
              },
            },
          },
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
                      symbol: "core_metrics",
                    },
                    {
                      symbol: "mem_byte",
                    },
                  ],
                  data: {
                    u64: "7554739",
                  },
                },
              },
            },
          },
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
                      symbol: "core_metrics",
                    },
                    {
                      symbol: "invoke_time_nsecs",
                    },
                  ],
                  data: {
                    u64: "990405",
                  },
                },
              },
            },
          },
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
                      symbol: "core_metrics",
                    },
                    {
                      symbol: "max_rw_key_byte",
                    },
                  ],
                  data: {
                    u64: "112",
                  },
                },
              },
            },
          },
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
                      symbol: "core_metrics",
                    },
                    {
                      symbol: "max_rw_data_byte",
                    },
                  ],
                  data: {
                    u64: "2320",
                  },
                },
              },
            },
          },
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
                      symbol: "core_metrics",
                    },
                    {
                      symbol: "max_rw_code_byte",
                    },
                  ],
                  data: {
                    u64: "0",
                  },
                },
              },
            },
          },
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
                      symbol: "core_metrics",
                    },
                    {
                      symbol: "max_emit_event_byte",
                    },
                  ],
                  data: {
                    u64: "368",
                  },
                },
              },
            },
          },
        ],
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
                    "9e62c293910e3441c38936648da4f701be9f3bd2feb78dbf35dc2461a14c992f",
                },
                {
                  symbol: "swap_chained",
                },
              ],
              data: {
                vec: [
                  {
                    address:
                      "GAWUZ6FJELLX3JQZOQSIYKZOIQWAKZ3ILGGHKLDOCC44VMFC43UGXY2C",
                  },
                  {
                    vec: [
                      {
                        vec: [
                          {
                            vec: [
                              {
                                address:
                                  "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                              },
                              {
                                address:
                                  "CCKCKCPHYVXQD4NECBFJTFSCU2AMSJGCNG4O6K4JVRE2BLPR7WNDBQIQ",
                              },
                            ],
                          },
                          {
                            bytes:
                              "9ac7a9cde23ac2ada11105eeaa42e43c2ea8332ca0aa8f41f58d7160274d718e",
                          },
                          {
                            address:
                              "CCKCKCPHYVXQD4NECBFJTFSCU2AMSJGCNG4O6K4JVRE2BLPR7WNDBQIQ",
                          },
                        ],
                      },
                    ],
                  },
                  {
                    address:
                      "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                  },
                  {
                    u128: "3556419212",
                  },
                  {
                    u128: "73067668924",
                  },
                  {
                    u32: 250,
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
            "CCPGFQUTSEHDIQODRE3GJDNE64A35HZ32L7LPDN7GXOCIYNBJSMS6V6B",
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
                      "GAWUZ6FJELLX3JQZOQSIYKZOIQWAKZ3ILGGHKLDOCC44VMFC43UGXY2C",
                  },
                  {
                    address:
                      "CCPGFQUTSEHDIQODRE3GJDNE64A35HZ32L7LPDN7GXOCIYNBJSMS6V6B",
                  },
                  {
                    i128: "3556419212",
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
            "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
          type_: "contract",
          body: {
            v0: {
              topics: [
                {
                  symbol: "transfer",
                },
                {
                  address:
                    "GAWUZ6FJELLX3JQZOQSIYKZOIQWAKZ3ILGGHKLDOCC44VMFC43UGXY2C",
                },
                {
                  address:
                    "CCPGFQUTSEHDIQODRE3GJDNE64A35HZ32L7LPDN7GXOCIYNBJSMS6V6B",
                },
                {
                  string: "native",
                },
              ],
              data: {
                i128: "3556419212",
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
            "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
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
            "CCPGFQUTSEHDIQODRE3GJDNE64A35HZ32L7LPDN7GXOCIYNBJSMS6V6B",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_call",
                },
                {
                  bytes:
                    "6033b4250e704e314fb064973d185db922cae0bd272ba5bff19aac570f12ac2f",
                },
                {
                  symbol: "swap_chained",
                },
              ],
              data: {
                vec: [
                  {
                    address:
                      "CCPGFQUTSEHDIQODRE3GJDNE64A35HZ32L7LPDN7GXOCIYNBJSMS6V6B",
                  },
                  {
                    vec: [
                      {
                        vec: [
                          {
                            vec: [
                              {
                                address:
                                  "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                              },
                              {
                                address:
                                  "CCKCKCPHYVXQD4NECBFJTFSCU2AMSJGCNG4O6K4JVRE2BLPR7WNDBQIQ",
                              },
                            ],
                          },
                          {
                            bytes:
                              "9ac7a9cde23ac2ada11105eeaa42e43c2ea8332ca0aa8f41f58d7160274d718e",
                          },
                          {
                            address:
                              "CCKCKCPHYVXQD4NECBFJTFSCU2AMSJGCNG4O6K4JVRE2BLPR7WNDBQIQ",
                          },
                        ],
                      },
                    ],
                  },
                  {
                    address:
                      "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                  },
                  {
                    u128: "3556419212",
                  },
                  {
                    u128: "73067668924",
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
            "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
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
                      "CCPGFQUTSEHDIQODRE3GJDNE64A35HZ32L7LPDN7GXOCIYNBJSMS6V6B",
                  },
                  {
                    address:
                      "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
                  },
                  {
                    i128: "3556419212",
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
            "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
          type_: "contract",
          body: {
            v0: {
              topics: [
                {
                  symbol: "transfer",
                },
                {
                  address:
                    "CCPGFQUTSEHDIQODRE3GJDNE64A35HZ32L7LPDN7GXOCIYNBJSMS6V6B",
                },
                {
                  address:
                    "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
                },
                {
                  string: "native",
                },
              ],
              data: {
                i128: "3556419212",
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
            "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
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
            "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_call",
                },
                {
                  bytes:
                    "fdd245d55cc74d0ecce66892f1a75701cf0efaa01c6157f8195e292cb869fbf5",
                },
                {
                  symbol: "swap",
                },
              ],
              data: {
                vec: [
                  {
                    address:
                      "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
                  },
                  {
                    u32: 0,
                  },
                  {
                    u32: 1,
                  },
                  {
                    u128: "3556419212",
                  },
                  {
                    u128: "73067668924",
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
            "CD65EROVLTDU2DWM4ZUJF4NHK4A46DX2UAOGCV7YDFPCSLFYNH57KGIY",
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
                      "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
                  },
                  {
                    address:
                      "CD65EROVLTDU2DWM4ZUJF4NHK4A46DX2UAOGCV7YDFPCSLFYNH57KGIY",
                  },
                  {
                    i128: "3556419212",
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
            "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
          type_: "contract",
          body: {
            v0: {
              topics: [
                {
                  symbol: "transfer",
                },
                {
                  address:
                    "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
                },
                {
                  address:
                    "CD65EROVLTDU2DWM4ZUJF4NHK4A46DX2UAOGCV7YDFPCSLFYNH57KGIY",
                },
                {
                  string: "native",
                },
              ],
              data: {
                i128: "3556419212",
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
            "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
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
            "CD65EROVLTDU2DWM4ZUJF4NHK4A46DX2UAOGCV7YDFPCSLFYNH57KGIY",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_call",
                },
                {
                  bytes:
                    "942509e7c56f01f1a4104a999642a680c924c269b8ef2b89ac49a0adf1fd9a30",
                },
                {
                  symbol: "transfer",
                },
              ],
              data: {
                vec: [
                  {
                    address:
                      "CD65EROVLTDU2DWM4ZUJF4NHK4A46DX2UAOGCV7YDFPCSLFYNH57KGIY",
                  },
                  {
                    address:
                      "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
                  },
                  {
                    i128: "77131080728",
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
            "CCKCKCPHYVXQD4NECBFJTFSCU2AMSJGCNG4O6K4JVRE2BLPR7WNDBQIQ",
          type_: "contract",
          body: {
            v0: {
              topics: [
                {
                  symbol: "transfer",
                },
                {
                  address:
                    "CD65EROVLTDU2DWM4ZUJF4NHK4A46DX2UAOGCV7YDFPCSLFYNH57KGIY",
                },
                {
                  address:
                    "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
                },
                {
                  string:
                    "SHX:GDSTRSHXHGJ7ZIVRBXEYE5Q74XUVCUSEKEBR7UCHEUUEK72N7I7KJ6JH",
                },
              ],
              data: {
                i128: "77131080728",
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
            "CCKCKCPHYVXQD4NECBFJTFSCU2AMSJGCNG4O6K4JVRE2BLPR7WNDBQIQ",
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
            "CD65EROVLTDU2DWM4ZUJF4NHK4A46DX2UAOGCV7YDFPCSLFYNH57KGIY",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_call",
                },
                {
                  bytes:
                    "80176910c0ed131a1c1e21fd8abbc94618e664834634b0b3fa72eef04b972384",
                },
                {
                  symbol: "update",
                },
              ],
              data: {
                vec: [
                  {
                    address:
                      "CD65EROVLTDU2DWM4ZUJF4NHK4A46DX2UAOGCV7YDFPCSLFYNH57KGIY",
                  },
                  {
                    symbol: "standard",
                  },
                  {
                    vec: [
                      {
                        u128: "30",
                      },
                    ],
                  },
                  {
                    vec: [
                      {
                        u128: "12743498866174",
                      },
                      {
                        u128: "277133456552172",
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
            "CCABO2IQYDWRGGQ4DYQ73CV3ZFDBRZTEQNDDJMFT7JZO54CLS4RYJROY",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_return",
                },
                {
                  symbol: "update",
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
            "CD65EROVLTDU2DWM4ZUJF4NHK4A46DX2UAOGCV7YDFPCSLFYNH57KGIY",
          type_: "contract",
          body: {
            v0: {
              topics: [
                {
                  symbol: "trade",
                },
                {
                  address:
                    "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                },
                {
                  address:
                    "CCKCKCPHYVXQD4NECBFJTFSCU2AMSJGCNG4O6K4JVRE2BLPR7WNDBQIQ",
                },
                {
                  address:
                    "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
                },
              ],
              data: {
                vec: [
                  {
                    i128: "3556419212",
                  },
                  {
                    i128: "77131080728",
                  },
                  {
                    i128: "5334629",
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
            "CD65EROVLTDU2DWM4ZUJF4NHK4A46DX2UAOGCV7YDFPCSLFYNH57KGIY",
          type_: "contract",
          body: {
            v0: {
              topics: [
                {
                  symbol: "update_reserves",
                },
              ],
              data: {
                vec: [
                  {
                    i128: "12743498866174",
                  },
                  {
                    i128: "277133456552172",
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
            "CD65EROVLTDU2DWM4ZUJF4NHK4A46DX2UAOGCV7YDFPCSLFYNH57KGIY",
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
              data: {
                u128: "77131080728",
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
            "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
          type_: "contract",
          body: {
            v0: {
              topics: [
                {
                  symbol: "swap",
                },
                {
                  vec: [
                    {
                      address:
                        "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                    },
                    {
                      address:
                        "CCKCKCPHYVXQD4NECBFJTFSCU2AMSJGCNG4O6K4JVRE2BLPR7WNDBQIQ",
                    },
                  ],
                },
                {
                  address:
                    "CCPGFQUTSEHDIQODRE3GJDNE64A35HZ32L7LPDN7GXOCIYNBJSMS6V6B",
                },
              ],
              data: {
                vec: [
                  {
                    address:
                      "CD65EROVLTDU2DWM4ZUJF4NHK4A46DX2UAOGCV7YDFPCSLFYNH57KGIY",
                  },
                  {
                    address:
                      "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                  },
                  {
                    address:
                      "CCKCKCPHYVXQD4NECBFJTFSCU2AMSJGCNG4O6K4JVRE2BLPR7WNDBQIQ",
                  },
                  {
                    u128: "3556419212",
                  },
                  {
                    u128: "77131080728",
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
            "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_call",
                },
                {
                  bytes:
                    "942509e7c56f01f1a4104a999642a680c924c269b8ef2b89ac49a0adf1fd9a30",
                },
                {
                  symbol: "transfer",
                },
              ],
              data: {
                vec: [
                  {
                    address:
                      "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
                  },
                  {
                    address:
                      "CCPGFQUTSEHDIQODRE3GJDNE64A35HZ32L7LPDN7GXOCIYNBJSMS6V6B",
                  },
                  {
                    i128: "77131080728",
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
            "CCKCKCPHYVXQD4NECBFJTFSCU2AMSJGCNG4O6K4JVRE2BLPR7WNDBQIQ",
          type_: "contract",
          body: {
            v0: {
              topics: [
                {
                  symbol: "transfer",
                },
                {
                  address:
                    "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
                },
                {
                  address:
                    "CCPGFQUTSEHDIQODRE3GJDNE64A35HZ32L7LPDN7GXOCIYNBJSMS6V6B",
                },
                {
                  string:
                    "SHX:GDSTRSHXHGJ7ZIVRBXEYE5Q74XUVCUSEKEBR7UCHEUUEK72N7I7KJ6JH",
                },
              ],
              data: {
                i128: "77131080728",
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
            "CCKCKCPHYVXQD4NECBFJTFSCU2AMSJGCNG4O6K4JVRE2BLPR7WNDBQIQ",
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
            "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_return",
                },
                {
                  symbol: "swap_chained",
                },
              ],
              data: {
                u128: "77131080728",
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
            "CCPGFQUTSEHDIQODRE3GJDNE64A35HZ32L7LPDN7GXOCIYNBJSMS6V6B",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_call",
                },
                {
                  bytes:
                    "942509e7c56f01f1a4104a999642a680c924c269b8ef2b89ac49a0adf1fd9a30",
                },
                {
                  symbol: "transfer",
                },
              ],
              data: {
                vec: [
                  {
                    address:
                      "CCPGFQUTSEHDIQODRE3GJDNE64A35HZ32L7LPDN7GXOCIYNBJSMS6V6B",
                  },
                  {
                    address:
                      "GAWUZ6FJELLX3JQZOQSIYKZOIQWAKZ3ILGGHKLDOCC44VMFC43UGXY2C",
                  },
                  {
                    i128: "76938253026",
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
            "CCKCKCPHYVXQD4NECBFJTFSCU2AMSJGCNG4O6K4JVRE2BLPR7WNDBQIQ",
          type_: "contract",
          body: {
            v0: {
              topics: [
                {
                  symbol: "transfer",
                },
                {
                  address:
                    "CCPGFQUTSEHDIQODRE3GJDNE64A35HZ32L7LPDN7GXOCIYNBJSMS6V6B",
                },
                {
                  address:
                    "GAWUZ6FJELLX3JQZOQSIYKZOIQWAKZ3ILGGHKLDOCC44VMFC43UGXY2C",
                },
                {
                  string:
                    "SHX:GDSTRSHXHGJ7ZIVRBXEYE5Q74XUVCUSEKEBR7UCHEUUEK72N7I7KJ6JH",
                },
              ],
              data: {
                i128: "76938253026",
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
            "CCKCKCPHYVXQD4NECBFJTFSCU2AMSJGCNG4O6K4JVRE2BLPR7WNDBQIQ",
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
            "CCPGFQUTSEHDIQODRE3GJDNE64A35HZ32L7LPDN7GXOCIYNBJSMS6V6B",
          type_: "contract",
          body: {
            v0: {
              topics: [
                {
                  symbol: "charge_provider_fee",
                },
              ],
              data: {
                vec: [
                  {
                    address:
                      "CCKCKCPHYVXQD4NECBFJTFSCU2AMSJGCNG4O6K4JVRE2BLPR7WNDBQIQ",
                  },
                  {
                    u128: "192827702",
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
            "CCPGFQUTSEHDIQODRE3GJDNE64A35HZ32L7LPDN7GXOCIYNBJSMS6V6B",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_return",
                },
                {
                  symbol: "swap_chained",
                },
              ],
              data: {
                u128: "76938253026",
              },
            },
          },
        },
      },
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "read_entry",
                },
              ],
              data: {
                u64: "20",
              },
            },
          },
        },
      },
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "write_entry",
                },
              ],
              data: {
                u64: "10",
              },
            },
          },
        },
      },
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "ledger_read_byte",
                },
              ],
              data: {
                u64: "308",
              },
            },
          },
        },
      },
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "ledger_write_byte",
                },
              ],
              data: {
                u64: "4264",
              },
            },
          },
        },
      },
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "read_key_byte",
                },
              ],
              data: {
                u64: "124",
              },
            },
          },
        },
      },
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "write_key_byte",
                },
              ],
              data: {
                u64: "0",
              },
            },
          },
        },
      },
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "read_data_byte",
                },
              ],
              data: {
                u64: "308",
              },
            },
          },
        },
      },
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "write_data_byte",
                },
              ],
              data: {
                u64: "4264",
              },
            },
          },
        },
      },
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "read_code_byte",
                },
              ],
              data: {
                u64: "0",
              },
            },
          },
        },
      },
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "write_code_byte",
                },
              ],
              data: {
                u64: "0",
              },
            },
          },
        },
      },
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "emit_event",
                },
              ],
              data: {
                u64: "10",
              },
            },
          },
        },
      },
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "emit_event_byte",
                },
              ],
              data: {
                u64: "2196",
              },
            },
          },
        },
      },
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "cpu_insn",
                },
              ],
              data: {
                u64: "9097173",
              },
            },
          },
        },
      },
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "mem_byte",
                },
              ],
              data: {
                u64: "7554739",
              },
            },
          },
        },
      },
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "invoke_time_nsecs",
                },
              ],
              data: {
                u64: "990405",
              },
            },
          },
        },
      },
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "max_rw_key_byte",
                },
              ],
              data: {
                u64: "112",
              },
            },
          },
        },
      },
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "max_rw_data_byte",
                },
              ],
              data: {
                u64: "2320",
              },
            },
          },
        },
      },
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "max_rw_code_byte",
                },
              ],
              data: {
                u64: "0",
              },
            },
          },
        },
      },
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "max_emit_event_byte",
                },
              ],
              data: {
                u64: "368",
              },
            },
          },
        },
      },
    ],
    events: {
      transactionEventsJson: [
        {
          stage: "before_all_txs",
          event: {
            ext: "v0",
            contract_id:
              "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
            type_: "contract",
            body: {
              v0: {
                topics: [
                  {
                    symbol: "fee",
                  },
                  {
                    address:
                      "GAWUZ6FJELLX3JQZOQSIYKZOIQWAKZ3ILGGHKLDOCC44VMFC43UGXY2C",
                  },
                ],
                data: {
                  i128: "265855",
                },
              },
            },
          },
        },
        {
          stage: "after_all_txs",
          event: {
            ext: "v0",
            contract_id:
              "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
            type_: "contract",
            body: {
              v0: {
                topics: [
                  {
                    symbol: "fee",
                  },
                  {
                    address:
                      "GAWUZ6FJELLX3JQZOQSIYKZOIQWAKZ3ILGGHKLDOCC44VMFC43UGXY2C",
                  },
                ],
                data: {
                  i128: "-41026",
                },
              },
            },
          },
        },
      ],
      contractEventsJson: [
        [
          {
            ext: "v0",
            contract_id:
              "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
            type_: "contract",
            body: {
              v0: {
                topics: [
                  {
                    symbol: "transfer",
                  },
                  {
                    address:
                      "GAWUZ6FJELLX3JQZOQSIYKZOIQWAKZ3ILGGHKLDOCC44VMFC43UGXY2C",
                  },
                  {
                    address:
                      "CCPGFQUTSEHDIQODRE3GJDNE64A35HZ32L7LPDN7GXOCIYNBJSMS6V6B",
                  },
                  {
                    string: "native",
                  },
                ],
                data: {
                  i128: "3556419212",
                },
              },
            },
          },
          {
            ext: "v0",
            contract_id:
              "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
            type_: "contract",
            body: {
              v0: {
                topics: [
                  {
                    symbol: "transfer",
                  },
                  {
                    address:
                      "CCPGFQUTSEHDIQODRE3GJDNE64A35HZ32L7LPDN7GXOCIYNBJSMS6V6B",
                  },
                  {
                    address:
                      "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
                  },
                  {
                    string: "native",
                  },
                ],
                data: {
                  i128: "3556419212",
                },
              },
            },
          },
          {
            ext: "v0",
            contract_id:
              "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
            type_: "contract",
            body: {
              v0: {
                topics: [
                  {
                    symbol: "transfer",
                  },
                  {
                    address:
                      "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
                  },
                  {
                    address:
                      "CD65EROVLTDU2DWM4ZUJF4NHK4A46DX2UAOGCV7YDFPCSLFYNH57KGIY",
                  },
                  {
                    string: "native",
                  },
                ],
                data: {
                  i128: "3556419212",
                },
              },
            },
          },
          {
            ext: "v0",
            contract_id:
              "CCKCKCPHYVXQD4NECBFJTFSCU2AMSJGCNG4O6K4JVRE2BLPR7WNDBQIQ",
            type_: "contract",
            body: {
              v0: {
                topics: [
                  {
                    symbol: "transfer",
                  },
                  {
                    address:
                      "CD65EROVLTDU2DWM4ZUJF4NHK4A46DX2UAOGCV7YDFPCSLFYNH57KGIY",
                  },
                  {
                    address:
                      "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
                  },
                  {
                    string:
                      "SHX:GDSTRSHXHGJ7ZIVRBXEYE5Q74XUVCUSEKEBR7UCHEUUEK72N7I7KJ6JH",
                  },
                ],
                data: {
                  i128: "77131080728",
                },
              },
            },
          },
          {
            ext: "v0",
            contract_id:
              "CD65EROVLTDU2DWM4ZUJF4NHK4A46DX2UAOGCV7YDFPCSLFYNH57KGIY",
            type_: "contract",
            body: {
              v0: {
                topics: [
                  {
                    symbol: "trade",
                  },
                  {
                    address:
                      "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                  },
                  {
                    address:
                      "CCKCKCPHYVXQD4NECBFJTFSCU2AMSJGCNG4O6K4JVRE2BLPR7WNDBQIQ",
                  },
                  {
                    address:
                      "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
                  },
                ],
                data: {
                  vec: [
                    {
                      i128: "3556419212",
                    },
                    {
                      i128: "77131080728",
                    },
                    {
                      i128: "5334629",
                    },
                  ],
                },
              },
            },
          },
          {
            ext: "v0",
            contract_id:
              "CD65EROVLTDU2DWM4ZUJF4NHK4A46DX2UAOGCV7YDFPCSLFYNH57KGIY",
            type_: "contract",
            body: {
              v0: {
                topics: [
                  {
                    symbol: "update_reserves",
                  },
                ],
                data: {
                  vec: [
                    {
                      i128: "12743498866174",
                    },
                    {
                      i128: "277133456552172",
                    },
                  ],
                },
              },
            },
          },
          {
            ext: "v0",
            contract_id:
              "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
            type_: "contract",
            body: {
              v0: {
                topics: [
                  {
                    symbol: "swap",
                  },
                  {
                    vec: [
                      {
                        address:
                          "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                      },
                      {
                        address:
                          "CCKCKCPHYVXQD4NECBFJTFSCU2AMSJGCNG4O6K4JVRE2BLPR7WNDBQIQ",
                      },
                    ],
                  },
                  {
                    address:
                      "CCPGFQUTSEHDIQODRE3GJDNE64A35HZ32L7LPDN7GXOCIYNBJSMS6V6B",
                  },
                ],
                data: {
                  vec: [
                    {
                      address:
                        "CD65EROVLTDU2DWM4ZUJF4NHK4A46DX2UAOGCV7YDFPCSLFYNH57KGIY",
                    },
                    {
                      address:
                        "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                    },
                    {
                      address:
                        "CCKCKCPHYVXQD4NECBFJTFSCU2AMSJGCNG4O6K4JVRE2BLPR7WNDBQIQ",
                    },
                    {
                      u128: "3556419212",
                    },
                    {
                      u128: "77131080728",
                    },
                  ],
                },
              },
            },
          },
          {
            ext: "v0",
            contract_id:
              "CCKCKCPHYVXQD4NECBFJTFSCU2AMSJGCNG4O6K4JVRE2BLPR7WNDBQIQ",
            type_: "contract",
            body: {
              v0: {
                topics: [
                  {
                    symbol: "transfer",
                  },
                  {
                    address:
                      "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK",
                  },
                  {
                    address:
                      "CCPGFQUTSEHDIQODRE3GJDNE64A35HZ32L7LPDN7GXOCIYNBJSMS6V6B",
                  },
                  {
                    string:
                      "SHX:GDSTRSHXHGJ7ZIVRBXEYE5Q74XUVCUSEKEBR7UCHEUUEK72N7I7KJ6JH",
                  },
                ],
                data: {
                  i128: "77131080728",
                },
              },
            },
          },
          {
            ext: "v0",
            contract_id:
              "CCKCKCPHYVXQD4NECBFJTFSCU2AMSJGCNG4O6K4JVRE2BLPR7WNDBQIQ",
            type_: "contract",
            body: {
              v0: {
                topics: [
                  {
                    symbol: "transfer",
                  },
                  {
                    address:
                      "CCPGFQUTSEHDIQODRE3GJDNE64A35HZ32L7LPDN7GXOCIYNBJSMS6V6B",
                  },
                  {
                    address:
                      "GAWUZ6FJELLX3JQZOQSIYKZOIQWAKZ3ILGGHKLDOCC44VMFC43UGXY2C",
                  },
                  {
                    string:
                      "SHX:GDSTRSHXHGJ7ZIVRBXEYE5Q74XUVCUSEKEBR7UCHEUUEK72N7I7KJ6JH",
                  },
                ],
                data: {
                  i128: "76938253026",
                },
              },
            },
          },
          {
            ext: "v0",
            contract_id:
              "CCPGFQUTSEHDIQODRE3GJDNE64A35HZ32L7LPDN7GXOCIYNBJSMS6V6B",
            type_: "contract",
            body: {
              v0: {
                topics: [
                  {
                    symbol: "charge_provider_fee",
                  },
                ],
                data: {
                  vec: [
                    {
                      address:
                        "CCKCKCPHYVXQD4NECBFJTFSCU2AMSJGCNG4O6K4JVRE2BLPR7WNDBQIQ",
                    },
                    {
                      u128: "192827702",
                    },
                  ],
                },
              },
            },
          },
        ],
      ],
    },
    ledger: 60106192,
    createdAt: "1764617884",
  },
};

export const TX_EVENTS_MOCK_SOROSWAP = {
  jsonrpc: "2.0",
  id: 1,
  result: {
    latestLedger: 60121842,
    latestLedgerCloseTime: "1764707362",
    oldestLedger: 60000883,
    oldestLedgerCloseTime: "1764016503",
    status: "SUCCESS",
    txHash: "43642f6951928e7378d30ebd52a640b5e88d942330f93f331d9d4d3ff9b7f7d7",
    applicationOrder: 251,
    feeBump: false,
    envelopeJson: {
      tx: {
        tx: {
          source_account:
            "GC6O7PZQBDBJRIZELR2ODM2HV56ZM37F6PRBX5ZE5H7VZJGMQVBB3CLE",
          fee: 5575752,
          seq_num: "257760761462390798",
          cond: {
            time: {
              min_time: "0",
              max_time: "0",
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
                        "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
                      function_name: "add_liquidity_soroswap",
                      args: [
                        {
                          address:
                            "CCNHYCMBEZFWDRYMWHWB52MRCRLFEORSOK5QYWUZXYSLFKQSO2PRWYYZ",
                        },
                        {
                          i128: "3000000",
                        },
                        {
                          i128: "3000000",
                        },
                        {
                          i128: "5",
                        },
                        {
                          i128: "5",
                        },
                        {
                          u64: "99999999999",
                        },
                        {
                          address:
                            "CAG5LRYQ5JVEUI5TEID72EYOVX44TTUJT5BQR2J6J77FH65PCCFAJDDH",
                        },
                      ],
                    },
                  },
                  auth: [
                    {
                      credentials: {
                        address: {
                          address:
                            "CCNHYCMBEZFWDRYMWHWB52MRCRLFEORSOK5QYWUZXYSLFKQSO2PRWYYZ",
                          nonce: "266597824065471840",
                          signature_expiration_ledger: 60080755,
                          signature: {
                            vec: [
                              {
                                map: [
                                  {
                                    key: {
                                      symbol: "public_key",
                                    },
                                    val: {
                                      bytes:
                                        "b7e37226700e891a1450ea10c897f6c9aa9d868a76dc1f2fc183eea19389c51e",
                                    },
                                  },
                                  {
                                    key: {
                                      symbol: "signature",
                                    },
                                    val: {
                                      bytes:
                                        "38bd2ead4b8f512c3fadf09eb3318601c9429187c0bb3d32822f38076295a7b80a5f31cfaaccf392bffc98579342ab9a0b3fe4b28082ddbdcb8213a3c68f8105",
                                    },
                                  },
                                ],
                              },
                            ],
                          },
                        },
                      },
                      root_invocation: {
                        function: {
                          contract_fn: {
                            contract_address:
                              "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
                            function_name: "add_liquidity_soroswap",
                            args: [
                              {
                                address:
                                  "CCNHYCMBEZFWDRYMWHWB52MRCRLFEORSOK5QYWUZXYSLFKQSO2PRWYYZ",
                              },
                              {
                                i128: "3000000",
                              },
                              {
                                i128: "3000000",
                              },
                              {
                                i128: "5",
                              },
                              {
                                i128: "5",
                              },
                              {
                                u64: "99999999999",
                              },
                              {
                                address:
                                  "CAG5LRYQ5JVEUI5TEID72EYOVX44TTUJT5BQR2J6J77FH65PCCFAJDDH",
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
                          "CAG5LRYQ5JVEUI5TEID72EYOVX44TTUJT5BQR2J6J77FH65PCCFAJDDH",
                        key: "ledger_key_contract_instance",
                        durability: "persistent",
                      },
                    },
                    {
                      contract_data: {
                        contract:
                          "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
                        key: {
                          symbol: "LOBSTER",
                        },
                        durability: "persistent",
                      },
                    },
                    {
                      contract_data: {
                        contract:
                          "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
                        key: {
                          symbol: "OWNER",
                        },
                        durability: "persistent",
                      },
                    },
                    {
                      contract_data: {
                        contract:
                          "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
                        key: {
                          symbol: "TOKEN0",
                        },
                        durability: "persistent",
                      },
                    },
                    {
                      contract_data: {
                        contract:
                          "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
                        key: {
                          symbol: "TOKEN1",
                        },
                        durability: "persistent",
                      },
                    },
                    {
                      contract_data: {
                        contract:
                          "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
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
                          "CCNHYCMBEZFWDRYMWHWB52MRCRLFEORSOK5QYWUZXYSLFKQSO2PRWYYZ",
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
                        hash: "37ce4e0c958db6051e361563a8d453b830e0699947b19d1c3d2f5173576d92f4",
                      },
                    },
                    {
                      contract_code: {
                        hash: "4b2fd12da278856a551eefc1e23dfeed80e2175b4991db22b138e7acfed533d2",
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
                      contract_data: {
                        contract:
                          "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
                        key: {
                          symbol: "ACT_DEX",
                        },
                        durability: "persistent",
                      },
                    },
                    {
                      contract_data: {
                        contract:
                          "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
                        key: {
                          symbol: "ACT_POOL",
                        },
                        durability: "persistent",
                      },
                    },
                    {
                      contract_data: {
                        contract:
                          "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
                        key: {
                          symbol: "ACT_ROUT",
                        },
                        durability: "persistent",
                      },
                    },
                    {
                      contract_data: {
                        contract:
                          "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
                        key: {
                          symbol: "ACT_SHARE",
                        },
                        durability: "persistent",
                      },
                    },
                    {
                      contract_data: {
                        contract:
                          "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
                        key: {
                          symbol: "KEY_RENTR",
                        },
                        durability: "temporary",
                      },
                    },
                    {
                      contract_data: {
                        contract:
                          "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
                        key: {
                          symbol: "LAST_A",
                        },
                        durability: "persistent",
                      },
                    },
                    {
                      contract_data: {
                        contract:
                          "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
                        key: {
                          symbol: "LAST_B",
                        },
                        durability: "persistent",
                      },
                    },
                    {
                      contract_data: {
                        contract:
                          "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
                        key: {
                          symbol: "TVL0",
                        },
                        durability: "persistent",
                      },
                    },
                    {
                      contract_data: {
                        contract:
                          "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
                        key: {
                          symbol: "TVL1",
                        },
                        durability: "persistent",
                      },
                    },
                    {
                      contract_data: {
                        contract:
                          "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
                        key: {
                          vec: [
                            {
                              symbol: "Balance",
                            },
                            {
                              address:
                                "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
                            },
                          ],
                        },
                        durability: "persistent",
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
                                "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
                            },
                          ],
                        },
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
                          "CCNHYCMBEZFWDRYMWHWB52MRCRLFEORSOK5QYWUZXYSLFKQSO2PRWYYZ",
                        key: {
                          ledger_key_nonce: {
                            nonce: "266597824065471840",
                          },
                        },
                        durability: "temporary",
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
                                "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
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
                instructions: 12516927,
                disk_read_bytes: 0,
                write_bytes: 2480,
              },
              resource_fee: "2738869",
            },
          },
        },
        signatures: [
          {
            hint: "cc85421d",
            signature:
              "420291dd85ec852f7a8083889da7fb7a16baad60413f9cd40a90ff83c749fd89b11bf5e1bda0494578f33d286f68934b97b229cd313df521bb6d7418018f7f00",
          },
        ],
      },
    },
    resultJson: {
      fee_charged: "2381922",
      result: {
        tx_success: [
          {
            op_inner: {
              invoke_host_function: {
                success:
                  "1c126939920c9b1e3ae3a06efdceb5a0355f398e7deeeaebf2bba06f1a8d2350",
              },
            },
          },
        ],
      },
      ext: "v0",
    },
    resultMetaJson: {
      v4: {
        ext: "v0",
        tx_changes_before: [
          {
            state: {
              last_modified_ledger_seq: 60080657,
              data: {
                account: {
                  account_id:
                    "GC6O7PZQBDBJRIZELR2ODM2HV56ZM37F6PRBX5ZE5H7VZJGMQVBB3CLE",
                  balance: "9496701471",
                  seq_num: "257760761462390797",
                  num_sub_entries: 0,
                  inflation_dest: null,
                  flags: 0,
                  home_domain: "",
                  thresholds: "01000000",
                  signers: [],
                  ext: {
                    v1: {
                      liabilities: {
                        buying: "0",
                        selling: "0",
                      },
                      ext: {
                        v2: {
                          num_sponsored: 0,
                          num_sponsoring: 0,
                          signer_sponsoring_i_ds: [],
                          ext: {
                            v3: {
                              ext: "v0",
                              seq_ledger: 60079949,
                              seq_time: "1764468892",
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
              last_modified_ledger_seq: 60080657,
              data: {
                account: {
                  account_id:
                    "GC6O7PZQBDBJRIZELR2ODM2HV56ZM37F6PRBX5ZE5H7VZJGMQVBB3CLE",
                  balance: "9496701471",
                  seq_num: "257760761462390798",
                  num_sub_entries: 0,
                  inflation_dest: null,
                  flags: 0,
                  home_domain: "",
                  thresholds: "01000000",
                  signers: [],
                  ext: {
                    v1: {
                      liabilities: {
                        buying: "0",
                        selling: "0",
                      },
                      ext: {
                        v2: {
                          num_sponsored: 0,
                          num_sponsoring: 0,
                          signer_sponsoring_i_ds: [],
                          ext: {
                            v3: {
                              ext: "v0",
                              seq_ledger: 60080657,
                              seq_time: "1764472927",
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
            ext: "v0",
            changes: [
              {
                state: {
                  last_modified_ledger_seq: 60080640,
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
                              i128: "1080338864870",
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
                  last_modified_ledger_seq: 60080657,
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
                              i128: "1080339621425",
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
                created: {
                  last_modified_ledger_seq: 60080657,
                  data: {
                    ttl: {
                      key_hash:
                        "6fff503ab3bb9f4671746b809e83e8ab5c19cc5e86b50b50cf546002dc972948",
                      live_until_ledger_seq: 60097936,
                    },
                  },
                  ext: "v0",
                },
              },
              {
                state: {
                  last_modified_ledger_seq: 60080640,
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
                              i128: "4283909832794",
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
                  last_modified_ledger_seq: 60080657,
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
                              i128: "4283912832794",
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
                created: {
                  last_modified_ledger_seq: 60080657,
                  data: {
                    ttl: {
                      key_hash:
                        "b1563f630cae1432f2eff802fa2e5eacc8b559e3cad552d7eaec2de70bcfc072",
                      live_until_ledger_seq: 62154256,
                    },
                  },
                  ext: "v0",
                },
              },
              {
                state: {
                  last_modified_ledger_seq: 60080640,
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
                                i128: "4283909832794",
                              },
                            },
                            {
                              key: {
                                u32: 3,
                              },
                              val: {
                                i128: "1080338864870",
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
                                i128: "1953935971976",
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
                  last_modified_ledger_seq: 60080657,
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
                                i128: "4283912832794",
                              },
                            },
                            {
                              key: {
                                u32: 3,
                              },
                              val: {
                                i128: "1080339621425",
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
                                i128: "1953937340305",
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
                  last_modified_ledger_seq: 60057981,
                  data: {
                    ttl: {
                      key_hash:
                        "30c5d12f7130592cc37efd450e1d039608ed34ead5903d1d4872c2c428cd9aae",
                      live_until_ledger_seq: 60576381,
                    },
                  },
                  ext: "v0",
                },
              },
              {
                updated: {
                  last_modified_ledger_seq: 60080657,
                  data: {
                    ttl: {
                      key_hash:
                        "30c5d12f7130592cc37efd450e1d039608ed34ead5903d1d4872c2c428cd9aae",
                      live_until_ledger_seq: 60599057,
                    },
                  },
                  ext: "v0",
                },
              },
              {
                state: {
                  last_modified_ledger_seq: 60080338,
                  data: {
                    contract_data: {
                      ext: "v0",
                      contract:
                        "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
                      key: {
                        symbol: "LAST_A",
                      },
                      durability: "persistent",
                      val: {
                        i128: "3000000",
                      },
                    },
                  },
                  ext: "v0",
                },
              },
              {
                updated: {
                  last_modified_ledger_seq: 60080657,
                  data: {
                    contract_data: {
                      ext: "v0",
                      contract:
                        "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
                      key: {
                        symbol: "LAST_A",
                      },
                      durability: "persistent",
                      val: {
                        i128: "3000000",
                      },
                    },
                  },
                  ext: "v0",
                },
              },
              {
                state: {
                  last_modified_ledger_seq: 60057981,
                  data: {
                    ttl: {
                      key_hash:
                        "5e243d1c4cbd48e8882c859e92fc97c86dbacae96118fed625f9bebea0741463",
                      live_until_ledger_seq: 61094781,
                    },
                  },
                  ext: "v0",
                },
              },
              {
                updated: {
                  last_modified_ledger_seq: 60080657,
                  data: {
                    ttl: {
                      key_hash:
                        "5e243d1c4cbd48e8882c859e92fc97c86dbacae96118fed625f9bebea0741463",
                      live_until_ledger_seq: 61117457,
                    },
                  },
                  ext: "v0",
                },
              },
              {
                created: {
                  last_modified_ledger_seq: 60080657,
                  data: {
                    ttl: {
                      key_hash:
                        "90d44ed34b02915f91e9464079759cb5c5f1a785fcc808a6ea750f2174d2cd01",
                      live_until_ledger_seq: 62154256,
                    },
                  },
                  ext: "v0",
                },
              },
              {
                state: {
                  last_modified_ledger_seq: 60057981,
                  data: {
                    ttl: {
                      key_hash:
                        "8e194332f2fccefc35ba29937d290c5453b332b7a060e689771b3d6e8a24829c",
                      live_until_ledger_seq: 60576381,
                    },
                  },
                  ext: "v0",
                },
              },
              {
                updated: {
                  last_modified_ledger_seq: 60080657,
                  data: {
                    ttl: {
                      key_hash:
                        "8e194332f2fccefc35ba29937d290c5453b332b7a060e689771b3d6e8a24829c",
                      live_until_ledger_seq: 60599057,
                    },
                  },
                  ext: "v0",
                },
              },
              {
                created: {
                  last_modified_ledger_seq: 60080657,
                  data: {
                    contract_data: {
                      ext: "v0",
                      contract:
                        "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
                      key: {
                        symbol: "TVL1",
                      },
                      durability: "persistent",
                      val: {
                        i128: "3000000",
                      },
                    },
                  },
                  ext: "v0",
                },
              },
              {
                created: {
                  last_modified_ledger_seq: 60080657,
                  data: {
                    contract_data: {
                      ext: "v0",
                      contract:
                        "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
                      key: {
                        symbol: "ACT_SHARE",
                      },
                      durability: "persistent",
                      val: {
                        i128: "1368329",
                      },
                    },
                  },
                  ext: "v0",
                },
              },
              {
                created: {
                  last_modified_ledger_seq: 60080657,
                  data: {
                    ttl: {
                      key_hash:
                        "dd0888a65308fc14a4980948f40d83ce28a7e6108c57419a668e261fc2150364",
                      live_until_ledger_seq: 62154256,
                    },
                  },
                  ext: "v0",
                },
              },
              {
                state: {
                  last_modified_ledger_seq: 60080338,
                  data: {
                    contract_data: {
                      ext: "v0",
                      contract:
                        "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
                      key: {
                        symbol: "LAST_B",
                      },
                      durability: "persistent",
                      val: {
                        i128: "3000000",
                      },
                    },
                  },
                  ext: "v0",
                },
              },
              {
                updated: {
                  last_modified_ledger_seq: 60080657,
                  data: {
                    contract_data: {
                      ext: "v0",
                      contract:
                        "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
                      key: {
                        symbol: "LAST_B",
                      },
                      durability: "persistent",
                      val: {
                        i128: "756555",
                      },
                    },
                  },
                  ext: "v0",
                },
              },
              {
                created: {
                  last_modified_ledger_seq: 60080657,
                  data: {
                    contract_data: {
                      ext: "v0",
                      contract:
                        "CCNHYCMBEZFWDRYMWHWB52MRCRLFEORSOK5QYWUZXYSLFKQSO2PRWYYZ",
                      key: {
                        ledger_key_nonce: {
                          nonce: "266597824065471840",
                        },
                      },
                      durability: "temporary",
                      val: "void",
                    },
                  },
                  ext: "v0",
                },
              },
              {
                state: {
                  last_modified_ledger_seq: 60080338,
                  data: {
                    contract_data: {
                      ext: "v0",
                      contract:
                        "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
                      key: {
                        symbol: "KEY_RENTR",
                      },
                      durability: "temporary",
                      val: {
                        bool: false,
                      },
                    },
                  },
                  ext: "v0",
                },
              },
              {
                updated: {
                  last_modified_ledger_seq: 60080657,
                  data: {
                    contract_data: {
                      ext: "v0",
                      contract:
                        "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
                      key: {
                        symbol: "KEY_RENTR",
                      },
                      durability: "temporary",
                      val: {
                        bool: false,
                      },
                    },
                  },
                  ext: "v0",
                },
              },
              {
                created: {
                  last_modified_ledger_seq: 60080657,
                  data: {
                    contract_data: {
                      ext: "v0",
                      contract:
                        "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
                      key: {
                        vec: [
                          {
                            symbol: "Balance",
                          },
                          {
                            address:
                              "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
                          },
                        ],
                      },
                      durability: "persistent",
                      val: {
                        i128: "1368329",
                      },
                    },
                  },
                  ext: "v0",
                },
              },
              {
                state: {
                  last_modified_ledger_seq: 60080338,
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
                              "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
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
                              i128: "3000000",
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
                  last_modified_ledger_seq: 60080657,
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
                              "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
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
                              i128: "0",
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
                  last_modified_ledger_seq: 60080338,
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
                              "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
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
                              i128: "3000000",
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
                  last_modified_ledger_seq: 60080657,
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
                              "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
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
                              i128: "2243445",
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
                created: {
                  last_modified_ledger_seq: 60080657,
                  data: {
                    ttl: {
                      key_hash:
                        "30b4d2428182bcd26e218f661f9559cadd35c7ba90c4017afc703878780828a4",
                      live_until_ledger_seq: 62154256,
                    },
                  },
                  ext: "v0",
                },
              },
              {
                created: {
                  last_modified_ledger_seq: 60080657,
                  data: {
                    ttl: {
                      key_hash:
                        "2e514a219092758a815627432d76e6bea0d16adfb67034671866a30c4dc21d69",
                      live_until_ledger_seq: 62154256,
                    },
                  },
                  ext: "v0",
                },
              },
              {
                created: {
                  last_modified_ledger_seq: 60080657,
                  data: {
                    contract_data: {
                      ext: "v0",
                      contract:
                        "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
                      key: {
                        symbol: "TVL0",
                      },
                      durability: "persistent",
                      val: {
                        i128: "12000000",
                      },
                    },
                  },
                  ext: "v0",
                },
              },
              {
                state: {
                  last_modified_ledger_seq: 60080007,
                  data: {
                    contract_data: {
                      ext: "v0",
                      contract:
                        "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
                      key: {
                        symbol: "ACT_DEX",
                      },
                      durability: "persistent",
                      val: {
                        i128: "5",
                      },
                    },
                  },
                  ext: "v0",
                },
              },
              {
                updated: {
                  last_modified_ledger_seq: 60080657,
                  data: {
                    contract_data: {
                      ext: "v0",
                      contract:
                        "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
                      key: {
                        symbol: "ACT_DEX",
                      },
                      durability: "persistent",
                      val: {
                        i128: "0",
                      },
                    },
                  },
                  ext: "v0",
                },
              },
              {
                created: {
                  last_modified_ledger_seq: 60080657,
                  data: {
                    contract_data: {
                      ext: "v0",
                      contract:
                        "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
                      key: {
                        symbol: "ACT_POOL",
                      },
                      durability: "persistent",
                      val: {
                        address:
                          "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
                      },
                    },
                  },
                  ext: "v0",
                },
              },
              {
                created: {
                  last_modified_ledger_seq: 60080657,
                  data: {
                    contract_data: {
                      ext: "v0",
                      contract:
                        "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
                      key: {
                        symbol: "ACT_ROUT",
                      },
                      durability: "persistent",
                      val: {
                        address:
                          "CAG5LRYQ5JVEUI5TEID72EYOVX44TTUJT5BQR2J6J77FH65PCCFAJDDH",
                      },
                    },
                  },
                  ext: "v0",
                },
              },
              {
                created: {
                  last_modified_ledger_seq: 60080657,
                  data: {
                    ttl: {
                      key_hash:
                        "1666bb1c8519301a7f2693fdcbaf38e7e36ad5a694eb2c70ea1405200db243aa",
                      live_until_ledger_seq: 62154256,
                    },
                  },
                  ext: "v0",
                },
              },
            ],
            events: [
              {
                ext: "v0",
                contract_id:
                  "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                type_: "contract",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "transfer",
                      },
                      {
                        address:
                          "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
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
                      i128: "3000000",
                    },
                  },
                },
              },
              {
                ext: "v0",
                contract_id:
                  "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
                type_: "contract",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "transfer",
                      },
                      {
                        address:
                          "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
                      },
                      {
                        address:
                          "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
                      },
                      {
                        string:
                          "USDC:GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN",
                      },
                    ],
                    data: {
                      i128: "756555",
                    },
                  },
                },
              },
              {
                ext: "v0",
                contract_id:
                  "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
                type_: "contract",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "mint",
                      },
                      {
                        address:
                          "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
                      },
                      {
                        address:
                          "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
                      },
                    ],
                    data: {
                      i128: "1368329",
                    },
                  },
                },
              },
              {
                ext: "v0",
                contract_id:
                  "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
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
                            i128: "4283912832794",
                          },
                        },
                        {
                          key: {
                            symbol: "new_reserve_1",
                          },
                          val: {
                            i128: "1080339621425",
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
                  "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
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
                            i128: "3000000",
                          },
                        },
                        {
                          key: {
                            symbol: "amount_1",
                          },
                          val: {
                            i128: "756555",
                          },
                        },
                        {
                          key: {
                            symbol: "liquidity",
                          },
                          val: {
                            i128: "1368329",
                          },
                        },
                        {
                          key: {
                            symbol: "new_reserve_0",
                          },
                          val: {
                            i128: "4283912832794",
                          },
                        },
                        {
                          key: {
                            symbol: "new_reserve_1",
                          },
                          val: {
                            i128: "1080339621425",
                          },
                        },
                        {
                          key: {
                            symbol: "to",
                          },
                          val: {
                            address:
                              "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
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
                  "CAG5LRYQ5JVEUI5TEID72EYOVX44TTUJT5BQR2J6J77FH65PCCFAJDDH",
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
                            i128: "3000000",
                          },
                        },
                        {
                          key: {
                            symbol: "amount_b",
                          },
                          val: {
                            i128: "756555",
                          },
                        },
                        {
                          key: {
                            symbol: "liquidity",
                          },
                          val: {
                            i128: "1368329",
                          },
                        },
                        {
                          key: {
                            symbol: "pair",
                          },
                          val: {
                            address:
                              "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
                          },
                        },
                        {
                          key: {
                            symbol: "to",
                          },
                          val: {
                            address:
                              "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
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
                              "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
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
                  "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
                type_: "contract",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "add_liq_soro",
                      },
                      {
                        address:
                          "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
                      },
                    ],
                    data: {
                      vec: [
                        {
                          i128: "1368329",
                        },
                        {
                          i128: "3000000",
                        },
                        {
                          i128: "756555",
                        },
                      ],
                    },
                  },
                },
              },
            ],
          },
        ],
        tx_changes_after: [],
        soroban_meta: {
          ext: {
            v1: {
              ext: "v0",
              total_non_refundable_resource_fee_charged: "257128",
              total_refundable_resource_fee_charged: "2124694",
              rent_fee_charged: "2107701",
            },
          },
          return_value: "void",
        },
        events: [
          {
            stage: "before_all_txs",
            event: {
              ext: "v0",
              contract_id:
                "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
              type_: "contract",
              body: {
                v0: {
                  topics: [
                    {
                      symbol: "fee",
                    },
                    {
                      address:
                        "GC6O7PZQBDBJRIZELR2ODM2HV56ZM37F6PRBX5ZE5H7VZJGMQVBB3CLE",
                    },
                  ],
                  data: {
                    i128: "2738969",
                  },
                },
              },
            },
          },
          {
            stage: "after_all_txs",
            event: {
              ext: "v0",
              contract_id:
                "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
              type_: "contract",
              body: {
                v0: {
                  topics: [
                    {
                      symbol: "fee",
                    },
                    {
                      address:
                        "GC6O7PZQBDBJRIZELR2ODM2HV56ZM37F6PRBX5ZE5H7VZJGMQVBB3CLE",
                    },
                  ],
                  data: {
                    i128: "-357047",
                  },
                },
              },
            },
          },
        ],
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
                        "11054467f145522bf15f099efdf1d386fb0b0a3ad2ad1023850f71d5b3158ab3",
                    },
                    {
                      symbol: "add_liquidity_soroswap",
                    },
                  ],
                  data: {
                    vec: [
                      {
                        address:
                          "CCNHYCMBEZFWDRYMWHWB52MRCRLFEORSOK5QYWUZXYSLFKQSO2PRWYYZ",
                      },
                      {
                        i128: "3000000",
                      },
                      {
                        i128: "3000000",
                      },
                      {
                        i128: "5",
                      },
                      {
                        i128: "5",
                      },
                      {
                        u64: "99999999999",
                      },
                      {
                        address:
                          "CAG5LRYQ5JVEUI5TEID72EYOVX44TTUJT5BQR2J6J77FH65PCCFAJDDH",
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
                "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
              type_: "diagnostic",
              body: {
                v0: {
                  topics: [
                    {
                      symbol: "fn_call",
                    },
                    {
                      bytes:
                        "9a7c0981264b61c70cb1ec1ee9911456523a3272bb0c5a99be24b2aa12769f1b",
                    },
                    {
                      symbol: "__check_auth",
                    },
                  ],
                  data: {
                    vec: [
                      {
                        bytes:
                          "2d9b6736f15ce50730b1a127136621a5a0da91b3574ca3c9c66648d3db9708af",
                      },
                      {
                        vec: [
                          {
                            map: [
                              {
                                key: {
                                  symbol: "public_key",
                                },
                                val: {
                                  bytes:
                                    "b7e37226700e891a1450ea10c897f6c9aa9d868a76dc1f2fc183eea19389c51e",
                                },
                              },
                              {
                                key: {
                                  symbol: "signature",
                                },
                                val: {
                                  bytes:
                                    "38bd2ead4b8f512c3fadf09eb3318601c9429187c0bb3d32822f38076295a7b80a5f31cfaaccf392bffc98579342ab9a0b3fe4b28082ddbdcb8213a3c68f8105",
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
                                            "CCNHYCMBEZFWDRYMWHWB52MRCRLFEORSOK5QYWUZXYSLFKQSO2PRWYYZ",
                                        },
                                        {
                                          i128: "3000000",
                                        },
                                        {
                                          i128: "3000000",
                                        },
                                        {
                                          i128: "5",
                                        },
                                        {
                                          i128: "5",
                                        },
                                        {
                                          u64: "99999999999",
                                        },
                                        {
                                          address:
                                            "CAG5LRYQ5JVEUI5TEID72EYOVX44TTUJT5BQR2J6J77FH65PCCFAJDDH",
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
                                        "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
                                    },
                                  },
                                  {
                                    key: {
                                      symbol: "fn_name",
                                    },
                                    val: {
                                      symbol: "add_liquidity_soroswap",
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
            in_successful_contract_call: true,
            event: {
              ext: "v0",
              contract_id:
                "CCNHYCMBEZFWDRYMWHWB52MRCRLFEORSOK5QYWUZXYSLFKQSO2PRWYYZ",
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
            in_successful_contract_call: true,
            event: {
              ext: "v0",
              contract_id:
                "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
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
                      symbol: "router_pair_for",
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
                "CAG5LRYQ5JVEUI5TEID72EYOVX44TTUJT5BQR2J6J77FH65PCCFAJDDH",
              type_: "diagnostic",
              body: {
                v0: {
                  topics: [
                    {
                      symbol: "fn_return",
                    },
                    {
                      symbol: "router_pair_for",
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
                "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
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
                      symbol: "token_0",
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
                "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
              type_: "diagnostic",
              body: {
                v0: {
                  topics: [
                    {
                      symbol: "fn_return",
                    },
                    {
                      symbol: "token_0",
                    },
                  ],
                  data: {
                    address:
                      "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
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
                "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
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
                "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
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
                        i128: "4283909832794",
                      },
                      {
                        i128: "1080338864870",
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
                "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
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
                      symbol: "quote",
                    },
                  ],
                  data: {
                    vec: [
                      {
                        i128: "3000000",
                      },
                      {
                        i128: "4283909832794",
                      },
                      {
                        i128: "1080338864870",
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
                "CAG5LRYQ5JVEUI5TEID72EYOVX44TTUJT5BQR2J6J77FH65PCCFAJDDH",
              type_: "diagnostic",
              body: {
                v0: {
                  topics: [
                    {
                      symbol: "fn_return",
                    },
                    {
                      symbol: "quote",
                    },
                  ],
                  data: {
                    i128: "756555",
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
                "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
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
                      symbol: "quote",
                    },
                  ],
                  data: {
                    vec: [
                      {
                        i128: "3000000",
                      },
                      {
                        i128: "1080338864870",
                      },
                      {
                        i128: "4283909832794",
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
                "CAG5LRYQ5JVEUI5TEID72EYOVX44TTUJT5BQR2J6J77FH65PCCFAJDDH",
              type_: "diagnostic",
              body: {
                v0: {
                  topics: [
                    {
                      symbol: "fn_return",
                    },
                    {
                      symbol: "quote",
                    },
                  ],
                  data: {
                    i128: "11896016",
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
                "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
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
                          "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
                      },
                      {
                        i128: "3000000",
                      },
                      {
                        i128: "3000000",
                      },
                      {
                        i128: "5",
                      },
                      {
                        i128: "5",
                      },
                      {
                        address:
                          "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
                      },
                      {
                        u64: "99999999999",
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
                "CAG5LRYQ5JVEUI5TEID72EYOVX44TTUJT5BQR2J6J77FH65PCCFAJDDH",
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
                "CA4HEQTL2WPEUYKYKCDOHCDNIV4QHNJ7EL4J4NQ6VADP7SYHVRYZ7AW2",
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
                "CAG5LRYQ5JVEUI5TEID72EYOVX44TTUJT5BQR2J6J77FH65PCCFAJDDH",
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
                "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
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
                        i128: "4283909832794",
                      },
                      {
                        i128: "1080338864870",
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
                "CAG5LRYQ5JVEUI5TEID72EYOVX44TTUJT5BQR2J6J77FH65PCCFAJDDH",
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
                          "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
                      },
                      {
                        address:
                          "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
                      },
                      {
                        i128: "3000000",
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
                "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
              type_: "contract",
              body: {
                v0: {
                  topics: [
                    {
                      symbol: "transfer",
                    },
                    {
                      address:
                        "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
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
                    i128: "3000000",
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
                "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
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
                "CAG5LRYQ5JVEUI5TEID72EYOVX44TTUJT5BQR2J6J77FH65PCCFAJDDH",
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
                          "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
                      },
                      {
                        address:
                          "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
                      },
                      {
                        i128: "756555",
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
                "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
              type_: "contract",
              body: {
                v0: {
                  topics: [
                    {
                      symbol: "transfer",
                    },
                    {
                      address:
                        "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
                    },
                    {
                      address:
                        "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
                    },
                    {
                      string:
                        "USDC:GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN",
                    },
                  ],
                  data: {
                    i128: "756555",
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
                "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
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
                "CAG5LRYQ5JVEUI5TEID72EYOVX44TTUJT5BQR2J6J77FH65PCCFAJDDH",
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
                      symbol: "deposit",
                    },
                  ],
                  data: {
                    address:
                      "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
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
                "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
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
                "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
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
                    i128: "4283912832794",
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
                "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
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
                "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
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
                    i128: "1080339621425",
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
                "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
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
                "CA4HEQTL2WPEUYKYKCDOHCDNIV4QHNJ7EL4J4NQ6VADP7SYHVRYZ7AW2",
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
                "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
              type_: "contract",
              body: {
                v0: {
                  topics: [
                    {
                      symbol: "mint",
                    },
                    {
                      address:
                        "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
                    },
                    {
                      address:
                        "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
                    },
                  ],
                  data: {
                    i128: "1368329",
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
                "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
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
                          i128: "4283912832794",
                        },
                      },
                      {
                        key: {
                          symbol: "new_reserve_1",
                        },
                        val: {
                          i128: "1080339621425",
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
                "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
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
                          i128: "3000000",
                        },
                      },
                      {
                        key: {
                          symbol: "amount_1",
                        },
                        val: {
                          i128: "756555",
                        },
                      },
                      {
                        key: {
                          symbol: "liquidity",
                        },
                        val: {
                          i128: "1368329",
                        },
                      },
                      {
                        key: {
                          symbol: "new_reserve_0",
                        },
                        val: {
                          i128: "4283912832794",
                        },
                      },
                      {
                        key: {
                          symbol: "new_reserve_1",
                        },
                        val: {
                          i128: "1080339621425",
                        },
                      },
                      {
                        key: {
                          symbol: "to",
                        },
                        val: {
                          address:
                            "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
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
                "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
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
                    i128: "1368329",
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
                "CAG5LRYQ5JVEUI5TEID72EYOVX44TTUJT5BQR2J6J77FH65PCCFAJDDH",
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
                          i128: "3000000",
                        },
                      },
                      {
                        key: {
                          symbol: "amount_b",
                        },
                        val: {
                          i128: "756555",
                        },
                      },
                      {
                        key: {
                          symbol: "liquidity",
                        },
                        val: {
                          i128: "1368329",
                        },
                      },
                      {
                        key: {
                          symbol: "pair",
                        },
                        val: {
                          address:
                            "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
                        },
                      },
                      {
                        key: {
                          symbol: "to",
                        },
                        val: {
                          address:
                            "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
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
                "CAG5LRYQ5JVEUI5TEID72EYOVX44TTUJT5BQR2J6J77FH65PCCFAJDDH",
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
                        i128: "3000000",
                      },
                      {
                        i128: "756555",
                      },
                      {
                        i128: "1368329",
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
                "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
              type_: "contract",
              body: {
                v0: {
                  topics: [
                    {
                      symbol: "add_liq_soro",
                    },
                    {
                      address:
                        "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
                    },
                  ],
                  data: {
                    vec: [
                      {
                        i128: "1368329",
                      },
                      {
                        i128: "3000000",
                      },
                      {
                        i128: "756555",
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
                "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
              type_: "diagnostic",
              body: {
                v0: {
                  topics: [
                    {
                      symbol: "fn_return",
                    },
                    {
                      symbol: "add_liquidity_soroswap",
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
                    u64: "32",
                  },
                },
              },
            },
          },
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
                      symbol: "core_metrics",
                    },
                    {
                      symbol: "write_entry",
                    },
                  ],
                  data: {
                    u64: "16",
                  },
                },
              },
            },
          },
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
                      symbol: "core_metrics",
                    },
                    {
                      symbol: "ledger_read_byte",
                    },
                  ],
                  data: {
                    u64: "0",
                  },
                },
              },
            },
          },
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
                      symbol: "core_metrics",
                    },
                    {
                      symbol: "ledger_write_byte",
                    },
                  ],
                  data: {
                    u64: "2480",
                  },
                },
              },
            },
          },
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
                      symbol: "core_metrics",
                    },
                    {
                      symbol: "read_key_byte",
                    },
                  ],
                  data: {
                    u64: "0",
                  },
                },
              },
            },
          },
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
                      symbol: "core_metrics",
                    },
                    {
                      symbol: "write_key_byte",
                    },
                  ],
                  data: {
                    u64: "0",
                  },
                },
              },
            },
          },
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
                      symbol: "core_metrics",
                    },
                    {
                      symbol: "read_data_byte",
                    },
                  ],
                  data: {
                    u64: "0",
                  },
                },
              },
            },
          },
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
                      symbol: "core_metrics",
                    },
                    {
                      symbol: "write_data_byte",
                    },
                  ],
                  data: {
                    u64: "2480",
                  },
                },
              },
            },
          },
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
                      symbol: "core_metrics",
                    },
                    {
                      symbol: "read_code_byte",
                    },
                  ],
                  data: {
                    u64: "0",
                  },
                },
              },
            },
          },
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
                      symbol: "core_metrics",
                    },
                    {
                      symbol: "write_code_byte",
                    },
                  ],
                  data: {
                    u64: "0",
                  },
                },
              },
            },
          },
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
                      symbol: "core_metrics",
                    },
                    {
                      symbol: "emit_event",
                    },
                  ],
                  data: {
                    u64: "7",
                  },
                },
              },
            },
          },
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
                      symbol: "core_metrics",
                    },
                    {
                      symbol: "emit_event_byte",
                    },
                  ],
                  data: {
                    u64: "1740",
                  },
                },
              },
            },
          },
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
                      symbol: "core_metrics",
                    },
                    {
                      symbol: "cpu_insn",
                    },
                  ],
                  data: {
                    u64: "11596099",
                  },
                },
              },
            },
          },
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
                      symbol: "core_metrics",
                    },
                    {
                      symbol: "mem_byte",
                    },
                  ],
                  data: {
                    u64: "18931120",
                  },
                },
              },
            },
          },
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
                      symbol: "core_metrics",
                    },
                    {
                      symbol: "invoke_time_nsecs",
                    },
                  ],
                  data: {
                    u64: "3285341",
                  },
                },
              },
            },
          },
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
                      symbol: "core_metrics",
                    },
                    {
                      symbol: "max_rw_key_byte",
                    },
                  ],
                  data: {
                    u64: "112",
                  },
                },
              },
            },
          },
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
                      symbol: "core_metrics",
                    },
                    {
                      symbol: "max_rw_data_byte",
                    },
                  ],
                  data: {
                    u64: "512",
                  },
                },
              },
            },
          },
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
                      symbol: "core_metrics",
                    },
                    {
                      symbol: "max_rw_code_byte",
                    },
                  ],
                  data: {
                    u64: "0",
                  },
                },
              },
            },
          },
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
                      symbol: "core_metrics",
                    },
                    {
                      symbol: "max_emit_event_byte",
                    },
                  ],
                  data: {
                    u64: "428",
                  },
                },
              },
            },
          },
        ],
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
                    "11054467f145522bf15f099efdf1d386fb0b0a3ad2ad1023850f71d5b3158ab3",
                },
                {
                  symbol: "add_liquidity_soroswap",
                },
              ],
              data: {
                vec: [
                  {
                    address:
                      "CCNHYCMBEZFWDRYMWHWB52MRCRLFEORSOK5QYWUZXYSLFKQSO2PRWYYZ",
                  },
                  {
                    i128: "3000000",
                  },
                  {
                    i128: "3000000",
                  },
                  {
                    i128: "5",
                  },
                  {
                    i128: "5",
                  },
                  {
                    u64: "99999999999",
                  },
                  {
                    address:
                      "CAG5LRYQ5JVEUI5TEID72EYOVX44TTUJT5BQR2J6J77FH65PCCFAJDDH",
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
            "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_call",
                },
                {
                  bytes:
                    "9a7c0981264b61c70cb1ec1ee9911456523a3272bb0c5a99be24b2aa12769f1b",
                },
                {
                  symbol: "__check_auth",
                },
              ],
              data: {
                vec: [
                  {
                    bytes:
                      "2d9b6736f15ce50730b1a127136621a5a0da91b3574ca3c9c66648d3db9708af",
                  },
                  {
                    vec: [
                      {
                        map: [
                          {
                            key: {
                              symbol: "public_key",
                            },
                            val: {
                              bytes:
                                "b7e37226700e891a1450ea10c897f6c9aa9d868a76dc1f2fc183eea19389c51e",
                            },
                          },
                          {
                            key: {
                              symbol: "signature",
                            },
                            val: {
                              bytes:
                                "38bd2ead4b8f512c3fadf09eb3318601c9429187c0bb3d32822f38076295a7b80a5f31cfaaccf392bffc98579342ab9a0b3fe4b28082ddbdcb8213a3c68f8105",
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
                                        "CCNHYCMBEZFWDRYMWHWB52MRCRLFEORSOK5QYWUZXYSLFKQSO2PRWYYZ",
                                    },
                                    {
                                      i128: "3000000",
                                    },
                                    {
                                      i128: "3000000",
                                    },
                                    {
                                      i128: "5",
                                    },
                                    {
                                      i128: "5",
                                    },
                                    {
                                      u64: "99999999999",
                                    },
                                    {
                                      address:
                                        "CAG5LRYQ5JVEUI5TEID72EYOVX44TTUJT5BQR2J6J77FH65PCCFAJDDH",
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
                                    "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
                                },
                              },
                              {
                                key: {
                                  symbol: "fn_name",
                                },
                                val: {
                                  symbol: "add_liquidity_soroswap",
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
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "CCNHYCMBEZFWDRYMWHWB52MRCRLFEORSOK5QYWUZXYSLFKQSO2PRWYYZ",
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
        in_successful_contract_call: true,
        event: {
          ext: "v0",
          contract_id:
            "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
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
                  symbol: "router_pair_for",
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
            "CAG5LRYQ5JVEUI5TEID72EYOVX44TTUJT5BQR2J6J77FH65PCCFAJDDH",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_return",
                },
                {
                  symbol: "router_pair_for",
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
            "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
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
                  symbol: "token_0",
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
            "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_return",
                },
                {
                  symbol: "token_0",
                },
              ],
              data: {
                address:
                  "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
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
            "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
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
            "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
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
                    i128: "4283909832794",
                  },
                  {
                    i128: "1080338864870",
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
            "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
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
                  symbol: "quote",
                },
              ],
              data: {
                vec: [
                  {
                    i128: "3000000",
                  },
                  {
                    i128: "4283909832794",
                  },
                  {
                    i128: "1080338864870",
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
            "CAG5LRYQ5JVEUI5TEID72EYOVX44TTUJT5BQR2J6J77FH65PCCFAJDDH",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_return",
                },
                {
                  symbol: "quote",
                },
              ],
              data: {
                i128: "756555",
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
            "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
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
                  symbol: "quote",
                },
              ],
              data: {
                vec: [
                  {
                    i128: "3000000",
                  },
                  {
                    i128: "1080338864870",
                  },
                  {
                    i128: "4283909832794",
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
            "CAG5LRYQ5JVEUI5TEID72EYOVX44TTUJT5BQR2J6J77FH65PCCFAJDDH",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_return",
                },
                {
                  symbol: "quote",
                },
              ],
              data: {
                i128: "11896016",
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
            "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
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
                      "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
                  },
                  {
                    i128: "3000000",
                  },
                  {
                    i128: "3000000",
                  },
                  {
                    i128: "5",
                  },
                  {
                    i128: "5",
                  },
                  {
                    address:
                      "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
                  },
                  {
                    u64: "99999999999",
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
            "CAG5LRYQ5JVEUI5TEID72EYOVX44TTUJT5BQR2J6J77FH65PCCFAJDDH",
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
            "CA4HEQTL2WPEUYKYKCDOHCDNIV4QHNJ7EL4J4NQ6VADP7SYHVRYZ7AW2",
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
            "CAG5LRYQ5JVEUI5TEID72EYOVX44TTUJT5BQR2J6J77FH65PCCFAJDDH",
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
            "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
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
                    i128: "4283909832794",
                  },
                  {
                    i128: "1080338864870",
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
            "CAG5LRYQ5JVEUI5TEID72EYOVX44TTUJT5BQR2J6J77FH65PCCFAJDDH",
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
                      "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
                  },
                  {
                    address:
                      "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
                  },
                  {
                    i128: "3000000",
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
            "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
          type_: "contract",
          body: {
            v0: {
              topics: [
                {
                  symbol: "transfer",
                },
                {
                  address:
                    "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
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
                i128: "3000000",
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
            "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
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
            "CAG5LRYQ5JVEUI5TEID72EYOVX44TTUJT5BQR2J6J77FH65PCCFAJDDH",
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
                      "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
                  },
                  {
                    address:
                      "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
                  },
                  {
                    i128: "756555",
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
            "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
          type_: "contract",
          body: {
            v0: {
              topics: [
                {
                  symbol: "transfer",
                },
                {
                  address:
                    "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
                },
                {
                  address:
                    "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
                },
                {
                  string:
                    "USDC:GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN",
                },
              ],
              data: {
                i128: "756555",
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
            "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
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
            "CAG5LRYQ5JVEUI5TEID72EYOVX44TTUJT5BQR2J6J77FH65PCCFAJDDH",
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
                  symbol: "deposit",
                },
              ],
              data: {
                address:
                  "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
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
            "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
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
            "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
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
                i128: "4283912832794",
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
            "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
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
            "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
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
                i128: "1080339621425",
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
            "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
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
            "CA4HEQTL2WPEUYKYKCDOHCDNIV4QHNJ7EL4J4NQ6VADP7SYHVRYZ7AW2",
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
            "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
          type_: "contract",
          body: {
            v0: {
              topics: [
                {
                  symbol: "mint",
                },
                {
                  address:
                    "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
                },
                {
                  address:
                    "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
                },
              ],
              data: {
                i128: "1368329",
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
            "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
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
                      i128: "4283912832794",
                    },
                  },
                  {
                    key: {
                      symbol: "new_reserve_1",
                    },
                    val: {
                      i128: "1080339621425",
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
            "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
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
                      i128: "3000000",
                    },
                  },
                  {
                    key: {
                      symbol: "amount_1",
                    },
                    val: {
                      i128: "756555",
                    },
                  },
                  {
                    key: {
                      symbol: "liquidity",
                    },
                    val: {
                      i128: "1368329",
                    },
                  },
                  {
                    key: {
                      symbol: "new_reserve_0",
                    },
                    val: {
                      i128: "4283912832794",
                    },
                  },
                  {
                    key: {
                      symbol: "new_reserve_1",
                    },
                    val: {
                      i128: "1080339621425",
                    },
                  },
                  {
                    key: {
                      symbol: "to",
                    },
                    val: {
                      address:
                        "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
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
            "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
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
                i128: "1368329",
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
            "CAG5LRYQ5JVEUI5TEID72EYOVX44TTUJT5BQR2J6J77FH65PCCFAJDDH",
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
                      i128: "3000000",
                    },
                  },
                  {
                    key: {
                      symbol: "amount_b",
                    },
                    val: {
                      i128: "756555",
                    },
                  },
                  {
                    key: {
                      symbol: "liquidity",
                    },
                    val: {
                      i128: "1368329",
                    },
                  },
                  {
                    key: {
                      symbol: "pair",
                    },
                    val: {
                      address:
                        "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
                    },
                  },
                  {
                    key: {
                      symbol: "to",
                    },
                    val: {
                      address:
                        "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
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
            "CAG5LRYQ5JVEUI5TEID72EYOVX44TTUJT5BQR2J6J77FH65PCCFAJDDH",
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
                    i128: "3000000",
                  },
                  {
                    i128: "756555",
                  },
                  {
                    i128: "1368329",
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
            "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
          type_: "contract",
          body: {
            v0: {
              topics: [
                {
                  symbol: "add_liq_soro",
                },
                {
                  address:
                    "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
                },
              ],
              data: {
                vec: [
                  {
                    i128: "1368329",
                  },
                  {
                    i128: "3000000",
                  },
                  {
                    i128: "756555",
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
            "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
          type_: "diagnostic",
          body: {
            v0: {
              topics: [
                {
                  symbol: "fn_return",
                },
                {
                  symbol: "add_liquidity_soroswap",
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
                u64: "32",
              },
            },
          },
        },
      },
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "write_entry",
                },
              ],
              data: {
                u64: "16",
              },
            },
          },
        },
      },
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "ledger_read_byte",
                },
              ],
              data: {
                u64: "0",
              },
            },
          },
        },
      },
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "ledger_write_byte",
                },
              ],
              data: {
                u64: "2480",
              },
            },
          },
        },
      },
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "read_key_byte",
                },
              ],
              data: {
                u64: "0",
              },
            },
          },
        },
      },
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "write_key_byte",
                },
              ],
              data: {
                u64: "0",
              },
            },
          },
        },
      },
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "read_data_byte",
                },
              ],
              data: {
                u64: "0",
              },
            },
          },
        },
      },
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "write_data_byte",
                },
              ],
              data: {
                u64: "2480",
              },
            },
          },
        },
      },
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "read_code_byte",
                },
              ],
              data: {
                u64: "0",
              },
            },
          },
        },
      },
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "write_code_byte",
                },
              ],
              data: {
                u64: "0",
              },
            },
          },
        },
      },
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "emit_event",
                },
              ],
              data: {
                u64: "7",
              },
            },
          },
        },
      },
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "emit_event_byte",
                },
              ],
              data: {
                u64: "1740",
              },
            },
          },
        },
      },
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "cpu_insn",
                },
              ],
              data: {
                u64: "11596099",
              },
            },
          },
        },
      },
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "mem_byte",
                },
              ],
              data: {
                u64: "18931120",
              },
            },
          },
        },
      },
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "invoke_time_nsecs",
                },
              ],
              data: {
                u64: "3285341",
              },
            },
          },
        },
      },
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "max_rw_key_byte",
                },
              ],
              data: {
                u64: "112",
              },
            },
          },
        },
      },
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "max_rw_data_byte",
                },
              ],
              data: {
                u64: "512",
              },
            },
          },
        },
      },
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "max_rw_code_byte",
                },
              ],
              data: {
                u64: "0",
              },
            },
          },
        },
      },
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
                  symbol: "core_metrics",
                },
                {
                  symbol: "max_emit_event_byte",
                },
              ],
              data: {
                u64: "428",
              },
            },
          },
        },
      },
    ],
    events: {
      transactionEventsJson: [
        {
          stage: "before_all_txs",
          event: {
            ext: "v0",
            contract_id:
              "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
            type_: "contract",
            body: {
              v0: {
                topics: [
                  {
                    symbol: "fee",
                  },
                  {
                    address:
                      "GC6O7PZQBDBJRIZELR2ODM2HV56ZM37F6PRBX5ZE5H7VZJGMQVBB3CLE",
                  },
                ],
                data: {
                  i128: "2738969",
                },
              },
            },
          },
        },
        {
          stage: "after_all_txs",
          event: {
            ext: "v0",
            contract_id:
              "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
            type_: "contract",
            body: {
              v0: {
                topics: [
                  {
                    symbol: "fee",
                  },
                  {
                    address:
                      "GC6O7PZQBDBJRIZELR2ODM2HV56ZM37F6PRBX5ZE5H7VZJGMQVBB3CLE",
                  },
                ],
                data: {
                  i128: "-357047",
                },
              },
            },
          },
        },
      ],
      contractEventsJson: [
        [
          {
            ext: "v0",
            contract_id:
              "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
            type_: "contract",
            body: {
              v0: {
                topics: [
                  {
                    symbol: "transfer",
                  },
                  {
                    address:
                      "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
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
                  i128: "3000000",
                },
              },
            },
          },
          {
            ext: "v0",
            contract_id:
              "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
            type_: "contract",
            body: {
              v0: {
                topics: [
                  {
                    symbol: "transfer",
                  },
                  {
                    address:
                      "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
                  },
                  {
                    address:
                      "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
                  },
                  {
                    string:
                      "USDC:GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN",
                  },
                ],
                data: {
                  i128: "756555",
                },
              },
            },
          },
          {
            ext: "v0",
            contract_id:
              "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
            type_: "contract",
            body: {
              v0: {
                topics: [
                  {
                    symbol: "mint",
                  },
                  {
                    address:
                      "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
                  },
                  {
                    address:
                      "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
                  },
                ],
                data: {
                  i128: "1368329",
                },
              },
            },
          },
          {
            ext: "v0",
            contract_id:
              "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
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
                        i128: "4283912832794",
                      },
                    },
                    {
                      key: {
                        symbol: "new_reserve_1",
                      },
                      val: {
                        i128: "1080339621425",
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
              "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
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
                        i128: "3000000",
                      },
                    },
                    {
                      key: {
                        symbol: "amount_1",
                      },
                      val: {
                        i128: "756555",
                      },
                    },
                    {
                      key: {
                        symbol: "liquidity",
                      },
                      val: {
                        i128: "1368329",
                      },
                    },
                    {
                      key: {
                        symbol: "new_reserve_0",
                      },
                      val: {
                        i128: "4283912832794",
                      },
                    },
                    {
                      key: {
                        symbol: "new_reserve_1",
                      },
                      val: {
                        i128: "1080339621425",
                      },
                    },
                    {
                      key: {
                        symbol: "to",
                      },
                      val: {
                        address:
                          "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
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
              "CAG5LRYQ5JVEUI5TEID72EYOVX44TTUJT5BQR2J6J77FH65PCCFAJDDH",
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
                        i128: "3000000",
                      },
                    },
                    {
                      key: {
                        symbol: "amount_b",
                      },
                      val: {
                        i128: "756555",
                      },
                    },
                    {
                      key: {
                        symbol: "liquidity",
                      },
                      val: {
                        i128: "1368329",
                      },
                    },
                    {
                      key: {
                        symbol: "pair",
                      },
                      val: {
                        address:
                          "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
                      },
                    },
                    {
                      key: {
                        symbol: "to",
                      },
                      val: {
                        address:
                          "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
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
                          "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
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
              "CAIQKRDH6FCVEK7RL4EZ57PR2ODPWCYKHLJK2EBDQUHXDVNTCWFLHAJB",
            type_: "contract",
            body: {
              v0: {
                topics: [
                  {
                    symbol: "add_liq_soro",
                  },
                  {
                    address:
                      "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP",
                  },
                ],
                data: {
                  vec: [
                    {
                      i128: "1368329",
                    },
                    {
                      i128: "3000000",
                    },
                    {
                      i128: "756555",
                    },
                  ],
                },
              },
            },
          },
        ],
      ],
    },
    ledger: 60080657,
    createdAt: "1764472927",
  },
};

export const TX_EVENTS_MOCK_KALE = {
  jsonrpc: "2.0",
  id: 1,
  result: {
    latestLedger: 60103635,
    latestLedgerCloseTime: "1764603521",
    oldestLedger: 59982676,
    oldestLedgerCloseTime: "1763912339",
    status: "SUCCESS",
    txHash: "d07e08d7db490ceede38e7038e2a8b018094b4d4e989e76a3b27dbce03c25889",
    applicationOrder: 218,
    feeBump: true,
    envelopeJson: {
      tx_fee_bump: {
        tx: {
          fee_source:
            "GBGWQFSJSOMJ2BTOH5RLZUTZPV544YR2DF5CGYL7WDZ2Y6OSRHR6TUBE",
          fee: "128322",
          inner_tx: {
            tx: {
              tx: {
                source_account:
                  "GCMF6AASWZBXLR7G56KBX3MXERMB7Y7GPQIGWOQ32BFDVJQN3GGI7RZP",
                fee: 128121,
                seq_num: "230853293864421695",
                cond: {
                  time: {
                    min_time: "0",
                    max_time: "1764103118",
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
                                  "GD3GENKSPTIIEOXESQQPF6OZSWE3DANMPBKWEK3PVG6GVILRQ5RCWLKD",
                              },
                              {
                                vec: [
                                  {
                                    u32: 102933,
                                  },
                                  {
                                    u32: 102934,
                                  },
                                  {
                                    u32: 102935,
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
                                    u32: 102933,
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
                                    u32: 102934,
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
                                    u32: 102935,
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
                                "GD3GENKSPTIIEOXESQQPF6OZSWE3DANMPBKWEK3PVG6GVILRQ5RCWLKD",
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
                                      "GD3GENKSPTIIEOXESQQPF6OZSWE3DANMPBKWEK3PVG6GVILRQ5RCWLKD",
                                  },
                                  {
                                    u32: 102933,
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
                                      "GD3GENKSPTIIEOXESQQPF6OZSWE3DANMPBKWEK3PVG6GVILRQ5RCWLKD",
                                  },
                                  {
                                    u32: 102934,
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
                                      "GD3GENKSPTIIEOXESQQPF6OZSWE3DANMPBKWEK3PVG6GVILRQ5RCWLKD",
                                  },
                                  {
                                    u32: 102935,
                                  },
                                ],
                              },
                              durability: "temporary",
                            },
                          },
                        ],
                      },
                      instructions: 3560754,
                      disk_read_bytes: 116,
                      write_bytes: 116,
                    },
                    resource_fee: "128121",
                  },
                },
              },
              signatures: [
                {
                  hint: "0dd98c8f",
                  signature:
                    "c9a3c88f8f4c1ec6699d73d5852242c44dd9de5154f8f77db18466f6098f12a5936307c4ff324342caf95c03ee0fe0bfd1f936fbfdfdb2802204f21c7eefbd0e",
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
              "1f3a47ee31b93a2194c1dc4658524d8df0527bfe6c24246acc40bccca7cecb8af3d805d33f797fc9a49113188fc980b098c9ddc00d9b8e9db13eaa7cc54f8203",
          },
        ],
      },
    },
    resultJson: {},
    resultMetaJson: {},
    diagnosticEventsJson: [],
    events: {
      transactionEventsJson: [
        {
          stage: "before_all_txs",
          event: {
            ext: "v0",
            contract_id:
              "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
            type_: "contract",
            body: {
              v0: {
                topics: [
                  {
                    symbol: "fee",
                  },
                  {
                    address:
                      "GBGWQFSJSOMJ2BTOH5RLZUTZPV544YR2DF5CGYL7WDZ2Y6OSRHR6TUBE",
                  },
                ],
                data: {
                  i128: "128321",
                },
              },
            },
          },
        },
        {
          stage: "after_all_txs",
          event: {
            ext: "v0",
            contract_id:
              "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
            type_: "contract",
            body: {
              v0: {
                topics: [
                  {
                    symbol: "fee",
                  },
                  {
                    address:
                      "GBGWQFSJSOMJ2BTOH5RLZUTZPV544YR2DF5CGYL7WDZ2Y6OSRHR6TUBE",
                  },
                ],
                data: {
                  i128: "-39423",
                },
              },
            },
          },
        },
      ],
      contractEventsJson: [
        [
          {
            ext: "v0",
            contract_id:
              "CB23WRDQWGSP6YPMY4UV5C4OW5CBTXKYN3XEATG7KJEZCXMJBYEHOUOV",
            type_: "contract",
            body: {
              v0: {
                topics: [
                  {
                    symbol: "mint",
                  },
                  {
                    address:
                      "GD3GENKSPTIIEOXESQQPF6OZSWE3DANMPBKWEK3PVG6GVILRQ5RCWLKD",
                  },
                  {
                    string:
                      "KALE:GBDVX4VELCDSQ54KQJYTNHXAHFLBCA77ZY2USQBM4CSHTTV7DME7KALE",
                  },
                ],
                data: {
                  i128: "29814773",
                },
              },
            },
          },
          {
            ext: "v0",
            contract_id:
              "CB23WRDQWGSP6YPMY4UV5C4OW5CBTXKYN3XEATG7KJEZCXMJBYEHOUOV",
            type_: "contract",
            body: {
              v0: {
                topics: [
                  {
                    symbol: "mint",
                  },
                  {
                    address:
                      "GD3GENKSPTIIEOXESQQPF6OZSWE3DANMPBKWEK3PVG6GVILRQ5RCWLKD",
                  },
                  {
                    string:
                      "KALE:GBDVX4VELCDSQ54KQJYTNHXAHFLBCA77ZY2USQBM4CSHTTV7DME7KALE",
                  },
                ],
                data: {
                  i128: "34737086",
                },
              },
            },
          },
          {
            ext: "v0",
            contract_id:
              "CB23WRDQWGSP6YPMY4UV5C4OW5CBTXKYN3XEATG7KJEZCXMJBYEHOUOV",
            type_: "contract",
            body: {
              v0: {
                topics: [
                  {
                    symbol: "mint",
                  },
                  {
                    address:
                      "GD3GENKSPTIIEOXESQQPF6OZSWE3DANMPBKWEK3PVG6GVILRQ5RCWLKD",
                  },
                  {
                    string:
                      "KALE:GBDVX4VELCDSQ54KQJYTNHXAHFLBCA77ZY2USQBM4CSHTTV7DME7KALE",
                  },
                ],
                data: {
                  i128: "34437433",
                },
              },
            },
          },
        ],
      ],
    },
    ledger: 60016050,
    createdAt: "1764103095",
  },
};

export const TX_EVENTS_MOCK_MUXED = {
  jsonrpc: "2.0",
  id: 1,
  result: {
    latestLedger: 1895260,
    latestLedgerCloseTime: "1764683829",
    oldestLedger: 1774301,
    oldestLedgerCloseTime: "1764078353",
    status: "SUCCESS",
    txHash: "80a57738bc6e0ce01a1ee25dbb1e59a4c4f677e0b8f0a2232c285b3a14990f9a",
    applicationOrder: 2,
    feeBump: false,
    envelopeJson: {
      tx: {
        tx: {
          source_account:
            "GBQXC7ZQHOUAM5JBU5YEC7VE2AT3GUQKK5ACH47HM77CDC7QBU5VZEEV",
          fee: 84446,
          seq_num: "908578856632404",
          cond: {
            time: {
              min_time: "0",
              max_time: "0",
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
                        "CCPKXJC62SE3XN7C5DDETNKKZLHN6NXUZRHFPGA7H47RIKAJYHKH2PYU",
                      function_name: "transfer",
                      args: [
                        {
                          address:
                            "GBQXC7ZQHOUAM5JBU5YEC7VE2AT3GUQKK5ACH47HM77CDC7QBU5VZEEV",
                        },
                        {
                          address:
                            "MC4NTEZTULYHWOCW6YSLZWAEED6ATRVX2BPKTSWZUKQKUJIMG3SLCAAAAAAAAAAAAGIQE",
                        },
                        {
                          i128: "1000000",
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
                              "CCPKXJC62SE3XN7C5DDETNKKZLHN6NXUZRHFPGA7H47RIKAJYHKH2PYU",
                            function_name: "transfer",
                            args: [
                              {
                                address:
                                  "GBQXC7ZQHOUAM5JBU5YEC7VE2AT3GUQKK5ACH47HM77CDC7QBU5VZEEV",
                              },
                              {
                                address:
                                  "MC4NTEZTULYHWOCW6YSLZWAEED6ATRVX2BPKTSWZUKQKUJIMG3SLCAAAAAAAAAAAAGIQE",
                              },
                              {
                                i128: "1000000",
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
                          "CCPKXJC62SE3XN7C5DDETNKKZLHN6NXUZRHFPGA7H47RIKAJYHKH2PYU",
                        key: "ledger_key_contract_instance",
                        durability: "persistent",
                      },
                    },
                    {
                      contract_code: {
                        hash: "03541799cc4291302d011fd49ed6f3a8d8113fa040a2cbe4a784826dbf515b44",
                      },
                    },
                  ],
                  read_write: [
                    {
                      contract_data: {
                        contract:
                          "CCPKXJC62SE3XN7C5DDETNKKZLHN6NXUZRHFPGA7H47RIKAJYHKH2PYU",
                        key: {
                          vec: [
                            {
                              symbol: "Balance",
                            },
                            {
                              address:
                                "GBQXC7ZQHOUAM5JBU5YEC7VE2AT3GUQKK5ACH47HM77CDC7QBU5VZEEV",
                            },
                          ],
                        },
                        durability: "persistent",
                      },
                    },
                    {
                      contract_data: {
                        contract:
                          "CCPKXJC62SE3XN7C5DDETNKKZLHN6NXUZRHFPGA7H47RIKAJYHKH2PYU",
                        key: {
                          vec: [
                            {
                              symbol: "Balance",
                            },
                            {
                              address:
                                "GC4NTEZTULYHWOCW6YSLZWAEED6ATRVX2BPKTSWZUKQKUJIMG3SLDMXU",
                            },
                          ],
                        },
                        durability: "persistent",
                      },
                    },
                  ],
                },
                instructions: 909934,
                disk_read_bytes: 0,
                write_bytes: 296,
              },
              resource_fee: "84246",
            },
          },
        },
        signatures: [
          {
            hint: "f00d3b5c",
            signature:
              "e9de8cc4d676c74bc92f9db6570163024671c4eb8f2b32ab921eb3a81e3909b46748ecb0933d61e8c623923437942b3bc56b9dd0e645a9a877356c26d68e860a",
          },
        ],
      },
    },
    resultJson: {},
    resultMetaJson: {},
    diagnosticEventsJson: [],
    events: {
      transactionEventsJson: [
        {
          stage: "before_all_txs",
          event: {
            ext: "v0",
            contract_id:
              "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC",
            type_: "contract",
            body: {
              v0: {
                topics: [
                  {
                    symbol: "fee",
                  },
                  {
                    address:
                      "GBQXC7ZQHOUAM5JBU5YEC7VE2AT3GUQKK5ACH47HM77CDC7QBU5VZEEV",
                  },
                ],
                data: {
                  i128: "84346",
                },
              },
            },
          },
        },
        {
          stage: "after_all_txs",
          event: {
            ext: "v0",
            contract_id:
              "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC",
            type_: "contract",
            body: {
              v0: {
                topics: [
                  {
                    symbol: "fee",
                  },
                  {
                    address:
                      "GBQXC7ZQHOUAM5JBU5YEC7VE2AT3GUQKK5ACH47HM77CDC7QBU5VZEEV",
                  },
                ],
                data: {
                  i128: "-38789",
                },
              },
            },
          },
        },
      ],
      contractEventsJson: [
        [
          {
            ext: "v0",
            contract_id:
              "CCPKXJC62SE3XN7C5DDETNKKZLHN6NXUZRHFPGA7H47RIKAJYHKH2PYU",
            type_: "contract",
            body: {
              v0: {
                topics: [
                  {
                    symbol: "transfer",
                  },
                  {
                    address:
                      "GBQXC7ZQHOUAM5JBU5YEC7VE2AT3GUQKK5ACH47HM77CDC7QBU5VZEEV",
                  },
                  {
                    address:
                      "GC4NTEZTULYHWOCW6YSLZWAEED6ATRVX2BPKTSWZUKQKUJIMG3SLDMXU",
                  },
                ],
                data: {
                  map: [
                    {
                      key: {
                        symbol: "amount",
                      },
                      val: {
                        i128: "1000000",
                      },
                    },
                    {
                      key: {
                        symbol: "to_muxed_id",
                      },
                      val: {
                        u64: "1",
                      },
                    },
                  ],
                },
              },
            },
          },
        ],
      ],
    },
    ledger: 1885245,
    createdAt: "1764633694",
  },
};
