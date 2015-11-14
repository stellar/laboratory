import React from 'react';
import {PubKeyPicker} from './FormComponents/PubKeyPicker';
import {AmountPicker} from './FormComponents/AmountPicker';

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
        <PubKeyPicker param='destination_account' />
        <AmountPicker param='destination_amount' />
      </div>
    </div>
  }
}
