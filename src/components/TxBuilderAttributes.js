import React from 'react';
import {PubKeyPicker} from './FormComponents/PubKeyPicker';

export default class TxBuilderAttributes extends React.Component {
  render() {
    return <div className="TransactionAttributes">
      <div className="TransactionOp__config TransactionOpConfig optionsTable">
        <PubKeyPicker param='source_account' />
      </div>
    </div>
  }
}
