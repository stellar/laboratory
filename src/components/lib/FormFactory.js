import React from 'react';

import PubKeyParameter from '../FormComponents/PubKeyParameter';
import AmountParameter from '../FormComponents/AmountParameter';
import AssetParameter from '../FormComponents/AssetParameter';
import CursorParameter from '../FormComponents/CursorParameter';
import LedgerParameter from '../FormComponents/LedgerParameter';
import LimitParameter from '../FormComponents/LimitParameter';
import OperationParameter from '../FormComponents/OperationParameter';
import OrderParameter from '../FormComponents/OrderParameter';
import TransactionParameter from '../FormComponents/TransactionParameter';

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
