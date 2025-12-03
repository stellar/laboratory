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
    latestLedger: 60103623,
    latestLedgerCloseTime: "1764603455",
    oldestLedger: 59982664,
    oldestLedgerCloseTime: "1763912271",
    status: "SUCCESS",
    txHash: "10fd7b30de359f1adc0268af99b7945290755b9881a30155692e194e2c2b084a",
    applicationOrder: 310,
    feeBump: false,
    envelopeJson: {
      tx: {
        tx: {
          source_account:
            "GCAJ3G3AZHC33UFOAX5AHTARQ4T6K4QOM4QS4TYE6SBWNENKVD32SKE6",
          fee: 1232823,
          seq_num: "246663137200264540",
          cond: {
            time: {
              min_time: "0",
              max_time: "1764094278",
            },
          },
          memo: "none",
          operations: [
            {
              source_account:
                "GBJXZPTSL4OMWZOELUALE74KQEVBE46M2VTS4JFNOY7YAREXNAVRG7YU",
              body: {
                invoke_host_function: {
                  host_function: {
                    invoke_contract: {
                      contract_address:
                        "CDHN6XUCHU56WGQSCGYRLFBWYL67KFS54RBMMNTJE4VOWZTOGNRPFNJE",
                      function_name: "swap",
                      args: [
                        {
                          address:
                            "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
                        },
                        {
                          address:
                            "GBJXZPTSL4OMWZOELUALE74KQEVBE46M2VTS4JFNOY7YAREXNAVRG7YU",
                        },
                        {
                          map: [
                            {
                              key: {
                                symbol: "amount",
                              },
                              val: {
                                i128: "2775196336",
                              },
                            },
                            {
                              key: {
                                symbol: "min",
                              },
                              val: {
                                i128: "10749140284",
                              },
                            },
                            {
                              key: {
                                symbol: "path",
                              },
                              val: {
                                vec: [
                                  {
                                    map: [
                                      {
                                        key: {
                                          symbol: "asset",
                                        },
                                        val: {
                                          address:
                                            "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                                        },
                                      },
                                      {
                                        key: {
                                          symbol: "bi",
                                        },
                                        val: {
                                          u32: 0,
                                        },
                                      },
                                      {
                                        key: {
                                          symbol: "pool",
                                        },
                                        val: {
                                          address:
                                            "CA6PUJLBYKZKUEKLZJMKBZLEKP2OTHANDEOWSFF44FTSYLKQPIICCJBE",
                                        },
                                      },
                                      {
                                        key: {
                                          symbol: "protocol",
                                        },
                                        val: {
                                          u32: 0,
                                        },
                                      },
                                      {
                                        key: {
                                          symbol: "si",
                                        },
                                        val: {
                                          u32: 1,
                                        },
                                      },
                                    ],
                                  },
                                ],
                              },
                            },
                          ],
                        },
                        {
                          u32: 0,
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
                              "CDHN6XUCHU56WGQSCGYRLFBWYL67KFS54RBMMNTJE4VOWZTOGNRPFNJE",
                            function_name: "swap",
                            args: [
                              {
                                address:
                                  "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
                              },
                              {
                                address:
                                  "GBJXZPTSL4OMWZOELUALE74KQEVBE46M2VTS4JFNOY7YAREXNAVRG7YU",
                              },
                              {
                                map: [
                                  {
                                    key: {
                                      symbol: "amount",
                                    },
                                    val: {
                                      i128: "2775196336",
                                    },
                                  },
                                  {
                                    key: {
                                      symbol: "min",
                                    },
                                    val: {
                                      i128: "10749140284",
                                    },
                                  },
                                  {
                                    key: {
                                      symbol: "path",
                                    },
                                    val: {
                                      vec: [
                                        {
                                          map: [
                                            {
                                              key: {
                                                symbol: "asset",
                                              },
                                              val: {
                                                address:
                                                  "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                                              },
                                            },
                                            {
                                              key: {
                                                symbol: "bi",
                                              },
                                              val: {
                                                u32: 0,
                                              },
                                            },
                                            {
                                              key: {
                                                symbol: "pool",
                                              },
                                              val: {
                                                address:
                                                  "CA6PUJLBYKZKUEKLZJMKBZLEKP2OTHANDEOWSFF44FTSYLKQPIICCJBE",
                                              },
                                            },
                                            {
                                              key: {
                                                symbol: "protocol",
                                              },
                                              val: {
                                                u32: 0,
                                              },
                                            },
                                            {
                                              key: {
                                                symbol: "si",
                                              },
                                              val: {
                                                u32: 1,
                                              },
                                            },
                                          ],
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                              {
                                u32: 0,
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
                                      "GBJXZPTSL4OMWZOELUALE74KQEVBE46M2VTS4JFNOY7YAREXNAVRG7YU",
                                  },
                                  {
                                    address:
                                      "CDHN6XUCHU56WGQSCGYRLFBWYL67KFS54RBMMNTJE4VOWZTOGNRPFNJE",
                                  },
                                  {
                                    i128: "2775196336",
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
                          "CCABO2IQYDWRGGQ4DYQ73CV3ZFDBRZTEQNDDJMFT7JZO54CLS4RYJROY",
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
                      contract_data: {
                        contract:
                          "CDHN6XUCHU56WGQSCGYRLFBWYL67KFS54RBMMNTJE4VOWZTOGNRPFNJE",
                        key: "ledger_key_contract_instance",
                        durability: "persistent",
                      },
                    },
                    {
                      contract_code: {
                        hash: "3da9edcabd7491b2245920551bf7cce020c70114e219216b948ae3dd3af2e49c",
                      },
                    },
                    {
                      contract_code: {
                        hash: "585699775ab8f0d38bea153e4c8d845d9405c6906063e3fc4c1414c120ab58f5",
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
                          "GBJXZPTSL4OMWZOELUALE74KQEVBE46M2VTS4JFNOY7YAREXNAVRG7YU",
                      },
                    },
                    {
                      trustline: {
                        account_id:
                          "GBJXZPTSL4OMWZOELUALE74KQEVBE46M2VTS4JFNOY7YAREXNAVRG7YU",
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
                          "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                        key: {
                          vec: [
                            {
                              symbol: "Balance",
                            },
                            {
                              address:
                                "CA6PUJLBYKZKUEKLZJMKBZLEKP2OTHANDEOWSFF44FTSYLKQPIICCJBE",
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
                                "CDHN6XUCHU56WGQSCGYRLFBWYL67KFS54RBMMNTJE4VOWZTOGNRPFNJE",
                            },
                          ],
                        },
                        durability: "persistent",
                      },
                    },
                    {
                      contract_data: {
                        contract:
                          "CA6PUJLBYKZKUEKLZJMKBZLEKP2OTHANDEOWSFF44FTSYLKQPIICCJBE",
                        key: "ledger_key_contract_instance",
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
                                "CA6PUJLBYKZKUEKLZJMKBZLEKP2OTHANDEOWSFF44FTSYLKQPIICCJBE",
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
                                "CA6PUJLBYKZKUEKLZJMKBZLEKP2OTHANDEOWSFF44FTSYLKQPIICCJBE",
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
                                "CDHN6XUCHU56WGQSCGYRLFBWYL67KFS54RBMMNTJE4VOWZTOGNRPFNJE",
                            },
                          ],
                        },
                        durability: "persistent",
                      },
                    },
                    {
                      contract_data: {
                        contract:
                          "CDHN6XUCHU56WGQSCGYRLFBWYL67KFS54RBMMNTJE4VOWZTOGNRPFNJE",
                        key: {
                          u32: 0,
                        },
                        durability: "temporary",
                      },
                    },
                  ],
                },
                instructions: 7121398,
                disk_read_bytes: 260,
                write_bytes: 4032,
              },
              resource_fee: "232823",
            },
          },
        },
        signatures: [
          {
            hint: "aaa8f7a9",
            signature:
              "fefebc3d63ebad4bd9950c81c896f602e3d327180d8306a24e168132fddcde20f4e8d350237ee987762d6ad2f7cb112fcc2ba8aa556568dd64f18537b661d50f",
          },
          {
            hint: "97682b13",
            signature:
              "8c59a2d81bbb32fe89b694de7dcbd987127f2ec2aadcebc38fa09c70f96c6270aa3e3e22ea61a1739b9e1ade00009a1bfc39de88ded74b58a61da60d94804a06",
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
                      "GCAJ3G3AZHC33UFOAX5AHTARQ4T6K4QOM4QS4TYE6SBWNENKVD32SKE6",
                  },
                ],
                data: {
                  i128: "232923",
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
                      "GCAJ3G3AZHC33UFOAX5AHTARQ4T6K4QOM4QS4TYE6SBWNENKVD32SKE6",
                  },
                ],
                data: {
                  i128: "-38454",
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
                      "GBJXZPTSL4OMWZOELUALE74KQEVBE46M2VTS4JFNOY7YAREXNAVRG7YU",
                  },
                  {
                    address:
                      "CDHN6XUCHU56WGQSCGYRLFBWYL67KFS54RBMMNTJE4VOWZTOGNRPFNJE",
                  },
                  {
                    string:
                      "USDC:GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN",
                  },
                ],
                data: {
                  i128: "2775196336",
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
                      "CDHN6XUCHU56WGQSCGYRLFBWYL67KFS54RBMMNTJE4VOWZTOGNRPFNJE",
                  },
                  {
                    address:
                      "CA6PUJLBYKZKUEKLZJMKBZLEKP2OTHANDEOWSFF44FTSYLKQPIICCJBE",
                  },
                  {
                    string:
                      "USDC:GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN",
                  },
                ],
                data: {
                  i128: "2775196336",
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
                      "CA6PUJLBYKZKUEKLZJMKBZLEKP2OTHANDEOWSFF44FTSYLKQPIICCJBE",
                  },
                  {
                    address:
                      "CDHN6XUCHU56WGQSCGYRLFBWYL67KFS54RBMMNTJE4VOWZTOGNRPFNJE",
                  },
                  {
                    string: "native",
                  },
                ],
                data: {
                  i128: "11079747419",
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
                      "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
                  },
                  {
                    address:
                      "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                  },
                  {
                    address:
                      "CDHN6XUCHU56WGQSCGYRLFBWYL67KFS54RBMMNTJE4VOWZTOGNRPFNJE",
                  },
                ],
                data: {
                  vec: [
                    {
                      i128: "2775196336",
                    },
                    {
                      i128: "11079747419",
                    },
                    {
                      i128: "1387599",
                    },
                  ],
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
                    symbol: "update_reserves",
                  },
                ],
                data: {
                  vec: [
                    {
                      i128: "108251205691757",
                    },
                    {
                      i128: "27089847152915",
                    },
                  ],
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
                      "CDHN6XUCHU56WGQSCGYRLFBWYL67KFS54RBMMNTJE4VOWZTOGNRPFNJE",
                  },
                  {
                    address:
                      "GBJXZPTSL4OMWZOELUALE74KQEVBE46M2VTS4JFNOY7YAREXNAVRG7YU",
                  },
                  {
                    string: "native",
                  },
                ],
                data: {
                  i128: "11079747419",
                },
              },
            },
          },
        ],
      ],
    },
    ledger: 60014504,
    createdAt: "1764094226",
  },
};

export const TX_EVENTS_MOCK_SOROSWAP = {
  jsonrpc: "2.0",
  id: 1,
  result: {
    latestLedger: 60103629,
    latestLedgerCloseTime: "1764603488",
    oldestLedger: 59982670,
    oldestLedgerCloseTime: "1763912304",
    status: "SUCCESS",
    txHash: "d6a693377523c3b4725517468d8a1e96acca52c97fec00462c38bdd823d952af",
    applicationOrder: 191,
    feeBump: true,
    envelopeJson: {
      tx_fee_bump: {
        tx: {
          fee_source:
            "GBN6KZ7VAUC7T6KNX4SBHZ3EKHTM4VLDCGTEATFW7L3YI2GJ63A22OEY",
          fee: "7665794",
          inner_tx: {
            tx: {
              tx: {
                source_account:
                  "GA5HIRZL4ZSWNSEZGUMXV5NFHD2RR4KCLAFDUJY4QOL2ENHTCDFHOWIO",
                fee: 3832897,
                seq_num: "237484689009411428",
                cond: {
                  v2: {
                    time_bounds: {
                      min_time: "0",
                      max_time: "1764071333",
                    },
                    ledger_bounds: {
                      min_ledger: 0,
                      max_ledger: 60010516,
                    },
                    min_seq_num: "0",
                    min_seq_age: "0",
                    min_seq_ledger_gap: 0,
                    extra_signers: [],
                  },
                },
                memo: "none",
                operations: [
                  {
                    source_account:
                      "GBN6KZ7VAUC7T6KNX4SBHZ3EKHTM4VLDCGTEATFW7L3YI2GJ63A22OEY",
                    body: {
                      invoke_host_function: {
                        host_function: {
                          invoke_contract: {
                            contract_address:
                              "CBWP275BNGLHWFTQVB6QHA67MLX7WTX6YZ5LNSUVOK7W2TMKWX7OPYOJ",
                            function_name: "swap",
                            args: [
                              {
                                address:
                                  "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                              },
                              {
                                vec: [
                                  {
                                    map: [
                                      {
                                        key: {
                                          symbol: "amount",
                                        },
                                        val: {
                                          i128: "14929358",
                                        },
                                      },
                                      {
                                        key: {
                                          symbol: "estimated",
                                        },
                                        val: {
                                          i128: "6562792901",
                                        },
                                      },
                                      {
                                        key: {
                                          symbol: "min",
                                        },
                                        val: {
                                          i128: "6538604967",
                                        },
                                      },
                                      {
                                        key: {
                                          symbol: "path",
                                        },
                                        val: {
                                          vec: [
                                            {
                                              map: [
                                                {
                                                  key: {
                                                    symbol: "asset",
                                                  },
                                                  val: {
                                                    address:
                                                      "CBEM2CAIYLM3HBOPU5HLQL7V5BUAKM3N77DYQKX4FNHTQLQUUD2ZFBOX",
                                                  },
                                                },
                                                {
                                                  key: {
                                                    symbol: "bi",
                                                  },
                                                  val: {
                                                    u32: 1,
                                                  },
                                                },
                                                {
                                                  key: {
                                                    symbol: "pool",
                                                  },
                                                  val: {
                                                    address:
                                                      "CDLMAKG5TSJA6FGP7LLC2FKJRQW6DQYMEPP6FURFVULDEQMP3PRZ4ISI",
                                                  },
                                                },
                                                {
                                                  key: {
                                                    symbol: "protocol",
                                                  },
                                                  val: {
                                                    u32: 2,
                                                  },
                                                },
                                                {
                                                  key: {
                                                    symbol: "si",
                                                  },
                                                  val: {
                                                    u32: 0,
                                                  },
                                                },
                                              ],
                                            },
                                            {
                                              map: [
                                                {
                                                  key: {
                                                    symbol: "asset",
                                                  },
                                                  val: {
                                                    address:
                                                      "CCKCKCPHYVXQD4NECBFJTFSCU2AMSJGCNG4O6K4JVRE2BLPR7WNDBQIQ",
                                                  },
                                                },
                                                {
                                                  key: {
                                                    symbol: "bi",
                                                  },
                                                  val: {
                                                    u32: 1,
                                                  },
                                                },
                                                {
                                                  key: {
                                                    symbol: "pool",
                                                  },
                                                  val: {
                                                    address:
                                                      "CDXADLBNIQK5STJVEBOK2CMJPCN6EUUZ3MYPUOMXQ5VBNREGFEIF3PT5",
                                                  },
                                                },
                                                {
                                                  key: {
                                                    symbol: "protocol",
                                                  },
                                                  val: {
                                                    u32: 2,
                                                  },
                                                },
                                                {
                                                  key: {
                                                    symbol: "si",
                                                  },
                                                  val: {
                                                    u32: 0,
                                                  },
                                                },
                                              ],
                                            },
                                            {
                                              map: [
                                                {
                                                  key: {
                                                    symbol: "asset",
                                                  },
                                                  val: {
                                                    address:
                                                      "CAUIKL3IYGMERDRUN6YSCLWVAKIFG5Q4YJHUKM4S4NJZQIA3BAS6OJPK",
                                                  },
                                                },
                                                {
                                                  key: {
                                                    symbol: "bi",
                                                  },
                                                  val: {
                                                    u32: 0,
                                                  },
                                                },
                                                {
                                                  key: {
                                                    symbol: "pool",
                                                  },
                                                  val: {
                                                    address:
                                                      "CAQENB7J57NTUWKTPDJ6CRIMI734US7Q2U2VXRWTNMMFSVXDTPWEUJGU",
                                                  },
                                                },
                                                {
                                                  key: {
                                                    symbol: "protocol",
                                                  },
                                                  val: {
                                                    u32: 0,
                                                  },
                                                },
                                                {
                                                  key: {
                                                    symbol: "si",
                                                  },
                                                  val: {
                                                    u32: 1,
                                                  },
                                                },
                                              ],
                                            },
                                          ],
                                        },
                                      },
                                    ],
                                  },
                                ],
                              },
                              {
                                address:
                                  "GBN6KZ7VAUC7T6KNX4SBHZ3EKHTM4VLDCGTEATFW7L3YI2GJ63A22OEY",
                              },
                              {
                                u32: 400,
                              },
                              {
                                u32: 0,
                              },
                              {
                                vec: [
                                  {
                                    map: [
                                      {
                                        key: {
                                          symbol: "asset",
                                        },
                                        val: {
                                          address:
                                            "CAFD2IS6FEBUXWHAOH3G5LM4LMXIHVH6LAYRHUPYUU62NXH3I4TUCI2C",
                                        },
                                      },
                                      {
                                        key: {
                                          symbol: "bi",
                                        },
                                        val: {
                                          u32: 0,
                                        },
                                      },
                                      {
                                        key: {
                                          symbol: "pool",
                                        },
                                        val: {
                                          address:
                                            "CDCT6W2XW64ZCIUEMRG46CJVE734SZDL6WDEH2QQOABBNU2XUSCTQEMR",
                                        },
                                      },
                                      {
                                        key: {
                                          symbol: "protocol",
                                        },
                                        val: {
                                          u32: 0,
                                        },
                                      },
                                      {
                                        key: {
                                          symbol: "si",
                                        },
                                        val: {
                                          u32: 1,
                                        },
                                      },
                                    ],
                                  },
                                  {
                                    map: [
                                      {
                                        key: {
                                          symbol: "asset",
                                        },
                                        val: {
                                          address:
                                            "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
                                        },
                                      },
                                      {
                                        key: {
                                          symbol: "bi",
                                        },
                                        val: {
                                          u32: 1,
                                        },
                                      },
                                      {
                                        key: {
                                          symbol: "pool",
                                        },
                                        val: {
                                          address:
                                            "CBN2N5L4UM5PPQE5UQNC3HVGT56TDQMAXMT3LVFMNN6XLFXZMCJY6KOU",
                                        },
                                      },
                                      {
                                        key: {
                                          symbol: "protocol",
                                        },
                                        val: {
                                          u32: 0,
                                        },
                                      },
                                      {
                                        key: {
                                          symbol: "si",
                                        },
                                        val: {
                                          u32: 0,
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
                            credentials: {
                              address: {
                                address:
                                  "GBN6KZ7VAUC7T6KNX4SBHZ3EKHTM4VLDCGTEATFW7L3YI2GJ63A22OEY",
                                nonce: "6285799956383707355",
                                signature_expiration_ledger: 60010517,
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
                                              "5be567f50505f9f94dbf2413e76451e6ce556311a6404cb6faf78468c9f6c1ad",
                                          },
                                        },
                                        {
                                          key: {
                                            symbol: "signature",
                                          },
                                          val: {
                                            bytes:
                                              "ef158214f738867e1a1aaa40b5c17de519c9ad77281dc935c92d883aae7c94dff83dd1a13da0c27ff7bfd8e04237ab366eaae0ca4b2d3c1ff026b2b967274e0c",
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
                                    "CBWP275BNGLHWFTQVB6QHA67MLX7WTX6YZ5LNSUVOK7W2TMKWX7OPYOJ",
                                  function_name: "swap",
                                  args: [
                                    {
                                      address:
                                        "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                                    },
                                    {
                                      vec: [
                                        {
                                          map: [
                                            {
                                              key: {
                                                symbol: "amount",
                                              },
                                              val: {
                                                i128: "14929358",
                                              },
                                            },
                                            {
                                              key: {
                                                symbol: "estimated",
                                              },
                                              val: {
                                                i128: "6562792901",
                                              },
                                            },
                                            {
                                              key: {
                                                symbol: "min",
                                              },
                                              val: {
                                                i128: "6538604967",
                                              },
                                            },
                                            {
                                              key: {
                                                symbol: "path",
                                              },
                                              val: {
                                                vec: [
                                                  {
                                                    map: [
                                                      {
                                                        key: {
                                                          symbol: "asset",
                                                        },
                                                        val: {
                                                          address:
                                                            "CBEM2CAIYLM3HBOPU5HLQL7V5BUAKM3N77DYQKX4FNHTQLQUUD2ZFBOX",
                                                        },
                                                      },
                                                      {
                                                        key: {
                                                          symbol: "bi",
                                                        },
                                                        val: {
                                                          u32: 1,
                                                        },
                                                      },
                                                      {
                                                        key: {
                                                          symbol: "pool",
                                                        },
                                                        val: {
                                                          address:
                                                            "CDLMAKG5TSJA6FGP7LLC2FKJRQW6DQYMEPP6FURFVULDEQMP3PRZ4ISI",
                                                        },
                                                      },
                                                      {
                                                        key: {
                                                          symbol: "protocol",
                                                        },
                                                        val: {
                                                          u32: 2,
                                                        },
                                                      },
                                                      {
                                                        key: {
                                                          symbol: "si",
                                                        },
                                                        val: {
                                                          u32: 0,
                                                        },
                                                      },
                                                    ],
                                                  },
                                                  {
                                                    map: [
                                                      {
                                                        key: {
                                                          symbol: "asset",
                                                        },
                                                        val: {
                                                          address:
                                                            "CCKCKCPHYVXQD4NECBFJTFSCU2AMSJGCNG4O6K4JVRE2BLPR7WNDBQIQ",
                                                        },
                                                      },
                                                      {
                                                        key: {
                                                          symbol: "bi",
                                                        },
                                                        val: {
                                                          u32: 1,
                                                        },
                                                      },
                                                      {
                                                        key: {
                                                          symbol: "pool",
                                                        },
                                                        val: {
                                                          address:
                                                            "CDXADLBNIQK5STJVEBOK2CMJPCN6EUUZ3MYPUOMXQ5VBNREGFEIF3PT5",
                                                        },
                                                      },
                                                      {
                                                        key: {
                                                          symbol: "protocol",
                                                        },
                                                        val: {
                                                          u32: 2,
                                                        },
                                                      },
                                                      {
                                                        key: {
                                                          symbol: "si",
                                                        },
                                                        val: {
                                                          u32: 0,
                                                        },
                                                      },
                                                    ],
                                                  },
                                                  {
                                                    map: [
                                                      {
                                                        key: {
                                                          symbol: "asset",
                                                        },
                                                        val: {
                                                          address:
                                                            "CAUIKL3IYGMERDRUN6YSCLWVAKIFG5Q4YJHUKM4S4NJZQIA3BAS6OJPK",
                                                        },
                                                      },
                                                      {
                                                        key: {
                                                          symbol: "bi",
                                                        },
                                                        val: {
                                                          u32: 0,
                                                        },
                                                      },
                                                      {
                                                        key: {
                                                          symbol: "pool",
                                                        },
                                                        val: {
                                                          address:
                                                            "CAQENB7J57NTUWKTPDJ6CRIMI734US7Q2U2VXRWTNMMFSVXDTPWEUJGU",
                                                        },
                                                      },
                                                      {
                                                        key: {
                                                          symbol: "protocol",
                                                        },
                                                        val: {
                                                          u32: 0,
                                                        },
                                                      },
                                                      {
                                                        key: {
                                                          symbol: "si",
                                                        },
                                                        val: {
                                                          u32: 1,
                                                        },
                                                      },
                                                    ],
                                                  },
                                                ],
                                              },
                                            },
                                          ],
                                        },
                                      ],
                                    },
                                    {
                                      address:
                                        "GBN6KZ7VAUC7T6KNX4SBHZ3EKHTM4VLDCGTEATFW7L3YI2GJ63A22OEY",
                                    },
                                    {
                                      u32: 400,
                                    },
                                    {
                                      u32: 0,
                                    },
                                    {
                                      vec: [
                                        {
                                          map: [
                                            {
                                              key: {
                                                symbol: "asset",
                                              },
                                              val: {
                                                address:
                                                  "CAFD2IS6FEBUXWHAOH3G5LM4LMXIHVH6LAYRHUPYUU62NXH3I4TUCI2C",
                                              },
                                            },
                                            {
                                              key: {
                                                symbol: "bi",
                                              },
                                              val: {
                                                u32: 0,
                                              },
                                            },
                                            {
                                              key: {
                                                symbol: "pool",
                                              },
                                              val: {
                                                address:
                                                  "CDCT6W2XW64ZCIUEMRG46CJVE734SZDL6WDEH2QQOABBNU2XUSCTQEMR",
                                              },
                                            },
                                            {
                                              key: {
                                                symbol: "protocol",
                                              },
                                              val: {
                                                u32: 0,
                                              },
                                            },
                                            {
                                              key: {
                                                symbol: "si",
                                              },
                                              val: {
                                                u32: 1,
                                              },
                                            },
                                          ],
                                        },
                                        {
                                          map: [
                                            {
                                              key: {
                                                symbol: "asset",
                                              },
                                              val: {
                                                address:
                                                  "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
                                              },
                                            },
                                            {
                                              key: {
                                                symbol: "bi",
                                              },
                                              val: {
                                                u32: 1,
                                              },
                                            },
                                            {
                                              key: {
                                                symbol: "pool",
                                              },
                                              val: {
                                                address:
                                                  "CBN2N5L4UM5PPQE5UQNC3HVGT56TDQMAXMT3LVFMNN6XLFXZMCJY6KOU",
                                              },
                                            },
                                            {
                                              key: {
                                                symbol: "protocol",
                                              },
                                              val: {
                                                u32: 0,
                                              },
                                            },
                                            {
                                              key: {
                                                symbol: "si",
                                              },
                                              val: {
                                                u32: 0,
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
                                        "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
                                      function_name: "transfer",
                                      args: [
                                        {
                                          address:
                                            "GBN6KZ7VAUC7T6KNX4SBHZ3EKHTM4VLDCGTEATFW7L3YI2GJ63A22OEY",
                                        },
                                        {
                                          address:
                                            "CBWP275BNGLHWFTQVB6QHA67MLX7WTX6YZ5LNSUVOK7W2TMKWX7OPYOJ",
                                        },
                                        {
                                          i128: "14929358",
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
                                "CAFD2IS6FEBUXWHAOH3G5LM4LMXIHVH6LAYRHUPYUU62NXH3I4TUCI2C",
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
                                "CAUIKL3IYGMERDRUN6YSCLWVAKIFG5Q4YJHUKM4S4NJZQIA3BAS6OJPK",
                              key: "ledger_key_contract_instance",
                              durability: "persistent",
                            },
                          },
                          {
                            contract_data: {
                              contract:
                                "CBEM2CAIYLM3HBOPU5HLQL7V5BUAKM3N77DYQKX4FNHTQLQUUD2ZFBOX",
                              key: "ledger_key_contract_instance",
                              durability: "persistent",
                            },
                          },
                          {
                            contract_data: {
                              contract:
                                "CBWP275BNGLHWFTQVB6QHA67MLX7WTX6YZ5LNSUVOK7W2TMKWX7OPYOJ",
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
                              hash: "1d4604048c4baddcb222d4b077fcd0d058e212da81e717ddeec26643814e0113",
                            },
                          },
                          {
                            contract_code: {
                              hash: "3da9edcabd7491b2245920551bf7cce020c70114e219216b948ae3dd3af2e49c",
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
                                "GBN6KZ7VAUC7T6KNX4SBHZ3EKHTM4VLDCGTEATFW7L3YI2GJ63A22OEY",
                            },
                          },
                          {
                            trustline: {
                              account_id:
                                "GBN6KZ7VAUC7T6KNX4SBHZ3EKHTM4VLDCGTEATFW7L3YI2GJ63A22OEY",
                              asset: {
                                credit_alphanum4: {
                                  asset_code: "AQUA",
                                  issuer:
                                    "GBNZILSTVQZ4R7IKQDGHYGY2QXL5QOFJYQMXPKWRRM5PAV7Y4M67AQUA",
                                },
                              },
                            },
                          },
                          {
                            contract_data: {
                              contract:
                                "GBN6KZ7VAUC7T6KNX4SBHZ3EKHTM4VLDCGTEATFW7L3YI2GJ63A22OEY",
                              key: {
                                ledger_key_nonce: {
                                  nonce: "6285799956383707355",
                                },
                              },
                              durability: "temporary",
                            },
                          },
                          {
                            contract_data: {
                              contract:
                                "CAFD2IS6FEBUXWHAOH3G5LM4LMXIHVH6LAYRHUPYUU62NXH3I4TUCI2C",
                              key: {
                                vec: [
                                  {
                                    symbol: "Balance",
                                  },
                                  {
                                    address:
                                      "CBN2N5L4UM5PPQE5UQNC3HVGT56TDQMAXMT3LVFMNN6XLFXZMCJY6KOU",
                                  },
                                ],
                              },
                              durability: "persistent",
                            },
                          },
                          {
                            contract_data: {
                              contract:
                                "CAFD2IS6FEBUXWHAOH3G5LM4LMXIHVH6LAYRHUPYUU62NXH3I4TUCI2C",
                              key: {
                                vec: [
                                  {
                                    symbol: "Balance",
                                  },
                                  {
                                    address:
                                      "CBWP275BNGLHWFTQVB6QHA67MLX7WTX6YZ5LNSUVOK7W2TMKWX7OPYOJ",
                                  },
                                ],
                              },
                              durability: "persistent",
                            },
                          },
                          {
                            contract_data: {
                              contract:
                                "CAFD2IS6FEBUXWHAOH3G5LM4LMXIHVH6LAYRHUPYUU62NXH3I4TUCI2C",
                              key: {
                                vec: [
                                  {
                                    symbol: "Balance",
                                  },
                                  {
                                    address:
                                      "CDCT6W2XW64ZCIUEMRG46CJVE734SZDL6WDEH2QQOABBNU2XUSCTQEMR",
                                  },
                                ],
                              },
                              durability: "persistent",
                            },
                          },
                          {
                            contract_data: {
                              contract:
                                "CAQENB7J57NTUWKTPDJ6CRIMI734US7Q2U2VXRWTNMMFSVXDTPWEUJGU",
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
                                      "CBWP275BNGLHWFTQVB6QHA67MLX7WTX6YZ5LNSUVOK7W2TMKWX7OPYOJ",
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
                                      "CDLMAKG5TSJA6FGP7LLC2FKJRQW6DQYMEPP6FURFVULDEQMP3PRZ4ISI",
                                  },
                                ],
                              },
                              durability: "persistent",
                            },
                          },
                          {
                            contract_data: {
                              contract:
                                "CAUIKL3IYGMERDRUN6YSCLWVAKIFG5Q4YJHUKM4S4NJZQIA3BAS6OJPK",
                              key: {
                                vec: [
                                  {
                                    symbol: "Balance",
                                  },
                                  {
                                    address:
                                      "CAQENB7J57NTUWKTPDJ6CRIMI734US7Q2U2VXRWTNMMFSVXDTPWEUJGU",
                                  },
                                ],
                              },
                              durability: "persistent",
                            },
                          },
                          {
                            contract_data: {
                              contract:
                                "CAUIKL3IYGMERDRUN6YSCLWVAKIFG5Q4YJHUKM4S4NJZQIA3BAS6OJPK",
                              key: {
                                vec: [
                                  {
                                    symbol: "Balance",
                                  },
                                  {
                                    address:
                                      "CBWP275BNGLHWFTQVB6QHA67MLX7WTX6YZ5LNSUVOK7W2TMKWX7OPYOJ",
                                  },
                                ],
                              },
                              durability: "persistent",
                            },
                          },
                          {
                            contract_data: {
                              contract:
                                "CAUIKL3IYGMERDRUN6YSCLWVAKIFG5Q4YJHUKM4S4NJZQIA3BAS6OJPK",
                              key: {
                                vec: [
                                  {
                                    symbol: "Balance",
                                  },
                                  {
                                    address:
                                      "CDCT6W2XW64ZCIUEMRG46CJVE734SZDL6WDEH2QQOABBNU2XUSCTQEMR",
                                  },
                                ],
                              },
                              durability: "persistent",
                            },
                          },
                          {
                            contract_data: {
                              contract:
                                "CBEM2CAIYLM3HBOPU5HLQL7V5BUAKM3N77DYQKX4FNHTQLQUUD2ZFBOX",
                              key: {
                                vec: [
                                  {
                                    symbol: "Balance",
                                  },
                                  {
                                    address:
                                      "CBWP275BNGLHWFTQVB6QHA67MLX7WTX6YZ5LNSUVOK7W2TMKWX7OPYOJ",
                                  },
                                ],
                              },
                              durability: "persistent",
                            },
                          },
                          {
                            contract_data: {
                              contract:
                                "CBEM2CAIYLM3HBOPU5HLQL7V5BUAKM3N77DYQKX4FNHTQLQUUD2ZFBOX",
                              key: {
                                vec: [
                                  {
                                    symbol: "Balance",
                                  },
                                  {
                                    address:
                                      "CDLMAKG5TSJA6FGP7LLC2FKJRQW6DQYMEPP6FURFVULDEQMP3PRZ4ISI",
                                  },
                                ],
                              },
                              durability: "persistent",
                            },
                          },
                          {
                            contract_data: {
                              contract:
                                "CBEM2CAIYLM3HBOPU5HLQL7V5BUAKM3N77DYQKX4FNHTQLQUUD2ZFBOX",
                              key: {
                                vec: [
                                  {
                                    symbol: "Balance",
                                  },
                                  {
                                    address:
                                      "CDXADLBNIQK5STJVEBOK2CMJPCN6EUUZ3MYPUOMXQ5VBNREGFEIF3PT5",
                                  },
                                ],
                              },
                              durability: "persistent",
                            },
                          },
                          {
                            contract_data: {
                              contract:
                                "CBN2N5L4UM5PPQE5UQNC3HVGT56TDQMAXMT3LVFMNN6XLFXZMCJY6KOU",
                              key: "ledger_key_contract_instance",
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
                                      "CAQENB7J57NTUWKTPDJ6CRIMI734US7Q2U2VXRWTNMMFSVXDTPWEUJGU",
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
                                      "CBN2N5L4UM5PPQE5UQNC3HVGT56TDQMAXMT3LVFMNN6XLFXZMCJY6KOU",
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
                                      "CDCT6W2XW64ZCIUEMRG46CJVE734SZDL6WDEH2QQOABBNU2XUSCTQEMR",
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
                                      "CAQENB7J57NTUWKTPDJ6CRIMI734US7Q2U2VXRWTNMMFSVXDTPWEUJGU",
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
                                      "CBWP275BNGLHWFTQVB6QHA67MLX7WTX6YZ5LNSUVOK7W2TMKWX7OPYOJ",
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
                                      "CDXADLBNIQK5STJVEBOK2CMJPCN6EUUZ3MYPUOMXQ5VBNREGFEIF3PT5",
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
                                      "CBN2N5L4UM5PPQE5UQNC3HVGT56TDQMAXMT3LVFMNN6XLFXZMCJY6KOU",
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
                                      "CBWP275BNGLHWFTQVB6QHA67MLX7WTX6YZ5LNSUVOK7W2TMKWX7OPYOJ",
                                  },
                                ],
                              },
                              durability: "persistent",
                            },
                          },
                          {
                            contract_data: {
                              contract:
                                "CDCT6W2XW64ZCIUEMRG46CJVE734SZDL6WDEH2QQOABBNU2XUSCTQEMR",
                              key: "ledger_key_contract_instance",
                              durability: "persistent",
                            },
                          },
                          {
                            contract_data: {
                              contract:
                                "CDLMAKG5TSJA6FGP7LLC2FKJRQW6DQYMEPP6FURFVULDEQMP3PRZ4ISI",
                              key: "ledger_key_contract_instance",
                              durability: "persistent",
                            },
                          },
                          {
                            contract_data: {
                              contract:
                                "CDXADLBNIQK5STJVEBOK2CMJPCN6EUUZ3MYPUOMXQ5VBNREGFEIF3PT5",
                              key: "ledger_key_contract_instance",
                              durability: "persistent",
                            },
                          },
                        ],
                      },
                      instructions: 19828719,
                      disk_read_bytes: 1336,
                      write_bytes: 13024,
                    },
                    resource_fee: "3828897",
                  },
                },
              },
              signatures: [
                {
                  hint: "c9f6c1ad",
                  signature:
                    "ed6b4d2357aa50541fd16554be32ee5578169a7e5e80494e17cc1559e9ebaf67e156e174ce010d49b926a166b82531a3ea5f5d4ee17d7cf4b7ec3c8d7c9e190d",
                },
                {
                  hint: "f310ca77",
                  signature:
                    "8a0ac395056baeba7f852a1336f5a0535f32a53539f71727b452f5695d1994da29b9abedecd6cf78bac32734cc30482fef1a18d050b30b67cfd435d5065b4203",
                },
              ],
            },
          },
          ext: "v0",
        },
        signatures: [
          {
            hint: "c9f6c1ad",
            signature:
              "461bf2d00b02fb6f249a9945f9c2d4f5139b98cf80abeb146ac82bc7f4de15b5850f235206f992ec162cdacd0659c3f4b12a96133610a40dbe60519dd453fd0b",
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
                      "GBN6KZ7VAUC7T6KNX4SBHZ3EKHTM4VLDCGTEATFW7L3YI2GJ63A22OEY",
                  },
                ],
                data: {
                  i128: "3829097",
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
                      "GBN6KZ7VAUC7T6KNX4SBHZ3EKHTM4VLDCGTEATFW7L3YI2GJ63A22OEY",
                  },
                ],
                data: {
                  i128: "-558141",
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
                      "GBN6KZ7VAUC7T6KNX4SBHZ3EKHTM4VLDCGTEATFW7L3YI2GJ63A22OEY",
                  },
                  {
                    address:
                      "CBWP275BNGLHWFTQVB6QHA67MLX7WTX6YZ5LNSUVOK7W2TMKWX7OPYOJ",
                  },
                  {
                    string: "native",
                  },
                ],
                data: {
                  i128: "14929358",
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
                      "CBWP275BNGLHWFTQVB6QHA67MLX7WTX6YZ5LNSUVOK7W2TMKWX7OPYOJ",
                  },
                  {
                    address:
                      "CDLMAKG5TSJA6FGP7LLC2FKJRQW6DQYMEPP6FURFVULDEQMP3PRZ4ISI",
                  },
                  {
                    string: "native",
                  },
                ],
                data: {
                  i128: "14929358",
                },
              },
            },
          },
          {
            ext: "v0",
            contract_id:
              "CBEM2CAIYLM3HBOPU5HLQL7V5BUAKM3N77DYQKX4FNHTQLQUUD2ZFBOX",
            type_: "contract",
            body: {
              v0: {
                topics: [
                  {
                    symbol: "transfer",
                  },
                  {
                    address:
                      "CDLMAKG5TSJA6FGP7LLC2FKJRQW6DQYMEPP6FURFVULDEQMP3PRZ4ISI",
                  },
                  {
                    address:
                      "CBWP275BNGLHWFTQVB6QHA67MLX7WTX6YZ5LNSUVOK7W2TMKWX7OPYOJ",
                  },
                  {
                    string:
                      "LIBRE:GAYCCWKECNGDRHYU3UTREBD2XLC3CUQN6FV22TKM4WCQER3IWR7TF5CY",
                  },
                ],
                data: {
                  i128: "5224824917",
                },
              },
            },
          },
          {
            ext: "v0",
            contract_id:
              "CDLMAKG5TSJA6FGP7LLC2FKJRQW6DQYMEPP6FURFVULDEQMP3PRZ4ISI",
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
                        i128: "2203559448",
                      },
                    },
                    {
                      key: {
                        symbol: "new_reserve_1",
                      },
                      val: {
                        i128: "768259331426",
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
              "CDLMAKG5TSJA6FGP7LLC2FKJRQW6DQYMEPP6FURFVULDEQMP3PRZ4ISI",
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
                        i128: "14929358",
                      },
                    },
                    {
                      key: {
                        symbol: "amount_0_out",
                      },
                      val: {
                        i128: "0",
                      },
                    },
                    {
                      key: {
                        symbol: "amount_1_in",
                      },
                      val: {
                        i128: "0",
                      },
                    },
                    {
                      key: {
                        symbol: "amount_1_out",
                      },
                      val: {
                        i128: "5224824917",
                      },
                    },
                    {
                      key: {
                        symbol: "to",
                      },
                      val: {
                        address:
                          "CBWP275BNGLHWFTQVB6QHA67MLX7WTX6YZ5LNSUVOK7W2TMKWX7OPYOJ",
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
              "CBEM2CAIYLM3HBOPU5HLQL7V5BUAKM3N77DYQKX4FNHTQLQUUD2ZFBOX",
            type_: "contract",
            body: {
              v0: {
                topics: [
                  {
                    symbol: "transfer",
                  },
                  {
                    address:
                      "CBWP275BNGLHWFTQVB6QHA67MLX7WTX6YZ5LNSUVOK7W2TMKWX7OPYOJ",
                  },
                  {
                    address:
                      "CDXADLBNIQK5STJVEBOK2CMJPCN6EUUZ3MYPUOMXQ5VBNREGFEIF3PT5",
                  },
                  {
                    string:
                      "LIBRE:GAYCCWKECNGDRHYU3UTREBD2XLC3CUQN6FV22TKM4WCQER3IWR7TF5CY",
                  },
                ],
                data: {
                  i128: "5224824917",
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
                      "CDXADLBNIQK5STJVEBOK2CMJPCN6EUUZ3MYPUOMXQ5VBNREGFEIF3PT5",
                  },
                  {
                    address:
                      "CBWP275BNGLHWFTQVB6QHA67MLX7WTX6YZ5LNSUVOK7W2TMKWX7OPYOJ",
                  },
                  {
                    string:
                      "SHX:GDSTRSHXHGJ7ZIVRBXEYE5Q74XUVCUSEKEBR7UCHEUUEK72N7I7KJ6JH",
                  },
                ],
                data: {
                  i128: "419845590",
                },
              },
            },
          },
          {
            ext: "v0",
            contract_id:
              "CDXADLBNIQK5STJVEBOK2CMJPCN6EUUZ3MYPUOMXQ5VBNREGFEIF3PT5",
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
                        i128: "566233578680",
                      },
                    },
                    {
                      key: {
                        symbol: "new_reserve_1",
                      },
                      val: {
                        i128: "45216020181",
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
              "CDXADLBNIQK5STJVEBOK2CMJPCN6EUUZ3MYPUOMXQ5VBNREGFEIF3PT5",
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
                        i128: "5224824917",
                      },
                    },
                    {
                      key: {
                        symbol: "amount_0_out",
                      },
                      val: {
                        i128: "0",
                      },
                    },
                    {
                      key: {
                        symbol: "amount_1_in",
                      },
                      val: {
                        i128: "0",
                      },
                    },
                    {
                      key: {
                        symbol: "amount_1_out",
                      },
                      val: {
                        i128: "419845590",
                      },
                    },
                    {
                      key: {
                        symbol: "to",
                      },
                      val: {
                        address:
                          "CBWP275BNGLHWFTQVB6QHA67MLX7WTX6YZ5LNSUVOK7W2TMKWX7OPYOJ",
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
                      "CBWP275BNGLHWFTQVB6QHA67MLX7WTX6YZ5LNSUVOK7W2TMKWX7OPYOJ",
                  },
                  {
                    address:
                      "CAQENB7J57NTUWKTPDJ6CRIMI734US7Q2U2VXRWTNMMFSVXDTPWEUJGU",
                  },
                  {
                    string:
                      "SHX:GDSTRSHXHGJ7ZIVRBXEYE5Q74XUVCUSEKEBR7UCHEUUEK72N7I7KJ6JH",
                  },
                ],
                data: {
                  i128: "419845590",
                },
              },
            },
          },
          {
            ext: "v0",
            contract_id:
              "CAUIKL3IYGMERDRUN6YSCLWVAKIFG5Q4YJHUKM4S4NJZQIA3BAS6OJPK",
            type_: "contract",
            body: {
              v0: {
                topics: [
                  {
                    symbol: "transfer",
                  },
                  {
                    address:
                      "CAQENB7J57NTUWKTPDJ6CRIMI734US7Q2U2VXRWTNMMFSVXDTPWEUJGU",
                  },
                  {
                    address:
                      "CBWP275BNGLHWFTQVB6QHA67MLX7WTX6YZ5LNSUVOK7W2TMKWX7OPYOJ",
                  },
                  {
                    string:
                      "AQUA:GBNZILSTVQZ4R7IKQDGHYGY2QXL5QOFJYQMXPKWRRM5PAV7Y4M67AQUA",
                  },
                ],
                data: {
                  i128: "6577241452",
                },
              },
            },
          },
          {
            ext: "v0",
            contract_id:
              "CAQENB7J57NTUWKTPDJ6CRIMI734US7Q2U2VXRWTNMMFSVXDTPWEUJGU",
            type_: "contract",
            body: {
              v0: {
                topics: [
                  {
                    symbol: "trade",
                  },
                  {
                    address:
                      "CCKCKCPHYVXQD4NECBFJTFSCU2AMSJGCNG4O6K4JVRE2BLPR7WNDBQIQ",
                  },
                  {
                    address:
                      "CAUIKL3IYGMERDRUN6YSCLWVAKIFG5Q4YJHUKM4S4NJZQIA3BAS6OJPK",
                  },
                  {
                    address:
                      "CBWP275BNGLHWFTQVB6QHA67MLX7WTX6YZ5LNSUVOK7W2TMKWX7OPYOJ",
                  },
                ],
                data: {
                  vec: [
                    {
                      i128: "419845590",
                    },
                    {
                      i128: "6577241452",
                    },
                    {
                      i128: "629769",
                    },
                  ],
                },
              },
            },
          },
          {
            ext: "v0",
            contract_id:
              "CAQENB7J57NTUWKTPDJ6CRIMI734US7Q2U2VXRWTNMMFSVXDTPWEUJGU",
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
                      i128: "2029939226195181",
                    },
                    {
                      i128: "129188963486610",
                    },
                  ],
                },
              },
            },
          },
          {
            ext: "v0",
            contract_id:
              "CAUIKL3IYGMERDRUN6YSCLWVAKIFG5Q4YJHUKM4S4NJZQIA3BAS6OJPK",
            type_: "contract",
            body: {
              v0: {
                topics: [
                  {
                    symbol: "transfer",
                  },
                  {
                    address:
                      "CBWP275BNGLHWFTQVB6QHA67MLX7WTX6YZ5LNSUVOK7W2TMKWX7OPYOJ",
                  },
                  {
                    address:
                      "CDCT6W2XW64ZCIUEMRG46CJVE734SZDL6WDEH2QQOABBNU2XUSCTQEMR",
                  },
                  {
                    string:
                      "AQUA:GBNZILSTVQZ4R7IKQDGHYGY2QXL5QOFJYQMXPKWRRM5PAV7Y4M67AQUA",
                  },
                ],
                data: {
                  i128: "5779420",
                },
              },
            },
          },
          {
            ext: "v0",
            contract_id:
              "CAFD2IS6FEBUXWHAOH3G5LM4LMXIHVH6LAYRHUPYUU62NXH3I4TUCI2C",
            type_: "contract",
            body: {
              v0: {
                topics: [
                  {
                    symbol: "transfer",
                  },
                  {
                    address:
                      "CDCT6W2XW64ZCIUEMRG46CJVE734SZDL6WDEH2QQOABBNU2XUSCTQEMR",
                  },
                  {
                    address:
                      "CBWP275BNGLHWFTQVB6QHA67MLX7WTX6YZ5LNSUVOK7W2TMKWX7OPYOJ",
                  },
                  {
                    string:
                      "CODY:GAW55YAX46HLIDRONLOLUWP672HTFXW5WWTEI2T7OXVEFEDE5UKQDJAK",
                  },
                ],
                data: {
                  i128: "2467",
                },
              },
            },
          },
          {
            ext: "v0",
            contract_id:
              "CDCT6W2XW64ZCIUEMRG46CJVE734SZDL6WDEH2QQOABBNU2XUSCTQEMR",
            type_: "contract",
            body: {
              v0: {
                topics: [
                  {
                    symbol: "trade",
                  },
                  {
                    address:
                      "CAUIKL3IYGMERDRUN6YSCLWVAKIFG5Q4YJHUKM4S4NJZQIA3BAS6OJPK",
                  },
                  {
                    address:
                      "CAFD2IS6FEBUXWHAOH3G5LM4LMXIHVH6LAYRHUPYUU62NXH3I4TUCI2C",
                  },
                  {
                    address:
                      "CBWP275BNGLHWFTQVB6QHA67MLX7WTX6YZ5LNSUVOK7W2TMKWX7OPYOJ",
                  },
                ],
                data: {
                  vec: [
                    {
                      i128: "5779420",
                    },
                    {
                      i128: "2467",
                    },
                    {
                      i128: "2890",
                    },
                  ],
                },
              },
            },
          },
          {
            ext: "v0",
            contract_id:
              "CDCT6W2XW64ZCIUEMRG46CJVE734SZDL6WDEH2QQOABBNU2XUSCTQEMR",
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
                      i128: "902257167",
                    },
                    {
                      i128: "2111131332189",
                    },
                  ],
                },
              },
            },
          },
          {
            ext: "v0",
            contract_id:
              "CAFD2IS6FEBUXWHAOH3G5LM4LMXIHVH6LAYRHUPYUU62NXH3I4TUCI2C",
            type_: "contract",
            body: {
              v0: {
                topics: [
                  {
                    symbol: "transfer",
                  },
                  {
                    address:
                      "CBWP275BNGLHWFTQVB6QHA67MLX7WTX6YZ5LNSUVOK7W2TMKWX7OPYOJ",
                  },
                  {
                    address:
                      "CBN2N5L4UM5PPQE5UQNC3HVGT56TDQMAXMT3LVFMNN6XLFXZMCJY6KOU",
                  },
                  {
                    string:
                      "CODY:GAW55YAX46HLIDRONLOLUWP672HTFXW5WWTEI2T7OXVEFEDE5UKQDJAK",
                  },
                ],
                data: {
                  i128: "2467",
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
                      "CBN2N5L4UM5PPQE5UQNC3HVGT56TDQMAXMT3LVFMNN6XLFXZMCJY6KOU",
                  },
                  {
                    address:
                      "CBWP275BNGLHWFTQVB6QHA67MLX7WTX6YZ5LNSUVOK7W2TMKWX7OPYOJ",
                  },
                  {
                    string:
                      "USDC:GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN",
                  },
                ],
                data: {
                  i128: "3292",
                },
              },
            },
          },
          {
            ext: "v0",
            contract_id:
              "CBN2N5L4UM5PPQE5UQNC3HVGT56TDQMAXMT3LVFMNN6XLFXZMCJY6KOU",
            type_: "contract",
            body: {
              v0: {
                topics: [
                  {
                    symbol: "trade",
                  },
                  {
                    address:
                      "CAFD2IS6FEBUXWHAOH3G5LM4LMXIHVH6LAYRHUPYUU62NXH3I4TUCI2C",
                  },
                  {
                    address:
                      "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
                  },
                  {
                    address:
                      "CBWP275BNGLHWFTQVB6QHA67MLX7WTX6YZ5LNSUVOK7W2TMKWX7OPYOJ",
                  },
                ],
                data: {
                  vec: [
                    {
                      i128: "2467",
                    },
                    {
                      i128: "3292",
                    },
                    {
                      i128: "2",
                    },
                  ],
                },
              },
            },
          },
          {
            ext: "v0",
            contract_id:
              "CBN2N5L4UM5PPQE5UQNC3HVGT56TDQMAXMT3LVFMNN6XLFXZMCJY6KOU",
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
                      i128: "11017366401",
                    },
                    {
                      i128: "14721193481",
                    },
                  ],
                },
              },
            },
          },
          {
            ext: "v0",
            contract_id:
              "CAUIKL3IYGMERDRUN6YSCLWVAKIFG5Q4YJHUKM4S4NJZQIA3BAS6OJPK",
            type_: "contract",
            body: {
              v0: {
                topics: [
                  {
                    symbol: "transfer",
                  },
                  {
                    address:
                      "CBWP275BNGLHWFTQVB6QHA67MLX7WTX6YZ5LNSUVOK7W2TMKWX7OPYOJ",
                  },
                  {
                    address:
                      "GBN6KZ7VAUC7T6KNX4SBHZ3EKHTM4VLDCGTEATFW7L3YI2GJ63A22OEY",
                  },
                  {
                    string:
                      "AQUA:GBNZILSTVQZ4R7IKQDGHYGY2QXL5QOFJYQMXPKWRRM5PAV7Y4M67AQUA",
                  },
                ],
                data: {
                  i128: "6571462032",
                },
              },
            },
          },
        ],
      ],
    },
    ledger: 60010515,
    createdAt: "1764071309",
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
