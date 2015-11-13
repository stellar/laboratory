import React from 'react';

import PubKeyParameter from '../FormComponents/PubKeyParameter';
import AmountParameter from '../FormComponents/AmountParameter';
import AssetCodeParameter from '../FormComponents/AssetCodeParameter';
import AssetTypeParameter from '../FormComponents/AssetTypeParameter';
import CursorParameter from '../FormComponents/CursorParameter';
import LedgerParameter from '../FormComponents/LedgerParameter';
import LimitParameter from '../FormComponents/LimitParameter';
import OperationParameter from '../FormComponents/OperationParameter';
import OrderParameter from '../FormComponents/OrderParameter';
import TransactionParameter from '../FormComponents/TransactionParameter';

export default function(type, props) {
  switch (type) {
    case 'address':
    case 'source_account':
    case 'destination_account':
    case 'selling_asset_issuer':
    case 'buying_asset_issuer':
    case 'destination_asset_issuer':
      return <PubKeyParameter {...props} />;
    case 'selling_asset_code':
    case 'buying_asset_code':
    case 'destination_asset_code':
      return <AssetCodeParameter {...props} />;
    case 'selling_asset_type':
    case 'buying_asset_type':
    case 'destination_asset_type':
      return <AssetTypeParameter {...props} />;
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
      throw new Error(`Invalid param: ${type}`);
      return;
  }
}
