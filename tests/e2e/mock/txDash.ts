export const TX_DASH_CLASSIC = {
  jsonrpc: "2.0",
  id: 1,
  result: {
    latestLedger: 58973256,
    latestLedgerCloseTime: "1758130185",
    oldestLedger: 58852297,
    oldestLedgerCloseTime: "1757432722",
    status: "SUCCESS",
    txHash: "c724819cd33b9a57d60e26e760aa1cd152ea1612f1860c9e5c9708070799c970",
    applicationOrder: 1,
    feeBump: false,
    envelopeJson: {
      tx: {
        tx: {
          source_account:
            "GCMN6GO36KGLJXGLRBCD5CWO25ZXKWMVXKAOZFIPMPRT3BDVJP5QGOHL",
          fee: 101,
          seq_num: "161395112819909083",
          cond: {
            time: {
              min_time: "0",
              max_time: "1758130176",
            },
          },
          memo: "none",
          operations: [
            {
              source_account: null,
              body: {
                manage_buy_offer: {
                  selling: {
                    credit_alphanum4: {
                      asset_code: "DXLM",
                      issuer:
                        "GAE6DWVMZDAOBU4IIPGDM2EJ65PWZQ5X7MI7PUURWKTEVZSEJHRYI247",
                    },
                  },
                  buying: "native",
                  buy_amount: "199999786",
                  price: {
                    n: 842282207,
                    d: 749462,
                  },
                  offer_id: "1789106396",
                },
              },
            },
          ],
          ext: "v0",
        },
        signatures: [
          {
            hint: "754bfb03",
            signature:
              "3e9e53aaa9b8a3a61358631c13691c40be2007aa5957d10e572d8bcaed2c49513dd8faa605e66bad3aadb4336a01b6333c22d42a7c5cc2c3109e51ed3acfac0d",
          },
        ],
      },
    },
    resultJson: {
      fee_charged: "100",
      result: {
        tx_success: [
          {
            op_inner: {
              manage_buy_offer: {
                success: {
                  offers_claimed: [],
                  offer: {
                    updated: {
                      seller_id:
                        "GCMN6GO36KGLJXGLRBCD5CWO25ZXKWMVXKAOZFIPMPRT3BDVJP5QGOHL",
                      offer_id: "1789106396",
                      selling: {
                        credit_alphanum4: {
                          asset_code: "DXLM",
                          issuer:
                            "GAE6DWVMZDAOBU4IIPGDM2EJ65PWZQ5X7MI7PUURWKTEVZSEJHRYI247",
                        },
                      },
                      buying: "native",
                      amount: "224769582917",
                      price: {
                        n: 749462,
                        d: 842282207,
                      },
                      flags: 0,
                      ext: "v0",
                    },
                  },
                },
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
              last_modified_ledger_seq: 58973250,
              data: {
                account: {
                  account_id:
                    "GCMN6GO36KGLJXGLRBCD5CWO25ZXKWMVXKAOZFIPMPRT3BDVJP5QGOHL",
                  balance: "2235343943",
                  seq_num: "161395112819909082",
                  num_sub_entries: 41,
                  inflation_dest: null,
                  flags: 0,
                  home_domain: "",
                  thresholds: "01000000",
                  signers: [],
                  ext: {
                    v1: {
                      liabilities: {
                        buying: "9680126233",
                        selling: "1370454555",
                      },
                      ext: {
                        v2: {
                          num_sponsored: 0,
                          num_sponsoring: 0,
                          signer_sponsoring_i_ds: [],
                          ext: {
                            v3: {
                              ext: "v0",
                              seq_ledger: 58973249,
                              seq_time: "1758130141",
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
              last_modified_ledger_seq: 58973250,
              data: {
                account: {
                  account_id:
                    "GCMN6GO36KGLJXGLRBCD5CWO25ZXKWMVXKAOZFIPMPRT3BDVJP5QGOHL",
                  balance: "2235343943",
                  seq_num: "161395112819909083",
                  num_sub_entries: 41,
                  inflation_dest: null,
                  flags: 0,
                  home_domain: "",
                  thresholds: "01000000",
                  signers: [],
                  ext: {
                    v1: {
                      liabilities: {
                        buying: "9680126233",
                        selling: "1370454555",
                      },
                      ext: {
                        v2: {
                          num_sponsored: 0,
                          num_sponsoring: 0,
                          signer_sponsoring_i_ds: [],
                          ext: {
                            v3: {
                              ext: "v0",
                              seq_ledger: 58973250,
                              seq_time: "1758130148",
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
                  last_modified_ledger_seq: 58973234,
                  data: {
                    offer: {
                      seller_id:
                        "GCMN6GO36KGLJXGLRBCD5CWO25ZXKWMVXKAOZFIPMPRT3BDVJP5QGOHL",
                      offer_id: "1789106396",
                      selling: {
                        credit_alphanum4: {
                          asset_code: "DXLM",
                          issuer:
                            "GAE6DWVMZDAOBU4IIPGDM2EJ65PWZQ5X7MI7PUURWKTEVZSEJHRYI247",
                        },
                      },
                      buying: "native",
                      amount: "224769584041",
                      price: {
                        n: 749462,
                        d: 842282207,
                      },
                      flags: 0,
                      ext: "v0",
                    },
                  },
                  ext: "v0",
                },
              },
              {
                updated: {
                  last_modified_ledger_seq: 58973250,
                  data: {
                    offer: {
                      seller_id:
                        "GCMN6GO36KGLJXGLRBCD5CWO25ZXKWMVXKAOZFIPMPRT3BDVJP5QGOHL",
                      offer_id: "1789106396",
                      selling: {
                        credit_alphanum4: {
                          asset_code: "DXLM",
                          issuer:
                            "GAE6DWVMZDAOBU4IIPGDM2EJ65PWZQ5X7MI7PUURWKTEVZSEJHRYI247",
                        },
                      },
                      buying: "native",
                      amount: "224769582917",
                      price: {
                        n: 749462,
                        d: 842282207,
                      },
                      flags: 0,
                      ext: "v0",
                    },
                  },
                  ext: "v0",
                },
              },
              {
                state: {
                  last_modified_ledger_seq: 58973250,
                  data: {
                    account: {
                      account_id:
                        "GCMN6GO36KGLJXGLRBCD5CWO25ZXKWMVXKAOZFIPMPRT3BDVJP5QGOHL",
                      balance: "2235343943",
                      seq_num: "161395112819909083",
                      num_sub_entries: 41,
                      inflation_dest: null,
                      flags: 0,
                      home_domain: "",
                      thresholds: "01000000",
                      signers: [],
                      ext: {
                        v1: {
                          liabilities: {
                            buying: "9680126233",
                            selling: "1370454555",
                          },
                          ext: {
                            v2: {
                              num_sponsored: 0,
                              num_sponsoring: 0,
                              signer_sponsoring_i_ds: [],
                              ext: {
                                v3: {
                                  ext: "v0",
                                  seq_ledger: 58973250,
                                  seq_time: "1758130148",
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
                  last_modified_ledger_seq: 58973250,
                  data: {
                    account: {
                      account_id:
                        "GCMN6GO36KGLJXGLRBCD5CWO25ZXKWMVXKAOZFIPMPRT3BDVJP5QGOHL",
                      balance: "2235343943",
                      seq_num: "161395112819909083",
                      num_sub_entries: 41,
                      inflation_dest: null,
                      flags: 0,
                      home_domain: "",
                      thresholds: "01000000",
                      signers: [],
                      ext: {
                        v1: {
                          liabilities: {
                            buying: "9680126232",
                            selling: "1370454555",
                          },
                          ext: {
                            v2: {
                              num_sponsored: 0,
                              num_sponsoring: 0,
                              signer_sponsoring_i_ds: [],
                              ext: {
                                v3: {
                                  ext: "v0",
                                  seq_ledger: 58973250,
                                  seq_time: "1758130148",
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
                  last_modified_ledger_seq: 58973249,
                  data: {
                    trustline: {
                      account_id:
                        "GCMN6GO36KGLJXGLRBCD5CWO25ZXKWMVXKAOZFIPMPRT3BDVJP5QGOHL",
                      asset: {
                        credit_alphanum4: {
                          asset_code: "DXLM",
                          issuer:
                            "GAE6DWVMZDAOBU4IIPGDM2EJ65PWZQ5X7MI7PUURWKTEVZSEJHRYI247",
                        },
                      },
                      balance: "9083555504457",
                      limit: "9223372036854775807",
                      flags: 1,
                      ext: {
                        v1: {
                          liabilities: {
                            buying: "9561972543526",
                            selling: "7680844299141",
                          },
                          ext: "v0",
                        },
                      },
                    },
                  },
                  ext: "v0",
                },
              },
              {
                updated: {
                  last_modified_ledger_seq: 58973250,
                  data: {
                    trustline: {
                      account_id:
                        "GCMN6GO36KGLJXGLRBCD5CWO25ZXKWMVXKAOZFIPMPRT3BDVJP5QGOHL",
                      asset: {
                        credit_alphanum4: {
                          asset_code: "DXLM",
                          issuer:
                            "GAE6DWVMZDAOBU4IIPGDM2EJ65PWZQ5X7MI7PUURWKTEVZSEJHRYI247",
                        },
                      },
                      balance: "9083555504457",
                      limit: "9223372036854775807",
                      flags: 1,
                      ext: {
                        v1: {
                          liabilities: {
                            buying: "9561972543526",
                            selling: "7680844298017",
                          },
                          ext: "v0",
                        },
                      },
                    },
                  },
                  ext: "v0",
                },
              },
            ],
            events: [],
          },
        ],
        tx_changes_after: [],
        soroban_meta: null,
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
                        "GCMN6GO36KGLJXGLRBCD5CWO25ZXKWMVXKAOZFIPMPRT3BDVJP5QGOHL",
                    },
                  ],
                  data: {
                    i128: "100",
                  },
                },
              },
            },
          },
        ],
        diagnostic_events: [],
      },
    },
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
                      "GCMN6GO36KGLJXGLRBCD5CWO25ZXKWMVXKAOZFIPMPRT3BDVJP5QGOHL",
                  },
                ],
                data: {
                  i128: "100",
                },
              },
            },
          },
        },
      ],
      contractEventsJson: [[]],
    },
    ledger: 58973250,
    createdAt: "1758130148",
  },
};

export const TX_DASH_LATEST_LEDGER_RESPONSE = {
  jsonrpc: "2.0",
  id: 1,
  result: {
    id: "83625cfa564f7ec1c8d887f8784e7921a96608507e73a53ad22d326c0a096b6b",
    protocolVersion: 25,
    sequence: 60982731,
    closeTime: "1769646205",
    headerXdr:
      "AAAAGSKntpm0uXA/3j9glPHg5jx+xJ1uIXQeHESD7d9HkbRKxzKnloq8qYtUMeLTF9QW8EdOnoNFhS2wNQFTcmDL0xsAAAAAaXqofQAAAAAAAAABAAAAAJF6qaV6rVYpKqq1XjVfHyYvW2GjLyQnfuwoC9gxe9N0AAAAQN030TdOtIkc1U8CgEBABdYkhgFrErT9oEb8eYhhnHyx5V/31AAHYeGjA7k7+57WR79Ue4hUuPvxhIO2T27ZLwinProyvf6lrMRx+h7ny9fh8uFQi78dP4xEH/Mw0d0JGVGpPBLI7dxl7sMz2AkMA2ocWRzQWNtNtW+i72YO6hTGA6KFyw6iHrPseVthAABUB6LSyO0AAAEWAAAAAGyK8S4AAABkAExLQAAAA+h9/yANkvy883iZ/fWydNDHjmUClsifslD7ALjNo9aTyptabLa6aOdwmCaJxpDBBYlAsJAOVHh7yt4DBOWMSFiOZYheIS09KsdGBAEsARoyu5/IcT1Bp8KYb8MLxvP8NjjBETpvKEDps4aXmMpNzEZE4J2F0AY36tykCAnPIEt2wQAAAAA=",
  },
};

export const TX_DASH_LATEST_TX_RESPONSE = {
  jsonrpc: "2.0",
  id: 1,
  result: {
    transactions: [
      {
        status: "FAILED",
        txHash:
          "00d22647329823b28897d8ea0b029bf84f3989fc174d3e89749df4144ed70ce0",
        applicationOrder: 1,
        feeBump: false,
        envelopeXdr:
          "AAAAAgAAAAAKyb7isgP6TFrXyCrlE693+y43B14XTSV4wRzY8BIrZAAiVRADQPspAAA5FQAAAAEAAAAAaXqoTAAAAABpeqiIAAAAAAAAAAEAAAABAAAAAArJvuKyA/pMWtfIKuUTr3f7LjcHXhdNJXjBHNjwEitkAAAAAgAAAAAAAAAABkyYAQAAAAAKyb7isgP6TFrXyCrlE693+y43B14XTSV4wRzY8BIrZAAAAAAAAAAABk2B2QAAAAIAAAACMDAwMDFzYWx0AAAAAAAAAPjEyfh6sEdSYoE+2k9rs/Ug77Bmh56oIb/cHpWEccdAAAAAAUJSTAAAAAAA6qxo1NDje0wkwlNpFugwc18DLQ1rKhyPyjvFol4IPjoAAAAAAAAAAfASK2QAAABAnMDGTbYz+0FJazWRUo5WWHNefjaGffjTRVDOYwptMl8p4NBtxHnhwJVy6s0ij3fCu2i7inx5SCkSCc0ct98FBA==",
        resultXdr: "AAAAAAAAAGT/////AAAAAQAAAAAAAAAC////9AAAAAA=",
        resultMetaXdr:
          "AAAABAAAAAAAAAACAAAAAwOihcsAAAAAAAAAAArJvuKyA/pMWtfIKuUTr3f7LjcHXhdNJXjBHNjwEitkAAAAAAIXemwDQPspAAA5FAAAAAEAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAMAAAAAA6KFjQAAAABpeqcXAAAAAAAAAAEDooXLAAAAAAAAAAAKyb7isgP6TFrXyCrlE693+y43B14XTSV4wRzY8BIrZAAAAAACF3psA0D7KQAAORUAAAABAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAADAAAAAAOihcsAAAAAaXqofQAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAABJbT82FmuwvpjSEOMSJs8PBDJi20hvk/TyzDLaJU++XcAAAABAAAAAAAAAAIAAAAPAAAAA2ZlZQAAAAASAAAAAAAAAAAKyb7isgP6TFrXyCrlE693+y43B14XTSV4wRzY8BIrZAAAAAoAAAAAAAAAAAAAAAAAAABkAAAAAA==",
        events: {
          transactionEventsXdr: [
            "AAAAAAAAAAAAAAABJbT82FmuwvpjSEOMSJs8PBDJi20hvk/TyzDLaJU++XcAAAABAAAAAAAAAAIAAAAPAAAAA2ZlZQAAAAASAAAAAAAAAAAKyb7isgP6TFrXyCrlE693+y43B14XTSV4wRzY8BIrZAAAAAoAAAAAAAAAAAAAAAAAAABk",
          ],
        },
        ledger: 60982731,
        createdAt: 1769646205,
      },
    ],
    latestLedger: 60982732,
    latestLedgerCloseTimestamp: 1769646211,
    oldestLedger: 60861773,
    oldestLedgerCloseTimestamp: 1768938444,
    cursor: "261918835265769473",
  },
};
