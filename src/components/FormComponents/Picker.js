import React from 'react';

import PubKeyPicker from './PubKeyPicker';
import AmountPicker from './AmountPicker';
import AssetPicker from './AssetPicker';
import CursorPicker from './CursorPicker';
import LedgerPicker from './LedgerPicker';
import LimitPicker from './LimitPicker';
import OperationPicker from './OperationPicker';
import OrderPicker from './OrderPicker';
import TransactionPicker from './TransactionPicker';

/**
Required props:
  onUpdate

Optional props:
  forceError
  forceDirty
  key

**/
export default function(type, props) {
  if (!('key' in props)) {
    props.key = type;
  }
  props.type = type;
  switch (type) {
    case 'pubkey':
    case 'account_id':
    case 'source_account':
    case 'destination_account':
      return <PubKeyPicker {...props} />;
    case 'asset':
    case 'buying_asset':
    case 'selling_asset':
    case 'destination_asset':
      return <AssetPicker {...props} />;
    case 'amount':
    case 'destination_amount':
      return <AmountPicker {...props} />;
    case 'cursor':
      return <CursorPicker {...props} />;
    case 'ledger':
      return <LedgerPicker {...props} />;
    case 'limit':
      return <LimitPicker {...props} />;
    case 'operation':
      return <OperationPicker {...props} />;
    case 'order':
      return <OrderPicker {...props} />;
    case 'transaction':
      return <TransactionPicker {...props} />;
    default:
      throw new Error(`Unknown type: ${type}`);
      return;
  }
}
