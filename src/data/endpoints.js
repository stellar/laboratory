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
        'method': 'GET',
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
        'method': 'GET',
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
        'method': 'GET',
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
        'method': 'GET',
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
        'method': 'GET',
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
        'method': 'GET',
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
        'method': 'GET',
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
      }
    }
  },
  'ledgers': {
    'label': 'Ledger',
    'endpoints': {
      'all': {
        'label': 'All Ledgers',
        'method': 'GET',
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
        'method': 'GET',
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
        'method': 'GET',
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
        'method': 'GET',
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
        'method': 'GET',
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
      },
      'for_account': {
        'label': 'Operations for Account',
        'method': 'GET',
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
        'method': 'GET',
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
        'method': 'GET',
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
        'params': [
          {
            id: 'selling_asset',
            type: 'Asset',
            label: 'Selling Asset',
          },
          {
            id: 'buying_asset',
            type: 'Asset',
            label: 'Buying Asset',
          },
        ],
      },
      'trades': {
        'label': 'Trades',
        'method': 'GET',
        'path': {
          template: '/order_book/trades{?selling_asset_type,selling_asset_code,selling_asset_issuer,buying_asset_type,buying_asset_code,buying_asset_issuer,cursor,limit,order}',
          'selling_asset_type': 'selling_asset.type',
          'selling_asset_code': 'selling_asset.code',
          'selling_asset_issuer': 'selling_asset.issuer',
          'buying_asset_type': 'buying_asset.type',
          'buying_asset_code': 'buying_asset.code',
          'buying_asset_issuer': 'buying_asset.issuer',
        },
        'params': [
          {
            id: 'selling_asset',
            type: 'Asset',
            label: 'Selling Asset',
          },
          {
            id: 'buying_asset',
            type: 'Asset',
            label: 'Buying Asset',
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
  'paths': {
    'label': 'Paths',
    'endpoints': {
      'all': {
        'label': 'All Paths',
        'method': 'GET',
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
      }
    }
  },
  'payments': {
    'label': 'Payments',
    'endpoints': {
      'all': {
        'label': 'All Payments',
        'method': 'GET',
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
        'method': 'GET',
        'path': {
          template: '/accounts/{account_id}/payments{?cursor,limit,order}',
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
        'label': 'Payments for Ledger',
        'method': 'GET',
        'path': {
          template: '/ledgers/{ledger}/payments{?cursor,limit,order}',
        },
        'params': [
          {
            id: 'ledger',
            type: 'PubKey',
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
        'label': 'Payments for Transaction',
        'method': 'GET',
        'path': {
          template: '/transactions/{transaction}/payments{?cursor,limit,order}',
        },
        'params': [
          {
            id: 'transaction',
            type: 'PubKey',
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
  'transactions': {
    'label': 'Transactions',
    'endpoints': {
      'all': {
        'label': 'All Transactions',
        'method': 'GET',
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
        'method': 'GET',
        'path': {
          template: '/transactions/{transaction}',
        },
        'params': [
          {
            id: 'transaction',
            type: 'PubKey',
            label: 'Transaction ID',
            required: true,
          },
        ],
      },
      'create': {
        'label': 'Post Transaction',
        'method': 'POST',
        'path': {
          template: '/transactions',
        },
        'params': [
          {
            id: 'tx',
            type: 'Xdr',
            label: 'Transaction Envelope XDR',
            required: true,
          },
        ],
      },
      'for_account': {
        'label': 'Transactions for Account',
        'method': 'GET',
        'path': {
          template: '/accounts/{account_id}/transactions{?cursor,limit,order}',
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
        'label': 'Transactions for Ledger',
        'method': 'GET',
        'path': {
          template: '/ledgers/{ledger}/transactions{?cursor,limit,order}',
        },
        'params': [
          {
            id: 'ledger',
            type: 'PubKey',
            label: 'Ledger ID',
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
  }
};
