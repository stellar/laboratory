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
