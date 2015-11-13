import React from 'react';
import {PubKeyParameter} from './FormComponents/PubKeyParameter';

export default class TxBuilderAttributes extends React.Component {
  render() {
    return <div className="TransactionAttributes">
      <div className="TransactionOp__config TransactionOpConfig optionsTable">
        <PubKeyParameter param='source_account' />
      </div>
    </div>
  }
}
