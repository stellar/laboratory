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
      'all': {
        'label': 'All Accounts',
        'path': {
          template: '/accounts{?cursor,limit,order}',
        },
        'params': [
          {
            id: 'cursor',
            type: 'Cursor',
            label: 'Cursor',
          },
          {
            id: 'limit',
            type: 'Limit',
            label: 'Limit',
          },
          {
            id: 'order',
            type: 'Order',
            label: 'Order',
          },
        ],
      },
      'single': {
        'label': 'Single Account',
        'path': {
          template: '/accounts/{account_id}',
        },
        'params': [
          {
            id: 'account_id',
            type: 'PubKey',
            label: 'Account ID',
            required: true,
          },
        ],
      }
    }
  },
  'effects': {
    'label': 'Effects',
    'endpoints': {
      'all': {
        'label': 'All Effects',
        'path': {
          template: '/effects{?cursor,limit,order}',
        },
        'params': [
          {
            id: 'cursor',
            type: 'Cursor',
            label: 'Cursor',
          },
          {
            id: 'limit',
            type: 'Limit',
            label: 'Limit',
          },
          {
            id: 'order',
            type: 'Order',
            label: 'Order',
          },
        ],
      },
      'for_account': {
        'label': 'Effects for Account',
        'path': {
          template: '/accounts/{account_id}/effects{?cursor,limit,order}',
        },
        'params': [
          {
            id: 'account_id',
            type: 'PubKey',
            label: 'Account ID',
            required: true,
          },
          {
            id: 'cursor',
            type: 'Cursor',
            label: 'Cursor',
          },
          {
            id: 'limit',
            type: 'Limit',
            label: 'Limit',
          },
          {
            id: 'order',
            type: 'Order',
            label: 'Order',
          },
        ],
      },
      'for_ledger': {
        'label': 'Effects for Ledger',
        'path': {
          template: '/ledger/{ledger}/effects{?cursor,limit,order}',
        },
        'params': [
          {
            id: 'ledger',
            type: 'Ledger',
            label: 'Ledger',
            required: true,
          },
          {
            id: 'cursor',
            type: 'Cursor',
            label: 'Cursor',
          },
          {
            id: 'limit',
            type: 'Limit',
            label: 'Limit',
          },
          {
            id: 'order',
            type: 'Order',
            label: 'Order',
          },
        ],
      },
      'for_operation': {
        'label': 'Effects for Operation',
        'path': {
          template: '/operation/{operation}/effects{?cursor,limit,order}',
        },
        'params': [
          {
            id: 'operation',
            type: 'Operation',
            label: 'Operation',
            required: true,
          },
          {
            id: 'cursor',
            type: 'Cursor',
            label: 'Cursor',
          },
          {
            id: 'limit',
            type: 'Limit',
            label: 'Limit',
          },
          {
            id: 'order',
            type: 'Order',
            label: 'Order',
          },
        ],
      },
      'for_transaction': {
        'label': 'Effects for Transaction',
        'path': {
          template: '/transactions/{transaction}/effects',
        },
        'params': [
          {
            id: 'transaction',
            type: 'Transaction',
            label: 'Transaction',
            required: true,
          },
          {
            id: 'cursor',
            type: 'Cursor',
            label: 'Cursor',
          },
          {
            id: 'limit',
            type: 'Limit',
            label: 'Limit',
          },
          {
            id: 'order',
            type: 'Order',
            label: 'Order',
          },
        ],
        'required': ['transaction']
      }
    }
  },
  'ledgers': {
    'label': 'Ledger',
    'endpoints': {
      'all': {
        'label': 'All Ledgers',
        'path': {
          template: '/ledgers{?cursor,limit,order}',
        },
        'params': [
          {
            id: 'cursor',
            type: 'Cursor',
            label: 'Cursor',
          },
          {
            id: 'limit',
            type: 'Limit',
            label: 'Limit',
          },
          {
            id: 'order',
            type: 'Order',
            label: 'Order',
          },
        ],
      },
      'single': {
        'label': 'Single Ledger',
        'path': {
          template: '/ledgers/{ledger}',
        },
        'params': [
          {
            id: 'ledger',
            type: 'Ledger',
            label: 'Ledger',
            required: true,
          },
        ],
      }
    }
  },
  'offers': {
    'label': 'Offers',
    'endpoints': {
      'for_account': {
        'label': 'Offers for Account',
        'path': {
          template: '/accounts/{account_id}/offers{?cursor,limit,order}',
        },
        'params': [
          {
            id: 'account_id',
            type: 'PubKey',
            label: 'Account ID',
            required: true,
          },
          {
            id: 'cursor',
            type: 'Cursor',
            label: 'Cursor',
          },
          {
            id: 'limit',
            type: 'Limit',
            label: 'Limit',
          },
          {
            id: 'order',
            type: 'Order',
            label: 'Order',
          },
        ],
      }
    }
  },
  'operations': {
    'label': 'Operations',
    'endpoints': {
      'all': {
        'label': 'All Operations',
        'path': {
          template: '/operations{?cursor,limit,order}',
        },
        'params': [
          {
            id: 'cursor',
            type: 'Cursor',
            label: 'Cursor',
          },
          {
            id: 'limit',
            type: 'Limit',
            label: 'Limit',
          },
          {
            id: 'order',
            type: 'Order',
            label: 'Order',
          },
        ],
      },
      'single': {
        'label': 'Single Operation',
        'path': {
          template: '/operations/{operation}',
        },
        'params': [
          {
            id: 'operation',
            type: 'Operation',
            label: 'Operation ID',
            required: true,
          },
        ],
        'required': ['operation']
      },
      'for_account': {
        'label': 'Operations for Account',
        'path': {
          template: '/accounts/{account_id}/operations{?cursor,limit,order}',
        },
        'params': [
          {
            id: 'account_id',
            type: 'PubKey',
            label: 'Account ID',
            required: true,
          },
          {
            id: 'cursor',
            type: 'Cursor',
            label: 'Cursor',
          },
          {
            id: 'limit',
            type: 'Limit',
            label: 'Limit',
          },
          {
            id: 'order',
            type: 'Order',
            label: 'Order',
          },
        ],
      },
      'for_ledger': {
        'label': 'Operations for Ledger',
        'path': {
          template: '/ledgers/{ledger}/operations{?cursor,limit,order}',
        },
        'params': [
          {
            id: 'ledger',
            type: 'Ledger',
            label: 'Ledger Sequence',
            required: true,
          },
          {
            id: 'cursor',
            type: 'Cursor',
            label: 'Cursor',
          },
          {
            id: 'limit',
            type: 'Limit',
            label: 'Limit',
          },
          {
            id: 'order',
            type: 'Order',
            label: 'Order',
          },
        ],
      },
      'for_transaction': {
        'label': 'Operations for Transaction',
        'path': {
          template: '/transactions/{transaction}/operations{?cursor,limit,order}',
        },
        'params': [
          {
            id: 'transaction',
            type: 'Transaction',
            label: 'Transaction ID',
            required: true,
          },
          {
            id: 'cursor',
            type: 'Cursor',
            label: 'Cursor',
          },
          {
            id: 'limit',
            type: 'Limit',
            label: 'Limit',
          },
          {
            id: 'order',
            type: 'Order',
            label: 'Order',
          },
        ],
      }
    }
  },
  'order_book': {
    'label': 'Order Book',
    'endpoints': {
      'details': {
        'label': 'Details',
        'path': {
          template: '/order_book{?selling_asset_type,selling_asset_code,selling_issuer,buying_asset_type,buying_asset_code,buying_issuer}',
        },
        'params': [
          {
            id: 'selling_asset',
            type: 'asset',
            label: 'Selling Asset',
          },
          {
            id: 'buying_asset',
            type: 'asset',
            label: 'Buying Asset',
          },
        ],
      },
      'trades': {
        'label': 'Trades',
        'path': {
          template: '/order_book/trades{?selling_asset_type,selling_asset_code,selling_issuer,buying_asset_type,buying_asset_code,buying_issuer}',
        },
        'params': [
          {
            id: 'selling_asset',
            type: 'asset',
            label: 'Selling Asset',
          },
          {
            id: 'buying_asset',
            type: 'asset',
            label: 'Buying Asset',
          },
        ],
      }
    }
  },
  'paths': {
    'label': 'Paths',
    'endpoints': {
      'all': {
        'label': 'All Paths',
        'path': {
          template: '/{source_account}/paths{?destination_account,destination_asset_type}',
          'destination_asset_type': 'destination_asset.type',
          'destination_asset_code': 'destination_asset.code',
          'destination_asset_issuer': 'destination_asset.issuer',
        },
        'params': [
          {
            id: 'source_account',
            type: 'PubKey',
            label: 'Source Account',
            required: true,
          },
          {
            id: 'destination_account',
            type: 'PubKey',
            label: 'Destination Account',
            required: true,
          },
          {
            id: 'destination_asset',
            type: 'Asset',
            label: 'Destination Asset',
            required: true,
          },
          {
            id: 'destination_amount',
            type: 'PubKey',
            label: 'Destination Amount',
            required: true,
          },
        ],
        // 'params': ['source_account', 'destination_account', 'destination_amount', 'destination_asset'],
        // 'required': ['source_account', 'destination_account', 'destination_amount', 'destination_asset']
      }
    }
  },
  'payments': {
    'label': 'Payments',
    'endpoints': {
      'all': {
        'label': 'All Payments',
        'path': {
          template: '/payments{?cursor,limit,order}',
        },
        'params': [
          {
            id: 'cursor',
            type: 'Cursor',
            label: 'Cursor',
          },
          {
            id: 'limit',
            type: 'Limit',
            label: 'Limit',
          },
          {
            id: 'order',
            type: 'Order',
            label: 'Order',
          },
        ],
      },
      'for_account': {
        'label': 'Payments for Account',
        'path': {
          template: '/accounts/{address}/payments',
        },
        'params': ['account_id', 'limit', 'order', 'cursor'],
        'required': ['account_id']
      },
      'for_ledger': {
        'label': 'Payments for Ledger',
        'path': {
          template: '/ledgers/{ledger}/payments',
        },
        'params': ['ledger', 'limit', 'order', 'cursor'],
        'required': ['ledger']
      },
      'for_transaction': {
        'label': 'Payments for Transaction',
        'path': {
          template: '/transactions/{transaction}/payments',
        },
        'params': ['transaction', 'limit', 'order', 'cursor'],
        'required': ['transaction']
      }
    }
  },
  'transactions': {
    'label': 'Transactions',
    'endpoints': {
      'all': {
        'label': 'All Transactions',
        'path': {
          template: '/transactions{?cursor,limit,order}',
        },
        'params': [
          {
            id: 'cursor',
            type: 'Cursor',
            label: 'Cursor',
          },
          {
            id: 'limit',
            type: 'Limit',
            label: 'Limit',
          },
          {
            id: 'order',
            type: 'Order',
            label: 'Order',
          },
        ],
      },
      'single': {
        'label': 'Single Transaction',
        'path': {
          template: '/transactions/{transaction}',
        },
        'params': ['transaction'],
        'required': ['transaction']
      },
      'for_account': {
        'label': 'Transactions for Account',
        'path': {
          template: '/accounts/{address}/transactions',
        },
        'params': ['account_id', 'limit', 'order', 'cursor'],
        'required': ['account_id']
      },
      'for_ledger': {
        'label': 'Transactions for Ledger',
        'path': {
          template: '/ledgers/{ledger}/transactions',
        },
        'params': ['ledger', 'limit', 'order', 'cursor'],
        'required': ['ledger']
      }
    }
  }
};
