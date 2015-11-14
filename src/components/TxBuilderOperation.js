import React from 'react';
import Picker from './FormComponents/Picker';
import TxBuilderStore from '../stores/TxBuilderStore';
import {AppDispatcher} from '../dispatcher/AppDispatcher';
import TxBuilderConstants from '../constants/TxBuilderConstants';

export default class TxBuilderOperation extends React.Component {
  removeOp() {
    // console.log(this)
    // let opKey = this.props.op.key;
    // AppDispatcher.dispatch({
    //   type: TxBuilderConstants.REMOVE_OPERATION,
    //   key: opKey
    // });
  }
  render() {
    return <div className="TransactionOp">
      <div className="TransactionOp__meta TransactionOpMeta">
        <div className="TransactionOpMeta__order">
          <input className="TransactionOpMeta__order__input" type="text" defaultValue={this.props.order} maxLength="2" />
        </div>
        <p className="TransactionOpMeta__remove"><a onClick={this.removeOp}>remove</a></p>
      </div>
      <div className="TransactionOp__config TransactionOpConfig optionsTable">
        {Picker('pubkey', { onUpdate: this.onUpdateHandler})}
        {Picker('amount', { onUpdate: this.onUpdateHandler})}
      </div>
    </div>
  }
}
