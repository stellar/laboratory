import React from 'react';
import {AddressParameter} from './ParametersFormComponents/AddressParameter';

export default class TxBuilderAttributes extends React.Component {
  render() {
    return <div className="TransactionAttributes">
      <div className="TransactionOp__config TransactionOpConfig optionsTable">
        <AddressParameter param='address' />
        <AddressParameter param='address' />
        <AddressParameter param='address' />
      </div>
    </div>
  }
}
