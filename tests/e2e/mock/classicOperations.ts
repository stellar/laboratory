// Mock data for ClassicOperations tests

// Operations array with many operations (15 total) for pagination testing
export const TX_CLASSIC_MANY_OPS = {
  jsonrpc: "2.0",
  id: 1,
  result: {
    latestLedger: 712688,
    latestLedgerCloseTime: "1769559289",
    oldestLedger: 591729,
    oldestLedgerCloseTime: "1768953838",
    status: "SUCCESS",
    txHash: "3061a62a0756da9c133b3d20142c26f337adf62baf35f84ae1becb296d3a4144",
    applicationOrder: 2,
    feeBump: false,
    envelopeJson: {
      tx: {
        tx: {
          source_account:
            "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
          fee: 1500,
          seq_num: "2751721122037769",
          cond: "none",
          memo: "none",
          operations: [
            {
              source_account: null,
              body: {
                begin_sponsoring_future_reserves: {
                  sponsored_id:
                    "GAZS54SYTI63HDRLI53CALG6VZLEZHBCMSJVMEOXJNTM46GM2E3MWJOH",
                },
              },
            },
            {
              source_account:
                "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
              body: {
                create_account: {
                  destination:
                    "GAZS54SYTI63HDRLI53CALG6VZLEZHBCMSJVMEOXJNTM46GM2E3MWJOH",
                  starting_balance: "100000000",
                },
              },
            },
            {
              source_account:
                "GAZS54SYTI63HDRLI53CALG6VZLEZHBCMSJVMEOXJNTM46GM2E3MWJOH",
              body: {
                manage_data: {
                  data_name: "soneso",
                  data_value: "6973207375706572",
                },
              },
            },
            {
              source_account:
                "GAZS54SYTI63HDRLI53CALG6VZLEZHBCMSJVMEOXJNTM46GM2E3MWJOH",
              body: {
                change_trust: {
                  line: {
                    credit_alphanum4: {
                      asset_code: "RICH",
                      issuer:
                        "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                    },
                  },
                  limit: "100000000000",
                },
              },
            },
            {
              source_account:
                "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
              body: {
                payment: {
                  destination:
                    "GAZS54SYTI63HDRLI53CALG6VZLEZHBCMSJVMEOXJNTM46GM2E3MWJOH",
                  asset: {
                    credit_alphanum4: {
                      asset_code: "RICH",
                      issuer:
                        "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                    },
                  },
                  amount: "1000000000",
                },
              },
            },
            {
              source_account:
                "GAZS54SYTI63HDRLI53CALG6VZLEZHBCMSJVMEOXJNTM46GM2E3MWJOH",
              body: {
                create_claimable_balance: {
                  asset: "native",
                  amount: "20000000",
                  claimants: [
                    {
                      claimant_type_v0: {
                        destination:
                          "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                        predicate: "unconditional",
                      },
                    },
                  ],
                },
              },
            },
            {
              source_account:
                "GAZS54SYTI63HDRLI53CALG6VZLEZHBCMSJVMEOXJNTM46GM2E3MWJOH",
              body: {
                manage_sell_offer: {
                  selling: {
                    credit_alphanum4: {
                      asset_code: "RICH",
                      issuer:
                        "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                    },
                  },
                  buying: "native",
                  amount: "100000000",
                  price: {
                    n: 2,
                    d: 5,
                  },
                  offer_id: "0",
                },
              },
            },
            {
              source_account:
                "GAZS54SYTI63HDRLI53CALG6VZLEZHBCMSJVMEOXJNTM46GM2E3MWJOH",
              body: {
                set_options: {
                  inflation_dest: null,
                  clear_flags: null,
                  set_flags: null,
                  master_weight: null,
                  low_threshold: null,
                  med_threshold: null,
                  high_threshold: null,
                  home_domain: null,
                  signer: {
                    key: "XBXJI2RSI2IAD4EYJJH6PXYSEXQ7BKA56KVMIXPYQ3O2FOXUTAIJIAL2",
                    weight: 1,
                  },
                },
              },
            },
            {
              source_account:
                "GAZS54SYTI63HDRLI53CALG6VZLEZHBCMSJVMEOXJNTM46GM2E3MWJOH",
              body: {
                set_options: {
                  inflation_dest: null,
                  clear_flags: null,
                  set_flags: null,
                  master_weight: null,
                  low_threshold: null,
                  med_threshold: null,
                  high_threshold: null,
                  home_domain: null,
                  signer: {
                    key: "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                    weight: 1,
                  },
                },
              },
            },
            {
              source_account:
                "GAZS54SYTI63HDRLI53CALG6VZLEZHBCMSJVMEOXJNTM46GM2E3MWJOH",
              body: "end_sponsoring_future_reserves",
            },
            {
              source_account:
                "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
              body: {
                revoke_sponsorship: {
                  ledger_entry: {
                    account: {
                      account_id:
                        "GAZS54SYTI63HDRLI53CALG6VZLEZHBCMSJVMEOXJNTM46GM2E3MWJOH",
                    },
                  },
                },
              },
            },
            {
              source_account:
                "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
              body: {
                revoke_sponsorship: {
                  ledger_entry: {
                    data: {
                      account_id:
                        "GAZS54SYTI63HDRLI53CALG6VZLEZHBCMSJVMEOXJNTM46GM2E3MWJOH",
                      data_name: "soneso",
                    },
                  },
                },
              },
            },
            {
              source_account:
                "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
              body: {
                revoke_sponsorship: {
                  ledger_entry: {
                    trustline: {
                      account_id:
                        "GAZS54SYTI63HDRLI53CALG6VZLEZHBCMSJVMEOXJNTM46GM2E3MWJOH",
                      asset: {
                        credit_alphanum4: {
                          asset_code: "RICH",
                          issuer:
                            "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                        },
                      },
                    },
                  },
                },
              },
            },
            {
              source_account: null,
              body: {
                revoke_sponsorship: {
                  signer: {
                    account_id:
                      "GAZS54SYTI63HDRLI53CALG6VZLEZHBCMSJVMEOXJNTM46GM2E3MWJOH",
                    signer_key:
                      "XBXJI2RSI2IAD4EYJJH6PXYSEXQ7BKA56KVMIXPYQ3O2FOXUTAIJIAL2",
                  },
                },
              },
            },
            {
              source_account: null,
              body: {
                revoke_sponsorship: {
                  signer: {
                    account_id:
                      "GAZS54SYTI63HDRLI53CALG6VZLEZHBCMSJVMEOXJNTM46GM2E3MWJOH",
                    signer_key:
                      "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                  },
                },
              },
            },
          ],
          ext: "v0",
        },
        signatures: [
          {
            hint: "2b039717",
            signature:
              "0cca00a574becc1bc6e4db8492b7bf601be0ea156e1f18ec54e79ee9a21f136cefba218e3e3af51d7e9243d72cbbcc79015f22330d033874dadf74509ca5e802",
          },
          {
            hint: "ccd136cb",
            signature:
              "2a7cc316e158f101ae7534c558946f60b5f79478b69368440caf9155effecdd74d05383db00283b229bb53df88941671833a81ef048edd6666f54e2d241a730a",
          },
        ],
      },
    },
    resultJson: {
      fee_charged: "1500",
      result: {
        tx_success: [
          {
            op_inner: {
              begin_sponsoring_future_reserves: "success",
            },
          },
          {
            op_inner: {
              create_account: "success",
            },
          },
          {
            op_inner: {
              manage_data: "success",
            },
          },
          {
            op_inner: {
              change_trust: "success",
            },
          },
          {
            op_inner: {
              payment: "success",
            },
          },
          {
            op_inner: {
              create_claimable_balance: {
                success:
                  "BAAG6WV7LERLAJCFFMBKBQY7G2HQN2FTD34GJKNOFJACUMIJ37OJTTHZR4",
              },
            },
          },
          {
            op_inner: {
              manage_sell_offer: {
                success: {
                  offers_claimed: [],
                  offer: {
                    created: {
                      seller_id:
                        "GAZS54SYTI63HDRLI53CALG6VZLEZHBCMSJVMEOXJNTM46GM2E3MWJOH",
                      offer_id: "16952",
                      selling: {
                        credit_alphanum4: {
                          asset_code: "RICH",
                          issuer:
                            "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                        },
                      },
                      buying: "native",
                      amount: "100000000",
                      price: {
                        n: 2,
                        d: 5,
                      },
                      flags: 0,
                      ext: "v0",
                    },
                  },
                },
              },
            },
          },
          {
            op_inner: {
              set_options: "success",
            },
          },
          {
            op_inner: {
              set_options: "success",
            },
          },
          {
            op_inner: {
              end_sponsoring_future_reserves: "success",
            },
          },
          {
            op_inner: {
              revoke_sponsorship: "success",
            },
          },
          {
            op_inner: {
              revoke_sponsorship: "success",
            },
          },
          {
            op_inner: {
              revoke_sponsorship: "success",
            },
          },
          {
            op_inner: {
              revoke_sponsorship: "success",
            },
          },
          {
            op_inner: {
              revoke_sponsorship: "success",
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
              last_modified_ledger_seq: 640697,
              data: {
                account: {
                  account_id:
                    "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                  balance: "97979997100",
                  seq_num: "2751721122037768",
                  num_sub_entries: 4,
                  inflation_dest: null,
                  flags: 0,
                  home_domain: "http://www.soneso.com",
                  thresholds: "01000000",
                  signers: [],
                  ext: {
                    v1: {
                      liabilities: {
                        buying: "325098038",
                        selling: "0",
                      },
                      ext: {
                        v2: {
                          num_sponsored: 0,
                          num_sponsoring: 2,
                          signer_sponsoring_i_ds: [],
                          ext: {
                            v3: {
                              ext: "v0",
                              seq_ledger: 640696,
                              seq_time: "1769198954",
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
              last_modified_ledger_seq: 640697,
              data: {
                account: {
                  account_id:
                    "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                  balance: "97979997100",
                  seq_num: "2751721122037769",
                  num_sub_entries: 4,
                  inflation_dest: null,
                  flags: 0,
                  home_domain: "http://www.soneso.com",
                  thresholds: "01000000",
                  signers: [],
                  ext: {
                    v1: {
                      liabilities: {
                        buying: "325098038",
                        selling: "0",
                      },
                      ext: {
                        v2: {
                          num_sponsored: 0,
                          num_sponsoring: 2,
                          signer_sponsoring_i_ds: [],
                          ext: {
                            v3: {
                              ext: "v0",
                              seq_ledger: 640697,
                              seq_time: "1769198959",
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
            changes: [],
            events: [],
          },
          {
            ext: "v0",
            changes: [
              {
                state: {
                  last_modified_ledger_seq: 640697,
                  data: {
                    account: {
                      account_id:
                        "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                      balance: "97979997100",
                      seq_num: "2751721122037769",
                      num_sub_entries: 4,
                      inflation_dest: null,
                      flags: 0,
                      home_domain: "http://www.soneso.com",
                      thresholds: "01000000",
                      signers: [],
                      ext: {
                        v1: {
                          liabilities: {
                            buying: "325098038",
                            selling: "0",
                          },
                          ext: {
                            v2: {
                              num_sponsored: 0,
                              num_sponsoring: 2,
                              signer_sponsoring_i_ds: [],
                              ext: {
                                v3: {
                                  ext: "v0",
                                  seq_ledger: 640697,
                                  seq_time: "1769198959",
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
                  last_modified_ledger_seq: 640697,
                  data: {
                    account: {
                      account_id:
                        "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                      balance: "97879997100",
                      seq_num: "2751721122037769",
                      num_sub_entries: 4,
                      inflation_dest: null,
                      flags: 0,
                      home_domain: "http://www.soneso.com",
                      thresholds: "01000000",
                      signers: [],
                      ext: {
                        v1: {
                          liabilities: {
                            buying: "325098038",
                            selling: "0",
                          },
                          ext: {
                            v2: {
                              num_sponsored: 0,
                              num_sponsoring: 4,
                              signer_sponsoring_i_ds: [],
                              ext: {
                                v3: {
                                  ext: "v0",
                                  seq_ledger: 640697,
                                  seq_time: "1769198959",
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
                created: {
                  last_modified_ledger_seq: 640697,
                  data: {
                    account: {
                      account_id:
                        "GAZS54SYTI63HDRLI53CALG6VZLEZHBCMSJVMEOXJNTM46GM2E3MWJOH",
                      balance: "100000000",
                      seq_num: "2751772661645312",
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
                              num_sponsored: 2,
                              num_sponsoring: 0,
                              signer_sponsoring_i_ds: [],
                              ext: "v0",
                            },
                          },
                        },
                      },
                    },
                  },
                  ext: {
                    v1: {
                      sponsoring_id:
                        "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                      ext: "v0",
                    },
                  },
                },
              },
            ],
            events: [
              {
                ext: "v0",
                contract_id:
                  "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC",
                type_: "contract",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "transfer",
                      },
                      {
                        address:
                          "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                      },
                      {
                        address:
                          "GAZS54SYTI63HDRLI53CALG6VZLEZHBCMSJVMEOXJNTM46GM2E3MWJOH",
                      },
                      {
                        string: "native",
                      },
                    ],
                    data: {
                      i128: "100000000",
                    },
                  },
                },
              },
            ],
          },
          {
            ext: "v0",
            changes: [
              {
                created: {
                  last_modified_ledger_seq: 640697,
                  data: {
                    data: {
                      account_id:
                        "GAZS54SYTI63HDRLI53CALG6VZLEZHBCMSJVMEOXJNTM46GM2E3MWJOH",
                      data_name: "soneso",
                      data_value: "6973207375706572",
                      ext: "v0",
                    },
                  },
                  ext: {
                    v1: {
                      sponsoring_id:
                        "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                      ext: "v0",
                    },
                  },
                },
              },
              {
                state: {
                  last_modified_ledger_seq: 640697,
                  data: {
                    account: {
                      account_id:
                        "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                      balance: "97879997100",
                      seq_num: "2751721122037769",
                      num_sub_entries: 4,
                      inflation_dest: null,
                      flags: 0,
                      home_domain: "http://www.soneso.com",
                      thresholds: "01000000",
                      signers: [],
                      ext: {
                        v1: {
                          liabilities: {
                            buying: "325098038",
                            selling: "0",
                          },
                          ext: {
                            v2: {
                              num_sponsored: 0,
                              num_sponsoring: 4,
                              signer_sponsoring_i_ds: [],
                              ext: {
                                v3: {
                                  ext: "v0",
                                  seq_ledger: 640697,
                                  seq_time: "1769198959",
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
                  last_modified_ledger_seq: 640697,
                  data: {
                    account: {
                      account_id:
                        "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                      balance: "97879997100",
                      seq_num: "2751721122037769",
                      num_sub_entries: 4,
                      inflation_dest: null,
                      flags: 0,
                      home_domain: "http://www.soneso.com",
                      thresholds: "01000000",
                      signers: [],
                      ext: {
                        v1: {
                          liabilities: {
                            buying: "325098038",
                            selling: "0",
                          },
                          ext: {
                            v2: {
                              num_sponsored: 0,
                              num_sponsoring: 5,
                              signer_sponsoring_i_ds: [],
                              ext: {
                                v3: {
                                  ext: "v0",
                                  seq_ledger: 640697,
                                  seq_time: "1769198959",
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
                  last_modified_ledger_seq: 640697,
                  data: {
                    account: {
                      account_id:
                        "GAZS54SYTI63HDRLI53CALG6VZLEZHBCMSJVMEOXJNTM46GM2E3MWJOH",
                      balance: "100000000",
                      seq_num: "2751772661645312",
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
                              num_sponsored: 2,
                              num_sponsoring: 0,
                              signer_sponsoring_i_ds: [],
                              ext: "v0",
                            },
                          },
                        },
                      },
                    },
                  },
                  ext: {
                    v1: {
                      sponsoring_id:
                        "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                      ext: "v0",
                    },
                  },
                },
              },
              {
                updated: {
                  last_modified_ledger_seq: 640697,
                  data: {
                    account: {
                      account_id:
                        "GAZS54SYTI63HDRLI53CALG6VZLEZHBCMSJVMEOXJNTM46GM2E3MWJOH",
                      balance: "100000000",
                      seq_num: "2751772661645312",
                      num_sub_entries: 1,
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
                              num_sponsored: 3,
                              num_sponsoring: 0,
                              signer_sponsoring_i_ds: [],
                              ext: "v0",
                            },
                          },
                        },
                      },
                    },
                  },
                  ext: {
                    v1: {
                      sponsoring_id:
                        "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                      ext: "v0",
                    },
                  },
                },
              },
            ],
            events: [],
          },
          {
            ext: "v0",
            changes: [
              {
                created: {
                  last_modified_ledger_seq: 640697,
                  data: {
                    trustline: {
                      account_id:
                        "GAZS54SYTI63HDRLI53CALG6VZLEZHBCMSJVMEOXJNTM46GM2E3MWJOH",
                      asset: {
                        credit_alphanum4: {
                          asset_code: "RICH",
                          issuer:
                            "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                        },
                      },
                      balance: "0",
                      limit: "100000000000",
                      flags: 1,
                      ext: "v0",
                    },
                  },
                  ext: {
                    v1: {
                      sponsoring_id:
                        "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                      ext: "v0",
                    },
                  },
                },
              },
              {
                state: {
                  last_modified_ledger_seq: 640697,
                  data: {
                    account: {
                      account_id:
                        "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                      balance: "97879997100",
                      seq_num: "2751721122037769",
                      num_sub_entries: 4,
                      inflation_dest: null,
                      flags: 0,
                      home_domain: "http://www.soneso.com",
                      thresholds: "01000000",
                      signers: [],
                      ext: {
                        v1: {
                          liabilities: {
                            buying: "325098038",
                            selling: "0",
                          },
                          ext: {
                            v2: {
                              num_sponsored: 0,
                              num_sponsoring: 5,
                              signer_sponsoring_i_ds: [],
                              ext: {
                                v3: {
                                  ext: "v0",
                                  seq_ledger: 640697,
                                  seq_time: "1769198959",
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
                  last_modified_ledger_seq: 640697,
                  data: {
                    account: {
                      account_id:
                        "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                      balance: "97879997100",
                      seq_num: "2751721122037769",
                      num_sub_entries: 4,
                      inflation_dest: null,
                      flags: 0,
                      home_domain: "http://www.soneso.com",
                      thresholds: "01000000",
                      signers: [],
                      ext: {
                        v1: {
                          liabilities: {
                            buying: "325098038",
                            selling: "0",
                          },
                          ext: {
                            v2: {
                              num_sponsored: 0,
                              num_sponsoring: 6,
                              signer_sponsoring_i_ds: [],
                              ext: {
                                v3: {
                                  ext: "v0",
                                  seq_ledger: 640697,
                                  seq_time: "1769198959",
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
                  last_modified_ledger_seq: 640697,
                  data: {
                    account: {
                      account_id:
                        "GAZS54SYTI63HDRLI53CALG6VZLEZHBCMSJVMEOXJNTM46GM2E3MWJOH",
                      balance: "100000000",
                      seq_num: "2751772661645312",
                      num_sub_entries: 1,
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
                              num_sponsored: 3,
                              num_sponsoring: 0,
                              signer_sponsoring_i_ds: [],
                              ext: "v0",
                            },
                          },
                        },
                      },
                    },
                  },
                  ext: {
                    v1: {
                      sponsoring_id:
                        "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                      ext: "v0",
                    },
                  },
                },
              },
              {
                updated: {
                  last_modified_ledger_seq: 640697,
                  data: {
                    account: {
                      account_id:
                        "GAZS54SYTI63HDRLI53CALG6VZLEZHBCMSJVMEOXJNTM46GM2E3MWJOH",
                      balance: "100000000",
                      seq_num: "2751772661645312",
                      num_sub_entries: 2,
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
                              num_sponsored: 4,
                              num_sponsoring: 0,
                              signer_sponsoring_i_ds: [],
                              ext: "v0",
                            },
                          },
                        },
                      },
                    },
                  },
                  ext: {
                    v1: {
                      sponsoring_id:
                        "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                      ext: "v0",
                    },
                  },
                },
              },
            ],
            events: [],
          },
          {
            ext: "v0",
            changes: [
              {
                state: {
                  last_modified_ledger_seq: 640697,
                  data: {
                    trustline: {
                      account_id:
                        "GAZS54SYTI63HDRLI53CALG6VZLEZHBCMSJVMEOXJNTM46GM2E3MWJOH",
                      asset: {
                        credit_alphanum4: {
                          asset_code: "RICH",
                          issuer:
                            "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                        },
                      },
                      balance: "0",
                      limit: "100000000000",
                      flags: 1,
                      ext: "v0",
                    },
                  },
                  ext: {
                    v1: {
                      sponsoring_id:
                        "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                      ext: "v0",
                    },
                  },
                },
              },
              {
                updated: {
                  last_modified_ledger_seq: 640697,
                  data: {
                    trustline: {
                      account_id:
                        "GAZS54SYTI63HDRLI53CALG6VZLEZHBCMSJVMEOXJNTM46GM2E3MWJOH",
                      asset: {
                        credit_alphanum4: {
                          asset_code: "RICH",
                          issuer:
                            "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                        },
                      },
                      balance: "1000000000",
                      limit: "100000000000",
                      flags: 1,
                      ext: "v0",
                    },
                  },
                  ext: {
                    v1: {
                      sponsoring_id:
                        "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                      ext: "v0",
                    },
                  },
                },
              },
            ],
            events: [
              {
                ext: "v0",
                contract_id:
                  "CCD3O4DJDPBTHSCJIHLSYTQ4WEWMHBGLNJIGC2DR7AACSCFKEH4BLDDU",
                type_: "contract",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "mint",
                      },
                      {
                        address:
                          "GAZS54SYTI63HDRLI53CALG6VZLEZHBCMSJVMEOXJNTM46GM2E3MWJOH",
                      },
                      {
                        string:
                          "RICH:GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                      },
                    ],
                    data: {
                      i128: "1000000000",
                    },
                  },
                },
              },
            ],
          },
          {
            ext: "v0",
            changes: [
              {
                created: {
                  last_modified_ledger_seq: 640697,
                  data: {
                    claimable_balance: {
                      balance_id:
                        "BAAG6WV7LERLAJCFFMBKBQY7G2HQN2FTD34GJKNOFJACUMIJ37OJTTHZR4",
                      claimants: [
                        {
                          claimant_type_v0: {
                            destination:
                              "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                            predicate: "unconditional",
                          },
                        },
                      ],
                      asset: "native",
                      amount: "20000000",
                      ext: "v0",
                    },
                  },
                  ext: {
                    v1: {
                      sponsoring_id:
                        "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                      ext: "v0",
                    },
                  },
                },
              },
              {
                state: {
                  last_modified_ledger_seq: 640697,
                  data: {
                    account: {
                      account_id:
                        "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                      balance: "97879997100",
                      seq_num: "2751721122037769",
                      num_sub_entries: 4,
                      inflation_dest: null,
                      flags: 0,
                      home_domain: "http://www.soneso.com",
                      thresholds: "01000000",
                      signers: [],
                      ext: {
                        v1: {
                          liabilities: {
                            buying: "325098038",
                            selling: "0",
                          },
                          ext: {
                            v2: {
                              num_sponsored: 0,
                              num_sponsoring: 6,
                              signer_sponsoring_i_ds: [],
                              ext: {
                                v3: {
                                  ext: "v0",
                                  seq_ledger: 640697,
                                  seq_time: "1769198959",
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
                  last_modified_ledger_seq: 640697,
                  data: {
                    account: {
                      account_id:
                        "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                      balance: "97879997100",
                      seq_num: "2751721122037769",
                      num_sub_entries: 4,
                      inflation_dest: null,
                      flags: 0,
                      home_domain: "http://www.soneso.com",
                      thresholds: "01000000",
                      signers: [],
                      ext: {
                        v1: {
                          liabilities: {
                            buying: "325098038",
                            selling: "0",
                          },
                          ext: {
                            v2: {
                              num_sponsored: 0,
                              num_sponsoring: 7,
                              signer_sponsoring_i_ds: [],
                              ext: {
                                v3: {
                                  ext: "v0",
                                  seq_ledger: 640697,
                                  seq_time: "1769198959",
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
                  last_modified_ledger_seq: 640697,
                  data: {
                    account: {
                      account_id:
                        "GAZS54SYTI63HDRLI53CALG6VZLEZHBCMSJVMEOXJNTM46GM2E3MWJOH",
                      balance: "100000000",
                      seq_num: "2751772661645312",
                      num_sub_entries: 2,
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
                              num_sponsored: 4,
                              num_sponsoring: 0,
                              signer_sponsoring_i_ds: [],
                              ext: "v0",
                            },
                          },
                        },
                      },
                    },
                  },
                  ext: {
                    v1: {
                      sponsoring_id:
                        "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                      ext: "v0",
                    },
                  },
                },
              },
              {
                updated: {
                  last_modified_ledger_seq: 640697,
                  data: {
                    account: {
                      account_id:
                        "GAZS54SYTI63HDRLI53CALG6VZLEZHBCMSJVMEOXJNTM46GM2E3MWJOH",
                      balance: "80000000",
                      seq_num: "2751772661645312",
                      num_sub_entries: 2,
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
                              num_sponsored: 4,
                              num_sponsoring: 0,
                              signer_sponsoring_i_ds: [],
                              ext: "v0",
                            },
                          },
                        },
                      },
                    },
                  },
                  ext: {
                    v1: {
                      sponsoring_id:
                        "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                      ext: "v0",
                    },
                  },
                },
              },
            ],
            events: [
              {
                ext: "v0",
                contract_id:
                  "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC",
                type_: "contract",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "transfer",
                      },
                      {
                        address:
                          "GAZS54SYTI63HDRLI53CALG6VZLEZHBCMSJVMEOXJNTM46GM2E3MWJOH",
                      },
                      {
                        address:
                          "BAAG6WV7LERLAJCFFMBKBQY7G2HQN2FTD34GJKNOFJACUMIJ37OJTTHZR4",
                      },
                      {
                        string: "native",
                      },
                    ],
                    data: {
                      i128: "20000000",
                    },
                  },
                },
              },
            ],
          },
          {
            ext: "v0",
            changes: [
              {
                state: {
                  last_modified_ledger_seq: 640697,
                  data: {
                    account: {
                      account_id:
                        "GAZS54SYTI63HDRLI53CALG6VZLEZHBCMSJVMEOXJNTM46GM2E3MWJOH",
                      balance: "80000000",
                      seq_num: "2751772661645312",
                      num_sub_entries: 2,
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
                              num_sponsored: 4,
                              num_sponsoring: 0,
                              signer_sponsoring_i_ds: [],
                              ext: "v0",
                            },
                          },
                        },
                      },
                    },
                  },
                  ext: {
                    v1: {
                      sponsoring_id:
                        "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                      ext: "v0",
                    },
                  },
                },
              },
              {
                updated: {
                  last_modified_ledger_seq: 640697,
                  data: {
                    account: {
                      account_id:
                        "GAZS54SYTI63HDRLI53CALG6VZLEZHBCMSJVMEOXJNTM46GM2E3MWJOH",
                      balance: "80000000",
                      seq_num: "2751772661645312",
                      num_sub_entries: 3,
                      inflation_dest: null,
                      flags: 0,
                      home_domain: "",
                      thresholds: "01000000",
                      signers: [],
                      ext: {
                        v1: {
                          liabilities: {
                            buying: "40000000",
                            selling: "0",
                          },
                          ext: {
                            v2: {
                              num_sponsored: 5,
                              num_sponsoring: 0,
                              signer_sponsoring_i_ds: [],
                              ext: "v0",
                            },
                          },
                        },
                      },
                    },
                  },
                  ext: {
                    v1: {
                      sponsoring_id:
                        "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                      ext: "v0",
                    },
                  },
                },
              },
              {
                state: {
                  last_modified_ledger_seq: 640697,
                  data: {
                    account: {
                      account_id:
                        "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                      balance: "97879997100",
                      seq_num: "2751721122037769",
                      num_sub_entries: 4,
                      inflation_dest: null,
                      flags: 0,
                      home_domain: "http://www.soneso.com",
                      thresholds: "01000000",
                      signers: [],
                      ext: {
                        v1: {
                          liabilities: {
                            buying: "325098038",
                            selling: "0",
                          },
                          ext: {
                            v2: {
                              num_sponsored: 0,
                              num_sponsoring: 7,
                              signer_sponsoring_i_ds: [],
                              ext: {
                                v3: {
                                  ext: "v0",
                                  seq_ledger: 640697,
                                  seq_time: "1769198959",
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
                  last_modified_ledger_seq: 640697,
                  data: {
                    account: {
                      account_id:
                        "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                      balance: "97879997100",
                      seq_num: "2751721122037769",
                      num_sub_entries: 4,
                      inflation_dest: null,
                      flags: 0,
                      home_domain: "http://www.soneso.com",
                      thresholds: "01000000",
                      signers: [],
                      ext: {
                        v1: {
                          liabilities: {
                            buying: "325098038",
                            selling: "0",
                          },
                          ext: {
                            v2: {
                              num_sponsored: 0,
                              num_sponsoring: 8,
                              signer_sponsoring_i_ds: [],
                              ext: {
                                v3: {
                                  ext: "v0",
                                  seq_ledger: 640697,
                                  seq_time: "1769198959",
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
                created: {
                  last_modified_ledger_seq: 640697,
                  data: {
                    offer: {
                      seller_id:
                        "GAZS54SYTI63HDRLI53CALG6VZLEZHBCMSJVMEOXJNTM46GM2E3MWJOH",
                      offer_id: "16952",
                      selling: {
                        credit_alphanum4: {
                          asset_code: "RICH",
                          issuer:
                            "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                        },
                      },
                      buying: "native",
                      amount: "100000000",
                      price: {
                        n: 2,
                        d: 5,
                      },
                      flags: 0,
                      ext: "v0",
                    },
                  },
                  ext: {
                    v1: {
                      sponsoring_id:
                        "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                      ext: "v0",
                    },
                  },
                },
              },
              {
                state: {
                  last_modified_ledger_seq: 640697,
                  data: {
                    trustline: {
                      account_id:
                        "GAZS54SYTI63HDRLI53CALG6VZLEZHBCMSJVMEOXJNTM46GM2E3MWJOH",
                      asset: {
                        credit_alphanum4: {
                          asset_code: "RICH",
                          issuer:
                            "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                        },
                      },
                      balance: "1000000000",
                      limit: "100000000000",
                      flags: 1,
                      ext: "v0",
                    },
                  },
                  ext: {
                    v1: {
                      sponsoring_id:
                        "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                      ext: "v0",
                    },
                  },
                },
              },
              {
                updated: {
                  last_modified_ledger_seq: 640697,
                  data: {
                    trustline: {
                      account_id:
                        "GAZS54SYTI63HDRLI53CALG6VZLEZHBCMSJVMEOXJNTM46GM2E3MWJOH",
                      asset: {
                        credit_alphanum4: {
                          asset_code: "RICH",
                          issuer:
                            "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                        },
                      },
                      balance: "1000000000",
                      limit: "100000000000",
                      flags: 1,
                      ext: {
                        v1: {
                          liabilities: {
                            buying: "0",
                            selling: "100000000",
                          },
                          ext: "v0",
                        },
                      },
                    },
                  },
                  ext: {
                    v1: {
                      sponsoring_id:
                        "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                      ext: "v0",
                    },
                  },
                },
              },
            ],
            events: [],
          },
          {
            ext: "v0",
            changes: [
              {
                state: {
                  last_modified_ledger_seq: 640697,
                  data: {
                    account: {
                      account_id:
                        "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                      balance: "97879997100",
                      seq_num: "2751721122037769",
                      num_sub_entries: 4,
                      inflation_dest: null,
                      flags: 0,
                      home_domain: "http://www.soneso.com",
                      thresholds: "01000000",
                      signers: [],
                      ext: {
                        v1: {
                          liabilities: {
                            buying: "325098038",
                            selling: "0",
                          },
                          ext: {
                            v2: {
                              num_sponsored: 0,
                              num_sponsoring: 8,
                              signer_sponsoring_i_ds: [],
                              ext: {
                                v3: {
                                  ext: "v0",
                                  seq_ledger: 640697,
                                  seq_time: "1769198959",
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
                  last_modified_ledger_seq: 640697,
                  data: {
                    account: {
                      account_id:
                        "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                      balance: "97879997100",
                      seq_num: "2751721122037769",
                      num_sub_entries: 4,
                      inflation_dest: null,
                      flags: 0,
                      home_domain: "http://www.soneso.com",
                      thresholds: "01000000",
                      signers: [],
                      ext: {
                        v1: {
                          liabilities: {
                            buying: "325098038",
                            selling: "0",
                          },
                          ext: {
                            v2: {
                              num_sponsored: 0,
                              num_sponsoring: 9,
                              signer_sponsoring_i_ds: [],
                              ext: {
                                v3: {
                                  ext: "v0",
                                  seq_ledger: 640697,
                                  seq_time: "1769198959",
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
                  last_modified_ledger_seq: 640697,
                  data: {
                    account: {
                      account_id:
                        "GAZS54SYTI63HDRLI53CALG6VZLEZHBCMSJVMEOXJNTM46GM2E3MWJOH",
                      balance: "80000000",
                      seq_num: "2751772661645312",
                      num_sub_entries: 3,
                      inflation_dest: null,
                      flags: 0,
                      home_domain: "",
                      thresholds: "01000000",
                      signers: [],
                      ext: {
                        v1: {
                          liabilities: {
                            buying: "40000000",
                            selling: "0",
                          },
                          ext: {
                            v2: {
                              num_sponsored: 5,
                              num_sponsoring: 0,
                              signer_sponsoring_i_ds: [],
                              ext: "v0",
                            },
                          },
                        },
                      },
                    },
                  },
                  ext: {
                    v1: {
                      sponsoring_id:
                        "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                      ext: "v0",
                    },
                  },
                },
              },
              {
                updated: {
                  last_modified_ledger_seq: 640697,
                  data: {
                    account: {
                      account_id:
                        "GAZS54SYTI63HDRLI53CALG6VZLEZHBCMSJVMEOXJNTM46GM2E3MWJOH",
                      balance: "80000000",
                      seq_num: "2751772661645312",
                      num_sub_entries: 4,
                      inflation_dest: null,
                      flags: 0,
                      home_domain: "",
                      thresholds: "01000000",
                      signers: [
                        {
                          key: "XBXJI2RSI2IAD4EYJJH6PXYSEXQ7BKA56KVMIXPYQ3O2FOXUTAIJIAL2",
                          weight: 1,
                        },
                      ],
                      ext: {
                        v1: {
                          liabilities: {
                            buying: "40000000",
                            selling: "0",
                          },
                          ext: {
                            v2: {
                              num_sponsored: 6,
                              num_sponsoring: 0,
                              signer_sponsoring_i_ds: [
                                "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                              ],
                              ext: "v0",
                            },
                          },
                        },
                      },
                    },
                  },
                  ext: {
                    v1: {
                      sponsoring_id:
                        "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                      ext: "v0",
                    },
                  },
                },
              },
            ],
            events: [],
          },
          {
            ext: "v0",
            changes: [
              {
                state: {
                  last_modified_ledger_seq: 640697,
                  data: {
                    account: {
                      account_id:
                        "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                      balance: "97879997100",
                      seq_num: "2751721122037769",
                      num_sub_entries: 4,
                      inflation_dest: null,
                      flags: 0,
                      home_domain: "http://www.soneso.com",
                      thresholds: "01000000",
                      signers: [],
                      ext: {
                        v1: {
                          liabilities: {
                            buying: "325098038",
                            selling: "0",
                          },
                          ext: {
                            v2: {
                              num_sponsored: 0,
                              num_sponsoring: 9,
                              signer_sponsoring_i_ds: [],
                              ext: {
                                v3: {
                                  ext: "v0",
                                  seq_ledger: 640697,
                                  seq_time: "1769198959",
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
                  last_modified_ledger_seq: 640697,
                  data: {
                    account: {
                      account_id:
                        "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                      balance: "97879997100",
                      seq_num: "2751721122037769",
                      num_sub_entries: 4,
                      inflation_dest: null,
                      flags: 0,
                      home_domain: "http://www.soneso.com",
                      thresholds: "01000000",
                      signers: [],
                      ext: {
                        v1: {
                          liabilities: {
                            buying: "325098038",
                            selling: "0",
                          },
                          ext: {
                            v2: {
                              num_sponsored: 0,
                              num_sponsoring: 10,
                              signer_sponsoring_i_ds: [],
                              ext: {
                                v3: {
                                  ext: "v0",
                                  seq_ledger: 640697,
                                  seq_time: "1769198959",
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
                  last_modified_ledger_seq: 640697,
                  data: {
                    account: {
                      account_id:
                        "GAZS54SYTI63HDRLI53CALG6VZLEZHBCMSJVMEOXJNTM46GM2E3MWJOH",
                      balance: "80000000",
                      seq_num: "2751772661645312",
                      num_sub_entries: 4,
                      inflation_dest: null,
                      flags: 0,
                      home_domain: "",
                      thresholds: "01000000",
                      signers: [
                        {
                          key: "XBXJI2RSI2IAD4EYJJH6PXYSEXQ7BKA56KVMIXPYQ3O2FOXUTAIJIAL2",
                          weight: 1,
                        },
                      ],
                      ext: {
                        v1: {
                          liabilities: {
                            buying: "40000000",
                            selling: "0",
                          },
                          ext: {
                            v2: {
                              num_sponsored: 6,
                              num_sponsoring: 0,
                              signer_sponsoring_i_ds: [
                                "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                              ],
                              ext: "v0",
                            },
                          },
                        },
                      },
                    },
                  },
                  ext: {
                    v1: {
                      sponsoring_id:
                        "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                      ext: "v0",
                    },
                  },
                },
              },
              {
                updated: {
                  last_modified_ledger_seq: 640697,
                  data: {
                    account: {
                      account_id:
                        "GAZS54SYTI63HDRLI53CALG6VZLEZHBCMSJVMEOXJNTM46GM2E3MWJOH",
                      balance: "80000000",
                      seq_num: "2751772661645312",
                      num_sub_entries: 5,
                      inflation_dest: null,
                      flags: 0,
                      home_domain: "",
                      thresholds: "01000000",
                      signers: [
                        {
                          key: "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                          weight: 1,
                        },
                        {
                          key: "XBXJI2RSI2IAD4EYJJH6PXYSEXQ7BKA56KVMIXPYQ3O2FOXUTAIJIAL2",
                          weight: 1,
                        },
                      ],
                      ext: {
                        v1: {
                          liabilities: {
                            buying: "40000000",
                            selling: "0",
                          },
                          ext: {
                            v2: {
                              num_sponsored: 7,
                              num_sponsoring: 0,
                              signer_sponsoring_i_ds: [
                                "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                                "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                              ],
                              ext: "v0",
                            },
                          },
                        },
                      },
                    },
                  },
                  ext: {
                    v1: {
                      sponsoring_id:
                        "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                      ext: "v0",
                    },
                  },
                },
              },
            ],
            events: [],
          },
          {
            ext: "v0",
            changes: [],
            events: [],
          },
          {
            ext: "v0",
            changes: [
              {
                state: {
                  last_modified_ledger_seq: 640697,
                  data: {
                    account: {
                      account_id:
                        "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                      balance: "97879997100",
                      seq_num: "2751721122037769",
                      num_sub_entries: 4,
                      inflation_dest: null,
                      flags: 0,
                      home_domain: "http://www.soneso.com",
                      thresholds: "01000000",
                      signers: [],
                      ext: {
                        v1: {
                          liabilities: {
                            buying: "325098038",
                            selling: "0",
                          },
                          ext: {
                            v2: {
                              num_sponsored: 0,
                              num_sponsoring: 10,
                              signer_sponsoring_i_ds: [],
                              ext: {
                                v3: {
                                  ext: "v0",
                                  seq_ledger: 640697,
                                  seq_time: "1769198959",
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
                  last_modified_ledger_seq: 640697,
                  data: {
                    account: {
                      account_id:
                        "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                      balance: "97879997100",
                      seq_num: "2751721122037769",
                      num_sub_entries: 4,
                      inflation_dest: null,
                      flags: 0,
                      home_domain: "http://www.soneso.com",
                      thresholds: "01000000",
                      signers: [],
                      ext: {
                        v1: {
                          liabilities: {
                            buying: "325098038",
                            selling: "0",
                          },
                          ext: {
                            v2: {
                              num_sponsored: 0,
                              num_sponsoring: 8,
                              signer_sponsoring_i_ds: [],
                              ext: {
                                v3: {
                                  ext: "v0",
                                  seq_ledger: 640697,
                                  seq_time: "1769198959",
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
                  last_modified_ledger_seq: 640697,
                  data: {
                    account: {
                      account_id:
                        "GAZS54SYTI63HDRLI53CALG6VZLEZHBCMSJVMEOXJNTM46GM2E3MWJOH",
                      balance: "80000000",
                      seq_num: "2751772661645312",
                      num_sub_entries: 5,
                      inflation_dest: null,
                      flags: 0,
                      home_domain: "",
                      thresholds: "01000000",
                      signers: [
                        {
                          key: "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                          weight: 1,
                        },
                        {
                          key: "XBXJI2RSI2IAD4EYJJH6PXYSEXQ7BKA56KVMIXPYQ3O2FOXUTAIJIAL2",
                          weight: 1,
                        },
                      ],
                      ext: {
                        v1: {
                          liabilities: {
                            buying: "40000000",
                            selling: "0",
                          },
                          ext: {
                            v2: {
                              num_sponsored: 7,
                              num_sponsoring: 0,
                              signer_sponsoring_i_ds: [
                                "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                                "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                              ],
                              ext: "v0",
                            },
                          },
                        },
                      },
                    },
                  },
                  ext: {
                    v1: {
                      sponsoring_id:
                        "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                      ext: "v0",
                    },
                  },
                },
              },
              {
                updated: {
                  last_modified_ledger_seq: 640697,
                  data: {
                    account: {
                      account_id:
                        "GAZS54SYTI63HDRLI53CALG6VZLEZHBCMSJVMEOXJNTM46GM2E3MWJOH",
                      balance: "80000000",
                      seq_num: "2751772661645312",
                      num_sub_entries: 5,
                      inflation_dest: null,
                      flags: 0,
                      home_domain: "",
                      thresholds: "01000000",
                      signers: [
                        {
                          key: "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                          weight: 1,
                        },
                        {
                          key: "XBXJI2RSI2IAD4EYJJH6PXYSEXQ7BKA56KVMIXPYQ3O2FOXUTAIJIAL2",
                          weight: 1,
                        },
                      ],
                      ext: {
                        v1: {
                          liabilities: {
                            buying: "40000000",
                            selling: "0",
                          },
                          ext: {
                            v2: {
                              num_sponsored: 5,
                              num_sponsoring: 0,
                              signer_sponsoring_i_ds: [
                                "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                                "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                              ],
                              ext: "v0",
                            },
                          },
                        },
                      },
                    },
                  },
                  ext: {
                    v1: {
                      sponsoring_id: null,
                      ext: "v0",
                    },
                  },
                },
              },
            ],
            events: [],
          },
          {
            ext: "v0",
            changes: [
              {
                state: {
                  last_modified_ledger_seq: 640697,
                  data: {
                    account: {
                      account_id:
                        "GAZS54SYTI63HDRLI53CALG6VZLEZHBCMSJVMEOXJNTM46GM2E3MWJOH",
                      balance: "80000000",
                      seq_num: "2751772661645312",
                      num_sub_entries: 5,
                      inflation_dest: null,
                      flags: 0,
                      home_domain: "",
                      thresholds: "01000000",
                      signers: [
                        {
                          key: "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                          weight: 1,
                        },
                        {
                          key: "XBXJI2RSI2IAD4EYJJH6PXYSEXQ7BKA56KVMIXPYQ3O2FOXUTAIJIAL2",
                          weight: 1,
                        },
                      ],
                      ext: {
                        v1: {
                          liabilities: {
                            buying: "40000000",
                            selling: "0",
                          },
                          ext: {
                            v2: {
                              num_sponsored: 5,
                              num_sponsoring: 0,
                              signer_sponsoring_i_ds: [
                                "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                                "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                              ],
                              ext: "v0",
                            },
                          },
                        },
                      },
                    },
                  },
                  ext: {
                    v1: {
                      sponsoring_id: null,
                      ext: "v0",
                    },
                  },
                },
              },
              {
                updated: {
                  last_modified_ledger_seq: 640697,
                  data: {
                    account: {
                      account_id:
                        "GAZS54SYTI63HDRLI53CALG6VZLEZHBCMSJVMEOXJNTM46GM2E3MWJOH",
                      balance: "80000000",
                      seq_num: "2751772661645312",
                      num_sub_entries: 5,
                      inflation_dest: null,
                      flags: 0,
                      home_domain: "",
                      thresholds: "01000000",
                      signers: [
                        {
                          key: "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                          weight: 1,
                        },
                        {
                          key: "XBXJI2RSI2IAD4EYJJH6PXYSEXQ7BKA56KVMIXPYQ3O2FOXUTAIJIAL2",
                          weight: 1,
                        },
                      ],
                      ext: {
                        v1: {
                          liabilities: {
                            buying: "40000000",
                            selling: "0",
                          },
                          ext: {
                            v2: {
                              num_sponsored: 4,
                              num_sponsoring: 0,
                              signer_sponsoring_i_ds: [
                                "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                                "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                              ],
                              ext: "v0",
                            },
                          },
                        },
                      },
                    },
                  },
                  ext: {
                    v1: {
                      sponsoring_id: null,
                      ext: "v0",
                    },
                  },
                },
              },
              {
                state: {
                  last_modified_ledger_seq: 640697,
                  data: {
                    account: {
                      account_id:
                        "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                      balance: "97879997100",
                      seq_num: "2751721122037769",
                      num_sub_entries: 4,
                      inflation_dest: null,
                      flags: 0,
                      home_domain: "http://www.soneso.com",
                      thresholds: "01000000",
                      signers: [],
                      ext: {
                        v1: {
                          liabilities: {
                            buying: "325098038",
                            selling: "0",
                          },
                          ext: {
                            v2: {
                              num_sponsored: 0,
                              num_sponsoring: 8,
                              signer_sponsoring_i_ds: [],
                              ext: {
                                v3: {
                                  ext: "v0",
                                  seq_ledger: 640697,
                                  seq_time: "1769198959",
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
                  last_modified_ledger_seq: 640697,
                  data: {
                    account: {
                      account_id:
                        "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                      balance: "97879997100",
                      seq_num: "2751721122037769",
                      num_sub_entries: 4,
                      inflation_dest: null,
                      flags: 0,
                      home_domain: "http://www.soneso.com",
                      thresholds: "01000000",
                      signers: [],
                      ext: {
                        v1: {
                          liabilities: {
                            buying: "325098038",
                            selling: "0",
                          },
                          ext: {
                            v2: {
                              num_sponsored: 0,
                              num_sponsoring: 7,
                              signer_sponsoring_i_ds: [],
                              ext: {
                                v3: {
                                  ext: "v0",
                                  seq_ledger: 640697,
                                  seq_time: "1769198959",
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
                  last_modified_ledger_seq: 640697,
                  data: {
                    data: {
                      account_id:
                        "GAZS54SYTI63HDRLI53CALG6VZLEZHBCMSJVMEOXJNTM46GM2E3MWJOH",
                      data_name: "soneso",
                      data_value: "6973207375706572",
                      ext: "v0",
                    },
                  },
                  ext: {
                    v1: {
                      sponsoring_id:
                        "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                      ext: "v0",
                    },
                  },
                },
              },
              {
                updated: {
                  last_modified_ledger_seq: 640697,
                  data: {
                    data: {
                      account_id:
                        "GAZS54SYTI63HDRLI53CALG6VZLEZHBCMSJVMEOXJNTM46GM2E3MWJOH",
                      data_name: "soneso",
                      data_value: "6973207375706572",
                      ext: "v0",
                    },
                  },
                  ext: {
                    v1: {
                      sponsoring_id: null,
                      ext: "v0",
                    },
                  },
                },
              },
            ],
            events: [],
          },
          {
            ext: "v0",
            changes: [
              {
                state: {
                  last_modified_ledger_seq: 640697,
                  data: {
                    account: {
                      account_id:
                        "GAZS54SYTI63HDRLI53CALG6VZLEZHBCMSJVMEOXJNTM46GM2E3MWJOH",
                      balance: "80000000",
                      seq_num: "2751772661645312",
                      num_sub_entries: 5,
                      inflation_dest: null,
                      flags: 0,
                      home_domain: "",
                      thresholds: "01000000",
                      signers: [
                        {
                          key: "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                          weight: 1,
                        },
                        {
                          key: "XBXJI2RSI2IAD4EYJJH6PXYSEXQ7BKA56KVMIXPYQ3O2FOXUTAIJIAL2",
                          weight: 1,
                        },
                      ],
                      ext: {
                        v1: {
                          liabilities: {
                            buying: "40000000",
                            selling: "0",
                          },
                          ext: {
                            v2: {
                              num_sponsored: 4,
                              num_sponsoring: 0,
                              signer_sponsoring_i_ds: [
                                "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                                "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                              ],
                              ext: "v0",
                            },
                          },
                        },
                      },
                    },
                  },
                  ext: {
                    v1: {
                      sponsoring_id: null,
                      ext: "v0",
                    },
                  },
                },
              },
              {
                updated: {
                  last_modified_ledger_seq: 640697,
                  data: {
                    account: {
                      account_id:
                        "GAZS54SYTI63HDRLI53CALG6VZLEZHBCMSJVMEOXJNTM46GM2E3MWJOH",
                      balance: "80000000",
                      seq_num: "2751772661645312",
                      num_sub_entries: 5,
                      inflation_dest: null,
                      flags: 0,
                      home_domain: "",
                      thresholds: "01000000",
                      signers: [
                        {
                          key: "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                          weight: 1,
                        },
                        {
                          key: "XBXJI2RSI2IAD4EYJJH6PXYSEXQ7BKA56KVMIXPYQ3O2FOXUTAIJIAL2",
                          weight: 1,
                        },
                      ],
                      ext: {
                        v1: {
                          liabilities: {
                            buying: "40000000",
                            selling: "0",
                          },
                          ext: {
                            v2: {
                              num_sponsored: 3,
                              num_sponsoring: 0,
                              signer_sponsoring_i_ds: [
                                "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                                "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                              ],
                              ext: "v0",
                            },
                          },
                        },
                      },
                    },
                  },
                  ext: {
                    v1: {
                      sponsoring_id: null,
                      ext: "v0",
                    },
                  },
                },
              },
              {
                state: {
                  last_modified_ledger_seq: 640697,
                  data: {
                    account: {
                      account_id:
                        "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                      balance: "97879997100",
                      seq_num: "2751721122037769",
                      num_sub_entries: 4,
                      inflation_dest: null,
                      flags: 0,
                      home_domain: "http://www.soneso.com",
                      thresholds: "01000000",
                      signers: [],
                      ext: {
                        v1: {
                          liabilities: {
                            buying: "325098038",
                            selling: "0",
                          },
                          ext: {
                            v2: {
                              num_sponsored: 0,
                              num_sponsoring: 7,
                              signer_sponsoring_i_ds: [],
                              ext: {
                                v3: {
                                  ext: "v0",
                                  seq_ledger: 640697,
                                  seq_time: "1769198959",
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
                  last_modified_ledger_seq: 640697,
                  data: {
                    account: {
                      account_id:
                        "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                      balance: "97879997100",
                      seq_num: "2751721122037769",
                      num_sub_entries: 4,
                      inflation_dest: null,
                      flags: 0,
                      home_domain: "http://www.soneso.com",
                      thresholds: "01000000",
                      signers: [],
                      ext: {
                        v1: {
                          liabilities: {
                            buying: "325098038",
                            selling: "0",
                          },
                          ext: {
                            v2: {
                              num_sponsored: 0,
                              num_sponsoring: 6,
                              signer_sponsoring_i_ds: [],
                              ext: {
                                v3: {
                                  ext: "v0",
                                  seq_ledger: 640697,
                                  seq_time: "1769198959",
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
                  last_modified_ledger_seq: 640697,
                  data: {
                    trustline: {
                      account_id:
                        "GAZS54SYTI63HDRLI53CALG6VZLEZHBCMSJVMEOXJNTM46GM2E3MWJOH",
                      asset: {
                        credit_alphanum4: {
                          asset_code: "RICH",
                          issuer:
                            "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                        },
                      },
                      balance: "1000000000",
                      limit: "100000000000",
                      flags: 1,
                      ext: {
                        v1: {
                          liabilities: {
                            buying: "0",
                            selling: "100000000",
                          },
                          ext: "v0",
                        },
                      },
                    },
                  },
                  ext: {
                    v1: {
                      sponsoring_id:
                        "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                      ext: "v0",
                    },
                  },
                },
              },
              {
                updated: {
                  last_modified_ledger_seq: 640697,
                  data: {
                    trustline: {
                      account_id:
                        "GAZS54SYTI63HDRLI53CALG6VZLEZHBCMSJVMEOXJNTM46GM2E3MWJOH",
                      asset: {
                        credit_alphanum4: {
                          asset_code: "RICH",
                          issuer:
                            "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                        },
                      },
                      balance: "1000000000",
                      limit: "100000000000",
                      flags: 1,
                      ext: {
                        v1: {
                          liabilities: {
                            buying: "0",
                            selling: "100000000",
                          },
                          ext: "v0",
                        },
                      },
                    },
                  },
                  ext: {
                    v1: {
                      sponsoring_id: null,
                      ext: "v0",
                    },
                  },
                },
              },
            ],
            events: [],
          },
          {
            ext: "v0",
            changes: [
              {
                state: {
                  last_modified_ledger_seq: 640697,
                  data: {
                    account: {
                      account_id:
                        "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                      balance: "97879997100",
                      seq_num: "2751721122037769",
                      num_sub_entries: 4,
                      inflation_dest: null,
                      flags: 0,
                      home_domain: "http://www.soneso.com",
                      thresholds: "01000000",
                      signers: [],
                      ext: {
                        v1: {
                          liabilities: {
                            buying: "325098038",
                            selling: "0",
                          },
                          ext: {
                            v2: {
                              num_sponsored: 0,
                              num_sponsoring: 6,
                              signer_sponsoring_i_ds: [],
                              ext: {
                                v3: {
                                  ext: "v0",
                                  seq_ledger: 640697,
                                  seq_time: "1769198959",
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
                  last_modified_ledger_seq: 640697,
                  data: {
                    account: {
                      account_id:
                        "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                      balance: "97879997100",
                      seq_num: "2751721122037769",
                      num_sub_entries: 4,
                      inflation_dest: null,
                      flags: 0,
                      home_domain: "http://www.soneso.com",
                      thresholds: "01000000",
                      signers: [],
                      ext: {
                        v1: {
                          liabilities: {
                            buying: "325098038",
                            selling: "0",
                          },
                          ext: {
                            v2: {
                              num_sponsored: 0,
                              num_sponsoring: 5,
                              signer_sponsoring_i_ds: [],
                              ext: {
                                v3: {
                                  ext: "v0",
                                  seq_ledger: 640697,
                                  seq_time: "1769198959",
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
                  last_modified_ledger_seq: 640697,
                  data: {
                    account: {
                      account_id:
                        "GAZS54SYTI63HDRLI53CALG6VZLEZHBCMSJVMEOXJNTM46GM2E3MWJOH",
                      balance: "80000000",
                      seq_num: "2751772661645312",
                      num_sub_entries: 5,
                      inflation_dest: null,
                      flags: 0,
                      home_domain: "",
                      thresholds: "01000000",
                      signers: [
                        {
                          key: "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                          weight: 1,
                        },
                        {
                          key: "XBXJI2RSI2IAD4EYJJH6PXYSEXQ7BKA56KVMIXPYQ3O2FOXUTAIJIAL2",
                          weight: 1,
                        },
                      ],
                      ext: {
                        v1: {
                          liabilities: {
                            buying: "40000000",
                            selling: "0",
                          },
                          ext: {
                            v2: {
                              num_sponsored: 3,
                              num_sponsoring: 0,
                              signer_sponsoring_i_ds: [
                                "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                                "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                              ],
                              ext: "v0",
                            },
                          },
                        },
                      },
                    },
                  },
                  ext: {
                    v1: {
                      sponsoring_id: null,
                      ext: "v0",
                    },
                  },
                },
              },
              {
                updated: {
                  last_modified_ledger_seq: 640697,
                  data: {
                    account: {
                      account_id:
                        "GAZS54SYTI63HDRLI53CALG6VZLEZHBCMSJVMEOXJNTM46GM2E3MWJOH",
                      balance: "80000000",
                      seq_num: "2751772661645312",
                      num_sub_entries: 5,
                      inflation_dest: null,
                      flags: 0,
                      home_domain: "",
                      thresholds: "01000000",
                      signers: [
                        {
                          key: "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                          weight: 1,
                        },
                        {
                          key: "XBXJI2RSI2IAD4EYJJH6PXYSEXQ7BKA56KVMIXPYQ3O2FOXUTAIJIAL2",
                          weight: 1,
                        },
                      ],
                      ext: {
                        v1: {
                          liabilities: {
                            buying: "40000000",
                            selling: "0",
                          },
                          ext: {
                            v2: {
                              num_sponsored: 2,
                              num_sponsoring: 0,
                              signer_sponsoring_i_ds: [
                                "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                                null,
                              ],
                              ext: "v0",
                            },
                          },
                        },
                      },
                    },
                  },
                  ext: {
                    v1: {
                      sponsoring_id: null,
                      ext: "v0",
                    },
                  },
                },
              },
            ],
            events: [],
          },
          {
            ext: "v0",
            changes: [
              {
                state: {
                  last_modified_ledger_seq: 640697,
                  data: {
                    account: {
                      account_id:
                        "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                      balance: "97879997100",
                      seq_num: "2751721122037769",
                      num_sub_entries: 4,
                      inflation_dest: null,
                      flags: 0,
                      home_domain: "http://www.soneso.com",
                      thresholds: "01000000",
                      signers: [],
                      ext: {
                        v1: {
                          liabilities: {
                            buying: "325098038",
                            selling: "0",
                          },
                          ext: {
                            v2: {
                              num_sponsored: 0,
                              num_sponsoring: 5,
                              signer_sponsoring_i_ds: [],
                              ext: {
                                v3: {
                                  ext: "v0",
                                  seq_ledger: 640697,
                                  seq_time: "1769198959",
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
                  last_modified_ledger_seq: 640697,
                  data: {
                    account: {
                      account_id:
                        "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                      balance: "97879997100",
                      seq_num: "2751721122037769",
                      num_sub_entries: 4,
                      inflation_dest: null,
                      flags: 0,
                      home_domain: "http://www.soneso.com",
                      thresholds: "01000000",
                      signers: [],
                      ext: {
                        v1: {
                          liabilities: {
                            buying: "325098038",
                            selling: "0",
                          },
                          ext: {
                            v2: {
                              num_sponsored: 0,
                              num_sponsoring: 4,
                              signer_sponsoring_i_ds: [],
                              ext: {
                                v3: {
                                  ext: "v0",
                                  seq_ledger: 640697,
                                  seq_time: "1769198959",
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
                  last_modified_ledger_seq: 640697,
                  data: {
                    account: {
                      account_id:
                        "GAZS54SYTI63HDRLI53CALG6VZLEZHBCMSJVMEOXJNTM46GM2E3MWJOH",
                      balance: "80000000",
                      seq_num: "2751772661645312",
                      num_sub_entries: 5,
                      inflation_dest: null,
                      flags: 0,
                      home_domain: "",
                      thresholds: "01000000",
                      signers: [
                        {
                          key: "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                          weight: 1,
                        },
                        {
                          key: "XBXJI2RSI2IAD4EYJJH6PXYSEXQ7BKA56KVMIXPYQ3O2FOXUTAIJIAL2",
                          weight: 1,
                        },
                      ],
                      ext: {
                        v1: {
                          liabilities: {
                            buying: "40000000",
                            selling: "0",
                          },
                          ext: {
                            v2: {
                              num_sponsored: 2,
                              num_sponsoring: 0,
                              signer_sponsoring_i_ds: [
                                "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                                null,
                              ],
                              ext: "v0",
                            },
                          },
                        },
                      },
                    },
                  },
                  ext: {
                    v1: {
                      sponsoring_id: null,
                      ext: "v0",
                    },
                  },
                },
              },
              {
                updated: {
                  last_modified_ledger_seq: 640697,
                  data: {
                    account: {
                      account_id:
                        "GAZS54SYTI63HDRLI53CALG6VZLEZHBCMSJVMEOXJNTM46GM2E3MWJOH",
                      balance: "80000000",
                      seq_num: "2751772661645312",
                      num_sub_entries: 5,
                      inflation_dest: null,
                      flags: 0,
                      home_domain: "",
                      thresholds: "01000000",
                      signers: [
                        {
                          key: "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                          weight: 1,
                        },
                        {
                          key: "XBXJI2RSI2IAD4EYJJH6PXYSEXQ7BKA56KVMIXPYQ3O2FOXUTAIJIAL2",
                          weight: 1,
                        },
                      ],
                      ext: {
                        v1: {
                          liabilities: {
                            buying: "40000000",
                            selling: "0",
                          },
                          ext: {
                            v2: {
                              num_sponsored: 1,
                              num_sponsoring: 0,
                              signer_sponsoring_i_ds: [null, null],
                              ext: "v0",
                            },
                          },
                        },
                      },
                    },
                  },
                  ext: {
                    v1: {
                      sponsoring_id: null,
                      ext: "v0",
                    },
                  },
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
                        "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                    },
                  ],
                  data: {
                    i128: "1500",
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
                      "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                  },
                ],
                data: {
                  i128: "1500",
                },
              },
            },
          },
        },
      ],
      contractEventsJson: [
        [],
        [
          {
            ext: "v0",
            contract_id:
              "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC",
            type_: "contract",
            body: {
              v0: {
                topics: [
                  {
                    symbol: "transfer",
                  },
                  {
                    address:
                      "GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                  },
                  {
                    address:
                      "GAZS54SYTI63HDRLI53CALG6VZLEZHBCMSJVMEOXJNTM46GM2E3MWJOH",
                  },
                  {
                    string: "native",
                  },
                ],
                data: {
                  i128: "100000000",
                },
              },
            },
          },
        ],
        [],
        [],
        [
          {
            ext: "v0",
            contract_id:
              "CCD3O4DJDPBTHSCJIHLSYTQ4WEWMHBGLNJIGC2DR7AACSCFKEH4BLDDU",
            type_: "contract",
            body: {
              v0: {
                topics: [
                  {
                    symbol: "mint",
                  },
                  {
                    address:
                      "GAZS54SYTI63HDRLI53CALG6VZLEZHBCMSJVMEOXJNTM46GM2E3MWJOH",
                  },
                  {
                    string:
                      "RICH:GDICIXIQE4GKQ2VX77AFESEVQPE7UQJDNUYPKVDE6LNLQWBLAOLROAQB",
                  },
                ],
                data: {
                  i128: "1000000000",
                },
              },
            },
          },
        ],
        [
          {
            ext: "v0",
            contract_id:
              "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC",
            type_: "contract",
            body: {
              v0: {
                topics: [
                  {
                    symbol: "transfer",
                  },
                  {
                    address:
                      "GAZS54SYTI63HDRLI53CALG6VZLEZHBCMSJVMEOXJNTM46GM2E3MWJOH",
                  },
                  {
                    address:
                      "BAAG6WV7LERLAJCFFMBKBQY7G2HQN2FTD34GJKNOFJACUMIJ37OJTTHZR4",
                  },
                  {
                    string: "native",
                  },
                ],
                data: {
                  i128: "20000000",
                },
              },
            },
          },
        ],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
      ],
    },
    ledger: 640697,
    createdAt: "1769198959",
  },
};

// Operations array with string-body operation
export const TX_CLASSIC_OPS_WITH_STRING_BODY = {
  jsonrpc: "2.0",
  id: 1,
  result: {
    latestLedger: 712708,
    latestLedgerCloseTime: "1769559389",
    oldestLedger: 591749,
    oldestLedgerCloseTime: "1768953938",
    status: "SUCCESS",
    txHash: "d479e586cf9863ba3c95203112bcd4c28ca252ddd2b17b244f54f909347cbc7c",
    applicationOrder: 2,
    feeBump: false,
    envelopeJson: {
      tx: {
        tx: {
          source_account:
            "GDEBQGABZ3A5PBXWIMGU3OKGAS6DIJUSCVUHKXK46DJBQ35S5HNDRWYB",
          fee: 300,
          seq_num: "2754246562807848",
          cond: {
            time: {
              min_time: "0",
              max_time: "1769220195",
            },
          },
          memo: "none",
          operations: [
            {
              source_account:
                "GDEBQGABZ3A5PBXWIMGU3OKGAS6DIJUSCVUHKXK46DJBQ35S5HNDRWYB",
              body: {
                begin_sponsoring_future_reserves: {
                  sponsored_id:
                    "GAEM6BOWT5B67EIEMNDJPCEOFD665TFED6XKXN3POO6KLG7ABUGWM7SD",
                },
              },
            },
            {
              source_account: null,
              body: {
                create_account: {
                  destination:
                    "GAEM6BOWT5B67EIEMNDJPCEOFD665TFED6XKXN3POO6KLG7ABUGWM7SD",
                  starting_balance: "0",
                },
              },
            },
            {
              source_account:
                "GAEM6BOWT5B67EIEMNDJPCEOFD665TFED6XKXN3POO6KLG7ABUGWM7SD",
              body: "end_sponsoring_future_reserves",
            },
          ],
          ext: "v0",
        },
        signatures: [
          {
            hint: "b2e9da38",
            signature:
              "e1ff673fbc33d248135373709bc87a379c278aeb0acc235c09b1704bffa090bf6a9b989bff73fc0a39d68fcd733dc08f63cb5697f326c9dccaae74f156e7c309",
          },
          {
            hint: "e00d0d66",
            signature:
              "ae72b05bbfe05a33b1a98ffbc3ae8180f5f202a86fa31e6f3cce29d6c7478dc9ac049e44291378a1840452c3dd8e264cdcd2736960a69630e31c24337dc1c00e",
          },
        ],
      },
    },
    resultJson: {
      fee_charged: "300",
      result: {
        tx_success: [
          {
            op_inner: {
              begin_sponsoring_future_reserves: "success",
            },
          },
          {
            op_inner: {
              create_account: "success",
            },
          },
          {
            op_inner: {
              end_sponsoring_future_reserves: "success",
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
              last_modified_ledger_seq: 641344,
              data: {
                account: {
                  account_id:
                    "GDEBQGABZ3A5PBXWIMGU3OKGAS6DIJUSCVUHKXK46DJBQ35S5HNDRWYB",
                  balance: "99859513847",
                  seq_num: "2754246562807847",
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
                          num_sponsoring: 20,
                          signer_sponsoring_i_ds: [],
                          ext: {
                            v3: {
                              ext: "v0",
                              seq_ledger: 641342,
                              seq_time: "1769202188",
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
              last_modified_ledger_seq: 641344,
              data: {
                account: {
                  account_id:
                    "GDEBQGABZ3A5PBXWIMGU3OKGAS6DIJUSCVUHKXK46DJBQ35S5HNDRWYB",
                  balance: "99859513847",
                  seq_num: "2754246562807848",
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
                          num_sponsoring: 20,
                          signer_sponsoring_i_ds: [],
                          ext: {
                            v3: {
                              ext: "v0",
                              seq_ledger: 641344,
                              seq_time: "1769202198",
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
            changes: [],
            events: [],
          },
          {
            ext: "v0",
            changes: [
              {
                state: {
                  last_modified_ledger_seq: 641344,
                  data: {
                    account: {
                      account_id:
                        "GDEBQGABZ3A5PBXWIMGU3OKGAS6DIJUSCVUHKXK46DJBQ35S5HNDRWYB",
                      balance: "99859513847",
                      seq_num: "2754246562807848",
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
                              num_sponsoring: 20,
                              signer_sponsoring_i_ds: [],
                              ext: {
                                v3: {
                                  ext: "v0",
                                  seq_ledger: 641344,
                                  seq_time: "1769202198",
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
                  last_modified_ledger_seq: 641344,
                  data: {
                    account: {
                      account_id:
                        "GDEBQGABZ3A5PBXWIMGU3OKGAS6DIJUSCVUHKXK46DJBQ35S5HNDRWYB",
                      balance: "99859513847",
                      seq_num: "2754246562807848",
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
                              num_sponsoring: 22,
                              signer_sponsoring_i_ds: [],
                              ext: {
                                v3: {
                                  ext: "v0",
                                  seq_ledger: 641344,
                                  seq_time: "1769202198",
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
                created: {
                  last_modified_ledger_seq: 641344,
                  data: {
                    account: {
                      account_id:
                        "GAEM6BOWT5B67EIEMNDJPCEOFD665TFED6XKXN3POO6KLG7ABUGWM7SD",
                      balance: "0",
                      seq_num: "2754551505485824",
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
                              num_sponsored: 2,
                              num_sponsoring: 0,
                              signer_sponsoring_i_ds: [],
                              ext: "v0",
                            },
                          },
                        },
                      },
                    },
                  },
                  ext: {
                    v1: {
                      sponsoring_id:
                        "GDEBQGABZ3A5PBXWIMGU3OKGAS6DIJUSCVUHKXK46DJBQ35S5HNDRWYB",
                      ext: "v0",
                    },
                  },
                },
              },
            ],
            events: [
              {
                ext: "v0",
                contract_id:
                  "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC",
                type_: "contract",
                body: {
                  v0: {
                    topics: [
                      {
                        symbol: "transfer",
                      },
                      {
                        address:
                          "GDEBQGABZ3A5PBXWIMGU3OKGAS6DIJUSCVUHKXK46DJBQ35S5HNDRWYB",
                      },
                      {
                        address:
                          "GAEM6BOWT5B67EIEMNDJPCEOFD665TFED6XKXN3POO6KLG7ABUGWM7SD",
                      },
                      {
                        string: "native",
                      },
                    ],
                    data: {
                      i128: "0",
                    },
                  },
                },
              },
            ],
          },
          {
            ext: "v0",
            changes: [],
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
                        "GDEBQGABZ3A5PBXWIMGU3OKGAS6DIJUSCVUHKXK46DJBQ35S5HNDRWYB",
                    },
                  ],
                  data: {
                    i128: "300",
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
                      "GDEBQGABZ3A5PBXWIMGU3OKGAS6DIJUSCVUHKXK46DJBQ35S5HNDRWYB",
                  },
                ],
                data: {
                  i128: "300",
                },
              },
            },
          },
        },
      ],
      contractEventsJson: [
        [],
        [
          {
            ext: "v0",
            contract_id:
              "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC",
            type_: "contract",
            body: {
              v0: {
                topics: [
                  {
                    symbol: "transfer",
                  },
                  {
                    address:
                      "GDEBQGABZ3A5PBXWIMGU3OKGAS6DIJUSCVUHKXK46DJBQ35S5HNDRWYB",
                  },
                  {
                    address:
                      "GAEM6BOWT5B67EIEMNDJPCEOFD665TFED6XKXN3POO6KLG7ABUGWM7SD",
                  },
                  {
                    string: "native",
                  },
                ],
                data: {
                  i128: "0",
                },
              },
            },
          },
        ],
        [],
      ],
    },
    ledger: 641344,
    createdAt: "1769202198",
  },
};
