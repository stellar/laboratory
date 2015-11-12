import React from 'react';
import {AddressParameter} from './FormComponents/AddressParameter';

export default class TxBuilderAttributes extends React.Component {
  render() {
    return <div className="TransactionAttributes">
      <div className="TransactionOp__config TransactionOpConfig optionsTable">
        <AddressParameter param='source_account' />
      </div>
    </div>
  }
}
