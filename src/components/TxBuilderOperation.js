import React from 'react';
import {PubKeyParameter} from './FormComponents/PubKeyParameter';
import {AmountParameter} from './FormComponents/AmountParameter';

export default class TxBuilderOperation extends React.Component {
  render() {
    return <div className="TransactionOp">
      <div className="TransactionOp__meta TransactionOpMeta">
        <div className="TransactionOpMeta__order">
          <input className="TransactionOpMeta__order__input" type="text" defaultValue={this.props.order} maxLength="2" />
        </div>
        <p className="TransactionOpMeta__remove"><a href="">remove</a></p>
      </div>
      <div className="TransactionOp__config TransactionOpConfig optionsTable">
        <PubKeyParameter param='destination_account' />
        <AmountParameter param='destination_amount' />
      </div>
    </div>
  }
}
