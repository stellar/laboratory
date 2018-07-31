export function getEndpoint(resource, endpoint) {
  let res = endpointsMap[resource];
  if (!res) { return; }

  return res.endpoints[endpoint];
}

export function getTemplate(...args) {
  let ep = getEndpoint(...args)
  if (!ep) { return; }

  return ep.path;
}

export const endpointsMap = {
  'accounts': {
    'label': 'Accounts',
    'endpoints': {
      'single': {
        'label': 'Single Account',
        'helpUrl': 'https://www.stellar.org/developers/horizon/reference/accounts-single.html',
        'method': 'GET',
        'path': {
          template: '/accounts/{account_id}',
        },
        'setupComponent': require('../components/SetupPanes/SingleAccount'),
      }
    }
  },
  'assets': {
    'label': 'Assets',
    'endpoints': {
      'single': {
        'label': 'All Assets',
        'helpUrl': 'https://www.stellar.org/developers/horizon/reference/endpoints/assets-all.html',
        'method': 'GET',
        'path': {
          template: '/assets{?asset_code,asset_issuer,cursor,order,limit}',
        },
        'setupComponent': require('../components/SetupPanes/AllAssets'),
      }
    }
  },
  'effects': {
    'label': 'Effects',
    'endpoints': {
      'all': {
        'label': 'All Effects',
        'helpUrl': 'https://www.stellar.org/developers/horizon/reference/effects-all.html',
        'method': 'GET',
        'path': {
          template: '/effects{?cursor,limit,order}',
        },
        'setupComponent': require('../components/SetupPanes/All'),
      },
      'for_account': {
        'label': 'Effects for Account',
        'helpUrl': 'https://www.stellar.org/developers/horizon/reference/effects-for-account.html',
        'method': 'GET',
        'path': {
          template: '/accounts/{account_id}/effects{?cursor,limit,order}',
        },
        'setupComponent': require('../components/SetupPanes/ForAccount'),
      },
      'for_ledger': {
        'label': 'Effects for Ledger',
        'helpUrl': 'https://www.stellar.org/developers/horizon/reference/effects-for-ledger.html',
        'method': 'GET',
        'path': {
          template: '/ledgers/{ledger}/effects{?cursor,limit,order}',
        },
        'setupComponent': require('../components/SetupPanes/ForLedger'),
      },
      'for_operation': {
        'label': 'Effects for Operation',
        'helpUrl': 'https://www.stellar.org/developers/horizon/reference/effects-for-operation.html',
        'method': 'GET',
        'path': {
          template: '/operations/{operation}/effects{?cursor,limit,order}',
        },
        'setupComponent': require('../components/SetupPanes/ForOperation'),
      },
      'for_transaction': {
        'label': 'Effects for Transaction',
        'helpUrl': 'https://www.stellar.org/developers/horizon/reference/effects-for-transaction.html',
        'method': 'GET',
        'path': {
          template: '/transactions/{transaction}/effects{?cursor,limit,order}',
        },
        'setupComponent': require('../components/SetupPanes/ForTransaction'),
      }
    }
  },
  'ledgers': {
    'label': 'Ledger',
    'endpoints': {
      'all': {
        'label': 'All Ledgers',
        'helpUrl': 'https://www.stellar.org/developers/horizon/reference/ledgers-all.html',
        'method': 'GET',
        'path': {
          template: '/ledgers{?cursor,limit,order}',
        },
        'setupComponent': require('../components/SetupPanes/All'),
      },
      'single': {
        'label': 'Single Ledger',
        'helpUrl': 'https://www.stellar.org/developers/horizon/reference/ledgers-single.html',
        'method': 'GET',
        'path': {
          template: '/ledgers/{ledger}',
        },
        'setupComponent': require('../components/SetupPanes/SingleLedger'),
      }
    }
  },
  'offers': {
    'label': 'Offers',
    'endpoints': {
      'for_account': {
        'label': 'Offers for Account',
        'helpUrl': 'https://www.stellar.org/developers/horizon/reference/offers-for-account.html',
        'method': 'GET',
        'path': {
          template: '/accounts/{account_id}/offers{?cursor,limit,order}',
        },
        'setupComponent': require('../components/SetupPanes/ForAccount'),
      }
    }
  },
  'operations': {
    'label': 'Operations',
    'endpoints': {
      'all': {
        'label': 'All Operations',
        'helpUrl': 'https://www.stellar.org/developers/horizon/reference/operations-all.html',
        'method': 'GET',
        'path': {
          template: '/operations{?cursor,limit,order}',
        },
        'setupComponent': require('../components/SetupPanes/All'),
      },
      'single': {
        'label': 'Single Operation',
        'helpUrl': 'https://www.stellar.org/developers/horizon/reference/operations-single.html',
        'method': 'GET',
        'path': {
          template: '/operations/{operation}',
        },
        'setupComponent': require('../components/SetupPanes/SingleOperation'),
      },
      'for_account': {
        'label': 'Operations for Account',
        'helpUrl': 'https://www.stellar.org/developers/horizon/reference/operations-for-account.html',
        'method': 'GET',
        'path': {
          template: '/accounts/{account_id}/operations{?cursor,limit,order}',
        },
        'setupComponent': require('../components/SetupPanes/ForAccount'),
      },
      'for_ledger': {
        'label': 'Operations for Ledger',
        'helpUrl': 'https://www.stellar.org/developers/horizon/reference/operations-for-ledger.html',
        'method': 'GET',
        'path': {
          template: '/ledgers/{ledger}/operations{?cursor,limit,order}',
        },
        'setupComponent': require('../components/SetupPanes/ForLedger'),
      },
      'for_transaction': {
        'label': 'Operations for Transaction',
        'helpUrl': 'https://www.stellar.org/developers/horizon/reference/operations-for-transaction.html',
        'method': 'GET',
        'path': {
          template: '/transactions/{transaction}/operations{?cursor,limit,order}',
        },
        'setupComponent': require('../components/SetupPanes/ForTransaction'),
      }
    }
  },
  'order_book': {
    'label': 'Order Book',
    'endpoints': {
      'details': {
        'label': 'Details',
        'helpUrl': 'https://www.stellar.org/developers/horizon/reference/orderbook-details.html',
        'method': 'GET',
        'path': {
          template: '/order_book{?selling_asset_type,selling_asset_code,selling_asset_issuer,buying_asset_type,buying_asset_code,buying_asset_issuer}',
          'selling_asset_type': 'selling_asset.type',
          'selling_asset_code': 'selling_asset.code',
          'selling_asset_issuer': 'selling_asset.issuer',
          'buying_asset_type': 'buying_asset.type',
          'buying_asset_code': 'buying_asset.code',
          'buying_asset_issuer': 'buying_asset.issuer',
        },
        'setupComponent': require('../components/SetupPanes/OrderBookDetails'),
      }
    }
  },
  'paths': {
    'label': 'Paths',
    'endpoints': {
      'all': {
        'label': 'Find Payment Paths',
        'helpUrl': 'https://www.stellar.org/developers/horizon/reference/path-finding.html',
        'method': 'GET',
        'path': {
          template: '/paths{?source_account,destination_account,destination_asset_type,destination_asset_code,destination_asset_issuer,destination_amount}',
          'destination_asset_type': 'destination_asset.type',
          'destination_asset_code': 'destination_asset.code',
          'destination_asset_issuer': 'destination_asset.issuer',
        },
        'setupComponent': require('../components/SetupPanes/FindPaymentPaths'),
      }
    }
  },
  'payments': {
    'label': 'Payments',
    'endpoints': {
      'all': {
        'label': 'All Payments',
        'helpUrl': 'https://www.stellar.org/developers/horizon/reference/payments-all.html',
        'method': 'GET',
        'path': {
          template: '/payments{?cursor,limit,order}',
        },
        'setupComponent': require('../components/SetupPanes/All'),
      },
      'for_account': {
        'label': 'Payments for Account',
        'helpUrl': 'https://www.stellar.org/developers/horizon/reference/payments-for-account.html',
        'method': 'GET',
        'path': {
          template: '/accounts/{account_id}/payments{?cursor,limit,order}',
        },
        'setupComponent': require('../components/SetupPanes/ForAccount'),
      },
      'for_ledger': {
        'label': 'Payments for Ledger',
        'helpUrl': 'https://www.stellar.org/developers/horizon/reference/payments-for-ledger.html',
        'method': 'GET',
        'path': {
          template: '/ledgers/{ledger}/payments{?cursor,limit,order}',
        },
        'setupComponent': require('../components/SetupPanes/ForLedger'),
      },
      'for_transaction': {
        'label': 'Payments for Transaction',
        'helpUrl': 'https://www.stellar.org/developers/horizon/reference/payments-for-transaction.html',
        'method': 'GET',
        'path': {
          template: '/transactions/{transaction}/payments{?cursor,limit,order}',
        },
        'setupComponent': require('../components/SetupPanes/ForTransaction'),
      }
    }
  },
  'trade_aggregations': {
    'label': 'Trade Aggregations',
    'endpoints': {
      'all': {
        'label': 'Trade Aggregations',
        'helpUrl': 'https://www.stellar.org/developers/horizon/reference/endpoints/trade_aggregations.html',
        'method': 'GET',
        'path': {
          template: '/trade_aggregations{?base_asset_type,base_asset_code,base_asset_issuer,counter_asset_type,counter_asset_code,counter_asset_issuer,start_time,end_time,resolution,limit,order}',
          'base_asset_type': 'base_asset.type',
          'base_asset_code': 'base_asset.code',
          'base_asset_issuer': 'base_asset.issuer',
          'counter_asset_type': 'counter_asset.type',
          'counter_asset_code': 'counter_asset.code',
          'counter_asset_issuer': 'counter_asset.issuer',
          'start_time': 'start_time',
          'end_time': 'end_time',
          'resolution': 'resolution'
        },
        'setupComponent': require('../components/SetupPanes/TradeAggregations'),
      },
    }
  },
  'trades': {
    'label': 'Trades',
    'endpoints': {
      'all': {
        'label': 'All Trades',
        'helpUrl': 'https://www.stellar.org/developers/horizon/reference/endpoints/trades.html',
        'method': 'GET',
        'path': {
          template: '/trades{?base_asset_type,base_asset_code,base_asset_issuer,counter_asset_type,counter_asset_code,counter_asset_issuer,offer_id,cursor,limit,order}',
          'base_asset_type': 'base_asset.type',
          'base_asset_code': 'base_asset.code',
          'base_asset_issuer': 'base_asset.issuer',
          'counter_asset_type': 'counter_asset.type',
          'counter_asset_code': 'counter_asset.code',
          'counter_asset_issuer': 'counter_asset.issuer',
          'offer_id': 'offer_id'
        },
        'setupComponent': require('../components/SetupPanes/Trades'),
      },
      'for_account': {
        'label': 'Trades for Account',
        'helpUrl': 'https://www.stellar.org/developers/horizon/reference/trades-for-account.html',
        'method': 'GET',
        'path': {
          template: '/accounts/{account_id}/trades{?cursor,limit,order}',
        },
        'setupComponent': require('../components/SetupPanes/ForAccount'),
      },
      'for_offer': {
        'label': 'Trades for Offer',
        'helpUrl': 'https://www.stellar.org/developers/horizon/reference/trades-for-offer.html',
        'method': 'GET',
        'path': {
          template: '/offers/{offer_id}/trades{?cursor,limit,order}',
        },
        'setupComponent': require('../components/SetupPanes/ForOffer'),
      },
    }
  },
  'transactions': {
    'label': 'Transactions',
    'endpoints': {
      'all': {
        'label': 'All Transactions',
        'helpUrl': 'https://www.stellar.org/developers/horizon/reference/transactions-all.html',
        'method': 'GET',
        'path': {
          template: '/transactions{?cursor,limit,order}',
        },
        'setupComponent': require('../components/SetupPanes/All'),
      },
      'single': {
        'label': 'Single Transaction',
        'helpUrl': 'https://www.stellar.org/developers/horizon/reference/transactions-single.html',
        'method': 'GET',
        'path': {
          template: '/transactions/{transaction}',
        },
        'setupComponent': require('../components/SetupPanes/SingleTransaction'),
      },
      'create': {
        'label': 'Post Transaction',
        'helpUrl': 'https://www.stellar.org/developers/horizon/reference/transactions-create.html',
        'method': 'POST',
        'disableStreaming': true,
        'path': {
          template: '/transactions',
        },
        'setupComponent': require('../components/SetupPanes/PostTransaction'),
      },
      'for_account': {
        'label': 'Transactions for Account',
        'helpUrl': 'https://www.stellar.org/developers/horizon/reference/transactions-for-account.html',
        'method': 'GET',
        'path': {
          template: '/accounts/{account_id}/transactions{?cursor,limit,order}',
        },
        'setupComponent': require('../components/SetupPanes/ForAccount'),
      },
      'for_ledger': {
        'label': 'Transactions for Ledger',
        'helpUrl': 'https://www.stellar.org/developers/horizon/reference/transactions-for-ledger.html',
        'method': 'GET',
        'path': {
          template: '/ledgers/{ledger}/transactions{?cursor,limit,order}',
        },
        'setupComponent': require('../components/SetupPanes/ForLedger'),
      }
    }
  }
};
