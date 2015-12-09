import React from 'react';
import Picker from './FormComponents/Picker';
import TxBuilderStore from '../stores/TxBuilderStore';
import {AppDispatcher} from '../dispatcher/AppDispatcher';
import TxBuilderConstants from '../constants/TxBuilderConstants';

export default class TxBuilderOperation extends React.Component {
  constructor() {
    super();
  }
  onUpdateHandler() {

  }
  removeOp() {
  }
  render() {
    return <div className="TransactionOp">
      <div className="TransactionOp__meta TransactionOpMeta">
        <div className="TransactionOpMeta__order">
          <input className="TransactionOpMeta__order__input" type="text" defaultValue={this.props.order} maxLength="2" />
        </div>
        <p className="TransactionOpMeta__remove"><a onClick={this.removeOp.bind(this)}>remove</a></p>
      </div>
      <div className="TransactionOp__config TransactionOpConfig optionsTable">
      </div>
    </div>
  }
}
