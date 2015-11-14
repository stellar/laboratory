import React from 'react';

import PubKeyParameter from './PubKeyParameter';
import AmountParameter from './AmountParameter';
import AssetParameter from './AssetParameter';
import CursorParameter from './CursorParameter';
import LedgerParameter from './LedgerParameter';
import LimitParameter from './LimitParameter';
import OperationParameter from './OperationParameter';
import OrderParameter from './OrderParameter';
import TransactionParameter from './TransactionParameter';

export default function(type, props) {
  switch (type) {
    case 'pubkey':
    case 'account_id':
    case 'source_account':
    case 'destination_account':
      return <PubKeyParameter {...props} />;
    case 'asset':
    case 'buying_asset':
    case 'selling_asset':
    case 'destination_asset':
      return <AssetParameter {...props} />;
    case 'amount':
    case 'destination_amount':
      return <AmountParameter {...props} />;
    case 'cursor':
      return <CursorParameter {...props} />;
    case 'ledger':
      return <LedgerParameter {...props} />;
    case 'limit':
      return <LimitParameter {...props} />;
    case 'operation':
      return <OperationParameter {...props} />;
    case 'order':
      return <OrderParameter {...props} />;
    case 'transaction':
      return <TransactionParameter {...props} />;
    default:
      throw new Error(`Unknown label: ${type}`);
      return;
  }
}
