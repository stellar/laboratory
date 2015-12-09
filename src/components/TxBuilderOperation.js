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
  render() {
    let removeLink = (this.props.removable) ?
      ''
      :
      <p className="TransactionOpMeta__remove"><a onClick={this.props.onRemove}>remove</a></p>;

    return <div className="TransactionOp">
      <div className="TransactionOp__meta TransactionOpMeta">
        <div className="TransactionOpMeta__order">
          <input className="TransactionOpMeta__order__input" type="text" value={this.props.order} maxLength="2" />
        </div>
        {removeLink}
      </div>
      <div className="TransactionOp__config TransactionOpConfig optionsTable">
      </div>
    </div>
  }
}
